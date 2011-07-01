package controllers.qunit;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;

import models.qunit.TestResult;

import org.apache.commons.io.FileUtils;
import org.junit.Before;

import play.Play;
import play.modules.qunit.QUnitPlugin;
import play.mvc.Controller;
import play.mvc.results.RenderTemplate;
import play.templates.Template;
import play.templates.TemplateLoader;
import play.vfs.VirtualFile;

import com.google.gson.Gson;
import com.google.gson.JsonParser;

public class QUnit extends Controller {

	@Before
	public static void checkEnabled() {
		if (!QUnitPlugin.enabled) {
			notFound();
		}
	}
	
	/**
	 * List of the available qunit tests.
	 */
	public static void list() {
		ArrayList<File> testFiles = findQUnitTests();
		LinkedList<VirtualFile> tests = new LinkedList<VirtualFile>();
		for (File testFile : testFiles) {
			tests.add(VirtualFile.open(testFile));
		}

		render(tests);
	}

	/**
	 * Run a qunit test.
	 * 
	 * @param test The path of the test to run.
	 */
	public static void run(String test) {
		VirtualFile testFile = VirtualFile.fromRelativePath(test);
		Template template = TemplateLoader.load(testFile);
		throw new RenderTemplate(template, new HashMap<String, Object>());
	}

	/**
	 * Writes the result to a junit test result file
	 * @param result
	 */
	public static void result(String result) {
		TestResult testResult = new Gson().fromJson(new JsonParser().parse(result), TestResult.class);
		
		HashMap<String, Object> params = new HashMap<String, Object>();
		params.put("result", testResult);
		String xml = TemplateLoader.load("qunit/QUnit/xunit.xml").render(params);

		try {
			VirtualFile xmlFile = VirtualFile.fromRelativePath("/test-result/" + testResult.getFQName() + ".xml");
			xmlFile.getRealFile().getParentFile().mkdirs();
			
			FileUtils.write(xmlFile.getRealFile(), xml);
		} catch (IOException ioe) {
			error(ioe);
		}
	};
	
	/**
	 * Finds qunit tests in all modules and the application.
	 * 
	 * @return List of html files that contain the QUnit tests.
	 */
	public static ArrayList<File> findQUnitTests() {
		ArrayList<File> files = new ArrayList<File>();

		for (VirtualFile root : Play.roots) {
			File testFolder = root.child("test/qunit").getRealFile();
			if (testFolder.isDirectory()) {
				files.addAll(FileUtils.listFiles(testFolder,
						new String[] { "html" }, true));
			}
		}

		return files;
	}
}