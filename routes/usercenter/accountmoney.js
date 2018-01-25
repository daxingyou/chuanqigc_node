var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;
//getAccountInfo
router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    var userId = GlbParam.userId(req, res);
    var date = new Date(); //.转换成毫秒
     var startTime = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()) : (date.getMonth())) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())+" "+(date.getHours() < 10 ? '0' + (date.getHours()) : (date.getHours()))+":"+(date.getMinutes() < 10 ? '0' + (date.getMinutes()) : (date.getMinutes()))+":"+(date.getSeconds() < 10 ? '0' + (date.getSeconds()) : (date.getSeconds()));
    var endTime = date.getFullYear() + "-" + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())+" "+(date.getHours() < 10 ? '0' + (date.getHours()) : (date.getHours()))+":"+(date.getMinutes() < 10 ? '0' + (date.getMinutes()) : (date.getMinutes()))+":"+(date.getSeconds() < 10 ? '0' + (date.getSeconds()) : (date.getSeconds()));
    if (userId) {
        async.map(
            [
                glbpath + 'getAccountInfo.action?userId=' + userId, //账户资金接口
                glbpath + 'getAccountIncomeExpendDetail.action?userId=' + userId + "&pageNo=1&startTime=" + startTime + '&endTime=' + endTime, //账户资金明细接口
                glbpath + 'getUserByUserId.action?userId=' + userId,

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
                    var account = resultsJson[0];
                    var List = resultsJson[1];
                    var edituser = resultsJson[2];
                    res.render('usercenter/accountmoney', {
                        keywords:"",
                        description:"",
                        title: '账户资金',
                        userInfo: edituser.obj,
                        picpath: picpath,
                        myaccount: account, //绑定我的账户 count
                        infoList: List,
                        totalRecords: List.attributes.count,
                        pageNum:List.attributes.pageNum
                    });
                } catch (e) {
                    console.error("我的账户usercenter/accountmoney失败：", e);
                }

            }
        );
    }
});
//用户提现
router.post('/chargemoney', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    
    if (data.userId) {
        request.post(glbpath + "pickMoney.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("提现/usercenter/accountmoney/chargemoney", e);
            }
        });
    }
});
//用户充值
router.post('/Rechargemoney', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + '/onLineRecharge.action', {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("充值/usercenter/accountmoney/Rechargemoney失败：", e);
        }
    });
});
//分页查询
router.post('/conPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getAccountIncomeExpendDetail.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("我的账户/usercenter/accountmoney/conPage", e);
            }

        });
    }
});
module.exports = router;
