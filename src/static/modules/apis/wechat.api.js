/**
 * Created by arvin on 2016/5/14.
 */
define(['config', 'jea', 'jquery', 'weui'], function (config, jea, $) {
    var utilUser = require('util_user');
    var utilCommon = require('util_common');
    var App = function () {
        this.wx = wx;
        this.allUseJsAPiList = ['chooseWXPay', 'getLocation',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
        ];
        this.timestamp = null;
        this.ip = null;
    };
    App.prototype = {
        initIp: function () {
            if (this.ip != null) {
                return;
            }
            var url = config.url.ipTest;
            jea.ajax(url, {}, function (result) {
                alert(result);
            });
        },
        wxConfig: function (jsApiList, callback, errorCallBack) {
            var _self = this;
            // this.getWechatTicket(function (result) {
            //     if (!result.data) {
            //         if (typeof(errorCallBack) === 'function') {
            //             errorCallBack(result);
            //         }
            //     }
            //     wx.config({
            //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //         appId: config.app.appId, // 必填，公众号的唯一标识
            //         timestamp: result.data.timestamp, // 必填，生成签名的时间戳
            //         nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
            //         signature: result.data.signature,// 必填，签名，见附录1
            //         jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            //     });
            //     wx.ready(function () {
            //         if (typeof callback === 'function') {
            //             callback(wx);
            //         }
            //     });
            //     wx.error(function (res) {
            //         if (typeof(errorCallBack) === 'function') {
            //             errorCallBack(res);
            //         }
            //     });
            // });
        },
        getWechatTicket: function (currentUrl, callback) {
            var param = {'currentUrl': currentUrl};
            if (typeof(currentUrl) === 'function') {
                callback = currentUrl;
                var localUrl = window.location.href;
                var i = localUrl.indexOf('#');
                if (i != -1) {
                    localUrl = localUrl.substr(0, i);
                }
                param = {'currentUrl': localUrl};
            }
            var url = config.url.getWechatTicket;
            jea.ajax(url, param, callback);
        },
        wxPayOrderById: function (orderId, callback, fail, fn, orderType) {
            var _self = this;
            var openId = utilUser.user.getOpenId();
            var param = {orderId: orderId, payWay: 0, openId: openId};
            if (orderType != null) {
                /*
                 * 调起支付中 2016-7 增加参数 orderType
                 * 和业务订单类型区别开来
                 * 如果空或1 表示原清洗、维修、安装、家居安装等业务
                 * 2 表示 手机维修业务
                 * 3 表示会员充值
                 * 4 表示tcsm单支付类型
                 * 15 表示 智能家居业务
                 * 20 表示 手机碎屏险业务
                 * */
                param.orderType = orderType;
            }
            var url = config.url.unifiedOrder;
            if (!utilCommon.isWeChat()) {
                $.alert('请在微信中进行支付！', '温馨提示');
                if (typeof fail === 'function') {
                    fail();
                }
                return;
            }
            $.showLoading('支付中...');
            jea.ajax(url, param, function (result) {
                $.hideLoading();
                var payConfig = result.data;
                /*if(typeof fn === 'function'){
                 fn();
                 }*/
                wx.chooseWXPay({
                    appId: payConfig.appId, // 必填，公众号的唯一标识
                    timestamp: payConfig.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: payConfig.nonceStr, // 支付签名随机串，不长于 32 位
                    package: payConfig.signPackage, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: payConfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: payConfig.paySign, // 支付签名
                    success: function (res) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    },
                    fail: function (res) {
                        if (typeof fail === 'function') {
                            fail();
                        }
                    }
                });
            });
        },
        queryOrderIsPayById: function (orderId, payedBack, noPayBack, orderType) {
            var openId = utilUser.user.getOpenId();
            var param = {orderId: orderId, payWay: 0, openId: openId};
            if (orderType != null) {
                param.orderType = orderType;
            }
            var url = config.url.queryOrder;
            jea.ajax(url, param, function (result) {
                if (result.data.resultCode == 'SUCCESS') {
                    payedBack(result);
                } else {
                    noPayBack(result);
                }
            });
        },
        // emt扫码支付
        emtWxPayOrder: function (orderId, callback, fail, fn, orderType) {
            var _self = this;
            var openId = utilUser.user.getEMTPayOpenId();
            var param = {orderId: orderId, payWay: 0, openId: openId};
            if (orderType != null) {
                /*
                 * 调起支付中 2016-7 增加参数 orderType
                 * 如果空或1 表示原清洗、维修、安装、家居安装等业务
                 * 2 表示 手机维修业务
                 * 3 表示会员充值
                 * 4 表示tcsm单支付类型
                 * */
                param.orderType = orderType;//支付类型
            }
            var url = config.url.unifiedOrder;
            if (!utilCommon.isWeChat()) {
                $.alert('请在微信中进行支付！', '温馨提示');
                if (typeof fail === 'function') {
                    fail();
                }
                return;
            }
            $.showLoading('支付中...');
            jea.ajax(url, param, function (result) {
                $.hideLoading();
                var payConfig = result.data;
                wx.chooseWXPay({
                    appId: payConfig.appId, // 必填，公众号的唯一标识
                    timestamp: payConfig.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: payConfig.nonceStr, // 支付签名随机串，不长于 32 位
                    package: payConfig.signPackage, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: payConfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: payConfig.paySign, // 支付签名
                    success: function (res) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    },
                    fail: function (res) {
                        if (typeof fail === 'function') {
                            fail();
                        }
                    }
                });
            });
        },
        //查询emtPay（扫码支付）的支付状态，由于使用静默授权，所以只拿用户的openId，因此需要单独存储用户openId
        queryEMTWXOrderIsPayById: function (orderId, payedBack, noPayBack, orderType) {
            var openId = utilUser.user.getEMTPayOpenId();
            var param = {orderId: orderId, payWay: 0, openId: openId};
            if (orderType != null) {
                param.orderType = orderType;
            }
            var url = config.url.queryOrder;
            jea.ajax(url, param, function (result) {
                if (result.data.resultCode == 'SUCCESS') {
                    payedBack(result);
                } else {
                    noPayBack(result);
                }
            });
        },
        /*
         * PayType {
         *      Offline(0), //线下支付
         *      WXPay(1), // 微信支付
         *      ALiPay(2), // 支付宝
         *      BankCard(3), //银行卡支付
         *      ThirdPartyPay(4), //第三方平台支付
         *      WalletPay(5); // 钱包支付
         */

        processOrderPayType: function (orderId, payType, callback) {
            var param = {"orderId": orderId, "payType": payType};
            $.showLoading();
            jea.ajax(config.url.processOrderPayType, param, function (result) {
                if (result) {
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
                $.hideLoading();
            });
        },
        checkJsApi: function (jsApi, callback, noback) {
            wx.checkJsApi({
                jsApiList: [jsApi], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function (res) {
                    if (res.checkResult[jsApi]) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    } else {
                        if (typeof noback === 'function') {
                            noback();
                        }
                    }
                }
            });
        }
    };
    return new App();
});
