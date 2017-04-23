/**
 * Created by ryandu on 2017/3/24.
 */
define(['jquery', 'config', 'jea'], function ($, config, jea) {
    var utilCommon = require('util_common');
    var utilUser = require('util_user');
    var utilParam = require('util_param_url');

    /**
     * 获取用户openId
     * @param oldOpenId
     * @param code
     * @param callback
     */
    function getWechatUserOpenId(oldOpenId, code, callback) {
        // 1.仅获取新公众号的openId
        jea.jsonp(config.url.getWechatUserOpenId, {
            wechatCode: code
        }, function (result) {
            var newOpenId = result.data.openid;
            if (!!newOpenId) {
                // 调起数据迁移方法
                updateUserInfoFromOldOpenIdToNewOpenId(oldOpenId, newOpenId, code, callback);
            }
        });
    }

    /**
     * 更新用户信息（通过旧公众号openId和新公从号的openId来更新用户信息）
     * @param {String} oldOpenId
     * @param {String} newOpenId
     * @param {String} code
     * @param {Function} callback
     */
    function updateUserInfoFromOldOpenIdToNewOpenId(oldOpenId, newOpenId, code, callback) {
        var param = {
            openId: oldOpenId, // 旧公众号openId
            newOpenId: newOpenId // 新公众号openId
        };
        $.ajax({
            url: config.url.updateUserInfoFromOldOpenIdToNewOpenId,
            dataType: 'json',
            data: {
                param: JSON.stringify(param)
            },
            type: 'POST',
            cache: false,
            timeout: 20 * 1000,// 60 秒请求超时
            xhrFields: {withCredentials: true},
            crossDomain: true
        }).done(function (result) {
            if (result.errorCode == 0) { // 成功
                callback({openId: newOpenId});
            } else { // 失败，意味着用户不存在，走正常授权流程
                // buildOrGetWechatUserInfo(code,callback);
                window.location.href = config.url.wechat_base;
            }
        }).fail(function () {
            // 失败则重进一次页面
            // var url = utilParam.getClearCodeUrl();
            // window.location.href = utilCommon.handleUrlToWxOauth(url,'base');
            // return false;
        })
    }


    /**
     * 创建或更新用户信息
     * @param {String} code
     * @param {Function} callback
     */
    function buildOrGetWechatUserInfo(code, callback) {
        // 0.此接口获取openId，并且同时为未在数据库中存在的访客建立用户数据
        jea.jsonp(config.url.getWechatUserInfo, {
            wechatCode: code,
            wechatOrigin: '十分到家'
        }, function (result) {
            var url;
            var openId;

            if (!result.data) {
                // 如果未获取到信息，则重新进入一次。
                url = utilParam.getClearCodeUrl();
                console.log(url);
                window.location.href = utilCommon.handleUrlToWxOauth(url, 'base');
                return false;
            }

            openId = result.data.wechatOpenId;

            if (!openId) {
                // 如果从未授权过公众号，则重新授权一次。
                url = utilParam.getClearCodeUrl();
                console.log(url);
                window.location.href = utilCommon.handleUrlToWxOauth(url, 'userinfo');
                return false;
            }

            callback({openId: openId});
        });
    }

    /**
     * 微信授权
     * @param {Function} callback
     */
    function wxoAuth2(callback) {
        var code;
        var oldOpenId;
        var userId;
        var url;

        // TEST
        if (config.test) {
            var testOpenIdList = config.testOpenIdList;
            var index = utilUser.user.getTestUserIndex();
            var openId = testOpenIdList[0];
            if (index != null) {
                index = index >= testOpenIdList.length ? 0 : index;
                openId = testOpenIdList[index].openid;
            } else {
                index = Math.floor(Math.random() * (testOpenIdList.length));
                openId = testOpenIdList[index].openId;
            }
            utilUser.user.setTestUserIndex(index);

            if (typeof callback === 'function') {
                callback({openId: openId});
            }

            return;
        }

        code = utilCommon.getParam('code');
        userId = utilUser.user.getUserId();

        // 没有传递code，但已经存在用户信息了，直接退出
        if (!code && userId !== '0' && userId !== 0) {
            return;
        }

        // 没有传递code，但也没有用户信息，跳转到授权页面
        if (!code && (userId === '0' || userId === '0')) {
            url = utilParam.getClearCodeUrl();
            window.location.href = utilCommon.handleUrlToWxOauth(url, 'base');
            return;
        }

        // oauth2授权登录
        // 由于要将旧公众号数据迁移到新公众号，需要取当前新用户的openId和旧用户的openId
        oldOpenId = utilCommon.getParam('oldopenid');
        if (!!oldOpenId) {
            // 场景1：URL链接存在老的openId，即意味着是从老公众号跳转过来的。
            // 取新公众号的openId
            getWechatUserOpenId(oldOpenId, code, callback);
        } else {
            // 场景2：不存在旧的openId则走正常流程，即认为是从新公众号进入的
            // 此接口获取openId，并且同时为未在数据库中存在的访客建立用户数据
            buildOrGetWechatUserInfo(code, callback);
        }
    }

    return {
        init: wxoAuth2
    }
});