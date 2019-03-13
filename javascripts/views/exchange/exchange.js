define(['nav', 'tab', 'asyncload', 'vue', 'weixin','load','scrolltotop'], function(nav, tab, asyncload, vue, weixin,load,scrolltotop) {
    var parainit = {
        activityType: 3, //活动类型（2代表抽奖3代表兑换）
        currentPage: 1,
        pageSize: 999,
        sortMethod: 0, //默认事件排序（1为时间排序，2为价格排序，0为任何一种类型）
        requestSource: 'WAP'
    };
    $.ajax({
        url: '/activity/getActivityListByType',
        type: 'post',
        dataType: 'json',
        data: parainit,
        success: function(data) {
            // console.log(data);
            if (data.code == '0000') {
                new vue({
                    el: 'body',
                    components: {
                        'my-discoverlist': {
                            template: '#discoverListTemplate',
                            data: function() {
                                return {
                                    data: {},
                                    timeSortActionList: {
                                        items: data.data.timeSortActionList,
                                        currentPage: 1,
                                        isLoading: 0
                                    },
                                    priceSortActionList: {
                                        items: data.data.priceSortActionList,
                                        currentPage: 1,
                                        isLoading: 0
                                    },
                                    isIOSShow: (localStorage.fromapp == 'ios') //为IOS通过官方审核而用
                                }
                            },
                            // methods: {
                                //加载更多
                                // loadMore: function(isloaded, type) {
                                //     if (isloaded == 2) {
                                //         return;
                                //     }
                                //     var that = this;
                                //
                                //     var paraload = {
                                //         activityType: 3, //活动类型（2代表抽奖3代表兑换）
                                //         pageSize: 10,
                                //         requestSource: 'WAP'
                                //     };
                                //
                                //     if (type == 1) {
                                //         that.timeSortActionList.isLoading = 1;
                                //         that.timeSortActionList.currentPage++;
                                //         paraload.sortMethod = 1; //排序问题是  时间排序
                                //         paraload.currentPage = that.timeSortActionList.currentPage;
                                //     } else if (type == 2) {
                                //         that.priceSortActionList.isLoading = 1;
                                //         that.priceSortActionList.currentPage++;
                                //         paraload.sortMethod = 2; //排序问题是  价格排序
                                //         paraload.currentPage = that.priceSortActionList.currentPage;
                                //     }
                                //
                                //     $.ajax({
                                //         url: '/activity/getActivityListByType',
                                //         type: 'post',
                                //         dataType: 'json',
                                //         data: paraload,
                                //         success: function(data) {
                                //             // console.log(data);
                                //             if (data.code == '0000') {
                                //                 if (data.data.actionList != null && data.data.actionList.length > 0) {
                                //                     if (type == 1) {
                                //                         for (key in data.data.actionList) {
                                //                             that.timeSortActionList.items.push(data.data.actionList[key])
                                //                         }
                                //                         that.timeSortActionList.isLoading = 0;
                                //                     } else if (type == 2) {
                                //                         for (key in data.data.actionList) {
                                //                             that.priceSortActionList.items.push(data.data.actionList[key])
                                //                         }
                                //                         that.priceSortActionList.isLoading = 0;
                                //                     }
                                //                 } else {
                                //                     if (type == 1) {
                                //                         that.timeSortActionList.isLoading = 2;
                                //                     } else if (type == 2) {
                                //                         that.priceSortActionList.isLoading = 2;
                                //                     }
                                //                 }
                                //             } else {
                                //                 jumi.tips(data.msg);
                                //             }
                                //
                                //         }
                                //     })
                                // } //end loadMore
                            // }
                        }
                    },
                    ready: function() {
                        nav.setActiveNav("discover");
                        $('#myloading').remove();
                        $('.async').asyncload();
                        //分享
                        weixin.setTitle()
                            .setDesc()
                            .setImg()
                            .setUrl()
                            .share();
                    }
                });
            }

        }
    });

});