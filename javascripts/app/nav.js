/*  
* @description: 底部导航定位
* @author: adhehe
* @update: null
*/
define(['jquery','exports'],function($,exports){
	var footStr = ''
			  	+'<div class="footer">'
			  	+'	<ul class="nav" jumi-nav>'
			  	+'		<li tabIndex="index">'
			  	+'			<a href="/h5/views/main/index.html">'
			  	+'				<i class="iconfont">&#xe642;</i>'
			  	+'					<span>首页</span>'
			  	+'			</a>'
			  	+'		</li>'
			  	+'		<li tabIndex="project">'
			  	+'			<a href="/h5/views/main/list.html?type=0&status=0&itemName=">'
			  	+'				<i class="iconfont">&#xe69e;</i>'
			  	+'				<span>项目</span>'
			  	+'			</a>'
			  	+'		</li>'
			  	+'		<li tabIndex="discover">'
			  	+'			<a href="/h5/views/discover/discover.html">'
			  	+'				<i class="iconfont">&#xe637;</i>'
			  	+'				<span>发现</span>'
			  	+'			</a>'
			  	+'		</li>'
			  	+'		<li tabIndex="account">'
			  	+'			<a href="/h5/views/account/account.html">'
			  	+'				<i class="iconfont">&#xe639;</i>'
			  	+'				<span>我的</span>'
			  	+'			</a>'
			  	+'		</li>'
			  	+'	</ul>'
			  	+'</div>'
	exports.setActiveNav = function(msg){
		$(footStr).appendTo($('body'));
		(function(){
			if(msg == 'index'){
				$("[tabIndex='index']").find('i').addClass('clr-strike').html('&#xe641;').end().find('span').addClass('clr-strike');
			}
			
			if(msg == 'discover'){
				$("[tabIndex='discover']").find('i').addClass('clr-strike').html('&#xe63a;').end().find('span').addClass('clr-strike');
			}
			
			if(msg == 'project'){
				$("[tabIndex='project']").find('i').addClass('clr-strike').html('&#xe69d;').end().find('span').addClass('clr-strike');
			}
			
			if(msg == 'account'){
				$("[tabIndex='account']").find('i').addClass('clr-strike').html('&#xe63c;').end().find('span').addClass('clr-strike');
			}
		})(msg);
	}
});