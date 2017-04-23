/**
 * 序列化form表单所有元素
 * @param filters 可以过滤不需要序列化的表单选项，eg : {name:'userName',ignore:0} 当userName=0时不序列化
 * @returns {{}}
 */
$.fn.getFormData = function(filters) {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {

        //如果是被过滤，则不添加
        var isFilter = false;

        if (filters != null && filters != "" && filters.length != 0){
            for(var i=0;i<filters.length;i++){
                if( (filters[i].name == this.name) && (filters[i].ignore == this.value) ){
                    isFilter = true;
                }
            };
        };

        if(!isFilter){
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [ o[this.name] ];
                };
                o[this.name].push($.trim(this.value));
            } else {
                o[this.name] = $.trim(this.value) || '';
            }
        }
    });
    return o;
};


/*******************************************************
 * Desc   :  表单校验              *
 * Author :  Night <sbmer@qq.com>                      *
 * Date   :  2016年3月23日10:38:44                     *
 *******************************************************/
$.fn.validator = function() {
    var result = true;

    $.each($(this).find('.ha-valid'), function() {
        var isSkip = $(this).attr('data-skip');

        if(isSkip == 1){
            return true;
        };

        var nullText = $(this).data('null-msg');
        var mobileText = $(this).data('mobile-msg');

        var selectText = $(this).data('select-msg');
        var selectAnchor = $(this).data('select');

        var lenText = $(this).data('len-msg');
        var lenAnchor = $(this).data('len');


        if(selectText){
            if(selectAnchor == this.value){
                $.alert(selectText,'');
                result = false;
                return false;
            }
        };

        if(nullText){
            if($.trim(this.value) == ''){
                $.alert(nullText,'');
                result = false;
                return false;
            }
        };

        if(lenText){
            if($.trim(this.value).length > lenAnchor){
                $.alert(lenText.replace('{0}',lenAnchor),'');
                result = false;
                return false;
            }
        };

        if(mobileText){
            if(!/^1+[\d]{10}/.test(this.value)){
                $.alert(mobileText,'');
                result = false;
                return false;
            }
        };
    });

    return result;
};


/*******************************************************
 * Desc   :  鼠标长按、长停等jQuery扩展项              *
 * Author :  Night <sbmer@qq.com>                      *
 * Date   :  2016年1月20日18:09:19                     *
 *******************************************************/
$.fn.longPress = function(callback, time) {
    time = time || 400;
    var timer = null;
    var $this = this;
    $(this).on('touchstart',function(e) {
        var i = 0;
        timer = setInterval(function() {
            i += 10;
            if (i >= time) {
                clearInterval(timer);
                typeof callback == 'function' && callback.call($this);
            }
        }, 10);
    }).on('touchend',function(e) {
        clearInterval(timer);
    })
};

//为数组添加contains方法
Array.prototype.contains = function(item){
    return RegExp("\\b"+item+"\\b").test(this);
};