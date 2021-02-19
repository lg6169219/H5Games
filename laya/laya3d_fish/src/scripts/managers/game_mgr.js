import UI_manager from "./UI_manager";
import res_mgr from "./res_mgr";
import event_mgr from "./event_mgr";
import scene_mgr from "./scene_mgr";


export default class game_mgr extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onAwake(){
        console.log("start init game_mgr");
        this.owner.addComponent(event_mgr);
        this.owner.addComponent(res_mgr);
        this.owner.addComponent(scene_mgr);
        this.owner.addComponent(UI_manager);
        console.log("game_mgr init success");
    }

    onEnable() {
    }

    onDisable() {
    }
}