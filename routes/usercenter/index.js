var express = require('express');
var router = express.Router();
var http=require('http');
var request = require('request');
var GlbParam=require('../../modules/glbParam');
var glbpath=GlbParam.glbpath;
var picpath=GlbParam.picpath;

router.get('/',GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    //var data={"userId":GlbParam.userId(req,res)}
    //var data={"userId":"6fb8bdf4ce414b75adc494e4f8431d03"}
    request(glbpath + 'userCenter.action?userId='+GlbParam.userId(req,res), function callback(err, httpResponse, body) {
        if (err) {
            return console.error('error:', err);
        }
        try {
            var body = JSON.parse(body);
            res.render('usercenter/index', {
                keywords:"",
                description:"",
                title: '用户中心',
                userInfo:body.obj,
                picpath:picpath,
                account:body.attributes,
                slefLables:GlbParam.toArray(body.obj.slefLables),//自定义标签
                personaLables:GlbParam.toArray(body.obj.personaLables),//个性化义标签
                balance:GlbParam.formatMoney(body.attributes.virtualAccount.balance),//资金总览
                activeBalance:GlbParam.formatMoney(body.attributes.virtualAccount.activeBalance),//可用资金
                freezeBalance:GlbParam.formatMoney(body.attributes.virtualAccount.freezeBalance)//冻结资金
            });
        } catch (e) {
            console.error("usercenter/失败：", e);
        }
    })
});

router.post('/', function(req, res) {
});



module.exports = router;
