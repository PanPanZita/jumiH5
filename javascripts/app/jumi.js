/**
 * @description: JUMI通用
 * @author: adhehe
 * @update: null
 * */

define(['jquery','dialog','exports'],function(jquery,dialog,exports){
	//参数设置
	var setting = {
			dialogId:0
	}

	//倒计时
	exports.countdown = function(dom,serverTime){
		var serverTime = parseInt(serverTime) * 1000;
		var dateTime = new Date();
	    var difference = dateTime.getTime() - serverTime;

	    $(dom).each(function(){
	    	var thiz = $(this);
	    	var setIntervalId = setInterval(function(){
	    		var endTime = new Date(parseInt(thiz.data("countdownValue")) * 1000);
	        	var nowTime = new Date();
	        	var nMS=endTime.getTime() - nowTime.getTime() + difference;
	        	var myD=Math.floor(nMS/(1000 * 60 * 60 * 24));
	        	var myH=Math.floor(nMS/(1000*60*60)) % 24;
	        	var myM=Math.floor(nMS/(1000*60)) % 60;
	        	var myS=Math.floor(nMS/1000) % 60;
	        	var myMS=Math.floor(nMS/100) % 10;
	        	var str = "";
	        	if(myD >= 0){
	        		str = myD + "天" + myH + "时" + myM + "分" + myS + "秒";
	        	}else{
	        		str = "已结束！";
	        		clearInterval(setIntervalId);
	  		  	}
	        	thiz.html(str);
	    	},1000)
	    });
	}
	//tips
	exports.tips = function(options){
		//默认初始值
		var defaults = {
				width:"80%",
				height:"auto",
				content:"",
				time:2000
		}
		//参数个数
		var len = arguments.length;

		//无参数时直接返回
		if(len == 0) return;

		//参数只有一个，并且不是对象时
		if(len == 1 && (typeof arguments[0]) != "object"){
			options = {content:String(arguments[0])};
		}

		//参数只有一个，并且为对象时
		if(len == 1 && (typeof arguments[0]) == "object"){
			options = options;
		}

		//参数为两个时
		if(len == 2){
			options = {
					content:String(arguments[0]),
					time:parseInt(arguments[1])
			}
		}

		//参数为3个时
		if(len == 3){
			options = {
					content:String(arguments[0]),
					time:parseInt(arguments[1]),
					callback:arguments[2]
			}
		}


		//合并
		var obj = $.extend({},defaults,options);
		//console.log(obj)

		//弹出窗口
		var d = dialog({
			width:obj.width,
			height:obj.height,
    		content:obj.content,
    		skin:'ui-dialog-black'
    	});
    	d.show();
    	setTimeout(function(){
    		d.close().remove();
    		if(obj.callback) obj.callback();
    	},parseInt(obj.time));
	}
	//tipsfixed
	exports.tipsfixed = function(options){
		//默认初始值
		var defaults = {
				width:"auto",
				height:"auto",
				content:"",
				time:2000
		}
		//参数个数
		var len = arguments.length;

		//无参数时直接返回
		if(len == 0) return;

		//参数只有一个，并且不是对象时
		if(len == 1 && (typeof arguments[0]) != "object"){
			options = {content:String(arguments[0])};
		}

		//参数只有一个，并且为对象时
		if(len == 1 && (typeof arguments[0]) == "object"){
			options = options;
		}

		//参数为两个时
		if(len == 2){
			options = {
					content:String(arguments[0]),
					time:parseInt(arguments[1])
			}
		}

		//合并
		var obj = $.extend({},defaults,options);
		//console.log(obj)

		//弹出窗口
		var d = dialog({
			width:obj.width,
			height:obj.height,
    		content:obj.content
    	});
    	d.showModal();
    	setTimeout(function(){
    		d.close().remove();
    	},parseInt(obj.time));
	}
	//alert
	exports.alert = function(options){
		//默认初始值
		var defaults = {
				fixed:false,
				title:"",
				content:"",
				width:"90%",
				height:"auto",
				skin:'',
            	quickClose: true,
				button:[{
					value:"取消",
					callback:function(){}
				},{
					value:"确定",
					callback:function(){}
				}]
		}
		//参数个数
		var len = arguments.length;
		// console.log(arguments);
		// console.log(len);

		//无参数时直接返回
		if(len == 0 || len > 1) return;

		//参数只有一个，并且不是对象时
		if(len == 1 && (typeof arguments[0]) != "object"){
			options = {content:String(arguments[0])};
		}

		//参数只有一个，并且为对象时(一个按钮和两个按钮的高亮度zpp)
		if(len == 1 && (typeof arguments[0]) == "object"){
			options = options;
			if(options.button && arguments[0].button.length == 2){
				options.button[1].autofocus = true
			}else if(options.button && arguments[0].button.length == 1){
				options.button[0].autofocus = true
			}
		}

		//合并
		var obj = $.extend({},defaults,options);
		//console.log(obj)

		//弹出窗口
		dialog({
			fixed:obj.fixed,
    		title:obj.title,
    		width:obj.width,
    		height:obj.height,
    		skin:obj.skin,
    		content:obj.content,
    		button:obj.button,
    		quickClose:true
    	}).showModal(document.getElementById('option-quickClose'));
	}
});