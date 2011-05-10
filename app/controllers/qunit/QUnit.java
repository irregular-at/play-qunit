package controllers.qunit;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.commons.io.FileUtils;

import play.Play;
import play.mvc.Controller;
import play.mvc.results.RenderTemplate;
import play.templates.Template;
import play.templates.TemplateLoader;
import play.vfs.VirtualFile;

public class QUnit extends Controller {

	/**
	 * List of the available qunit tests.
	 */
	public static void list() {
		ArrayList<File> tests = findQUnitTests();
		render(tests);
	}

	/**
	 * Run a qunit test.
	 * 
	 * @param test The path of the test to run.
	 */
	public static void run(String test) {
		VirtualFile testFile = VirtualFile.open(test);
		Template template = TemplateLoader.load(testFile);
		throw new RenderTemplate(template, new HashMap<String, Object>());
	}

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