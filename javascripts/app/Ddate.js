/**
 * @description: 日期选择
 * @author: adhehe
 * @update: null
 * */

define(['jquery','exports','module'],function(jquery,exports,module){
    var Ddate = {
        _setting:{
            year:'',
            month:'',
            callback:$.noop()
        },
        init:function(options){
            this.callback = options.callback;
            document.querySelector(options.trigger).addEventListener('click',this._create);
        },
        _create:function(){
            Ddate._setting.year = '';
            Ddate._setting.month = '';
            if(document.querySelector('.DdateBox') != null){
                Ddate._removeNode();
            }

            var node = document.createElement('div');
            node.className = 'DdateBox';
            node.innerHTML = '' +
                '<div class="Dcontent"></div>' +
                '<div class="Dbutton">' +
                    '<a href="javascript:void(0)" id="cancelButton">取消</a>' +
                    '<a href="javascript:void(0)" id="okButton">搜索</a>' +
                '</div>';

            document.querySelector('body').appendChild(node);
            Ddate._createDate();

            var cancelButtonNode = document.querySelector('#cancelButton');
            cancelButtonNode.addEventListener('click',Ddate._removeNode);
            var okButtonNode = document.querySelector('#okButton');
            okButtonNode.addEventListener('click',Ddate._search);

            Ddate._select();
        },
        _removeNode:function(){
            var DateBoxNode = document.querySelector('.DdateBox');
            document.querySelector('body').removeChild(DateBoxNode);
            console.log('removeNode');
        },
        _search:function(){
            Ddate._removeNode();
            Ddate.callback({
                year:Ddate._setting.year,
                month:Ddate._setting.month
            });

            console.log(Ddate._setting.year);
            console.log(Ddate._setting.month);
            console.log('search');
        },
        _select:function(){
            var aList = $('.Dmonth');
            aList.click(function(){
                aList.parent().removeClass('active');
                $(this).parent().addClass('active');
                Ddate._setting.year = $(this).parents('.Ditem').find('.Dtitle').text().substring(4,0);
                Ddate._setting.month = $(this).text();
            });
        },
        _createDate:function(){
            var str = '';
            var dateObj = new Date();
            var dateYear = dateObj.getFullYear();
            var minYear = 2014;
            var length = 2018 - 2014 + 1;

            for(var i = 0; i < length; i++){
                str += '' +
                    '<div class="Ditem">' +
                        '<div class="Dtitle">' + (2014 + i) + '年</div>' +
                        '<ul class="Dlist">' +
                            '<li><a href="javascript:void(0)" class="Dmonth">1</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">2</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">3</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">4</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">5</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">6</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">7</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">8</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">9</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">10</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">11</a></li>' +
                            '<li><a href="javascript:void(0)" class="Dmonth">12</a></li>' +
                        '</ul>' +
                    '</div>'
            }

            $('.Dcontent').html(str);

            console.log(dateObj);
            console.log(dateYear);
        }

    }

    module.exports = Ddate;
});