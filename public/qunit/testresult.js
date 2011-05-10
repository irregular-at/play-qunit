(function() {
	var testRunner = window.parent;
	var lastFailed, tests = [];	
	
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
	//			actual : 'afas',
	//			expected : 'asdfasdf',
	//			message : 'blubbbb',
	//			source: 'http://localhost:9000/test.html:12'
	//		}]
	//	}
	
	/**
	 * Called for every finished QUnit test
	 */
	window.QUnit.testDone = function(result) {
		var test = {
			name : result.name,
			result : (result.failed > 0) ? false : true
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
		testRunner.testFinished({
			summary : result,
			tests : tests
		});
	};
})();