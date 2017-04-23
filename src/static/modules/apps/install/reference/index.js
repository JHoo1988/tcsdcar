/**
 * Created by 焦红 on 2017/3/22.
 * tel:18971057583
 */
define(['jquery', 'fastclick','rsvp','jea', 'weui', 'ejs'], function ($, fastclick,Q,jea) {
    'use strict';
    var utilPage = require('util_page');
    var utilOrder = require('util_repair_order');
    var App = function () {
    };
    App.prototype = {
        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var _self=this;
            utilPage.ready();

            fastclick.attach(document.body);
            _self.renderPage();
            _self.bind();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var html = new EJS({url: '../../views/install/reference/index.ejs'}).render();
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
        },

        showListPrice : function(business){
            // var dataDetail = utilOrder.order.getCategoriesDetail();
            // var business = dataDetail.business;
            var _self = this;
            var $me = $('body');
            var item = utilOrder.order.getCategoryItemDefault();
            var num = 0;
            console.log(business);
            if(item != null){
                $me.find('.price-tab-list .price-tab').hide();
                var $tabs = $me.find('.price-tab-list .js-type-' + business.orderType + '.price-tab[data-id="' + item.categoryId + '"]');
                $tabs.show()
                num = $tabs.size();
            }else{
                $me.find('.price-tab-list .price-tab').hide();
                var $tabs = $me.find('.price-tab-list .js-type-' + business.orderType + '.price-tab');
                $tabs.show()
                num = $tabs.size();
            }

            if(num == 0){
                $me.find('.no-price').show();
            }
            return this;
        }
    };

    return new App();
});
