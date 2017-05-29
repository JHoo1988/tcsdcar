/**
 * Created by 焦红 on 2017/5/29.
 * tel:18971057583
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'weui', 'ejs'], function ($, jea, config, fastclick, layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilBrands = require('util_brands');
    var utilCommon = require('util_common');
    var App = function () {
        this.brand = utilBrands.brands.getBrand();
        this.product = utilBrands.product.getProduct();
        this.openid = utilBrands.openid.getOpenId();
        this.originLocal = utilBrands.origin.getOrigin();
        this.timeLimit = '12';
        utilBrands.timeLimit.setTimeLimit(this.timeLimit);
        this.totalAmount = this.product.twelveCyclePrice;
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var out_trade_no = utilCommon.getParam('out_trade_no');
            var app_id = utilCommon.getParam('app_id');
            var orderNo = utilBrands.orderNo.getOrderNo();
            if (app_id && app_id == '2017033106497573' && orderNo && out_trade_no && out_trade_no == orderNo) {
                // 支付宝回调该页面后，根据订单号判断是否支付成功
                window.location.href = 'paysuccess.html';
                return;
            }
            if (!this.originLocal || this.originLocal === '' || this.originLocal === null) {
                window.location.href = 'entrance.html';
                return;
            }
            utilPage.ready();
            this.renderPage();
            this.bind();
            fastclick.attach(document.body);
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var data = {};
            data.brand = this.brand;
            data.product = this.product;
            data.wechatOrigin = this.originLocal;
            var html = new EJS({ url: 'views/glassRiskProductOrder/index.ejs' }).render(data);
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var $this = this;
            // 选择质保时间
            $('.placeholder').click(function () {
                if (!$(this).hasClass('selectd')) {
                    $('.placeholder').each(function () {
                        if ($(this).hasClass('selectd')) {
                            $(this).removeClass('selectd');
                        }
                    });
                    $(this).addClass('selectd');

                    if ($(this).hasClass('one')) {
                        $('.time-discription').each(function () {
                            if ($(this).hasClass('time-one')) {
                                $(this).removeClass('hide');
                            } else {
                                $(this).addClass('hide');
                            }
                        });
                        $this.timeLimit = '36';
                        $this.totalAmount = $this.product.thirtySixCyclePrice;
                        //设置36期价格
                        $('.price-num').text($this.product.thirtySixCyclePrice);
                    } else if ($(this).hasClass('tow')) {
                        $('.time-discription').each(function () {
                            if ($(this).hasClass('time-tow')) {
                                $(this).removeClass('hide');
                            } else {
                                $(this).addClass('hide');
                            }
                        });
                        $this.timeLimit = '24';
                        $this.totalAmount = $this.product.twentyFourCyclePrice;
                        //设置24期价格
                        $('.price-num').text($this.product.twentyFourCyclePrice);
                    } else if ($(this).hasClass('three')) {
                        $('.time-discription').each(function () {
                            if ($(this).hasClass('time-three')) {
                                $(this).removeClass('hide');
                            } else {
                                $(this).addClass('hide');
                            }
                        });
                        $this.timeLimit = '12';
                        $this.totalAmount = $this.product.twelveCyclePrice;
                        //设置12期价格
                        $('.price-num').text($this.product.twelveCyclePrice);
                    }
                }
            });
            // 确定
            $('#btn-order').click(function () {
                $('.fixed-mask-layer').show();
                $('.close_dialog').show();
                $('.fixed-bottom-form').slideDown(200);
            });
            // 关闭toast提示
            $('.primary').click(function () {
                $('.weui_dialog_alert').addClass('hide');
            });
            $('.fixed-mask-layer').on('click', function () {
                $('.fixed-bottom-form').slideUp('fast');
                $('.close_dialog').hide();
                $(this).hide();
            });
            $('.close_chat').on('click', function () {
                $('.customerservice').css('display', 'none');
            });
            $('.close_dialog').on('click', function () {
                $('.fixed-bottom-form').slideUp('fast');
                $('.fixed-mask-layer').hide();
                $(this).hide();
            });
            $('.submit').click(function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                var phoneNum = $.trim($("input[type='tel'][name='phonenum']").val());
                if (!utilCommon.checkIsMobile(phoneNum)) {
                    $('.weui_dialog_bd').text('请填写正确的手机号码');
                    $('.weui_dialog_alert').removeClass('hide');
                    return;
                }
                var carn = $this.emoji2Str($("input[type='text'][name='carnum']").val());
                var carnum = $.trim(carn);
                if (!carnum) {
                    $('.weui_dialog_bd').text('请填写车身识别号');
                    $('.weui_dialog_alert').removeClass('hide');
                    return;
                }
                var shopcode = $this.emoji2Str($("input[type='text'][name='shopcode']").val());
                var shopcodenum = $.trim(shopcode);
                if (shopcodenum && null != shopcodenum && 'undefined' != shopcodenum) {
                    $this.originLocal = shopcodenum;
                } else {
                    $this.originLocal = utilBrands.origin.getOrigin();
                }
                $this.showLoadin('提交订单...');
                if ($this.isWeChat() && $this.openid) {
                    // 如果是在微信里面就用微信支付
                    var b_version = navigator.appVersion;
                    var version = parseFloat(b_version);
                    if (version >= 5.0) {
                        // 创建订单
                        var par = {};
                        par.product = $this.product.id;
                        par.timeLimit = $this.timeLimit;
                        utilBrands.timeLimit.setTimeLimit($this.timeLimit);
                        // par.totalAmount=$this.totalAmount;
                        par.mobile = phoneNum;
                        par.carBodyNo = carnum;
                        par.shopCode = $this.originLocal;
                        par.openId = $this.openid;
                        $.ajax({
                            url: config.url.unifiedOrder,
                            type: 'POST',
                            dataType: 'json',
                            data: par,
                            success: function (data) {
                                if (undefined != data && null != data  && data.code == 200 &&undefined != data.data && null != data.data) {
                                    var result = data.data;
                                    if (result.orderNo) {
                                        utilBrands.orderNo.setOrderNo(result.orderNo);
                                    }
                                    $this.weChatPay(result.package, result.paySign, result.nonceStr, result.appId, result.timeStamp, 'http://www.tcsdcar.com/m/paysuccess.html');
                                } else {
                                    $this.hideLoadin();
                                    $('.weui_dialog_bd').text('订单创建失败，请重试');
                                    $('.weui_dialog_alert').removeClass('hide');
                                }
                            }
                            , error: function (xhr) {
                                $this.hideLoadin();
                                $('.weui_dialog_bd').text('订单创建失败，请重试');
                                $('.weui_dialog_alert').removeClass('hide');
                                return false;
                            }
                        });
                    } else {
                        $this.hideLoadin();
                        $('.weui_dialog_bd').text('微信版本过低，请升级您的微信客户端');
                        $('.weui_dialog_alert').removeClass('hide');
                    }
                } else {
                    // 使用支付宝支付
                    var par = {};
                    par.product = $this.product.id;
                    par.timeLimit = $this.timeLimit;
                    utilBrands.timeLimit.setTimeLimit($this.timeLimit);
                    // par.totalAmount=$this.totalAmount;
                    par.mobile = phoneNum;
                    par.carBodyNo = carnum;
                    par.shopCode = $this.originLocal;
                    $.ajax({
                        url: config.url.alipayCreateOrder,
                        type: 'POST',
                        dataType: 'json',
                        data: par,
                        success: function (data) {
                            if (undefined != data && null != data && data.code == 200 &&undefined != data.data && null != data.data ) {
                                var result = data.data;
                                if (result.orderNo) {
                                    utilBrands.orderNo.setOrderNo(result.orderNo);
                                }
                                $('body').append(result.content);
                                // $this.weChatPay(result.package,result.paySign,result.nonceStr,result.appId,result.timeStamp,'http://www.tcsdcar.com/m/paysuccess.html');
                            } else {
                                $this.hideLoadin();
                                $('.weui_dialog_bd').text('订单创建失败，请重试');
                                $('.weui_dialog_alert').removeClass('hide');
                            }
                        }
                        , error: function (xhr) {
                            $this.hideLoadin();
                            $('.weui_dialog_bd').text('订单创建失败，请重试');
                            $('.weui_dialog_alert').removeClass('hide');
                            return false;
                        }
                    });
                }
            });
            $('.icon-check').click(function () {
                if ($('.icon-check').hasClass('checked')) {
                    $('.icon-check').removeClass('checked');
                    $('.submit').addClass('disabled');
                } else {
                    $('.icon-check').addClass('checked');
                    $('.submit').removeClass('disabled');
                }
            });
        },
        //emoji表情转换为字符
        emoji2Str: function (str) {
            return unescape(escape(str).replace(/\%uD(.{3})/g, '*'));
        },
        // 判断是否在微信中打开的
        isWeChat: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        hideLoadin: function () {
            $('#loadingToast').addClass('hide');
        },
        showLoadin: function (content) {
            $('#loadingToast').removeClass('hide');
            if (content) {
                $('.weui_toast_content').text(content);
            }
        },
        // 发起微信支付
        wxPayOrderById: function (prepay_id, paySign, randomStr, appId, timeStamp, callback, fail) {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": appId,     //公众号名称，由商户传入
                    "timeStamp": timeStamp.toString(), //时间戳，自1970年以来的秒数
                    "nonceStr": randomStr, //随机串
                    "package": prepay_id,
                    "signType": "MD5",         //微信签名方式：
                    "paySign": paySign //微信签名
                },
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                        if (typeof callback === 'function') {
                            callback();
                        }
                    } else {
                        if (typeof fail === 'function') {
                            fail();
                        }
                    }
                }
            );
        },
        // 微信支付
        weChatPay: function (prepay_id, paySign, randomStr, appId, timeStamp, successBackUrl) {
            var $this = this;
            this.wxPayOrderById(prepay_id, paySign, randomStr, appId, timeStamp, function () {
                $this.hideLoadin();
                // 支付成功
                window.location.href = successBackUrl;
            }, function () {
                $this.hideLoadin();
                $('.weui_dialog_bd').text('支付失败');
                $('.weui_dialog_alert').removeClass('hide');
            });
        }
    };
    return new App();
});