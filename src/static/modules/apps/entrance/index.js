/**
 * Created by 焦红 on 2017/5/29.
 * tel:18971057583
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'rsvp', 'weui', 'ejs'], function ($, jea, config, fastclick, layer, Q) {
    'use strict';

    var utilPage = require('util_page');
    var utilCommon = require('util_common');
    var utilBrands = require('util_brands');

    var App = function () {
        this.origin = this.getOrigin();
        utilBrands.origin.setOrigin(this.origin);//保存店铺编码
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            var _self = this;

            if (this.isWeChat()) {
                // 微信浏览器里面打开
                var openid = utilBrands.openid.getOpenId();
                if(openid){
                    _self.reparentOk();
                }else{
                    _self.getWechatUserOpenId(function () {
                        _self.reparentOk();
                    });
                }

            }else{
                // 手机浏览器里面打开
                _self.reparentOk();
            }
        },
        reparentOk:function () {
            var _self = this;
            utilPage.ready();
            fastclick.attach(document.body);
            Q.all([_self.getCbrands(), _self.getQCMBrands()])
                .then(function (datas) {
                    _self.renderPage(datas[0], datas[1]);
                    _self.bind();
                })
                .finally(function () {

                });
        },
        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function (data1, data2) {
            var html = new EJS({ url: 'views/entrance/index.ejs' }).render({
                data1: data1,
                data2: data2
            });
            $('body').prepend(html);
        },
        //获取汽车品牌列表
        getCbrands: function () {
            var _self = this;
            return new Q.Promise(function (resolve, reject) {
                _self.getCarBrandsList(function (result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("getCarBrandsList failed");
                    }
                })

            });
        },
        //获取汽车品牌列表
        getCarBrandsList: function (callback) {
            var url = config.url.findAllProductBrands;
            // var userId = utilUser.user.getUserId();
            jea.get(url, null, function (result) {
                if (result && result.code == '200' && result.data && typeof callback === 'function') {
                    callback(result)
                }
            });
        },
        //获取汽车膜品牌列表
        getQCMBrands: function () {
            var _self = this;
            return new Q.Promise(function (resolve, reject) {
                _self.getQCMBrandsList(function (result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject("getQCMBrandsList failed");
                    }
                })

            });
        },
        //获取汽车膜品牌列表
        getQCMBrandsList: function (callback) {
            var url = config.url.findAllProductBrandsCategory;
            var param = {};
            param.pageIndex=1;
            param.pageSize=999;
            param.level='2';
            // param.parent='c67e4492823049cface10b9ae8c11524';//这个要改成数据库中对应的id
            jea.get(url, param, function (result) {
                if (result && result.code == '200' && result.data && typeof callback === 'function') {
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
            $body.on('click', '.list-item', function () {
                // $.toastNoIcon('请输入推荐码', 'noicon');
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href='glassRiskProduct.html';
                // window.location.replace(backUrl);
                // window.history.go(-1);
            });
            // 选中
            $body.on('click', '.weui-grid', function () {
                // $.toastNoIcon('请输入推荐码', 'noicon');
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href='glassRiskProduct.html';
                // window.location.replace(backUrl);
                // window.history.go(-1);
            });
        },
        setUserSelected: function (data) {
            utilBrands.brands.setBrand(data);
        },
        /**
         * 获取来源（）
         * @returns {*}
         */
        getOrigin: function () {
            var origin = utilCommon.getParam('origin');
            if (!origin||origin === '' || origin === null) {
                origin = config.url.defaltShopCode;//不是经过扫描店铺二维码进入的
            }
            return origin;
        },
        // 判断是否在微信中打开的
        isWeChat: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        //emoji表情转换为字符
        emoji2Str: function (str) {
            return unescape(escape(str).replace(/\%uD(.{3})/g, '*'));
        },
        //获取微信用户openid
        getWechatUserOpenId: function (callback) {
            //仅获取公众号的openId
            var self = this;
            var code = this.getParam('code');
            var authUrl;
            var url;
            if (code) {
                $.ajax({
                    url: config.url.getWeiXinOpenIdByCode + code,
                    type: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        self.hideLoadin();
                        if (undefined != data && null != data && data.code == 200) {
                            utilBrands.openid.setOpenId(data.data);
                            callback();
                        } else {
                            layer.msg('openid获取失败', { time: 1200 });
                        }
                    }
                    // ,error: function (xhr) {
                    //             // 获取openId失败则重进一次页面
                    //             url = tablevue.getClearCodeUrl();
                    //             authUrl = tablevue.handleUrlToWxOauth(url, 'base');
                    //             window.location.href = authUrl;
                    //             return false;
                    // }
                });
            } else {
                url = self.getClearCodeUrl();
                authUrl = self.handleUrlToWxOauth(url, 'base');
                window.location.href = authUrl;
            }
        },
        handleUrlToWxOauth: function (url, type) {
            var url = encodeURIComponent(url);
            var wxOauth2 = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=1#wechat_redirect";
            wxOauth2 = wxOauth2.replace("APPID", "wx6d8daf3b1d3821cc");
            wxOauth2 = wxOauth2.replace("REDIRECT_URI", url);
            if (type == null || type == 'base') {
                //默认静默授权
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
            } else if (type == 'userinfo') {
                //弹出授权页面
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_userinfo");
            } else {
                wxOauth2 = wxOauth2.replace("SCOPE", "snsapi_base");
            }
            return wxOauth2;
        },
        getParam: function (param) {
            var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getClearCodeUrl: function () {
            var url = window.location.href;
            var code = this.getParam('code');
            if (code) {
                url = url.replace('code=' + code, '');
            }
            return url;
        },
        hideLoadin: function () {
            $('#loadingToast').addClass('hide');
        },
        showLoadin: function (content) {
            $('#loadingToast').removeClass('hide');
            if (content) {
                $('.weui_toast_content').text(content);
            }
        }
    };
    return new App();
});