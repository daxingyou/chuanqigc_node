var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    var userId = GlbParam.userId(req, res);
    request(glbpath + '/getNoticeList.action?userId=' + userId+'&pageNo=1', function callback(err, httpResponse, body) {
        if (err) {
            return console.error('error:', err);
        }
        try {
            var body = JSON.parse(body);
            if (body.success) {
                //var messageList = body.attributes.noticeList;
                res.render('usercenter/message', {
                    keywords:"",
                    description:"",
                    title: '消息动态',
                    messageList: body,
                    totalRecords:body.attributes.count
                });
            }
        } catch (e) {
            console.error("消息动态/usercenter/message", e);
        }
    });

});
//消息分页
router.post('/conPage', function(req, res) {
    //ajax 请求的参数
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/getNoticeList.action', {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("消息动态/usercenter/message/conPage", e);
            }

        });
    }
});
module.exports = router;
