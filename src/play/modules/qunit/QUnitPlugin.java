package play.modules.qunit;

import play.Logger;
import play.Play;
import play.PlayPlugin;
import play.mvc.Router;

public class QUnitPlugin extends PlayPlugin {
	
	public static boolean enabled = false;
	
	@Override
	public void onLoad() {		
		if(!Play.mode.isProd() 
				|| "test".equals(Play.id)
				|| (Play.id.startsWith("test-") && Play.id.length() > 5))
		{
			enabled = true;
			Logger.debug("QUnit: qunit is enabled");
		} else {
			Logger.debug("QUnit: qunit is disabled");
		}
	}
}
