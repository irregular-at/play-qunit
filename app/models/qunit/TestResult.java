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
	
	/**
	 * Get the display name of a test from the vfs relative path
	 */
	public String getTestName() {
		return getTestName(test);
	}
	
	/**
	 * Static method to convert a vfs path to a test into a readable test name.
	 */
	public static String getTestName(String vfsPath) {
		String testName = vfsPath.replaceFirst("\\{.*?\\}", "");
		testName = testName.substring("/test/qunit/".length());
		testName = testName.substring(0, testName.lastIndexOf("."));
		return testName;		
	}
	
	/**
	 * Get the the fully qualified test name in "." notation.
	 */
	public String getFQName() {
		return "qunit." + getTestName().replace("/", ".");
	}
	
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
