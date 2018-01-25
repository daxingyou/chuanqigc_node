var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var fs = require('fs');
var GlbParam = require('../modules/glbParam');
var glbpath = GlbParam.glbpath;
var picpath = GlbParam.picpath;

/* GET home page. */
router.get('/', function(req, res, next) {
    request.post(glbpath + "index.action", function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            var body = JSON.parse(body);
            var hotProject = body.attributes.hotProject;
            var newProject = body.attributes.newProject;
            var zcdt = body.attributes.zcdt;
            var tzjt = body.attributes.tzjt
            //遍历截取平台推荐的简介
            for(var i=0;i<hotProject.length;i++){
                for (var item in hotProject[i]) {
                    if (item == "projectIntroduce") {
                        hotProject[i][item]=GlbParam.cutString(hotProject[i][item],140);
                    }
                }
                if(hotProject[i].projectStatus==2){
                    var remainDay=GlbParam.remainDay(hotProject[i].financeEndTime)
                    hotProject[i]["remainDay"]=remainDay;
                }else if(hotProject[i].projectStatus==1){
                    hotProject[i]["preStartTime"]=(hotProject[i].preheatStartTime!=null?hotProject[i].preheatStartTime:"").substring(0,10)
                }
            }
            for (var item in newProject) {
                if (item == "shortIntroduce") {
                    newProject[item] = GlbParam.cutString(newProject[item], 50);
                }
            }
            res.render('index', {
                keywords:"传奇工场,众筹,众筹门户,餐饮众筹平台,影视众筹平台,众筹网站,股权众筹平台",
                description:"传奇工场,Much than money!涵盖餐饮众筹、影视众筹等众多众筹领域,为企业快速解决资金问题,加速品牌成长,助力企业未来！传奇众筹，不止筹钱那么简单！",
                title: '传奇众筹-我知道你要的不止是钱！',
                picpath: picpath, //图片所在地址
                bannerList: body.attributes.bannerList, //轮播图
                hotProject: hotProject, //热门项目
                newProject: newProject, //最新项目
                zcdt: zcdt, //投资讲堂
                tzjt: tzjt //最新动态
            });
        } catch (e) {
            console.error("/index：", e);
        }
    });

});

/* 退出 */
router.get('/logout', function(req, res) {
    //清除session
    req.session.destroy();
    res.redirect('/');
});
//详细信息
router.get('/msgdefail', function(req, res) {
    var id = req.query.id;
    console.log(req.query.id);
    if (id) {
        request.post(glbpath + "getPulicInfoDetail.action?id=" + req.query.id, function callback(err, httpResponse, body) {
            if (err) {
                return console.error("error：" + err);
            }
            try {
                var bodyStr = JSON.parse(body);
                var tzjt = bodyStr.attributes.tzjt;
                var zcdt = bodyStr.attributes.zcdt;
                res.render('headmsgdeftail', {
                    keywords:"",
                    description:"",
                    title: '传奇工场',
                    tzjt: tzjt, //投资讲堂
                    zcdt: zcdt, //政策动态
                    msgdefail: bodyStr.obj
                });
            } catch (e) {
                console.error("/index：", e);
            }
        });
    }

});

//投资讲堂tzjt
router.get('/tzjt', function(req, res) {

    request.post(glbpath + "getMorePulicInfo.action?sortId=00000007&pageNo=1", function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            var bodyStr = JSON.parse(body);
            res.render('headmsg', {
                keywords:"",
                description:"",
                title: '传奇工场',
                headtitle: '投资讲堂',
                sortId: '00000007',
                zcdyList: bodyStr.attributes
            });
        } catch (e) {
            console.error("/index：", e);
        }
    });
});


//最新动态
router.get('/zcdt', function(req, res) {
    request.post(glbpath + "getMorePulicInfo.action?sortId=00000008&pageNo=1", function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            var bodyStr = JSON.parse(body);
            res.render('headmsg', {
                keywords:"",
                description:"",
                title: '传奇工场',
                headtitle: '政策动态',
                sortId: '00000008',
                zcdyList: bodyStr.attributes
            });
        } catch (e) {
            console.error("/index：", e);
        }
    });
});
//政策动态，投资讲堂分页功能
router.post('/conPage', function(req, res) {
    var data = req.body;
    console.log(data);
    if (req.xhr || req.accepts('json,html') == 'json') {
        request.post(glbpath + 'getMorePulicInfo.action', {
            form: data
        }, function callback(err, httpResponse, body) {

            if (err) {
                return console.error('失败:', err);
            }
            try {
                var bodyStr = JSON.parse(body);
                res.send(bodyStr);
            } catch (e) {
                console.error("index/conPage", e);
            }
        });
    } else {
        res.redirect("/index");
    }
});
/* header */
router.get('/header', function(req, res) {
    if (req.xhr || req.accepts('json,html') == 'json') {
        request(glbpath + 'header.action', function callback(err, httpResponse, body) {
            if (err) {
                return console.error('error:', err);
            }
            try {
                var body = JSON.parse(body);
            } catch (e) {
                console.error("/header失败：", e);
            }
        });
    }
});
/* footer */
router.get('/footer', function(req, res) {
    if (req.xhr || req.accepts('json,html') == 'json') {
        request(glbpath + 'footer.action', function callback(err, httpResponse, body) {
            if (err) {
                return console.error('error:', err);
            }
            try {
                var body = JSON.parse(body);
                res.send(body);
            } catch (e) {
                console.error("/footer失败：", e);
            }
        });
    }
});


//单页展示
router.get('/singlepage/newknow', function(req, res, next) {

    res.render('singlepage/newknow', {
        keywords:"传奇工场,众筹门户,众筹网站,股权众筹平台,餐饮众筹平台,影视众筹平台,什么是众筹，众筹网站有哪些",
        description:"传奇工场,Much than money!15天内达成合作意向,20天快速解决资金问题,众筹专家全程跟踪指导,简便安全,让梦想更近一点！传奇众筹，不止筹钱那么简单！",
        title: '传奇众筹-我知道你要的不止是钱！众筹专家全程跟踪指导,简便安全！'
    });

});
router.get('/singlepage/safetyset', function(req, res, next) {

    res.render('singlepage/safetyset', {
        keywords:"传奇工场,众筹,众筹门户,餐饮众筹平台,影视众筹平台,众筹网站,股权众筹平台,众筹网站有哪些，众筹风险控制",
        description:"传奇工场,Much than money!六层筛选关卡、第三方财务审计、7*24h完善监管体系,为众筹项目保驾护航！传奇众筹，安全无忧,不止筹钱那么简单！",
        title: '传奇众筹-我知道你要的不止是钱！多重安全措施 为项目保驾护航！'
    });

});
router.get('/singlepage/teammanage', function(req, res, next) {

    res.render('singlepage/teammanage', {
        keywords:"",
        description:"",
        title: '传奇工场-管理团队'
    });

});

router.get('/singlepage/foodperson', function(req, res, next) {

    res.render('singlepage/foodperson', {
        keywords:"",
        description:"",
        title: '传奇工场-寻找品牌达人'
    });

});
router.get('/singlepage/leadinvest', function(req, res, next) {

    res.render('singlepage/leadinvest', {
        keywords:"",
        description:"",
        title: '传奇工场-精英领投人'
    });

});
router.get('/singlepage/zhongchuang', function(req, res, next) {

    res.render('singlepage/zhongchuang', {
        keywords:"传奇工场,众筹,众筹门户,餐饮众筹平台,影视众筹平台,众筹网站,股权众筹平台，品牌众筹",
        description:"传奇工场,Much than money! 高效众筹模式,15天内达成合作意向,20天快速解决资金问题，智慧众筹,加速品牌成长！传奇众筹，不止筹钱那么简单！",
        title: '传奇众筹-我知道你要的不止是钱！众筹专业智囊团,企业成长加速器！'
    });

});
module.exports = router;
