/**
 * Created by 焦红 on 2017/3/22.
 * tel:18971057583
 */
define(['jquery', 'fastclick','rsvp','jea', 'weui','layer', 'ejs','calendar'], function ($, fastclick,Q,jea,weui,layer,ejs) {
    'use strict';
    var utilPage = require('util_page');
    var utilOrder = require('util_repair_order');
    var utilVip = require("util_vip");
    var utilAddress = require('util_address');
    var config = require('config');
    var utilCommon = require('util_common');
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
            var data = utilOrder.order.getCategoryItemDefault();
            if(!data){
                data = utilOrder.order.getOrder()[0].productInfo;
            }
            var vipDiscountInfo = utilVip.order.getVipDiscountInfo();
            if (vipDiscountInfo){
                // if(business.orderType == 2){//维修
                    vipDiscountInfo = vipDiscountInfo.repair;
                // }else if(business.orderType == 3){//安装
                //     vipDiscountInfo = vipDiscountInfo.install;
                // }
                _self.vipDiscountInfo = vipDiscountInfo;
            }
            _self.renderPage(data,vipDiscountInfo);
            _self.bind();
            // utilOrder.order.clearBusiness();
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (data,vipDiscountInfo) {
            var html = new EJS({url: '../../views/repair/order/index.ejs'}).render({
                data : data,
                vipDiscountInfo : vipDiscountInfo,
                address: this.getConsigneeAddress()
            });
            $('body').prepend(html);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
            var $body = $('body');
            // 选择地址
            $('.select_address').click(function () {
                var url='../../address/index.html?origin=2&backurl=' + window.location.href;
                window.location.href = url;
            });
            // 选择日期
            $body.on('click', '.js-cell-time', function () {
                $body.off('click', '.js-cell-time');
                _self.showCalendar();
            });
        },
        /**
         * @func
         * @desc 获取收货地址
         * @returns {object}
         */
        getConsigneeAddress: function () {
            var address = utilAddress.repair.gerUserSelected();

            if (address !== null) {
                address.finalAddress = address.provinceName + address.cityName + address.areaName + address.streetName + address.addressDetail;
            }
            return address;
        },
        /**
         * @func
         * @desc 跳转提示
         */
        jumpTip: function () {
            var self = this;
            layer.open({
                content: '还没有选择商品',
                btn: ['去选购', '回首页'],
                shadeClose: false,
                yes: function () {
                    window.location.href = 'index.html?data_source_type=' + self.dataSourceType;
                },
                no: function () {
                    window.location.href = '../index.html?data_source_type=' + self.dataSourceType;
                }
            });
        },
        /**
         * @func
         * @desc 显示日历
         */
        showCalendar: function () {
            var products = utilOrder.order.getOrder();
            // 验证商品
            if (products.length < 1) {
                //$.alert('请选择服务');
                this.jumpTip();
                return false;
            }

            // 验证是否已经选择地址
            var address = utilAddress.repair.gerUserSelected();
            if (address === null) {
                $.alert('请选择服务地址');
                return false;
            }

            var $dataInput = $('#repair-order-date');
            var $appointedTime = $('input[name=appointedTime]');
            var $appointedDesc = $('input[name=appointedDesc]');
            var tomorrow = utilCommon.getTomorrow();
            var today = utilCommon.getToday();
            var minDate = new Date().getHours() < 12 ? today : tomorrow;
            var nextYearToday = utilCommon.getNextYearToday();

            $dataInput.dzzcalendar({
                toolbarTemplate: '',
                closeOnSelect: false,
                static: true,
                value: [minDate],  // 默认日期
                time: [
                    '上午',
                    '下午'
                ],
                today: today,
                minDate: minDate,
                maxDate: nextYearToday,
                //dateList: [],
                //dateTimeWPromoting: {},
                cssClass: 'dzz-calendar',
                timeItemClass: 'dzz-calendar-day-time-w50',
                emptyDayTimeMsg: '请选择一个时间段',
                onChange: function (p) {
                    $appointedTime.val(p.value || "");
                    $appointedDesc.val(p.time || "");
                },
                onOpen: function () {
                    $(document).on('touchmove', function (e) {
                        e.preventDefault();
                    });
                },
                onClose: function () {
                    $(document).off('touchmove');
                }
            });
            $dataInput.trigger("click");
        }
    };

    return new App();
});
