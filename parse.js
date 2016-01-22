var fs = require('fs');
var generate = require('./generate.js')

var parse = {
    parse: function(content){
        var self = this;
        self.saveFile(content);
        var tips = self.parseTips(content);
        generate.generate(tips);
    },
    saveFile: function(content){
        var file = 'readme.md'
        fs.unlink(file);
        fs.appendFile(file,content,'utf-8');
    },
    parseTips: function(content){
        var tips = [];
        var titleArr = content.match(/##\s#\d+.*/g);
        var contentArr = content.split(/##\s#\d+.*/).slice(1);
        titleArr.forEach(function(title,index){
            tips.push({
                source:{
                    title: title,
                    content: contentArr[index]
                },
                id: title.replace(/.*#(\d+).*/,'$1'),
                title: title.replace(/##\s#(\d+)[\s-]*/,'$1.'),
                content: contentArr[index]
            })
        })
        return tips;
    }
}

module.exports = parse;