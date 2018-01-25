var express = require('express');
var router = express.Router();
var http=require('http');
var request = require('request');
var GlbParam=require('../../modules/glbParam');
var glbpath=GlbParam.glbpath;
var picpath=GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    request.post(glbpath + "getMyFocusProject.action?userId="+GlbParam.userId(req,res), function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.render('usercenter/loveBrand', {
                keywords:"",
                description:"",
                title: '用户中心-爱品牌项目',
                projectList:body.attributes.projects,
                count:body.attributes.count,
                picpath:picpath
            });
        } catch (e) {
            console.error("usercenter/loveBrand失败", e);

        }

    })

});

router.post('/conPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getMyFocusProject.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("消息动态/usercenter/loveBrand/conPage", e);
            }

        });
    }
});



module.exports = router;
