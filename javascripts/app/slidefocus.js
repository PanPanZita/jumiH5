/*  
* @description: slidefocus-jquery 焦点图/轮播图/banner
* @author: adhehe
* @update: null
*/

//优化后
define(['jquery'],function($){
	var slidefocus = {
			//默认参数
			defaults:{
				id:'',
				width:"100%",			//百分比：值为比值*父元素宽
				height:"50%",			//百分比：值为比值*width
				play:true, 				//自动播放(true/false),和direction、time组合使用
				direction:"left", 	//上(up)右(right)下(down)左(left)
				time:5000, 			 	//时间间隔(单位毫秒)
				page:true,					//是否显示页码
				wordroll:false				//是否字幕滚动
			},
			
			//页面初始化时加载的数据
			init:function(options){
				var myo = new o(options);
				
				//初始化效果
				myo.transform(0,0,0);
				
				//设置尺寸
				myo.size();
				
				//自适应屏幕
				$(window).resize(function(){
					myo.size();
				});
				
				//设置样式
//				myo.setStyle();
				
				
				
				if(myo.len == 1) return;
				if(myo.dom.length <= 0) return;
				
				//设置排版
				myo.layout();
				
				//只有两张图时
				if(myo.len ==2){
					myo.ul.children().clone().appendTo(myo.ul);
					myo.ul.find('li:nth-child(2)').css('left',myo.width);
					myo.newLen = myo.dom.find("ul li").length;
				}else{
					myo.newLen = myo.len;
				}
				
				//添加页码
				myo.addPage();
				
				//自动滑动
				if(myo.len > 1) myo.autoPlay();
				
				//事件
				if(window.attachEvent){//IE
					myo.domNode.attachEvent('ontouchstart',myo.touchStart); //绑定事件
				}else{
					myo.domNode.addEventListener('touchstart',myo.touchStart,false); //绑定事件
				}
			}
	};
	
	function o(options){
		var that = this;
		this.opts = $.extend({},slidefocus.defaults,options);
		this.dom = $(this.opts.id);//$("#"+opts.dom);
		this.domNode = this.dom.get(0);//document.getElementById(opts.dom);
		this.parentDom = this.dom.parent();
		this.ul = this.dom.find("ul").first();
		this.len = this.dom.find("ul li").length;
		this.width = 0;
		this.height = 0;
		this.parentDomWidth = 0;
		this.parentDomHeight = 0;
		this.startPos = {x:0,y:0};			//取touchStart的坐标值
		this.endPos = {x:0,y:0};				//取touchMove之后的坐标位移
		this.spacePos = {x:0,y:0};
		this.startTime = 0;					//滑动开始时间
		this.endTime = 0;					//滑动结束时间
		this.speed = 0;						//滑动速度
		this.direction;						//触屏滑动的方向
		this.setIntervalId;					//返回的定时调用函数的值
		this.total = 0;						//translate动画移动的距离
		this.i = 0;							//页码及循环计算li的位置
		this.str = "";						//页码字符串
		this.hack = ['-webkit-','-moz-','-ms-','-o-',''];
		this.hackTransform = {};
		
		this.touchStart = function(e) {
			var thiz = this;
			clearInterval(that.setIntervalId);
			var touch=e.touches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
			that.startPos = {x:touch.pageX,y:touch.pageY}; //取第一个touch的坐标值
			that.startTime = new Date();
			if(window.attachEvent){//IE
				thiz.attachEvent('ontouchmove',that.touchMove);//触发touchMove、touchEnd 事件
				thiz.attachEvent('ontouchend',that.touchEnd);
			}else{
				thiz.addEventListener('touchmove',that.touchMove,false);//触发touchMove、touchEnd 事件
				thiz.addEventListener('touchend',that.touchEnd,false);
				
			}
		}
		
		this.touchMove = function(e) {
			//清除循环
			clearInterval(that.setIntervalId);
			
			//当屏幕有多个touch或者页面被缩放过，就不执行touchMove操作
		    if(e.touches.length > 1 || e.scale && e.scale !== 1) return; 
		    
		    //touches数组对象获得屏幕上所有的touch，取每次move时的touch
			var touch=e.touches[0];
			that.endPos = {x:touch.pageX,y:touch.pageY};
			that.direction = that.swipeDirection(that.startPos.x,that.endPos.x,that.startPos.y,that.endPos.y);
			that.spacePos = {x:touch.pageX - that.startPos.x,y:touch.pageY - that.startPos.y};
			//左右 或 上下 滑动时的效果
			if((that.opts.direction == "left" || that.opts.direction == "right") && (that.direction == "left" || that.direction == "right")){
				that.transform(that.total + that.spacePos.x,0,0);
				e.preventDefault();
			}else if((that.opts.direction == "up" || that.opts.direction == "down") && (that.direction == "up" || that.direction == "down")){
				that.transform(0,that.total + that.spacePos.y,0);
				e.preventDefault();
			}
		}
		
		this.touchEnd = function(e) {
			var thiz = this;
			//滑动速度
			that.endTime = new Date() - that.startTime;
			that.speed = Math.abs(that.spacePos.x/that.endTime);
			
			//左右 或 上下 滑动结束后的效果
			if(that.opts.direction == "left" || that.opts.direction == "right"){
				if(that.direction == "left" && (Math.abs(that.spacePos.x) > (that.width/3) || that.speed > 0.2)){
					that.left();
				}else if(that.direction == "right" && (Math.abs(that.spacePos.x) > (that.width/3) || that.speed > 0.2)){
					that.right();
				}else{
					that.transform(that.total,0,300);
				}
			}else if(that.opts.direction == "up" || that.opts.direction == "down"){
				if(that.direction == "up" && (Math.abs(that.spacePos.y) > (that.height/3) || that.speed > 0.2)){
					that.up();
				}else if(that.direction == "down" && (Math.abs(that.spacePos.y) > (that.height/3) || that.speed > 0.2)){
					that.down();
				}else{
					that.transform(0,that.total,300);
				}
			}
			
			//滑动结束后，恢复自动滑动
			that.autoPlay();
			
			//格式化数据
			that.startPos =  {x:0,y:0};
			that.endPos =  {x:0,y:0};
			that.spacePos = {x:0,y:0};
			that.startPos = 0;
			that.endPos = 0;
			that.speed = 0;
			
			if(window.detachEvent){//IE
				thiz.detachEvent('ontouchmove',that.touchMove,false); //解绑事件
				thiz.detachEvent('ontouchend',that.touchEnd,false); //解绑事件
			}else{
				thiz.removeEventListener('touchmove',that.touchMove,false); //解绑事件
				thiz.removeEventListener('touchend',that.touchEnd,false); //解绑事件
			}
		}
		
	}
	
	o.prototype = {
			//尺寸
			size:function(){
				var that = this;
				that.parentDomWidth = $(that.opts.id).parent().width();
				that.width = parseFloat(that.opts.width)/100 * that.parentDomWidth;
				that.height = parseFloat(that.opts.height)/100 * that.parentDomWidth;
				if(that.opts.wordroll){
					that.height = parseFloat(that.opts.height);
				}
				
				$(that.opts.id).css({
					"width":that.width,
					"height":that.height
				});
			},
			//设置样式
			//当一个页面中有多个banner，并且每个banner样式不同时，这里就不能满足需求，需要将CSS样式提取出去
//			setStyle:function(){
//				var style = null;
//				var	styleSheet =".slider{overflow:hidden;position:relative;}"
//					+".slider ul,"
//					+".slider ul li,"
//					+".slider ul li a,"
//					+".slider ul li a img{display:block;width:100%;height:100%;}"
//					+".slider ul{position:relative;}"
//					+".slider ul li{position:absolute;}"
//					+".slider .slidepage{width:100%;position:absolute;bottom:0.5em;text-align:center;}"
//					+".slider .slidepage span{display:inline-block;width:0.5em;height:0.5em;border-radius:100%;background-color:rgba(255,255,255,0.5);margin:0 0.25em;}"
//					+".slider .slidepage span.active{background-color:rgba(255,102,0,1)}";
//				
//				if(document.getElementsByTagName("style").length > 0){
//					var styleSheetLen = document.getElementsByTagName("style").length;
//					style = document.getElementsByTagName("style")[styleSheetLen-1];
//				}else{
//					style = document.createElement("style");
//					document.getElementsByTagName("head")[0].appendChild(style);
//				}
//				if(style.textContent.indexOf('.slider') == -1){
//					text = document.createTextNode(styleSheet);
//					style.appendChild(text);
//				}
//			},
			//根据参数设定是水平排列还是垂直排列
			layout:function(){
				var that = this;
				//水平
				if(that.opts.direction === "left" || that.opts.direction === "right"){
					$(that.opts.id).find("ul li").each(function(index){
						$(this).css({"left":that.width * index})
					})
					if(that.len > 1) $(that.opts.id).find("ul li:last-child").css({"left":-that.width});		//最后一个排到最前左边
				}
				//垂直
				if(that.opts.direction === "up" || that.opts.direction === "down"){
					$(that.opts.id).find("ul li").each(function(index){
						$(this).css({"top":that.height * index})
					})
					if(that.len > 1) that.dom.find("ul li:last-child").css({"top":-that.height});		//最后一个排到最前上边
				}
			},
			//滑动方向
			swipeDirection:function(x1, x2, y1, y2) {
				return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');
		    },

		    //添加页码
			addPage:function(){
				var that = this;
				
				//只有一张图时，无页码
				if(that.len <= 1) return;
		
				if(that.opts.page){
					for(var j = 0; j < that.len; j++){
						that.str += "<span></span>"
					}
					$(that.str).appendTo($("<div class='slidepage'></div>").appendTo($(that.opts.id)));
					$(".slidepage span:first-child").addClass("active");
				}
			},
			//更新页码
			updatePage:function(){
				var that = this;
				if(that.len != 2){
					if(that.opts.page) $(that.opts.id).find(".slidepage span").removeClass("active").eq(that.i).addClass("active");
				}else{
					if(that.opts.page) $(that.opts.id).find(".slidepage span").removeClass("active").eq(that.i%2).addClass("active");
				}
			},
			//自动滑动
			autoPlay:function(){
				var that = this;
				if(that.opts.play){
					if(that.opts.direction == "left"){
						that.setIntervalId = setInterval(function(){that.left()},that.opts.time);
					}else if(that.opts.direction == "right"){
						that.setIntervalId = setInterval(function(){that.right()},that.opts.time);
					}else if(that.opts.direction == "up"){
						that.setIntervalId = setInterval(function(){that.up()},that.opts.time);
					}else if(that.opts.direction == "down"){
						that.setIntervalId = setInterval(function(){that.down()},that.opts.time);
					}
				}
			},
			//动画
			transform:function(x,y,t){
				var that = this;
				for(var i=0; i<that.hack.length;i++){
					that.hackTransform['left'] = x + 'px';
					that.hackTransform['top'] = y + 'px';
					that.hackTransform[that.hack[i] + "transition-duration"] = t + 'ms';
					that.hackTransform[that.hack[i] + "transition-timing-function"] = 'ease-out';
				}
				$(that.opts.id).find("ul").first().css(that.hackTransform);
			},
			//左
			left:function(){
				var that = this;
				that.total = that.total - that.width;
		    	that.transform(that.total,0,300);
		    	that.i++;
		    	that.ul.find("li").eq((that.i+1)%that.newLen).css({"left":that.width - that.total});
				if(that.i >= that.newLen){
					that.i=0;
				}
				that.updatePage();
			},
			//右
			right:function(){
				var that = this;
				that.total = that.total + that.width;
				that.transform(that.total,0,300);
				that.i--;
				that.ul.find("li").eq((that.i-1)%that.newLen).css({"left":-that.width - that.total});
				if(that.i<=-that.newLen){
					that.i=0;
				}
				that.updatePage();
			},
			//上
			up:function(){
				var that = this;
				that.total = that.total - that.height;
		    	that.transform(0,that.total,300);
		    	that.i++;
		    	that.ul.find("li").eq((that.i+1)%that.newLen).css({"top":that.height - that.total});
				if(that.i >= that.newLen){
					that.i=0;
				}
				that.updatePage();
			},
			//下
			down:function(){
				var that = this;
				that.total = that.total + that.height;
				that.transform(0,that.total,300);
				that.i--;
				that.ul.find("li").eq((that.i-1)%that.newLen).css({"top":-that.height - that.total});
				if(that.i<=-that.newLen){
					that.i=0;
				}
				that.updatePage();
			}
	}

	return slidefocus;
});
