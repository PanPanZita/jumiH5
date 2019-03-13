define(['jumi', 'nav', 'asyncload', 'vue', 'getPara', 'isLogin', 'md5', 'weixin'], function(jumi, nav, asyncload, vue, getPara, isLogin, md5, weixin) {
    var para = getPara.get();
    var token = localStorage.getItem("token");
    var parainit = {
        token: token,
        requestSource: 'WAP'
    };
    isLogin(function() {
        $.ajax({
            url: '/userCenter/userAccount/initOpenAccountOrBindCard',
            type: 'post',
            dataType: 'json',
            data: parainit,
            success: function(data) {
                // console.log(data);
                if (data.code == '0000') {
                    new vue({
                        el: 'body',
                        data: function() {
                            return {
                                data: data,
                                realname: data.data.realname, //真实姓名
                                idNumber: data.data.idNumber, //身份证号
                                backcardList: data.data.bankList, //支持的银行卡列表
                                bankcard: '',
                                paypassword: '',
                                originOrderNo: '',
                                clickstatus: true //防止注册按钮二次点击
                            }
                        },
                        methods: {
                            highlight: function() {
                                var patrn_null = /^\S{0}$/; //非空
                                var bankcardproving = $("#bankcard").attr("proving") == 1 ? 1 : 0;
                                var boolNull = !patrn_null.test(this.bankcard);
                                var boolproving = bankcardproving;
                                if (boolNull && boolproving) {
                                    $(".button-fill.button.disabled").removeClass('disabled');
                                } else {
                                    $(".button-fill.button").addClass('disabled');
                                }
                            },
                            supportBankcard: function() {
                                jumi.alert({
                                    title: '支持绑定的银行卡',
                                    content: document.getElementById('bankcardListBox'),
                                    button: false
                                })
                            },
                            bankcardKeyup: function(event) {
                                var patrn_number = /^[\d ]*$/; //数字和空格  
                                var bankcardAppear = "";
                                var bankcardStr = "";
                                if (!patrn_number.test(this.bankcard)) {
                                    $("#userpwdreal").attr("proving", 0);
                                    jumi.tips('请输入有效的银行卡号！');
                                    return;
                                }
                                // console.log(this.bankcard.length);
                                if(this.bankcard.length > 16){
                                    $("#bankcard").attr("proving", 1);
                                }else{
                                    $("#bankcard").attr("proving", 0);
                                }
                                for (var i = 0; i < this.bankcard.length; i++) {
                                    bankcardStr = this.bankcard.substr(i, 1);
                                    if (!isNaN(bankcardStr) && (bankcardStr != " ")) { //当有空值的时候并不拼接在bankcardAppear
                                        bankcardAppear = bankcardAppear + bankcardStr;
                                    }
                                }
                                this.bankcard = "";
                                for (var i = 0; i < bankcardAppear.length; i++) {
                                    if (i == 6) this.bankcard = this.bankcard + " "; /* 帐号第6位数后加空格 */
                                    if (i == 12) this.bankcard = this.bankcard + " "; /* 帐号第12位后数后加空格 */
                                    this.bankcard = this.bankcard + bankcardAppear.substr(i, 1);
                                }
                                this.highlight();
                            },
                            // bankcardBlur: function() { //数字空格（15-19位）
                            //     var backCardnum = /[\d ]{17,21}/;
                            //     if (!backCardnum.test(this.bankcard)) {
                            //         $("#bankcard").attr("proving", 0);
                            //         jumi.tips('请输入正确的银行卡号！');
                            //         return;
                            //     } else {
                            //         $("#bankcard").attr("proving", 1);
                            //     }
                            //     this.highlight();
                            // },
                            next: function() {
                                var that = this;
                                var bankcard = that.bankcard.replace(/[ ]/g, "");
                                var paranext = {
                                    bankCardId: bankcard,
                                    token: token,
                                    requestSource: 'WAP'
                                };
                                // console.log(paranext);
                                jumi.alert({
                                    title: '温馨提示',
                                    content:'<div>'
                                            +'  <p>1.实名认证是验证您所绑定的银行账户是否属于您本人，确保您的资金安全，账户中的资金只能被提现到您本人的银行卡中。</p>'
                                            +'  <p>2.您在绑定银行卡的过程中，为了确保您与第三方监管平台已成功建立资金保障关系，会向您的聚米账户充值1元，充值金额您可正常使用，请您放心！</p>'
                                            +'</div>',
                                    button:[{
                                        value:'知道了',
                                        callback:function(){
                                            $.ajax({
                                                url: '/userCenter/userAccount/bindCard',
                                                type: 'post',
                                                dataType: 'json',
                                                data: paranext,
                                                success: function(data) {
                                                    // console.log(data);
                                                    if (data.code == '0000') {
                                                        $("#payForm").attr("action",data.data.rechargeUrl);
                                                        $("#req_data").val(data.data.reqData);
                                                        document.getElementById("payForm").submit();
                                                    } else {
                                                        jumi.tips(data.msg);
                                                    }
                                                }
                                            });
                                        }
                                    }]
                                });
                            }
                        },
                        ready: function() {
                            nav.setActiveNav("account");
                            $('#myloading').remove();
                            $('img.async').asyncload();
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
    }); //isLogin的结束

});