/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'weui', 'ejs'], function ($, jea, config, fastclick, layer) {
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
            if (!originLocal) {
                window.location.href = 'brands.html';
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
            this.getProductList(function (addressList) {
                var pageData = {};
                pageData.data = addressList.content;
                var html = new EJS({ url: 'views/products/index.ejs' }).render(pageData);
                $('body').prepend(html);
            });
        },

        /**
         * @func
         * @desc 获取车型列表
         */
        getProductList: function (callback) {
            var url = config.url.findAllProductModel;
            var par = {};
            var brand = utilBrands.brands.getBrand();
            par.brandsId = brand.id;
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
            $body.on('click', '.list-item', function () {
                // $.toastNoIcon('请输入推荐码', 'noicon');
                self.showLoadin();
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                var selectProduct = utilBrands.product.getProduct();
                self.getProduct(selectProduct.id);
            });
            // 取消提示框
            $body.on('click', '.weui_btn_dialog', function () {
                $('.weui_dialog_alert').addClass('hide');
            });
        },
        setUserSelected: function (data) {
            utilBrands.product.setProduct(data);
        },
        /**
         * 获取产品
         */
        getProduct: function (productModelId) {
            var _self = this;
            var url = config.url.findProductList;
            var par = {};
            par.productModelId = productModelId;
            par.pageIndex = 1;
            par.pageSize = 999;
            // var userId = utilUser.user.getUserId();
            jea.get(url, par, function (result) {
                if (result && result.code == '200' && result.data) {
                    utilBrands.productList.setProductList(result.data);
                    _self.hideLoadin();
                    if (result.data.content && result.data.content.length > 0) {
                        window.location.href = 'order.html';
                    } else {
                        $('.weui_dialog_bd').text('该车型暂无服务产品');
                        $('.weui_dialog_alert').removeClass('hide');
                    }

                }
            });
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