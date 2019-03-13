/*  
* @description: 判断用户是否已经绑定手机号，然后跳转页面
* @author: zita
* @update: null
* @use:isLoginwx(function(){});
* @eg :  
项目支持页面，点击“去支持”，如果用户未登录，则调用isLogin() 方法，同时在ready位置进行书写isLoginwx()  的方法。
原理：执行完isLogin()  方法后，会请求微信授权接口，然后微信授权接口会返回给前端一个url，这个URL就是未登录页面的地址，只是相当于又跳转回来只是携带了code等参数，所以需要在ready写isLoginwx方法。。。
代码如下：
methods: {
   toLink: function(itemid, id, money, levelName) {
     // tips：首先判断用户是否登录
       isLogin(function() {
                   
       });
    } //toLink结束
}
  //   微信登陆--该链接后面带参数
  带参数和不带参数事例（https://cs.jumizc.com/h5/views/invest/investGrade.html?itemid=607&code=02hjhfjkhjvThnudhfhd&stateDRTFDGHG
  https://cs.jumizc.com/h5/views/account/account.html?code=02hjhfjkhjvThnudhfhd&stateDRTFDGHG）
ready: function() {
    var url = location.href.split("&code=")[0];
    var locationCodepar = location.href.split("&code=")[1];
    if (locationCodepar) {
        var locationCode = locationCodepar.split("&state=")[0];
        isLoginwx(locationCode, url);

        //url要求是纯正的。就是说，正常进入到该页面是什么URL，那么这个就是那个url
    }   
    }         
*/

define(["jumi", "jquery"], function(jumi, $) {
  var isLoginwx = function(locationCode, urlLink) {
    var parainit = {
      code: locationCode,
      requestSource: "WAP"
    };
    //如果是七夕活动过来的，并且携带参数
    var paraUserid = urlLink.split("report.html?invitorUserId=")[1];

    $.ajax({
      url: "/weixin/wxloginByCode",
      type: "post",
      data: parainit,
      dataType: "json",
      success: function(data) {
        //   console.log(data);
        // alert("7./weixin/wxloginByCode的结果" + urlLink);
        // alert("8./weixin/wxloginByCode的结果" + data.code);
        if (data.code === "0000") {
          if (data.data.bindStatus == 1) {
            //已经绑定了手机号
            localStorage.setItem("token", data.data.token);
            if (paraUserid) {
              //来源：七夕活动（写这个判断语句，是因为不想让url被污染，真正进入到report页面的时候是不携带参数的）
              var urlLinkChange = urlLink.split("?invitorUserId=")[0];
              location.replace(urlLinkChange);
            } else {
              location.replace(urlLink);
            }
          } else {
            location.replace(
              "/h5/views/common/binding.html?openId=" +
                data.data.openId +
                "&unionId=" +
                data.data.unionId +
                "&headImageUrl=" +
                data.data.headImageUrl +
                "&nickName=" +
                data.data.nickName +
                "&redirectUrl=" +
                urlLink
            );
            //ps：此时的redirectUrl的属性值是携带参数invitorUserId的
          }
        } else {
          jumi.tips(data.msg);
          //   return false;
        }
      },
      error: function(msg) {
        console.log(msg);
      }
    });
  };
  return isLoginwx;
});
