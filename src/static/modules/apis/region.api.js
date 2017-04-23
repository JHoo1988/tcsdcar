/*
 * 针对常用的Region数据，封装接口
 * @ auth Night
 * @ date 2016年3月22日18:50:20
 * */

define(['config','jea','jquery'],function(config,jea,$) {
    return  {
        region : {
            /*
             * 获取省
             * @target 下拉列表
             * @return callback array [ obj { provinceId, provinceName } ]
             * */
            getProvince : function(param,callback){
                if(typeof(param) === 'function'){
                    callback = param;
                    param = {};
                };

                var url = config.url.findAllProvince;
                jea.ajax(url,param,callback);
            },
            /*
             * 依据省ID获取省对象
             * @target 下拉列表
             * @return callback obj { provinceId, provinceName }
             * */
            getProvinceById : function(provinceId,callback){
                var url = config.url.findProvinceByProvinceId;
                jea.ajax(url,{
                    provinceId : provinceId
                },function(data){
                    var result = "";
                    if(data){
                        result = data;
                    };
                    callback(result);
                });
            },
            /*
             * 依据省Name模糊查询省对象
             * @target 下拉列表，如select2
             * @return callback array [ obj { provinceId, provinceName } ]
             * */
            getProvinceLikeName : function(provinceName,callback){
                this.getProvince(function(data){
                    var result = new Array();
                    if(data){
                        $.each(data.data,function(i,d){
                            if(d.provinceName.indexOf(provinceName) != -1){
                                result.push(d);
                            }
                        });
                    };
                    callback(result);
                });
            },
            /*
             * 依据省ID获取市对象
             * @target 下拉列表
             * @return callback array [ obj { cityId, cityName } ]
             * */
            getCityByProvinceId : function(param,callback,errMsgOrCallBack){
                var url = config.url.findCityByProvinceId;
                jea.ajax(url,param,callback,errMsgOrCallBack);
            },
            /*
             * 依据市ID获取市对象
             * @target 下拉列表
             * @return callback obj { cityId, cityName }
             * */
            getCityById : function(cityId,callback){
                var url = config.url.findCityByCityId;
                jea.ajax(url,{
                    cityId : cityId
                },function(data){
                    var result = "";
                    if(data){
                        result = data;
                    };
                    callback(result);
                });
            },
            /*
             * 依据市Name模糊查询市对象
             * @target 下拉列表，如select2
             * @return callback array [ obj { cityId, cityName } ]
             * */
            getCityLikeName : function(provinceId,cityName,callback){
                this.getCityByProvinceId(provinceId,function(data){
                    var result = new Array();
                    if(data){
                        $.each(data.data,function(i,d){
                            if(d.cityName.indexOf(cityName) != -1){
                                result.push(d);
                            }
                        });
                    };
                    callback(result);
                });
            },
            /*
             * 获取地区
             * @target 下拉列表
             * @return callback array [ obj { areaId, areaName } ]
             * */
            getAreaByCityId : function(param,callback){
                var url = config.url.findAreaByCityId;
                jea.ajax(url,param,callback);
            },
            /*
             * 依据地区ID获取地区对象
             * @target 下拉列表
             * @return callback obj { areaId, areaName }
             * */
            getAreaById : function(areaId,callback){
                var url = config.url.findAreaByAreaId;
                jea.ajax(url,{
                    areaId : areaId
                },function(data){
                    var result = "";
                    if(data){
                        result = data;
                    };
                    callback(result);
                });
            },
            /*
             * 依据地区Name模糊查询地区对象
             * @target 下拉列表，如select2
             * @return callback array [ obj { areaId, areaName } ]
             * */
            getAreaLikeName : function(cityId,areaName,callback){
                this.getArea(cityId,function(data){
                    var result = new Array();
                    if(data){
                        $.each(data.data,function(i,d){
                            if(d.areaName.indexOf(areaName) != -1){
                                result.push(d);
                            }
                        });
                    };
                    callback(result);
                });
            },
            /*
             * 获取街道
             * @target 下拉列表
             * @return callback array [ obj { areaId, areaName } ]
             * */
            getStreetByAreaId : function(param,callback){
                var url = config.url.findStreetByAreaId;
                jea.ajax(url,param,callback);
            },
            /*
             * 获取圈子
             * @target 下拉列表
             * @return callback array [ obj { circleId, circleName } ]
             * */
            getCircle : function(areaId,callback){
                var url = config.url.findCircleByAreaId;
                jea.ajax(url,{
                    areaId : areaId
                },callback);
            },
            /*
             * 依据圈子ID获取圈子对象
             * @target 下拉列表
             * @return callback obj { circleId, circleName }
             * */
            getCircleById : function(circleId,callback){
                var url = config.url.findCircleByCircleId;
                jea.ajax(url,{
                    circleId : circleId
                },function(data){
                    var result = "";
                    if(data){
                        result = data;
                    };
                    callback(result);
                });
            },
            /*
             * 依据圈子Name模糊查询圈子对象
             * @target 下拉列表，如select2
             * @return callback array [ obj { circleId, circleName } ]
             * */
            getCircleLikeName : function(areaId,circleName,callback){
                this.getCircle(areaId,function(data){
                    var result = new Array();
                    if(data){
                        $.each(data.data,function(i,d){
                            if(d.circleName.indexOf(circleName) != -1){
                                result.push(d);
                            }
                        });
                    };
                    callback(result);
                });
            }

        }
    }
});