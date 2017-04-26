/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'weui', 'ejs'], function ($, jea, config, fastclick, layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilBrands = require('util_brands');
    var utilCommon = require('util_common');
    var App = function () {
        this.brand = utilBrands.brands.getBrand();
        this.product = utilBrands.product.getProduct();
        this.openid=utilBrands.openid.getOpenId();
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var originLocal = utilBrands.origin.getOrigin();
            if(!originLocal||originLocal === '' || originLocal === null){
                window.location.href='brands.html';
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
            var html = new EJS({ url: 'views/order/index.ejs' }).render(data);
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
                var phoneNum = $.trim($("input[type='tel'][name='phonenum']").val());
                if (!utilCommon.checkIsMobile(phoneNum)) {
                    $('.weui_dialog_bd').text('请填写正确的手机号码');
                    $('.weui_dialog_alert').removeClass('hide');
                    return;
                }
                var carnum = $.trim($("input[type='text'][name='carnum']").val());
                if (!carnum) {
                    $('.weui_dialog_bd').text('请填写车身识别号');
                    $('.weui_dialog_alert').removeClass('hide');
                    return;
                }
                $this.showLoadin('提交订单...');
                if($this.isWeChat()&& $this.openId){
                    // 如果是在微信里面就用微信支付
                }else{
                    // 使用支付宝支付
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
        }
    };
    return new App();
});