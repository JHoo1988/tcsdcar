define(['jquery','config'],function ($,config) {

    return {
        brands :{//从品牌列表选择了一个品牌，进入了产品列表
            setBrand : function(brandInfo){
                sessionStorage.setItem(config.key.brands.select,JSON.stringify(brandInfo));
            },
            getBrand : function(){
                return JSON.parse(sessionStorage.getItem(config.key.brands.select) || "{}");
            },
            clearBrand : function(){
                sessionStorage.removeItem(config.key.brands.select);
            }
        },
        product:{//从产品型号列表选择了一个型号
            setProduct : function(brandInfo){
                sessionStorage.setItem(config.key.brands.select_product,JSON.stringify(brandInfo));
            },
            getProduct : function(){
                return JSON.parse(sessionStorage.getItem(config.key.brands.select_product) || "{}");
            },
            clearProduct : function(){
                sessionStorage.removeItem(config.key.brands.select_product);
            }
        },
        origin:{//来源的店铺
            setOrigin : function(origin){
                // sessionStorage.setItem(config.key.brands.origin,JSON.stringify(origin));
                sessionStorage.setItem(config.key.brands.origin,origin);
            },
            getOrigin : function(){
                // return JSON.parse(sessionStorage.getItem(config.key.brands.origin) || "{}");
                return sessionStorage.getItem(config.key.brands.origin);
            },
            clearOrigin : function(){
                sessionStorage.removeItem(config.key.brands.origin);
            }
        },
        openid:{//userid
            setOpenId : function(openid){
                // sessionStorage.setItem(config.key.brands.origin,JSON.stringify(origin));
                sessionStorage.setItem(config.key.brands.openid,openid);
            },
            getOpenId : function(){
                // return JSON.parse(sessionStorage.getItem(config.key.brands.origin) || "{}");
                return sessionStorage.getItem(config.key.brands.openid);
            },
            clearOpenId : function(){
                sessionStorage.removeItem(config.key.brands.openid);
            }
        }
    };
});