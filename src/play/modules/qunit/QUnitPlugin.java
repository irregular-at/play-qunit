package play.modules.qunit;

import play.Logger;
import play.Play;
import play.PlayPlugin;
import play.mvc.Router;

public class QUnitPlugin extends PlayPlugin {
	
	public void onRoutesLoaded() {
		if(! Play.mode.isProd()) {
			Router.addRoute("GET", "/@qunit", "qunit.Qunit.list");
			Router.addRoute("GET", "/@qunit/run{<.*>test}", "qunit.Qunit.run");
			Router.addRoute("POST", "/@qunit/result", "qunit.Qunit.result");
		}
	};
	
	@Override
	public void onLoad() {
		Logger.debug("QUnit: qunit initialized");
	}
}
