test( "attr(String)", function() {
	expect( 50 );

	var extras, body, $body,
		select, optgroup, option, $img, styleElem,
		$button, $form, $a;

	equal( jQuery("#text1").attr("type"), "text", "Check for type attribute" );
	equal( jQuery("#radio1").attr("type"), "radio", "Check for type attribute" );
	equal( jQuery("#check1").attr("type"), "checkbox", "Check for type attribute" );
	equal( jQuery("#simon1").attr("rel"), "bookmark", "Check for rel attribute" );
	equal( jQuery("#google").attr("title"), "Google!", "Check for title attribute" );
	equal( jQuery("#mark").attr("hreflang"), "en", "Check for hreflang attribute" );
	equal( jQuery("#en").attr("lang"), "en", "Check for lang attribute" );
	equal( jQuery("#simon").attr("class"), "blog link", "Check for class attribute" );
	equal( jQuery("#name").attr("name"), "name", "Check for name attribute" );
	equal( jQuery("#text1").attr("name"), "action", "Check for name attribute" );
	equal( jQuery("#text1").attr("value", "t").attr("value"), "t", "Check setting the value attribute" );
	equal( jQuery("#text1").attr("value", "").attr("value"), "", "Check setting the value attribute to empty string" );
	equal( jQuery("<div value='t'></div>").attr("value"), "t", "Check setting custom attr named 'value' on a div" );
	equal( jQuery("#form").attr("blah", "blah").attr("blah"), "blah", "Set non-existent attribute on a form" );
	equal( jQuery("#foo").attr("height"), undefined, "Non existent height attribute should return undefined" );

	// [7472] & [3113] (form contains an input with name="action" or name="id")
	extras = jQuery("<input id='id' name='id' /><input id='name' name='name' /><input id='target' name='target' />").appendTo("#testForm");
	equal( jQuery("#form").attr("action","newformaction").attr("action"), "newformaction", "Check that action attribute was changed" );
	equal( jQuery("#testForm").attr("target"), undefined, "Retrieving target does not equal the input with name=target" );
	equal( jQuery("#testForm").attr("target", "newTarget").attr("target"), "newTarget", "Set target successfully on a form" );
	equal( jQuery("#testForm").removeAttr("id").attr("id"), undefined, "Retrieving id does not equal the input with name=id after id is removed [#7472]" );
	// Bug #3685 (form contains input with name="name")
	equal( jQuery("#testForm").attr("name"), undefined, "Retrieving name does not retrieve input with name=name" );
	extras.remove();

	equal( jQuery("#text1").attr("maxlength"), "30", "Check for maxlength attribute" );
	equal( jQuery("#text1").attr("maxLength"), "30", "Check for maxLength attribute" );
	equal( jQuery("#area1").attr("maxLength"), "30", "Check for maxLength attribute" );

	// using innerHTML in IE causes href attribute to be serialized to the full path
	jQuery("<a/>").attr({
		"id": "tAnchor5",
		"href": "#5"
	}).appendTo("#qunit-fixture");
	equal( jQuery("#tAnchor5").attr("href"), "#5", "Check for non-absolute href (an anchor)" );
	jQuery("<a id='tAnchor6' href='#5' />").appendTo("#qunit-fixture");
	equal( jQuery("#tAnchor5").prop("href"), jQuery("#tAnchor6").prop("href"), "Check for absolute href prop on an anchor" );

	jQuery("<script type='jquery/test' src='#5' id='scriptSrc'></script>").appendTo("#qunit-fixture");
	equal( jQuery("#tAnchor5").prop("href"), jQuery("#scriptSrc").prop("src"), "Check for absolute src prop on a script" );

	// list attribute is readonly by default in browsers that support it
	jQuery("#list-test").attr( "list", "datalist" );
	equal( jQuery("#list-test").attr("list"), "datalist", "Check setting list attribute" );

	// Related to [5574] and [5683]
	body = document.body;
	$body = jQuery( body );

	strictEqual( $body.attr("foo"), undefined, "Make sure that a non existent attribute returns undefined" );

	body.setAttribute( "foo", "baz" );
	equal( $body.attr("foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found" );

	$body.attr( "foo","cool" );
	equal( $body.attr("foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available" );

	body.removeAttribute("foo"); // Cleanup

	select = document.createElement("select");
	optgroup = document.createElement("optgroup");
	option = document.createElement("option");

	optgroup.appendChild( option );
	select.appendChild( optgroup );

	equal( jQuery( option ).prop("selected"), true, "Make sure that a single option is selected, even when in an optgroup." );

	$img = jQuery("<img style='display:none' width='215' height='53' src='data/1x1.jpg'/>").appendTo("body");
	equal( $img.attr("width"), "215", "Retrieve width attribute an an element with display:none." );
	equal( $img.attr("height"), "53", "Retrieve height attribute an an element with display:none." );

	// Check for style support
	styleElem = jQuery("<div/>").appendTo("#qunit-fixture").css({
		background: "url(UPPERlower.gif)"
	});
	ok( !!~styleElem.attr("style").indexOf("UPPERlower.gif"), "Check style attribute getter" );
	ok( !!~styleElem.attr("style", "position:absolute;").attr("style").indexOf("absolute"), "Check style setter" );

	// Check value on button element (#1954)
	$button = jQuery("<button>text</button>").insertAfter("#button");
	strictEqual( $button.attr("value"), undefined, "Absence of value attribute on a button" );
	equal( $button.attr( "value", "foobar" ).attr("value"), "foobar", "Value attribute on a button does not return innerHTML" );
	equal( $button.attr("value", "baz").html(), "text", "Setting the value attribute does not change innerHTML" );

	// Attributes with a colon on a table element (#1591)
	equal( jQuery("#table").attr("test:attrib"), undefined, "Retrieving a non-existent attribute on a table with a colon does not throw an error." );
	equal( jQuery("#table").attr( "test:attrib", "foobar" ).attr("test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error." );

	$form = jQuery("<form class='something'></form>").appendTo("#qunit-fixture");
	equal( $form.attr("class"), "something", "Retrieve the class attribute on a form." );

	$a = jQuery("<a href='#' onclick='something()'>Click</a>").appendTo("#qunit-fixture");
	equal( $a.attr("onclick"), "something()", "Retrieve ^on attribute without anonymous function wrapper." );

	ok( jQuery("<div/>").attr("doesntexist") === undefined, "Make sure undefined is returned when no attribute is found." );
	ok( jQuery("<div/>").attr("title") === undefined, "Make sure undefined is returned when no attribute is found." );
	equal( jQuery("<div/>").attr( "title", "something" ).attr("title"), "something", "Set the title attribute." );
	ok( jQuery().attr("doesntexist") === undefined, "Make sure undefined is returned when no element is there." );
	equal( jQuery("<div/>").attr("value"), undefined, "An unset value on a div returns undefined." );
	strictEqual( jQuery("<select><option value='property'></option></select>").attr("value"), undefined, "An unset value on a select returns undefined." );

	$form = jQuery("#form").attr( "enctype", "multipart/form-data" );
	equal( $form.prop("enctype"), "multipart/form-data", "Set the enctype of a form (encoding in IE6/7 #6743)" );

});





test( "attr(String, Function)", function() {
	expect( 2 );

	equal(
		jQuery("#text1").attr( "value", function() {
			return this.id;
		}).attr("value"),
		"text1",
		"Set value from id"
	);

	equal(
		jQuery("#text1").attr( "title", function(i) {
			return i;
		}).attr("title"),
		"0",
		"Set value with an index"
	);
});

test( "attr(Hash)", function() {
	expect( 3 );
	var pass = true;
	jQuery("div").attr({
		"foo": "baz",
		"zoo": "ping"
	}).each(function() {
		if ( this.getAttribute("foo") !== "baz" && this.getAttribute("zoo") !== "ping" ) {
			pass = false;
		}
	});

	ok( pass, "Set Multiple Attributes" );

	equal(
		jQuery("#text1").attr({
			"value": function() {
				return this["id"];
			}}).attr("value"),
		"text1",
		"Set attribute to computed value #1"
	);

	equal(
		jQuery("#text1").attr({
			"title": function(i) {
				return i;
			}
		}).attr("title"),
		"0",
		"Set attribute to computed value #2"
	);
});


