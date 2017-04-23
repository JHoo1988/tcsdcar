define(['jquery','config'],function ($,config) {

    return {
        city :{
            setCity : function(cityInfo){
                localStorage.setItem(config.key.location.city,JSON.stringify(cityInfo));
            },
            getCity : function(){
                return JSON.parse(localStorage.getItem(config.key.location.city) || "{}");
            },
            clearCity : function(){
                localStorage.removeItem(config.key.location.city);
            }
        }
    };
});