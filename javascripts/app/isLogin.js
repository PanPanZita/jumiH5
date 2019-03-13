/*  
* @description: 判断用户是否登录状态
* @author: adhehe
* @update: null
* @use:isLogin(function(){});
*/

define(["jumi", "jquery"], function(jumi, $) {
  var isLogin = function(callback) {
    var token = localStorage.getItem("token"); //判断是否是新用户
    var redirectUrl = location.href;
    // alert("2/10.isLogin.js的方法是：" + redirectUrl);
    var paralogin = {
      token: token,
      requestSource: "WAP"
    };
    // alert("已经进入到了isLogin这个方法！！");
    $.ajax({
      url: "/common/isLogin",
      type: "post",
      data: paralogin,
      dataType: "json",
      success: function(data) {
        // console.log(data);
        // alert("3/11.isLogin方法" + data.code);
        var resultlink = typeof data.data;
        if (data.code == "0000") {
          // 未登录是null
          //   alert("返回的code码是0000");
          //   alert("4/12.isLogin方法/common/isLogin的结果是：" + !data.data);
          if (!data.data) {
            var param = {
              redirectUrl: redirectUrl,
              requestSource: "WAP"
            };
            $.ajax({
              url: "/weixin/getAuthorizeUrl",
              type: "get",
              data: param,
              dataType: "json",
              success: function(data) {
                if (data.code == "0000") {
                  //   location.href = data.data.authorizeUrl; //请求微信授权
                  location.replace(data.data.authorizeUrl); //请求微信授权
                } else {
                  jumi.tips(data.msg);
                }
              },
              error: function(msg) {
                console.log(msg);
              }
            });
          } else {
            if (typeof callback == "function") {
              callback();
            }
          }
        }
      }
    });
  };
  return isLogin;
});
