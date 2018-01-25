var express = require('express');
var router = express.Router();
var http=require('http');
var request = require('request');
var GlbParam=require('../../modules/glbParam');
var async = require('async');
var glbpath=GlbParam.glbpath;
var picpath=GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    async.map(
        [
            glbpath + 'getIndustryType.action', //获取行业类别列表
            glbpath + 'getAreaType.action', //获取省份信息
        ],
        request.post,
        function(err, results) {
            if (err) {
                return console.error("error：" + err);
            }
            //遍历请求的对象
            var resultsJson = [];
            try {
                for (var i in results) {
                    resultsJson.push(JSON.parse(results[i].body));
                }
                var industryList = resultsJson[0].attributes; //行业列表
                var areaType = resultsJson[1].attributes;  //省份列表
                res.render('usercenter/findProject', {
                    keywords:"",
                    description:"",
                    title: '项目发现者',
                    provinces: areaType.areas, //获取省份信息
                    industryList:industryList.industryList,
                    flag:false
                });
            } catch (e) {
                console.error("usercenter/publishProject/失败：", e);
            }

        }
    );

});

router.post('/', function(req, res) {
    var reqData = req.body;
    reqData["userId"] = GlbParam.userId(req,res);
    request.post(glbpath + "saveProjectFinderInfo.action", {form: reqData}, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }

        try {
            body = JSON.parse(body);
            res.render('usercenter/findProject', {
                title: '项目发现者',
                flag:true
            });
        } catch (e) {
            console.error("Error caught by catch block", e);

        }

    })
});



module.exports = router;
