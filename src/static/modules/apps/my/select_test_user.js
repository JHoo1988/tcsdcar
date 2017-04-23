/**
 * Created by ryandu on 2017/3/31.
 */
define(['jquery', 'jea', 'config', 'weui', 'ejs'], function ($, jea, config) {
    'use strict';

    var utilCommon = require('util_common');
    var utilUser = require('util_user');

    var App = function () {
        this.backUrl = utilCommon.getParam('backurl');
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {

            if (!config.test) {
                return;
            }

            this.renderPage();
            this.bind();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var html = new EJS({url: '../views/my/select_test_user.ejs'}).render({
                testUserIndex: utilUser.user.getTestUserIndex(),
                testOpenidList: config.testOpenIdList
            });
            console.log(html);
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var $body = $('body');
            $body.on('click', '.test-user-item', function () {
                var index = $(this).data('index');
                utilUser.user.setTestUserIndex(index);
                window.location.href = '../index.html';
            })
        }
    };

    return new App();
});