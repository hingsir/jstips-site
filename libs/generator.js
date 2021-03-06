var ejs = require('ejs');
var fs = require('fs');
var config = require('../config.js');
var gutil = require('gulp-util');

var md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

var baseUrl = config.baseUrl;
var tipsDir = '';


function mkdirs(path){
    var temp;
    path.split('/').forEach(function(dir){
        temp = temp ? temp + '/' + dir : dir;
        if(!fs.existsSync(temp)){
            fs.mkdir(temp);
        }
    })
}

function makeTitle(tip){
    return ['## #',tip.baseInfo.number,' - ',tip.baseInfo.title,'\n',
        '> ',tip.baseInfo.date,' by [@',tip.baseInfo.username,'](',tip.baseInfo.profile,')\n'].join('');
}

function removeExt(filename){
    return filename.replace(/\.\w+$/,'');
}

var generator = {
    generate: function(tips,dir,lang){
        tipsDir = dir || 'dist/tips/en';
        mkdirs(tipsDir);

        tips.forEach(function(tip,index){
            ejs.renderFile('source/views/layout.html',{
                config: config,
                tips: tips,
                tip: tip,
                current: index,
                content: md.render(makeTitle(tip) + tip.detailInfo),
                baseUrl: baseUrl,
                url: baseUrl + tipsDir + '/' + tip.filename,
                shareImg: baseUrl + 'dist/images/github.jpg',
                removeExt: removeExt,
                lang: lang
            }, function(err,result){
                if(err) throw err;
                fs.writeFile(tipsDir + '/' + tip.filename,result,'utf-8');
                gutil.log(gutil.colors.green('generated: ') + tipsDir + '/' + tip.filename);
                if(index == 0){
                    fs.writeFile(tipsDir + '/index.html',result,'utf-8');
                    gutil.log(gutil.colors.green('generated: ') + tipsDir + '/' + 'index.html');
                }
            })
        })

        ejs.renderFile('source/views/catalog.html',{
            config: config,
            tips: tips,
            baseUrl: baseUrl,
            removeExt: removeExt,
            lang: lang
        },function(err,result){
            fs.writeFile(tipsDir + '/catalog.html',result,'utf-8');
            gutil.log(gutil.colors.green('generated: ') + tipsDir + '/' + 'catalog.html');
        })
    }
}

module.exports = generator;
