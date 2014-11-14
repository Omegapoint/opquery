module("core"); //, { teardown: moduleTeardown });


function q() {
  var r = [],
  i = 0;
  for ( ; i < arguments.length; i++ ) {
    r.push( document.getElementById( arguments[i] ) );
  }
  return r;
}

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$" );
});

test("jQuery(selector, context)", function() {
	expect(3);
	deepEqual( jQuery("div p", "#qunit-fixture").get(), q("sndp", "en", "sap"), "Basic selector with string as context" );
	deepEqual( jQuery("div p", q("qunit-fixture")[0]).get(), q("sndp", "en", "sap"), "Basic selector with element as context" );
	deepEqual( jQuery("div p", jQuery("#qunit-fixture")).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );
});

test("trim", function() {
	expect(13);

	var nbsp = String.fromCharCode(160);

	equal( jQuery.trim("hello  "), "hello", "trailing space" );
	equal( jQuery.trim("  hello"), "hello", "leading space" );
	equal( jQuery.trim("  hello   "), "hello", "space on both sides" );
	equal( jQuery.trim("  " + nbsp + "hello  " + nbsp + " "), "hello", "&nbsp;" );

	equal( jQuery.trim(), "", "Nothing in." );
	equal( jQuery.trim( undefined ), "", "Undefined" );
	equal( jQuery.trim( null ), "", "Null" );
	equal( jQuery.trim( 5 ), "5", "Number" );
	equal( jQuery.trim( false ), "false", "Boolean" );

	equal( jQuery.trim(" "), "", "space should be trimmed" );
	equal( jQuery.trim("ipad\xA0"), "ipad", "nbsp should be trimmed" );
	equal( jQuery.trim("\uFEFF"), "", "zwsp should be trimmed" );
	equal( jQuery.trim("\uFEFF \xA0! | \uFEFF"), "! |", "leading/trailing should be trimmed" );
});

test("type", function() {
	expect( 28 );

	equal( jQuery.type(null), "null", "null" );
	equal( jQuery.type(undefined), "undefined", "undefined" );
	equal( jQuery.type(true), "boolean", "Boolean" );
	equal( jQuery.type(false), "boolean", "Boolean" );
	equal( jQuery.type(Boolean(true)), "boolean", "Boolean" );
	equal( jQuery.type(0), "number", "Number" );
	equal( jQuery.type(1), "number", "Number" );
	equal( jQuery.type(Number(1)), "number", "Number" );
	equal( jQuery.type(""), "string", "String" );
	equal( jQuery.type("a"), "string", "String" );
	equal( jQuery.type(String("a")), "string", "String" );
	equal( jQuery.type({}), "object", "Object" );
	equal( jQuery.type(/foo/), "regexp", "RegExp" );
	equal( jQuery.type(new RegExp("asdf")), "regexp", "RegExp" );
	equal( jQuery.type([1]), "array", "Array" );
	equal( jQuery.type(new Date()), "date", "Date" );
	equal( jQuery.type(new Function("return;")), "function", "Function" );
	equal( jQuery.type(function(){}), "function", "Function" );
	equal( jQuery.type(new Error()), "error", "Error" );
	equal( jQuery.type(window), "object", "Window" );
	equal( jQuery.type(document), "object", "Document" );
	equal( jQuery.type(document.body), "object", "Element" );
	equal( jQuery.type(document.createTextNode("foo")), "object", "TextNode" );
	equal( jQuery.type(document.getElementsByTagName("*")), "object", "NodeList" );

	// Avoid Lint complaints
	var MyString = String,
		MyNumber = Number,
		MyBoolean = Boolean,
		MyObject = Object;
	equal( jQuery.type(new MyBoolean(true)), "boolean", "Boolean" );
	equal( jQuery.type(new MyNumber(1)), "number", "Number" );
	equal( jQuery.type(new MyString("a")), "string", "String" );
	equal( jQuery.type(new MyObject()), "object", "Object" );
});

test("isFunction", function() {
	expect(19);

	var mystr, myarr, myfunction, fn, obj, nodes, first, input, a;

	// Make sure that false values return false
	ok( !jQuery.isFunction(), "No Value" );
	ok( !jQuery.isFunction( null ), "null Value" );
	ok( !jQuery.isFunction( undefined ), "undefined Value" );
	ok( !jQuery.isFunction( "" ), "Empty String Value" );
	ok( !jQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	ok( jQuery.isFunction(String), "String Function("+String+")" );
	ok( jQuery.isFunction(Array), "Array Function("+Array+")" );
	ok( jQuery.isFunction(Object), "Object Function("+Object+")" );
	ok( jQuery.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	mystr = "function";
	ok( !jQuery.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	myarr = [ "function" ];
	ok( !jQuery.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	myfunction = { "function": "test" };
	ok( !jQuery.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	fn = function(){};
	ok( jQuery.isFunction(fn), "Normal Function" );

	obj = document.createElement("object");

	// Firefox says this is a function
	ok( !jQuery.isFunction(obj), "Object Element" );

	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !jQuery.isFunction(nodes), "childNodes Property" );

	first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !jQuery.isFunction(first), "A normal DOM Element" );

	input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !jQuery.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( jQuery.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	}

	callme(function(){
		callme(function(){});
	});
});

test( "isNumeric", function() {
	expect( 38 );

	var t = jQuery.isNumeric,
		ToString = function( value ) {
			this.toString = function() {
				return String( value );
			};
		};

	ok( t( "-10" ), "Negative integer string" );
	ok( t( "0" ), "Zero string" );
	ok( t( "5" ), "Positive integer string" );
	ok( t( -16 ), "Negative integer number" );
	ok( t( 0 ), "Zero integer number" );
	ok( t( 32 ), "Positive integer number" );
	ok( t( "040" ), "Octal integer literal string" );
	ok( t( "0xFF" ), "Hexadecimal integer literal string" );
	ok( t( 0xFFF ), "Hexadecimal integer literal" );
	ok( t( "-1.6" ), "Negative floating point string" );
	ok( t( "4.536" ), "Positive floating point string" );
	ok( t( -2.6 ), "Negative floating point number" );
	ok( t( 3.1415 ), "Positive floating point number" );
	ok( t( 1.5999999999999999 ), "Very precise floating point number" );
	ok( t( 8e5 ), "Exponential notation" );
	ok( t( "123e-2" ), "Exponential notation string" );
	ok( t( new ToString( "42" ) ), "Custom .toString returning number" );

	equal( t( "" ), false, "Empty string" );
	equal( t( "        " ), false, "Whitespace characters string" );
	equal( t( "\t\t" ), false, "Tab characters string" );
	equal( t( "abcdefghijklm1234567890" ), false, "Alphanumeric character string" );
	equal( t( "xabcdefx" ), false, "Non-numeric character string" );
	equal( t( true ), false, "Boolean true literal" );
	equal( t( false ), false, "Boolean false literal" );
	equal( t( "bcfed5.2" ), false, "Number with preceding non-numeric characters" );
	equal( t( "7.2acdgs" ), false, "Number with trailling non-numeric characters" );
	equal( t( undefined ), false, "Undefined value" );
	equal( t( null ), false, "Null value" );
	equal( t( NaN ), false, "NaN value" );
	equal( t( Infinity ), false, "Infinity primitive" );
	equal( t( Number.POSITIVE_INFINITY ), false, "Positive Infinity" );
	equal( t( Number.NEGATIVE_INFINITY ), false, "Negative Infinity" );
	equal( t( new ToString( "Devo" ) ), false, "Custom .toString returning non-number" );
	equal( t( {} ), false, "Empty object" );
	equal( t( [] ), false, "Empty array" );
	equal( t( [ 42 ] ), false, "Array with one number" );
	equal( t( function(){} ), false, "Instance of a function" );
	equal( t( new Date() ), false, "Instance of a Date" );
});

test("get()", function() {
	expect(1);
	deepEqual( jQuery("#qunit-fixture p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("get(Number)", function() {
	expect(2);
	equal( jQuery("#qunit-fixture p").get(0), document.getElementById("firstp"), "Get A Single Element" );
	strictEqual( jQuery("#firstp").get(1), undefined, "Try get with index larger elements count" );
});

test("get(-Number)",function() {
	expect(2);
	equal( jQuery("p").get(-1), document.getElementById("first"), "Get a single element with negative index" );
	strictEqual( jQuery("#firstp").get(-2), undefined, "Try get with index negative index larger then elements count" );
});

test("each(Function)", function() {
	expect(1);
	var div, pass, i;

	div = jQuery("div");
	div.each(function(){this.foo = "zoo";});
	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( div.get(i).foo !== "zoo" ) {
			pass = false;
		}
	}
	ok( pass, "Execute a function, Relative" );
});

test("first()/last()", function() {
	expect(4);

	var $links = jQuery("#ap a"), $none = jQuery("asdf");

	deepEqual( $links.first().get(), q("google"), "first()" );
	deepEqual( $links.last().get(), q("mark"), "last()" );

	deepEqual( $none.first().get(), [], "first() none" );
	deepEqual( $none.last().get(), [], "last() none" );
});


