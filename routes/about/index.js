var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;

/* GET users listing. */
//获取帮助中心的列表 Andy
router.get('/:id', function(req, res, next) {
    request(glbpath + 'leftMenu.action', function callback(err, httpResponse, bodymenu) {
        if (err) {
            return console.error('error:', err);
        }
        try {
            var bodymenu = JSON.parse(bodymenu);
            var bottomMenus = bodymenu.attributes.bottomMenus;
            request(glbpath + '/publicInfo.action?id=' + req.params.id + '&maptype=' + req.query.maptype + '&pageNum=1', function callback(err, httpResponse, body) {
                var type = req.query.maptype;
                //获取标题
                var titleName = unescape(req.query.Title) || "";
                var Guid = req.params.id || "";
                if (err) {
                    return console.error('error:', err);
                }
                //判断是否是列表。详细信息
                if (type.toLowerCase() === "infolist") {
                    try {
                        var body = JSON.parse(body);
                        res.render('about/index', {
                            keywords:"传奇工场,众筹,众筹门户,餐饮众筹平台,影视众筹平台,众筹网站,股权众筹平台,什么是众筹，众筹网站有哪些",
                            description:"传奇工场,Much than money!国内首家专注于品牌众创、股权众投、服务众包的专业众筹平台，陪伴企业成长,成就传奇梦想，传奇众筹，不止筹钱那么简单！",
                            title: "传奇众筹-我知道你要的不止是钱！陪伴企业成长,成就传奇梦想！", //标题
                            titleName: titleName,
                            bottomMenus: bottomMenus,
                            Guid: Guid, //绑定id 分页用
                            infoList: body.attributes.infoList.modelList, //集合参数
                            counts: body.attributes.infoList.counts, // 总共条数
                            rowPerPage: body.attributes.infoList.rowPerPage // 每页显示多少条
                        });

                    } catch (e) {
                        console.error("获取列表失败！", e);
                    }
                } else {
                    try {
                        var body = JSON.parse(body);
                        res.render('about/helpaccount', {
                            keywords:"传奇工场,众筹,众筹门户,餐饮众筹平台,影视众筹平台,众筹网站,股权众筹平台,什么是众筹，众筹网站有哪些",
                            description:"传奇工场,Much than money!国内首家专注于品牌众创、股权众投、服务众包的专业众筹平台，陪伴企业成长,成就传奇梦想，传奇众筹，不止筹钱那么简单！",
                            title: "传奇众筹-我知道你要的不止是钱！陪伴企业成长,成就传奇梦想！",
                            titleName: body.attributes.info.title,
                            bottomMenus: bottomMenus,
                            CreateTime: body.attributes.info.createTime,
                            content: body.attributes.info.content
                        });
                    } catch (e) {
                        console.error("获取详细信息失败！", e);
                    }
                }
            });
        } catch (e) {
            console.error("/leftMenu：", e);
        }
    })
});
/*传奇工场2.1 修改 帮助中心*/
router.get('/', function(req, res, next) {
    var type = req.query["type"] || "";
    request(glbpath + 'leftMenu.action', function callback(err, httpResponse, body) {
        if (err) {
            return console.error('error:', err);
        }
        try {
            var body = JSON.parse(body);
            var bottomMenus = body.attributes.bottomMenus;
            console.log(bottomMenus);
            if (type !== "") {
                res.render('singlepage/about', {
                    keywords:"传奇工场,众筹,众筹门户,餐饮众筹平台,影视众筹平台,众筹网站,股权众筹平台,什么是众筹，众筹网站有哪些",
                    description:"传奇工场,Much than money!国内首家专注于品牌众创、股权众投、服务众包的专业众筹平台，陪伴企业成长,成就传奇梦想，传奇众筹，不止筹钱那么简单！",
                    title: '传奇众筹-我知道你要的不止是钱！陪伴企业成长,成就传奇梦想！',
                    type: type,
                    bottomMenus: bottomMenus
                });
            }
            //res.send(body);
        } catch (e) {
            console.error("/footer失败：", e);
        }
    });


});
//详细信息
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
