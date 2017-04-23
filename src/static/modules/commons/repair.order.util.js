define(['jquery','config'],function ($,config) {
    return {
        order : {
            setOrder : function (order) {
                sessionStorage.setItem(config.key.repair.order,JSON.stringify(order));
            },
            getOrder : function () {
                return JSON.parse(sessionStorage.getItem(config.key.repair.order) || "[]");
            },
            getOrderDetail : function () {
                return JSON.parse(sessionStorage.getItem(config.key.repair.detail) || "[]");
            },
            getBusiness : function () {
                return JSON.parse(sessionStorage.getItem(config.key.repair.business) || "[]");
            },
            clearOrderDetail : function () {
                sessionStorage.removeItem(config.key.repair.detail);
            },
            clearBusiness : function () {
                sessionStorage.removeItem(config.key.repair.business);
            },
            clearOrder : function () {
                sessionStorage.removeItem(config.key.repair.order);
            },
            setOrderParam : function (param) {
                sessionStorage.setItem(config.key.repair.orderParam,JSON.stringify(param));
            },
            getOrderParam : function () {
                var orderParam = sessionStorage.getItem(config.key.repair.orderParam);
                if(orderParam != null){
                    orderParam = JSON.parse(orderParam);
                }
                return orderParam;
            },
            clearOrderParam : function () {
                sessionStorage.removeItem(config.key.repair.orderParam);
            },
            /*---------------------------------------------------------*/
            setCategoryItem : function(item){
                var list = this.getOrder();
                var len = list.length;
                //var RadioOrCheckbox = 0;//0：单选，1：多选
                if(len > 0){
                    var index = -1;
                    for(var i=0;i<len;i++){
                        var d = list[i];
                        d.isSelected = 0;//清除标记
                        if(d.categoryId == item.categoryId){
                            index = i;
                        }
                    }
                    if(index >= 0){
                        var obj = list[index];
                        obj.isSelected = 1;
                    }else{
                        item.isSelected = 1;//代表该品类被标记
                        item.symptom = [];
                        list.push(item);
                    }
                }else{
                    item.isSelected = 1;//代表该品类被标记
                    item.symptom = [];
                    list.push(item);
                }
                sessionStorage.setItem(config.key.repair.order,JSON.stringify(list));
            },
            setCategoryDetail:function(detail){
                sessionStorage.setItem(config.key.repair.detail,JSON.stringify(detail));
            },
            setBusiness:function(business){
                sessionStorage.setItem(config.key.repair.business,JSON.stringify(business));
            },
            getCategoriesDetail:function(){
                var list = this.getOrderDetail();
                return list;
            },
            getCategoryItemById : function(id){
                var list = this.getOrder();
                var len = list.length;
                var o = null;
                if(len > 0){
                    var index = -1;
                    for(var i=0;i<len;i++){
                        var d = list[i];
                        if(d.categoryId == id){
                            index = i;
                        }
                    }
                    if(index >= 0){
                        o = list[index];
                    }
                }
                return o;
            },
            getCategoryItemDefault : function(){
                var list = this.getOrder();
                var len = list.length;
                var o = null;
                if(len > 0){
                    var index = -1;
                    for(var i=0;i<len;i++){
                        var d = list[i];
                        if(d.isSelected == 1){
                            index = i;
                        }
                    }
                    if(index >= 0){
                        o = list[index];
                    }
                }
                return o;
            },
            removeCategoryItemById : function(id){
                var list = this.getOrder();
                var len = list.length;
                if(len > 0){
                    var index = -1;
                    for(var i=0;i<len;i++){
                        var d = list[i];
                        if(d.categoryId == id){
                            index = i;
                            break;
                        }
                    }
                    if(index >= 0){
                        list.splice(index,1);//delete
                    }
                    this.setOrder(list);
                }
            },
            /*---------------------------------------------------------*/
            setSymptomItem : function(item){
                var list = this.getOrder();
                var len = list.length;
                var RadioOrCheckbox = 0;//0：单选，1：多选
                if(len > 0){
                    var index = -1;
                    for(var i=0;i<len;i++){
                        var d = list[i];
                        if(d.categoryId == item.categoryId){
                            index = i;
                            break;
                        }
                    }
                    if(index >= 0){
                        var obj = list[index];
                        var slist = obj.symptom;
                        var slen = slist.length;
                        if(slen > 0){
                            if(RadioOrCheckbox == 1){//多选
                                var sindex = -1;
                                for(i=0;i<slen;i++){
                                    var s = slist[i];
                                    if(s.symptomId == item.symptomId){
                                        sindex = i;
                                        break;
                                    }
                                }
                                if(sindex >= 0){
                                    //nothing to do
                                }else{
                                    slist.push(item);
                                }
                            }else{//单选
                                slist.pop();
                                slist.push(item);
                            }
                        }else{
                            slist.push(item);
                        }
                    }else{
                        console.log('error:未选择产品类型');
                    }

                }
                sessionStorage.setItem(config.key.repair.order,JSON.stringify(list));
            },
            getSymptomItem : function(){

            },
            removeSymptomItem : function(item){
                var list = this.getOrder();
                var len = list.length;
                if(len > 0){
                    var index = -1;
                    for(var i=0;i<len;i++){
                        var d = list[i];
                        if(d.categoryId == item.categoryId){
                            index = i;
                            break;
                        }
                    }
                    if(index >= 0){
                        var obj = list[index];
                        var slist = obj.symptom;
                        var slen = slist.length;
                        if(slen > 0){
                            var sindex = -1;
                            for(i=0;i<slen;i++){
                                var s = slist[i];
                                if(s.symptomId == item.symptomId){
                                    sindex = i;
                                    break;
                                }
                            }
                            if(sindex >=0){
                                slist.splice(index,1);//delete
                            }
                        }
                    }
                }
                sessionStorage.setItem(config.key.repair.order,JSON.stringify(list));
            }
        }
    };
});