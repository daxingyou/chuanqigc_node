var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var async = require('async');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    request.post(glbpath + "getMyLoveList.action?userId=" + GlbParam.userId(req, res), function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }

        try {
            body = JSON.parse(body);
            res.render('usercenter/likebrand', {
                keywords:"",
                description:"",
                title: '用户中心-认购的项目',
                projectFocus: body.obj,
                count: body.attributes.count,
                picpath: picpath
            });

        } catch (e) {
            console.error("usercenter/projectBuy失败", e);

        }

    });

});

router.post('/conPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getMyLoveList.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("消息动态/usercenter/projectBuy/conPage", e);
            }

        });
    }
});




module.exports = router;
