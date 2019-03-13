define(function(require){
	var jumi = require('jumi');
	var validate = require('validate');
	var validate_methods = require('validate_methods');
	var validate_messages = require('validate_messages');
	var validate_metadata = require('validate_metadata');
	
	//只弹出第一个错误信息的设置
	$.validator.setDefaults({
	    invalidHandler: function(form, validator) {
	        $.each(validator.invalid,function(key,value){
	            tmpkey = key;
	            tmpval = value;
	            validator.invalid = {};
	            validator.invalid[tmpkey] = value;
	            jumi.tips(value);
	            return false;
	        });
	    },
	    errorPlacement:function(error, element) {},
	    onkeyup: false,
	    onfocusout:false,
	    focusInvalid: true
	});
});
