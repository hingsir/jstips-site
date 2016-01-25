var fs = require('fs');
var generate = require('./generate.js');
var github = require('./github.js')
//var _ = require('lodash');

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
    var name = item.name;
    tips.push({
        source:{
            name: name,
            content: item.content
        },
        title: name.substr(11,name.length - 3)
    })
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
                    sha: item.sha,
                    content: new Buffer(obj.content,'base64').toString()
                }
                pushTip(localStorage[name], callback);
            })
        }else{
            localStorage[name] = item;
            pushTip(item, callback);
        }
    })
}

var parse = {
    parse: function(remoteData){
        var remoteList = JSON.parse(remoteData);console.log(remoteList)
        synchronizeTips(remoteList, function(tips){

            saveLocalStorage();

            tips.sort(function(a, b){
                a.name.substr(0,10) < b.name.substr(0,10);
            })
            generate.generate(tips);
        });
    }
}

module.exports = parse;