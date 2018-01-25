var express = require('express');
var router = express.Router();
var http=require('http');
var request = require('request');
var GlbParam=require('../../modules/glbParam');
var glbpath=GlbParam.glbpath;
var picpath=GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    res.render('usercenter/myProject', {
        keywords:"",
        description:"",
        title: '用户中心-我的项目'
    });
});

module.exports = router;
