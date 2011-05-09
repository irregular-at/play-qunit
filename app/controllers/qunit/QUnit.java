package controllers.qunit;

import java.util.HashMap;

import play.mvc.Controller;
import play.mvc.results.RenderTemplate;
import play.templates.Template;
import play.templates.TemplateLoader;

public class QUnit extends Controller {

    public static void list() {
    	Template template = TemplateLoader.load(template("/test/qunit/helloworld.html"));
    	throw new RenderTemplate(template, new HashMap<String, Object>());
    }
}