module('add/remove/toggle class');


function bareObj( value ) {
	return value;
}

function functionReturningObj( value ) {
	return function() {
		return value;
	};
}

var testAddClass = function( valueObj ) {
	expect( 9 );

	var pass, j, i,
		div = jQuery("#qunit-fixture div");
	div.addClass( valueObj("test") );
	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( !~div.get( i ).className.indexOf("test") ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );

	// using contents will get regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	j.addClass( valueObj("asdf") );
	ok( j.hasClass("asdf"), "Check node,textnode,comment for addClass" );

	div = jQuery("<div/>");

	div.addClass( valueObj("test") );
	equal( div.attr("class"), "test", "Make sure there's no extra whitespace." );

	div.attr( "class", " foo" );
	div.addClass( valueObj("test") );
	equal( div.attr("class"), "foo test", "Make sure there's no extra whitespace." );

	div.attr( "class", "foo" );
	div.addClass( valueObj("bar baz") );
	equal( div.attr("class"), "foo bar baz", "Make sure there isn't too much trimming." );

	div.removeClass();
	div.addClass( valueObj("foo") ).addClass( valueObj("foo") );
	equal( div.attr("class"), "foo", "Do not add the same class twice in separate calls." );

	div.addClass( valueObj("fo") );
	equal( div.attr("class"), "foo fo", "Adding a similar class does not get interrupted." );
	div.removeClass().addClass("wrap2");
	ok( div.addClass("wrap").hasClass("wrap"), "Can add similarly named classes");

	div.removeClass();
	div.addClass( valueObj("bar bar") );
	equal( div.attr("class"), "bar", "Do not add the same class twice in the same call." );
};

test( "addClass(String)", function() {
	testAddClass( bareObj );
});

test( "addClass(Function)", function() {
	testAddClass( functionReturningObj );
});

test( "addClass(Function) with incoming value", function() {
	expect( 52 );
	var pass, i,
		div = jQuery("#qunit-fixture div"),
		old = div.map(function() {
			return jQuery(this).attr("class") || "";
		});

	div.addClass(function( i, val ) {
		if ( this.id !== "_firebugConsole" ) {
			equal( val, old[ i ], "Make sure the incoming value is correct." );
			return "test";
		}
	});

	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( div.get(i).className.indexOf("test") === -1 ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );
});

var testRemoveClass = function(valueObj) {
	expect( 8 );

	var $set = jQuery("#qunit-fixture div"),
		div = document.createElement("div");

	$set.addClass("test").removeClass( valueObj("test") );

	ok( !$set.is(".test"), "Remove Class" );

	$set.addClass("test").addClass("foo").addClass("bar");
	$set.removeClass( valueObj("test") ).removeClass( valueObj("bar") ).removeClass( valueObj("foo") );

	ok( !$set.is(".test,.bar,.foo"), "Remove multiple classes" );

	// Make sure that a null value doesn't cause problems
	$set.eq( 0 ).addClass("expected").removeClass( valueObj( null ) );
	ok( $set.eq( 0 ).is(".expected"), "Null value passed to removeClass" );

	$set.eq( 0 ).addClass("expected").removeClass( valueObj("") );
	ok( $set.eq( 0 ).is(".expected"), "Empty string passed to removeClass" );

	// using contents will get regular, text, and comment nodes
	$set = jQuery("#nonnodes").contents();
	$set.removeClass( valueObj("asdf") );
	ok( !$set.hasClass("asdf"), "Check node,textnode,comment for removeClass" );


	jQuery( div ).removeClass( valueObj("foo") );
	strictEqual( jQuery( div ).attr("class"), undefined, "removeClass doesn't create a class attribute" );

	div.className = " test foo ";

	jQuery( div ).removeClass( valueObj("foo") );
	equal( div.className, "test", "Make sure remaining className is trimmed." );

	div.className = " test ";

	jQuery( div ).removeClass( valueObj("test") );
	equal( div.className, "", "Make sure there is nothing left after everything is removed." );
};

test( "removeClass(String) - simple", function() {
	testRemoveClass( bareObj );
});

test( "removeClass(Function) - simple", function() {
	testRemoveClass( functionReturningObj );
});

test( "removeClass(Function) with incoming value", function() {
	expect( 52 );

	var $divs = jQuery("#qunit-fixture div").addClass("test"), old = $divs.map(function() {
		return jQuery( this ).attr("class");
	});

	$divs.removeClass(function( i, val ) {
		if ( this.id !== "_firebugConsole" ) {
			equal( val, old[ i ], "Make sure the incoming value is correct." );
			return "test";
		}
	});

	ok( !$divs.is(".test"), "Remove Class" );
});

test( "removeClass() removes duplicates", function() {
	expect( 1 );

	var $div = jQuery("<div class='x x x'></div>");

	$div.removeClass("x");

	ok( !$div.hasClass("x"), "Element with multiple same classes does not escape the wrath of removeClass()" );
});

test("removeClass(undefined) is a no-op", function() {
	expect( 1 );

	var $div = jQuery("<div class='base second'></div>");
	$div.removeClass( undefined );

	ok( $div.hasClass("base") && $div.hasClass("second"), "Element still has classes after removeClass(undefined)" );
});

var testToggleClass = function(valueObj) {
	expect( 17 );

	var e = jQuery("#firstp");
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass( valueObj("test") );
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass( valueObj("test") );
	ok( !e.is(".test"), "Assert class not present" );

	// class name with a boolean
	e.toggleClass( valueObj("test"), false );
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass( valueObj("test"), true );
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass( valueObj("test"), false );
	ok( !e.is(".test"), "Assert class not present" );

	// multiple class names
	e.addClass("testA testB");
	ok( e.is(".testA.testB"), "Assert 2 different classes present" );
	e.toggleClass( valueObj("testB testC") );
	ok( (e.is(".testA.testC") && !e.is(".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
	e.toggleClass( valueObj("testA testC") );
	ok( (!e.is(".testA") && !e.is(".testB") && !e.is(".testC")), "Assert no class present" );

	// toggleClass storage
	e.toggleClass( true );
	ok( e[ 0 ].className === "", "Assert class is empty (data was empty)" );
	e.addClass("testD testE");
	ok( e.is(".testD.testE"), "Assert class present" );
	e.toggleClass();
	ok( !e.is(".testD.testE"), "Assert class not present" );
	ok( jQuery._data(e[ 0 ], "__className__") === "testD testE", "Assert data was stored" );
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass( false );
	ok( !e.is(".testD.testE"), "Assert class not present" );
	e.toggleClass( true );
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass();
	e.toggleClass( false );
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );

	// Cleanup
	e.removeClass("testD");
	QUnit.expectJqData( e[ 0 ], "__className__" );
};

test( "toggleClass(String|boolean|undefined[, boolean])", function() {
	testToggleClass( bareObj );
});

test( "toggleClass(Function[, boolean])", function() {
	testToggleClass( functionReturningObj );
});

test( "toggleClass(Function[, boolean]) with incoming value", function() {
	expect( 14 );

	var e = jQuery("#firstp"),
		old = e.attr("class") || "";

	ok( !e.is(".test"), "Assert class not present" );

	e.toggleClass(function( i, val ) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function( i, val ) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	// class name with a boolean
	e.toggleClass(function( i, val, state ) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	e.toggleClass(function( i, val, state ) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, true, "Make sure that the state is passed in." );
		return "test";
	}, true );
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function( i, val, state ) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );
});

test( "addClass, removeClass, hasClass", function() {
	expect( 17 );

	var jq = jQuery("<p>Hi</p>"), x = jq.get(0);

	jq.addClass("hi");
	equal( x.className, "hi", "Check single added class" );

	jq.addClass("foo bar");
	equal( x.className, "hi foo bar", "Check more added classes" );

	jq.removeClass();
	equal( x.className, "", "Remove all classes" );

	jq.addClass("hi foo bar");
	jq.removeClass("foo");
	equal( x.className, "hi bar", "Check removal of one class" );

	ok( jq.hasClass("hi"), "Check has1" );
	ok( jq.hasClass("bar"), "Check has2" );

	jq = jQuery("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>");

	ok( jq.hasClass("class1"), "Check hasClass with line feed" );
	ok( jq.is(".class1"), "Check is with line feed" );
	ok( jq.hasClass("class2"), "Check hasClass with tab" );
	ok( jq.is(".class2"), "Check is with tab" );
	ok( jq.hasClass("cla.ss3"), "Check hasClass with dot" );
	ok( jq.hasClass("class4"), "Check hasClass with carriage return" );
	ok( jq.is(".class4"), "Check is with carriage return" );

	jq.removeClass("class2");
	ok( jq.hasClass("class2") === false, "Check the class has been properly removed" );
	jq.removeClass("cla");
	ok( jq.hasClass("cla.ss3"), "Check the dotted class has not been removed" );
	jq.removeClass("cla.ss3");
	ok( jq.hasClass("cla.ss3") === false, "Check the dotted class has been removed" );
	jq.removeClass("class4");
	ok( jq.hasClass("class4") === false, "Check the class has been properly removed" );
});

test( "addClass, removeClass, hasClass on many elements", function() {
	expect( 19 );

	var elem = jQuery( "<p>p0</p><p>p1</p><p>p2</p>" );

	elem.addClass( "hi" );
	equal( elem[ 0 ].className, "hi", "Check single added class" );
	equal( elem[ 1 ].className, "hi", "Check single added class" );
	equal( elem[ 2 ].className, "hi", "Check single added class" );

	elem.addClass( "foo bar" );
	equal( elem[ 0 ].className, "hi foo bar", "Check more added classes" );
	equal( elem[ 1 ].className, "hi foo bar", "Check more added classes" );
	equal( elem[ 2 ].className, "hi foo bar", "Check more added classes" );

	elem.removeClass();
	equal( elem[ 0 ].className, "", "Remove all classes" );
	equal( elem[ 1 ].className, "", "Remove all classes" );
	equal( elem[ 2 ].className, "", "Remove all classes" );

	elem.addClass( "hi foo bar" );
	elem.removeClass( "foo" );
	equal( elem[ 0 ].className, "hi bar", "Check removal of one class" );
	equal( elem[ 1 ].className, "hi bar", "Check removal of one class" );
	equal( elem[ 2 ].className, "hi bar", "Check removal of one class" );

	ok( elem.hasClass( "hi" ), "Check has1" );
	ok( elem.hasClass( "bar" ), "Check has2" );

	ok( jQuery( "<p class='hi'>p0</p><p>p1</p><p>p2</p>" ).hasClass( "hi" ),
		"Did find a class in the first element" );
	ok( jQuery( "<p>p0</p><p class='hi'>p1</p><p>p2</p>" ).hasClass( "hi" ),
		"Did find a class in the second element" );
	ok( jQuery( "<p>p0</p><p>p1</p><p class='hi'>p2</p>" ).hasClass( "hi" ),
		"Did find a class in the last element" );

	ok( jQuery( "<p class='hi'>p0</p><p class='hi'>p1</p><p class='hi'>p2</p>" ).hasClass( "hi" ),
		"Did find a class when present in all elements" );

	ok( !jQuery( "<p class='hi0'>p0</p><p class='hi1'>p1</p><p class='hi2'>p2</p>" ).hasClass( "hi" ),
		"Did not find a class when not present" );
});
