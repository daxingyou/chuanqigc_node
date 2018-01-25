var express = require('express');
var router = express.Router();
var async=require('async');
var http=require('http');
var request = require('request');
var GlbParam=require('../../modules/glbParam');
var glbpath=GlbParam.glbpath;
var picpath=GlbParam.picpath;

router.get('/',GlbParam.checkLogin);
router.get('/', function(req, res, next) {
    var userId=GlbParam.userId(req,res);
    async.map(
        [
            glbpath + 'editUser.action?userId='+userId,  //获取用户编辑信息
            glbpath + 'getAreaType.action',  //获取省份信息
            glbpath + 'getDictionaryByDictionaryId.action?dictionaryId=222',  //获取能力资源标签
            glbpath + 'getDictionaryByDictionaryId.action?dictionaryId=223'  //获取个人资源标签
        ],
        request.post,
        function (err, results) {
            if (err) {
                return console.error("error：" + err);
            }
            //遍历请求的对象
            var resultsJson = [];
            try {

                for (var i in results) {
                    resultsJson.push(JSON.parse(results[i].body));
                }
                var edituser = resultsJson[0];
                var areaType = resultsJson[1].attributes;
                var labelsPower=resultsJson[2].obj;
                var labelsSelf=resultsJson[3].obj;
                res.render('usercenter/perfectData', {
                    keywords:"",
                    description:"",
                    title: '用户中心-完善信息',
                    userInfo:edituser.obj,
                    otherInfo:edituser.attributes,
                    provinces:areaType.areas,  //获取省份信息
                    slefLables:GlbParam.toArray(edituser.obj.slefLables),//个人资源标签-用户
                    personaLables:GlbParam.toArray(edituser.obj.personaLables),//能力资源标签-用户
                    labelsPower:labelsPower,   //能力资源标签
                    labelsSelf:labelsSelf,   //个人资源标签
                    picpath:picpath
                });
            } catch (e) {
                console.error("usercenter/perfectData失败：", e);
            }

        }
    );
});
//保存头像
router.post('/updatePhoto', function(req, res) {
    var userId=GlbParam.userId(req,res);
    var data=req.body;
    data["userId"]=userId;
    request.post(glbpath + "updatePhoto.action", {form: data}, function callback(err, httpResponse, body) {
       if (err) {
           return console.error("error：" + err);
       }
       try {
           body = JSON.parse(body);
           if(body.success){

           }
           res.send(body);
       } catch (e) {
           console.error("/usercenter/perfectData/updatePhoto失败", e);
       }
    });
});
//修改用户名
router.get('/updateNickName', GlbParam.checkLogin);
router.post('/updateNickName', function(req, res) {
    var userId=GlbParam.userId(req,res);
    var data=req.body;
    data["userId"]=userId;
    request.post(glbpath + "updateNickName.action", {form: data}, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            if (body.success) {
                res.locals.user["nickName"] = req.session.user["nickName"] = req.body.nickName;
            }
            res.send(body);
        } catch (e) {
            console.error("/usercenter/perfectData/updateNickName失败", e);
        }
    });
});

//修改收货地址
router.post('/deliveryAddress', function(req, res) {
    var userId=GlbParam.userId(req,res);
    var data=req.body;

    data["userId"]=userId;
    request.post(glbpath + "saveDeliveryAddress.action", {form: data}, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/usercenter/perfectData/deliveryAddress失败", e);
        }
    });
});
//修改个性标签
router.post('/saveUserLabel', function(req, res) {
    var userId=GlbParam.userId(req,res);
    var data=req.body;
    data["userId"]=userId;
    request.post(glbpath + "saveUserLabel.action", {form: data}, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);

        } catch (e) {
            console.error("/usercenter/perfectData/saveUserLabel失败", e);
        }
    });
});
//修改其他信息
router.post('/saveUserDetail', function(req, res) {
    var userId=GlbParam.userId(req,res);
    var data=req.body;
    data["userId"]=userId;
    request.post(glbpath + "saveUserDetail.action", {form: data}, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }

        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/usercenter/perfectData/saveUserDetail失败", e);
        }
    });
});

module.exports = router;
