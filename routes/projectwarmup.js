var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');
var GlbParam = require('../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

/* GET home page. */
router.get('/', function(req, res, next) {

    request.post(glbpath+"preHotProject.action",function callback(err,httpResponse,body){
        if(err){
            return console.error("error："+err);
        }
        try{
            var body=JSON.parse(body);
            //遍历格式化货币格式以及截取简介
            var projectList=body.attributes.projects;
            for(var i=0;i<projectList.length;i++){
                for (var item in projectList[i]) {
                    if(item=="lowAmount"){
                        projectList[i][item]=GlbParam.formatMoney(projectList[i][item]);
                    }
                    if(item=="investorAmount"){
                        projectList[i][item]=GlbParam.formatMoney(projectList[i][item]);
                    }
                    if(item=="shortIntroduce"){
                        projectList[i][item]=GlbParam.cutString(projectList[i][item],140);
                    }
                }
            }

            res.render('projectwarmup', {
                keywords:"传奇工场,众筹项目,餐饮众筹项目,影视众筹项目,旅游众筹项目,众筹门户,众筹网站,股权众筹平台",
                description:"传奇工场,Much than money!餐饮众筹项目,影视众筹项目,投吃喝玩乐,上传奇工场！海量众筹项目,择优发布！优质项目碰撞优质资源,传奇众筹，不止筹钱那么简单！",
                title: '传奇众筹-我知道你要的不止是钱！海量众筹项目 择优发布！',
                picpath:picpath,
                projectList:projectList,
                count:body.attributes.count,//预热项目总数
                pageNum:body.attributes.pageNum
            });
        }catch (e){
            console.error("/projectwarmup：", e);
        }
    });

});

router.post('/conPage', function(req, res) {
    var data=req.body;
    request.post(glbpath+"preHotProject.action?pageNo="+data.pageNo,function callback(err,httpResponse,body){
        if(err){
            return console.error("error："+err);
        }
        try{
            var body=JSON.parse(body);
            //遍历格式化货币格式以及截取简介
            var projectList=body.attributes.projects;
            for(var i=0;i<projectList.length;i++){
                for (var item in projectList[i]) {
                    if(item=="lowAmount"){
                        projectList[i][item]=GlbParam.formatMoney(projectList[i][item]);
                    }
                    if(item=="investorAmount"){
                        projectList[i][item]=GlbParam.formatMoney(projectList[i][item]);
                    }
                    if(item=="shortIntroduce"){
                        projectList[i][item]=GlbParam.cutString(projectList[i][item],140);
                    }
                    projectList[i]["preheatTime"]=new Date(projectList[i]["preheatEndTime"]).getTime()/1000;
                }
            }
            res.send(body);
        }catch (e){
            console.error("/projectwarmup：", e);
        }
    });
});


module.exports = router;
