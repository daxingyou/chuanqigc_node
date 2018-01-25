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
    request.post(glbpath+"discoverTale.action",function callback(err,httpResponse,body){
        if(err){
            return console.error("error："+err);
        }
        try{
            var body=JSON.parse(body);
            //遍历截取预热项目的简介
            var preHotProjects=body.attributes.preHotProjects;
            for(var i=0;i<preHotProjects.length;i++){
                for (var item in preHotProjects[i]) {
                    if (item == "shortIntroduce") {
                        preHotProjects[i][item]=GlbParam.cutString(preHotProjects[i][item],140);
                    }
                }
            }
            //遍历截取平台推荐的简介
            var hotProjects=body.attributes.hotProjects;
            for(var i=0;i<hotProjects.length;i++){
                for (var item in hotProjects[i]) {
                    if (item == "projectIntroduce") {
                        hotProjects[i][item]=GlbParam.cutString(hotProjects[i][item],140);
                    }
                }
                if(hotProjects[i].projectStatus==2){
                    var remainDay=GlbParam.remainDay(hotProjects[i].financeEndTime)
                    hotProjects[i]["remainDay"]=remainDay;
                }else if(hotProjects[i].projectStatus==1){
                    hotProjects[i]["preStartTime"]=(hotProjects[i].preheatStartTime!=null?hotProjects[i].preheatStartTime:"").substring(0,10)
                }
            }

            //获取剩余天数
            //
            res.render('findlegend', {
                keywords:"传奇工场,众筹项目,餐饮众筹项目,影视众筹项目,旅游众筹项目,众筹门户,众筹网站,股权众筹平台",
                description:"传奇工场,Much than money!餐饮众筹项目,影视众筹项目,投吃喝玩乐,上传奇工场！海量众筹项目,择优发布！优质项目碰撞优质资源,传奇众筹，不止筹钱那么简单！",
                title: '传奇众筹-我知道你要的不止是钱！海量众筹项目 择优发布！',
                picpath:picpath,
                hotProjects:hotProjects,//平台推荐
                preHotProjects:body.attributes.preHotProjects,//预热项目
                preHotCount:body.attributes.preHotCount//预热项目总数
            });
        }catch (e){
            console.error("/findlegend：", e);
        }
    });

});

router.post('/', function(req, res) {});


module.exports = router;
