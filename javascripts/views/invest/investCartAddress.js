define(['jumi', 'getPara', 'vue', 'weixin'], function(jumi, getPara, vue, weixin) {
    var para = getPara.get();
    var token = localStorage.getItem("token"); //为了验证用户是否登录
    // console.log(token);
    var costType = para.costType; //回报类型
    var parainit = {
        token: token,
        requestSource: 'WAP'
    };
    $.ajax({
        type: 'post',
        url: '/userCenter/setting/getUserAddress',
        dataType: 'json',
        data: parainit,
        success: function(data) {
            // console.log(data);
            if (data.code == '0000') {
                new vue({
                    el: 'body',
                    components: {
                        'my-selectaddress': {
                            template: '#selectAddressTemplate',
                            data: function() {
                                return {
                                    data: data.data,
                                    addressList: data.data.addressList
                                }
                            },
                            methods: {
                                //设为默认[和编辑地址是同一个接口，传参不同]
                                setDefault: function(id, isUse) {
                                    var that = this;
                                    var paraset = {
                                        addressId: id,
                                        isUse: isUse,
                                        requestSource: 'WAP',
                                        token: token
                                    };
                                    // console.log(paraset);
                                    $.ajax({
                                        type: 'post',
                                        url: '/userCenter/setting/updateIsUse',
                                        data: paraset,
                                        dataType: 'json',
                                        success: function(data) {
                                            // console.log(data);
                                            if (data.code == '0000') {
                                                that.data = data;
                                                jumi.tips("修改成功！");
                                                location.reload();
                                            } else {
                                                jumi.tips(data.msg);
                                            }
                                        }
                                    });
                                },
                                //编辑
                                editAddress: function(address_id) {
                                    location.href = 'investCartAddressEdit.html?itemid=' + para.itemid + '&gearId=' + para.gearId + '&address_id=' + address_id;
                                },
                                //选择
                                toSelect: function(address_id) {
                                    if (costType == 0) { //不回报
                                        location.href = '/h5/views/payment/investCartweixin.html?itemid=' + para.itemid + '&gearId=' + para.gearId + '&address_id=' + address_id;
                                    } else {
                                        location.href = '/h5/views/payment/investCart.html?itemid=' + para.itemid + '&gearId=' + para.gearId + '&address_id=' + address_id;
                                    }

                                },
                                //新增地址
                                createAddress: function() {
                                    location.href = 'investCartAddressCreate.html?itemid=' + para.itemid + '&gearId=' + para.gearId
                                },
                                //删除地址
                                delAddress: function(id) {
                                    var that = this;
                                    var paradel = {
                                        addressId: id,
                                        requestSource: 'WAP',
                                        token: token
                                    };
                                    jumi.alert({
                                        skin: 'ui-dialog-bankcard',
                                        content: '确认删除？',
                                        button: [{
                                            value: '取消'
                                        }, {
                                            value: '确认',
                                            callback: function() {
                                                $.ajax({
                                                    type: 'post',
                                                    url: '/userCenter/setting/deleteAddress',
                                                    data: paradel,
                                                    dataType: 'json',
                                                    success: function(data) {
                                                        // console.log(data);
                                                        if (data.code == '0000') {
                                                            that.data = data;
                                                            jumi.tips("删除成功！");
                                                            location.reload();
                                                        } else {
                                                            jumi.tips(data.msg);
                                                        }
                                                    }
                                                });
                                            }
                                        }]
                                    });
                                }
                            }
                        }
                    },
                    ready: function() {
                        $('#myloading').remove();
                        //分享
                        weixin.setTitle()
                            .setDesc()
                            .setImg()
                            .setUrl()
                            .share();
                    }
                })
            }
        }
    });

});