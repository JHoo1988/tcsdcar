/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
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
            this.renderPage();
            this.bind();
            fastclick.attach(document.body);
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var html = new EJS({ url: 'views/checkorder/index.ejs' }).render();
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var $this = this;
            // 关闭toast提示
            $('.primary').click(function () {
                $('.weui_dialog_alert').addClass('hide');
            });
            // 查询按钮
            $('.weui-btn').click(function () {
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
                $this.showLoadin('查询订单...');
                var par = {};
                par.mobile = phoneNum;
                par.carBodyNo = carnum;
                par.pageIndex = 1;
                par.pageSize = 99999;
                $.ajax({
                    url: config.url.findOrderListByCarAndMobile,
                    type: 'GET',
                    dataType: 'json',
                    data: par,
                    success: function (data) {
                        if (undefined != data && null != data && data.code == 200) {
                            var result = data.data;
                            if (result.length > 0) {
                                utilBrands.checkorder.setCheckOrder(result);
                                console.log('查询到的订单为：' + result);
                            } else {
                                $this.hideLoadin();
                                $('.weui_dialog_bd').text('暂无订单');
                                $('.weui_dialog_alert').removeClass('hide');
                            }
                        } else {
                            $this.hideLoadin();
                            $('.weui_dialog_bd').text('查询订单失败，请重试');
                            $('.weui_dialog_alert').removeClass('hide');
                        }
                    }
                    , error: function (xhr) {
                        $this.hideLoadin();
                        $('.weui_dialog_bd').text('查询订单失败，请重试');
                        $('.weui_dialog_alert').removeClass('hide');
                        return false;
                    }
                });
            });

        },
        //emoji表情转换为字符
        emoji2Str: function (str) {
            return unescape(escape(str).replace(/\%uD(.{3})/g, '*'));
        },
        // 判断是否在微信中打开的
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