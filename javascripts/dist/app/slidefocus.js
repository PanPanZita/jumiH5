define(["jquery"],function(t){function e(e){var o=this;this.opts=t.extend({},i.defaults,e),this.dom=t(this.opts.id),this.domNode=this.dom.get(0),this.parentDom=this.dom.parent(),this.ul=this.dom.find("ul").first(),this.len=this.dom.find("ul li").length,this.width=0,this.height=0,this.parentDomWidth=0,this.parentDomHeight=0,this.startPos={x:0,y:0},this.endPos={x:0,y:0},this.spacePos={x:0,y:0},this.startTime=0,this.endTime=0,this.speed=0,this.direction,this.setIntervalId,this.total=0,this.i=0,this.str="",this.hack=["-webkit-","-moz-","-ms-","-o-",""],this.hackTransform={},this.touchStart=function(t){var e=this;clearInterval(o.setIntervalId);var i=t.touches[0];o.startPos={x:i.pageX,y:i.pageY},o.startTime=new Date,window.attachEvent?(e.attachEvent("ontouchmove",o.touchMove),e.attachEvent("ontouchend",o.touchEnd)):(e.addEventListener("touchmove",o.touchMove,!1),e.addEventListener("touchend",o.touchEnd,!1))},this.touchMove=function(t){if(clearInterval(o.setIntervalId),!(t.touches.length>1||t.scale&&1!==t.scale)){var e=t.touches[0];o.endPos={x:e.pageX,y:e.pageY},o.direction=o.swipeDirection(o.startPos.x,o.endPos.x,o.startPos.y,o.endPos.y),o.spacePos={x:e.pageX-o.startPos.x,y:e.pageY-o.startPos.y},"left"!=o.opts.direction&&"right"!=o.opts.direction||"left"!=o.direction&&"right"!=o.direction?"up"!=o.opts.direction&&"down"!=o.opts.direction||"up"!=o.direction&&"down"!=o.direction||(o.transform(0,o.total+o.spacePos.y,0),t.preventDefault()):(o.transform(o.total+o.spacePos.x,0,0),t.preventDefault())}},this.touchEnd=function(t){var e=this;o.endTime=new Date-o.startTime,o.speed=Math.abs(o.spacePos.x/o.endTime),"left"==o.opts.direction||"right"==o.opts.direction?"left"==o.direction&&(Math.abs(o.spacePos.x)>o.width/3||o.speed>.2)?o.left():"right"==o.direction&&(Math.abs(o.spacePos.x)>o.width/3||o.speed>.2)?o.right():o.transform(o.total,0,300):"up"!=o.opts.direction&&"down"!=o.opts.direction||("up"==o.direction&&(Math.abs(o.spacePos.y)>o.height/3||o.speed>.2)?o.up():"down"==o.direction&&(Math.abs(o.spacePos.y)>o.height/3||o.speed>.2)?o.down():o.transform(0,o.total,300)),o.autoPlay(),o.startPos={x:0,y:0},o.endPos={x:0,y:0},o.spacePos={x:0,y:0},o.startPos=0,o.endPos=0,o.speed=0,window.detachEvent?(e.detachEvent("ontouchmove",o.touchMove,!1),e.detachEvent("ontouchend",o.touchEnd,!1)):(e.removeEventListener("touchmove",o.touchMove,!1),e.removeEventListener("touchend",o.touchEnd,!1))}}var i={defaults:{id:"",width:"100%",height:"50%",play:!0,direction:"left",time:5e3,page:!0,wordroll:!1},init:function(i){var o=new e(i);o.transform(0,0,0),o.size(),t(window).resize(function(){o.size()}),1!=o.len&&(o.dom.length<=0||(o.layout(),2==o.len?(o.ul.children().clone().appendTo(o.ul),o.ul.find("li:nth-child(2)").css("left",o.width),o.newLen=o.dom.find("ul li").length):o.newLen=o.len,o.addPage(),o.len>1&&o.autoPlay(),window.attachEvent?o.domNode.attachEvent("ontouchstart",o.touchStart):o.domNode.addEventListener("touchstart",o.touchStart,!1)))}};return e.prototype={size:function(){var e=this;e.parentDomWidth=t(e.opts.id).parent().width(),e.width=parseFloat(e.opts.width)/100*e.parentDomWidth,e.height=parseFloat(e.opts.height)/100*e.parentDomWidth,e.opts.wordroll&&(e.height=parseFloat(e.opts.height)),t(e.opts.id).css({width:e.width,height:e.height})},layout:function(){var e=this;"left"!==e.opts.direction&&"right"!==e.opts.direction||(t(e.opts.id).find("ul li").each(function(i){t(this).css({left:e.width*i})}),e.len>1&&t(e.opts.id).find("ul li:last-child").css({left:-e.width})),"up"!==e.opts.direction&&"down"!==e.opts.direction||(t(e.opts.id).find("ul li").each(function(i){t(this).css({top:e.height*i})}),e.len>1&&e.dom.find("ul li:last-child").css({top:-e.height}))},swipeDirection:function(t,e,i,o){return Math.abs(t-e)>=Math.abs(i-o)?t-e>0?"left":"right":i-o>0?"up":"down"},addPage:function(){var e=this;if(!(e.len<=1)&&e.opts.page){for(var i=0;i<e.len;i++)e.str+="<span></span>";t(e.str).appendTo(t("<div class='slidepage'></div>").appendTo(t(e.opts.id))),t(".slidepage span:first-child").addClass("active")}},updatePage:function(){var e=this;2!=e.len?e.opts.page&&t(e.opts.id).find(".slidepage span").removeClass("active").eq(e.i).addClass("active"):e.opts.page&&t(e.opts.id).find(".slidepage span").removeClass("active").eq(e.i%2).addClass("active")},autoPlay:function(){var t=this;t.opts.play&&("left"==t.opts.direction?t.setIntervalId=setInterval(function(){t.left()},t.opts.time):"right"==t.opts.direction?t.setIntervalId=setInterval(function(){t.right()},t.opts.time):"up"==t.opts.direction?t.setIntervalId=setInterval(function(){t.up()},t.opts.time):"down"==t.opts.direction&&(t.setIntervalId=setInterval(function(){t.down()},t.opts.time)))},transform:function(e,i,o){for(var s=this,n=0;n<s.hack.length;n++)s.hackTransform.left=e+"px",s.hackTransform.top=i+"px",s.hackTransform[s.hack[n]+"transition-duration"]=o+"ms",s.hackTransform[s.hack[n]+"transition-timing-function"]="ease-out";t(s.opts.id).find("ul").first().css(s.hackTransform)},left:function(){var t=this;t.total=t.total-t.width,t.transform(t.total,0,300),t.i++,t.ul.find("li").eq((t.i+1)%t.newLen).css({left:t.width-t.total}),t.i>=t.newLen&&(t.i=0),t.updatePage()},right:function(){var t=this;t.total=t.total+t.width,t.transform(t.total,0,300),t.i--,t.ul.find("li").eq((t.i-1)%t.newLen).css({left:-t.width-t.total}),t.i<=-t.newLen&&(t.i=0),t.updatePage()},up:function(){var t=this;t.total=t.total-t.height,t.transform(0,t.total,300),t.i++,t.ul.find("li").eq((t.i+1)%t.newLen).css({top:t.height-t.total}),t.i>=t.newLen&&(t.i=0),t.updatePage()},down:function(){var t=this;t.total=t.total+t.height,t.transform(0,t.total,300),t.i--,t.ul.find("li").eq((t.i-1)%t.newLen).css({top:-t.height-t.total}),t.i<=-t.newLen&&(t.i=0),t.updatePage()}},i});