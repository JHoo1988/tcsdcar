/**
 * Created by Ryan on 2017/3/9.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
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
            utilPage.ready();
            this.renderPage();
            this.bind();
            fastclick.attach(document.body);
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (callback) {
            var html = new EJS({url: '../views/wash/index.ejs'}).render();
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {

        }
    };

    return new App();
});