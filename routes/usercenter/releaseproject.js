var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var async = require('async');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
//发布项目首次加载
router.get('/', function(req, res, next) {
    request.post(glbpath + "getMyPublicProject.action?userId=" + GlbParam.userId(req, res), function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }

        try {
            body = JSON.parse(body);
            res.render('usercenter/releaseproject', {
                keywords:"",
                description:"",
                title: '用户中心-发布的项目',
                projectList: body.attributes.projects,
                count: body.attributes.count,
                picpath: picpath
            });

        } catch (e) {
            console.error("usercenter/releaseproject失败", e);

        }

    });

});
//发布项目-分页查询
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
                console.error("消息动态/usercenter/projectBuy/conPage", e);
            }

        });
    }
});

//发布项目-投品牌
router.get('/investmentbrand/:id', function(req, res, next) {
    var projectId, projectType;
    if (req.params.id) {
        projectId = req.params.id;
        projectType = req.query.projectType;
    }
    if (projectId) {
        request.post(glbpath + "getMyPublicInvestmentBrand.action?projectId=" + projectId + '&projectType=' + projectType, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                console.log(body.obj);
                res.render('usercenter/detailedinvestmentbrand', {
                    keywords:"",
                    description:"",
                    title: '用户中心-投品牌',
                    projectList: body.obj,
                    count: body.attributes.count,
                    picpath: picpath,
                    projectId: projectId,
                    projectType:projectType
                });

            } catch (e) {
                console.error("usercenter/<releaseproject></releaseproject>/investmentbrand/:id失败", e);

            }
        });
    }
});
// 发布项目-投品牌分页查询
router.post('/investmentconPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getMyPublicInvestmentBrand.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("消息动态/usercenter/releaseproject/investmentconPage", e);
            }

        });
    }
});
//发布项目-帮品牌 
router.get('/brand/:id', function(req, res, next) {
    var projectId;
    if (req.params.id) {
        projectId = req.params.id;
    }
    if (projectId) {
        request.post(glbpath + "getMyPublicBrand.action?projectId=" + projectId, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                console.log(body.obj);
                res.render('usercenter/detailedbang', {
                    keywords:"",
                    description:"",
                    title: '用户中心-帮品牌',
                    projectList: body.obj,
                    count: body.attributes.count,
                    picpath: picpath,
                    projectId: projectId
                });

            } catch (e) {
                console.error("usercenter/detailedbang失败", e);

            }
        });
    }
});
// 发布项目-帮品牌分页查询
router.post('/bangbrandconPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getMyPublicBrand.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("消息动态/usercenter/releaseproject/conPage", e);
            }

        });
    }
});
//发布项目-爱品牌 
router.get('/lovebrand/:id', function(req, res, next) {
    var projectId;
    if (req.params.id) {
        projectId = req.params.id;
    }
    if (projectId) {
        request.post(glbpath + "getMyPublicLoveBrand.action?projectId=" + projectId, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.render('usercenter/detailedlovebrand', {
                    keywords:"",
                    description:"",
                    title: '用户中心-帮品牌',
                    projectList: body.obj,
                    count: body.attributes.count,
                    picpath: picpath,
                    projectId: projectId
                });

            } catch (e) {
                console.error("usercenter/lovebrand失败", e);

            }
        });
    }
});
// 发布项目-爱品牌分页查询
router.post('/loveBrandconPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getMyPublicLoveBrand.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("消息动态/usercenter/projectBuy/loveBrand/conPage", e);
            }

        });
    }
});

module.exports = router;
