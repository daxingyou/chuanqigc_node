var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;
//分页查询
router.post('/', function(req, res) {
    //ajax 请求的参数
    var keyword = req.body;
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + '/publicInfo.action',{form:keyword}, function callback(err, httpResponse, body) {
            
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("Error caught by catch block", e);
            }

        });
    }
});


module.exports = router;
