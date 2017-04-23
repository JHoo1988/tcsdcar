define(['jquery','weui','config','jea'],function ($,weui,config,jea) {
    //验证码倒计时
    var wordTimer;
    var wordCnt = 60;
    (function(){
        //扩展Date的format方法
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
    })();
    return {
        getCode  : function (btnId,mobile) {//获取短信验证码
            var _self = this;

            if($.trim(mobile) == ''){
                $.alert('请填写手机号码.');
                return false;
            };

            clearInterval(wordTimer);
            $("#" + btnId).text((wordCnt--)+'秒后重试').addClass('weui_btn_disabled');

            var countDown = function () {
                if (wordCnt == 0) {
                    _self.clearCode(btnId);
                    return false;
                };
                if(!$("#" + btnId).hasClass('weui_btn_disabled')){
                    $("#" + btnId).addClass('weui_btn_disabled');
                }
                $("#" + btnId).text((wordCnt--)+'秒后重试');
            };

            //发送短信
            jea.ajax(config.url.sendMsg, {
                mobile: mobile
            }, function (result) {
                if (result.data) {
                    //启动倒计时
                    wordTimer = window.setInterval(function () {
                        countDown();
                    }, 1000);
                }else{
                    $("#" + btnId).text('获取验证码').removeClass('weui_btn_disabled');
                }
            }, function(){
                $("#" + btnId).text('获取验证码').removeClass('weui_btn_disabled');
            })
        },
        clearCode : function (btnId) {
            clearInterval(wordTimer);
            wordCnt = 60;
            $("#" + btnId).text('获取验证码').removeClass('weui_btn_disabled');
        },
        checkCode : function(mobile,code,success,fail){
            var url = config.url.checkMsgCode;
            var param = {mobile:mobile,code:code};
            jea.ajax(url,param,function(result){
                if(result.data){
                    if(typeof success === 'function'){
                        success();
                    }
                }else{
                    if(typeof fail === 'function'){
                        fail();
                    }
                }

            });
        },
        getCodeByUserId  : function (btnId,userId) {//根据用户id获取短信验证码
            var _self = this;

            clearInterval(wordTimer);
            $("#" + btnId).text((wordCnt--)+'秒后重试').addClass('weui_btn_disabled');

            var countDown = function () {
                if (wordCnt == 0) {
                    _self.clearCode(btnId);
                    return false;
                };
                if(!$("#" + btnId).hasClass('weui_btn_disabled')){
                    $("#" + btnId).addClass('weui_btn_disabled');
                }
                $("#" + btnId).text((wordCnt--)+'秒后重试');
            };

            //发送短信
            jea.ajax(config.url.sendMsgByUserId, {
                userId : userId
            }, function (result) {
                if (result.data) {
                    //启动倒计时
                    wordTimer = window.setInterval(function () {
                        countDown();
                    }, 1000);
                }else{
                    $("#" + btnId).text('获取验证码').removeClass('weui_btn_disabled');
                }
            }, function(){
                $("#" + btnId).text('获取验证码').removeClass('weui_btn_disabled');
            })
        },
        checkCodeByUserId : function(userId,code,success,fail){//根据用户id验证短信验证码
            var url = config.url.checkMsgCodeByUserId;
            var param = {userId:userId,code:code};
            jea.ajax(url,param,function(result){
                if(result.data){
                    if(typeof success === 'function'){
                        success();
                    }
                }else{
                    if(typeof fail === 'function'){
                        fail();
                    }
                }

            });
        },
        showOrder : function () {
            var target = '#nav-order';

            $("a[data-target='"+target+"']").siblings().removeClass('weui_bar_item_on');
            $("a[data-target='"+target+"']").addClass('weui_bar_item_on');

            $(target).siblings().removeClass('weui_tab_bd_item_active');
            $(target).addClass('weui_tab_bd_item_active');
        },
        showHome : function () {
            var target = '#nav-home';

            $("a[data-target='"+target+"']").siblings().removeClass('weui_bar_item_on');
            $("a[data-target='"+target+"']").addClass('weui_bar_item_on');

            $(target).siblings().removeClass('weui_tab_bd_item_active');
            $(target).addClass('weui_tab_bd_item_active');
        },
        getParam : function(param){
            var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        },
        getDateStrTimes : function(param){
            if(param.indexOf(' ') > -1){
                param = param.split(' ')[0];
            };
            return new Date(param.replace(/-/g,"/")).getTime();
        },
        clearHash : function(){
            var url = window.location.href;
            var i = url.indexOf('#');
            if(i != -1){
                url = url.substr(0,i);
            }
            history.replaceState && history.replaceState({},'',url);
        },
        isWeChat : function(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        checkUtf8Str : function(str){
            var newStr = '';
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if(charCode < 0x9FBF){
                    newStr += String.fromCharCode(charCode);
                }
            }
            return newStr;
        },
        checkUtf8Mb4Str : function(str){
            var newStr = '';
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if(charCode < 0xAA80){
                    newStr += String.fromCharCode(charCode);
                }
            }
            return newStr;
        },
        isHanZi:function(str){
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if(charCode < 0x4E00 || charCode > 0x9FFF){
                    return false;
                }
            }
            return true;
        },
        wipeNoHanZi : function(str){
            var newStr = '';
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if((charCode > 0x4E00 && charCode < 0x9FFF)){
                    newStr += String.fromCharCode(charCode);
                }
            }
            return newStr;
        },
        wipeNoLeHanZi : function(str){
            var newStr = '';
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if((charCode > 0x4E00 && charCode < 0x9FFF) || /[a-zA-Z]/.test(str[i])){
                    newStr += String.fromCharCode(charCode);
                }
            }
            return newStr;
        },
        isLeHanZi : function(str){
            for(var i = 0; i < str.length;i++){
                var charCode = str.charCodeAt(i);
                if((charCode > 0x4E00 && charCode < 0x9FFF) || /[a-zA-Z]/.test(str[i])){

                }else{
                    return false;
                }
            }
            return true;
        },

        //校验银行卡号
        luhmCheck : function(bankno) {
            var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhm进行比较）

            var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
            var newArr = new Array();
            for ( var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
                newArr.push(first15Num.substr(i, 1));
            }
            var arrJiShu = new Array(); //奇数位*2的积 <9
            var arrJiShu2 = new Array(); //奇数位*2的积 >9

            var arrOuShu = new Array(); //偶数位数组
            for ( var j = 0; j < newArr.length; j++) {
                if ((j + 1) % 2 == 1) {//奇数位
                    if (parseInt(newArr[j]) * 2 < 9)
                        arrJiShu.push(parseInt(newArr[j]) * 2);
                    else
                        arrJiShu2.push(parseInt(newArr[j]) * 2);
                } else
                //偶数位
                    arrOuShu.push(newArr[j]);
            }

            var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
            var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
            for ( var h = 0; h < arrJiShu2.length; h++) {
                jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
                jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
            }

            var sumJiShu = 0; //奇数位*2 < 9 的数组之和
            var sumOuShu=0; //偶数位数组之和
            var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
            var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
            var sumTotal = 0;
            for ( var m = 0; m < arrJiShu.length; m++) {
                sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
            }

            for ( var n = 0; n < arrOuShu.length; n++) {
                sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
            }

            for ( var p = 0; p < jishu_child1.length; p++) {
                sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
                sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
            }
            //计算总和
            sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu)
                + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

            //计算Luhm值
            var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
            var luhm = 10 - k;

            if (lastNum == luhm && lastNum.length != 0) {
                return true;
            } else {
                return false;
            }
        },

        // 获取微信授权链接
        wxAuthUrl: function (dataSourceType, scope, redirectUri) {
            var _wechatAuth = config.url.wxAuth;
            var _redirectUri = _wechatAuth.redirect_uri;
            var _scope = _wechatAuth.scope; // 默认为  snsapi_base

            if (typeof dataSourceType !== 'undefined') {
                _redirectUri += '/?data_source_type=' + dataSourceType;
            }

            if (typeof redirectUri !== 'undefined') {
                _redirectUri = redirectUri;
            }

            if (typeof scope !== 'undefined') {
                _scope = scope !== _wechatAuth.scope ? 'snsapi_userinfo' : _wechatAuth.scope;
            }

            return _wechatAuth.url + '?appid=' + config.app.appId + '&redirect_uri=' + _redirectUri +
                '&response_type=' + _wechatAuth.response_type + '&scope=' + _scope + '&state=' + _wechatAuth.state;
        },
        /**
         *
         * @param oldurl
         * @param type
         * @returns {string}
         */
        handleUrlToWxOauth : function(oldurl,type){
            var oldurl = encodeURIComponent(oldurl);
            var wxOauth2 = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=1#wechat_redirect";
            wxOauth2 = wxOauth2.replace("APPID", config.app.appId);
            wxOauth2 = wxOauth2.replace("REDIRECT_URI", oldurl);
            if(type == null || type == 'base'){
                //默认静默授权
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
            }else if(type == 'userinfo'){
                //弹出授权页面
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_userinfo");
            }else{
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
            }
            return wxOauth2;
        },

        calc: {
            // 加法
            add: function (arg1, arg2) {
                var r1, r2, m, c;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                }
                catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split(".")[1].length;
                }
                catch (e) {
                    r2 = 0;
                }
                c = Math.abs(r1 - r2);
                m = Math.pow(10, Math.max(r1, r2));
                if (c > 0) {
                    var cm = Math.pow(10, c);
                    if (r1 > r2) {
                        arg1 = Number(arg1.toString().replace(".", ""));
                        arg2 = Number(arg2.toString().replace(".", "")) * cm;
                    } else {
                        arg1 = Number(arg1.toString().replace(".", "")) * cm;
                        arg2 = Number(arg2.toString().replace(".", ""));
                    }
                } else {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
                return (arg1 + arg2) / m;
            },

            // 减法
            sub: function (arg1, arg2) {
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                } catch (e) {
                    r1 = 0;
                }

                try {
                    r2 = arg2.toString().split(".")[1].length;
                } catch (e) {
                    r2 = 0;
                }

                m = Math.pow(10, Math.max(r1, r2));  // 动态控制精度长度
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m).toFixed(n);
            },

            // 乘法
            mul: function (arg1, arg2) {
                var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try {
                    m += s1.split(".")[1].length;
                }
                catch (e) {
                }
                try {
                    m += s2.split(".")[1].length;
                }
                catch (e) {
                }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
            },

            // 除法
            div: function (arg1, arg2) {
                var t1 = 0, t2 = 0, r1, r2;
                try {
                    t1 = arg1.toString().split(".")[1].length;
                }
                catch (e) {
                }
                try {
                    t2 = arg2.toString().split(".")[1].length;
                }
                catch (e) {
                }

                with (Math) {
                    r1 = Number(arg1.toString().replace(".", ""));
                    r2 = Number(arg2.toString().replace(".", ""));
                    return (r1 / r2) * pow(10, t2 - t1);
                }
            }
        },
        getToday : function(){
            var time = new Date();
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            if(m >= 0 && m <= 9){
                m = '0' + m;
            }
            if(d >= 0 && d <= 9){
                d = '0' + d;
            }
            var day = y + '-' + m + '-' + d;
            return day;
        },
        getYesterday : function(){
            var time = new Date();
            var tomorrow = new Date(Date.parse(time) - 86400000);

            var y = tomorrow.getFullYear();
            var m = tomorrow.getMonth()+1;
            var d = tomorrow.getDate();
            if(m >= 0 && m <= 9){
                m = '0' + m;
            }
            if(d >= 0 && d <= 9){
                d = '0' + d;
            }
            var day = y + '-' + m + '-' + d;
            return day;
        },
        getTomorrow : function(){
            var time = new Date();
            var tomorrow = new Date(Date.parse(time) + 86400000);

            var y = tomorrow.getFullYear();
            var m = tomorrow.getMonth()+1;
            var d = tomorrow.getDate();
            if(m >= 0 && m <= 9){
                m = '0' + m;
            }
            if(d >= 0 && d <= 9){
                d = '0' + d;
            }
            var day = y + '-' + m + '-' + d;
            return day;
        },
        /**
         * @func
         * @desc 获取明年今日
         * @returns {string} 明年今日
         */
        getNextYearToday: function () {
            var time = new Date();
            var y = time.getFullYear() + 1;
            var m = time.getMonth() + 1;
            var d = time.getDate();

            if (m >= 0 && m <= 9) {
                m = '0' + m;
            }

            if (d >= 0 && d <= 9) {
                d = '0' + d;
            }

            return y + '-' + m + '-' + d;
        },
        parseDate : function(val){
            if(typeof val === 'string'){
                val = val.replace(/\-/g, "/");
            }
            var date = new Date(val);
            return date;
        }


    };
});