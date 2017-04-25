/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
    'use strict';

    var utilPage = require('util_page');
    var utilBrands = require('util_brands');

    var App = function () {
        this.brand=utilBrands.brands.getBrand();
        this.product=utilBrands.product.getProduct();
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
            var data={};
            data.brand = this.brand;
            data.product = this.product;
            var html = new EJS({ url: '../views/order/index.ejs' }).render(data);
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var $this = this;
            $('.placeholder').click(function () {
                if(!$(this).hasClass('selectd')){
                    $('.placeholder').each(function(){
                        if($(this).hasClass('selectd')) {
                            $(this).removeClass('selectd');
                        }
                    });
                    $(this).addClass('selectd');

                    if($(this).hasClass('one')) {
                        $('.time-discription').each(function () {
                            if($(this).hasClass('time-one')){
                                $(this).removeClass('hide');
                            }else{
                                $(this).addClass('hide');
                            }
                        });
                        //设置36期价格
                        $('.price-num').text($this.product.thirtySixCyclePrice);
                    }else if($(this).hasClass('tow')) {
                        $('.time-discription').each(function () {
                            if($(this).hasClass('time-tow')){
                                $(this).removeClass('hide');
                            }else{
                                $(this).addClass('hide');
                            }
                        });
                        //设置24期价格
                        $('.price-num').text($this.product.twentyFourCyclePrice);
                    }else if($(this).hasClass('three')) {
                        $('.time-discription').each(function () {
                            if($(this).hasClass('time-three')){
                                $(this).removeClass('hide');
                            }else{
                                $(this).addClass('hide');
                            }
                        });
                        //设置12期价格
                        $('.price-num').text($this.product.twelveCyclePrice);
                    }
                }
            });
        }
    };
    return new App();
});