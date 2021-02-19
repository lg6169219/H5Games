/*
假设世界排行榜要100个玩家的数据，我们怎么使用滚动列表来实现?
显示[1, 100]这个数据
(1)我们将我们滚动列表里面的每个项分成三个页
(2)每一个页面我们制定一个数目，例如8个,根据你的scrollview的大小来决定;
(3)总共使用的滚动列表里面的想 PAGE_HANG_NUM * 3 = 24个;
(4) 有限的项要显示 超过它数目的数据记录?

*/

cc.Class({
    extends: cc.Component,

    properties: {
        OPT_HEIGHT: 80, // 每项的高度
        PAGE_HANG_NUM: 4, // 每页为4行;
        PAGE_LIE_NUM: 5, // 每页为5列;

        item_prefab: {
            type: cc.Prefab,
            default: null,
        },

        scroll_view: {
            type: cc.ScrollView,
            default: null,
        },
    },

    // use this for initialization
    onLoad: function() {
        this.value_set = [];

        var data_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

        // 如果你这里是排行榜，那么你就push排行榜的数据;
        var max_hang = Math.ceil(data_list.length / this.PAGE_LIE_NUM);
        for (var i = 0; i < max_hang; i++) {
            let list = [];
            for (var j = 0; j < this.PAGE_LIE_NUM; j++) {
                let index = i * this.PAGE_LIE_NUM + j;
                let data = data_list[index];
                list.push(data);
            }
            this.value_set.push(list);
        }

        this.content = this.scroll_view.content;
        this.opt_item_set = [];
        for (var i = 0; i < this.PAGE_HANG_NUM * 3; i++) {
            var list = [];
            for (var j = 0; j < this.PAGE_LIE_NUM; j++) {
                var item = cc.instantiate(this.item_prefab);
                this.content.addChild(item);
                list.push(item);
            }
            this.opt_item_set.push(list);

        }
        this.scroll_view.node.on("scroll-ended", this.on_scroll_ended.bind(this), this);
    },

    start: function() {
        this.start_y = this.content.y;
        this.start_index = 0; // 当前我们24个Item加载的 100项数据里面的起始数据记录的索引;
        this.load_record(this.start_index);
    },

    // 从这个索引开始，加载数据记录到我们的滚动列表里面的选项
    load_record: function(start_index) {
        this.start_index = start_index;

        for (var i = 0; i < this.PAGE_HANG_NUM * 3; i++) {
            for (var j = 0; j < this.PAGE_LIE_NUM; j++) {
                var label = this.opt_item_set[i][j].getChildByName("src").getComponent(cc.Label);
                let value_set = this.value_set[start_index + i];
                if (value_set) {
                    if (value_set[j] != undefined) {
                        label.string = value_set[j];
                    } else {
                        label.string = "空";
                    }
                }
            }
        }
    },

    on_scroll_ended: function() {
        this.scrollveiw_load_recode();
        this.scroll_view.elastic = true;
    },

    scrollveiw_load_recode: function() {
        // 向下加载了
        if (this.start_index + this.PAGE_HANG_NUM * 3 < this.value_set.length &&
            this.content.y >= this.start_y + this.PAGE_HANG_NUM * 2 * this.OPT_HEIGHT) { // 动态加载

            if (this.scroll_view._autoScrolling) { // 等待这个自动滚动结束以后再做加载
                this.scroll_view.elastic = false; // 暂时关闭回弹效果
                return;
            }

            var down_loaded = this.PAGE_HANG_NUM;
            this.start_index += down_loaded;
            if (this.start_index + this.PAGE_HANG_NUM * 3 > this.value_set.length) {
                var out_len = this.start_index + this.PAGE_HANG_NUM * 3 - this.value_set.length;
                down_loaded -= (out_len);
                this.start_index -= (out_len);
            }
            this.load_record(this.start_index);

            this.content.y -= (down_loaded * this.OPT_HEIGHT);
            return;
        }

        // 向上加载
        if (this.start_index > 0 && this.content.y <= this.start_y) {
            if (this.scroll_view._autoScrolling) { // 等待这个自动滚动结束以后再做加载
                this.scroll_view.elastic = false;
                return;
            }

            var up_loaded = this.PAGE_HANG_NUM;
            this.start_index -= up_loaded;
            if (this.start_index < 0) {
                up_loaded += this.start_index;
                this.start_index = 0;
            }
            this.load_record(this.start_index);
            this.content.y += (up_loaded * this.OPT_HEIGHT);
        }
        // end 
    },
    // called every frame, uncomment this function to activate update callback
    update: function(dt) {
        this.scrollveiw_load_recode();
    },
});