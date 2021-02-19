export default class UI_ctrl extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onAwake(){
        this.view = {};
        
        this._load_all_inview(this.owner, "");

        console.log(this.view);
    }

    _load_all_inview(root, path){
        for(var i = 0; i < root.numChildren; i++){
            var child = root.getChildAt(i);
            this.view[path + child.name] = child;

            this._load_all_inview(child, path + child.name + "/");
        }
    }

    onEnable() {
    }

    onDisable() {
    }
}