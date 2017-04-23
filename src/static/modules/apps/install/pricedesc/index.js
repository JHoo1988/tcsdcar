/**
 * Created by 焦红 on 2017/3/22.
 * tel:18971057583
 */
define(['jquery', 'fastclick','rsvp','jea', 'weui', 'ejs'], function ($, fastclick,Q,jea) {
    'use strict';
    var utilPage = require('util_page');
    var App = function () {
    };
    App.prototype = {
        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var _self=this;
            utilPage.ready();

            fastclick.attach(document.body);
            _self.renderPage();
            _self.bind();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var html = new EJS({url: '../../views/install/pricedesc/index.ejs'}).render();
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
        }
    };

    return new App();
});
