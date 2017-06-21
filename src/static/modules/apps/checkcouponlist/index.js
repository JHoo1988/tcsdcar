/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'weui', 'ejs'], function ($, jea, config, fastclick, layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilBrands = require('util_brands');
    var utilCommon = require('util_common');
    var App = function () {
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            utilPage.ready();
            this.result = utilBrands.checkcoupon.getCheckCoupon();
            this.renderPage();
            this.bind();
            fastclick.attach(document.body);
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var _self = this;
            if (_self.result && _self.result.content && _self.result.content.length > 0) {
                console.log(_self.result);
                var html = new EJS({ url: 'views/checkcouponlist/index.ejs' }).render();
                $('body').prepend(html);

                var $p = $('#vip-yhq');
                var yhqList = _self.result.content || [];
                var content = new EJS({ url: "views/checkcouponlist/yhq-list.ejs" }).render({
                    yhqList: yhqList
                });
                $p.find('.info-wrapper').append(content);
                $p.find('.none-wrapper').addClass('hide');
                $p.find('.info-wrapper').removeClass('hide');

            } else {
                window.location.href = 'checkcoupon.html';
            }
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
            var data;
            $('.js-to-yhq-rule').click(function () {
                $('.rule-container').removeClass('hide');
            });
            $('.js-close-rule').click(function () {
                $('.rule-container').addClass('hide');
                $('.use-yhq').addClass('hide');
                $('.no-code-tips').css('visibility', 'hidden');
            });
            $('.mask-bg').click(function () {
                $('.rule-container').addClass('hide');
                $('.use-yhq').addClass('hide');
                $('.no-code-tips').css('visibility', 'hidden');
            });
            //兑换优惠券
            $('.js-use-my-yhq').click(function () {
                var json = $(this).data('json');
                data = json;
                $('.use-yhq').removeClass('hide');
            });
            // 确定
            $('.submit').click(function () {
                var shopcode = $('.shopcode').val();
                if (!$.trim(shopcode)) {
                    $('.no-code-tips').css('visibility', 'visible');
                    return;
                }
                $('.no-code-tips').css('visibility', 'hidden');
                $('.rule-container').addClass('hide');
                $('.use-yhq').addClass('hide');
                _self.showLoadin('兑换优惠券...');
                var par = {};
                par.mobile = _self.result.mobile;
                par.carBodyNo = _self.result.carBodyNo;
                par.code = data.code;
                par.shopCode = shopcode;
                $.ajax({
                    url: config.url.cousumCoupon,
                    type: 'POST',
                    dataType: 'json',
                    data: par,
                    success: function (data) {
                        $('.shopcode').val('');
                        _self.hideLoadin();
                        if (undefined != data && null != data && data.code == 200 && undefined != data.data && null != data.data) {
                            $('.weui_dialog_bd').text('优惠券兑换成功');
                            $('.weui_dialog_alert').removeClass('hide');
                            // 刷新当前页面
                            location.reload(true);
                        } else {
                            $('.weui_dialog_bd').text('优惠券兑换失败');
                            $('.weui_dialog_alert').removeClass('hide');
                        }
                    }
                    , error: function (xhr) {
                        $('.shopcode').val('');
                        _self.hideLoadin();
                        $('.weui_dialog_bd').text('优惠券兑换失败');
                        $('.weui_dialog_alert').removeClass('hide');
                        return false;
                    }
                });
            });
            // 关闭toast提示
            $('.primary').click(function () {
                $('.weui_dialog_alert').addClass('hide');
            });
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