package models.qunit;

import java.util.List;

/**
 * A test result of a qunit test file.
 * 
 * @author fgutmann
 */
public class TestResult {
	
	/**
	 * System path to the test
	 */
	public String test;
	
	/**
	 * Summary for all tests
	 */
	public TestSummary summary;
	
	/**
	 * List of all tests, passed or failed
	 */
	public List<Test> tests;
	
	public static class TestSummary {
		public int failed;
		public int passed;
		public int total;
		public long runtime;
	}
	
	public static class Test {
		public String name;
		public boolean result;
		public String actual;
		public String expected;
		public String message;
		public String source;
		
		public String errorMessage() {
			return message + ": Expected <" + expected + "> Actual <" + actual + ">";
		}
	}
}
