var ejs = require('ejs');
var fs = require('fs');
var markdown = require( "markdown" ).markdown;

var generate = {
    generate: function(tips){
        tips.forEach(function(tip){
            ejs.renderFile('template/layout.html',{
                tips: tips,
                content: markdown.toHTML(tip.source.title + tip.source.content)
            }, function(err,result){
                if(err) throw err;
                fs.writeFile('dist/tips/'+ tip.id +'.html',result,'utf-8');
            })
        })
    }
}

module.exports = generate;