define(['asyncload', 'getPara', 'vue'], function(asyncload, getPara, vue) {
    var para = getPara.get();
    var paraautor = {
        founderId: para.user_id,
        requestSource: 'WAP'
    };
    $.ajax({
        url: '/item/getFounderDetailInfo',
        type: 'post',
        dataType: 'json',
        data: paraautor,
        success: function(data) {
            // console.log(data);
            new vue({
                el: 'body',
                components: {
                    'my-zpf': {
                        template: '#zpfTemplate',
                        data: function() {
                            return {
                                data: data.data,
                                itemlist: data.data.itemList
                            }
                        }
                    }
                },
                ready: function() {
                    $('img.async').asyncload();
                }
            });
        }
    });
});