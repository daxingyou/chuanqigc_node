var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

router.get('/', GlbParam.checkLogin);
router.get('/', GlbParam.getUserInfo);
router.get('/', function(req, res, next) {
    var projectId;
    if (req.query.projectId) {
        projectId = req.query.projectId;
    }
    if (projectId) {
        request.post(glbpath + "getProjectInfoById.action?projectId=" + projectId, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                var project = body.obj;
                if (body.success) {
                    async.map(
                        [
                            glbpath + 'getIndustryType.action', //获取行业类别列表
                            glbpath + 'getAreaType.action', //获取省份信息
                            glbpath + 'getIndustryByFatherId.action?industryFatherId=' + project.industryCategory, //获取二级行业
                            glbpath + 'getAreaByFatherId.action?areaFatherId=' + project.province, //获取地市城市
                            glbpath + 'getAreaByFatherId.action?areaFatherId=' + project.city, //获取区县城市
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
                                var industryList = resultsJson[0].attributes; //行业列表
                                var province = resultsJson[1].attributes; //省份列表
                                var industry = resultsJson[2].attributes; //二级行业列表
                                var city = resultsJson[3].attributes; //地市列表
                                var county = resultsJson[4].attributes; //区县列表
                                res.render('usercenter/publishProject', {
                                    keywords: "",
                                    description: "",
                                    title: '传奇工场',
                                    project: project,
                                    provinces: province.areas, //获取省份信息
                                    industryList: industryList.industryList,
                                    industry: industry.industryList,
                                    city: city.areas,
                                    county: county.areas
                                });
                            } catch (e) {
                                console.error("usercenter/publishProject11111失败：", e);
                            }

                        }
                    );
                }
            } catch (e) {
                console.error("usercenter/publishProject222222失败：", e);
            }
        });
    } else {
        async.map(
            [
                glbpath + 'getIndustryType.action', //获取行业类别列表
                glbpath + 'getAreaType.action', //获取省份信息
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
                    var industryList = resultsJson[0].attributes; //行业列表
                    var areaType = resultsJson[1].attributes; //省份列表
                    project = null;
                    res.render('usercenter/publishProject', {
                        keywords: "",
                        description: "",
                        title: '传奇工场',
                        provinces: areaType.areas, //获取省份信息
                        industryList: industryList.industryList,
                        project: project,
                        city: {},
                        county: {}
                    });
                } catch (e) {
                    console.error("usercenter/publishProject失败：", e);
                }

            }
        );
    }


});

//获取行业子节点
router.post('/getIndustryChild', function(req, res) {
    var data = req.body;
    request.post(glbpath + "getIndustryByFatherId.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("usercenter/publistProject/getIndustryChild获取子节点失败：", e);
        }

    });

});

/********发布项目第二步*******/
router.post('/', GlbParam.checkLogin);
//保存或修改项目第一步信息
router.post('/', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    //data["userId"] = "e46ca418513c49b9883f2d01e26c1b6d";
    if (data.userId) {
        request.post(glbpath + "saveBasicInfo.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.render('usercenter/publishSecond', {
                    keywords: "",
                    description: "",
                    title: '传奇工场',
                    project: body.attributes.project
                });

            } catch (e) {
                console.error("usercenter/publistProject失败", e);

            }

        });
    }
});

//保存或修改项目第二步信息
router.post('/second', GlbParam.checkLogin);
router.post('/second', function(req, res) {
    var data = req.body;
    data["investorAmount"] = data.financialAmount - data.projectAmount;
    data["projectInvestScale"] = (Math.round((data.projectAmount / data.financialAmount) * 10000) / 100).toFixed(2);
    data["investorScale"] = (Math.round(((data.financialAmount - data.projectAmount) / data.financialAmount) * 10000) / 100).toFixed(2);
    data["userId"] = GlbParam.userId(req, res);
    request.post(glbpath + "saveStockInfo.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }

        try {
            body = JSON.parse(body);
            if (body.success) {
                res.redirect("/usercenter/publishProject/third/" + data["projectId"])
            } else {
                req.flash("error", body.msg);
                res.redirect('/usercenter/publishProject');
            }
        } catch (e) {
            console.error("usercenter/publistProject/second失败", e);

        }

    });

});


/********发布项目第三步*******/
router.get('/third/:id', GlbParam.checkLogin);
router.get('/third/:id', function(req, res, next) {
    var projectId = req.params.id;
    //var projectId="36df959842ea4a62aa5e08a6d2860b0b"
    if (req.params.id) {
        request.post(glbpath + "getProjectInfoById.action?projectId=" + projectId, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                var project = body.obj;
                var videoType = body.obj.videoType != null ? body.obj.videoType : "";
                async.map(
                    [
                        glbpath + 'getIndustryType.action', //获取行业类别列表
                        glbpath + 'getAreaType.action', //获取省份信息
                        glbpath + 'getIndustryByFatherId.action?industryFatherId=' + project.industryCategory, //获取二级行业
                        glbpath + 'getAreaByFatherId.action?areaFatherId=' + project.province, //获取地市城市
                        glbpath + 'getAreaByFatherId.action?areaFatherId=' + project.city, //获取区县城市
                        glbpath + 'getProjectPaperByProjectId.action?projectId=' + projectId,
                        glbpath + 'getProjectExitTrategyByProjectId.action?projectId=' + projectId,
                        glbpath + 'getProjectShopsPlanByProjectId.action?projectId=' + projectId,
                        glbpath + 'getProjectShops.action?projectId=' + projectId,
                        glbpath + 'getDictionaryByDictionaryId.action?dictionaryId=196'
                    ],
                    request.post,
                    function(err, results) {
                        if (err) {
                            return console.error("error：" + err);
                        }
                        //遍历请求的对象
                        var resultsJson = [],
                            projImage, projectImage;
                        try {
                            for (var i in results) {
                                resultsJson.push(JSON.parse(results[i].body));
                            }
                            var industryList = resultsJson[0].attributes; //行业列表
                            var province = resultsJson[1].attributes; //省份列表
                            var industry = resultsJson[2].attributes; //二级行业列表
                            var city = resultsJson[3].attributes; //地市列表
                            var county = resultsJson[4].attributes; //区县列表
                            projImage = resultsJson[5].attributes.paper; //根据项目ID 获取证件照片相关信息
                            if (projImage === null) {
                                projectImage = "";
                            } else {
                                projectImage = projImage;
                            }
                            var projectExitTrategy = resultsJson[6].attributes.projectExitTrategy;
                            if (projectExitTrategy === null) {
                                projectExitTrategy = "";
                            } else {
                                projectExitTrategy = projectExitTrategy;
                            }
                            var ShopsPlan = resultsJson[7].attributes.projectshopsPlan;
                            if (ShopsPlan === null) {
                                ShopsPlan = "";
                            } else {
                                ShopsPlan = ShopsPlan;
                            }
                            var Shops = resultsJson[8].attributes.shops;
                            var videoList = resultsJson[9].obj;
                            console.log(videoList);
                            res.render('usercenter/editProject', {
                                keywords: "",
                                description: "",
                                title: '传奇工场',
                                projectId: projectId,
                                project: project,
                                provinces: province.areas, //获取省份信息
                                industryList: industryList.industryList,
                                industry: industry.industryList,
                                city: city.areas,
                                county: county.areas,
                                projectImage: projectImage,
                                projectExitTrategy: projectExitTrategy, //退出机制
                                ShopsPlan: ShopsPlan, //开店计划
                                picpath: picpath,
                                Shops: Shops,
                                videoList: videoList
                            });
                        } catch (e) {
                            console.error("usercenter/publishProject失败：", e);
                        }

                    }
                );

            } catch (e) {
                console.error("usercenter/publishProject失败：", e);
            }
        });
    } else {
        res.redirect("/usercenter/publishProject")
    }
});

//修改店铺基本信息
router.post('/saveBasicInfo', function(req, res) {
    var data = req.body;
    data["userId"] = GlbParam.userId(req, res);
    //data["userId"] = "e46ca418513c49b9883f2d01e26c1b6d";
    request.post(glbpath + "saveThirdBasicInfo.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/usercenter/editProject/saveBasicInfo", e);
        }
    });
});
//退出机制
router.post('/saveOrUpdateProjectExitTrategy', function(req, res) {
    var data = req.body;
    //data["userId"] = "e46ca418513c49b9883f2d01e26c1b6d";
    request.post(glbpath + "saveOrUpdateProjectExitTrategy.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            request.post(glbpath + "saveOrUpdateProjectExitTrategy.action", {
                form: data
            }, function callback(err, httpResponse, body) {
                if (err) {
                    return console.error("error：" + err);
                }
                try {
                    body = JSON.parse(body);
                    res.send(body);
                } catch (e) {
                    console.error("/usercenter/editProject/saveOrUpdateProjectExitTrategy", e);
                }
            });
        } catch (e) {
            console.error("/usercenter/editProject/saveOrUpdateProjectExitTrategy", e);
        }
    });

});


/********发布信息第四步*******/
router.get('/success/:id', function(req, res, next) {
    var type = req.query.type;
    if (type === 'true') {
        res.render("usercenter/subproject", {
            keywords: "",
            description: "",
            title: "项目信息提交审核",
            projectId: req.params.id
        });

    } else if (type === 'false') {
        res.render("usercenter/projecttalk", {
            keywords: "",
            description: "",
            title: "项目相关协议",
            projectId: req.params.id
        });
    }

});
/*项目上传*/
router.post('/submitCheck', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "submitCheck.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/saveback", e);
            }
        });
    }

});
/*上传背景宣传图*/
router.post('/saveback', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "saveOrUpdateBgImage.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/saveback", e);
            }
        });
    }

});
/*上传项目展示封面*/
router.post('/saveOrUpdateCoverImage', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "saveOrUpdateCoverImage.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/saveOrUpdateCoverImage", e);
            }
        });
    }

});
/*上传证件*/
router.post('/savePapers', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "saveOrUpdateProjectPaper.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/SavePapers", e);
            }
        });
    }
});
/*修改保存开店计划*/
router.post('/saveShops', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "saveOrUpdateProjectShopsPlan.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/saveShops", e);
            }
        });
    }
});
/*/修改项目视频*/
router.post('/saveVideoUrl', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "saveOrUpdateVideoUrl.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/saveVideoUrl", e);
            }
        });
    }
});
//保存项目介绍
router.post('/saveProjectDesc', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "saveOrUpdateProjectIntroduce.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/saveProjectDesc", e);
            }
        });
    }
});
//融资需求修改
router.post('/saveFinancing', function(req, res) {
    var data = req.body;
    if (data.projectId) {
        request.post(glbpath + "saveStockInfo.action", {
            form: data
        }, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/usercenter/editProject/saveFinancing", e);
            }
        });
    }
});
//现有店铺概括
router.post('/svaeShopList', function(req, res) {
    var data = req.body;
    var bodyStr = {
        projectShopsEntity: '' + data.list + ''
    };
    var stringData = bodyStr;
    request.post(glbpath + "saveOrUpdateProjectShops.action", {
        form: stringData
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            res.send(body);
        } catch (e) {
            console.error("/usercenter/editProject/svaeShopList", e);
        }
    });
});
module.exports = router;
