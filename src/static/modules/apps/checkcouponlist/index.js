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
                var html = new EJS({ url: 'views/checkcouponlist/index.ejs' }).render({
                    data:_self.result
                });
                $('body').prepend(html);
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
            //兑换优惠券
            $('.js-use-my-yhq').click(function () {
                var json = $(this).data('json');
                data = JSON.stringify(json);

            });
            // 确定
            $('.submit').click(function () {
                var par = {};
                par.mobile = _self.result.mobile;
                par.carBodyNo = _self.result.carBodyNo;
                $.ajax({
                    url: config.url.cousumCoupon,
                    type: 'POST',
                    dataType: 'json',
                    data: par,
                    success: function (data) {
                        $this.hideLoadin();
                        if (undefined != data && null != data && data.code == 200 && undefined != data.data && null != data.data) {
                            $('.weui_dialog_bd').text('优惠券兑换成功');
                            $('.weui_dialog_alert').removeClass('hide');
                        } else {
                            $('.weui_dialog_bd').text('优惠券兑换失败');
                            $('.weui_dialog_alert').removeClass('hide');
                        }
                    }
                    , error: function (xhr) {
                        $this.hideLoadin();
                        $('.weui_dialog_bd').text('优惠券兑换失败');
                        $('.weui_dialog_alert').removeClass('hide');
                        return false;
                    }
                });
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