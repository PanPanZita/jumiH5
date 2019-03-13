/*  
* @description: 上拉加载更多
* @author: adhehe
* @update: null
*/

define(["exports", "jquery", "touch", "jumi"], function(
  exports,
  $,
  touch,
  jumi
) {
  exports.pullup = function(options) {
    //默认初始值
    var defaults = {
      el: "body", //touch的元素
      types: "dragstart drag dragend", //touch动作
      button: "#loadMore", //上拉刷新数据的ID
      buttonHTML: "我已倾囊相授", //加载完后显示的默认文字
      callback: $.noop(), //回调
      isLoading: 0, //是否已经加载完：0未加载，1正在加载，2已加载完
      currentPage: 1, //当前页码
      pageNum: 1 //当前页码（同currentPage）
    };

    var params = $.extend({}, defaults, options);

    touch.on(params.el, params.types, function(e) {
      var $window = $(window);
      var $body = $("body");
      var contentH = $body.height();
      var viewH = $window.height();
      var scrollTop = $window.scrollTop();

      //   改版后去掉这个东西----zita   2018/10/8
      //   if (params.isLoading == 2) {
      //     $(params.button).html("-- 我已倾囊相授 --");
      //     return;
      //   }

      if (e.type == "dragstart") {
        // console.log('dragstart');
      }

      if (e.type == "drag") {
        // console.log('drag');

        if (viewH + scrollTop >= contentH - 20) {
          params.isLoading = 1;
          $(params.button).html(
            '<i class="iconfont">&#xe6bd;</i> <span>松开立即加载</span>'
          );
        } else {
          params.isLoading = 0;
          $(params.button).html(
            '<i class="iconfont">&#xe65d;</i> <span>上拉刷新数据</span>'
          );
        }
      }

      if (e.type == "dragend") {
        // console.log('dragend');

        if (viewH + scrollTop >= contentH - 20 && params.isLoading == 1) {
          $(params.button).html(
            '<span>加载中</span> <img src="/h5/images/loadingDefault.gif" style="display:inline-block;width:1rem;"/>'
          );
          // setTimeout(function(){
          params.callback(params);
          $(params.button).html(
            '<i class="iconfont">&#xe65d;</i> <span>上拉刷新数据</span>'
          );
          // },2000);
        }
      }
    });
  };
});
