/**
 * Created by Ryan on 2017/3/9.
 */

define(['jquery', 'fastclick', 'weui', 'ejs'], function ($, fastclick) {
    'use strict';

    var App = function () {

    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            this.renderPage();
            fastclick.attach(document.body);
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (callback) {
            var html = new EJS({url: '../views/home/index.ejs'}).render();
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