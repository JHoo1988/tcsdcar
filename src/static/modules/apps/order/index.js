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
        this.openId;
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            utilPage.ready();
            this.renderPage();
            this.bind();
            fastclick.attach(document.body);
            if (this.isWeChat()) {
                // 微信浏览器里面打开
                this.getWechatUserOpenId(function () {
                    console.log('openid获取完了');
                });
            }else{
                // 手机浏览器里面打开
                this.hideLoadin();
            }

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
            $this.showLoadin('数据加载中');
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

            });
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
        //emoji表情转换为字符
        emoji2Str: function (str) {
            return unescape(escape(str).replace(/\%uD(.{3})/g, '*'));
        },
        //获取微信用户openid
        getWechatUserOpenId: function (callback) {
            //仅获取公众号的openId
            var self = this;
            var code = this.getParam('code');
            var authUrl;
            var url;
            if (code) {
                console.log(544, window.location.href);
                console.log('getWechatUserOpenId()-code=' + code);
                $.ajax({
                    url: config.url.getWeiXinOpenIdByCode + code,
                    type: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        self.hideLoadin();
                        if (undefined != data && null != data && data.code == 200) {
                            self.openId = data.data;
                            console.log('getWechatUserOpenId()-openId=' + openId);
                            callback();
                        } else {
                            layer.msg('openid获取失败', { time: 1200 });
                        }
                    }
                    // ,error: function (xhr) {
                    //             // 获取openId失败则重进一次页面
                    //             url = tablevue.getClearCodeUrl();
                    //             authUrl = tablevue.handleUrlToWxOauth(url, 'base');
                    //             console.log('555', authUrl);
                    //             window.location.href = authUrl;
                    //             return false;
                    // }
                });
            } else {
                url = self.getClearCodeUrl();
                authUrl = self.handleUrlToWxOauth(url, 'base');
                console.log('563', authUrl);
                window.location.href = authUrl;
            }
        },
        handleUrlToWxOauth: function (url, type) {
            var url = encodeURIComponent(url);
            var wxOauth2 = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=1#wechat_redirect";
            wxOauth2 = wxOauth2.replace("APPID", "wx6d8daf3b1d3821cc");
            wxOauth2 = wxOauth2.replace("REDIRECT_URI", url);
            if (type == null || type == 'base') {
                //默认静默授权
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
            } else if (type == 'userinfo') {
                //弹出授权页面
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_userinfo");
            } else {
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
            }
            console.log('handleUrlToWxOauth()-wxOauth2='+wxOauth2);
            return wxOauth2;
        },
        getClearCodeUrl: function () {
            var url = window.location.href;
            var code = this.getParam('code');
            if (code) {
                url = url.replace('code=' + code, '');
            }
            return url;
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