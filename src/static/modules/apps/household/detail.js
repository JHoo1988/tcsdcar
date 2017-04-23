/**
 * 家居安装详细
 * Created by 焦红 on 2017/4/17.
 * tel:18971057583
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
    'use strict';
    var utilPage = require('util_page');
    var utilOrder = require('util_household_order');
    var App = function () { };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            utilPage.ready();
            fastclick.attach(document.body);
            this.renderPage();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (callback) {
            var _self = this;
            var data = utilOrder.order.getSubclasstmp();
            // $.showLoading();
            var subCategory = data.productSmallCategory;
            _self.findProductDetailList(subCategory,function(result){
                //console.log(result);
                var list = result.data;
                var selectedList = utilOrder.order.getSubClassItem() || [];//用户曾经选择过得数据
                var content = new EJS({url: "../views/household/detail.ejs"}).render({
                    list : list,
                    subCategory : subCategory,
                    selectedList : selectedList
                });
                $('body').prepend(content);
                _self.bind();

            });
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {

            var _self = this;
            //购物车页面
            $('.shop-cart').click(function(){
                _self.householdSubclassPageIsLoaded = 0;
                var list = utilOrder.order.getSubClassItem()||[];
                if(list.length == 0){
                    $.alert('请选择商品','');
                    return false;
                }
                // household_order.init();
                window.location.href='order.html';
            });
            //input 输入控制 过滤特殊字符
            $('input').on('input propertychange', function (){
                $(this).val($(this).val().replace(/[^0-9]/g,''));
            });
            $('input').blur(function(){
                var $this = $(this);
                var min = parseInt($this.data('min'));
                var max = parseInt($this.data('max'));
                var num = parseInt($this.val()||0);
                if(num<min){
                    num = min;
                    $.toastNoIcon('输入无效，不小于'+min+'且不大于'+max, 'noicon');
                }else if(num>max){
                    num = max;
                    $.toastNoIcon('输入无效，不小于'+min+'且不大于'+max, 'noicon');
                }
                //1.更新UI
                $this.val(num);
                var $item = $this.parents('.item');
                var data = $item.data('json');
                //2.给数据初始化
                data.num = num;
                data.productNum = 1;
                //3.将数据更新入缓存 : 如果当前类被标记选中了之后
                if($item.hasClass('active')){
                    utilOrder.order.setSubClassItem(data);
                    //4.更新底部购物车
                    _self.updateUI();
                }
            });


            $('.item').click(function(e){
                var $this = $(this);
                var $text = $this.find('.text');
                var min = parseInt($text.data('min'));
                var max = parseInt($text.data('max'));
                var num = parseInt($text.val());
                var data = $this.data('json');

                //从非数量加减区域勾选该类
                if(!$(e.target).parents().hasClass('select-ele-action')){
                    if($this.hasClass('active')){
                        //1.
                        $this.removeClass('active');
                        //2.
                        $this.find('.icon-check').removeClass('checked');
                        //3.给数据初始化
                        data.num = 0;
                        data.productNum = 0;
                        //4.移除该选项数据
                        utilOrder.order.removeSubClassItemById(data.productId);
                        //5.更新底部购物车
                        _self.updateUI();
                    }else{
                        //1.
                        $this.addClass('active');
                        //2.
                        $this.find('.icon-check').addClass('checked');
                        //3.给数据初始化
                        data.num = num;
                        data.productNum = 1;
                        //4.此操作标记了该项，将数据更新入缓存
                        utilOrder.order.setSubClassItem(data);
                        //5.更新底部购物车
                        _self.updateUI();
                    }
                }

                //减
                if($(e.target).hasClass('sub') || $(e.target).parent().hasClass('sub')){
                    if(num > min){
                        num = num - 1;
                    }else{
                        num = min;
                    }
                    //1.更新UI
                    $text.val(num);
                    //2.给数据初始化
                    data.num = num;//长宽高、灯头数的数值属性
                    data.productNum = 1;//（已经固定了长宽高或者灯头数的）整体产品数量
                    //3.将数据更新入缓存 : 如果当前类被标记选中了之后
                    if($this.hasClass('active')){
                        utilOrder.order.setSubClassItem(data);
                        //4.更新底部购物车
                        _self.updateUI();
                    }
                }

                //加
                if($(e.target).hasClass('add') || $(e.target).parent().hasClass('add')){
                    if(num < max){
                        num = num + 1;
                    }else{
                        num = max;
                    }
                    //1.更新输入框
                    $text.val(num);
                    //2.给数据初始化
                    data.num = num;
                    data.productNum = 1;
                    //3.将数据更新入缓存 : 如果当前类被标记选中了之后
                    if($this.hasClass('active')){
                        utilOrder.order.setSubClassItem(data);
                        //4.更新底部购物车
                        _self.updateUI();
                    }
                }
            });
        },
        findProductDetailList : function(subCategory,callback){
            var bigClass = utilOrder.order.getBigClassItem() || {};
            var param = {
                bigCategory : bigClass.bigCategory,
                subCategory : subCategory
            };
            jea.post(config.url.findProductDetailList,param,callback);
        },
        updateUI : function(){
            var obj = utilOrder.order.countSumItemForShopcart();
            $('.badge').text(obj.sumProductNum);
            $('.shopcart-price').text(obj.sumProductPrice);
        }
    };

    return new App();
});
