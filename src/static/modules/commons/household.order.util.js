define(['jquery', 'config'], function ($, config) {
    return {
        order: {
            setBigClassItem: function (info) {//保存手机品牌信息
                sessionStorage.setItem(config.key.household.bigClass, JSON.stringify(info));
            },
            getBigClassItem: function () {
                return JSON.parse(sessionStorage.getItem(config.key.household.bigClass) || 'null');
            },
            clearBigClassItem: function () {
                sessionStorage.removeItem(config.key.household.bigClass);
            },
            setSubClassItem: function (item) {//保存用户选择的小类选项
                var _self = this;
                var list = _self.getSubClassItem();
                if (list == null) {
                    list = [];
                }
                //var index = -1;
                for (var i = 0, len = list.length; i < len; i++) {
                    var l = list[i];
                    if (item.productId == l.productId) {
                        //index = i;
                        list.splice(i, 1);//delete
                        //i--;
                        break;
                    }
                }
                list.push(item);
                sessionStorage.setItem(config.key.household.subClass, JSON.stringify(list));
            },
            getSubClassItem: function () {
                return JSON.parse(sessionStorage.getItem(config.key.household.subClass) || 'null');
            },
            clearSubClassItem: function () {
                sessionStorage.removeItem(config.key.household.subClass);
            },
            updateSubClassItemNumById: function (id, productNum) {//根据id更新产品数量
                var _self = this;
                var list = _self.getSubClassItem();
                if (list == null) {
                    list = [];
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    var l = list[i];
                    if (id == l.productId) {
                        l.productNum = productNum;
                        break;
                    }
                }
                sessionStorage.setItem(config.key.household.subClass, JSON.stringify(list));
            },
            removeSubClassItemById: function (id) {//根据id移除用户选择的小类项
                var _self = this;
                var list = _self.getSubClassItem();
                if (list == null) {
                    list = [];
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    var l = list[i];
                    if (id == l.productId) {
                        list.splice(i, 1);//delete
                        break;
                    }
                }
                sessionStorage.setItem(config.key.household.subClass, JSON.stringify(list));
            },
            toFixed2: function (price) {
                return parseFloat(price.toString().replace(/(\.\d\d)\d+$/, '$1'));//保留两位小数,直接舍弃第三位小数
            },
            countSumItemForShopcart: function () {
                var _self = this;
                var list = _self.getSubClassItem();
                var sum_product_num = 0,
                    sum_product_price = 0,
                    has_physical_goods = false;//是否存在实体产品
                if (list == null) {
                    list = [];
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    var l = list[i];

                    if (l.productSmallCategory != '其他费用') {
                        has_physical_goods = true;
                    }

                    var product_num = l.productNum || 0;
                    sum_product_num += product_num;

                    //产品计价方式: // 0、按长高计费; // 1、按灯头计费; // 2、按尺寸计费; // 3、按件计费;
                    var product_price = 0;
                    var productConsumerPrice = l.productConsumerPrice * 10;
                    if (l.productPriceType < 3) {
                        product_price = l.num * productConsumerPrice * product_num;
                    } else {
                        product_price = productConsumerPrice * product_num;
                    }
                    sum_product_price += product_price;
                }
                //数据格式控制，保留两位小数，移除第三位小数
                sum_product_price = _self.toFixed2(sum_product_price / 10);

                var o = {
                    sumProductPrice: sum_product_price,
                    sumProductNum: sum_product_num,
                    hasPhysicalGoods: has_physical_goods
                };
                return o;
            },
            setOrderParam: function (param) {
                sessionStorage.setItem(config.key.household.orderParam, JSON.stringify(param));
            },
            getOrderParam: function () {
                return JSON.parse(sessionStorage.getItem(config.key.household.orderParam) || 'null');
            },
            clearOrderParam: function () {
                sessionStorage.removeItem(config.key.household.orderParam);
            },
            setSubclasstmp : function(param){
            	sessionStorage.setItem(config.key.household.subclasstemp,JSON.stringify(param));
            },
            getSubclasstmp : function(){
            	return JSON.parse(sessionStorage.getItem(config.key.household.subclasstemp) || 'null');
            },
            clearSubclasstmp : function(){
            	sessionStorage.removeItem(config.key.household.subclasstemp);
            }
        }
    };
});