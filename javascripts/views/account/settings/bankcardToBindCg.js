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
                                realname: '', //真实姓名
                                idNumber: '', //身份证号
                                bankcard: '',
                                userpwdreal: '',
                                userconfirmpwdreal: '',
                                reservephone: '',
                                phonecode: '',
                                backcardList: data.data.bankList, //支持的银行卡列表
                                originOrderNo: '',
                                clickstatus: true, //防止注册按钮二次点击
                                clickstatuscode: true  //防止注册按钮二次点击
                            }
                        },
                        methods: {
                            highlight: function() {
                                var patrn_null = /^\S{0}$/; //非空
                                var idNumberproving = $("#idNumber").attr("proving") == 1 ? 1 : 0;
                                var bankcardproving = $("#bankcard").attr("proving") == 1 ? 1 : 0;
                                var userpwdrealproving = $("#userpwdreal").attr("proving") == 1 ? 1 : 0;
                                var userconfirmpwdrealproving = $("#userconfirmpwdreal").attr("proving") == 1 ? 1 : 0;
                                var reservephoneproving = $("#reservephone").attr("proving") == 1 ? 1 : 0;
                                var phonecodeproving = $("#phonecode").attr("proving") == 1 ? 1 : 0;
                                var boolNull = !patrn_null.test(this.realname) && !patrn_null.test(this.idNumber) && !patrn_null.test(this.bankcard) && !patrn_null.test(this.userpwdreal) && !patrn_null.test(this.userconfirmpwdreal) && !patrn_null.test(this.reservephone) && !patrn_null.test(this.phonecode);
                                var boolproving = idNumberproving && bankcardproving && userpwdrealproving && userconfirmpwdrealproving && reservephoneproving && phonecodeproving;
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
                            idNumberBlur: function() {
                                var isIDCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                                if (this.idNumber.length > 0 && !isIDCard.test(this.idNumber)) {
                                    jumi.tips('请输入正确的身份证号！');
                                    return;
                                } else {
                                    var para = {
                                        idNumber: this.idNumber,
                                        requestSource: 'WAP'
                                    };
                                    // console.log(para);
                                    $.ajax({
                                        url: '/common/validateIdNumberRepeat',
                                        type: 'post',
                                        dataType: 'json',
                                        data: para,
                                        success: function(data) {
                                            // console.log(data);
                                            if (data.code == '0000') {
                                                $("#idNumber").attr("proving", 1);
                                            } else if (data.code == '1027') {
                                                jumi.tips('该身份证号已被注册');
                                            } else {
                                                jumi.tips(data.msg);
                                            }
                                        }
                                    });
                                }
                                this.highlight();
                            },
                            bankcardKeyup: function(event) {
                                var patrn_number = /^[\d ]*$/; //数字和空格  
                                var bankcardAppear = "";
                                var bankcardStr = "";
                                if (this.bankcard.length > 0 && !patrn_number.test(this.bankcard)) {
                                    $("#userpwdreal").attr("proving", 0);
                                    jumi.tips('请输入有效的银行卡号！');
                                    return;
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
                            bankcardBlur: function() { //数字空格（15-19位）
                                var backCardnum = /[\d ]{17,21}/;
                                if (this.bankcard.length > 0 && !backCardnum.test(this.bankcard)) {
                                    $("#bankcard").attr("proving", 0);
                                    jumi.tips('请输入正确的银行卡号！');
                                    return;
                                } else {
                                    $("#bankcard").attr("proving", 1);
                                }
                                this.highlight();
                            },
                            userpwdrealKeyup: function() {
                                var patrn_number = /^[0-9]*$/; //纯数字                        
                                if (!patrn_number.test(this.userpwdreal)) {
                                    $("#userpwdreal").attr("proving", 0);
                                    jumi.tips('支付密码应为6位数字');
                                    return;
                                }
                                if (this.userpwdreal.length == 6) {
                                    $("#userpwdreal").attr("proving", 1);
                                } else {
                                    $("#userpwdreal").attr("proving", 0);
                                }
                                this.highlight();
                            },
                            userconfirmpwdrealKeyup: function() {
                                var confirmpwdlen = this.userconfirmpwdreal.length;
                                if (confirmpwdlen == 6) {
                                    if (this.userconfirmpwdreal == this.userpwdreal) {
                                        $("#userconfirmpwdreal").attr("proving", 1);
                                    } else {
                                        $("#userconfirmpwdreal").attr("proving", 0);
                                        jumi.tips('两次密码输入不一致');
                                    }
                                } else {
                                    $("#userconfirmpwdreal").attr("proving", 0);
                                }
                                this.highlight();
                            },
                            reservephoneKeyup: function() {
                                var patrn_number = /^[0-9]*$/; //纯数字
                                var patrn = /^(13|14|15|17|18|19)\d{9}$/; //手机号码
                                var phonelen = this.reservephone.length;
                                if (!patrn_number.test(this.reservephone)) {
                                    jumi.tips('手机号码格式不正确！');
                                    return;
                                }
                                if (phonelen == 11) {
                                    if (!patrn.test(this.reservephone)) {
                                        jumi.tips('手机号码格式不正确！');
                                        return;
                                    } else {
                                        $(".havacode").css("opacity", "1");
                                        $(".havacode").removeAttr("disabled", "disabled");
                                        $("#reservephone").attr("proving", 1);
                                    }
                                } else {
                                    $(".havacode").css("opacity", "0.5");
                                    $(".havacode").attr("disabled", "disabled");
                                    $("#reservephone").attr("proving", 0);
                                }
                                this.highlight();
                            },
                            phonecodeKeyup: function() {
                                var patrn_number = /^[0-9]*$/; //纯数字
                                var len = this.phonecode.length;
                                if (!patrn_number.test(this.phonecode)) {
                                    $("#phonecode").attr("proving", 0);
                                    jumi.tips('请输入数字！');
                                    return;
                                }
                                if (len == 6) {
                                    $("#phonecode").attr("proving", 1);
                                } else {
                                    $("#phonecode").attr("proving", 0);
                                }
                                this.highlight();
                            },
                            havacode: function() {
                                var count = 60;
                                var that = this;
                                if(that.clickstatuscode){
                                    that.clickstatuscode = false;
                                    $(".havacode").css("opacity", "0.5");
                                    $(".havacode").attr("disabled", "disabled");
                                    var bankcard = this.bankcard.replace(/[ ]/g, "");
                                    // console.log(bankcard);
                                    var paraPhonecode = {
                                        realname: that.realname,
                                        idNumber: that.idNumber,
                                        bankCardId: bankcard,
                                        phone: that.reservephone,
                                        token: token,
                                        requestSource: 'WAP'
                                    };
                                    $.ajax({
                                        url: '/userCenter/userAccount/getBankCode',
                                        type: 'post',
                                        dataType: 'json',
                                        data: paraPhonecode,
                                        success: function(data) {
                                            // console.log(data);
                                            if (data.code == '0000') {
                                                var countdown = setInterval(function() {
                                                    count--;
                                                    $(".havacode").html(count + 's');
                                                    if (count <= 0) {
                                                        clearInterval(countdown);
                                                        $(".havacode").html("重新获取");
                                                        $(".havacode").css("opacity", "1");
                                                        $(".havacode").removeAttr("disabled", "disabled");
                                                    }
                                                }, 1000);
                                                that.originOrderNo = data.data.orderNo;
                                            } else {
                                                jumi.tips(data.msg);
                                                that.clickstatuscode = true;
                                            }
                                        }
                                    });                                    
                                }
                            },
                            next: function() {
                                var that = this;
                                if (that.clickstatus) {
                                    that.clickstatus = false;
                                    var bankcard = that.bankcard.replace(/[ ]/g, "");
                                    //传递的数据
                                    var paranext = {
                                        realname: that.realname,
                                        idNumber: that.idNumber,
                                        bankCardId: bankcard,
                                        phone: that.reservephone,
                                        payPassword: md5(that.userpwdreal).toLocaleUpperCase(),
                                        confirmPayPassword: md5(that.userconfirmpwdreal).toLocaleUpperCase(),
                                        phoneCode: that.phonecode,
                                        originOrderNo: that.originOrderNo,
                                        token: token,
                                        requestSource: 'WAP'
                                    };
                                    // console.log(paranext);
                                    $.ajax({
                                        url: '/userCenter/userAccount/openAccount',
                                        type: 'post',
                                        dataType: 'json',
                                        data: paranext,
                                        success: function(data) {
                                            // console.log(data);
                                            if (data.code == '0000') {
                                                location.href = "/h5/views/account/settings/openaccountSuccess.html" + location.search;
                                            } else {
                                                location.href = "/h5/views/account/settings/openaccountFail.html?errorMessage=" + data.msg + "&" + location.search.substring(1);
                                            }
                                        }
                                    });
                                }
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