/*
 * 功能：微信浏览器中，点击返回到指定页面
 * 使用：returnLink.setReturnUrl()				  
 * */
define(function(require, exports, module) {
  var my = {
    //默认值
    defaults: {
      needReturnUrl: "/h5/views/main/index.html"
    },
    //设置主标题
    setReturnUrl: function() {
      window.history.pushState(null, null, "");
      var bool = false;
      setTimeout(function() {
        bool = true;
      }, 1000);
      window.addEventListener(
        "popstate",
        function(e) {
          if (bool) {
            location.href = my.defaults.needReturnUrl;
          }
          window.history.pushState(null, null, "");
        },
        false
      );
      if (arguments[0]) {
        my.defaults.needReturnUrl = arguments[0];
      }
      return this;
    }
  };
  return my;
});
