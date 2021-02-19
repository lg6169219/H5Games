import res_mgr from "../managers/res_mgr";

export default class scene_mgr extends Laya.Script {

    constructor() {
        super();
        this.scene_dir = "res/LayaScene_game_scene/Conventional/";
    }

    static instance() {
        return scene_mgr.Instance;
    }
    onAwake() {
        scene_mgr.Instance = this;
    }

    onStart() {

    }
    /**创建一个场景的流程
     * 1.加载场景资源
     * 2.资源加载完成后创建场景
     * 3.对创建后的场景做个性化处理
     * 4.将场景加入舞台
     */
    load_scene_res(scene_name, callback) {
        res_mgr.instance().preload_res_pkg({
            prefabs: [
            ],
            scene3D: [
                "res/LayaScene_game_scene/Conventional/"+scene_name+".ls",
            ],
        }, null, function(){
            if (callback){
                callback.call(this);
            }
        }.bind(this));
    }

    create_scene(scene_name) {
        if(this.curr_scene){
            this.curr_scene = null;
            // 这里要卸载老的场景
        }

        var scene3d = res_mgr.instance().get_scens3d_res("res/LayaScene_game_scene/Conventional/"+scene_name+".ls");
        Laya.stage.addChild(scene3d);
        scene3d.zOrder = -1;
        this.curr_scene = scene3d;

        return scene3d;
    }
}