/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'weui', 'ejs'], function ($, jea, config, fastclick, layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilBrands = require('util_brands');
    var utilCommon = require('util_common');
    var App = function () {
        this.useSuccess = false;
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
            _self.showLoadin('查询优惠券...');
            var html = new EJS({ url: 'views/checkcouponlist/index.ejs' }).render();
            $('body').prepend(html);
            _self.reload(_self.result.mobile,_self.result.carBodyNo,function (result) {
                var $p = $('#vip-yhq');
                if (result && result.content && result.content.length > 0) {
                    var yhqList =result.content || [];
                    var content = new EJS({ url: "views/checkcouponlist/yhq-list.ejs" }).render({
                        yhqList: yhqList
                    });
                    $p.find('.info-wrapper').append(content);
                    $p.find('.none-wrapper').addClass('hide');
                    $p.find('.info-wrapper').removeClass('hide');
                    $p.find('.link-row').removeClass('hide');
                }else{
                    $p.find('.none-wrapper').removeClass('hide');
                    $p.find('.info-wrapper').addClass('hide');
                    $p.find('.link-row').addClass('hide');
                }
            });
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
            var $body = $('body');
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
            $body.on('click', '.js-use-my-yhq', function () {
                data = $(this).data('json');
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
                var formData = new FormData();
                formData.append('mobile',_self.result.mobile);
                formData.append('carBodyNo',_self.result.carBodyNo);
                formData.append('code',data.code);
                formData.append('shopCode',shopcode);
                $.ajax({
                    url: config.url.cousumCoupon,//,'http://119.23.34.22:8080/mobile/cousumCoupon'
                    type: 'POST',
                    dataType: 'json',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        $('.shopcode').val('');
                        _self.hideLoadin();
                        if (undefined != data && null != data && data.code == 200) {
                            $('.weui_dialog_bd').text('优惠券兑换成功');
                            $('.weui_dialog_alert').removeClass('hide');
                            _self.useSuccess = true;
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
                if(_self.useSuccess){
                    // 刷新当前页面
                    location.reload(true);
                }
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
        },
        reload:function(mobile,carBodyNo,callBack){
            var _self=this;
            var par = {};
            par.mobile = mobile;
            par.carBodyNo = carBodyNo;
            par.pageIndex = 1;
            par.pageSize = 99999;
            par.statu = 0;
            $.ajax({
                url: config.url.findCustomerCouponConsumRecord,
                type: 'GET',
                dataType: 'json',
                data: par,
                success: function (data) {
                    _self.hideLoadin();
                    if (undefined != data && null != data && data.code == 200) {
                        var result = data.data;
                        if (result.content.length > 0) {
                            callBack(result);
                        }
                        // else {
                        //     $('.weui_dialog_bd').text('暂无优惠券');
                        //     $('.weui_dialog_alert').removeClass('hide');
                        // }
                    else{
                            var $p = $('#vip-yhq');
                            $p.find('.none-wrapper').removeClass('hide');
                            $p.find('.info-wrapper').addClass('hide');
                            $p.find('.link-row').addClass('hide');
                        }
                    } else {

                        $('.weui_dialog_bd').text('查询优惠券失败，请重试');
                        $('.weui_dialog_alert').removeClass('hide');
                    }
                }
                , error: function (xhr) {
                    _self.hideLoadin();
                    $('.weui_dialog_bd').text('查询优惠券失败，请重试');
                    $('.weui_dialog_alert').removeClass('hide');
                    return false;
                }
            });
        }

    };
    return new App();
});