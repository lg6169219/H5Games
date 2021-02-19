import UI_ctrl from "../../managers/UI_ctrl";

export default class LoginUI_ctrl extends UI_ctrl {

    constructor() {
        super();
    }

    onAwake(){
        super.onAwake();

        console.log("=======sss", this.view["center/img_logo"]);

        this.view["btn_start"].on(Laya.Event.CLICK, this, this.on_start_click);
    }

    onEnable() {
    }

    onDisable() {
    }

    on_start_click(){
        console.log("=======on_start_click");
    }
}