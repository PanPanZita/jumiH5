define([
  "jumi",
  "vue",
  "weixin",
  "isLogin",
  "isLoginwx",
  "dialog",
  "newWxApi"
], function(jumi, vue, weixin, isLogin, isLoginwx, dialog, newWxApi) {
  var token = localStorage.getItem("token");
  var switchBtnone = true;
  var switchBtnAll = true;
  var switchBtnAllToSure = true;
  var parainit = {
    token: token,
    requestSource: "WAP"
  };

  // dialog弹出框宽度
  var viewWidth = $(window).width() * 0.9;
  // 请求活动页面数据
  $.ajax({
    url: "/platformActivity/thirdAnniversary/getActivityInfo",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(res) {
      // console.log('活动页面数据');
      // console.log(res);
      if (res.code == "0000") {
        // 判断活动一 是否被领取
        if (res.data.isReceiveOne == 1) {
          $(".activityone-btn").attr(
            "src",
            "/h5/images/activity/thethirdyear/open-receivedone.png"
          );
        } else {
          // 活动一 领取事件
          $(".activityone-btn").click(function() {
            isLogin(function() {
              receiveActivityone();
            });
          });
        }

        // 判断活动2 是否被领取
        if (res.data.isReceiveTwo == 1) {
          $(".activitytwo-btn").attr(
            "src",
            "/h5/images/activity/thethirdyear/open-receivedone.png"
          );
        } else {
          // 活动2 领取事件
          $(".activitytwo-btn").click(function() {
            isLogin(function() {
              receiveActivitytwo();
            });
          });
        }

        // 活动3 打开一个按钮 领取事件
        $(".activitythree-btnOne").click(function() {
          isLogin(function() {
            if (switchBtnone) {
              switchBtnone = false;
              receiveActivitythree();
            }
          });
        });

        // 活动3 打开全部按钮 领取事件
        $(".activitythree-btnAll").click(function() {
          isLogin(function() {
            if (switchBtnAll) {
              switchBtnAll = false; // 打开全部按钮关掉

              dialog({
                skin: "openActivityThreeAll",
                title: "提示",
                content: "确定打开全部福袋吗？",
                okValue: "确定",
                ok: function() {
                  switchBtnAll = true; // 打开全部按钮-开
                  if (switchBtnAllToSure) {
                    switchBtnAllToSure = false; // 打开全部的确定按钮
                    receiveAllActivitythree();
                  }
                },
                cancelValue: "取消",
                cancel: function() {
                  switchBtnAll = true; // 打开全部按钮
                }
              })
                .width(viewWidth)
                .showModal();
            }
          });
        });

        // 活动三 获奖记录
        $(".award-log").click(function() {
          isLogin(function() {
            // console.log(获奖记录);
            receiveAThreeLog();
          });
        });

        // 活动三 显示红包个数
        if (res.data.luckyBagNum > 0) {
          $(".activitythree-contentInfo").html(
            '您有<span class="aThreeluckyBagNum">' +
              res.data.luckyBagNum +
              "</span>个福袋，快去使用吧!"
          );
        } else {
          $(".activitythree-contentInfo").text(
            "暂无可用福袋，去看看其他活动吧！"
          );
        }
      }
    }
  });

  // 活动一 领取方法
  function receiveActivityone() {
    var token = localStorage.getItem("token");
    var activityone = {
      token: token,
      requestSource: "WAP",
      activityType: 1,
      openType: 1
    };
    // 请求活动页面数据
    $.ajax({
      url: "/platformActivity/thirdAnniversary/receiveActivityReward",
      type: "post",
      dataType: "json",
      data: activityone,
      success: function(res) {
        // console.log('活动一');
        // console.log(res);
        if (res.code == "0000") {
          if (res.data.isReceiveOne == 1) {
            $(".activitytwo-btn").attr(
              "src",
              "/h5/images/activity/thethirdyear/open-receivedone.png"
            );
          } else {
            dialog({
              skin: "activityone",
              title: "提示",
              cancel: false,
              content:
                "感谢" +
                res.data.registerYear +
                "年与聚米的第一次相遇，特此奉上红包" +
                res.data.hongbao +
                "元+聚米币" +
                res.data.coin +
                "个",
              button: [
                {
                  value: "知道了",
                  callback: function() {
                    $(".activityone-btn").attr(
                      "src",
                      "/h5/images/activity/thethirdyear/open-receivedone.png"
                    );
                    // location.reload(); // 重加载页面
                    window.location.href =
                      location.href + "?time=" + new Date().getTime();
                  }
                }
              ]
            })
              .width(viewWidth)
              .showModal();
          }
        } else {
          dialog({
            skin: "activityone",
            title: "提示",
            cancel: false,
            content: res.msg,
            button: [
              {
                value: "知道了",
                callback: function() {
                  // location.reload(); // 重加载页面
                }
              }
            ]
          })
            .width(viewWidth)
            .showModal();
        }
      }
    });
  }

  // 活动二 领取方法
  function receiveActivitytwo() {
    var token = localStorage.getItem("token");
    var activitytwo = {
      token: token,
      requestSource: "WAP",
      activityType: 2,
      openType: 1
    };
    // 请求活动页面数据
    $.ajax({
      url: "/platformActivity/thirdAnniversary/receiveActivityReward",
      type: "post",
      dataType: "json",
      data: activitytwo,
      success: function(res) {
        // console.log(res);
        if (res.code == "0000") {
          if (res.data.isReceiveTwo == 1) {
            $(".activitytwo-btn").attr(
              "src",
              "/h5/images/activity/thethirdyear/open-receivedone.png"
            );
          } else {
            dialog({
              skin: "activitytwo",
              title: "提示",
              cancel: false,
              content:
                "恭喜获得" +
                res.data.hongbao +
                "元投资红包，奖励已发放至您的红包账户",
              button: [
                {
                  value: "知道了",
                  callback: function() {
                    $(".activitytwo-btn").attr(
                      "src",
                      "/h5/images/activity/thethirdyear/open-receivedone.png"
                    );
                    // location.reload(); // 重加载页面
                    window.location.href =
                      location.href + "?time=" + new Date().getTime();
                  }
                }
              ]
            })
              .width(viewWidth)
              .showModal();
          }
        } else {
          dialog({
            skin: "activitytwo",
            title: "提示",
            cancel: false,
            content: res.msg,
            button: [
              {
                value: "知道了",
                callback: function() {
                  // location.reload(); // 重加载页面
                }
              }
            ]
          })
            .width(viewWidth)
            .showModal();
        }
      }
    });
  }

  // 活动三 领取方法
  // 点击打开一个按钮时 执行的方法
  function receiveActivitythree() {
    var token = localStorage.getItem("token");
    var activitythree = {
      token: token,
      requestSource: "WAP",
      activityType: 3,
      openType: 1
    };
    // 请求活动页面数据
    $.ajax({
      url: "/platformActivity/thirdAnniversary/receiveActivityReward",
      type: "post",
      dataType: "json",
      data: activitythree,
      success: function(res) {
        // console.log('打开一个按钮 返回数据');
        // console.log(res);
        if (res.code == "0000") {
          if (res.data.luckyBagNum >= 0) {
            // 判断获取奖励的类型
            if (res.data.cash > 0) {
              var awardType =
                "恭喜您打开1个福袋获得现金" + res.data.cash + "元";
            } else if (res.data.hongbao > 0) {
              var awardType =
                "恭喜您打开1个福袋获得红包" + res.data.hongbao + "元";
            } else {
              return;
            }
            // console.log(awardType);
            dialog({
              skin: "activitythree",
              title: "提示",
              cancel: false,
              content: awardType,
              button: [
                {
                  value: "知道了",
                  callback: function() {
                    switchBtnone = true;
                  }
                }
              ]
            })
              .width(viewWidth)
              .showModal();
            // 活动三 显示红包个数
            if (res.data.luckyBagNum > 0) {
              $(".activitythree-contentInfo").html(
                '您有<span class="aThreeluckyBagNum">' +
                  res.data.luckyBagNum +
                  "</span>个福袋，快去使用吧!"
              );
            } else {
              $(".activitythree-contentInfo").text(
                "暂无可用福袋，去看看其他活动吧！"
              );
            }
          }
        } else {
          dialog({
            skin: "activitythree",
            title: "提示",
            cancel: false,
            content: res.msg,
            button: [
              {
                value: "知道了",
                callback: function() {
                  switchBtnone = true;
                }
              }
            ]
          })
            .width(viewWidth)
            .showModal();
        }
      }
    });
  }

  // 点击打开全部按钮时 执行的方法
  function receiveAllActivitythree() {
    var token = localStorage.getItem("token");
    var activitythreeAll = {
      token: token,
      requestSource: "WAP",
      activityType: 3,
      openType: 2
    };
    // 请求活动页面数据
    $.ajax({
      url: "/platformActivity/thirdAnniversary/receiveActivityReward",
      type: "post",
      dataType: "json",
      data: activitythreeAll,
      success: function(res) {
        // console.log(res);
        if (res.code == "0000") {
          if (res.data.openLuckyBagNum >= 0) {
            dialog({
              skin: "activitythreeAll",
              title: "提示",
              cancel: false,
              content:
                "恭喜您打开" +
                res.data.openLuckyBagNum +
                "个福袋获得现金" +
                res.data.cash +
                "元，红包" +
                res.data.hongbao +
                "元",
              button: [
                {
                  value: "知道了",
                  callback: function() {
                    switchBtnAll = true;
                    switchBtnAllToSure = true; // 打开全部的确定按钮
                    // location.reload(); // 重加载页面
                    window.location.href =
                      location.href + "?time=" + new Date().getTime();
                  }
                }
              ]
            })
              .width(viewWidth)
              .showModal();
          }
        } else {
          dialog({
            skin: "activitythreeAll",
            title: "提示",
            cancel: false,
            content: res.msg,
            button: [
              {
                value: "知道了",
                callback: function() {
                  switchBtnAll = true;
                  switchBtnAllToSure = true; // 打开全部的确定按钮
                }
              }
            ]
          })
            .width(viewWidth)
            .showModal();
        }
      }
    });
  }

  // 获奖记录方法
  function receiveAThreeLog() {
    $.ajax({
      url: "/platformActivity/thirdAnniversary/getLuckyBagRecord",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(res) {
        // console.log(res);
        if (res.data) {
          var receiveLogs = "";
          for (i = 0, len = res.data.length; i < len; i++) {
            // 时间戳转化为时间
            var date = new Date(res.data[i].createTime);
            Y = date.getFullYear() + "-";
            M =
              (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
            D =
              (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
              " ";
            h =
              (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
              ":";
            m =
              (date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes()) + ":";
            s =
              date.getSeconds() < 10
                ? "0" + date.getSeconds()
                : date.getSeconds();
            // console.log(Y + M + D + h + m + s);
            var dateTimes = Y + M + D + h + m + s;
            // console.log(dateTimes);

            // 判断奖励类型
            if (res.data[i].rewardType == 0) {
              var receiveLog =
                '<p class="receiveLogShow">' +
                dateTimes +
                " 获得红包" +
                res.data[i].rewardValue +
                "元</p>";
            } else if (res.data[i].rewardType == 1) {
              var receiveLog =
                '<p class="receiveLogShow">' +
                dateTimes +
                " 获得聚米币" +
                res.data[i].rewardValue +
                "元</p>";
            } else if (res.data[i].rewardType == 2) {
              var receiveLog =
                '<p class="receiveLogShow">' +
                dateTimes +
                " 获得现金" +
                res.data[i].rewardValue +
                "元</p>";
            } else {
              return;
            }
            receiveLogs += receiveLog;
          }
        }
        // console.log(receiveLogs);

        if (res.code == "0000") {
          if (receiveLogs) {
            dialog({
              skin: "receiveAThree",
              title: "获奖记录",
              cancel: false,
              content: receiveLogs,
              button: [
                {
                  value: "知道了",
                  callback: function() {
                    // location.reload(); // 重加载页面
                  }
                }
              ]
            })
              .width(viewWidth)
              .showModal();
          } else {
            dialog({
              skin: "receiveAThree",
              title: "获奖记录",
              cancel: false,
              content: "暂无获奖记录，去看看其他活动吧 ！",
              button: [
                {
                  value: "知道了",
                  callback: function() {
                    // location.reload(); // 重加载页面
                  }
                }
              ]
            })
              .width(viewWidth)
              .showModal();
          }
        } else {
          dialog({
            skin: "receiveAThree",
            title: "提示",
            cancel: false,
            content: res.msg,
            button: [
              {
                value: "知道了",
                callback: function() {
                  // location.reload(); // 重加载页面
                }
              }
            ]
          })
            .width(viewWidth)
            .showModal();
        }
      }
    });
  }

  // 活动一 活动说明
  $(".activityone-explainEvent").click(function() {
    dialog({
      skin: "explainOneEvent",
      title: "活动说明",
      cancel: false,
      content:
        "<p>1、所有投资过的用户（新手训练营及不回报本金型投资除外）均可参与；</p>" +
        "<p>2、每个用户只可领取1次红包；</p>" +
        "<p>3、红包类型为投资红包，可用于众筹项目抵扣投资额的1%；</p>" +
        "<p>4、红包及聚米币领取后自动存入账户，请进入个人中心查看。</p>",
      button: [
        {
          value: "知道了"
        }
      ]
    })
      .width(viewWidth)
      .showModal();
  });

  // 活动二 活动说明
  $(".activitytwo-explain").click(function() {
    dialog({
      skin: "explainTwoEvent",
      title: "活动说明",
      cancel: false,
      content:
        "<p>1、满足条件的回归用户，可同时参与平台其余活动；</p>" +
        "<p>2、投资奖励的红包将于活动结束后1个工作日内自动存入红包账户，请进入个人中心查看。</p>",
      button: [
        {
          value: "知道了"
        }
      ]
    })
      .width(viewWidth)
      .showModal();
  });

  // 活动三 活动说明
  $(".activitythree-explain").click(function() {
    dialog({
      skin: "explainThreeEvent",
      title: "活动说明",
      cancel: false,
      content:
        "1、福袋奖励包含现金、投资红包，中奖率100%；" +
        "<p>2、奖励将在中奖后自动发入您的账户，请进入个人中心查看；</p>" +
        "<p>3、以上内容如有疑问，请拨打客户服务热线400-801-4680，或者添加聚米客服微信jumisec1 进行咨询；</p>" +
        "<p>4、在法律允许范围内，本活动最终解释权归属聚米众筹所有。</p>",
      button: [
        {
          value: "知道了"
        }
      ]
    })
      .width(viewWidth)
      .showModal();
  });

  // 加载
  $("#myloading").remove();

  // 微信接口
  var para = {
    url: decodeURIComponent(location.href.split("#")[0]),
    requestSource: "WAP"
  };

  // console.log(para)
  $.ajax({
    url: "/weixin/initJs",
    type: "post",
    dataType: "json",
    data: para,
    success: function(data) {
      // console.log('微信分享。。');
      // console.log(data);
      if (data.code == "0000") {
        newWxApi.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.data.appId, // 'gh_784eadfde93c', // 必填，公众号的唯一标识
          timestamp: data.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.data.noncestr, // 必填，生成签名的随机串
          signature: data.data.signature, // 必填，签名，见附录1
          jsApiList: [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "chooseImage",
            "previewImage",
            "getNetworkType",
            "scanQRCode",
            "chooseWXPay"
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
      } else {
        // console.log('errorMsg============================' + data.msg);
      }
    },
    error: function() {
      // console.log("ajax error.");
    }
  });

  newWxApi.ready(function() {
    // IOS系统分享时读取图片路径会出现问题 用 encodeURI 来处理下
    var img_url = encodeURI(
      "https://jumifinance.oss-cn-hangzhou.aliyuncs.com/20180403134246.jpg"
    );
    var commonInfo = {
      title: "聚米众筹成立3周年，精彩活动不容错过！",
      desc: "3周年庆典火热进行中，全民送福利，投资赠丰厚豪礼！",
      img: img_url,
      url: "/h5/views/activity/jumithethirdYear.html"
    };

    // console.log('微信分享...图片地址');
    // console.log(img_url);
    // console.log(commonInfo.img);

    var commonUrl = decodeURIComponent(location.href.split("#")[0]);
    commonUrl = commonUrl.split("//")[1];
    commonUrl = commonUrl.split("/")[0];
    // console.log(commonUrl);
    commonInfo.url = "https://" + commonUrl + commonInfo.url;
    // console.log('图片地址。。');
    // console.log(commonInfo.img);

    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
    newWxApi.onMenuShareAppMessage({
      title: commonInfo.title, // 分享标题
      desc: commonInfo.desc, // 分享描述
      link: commonInfo.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl:
        "https://jumifinance.oss-cn-hangzhou.aliyuncs.com/20180403134246.jpg", // 分享图标
      type: "", // 分享类型,music、video或link，不填默认为link
      dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });

    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
    newWxApi.onMenuShareTimeline({
      title: commonInfo.title, // 分享标题
      link: commonInfo.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: commonInfo.img, // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });

    //获取“分享到QQ”按钮点击状态及自定义分享内容接口
    newWxApi.onMenuShareQQ({
      title: commonInfo.title, // 分享标题
      desc: commonInfo.desc, // 分享描述
      link: commonInfo.url, // 分享链接
      imgUrl: commonInfo.img, // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });

    // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
    newWxApi.onMenuShareWeibo({
      title: commonInfo.title, // 分享标题
      desc: commonInfo.desc, // 分享描述
      link: commonInfo.url, // 分享链接
      imgUrl: commonInfo.img, // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
  });
});
