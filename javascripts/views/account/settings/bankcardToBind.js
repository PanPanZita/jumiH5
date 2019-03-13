define([
    "jumi",
    "nav",
    "asyncload",
    "vue",
    "isLogin",
    "isLoginwx",
    "md5",
    "weixin"
], function (
    jumi,
    nav,
    asyncload,
    vue,
    isLogin,
    isLoginwx,
    md5,
    weixin
) {
        var token = localStorage.getItem("token");
        var parainit = {
            token: token,
            requestSource: "WAP"
        };
        isLogin(function () {
            $.ajax({
                url: "/userCenter/userAccount/initOpenAccountOrBindCard",
                type: "post",
                dataType: "json",
                data: parainit,
                success: function (data) {
                    if (data.code == "0000") {
                        new vue({
                            el: "body",
                            data: function () {
                                return {
                                    realname: "", //真实姓名
                                    idNumber: "", //身份证号
                                    bankcard: "",
                                    userpwdreal: "",
                                    userconfirmpwdreal: "",
                                    backcardList: data.data.bankList, //支持的银行卡列表
                                    clickstatus: true //防止注册按钮二次点击
                                };
                            },
                            methods: {
                                // 按钮是否可点...
                                highlight: function () {
                                    var patrn_null = /^\S{0}$/,
                                        idNumberproving =
                                            $("#idNumber").attr("proving") == 1 ? true : false,
                                        bankcardproving =
                                            $("#bankcard").attr("proving") == 1 ? true : false,
                                        userpwdrealproving =
                                            $("#userpwdreal").attr("proving") == 1 ? true : false,
                                        userconfirmpwdrealproving =
                                            $("#userconfirmpwdreal").attr("proving") == 1 ? true : false;
                                    var boolNull = !patrn_null.test(this.realname) && !patrn_null.test(this.idNumber) && !patrn_null.test(this.bankcard) && !patrn_null.test(this.userpwdreal) && !patrn_null.test(this.userconfirmpwdreal),
                                        boolproving = idNumberproving && bankcardproving && userpwdrealproving && userconfirmpwdrealproving;
                                    if (boolNull && boolproving) {
                                        $(".button-fill").removeAttr("disabled");
                                    } else {
                                        $(".button-fill").attr("disabled", "disabled");
                                    }
                                },
                                nameKeyUp: function () {
                                    this.highlight();
                                },
                                nameBlur: function () {
                                    this.highlight();
                                },
                                supportBankcard: function () {
                                    jumi.alert({
                                        title: "支持绑定的银行卡",
                                        content: document.getElementById("bankcardListBox"),
                                        button: false
                                    });
                                },
                                idNumberBlur: function () {
                                    var isIDCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                                    if (this.idNumber.length > 0 && !isIDCard.test(this.idNumber)) {
                                        jumi.tips("请输入正确的身份证号！");
                                        return;
                                    } else {
                                        var para = {
                                            idNumber: this.idNumber,
                                            requestSource: "WAP"
                                        };
                                        $.ajax({
                                            url: "/common/validateIdNumberRepeat",
                                            type: "post",
                                            dataType: "json",
                                            data: para,
                                            success: function (data) {
                                                if (data.code == "0000") {
                                                    $("#idNumber").attr("proving", 1);
                                                } else if (data.code == "1027") {
                                                    jumi.tips("该身份证号已被注册");
                                                } else {
                                                    jumi.tips(data.msg);
                                                }
                                            }
                                        });
                                    }
                                    this.highlight();
                                },
                                bankcardKeyup: function (event) {
                                    var patrn_number = /^[\d ]*$/; //数字和空格
                                    var bankcardAppear = "";
                                    var bankcardStr = "";
                                    if (
                                        this.bankcard.length > 0 &&
                                        !patrn_number.test(this.bankcard)
                                    ) {
                                        $("#userpwdreal").attr("proving", 0);
                                        jumi.tips("请输入有效的银行卡号！");
                                        return;
                                    }
                                    for (var i = 0; i < this.bankcard.length; i++) {
                                        bankcardStr = this.bankcard.substr(i, 1);
                                        if (!isNaN(bankcardStr) && bankcardStr != " ") {
                                            //当有空值的时候并不拼接在bankcardAppear
                                            bankcardAppear = bankcardAppear + bankcardStr;
                                        }
                                    }
                                    this.bankcard = "";
                                    for (var i = 0; i < bankcardAppear.length; i++) {
                                        if (i == 6)
                                            this.bankcard =
                                                this.bankcard + " "; /* 帐号第6位数后加空格 */
                                        if (i == 12)
                                            this.bankcard =
                                                this.bankcard + " "; /* 帐号第12位后数后加空格 */
                                        this.bankcard = this.bankcard + bankcardAppear.substr(i, 1);
                                    }
                                    this.highlight();
                                },
                                bankcardBlur: function () {
                                    //数字空格（15-19位）
                                    var backCardnum = /[\d ]{17,21}/;
                                    if (
                                        this.bankcard.length > 0 &&
                                        !backCardnum.test(this.bankcard)
                                    ) {
                                        $("#bankcard").attr("proving", 0);
                                        jumi.tips("请输入正确的银行卡号！");
                                        return;
                                    } else {
                                        $("#bankcard").attr("proving", 1);
                                    }
                                    this.highlight();
                                },
                                userpwdrealKeyup: function () {
                                    var patrn_number = /^[0-9]*$/; //纯数字
                                    if (!patrn_number.test(this.userpwdreal)) {
                                        $("#userpwdreal").attr("proving", 0);
                                        jumi.tips("支付密码应为6位数字");
                                        return;
                                    }
                                    if (this.userpwdreal.length == 6) {
                                        $("#userpwdreal").attr("proving", 1);
                                    } else {
                                        $("#userpwdreal").attr("proving", 0);
                                    }
                                    this.highlight();
                                },
                                userconfirmpwdrealKeyup: function () {
                                    var confirmpwdlen = this.userconfirmpwdreal.length;
                                    if (confirmpwdlen == 6) {
                                        if (this.userconfirmpwdreal == this.userpwdreal) {
                                            $("#userconfirmpwdreal").attr("proving", 1);
                                        } else {
                                            $("#userconfirmpwdreal").attr("proving", 0);
                                            jumi.tips("两次密码输入不一致");
                                        }
                                    } else {
                                        $("#userconfirmpwdreal").attr("proving", 0);
                                    }
                                    this.highlight();
                                },
                                next: function () {
                                    var that = this;
                                    if (that.clickstatus) {
                                        that.clickstatus = false;
                                        var bankcard = that.bankcard.replace(/[ ]/g, "");
                                        //传递的数据
                                        var paranext = {
                                            realname: that.realname,
                                            idNumber: that.idNumber,
                                            bankCardId: bankcard,
                                            payPassword: md5(that.userpwdreal).toLocaleUpperCase(),
                                            confirmPayPassword: md5(that.userconfirmpwdreal).toLocaleUpperCase(),
                                            token: token,
                                            requestSource: "WAP"
                                        };
                                        jumi.alert({
                                            title: "温馨提示",
                                            content:
                                                "<div>" +
                                                "  <p>1.实名认证是验证您所绑定的银行账户是否属于您本人，确保您的资金安全，账户中的资金只能被提现到您本人的银行卡中。</p>" +
                                                "  <p>2.您在绑定银行卡的过程中，为了确保您与第三方监管平台已成功建立资金保障关系，会向您的聚米账户充值1元，充值金额您可正常使用，请您放心！</p>" +
                                                "</div>",
                                            button: [
                                                {
                                                    value: "知道了",
                                                    callback: function () {
                                                        $.ajax({
                                                            url: "/userCenter/userAccount/openAccount",
                                                            type: "post",
                                                            dataType: "json",
                                                            data: paranext,
                                                            success: function (data) {
                                                                if (data.code == "0000") {
                                                                    $("#payForm").attr(
                                                                        "action",
                                                                        data.data.rechargeUrl
                                                                    );
                                                                    $("#req_data").val(data.data.reqData);
                                                                    document.getElementById("payForm").submit();
                                                                } else {
                                                                    jumi.tips(data.msg);
                                                                    that.clickstatus = true;
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        });
                                    }
                                }
                            },
                            ready: function () {
                                nav.setActiveNav("account");
                                $("#myloading").remove();
                                $("img.async").asyncload();
                                //分享
                                weixin
                                    .setTitle()
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
        //   微信登陆--该链接后面带参数
        var url = location.href.split("&code=")[0];
        var locationCodepar = location.href.split("&code=")[1];
        if (locationCodepar) {
            var locationCode = locationCodepar.split("&state=")[0];
            isLoginwx(locationCode, url);
        }
    });
