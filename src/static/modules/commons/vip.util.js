define(['jquery','config'],function ($,config) {
	return {
		order : {
			setBalanceOrder : function (data) {
				sessionStorage.setItem(config.key.vip.balance,JSON.stringify(data));
			},
			getBalanceOrder : function () {
				return JSON.parse(sessionStorage.getItem(config.key.vip.balance) || 'null');
			},
			clearBalanceOrder : function () {
				sessionStorage.removeItem(config.key.vip.balance);
			},
			setBalanceOrderParam : function (data) {
				sessionStorage.setItem(config.key.vip.balanceParam,JSON.stringify(data));
			},
			getBalanceOrderParam : function () {
				return JSON.parse(sessionStorage.getItem(config.key.vip.balanceParam) || 'null');
			},
			clearBalanceOrderParam : function () {
				sessionStorage.removeItem(config.key.vip.balanceParam);
			},
			setVipDiscountInfo : function(data){
				sessionStorage.setItem(config.key.vip.discount,JSON.stringify(data));
			},
			getVipDiscountInfo : function () {
				return JSON.parse(sessionStorage.getItem(config.key.vip.discount) || 'null');
			},
			clearVipDiscountInfo : function () {
				sessionStorage.removeItem(config.key.vip.discount);
			},
			setWalletPasswordFlag : function(boolFlag){
				sessionStorage.setItem(config.key.vip.hasPwd,JSON.stringify(boolFlag));
			},
			getWalletPasswordFlag : function(){
				return JSON.parse(sessionStorage.getItem(config.key.vip.hasPwd) || 'false');
			},
			clearWalletPasswordFlag : function(){
				sessionStorage.removeItem(config.key.vip.hasPwd);
			},
			setPhoneFlag : function(boolFlag){
				sessionStorage.setItem(config.key.vip.hasPhone,JSON.stringify(boolFlag));
			},
			getPhoneFlag : function(){
				return JSON.parse(sessionStorage.getItem(config.key.vip.hasPhone) || 'false');
			},
			clearPhoneFlag : function(){
				sessionStorage.removeItem(config.key.vip.hasPhone);
			},
			//设置用户选择的电子充值卡 缓存
			setRechargeCardOrder : function(data){
				sessionStorage.setItem(config.key.vip.rechargeCard,JSON.stringify(data));
			},
			getRechargeCardOrder : function(){
				return JSON.parse(sessionStorage.getItem(config.key.vip.rechargeCard) || 'null');
			},
			clearRechargeCardOrder : function(){
				sessionStorage.removeItem(config.key.vip.rechargeCard);
			},
			//设置电子充值卡订单数据缓存
			setRechargeCardOrderParam : function(data){
				sessionStorage.setItem(config.key.vip.rechargeCardParam,JSON.stringify(data));
			},
			getRechargeCardOrderParam : function(){
				return JSON.parse(sessionStorage.getItem(config.key.vip.rechargeCardParam) || 'null');
			},
			clearRechargeCardOrderParam : function(){
				sessionStorage.removeItem(config.key.vip.rechargeCardParam);
			},
		}
	};
});