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
                                reservephone: '',
                                phonecode: '',
                                originOrderNo: '',
                                clickstatus: true //防止注册按钮二次点击
                            }
                        },
                        methods: {
                            highlight: function() {
                                var patrn_null = /^\S{0}$/; //非空
                                var bankcardproving = $("#bankcard").attr("proving") == 1 ? 1 : 0;
                                var reservephoneproving = $("#reservephone").attr("proving") == 1 ? 1 : 0;
                                var phonecodeproving = $("#phonecode").attr("proving") == 1 ? 1 : 0;
                                var boolNull = !patrn_null.test(this.bankcard) && !patrn_null.test(this.reservephone) && !patrn_null.test(this.phonecode);
                                var boolproving = bankcardproving && reservephoneproving && phonecodeproving;
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
                                if (!backCardnum.test(this.bankcard)) {
                                    $("#bankcard").attr("proving", 0);
                                    jumi.tips('请输入正确的银行卡号！');
                                    return;
                                } else {
                                    $("#bankcard").attr("proving", 1);
                                }
                                this.highlight();
                            },
                            // 重置支付密码框
                            resetpayStatus: function() {
                                var that = this;
                                var fakeinput = $(".fake input");
                                that.paypassword = '';
                                $('.active').css('left', 0 + 'px');
                                var pwd = that.paypassword.trim(); //去掉字符串首尾空格
                                var len = pwd.length;
                                for (var i = 0; i < len; i++) {
                                    fakeinput.eq(i).val(pwd[i]);
                                    if (fakeinput.eq(i).next().length) { //模拟光标改变left值
                                        $('.active').css('left', fakeinput.eq(i + 1).offset().left - fakeinput.eq(0).offset().left - parseInt($('.wrap').css('padding-left')) + 'px');
                                    }
                                }
                                fakeinput.each(function(k, v) { //清空当前input后的所有input值(很重要，虚假现象)
                                    if (k >= len) {
                                        $(this).val("");
                                    }
                                });
                            },
                            //输入密码框
                            inputpwdKeyup: function() {
                                var that = this;
                                var fakeinput = $(".fake input");
                                var patrn_number = /^[0-9]*$/;
                                if (!that.paypassword) { //用户没有输入的时候，光标仍在第一个
                                    $('.active').css('left', 0 + 'px');
                                }
                                if (patrn_number.test(that.paypassword)) {
                                    var pwd = that.paypassword.trim();
                                    var len = pwd.length;
                                    for (var i = 0; i < len; i++) {
                                        fakeinput.eq(i).val(pwd[i]);
                                        if (fakeinput.eq(i).next().length) { //模拟光标改变left值
                                            $('.active').css('left', fakeinput.eq(i + 1).offset().left - fakeinput.eq(0).offset().left - parseInt($('.wrap').css('padding-left')) + 'px');
                                        }
                                    }
                                    fakeinput.each(function(k, v) { //清空当前input后的所有input值(很重要，虚假现象)
                                        if (k >= len) {
                                            $(this).val("");
                                        }
                                    });
                                    if (len == 6) {
                                        //执行其他操作（判断密码是否正确）
                                        var bankcard = that.bankcard.replace(/[ ]/g, "");
                                        var parapaypwd = {
                                            bankCardId: bankcard,
                                            payPassword: md5(that.paypassword).toLocaleUpperCase(),
                                            confirmPayPassword: md5(that.paypassword).toLocaleUpperCase(),
                                            requestSource: 'WAP',
                                            token: token,
                                            originOrderNo: that.originOrderNo,
                                            phone: that.reservephone,
                                            phoneCode: that.phonecode,
                                        };
                                        // console.log(parapaypwd);
                                        $.ajax({
                                            url: '/userCenter/userAccount/bindCard',
                                            type: 'post',
                                            dataType: 'json',
                                            data: parapaypwd,
                                            success: function(data) {
                                                // console.log(data);
                                                if (data.code == '0000') {
                                                    location.href = "/h5/views/account/settings/openaccountSuccess.html" + location.search;
                                                } else if (data.code == '1059') { //支付密码失败
                                                    jumi.tips(data.msg);
                                                    that.resetpayStatus();
                                                    document.getElementById("real").focus();
                                                } else {
                                                    location.href = "/h5/views/account/settings/bankcardToBindFail.html?errorMessage=" + data.msg + "&" + location.search.substring(1);
                                                }
                                            }
                                        });
                                    }
                                } else { //清除输入的密码
                                    jumi.tips('请输入6位数字支付密码');
                                    that.resetpayStatus();
                                }
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
                                var that = this;
                                if (that.clickstatus) {
                                    that.clickstatus = false;
                                    var bankcard = that.bankcard.replace(/[ ]/g, "");
                                    // console.log(bankcard);
                                    var count = 60;
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
                                                that.clickstatus = true;
                                            }
                                        }
                                    });
                                }
                            },
                            next: function() {
                                var that = this;
                                that.resetpayStatus(); //每次点击下一步，都重置密码。
                                var bankcard = that.bankcard.replace(/[ ]/g, "");
                                jumi.alert({
                                    skin: 'ui-dialog-paypwd',
                                    title: '请输入6位数字支付密码',
                                    content: document.getElementById('phonecodeWrap'),
                                    button: [{
                                        value: '忘记密码？',
                                        callback: function() {
                                            location.href = "/h5/views/account/settings/forgetPaypwd.html";
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