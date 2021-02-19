// 事件管理

var ClientEvent = {
    UPDATE_GAME_MONEY : "UPDATE_GAME_MONEY" // 更新游戏里的货币
}

export default class event_mgr extends Laya.Script {

    constructor() {
        super();
    }

    static instance() {
        return event_mgr.Instance;
    }
    onAwake() {
        if (!event_mgr.Instance) {
            event_mgr.Instance = this;
        } else {
            console.log("error, event_mgr has multi instances");
            return;
        }
        this.events_map = {}; // "事件名字": [{caller: xxxx, func: xxx}, {}, {}]

        this.eventDispatcher = new Laya.EventDispatcher();
    }

    onEnable() {
    }

    onDisable() {
    }

    // ------------------------- 自己实现的event_listener
    // // 添加监听
    // // 这里找不到func或者call的话，一般是因为在回调函数里addlistener，this不对
    // add_listener(event_name, caller, func){
    //     if(!this.events_map[event_name]){
    //         this.events_map[event_name] = [];   
    //     }
    //     var handler = {caller : caller, func: func};
    //     this.events_map[event_name].push(handler);
    // }

    // // 删除监听
    // remove_listener(event_name, caller, func){
    //     if(!this.events_map[event_name]){
    //         return;
    //     }

    //     for (var i = this.events_map[event_name].length - 1; i >= 0; i--) {
    //         var handler = this.events_map[event_name][i];
    //         if (handler.caller == caller && handler.func == func) {
    //             this.events_map[event_name].splice(i, 1);
    //         }
    //     }
    // }

    // // 派发事件
    // dispatch_event(event_name, udata) {
    //     if(!this.events_map[event_name]){
    //         console.log("======= not define event: ", event_name);
    //         return;
    //     }

    //     for(var i = 0; i < this.events_map[event_name].length; i++){
    //         var handler = this.events_map[event_name][i];
    //         console.log("========handler", handler);
    //         handler.func.call(handler.caller, event_name, udata);
    //     }
    // }

    // ------------------------- 基于laya Laya.EventDispatcher实现的event_listener

    // 监听事件
    add_listener(event_id, caller, listener_func, data) {
        this.eventDispatcher.on(event_id, caller, listener_func, data);
    }

    // 监听事件，事件响应一次后自动移除
    add_listener_once(event_id, caller, listener_func, data) {
        this.eventDispatcher.once(event_id, caller, listener_func, data);
    }

    // onceOnly	（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器
    remove_listener(event_id, caller, listener_func, onceOnly = false) {
        this.eventDispatcher.off(event_id, caller, listener_func, onceOnly);
    }

    // 派发事件
    dispatch_event(event_id, data){
        console.log("=========eve", event_id, data);
        this.eventDispatcher.event(event_id, data);
    }
}