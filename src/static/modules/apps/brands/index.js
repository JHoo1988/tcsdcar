/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick','layer', 'weui', 'ejs'], function ($, jea, config, fastclick,layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilUser = require('util_user');
    var utilAddress = require('util_address');

    var App = function () {
        this.origin = this.getOrigin();
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
            var origin = this.origin;
            this.getAddressList(function (addressList) {
                var pageData = {};
                if (origin === -1) {
                }
                pageData.data = addressList;
                var html = new EJS({ url: '../views/brands/index.ejs' }).render(pageData);
                $('body').prepend(html);
            });
        },

        /**
         * 获取来源（）
         * @returns {*}
         */
        getOrigin: function () {
            var origin = utilCommon.getParam('origin');
            if (origin === '' || origin === null) {
                origin = -1;
            }
            return origin;
        },

        /**
         * @func
         * @desc 获取地址列表
         */
        getAddressList: function (callback) {
            var url = config.url.findAllProductBrands;
            // var userId = utilUser.user.getUserId();

            jea.get(url, null, function (result) {

                if (result&&result.code=='200' && result.data && typeof callback === 'function') {
                    callback(result.data)
                }

            });
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var self = this;
            var $body = $('body');
            // 选中
            $body.on('click', '.address-item', function () {
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                // window.location.replace(backUrl);
                window.history.go(-1);
            });
        },
        setUserSelected: function (data) {
            var keys = {
                "1": "address", // 家电清洗
                "3": "install", // 家电安装
                "2": "repair", // 家电维修
                "4": "phoneRepair",   // 手机维修 - 上门
                "5": "phoneRepair"   // 手机维修 - 邮寄
            };
            var key = keys[this.origin] || keys['1'];

            utilAddress[key].setUserSelected(data);

        }
    };
    return new App();
});