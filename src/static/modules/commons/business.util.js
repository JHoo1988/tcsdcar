define(['jquery','config'],function ($,config) {
    return {
        business : {
            setBusiness : function (business) {
                sessionStorage.setItem(config.key.business,JSON.stringify(business));
            },
            getBusiness : function () {
                return JSON.parse(sessionStorage.getItem(config.key.business) || "{}");
            }
        },
        locate : {
            setLocate : function (locate) {
                sessionStorage.setItem(config.key.locate,JSON.stringify(locate));
            },
            getLocate : function () {
                return JSON.parse(sessionStorage.getItem(config.key.locate) || "{}");
            }
        }
    };
});