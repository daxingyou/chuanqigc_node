var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;
var crypto = require('crypto'); //生成散列值加密密码

router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    var userId = GlbParam.userId(req, res);
    if (userId) {
        async.map(
            [
                glbpath + 'getMyBindBankCard.action?userId=' + userId, //获取银行卡信息
                glbpath + 'getAreaType.action', //获取省份信息
                glbpath + 'getUserByUserId.action?userId=' + userId, //获取省份信息
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
                    var bank = resultsJson[0].attributes.bank;
                    var areaType = resultsJson[1].attributes;
                    var number;
                    if (bank.bankCardNum != null) {
                        number = bank.bankCardNum.substring(bank.bankCardNum.length - 4, bank.bankCardNum.length);
                    } else {
                        number = "";
                    }
                    var userinfo = resultsJson[2].obj;
                    res.render('usercenter/safeSet', {
                        keywords:"",
                        description:"",
                        title: '安全设置',
                        Bank: bank, //绑定银行卡信息
                        provinces: areaType.areas, //获取省份信息
                        bankCardNum: bank.bankCardNum, //处理银行卡号
                        phoneNo: GlbParam.ReplacePhone(bank.phoneNo), //替换手机号码
                        number: number,
                        userinfo: userinfo
                    });
                } catch (e) {
                    console.error("安全设置usercenter/safeSet失败：", e);
                }

            }
        );
    }
});
//修改密码
router.get('/updatePwd', GlbParam.checkLogin);
router.post('/updatePwd', function(req, res) {
    if (req.cookies.islogin) {
        res.clearCookie('islogin');
    }
    var data = req.body;
    var md5 = crypto.createHash('md5');
    var md52 = crypto.createHash('md5');
    data["password"] = md5.update("lingdong" + data.password).digest('hex');
    data["oldPwd"] = md52.update("lingdong" + data.oldPwd).digest('hex');
    var updateData = {
        userId: GlbParam.userId(req, res),
        password: data.password,
        oldPwd: data.oldPwd
    };
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + "updatePassword.action", {
            form: updateData
        }, function callback(err, httpResponse, yzbody) {
            if (err) {
                return console.error("error:" + error);
            }
            try {
                yzbody = JSON.parse(yzbody);
                res.send(yzbody);
            } catch (e) {
                console.error("修改密码/usercenter/safeset/updatePwd失败：", e);
            }
        });
    }
});
//实名认证
router.get('/authentication', GlbParam.checkLogin);
router.post('/authentication', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    if (data.userId) {
        request.post(glbpath + "verifiedUser.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("实名认证/usercenter/safeset/authentication失败", e);
            }
        });
    }
});

//绑定邮箱 插入数据 
router.post('/bindEmail', function(req, res) {
    var data = req.body;
    data["userId"] = req.session.user.id;
    if (data.userId) {
        request.post(glbpath + "bindMail.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                console.log(body)
                res.send(body);
            } catch (e) {
                console.error("绑定邮箱/usercenter/safeset/bindEmail失败：", e);
            }
        });
    }

});
//获取市/区县功能
router.post('/getCity', function(req, res) {
    var data = req.body;
    request.post(glbpath + "getAreaByFatherId.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("获取省市/usercenter/safeset/getCity失败", e);

        }

    });

});
router.get('/veriCodeCheck', function(req, res) {
    var fieldValue = req.query.fieldValue;
    var fieldId = req.query.fieldId;
    var str;
    if (fieldValue == req.session.IsVeriCode) {
        str = "{\"jsonValidateReturn\":[\"" + fieldId + "\",\"" + "" + "\",true]}";
    } else {
        str = "{\"jsonValidateReturn\":[\"" + fieldId + "\",\"" + "验证码输入错误！" + "\",false]}";
    }
    res.send(JSON.parse(str));
});
router.get('/success', function(req, res) {
    var isVeri = req.query.IsVeriCode;
    var isOk;
    if (isVeri) {
        if (isVeri == 'true') {
            isOk = true;
        } else {
            isOk = false;
        }
        res.render('mailsuccess', {
            keywords:"",
            description:"",
            title: '验证邮箱成功！',
            isOk: isOk
        });
    }

});

// 验证邮箱绑定功能
router.get('/bindMail', function(req, res) {
    var userId = req.query.userId;
    var finalCode = req.query.finalCode;
    request.post(glbpath + "verifiedMail.action?userId=" + userId + '&finalCode=' + finalCode, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            if (body.success) {
                res.redirect('/usercenter/safeset/success?IsVeriCode=true');
            } else {
                res.redirect('/usercenter/safeset/success?IsVeriCode=false');
            }
            //res.send(body);
        } catch (e) {
            console.error("验证邮箱绑定功能/usercenter/safeset/bindMail失败：", e);
        }
    });
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
                req.session.IsVeriCode = body.msg;
            }
            res.send(body);
        } catch (e) {
            console.error("获取验证码/usercenter/safeset/telcheck失败：", e);
        }
    });
});
//增加或修改银行卡时
router.get('/bindBank', GlbParam.checkLogin);
router.post('/bindBank', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    if (data.userId) {
        request.post(glbpath + "bindBankCard.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                if (body.success) {
                    res.send(body);
                } else {
                    res.send(body);
                }
            } catch (e) {
                console.error("绑定银行卡/usercenter/safeset/bindBank失败", e);

            }
        });
    }

});
module.exports = router;
