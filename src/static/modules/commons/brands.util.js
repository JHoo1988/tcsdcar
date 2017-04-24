define(['jquery','config'],function ($,config) {

    return {
        brands :{
            setBrand : function(brandInfo){
                localStorage.setItem(config.key.brands.select,JSON.stringify(brandInfo));
            },
            getBrand : function(){
                return JSON.parse(localStorage.getItem(config.key.brands.select) || "{}");
            },
            clearBrand : function(){
                localStorage.removeItem(config.key.brands.select);
            }
        }
    };
});