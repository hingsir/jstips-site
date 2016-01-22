var ejs = require('ejs');
var fs = require('fs');
var marked = require('marked');

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
            ejs.renderFile('views/layout.html',{
                tips: tips,
                current: index,
                content: marked(tip.source.title + tip.source.content)
            }, function(err,result){
                if(err) throw err;
                fs.writeFile('dist/tips/'+ tip.id +'.html',result,'utf-8');
                if(index == 0){
                    fs.writeFile('dist/tips/index.html',result,'utf-8');
                }
            })
        })
    }
}

module.exports = generate;