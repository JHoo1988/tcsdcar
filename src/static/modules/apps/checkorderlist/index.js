/**
 * Created by ryandu on 2017/3/21.
 */

define(['jquery', 'jea', 'config', 'fastclick', 'layer', 'weui', 'ejs'], function ($, jea, config, fastclick, layer) {
    'use strict';

    var utilPage = require('util_page');
    var utilBrands = require('util_brands');
    var utilCommon = require('util_common');
    var App = function () {
    };

    App.prototype = {

        /**
         * @func
         * @desc 初始化函数
         */
        init: function () {
            utilPage.ready();
            this.renderPage();
            this.bind();
            fastclick.attach(document.body);
        },

        /**
         * @func
         * @desc 渲染页面
         */
        renderPage: function () {
            var result = utilBrands.checkorder.getCheckOrder();
            if(result&&result.content&&result.content.length>0){
                var html = new EJS({ url: 'views/checkorderlist/index.ejs' }).render(result);
                $('body').prepend(html);
            }else{
                window.location.href='checkorder.html';
            }
        },

        /**
         * @func
         * @desc 绑定事件
         */
        bind: function () {
            var _self = this;
            $('.weui-form-preview__ft').click(function () {
                var pfjl = $(this).parent().find('.weui-form-preview__bd').find('.pfjl');
                var btn = $(this);
                if(pfjl.hasClass('hide')){
                    console.log('123');
                    var id = $(this).data('id');
                    if (!id) {
                        return;
                    } else {
                        _self.showLoadin();
                        var param = {};
                        param.pageIndex = 1;
                        param.pageSize = 99;
                        param.orderId = id;
                        _self.getCheckOrderList(param,function (content) {
                            _self.hideLoadin();
                            if (content && content.length > 0) {
                                pfjl.removeClass('hide');
                                var html='<label class="weui-form-preview__label">已赔付记录</label>';
                                for (var i = 0; i < content.length; i++) {
                                    html+='<span class="weui-form-preview__value">第' + (i+1) + '次赔付时间：' + content[i].createTime+'</span>';
                                }
                                pfjl.empty().append(html);
                                btn.addClass('hide');
                            } else {
                                // text += '<p>暂无赔付记录</p><br>';
                            }
                        });
                    }
                }
            });
        },
        getCheckOrderList: function(param,callback){
            $.ajax({
                url: config.url.findPaidRecordsList,
                type: 'GET',
                dataType: 'json',
                data: param,
                success: function (result) {
                    if (result.code == 200) {
                        var content = result.data.content;
                        callback(content);
                    }
                }
            });
        },
        hideLoadin: function () {
            $('#loadingToast').addClass('hide');
        },
        showLoadin: function (content) {
            $('#loadingToast').removeClass('hide');
            if (content) {
                $('.weui_toast_content').text(content);
            }
        }
    };
    return new App();
});