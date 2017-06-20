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
        this.product = utilBrands.product.getProduct();// 车型相关
        this.productList = utilBrands.productList.getProductList();
        this.openid = utilBrands.openid.getOpenId();
        this.originLocal = utilBrands.origin.getOrigin();
        this.timeLimit = '12';
        this.timeLimitblx = '12';
        this.coupon = 0;
        this.timeLimit_qcm_zh_blx = '12';// 汽车膜质保tab中选择的玻璃险的期数
        this.timeLimitblx_blx_zh_qcm = '12';// 玻璃险tab中选择的汽车膜质保的期数
        this.qcm_price = this.productList.content[0].twelveCyclePrice;// 汽车膜质保tab中选择的期数对应的价格
        if (this.productList.content.length > 1) {
            this.price_blx_yy = this.productList.content[1].twelveCyclePrice;// 汽车膜质保tab中选择的玻璃险的价格
            this.blx_price = this.productList.content[1].twelveCyclePrice;// 玻璃险tab中选择的期数对应的价格
        }
        this.price_qcm_yy = this.productList.content[0].twelveCyclePrice;// 玻璃险tab中选择的汽车膜质保的价格
        this.product_qcm = {};//汽车膜质保tab中选择的玻璃险的组装数据的临时对象
        this.product_blx = {};//玻璃险tab中选择的汽车膜质保的组装数据的临时对象
        utilBrands.timeLimit.setTimeLimit(this.timeLimit);
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var _self = this;
            var out_trade_no = utilCommon.getParam('out_trade_no');
            var app_id = utilCommon.getParam('app_id');
            var orderNo = utilBrands.orderNo.getOrderNo();
            if (app_id && app_id == '2017033106497573' && orderNo && out_trade_no && out_trade_no == orderNo) {
                // 支付宝回调该页面后，根据订单号判断是否支付成功
                window.location.href = 'paysuccess.html';
                return;
            }
            if (!this.originLocal || this.originLocal === '' || this.originLocal === null) {
                window.location.href = 'brands.html';
                return;
            }
            utilPage.ready();
            var categroyId = _self.product.categroyId;
            if (categroyId == 'bba5f534090b4a27999b5dc2f250d0b4') {
                _self.coupon = 30;
            } else if (categroyId == 'a89e758c691f4979b97b766b7ac40c4d' || categroyId == 'ef9f26dbf7ce452788d0c9f231c04b9c' || categroyId == '2e419539044d46a3bc953473f150a44a'
                || categroyId == '47e29bda83474e2f84c5890ae9dfeb4b' || categroyId == '6beeb4f814a34375a35ee6c2c449ffee' || categroyId == '22663b67f04a4b38b5c12bbbf6baac2f'
                || categroyId == '8d58afaf309a453d8a1446aa2cf423e9' || categroyId == '0dd9a3650464465a8ea9888f8c036f90' || categroyId == '581ae92cfbd0492393a0c9851a726d6d'
                ||categroyId == '05ed41a42dec485bb7d6c0955ab6e0db') {
                _self.coupon = 50;
            } else if (categroyId == '930d5882885c453194c4addb50dd9905' || categroyId == 'd0d21bc4913a476db368a7134a67b136' || categroyId == '935d67cea04342cd8a8a916f45381371'
                || categroyId == 'b8754d6b1d17449884a12bb13a2911ac' || categroyId == '0b81790c6a7a4168ae741e4bb2d24bf8' || categroyId == '03ffcb5adf9e44c18b0ce850e2c47a27'
                || categroyId == '0e122d2656ce40b7bd667460481b86aa') {
                _self.coupon = 100;
            } else if (categroyId == '49aa7e992e6f4b3d83156a3b81561726' || categroyId == '58f34bc4b3ce4fffb1d63255a3680d59' || categroyId == '3741b710a0e54db9a1b6a7f8b3df7fba'
                || categroyId == '9a1e5f380cc64a46ab453bceef53960f' || categroyId == '01442e12499a4eb5af7445dd8021b1da' ) {
                _self.coupon = 150;
            } else if (categroyId == 'fe50ad984438488b8308a5acc13dcacd' || categroyId == '73705e3ae0dd479f894f848b0d46d841') {
                _self.coupon = 200;
            } else if (categroyId == 'c02a7d26838d4b94a0b95016f42121e6') {
                _self.coupon = 300;
            }
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
            data.product = this.product;// 车型相关
            data.wechatOrigin = this.originLocal;
            data.productList = this.productList;// 车型相关的产品
            data.coupon = this.coupon;// 赠送现金券价格
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
                        $this.timeLimit = '36';
                        //设置36期价格
                        $this.qcm_price = $this.productList.content[0].thirtySixCyclePrice;
                        if ($this.product_qcm.id) {
                            $('.price-num').text($this.qcm_price + $this.price_blx_yy);
                        } else {
                            $('.price-num').text($this.qcm_price);
                        }
                    } else if ($(this).hasClass('tow')) {
                        $('.time-discription').each(function () {
                            if ($(this).hasClass('time-tow')) {
                                $(this).removeClass('hide');
                            } else {
                                $(this).addClass('hide');
                            }
                        });
                        $this.timeLimit = '24';
                        //设置24期价格
                        $this.qcm_price = $this.productList.content[0].twentyFourCyclePrice;
                        if ($this.product_qcm.id) {
                            $('.price-num').text($this.qcm_price + $this.price_blx_yy);
                        } else {
                            $('.price-num').text($this.qcm_price);
                        }
                    } else if ($(this).hasClass('three')) {
                        $('.time-discription').each(function () {
                            if ($(this).hasClass('time-three')) {
                                $(this).removeClass('hide');
                            } else {
                                $(this).addClass('hide');
                            }
                        });
                        $this.timeLimit = '12';
                        //设置12期价格
                        $this.qcm_price = $this.productList.content[0].twelveCyclePrice;
                        if ($this.product_qcm.id) {
                            $('.price-num').text($this.qcm_price + $this.price_blx_yy);
                        } else {
                            $('.price-num').text($this.qcm_price);
                        }
                    }
                }
            });
            // 选择玻璃险服务时间
            $('.placeholder-blx').click(function () {
                if (!$(this).hasClass('selectd')) {
                    $('.placeholder-blx').each(function () {
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
                        $this.timeLimitblx = '36';
                        //设置36期价格
                        $this.blx_price = $this.productList.content[1].thirtySixCyclePrice;
                        if ($this.product_blx.id) {
                            $('.price-num-blx').text($this.blx_price + $this.price_qcm_yy);
                        } else {
                            $('.price-num-blx').text($this.blx_price);
                        }
                    } else if ($(this).hasClass('tow')) {
                        $('.time-discription').each(function () {
                            if ($(this).hasClass('time-tow')) {
                                $(this).removeClass('hide');
                            } else {
                                $(this).addClass('hide');
                            }
                        });
                        $this.timeLimitblx = '24';
                        //设置24期价格
                        $this.blx_price = $this.productList.content[1].twentyFourCyclePrice;
                        if ($this.product_blx.id) {
                            $('.price-num-blx').text($this.blx_price + $this.price_qcm_yy);
                        } else {
                            $('.price-num-blx').text($this.blx_price);
                        }
                    } else if ($(this).hasClass('three')) {
                        $('.time-discription').each(function () {
                            if ($(this).hasClass('time-three')) {
                                $(this).removeClass('hide');
                            } else {
                                $(this).addClass('hide');
                            }
                        });
                        $this.timeLimitblx = '12';
                        //设置12期价格
                        $this.blx_price = $this.productList.content[1].twelveCyclePrice;
                        if ($this.product_blx.id) {
                            $('.price-num-blx').text($this.blx_price + $this.price_qcm_yy);
                        } else {
                            $('.price-num-blx').text($this.blx_price);
                        }
                    }
                }
            });
            // 选择汽车膜质保选项卡中的玻璃险服务时间
            $('.placeholder-blx-yy').click(function () {
                if (!$(this).hasClass('active')) {
                    $('.placeholder-blx-yy').each(function () {
                        if ($(this).hasClass('active')) {
                            $(this).removeClass('active');
                        }
                    });
                    $(this).addClass('active');

                    if ($(this).hasClass('one')) {
                        $this.timeLimit_qcm_zh_blx = '36';
                        //设置36期价格
                        $this.price_blx_yy = $this.productList.content[1].thirtySixCyclePrice;
                        var price = $this.qcm_price + $this.price_blx_yy;
                        $('.price-num').text(price);
                    } else if ($(this).hasClass('tow')) {
                        $this.timeLimit_qcm_zh_blx = '24';
                        //设置24期价格
                        $this.price_blx_yy = $this.productList.content[1].twentyFourCyclePrice;
                        var price = $this.qcm_price + $this.price_blx_yy;
                        $('.price-num').text(price);
                    } else if ($(this).hasClass('three')) {
                        $this.timeLimit_qcm_zh_blx = '12';
                        //设置12期价格
                        $this.price_blx_yy = $this.productList.content[1].twelveCyclePrice;
                        var price = $this.qcm_price + $this.price_blx_yy;
                        $('.price-num').text(price);
                    }
                }
            });
            // 选择玻璃险选项卡中的汽车膜质保服务时间
            $('.placeholder-qcm-yy').click(function () {
                if (!$(this).hasClass('active')) {
                    $('.placeholder-qcm-yy').each(function () {
                        if ($(this).hasClass('active')) {
                            $(this).removeClass('active');
                        }
                    });
                    $(this).addClass('active');

                    if ($(this).hasClass('one')) {
                        $this.timeLimitblx_blx_zh_qcm = '36';
                        //设置36期价格
                        $this.price_qcm_yy = $this.productList.content[0].thirtySixCyclePrice;
                        var price = $this.blx_price + $this.price_qcm_yy;
                        $('.price-num-blx').text(price);
                    } else if ($(this).hasClass('tow')) {
                        $this.timeLimitblx_blx_zh_qcm = '24';
                        //设置24期价格
                        $this.price_qcm_yy = $this.productList.content[0].twentyFourCyclePrice;
                        var price = $this.blx_price + $this.price_qcm_yy;
                        $('.price-num-blx').text(price);
                    } else if ($(this).hasClass('three')) {
                        $this.timeLimitblx_blx_zh_qcm = '12';
                        //设置12期价格
                        $this.price_qcm_yy = $this.productList.content[0].twelveCyclePrice;
                        var price = $this.blx_price + $this.price_qcm_yy;
                        $('.price-num-blx').text(price);
                    }
                }
            });
            // 玻璃贴膜确定
            $('#vip-balance .btn-order').click(function () {
                $('#vip-balance .fixed-mask-layer').show();
                $('#vip-balance .close_dialog').show();
                $('#vip-balance .fixed-bottom-form').slideDown(200);
            });
            // 玻璃险确定
            $('#vip-rechargecard .btn-order').click(function () {
                $('#vip-rechargecard .fixed-mask-layer').show();
                $('#vip-rechargecard .close_dialog').show();
                $('#vip-rechargecard .fixed-bottom-form').slideDown(200);
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
            // 玻璃贴膜提交
            $('#vip-balance .submit').click(function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                var product = [];
                product.push($this.productList.content[0].id + ',' + $this.timeLimit);
                if ($this.product_qcm.id) {
                    product.push($this.product_qcm.id + ',' + $this.timeLimit_qcm_zh_blx);
                }
                var phoneNum = $.trim($("#vip-balance input[type='tel'][name='phonenum']").val());
                if (!utilCommon.checkIsMobile(phoneNum)) {
                    $('.weui_dialog_bd').text('请填写正确的手机号码');
                    $('.weui_dialog_alert').removeClass('hide');
                    return;
                }
                var carn = $this.emoji2Str($("#vip-balance input[type='text'][name='carnum']").val());
                var carnum = $.trim(carn);
                if (!carnum) {
                    $('.weui_dialog_bd').text('请填写车身识别号');
                    $('.weui_dialog_alert').removeClass('hide');
                    return;
                }
                var shopcode = $this.emoji2Str($("#vip-balance input[type='text'][name='shopcode']").val());
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
                        // par.product = JSON.stringify(product);
                        par.productStr = product.join('#');
                        // par.timeLimit = $this.timeLimit;
                        utilBrands.timeLimit.setTimeLimit($this.timeLimit);
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
                                if (undefined != data && null != data && data.code == 200 && undefined != data.data && null != data.data) {
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
                    // par.product = JSON.stringify(product);
                    par.productStr = product.join('#');
                    // par.timeLimit = $this.timeLimit;
                    utilBrands.timeLimit.setTimeLimit($this.timeLimit);
                    par.mobile = phoneNum;
                    par.carBodyNo = carnum;
                    // par.shopCode = '81F20ED8CF';
                    par.shopCode = $this.originLocal;
                    $.ajax({
                        url: config.url.alipayCreateOrder,
                        type: 'POST',
                        dataType: 'json',
                        data: par,
                        success: function (data) {
                            if (undefined != data && null != data && data.code == 200 && undefined != data.data && null != data.data) {
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
            // // 玻璃险提交
            // $('#vip-rechargecard .submit').click(function () {
            //     if ($(this).hasClass('disabled')) {
            //         return false;
            //     }
            //     var product = new Array();
            //     product.push($this.productList.content[1].id + ',' + $this.timeLimitblx);
            //     if ($this.product_blx.id) {
            //         product.push($this.product_blx.id + ',' + $this.timeLimitblx_blx_zh_qcm);
            //     }
            //     var phoneNum = $.trim($("#vip-rechargecard input[type='tel'][name='phonenum']").val());
            //     if (!utilCommon.checkIsMobile(phoneNum)) {
            //         $('.weui_dialog_bd').text('请填写正确的手机号码');
            //         $('.weui_dialog_alert').removeClass('hide');
            //         return;
            //     }
            //     var carn = $this.emoji2Str($("#vip-rechargecard input[type='text'][name='carnum']").val());
            //     var carnum = $.trim(carn);
            //     if (!carnum) {
            //         $('.weui_dialog_bd').text('请填写车身识别号');
            //         $('.weui_dialog_alert').removeClass('hide');
            //         return;
            //     }
            //     var shopcode = $this.emoji2Str($("#vip-rechargecard input[type='text'][name='shopcode']").val());
            //     var shopcodenum = $.trim(shopcode);
            //     if (shopcodenum && null != shopcodenum && 'undefined' != shopcodenum) {
            //         $this.originLocal = shopcodenum;
            //     } else {
            //         $this.originLocal = utilBrands.origin.getOrigin();
            //     }
            //     $this.showLoadin('提交订单...');
            //     if ($this.isWeChat() && $this.openid) {
            //         // 如果是在微信里面就用微信支付
            //         var b_version = navigator.appVersion;
            //         var version = parseFloat(b_version);
            //         if (version >= 5.0) {
            //             // 创建订单
            //             var par = {};
            //             // par.product = JSON.stringify(product);
            //             par.productStr = product.join('#');
            //             // par.timeLimit = $this.timeLimitblx;
            //             utilBrands.timeLimit.setTimeLimit($this.timeLimitblx);
            //             par.mobile = phoneNum;
            //             par.carBodyNo = carnum;
            //             par.shopCode = $this.originLocal;
            //             par.openId = $this.openid;
            //             $.ajax({
            //                 url: config.url.unifiedOrder,
            //                 type: 'POST',
            //                 dataType: 'json',
            //                 data: par,
            //                 success: function (data) {
            //                     if (undefined != data && null != data && data.code == 200 && undefined != data.data && null != data.data) {
            //                         var result = data.data;
            //                         if (result.orderNo) {
            //                             utilBrands.orderNo.setOrderNo(result.orderNo);
            //                         }
            //                         $this.weChatPay(result.package, result.paySign, result.nonceStr, result.appId, result.timeStamp, 'http://www.tcsdcar.com/m/paysuccess.html');
            //                     } else {
            //                         $this.hideLoadin();
            //                         $('.weui_dialog_bd').text('订单创建失败，请重试');
            //                         $('.weui_dialog_alert').removeClass('hide');
            //                     }
            //                 }
            //                 , error: function (xhr) {
            //                     $this.hideLoadin();
            //                     $('.weui_dialog_bd').text('订单创建失败，请重试');
            //                     $('.weui_dialog_alert').removeClass('hide');
            //                     return false;
            //                 }
            //             });
            //         } else {
            //             $this.hideLoadin();
            //             $('.weui_dialog_bd').text('微信版本过低，请升级您的微信客户端');
            //             $('.weui_dialog_alert').removeClass('hide');
            //         }
            //     } else {
            //         // 使用支付宝支付
            //         var par = {};
            //         // par.product = JSON.stringify(product);
            //         par.productStr = product.join('#');
            //         // par.timeLimit = $this.timeLimitblx;
            //         utilBrands.timeLimit.setTimeLimit($this.timeLimitblx);
            //         par.mobile = phoneNum;
            //         par.carBodyNo = carnum;
            //         par.shopCode = $this.originLocal;
            //         $.ajax({
            //             url: config.url.alipayCreateOrder,
            //             type: 'POST',
            //             dataType: 'json',
            //             data: par,
            //             success: function (data) {
            //                 if (undefined != data && null != data && data.code == 200 && undefined != data.data && null != data.data) {
            //                     var result = data.data;
            //                     if (result.orderNo) {
            //                         utilBrands.orderNo.setOrderNo(result.orderNo);
            //                     }
            //                     $('body').append(result.content);
            //                     // $this.weChatPay(result.package,result.paySign,result.nonceStr,result.appId,result.timeStamp,'http://www.tcsdcar.com/m/paysuccess.html');
            //                 } else {
            //                     $this.hideLoadin();
            //                     $('.weui_dialog_bd').text('订单创建失败，请重试');
            //                     $('.weui_dialog_alert').removeClass('hide');
            //                 }
            //             }
            //             , error: function (xhr) {
            //                 $this.hideLoadin();
            //                 $('.weui_dialog_bd').text('订单创建失败，请重试');
            //                 $('.weui_dialog_alert').removeClass('hide');
            //                 return false;
            //             }
            //         });
            //     }
            // });
            $('.icon-check').click(function () {
                if ($('.icon-check').hasClass('checked')) {
                    $('.icon-check').removeClass('checked');
                    $('.submit').addClass('disabled');
                } else {
                    $('.icon-check').addClass('checked');
                    $('.submit').removeClass('disabled');
                }
            });
            // 购买玻璃险的套餐
            $('.check-yy-flag-qcm').click(function () {
                if ($('.icon-yy-check-qcm').hasClass('checked')) {
                    $('.icon-yy-check-qcm').removeClass('checked');
                    $(".panel-qcm").slideToggle("normal");
                    $('.price-num').text($this.qcm_price);
                    delete $this.product_qcm.id;
                } else {
                    $('.icon-yy-check-qcm').addClass('checked');
                    $(".panel-qcm").slideToggle("normal");
                    var price = $this.qcm_price + $this.price_blx_yy;
                    $('.price-num').text(price);
                    $this.product_qcm.id = $this.productList.content[1].id;
                }
            });
            // 购买汽车膜的套餐
            $('.check-yy-flag-blx').click(function () {
                if ($('.icon-yy-check-blx').hasClass('checked')) {
                    $('.icon-yy-check-blx').removeClass('checked');
                    $(".panel-blx").slideToggle("normal");
                    $('.price-num-blx').text($this.blx_price);
                    delete $this.product_blx.id;
                    delete $this.product_blx.time;
                } else {
                    $('.icon-yy-check-blx').addClass('checked');
                    $(".panel-blx").slideToggle("normal");
                    var price = $this.blx_price + $this.price_qcm_yy;
                    $('.price-num-blx').text(price);
                    $this.product_blx.id = $this.productList.content[0].id;
                    $this.product_blx.time = $this.timeLimitblx_blx_zh_qcm;
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