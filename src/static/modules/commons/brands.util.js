define(['jquery','config'],function ($,config) {

    return {
        brands :{//从品牌列表选择了一个品牌，进入了产品列表
            setBrand : function(brandInfo){
                localStorage.setItem(config.key.brands.select,JSON.stringify(brandInfo));
            },
            getBrand : function(){
                return JSON.parse(localStorage.getItem(config.key.brands.select) || "{}");
            },
            clearBrand : function(){
                localStorage.removeItem(config.key.brands.select);
            }
        },
        product:{//从产品型号列表选择了一个型号
            setProduct : function(brandInfo){
                localStorage.setItem(config.key.brands.select_product,JSON.stringify(brandInfo));
            },
            getProduct : function(){
                return JSON.parse(localStorage.getItem(config.key.brands.select_product) || "{}");
            },
            clearProduct : function(){
                localStorage.removeItem(config.key.brands.select_product);
            }
        },
        origin:{//来源的店铺
            setOrigin : function(origin){
                localStorage.setItem(config.key.brands.origin,JSON.stringify(origin));
            },
            getOrigin : function(){
                return JSON.parse(localStorage.getItem(config.key.brands.origin) || "{}");
            },
            clearOrigin : function(){
                localStorage.removeItem(config.key.brands.origin);
            }
        }
    };
});