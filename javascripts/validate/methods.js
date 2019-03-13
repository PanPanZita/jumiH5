/*!
 * jQuery Validation Plugin v1.12.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
define(function(require) {
	var validate = require('validate');
	var validate_metadata = require('validate_metadata');

	(function($) {
		
		// 输入字符最多{0}个
		jQuery.validator.addMethod("maxWords",function(value, element, params) {
			return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
		}, jQuery.format("Please enter {0} words or less."));

		// 输入字符最少{0}个
		jQuery.validator.addMethod("minWords",function(value, element, params) {
			return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
		}, jQuery.format("Please enter at least {0} words."));

		// 输入字符介于{0}和{1}个
		jQuery.validator.addMethod("rangeWords", function(value, element, params) {
			var valueStripped = stripHtml(value), regex = /\b\w+\b/g;
			return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
		}, jQuery.format("Please enter between {0} and {1} words."));

		// Accept a value from a file input based on a required mimetype
		// 接受输入文件中的值，基于所需的 mimetype
		jQuery.validator.addMethod("accept",function(value, element, param) {
			// Split mime on commas in case we have multiple
			// types we can accept
			var typeParam = typeof param === "string" ? param.replace(/\s/g, "").replace(/,/g, "|") : "image/*", 
				optionalValue = this.optional(element), i, file;

			// Element is optional
			if (optionalValue) {
				return optionalValue;
			}

			if (jQuery(element).attr("type") === "file") {
				// If we are using a wildcard, make it regex
				// friendly
				typeParam = typeParam.replace(/\*/g, ".*");

				// Check if the element has a FileList before
				// checking each file
				if (element.files && element.files.length) {
					for (i = 0; i < element.files.length; i++) {
						file = element.files[i];

						// Grab the mimetype from the loaded
						// file, verify it matches
						if (!file.type.match(new RegExp(".?("+ typeParam + ")$", "i"))) {
							return false;
						}
					}
				}
			}

			// Either return true because we've validated each
			// file, or because the
			// browser does not support element.files and the
			// FileList feature
			return true;
		},jQuery.format("Please enter a value with a valid mimetype."));

		// 只允许字母、数字以及下划线
		jQuery.validator.addMethod("alphanumeric", function(value, element) {
			return this.optional(element) || /^\w+$/i.test(value);
		}, "只允许字母、数字以及下划线");

		//只允许字母
		jQuery.validator.addMethod("lettersonly", function(value, element) {
			return this.optional(element) || /^[a-z]+$/i.test(value);
		}, "Letters only please");

		//只允许字母或标点符号
		jQuery.validator.addMethod("letterswithbasicpunc", function(value,element) {
			return this.optional(element) || /^[a-z\-.,()'"\s]+$/i.test(value);
		}, "Letters or punctuation only please");

		//不允许白空间隔
		jQuery.validator.addMethod("nowhitespace", function(value, element) {
			return this.optional(element) || /^\S+$/i.test(value);
		}, "不允许白空间隔");

		/**
		 * 自定义 金钱验证 保留两位小数 可数为正数（+99.99）或负数（-99.99） 如：{ 0 ture; 0.00 true;
		 * +99.99 true; -99.99 true; 99.999 fase; -99.999 false; }
		 */
		jQuery.validator.addMethod("money", function(value, element) {
			return this.optional(element) || /^((^(-|\+)?[1-9]{1}\d*(\.\d{1,2})?)|(0)|(0\.\d{1,2}))$/.test(value);
		}, "金额保留两位小数");

		/**
		 * 自定义 金钱验证 保留两位小数 金额必须大于等于0 如：{ 0 false; 0.00 true; <0 fase; 99.999
		 * fase; }
		 */
		jQuery.validator.addMethod("moneyBase", function(value, element) {
			return this.optional(element) || /^(([0-9]{1}\d*(\.\d{1,2})?)|(0\.\d{1,2}))$/.test(value);
		}, "金额必须大于等于0.00，保留两位小数");
		/**
		 * 自定义 金钱验证 保留两位小数 金额必须大于0且不等于0 如：{ 0 false; 0.00 false; <0 fase; 99.999
		 * fase; }
		 */
		jQuery.validator.addMethod("moneyNotZero", function(value, element) {
			return this.optional(element) || /^(([1-9]{1}\d*(\.\d{1,2})?)|(0\.([1-9]|\d[1-9])))$/.test(value);
		}, "金额必须大于0.00，保留两位小数");

		/** 正整数 区间：[1,∞) */
		jQuery.validator.addMethod("positiveInteger", function(value, element) {
			return this.optional(element) || /^[0-9]*[1-9][0-9]*$/.test(value);
		}, "请输入一个正整数");
		
		/** 两字段对比,是否大于 */
		jQuery.validator.addMethod("moreTo", function(value, element, param) {
			return value > $(param).val();
		}, "必须大于{0}");
		
		/** 两字段对比,是否大于等于 */
		jQuery.validator.addMethod("moreAndEqualTo", function(value, element, param) {
			return Number(value) >= Number($(param).val());
		}, "必须大于等于{0}");
		
		/** 两字段对比,是否小于 */
		jQuery.validator.addMethod("lessTo", function(value, element, param) {
			var maxnum = $(param).val() ? $(param).val() : $(param).text();
			return value <= parseFloat(maxnum);
		}, "必须小于{0}");
		
		/** 两字段对比,是否小于等于 */
		jQuery.validator.addMethod("lessAndEqualTo", function(value, element, param) {
			return value <= $(param).val();
		}, "必须小于等于{0}");

		/** 特殊，仅适用于会员管理 */
		jQuery.validator.addMethod("amoutLessAndEqualTo", function(value, element, param) {
			var val = $(element).prev().val();
			if (value < 0) {
				return Math.abs(value) <= val;
			}
			return true;
		}, "必须小于等于{0}");

		/**
		 * 身份证号码验证
		 * 
		 */
		function isIdCardNo(num) {

			var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10,5, 8, 4, 2, 1);
			var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5","4", "3", "2");
			var varArray = new Array();
			var intValue;
			var lngProduct = 0;
			var intCheckDigit;
			var intStrLen = num.length;
			var idNumber = num.toUpperCase();
			// initialize
			if ((intStrLen != 15) && (intStrLen != 18)) {
				return false;
			}
			// check and set value
			for (i = 0; i < intStrLen; i++) {
				varArray[i] = idNumber.charAt(i);

				if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
					return false;
				} else if (i < 17) {
					varArray[i] = varArray[i] * factorArr[i];
				}
			}

			if (intStrLen == 18) {
				// check date
				var date8 = idNumber.substring(6, 14);
				if (isDate8(date8) == false) {
					return false;
				}
				// calculate the sum of the products
				for (i = 0; i < 17; i++) {
					lngProduct = lngProduct + varArray[i];
				}
				// calculate the check digit
				intCheckDigit = parityBit[lngProduct % 11];
				// check last digit
				if (varArray[17] != intCheckDigit) {
					return false;
				}
			} else { // length is 15
				// check date
				var date6 = idNumber.substring(6, 12);
				if (isDate6(date6) == false) {
					return false;
				}
			}
			return true;
		}
		/**
		 * 判断是否为“YYYYMM”式的时期
		 * 
		 */
		function isDate6(sDate) {
			if (!/^[0-9]{6}$/.test(sDate)) {
				return false;
			}
			var year, month, day;
			year = sDate.substring(0, 4);
			month = sDate.substring(4, 6);
			if (year < 1700 || year > 2500){
				return false;
			}
			if (month < 1 || month > 12){
				return false;
			}
			return true;
		}
		/**
		 * 判断是否为“YYYYMMDD”式的时期
		 * 
		 */
		function isDate8(sDate) {
			if (!/^[0-9]{8}$/.test(sDate)) {
				return false;
			}
			var year, month, day;
			year = sDate.substring(0, 4);
			month = sDate.substring(4, 6);
			day = sDate.substring(6, 8);
			var iaMonthDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
			if (year < 1700 || year > 2500){
				return false;
			}
			if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)){
				iaMonthDays[1] = 29;
			}
			if (month < 1 || month > 12){
				return false;
			}
			if (day < 1 || day > iaMonthDays[month - 1]){
				return false;
			}
			return true;
		}

		// 手机号码验证
		jQuery.validator.addMethod("mobile", function(value, element, param) {
			var patrn = /^(13|14|15|16|18|17|19)\d{9}$/;
			return this.optional(element) || patrn.test(value);
		}, "请输入正确的手机号码");
		
		// 区号验证
		jQuery.validator.addMethod("areaCode", function(value, element, param) {
			var patrn = /^(0[0-9]{2,3})$/;
			return this.optional(element) || patrn.test(value);
		}, "请输入正确的区号");

		// 电话号码验证
		jQuery.validator.addMethod("phone", function(value, element) {
			var tel = /^([2-9][0-9]{6,7})$/;
			return this.optional(element) || (tel.test(value));
		}, "电话号码格式错误!");

		// 身份证号码验证
		jQuery.validator.addMethod("idcardno", function(value, element) {
			return this.optional(element) || isIdCardNo(value);
		}, "请正确输入身份证号码");

		// 字母数字
		jQuery.validator.addMethod("alnum", function(value, element) {
			return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
		}, "只能包括英文字母和数字");
		
		// 字母数字下划线(且以字母开头)
		jQuery.validator.addMethod("alnumunderline", function(value, element) {
			return this.optional(element) || /^[a-zA-Z]\w*$/.test(value);
		}, "只能包括英文字母、数字和下划线");
		
		//字母数字特殊符号
		jQuery.validator.addMethod("alnumsigns", function(value, element) {
			return this.optional(element) || !/(^[\d]+$)|(^[a-zA-Z]+$)/.test(value);
		}, "由数字、字母或特殊符号组成!");
		
		// 邮政编码验证
		jQuery.validator.addMethod("zipcode", function(value, element) {
			var tel = /^[0-9]{6}$/;
			return this.optional(element) || (tel.test(value));
		}, "请正确填写邮政编码");
		
		// 汉字
		jQuery.validator.addMethod("chcharacter", function(value, element) {
			var tel = /^[\u4e00-\u9fa5]+$/;
			return this.optional(element) || (tel.test(value));
		}, "请输入汉字");

		// 字符最小长度验证（一个中文字符长度为2）
		jQuery.validator.addMethod("stringMinLength", function(value, element, param) {
			var length = value.length;
			for (var i = 0; i < value.length; i++) {
				if (value.charCodeAt(i) > 127) {
					length++;
				}
			}
			return this.optional(element) || (length >= param);
		}, jQuery.format("长度不能小于{0}!"));

		// 字符最大长度验证（一个中文字符长度为2）
		jQuery.validator.addMethod("stringMaxLength", function(value, element, param) {
			var length = value.length;
			for (var i = 0; i < value.length; i++) {
				if (value.charCodeAt(i) > 127) {
					length++;
				}
			}
			return this.optional(element) || (length <= param);
		}, jQuery.format("长度不能大于{0}!"));

		// 字符验证
		jQuery.validator.addMethod("string", function(value, element) {
			return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
		}, "不允许包含特殊符号!");

		

		// 电话号码验证 
		jQuery.validator.addMethod("phone", function(value,element) { 
			var tel = /^(\d{3,4}-?)?\d{7,9}$/g; 
			return this.optional(element) || (tel.test(value)); 
		}, "电话号码格式错误!");
		
		//邮箱验证 
		jQuery.validator.addMethod("email",function(value,element){
			var patrn=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
			return this.optional(element) || patrn.test(value);
		},"请输入正确的区号");

		// 必须以特定字符串开头验证
		jQuery.validator.addMethod("begin", function(value, element, param) {
			var begin = new RegExp("^" + param);
			return this.optional(element) || (begin.test(value));
		}, jQuery.format("必须以 {0} 开头!"));

		// 验证两次输入值是否不相同 
		jQuery.validator.addMethod("notEqualTo",function(value, element, param) { 
			return value != $(param).val(); 
		},jQuery.format("两次输入不能相同!"));
									
		// 验证值不允许与特定值等于
		jQuery.validator.addMethod("notEqual", function(value, element, param) {
			return value != param;
		}, jQuery.format("输入值不允许为{0}!"));

		// 验证值必须大于特定值(不能等于)
		jQuery.validator.addMethod("gt", function(value, element, param) {
			return value > param;
		}, jQuery.format("输入值必须大于{0}!"));

		// 验证值小数位数不能超过两位
		jQuery.validator.addMethod("decimal", function(value, element) {
			var decimal = /^-?\d+(\.\d{1,2})?$/;
			return this.optional(element) || (decimal.test(value));
		}, jQuery.format("小数位数不能超过{0}!"));

		// 图片验证
		jQuery.validator.addMethod("picpathvalid", function(value, element) {
			alert(picpathvalid);
			return picpathvalid();
		}, "条形码输入错误");
		
		//匹配 字母，数字，下划线，汉字和双字节字符
		jQuery.validator.addMethod("normalcharacter", function(value, element) {
			return this.optional(element) || (/[a-zA-Z0-9_\u4e00-\u9fa5\x00-\xff]+$/.test(value));
		}, "不允许特殊字符");
		
		//匹配 字母，汉字和双字节字符
		jQuery.validator.addMethod("encn", function(value, element) {
			return this.optional(element) || (/^([A-Za-z]|[\u4E00-\u9FA5])+$/.test(value));
		}, "只允许中文和字母");
	}(jQuery));

});