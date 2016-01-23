var ejs = require('ejs');
var fs = require('fs');
var marked = require('marked');

var baseUrl = 'https://hingsir.github.io/jstips-site/';

marked.setOptions({
  renderer: new marked.Renderer(),
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
        tips.forEach(function(tip,index){
            var url = 'dist/tips/'+ tip.id +'.html';
            ejs.renderFile('views/layout.html',{
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
    }
}

module.exports = generate;