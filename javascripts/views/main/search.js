define(['jumi', 'nav', 'tab', 'asyncload', 'vue', 'weixin'], function(jumi, nav, tab, asyncload, vue, weixin) {


    new vue({
        el: 'body',
        components: {
            ////////////////////////////////////快速搜索
            'my-search': {
                template: '#searchTemplate',
                data: function() {
                    return {
                        itemName: "",
                        isTypeSelected: 0,
                        isStatusSelected: 0
                    };
                },
                methods: {
                    typeChoice: function(typeVal) {
                        // console.log(typeVal);
                        this.isTypeSelected = typeVal;

                    },
                    statusChoice: function(statusVal) {
                        // console.log(statusVal);
                        this.isStatusSelected = statusVal;
                    },
                    btnJump: function() {
                        //console.log(this.isTypeSelected, this.isStatusSelected);
                        var itemName = this.itemName;
                        location.href = "/h5/views/main/list.html?type=" + this.isTypeSelected + "&status=" + this.isStatusSelected + "&itemName=" + itemName;
                    }
                }
            }
        },
        ready: function() {
            nav.setActiveNav("index");
            $('.async').asyncload();
            $('#myloading').remove();
            //分享
            weixin.setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();
        }
    });

});