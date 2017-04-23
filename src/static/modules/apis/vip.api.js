/**
 * Created by arvin on 2016/5/31.
 */
define(['config','ejs','jea','weui','rsvp','jquery','md5'],function(config,ejs,jea,weui,Q,$){
    var utilUser = require('util_user');
    var utilVip = require("util_vip");
    var utilCommon = require('util_common');

    var App = function(){

    };
    App.prototype = {
        getSignByArr: function(params){
            var _self = this;
            var arr = [];
            for(var item in params){
                arr.push(item);
            }
            arr.sort();
            var values = [];
            for(var i = 0; i < arr.length;i++){
                var kv = arr[i] + '' + params[arr[i]];
                if(arr[i] == 'sign' || params[arr[i]] == null || params[arr[i]] == ''){
                    continue;
                }
                values.push(kv);
            }
            var str = values.join('');
            var newStr = str.slice(-6,str.length) + str.slice(6,str.length-6) + str.slice(0,6);
            var sign = $.md5(newStr);
            return sign;
        },
        getWalletBalance : function(callBack){//查询钱包余额
            var _self = this;
            var param = {
                userId : utilUser.user.getUserId(),
                openId : utilUser.user.getOpenId()
            };
            param.sign = _self.getSignByArr(param);
            jea.post(config.url.getWalletBalance, param, callBack);
        },
        walletPayOrderById : function(payMoney,orderId,orderType,callBack){//开始发起钱包支付
            var _self = this;
            //1.验证支付密码
            //1.1 检测是否设置了支付密码
            var hasPwd = utilVip.order.getWalletPasswordFlag();
            if(hasPwd){//该用户已经设置了密码
                //1.1.1 验证钱包支付密码
                _self.loadInputWalletPasswordPage(payMoney,orderId,orderType,callBack);
            }else{//该用户还未设置了密码
                //1.1.2 设置钱包支付密码
                _self.loadSetWalletPasswordPage(function(){
                    //1.1.3 验证钱包支付密码
                    _self.loadInputWalletPasswordPage(payMoney,orderId,orderType,callBack);
                });
            }
        },
        loadSetWalletPasswordPage : function(callback){//设置钱包支付密码
            var _self = this;
            var content = new EJS({url:'views/temps/subs/tmpl-me-vip-setpassword.ejs'}).render();
            $("body").prepend(content);
            var $wallet = $('.wallet-password');
            $wallet.find('.box1').removeClass('hide');//显示第一个密码输入框，总共有.box1，.box2，.box3
            //close
            $wallet.find('.close').click(function(){
                _self.closeWalletPage();
            });
            //第一次设置密码
            $wallet.find('#pw1').on('input propertychange', function (){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
                var numLen = 6;
                var pw1 = $(this).val();
                var list = $wallet.find('.pw1-ul li');
                for(var i=0; i<numLen; i++){
                    if(pw1[i]){
                        $(list[i]).text('●');
                    }else{
                        $(list[i]).text('');
                    }
                }
                if(pw1.length >= 6){//跳转下一个
                    setTimeout(function(){
                        $wallet.find('.box1').addClass('hide');
                        $wallet.find('.box2').removeClass('hide');
                    },400);
                }
            });
            //第二次设置密码
            $wallet.find('#pw2').on('input propertychange', function (){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
                var numLen = 6;
                var pw1 = $wallet.find('#pw1').val();
                var pw2 = $(this).val();
                var list = $wallet.find('.pw2-ul li');
                for(var i=0; i<numLen; i++){
                    if(pw2[i]){
                        $(list[i]).text('●');
                    }else{
                        $(list[i]).text('');
                    }
                }
                if(pw2.length >= 6){//验证
                    if(pw1 == pw2){//两次密码验证相同

                        //1.向后台注册数据
                        _self.setWalletPassword(pw1,function(result){
                            //console.log(result);
                            utilVip.order.setWalletPasswordFlag(true);//更新缓存中标记
                            $wallet.find('.box2').addClass('hide');
                            $wallet.find('.box3').removeClass('hide');
                            setTimeout(function(){//延时关闭
                                _self.closeWalletPage();
                                if(typeof callback == 'function'){
                                    callback();
                                }
                            },400);
                        });

                    }else{//两次密码验证失败
                        //$wallet.find('.error-tip').text('您输入的密码与上一次不符');
                        $.toastNoIcon('您输入的密码与上一次不符', 'noicon');
                    }

                }

            });
        },
        closeWalletPage : function(){//关闭钱包密码验证页面
            $('.wallet-password').fadeOut('fast',function(){
                $(this).remove();
            })
        },
        loadInputWalletPasswordPage : function(payMoney,orderId,orderType,callBack){//输入钱包支付密码
            var _self = this;
            var content = new EJS({url:'views/temps/subs/tmpl-me-vip-setpassword.ejs'}).render();
            $("body").prepend(content);
            var $wallet = $('.wallet-password');
            $wallet.find('.box4 .desc-num span').text(payMoney);
            $wallet.find('.box4').removeClass('hide');//显示第一个密码输入框，总共有.box1，.box2，.box3

            //close
            $wallet.find('.close').click(function(){
                _self.closeWalletPage();
            });
            //输入密码
            $wallet.find('#pw4').on('input propertychange', function (){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
                var numLen = 6;
                var pw4 = $(this).val();
                var list = $wallet.find('.pw4-ul li');
                for(var i=0; i<numLen; i++){
                    if(pw4[i]){
                        $(list[i]).text('●');
                    }else{
                        $(list[i]).text('');
                    }
                }
                if(pw4.length >= 6){//调起支付
                    if($(this).hasClass('disabled')){
                        return false;
                    }else{
                        $(this).addClass('disabled');
                        _self.closeWalletPage();
                        _self.walletPayToService(pw4,orderId,orderType,callBack);
                    }
                }
            });
        },
        walletPayToService : function(password,orderId,orderType,callBack){//向后台服务发起支付
            var _self = this;
            password = _self.MD5Password(password);
            //2.钱包支付
            var param={
                walletPwd : password,
                orderId : orderId,
                userId : utilUser.user.getUserId(),
                orderType : orderType
            };
            param.sign = _self.getSignByArr(param);
            jea.ajax(config.url.walletPay, param, callBack);
        },
        setWalletPassword : function(password,callBack){//向后台注册支付验证密码
            var _self = this;
            password = _self.MD5Password(password);
            var param = {
                userId : utilUser.user.getUserId(),
                newPwd : password
            };
            param.sign = _self.getSignByArr(param);
            jea.post(config.url.setWalletPassword, param, callBack);
        },
        loadFindWalletPasswordPage : function(){//加载页面 忘记密码：找回支付密码
            var _self = this;
            var userMobile = utilUser.user.getUserByKey('userMobile');
            userMobile = userMobile.slice(7);

            var content = new EJS({url: "views/temps/subs/tmpl-me-vip-forgetpassword.ejs"}).render({userMobile : userMobile});
            $("body").prepend(content);
            _self.bindEventForFindWalletPasswordPage();
        },
        bindEventForFindWalletPasswordPage : function(){
            var _self = this;
            var $me = $(".find-password");
            //过滤特殊字符
            $me.find('input').on('input propertychange', function (){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
            });

            //取消
            $me.find('.js-cancel').click(function(){
                _self.closeFindWalletPasswordPage();
            });

            //获取验证码
            $me.find('.js-get-vcode').click(function(){
                if(!$(this).hasClass('weui_btn_disabled')){
                    var userId = utilUser.user.getUserId();
                    utilCommon.getCodeByUserId('js-get-vcode',userId);
                }
            });
            //下一步:先验证短信验证码是否正确
            $me.find('.js-next').click(function(){
                var $this = $(this);
                if($this.hasClass('disabled')){
                    return false;
                }else{
                    $this.addClass('disabled');
                    var userId = utilUser.user.getUserId();
                    var vcode = $me.find('input[name="vcode-num"]').val();
                    utilCommon.checkCodeByUserId(userId,vcode,function(){//验证正确success
                        //$me.find('.vcode-error-info').text('');
                        $me.find('.box1').addClass('hide');
                        $me.find('.box2').removeClass('hide');
                    },function(){
                        //$me.find('.vcode-error-info').text('验证码错误');
                        $.toastNoIcon('验证码错误', 'noicon');
                        $this.removeClass('disabled');
                    });
                }
            });
            //第二步:输入支付密码
            $me.find('#password').on('input propertychange', function (){
                var numLen = 6;
                var password = $(this).val();
                var list = $me.find('.password-ul li');
                for(var i=0; i<numLen; i++){
                    if(password[i]){
                        $(list[i]).text('●');
                    }else{
                        $(list[i]).text('');
                    }
                }
            });
            //第三步:提交修改支付密码
            $me.find('.js-submit').click(function(){
                var $this = $(this);
                if($this.hasClass('disabled')){
                    return false;
                }else{
                    $this.addClass('disabled');
                    var password = $me.find('#password').val();
                    if(password.length >= 6){//更新密码
                        var vcode = $me.find('input[name="vcode-num"]').val();
                        _self.findWalletPassword(password,vcode,function(){//修改成功
                            $me.find('.box2').addClass('hide');
                            $me.find('.box3').removeClass('hide');
                            setTimeout(function(){
                                _self.closeFindWalletPasswordPage();
                            },500);
                        });
                    }else{
                        $.toastNoIcon('请输入6位数密码', 'noicon');
                        $this.removeClass('disabled');
                    }
                }
                setTimeout(function(){
                    $this.removeClass('disabled');
                },1000)

            });

        },
        closeFindWalletPasswordPage : function(){//关闭页面 忘记密码：找回支付密码
            $('.find-password').fadeOut('fast',function(){
                $(this).remove();
            });
        },
        findWalletPassword : function(password,code,successCallBack,errorCallBack){//向后台找回支付验证密码
            var _self = this;
            password = _self.MD5Password(password);
            var param = {
                userId : utilUser.user.getUserId(),
                code : code,
                newPwd : password
            };
            jea.post(config.url.findWalletPassword, param, successCallBack,errorCallBack);
        },
        updateWalletPassword : function(oldPwd,newPwd,successCallBack,errorCallBack){//修改支付密码
            var _self = this;
            oldPwd = _self.MD5Password(oldPwd);
            newPwd = _self.MD5Password(newPwd);
            var param = {
                userId : utilUser.user.getUserId(),
                oldPwd : oldPwd,
                newPwd : newPwd
            };
            param.sign = _self.getSignByArr(param);
            jea.post(config.url.updateWalletPassword, param, successCallBack,errorCallBack);
        },
        MD5Password : function(password){//MD5加密密码
            var str = $.md5(password);
            var newStr = str.slice(-6,str.length) + str.slice(6,str.length-6) + str.slice(0,6);
            return newStr;
        },
        refreshMeDom : function(){//刷新个人中心DOM内容
            var _self = this;
            Q.all([_self.getMyWalletInfo(), _self.getMemberLevels()])
                .then(function(datas){
                    var vipInfo = _self.getVipInfoObj(datas[0].data,datas[1].data);

                    //console.log('vipInfo');console.log(vipInfo);
                    utilVip.order.setVipDiscountInfo(vipInfo.vipDiscount);//更新当前用户所拥有的会员特权数据
                    var $me = $('.me');

                    var $userInfo = $me.find('.user-info');
                    $userInfo.find('.level-img').attr({src:vipInfo.levelImg,alt:vipInfo.levelName});//1
                    $userInfo.find('.progress-bar').css('width',vipInfo.expPercent+'%');//2
                    $userInfo.find('.experience-num').text(vipInfo.exp+'/'+vipInfo.levelEndScore);//3
                    $userInfo.find('.my-exp').text(vipInfo.exp);//4
                    $me.find('.balance-box .balance-box-num').text(vipInfo.walletBalance);//5 余额显示值
                    $me.find('.rechargecard-box .rechargecard-box-num').text(vipInfo.rechargeCardsCount);//6 个人中心充值卡显示值修改


                })
                .finally(function(){

                });


        },
        refreshPhoneDom : function(userMobile){//绑定手机后需要更新个人中心的用户名显示
            userMobile = userMobile.substr(0,3)+"****"+userMobile.substr(7);
            //1
            utilUser.user.setUserItem('userMobile',userMobile);
            //2 保存用户设置了手机号码
            utilVip.order.setPhoneFlag(true);
            //3
            var $me = $('.me .user-info');
            $me.find('.name-txt').text(userMobile);
        },
        getMyWalletInfo : function(){//获取我的钱包信息（经验值）
            var _self = this;
            return new Q.Promise(function(resolve, reject) {
                _self.getWalletBalance(function(result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("getMyWalletInfo failed");
                    }
                })

            });
        },
        getMemberLevels : function(){//获取会员等级
            var _self = this;
            return new Q.Promise(function(resolve, reject) {
                jea.get(config.url.getMemberLevels, function(result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("getMemberLevels failed");
                    }
                });
            });
        },
        getMemberUserInfo : function(){//获取账户信息
            var param = {
                userId : utilUser.user.getUserId(),
                wechatOpenId : utilUser.user.getOpenId()
            };
            return new Q.Promise(function(resolve, reject) {
                jea.ajax(config.url.getMemberUserInfo,param, function(result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("getMemberUserInfo failed");
                    }
                });
            });
        },
        getVipInfoObj : function(walletObj,levelObj){
            var _self = this;
            var myWalletInfo = null,
                myLevelInfo,
                levelList = levelObj;
            //个人钱包信息
            if(walletObj){
                myWalletInfo = walletObj;
            }else{
                myWalletInfo = {
                    hasPwd : false,
                    incomeList: [],
                    walletAmount : 0,//累计充值金额
                    walletBalance : 0,//余额
                    walletGrowUp : 0,//累计成长值
                    walletPay : 0,//累计消费金额
                    eleCardsCount : 0 //我的充值卡数量
                };
            }
            //个人等级信息
            var exp = Math.floor(myWalletInfo.walletGrowUp);
            if(exp>10000){
                exp = 10000;
            }
            var arr = levelList.filter(function(item,index,array){
                return exp >= item.levelBeginScore && exp <= item.levelEndScore;
            });
            myLevelInfo = arr[0];
            var expPercent = (exp/myLevelInfo.levelEndScore).toFixed(2) * 100;
            if(expPercent>100){
                expPercent = 100;
            }

            //计算会员打折信息
            var incomeList =  myWalletInfo.incomeList || [];
            //清洗1 維修2 安裝3
            //1.清洗
            var washArr = incomeList.filter(function(item){
                return item.incomeOrderType == 1;
            });
            var washObj = washArr[0];
            var wash = null;
            if(washObj){
                wash = {
                    levelName : myLevelInfo.levelName,
                    incomeValueType : washObj.incomeValueType,
                    incomeValue : washObj.incomeValue
                };
            }else{
                wash = {
                    levelName : myLevelInfo.levelName,
                    incomeValueType : 3,
                    incomeValue : 100
                };//不打折
            }

            //2.维修
            var repairArr = incomeList.filter(function(item){
                return item.incomeOrderType == 2;
            });
            var repairObj = repairArr[0];
            var repair = null;
            if(repairObj){
                repair = {
                    levelName : myLevelInfo.levelName,
                    incomeValueType : repairObj.incomeValueType,
                    incomeValue : repairObj.incomeValue
                };
            }else{
                repair = {
                    levelName : myLevelInfo.levelName,
                    incomeValueType : 3,
                    incomeValue : 100
                };//不打折
            }

            //3.安装
            var installArr = incomeList.filter(function(item){
                return item.incomeOrderType == 3;
            });
            var installObj = installArr[0];
            var install = null;
            if(installObj){
                install = {
                    levelName : myLevelInfo.levelName,
                    incomeValueType : installObj.incomeValueType,
                    incomeValue : installObj.incomeValue
                };
            }else{
                install = {
                    levelName : myLevelInfo.levelName,
                    incomeValueType : 3,
                    incomeValue : 100
                };//不打折
            }


            var o = {
                walletBalance : myWalletInfo.walletBalance,//余额
                exp : exp,
                expPercent : expPercent,
                levelId : myLevelInfo.levelId,
                levelName : myLevelInfo.levelName,
                levelImg : 'styles/imgs/vip/level/'+myLevelInfo.levelId+'.png',
                levelBeginScore : myLevelInfo.levelBeginScore,
                levelEndScore : myLevelInfo.levelEndScore,
                hasPwd : myWalletInfo.hasPwd,
                vipDiscount : {
                    wash : wash,
                    repair : repair,
                    install : install
                },
                rechargeCardsCount : myWalletInfo.eleCardsCount || 0//我的充值卡数量
            };
            return o;
        },
        checkMobileBind : function(){//检测用户是否绑定了手机号码
            var _self = this;
            var userId = utilUser.user.getUserId();
            var url = config.url.checkMobileBind + '/' + userId;
            return new Q.Promise(function(resolve, reject) {
                jea.post(url, function(result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("checkMobileBind failed");
                    }
                });
            });
        },
        loadSetPhonePage : function(){//加载 绑定手机页面
            var _self = this;
            var content = new EJS({url:'views/temps/subs/tmpl-me-vip-setphone.ejs'}).render();
            $("body").prepend(content);
            $phone = $('.vip-phone');
            $phone.find('.box1').removeClass('hide');//显示第一个手机号码输入框，总共有.box1，.box2
            //限制输入特殊字符
            $phone.find('input').on('input propertychange', function (){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
            });
            //获取验证码
            $phone.find('#js-get-vcode').click(function(){
                var phone = $phone.find('input[name="phone-num"]').val();
                if(_self.checkIsMobile(phone)){
                    //$phone.find('.phone-error-info').text('');
                    if(!$(this).hasClass('weui_btn_disabled')){
                        utilCommon.getCode('js-get-vcode',phone);
                    }
                }else{
                    $.toastNoIcon('请输入有效的手机号码', 'noicon');
                    /*$phone.find('.phone-error-info').text('请输入有效的手机号码');*/
                }

            });
            //提交手机绑定
            $phone.find('.js-submit').click(function(){
                var $this = $(this);
                if($this.hasClass('disabled')){
                    return false;
                }else{
                    $this.addClass('disabled');
                    var phone = $phone.find('input[name="phone-num"]').val();
                    var vcode = $phone.find('input[name="vcode-num"]').val();

                    if(_self.checkIsMobile(phone)){//手机号码正确，则向后台注册手机号
                        //$phone.find('.phone-error-info').text('');
                        utilCommon.checkCode(phone,vcode,function(){//验证正确success

                            _self.bindMobileToService(phone,vcode,function(result){
                                //console.log('result');console.log(result);
                                if(result){
                                    utilVip.order.setPhoneFlag(true);//更新缓存中标记
                                    $phone.find('.box1').addClass('hide');
                                    $phone.find('.box2').removeClass('hide');
                                    setTimeout(function(){
                                        _self.closeSetPhonePage();
                                        _self.refreshPhoneDom(phone);
                                    },500);
                                }
                            });

                        },function(){
                            //$phone.find('.vcode-error-info').text('验证码错误');
                            $.toastNoIcon('验证码错误', 'noicon');
                            $this.removeClass('disabled');
                        });
                    }else{
                        //$phone.find('.phone-error-info').text('请输入有效的手机号码');
                        $.toastNoIcon('请输入有效的手机号码', 'noicon');
                        $this.removeClass('disabled');
                    }

                    setTimeout(function(){
                        $this.removeClass('disabled');
                    },1000);



                }
            });

        },
        closeSetPhonePage : function(){//关闭手机绑定页面
            var _self = this;
            $('.vip-phone').fadeOut('fast',function(){
                $(this).remove();
            })
        },
        loadUpdatePhonePage : function(callBack){//账户管理界面中的修改手机界面
            var _self = this;
            var content = new EJS({url:'views/temps/subs/tmpl-me-vip-setphone.ejs'}).render();
            $("body").prepend(content);
            $phone = $('.vip-phone');
            $phone.find('.box3').removeClass('hide');//显示第一个手机号码输入框，总共有.box3，.box2
            //限制输入特殊字符
            $phone.find('input').on('input propertychange', function (){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
            });
            //获取验证码
            $phone.find('#js-update-get-vcode').click(function(){
                var phone = $phone.find('input[name="update-phone-num"]').val();
                if(_self.checkIsMobile(phone)){
                    //$phone.find('.update-phone-error-info').text('');
                    if(!$(this).hasClass('weui_btn_disabled')){
                        utilCommon.getCode('js-update-get-vcode',phone);
                    }
                }else{
                    //$phone.find('.update-phone-error-info').text('请输入有效的手机号码');
                    $.toastNoIcon('请输入有效的手机号码', 'noicon');
                }

            });
            //提交手机绑定
            $phone.find('.js-update-submit').click(function(){
                var $this = $(this);
                if($this.hasClass('disabled')){
                    return false;
                }else{
                    $this.addClass('disabled');
                    var phone = $phone.find('input[name="update-phone-num"]').val();
                    var vcode = $phone.find('input[name="update-vcode-num"]').val();

                    if(_self.checkIsMobile(phone)){//手机号码正确，则向后台注册手机号
                        //$phone.find('.update-phone-error-info').text('');
                        utilCommon.checkCode(phone,vcode,function(){//验证正确success

                            _self.bindMobileToService(phone,vcode,function(result){
                                if(result){
                                    utilVip.order.setPhoneFlag(true);//更新缓存中标记
                                    $phone.find('.box3').addClass('hide');
                                    $phone.find('.box2').removeClass('hide');
                                    setTimeout(function(){
                                        _self.closeSetPhonePage();
                                    },500);
                                    if(typeof callBack == 'function'){
                                        callBack();
                                    }
                                }
                            });

                        },function(){
                            //$phone.find('.update-vcode-error-info').text('验证码错误');
                            $.toastNoIcon('验证码错误', 'noicon');
                            $this.removeClass('disabled');
                        });
                    }else{
                        //$phone.find('.update-phone-error-info').text('请输入有效的手机号码');
                        $.toastNoIcon('请输入有效的手机号码', 'noicon');
                        $this.removeClass('disabled');
                    }
                    setTimeout(function(){
                        $this.removeClass('disabled');
                    },1000);
                }
            });
            //取消
            $phone.find('.js-update-cancel').click(function(){
                _self.closeSetPhonePage();
            });
        },
        bindMobileToService : function(newMobile,code,callBack){//向后台注册手机号
            var _self = this;
            var param = {
                userId : utilUser.user.getUserId(),
                newMobile : newMobile,
                code : code
            };
            param.sign = _self.getSignByArr(param);
            jea.post(config.url.bindMobile, param, callBack);
        },
        checkIsMobile : function(mobile) {// 验证手机号
            if(mobile == ""){
                return false;
            }
            if(isNaN(mobile) || (mobile.length != 11)) {
                return false;
            }
            var _d = /^1[3578][01379]\d{8}$/g;
            var _l = /^1[34578][01256]\d{8}$/g;
            var _y = /^(134[012345678]\d{7}|1[34578][012356789]\d{8})$/g;
            // var reg =/^0{0,1}(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/;
            if(_d.test(mobile)) {
                return true;
            }
            if(_l.test(mobile)) {
                return true;
            }
            if(_y.test(mobile)) {
                return true;
            }
            return false;
        }
    };
    return new App();
});