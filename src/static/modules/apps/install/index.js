/**
 * Created by 焦红 on 2017/3/22.
 * tel:18971057583
 */
define(['jquery', 'fastclick','rsvp','jea', 'weui', 'ejs'], function ($, fastclick,Q,jea) {
    'use strict';
    var utilPage = require('util_page');
    var config = require('config');
    var utilBusiness = require('util_business');
    var utilOrder = require('util_repair_order');
    var App = function () {
        var business = {
            orderName : '家电维修',
            orderType : 3
        };
        utilBusiness.business.setBusiness(business);
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
            var business={};
            _self.business = business;
            _self.business.orderType=3;
            business.categories = [];
            // $.showLoading();
            Q.all([this.getCategories(), this.getAPriceCategories()]).then(function (values) {
                business.categories = values[0];
                business.aPriceCategories = values[1];
                _self.renderPage(business);
                _self.bind();
                // $.hideLoading();
            });
            //清空缓存
            utilOrder.order.clearOrder();
            //清空缓存
            utilOrder.order.clearOrderDetail();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (callback) {
            var html = new EJS({url: '../views/install/index.ejs'}).render({
                data: callback
            });
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
            var orderType = _self.business.orderType;
            //Tab切换
            $('.repair-tab .weui_navbar a').click(function (e) {
                var $this = $(this);
                var target = $this.data('target');
                var referencePriceBtn = $('#btn-reference-price');
                var descBtn = $('#btn-desc');
                var aPriceTipContent = $('.a-price-tip-content');
                if (target === '#home-tab-comb') {
                    referencePriceBtn.hide();
                    descBtn.show();
                    aPriceTipContent.show();
                } else {
                    referencePriceBtn.show();
                    descBtn.hide();
                    aPriceTipContent.hide();
                }
            });
            //确认下单
            $('#btn-repair-order').click(function () {
                var orderData = utilOrder.order.getCategoryItemDefault();
                if (orderData == null) {
                    $.alert('请选择产品类型', '温馨提示');
                    return false;
                } else {
                    var productTypeCode = orderData.productTypeCode;
                    if (orderType == 2 || productTypeCode == 2 || productTypeCode == 3) {
                        var symptom = orderData.symptom;
                        if (symptom.length == 0) {
                            if (productTypeCode == 2) {
                                $.alert('请选择服务类目', '温馨提示');
                            } else {
                                $.alert('请选择故障现象', '温馨提示');
                            }
                            var $f = $('.item-' + orderData.categoryId + ' .symptom-box');
                            if ($f.hasClass('hide')) {
                                $('.item-' + orderData.categoryId + ' .product').trigger('click');
                            }
                            return false;
                        }
                    }
                }
                // 跳转到下单页面
                // home_repair_order.init(_self.business);
                // 传递_self.business到下一个页面；
                utilOrder.order.setBusiness(_self.business);
                window.location.href='order/index.html';
            });
            //点击类别列表项
            $('.product').click(function (e) {
                var productInfo = $(this).parent().data('json');
                var business = _self.business;
                var $row = $(this).parent();
                if ($(e.target).hasClass('product-detail') || $(e.target).parents().hasClass('product-detail')) {
                    /*$.showLoading();
                     _self.getAllArea(function(cityListObj){
                     $.hideLoading();
                     home_repair_install_detail.init({productInfo:productInfo,business:business,cityList:cityListObj});
                     });*/
                    var productTypeCode = typeof productInfo.productTypeCode !== 'undefined' ? productInfo.productTypeCode : '';
                    var productId = typeof productInfo.productId !== 'undefined' ? productInfo.productId : 0;
                    var detailData = {
                        productInfo: productInfo,
                        business: business,
                        productTypeCode: productTypeCode,
                        categoryDetail: {
                            desc: '',
                            list: []
                        }
                    };
                    if (productTypeCode == 2) {
                        _self.getAPriceProductErrorData($row).then(function(data){
                            detailData.categoryDetail.list = data;
                            utilOrder.order.setCategoryDetail(detailData);
                            window.location.href='detail/index.html';
                        })
                    } else if (productTypeCode == 3) {
                        _self.getRepairAccessoriesData(productId).then(function(data){
                            detailData.categoryDetail.desc = data.desc || '';
                            detailData.categoryDetail.list = data.list || [];
                            utilOrder.order.setCategoryDetail(detailData);
                            window.location.href='detail/index.html';
                        });
                    } else {
                        utilOrder.order.setCategoryDetail(detailData);
                        window.location.href='detail/index.html';
                    }
                } else {
                    _self.showOrHideSelectInfo($row);
                }
            });
        },
        showOrHideSelectInfo: function ($row) {
            var _self = this;
            var orderType = _self.business.orderType;
            var $i = $row.find('.icon-check');
            var $arrow = $row.find('.arrow');
            var $f = $row.find('.symptom-box');
            var id = $row.data('id');

            if ($row.hasClass('active')) {
                //1.移除active类
                //$row.removeClass('active');
                ////2.取消勾选样式
                //$i.removeClass('checked');
                ////3.清空用户选择的故障项显示
                //$row.find('.symptom-selected-txt').text('');
                if (orderType == 2) {
                    //4.箭头方向还原成向下
                    $arrow.toggleClass('arrow-up').toggleClass('arrow-down');
                    //5.故障信息选择列表隐藏
                    $f.toggleClass('hide');
                }
                //6.清空用户选择的故障项标记
                //$f.find('.box-body span').removeClass('selected');
                //7.将上门服务费置为0
                //$('.home-repair .price-num').text('￥0');
                //8.清除缓存中产品类型数据
                //utilOrder.order.clearOrder();
            } else {
                /*移除所有标记选项状态*/
                var $rowList = $('.row');
                //1.移除active类：ALL
                $rowList.removeClass('active');
                //2.取消勾选样式：ALL
                $rowList.find('.icon-check').removeClass('checked');
                //3.清空用户选择的故障项显示：ALL
                $rowList.find('.symptom-selected-txt').text('');
                //4.箭头方向还原成向下：ALL
                $rowList.find('.arrow').removeClass('arrow-up').addClass('arrow-down');
                //5.故障信息选择列表隐藏：ALL
                $rowList.find('.symptom-box').addClass('hide');
                //6.清空用户选择的故障项标记：ALL
                $rowList.find('.box-body span').removeClass('selected');
                //8.清除缓存中产品类型数据：ALL
                utilOrder.order.clearOrder();

                /*标记当前项*/
                //1.
                $row.addClass('active');
                //2.
                $i.addClass('checked');
                var data = $row.data('json');
                var productTypeCode = data.productTypeCode;
                if (orderType == 2 && productTypeCode != 3) {//维修
                    //3.拉取对应类别的故障信息,如果拉取过就不再拉取
                    if ($f.find('.box-body span').length == 0) {
                        var productCategoryId = id;
                        _self.setProductErrorItems($row, productCategoryId);
                    }
                    //4.
                    $arrow.removeClass('arrow-down').addClass('arrow-up');
                    //5
                    $f.removeClass('hide');
                }

                // 维修一口价或安装一口价
                if (productTypeCode == 3 || productTypeCode == 2) {
                    if ($f.find('.box-body span').length == 0) {
                        _self.setAPriceProductErrorItems($row);
                    }
                    $arrow.removeClass('arrow-down').addClass('arrow-up');
                    $f.removeClass('hide');
                    $('.home-repair .price-num').text('￥' + 0);
                } else {
                    $('.home-repair .price-num').text('￥' + data.categoryPrice);
                }

                //6.将产品类型数据写入缓存
                utilOrder.order.setCategoryItem(data);
                console.log(utilOrder.order.getOrder());
            }
        },
        setProductErrorItems: function ($row, productCategoryId) {//填充故障信息选项,并绑定点击事件
            var _self = this;
            var param = {
                "categoryId": productCategoryId
            };
            jea.ajax(config.url.findProductCategorySymptomByCategoryId, param, function (result) {
                if (result) {
                    var len = result.data.length;
                    var html_str = '';
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var d = result.data[i];
                            html_str += '<span data-id=' + d.symptomId + ' data-json=' + JSON.stringify(d) + '>' + d.symptomName + '</span>';
                        }
                        //console.log(html_str);
                        $row.find('.box-body').html(html_str);
                        _self.bindClickEventForSpan($row);
                    }

                }
            });
        },
        //绑定选择事件
        bindClickEventForSpan: function ($row) {
            var _self = this;
            $row.find('.box-body span').click(function () {
                var symptomData = $(this).data('json');
                //$row.find('.box-body span').removeClass('selected');
                if ($(this).hasClass('selected')) {
                    //1.将故障信息数据移除缓存
                    utilOrder.order.removeSymptomItem(symptomData);
                    //2.
                    $(this).removeClass('selected');
                    //3.
                    $row.find('.symptom-selected-txt').text('');

                } else {
                    //1.将故障信息数据写入缓存
                    utilOrder.order.setSymptomItem(symptomData);
                    //2.
                    $row.find('.box-body span').removeClass('selected');
                    //3.
                    $(this).addClass('selected');
                    //4.
                    if (symptomData.productTypeCode == 2 || symptomData.productTypeCode == 3) { // 安装商品一口价
                        $row.find('.symptom-selected-txt').text(symptomData.productSymptom);
                        $('.home-repair .price-num').text('￥' + symptomData.productAPrice);
                    } else {
                        $row.find('.symptom-selected-txt').text(symptomData.symptomName);
                    }

                }
            });
        },
        // 获取一口价商品故障数据
        getAPriceProductErrorData: function ($row) {
            var _self = this;
            var data = $row.data('json');
            var productTypeCode = data.productTypeCode;
            var productSmallCategory = data.productSmallCategory;
            var param = {
                "productTypeCode": productTypeCode,
                "productSmallCategory": productSmallCategory
            };
            return new Q.Promise(function (resolve, reject) {
                jea.ajax(config.url.findAllInstallServiceProductCategoryDetail, param, function (result) {
                    if (result) {
                        resolve(result.data);
                    } else {
                        reject("getAPriceProductErrorData Failed");
                    }
                });
            });
        },
        setAPriceProductErrorItems: function ($row) {
            var _self = this;
            this.getAPriceProductErrorData($row).then(function (data) {
                var len = data.length;

                var html_str = '';
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var d = {
                            productId: data[i].productId,
                            productTypeCode: data[i].productTypeCode,
                            productSymptom: data[i].productSymptom,
                            productIndex: data[i].productIndex,
                            productAPrice: data[i].productAPrice
                        };
                        html_str += '<span data-json=' + JSON.stringify(d) + '>' + d.productSymptom + '</span>';
                    }
                    $row.find('.box-body').html(html_str);
                    _self.bindClickEventForSpan($row);
                }
            })
        },
        // 获取维修配件数据
        getRepairAccessoriesData: function (productId) {
            return new Q.Promise(function (resolve, reject) {
                jea.get('data/repair_accessories.json', {}, function (result) {
                    if (result) {
                        resolve(result[productId]);
                    } else {
                        reject("getAPriceProductErrorData Failed");
                    }
                });
            });
        },
        getCategories: function () {//获取产品类别
            return new Q.Promise(function (resolve, reject) {
                var orderType = utilBusiness.business.getBusiness().orderType;//获取订单类型
                var param = {};
                // if (orderType == 2) {
                //     param.categoryService = 1;//支持维修的品类
                // } else {
                    param.categoryInstall = 1;//支持安装的品类
                // }
                jea.ajax(config.url.findAllProductCategoryDefault, param, function (result) {
                    if (result) {
                        resolve(result.data);
                    } else {
                        reject("Fetch Categories Failed");
                    }
                });
            })
        },
        // 获取一口价商品类别
        getAPriceCategories: function () {
            return new Q.Promise(function (resolve, reject) {
                var orderType = utilBusiness.business.getBusiness().orderType;//获取订单类型
                var param = {};
                // if (orderType == 2) {
                //     param.productTypeCode = 3; // 维修安装一口价
                // } else {
                    param.productTypeCode = 2; // 安装一口价
                // }
                jea.ajax(config.url.findAllInstallServiceProductCategory, param, function (result) {
                    if (result) {
                        resolve(result.data);
                    } else {
                        reject("Fetch Categories Failed");
                    }
                });
            });
        },
        autoGotoTheDetailPage : function(){
            var _self = this;
            if(_self.autoIntoModel == 'comb'){//是否是指定了一口价
                var $comb = $('#home-tab-comb');//一口价
                $('a[data-target="#home-tab-comb"]').trigger('click');
                $comb.find('.product-detail[data-name="'+_self.autoIntoDetailPageFlag+'"]').trigger('click');
            }else{
                var $normal = $('#home-tab-normal');//普通价
                $('a[data-target="#home-tab-normal"]').trigger('click');
                $normal.find('.product-detail[data-name="'+_self.autoIntoDetailPageFlag+'"]').trigger('click');
            }
        }
    };

    return new App();
});