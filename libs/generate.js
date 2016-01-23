var ejs = require('ejs');
var fs = require('fs');
var marked = require('marked');
var config = require('../config.js');

var baseUrl = config.baseUrl;

marked.setOptions({
    enderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

var generate = {
    generate: function(tips){
        this.mkdirs('dist/tips');
        tips.forEach(function(tip,index){
            var url = 'dist/tips/'+ tip.id +'.html';
            ejs.renderFile('source/views/layout.html',{
                config: config,
                tips: tips,
                tip: tip,
                current: index,
                content: marked(tip.source.title + tip.source.content),
                url: baseUrl + url,
                shareImg: baseUrl + 'dist/images/github.jpg'
            }, function(err,result){
                if(err) throw err;
                fs.writeFile(url,result,'utf-8');
                if(index == 0){
                    fs.writeFile('dist/tips/index.html',result,'utf-8');
                }
            })
        })

        ejs.renderFile('source/views/catalog.html',{
            config: config,
            tips: tips
        },function(err,result){
            fs.writeFile('dist/tips/catalog.html',result,'utf-8');
        })
    },
    mkdirs: function(path){
        var temp;
        path.split('/').forEach(function(dir){
            temp = temp ? temp + '/' + dir : dir;
            if(!fs.existsSync(temp)){
                fs.mkdir(temp);
            }
        })
    }
}

module.exports = generate;