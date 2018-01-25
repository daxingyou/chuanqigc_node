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

    request.post(glbpath+"index.action",function callback(err,httpResponse,body){
        if(err){
            return console.error("error："+err);
        }
        try{
            var body=JSON.parse(body);
            res.render('projectrun', {
                keywords:"传奇工场,众筹项目,餐饮众筹项目,影视众筹项目,旅游众筹项目,众筹门户,众筹网站,股权众筹平台",
                description:"传奇工场,Much than money!餐饮众筹项目,影视众筹项目,投吃喝玩乐,上传奇工场！海量众筹项目,择优发布！优质项目碰撞优质资源,传奇众筹，不止筹钱那么简单！",
                title: '传奇众筹-我知道你要的不止是钱！海量众筹项目 择优发布！',
            });
        }catch (e){
            console.error("/projectrun：", e);
        }
    });

});

router.post('/', function(req, res) {});


module.exports = router;
