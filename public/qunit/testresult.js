(function() {
	var testRunner = window.parent;
	var lastFailed, tests = [];
	var lastStart;
	
	/**
	 * Called from QUnit for every assert
	 */
	window.QUnit.log = function(assert) {
		if(assert.result == false) {
			lastFailed = assert;
		}
	};
	
	//	Structure of the final result that is passed to the testrunner.
	//	Actual, expected and message are only available for failed tests.
	//	
	//	{
	//		summary : {
	//			failed : 0,
	//			passed : 5,
	//			total : 5,
	//			runtime : 1022
	//		},
	//		tests : [{ 
	//			name : 'The test that run',
	//			result : false,
	//			runtime : 220,
	//			actual : 'afas',
	//			expected : 'asdfasdf',
	//			message : 'blubbbb',
	//			source: 'http://localhost:9000/test.html:12'
	//		}]
	//	}
	
	/**
	 * Called on start of a test, we use it to measure the test time
	 */
	window.QUnit.testStart = function(name) {
		lastStart = new Date().getTime();
	}
	
	/**
	 * Called for every finished QUnit test
	 */
	window.QUnit.testDone = function(result) {
		var runtime = new Date().getTime() - lastStart;
		var test = {
			name : result.name,
			result : (result.failed > 0) ? false : true,
			runtime : runtime
		};
		if (test.result === false) {
			test.actual = lastFailed.actual;
			test.expected = lastFailed.expected;
			test.message = lastFailed.message;
			test.source = $('.fail:last')
				.find('.test-source pre')
				.html();
		}
		tests.push(test);
	};
	
	/**
	 * Called from QUnit when the whole test file is finished
	 */
	window.QUnit.done = function(result) {
		if (typeof testRunner.testFinished === 'function') {
			testRunner.testFinished({
				summary : result,
				tests : tests
			});
		}
	};
})();