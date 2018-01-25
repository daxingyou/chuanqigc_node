var express = require('express');
var router = express.Router();
var http=require('http');
var request = require('request');
var GlbParam=require('../../modules/glbParam');
var glbpath=GlbParam.glbpath;
var picpath=GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    request.post(glbpath + "getMyPublicProject.action?userId="+GlbParam.userId(req,res), function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }

        try {
            body = JSON.parse(body);
            res.render('usercenter/publishYet', {
                keywords:"",
                description:"",
                title: '用户中心-发布的项目',
                projectList:body.attributes.projects,
                count:body.attributes.count,
                picpath:picpath
            });

        } catch (e) {
            console.error("usercenter/publicshYet失败", e);

        }

    })


});


router.get('/delete:id', GlbParam.checkLogin);
router.get('/delete/:id', function(req, res, next) {
    var projectId = req.params.id;
    if (projectId) {
        request.post(glbpath + "deleteMyPublicProject.action?projectId="+projectId, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }

            try {
                body = JSON.parse(body);
                console.log(body);
                res.redirect("/usercenter/releaseproject");

            } catch (e) {
                console.error("usercenter/publicshYet/delete失败", e);

            }

        })
    }
});


router.get('/subReview:id', GlbParam.checkLogin);
router.get('/subReview/:id', function(req, res, next) {
    var projectId = req.params.id;
    if (projectId) {
        request.post(glbpath + "submitCheck.action?projectId="+projectId, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }

            try {
                body = JSON.parse(body);
                res.redirect("/usercenter/releaseproject");

            } catch (e) {
                console.error("usercenter/publicshYet/subReview失败", e);

            }

        })
    }
});



router.post('/conPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getMyPublicProject.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("消息动态/usercenter/publishYet/conPage", e);
            }

        });
    }
});



module.exports = router;
