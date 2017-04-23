define(['jquery', 'config'], function ($, config) {
    'use strict';

    /**
     * @func
     * @desc 获取收货地址
     * @returns {object}
     */
    function GetConsigneeAddress() {

        var address = this.gerUserSelected();

        if (address !== null) {
            address.finalAddress = address.provinceName + address.cityName + address.areaName + address.streetName + address.addressDetail;
        }

        return address;
    }

    return {
        clearUserSelected: function (addressId) {
            var item;
            for (item in this) {
                if (this.hasOwnProperty(item) && item.hasOwnProperty('gerUserSelected') && item.hasOwnProperty('clearUserSelected')) {
                    (function (o) {
                        var data = o.gerUserSelected();
                        if (data && data.hasOwnProperty('addressId') && data.addressId == addressId) {
                            o.clearUserSelected();
                        }
                    }(item));
                }
            }
        },
        address: {
            setUserSelected: function (item) {
                sessionStorage.setItem(config.key.address.selectedAddress, JSON.stringify(item));
            },
            gerUserSelected: function () {
                return JSON.parse(sessionStorage.getItem(config.key.address.selectedAddress) || "null");
            },
            clearUserSelected: function () {
                sessionStorage.removeItem(config.key.address.selectedAddress);
            },
            getConsigneeAddress: function () {
                return GetConsigneeAddress.call(this);
            }
        },
        install: {
            setUserSelected: function (item) {
                sessionStorage.setItem(config.key.install.selectedAddress, JSON.stringify(item));
            },
            gerUserSelected: function () {
                return JSON.parse(sessionStorage.getItem(config.key.install.selectedAddress) || "null");
            },
            clearUserSelected: function () {
                sessionStorage.removeItem(config.key.install.selectedAddress);
            },
            getConsigneeAddress: function () {
                return GetConsigneeAddress.call(this);
            }
        },
        repair: {
            setUserSelected: function (item) {
                sessionStorage.setItem(config.key.repair.selectedAddress, JSON.stringify(item));
            },
            gerUserSelected: function () {
                return JSON.parse(sessionStorage.getItem(config.key.repair.selectedAddress) || "null");
            },
            clearUserSelected: function () {
                sessionStorage.removeItem(config.key.repair.selectedAddress);
            },
            getConsigneeAddress: function () {
                return GetConsigneeAddress.call(this);
            }
        },
        phoneRepair: {
            setUserSelected: function (item) {
                sessionStorage.setItem(config.key.phoneRepair.selectedAddress, JSON.stringify(item));
            },
            gerUserSelected: function () {
                return JSON.parse(sessionStorage.getItem(config.key.phoneRepair.selectedAddress) || "null");
            },
            clearUserSelected: function () {
                sessionStorage.removeItem(config.key.phoneRepair.selectedAddress);
            },
            getConsigneeAddress: function () {
                return GetConsigneeAddress.call(this);
            }
        }
    };
});