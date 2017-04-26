/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick','layer', 'weui', 'ejs'], function ($, jea, config, fastclick,layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilBrands = require('util_brands');

    var App = function () {
        this.origin = this.getOrigin();
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
            console.log(utilBrands.product.getProduct());
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var origin = this.origin;
            this.getProductList(function (addressList) {
                var pageData = {};
                if (origin === -1) {
                }
                pageData.data = addressList.content;
                var html = new EJS({ url: 'views/products/index.ejs' }).render(pageData);
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
                origin = 'TCSDCAR888';//不是经过扫描店铺二维码进入的
            }
            return origin;
        },

        /**
         * @func
         * @desc 获取品牌列表
         */
        getProductList: function (callback) {
            var url = config.url.findProductList;
            var par = {};
            var brand = utilBrands.brands.getBrand();
            par.brands=brand.id;
            par.pageIndex=1;
            par.pageSize=999999;
            // var userId = utilUser.user.getUserId();
            jea.get(url, par, function (result) {
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
                // $.toastNoIcon('请输入推荐码', 'noicon');
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href='order.html';
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