(function() {

// Store the old counts so that we only assert on tests that have actually leaked,
// instead of asserting every time a test has leaked sometime in the past
var oldCacheLength = 0,
	oldActive = 0,

	expectedDataKeys = {},
	splice = [].splice,
	ajaxSettings = jQuery.ajaxSettings;

/**
 * QUnit configuration
 */

// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 2e4; // 20 seconds

// Enforce an "expect" argument or expect() call in all test bodies.
QUnit.config.requireExpects = true;


QUnit.done(function() {
});

QUnit.testDone(function() {
	jQuery( "#qunit-fixture" ).empty();

	Globals.cleanup();
});

// Register globals for cleanup and the cleanup code itself
window.Globals = (function() {
	var globals = {};

	return {
		register: function( name ) {
			window[ name ] = globals[ name ] = true;
		},

		cleanup: function() {
			var name;

			for ( name in globals ) {
				delete window[ name ];
			}

			globals = {};
		}
	};
})();

})();
