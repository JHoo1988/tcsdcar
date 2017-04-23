module.exports = {
    amd: {
        baseUrl: '.',

        paths: {
            config: 'static/modules/commons/config.js',
            jquery: 'static/modules/libs/jquery/jquery.js',
            md5: 'static/modules/libs/jquery-md5/jQuery.md5.js',

            util_page: 'static/modules/commons/page.util.js',
            util_oauth2: 'static/modules/commons/oauth2.util.js',
            util_common: 'static/modules/commons/common.util.js',
            util_user: 'static/modules/commons/user.util.js',
            util_repair_order: 'static/modules/commons/repair.order.util.js',
            util_business: 'static/modules/commons/business.util.js',
            util_address: 'static/modules/commons/address.util.js',

            util_location_city: 'static/modules/commons/location.city.util.js',
            util_location_cities: 'static/modules/commons/location.cities.util.js',
            util_location_provinces: 'static/modules/commons/location.provinces.util.js',
            util_data_source: 'static/modules/commons/data.source.util.js',
            util_param_url: 'static/modules/commons/url.param.util.js',
            util_vip: 'static/modules/commons/vip.util.js',
            util_household_order: 'static/modules/commons/household.order.util.js',

            jec: 'static/modules/extends/jquery.ext.common.js',
            jea: 'static/modules/extends/jquery.ext.ajax.js',

            api_wechat: 'static/modules/apis/wechat.api.js',
            api_region: 'static/modules/apis/region.api.js',
            api_vip: 'static/modules/apis/vip.api.js',

            weui: 'static/modules/libs/jquery-weui/js/jquery-weui.js',
            ejs: 'static/modules/libs/ejs/ejs.min.js',
            layer: 'static/modules/libs/layer_mobile/layer.js',
            slider: 'static/modules/libs/owlcarousel/owl.carousel.js',
            fastclick: 'static/modules/libs/fastclick/fastclick.js',
            rsvp: 'static/modules/libs/promise/rsvp.min.js',
            calendar: 'static/modules/extends/dzz.weui.ext.calendar.js',

            app: 'static/modules/apps/'
        },

        shim: {
            weui: ['jquery'],
            jea: ['jquery', 'weui']
        }
    },
    pack: {
        '/pkg/lib_min.js': [
            '/static/modules/libs/fastclick/fastclick.js',
            '/static/modules/libs/jquery/jquery.js',
            '/static/modules/libs/jquery-weui/js/jquery-weui.js',
            '/static/modules/libs/promise/rsvp.min.js',
            '/static/modules/libs/ejs/ejs.min.js'
        ],
        '/pkg/common_min.js': [
            '/static/modules/extends/jquery.ext.ajax.js',
            '/static/modules/commons/*'
        ]
    },
    roadmapPath: [
        // require文件
        {
            reg: /static\/lib\/(require\.js)/,
            release: 'pkg/$1'
        },

        // modules文件
        {
            reg: /(static\/modules\/.*)/,
            isMod: true,
            release: '$1'
        },

        // css文件
        {
            reg: /(static\/styles\/.*)/,
            release: '$1'
        },

        // 图片文件
        {
            reg: /(static\/images\/.*)/,
            useHash: false,
            release: '$1'
        },

        // 打包文件
        {
            reg: /(pkg\/.*)/,
            release: '$1'
        },

        // 网站主页
        {
            reg: /html\/home\/index.html/i,
            release: 'index.html'
        },

        // 静态页面
        {
            reg: /html\/(.*\.(?:html|json))/i,
            release: '$1'
        },

        {
            reg: /(views\/.*)/,
            release: '$1'
        },

        // 除了以上文件外，其它文件默认不打包
        {
            reg: /.*/,
            release: false
        }

    ]
};