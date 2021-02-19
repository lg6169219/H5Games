// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var gameLoader = new Object();
gameLoader.sIsLoaded = false;
gameLoader.isLoaded = function() {
    return this.sIsLoaded;
};

gameLoader.load = function(cb = {
    /**
     * 加载成功
     */
    success() {},
    /**
     * 加载失败
     */
    fail() {},
    /**
     * 加载进度百分比[0,1]
     * percent
     */
    /**
     * 当前完成数量
     * completedCount
     */
    /**
     * 总数量
     * totalCount
     */
    onProgress(percent, completedCount, totalCount) {}
}) {
    let start = new Date().getTime();
    if (CC_DEBUG) {
        cc.log(`>>> 开始加载所有游戏资源`);
    }

    cc.loader.loadResDir(
        "/",
        // 每加载一个资源都会回调这里
        // 可能会连续多次次出现加载相同进度
        // ps:
        // 当前已经加载进度(9/34)
        // 当前已经加载进度(9/34)
        // completedCount 已经加载完毕的数量
        // totalCount 总数量
        // item 最后一个加载成功的 （官方原话：The latest item which flow out the pipeline.）
        (completedCount, totalCount, item) => {
            if (cb.onProgress) {
                cb.onProgress(completedCount / totalCount, completedCount, totalCount);
            }
        },
        // 当所有的资源都加载完毕的时候，或者其中一个资源加载失败的时候会立即回调下面这个方法
        // error 当其中一个资源加载失败的时候，会立即回调这个方法，同时本参数携带错误描述，如果都加载成功，那么这个参数为空
        // resources 所有成功加载的资源
        // urls 所有加载成功的资源的URLs
        (error, resources, urls) => {
            if (error != null) {
                if (CC_DEBUG) {
                    cc.error(`>>> 有资源加载失败 ${error.message}`);
                }
                if (cb.fail) {
                    cb.fail();
                }
                return;
            }

            if (CC_DEBUG) {
                cc.log(`>>> 成功加载 ${resources.length} 个资源，对应 ${urls.length} 个资源相对路径地址`);
                if (resources.length != urls.length) {
                    cc.error(`>>> 资源数量和路径数量不一致，建议检查一下`);
                }
            }
            if (CC_DEBUG) {
                cc.log(`>>> 加载游戏 Resources 资源耗时${new Date().getTime() - start}ms`);
            }

            gameLoader.sIsLoaded = true;
            cb.success();
            // let gameConfigJson;
            // let targetConfig = "game_config_zh";
            // if (FBInstantAdapter.isFacebookInstantGame()) {
            //     if (!FBInstantAdapter.isZh()) {
            //         targetConfig = "game_config_en";
            //     }
            // }
            // for (let i = 0; i < resources.length; i++) {
            //     let resource = resources[i];
            //     let url = urls[i];
            //     if (!resource.isValid) {
            //         if (CC_DEBUG) {
            //             cc.error(`>>> 资源 ${resource.name}[${url}] 加载失败，当前不可用`);
            //         }
            //         return;
            //     }
            //     if (!resource.loaded) {
            //         if (CC_DEBUG) {
            //             cc.error(`>>> 资源 ${resource.name}[${url}] 没有成功加载`);
            //         }
            //         return;
            //     }
            //     if (resource.name == targetConfig) {
            //         if (resource instanceof cc.TextAsset) {
            //             gameConfigJson = JSON.parse((<cc.TextAsset>resource).text);
            //         } else if (resource instanceof cc.JsonAsset) {
            //             gameConfigJson = (<cc.JsonAsset>resource).json;
            //         }
            //     }
            // }
            // if (gameConfigJson == null) {
            //     if (cb.fail) {
            //         cb.fail();
            //     }
            // } else {
            //     Game.init({
            //         configJson: gameConfigJson,
            //         success: () => {
            //             if (CC_DEBUG) {
            //                 cc.log(`>>> 游戏加载成功`);
            //             }
            //             GameLoader.sIsLoaded = true;
            //             cb.success();
            //         },
            //         fail: () => {
            //             if (cb.fail) {
            //                 cb.fail();
            //             }
            //         }
            //     });
            // }
        }
    );
}
module.exports = gameLoader;