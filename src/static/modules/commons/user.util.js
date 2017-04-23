define(['jquery','config'],function ($,config) {
    var jea = require('jea');

    return {
        user : {
            loadUser : function (openId,callback) {
                var _self = this;
                jea.ajax(config.url.loadUserByOpenId,{
                    wechatOpenId : openId
                },function (result) {
                    if(result.data && result.data.userId > 0){
                        _self.setUser(result.data);
                        callback(true);
                    }else{
                        callback(false);
                    }
                });
            },
            setUser : function (userInfo) {
                sessionStorage.setItem(config.key.user,JSON.stringify(userInfo));
            },
            getUser : function () {
                return JSON.parse(sessionStorage.getItem(config.key.user) || "{}");
            },
            checkUserExist : function () {
                return sessionStorage.getItem(config.key.user) ? true : false;
            },
            clearUser : function () {
                sessionStorage.removeItem(config.key.user);
            },
            setUserItem : function (key,value) {
                var user = this.getUser();
                user[key] = value;
                sessionStorage.setItem(config.key.user,JSON.stringify(user));
            },
            getUserByKey : function (itemKey) {
                var user = this.getUser();
                for(var key in user){
                    if(key == itemKey){
                        return user[key];
                    }
                }
                return 0;
            },
            getUserId : function(){
                return this.getUserByKey('userId');
            },
            getUserName : function(){
                return this.getUserByKey('wechatNickname');
            },
            getOpenId : function(){
                return this.getUserByKey('wechatOpenId');
            },
            getImageUrl : function(){
                return this.getUserByKey('wechatImageurl');
            },
            setTestUserIndex : function(index){
                localStorage.setItem(config.key.testUserIndex,index);
            },
            getTestUserIndex : function(){
                var index = localStorage.getItem(config.key.testUserIndex);
                if(index == null){
                    index =  null;
                }else{
                    index =  JSON.parse(index);
                }
                return index;
            },
            setEMTPayOpenId : function (openId) {
                sessionStorage.setItem(config.key.route.emtPayUserOpenId,openId);
            },
            getEMTPayOpenId : function () {
                return sessionStorage.getItem(config.key.route.emtPayUserOpenId);
            },
            clearEMTPayOpenId : function () {
                sessionStorage.removeItem(config.key.route.emtPayUserOpenId);
            }

        }
    };
});