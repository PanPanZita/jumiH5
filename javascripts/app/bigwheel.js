/*  
* @description: tab 滑动门切换
* @author: adhehe
* @update: null
*/

define(["jquery", "jumi", "isLogin", "isLoginwx"], function(
  jquery,
  jumi,
  isLogin,
  isLoginwx
) {
  var token = localStorage.getItem("token");
  var paraclick = {
    activityId: 1,
    token: token,
    requestSource: "WAP"
  };
  $.fn.extend({
    luckDraw: function(data) {
      var $this = $(this); //祖父元素
      var list = $this.children(".wheel-item");
      var click; //点击对象
      var lineNumber; //几行 3
      var listNumber; //几列 4
      var thisWidth;
      var thisHeight;
      var callback;
      var bt = $(this).find(".wheel-start");

      //对外接口
      if (data.line == null) {
        return;
      } else {
        lineNumber = data.line;
      }
      if (data.list == null) {
        return;
      } else {
        listNumber = data.list;
      }
      if (data.width == null) {
        return;
      } else {
        thisWidth = Number(data.width);
      }
      if (data.height == null) {
        return;
      } else {
        thisHeight = Number(data.height);
      }
      if (data.click == null) {
        return;
      } else {
        click = data.click;
      }
      if (data.callback == null) {
        return;
      } else {
        callback = data.callback;
      }

      ////////////////画面排版
      ///---初始化
      $this.css({
        width: thisWidth * listNumber + "vw",
        height: thisHeight * lineNumber + "vw",
        position: "relative",
        marginTop: thisHeight / 6.5 + "vw"
      });
      list.css({
        width: thisWidth + "vw",
        height: thisHeight + "vw",
        position: "absolute",
        padding: "1vw"
      });
      bt.css({
        top: thisHeight + 1 + "vw",
        left: thisWidth + 1 + "vw",
        width: thisWidth - 2 + "vw",
        height: thisHeight - 2 + "vw",
        lineHeight: thisHeight - 2 + "vw"
      });

      //应该有的总数
      var all = listNumber * lineNumber - (lineNumber - 2) * (listNumber - 2);

      //如果实际方块小于应该有的总数
      if (all > list.length) {
        for (var i = 0; i < all - list.length; i++) {
          $this.append("<li class='wheel-item'>" + all + "</li>");
        }
      }

      list = $this.children(".wheel-item");
      list.css({
        width: thisWidth + "vw",
        height: thisHeight + "vw",
        position: "absolute"
      });

      list.each(function(index) {
        if (index < listNumber) {
          $(this).css({
            top: 0,
            left: (index % listNumber) * thisWidth + "vw"
          });
        } else if (index >= listNumber && index < listNumber + lineNumber - 2) {
          $(this).css({
            top: ((index + 1) % listNumber) * thisHeight + "vw",
            right: 0
          });
        } else if (
          index >= listNumber + lineNumber - 2 &&
          index < 2 * listNumber + lineNumber - 2
        ) {
          $(this).css({
            bottom: 0,
            right: ((index + 2) % listNumber) * thisWidth + "vw"
          });
        } else {
          $(this).css({
            bottom: (index % listNumber) * thisHeight + "vw", //9宫格数量不同，减的数字不同
            left: 0
          });
        }
        if (index + 1 > all) {
          $(this).remove();
        }
      });
      //////////////画面排版 end

      var ix = 0; //计数器，当前滚动到的方格子
      var j = 0; //
      var speed = 500; //加速
      var Countdown = 1000; //匀速
      var dgTime = 200; //
      var isRun = false; //判断是否触发了点击抽奖，如果点击了就灰显按钮，防止刷单
      var resultname = ""; //中奖物品名称
      var stime = -1; //中奖物品位置
      var stop = 0; //计时器ID

      //触发 点击抽奖
      $(click).click(function() {
        if (isRun) {
          return;
        } else {
          //判断是否登录
          isLogin(function() {
            doWheel(); //动画
            isRun = true;
            bt.find("img").attr("src", "/h5/images/wheel/origin/wheel-end.png"); //灰显按钮
          });
        }
      });

      //动画
      function doWheel() {
        $.ajax({
          type: "post",
          url: "/needLogin/activity/checkDraw",
          dataType: "json",
          data: paraclick,
          success: function(data) {
            //判断各种类型的错误，并给出提示
            if (data.code == "0000") {
              //确认奖物品
              stime = data.data.sort;
              resultname = data.data.awardName;

              dgTime += stime * 50;

              speedUp(); //加速动画
            } else {
              jumi.tips(data.msg);
              return;
            }

            //回调
            if (typeof callback == "function") {
              callback(data);
            }
          }
        });
      }

      //加速
      function speedUp() {
        list.removeClass("active");
        list.eq(ix).addClass("active");

        ix++;
        init(ix);

        speed -= 50;

        //				console.log(ix+"==="+speed)

        if (speed == 100) {
          clearTimeout(stop);
          uniform();
        } else {
          stop = setTimeout(speedUp, speed);
        }
      }

      //匀速
      function uniform() {
        list.removeClass("active");
        list.eq(ix).addClass("active");

        ix++;
        init(ix);

        Countdown -= 50;

        //				console.log(ix+"---"+ speed +"---"+Countdown)

        if (Countdown == 200) {
          clearTimeout(stop);
          speedDown();
        } else {
          stop = setTimeout(uniform, speed);
        }
      }

      //减速
      function speedDown() {
        list.removeClass("active");
        list.eq(ix).addClass("active");

        ix++;
        init(ix);

        speed += 50;

        //				console.log(ix+"~~~"+ speed +"~~~"+dgTime)

        if (speed == dgTime - 100) {
          clearTimeout(stop);
          end();
        } else {
          stop = setTimeout(speedDown, speed);
        }
      }

      //结束
      function end() {
        if (ix == 0) {
          ix = all;
        }

        blank(ix); //显示中奖结果
        initB(); //初始化数据
      }

      //归0 && 一圈滚动下来后从头开始滚动
      function init(o) {
        if (o == all) {
          ix = 0;
        }
      }

      //初始化数据
      function initB() {
        ix = 0;
        dgTime = 200;
        speed = 500;
        Countdown = 1000;
      }

      //闪烁
      function blank(ix) {
        var y = ix - 1;
        var z = 0;
        var timer = setInterval(function() {
          list.eq(y).toggleClass("active");
          if (z >= 6) {
            clearInterval(timer);
            list.eq(y).addClass("active");
            //弹出中奖信息
            jumi.alert({
              content: "恭喜！ 您成功抽取了" + resultname,
              button: [
                {
                  value: "知道了",
                  callback: function() {
                    isRun = false;
                    bt.find("img").attr(
                      "src",
                      "/h5/images/wheel/origin/wheel-start.png"
                    );
                  }
                }
              ]
            });
            //解决bug：如果不是点击知道了，而是点击了弹框之外的地方，那么由于弹框的机制，点击了弹框之外的地方，弹框也会消失。那么出现的Bug就是按钮灰显不可点击
            setTimeout(function() {
              isRun = false;
              bt.find("img").attr(
                "src",
                "/h5/images/wheel/origin/wheel-start.png"
              );
            }, 200);
          }
          z++;
        }, 200);
      }
    }
  });
});
