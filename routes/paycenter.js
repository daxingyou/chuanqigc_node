var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');
var GlbParam = require('../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

/* GET home page. */
router.get('/:id/:name/:count', GlbParam.checkLogin);
router.get('/:id/:name/:count', function(req, res, next) {
    var projectId=req.params.id;
    var count=req.params.count;
    var userId=GlbParam.userId(req,res);
    var projectName=req.params.name;
    request.post(glbpath + "projectDetail.action?projectId="+projectId,function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            var industry=body.obj;
            var totalPart=parseInt(((industry.financialAmount-industry.projectAmount)/industry.lowAmount));//总份数
            var bigPart=totalPart-parseInt(industry.totalPurchase/industry.lowAmount);//可购买份数
            bigPart=bigPart>0?bigPart:0;
            request.post(glbpath + "getAccountInfo.action?userId="+userId,function callback(err, httpResponse, body) {
                if (err) {
                    return console.error("error：" + err);
                }
                try {
                    body = JSON.parse(body);
                    res.render('paycenter', {
                        keywords:"",
                        description:"",
                        title: '传奇工场_支付中心',
                        projectId:projectId,
                        count:count,
                        activeBalance:body.obj.activeBalance,//账户信息
                        lowAmount:industry.lowAmount,
                        projectName:projectName,
                        bigPart:bigPart//剩余份数
                    });
                } catch (e) {
                    console.error("/paycenter", e);
                }
            });

        } catch (e) {
            console.error("/paycenter", e);
        }
    });

});

router.post('/', function(req, res) {});


module.exports = router;
