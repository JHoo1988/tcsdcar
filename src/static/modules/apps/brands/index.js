/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'weui', 'ejs'], function ($, jea, config, fastclick) {
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
                    utilPage.ready();
                    _self.renderPage();
                    _self.bind();
                    fastclick.attach(document.body);
                }else{
                    _self.getWechatUserOpenId(function () {
                        utilPage.ready();
                        _self.renderPage();
                        _self.bind();
                        fastclick.attach(document.body);
                    });
                }

            }else{
                // 手机浏览器里面打开
                utilPage.ready();
                _self.renderPage();
                _self.bind();
                fastclick.attach(document.body);
            }
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var _self = this;
            this.getAddressList(function (addressList) {
                var pageData = {};
                pageData.data = addressList;
                var html = new EJS({ url: 'views/brands/index.ejs' }).render(pageData);
                $('body').prepend(html);
                _self.hideLoadin();
            });
        },

        /**
         * 获取来源（）
         * @returns {*}
         */
        getOrigin: function () {
            var origin = utilCommon.getParam('origin');
            if (!origin||origin === '' || origin === null) {
                origin = 'D838D8F0AE';//不是经过扫描店铺二维码进入的
            }
            return origin;
        },

        /**
         * @func
         * @desc 获取品牌列表
         */
        getAddressList: function (callback) {
            var url = config.url.findAllProductBrands;
            // var userId = utilUser.user.getUserId();
            jea.get(url, null, function (result) {
                if (result&&result.code=='200' && result.data && typeof callback === 'function') {
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
                window.location.href='products.html';
                // window.location.replace(backUrl);
                // window.history.go(-1);
            });
            // 选中
            $body.on('click', '.weui-grid', function () {
                // $.toastNoIcon('请输入推荐码', 'noicon');
                var $this = $(this);
                var json = $this.data('json');
                self.setUserSelected(json);
                window.location.href='products.html';
                // window.location.replace(backUrl);
                // window.history.go(-1);
            });
            $body.on('click', '.close_chat',function(){
                $('.customerservice').css('display','none');
            });
        },
        setUserSelected: function (data) {
            // var keys = {
            //     "1": "address", // 家电清洗
            //     "3": "install", // 家电安装
            //     "2": "repair", // 家电维修
            //     "4": "phoneRepair",   // 手机维修 - 上门
            //     "5": "phoneRepair"   // 手机维修 - 邮寄
            // };
            // var key = keys[this.origin] || keys['1'];
            utilBrands.brands.setBrand(data);
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