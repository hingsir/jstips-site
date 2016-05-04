var fs = require('fs');
var generator = require('./generator.js');
var github = require('./github.js');
var gutil = require('gulp-util');

function Synchronizer(lang){
    this.lang = lang || 'en';
    this.localStorage = {};
    this.localStorageFile = 'localStorage_' + lang + '.json';
    this.tips = [];
    this.unsynchronized = 0; //未同步数量
}
Synchronizer.prototype = {
    sync: function(){
        var self = this;
        github.request('/repos/loverajoel/jstips/contents/_posts/' + self.lang,function(data){
            self._sync(data);
        })
    },
    _sync: function(remoteData){
        var self = this;
        var remoteList = JSON.parse(remoteData);
        self._loadLocalStorage();
        self._synchronizeTips(remoteList, function(tips){
            self._saveLocalStorage();
            tips.sort(function(a, b){
                return +a.baseInfo.number < +b.baseInfo.number ? 1 : -1;
            })
            generator.generate(tips,'dist/tips/' + self.lang, self.lang);
        });
    },
    _loadLocalStorage: function(){
        try{
            this.localStorage = JSON.parse(fs.readFileSync(this.localStorageFile));
        } catch(e) {
            this.localStorage = {};
        }
    },
    _saveLocalStorage: function(){
        fs.writeFileSync(this.localStorageFile,JSON.stringify(this.localStorage),'utf-8');
    },
    _synchronizeTips: function(remoteList, callback){
        var self = this;
        self.unsynchronized = remoteList.length;
        remoteList.forEach(function(item,index){
            var name = item.name;
            if(!self.localStorage[name] || self.localStorage[name].sha !== item.sha){
                github.request(item.git_url.replace('https://api.github.com',''),function(data){
                    var obj = JSON.parse(data);
                    self.localStorage[name] = {
                        name: name,
                        sha: item.sha,
                        content: new Buffer(obj.content,'base64').toString()
                    };
                    self._pushTip(self.localStorage[name], callback);
                })
            }else{
                self._pushTip(self.localStorage[name], callback);
            }
        })
    },
    _pushTip: function(item, callback){
        var self = this,
            name = item.name,
            content = item.content,
            baseInfo = content.match(/\-{3}[\s\S]+?\-{3}/)[0],
            detailInfo = content.replace(baseInfo,''),
            filename = name.substring(11, name.length-3) + '.html';

        self.tips.push({
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
        gutil.log(gutil.colors.green('synchronized: ') + self.lang + '/' + item.name);
        self.unsynchronized--;
        if(self.unsynchronized === 0){
            callback(self.tips);
        }
    }
}
module.exports = Synchronizer;