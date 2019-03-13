/*  
* @description: 获取location.href 上的参数，并组装成对象
* @author: adhehe
* @update: null
* @use:
* 		getPara.get()
*/
define(['jumi'],function(jumi){	
	return {
		get:function(){
			var o = {};
			var paraArr = location.href.split('?');
			if(paraArr.length > 1 || paraArr[1] != undefined) {
				var paraObj = paraArr[1].split('&');
				for(key in paraObj){
					o[paraObj[key].split('=')[0]] = paraObj[key].split('=')[1];
				}
			}else{
				o = '';
			}
			
			return o;
		},
		getString:function(){
			var paraObj = location.href.split('?')[1];
			return paraObj;
		}
	}
});





