var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');
var GlbParam = require('../modules/glbParam');
var glbpath = GlbParam.glbpath;
var crypto = require('crypto'); //生成散列值加密密码


/*注册*/
router.get('/', function(req, res) {
    res.render('register', {
        title: "注册",
        user: req.session.user
    });
});
router.post('/', function(req, res) {
    var data = req.body;
    var md5 = crypto.createHash('md5');
    data["password"] = md5.update("lingdong" + data.password).digest('hex');
    var veriCode=req.body.veriCode;
    if (veriCode != req.session.veriCode) {
        res.send({
            "success":false,
            "msg":"验证码错误"
        })
        return false;
    }
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + "register" + ".action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error:" + error);
            }
            try {
                body = JSON.parse(body);
                if (body.obj != null) {
                    data.id = body.obj.id;
                }
                if (body.success) {
                    var user = req.session.user = body.obj;
                }
                res.send(body);
            } catch (e) {
                console.error("注册/register失败：", e);
            }
        })
    } else {
        res.redirect(303, "/register")
    }
});
router.post('/veriCodeCheck', function(req, res) {
    var veriCode=req.body.veriCode;
    var flag;
    if (veriCode == req.session.veriCode) {
        flag=true;
    } else {
        flag=false;
    }
    res.send(flag);
});
//获取验证码
router.post('/telcheck', function(req, res) {
    var data = req.body;
    //根据ip防止多次获取验证码
    var ip = GlbParam.getClientIp(req);
    if (!req.session.ipInfo) {
        req.session.ipInfo = {
            "ip": ip,
            "count": 0
        };
    } else {
        req.session.ipInfo.count++;
    }
    if (ip == req.session.ipInfo.ip) {
        if (req.session.ipInfo.count > 6) {
            res.send({
                "success": false,
                "msg":"您获取验证码的次数太多了，请稍候再试！"
            });
            return false;
        }
    }
    request.post(glbpath + "getRegVeriCode" + ".action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            if (body.success) {
                req.session.veriCode = body.msg;
            }
            res.send(body);
        } catch (e) {
            console.error("获取验证码/telcheck失败：", e);
        }
    });
});
router.post('/verifyPhoneExist', function(req, res) {
    var data = req.body;
    request.post(glbpath + "verifyPhoneExist.action", {form: data}, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body.success);
        } catch (e) {
            console.error("判断手机号是否注册/verifyPhoneExist失败：", e);
        }
    });
});






module.exports = router;
