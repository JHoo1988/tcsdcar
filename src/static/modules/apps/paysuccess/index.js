/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
    'use strict';

    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilBrands = require('util_brands');

    var App = function () {
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var originLocal = utilBrands.origin.getOrigin();
            if(!originLocal){
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
            // var origin = this.origin;
            // this.getunifiedOrder(function (addressList) {
            //     var pageData = {};
            //     if (origin === -1) {
            //     }
            //     pageData.data = addressList.content;
            //     var html = new EJS({ url: 'views/paysuccess/index.ejs' }).render(pageData);
            //     $('body').prepend(html);
            // });
            var html = new EJS({ url: 'views/paysuccess/index.ejs' }).render();
            $('body').prepend(html);
        },

        //获取订单信息
        getunifiedOrder: function (callback) {
            var url = config.url.getunifiedOrder;
            var brand = utilBrands.brands.getBrand();
            // var userId = utilUser.user.getUserId();
            jea.get(url, null, function (result) {
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