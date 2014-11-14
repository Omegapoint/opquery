module( "manipulation", {
});

// Ensure that an extended Array prototype doesn't break jQuery
Array.prototype.arrayProtoFn = function() {
	throw("arrayProtoFn should not be called");
};

function manipulationBareObj( value ) {
	return value;
}

function manipulationFunctionReturningObj( value ) {
	return function() {
		return value;
	};
}

/*
	======== local reference =======
	manipulationBareObj and manipulationFunctionReturningObj can be used to test passing functions to setters
	See testVal below for an example

	bareObj( value );
		This function returns whatever value is passed in

	functionReturningObj( value );
		Returns a function that returns the value
*/

test( "text()", function() {

	expect( 5 );

	var expected, frag, $newLineTest;

	expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equal( jQuery("#sap").text(), expected, "Check for merged text of more then one element." );

	// Check serialization of text values
	equal( jQuery(document.createTextNode("foo")).text(), "foo", "Text node was retrieved from .text()." );
	notEqual( jQuery(document).text(), "", "Retrieving text for the document retrieves all text (#10724)." );

	// Retrieve from document fragments #10864
	frag = document.createDocumentFragment();
	frag.appendChild( document.createTextNode("foo") );

	equal( jQuery(frag).text(), "foo", "Document Fragment Text node was retrieved from .text()." );

	$newLineTest = jQuery("<div>test<br/>testy</div>").appendTo("#moretests");
	$newLineTest.find("br").replaceWith("\n");
	equal( $newLineTest.text(), "test\ntesty", "text() does not remove new lines (#11153)" );

	$newLineTest.remove();
});

test( "text(undefined)", function() {

	expect( 1 );

	equal( jQuery("#foo").text("<div").text(undefined)[ 0 ].innerHTML, "&lt;div", ".text(undefined) is chainable (#5571)" );
});

function testText( valueObj ) {

	expect( 7 );

	var val, j, expected, $multipleElements, $parentDiv, $childDiv;

	val = valueObj("<div><b>Hello</b> cruel world!</div>");
	equal( jQuery("#foo").text(val)[ 0 ].innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	j.text( valueObj("hi!") );
	equal( jQuery( j[ 0 ] ).text(), "hi!", "Check node,textnode,comment with text()" );
	equal( j[ 1 ].nodeValue, " there ", "Check node,textnode,comment with text()" );

	equal( j[ 2 ].nodeType, 8, "Check node,textnode,comment with text()" );

	// Update multiple elements #11809
	expected = "New";

	$multipleElements = jQuery( "<div>Hello</div>" ).add( "<div>World</div>" );
	$multipleElements.text( expected );

	equal( $multipleElements.eq(0).text(), expected, "text() updates multiple elements (#11809)" );
	equal( $multipleElements.eq(1).text(), expected, "text() updates multiple elements (#11809)" );

	// Prevent memory leaks #11809
	$childDiv = jQuery( "<div/>" );
	$childDiv.data("leak", true);
	$parentDiv = jQuery( "<div/>" );
	$parentDiv.append( $childDiv );
	$parentDiv.text("Dry off");

	equal( $childDiv.data("leak"), undefined, "Check for leaks (#11809)" );
}

test( "text(String)", function() {
	testText( manipulationBareObj );
});

test( "text(Function)", function() {
	testText( manipulationFunctionReturningObj );
});

test( "text(Function) with incoming value", function() {

	expect( 2 );

	var old = "This link has class=\"blog\": Simon Willison's Weblog";

	jQuery("#sap").text(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "foobar";
	});

	equal( jQuery("#sap").text(), "foobar", "Check for merged text of more then one element." );
});

function testAppendForObject( valueObj, isFragment ) {
	var $base,
		type = isFragment ? " (DocumentFragment)" : " (Element)",
		text = "This link has class=\"blog\": Simon Willison's Weblog",
		el = document.getElementById("sap").cloneNode( true ),
		first = document.getElementById("first"),
		yahoo = document.getElementById("yahoo");

	if ( isFragment ) {
		$base = document.createDocumentFragment();
		jQuery( el ).contents().each(function() {
			$base.appendChild( this );
		});
		$base = jQuery( $base );
	} else {
		$base = jQuery( el );
	}

	equal( $base.clone().append( valueObj(first.cloneNode(true)) ).text(),
		text + "Try them out:",
		"Check for appending of element" + type
	);

	equal( $base.clone().append( valueObj([ first.cloneNode(true), yahoo.cloneNode(true) ]) ).text(),
		text + "Try them out:Yahoo",
		"Check for appending of array of elements" + type
	);

	equal( $base.clone().append( valueObj(jQuery("#yahoo, #first").clone()) ).text(),
		text + "YahooTry them out:",
		"Check for appending of jQuery object" + type
	);

	equal( $base.clone().append( valueObj( 5 ) ).text(),
		text + "5",
		"Check for appending a number" + type
	);

	equal( $base.clone().append( valueObj([ jQuery("#first").clone(), jQuery("#yahoo, #google").clone() ]) ).text(),
		text + "Try them out:GoogleYahoo",
		"Check for appending of array of jQuery objects"
	);

	equal( $base.clone().append( valueObj(" text with spaces ") ).text(),
		text + " text with spaces ",
		"Check for appending text with spaces" + type
	);

	equal( $base.clone().append( valueObj([]) ).text(),
		text,
		"Check for appending an empty array" + type
	);

	equal( $base.clone().append( valueObj("") ).text(),
		text,
		"Check for appending an empty string" + type
	);

	equal( $base.clone().append( valueObj(document.getElementsByTagName("foo")) ).text(),
		text,
		"Check for appending an empty nodelist" + type
	);

	equal( $base.clone().append( "<span></span>", "<span></span>", "<span></span>" ).children().length,
		$base.children().length + 3,
		"Make sure that multiple arguments works." + type
	);

	equal( $base.clone().append( valueObj(document.getElementById("form").cloneNode(true)) ).children("form").length,
		1,
		"Check for appending a form (#910)" + type
	);
}

function testAppend( valueObj ) {

	expect( 78 );

	testAppendForObject( valueObj, false );
	testAppendForObject( valueObj, true );

	var defaultText, result, message, iframe, iframeDoc, j, d,
		$input, $radioChecked, $radioUnchecked, $radioParent, $map, $table;

	defaultText = "Try them out:";
	result = jQuery("#first").append( valueObj("<b>buga</b>") );

	equal( result.text(), defaultText + "buga", "Check if text appending works" );
	equal( jQuery("#select3").append( valueObj("<option value='appendTest'>Append Test</option>") ).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element" );

	jQuery("form").append( valueObj("<input name='radiotest' type='radio' checked='checked' />") );
	jQuery("form input[name=radiotest]").each(function() {
		ok( jQuery(this).is(":checked"), "Append checked radio" );
	}).remove();

	jQuery("form").append( valueObj("<input name='radiotest2' type='radio' checked    =   'checked' />") );
	jQuery("form input[name=radiotest2]").each(function() {
		ok( jQuery(this).is(":checked"), "Append alternately formated checked radio" );
	}).remove();

	jQuery("form").append( valueObj("<input name='radiotest3' type='radio' checked />") );
	jQuery("form input[name=radiotest3]").each(function() {
		ok( jQuery(this).is(":checked"), "Append HTML5-formated checked radio" );
	}).remove();

	jQuery("form").append( valueObj("<input type='radio' checked='checked' name='radiotest4' />") );
	jQuery("form input[name=radiotest4]").each(function() {
		ok( jQuery(this).is(":checked"), "Append with name attribute after checked attribute" );
	}).remove();

	message = "Test for appending a DOM node to the contents of an iframe";
	iframe = jQuery("#iframe")[ 0 ];
	iframeDoc = iframe.contentDocument || iframe.contentWindow && iframe.contentWindow.document;

	try {
		if ( iframeDoc && iframeDoc.body ) {
			equal( jQuery(iframeDoc.body).append( valueObj("<div id='success'>test</div>") )[ 0 ].lastChild.id, "success", message );
		} else {
			ok( true, message + " - can't test" );
		}
	} catch( e ) {
		strictEqual( e.message || e, undefined, message );
	}

	jQuery("<fieldset/>").appendTo("#form").append( valueObj("<legend id='legend'>test</legend>") );
	t( "Append legend", "#legend", [ "legend" ] );

	$map = jQuery("<map/>").append( valueObj("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='jQuery'>") );

	equal( $map[ 0 ].childNodes.length, 1, "The area was inserted." );
	equal( $map[ 0 ].firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	jQuery("#select1").append( valueObj("<OPTION>Test</OPTION>") );
	equal( jQuery("#select1 option:last-child").text(), "Test", "Appending OPTION (all caps)" );

	jQuery("#select1").append( valueObj("<optgroup label='optgroup'><option>optgroup</option></optgroup>") );
	equal( jQuery("#select1 optgroup").attr("label"), "optgroup", "Label attribute in newly inserted optgroup is correct" );
	equal( jQuery("#select1 option").last().text(), "optgroup", "Appending optgroup" );

	$table = jQuery("#table");

	jQuery.each( "thead tbody tfoot colgroup caption tr th td".split(" "), function( i, name ) {
		$table.append( valueObj( "<" + name + "/>" ) );
		equal( $table.find( name ).length, 1, "Append " + name );
		ok( jQuery.parseHTML( "<" + name + "/>" ).length, name + " wrapped correctly" );
	});

	jQuery("#table colgroup").append( valueObj("<col/>") );
	equal( jQuery("#table colgroup col").length, 1, "Append col" );

	jQuery("#form")
		.append( valueObj("<select id='appendSelect1'></select>") )
		.append( valueObj("<select id='appendSelect2'><option>Test</option></select>") );
	t( "Append Select", "#appendSelect1, #appendSelect2", [ "appendSelect1", "appendSelect2" ] );

	equal( "Two nodes", jQuery("<div />").append( "Two", " nodes" ).text(), "Appending two text nodes (#4011)" );
	equal( jQuery("<div />").append( "1", "", 3 ).text(), "13", "If median is false-like value, subsequent arguments should not be ignored" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	d = jQuery("<div/>").appendTo("#nonnodes").append( j );

	equal( jQuery("#nonnodes").length, 1, "Check node,textnode,comment append moved leaving just the div" );
	equal( d.contents().length, 3, "Check node,textnode,comment append works" );
	d.contents().appendTo("#nonnodes");
	d.remove();
	equal( jQuery("#nonnodes").contents().length, 3, "Check node,textnode,comment append cleanup worked" );

	$input = jQuery("<input type='checkbox'/>").prop( "checked", true ).appendTo("#testForm");
	equal( $input[ 0 ].checked, true, "A checked checkbox that is appended stays checked" );

	$radioChecked = jQuery("input[type='radio'][name='R1']").eq( 1 );
	$radioParent = $radioChecked.parent();
	$radioUnchecked = jQuery("<input type='radio' name='R1' checked='checked'/>").appendTo( $radioParent );
	$radioChecked.trigger("click");
	$radioUnchecked[ 0 ].checked = false;

	jQuery("<div/>").insertBefore($radioParent).append($radioParent);

	equal( $radioChecked[ 0 ].checked, true, "Reappending radios uphold which radio is checked" );
	equal( $radioUnchecked[ 0 ].checked, false, "Reappending radios uphold not being checked" );

	equal( jQuery("<div/>").append( valueObj("option<area/>") )[ 0 ].childNodes.length, 2, "HTML-string with leading text should be processed correctly" );
}

test( "append(String|Element|Array<Element>|jQuery)", function() {
	testAppend( manipulationBareObj );
});

test( "append(Function)", function() {
	testAppend( manipulationFunctionReturningObj );
});

test( "append(param) to object, see #11280", function() {

	expect( 5 );

	var object = jQuery( document.createElement("object") ).appendTo( document.body );

	equal( object.children().length, 0, "object does not start with children" );

	object.append( jQuery("<param type='wmode' name='foo'>") );
	equal( object.children().length, 1, "appended param" );
	equal( object.children().eq(0).attr("name"), "foo", "param has name=foo" );

	object = jQuery("<object><param type='baz' name='bar'></object>");
	equal( object.children().length, 1, "object created with child param" );
	equal( object.children().eq(0).attr("name"), "bar", "param has name=bar" );
});

test( "append(Function) returns String", function() {

	expect( 4 );

	var defaultText, result, select, old;

	defaultText = "Try them out:";
	old = jQuery("#first").html();

	result = jQuery("#first").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equal( result.text(), defaultText + "buga", "Check if text appending works" );

	select = jQuery("#select3");
	old = select.html();

	equal( select.append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='appendTest'>Append Test</option>";
	}).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element" );
});

test( "append(Function) returns Element", function() {

  expect( 2 );
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:",
    old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of element" );
});

test( "append(Function) returns Array<Element>", function() {

	expect( 2 );
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo",
    old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return [ document.getElementById("first"), document.getElementById("yahoo") ];
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of array of elements" );
});

test( "append(Function) returns jQuery", function() {

	expect( 2 );
	var expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:",
    old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return jQuery("#yahoo, #first");
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of jQuery object" );
});

test( "append(Function) returns Number", function() {

	expect( 2 );
	var old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return 5;
	});
	ok( jQuery("#sap")[ 0 ].innerHTML.match( /5$/ ), "Check for appending a number" );
});

test( "append HTML5 sectioning elements (Bug #6485)", function() {

	expect( 2 );

	var article, aside;

	jQuery("#qunit-fixture").append("<article style='font-size:10px'><section><aside>HTML5 elements</aside></section></article>");

	article = jQuery("article");
	aside = jQuery("aside");

	equal( article.get( 0 ).style.fontSize, "10px", "HTML5 elements are styleable" );
	equal( aside.length, 1, "HTML5 elements do not collapse their children" );
});

if ( jQuery.css ) {
	test( "HTML5 Elements inherit styles from style rules (Bug #10501)", function() {

		expect( 1 );

		jQuery("#qunit-fixture").append("<article id='article'></article>");
		jQuery("#article").append("<section>This section should have a pink background.</section>");

		// In IE, the missing background color will claim its value is "transparent"
		notEqual( jQuery("section").css("background-color"), "transparent", "HTML5 elements inherit styles" );
	});
}

test( "html(String) with HTML5 (Bug #6485)", function() {

	expect( 2 );

	jQuery("#qunit-fixture").html("<article><section><aside>HTML5 elements</aside></section></article>");
	equal( jQuery("#qunit-fixture").children().children().length, 1, "Make sure HTML5 article elements can hold children. innerHTML shortcut path" );
	equal( jQuery("#qunit-fixture").children().children().children().length, 1, "Make sure nested HTML5 elements can hold children." );
});

test( "appendTo(String)", function() {

	expect( 4 );

	var l, defaultText;

	defaultText = "Try them out:";
	jQuery("<b>buga</b>").appendTo("#first");
	equal( jQuery("#first").text(), defaultText + "buga", "Check if text appending works" );
	equal( jQuery("<option value='appendTest'>Append Test</option>").appendTo("#select3").parent().find("option:last-child").attr("value"), "appendTest", "Appending html options to select element" );

	l = jQuery("#first").children().length + 2;
	jQuery("<strong>test</strong>");
	jQuery("<strong>test</strong>");
	jQuery([ jQuery("<strong>test</strong>")[ 0 ], jQuery("<strong>test</strong>")[ 0 ] ])
		.appendTo("#first");
	equal( jQuery("#first").children().length, l, "Make sure the elements were inserted." );
	equal( jQuery("#first").children().last()[ 0 ].nodeName.toLowerCase(), "strong", "Verify the last element." );
});

test( "appendTo(Element|Array<Element>)", function() {

  expect( 2 );

	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery( document.getElementById("first") ).appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of element" );

	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery([ document.getElementById("first"), document.getElementById("yahoo") ]).appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of array of elements" );

});

test( "appendTo(jQuery)", function() {

  expect( 10 );

  var expected, num, div;
	ok( jQuery(document.createElement("script")).appendTo("body").length, "Make sure a disconnected script can be appended." );

	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	jQuery("#yahoo, #first").appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of jQuery object" );

	jQuery("#select1").appendTo("#foo");
	t( "Append select", "#foo select", [ "select1" ] );

	div = jQuery("<div/>").on( "click", function() {
		ok( true, "Running a cloned click." );
	});
	div.appendTo("#qunit-fixture, #moretests");

	jQuery("#qunit-fixture div").last().trigger("click");
	jQuery("#moretests div").last().trigger("click");

	div = jQuery("<div/>").appendTo("#qunit-fixture, #moretests");

	equal( div.length, 2, "appendTo returns the inserted elements" );

	div.addClass("test");

	ok( jQuery("#qunit-fixture div").last().hasClass("test"), "appendTo element was modified after the insertion" );
	ok( jQuery("#moretests div").last().hasClass("test"), "appendTo element was modified after the insertion" );

	div = jQuery("<div/>");
	jQuery("<span>a</span><b>b</b>").filter("span").appendTo( div );

	equal( div.children().length, 1, "Make sure the right number of children were inserted." );

	div = jQuery("#moretests div");

	num = jQuery("#qunit-fixture div").length;
	div.remove().appendTo("#qunit-fixture");

	equal( jQuery("#qunit-fixture div").length, num, "Make sure all the removed divs were inserted." );
});

test( "prepend(String)", function() {

	expect( 2 );

	var result, expected;
	expected = "Try them out:";
	result = jQuery("#first").prepend( "<b>buga</b>" );
	equal( result.text(), "buga" + expected, "Check if text prepending works" );
	equal( jQuery("#select3").prepend( "<option value='prependTest'>Prepend Test</option>"  ).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element" );
});

test( "prepend(Element)", function() {

	expect( 1 );

	var expected;
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( document.getElementById("first") );
	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );
});

test( "prepend(Array<Element>)", function() {

	expect( 1 );

	var expected;
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( [ document.getElementById("first"), document.getElementById("yahoo") ] );
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );
});

test( "prepend(jQuery)", function() {

	expect( 1 );

	var expected;
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( jQuery("#yahoo, #first") );
	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );
});

test( "prepend(Array<jQuery>)", function() {

	expect( 1 );

	var expected;
	expected = "Try them out:GoogleYahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( [ jQuery("#first"), jQuery("#yahoo, #google") ] );
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of jQuery objects" );
});

test( "prepend(Function) with incoming value -- String", function() {

	expect( 4 );

	var defaultText, old, result;

	defaultText = "Try them out:";
	old = jQuery("#first").html();
	result = jQuery("#first").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});

	equal( result.text(), "buga" + defaultText, "Check if text prepending works" );

	old = jQuery("#select3").html();

	equal( jQuery("#select3").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='prependTest'>Prepend Test</option>";
	}).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element" );
});

test( "prepend(Function) with incoming value -- Element", function() {

  expect( 2 );

	var old, expected;
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );
});

test( "prepend(Function) with incoming value -- Array<Element>", function() {

  expect( 2 );

	var old, expected;
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return [ document.getElementById("first"), document.getElementById("yahoo") ];
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );
});

test( "prepend(Function) with incoming value -- jQuery", function() {

  expect( 2 );

	var old, expected;
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return jQuery("#yahoo, #first");
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );
});

test( "prependTo(String)", function() {

	expect( 2 );

	var defaultText;

	defaultText = "Try them out:";
	jQuery("<b>buga</b>").prependTo("#first");
	equal( jQuery("#first").text(), "buga" + defaultText, "Check if text prepending works" );
	equal( jQuery("<option value='prependTest'>Prepend Test</option>").prependTo("#select3").parent().find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element" );

});

test( "prependTo(Element)", function() {

	expect( 1 );

	var expected;

	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery( document.getElementById("first") ).prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );
});

test( "prependTo(Array<Element>)", function() {

	expect( 1 );

	var expected;

	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery( [ document.getElementById("first"), document.getElementById("yahoo") ] ).prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );
});

test( "prependTo(jQuery)", function() {

	expect( 1 );

	var expected;

	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#yahoo, #first").prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );
});

test( "prependTo(Array<jQuery>)", function() {

	expect( 1 );

	jQuery("<select id='prependSelect1'></select>").prependTo("#form");
	jQuery("<select id='prependSelect2'><option>Test</option></select>").prependTo("#form");

	t( "Prepend Select", "#prependSelect2, #prependSelect1", [ "prependSelect2", "prependSelect1" ] );
});

test( "before(String)", function() {

	expect( 1 );

	var expected;

	expected = "This is a normal link: bugaYahoo";
	jQuery("#yahoo").before( manipulationBareObj("<b>buga</b>") );
	equal( jQuery("#en").text(), expected, "Insert String before" );
});

test( "before(Element)", function() {

	expect( 1 );

	var expected;

	expected = "This is a normal link: Try them out:Yahoo";
	jQuery("#yahoo").before( manipulationBareObj(document.getElementById("first")) );
	equal( jQuery("#en").text(), expected, "Insert element before" );
});

test( "before(Array<Element>)", function() {

	expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery("#yahoo").before( manipulationBareObj([ document.getElementById("first"), document.getElementById("mark") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of elements before" );
});

test( "before(jQuery)", function() {

	expect( 1 );

	var expected;
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery("#yahoo").before( manipulationBareObj(jQuery("#mark, #first")) );
	equal( jQuery("#en").text(), expected, "Insert jQuery before" );
});

test( "before(Array<jQuery>)", function() {

	expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
	jQuery("#yahoo").before( manipulationBareObj([ jQuery("#first"), jQuery("#mark, #google") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of jQuery objects before" );
});

test( "before(Function) -- Returns String", function() {

	expect( 1 );

	var expected;

	expected = "This is a normal link: bugaYahoo";
	jQuery("#yahoo").before( manipulationFunctionReturningObj("<b>buga</b>") );
	equal( jQuery("#en").text(), expected, "Insert String before" );
});

test( "before(Function) -- Returns Element", function() {

	expect( 1 );

	var expected;

	expected = "This is a normal link: Try them out:Yahoo";
	jQuery("#yahoo").before( manipulationFunctionReturningObj(document.getElementById("first")) );
	equal( jQuery("#en").text(), expected, "Insert element before" );
});

test( "before(Function) -- Returns Array<Element>", function() {

	expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery("#yahoo").before( manipulationFunctionReturningObj([ document.getElementById("first"), document.getElementById("mark") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of elements before" );
});

test( "before(Function) -- Returns jQuery", function() {

	expect( 1 );

	var expected;
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery("#yahoo").before( manipulationFunctionReturningObj(jQuery("#mark, #first")) );
	equal( jQuery("#en").text(), expected, "Insert jQuery before" );
});

test( "before(Function) -- Returns Array<jQuery>", function() {

	expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
	jQuery("#yahoo").before( manipulationFunctionReturningObj([ jQuery("#first"), jQuery("#mark, #google") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of jQuery objects before" );
});

test( "before(no-op)", function() {

	expect( 2 );

	var set;
	set = jQuery("<div/>").before("<span>test</span>");
	equal( set[ 0 ].nodeName.toLowerCase(), "div", "Insert before a disconnected node should be a no-op" );
	equal( set.length, 1, "Insert the element before the disconnected node. should be a no-op" );
});

test( "before and after w/ empty object (#10812)", function() {

	expect( 1 );

	var res;

	res = jQuery( "#notInTheDocument" ).before( "(" ).after( ")" );
	equal( res.length, 0, "didn't choke on empty object" );
});

test( ".before() and .after() disconnected node", function() {

  expect(2);

  equal( jQuery("<input type='checkbox'/>").before("<div/>").length, 1, "before() on disconnected node is no-op" );
	equal( jQuery("<input type='checkbox'/>").after("<div/>").length, 1, "after() on disconnected node is no-op" );
});

test( "insert with .before() on disconnected node last", function() {

  expect(1);

  var expectedBefore = "This is a normal link: bugaYahoo";

  jQuery("#yahoo").add("<span/>").before("<b>buga</b>");
	equal( jQuery("#en").text(), expectedBefore, "Insert String before with disconnected node last" );
});

test( "insert with .before() on disconnected node first", function() {

  expect(1);

  var expectedBefore = "This is a normal link: bugaYahoo";

	jQuery("<span/>").add("#yahoo").before("<b>buga</b>");
	equal( jQuery("#en").text(), expectedBefore, "Insert String before with disconnected node first" );
});

test( "insert with .before() on disconnected node last", function() {

  expect(1);

  var expectedAfter = "This is a normal link: Yahoobuga";

	jQuery("#yahoo").add("<span/>").after("<b>buga</b>");
	equal( jQuery("#en").text(), expectedAfter, "Insert String after with disconnected node last" );
});

test( "insert with .before() on disconnected node last", function() {

  expect(1);

  var expectedAfter = "This is a normal link: Yahoobuga";

	jQuery("<span/>").add("#yahoo").after("<b>buga</b>");
	equal( jQuery("#en").text(), expectedAfter, "Insert String after with disconnected node first" );
});

test( "insertBefore(String)", function() {

	expect( 1 );

	var expected = "This is a normal link: bugaYahoo";
	jQuery("<b>buga</b>").insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert String before" );
});

test( "insertBefore(Element)", function() {

  expect( 1 );

  var expected = "This is a normal link: Try them out:Yahoo";
	jQuery( document.getElementById("first") ).insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert element before" );
});

test( "insertBefore(Array<Element>)", function() {

  expect( 1 );

  var expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery( [ document.getElementById("first"), document.getElementById("mark") ] ).insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert array of elements before" );
});

test( "insertBefore(jQuery)", function() {

  expect( 1 );

  var expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery("#mark, #first").insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert jQuery before" );
});

test( ".after(String)", function() {

  expect( 1 );

  var expected = "This is a normal link: Yahoobuga";
	jQuery("#yahoo").after( "<b>buga</b>" );
	equal( jQuery("#en").text(), expected, "Insert String after" );
});

test( ".after(Element)", function() {

  expect( 1 );

  var expected = "This is a normal link: YahooTry them out:";
	jQuery("#yahoo").after( document.getElementById("first") );
	equal( jQuery("#en").text(), expected, "Insert element after" );
});

test( ".after(Array<Element>)", function() {

  expect( 1 );

  var expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery("#yahoo").after( [ document.getElementById("first"), document.getElementById("mark") ] );
	equal( jQuery("#en").text(), expected, "Insert array of elements after" );
});

test( ".after(jQuery)", function() {

  expect( 1 );

  var expected = "This is a normal link: YahooTry them out:Googlediveintomark";
	jQuery("#yahoo").after( [ jQuery("#first"), jQuery("#mark, #google") ] );
	equal( jQuery("#en").text(), expected, "Insert array of jQuery objects after" );
});

test( ".after(Function) returns String", function() {

  expect( 1 );

  var expected = "This is a normal link: Yahoobuga",
    val = manipulationFunctionReturningObj;
	jQuery("#yahoo").after( val("<b>buga</b>") );
	equal( jQuery("#en").text(), expected, "Insert String after" );
});

test( ".after(Function) returns Element", function() {

  expect( 1 );

  var expected = "This is a normal link: YahooTry them out:",
    val = manipulationFunctionReturningObj;
	jQuery("#yahoo").after( val(document.getElementById("first")) );
	equal( jQuery("#en").text(), expected, "Insert element after" );
});

test( ".after(Function) returns Array<Element>", function() {

  expect( 1 );

  var expected = "This is a normal link: YahooTry them out:diveintomark",
    val = manipulationFunctionReturningObj;
	jQuery("#yahoo").after( val([ document.getElementById("first"), document.getElementById("mark") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of elements after" );
});

test( ".after(Function) returns jQuery", function() {

  expect( 1 );

  var expected = "This is a normal link: YahooTry them out:Googlediveintomark",
    val = manipulationFunctionReturningObj;
	jQuery("#yahoo").after( val([ jQuery("#first"), jQuery("#mark, #google") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of jQuery objects after" );
});

test( ".after(disconnected node)", function() {

  expect( 2 );

  var set = jQuery("<div/>").before("<span>test</span>");
	equal( set[ 0 ].nodeName.toLowerCase(), "div", "Insert after a disconnected node should be a no-op" );
	equal( set.length, 1, "Insert the element after the disconnected node should be a no-op" );
});

test( "insertAfter(String)", function() {

	expect( 1 ) ;

	var expected = "This is a normal link: Yahoobuga";
	jQuery("<b>buga</b>").insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert String after" );
});

test( "insertAfter(Element)", function() {

  expect(1);

  var expected = "This is a normal link: YahooTry them out:";
	jQuery( document.getElementById("first") ).insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert element after" );
});

test( "insertAfter(Array<Element>)", function() {

  expect(1);

  var expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery( [ document.getElementById("first"), document.getElementById("mark") ] ).insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert array of elements after" );
});

test( "insertAfter(jQuery)", function() {

  expect(1);

  var expected = "This is a normal link: YahoodiveintomarkTry them out:";
	jQuery("#mark, #first").insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert jQuery after" );
});

function testReplaceWith( val ) {

	var tmp, y, child, child2, set, non_existent, $div,
		expected = 29;

	expect( expected );

	jQuery("#yahoo").replaceWith( val("<b id='replace'>buga</b>") );
	ok( jQuery("#replace")[ 0 ], "Replace element with element from string" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after string" );

	jQuery("#anchor2").replaceWith( val(document.getElementById("first")) );
	ok( jQuery("#first")[ 0 ], "Replace element with element" );
	ok( !jQuery("#anchor2")[ 0 ], "Verify that original element is gone, after element" );

	jQuery("#qunit-fixture").append("<div id='bar'><div id='baz'></div></div>");
	jQuery("#baz").replaceWith( val("Baz") );
	equal( jQuery("#bar").text(),"Baz", "Replace element with text" );
	ok( !jQuery("#baz")[ 0 ], "Verify that original element is gone, after element" );

	jQuery("#bar").replaceWith( "<div id='yahoo'></div>", "...", "<div id='baz'></div>" );
	deepEqual( jQuery("#yahoo, #baz").get(), q( "yahoo", "baz" ),  "Replace element with multiple arguments (#13722)" );
	strictEqual( jQuery("#yahoo")[0].nextSibling, jQuery("#baz")[0].previousSibling, "Argument order preserved" );
	deepEqual( jQuery("#bar").get(), [], "Verify that original element is gone, after multiple arguments" );

	jQuery("#google").replaceWith( val([ document.getElementById("first"), document.getElementById("mark") ]) );
	deepEqual( jQuery("#mark, #first").get(), q( "first", "mark" ),  "Replace element with array of elements" );
	ok( !jQuery("#google")[ 0 ], "Verify that original element is gone, after array of elements" );

	jQuery("#groups").replaceWith( val(jQuery("#mark, #first")) );
	deepEqual( jQuery("#mark, #first").get(), q( "first", "mark" ),  "Replace element with jQuery collection" );
	ok( !jQuery("#groups")[ 0 ], "Verify that original element is gone, after jQuery collection" );

	jQuery("#mark, #first").replaceWith( val("<span class='replacement'></span><span class='replacement'></span>") );
	equal( jQuery("#qunit-fixture .replacement").length, 4, "Replace multiple elements (#12449)" );
	deepEqual( jQuery("#mark, #first").get(), [], "Verify that original elements are gone, after replace multiple" );

	tmp = jQuery("<b>content</b>")[0];
	jQuery("#anchor1").contents().replaceWith( val(tmp) );
	deepEqual( jQuery("#anchor1").contents().get(), [ tmp ], "Replace text node with element" );


	tmp = jQuery("<div/>").appendTo("#qunit-fixture").on( "click", function() {
		ok( true, "Newly bound click run." );
	});
	y = jQuery("<div/>").appendTo("#qunit-fixture").on( "click", function() {
		ok( false, "Previously bound click run." );
	});
	child = y.append("<b>test</b>").find("b").on( "click", function() {
		ok( true, "Child bound click run." );
		return false;
	});

	y.replaceWith( val(tmp) );

	tmp.trigger("click");
	y.trigger("click"); // Shouldn't be run
	child.trigger("click"); // Shouldn't be run


	y = jQuery("<div/>").appendTo("#qunit-fixture").on( "click", function() {
		ok( false, "Previously bound click run." );
	});
	child2 = y.append("<u>test</u>").find("u").on( "click", function() {
		ok( true, "Child 2 bound click run." );
		return false;
	});

	y.replaceWith( val(child2) );

	child2.trigger("click");


	set = jQuery("<div/>").replaceWith( val("<span>test</span>") );
	equal( set[0].nodeName.toLowerCase(), "div", "No effect on a disconnected node." );
	equal( set.length, 1, "No effect on a disconnected node." );
	equal( set[0].childNodes.length, 0, "No effect on a disconnected node." );


	child = jQuery("#qunit-fixture").children().first();
	$div = jQuery("<div class='pathological'/>").insertBefore( child );
	$div.replaceWith( $div );
	deepEqual( jQuery( ".pathological", "#qunit-fixture" ).get(), $div.get(),
		"Self-replacement" );
	$div.replaceWith( child );
	deepEqual( jQuery("#qunit-fixture").children().first().get(), child.get(),
		"Replacement with following sibling (#13810)" );
	deepEqual( jQuery( ".pathological", "#qunit-fixture" ).get(), [],
		"Replacement with following sibling (context removed)" );


	non_existent = jQuery("#does-not-exist").replaceWith( val("<b>should not throw an error</b>") );
	equal( non_existent.length, 0, "Length of non existent element." );

	$div = jQuery("<div class='replacewith'></div>").appendTo("#qunit-fixture");
	$div.replaceWith( val("<div class='replacewith'></div><script>" +
		"equal( jQuery('.replacewith').length, 1, 'Check number of elements in page.' );" +
		"</script>") );

	jQuery("#qunit-fixture").append("<div id='replaceWith'></div>");
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );
	jQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists after replacement." );
	jQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists after subsequent replacement." );

	return expected;
}

test( "replaceWith(String|Element|Array<Element>|jQuery)", function() {
	testReplaceWith( manipulationBareObj );
});

test( "replaceWith(Function)", function() {
	expect( testReplaceWith(manipulationFunctionReturningObj) + 1 );

	var y = jQuery("#foo")[ 0 ];

	jQuery( y ).replaceWith(function() {
		equal( this, y, "Make sure the context is coming in correctly." );
	});
});

test( "replaceWith(string) for more than one element", function() {

	expect( 3 );

	equal( jQuery("#foo p").length, 3, "ensuring that test data has not changed" );

	jQuery("#foo p").replaceWith("<span>bar</span>");
	equal(jQuery("#foo span").length, 3, "verify that all the three original element have been replaced");
	equal(jQuery("#foo p").length, 0, "verify that all the three original element have been replaced");
});

test( "Empty replaceWith (#13401; #13596)", 8, function() {
	var $el = jQuery( "<div/>" ),
		tests = {
			"empty string": "",
			"empty array": [],
			"empty collection": jQuery( "#nonexistent" ),

       // in case of jQuery(...).replaceWith();
			"empty undefined": undefined
		};

	jQuery.each( tests, function( label, input ) {
		$el.html( "<a/>" ).children().replaceWith( input );
		strictEqual( $el.html(), "", "replaceWith(" + label + ")" );
		$el.html( "<b/>" ).children().replaceWith(function() { return input; });
		strictEqual( $el.html(), "", "replaceWith(function returning " + label + ")" );
	});
});

test( "replaceAll(String)", function() {

	expect( 2 );

	jQuery("<b id='replace'>buga</b>").replaceAll("#yahoo");
	ok( jQuery("#replace")[ 0 ], "Replace element with string" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after string" );
});

test( "replaceAll(Element)", function() {

	expect( 2 );

	jQuery( document.getElementById("first") ).replaceAll("#yahoo");
	ok( jQuery("#first")[ 0 ], "Replace element with element" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after element" );
});

test( "replaceAll(Array<Element>)", function() {

	expect( 3 );

	jQuery( [ document.getElementById("first"), document.getElementById("mark") ] ).replaceAll("#yahoo");
	ok( jQuery("#first")[ 0 ], "Replace element with array of elements" );
	ok( jQuery("#mark")[ 0 ], "Replace element with array of elements" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after array of elements" );
});

test( "replaceAll(jQuery)", function() {

	expect( 3 );

	jQuery("#mark, #first").replaceAll("#yahoo");
	ok( jQuery("#first")[ 0 ], "Replace element with set of elements" );
	ok( jQuery("#mark")[ 0 ], "Replace element with set of elements" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after set of elements" );
});

test( "jQuery.clone() (#8017)", function() {

	expect( 2 );

	ok( jQuery.clone && jQuery.isFunction( jQuery.clone ) , "jQuery.clone() utility exists and is a function.");

	var main = jQuery("#qunit-fixture")[ 0 ],
		clone = jQuery.clone( main );

	equal( main.childNodes.length, clone.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );
});

test( "append to multiple elements (#8070)", function() {

	expect( 2 );

	var selects = jQuery("<select class='test8070'></select><select class='test8070'></select>").appendTo("#qunit-fixture");
	selects.append("<OPTION>1</OPTION><OPTION>2</OPTION>");

	equal( selects[ 0 ].childNodes.length, 2, "First select got two nodes" );
	equal( selects[ 1 ].childNodes.length, 2, "Second select got two nodes" );
});

test( "table manipulation", function() {
	expect( 2 );

	var table = jQuery("<table style='font-size:16px'></table>").appendTo("#qunit-fixture").empty(),
		height = table[0].offsetHeight;

	table.append("<tr><td>DATA</td></tr>");
	ok( table[0].offsetHeight - height >= 15, "appended rows are visible" );

	table.empty();
	height = table[0].offsetHeight;
	table.prepend("<tr><td>DATA</td></tr>");
	ok( table[0].offsetHeight - height >= 15, "prepended rows are visible" );
});

test( "clone()", function() {

	expect( 45 );

	var div, clone, form, body;

	equal( jQuery("#en").text(), "This is a normal link: Yahoo", "Assert text for #en" );
	equal( jQuery("#first").append( jQuery("#yahoo").clone() ).text(), "Try them out:Yahoo", "Check for clone" );
	equal( jQuery("#en").text(), "This is a normal link: Yahoo", "Reassert text for #en" );

	jQuery.each( "table thead tbody tfoot tr td div button ul ol li select option textarea iframe".split(" "), function( i, nodeName ) {
		equal( jQuery( "<" + nodeName + "/>" ).clone()[ 0 ].nodeName.toLowerCase(), nodeName, "Clone a " + nodeName );
	});
	equal( jQuery("<input type='checkbox' />").clone()[ 0 ].nodeName.toLowerCase(), "input", "Clone a <input type='checkbox' />" );

	// Check cloning non-elements
	equal( jQuery("#nonnodes").contents().clone().length, 3, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );

	// Verify that clones of clones can keep event listeners
	div = jQuery("<div><ul><li>test</li></ul></div>").on( "click", function() {
		ok( true, "Bound event still exists." );
	});
	clone = div.clone( true ); div.remove();
	div = clone.clone( true ); clone.remove();

	equal( div.length, 1, "One element cloned" );
	equal( div[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger("click");

	// Manually clean up detached elements
	div.remove();

	// Verify that cloned children can keep event listeners
	div = jQuery("<div/>").append([ document.createElement("table"), document.createElement("table") ]);
	div.find("table").on( "click", function() {
		ok( true, "Bound event still exists." );
	});

	clone = div.clone( true );
	equal( clone.length, 1, "One element cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find("table").trigger("click");

	// Manually clean up detached elements
	div.remove();
	clone.remove();

	// Make sure that doing .clone() doesn't clone event listeners
	div = jQuery("<div><ul><li>test</li></ul></div>").on( "click", function() {
		ok( false, "Bound event still exists after .clone()." );
	});
	clone = div.clone();

	clone.trigger("click");

	// Manually clean up detached elements
	clone.remove();
	div.remove();

	// Test both html() and clone() for <embed> and <object> types
	div = jQuery("<div/>").html("<embed height='355' width='425' src='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'></embed>");

	clone = div.clone( true );
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// this is technically an invalid object, but because of the special
	// classid instantiation it is the only kind that IE has trouble with,
	// so let's test with it too.
	div = jQuery("<div/>").html("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone( true );
	equal( clone.length, 1, "One element cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div = div.find("object");
	clone = clone.find("object");
	// oldIE adds extra attributes and <param> elements, so just test for existence of the defined set
	jQuery.each( [ "height", "width", "classid" ], function( i, attr ) {
		equal( clone.attr( attr ), div.attr( attr ), "<object> attribute cloned: " + attr );
	} );
	(function() {
		var params = {};

		clone.find("param").each(function( index, param ) {
			params[ param.attributes.name.nodeValue.toLowerCase() ] =
				param.attributes.value.nodeValue.toLowerCase();
		});

		div.find("param").each(function( index, param ) {
			var key = param.attributes.name.nodeValue.toLowerCase();
			equal( params[ key ], param.attributes.value.nodeValue.toLowerCase(), "<param> cloned: " + key );
		});
	})();

	// and here's a valid one.
	div = jQuery("<div/>").html("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	div = jQuery("<div/>").data({ "a": true });
	clone = div.clone( true );
	equal( clone.data("a"), true, "Data cloned." );
	clone.data( "a", false );
	equal( clone.data("a"), false, "Ensure cloned element data object was correctly modified" );
	equal( div.data("a"), true, "Ensure cloned element data object is copied, not referenced" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	form = document.createElement("form");
	form.action = "/test/";

	div = document.createElement("div");
	div.appendChild( document.createTextNode("test") );
	form.appendChild( div );

	equal( jQuery(form).clone().children().length, 1, "Make sure we just get the form back." );

	body = jQuery("body").clone();
	equal( body.children()[ 0 ].id, "qunit", "Make sure cloning body works" );
	body.remove();
});

test( "clone(script type=non-javascript) (#11359)", function() {

	expect( 3 );

	var src = jQuery("<script type='text/filler'>Lorem ipsum dolor sit amet</script><q><script type='text/filler'>consectetur adipiscing elit</script></q>"),
		dest = src.clone();

	equal( dest[ 0 ].text, "Lorem ipsum dolor sit amet", "Cloning preserves script text" );
	equal( dest.last().html(), src.last().html(), "Cloning preserves nested script text" );
	ok( /^\s*<scr.pt\s+type=['"]?text\/filler['"]?\s*>consectetur adipiscing elit<\/scr.pt>\s*$/i.test( dest.last().html() ), "Cloning preserves nested script text" );
	dest.remove();
});

test( "clone(form element) (Bug #3879, #6655)", function() {

	expect( 5 );

	var clone, element;

	element = jQuery("<select><option>Foo</option><option value='selected' selected>Bar</option></select>");

	equal( element.clone().find("option").filter(function() { return this.selected; }).val(), "selected", "Selected option cloned correctly" );

	element = jQuery("<input type='checkbox' value='foo'>").attr( "checked", "checked" );
	clone = element.clone();

	equal( clone.is(":checked"), element.is(":checked"), "Checked input cloned correctly" );
	equal( clone[ 0 ].defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	element = jQuery("<input type='text' value='foo'>");
	clone = element.clone();
	equal( clone[ 0 ].defaultValue, "foo", "Text input defaultValue cloned correctly" );

	element = jQuery("<textarea>foo</textarea>");
	clone = element.clone();
	equal( clone[ 0 ].defaultValue, "foo", "Textarea defaultValue cloned correctly" );
});

test( "clone(multiple selected options) (Bug #8129)", function() {

	expect( 1 );

	var element = jQuery("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

	equal( element.clone().find("option:selected").length, element.find("option:selected").length, "Multiple selected options cloned correctly" );

});

test( "html(undefined)", function() {

	expect( 1 );

	equal( jQuery("#foo").html("<i>test</i>").html(undefined).html().toLowerCase(), "<i>test</i>", ".html(undefined) is chainable (#5571)" );
});

test( "html() on empty set", function() {

	expect( 1 );

	strictEqual( jQuery().html(), undefined, ".html() returns undefined for empty sets (#11962)" );
});

function childNodeNames( node ) {
	return jQuery.map( node.childNodes, function( child ) {
		return child.nodeName.toUpperCase();
	}).join(" ");
}

function testHtml( valueObj ) {
	expect( 40 );

	var actual, expected, tmp,
		div = jQuery("<div></div>"),
		fixture = jQuery("#qunit-fixture");

	div.html( valueObj("<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>") );
	equal( div.children().length, 2, "Found children" );
	equal( div.children().children().length, 1, "Found grandchild" );

	actual = []; expected = [];
	tmp = jQuery("<map/>").html( valueObj("<area alt='area'/>") ).each(function() {
		expected.push("AREA");
		actual.push( childNodeNames( this ) );
	});
	equal( expected.length, 1, "Expecting one parent" );
	deepEqual( actual, expected, "Found the inserted area element" );

	equal( div.html(valueObj(5)).html(), "5", "Setting a number as html" );
	equal( div.html(valueObj(0)).html(), "0", "Setting a zero as html" );
	equal( div.html(valueObj(Infinity)).html(), "Infinity", "Setting Infinity as html" );
	equal( div.html(valueObj(NaN)).html(), "", "Setting NaN as html" );
	equal( div.html(valueObj(1e2)).html(), "100", "Setting exponential number notation as html" );

	div.html( valueObj("&#160;&amp;") );
	equal(
		div[ 0 ].innerHTML.replace( /\xA0/, "&nbsp;" ),
		"&nbsp;&amp;",
		"Entities are passed through correctly"
	);

	tmp = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( div.html(valueObj(tmp) ).html().replace( />/g, "&gt;" ), tmp, "Escaped html" );
	tmp = "x" + tmp;
	equal( div.html(valueObj( tmp )).html().replace( />/g, "&gt;" ), tmp, "Escaped html, leading x" );
	tmp = " " + tmp.slice( 1 );
	equal( div.html(valueObj( tmp )).html().replace( />/g, "&gt;" ), tmp, "Escaped html, leading space" );

	actual = []; expected = []; tmp = {};
	jQuery("#nonnodes").contents().html( valueObj("<b>bold</b>") ).each(function() {
		var html = jQuery( this ).html();
		tmp[ this.nodeType ] = true;
		expected.push( this.nodeType === 1 ? "<b>bold</b>" : undefined );
		actual.push( html ? html.toLowerCase() : html );
	});
	deepEqual( actual, expected, "Set containing element, text node, comment" );
	ok( tmp[ 1 ], "element" );
	ok( tmp[ 3 ], "text node" );
	ok( tmp[ 8 ], "comment" );

	actual = []; expected = [];
	fixture.children("div").html( valueObj("<b>test</b>") ).each(function() {
		expected.push("B");
		actual.push( childNodeNames( this ) );
	});
	equal( expected.length, 7, "Expecting many parents" );
	deepEqual( actual, expected, "Correct childNodes after setting HTML" );

	actual = []; expected = [];
	fixture.html( valueObj("<style>.foobar{color:green;}</style>") ).each(function() {
		expected.push("STYLE");
		actual.push( childNodeNames( this ) );
	});
	equal( expected.length, 1, "Expecting one parent" );
	deepEqual( actual, expected, "Found the inserted style element" );

	fixture.html( valueObj("<select/>") );
	jQuery("#qunit-fixture select").html( valueObj("<option>O1</option><option selected='selected'>O2</option><option>O3</option>") );
	equal( jQuery("#qunit-fixture select").val(), "O2", "Selected option correct" );

	tmp = fixture.html(
		valueObj([
			"<script type='something/else'>ok( false, 'evaluated: non-script' );</script>",
			"<script type='text/javascript'>ok( true, 'evaluated: text/javascript' );</script>",
			"<script type='text/ecmascript'>ok( true, 'evaluated: text/ecmascript' );</script>",
			"<script>ok( true, 'evaluated: no type' );</script>",
			"<div>",
				"<script type='something/else'>ok( false, 'evaluated: inner non-script' );</script>",
				"<script type='text/javascript'>ok( true, 'evaluated: inner text/javascript' );</script>",
				"<script type='text/ecmascript'>ok( true, 'evaluated: inner text/ecmascript' );</script>",
				"<script>ok( true, 'evaluated: inner no type' );</script>",
			"</div>"
		].join(""))
	).find("script");
	equal( tmp.length, 8, "All script tags remain." );
	equal( tmp[ 0 ].type, "something/else", "Non-evaluated type." );
	equal( tmp[ 1 ].type, "text/javascript", "Evaluated type." );

	fixture.html( valueObj("<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>") );
	fixture.html( valueObj("<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>") );
	fixture.html( valueObj("<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>") );
	fixture.html( valueObj("foo <form><script type='text/javascript'>ok( true, 'Injection of identical script (#975)' );</script></form>") );

	jQuery.scriptorder = 0;
	fixture.html( valueObj([
		"<script>",
			"equal( jQuery('#scriptorder').length, 1,'Execute after html' );",
			"equal( jQuery.scriptorder++, 0, 'Script is executed in order' );",
		"</script>",
		"<span id='scriptorder'><script>equal( jQuery.scriptorder++, 1, 'Script (nested) is executed in order');</script></span>",
		"<script>equal( jQuery.scriptorder++, 2, 'Script (unnested) is executed in order' );</script>"
	].join("")) );

	fixture.html( valueObj( fixture.text() ) );
	ok( /^[^<]*[^<\s][^<]*$/.test( fixture.html() ), "Replace html with text" );
}

test( "html(String|Number)", function() {
	testHtml( manipulationBareObj );
});

test( "html(Function)", function() {
	testHtml( manipulationFunctionReturningObj );
});

test( "html(Function) with incoming value -- direct selection", function() {

	expect( 4 );

	var els, actualhtml, pass;

	els = jQuery("#foo > p");
	actualhtml = els.map(function() {
		return jQuery( this ).html();
	});

	els.html(function( i, val ) {
		equal( val, actualhtml[ i ], "Make sure the incoming value is correct." );
		return "<b>test</b>";
	});

	pass = true;
	els.each(function() {
		if ( this.childNodes.length !== 1 ) {
			pass = false;
		}
	});
	ok( pass, "Set HTML" );
});

test( "html(Function) with incoming value -- jQuery.contents()", function() {

	expect( 14 );

  var actualhtml, j, $div, $div2, insert;

	j = jQuery("#nonnodes").contents();
	actualhtml = j.map(function() {
		return jQuery( this ).html();
	});

	j.html(function( i, val ) {
		equal( val, actualhtml[ i ], "Make sure the incoming value is correct." );
		return "<b>bold</b>";
	});

	// Handle the case where no comment is in the document
	if ( j.length === 2 ) {
		equal( null, null, "Make sure the incoming value is correct." );
	}

	equal( j.html().replace( / xmlns="[^"]+"/g, "" ).toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	$div = jQuery("<div />");

	equal( $div.html(function( i, val ) {
		equal( val, "", "Make sure the incoming value is correct." );
		return 5;
	}).html(), "5", "Setting a number as html" );

	equal( $div.html(function( i, val ) {
		equal( val, "5", "Make sure the incoming value is correct." );
		return 0;
	}).html(), "0", "Setting a zero as html" );

	$div2 = jQuery("<div/>");
	insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( $div2.html(function( i, val ) {
		equal( val, "", "Make sure the incoming value is correct." );
		return insert;
	}).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );

	equal( $div2.html(function( i, val ) {
		equal( val.replace(/>/g, "&gt;"), insert, "Make sure the incoming value is correct." );
		return "x" + insert;
	}).html().replace( />/g, "&gt;" ), "x" + insert, "Verify escaped insertion." );

	equal( $div2.html(function( i, val ) {
		equal( val.replace( />/g, "&gt;" ), "x" + insert, "Make sure the incoming value is correct." );
		return " " + insert;
	}).html().replace( />/g, "&gt;" ), " " + insert, "Verify escaped insertion." );
});

test( "remove() no filters", function() {

  expect( 3 );

	var first = jQuery("#ap").children().first();

	first.data("foo", "bar");

	jQuery("#ap").children().remove();
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( jQuery("#ap").children().length, 0, "Check remove" );

	equal( first.data("foo"), null, "first data" );

});

test( "remove() with filters", function() {

  expect( 8 );

  var markup, div;
	jQuery("#ap").children().remove("a");
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( jQuery("#ap").children().length, 1, "Check filtered remove" );

	jQuery("#ap").children().remove("a, code");
	equal( jQuery("#ap").children().length, 0, "Check multi-filtered remove" );

	// Positional and relative selectors
	markup = "<div><span>1</span><span>2</span><span>3</span><span>4</span></div>";
	div = jQuery( markup );
	div.children().remove("span:nth-child(2n)");
	equal( div.text(), "13", "relative selector in remove" );
	div = jQuery( markup );
	div.children().remove("span:first");
	equal( div.text(), "234", "positional selector in remove" );
	div = jQuery( markup );
	div.children().remove("span:last");
	equal( div.text(), "123", "positional selector in remove" );

	// using contents will get comments regular, text, and comment nodes
	// Handle the case where no comment is in the document
	ok( jQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment remove works" );
	jQuery("#nonnodes").contents().remove();
	equal( jQuery("#nonnodes").contents().length, 0, "Check node,textnode,comment remove works" );
});

test( "remove() event cleaning ", 1, function() {
	var count, first, cleanUp;

	count = 0;
	first = jQuery("#ap").children().first();
	cleanUp = first.on( "click", function() {
		count++;
	}).remove().appendTo("#qunit-fixture").trigger("click");

	strictEqual( 0, count, "Event handler has been removed" );

	// Clean up detached data
	cleanUp.remove();
});

test( "remove() in document order #13779", 1, function() {
	var last,
		cleanData = jQuery.cleanData;

	jQuery.cleanData = function( nodes ) {
		last = jQuery.text( nodes[0] );
		cleanData.call( this, nodes );
	};

	jQuery("#qunit-fixture").append(
		jQuery.parseHTML(
			"<div class='removal-fixture'>1</div>" +
			"<div class='removal-fixture'>2</div>" +
			"<div class='removal-fixture'>3</div>"
		)
	);

	jQuery(".removal-fixture").remove();

	equal( last, 3, "The removal fixtures were removed in document order" );

	jQuery.cleanData = cleanData;
});

test("detach() no filters", function () {

  expect(3);

  var first = jQuery("#ap").children().first();

  first.data("foo", "bar");

  jQuery("#ap").children().detach();
  ok(jQuery("#ap").text().length > 10, "Check text is not removed");
  equal(jQuery("#ap").children().length, 0, "Check remove");

  equal(first.data("foo"), "bar");
  first.remove();

});

test("detach() with filters", function () {

  expect(8);

  var markup, div;
  jQuery("#ap").children().detach("a");
  ok(jQuery("#ap").text().length > 10, "Check text is not removed");
  equal(jQuery("#ap").children().length, 1, "Check filtered remove");

  jQuery("#ap").children().detach("a, code");
  equal(jQuery("#ap").children().length, 0, "Check multi-filtered remove");

  // Positional and relative selectors
  markup = "<div><span>1</span><span>2</span><span>3</span><span>4</span></div>";
  div = jQuery(markup);
  div.children().detach("span:nth-child(2n)");
  equal(div.text(), "13", "relative selector in detach");
  div = jQuery(markup);
  div.children().detach("span:first");
  equal(div.text(), "234", "positional selector in detach");
  div = jQuery(markup);
  div.children().detach("span:last");
  equal(div.text(), "123", "positional selector in detach");

  // using contents will get comments regular, text, and comment nodes
  // Handle the case where no comment is in the document
  ok(jQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment remove works");
  jQuery("#nonnodes").contents().detach();
  equal(jQuery("#nonnodes").contents().length, 0, "Check node,textnode,comment remove works");
});

test( "detach() event cleaning ", 1, function() {
	var count, first, cleanUp;

	count = 0;
	first = jQuery("#ap").children().first();
	cleanUp = first.on( "click", function() {
		count++;
	}).detach().appendTo("#qunit-fixture").trigger("click");

	strictEqual( 1, count, "Event handler has not been removed" );

	// Clean up detached data
	cleanUp.remove();
});

test("empty()", function() {

	expect( 3 );

	equal( jQuery("#ap").children().empty().text().length, 0, "Check text is removed" );
	equal( jQuery("#ap").children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.empty();
	equal( j.html(), "", "Check node,textnode,comment empty works" );
});


