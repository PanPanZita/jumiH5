/*
 * @description: 表单验证
 * @author: adhehe
 * @update: null
 * @use:regexp.validate(patrn,value,callback) 
 * */
define(function(require,exports,module){
	var o = {};
		
		//配置 正则表达式
		o.patrns = [
		    {name:'null',patrn:/^\S{0}$/,errorMsg:''},																//非空
		    {name:'number',patrn:/^[0-9]*$/,errorMsg:''},															//纯数字
		    {name:'letter',patrn:/^[A-Za-z]*$/,errorMsg:''},														//纯字母
		    {name:'special',patrn:/^[\u0391-\uFFE5\w]+$/,errorMsg:''},												//不允许包含特殊符号
		    {name:'alnumsigns',patrn:/(^[\d]+$)|(^[a-zA-Z]+$)/,errorMsg:''},										//由数字、字母或特殊符号组成
		    {name:'length',patrn: /^\S{11}$/,errorMsg:''},															//长度区间（此处的正则无实际意义）
		    {name:'mobile',patrn:/^(13|14|15|16|18|17|19)\d{9}$/,errorMsg:''},											//手机号码
		    {name:'moneyNotZero',patrn:/^(([1-9]{1}\d*(\.\d{1,2})?)|(0\.([1-9]|\d[1-9])))$/,errorMsg:''},			//金额必须大于0.00，保留两位小数
		    {name:'idcard',patrn:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,errorMsg:''}	//身份证验证
		];
		
		//验证方法
		o.validate = function(){
			var reg;				//当前正则表达式
			var args = arguments;	//参数
			var msg;				//提示信息
			
			//循环匹配
			for(key in o.patrns){
				if(args[0] == o.patrns[key].name) {
					reg = o.patrns[key].patrn;
					msg = o.patrns[key].errorMsg;
					
					//长度区间验证需要自定义区间值，组合成字符串再转换成正则表达式
					if(args[0] == 'length'){
						reg = new RegExp("^\\S{"+ args[1] +"}$");
					}
				}
			}
			
			//验证
			var regFun = function(key){
				if(reg.test(args[key])){
//					console.log('验证通过，返回true！')
					return true;
				}else{
					if(typeof args[key+1] == 'function'){
						args[key+1](msg);
					}
//					console.log('验证失败，返回false！')
					return false;
				}
			}
			
			//长度区间验证的参数个数多一个,传递参数数值不同
			if(args[0] == 'length'){
				return regFun(2);
			}else{
				return regFun(1);
			}
			
		};
		
	return o;
});
