/**
 * Created by ryandu on 2017/3/21.
 */
define(['jquery', 'config', 'jea', 'fastclick'], function ($, config, jea, fastclick) {

    var utilCommon = require('util_common');
    var utilDataSource = require('util_data_source');
    var apiWechat = require('api_wechat');
    var utilOAuth2 = require('util_oauth2');

    return {
        /**
         * 获取apiList
         * @param {Array} apiList
         * @returns {Array}
         */
        getApiList: function (apiList) {
            var defaultApiList = [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ];

            return apiList && Array.isArray(apiList) ? defaultApiList.concat(apiList) : apiList;
        },

        /**
         * 微信分享
         * @param {Object} wxOptions
         * @param {Array} wxOptions.apiList 要注入的微信JSAPI
         * @param {Object} wxOptions.share
         * @param {String} wxOptions.share.title  分享标题
         * @param {String} wxOptions.share.link  分享链接
         * @param {String} wxOptions.share.imgUrl  分享图片
         * @param {String} wxOptions.share.desc  分享描述
         */
        wxShare: function (wxOptions) {
            var apiList = wxOptions.apiList || [];
            var shareOpts = wxOptions.share || {};
            var finalApiList = this.getApiList(apiList);

            apiWechat.wxConfig(finalApiList, function (wx) {
                var title = '十分到家';
                var link = 'http://wechat.tclsfdj.com';
                var imgUrl = 'http://wechat.tclsfdj.com/styles/imgs/logo/logo.png';
                var desc = '家电清洗、家电维修、家电安装、手机维修、数码回收、灯具安装、卫浴安装全面服务您的生活。家庭全屋生态' +
                    '系统，有“十分到家”就够了。';

                var shareTimeline = {
                    title: shareOpts.title || title,
                    link: shareOpts.link || link,
                    imgUrl: shareOpts.imgUrl || imgUrl
                };

                var shareOther = $.extend({
                    desc: shareOpts.desc || desc
                }, shareTimeline);

                // 分享到朋友圈
                wx.onMenuShareTimeline(shareTimeline);

                // 分享给朋友
                wx.onMenuShareAppMessage(shareOther);

                // 分享到QQ
                wx.onMenuShareQQ(shareOther);

                // 分享到微博
                wx.onMenuShareWeibo(shareOther);

                // 分享到QZone
                wx.onMenuShareQZone(shareOther);
            })
        },

        /**
         * 更新第三方来源
         */
        updateDataSource: function () {
            var dataSource = utilCommon.getParam('data_source_type');
            if (dataSource && /^\d+$/.test(dataSource)) {
                utilDataSource.setDataSource(dataSource);
            }
        },

        /**
         * 用户授权
         * @param {Boolean} isAuth 是否需要进行微信授权
         */
        oAuth2: function (isAuth) {

            if (typeof isAuth === "undefined") {
                isAuth = true;
            }

            if (!isAuth) {
                return
            }

            utilOAuth2.init();
        },

        statistics: function () {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?5f78e0482e3c66d0137afc296ec779e0";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        },

        /**
         * 页面初始化前准备工作
         * @param {Object} wxOptions 微信jssdk配置
         * @param {Array} wxOptions.apiList
         * @param {Object} wxOptions.share
         * @param {String} wxOptions.share.title
         * @param {String} wxOptions.share.link
         * @param {String} wxOptions.share.imgUrl
         * @param {String} wxOptions.share.desc
         * @param {Boolean} isAuth 是否需要进行微信授权
         */
        ready: function (wxOptions, isAuth) {
            // 更新来源
            this.updateDataSource();

            // 用户授权
            this.oAuth2(isAuth);

            // 微信分享设置
            this.wxShare(typeof wxOptions === 'object' ? wxOptions : {});

            // 修复click事件延迟300毫秒
            fastclick.attach(document.body);

            // 统计
            this.statistics();

        }
    }
});