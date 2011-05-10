$(function() {
	var title = window.top.document.title;
	
	// ajax status
	$('#loading').ajaxStart(function() {
		$(this).show();
	}).ajaxStop(function() {
		$(this).hide();
	});
	
	var testError = function(msg) {
		window.location = bookmark()
		stop();
		updateSelected();
	}
			
	var run = function() {
		updateSelected();
		$(document.body).addClass('running');
		$('.test, #header').removeClass('passed').removeClass('failed');
		
		runNextTest();
	}

	// runs the next test
	var runNextTest = function() {
		if($(document.body).is('.running')) {
			var test = $('.test.selected:not(.passed,.failed):first');
			if(test.size()) {
				var testId = test.attr('id');
				runTest(testId, test);
			} else {
				result();
			}
		}					
	}
	
	// run a single QUnit test file
	var runTest = function(testId, test) {
		var frame =  window.frames[0];
		
		test.addClass('passing');
		$('.touch', test).html('&nbsp;');
		$('#qunit,#qunit-mask').show();
		$('#qunit-runner').attr('src', baseUrl() + '/run' + testId);
		
		window.QUnit = {};
		window.QUnit.done = function(result) {
			testSuccess(test, 'success!');
			$('#qunit,#qunit-mask').hide();
		}
	};
	
	// show the test result (= stop)
	var result = function() {
		$('#qunit-mask, #qunit').hide();
		$('#qunit-runner').attr('src', 'about:blank');
		clearInterval(window.checkResult);
		$(document.body).removeClass('running');
		$('.passing').removeClass('passing');
		if($('.test.failed').size()) {
			$('#header').addClass('failed');
		} else {
			$('#header').addClass('passed');
		}
		var areFailedTests = $('.test.failed').size();
		if(areFailedTests) {
			var skip = $("#header").outerHeight();
			skip += $("#results").outerHeight();
			$.scrollTo($('.test.failed').offset().top - skip, 500);
		}
	};
	
	/**
	 * Should be called when a test has successfully finished.
	 * @param test The jQuery object of the failed test
	 * @param result The html of the result to display
	 */
	var testSuccess = function(test, result) {
		test.removeClass('passing').addClass('passed');
		$('.touch', test).html('+');
		$('.testResult', test).html(result);
		window.top.document.title = title;
		runNextTest();
	};
	
	/**
	 * Should be called when a test is failed.
	 * @param test The jQuery object of the failed test
	 * @param result The html of the result to display
	 */
	var testFail = function(test, result) {
		test.removeClass('passing').addClass('failed');
		$('.touch', test).html('-');
		$('.testResult', test).html(result).show();
		window.top.document.title = title;
		stop();
	};
	
	// stops the tests
	var stop = function() {
		result();
	};
	
	// update the view of selected tests
	var updateSelected = function() {
		var nb = $('.test.selected').size();
		if(nb) {
			$('.nbToRun').text(nb);
			$('.nbToRunPluralize').text((nb>1) ? 's' : '');
			$('#start').removeAttr('disabled').removeClass('disabled');
			$('#bms').show();
			$('#bms a').attr('href', bookmark());
			$('#quickLinks').hide();
		} else {
			$('.nbToRun').text('no');
			$('.nbToRunPluralize').text('');
			$('#start').attr('disabled', 'true').addClass('disabled');
			$('#bms').hide();
			$('#quickLinks').show();
		}
		$('.test, #header').removeClass('passed').removeClass('failed');
		$('.touch').html('&sim;');
		$('.testResult').hide();
	}

	// get the url of the base qunit
	var baseUrl = function() {
		var url = 'http://'+document.location.host;
		if(document.location.port && url.indexOf(":") == -1) {
			url += ':'+document.location.port;
		}
		url += document.location.pathname;
		
		return url;
	}
	
	// bookmark url for the selected tests
	var bookmark = function() {
		var url = baseUrl();
		url += '?select=';
		var v = false;
		$('.test.selected').each(function() {
			if(v) url += ',';
			url += $(this).attr('id');	
			v = true;					
		});
		if(url)
			return url;
	}
	
	// click on a test
	$('.test a').click(function(e) {
		e.preventDefault();
		if($(document.body).is('.running')) return;
		$(this).closest('.test').toggleClass('selected');
		updateSelected();
	});

	// Toggle +/- click
	$('.test .touch').click(function(e) {
		e.preventDefault();
		var test = $(this).closest('.test')
		if($(test).is('.failed,.passed')) {
			$('.testResult', test).toggle();
			$(this).html( $(this).html() == '-' ? '+' : '-' );
		}
	});
	
	// Update selected when clicking heading
	$('#tests h2 span').click(function() {
		if($(document.body).is('.running')) return;
		var ul = $(this).parent().next('ul');
		if( $('.test', ul).size() ==  $('.test.selected', ul).size() ) {
			$('.test', ul).removeClass('selected');
		} else {
			$('.test', ul).addClass('selected');
		}
		updateSelected();
	});
	
	// start button
	$('#start').click(function() {
		if($(this).is('.disabled')) return;
		run();
	});
	
	// stop button
	$('#stop').click(function() {
		stop();
	});

	// stop button in the overlay
	$('#stopQUnit').click(function() {
		stop();
	});

	// select all link
	$('#sa').click(function() {
		$('.test').addClass('selected');
		updateSelected();
	});

	// unselect all link
	$('#unselectAll').click(function(e) {
		e.preventDefault();
		$('.test').removeClass('selected');
		updateSelected();
	});
	
	// run all link
	$('#ra').click(function() {
		$('.test').addClass('selected');
		updateSelected();
		run();
	});
	
	// select the bookmarked tests
	if(/select=/.exec(document.location.search)) {
		var toSelect = /select=([^&]+)/.exec(document.location.search)[1].split(',');
		if(toSelect[0] == 'all') {
			$('.test').addClass('selected');
		} else {
			$(toSelect).each(function() {
				$(document.getElementById(this)).addClass('selected');
			});
		}
	}
	
	// automatically run the tests
	if(/auto=yes/.exec(document.location.search)) {
		run();
	}
	
	updateSelected();
});