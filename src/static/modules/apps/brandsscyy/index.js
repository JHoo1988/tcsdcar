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
            var _self = this;
            var originLocal = utilBrands.origin.getOrigin();
            if (!originLocal) {
                window.location.href = 'entrance.html';
                return;
            }
            utilPage.ready();
            _self.renderPage();
            _self.bind();
            fastclick.attach(document.body);
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var _self = this;
            this.getAddressList(function (addressList) {
                var pageData = {};
                pageData.data = addressList;
                var html = new EJS({ url: 'views/brandsscyy/index.ejs' }).render(pageData);
                $('body').prepend(html);
                _self.hideLoadin();
            });
        },

        /**
         * @func
         * @desc 获取品牌列表
         */
        getAddressList: function (callback) {
            var url = config.url.findAllProductBrands;
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
            $body.on('click', '.list-item', function () {
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href='productsscyy.html';
            });
            // 选中
            $body.on('click', '.weui-grid', function () {
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href='productsscyy.html';
            });
        },
        setUserSelected: function (data) {
            utilBrands.brands.setBrand(data);
        },
        hideLoadin: function () {
            $('#loadingToast').addClass('hide');
        },
        showLoadin: function (content) {
            $('#loadingToast').removeClass('hide');
            if (content) {
                $('.weui_toast_content').text(content);
            }
        }
    };
    return new App();
});