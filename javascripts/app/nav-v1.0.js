/*  
* @description: 底部导航定位
* @author: adhehe
* @update: null
*/
define(["jquery", "exports"], function($, exports) {
  //商城-投资-我的
  exports.setActiveNav = function(msg) {
    $("#footBox").load("/h5/views/common/footer.html", function() {
      if (msg == "index") {
        $("[tabIndex='index']")
          .find("i")
          .addClass("clr-strike")
          .html("&#xe641;")
          .end()
          .find("span")
          .addClass("clr-strike");
      }

      if (msg == "discover") {
        $("[tabIndex='discover']")
          .find("i")
          .addClass("clr-strike")
          .html("&#xe63a;")
          .end()
          .find("span")
          .addClass("clr-strike");
      }

      if (msg == "shop") {
        $("[tabIndex='shop']")
          .find("i")
          .addClass("clr-strike")
          .html("&#xe640;")
          .end()
          .find("span")
          .addClass("clr-strike");
      }

      if (msg == "account") {
        $("[tabIndex='account']")
          .find("i")
          .addClass("clr-strike")
          .html("&#xe63c;")
          .end()
          .find("span")
          .addClass("clr-strike");
      }
    });
  };

  //点击touch时凹陷效果
  $(function() {
    $("i[data-more]")
      .parents(".group-item")
      .on("touchstart", function(e) {
        $(this).addClass("hover");
      });
    $("i[data-more]")
      .parents(".group-item")
      .on("touchend touchmove touchcancel", function(e) {
        $(this).removeClass("hover");
      });
  });
});
