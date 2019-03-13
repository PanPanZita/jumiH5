define([
  "jumi",
  "nav",
  "touch",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin"
], function(jumi, nav, touch, isLogin, isLoginwx, vue, weixin) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/setting/userList",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-personal": {
                template: "#personalTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                }
              }
            },
            ready: function() {
              nav.setActiveNav("account");
              $("#myloading").remove();

              /////////////////////////////////////////////////////////////////////////上传头像
              var w = window.innerWidth; //屏幕宽
              var h = window.innerHeight; //屏幕高
              //截取图片后，需要传给后台的值
              var x, //截取时左上角x坐标
                y, //截取时左上角y坐标
                xw, //截取宽度
                yh, //截取高度
                scale; //截取时缩放比例

              //文件域的值发生变化时触发事件
              $(document).on("change", "#myfile", function(evt) {
                //base64转换及显示 && FileReader
                var reader = new FileReader();
                var f = evt.target.files[0];

                //过滤上传文件的格式 && 清空文件域的值
                if (!f.type.match("image.*")) {
                  jumi.tips("文件格式不正确！");
                  $("#myfile").val("");
                  return;
                }

                //文件读取成功完成时触发事件
                reader.onload = (function(file) {
                  return function(e) {
                    //显示将要裁剪的页面（包括原始图片、截图框、下一步按钮等等，是一个自定义的弹出层）
                    $("#upload-select").show();
                    $("#upload-select-img").css({ height: h });
                    $("#mask").css({ width: w, height: w, top: (h - w) / 2 });

                    var imgChange = new Image();
                    var img = new Image();
                    img.src = e.target.result;
                    img.onload = function() {
                      ////canvas实现图片尺寸等比压缩并转换为base64字符串
                      ////处理图片尺寸容量过大时，base64传输的form数据量有限制报错，所以需要使用canvas做压缩
                      var width = img.width;
                      var height = img.height;
                      var scale = width / height;
                      var widthCanvas = 640;
                      var heightCanvas = parseInt(widthCanvas / scale);
                      var mycanvas = document.getElementById("mycanvas"); //$('#mycanvas');
                      mycanvas.width = widthCanvas;
                      mycanvas.height = heightCanvas;
                      var ctx = mycanvas.getContext("2d");
                      ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height,
                        0,
                        0,
                        widthCanvas,
                        heightCanvas
                      );
                      var cropStr = mycanvas.toDataURL("image/jpeg", 0.5);

                      imgChange.src = cropStr;
                      imgChange.id = "cutimg";
                      imgChange.title = file.name;
                      imgChange.alt = "待剪切的图片";
                      $("#pic").html(imgChange);
                    };
                    img.onerror = function() {
                      console.log("onerror:");
                    };

                    //图片加载完成时触发事件（才能进一步操作）
                    imgChange.onload = function() {
                      var target = this; //图片DOM节点 也可使用 document.getElementById("cutimg")获取
                      var imgw = $(target).width(); //图片初始宽
                      var imgh = $(target).height(); //图片初始高
                      var ratio = imgw / imgh; //图片宽高比
                      var lastImgw = w; //图片变化后的宽（保持与移动端的宽度相同）
                      var lastImgh = lastImgw / ratio; //图片变化后的高
                      var dx = 0,
                        dy = 0,
                        offx = 0,
                        offy = 0; //拖动需要的变量
                      var initialScale = 1,
                        currentScale = 1; //缩放需要的变量
                      var endImgw = lastImgw;
                      var endImgh = lastImgh;

                      //将原始图片自动缩放到和移动端浏览器大小
                      $(target).width(lastImgw);
                      $(target).height(lastImgh);

                      //图片居中
                      $(target).css({
                        left: 0,
                        top: (h - lastImgh) / 2
                      });

                      //                                      console.log("选择图片时各参初始值：");
                      //                                      console.log("imgw:"+ imgw +",imgh:"+ imgh +",lastImgw:"+ lastImgw +",lastImgh:"+ lastImgh +",ratio:"+ ratio +",endImgw:"+ endImgw +",endImgh:"+ endImgh)

                      cut(); //截取

                      //截取位置
                      function cut() {
                        var lastRatio = imgw / lastImgw; //浏览器初始缩放时的缩放率

                        x = (lastImgw / 2 - 160 - offx) * lastRatio;
                        y = (lastImgh / 2 - 160 - offy) * lastRatio;
                        y = y <= 0 ? 0 : y;

                        xw = 320 * lastRatio;
                        xw = xw >= imgw ? imgw : xw;
                        yh = 320 * lastRatio;
                        yh = yh <= imgh ? yh : imgh;

                        scale = currentScale;

                        //                                          alert("x:"+ x +",y:"+ y +",xw:"+ xw +",yh:"+ yh +",scale:"+ scale)
                        //                                          console.log("x:"+ x +",y:"+ y +",xw:"+ xw +",yh:"+ yh +",scale:"+ scale)
                      }

                      //复原规则内的图片位置
                      function restore() {
                        //按缩放比例 改变 拖动边界
                        lastImgw = endImgw * currentScale;
                        lastImgh = endImgh * currentScale;

                        if (offx >= (lastImgw - w) / 2) {
                          offx = dx = (lastImgw - w) / 2;
                        } else if (offx <= -(lastImgw - w) / 2) {
                          offx = dx = -(lastImgw - w) / 2;
                        }

                        if (lastImgh >= w) {
                          if (offy >= (lastImgh - w) / 2) {
                            dy = (lastImgh - w) / 2;
                            offy = (lastImgh - w) / 2;
                          } else if (offy <= -(lastImgh - w) / 2) {
                            dy = -(lastImgh - w) / 2;
                            offy = -(lastImgh - w) / 2;
                          }
                        } else {
                          offy = dy = 0;
                        }

                        target.style.webkitTransform =
                          "translate3d(" +
                          offx +
                          "px," +
                          offy +
                          "px,0) scale(" +
                          currentScale +
                          ")";
                        target.style.webkitTransitionDuration = "0.25s";
                      }

                      //touchstart
                      touch.on("#upload-select-img", "touchstart", function(
                        ev
                      ) {
                        ev.preventDefault();
                      });

                      //touch 拖动
                      touch.on("#upload-select-img", "drag", function(ev) {
                        //ev.x/ev.y：是鼠标点击开始移动后，所移动的距离
                        dx = dx || 0;
                        dy = dy || 0;

                        //积累移动的距离
                        offx = dx + ev.x;
                        offy = dy + ev.y;

                        target.style.webkitTransform =
                          "translate3d(" +
                          offx +
                          "px," +
                          offy +
                          "px,0) scale(" +
                          currentScale +
                          ")";
                        target.style.webkitTransitionDuration = "0s";
                      });
                      touch.on("#upload-select-img", "dragend", function(ev) {
                        //保持上一次移动的距离位置
                        dx += ev.x;
                        dy += ev.y;

                        restore(); //复原位置
                        cut(); //截取
                      });

                      //touch 缩放
                      touch.on("#upload-select-img", "pinch", function(ev) {
                        if (ev.scale >= 1) {
                          currentScale = ev.scale - 1;
                          currentScale = initialScale + currentScale;
                        } else {
                          //缩小时速度与放大时速度不均等，需要乘以系数以增加缩小的速度
                          currentScale = (ev.scale - 1) * 4;
                          currentScale = initialScale + currentScale;

                          //缩小到一定的大小时禁止再缩小，以防止图片翻转放大
                          if (currentScale <= 0.1) {
                            currentScale = 0.1;
                          }
                        }

                        target.style.webkitTransform =
                          "translate3d(" +
                          offx +
                          "px," +
                          offy +
                          "px,0) scale(" +
                          currentScale +
                          ")";
                        target.style.webkitTransitionDuration = "0s";
                      });
                      //
                      touch.on("#upload-select-img", "pinchend", function(ev) {
                        currentScale = currentScale >= 5 ? 5 : currentScale;
                        currentScale = currentScale <= 1 ? 1 : currentScale;
                        initialScale = currentScale;

                        restore(); //复原位置
                        cut(); //截取
                      });
                    };
                  };
                })(f);
                reader.readAsDataURL(f);
              });

              $(document).on("click", "#upload-select-next", function() {
                var imgSrc = $("#cutimg").attr("src");
                var para = {
                  // litpicPath:imgSrc,
                  image: imgSrc,
                  cutx: x,
                  cuty: y,
                  cutw: xw,
                  cuth: yh,
                  // scale:scale,
                  token: token,
                  requestSource: "WAP"
                };
                // console.log(para);
                $.ajax({
                  url: "/userCenter/setting/uploadHeadPic",
                  type: "post",
                  data: para,
                  success: function(data) {
                    // console.log(data);
                    if (data.code == "0000") {
                      $("#upload-select").hide();
                      $("#myfile").val("");
                      // $('#imgShow img').attr('src',data.imageUrl);
                      $("#imgShow img").attr("src", data.data.litpicPath);
                      jumi.tips("上传头像成功！");
                      location.reload();
                    }
                  },
                  error: function(err) {
                    jumi.tips("error");
                  }
                });
              });

              $(document).on("click", "#upload-select-cancel", function() {
                $("#upload-select").hide();
                $("#myfile").val("");
              });
              /////////////////////////////////////////////////////////////////////////上传头像 end

              //分享
              weixin
                .setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();
            } //ready结束
          }); //new Vue 结束
        } //if结束
      }
    });
  }); //isLogin的结束
  //   微信登陆--该链接后面不带参数
  var url = location.href.split("?code=")[0];
  var locationCodepar = location.href.split("?code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
