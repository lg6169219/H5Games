require("./UI_ctrls/UI_ctrl_class_reg");

import game_mgr from "../managers/game_mgr";
import UI_manager from "../managers/UI_manager";
import res_mgr from "../managers/res_mgr";
import event_mgr from "../managers/event_mgr";
import event_define from "../global/event_define";
import scene_mgr from "../managers/scene_mgr";
import fish_nav from "./fish_nav";

export default class game_app extends game_mgr {

    constructor() {
        super();
        /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
        let intType = 1000;
        /** @prop {name:numType, tips:"数字类型示例", type:Number, default:1000}*/
        let numType = 1000;
        /** @prop {name:strType, tips:"字符串类型示例", type:String, default:"hello laya"}*/
        let strType = "hello laya";
        /** @prop {name:boolType, tips:"布尔类型示例", type:Bool, default:true}*/
        let boolType = true;
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    onAwake() {
        super.onAwake();
    }
    onStart(){
    }
    game_start(){
        res_mgr.instance().preload_res_pkg({
            prefabs: [
                "res/ui_prefabs/LoginUI.json",
                "res/ui_prefabs/ChooseUI.json",
            ],
            scene3D: [
                "res/scenes3D/LayaScene_fisher_farmer/Conventional/fisher_farmer.ls",
            ],
            sprite3D: [
                "res/prefabs3D/LayaScene_fishes/Conventional/fangyu.lh",
            ]
        }, null, function() {
            var scene3D = res_mgr.instance().get_scene3d_res("res/scenes3D/LayaScene_fisher_farmer/Conventional/fisher_farmer.ls",);
            Laya.stage.addChild(scene3D);
            scene3D.zOrder = -1;

            var fish_far = scene3D.getChildByName("fish_farm");
            var fish_root = fish_far.getChildByName("fish_root");
            var camera = scene3D.getChildByName("Main Camera");
            camera.useOcclusionCulling = false;

            this.scene3D = scene3D;
            this.fish_far = fish_far;
            this.fish_root = fish_root;

            // test
            var fish_prefab = res_mgr.instance().get_sprite3D_res("res/prefabs3D/LayaScene_fishes/Conventional/fangyu.lh");
            var fish = Laya.Sprite3D.instantiate(fish_prefab);
            fish.transform.localPosition = new Laya.Vector3(0, 0, 31.4);


            var animator = fish.getChildByName("anim").getComponent(Laya.Animator);
            var anim_state = animator.getDefaultState();
            anim_state.clip.islooping = true;


            fish_root.addChild(fish);
            fish.addComponent(fish_nav);

            this.enter_logion_scene();

        //     // 自己写的event listener测试代码
        //     // event_mgr.instance().add_listener("test", this, this.on_test_event_self);
        //     // event_mgr.instance().dispatch_event("test", 6666);

        //     // 基于laya的event listener测试代码
        //     event_mgr.instance().add_listener(event_define.UPDATE_GAME_MONEY, this, this.on_test_event_laya);

        //     event_mgr.instance().dispatch_event(event_define.UPDATE_GAME_MONEY, 123456);
        }.bind(this));
    }
    onEnable() {
    }

    onDisable() {
    }

    enter_logion_scene(){
        UI_manager.instance().show_ui("LoginUI");
    }

    enter_choose_scene() {
        UI_manager.instance().remove_all_ui();
        UI_manager.instance().show_ui("ChooseUI");
    }

    // 自己写的event listener测试代码
    on_test_event_self(event_name, udata) {
        console.log("on_test_event", this, event_name, udata);
        event_mgr.instance().remove_listener("test", this, this.on_test_event);
        event_mgr.instance().dispatch_event("test", 7777);
    }

    // 基于laya的event listener测试代码
    on_test_event_laya(data) {
        console.log("on_test_event_laya", data);
    }
}