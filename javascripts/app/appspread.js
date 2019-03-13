/*  
* @description: 针对IOS的推广条
* @author: adhehe
* @update: null
*/
define(['jquery','exports'],function($,exports){
	var str = ''
		+'<div id="appSpread">'
		+'	<a href="/h5/views/ios/appSpreadInfo.html" id="appSpreadImg"><img src="/h5/images/ios/appSpread.jpg" alt="app推广"></a>'
		+'	<a href="javascript:void(0)" id="appSpreadClose"><i class="iconfont">&#xe612;</i></a>'
		+'</div>'
		
	exports.init = function(){
		$('body').prepend(str);
		$('#appSpreadClose').bind('click',function(){
			$('#appSpread').remove();
		});
		$(window).scroll(function(){
			if($(window).scrollTop() >= 300){
                $('#appSpread').animate({
					top:-50
				},0)
			}else{
                $('#appSpread').animate({
					top:0
				},0)
			}
		});
	}
});




