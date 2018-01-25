var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');
var request = require('request');
var fs = require('fs');
var GlbParam = require('../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

/* GET home page. */

router.get('/:id', function(req, res, next) {
    var projectId = req.params.id;
    var userId = GlbParam.userId(req, res);
    async.map(
        [
            glbpath + 'getProjectBrandByProjectId.action?projectId=' + projectId, //获取项目投品牌、邦品牌、爱品牌的相关信息
            glbpath + 'projectDetail.action?projectId=' + projectId, //获取项目详情
            glbpath + 'getAccountInfo.action?userId=' + userId,
            glbpath + 'getPostList.action?projectId=' + projectId + "&&pageNo=1", //获取项目交流提问题列表
            glbpath + 'getReplyList.action?projectId=' + projectId + "&&pageNo=1" //获取项目交流回帖列表
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
                var projectBrand = resultsJson[0].attributes.projectBrand; //获取项目投品牌、邦品牌、爱品牌的相关信息
                var industry = resultsJson[1]; //获取项目详情
                var accountInfo = resultsJson[2]; //获取用户账户信息

                var postList = resultsJson[3].attributes; //获取项目交流提问问题列表
                var replayList = resultsJson[4].attributes; //获取项目交流回帖列表

                //遍历设置品牌截取字符
                for (var item in projectBrand) {
                    if (item == "projectname") {
                        projectBrand[item] = GlbParam.cutString(projectBrand[item], 28);
                    } else if (item == "bangbrand") {
                        projectBrand["bangbrand1"] = GlbParam.cutString(projectBrand[item], 72);
                    } else if (item == "aibrand") {
                        projectBrand["aibrand1"] = GlbParam.cutString(projectBrand[item], 72);
                    } else if (item == "toubrand") {
                        projectBrand["toubrand1"] = GlbParam.cutString(projectBrand[item], 72);
                    } else if (item == "moneyHelp") {
                        projectBrand["moneyHelp"] = GlbParam.toArray(projectBrand[item]); //金钱支持id转为数组
                    } else if (item == "humanHelp") {
                        projectBrand["humanHelp"] = GlbParam.toArray(projectBrand[item]); //个人能力支持id转为数组
                    } else if (item == "resourceHelp") {
                        projectBrand["resourceHelp"] = GlbParam.toArray(projectBrand[item]); //资源支持id转为数组
                    } else if (item == "moneyHelpName") {
                        projectBrand["moneyHelpName"] = GlbParam.toArray(projectBrand[item]); //金钱支持转为数组
                    } else if (item == "humanHelpName") {
                        projectBrand["humanHelpName"] = GlbParam.toArray(projectBrand[item]); //个人能力支持转为数组
                    } else if (item == "resourceHelpName") {
                        projectBrand["resourceHelpName"] = GlbParam.toArray(projectBrand[item]); //资源支持转为数组
                    } else if (item == "fundCard") {
                        projectBrand["fundCard"] = GlbParam.toArray(projectBrand[item]); //爱品牌资金卡
                    }
                }
                //遍历审核信息把pictures字符串转为数组
                var auditList = industry.attributes.auditList;
                for (var i = 0; i < auditList.length; i++) {
                    for (var item in auditList[i]) {
                        if (item == "pictures") {
                            auditList[i][item] = GlbParam.toArray(auditList[i][item]);
                        }
                    }
                }
                //遍历截取平台推荐的简介
                var hotProjects = industry.attributes.hotProject;
                for (var i = 0; i < hotProjects.length; i++) {
                    for (var item in hotProjects[i]) {
                        if (item == "projectIntroduce") {
                            hotProjects[i][item] = GlbParam.cutString(hotProjects[i][item], 140);
                        }
                    }
                    if (hotProjects[i].projectStatus == 2) {
                        var remainDay = GlbParam.remainDay(hotProjects[i].financeEndTime)
                        hotProjects[i]["remainDay"] = remainDay;
                    } else if (hotProjects[i].projectStatus == 1) {
                        hotProjects[i]["preStartTime"] = (hotProjects[i].preheatStartTime != null ? hotProjects[i].preheatStartTime : "").substring(0, 10)
                    }
                }

                var totalPart = parseInt(((industry.obj.financialAmount - industry.obj.projectAmount) / industry.obj.lowAmount)); //总份数
                var bigPart = totalPart - parseInt(industry.obj.totalPurchase / industry.obj.lowAmount); //可购买份数

                bigPart = bigPart > 0 ? bigPart : 0;
                //获取省市
                var data = {
                    provinceId: industry.obj.province,
                    cityId: industry.obj.city,
                    countyId: industry.obj.county
                };
                request.post(glbpath + "getAreaNameById.action", {
                    form: data
                }, function callback(err, httpResponse, body) {
                    if (err) {
                        return console.error("error：" + err);
                    }
                    try {
                        body = JSON.parse(body);
                        var dateStart = new Date();
                        dateStart = dateStart.getTime(); //服务器当前时间
                        var preheatEndTime = new Date(industry.obj.preheatEndTime);
                        preheatEndTime = preheatEndTime.getTime(); //预热结束时间
                        var financeEndTime = new Date(industry.obj.financeEndTime);
                        financeEndTime = financeEndTime.getTime(); //融资结束时间
                        console.log(industry.attributes);
                        res.render('proInfo', {
                            keywords: "",
                            description: "",
                            title: '传奇工场_项目详情',
                            datePre: preheatEndTime - dateStart, //预热时间差
                            dateFin: financeEndTime - dateStart, //融资时间差
                            projectBrand: projectBrand,
                            industry: industry.attributes,
                            proIndustry: industry.obj,
                            shortIntroduce: GlbParam.cutString(industry.obj.shortIntroduce, 32),
                            projectId: projectId,
                            picpath: picpath,
                            province: body.attributes.provinceName, //省
                            city: body.attributes.cityName, //市
                            county: body.attributes.countyName, //县
                            accountInfo: accountInfo.obj, //账户信息
                            peopleNum: industry.obj.peopleNum, //已预约购买人数
                            totalPart: totalPart, //总份数
                            bigPart: bigPart, //最大购买(可投)份数
                            postList: postList, //获取项目交流提问问题列表
                            replayList: replayList //获取项目交流回帖列表
                        });
                    } catch (e) {
                        console.error("/proInfo111失败", e);
                    }
                });

            } catch (e) {
                console.error("/proInfo222失败：", e);
            }

        }
    );

});

router.post('/', function(req, res) {});


//保存帮品牌信息
router.post('/saveOrUpdateProjectBangBrand', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + "saveOrUpdateProjectBangBrand.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/proInfo保存帮品牌信息", e);
        }
    });
});


//爱品牌购买老板卡
router.post('/buyBossCard', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + "buyBossCard.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/proInfo保存爱品牌信息", e);
        }
    });
});
//预约购买保存
router.post('/saveOrder', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    console.log(data)
    request.post(glbpath + "saveOrder.action", {
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
            console.error("/proInfo预约购买保存", e);
        }
    });
});
//成功页面
router.get('/success/paycentersuccess', GlbParam.checkLogin);
router.get('/success/paycentersuccess', function(req, res) {
    res.render('paycentersuccess', {
        title: '传奇工场_支付成功'
    });
});
//提交回复
router.post('/saveProjectPost', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + "saveProjectPost.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/proInfo提交保存", e);
        }
    });
});
//获取帖子
router.post('/getPostList', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + "getPostList.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/proInfo提交保存", e);
        }
    });
});
//提交回贴
router.post('/saveProjectReply', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + "saveProjectReply.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/proInfo提交回帖", e);
        }
    });
});
//获取回帖列表
router.post('/getReplyList', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + "getReplyList.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/proInfo提交回帖", e);
        }
    });
});


module.exports = router;
