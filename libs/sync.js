var fs = require('fs');
var generate = require('./generate.js');
var github = require('./github.js');
var gutil = require('gulp-util');

var localStorage = {}; //
var tips = [];
var unsynchronized = 0; //未同步数量

function loadLocalStorage(){
    localStorage = JSON.parse(fs.readFileSync('localStorage.json'));
}

function saveLocalStorage(){
    fs.writeFileSync('localStorage.json',JSON.stringify(localStorage),'utf-8');
}

function pushTip(item, callback){
    var name = item.name,
        content = item.content,
        baseInfo = content.match(/\-{3}[\s\S]+\-{3}/)[0],
        detailInfo = content.replace(baseInfo,''),
        filename = name.substring(11, name.length-3) + '.html';

    tips.push({
        source:{
            name: name,
            content: content
        },
        baseInfo:{
            date: name.substring(0,10),
            title: baseInfo.match(/title:.*/)[0].replace(/title:\s*/,''),
            number: baseInfo.match(/tip-number:.*/)[0].replace(/tip-number:\s*/,''),
            username: baseInfo.match(/tip-username:.*/)[0].replace(/tip-username:\s*/,''),
            profile: baseInfo.match(/tip-username-profile:.*/)[0].replace(/tip-username-profile:\s*/,''),
            tldr: baseInfo.match(/tip-tldr:.*/)[0].replace(/tip-tldr:\s*/,'')
        },
        detailInfo: detailInfo,
        filename: filename
    })
    gutil.log(gutil.colors.green('synchronized: ') + item.name);
    unsynchronized--;
    if(unsynchronized === 0){
        callback(tips);
    }
}

function synchronizeTips(remoteList, callback){
    unsynchronized = remoteList.length;
    remoteList.forEach(function(item,index){
        var name = item.name;
        if(!localStorage[name] || localStorage[name].sha !== item.sha){
            github.request(item.git_url.replace('https://api.github.com',''),function(data){
                var obj = JSON.parse(data);
                localStorage[name] = {
                    name: name,
                    sha: item.sha,
                    content: new Buffer(obj.content,'base64').toString()
                };
                pushTip(localStorage[name], callback);
            })
        }else{
            pushTip(localStorage[name], callback);
        }
    })
}

var sync = {
    sync: function(remoteData){
        var remoteList = JSON.parse(remoteData);
        loadLocalStorage();
        synchronizeTips(remoteList, function(tips){
            saveLocalStorage();
            tips.sort(function(a, b){
                return +a.baseInfo.number < +b.baseInfo.number ? 1 : -1;
            })
            generate.generate(tips);
        });
    }
}

module.exports = sync;