/*  
* @description: 兼容input="tel"，使其展示出来为密码框样式
* @author: zita
* @update: null
*/

define([], function() {

    var initNumber = {
    	init:function(ele){
    		var x = document.getElementById(ele);
	        var style = window.getComputedStyle(x);
	        if(style.webkitTextSecurity){
	            //do nothing
	        }else{
	            x.setAttribute("type","password");
	        }
	        return this;
	    }  
    }


	return initNumber;


});