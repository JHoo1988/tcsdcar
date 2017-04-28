/*******************************************************
 * Desc   :  配置类
 * Author :  Night <sbmer@qq.com>
 * Date   :  2016年3月18日14:28:46
 *******************************************************/
;
(function (global, factory) {
    if (typeof define === 'function' && define.amd) { // amd
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') { // commonjs
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        if (!('SFDJ' in global) || typeof global.SFDJ !== 'object') {
            global.SFDJ = {};
        }
        global.SFDJ.config = mod.exports;
    }
})(this, function (exports, module) {
    "use strict";

    var isDebug = false,
        testApiUrl = 'http://localhost:8088/', // 测试后台地址
        // testApiUrl = 'http://base.5ujd.net:88/ha-wechat/v1/', // 测试后台地址
        //testApiUrl = 'http://120.76.101.218:89/ha-wechat/v1/', // 测试后台地址
        // prodApiUrl = 'http://wechat-api.tclsfdj.com:88/ha-wechat/v1/', // 线上后台地址
        prodApiUrl = 'http://119.23.34.22:8080/', // 线上后台地址
        base = isDebug ? testApiUrl : prodApiUrl,
        testAppId = 'wx2919594911b28214',//测试appId
        prodAppId = 'wxefe2041fd6eb765f',//正式环境appId
        appId = isDebug ? testAppId : prodAppId,
        testTCSMApiUrl = 'http://hktest.koyoo.cn/',// tcsm测试后台地址
        prodTCSMApiUrl = 'http://hk2.koyoo.cn/', //tcsm线上后台地址
        tcsmBase = isDebug ? testTCSMApiUrl : prodTCSMApiUrl,
        ihuigo_serviceName = 'http://www.ihuigo.com/',
        type = 'tcl',
        imgPath = 'http://img.ihuigo.com/';

    module.exports = {
        test: isDebug,
        testOpenIdList: [
            {name: '陶赛', openid: 'oSGb3tyuJGcgicA1eInVCjCdKimE'},
            {name: '欧阳', openid: 'oSGb3t0oLbuHu4pRR4BM7mOQFYHc'},
            {name: 'leo', openid: 'oSGb3t5nnUmXhq4vqMzfNeSdllIE'},
            {name: 'arvin', openid: 'oSGb3t6ildys9U_O6DswpGqBWQaA'},
            {name: 'rock', openid: 'oSGb3t4ELvx5rE_za-9zdkI4cSA4'},
            {name: 'jason', openid: 'oSGb3tzm5_i9mCEnIeh4F8SABEdo'},
            {name: 'Amy', openid: 'oSGb3tyUJUrp_SgtsUw3flUF9sAE'},
            {name: 'jime', openid: 'oSGb3tyhYzzAUbO4apwCZPbIohF0'},
            {name: 'du', openid: 'oSGb3t1YRvWQUMSV73c50DVU7I5c'},
            {name: 'boy', openid: 'oSGb3t1P6-pzueAMw99UkDulyFSs'},
            {name: '窦康', openid: 'oSGb3t7PHlINdJUqPIjtaBH6myIE'},
            {name: '焦红', openid: 'oSGb3t3rbkQ1Ci2ft-qf3Dl6MiV8'},
            {name: 'Frank', openid: 'oSGb3t18AOaUp2Iw3hJkDGGVtfck'},
            {name: '郭利宣', openid: 'oSGb3tyKDZTXzlpNxd8saQbZjDCI'},
            {name: 'kenny', openid: 'oSGb3tx2xs8fu2kAGyWeGre3SXtg'},
            {name: '山博', openid: 'oSGb3t6gvCNOij9zt5xwFiV08OH0'},
            {name: 'bill', openid: 'oSGb3t_3XxxjFqBWcR9Zm3pLaj4Q'},
            {name: '朱旻景', openid: 'oSGb3tyy9P01MzwxJdKDX1m15XFY'},
            {name: '第三方测试人员', openid: 'oSGb3t6imlvl88IT7SDmGtL2-JVY'},
        ],
        url: {
            //brands
            findAllProductBrands:base+'mobile/findAllProductBrands',
            // 查询产品
            findProductList:base+'mobile/findProductList',
            //根据code获取openid接口
            getWeiXinOpenIdByCode: base + 'weixin/getWeiXinOpenIdByCode/',
            //创建订单
            unifiedOrder: base + 'weixin/unifiedOrder',
            //支付完成查询订单
            getunifiedOrder: base + 'weixin/',
            //支付宝创建订单
            alipayCreateOrder: base + 'alipay/createOrder',

            //User
            loadUserByOpenId: base + 'user/loadUserByOpenId',

            //UserAddress
            findUserAddressByUserId: base + 'userAddress/findUserAddressByUserId',
            findUserAddressByAddressId: base + 'userAddress/findUserAddressByAddressId',
            saveUserAddress: base + 'userAddress/saveUserAddress',
            updateUserAddress: base + 'userAddress/updateUserAddress',
            deleteUserAddress: base + 'userAddress/deleteUserAddress',

            //UserOrder
            findAllUserOrderByConditionPager: base + 'userOrder/findAllUserOrderByConditionPager',
            saveUserOrder: base + 'userOrder/saveUserOrder',
            saveOtherUserOrder: base + 'userOrder/saveOtherUserOrder',
            cancelUserOrder: base + 'userOrder/cancelUserOrder',
            findUserOrderDetailByOrderId: base + 'userOrder/findUserOrderDetailByOrderId',
            findUserOrderDetailByOrderCode: base + 'userOrder/findUserOrderDetailByOrderCode',
            findAllAssessConf: base + 'assess/findAllAssessConf',
            batchSaveAssess: base + 'assess/batchSaveAssess',
            batchSaveAssessQrcode: base + 'assess/batchSaveAssessQrcode',
            //Wash
            findAllProductWash: base + 'product/findAllProductWash',
            findAllProduct: base + 'product/findAllProduct',
            findAllProductWashPackage: base + 'product/findAllProductWashPackage',
            findProductWashPreferentialTime: base + 'product/findProductWashPreferentialTime',

            //渠道信息
            findUserOrderThirdPartyByIndexAndType: base + 'userOrderThirdParty/findUserOrderThirdPartyByIndexAndType',//param={thirdPartyType:1,thirdPartyIndex:307}

            //Region
            findAllProvince: base + 'region/findAllProvince',
            findProvinceByProvinceId: base + 'region/findProvinceByProvinceId',
            findCityByProvinceId: base + 'region/findCityByProvinceId',
            findCityByCityId: base + 'region/findCityByCityId',
            findAreaByCityId: base + 'region/findAreaByCityId',
            findAreaByAreaId: base + 'region/findAreaByAreaId',
            findStreetByAreaId: base + 'region/findStreetByAreaId',

            //orderPay
            // unifiedOrder: base + 'pay/unifiedOrder', //param={orderId:719,payWay:0}
            queryOrder: base + 'pay/queryOrder',
            processOrderPayType: base + 'userOrder/processOrderPayType', //param={"orderId":1256,"payType":1}
            //Time
            findAllTimeControlRule: base + 'timeControl/findAllTimeControlRule',
            //查询控单数据
            findControlDataByCondition: base + 'control/findControlDataByConditionSimple',

            //验证验证码
            checkMsgCode: base + 'mms/checkMsgCode',//param={mobile:1,code:10}
            //推荐码
            checkUserIdAndPromoCode: base + 'promo/checkUserIdAndPromoCode',

            //OAuth2
            getWechatUserInfo: base + 'wechatOAuth2/getWechatUserInfo',
            getWechatTicket: base + 'wechatOAuth2/getWechatTicket',//param={currentUrl:"http://www.baidu.com"}
            //只拉取用户openId
            getWechatUserOpenId: base + 'wechatOAuth2/getNewWechatOpenId',
            //新旧公众号数据兼容接口,将旧公众号数据迁移到新公众号
            updateUserInfoFromOldOpenIdToNewOpenId: base + 'user/updateNewOpenId',

            //Common
            sendMsg: base + 'mms/sendMsg',
            //根据userId发送验证码
            sendMsgByUserId: base + 'mms/sendMsgU',
            //根据userId验证短信验证码
            checkMsgCodeByUserId: base + 'mms/checkMsgCodeU',//param={userId:1,code:10}

            //二维码获取
            getYjCode: base + 'share/yjqrcode',


            //Wechat
            wechat_base: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxefe2041fd6eb765f&redirect_uri=http://wechat.tclsfdj.com&response_type=code&scope=snsapi_base&state=1#wechat_redirect',
            wechat_userinfo: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxefe2041fd6eb765f&redirect_uri=http://wechat.tclsfdj.com&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect',

            wxAuth: {
                url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
                redirect_uri: 'http://wechat.tclsfdj.com',
                response_type: 'code',
                scope: 'snsapi_base',
                state: '1#wechat_redirect'
            },

            //ip查询
            ipTest: 'http://whois.pconline.com.cn/ipJson.jsp',
            //品牌
            findAllProductBrand: base + 'product/findAllProductBrand',
            //产品类别
            findAllProductCategory: base + 'product/findAllProductCategory',
            findAllProductCategoryDefault: base + 'product/findAllProductCategoryDefault',
            //产品类别对应故障信息
            findProductCategorySymptomByCategoryId: base + 'product/findProductCategorySymptomByCategoryId',
            //产品类别对应故障的维修安装价格
            findProductPriceByCategoryIdAndPriceType: base + 'product/findProductPriceByCategoryIdAndPriceType',
            // 获取安装维修所有的开通城市 param={regionServiceInstallType:1}
            findAllArea: base + 'region/findAllArea',
            // 查询一口价产品
            findAllInstallServiceProductCategory: base + 'product/findAllInstallServiceProductCategory',
            // 查询一口价产品的详情(服务的类别或故障)
            findAllInstallServiceProductCategoryDetail: base + 'product/findAllInstallServiceProductCategoryDetail',

            // 获取分享人信息
            findShareRecordByUserId: base + 'share/findShareRecordByUserId',
            // 绑定关系
            userRelationBuild: base + 'share/userRelationBuild',
            // 获取分享信息
            fetchShareInfoByUserId: base + "promo/fetchShareInfoByUserId",

            // 手机回收业务

            //回收品类商品
            getBrandGoodsAll: base + "recoveryType/getBrandGoodsAll",
            //回收一级分类
            findGoodsType: base + "recoveryType/findGoodsType",
            //回收商品查询
            getGoodsAll: base + "recoveryType/getGoodsAll",
            //回收订单下单接口
            goorder: base + 'recovery/order/goorder',
            //获取银行列表
            getBankAll: base + 'recoveryType/getBankAll',
            //获取用户历史打款信息
            existspayinfo: base + 'recovery/order/existspayinfo',//?uid=51&accessToken


            //品牌搜索接口
            searchGoodsBrand: ihuigo_serviceName + 'project_tcl/' + type + '/search_goods_brand/' + type + '.html',//?bname&currentpage&pagenum&sign
            //商品搜索接口
            searchGoods: ihuigo_serviceName + 'project_tcl/' + type + '/search_goods/' + type + '.html',//pcid&gname&currentpage&pagenum&sign
            //商品详细接口地址
            getGoodsInfo: ihuigo_serviceName + 'project_tcl/' + type + '/get_goods_info/' + type + '.html',//gid=17645&sign
            //提交回购商品（估价）接口地址
            subHuigoGoods: ihuigo_serviceName + 'project_tcl/' + type + '/sub_huigo_goods/' + type + '.html',//gid&property_ids&desc_ids&pj_ids&sign
            //商品查看回购商品报价接口地址
            showPrice: ihuigo_serviceName + 'project_tcl/' + type + '/show_price/' + type + '.html',//sn&sign
            //订单确认接口
            showOrder: ihuigo_serviceName + 'project_tcl/' + type + '/show_order/' + type + '.html',//sn&sign
            //提交订单信息接口
            subHuigoOrder: ihuigo_serviceName + 'project_tcl/' + type + '/sub_huigo_order/' + type + '.html',//cache_sn&mz_orderid&account&typeid&link_name&mobile&address&isexpress&sign
            //获取所有品类品牌接口
            getBrandAll: ihuigo_serviceName + 'project_tcl/' + type + '/get_brand_all/' + type + '.html',//
            // 回收订单详情
            recoveryOrderDetail: base + 'recovery/order/detail',
            // 回收订单修改
            recoveryOrderModify: base + 'recovery/order/modify',
            //搜索功能 ： 获取回收热词接口
            getHotSearchInfo: base + 'recoveryType/getHotSearch',
            //搜索功能 ： 搜索产品接口
            getSearchInfo: base + 'recoveryType/SearchGoods',

            //手机维修业务
            //获取手机维修 支持品牌
            getBrandsForPhoneRepair: base + 'repair/brands',
            //根据品牌id取该品牌手机
            getModelsByBrandId: base + 'repair/models',

            //根据手机id取该手机数据 (弃用！！！)
            //getDataByModelId : base + 'repair/data',
            //根据手机id取该手机颜色
            getColourByModelId: base + 'repair/colours',
            //根据颜色id取该手机故障类型、明细
            getFaultDataByColourId: base + 'repair/fault',

            /*---------------------------------------------*/
            //1. !!!!!! 根据modelId查询故障类型、明细(new)
            getFaultDataByModelId: base + 'repair/fault',
            //2. !!!!!! 根据colourId查询物料、价格(new)
            getMaterialAndPriceByColourId: base + 'repair/material',
            /*---------------------------------------------*/

            //手机维修订单详情
            getPhoneRepairOrderInfoById: base + 'repair/details',//?orderId=92&userId=1
            //手机维修下单接口
            phoneRepairGoorder: base + 'repair/goorder',
            //手机维修发货接口
            phoneRepairExpress: base + 'repair/express',
            //手机维修取消订单接口
            phoneRepairCancel: base + 'repair/cancel',
            //会员
            //获取钱包余额
            getWalletBalance: base + 'member/walletorder/balance',
            //获取充值记录列表
            getWalletList: base + 'member/walletorder/list',

            //2016/12/06.读取充值定义列表
            getRechargeList: base + 'member/walletorder/chargelist',
            //【在线】充值
            saveWalletGoorderOnline: base + 'member/walletorder/goorder',
            //2016/12/06.【充值卡】充值
            saveWalletGoorderByCard: base + 'member/walletorder/goorderc',
            //2016/12/06.获取【充值卡】信息
            getCardDetail: base + 'member/walletorder/carddetail',


            //充值明细
            getWalletGoorderDetail: base + 'member/walletorder/detail',


            //钱包支付
            walletPay: base + 'walletpay',
            //设置钱包支付密码
            setWalletPassword: base + 'member/setpwd',
            //获取用户是否设置了手机号码
            checkMobileBind: base + 'member/checkmobilebind',
            //绑定手机号码
            bindMobile: base + 'member/bindmobile',
            //找回支付密码
            findWalletPassword: base + 'member/findpwd',
            //修改支付密码
            updateWalletPassword: base + 'member/updatepwd',
            //获取账户管理信息
            getMemberUserInfo: base + 'member/userinfo',
            //修改账户信息
            updateAccountInfo: base + 'member/updateaccount',
            //手机领券
            getCoupon: base + 'coupon/buildCoupon',
            //领30元券
            getCouponTH: base + 'coupon/buildCouponTH',
            //领红包
            buildUserIdCoupon: base + 'coupon/buildUserIdCoupon',
            //查询用户是否已经领红包
            checkUserIdCoupon: base + 'coupon/checkUserIdCoupon',

            // 会员等级
            getMemberLevels: base + 'member/levels',
            getLevelincome: base + 'member/levelincome',

            //充值列表
            getWalletGoorderList: base + 'member/walletorder/list',
            //查询用户能否参加活动 param={userId:1}
            checkActiveConfByUserId: base + 'active/checkActiveConfByUserId',
            //通过活动id查询活动 param={activeId:1}
            findActiveConfByActiveId: base + 'active/findActiveConfByActiveId',
            //检查用户是否首单
            checkUserIsFirstOrder: base + 'user/checkUserIsFirstOrder',

            //1.获取一元秒杀活动信息 param={"activeId":2,"provinceName":"广东省","cityName":"深圳市","productTypeCode":0}
            //2.获取特价专区商品活动信息 param={"activeId":6,"provinceName":"广东省","cityName":"深圳市","productTypeCode":0}
            //3.获取清洗套餐专区活动信息 param={"activeId":10,"provinceName":"广东省","cityName":"深圳市","productTypeCode":1}
            findActiveConfByParentActiveId: base + 'active/findActiveConfByParentActiveId',
            //1元秒杀预约
            simpleBooking: base + 'active/simplebooking',
            //根据用户id和活动id来查询当前活动状态
            checkActiveConfByUserIdAndActiveId: base + 'active/checkActiveConfByUserIdAndActiveId',
            //记录用户是否进入过活动页面 openid
            recorderEntryActivityPage: base + 'active/entrypage',
            //查询用户是否进入过活动页面 openid
            checkEntryActivityPage: base + 'active/checkentry',


            //推广关注功能
            //检查绑定状况
            checkbindCode: base + 'enginer/checkbind',//?openId=oSGb3t_3XxxjFqBWcR9Zm3pLaj4Q
            //执行绑定渠道
            dindChannelCode: base + 'enginer/bind', //绑定渠道编号
            //显示渠道编号信息
            getEnginerInfoByCode: base + 'enginer/confirm', //显示渠道信息
            //查询关注总计
            getEnginerSubTotal: base + 'enginer/subscribetotal', //查询关注总计
            //查询关注列表
            getEnginerSubList: base + 'enginer/subscribelist', //查询关注列表

            //tcsm接口调用
            tcsmApiUrl: tcsmBase + 'index.php',
            //tcsm获取工单信息
            tcsmGetonework: tcsmBase + 'api/getonework.php',
            //tcsmB端评价接口
            tcsmEvaluate: tcsmBase + 'api/B_Evaluate.php',

            //emt端嵌入页面
            //1拉取工程师信息
            getEMTEngInfo: base + 'emteng/enginfo',
            //2查询关注总计
            getEMTSubscribeTotal: base + 'emteng/subscribetotal',
            //3推荐关注或留存列表
            getEMTSubscribeList: base + 'emteng/subscribelist',
            getEMTSubscribeList2: base + 'emteng/subscribelist2',
            //4查询关注人数 关注奖励总计
            getEMTSubscribeBountyTotal: base + 'emteng/subscribebountytotal',
            //5推荐下单列表
            getEMTSuborderList: base + 'emteng/suborderlist',
            getEMTSuborderList2: base + 'emteng/suborderlist2',
            //6查询下单人数 下单奖励总计
            getEMTOrderBountyTotal: base + 'emteng/orderbountytotal',
            //7师傅在排行榜中的位置
            getEMTEngIndex: base + 'emteng/engindex',
            //8师傅排行榜列表
            getEMTEngRanking: base + 'emteng/engranking',
            //9获取师傅二维码
            getEMTEngQrcodeByEmtId: base + 'share/engzstg',
            //10获取奖励活动列表
            getEMTBountyActive: base + 'emteng/bountyactive',

            // banner动态配置
            queryBannerList: base + 'banner/queryBannerList',
            // 获取单品推荐配置
            queryRecommend: base + 'product/recommend/getSingleProduct',


            //专属推广模块
            //1.根据用户id查询关注、奖励总计
            getSubscribeBountyTotal: base + 'usersubstat/subscribebountytotal',
            //2.推荐关注
            getUserSubscribeList: base + 'usersubstat/subscribelist',
            //3.推荐下单
            getUserSuborderList: base + 'usersubstat/suborderlist',

            //家居安装模块
            //1.获取所有产品大类
            findAllMainCategory: base + 'family/product/findAllMainCategory',
            //2.根据产品大类获取产品小类
            findAllSubCategory: base + 'family/product/findAllSubCategory',
            //3.根据产品小类获取产品详情
            findProductDetailList: base + 'family/product/findProductDetailList',
            //4.根据地址获取最低上门费
            findHomeFeeByAddress: base + 'family/product/findHomeFeeByAddress',
            //5.家居安装下单
            saveHouseholdOrder: base + 'userOrder/saveOtherUserOrder',

            //首页获取十分口碑设置和十分头条
            getHomeInfo: base + 'notifyConf/selectByPointAndType',
            //emt端扫码支付：订单初始化
            initScanPayOrderForEMT: base + 'emt/scanpay/init',
            //emt端扫码支付：查询TCSM订单评价情况 ?param={"orderCode":"CS1611281547000079"}
            findTcsmAssess: base + 'userOrder/findTcsmAssess',
            //emt端扫码支付：提交TCSM订单评价
            batchSaveTcsmAssess: base + 'assess/batchSaveTcsmAssess',

            //电子充值卡
            //1.读取电子充值卡定义列表
            getRechargeCardShopList: base + 'member/walletorder/elechargelist',
            //2.购买电子充值卡
            buyRechargeCard: base + 'member/walletorder/buycard',
            //3.已购买的电子充值卡列表
            getMyRechargeCardList: base + 'member/walletorder/mycards',
            //4.本人直接使用电子充值卡
            useMyRechargeCard: base + 'member/walletorder/useelecard',

            //充值送红包活动
            //1.增加分享记录
            addShareRecord: base + 'shareRecord/addShareRecord',
            //2.获取用户可抽奖次数
            getLotteryTimes: base + 'member/walletorder/getLotteryTimes',
            //3.拆红包 抽奖
            openLottery: base + 'member/walletorder/openLottery',
            //4.查询已获取奖品列表
            getPrizesList: base + 'member/walletorder/getPrizesList',
            //5.查询用户活动充值记录
            getLotteryChargeList: base + 'member/walletorder/lotteryChargeList',

            //国美家电回收接口
            //获取某品类下的品牌
            getGuomeiBrands: base + 'recovery/household/brands',
            //某品类下的规格列表
            getGuomeiStandard: base + 'recovery/household/att',
            //获取年限列表
            getGuomeiYears: base + 'recovery/household/years',
            //用户选择品牌 规格后给出参考价格
            getGuomeiPrice: base + 'recovery/household/getprice',
            //用户选择品牌 规格后给出参考价格
            submitGuomeiOrder: base + 'recovery/household/goorder',
            //查询国美家电回收订单详情
            queryRecycleGuomeiOrderDetail: base + 'recovery/household/details',
            //取消国美家电回收订单
            cancelRecycleGuomeiOrder: base + 'recovery/household/cancel',

            //查询智能家居单品列表
            getSmartHomeProductSingleList: base + 'smartHome/order/findProductList',
            //查询智能家居套餐列表
            getSmartHomeProductCombList: base + 'smartHome/order/findProductPackList',

            //提交智能家居订单
            submitSmartHomeOrder: base + 'smartHome/order/placeOrder',
            //取消订单smartHome/order/cancel
            cancelSmartHomeOrder: base + 'smartHome/order/cancel',
            //查询智能家居订单详情
            querySmartHomeOrderDetail: base + 'smartHome/order/details'


        },
        app: {
            //appId: 'wxefe2041fd6eb765f'
            appId: appId
        },
        key: {
            activeStart: true,//活动开关 true:开启 false:关闭
            user: 'ha_user',
            business: 'ha_business',//业务类型，维修和安装
            location: {
                city: 'ha_location_city',
                provinces: 'ha_location_provinces',
                cities: 'ha_location_cities'
            },
            brands: {
                select: 'ha_selected_brands',
                select_product: 'ha_selected_product',
                openid: 'ha_openid',
                orderNo: 'ha_orderNo',
                timeLimit: 'ha_timeLimit',
                origin: 'ha_origin'
            },
            wash: {
                order: 'ha_wash_order',
                orderComb: 'ha_wash_order_comb',
                orderCombOptional: 'ha_wash_order_comb_optional',
                date: 'ha_wash_date',
                orderParam: 'ha_wash_order_param'
            },
            repair: {
                order: 'ha_repair_order',
                date: 'ha_repair_date',
                orderParam: 'ha_repair_order_param',
                detail: 'ha_repair_detail',
                business: 'ha_repair_business',
                product: 'ha_repair_product',
                selectedAddress: 'ha_repair_address_selected'
            },
            comment: 'ha_batchAssess', //评论
            frame: 'ha_frameStatus',
            testUserIndex: 'ha_test_user_index',
            dataSource: {
                type: 'data_source_type',
                openid: 'data_source_openid'
            },
            recycle: {
                recycleInfo: 'ha_recycle_info',
                recyclePayInfo: 'ha_recyclePay_info',
                recycleSearchInfo: 'ha_recycleSearch_info',
                guomeiRecycleInfo: 'ha_guomei_recycle_info'
            },
            phoneRepair: {
                brand: 'ha_phone_repair_brand',
                mobile: 'ha_phone_repair_mobile',
                order: 'ha_phone_repair_order',
                orderInvoice: 'ha_phone_repair_invoice',
                orderItemFor1001: 'ha_phone_repair_itemFor1001',
                orderRecoveryMode: 'ha_phone_repair_recovery_mode',
                selectedAddress: 'ha_phone_repair_address_selected'
            },
            vip: {
                balance: 'ha_vip_balance',
                balanceParam: 'ha_vip_balance_param',
                discount: 'ha_vip_discount',
                hasPwd: 'ha_vip_pwd',
                hasPhone: 'ha_vip_phone',
                rechargeCard: 'ha_vip_recharge_card',
                rechargeCardParam: 'ha_vip_recharge_card_param'
            },
            param: {
                modelType: 'ha_url_model_type'
            },
            household: {
                bigClass: 'ha_household_big_class',
                subClass: 'ha_household_sub_class',
                orderParam: 'ha_household_order_param',
                subclasstemp: 'ha_household_subclasstemp'

            },
            route: {
                emtPayUserOpenId: 'ha_emtpay_user_openid'
            },
            smarthome: {
                singleParam: 'ha_smarthome_single_param',
                combParam: 'ha_smarthome_comb_param',
                orderParam: 'ha_smarthome_order_param'
            },
            install: {
                product: 'ha_install_product',
                order: 'ha_install_order',
                date: 'ha_install_date',
                orderParam: 'ha_install_order_param',
                selectedAddress: 'ha_install_address_selected'
            },
            address: {
                selectedAddress: 'ha_address_selected'
            }

        }
    };

});