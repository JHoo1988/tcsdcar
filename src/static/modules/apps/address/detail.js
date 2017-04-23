/**
 * Created by 焦红 on 2017/4/13.
 * tel:18971057583
 */
define(['jquery', 'jea', 'config', 'fastclick','jec', 'weui', 'ejs'], function ($, jea, config, fastclick,jec) {
    'use strict';
    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilUser = require('util_user');
    var utilAddress = require('util_address');

    var utilCity = require('util_location_city');
    var apiRegion = require('api_region');
    var App = function () {

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
        renderPage: function (callback) {
            var _self = this;

            var data = utilAddress.address.gerUserSelected();
            // var html = new EJS({ url: '../views/address/tmpl-me-address-detail.ejs' }).render(data || {});
            var html = new EJS({ url: '../views/address/detail.ejs' }).render(data || {});
            $('body').prepend(html);
            utilCommon.clearCode('btn-address-code');

            //编辑的时候，如果手机号不更改，则不验证手机号
            if (data.edit) {
                $("#frm-address-detail input[name='code']").attr('data-skip', 1).parent().parent().hide();
            } else {
                var cityInfo = utilCity.city.getCity();
                if (cityInfo.cityId) {
                    data.cityId = cityInfo.cityId;
                    data.provinceId = cityInfo.provinceId;
                }
            }

            _self
                .save()
                .region(data);
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            // 手机输入框输入监听
            $("#frm-address-detail input[name='contactMobile']").keyup(function () {
                if (this.value != $(this).data('value')) {
                    $("#frm-address-detail input[name='code']").attr('data-skip', 0).parent().parent().show();
                } else {
                    $("#frm-address-detail input[name='code']").attr('data-skip', 1).parent().parent().hide();
                }
            });
            //移除非法字符串
            $("#frm-address-detail input[type='text']," + "#frm-address-detail textarea").on("blur", function () {
                var str = utilCommon.checkUtf8Str($(this).val());
                if (str.length > $(this).attr('maxlength')) {
                    return;
                }
                $(this).val(str);
            });
            //获取验证码
            $("#btn-address-code").click(function () {
                if (!$(this).hasClass('weui_btn_disabled')) {
                    var contactMobile = $('#frm-address-detail input[name="contactMobile"]').val();
                    utilCommon.getCode('btn-address-code', contactMobile);
                }
            });
        },
        save: function () {
            var _self = this;
            $("#btn-address-detail-save").click(function () {
                if (!$('#frm-address-detail').validator()) {
                    return false;
                }

                var param = $('#frm-address-detail').getFormData();
                param.userId = utilUser.user.getUserId();
                param.provinceId = param.provinceId.split(',')[0];
                param.cityId = param.cityId.split(',')[0];
                param.areaId = param.areaId.split(',')[0];
                param.streetId = param.streetId.split(',')[0];

                var url = config.url.saveUserAddress,
                    addressId = param.addressId;
                if (addressId) {
                    url = config.url.updateUserAddress;
                }

                //console.log('param');console.log(param);
                //return false;
                jea.ajax(url, param, function (result) {
                    if (result && result.flag=='success') {
                        window.history.go(-1);
                    }
                });
            });
            return this;
        },
        region: function (init) {
            var _self = this;
            init = init ? init : {};

            var param = {};
            if (_self.origin() == 1) {
                param.regionType = 1;
            } else if (_self.origin() == 2) {
                param.regionServiceInstallType = 1;
            } else if (_self.origin() == 7) {
                param.recoveryHouseholdSupport = 1;
            }
            ;

            var streetEle = $("#frm-address-detail select[name='streetId']"),
                streetEleWrap = streetEle.parents('.sf-cell');

            // $.showLoading();
            apiRegion.region.getProvince(param, function (result) {
                if (result) {
                    var content = "";
                    $.each(result.data, function (i, d) {
                        if (d.provinceId == init.provinceId) {
                            d.sort = 1000;
                        } else if (d.sort == '') {
                            d.sort = 1;
                        }
                    });
                    result.data.sort(function (a, b) {
                        if (a.sort > b.sort) {
                            return -1;
                        } else if (a.sort == b.sort) {
                            return 0;
                        } else {
                            return 1;
                        }
                    });
                    $.each(result.data, function (i, d) {
                        content += "<option " + (init.provinceId == d.provinceId ? "selected='true'" : "" ) + " value='" + d.provinceId + ',' + d.provinceName + "'>" + d.provinceName + "</option>";
                    });
                    $("#frm-address-detail select[name='provinceId']").append(content);

                    if (init.provinceId) {
                        getCityByProvinceId(init.provinceId);
                    }
                    ;

                    $("#frm-address-detail select[name='provinceId']").unbind('change').bind('change', function () {
                        getCityByProvinceId(this.value.split(',')[0]);
                        init.cityId = 0;
                        $("#frm-address-detail select[name='areaId']").html("<option value='0'>=选择区=</option>");

                    });

                    $.hideLoading();
                }
            });

            var getCityByProvinceId = function (provinceId) {
                if (!provinceId) {
                    return;
                }
                ;

                var param = {
                    provinceId: provinceId
                };
                if (_self.origin() == 1) {
                    param.regionType = 1;
                } else if (_self.origin() == 2) {
                    param.regionServiceInstallType = 1;
                } else if (_self.origin() == 7) {
                    param.recoveryHouseholdSupport = 1;
                }
                ;

                apiRegion.region.getCityByProvinceId(param, function (result) {
                    if (result) {
                        var content = "<option value='0'>=选择市=</option>";
                        $.each(result.data, function (i, d) {
                            if (d.cityId == init.cityId) {
                                d.sort = 1000;
                            } else if (d.sort == '') {
                                d.sort = 1;
                            }
                        });
                        result.data.sort(function (a, b) {
                            if (a.sort > b.sort) {
                                return -1;
                            } else if (a.sort == b.sort) {
                                return 0;
                            } else {
                                return 1;
                            }
                        });
                        $.each(result.data, function (i, d) {
                            content += "<option " + (init.cityId == d.cityId ? "selected='true'" : "" ) + " value='" + d.cityId + ',' + d.cityName + "'>" + d.cityName + "</option>";
                        });
                        $("#frm-address-detail select[name='cityId']").html(content);

                        if (init.cityId) {
                            getAreaByCityId(init.cityId);
                        }
                        ;

                        $("#frm-address-detail select[name='cityId']").unbind('change').bind('change', function () {
                            getAreaByCityId(this.value.split(',')[0]);
                            streetEleWrap.hide();
                            streetEle.removeClass('ha-valid');
                            $("#frm-address-detail select[name='streetId']").val(0);
                        });
                    }
                });
            };

            var getAreaByCityId = function (cityId) {
                if (!cityId) {
                    return;
                }
                ;

                var param = {
                    cityId: cityId
                };
                if (_self.origin() == 1) {
                    param.regionType = 1;
                } else if (_self.origin() == 2) {
                    param.regionServiceInstallType = 1;
                } else if (_self.origin() == 7) {
                    param.recoveryHouseholdSupport = 1;
                }
                ;

                apiRegion.region.getAreaByCityId(param, function (result) {
                    if (result) {
                        var areaEle = $("#frm-address-detail select[name='areaId']"),
                            content = "<option value='0'>=选择区=</option>";
                        $.each(result.data, function (i, d) {
                            content += "<option " + (init.areaId == d.areaId ? "selected='true'" : "" ) + " value='" + d.areaId + ',' + d.areaName + "' data-hasFourLevel=" + d.hasFourLevel + ">" + d.areaName + "</option>";
                        });

                        areaEle.html(content);

                        if (init.areaId) {
                            if (areaEle.find('option:selected').attr('data-hasfourlevel') == 1) {
                                getStreetByAreaId(init.areaId);
                                streetEleWrap.show();
                            }
                        }

                        areaEle.unbind('change').bind('change', function () {
                            if ($(this).find('option:selected').attr('data-hasfourlevel') == 1) {
                                getStreetByAreaId(this.value.split(',')[0]);
                                streetEleWrap.show();
                                streetEle.addClass('ha-valid');
                            } else {
                                streetEleWrap.hide();
                                streetEle.removeClass('ha-valid');
                            }
                            $("#frm-address-detail select[name='streetId']").val(0);
                        });
                    }
                });
            };

            var getStreetByAreaId = function (areaId) {
                if (!areaId) {
                    return;
                }
                ;

                var param = {
                    areaId: areaId
                };
                if (_self.origin() == 1) {
                    param.regionType = 1;
                } else if (_self.origin() == 2) {
                    param.regionServiceInstallType = 1;
                } else if (_self.origin() == 7) {
                    param.recoveryHouseholdSupport = 1;
                }
                ;

                apiRegion.region.getStreetByAreaId(param, function (result) {
                    if (result) {
                        var content = "<option value='0'>=所在街区=</option>";
                        $.each(result.data, function (i, d) {
                            content += "<option " + (init.streetId == d.streetId ? "selected='true'" : "" ) + " value='" + d.streetId + ',' + d.streetName + "'>" + d.streetName + "</option>";
                        });
                        $("#frm-address-detail select[name='streetId']").html(content);
                    }
                });
            };

            return this;
        },
        origin: function () {
            var origin = -1;
            if ($("#wash-order-address").length > 0) {
                origin = 1;
            }

            if ($("#repair-order-address").length > 0) {
                origin = 2;
            }

            if ($('#recycle-order-address').length > 0) {
                origin = 4;
            }
            if ($('#phone-repair-order-address').length > 0) {
                origin = 5;
            }
            if ($('#household-order-address').length > 0) {
                origin = 6;
            }
            if ($('#recycle-guomei-order-address').length > 0) {
                origin = 7;
            }
            if ($('#smarthome-order-address').length > 0) {
                origin = 8;
            }

            if ($('#screen-insurance-order-address').length > 0) {
                origin = 9;
            }

            return origin;
        }
    };

    return new App();
});