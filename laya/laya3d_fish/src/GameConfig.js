/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import game_app from "./scripts/game/game_app"
import UI_Button from "./scripts/utils/UI_Button"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("scripts/game/game_app.js",game_app);
		reg("scripts/utils/UI_Button.js",UI_Button);
    }
}
GameConfig.width = 960;
GameConfig.height = 640;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "fisher.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
