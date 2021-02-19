export default class res_mgr extends Laya.Script {

    constructor() {
        super();

    }

    static instance() {
        return res_mgr.Instance;
    }

    onAwake() {
        if (!res_mgr.Instance) {
            res_mgr.Instance = this;
        }
        this.prefabs_res = {};
        this.scene3D_res = {};
        this.sprite3D_res = {};
    }

    // res_set: {prefabs: [], scene3D: [], sprite3D:[], atlas: [], imgs: []}
    // on_progress(per)
    // on_load_finished
    preload_res_pkg(res_pkg, on_progress, on_load_finished) {
        let i = 0;
        let url = "";

        this.on_progress = on_progress;
        this.on_load_finished = on_load_finished;

        this.total_num = 0;
        for(var key in res_pkg) {
            this.total_num += res_pkg[key].length;
        }

        this.now_num = 0;
        if (res_pkg.prefabs) {
            for (i = 0; i < res_pkg.prefabs.length; i++) {
                url = res_pkg.prefabs[i];
                this.load_prefab(url);
            }
        }

        if (res_pkg.scene3D) {
            for (i = 0; i < res_pkg.scene3D.length; i++) {
                url = res_pkg.scene3D[i];
                this.load_scene3D(url);
            }
        }

        if (res_pkg.sprite3D) {
            for (i = 0; i < res_pkg.sprite3D.length; i++) {
                url = res_pkg.sprite3D[i];
                this.load_sprite3D(url);
            }
        }
    }

    // 释放
    reloase_res_pkg(res_pkg) {
        let i = 0;
        let url = "";

        if (res_pkg.prefabs) {
            for (i = 0; i < res_pkg.prefabs.length; i++) {
                url = res_pkg.prefabs[i];
                this.release_prefab(url);
            }
        }

        if (res_pkg.scene3D) {
            for (i = 0; i < res_pkg.scene3D.length; i++) {
                url = res_pkg.scene3D[i];
                this.release_scene3D(url);
            }
        }

        if (res_pkg.sprite3D) {
            for (i = 0; i < res_pkg.sprite3D.length; i++) {
                url = res_pkg.sprite3D[i];
                this.release_sprite3D(url);
            }
        }
    }

    _one_res_load_finished() {
        this.now_num++;
        if (this.on_progress) {
            this.on_progress(this.now_num / this.total_num);
        }

        if (this.now_num >= this.total_num && this.on_load_finished) {
            this.on_load_finished();
        }
    }

    load_prefab(url) {
        Laya.loader.load(url, Laya.Handler.create(this, function (json) {
            var prefab = new Laya.Prefab();
            prefab.json = json;
            this.prefabs_res[url] = prefab;

            this._one_res_load_finished();
        }));
    }

    release_prefab(url) {
        if (!this.prefabs_res[url]) {
            return;
        }

        this.prefabs_res[url].json = null;
        this.prefabs_res[url] = null;
        Laya.loader.clearRes(url);
    }


    load_scene3D(url) {
        Laya.Scene3D.load(url, Laya.Handler.create(this, function (scene3d) {
            this.scene3D_res[url] = scene3d;

            this._one_res_load_finished();
        }));
    }

    release_scene3D(url) {
        if (!this.scene3D_res[url]) {
            return;
        }

        this.scene3D_res[url] = null;
        Laya.loader.clearRes(url);
    }


    load_sprite3D(url) {
        Laya.Sprite3D.load(url, Laya.Handler.create(this, function (sprite3d) {
            this.sprite3D_res[url] = sprite3d;

            this._one_res_load_finished();
        }));
    }
    release_sprite3D(url) {
        if (!this.sprite3D_res[url]) {
            return;
        }

        this.sprite3D_res[url] = null;
        Laya.loader.clearRes(url);
    }

    get_prefab_res(url) {
        return this.prefabs_res[url];
    }
    get_scens3d_res(url) {
        return this.scene3D_res[url];
    }

    get_sprite3D_res(url) {
        return this.sprite3D_res[url];
    }
    onEnable() {
    }

    onDisable() {
    }
}