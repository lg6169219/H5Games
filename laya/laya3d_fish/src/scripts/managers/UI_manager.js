export default class UI_manager extends Laya.Script {

    constructor() {
        super();
    }

    static instance(){
        return UI_manager.Instance;
    }
    onAwake(){
        if(!UI_manager.Instance){
            UI_manager.Instance = this;
        }else{
            console.log("=error");
        }

        this.ui_views = {};
    }

    onEnable() {
    }

    onDisable() {
    }

    show_ui(ui_name) {
        Laya.loader.load("res/ui_prefabs/" + ui_name + ".json", Laya.Handler.create(this, function(prefab_json){
            var prefab = new Laya.Prefab();
            prefab.json = prefab_json;

            var obj = prefab.create();
            this.owner.addChild(obj);

            var cls = Laya.ClassUtils.getClass(ui_name + "_ctrl");
            console.log("=======load ui success", ui_name);
            if(cls){
                obj.addComponent(cls);
            }

            this.ui_views[ui_name] = obj;
        }));

    }

    remove_ui(ui_name){
        if(this.ui_views[ui_name]){
            this.ui_views[ui_name].removeSelf();
            this.ui_views[ui_name] = null;
        }
    }

    remove_all_ui(){
        for(var key in this.ui_views){
            if(this.ui_views[key]){
                this.ui_views[key].removeSelf();
                this.ui_views[key] = null;
            }
        }
    }
}