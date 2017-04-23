/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick','layer', 'weui', 'ejs'], function ($, jea, config, fastclick,layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilUser = require('util_user');
    var utilAddress = require('util_address');

    var App = function () {
        this.origin = this.getOrigin();
        this.backUrl = utilCommon.getParam('backurl');
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
            var origin = this.origin;
            var backUrl = this.backUrl;
            this.getAddressList(function (addressList) {
                var pageData = {};

                if (backUrl === '' || backUrl === null || backUrl === 'null' || origin === -1) {
                    backUrl = '../my/index.html';
                }

                pageData.backUrl = backUrl;
                pageData.data = addressList;

                var html = new EJS({ url: '../views/address/index.ejs' }).render(pageData);
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
                origin = -1;
            }

            return origin;
        },

        /**
         * @func
         * @desc 获取地址列表
         */
        getAddressList: function (callback) {
            var url = config.url.findUserAddressByUserId;
            var userId = utilUser.user.getUserId();

            jea.ajax(url, { userId: userId }, function (result) {

                if (result && result.data && typeof callback === 'function') {
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
            $body.on('click', '.address-item', function () {
                var $this = $(this);
                var backUrl = self.backUrl;
                //var dataSourceType = self.dataSourceType;
                if (backUrl !== '' && backUrl !== null) {
                    var json = $this.data('json');
                    var regionType = 0;

                    if (self.origin === '1') { // 家电清洗
                        regionType = json.regionType;
                    }

                    if (self.origin === '2' || self.origin === '3') { // 家电安装、家电维修
                        regionType = json.regionServiceInstallType;
                    }

                    if (self.origin === '4') { // 手机维修
                        regionType = json.regionRepairSupport;
                    }

                    if ((self.origin === '1' || self.origin === '2' || self.origin === '3') && regionType != 1) {
                        $.alert('请完善街道地址信息，选择已开通服务的街道地址！');
                        return false;
                    }

                    if (self.origin === '4' && regionType != 1) { // 手机维修上门
                        $.alert('目前该地区不支持上门维修，敬请期待!');
                        return false;
                    }

                    self.setUserSelected(json);
                    // window.location.replace(backUrl);
                    window.history.go(-1);
                }
            });

            // 删除
            $body.on('click', '.action-del', function () {
                var addressItem = $(this).parents('.address-item');
                // $.confirm('确定删除地址？', function () {
                //     self.deleteAddress(addressItem);
                // });
                layer.open({
                    content: '确定删除地址？',
                    btn: ['确定', '取消'],
                    shadeClose: false,
                    yes: function () {
                        self.deleteAddress(addressItem);
                        layer.closeAll();
                    },
                    no: function () {
                        layer.closeAll();
                    }
                });
                return false;
            });
            // 编辑
            $body.on('click', '.action-edit', function () {
                var addressItem = $(this).parents('.address-item');
                var backUrl = self.backUrl;
                var data = addressItem.data('json');
                var editUrl = 'detail.html?origin=' + self.origin + '&data_source_type=' + self.dataSourceType;

                if (backUrl !== '' && backUrl !== null && backUrl !== 'null') {
                    editUrl += '&addressbackurl=' + encodeURIComponent(backUrl);
                }

                data.edit = true;
                self.setUserSelected(data);

                if (self.origin != -1) {
                    window.location.replace(editUrl);
                } else {
                    window.location.href = editUrl;
                }
                return false;
            });
            //增加地址
            $body.on('click','.js-add-address',function () {
                // var data = utilAddress.address.gerUserSelected();
                var data = {
                    addressId : '',
                    addressDetail : '',
                    contactName : '',
                    contactMobile : '',

                    provinceId : 5,
                    cityId : 55
                };
                var addUrl = 'detail.html';
                if (data != null) {
                    data.edit = false;
                    utilAddress.address.setUserSelected(data);
                }
                window.location.href = addUrl;
            });
        },
        setUserSelected: function (data) {
            var keys = {
                "1": "address", // 家电清洗
                "3": "install", // 家电安装
                "2": "repair", // 家电维修
                "4": "phoneRepair",   // 手机维修 - 上门
                "5": "phoneRepair"   // 手机维修 - 邮寄
            };
            var key = keys[this.origin] || keys['1'];

            utilAddress[key].setUserSelected(data);

        },
        deleteAddress: function (that) {
            var addressId = $(that).data('id');//当前删除对象id

            jea.ajax(config.url.deleteUserAddress, {
                addressId: addressId
            }, function (result) {
                if (result && result.flag=='success') {
                    $(that).fadeOut('fast', function () {
                        utilAddress.clearUserSelected(addressId);
                        $(this).remove();
                    });
                }
            });
            return this;
        }
    };
    return new App();
});