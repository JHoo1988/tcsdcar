/**
 * Created by 焦红 on 2017/5/29.
 * tel:18971057583
 */
define(['jquery', 'jea', 'config', 'fastclick','layer', 'weui', 'ejs'], function ($, jea, config, fastclick,layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilBrands = require('util_brands');

    var App = function () {
        this.productBrands = utilBrands.productBrands.getProductBrands();
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var originLocal = utilBrands.origin.getOrigin();
            if(!originLocal){
                window.location.href='entrance.html';
                return;
            }
            utilPage.ready();
            fastclick.attach(document.body);
            this.renderPage();
            this.bind();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var _self = this;
            this.getProductList(function (addressList) {
                var title = _self.productBrands.name;
                var pageData = {};
                pageData.data = addressList.content;
                pageData.title = title;
                var html = new EJS({ url: 'views/glassRiskProduct/index.ejs' }).render(pageData);
                $('body').prepend(html);
            });
        },

        getProductList: function (callback) {
            var _self = this;
            var url = config.url.findBrandsProductList;
            var par = {};
            par.bigBrandsCategory=_self.productBrands.id;
            par.pageIndex=1;
            par.pageSize=999999;
            // var userId = utilUser.user.getUserId();
            jea.get(url, par, function (result) {
                if (result&&result.code=='200' && result.data && typeof callback === 'function') {
                    callback(result.data)
                }
            });
        },

        bind: function () {
            var self = this;
            var $body = $('body');
            // 选中
            $body.on('click', '.list-item', function () {
                // $.toastNoIcon('请输入推荐码', 'noicon');
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href='glassRiskProductOrder.html';
            });
        },
        setUserSelected: function (data) {
            utilBrands.productSC.setProductSC(data);
        }
    };
    return new App();
});