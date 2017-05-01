/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
    'use strict';

    var utilPage = require('util_page');
    var utilBrands = require('util_brands');
    var utilCommon = require('util_common');
    var App = function () {
        this.orderNo = utilBrands.orderNo.getOrderNo();
        this.brand = utilBrands.brands.getBrand();
        this.product = utilBrands.product.getProduct();
        this.timeLimit = utilBrands.timeLimit.getTimeLimit();
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var originLocal = utilBrands.origin.getOrigin();
            var out_trade_no = utilCommon.getParam('out_trade_no');
            if(!originLocal&&!out_trade_no){
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
            this.getunifiedOrder(function (data) {
                // var pageData = {};
                // pageData.data = data.data;
                // var html = new EJS({ url: 'views/paysuccess/index.ejs' }).render(pageData);
                // $('body').prepend(html);
            });
            var pageData = {};
            pageData.orderNo = this.orderNo;
            pageData.brand = this.brand;
            pageData.product = this.product;
            pageData.timeLimit = this.timeLimit;
            var out_trade_no = utilCommon.getParam('out_trade_no');
            if(out_trade_no){
                pageData.orderNo=out_trade_no;
            }
            var html = new EJS({ url: 'views/paysuccess/index.ejs' }).render(pageData);
            $('body').prepend(html);
        },

        //获取订单信息
        getunifiedOrder: function (callback) {
            var url = config.url.getunifiedOrder;
            jea.get(url+this.orderNo, null, function (result) {
                if (result&&result.code=='200' && result.data && typeof callback === 'function') {
                    callback(result.data)
                }
            });
        },

        //绑定事件
        bind: function () {
        }
    };
    return new App();
});