module("css");

test("css(String|Hash)", function() {
	expect( 42 );

	equal( jQuery("#qunit-fixture").css("display"), "block", "Check for css property \"display\"" );

	var $child, div, div2, width, height, child, prctval, checkval, old;

	$child = jQuery("#nothiddendivchild").css({ "width": "20%", "height": "20%" });
	notEqual( $child.css("width"), "20px", "Retrieving a width percentage on the child of a hidden div returns percentage" );
	notEqual( $child.css("height"), "20px", "Retrieving a height percentage on the child of a hidden div returns percentage" );

	div = jQuery( "<div/>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	equal( div.css("width"), "0px", "Width on disconnected node." );
	equal( div.css("height"), "0px", "Height on disconnected node." );

	div.css({ "width": 4, "height": 4 });

	equal( div.css("width"), "4px", "Width on disconnected node." );
	equal( div.css("height"), "4px", "Height on disconnected node." );

	div2 = jQuery( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo("body");

	equal( div2.find("input").css("height"), "20px", "Height on hidden input." );
	equal( div2.find("textarea").css("height"), "20px", "Height on hidden textarea." );
	equal( div2.find("div").css("height"), "20px", "Height on hidden textarea." );

	div2.remove();

	// handle negative numbers by setting to zero #11604
	jQuery("#nothiddendiv").css( {"width": 1, "height": 1} );

	width = parseFloat(jQuery("#nothiddendiv").css("width"));
	height = parseFloat(jQuery("#nothiddendiv").css("height"));
	jQuery("#nothiddendiv").css({ "overflow":"hidden", "width": -1, "height": -1 });
	equal( parseFloat(jQuery("#nothiddendiv").css("width")), 0, "Test negative width set to 0");
	equal( parseFloat(jQuery("#nothiddendiv").css("height")), 0, "Test negative height set to 0");

	equal( jQuery("<div style='display: none;'/>").css("display"), "none", "Styles on disconnected nodes");

	jQuery("#floatTest").css({"float": "right"});
	equal( jQuery("#floatTest").css("float"), "right", "Modified CSS float using \"float\": Assert float is right");
	jQuery("#floatTest").css({"font-size": "30px"});
	equal( jQuery("#floatTest").css("font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
	jQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		jQuery("#foo").css({"opacity": n});

		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery("#foo").css({"opacity": parseFloat(n)});
		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery("#foo").css({"opacity": ""});
	equal( jQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	equal( jQuery("#empty").css("opacity"), "0", "Assert opacity is accessible via filter property set in stylesheet in IE" );
	jQuery("#empty").css({ "opacity": "1" });
	equal( jQuery("#empty").css("opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters" );

	div = jQuery("#nothiddendiv");
	child = jQuery("#nothiddendivchild");

	equal( parseInt(div.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(div.css("font-size"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("font-size"), 10), 16, "Verify fontSize px set." );

	child.css("height", "100%");
	equal( child[0].style.height, "100%", "Make sure the height is being set correctly." );

	child.attr("class", "em");
	equal( parseInt(child.css("fontSize"), 10), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.attr("class", "prct");
	prctval = parseInt(child.css("fontSize"), 10);
	checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	equal( prctval, checkval, "Verify fontSize % set." );

	equal( typeof child.css("width"), "string", "Make sure that a string width is returned from css('width')." );

	old = child[0].style.height;

	// Test NaN
	child.css("height", parseFloat("zoo"));
	equal( child[0].style.height, old, "Make sure height isn't changed on NaN." );

	// Test null
	child.css("height", null);
	equal( child[0].style.height, old, "Make sure height isn't changed on null." );

	old = child[0].style.fontSize;

	// Test NaN
	child.css("font-size", parseFloat("zoo"));
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on NaN." );

	// Test null
	child.css("font-size", null);
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on null." );

	strictEqual( child.css( "x-fake" ), undefined, "Make sure undefined is returned from css(nonexistent)." );

	div = jQuery( "<div/>" ).css({ position: "absolute", "z-index": 1000 }).appendTo( "#qunit-fixture" );
	strictEqual( div.css( "z-index" ), "1000",
		"Make sure that a string z-index is returned from css('z-index') (#14432)." );
});

test( "css() explicit and relative values", 29, function() {
	var $elem = jQuery("#nothiddendiv");

	$elem.css({ "width": 1, "height": 1, "paddingLeft": "1px", "opacity": 1 });
	equal( $elem.css("width"), "1px", "Initial css set or width/height works (hash)" );
	equal( $elem.css("paddingLeft"), "1px", "Initial css set of paddingLeft works (hash)" );
	equal( $elem.css("opacity"), "1", "Initial css set of opacity works (hash)" );

	$elem.css({ width: "+=9" });
	equal( $elem.css("width"), "10px", "'+=9' on width (hash)" );

	$elem.css({ "width": "-=9" });
	equal( $elem.css("width"), "1px", "'-=9' on width (hash)" );

	$elem.css({ "width": "+=9px" });
	equal( $elem.css("width"), "10px", "'+=9px' on width (hash)" );

	$elem.css({ "width": "-=9px" });
	equal( $elem.css("width"), "1px", "'-=9px' on width (hash)" );

	$elem.css( "width", "+=9" );
	equal( $elem.css("width"), "10px", "'+=9' on width (params)" );

	$elem.css( "width", "-=9" ) ;
	equal( $elem.css("width"), "1px", "'-=9' on width (params)" );

	$elem.css( "width", "+=9px" );
	equal( $elem.css("width"), "10px", "'+=9px' on width (params)" );

	$elem.css( "width", "-=9px" );
	equal( $elem.css("width"), "1px", "'-=9px' on width (params)" );

	$elem.css( "width", "-=-9px" );
	equal( $elem.css("width"), "10px", "'-=-9px' on width (params)" );

	$elem.css( "width", "+=-9px" );
	equal( $elem.css("width"), "1px", "'+=-9px' on width (params)" );

	$elem.css({ "paddingLeft": "+=4" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "-=4" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "+=4px" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "-=4px" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on paddingLeft (hash)" );

	$elem.css({ "padding-left": "+=4" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on padding-left (hash)" );

	$elem.css({ "padding-left": "-=4" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on padding-left (hash)" );

	$elem.css({ "padding-left": "+=4px" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (hash)" );

	$elem.css({ "padding-left": "-=4px" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (hash)" );

	$elem.css( "paddingLeft", "+=4" );
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (params)" );

	$elem.css( "paddingLeft", "-=4" );
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (params)" );

	$elem.css( "padding-left", "+=4px" );
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (params)" );

	$elem.css( "padding-left", "-=4px" );
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (params)" );

	$elem.css({ "opacity": "-=0.5" });
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (hash)" );

	$elem.css({ "opacity": "+=0.5" });
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (hash)" );

	$elem.css( "opacity", "-=0.5" );
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (params)" );

	$elem.css( "opacity", "+=0.5" );
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (params)" );
});

test("css(String, Object)", function() {
	expect( 20 );
	var j, div, display, ret, success;

	jQuery("#nothiddendiv").css("top", "-1em");
	ok( jQuery("#nothiddendiv").css("top"), -16, "Check negative number in EMs." );

	jQuery("#floatTest").css("float", "left");
	equal( jQuery("#floatTest").css("float"), "left", "Modified CSS float using \"float\": Assert float is left");
	jQuery("#floatTest").css("font-size", "20px");
	equal( jQuery("#floatTest").css("font-size"), "20px", "Modified CSS font-size: Assert font-size is 20px");

	jQuery("#foo").css("opacity", "");
	equal( jQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );


	div = jQuery("#nothiddendiv");
	display = div.css("display");
	ret = div.css("display", undefined);

	equal( ret, div, "Make sure setting undefined returns the original set." );
	equal( div.css("display"), display, "Make sure that the display wasn't changed." );

	success = true;
	try {
		jQuery( "#foo" ).css( "backgroundColor", "rgba(0, 0, 0, 0.1)" );
	}
	catch (e) {
		success = false;
	}
	ok( success, "Setting RGBA values does not throw Error (#5509)" );

	jQuery( "#foo" ).css( "font", "7px/21px sans-serif" );
	strictEqual( jQuery( "#foo" ).css( "line-height" ), "21px",
		"Set font shorthand property (#14759)" );
});
