/**
 * 管理url中的参数
 */
define(['jquery', 'config'], function($, config) {
    var utilCommon = require('util_common');
    return {
        setModelType : function(data){
            sessionStorage.setItem(config.key.param.modelType,data);
        },
        clearModelType : function(){
            sessionStorage.removeItem(config.key.param.modelType);
        },
        getModelType : function(){
            return sessionStorage.getItem(config.key.param.modelType);
        },
        /**
         * 获取
         * @returns {string}
         */
        getClearCodeUrl : function(){
            var url = window.location.href;
            var code = utilCommon.getParam('code');
            if(code){
                url = url.replace('code=' + code,'');
            }
            return url;
        },
    };
});