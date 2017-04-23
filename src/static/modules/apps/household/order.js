/**
 * 家居安装购物车-订单
 * Created by 焦红 on 2017/4/17.
 * tel:18971057583
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
    'use strict';
    var utilPage = require('util_page');
    var utilOrder = require('util_household_order');
    var utilUser = require('util_user');
    var utilVip = require("util_vip");
    var apiVip = require('api_vip');
    var utilAddress = require('util_address');
    var App = function () { };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            utilPage.ready();
            fastclick.attach(document.body);
            this.renderPage();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (callback) {
            var _self = this;

            this.yhmAjaxData = null;	//优惠码信息
            this.ondoorPrice = 0; //最低上门费
            this.allowOndoor = false; //是否允许上门
            var bigClass = utilOrder.order.getBigClassItem() || {};
            var subClassList = utilOrder.order.getSubClassItem() || [];//用户曾经选择过得数据
            var sumObj = utilOrder.order.countSumItemForShopcart();
            var content = new EJS({url: "../views/household/order.ejs"}).render({
                bigClass : bigClass,
                subClassList:subClassList,
                sumObj : sumObj
            });
            $('body').prepend(content);
            _self.bind();
            _self.initYhmPage();
            _self.updateUI();
            var address = _self.getConsigneeAddress();
            if(address){
                _self.initAddress(address);
            }
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
            // 选择地址
            $('.select_address').click(function () {
                var url='../address/index.html?origin=2&backurl=' + window.location.href;
                window.location.href = url;
            });
            //去支付页面
            $('#btn-household-order-ensure').click(function(){
                _self.householdOrderPageIsLoaded = 0;
                //1.1 检测是否设置了手机号码
                var hasPhone = utilVip.order.getPhoneFlag();
                if(hasPhone){//该用户已经设置了手机号码
                    //nothing todo
                }else{
                    if($('.vip-phone').length==0){
                        apiVip.loadSetPhonePage();
                        return false;
                    }
                }
                var $this = $(this);
                if($this.hasClass('disabled')){
                    return false;
                }else{
                    $this.addClass('disabled');
                    var param = _self.getParam();
                    if(param == null){
                        $this.removeClass('disabled');
                        return false;
                    }
                    if(_self.allowOndoor == false){
                        $this.removeClass('disabled');
                        $.alert('该地区暂未开通服务,请更换地址','');
                        return false;
                    }
                    $('.rule-container').removeClass('hide');

                }

            });

            //
            $('.product-item').click(function(e){
                var $this = $(this);
                var $text = $this.find('.text');
                var id = $this.data('id');
                var productNum = parseInt($text.text());
                //减
                if($(e.target).hasClass('sub') || $(e.target).parent().hasClass('sub')){
                    productNum -= 1;
                    if(productNum < 1){
                        productNum = 1;
                    }
                    //1
                    $text.text(productNum);
                    //2.
                    utilOrder.order.updateSubClassItemNumById(id,productNum);
                    //3.
                    _self.updateUI();
                }
                //加
                if($(e.target).hasClass('add') || $(e.target).parent().hasClass('add')){
                    productNum += 1;
                    //1.
                    $text.text(productNum);
                    //2.更新缓存中的对应id的产品的数量
                    utilOrder.order.updateSubClassItemNumById(id,productNum);
                    //3.
                    _self.updateUI();
                }
                //删除
                if($(e.target).hasClass('select-ele-del') || $(e.target).parent().hasClass('select-ele-del')){
                    //1
                    utilOrder.order.removeSubClassItemById(id);
                    //2
                    $this.fadeOut('fast',function(){
                        $this.remove();
                        //3.
                        _self.updateUI();
                    });
                }
            });
            // 优惠码事件
            $('#js-order-yhm').click(function () {
                if($('input[name="returnAddress"]').val()==''){
                    $.alert('请先选择服务地址！','');
                    return false;
                }
                // window.location.hash = '!home-household-order-yhm';
            });

            // 当城市发变化时
            $('input[name="cityId"]').on('change', function (){
                $.showLoading('获取最低上门费');
                _self.getOnDoorPrice(function(result){
                    $.hideLoading();
                    if(result.data.length>0){
                        var data = result.data[0];
                        _self.allowOndoor = true;
                        _self.ondoorPrice = data.consumerHomeFee;
                    }else{
                        _self.allowOndoor = false;
                        _self.ondoorPrice = 0;
                        $.alert('该地区暂未开通服务,请更换地址','');
                    }
                    _self.updateUI();

                });
            });

            $('.ok-bottom').click(function () {
                $('.rule-container').addClass('hide');
                $('#btn-household-order-ensure').removeClass('disabled');
                var param = _self.getParam();
                _self.okAction(param,$(this));
            });

            $('.rule-container .mask-bg').click(function(){
                $('.rule-container').addClass('hide');
                $('#btn-household-order-ensure').removeClass('disabled');
            });
            $('.js-close-rule').click(function(){
                $('.rule-container').addClass('hide');
                $('#btn-household-order-ensure').removeClass('disabled');
            });
        },
        /**
         * @func
         * @desc 获取收货地址
         * @returns {object}
         */
        getConsigneeAddress: function () {
            var address = utilAddress.repair.gerUserSelected();

            if (address !== null) {
                address.finalAddress = address.provinceName + address.cityName + address.areaName + address.streetName + address.addressDetail;
            }
            return address;
        },
        initAddress:function(address){
            var _self = this;
            var householdOrderFinder = '.home-household-order ';
            var $cityId = $(householdOrderFinder + 'input[name=cityId]'),
                $oldCityId = $cityId.val();

            var text = address.finalAddress;
            var mobile = address.contactMobile;
            var name = address.contactName;
            var province = address.provinceName;
            var provinceId = address.provinceId;
            var city = address.cityName;
            var cityId = address.cityId;
            var addressId = address.addressId;
            var area = address.areaName;
            var areaId = address.areaId;

            text = $.trim(text);
            mobile = $.trim(mobile);
            name = $.trim(name);

            $('#household-order-address').text(text);

            $(householdOrderFinder + 'input[name=addressDetail]').val(text).attr('data-id',$(_self).data('id'));
            $(householdOrderFinder + 'input[name=contactMobile]').val(mobile);
            $(householdOrderFinder + 'input[name=contactName]').val(name);
            $(householdOrderFinder + 'input[name=provinceName]').val(province);
            $(householdOrderFinder + 'input[name=cityName]').val(city);
            $(householdOrderFinder + 'input[name=areaName]').val(area);
            $(householdOrderFinder + 'input[name=cityId]').val(cityId);
            $(householdOrderFinder + 'input[name=addressId]').val(addressId);

            if ($oldCityId != $("input[name='cityId']").val()) {
                $cityId.trigger('change');
            }
        },
        okAction:function (param,ob) {
            var _self = this;
            var $this = ob;
            if($this.hasClass('disabled')){
                return false;
            }else {
                $this.addClass('disabled');
            }
            utilOrder.order.setOrderParam(param);
            if(param.productPrice == 0){//价格为0直接下单
                // $.showLoading();
                jea.ajax(config.url.saveHouseholdOrder,param,function (result) {
                    $.hideLoading();
                    if(result){
                        utilOrder.order.clearOrderParam();
                        utilOrder.order.clearSubClassItem();
                        utilOrder.order.clearBigClassItem();
                        var orderId = result.data;
                        apiWechat.processOrderPayType(orderId,0,function(){
                            msg.init(function(){
                                msg.parent = _self.cls;
                            });
                        });
                    }

                });
            }else{//否则去支付页面
                $this.removeClass('disabled');
                // household_pay.init();
            }
        },
        getOnDoorPrice : function(callback){//获取上门费
            var url = config.url.findHomeFeeByAddress;
            var param = {
                ondoorProvince : $('input[name="provinceName"]').val(),
                ondoorCity : $('input[name="cityName"]').val(),
                ondoorArea : $('input[name="areaName"]').val()
            };
            jea.post(url,param,callback);
        },
        // 初始化优惠码页
        initYhmPage: function(){
            var _self = this;
            // 激活优惠码
            var activationPromoCodeForHousehod = function () {
                var $promoCode = $('#promoCode');
                var promoCode;

                $promoCode.val($.trim($("#toPromoCode").val()));
                promoCode = $.trim($promoCode.val());
                if (promoCode == '') {
                    $.toastNoIcon('请输入推荐码', 'noicon');
                    return false;
                }else{
                    $.showLoading('查询中...');
                    var param = {
                        userId: utilUser.user.getUserId(),
                        promoCode: promoCode + '',
                        orderType: 11,
                        provinceName : $('input[name="provinceName"]').val(),
                        cityName : $('input[name="cityName"]').val(),
                        areaName : $('input[name="areaName"]').val(),
                        addressDetail : $('input[name="returnAddress"]').val(),
                        contactMobile : $('input[name="returnMobile"]').val()
                    };
                    //orderType: 9
                    jea.ajax(config.url.checkUserIdAndPromoCode, param, function (result) {
                        $.hideLoading();
                        if (!result) {// 优惠码被验证无效的情况
                            $("#promoCode").val('');
                            return false;
                        }
                        if (result.data) {
                            // 判断是否使用过优惠码
                            result.data.promoCode = promoCode;
                            var ajaxData = result.data;
                            //如果是满减类型的优惠劵，按大小排序
                            if (typeof ajaxData !== "undefined" && 'promoRuleList' in ajaxData) {
                                ajaxData.promoRuleList.sort(function (x, y) {  //descent order
                                    return (x.promoUseMinPrice > y.promoUseMinPrice) ? -1 : 1;
                                });
                            }
                            if (ajaxData) {
                                _self.yhmAjaxData = ajaxData;
                                _self.updateUI();
                                $.alert("恭喜，激活成功！", '');
                                window.history.go(-1);
                            }
                        }

                    });
                }

            };

            // // 注册事件
            // var events = {
            //     '#js-household-order-yhm-active' : {
            //         click: activationPromoCodeForHousehod
            //     }
            // };
            //
            // page.one({
            //     name : 'yhm',
            //     cls : _self.cls,//home-household-order-yhm
            //     events : events
            // });
            //
            // page.one({
            //     name : 'yhm-intro',
            //     cls : 'home'
            // });

        },
        updateUI : function(){
            var _self = this;
            //0.根据列表中的产品数量来设置购物车面板的展示内容
            _self.showOrHidePanelWrapperUI();

            var obj = utilOrder.order.countSumItemForShopcart();
            var sumProductPrice = obj.sumProductPrice;//获取总计价格
            var ondoorPrice = _self.ondoorPrice;//获取最低上门费
            var $ondoorLine = $('.ondoor-line');

            //1.最低上门费的UI界面处理
            if(obj.hasPhysicalGoods){//存在实体产品,则展示最低上门费，否则隐藏
                //如果订单总额 < 最低上门费，就按最低上门费进行结算；
                if(sumProductPrice < ondoorPrice){
                    sumProductPrice = ondoorPrice;
                }
                $ondoorLine.find('.price-num').text('￥'+ondoorPrice);
            }else{
                $ondoorLine.find('.price-num').text('￥0');
            }

            //2.订单总额的UI界面处理
            var $sumLine = $('.sum-line');
            $sumLine.find('.price-num').text('￥'+sumProductPrice);

            //3.初始化实付金额：默认值为订单总额
            var actualProductPrice = sumProductPrice;//实付金额

            //4.优惠码的UI界面处理
            var yhmAjaxData = _self.yhmAjaxData;
            var couponInfo = _self.yhmDynamicPrice(sumProductPrice);

            //4.1 优惠码录入界面的处理
            if (yhmAjaxData != null) {
                if (yhmAjaxData.ruleDesc != '') {
                    var ruleDesc = yhmAjaxData.ruleDesc;
                    $('.promo-code-text').text(yhmAjaxData.txtName+ '：'+ yhmAjaxData.promoCode);
                    $('.promo-desc').text(ruleDesc).removeClass('hide');
                } else {
                    //填充优惠劵信息
                    $('.promo-code-text').text(yhmAjaxData.txtName+ '：'+ yhmAjaxData.promoCode);
                    $('.promo-desc').text('').addClass('hide');
                }
            }else{
                $('.promo-code-text').text('优惠码');
                $('.promo-desc').text('').addClass('hide');
            }
            //4.2 结算处的优惠码UI界面处理
            if(couponInfo != null){
                var $yhm = $('.order-info-show .yhm-line');
                var $promoTitle = $yhm.find('.yh-title');
                var $promoPrice = $yhm.find('.yh-price');
                //4.2.1 优惠码类型描述
                $promoTitle.text(couponInfo.title);
                //4.2.2 优惠码价格展示
                if (couponInfo.price) { // 优惠券现金券
                    actualProductPrice = (actualProductPrice*100 - couponInfo.price*100)/100;//eg.顺便处理下应付价格
                    actualProductPrice = actualProductPrice < 0 ? 0 : actualProductPrice;
                    $promoPrice.text('-￥' + couponInfo.price);

                } else if (couponInfo.discount && couponInfo.discount > 0 && couponInfo.discount < 10) {  // 优惠券折扣券
                    actualProductPrice = actualProductPrice*(couponInfo.discount*10)/100;
                    $promoPrice.text('');
                }
                $yhm.removeClass('hide');
            }else{
                //4.2.3 优惠码判空处理
                var $yhm = $('.order-info-show .yhm-line');
                $yhm.find('.yh-title').text('使用优惠券：');
                $yhm.find('.yh-price').text('-￥0');
                $yhm.addClass('hide');
            }

            //5.应付金额的UI界面处理
            _self.actualProductPrice = actualProductPrice;//保存应付金额
            var $actualLine = $('.actual-line');
            $actualLine.find('.price-num').text('￥'+actualProductPrice);

        },
        showOrHidePanelWrapperUI : function(){//根据列表中的产品数量来设置购物车面板的展示内容
            var _self = this;
            //1.
            var $product_panel = $('.product-panel');
            var p_item_len = $product_panel.find('.product-item').length;
            var $service_panel = $('.service-panel');
            var s_item_len = $service_panel.find('.product-item').length;
            if(p_item_len == 0){
                $product_panel.addClass('hide');
            }
            if(s_item_len == 0){
                $service_panel.addClass('hide');
            }
            if(p_item_len == 0 && s_item_len == 0){
                $('.shopcart_none').removeClass('hide');
                $('.shopcart_info').addClass('hide');
            }
        },
        // 获取动态优惠券价格
        yhmDynamicPrice: function (orderPrice) {
            var _self = this;
            var yhmAjaxData = _self.yhmAjaxData;
            var data = null;
            var ruleDesc = '';

            if (yhmAjaxData) {

                if (yhmAjaxData.promoType == 0 || yhmAjaxData.promoType == 2) {  // 网红或地堆
                    data = {
                        promoCode: yhmAjaxData.promoCode,
                        promoType: yhmAjaxData.promoType,
                        price: yhmAjaxData.promoCodePrice,
                        title: "使用推荐码：",
                        txtName: '优惠码',
                        ruleDesc: ruleDesc
                    };
                } else if (yhmAjaxData.promoType == 5) {  // 电子打折券
                    data = {
                        promoCode: yhmAjaxData.promoCode,
                        promoType: yhmAjaxData.promoType,
                        discount: yhmAjaxData.promoDiscount,
                        title: "使用折扣优惠券再享" + yhmAjaxData.promoDiscount + "折优惠",
                        txtName: '打折劵',
                        ruleDesc: ruleDesc
                    };
                } else {  //"纸质优惠券"  "电子优惠券"

                    if (yhmAjaxData.promoRuleList && yhmAjaxData.promoRuleList.length) {
                        orderPrice = orderPrice || 0;

                        if (yhmAjaxData != null && yhmAjaxData.promoRuleList && yhmAjaxData.promoRuleList.length) {
                            ruleDesc = yhmAjaxData.promoRuleList.map(function (value) {
                                var str = (value.promoUseMinPrice > 0) ? ('满' + value.promoUseMinPrice + '减') : ('下单立减');
                                return str + value.promoPrice + '元';
                            }).join(";　").replace(/;　$/, '');
                        }

                        yhmAjaxData.promoRuleList.sort(function(x,y){//正序 从小到大
                            return (x.promoUseMinPrice > y.promoUseMinPrice) ? 1 : -1;
                        });
                        for (var i = 0; i < yhmAjaxData.promoRuleList.length; i++) {
                            var d = yhmAjaxData.promoRuleList[i];
                            if (d.promoUseMinPrice > orderPrice ) {
                                continue;
                            } else {
                                data = {
                                    promoCode: yhmAjaxData.promoCode,
                                    promoType: yhmAjaxData.promoType,
                                    price: d.promoPrice,
                                    title: "使用优惠券：" ,
                                    txtName: '优惠码',
                                    ruleDesc: ruleDesc
                                };
                            }
                        }

                    }

                }

                yhmAjaxData.txtName = data != null ? data.txtName : '优惠码';
                yhmAjaxData.ruleDesc = ruleDesc;
            }

            return data;
        }
    };

    return new App();
});
