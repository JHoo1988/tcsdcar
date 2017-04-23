/* global fis */
var defaultConfig = require('./default.config');

fis.config.set('modules.postpackager', 'simple');
fis.config.set('settings.postpackager.simple.autoCombine', true); // 利用simple插件，我们还可以按页面进行自动合并，将没有通过pack设置打包的零散资源自动合并起来。

fis.config.set('modules.parser.sass', 'node-sass');
fis.config.set('modules.parser.scss', 'node-sass');

fis.config.set('roadmap.ext.sass', 'css');
fis.config.set('roadmap.ext.scss', 'css');

fis.config.set('settings.parser.node-sass', {
    // 加入文件查找目录
    include_paths: ['./src/static/styles']
});

// 开起 autuload, 好处是，依赖自动加载。
fis.config.set('modules.postpackager', 'autoload');
fis.config.set('settings.postpackager.autoload.type', 'requirejs');

// 设置成 amd 模式。
fis.config.set('modules.postprocessor.html', 'amd');
fis.config.set('modules.postprocessor.js', 'amd');
fis.config.set('settings.postprocessor.amd', defaultConfig.amd);

// 使用 depscombine 是因为，在配置 pack 的时候，命中的文件其依赖也会打包进来。
fis.config.set('modules.packager', 'depscombine');

//fis.config.set('pack', defaultConfig.pack);

fis.config.set('roadmap.path', defaultConfig.roadmapPath);

fis.config.merge({
    //modules: {
    //    optimizer: {
    //        html: "htmlmin"
    //    }
    //},
    //settings: {
    //    optimizer: {
    //        "htmlmin": {
    //            minifyJS: false
    //        }
    //    }
    //},
    roadmap: {
        domain: "/"  // 测试服务器的访问地址
    }
});
