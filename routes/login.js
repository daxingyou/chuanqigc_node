var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');
var GlbParam = require('../modules/glbParam');
var ccap = require('ccap')(); //验证码
var glbpath = GlbParam.glbpath;
var crypto = require('crypto'); //生成散列值加密密码

/*登录*/

router.get('/', function(req, res) {
    res.render('login', {
        title: "登录",
        user: req.session.user
    });
});
/*生成验证码*/
router.get('/getcaptcha', function(req, res) {
    var ary = ccap.get();
    var txt = ary[0].toLocaleString().toLowerCase();
    var buf = ary[1];
    req.session.ccapimg = txt; //把验证码信息存入session中
    res.end(buf);
});
/*验证验证码是否成功，成功返回1，否则返回0*/
router.get('/checkccapimg', function(req, res) {
    var vericcap = req.query.vericcap.toLocaleString().toLowerCase();
    var flag;
    console.log(req.session.ccapimg);
    console.log(vericcap);
    if (vericcap == req.session.ccapimg) {
        flag = true;
    } else {
        flag = false;
    }
    res.send(flag);
});
//获取isCookies
router.get('/isCookies', function(req, res) {
    var cookies;

    if (req.cookies.islogin) {
         cookies={
            userName:req.cookies.islogin.userName,
            password:GlbParam.decrypt(req.cookies.islogin.password,'userinfo')
        };
    } else {
        console.log('usecookies-cookies' + req.cookies.islogin);
    }
    res.send(cookies);
});

/*用户登录*/
router.post('/', function(req, res) {
    var data = req.body;
    var md5 = crypto.createHash('md5');
    var newPassword=GlbParam.encrypt(data.password,'userinfo');
    data["password"] = md5.update("lingdong" + data.password).digest('hex');

    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/login.action', {
            form: data
        }, function callback(err, httpResponse, body) {

            if (err) {
                return console.error('失败:', err);
            }
            try {
                var bodyStr = JSON.parse(body);
                //用户名密码都匹配后，将用户信息存入session
                if (bodyStr.success) {
                    if (data.isCheck === 'true') {
                        var cookie = {
                            userName: bodyStr.obj.userName,
                            password: newPassword
                        };
                        console.log(cookie);
                        res.cookie('islogin', cookie, {
                            maxAge: 7 * 24 * 60 * 60 * 1000
                        });
                    } else {
                        if (req.cookies.islogin) {
                            res.clearCookie('islogin');
                        }
                    }
                    req.session.user = bodyStr.obj;
                }
                res.send(bodyStr);
            } catch (e) {
                console.error("登录/login失败：", e);
            }
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
