/**
 * Created by Ryan on 2017/3/9.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
    'use strict';
    var utilPage = require('util_page');
    var utilOrder = require('util_household_order');
    var App = function () {

    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            utilPage.ready();
            fastclick.attach(document.body);
            this.renderPage();
            this.bind();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (callback) {
            var _self = this;
            // $.showLoading();
            _self.findAllMainCategory(function(result){
                $.hideLoading();
                var data = result.data;
                var html = new EJS({url: '../views/household/index.ejs'}).render({data:data});
                $('body').prepend(html);
                // var height = $(window).height() - $('.brand-list').offset().top;
                var height = $(window).height() - $('.brand-list').offset().top*2.22;
                $('.brand-list,.model-list')
                    .css('height',height)
                    .css('overflow-x','hidden')
                    .css('overflow-y','auto');
                _self.bind();
                $('.left-brand .check-label:first-child').trigger('click');
            });
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
            $('.js-detail').click(function(){
                // household_detail.init();
            });
            //点击选择左侧大类
            $('.left-brand .check-label').click(function(){
                $('.left-brand .check-label').removeClass('checked');
                $(this).addClass('checked');
                var data = $(this).data('json');
                var bigCategory = data.productBigCategory;
                utilOrder.order.setBigClassItem({
                    bigCategory : bigCategory
                });
                utilOrder.order.clearSubClassItem();
                _self.loadSubclassList(bigCategory);
            });
        },
        findAllMainCategory : function(callback){
            jea.post(config.url.findAllMainCategory,callback);
        },
        loadSubclassList : function(bigCategory){
            var _self = this;
            var param = {
                bigCategory : bigCategory
            };
            jea.post(config.url.findAllSubCategory,param,function(result){
                var list = result.data;
                var html = '';
                if(list.length>20){
                    for(var i= 0,len=20;i<len;i++){
                        var d=list[i];
                        html+='<div class="check-label" data-json='+JSON.stringify(d)+'><span class="num-icon" data-num="'+(i+1)+'">'+(i+1)+'</span>'+ d.productSmallCategory+'</div>'
                    }
                    for(var i= 0,len=list.length-20;i<len;i++){
                        var d=list[i+20];
                        html+='<div class="check-label" data-json='+JSON.stringify(d)+'>'+ d.productSmallCategory+'</div>'
                    }
                }else{
                    for(var i= 0,len=list.length;i<len;i++){
                        var d=list[i];
                        html+='<div class="check-label" data-json='+JSON.stringify(d)+'><span class="num-icon" data-num="'+(i+1)+'">'+(i+1)+'</span>'+ d.productSmallCategory+'</div>'
                    }
                }

                $('.model-list').html(html);
                _self.bindEventForSubclassItem();
            });
        },
        bindEventForSubclassItem : function(){
            var _self = this;
            $('.model-list .check-label').click(function(){
                var data = $(this).data('json');
                utilOrder.order.setSubclasstmp(data);
                // household_subclass.init(data);
                window.location.href='detail.html';
            });

        }
    };

    return new App();
});