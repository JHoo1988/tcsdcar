define(['jquery', 'ejs', 'rsvp', 'fastclick'], function ($, ejs, Q, fastclick) {
    'use strict';
    var utilPage = require('util_page');
    var config = require('config');
    var jea = require('jea');
    var utilOrder = require('util_repair_order');
    var layer = require('layer');
    var App = function () {
    };

    App.prototype = {
        init: function () {
            var _self = this;
            utilPage.ready();
            fastclick.attach(document.body);
            var data = utilOrder.order.getCategoriesDetail();
            _self.data = data;
            _self.renderPage(data);
            _self.bind();
            // _self.getRepairAccessoriesData();
        },
        bind: function () {
            var _self = this;
            var $body = $('body');
            //立即下单
            $("#btn-to-back").click(function () {
                _self.showFaultList();
                // window.history.go(-1);
            });
            //服务范围：更多
            $('.btn-show-more').click(function () {
                $(this).addClass('hide');
                var $p = $(this).parent();
                var data = $p.data('json');
                $p.find('.area-txt').html(data.join(' '));
            });
            $body.on('click', '.js-fault-item', function () {
                _self.selectFault($(this));
            });
        },
        /**
         * @func
         * @desc 选择故障
         * @param  {object} fault - 故障元素
         */
        selectFault: function (fault) {
            var _self = this;
            var faultData = fault.data('json');
            var productData = _self.data;
            productData.productInfo=faultData,
            fault.addClass('selected').siblings().removeClass('selected');
            $.extend(productData, {
                symptomId: faultData.symptomId,
                symptomName: faultData.symptomName
            });
            utilOrder.order.setOrder([productData]);
        },
        /**
         * @func
         * @desc 显示故障列表
         */
        showFaultList: function () {
            var _self = this;
            this.getFaultList(function (data) {
                if (data) {
                    var html = '<div class="repair-fault-list js-repair-fault-list"><h4 class="title">故障现象(单选)</h4>';
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var itemName = item.productSymptom;
                        if (!itemName){
                            itemName = item.symptomName;
                            item.categoryName =_self.data.productInfo.categoryInfo;
                            item.categoryPrice = _self.data.productInfo.categoryPrice;
                        }
                        html = html + "<span data-json='"+JSON.stringify(item)+"' class='js-fault-item'>"+itemName+"</span>";
                    }
                    html = html+'</div>';
                    // var $row = $('.repair-fault-list');
                    // $row.html(html);
                    layer.open({
                        type: 1,
                        content: html,
                        anim: 'up',
                        btn: ['确定', '取消'],
                        skin: 'sf-footer',
                        yes: function () {
                            if ($('.js-repair-fault-list .selected').length) {
                                window.location.href = '../order/index.html';
                            } else {
                                layer.open({
                                    content: '请选择故障现象',btn:'确定'
                                });
                            }
                        }
                    });
                }
            });

        },
        /**
         * @func
         * @desc 获取故障列表数据
         * @param {function} callback 回调函数
         */
        getFaultList: function (callback) {
            var _self = this;
            if(_self.data.productTypeCode){
                var param = {
                    "productTypeCode":_self.data.productInfo.productTypeCode,
                    "productSmallCategory":_self.data.productInfo.productSmallCategory,
                };
                // $.showLoading();
                jea.ajax(config.url.findAllInstallServiceProductCategoryDetail, param, function (result) {
                    // $.hideLoading();
                    if (result && result.data.length) {
                        callback(result.data);
                    }
                });
            }else{
                var param = {
                    "categoryId":_self.data.productInfo.categoryId
                };
                // $.showLoading();
                jea.ajax(config.url.findProductCategorySymptomByCategoryId, param, function (result) {
                    // $.hideLoading();
                    if (result && result.data.length) {
                        callback(result.data);
                    }
                });
            }
        },
        // 获取维修配件数据
        getRepairAccessoriesData: function () {
            var _self = this;
            return new Q.Promise(function (resolve, reject) {
                jea.get('../data/repair_accessories.json', {}, function (result) {
                    if (result) {
                        var hash = location.hash+'';
                        var id = hash.substring(1);
                        if(id){
                            var data = result[id];
                            var productInfo = utilOrder.order.getCategoryItemById(id);
                            data.productInfo = productInfo;
                            if(data){
                                _self.renderPage(data);
                            } else {
                                reject("getAPriceProductErrorData Failed");
                            }
                        } else {
                            reject("getAPriceProductErrorData Failed");
                        }
                    } else {
                        reject("getAPriceProductErrorData Failed");
                    }
                });
            });
        },
        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (callback) {
            var html = new EJS({url: '../../views/repair/detail/index.ejs'}).render({
                data: callback
            });
            $('body').prepend(html);
        }
    };

    return new App();

});