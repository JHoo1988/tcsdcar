// 如果来自第三方，记录来源，如A平台，B平台 ...
define(['jquery', 'config'], function($, config) {
    return {
        setDataSource: function(data) {
            sessionStorage.setItem(config.key.dataSource.type, data);
        },
        getDataSource: function() {
            return sessionStorage.getItem(config.key.dataSource.type) || '';
        },
        setDataSourceOpenId: function(data) {
            sessionStorage.setItem(config.key.dataSource.openid, data);
        },
        getDataSourceOpenId: function() {
            return sessionStorage.getItem(config.key.dataSource.openid) || '';
        }
    };
});