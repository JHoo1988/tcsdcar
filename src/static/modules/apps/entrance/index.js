/**
 * Created by 焦红 on 2017/5/29.
 * tel:18971057583
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'rsvp', 'weui', 'ejs'], function ($, jea, config, fastclick, layer, Q) {
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
            utilPage.ready();
            fastclick.attach(document.body);
            Q.all([_self.getCbrands(),_self.getQCMBrands()])
                .then(function (datas) {
                    _self.renderPage(datas[0]);
                    _self.bind();
                })
                .finally(function () {

                });
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (data1) {
            var html = new EJS({ url: 'views/entrance/index.ejs' }).render(data1);
            $('body').prepend(html);
        },
        //获取汽车品牌列表
        getCbrands:function () {
            var _self = this;
            return new Q.Promise(function(resolve, reject) {
                _self.getCarBrandsList(function(result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("getCarBrandsList failed");
                    }
                })

            });
        },
        //获取汽车品牌列表
        getCarBrandsList: function (callback) {
            var url = config.url.findAllProductBrands;
            // var userId = utilUser.user.getUserId();
            jea.get(url, null, function (result) {
                if (result && result.code == '200' && result.data && typeof callback === 'function') {
                    callback(result)
                }
            });
        },
        //获取汽车膜品牌列表
        getQCMBrands: function () {
            var _self = this;
            return new Q.Promise(function(resolve, reject) {
                _self.getQCMBrandsList(function(result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("getQCMBrandsList failed");
                    }
                })

            });
        },
        //获取汽车膜品牌列表
        getQCMBrandsList: function (callback) {
            var url = config.url.findAllProductBrands;
            // var userId = utilUser.user.getUserId();
            jea.get(url, null, function (result) {
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
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href = 'order.html';
                // window.location.replace(backUrl);
                // window.history.go(-1);
            });
        },
        setUserSelected: function (data) {
            utilBrands.product.setProduct(data);
        }
    };
    return new App();
});