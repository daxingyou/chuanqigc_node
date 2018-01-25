var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;


router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res) {
    request.post(glbpath + "getQuickPayment.action?userId=" + GlbParam.userId(req, res), function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            if (body.success) {
                var userInfo, cardInfo, isBank;
                userInfo = body.attributes;
                isBank = body.attributes.isBankCard;
                cardInfo = body.obj;
                if (isBank) {
                    console.log('11111111111111111111111');
                    res.render('usercenter/rechargeOwner', {
                        keywords: "",
                        description: "",
                        title: '充值',
                        body: body,
                        userInfo: userInfo,
                        cardInfo: cardInfo
                    });
                } else {
                    console.log('222222222222222222222222222');
                    res.render('usercenter/recharge', {
                        keywords: "",
                        description: "",
                        title: '充值',
                        body: body,
                        userInfo: userInfo
                    });
                }

            }
        } catch (e) {
            console.error("获取支付信息/recharge失败：", e);
        }
    });
});
router.post('/', function(req, res) {
    var data = req.body;
    data['userId'] = GlbParam.userId(req, res);
    if (data.userId) {
        if (req.xhr || req.accepts('json,html') == 'json') {
            request.post(glbpath + "okQuickPayment.action", {
                form: data
            }, function callback(err, httpResponse, body) {
                if (err) {
                    return console.error("error：" + err);
                }
                try {
                    body = JSON.parse(body);
                    // if (body.success) {
                    //     req.session.veriCode = body.msg;
                    // }
                    res.send(body);
                } catch (e) {
                    console.error("获取支付码/getCode失败：", e);
                }
            });
        }
    }

});

router.post('/getCode', function(req, res) {
    var data = req.body;
    data['userId'] = GlbParam.userId(req, res);
    if (data.userId) {
        request.post(glbpath + "getQuickPayCode.action", {
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
                console.error("获取支付码/getCode失败：", e);
            }
        });
    }

});

router.get('/newrecg', GlbParam.checkLogin);
router.get('/newrecg', function(req, res) {
    request.post(glbpath + "getQuickPayment.action?userId=" + GlbParam.userId(req, res), function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            var userInfo = body.attributes;
            if (body.success) {
                res.render('usercenter/recharge', {
                    keywords: "",
                    description: "",
                    title: '充值',
                    body: body,
                    userInfo: userInfo
                });
            }
        } catch (e) {
            console.error("新卡支付/newrecg失败：", e);
        }
    });
});
router.get('/success/:money', function(req, res) {
    res.render('usercenter/rechargeSuccess', {
        keywords: "",
        description: "",
        title: '充值成功',
        money: req.params.money
    });
});
router.get('/error', function(req, res) {
    res.render('usercenter/rechargeError', {
        keywords: "",
        description: "",
        title: '充值失败'
    });
});
module.exports = router;
