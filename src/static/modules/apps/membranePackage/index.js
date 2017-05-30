/**
 * Created by 焦红 on 2017/5/29.
 * tel:18971057583
 */
define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'weui', 'ejs'], function ($, jea, config, fastclick, layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilBrands = require('util_brands');

    var App = function () {
        this.brand = utilBrands.brands.getBrand();
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var originLocal = utilBrands.origin.getOrigin();
            if (!originLocal) {
                window.location.href = 'entrance.html';
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
            var html = new EJS({ url: 'views/membranePackage/index.ejs' }).render();
            $('body').prepend(html);
            return;
            var _self = this;
            this.getMembraneList(function (addressList) {
                var title = _self.brand.name;
                var pageData = {};
                pageData.data = addressList.content;
                pageData.title = title;
                var html = new EJS({ url: 'views/membranePackage/index.ejs' }).render(pageData);
                $('body').prepend(html);
            });
        },

        /**
         * @func
         * @desc 获取品牌列表
         */
        getMembraneList: function (callback) {
            var _self = this;
            var url = config.url.findProductList;
            var par = {};
            par.brands = _self.brand.id;
            par.pageIndex = 1;
            par.pageSize = 999999;
            // var userId = utilUser.user.getUserId();
            jea.get(url, par, function (result) {
                if (result && result.code == '200' && result.data && typeof callback === 'function') {
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
            $body.on('click', '.weui_grid', function () {
                // $.toastNoIcon('请输入推荐码', 'noicon');
                var $this = $(this);
                var json = $this.data('json');
                // self.setUserSelected(json);
                window.location.href = 'glassRiskProductOrder.html';
            });
        },
        setUserSelected: function (data) {
            utilBrands.product.setProduct(data);
        }
    };
    return new App();
});