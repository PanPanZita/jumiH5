// 防止横屏操作
window.addEventListener("orientationchange", function(event) {
  var landscapeEle = document.getElementById("landscape");
  if (window.orientation == 180 || window.orientation == 0) {
    // 竖屏模式
    document.ontouchstart = function(e) {
      return true;
    };
    //可以书写自己想要的效果
    document.body.style.overflow = "initial";
    landscapeEle.style.top = "-99999px";
    landscapeEle.style.left = "-99999px";
  }
  if (window.orientation == 90 || window.orientation == -90) {
    // 横屏模式
    document.ontouchstart = function(e) {
      return false;
    };
    //可以书写自己想要的效果
    document.body.style.overflow = "hidden";
    landscapeEle.style.top = "0px";
    landscapeEle.style.left = "0px";
  }
});
