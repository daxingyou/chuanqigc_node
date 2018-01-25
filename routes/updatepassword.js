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
    res.render('updatepassword', {
        keywords:"",
        description:"",
        title: "修改密码"
    });
});
router.get('/success', function(req, res, next) {
    res.render('successpassword', {
        keywords:"",
        description:"",
        title: '密码重置成功'
    });
});
router.get('/set', function(req, res, next) {
    res.render('setpasswrod', {
        keywords:"",
        description:"",
        title: '忘记密码'
    });
});
//修改密码
router.post('/updatePwd', function(req, res) {
    if (req.cookies.islogin) {
        res.clearCookie('islogin');
    }
    var data = req.body;
    var md5 = crypto.createHash('md5');
    data["password"] = md5.update("lingdong" + data.password).digest('hex');
    var updateData;
    if (req.session.forgetPhone !== null) {
        updateData = {
            phone: req.session.forgetPhone,
            password: data.password
        };
        if (req.xhr || req.accepts('json,html') == 'json') {
            // 判断与旧密码是否相同
            request.post(glbpath + "resetPassword.action", {
                form: updateData
            }, function callback(err, httpResponse, yzbody) {
                if (err) {
                    return console.error("error:" + error);
                }
                try {
                    yzbody = JSON.parse(yzbody);
                    res.send(yzbody);
                } catch (e) {
                    console.error("修改密码/updatepassword/updatePwd失败：", e);
                }
            });
        }
    }
});


//验证手机号码是否成功
router.post("/", function(req, res) {
    var data = req.body;
    console.log(req.session.uIsVeriCode);
    if (data.veriCode === req.session.uIsVeriCode) {
        if (req.xhr || req.accepts('json,html') == 'json') {
            request.post(glbpath + "validUserPhone.action", {
                form: data
            }, function callback(err, httpResponse, body) {
                if (err) {
                    return console.error("error：" + err);
                }
                try {
                    body = JSON.parse(body);
                    console.log(body);
                    if (body.success) {
                        req.session.forgetPhone = body.msg;
                    }
                    res.send(body);
                } catch (e) {
                    console.error("重置密码/updatepassword失败：", e);
                }
            });
        }
    } else {
        res.redirect(303, "/register");
    }
});
router.get('/veriCodeCheck', function(req, res) {
    var veriCode = req.query.veriCode;
    var flag;
    if (req.session.uIsVeriCode === null) {
        flag = false;
    } else {
        if (veriCode == req.session.uIsVeriCode) {
            flag = true;
        } else {
            flag = false;
        }
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
                "often": true
            });
            return false;
        }
    }
    request.post(glbpath + "getResetVeriCode" + ".action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            if (body.success) {
                req.session.uIsVeriCode = body.msg;
            }
            res.send(body);
        } catch (e) {
            console.error("获取验证码/updatepassword/telcheck失败：", e);
        }
    });
});
module.exports = router;
