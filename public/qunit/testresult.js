(function() {
	var testRunner = window.parent;
	
	window.QUnit.done = function() {
		debugger;
		testRunner.QUnit.done(arguments);
	}
})();