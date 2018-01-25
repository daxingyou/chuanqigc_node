var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var GlbParam = require('../../modules/glbParam');
var glbpath = GlbParam.glbpath;

/* GET users listing. */
//获取帮助中心的列表 Andy
router.get('/:id', function(req, res, next) {
    request(glbpath + '/publicInfo.action?id=' + req.params.id + '&maptype=' + req.query.maptype, function callback(err, httpResponse, body) {
        if (err) {
            return console.error('error:', err);
        }
        try {
            var bodystr = JSON.parse(body);
            res.render('about/helpaccount', {
                keywords:"传奇工场,众筹,众筹门户,餐饮众筹平台,影视众筹平台,众筹网站,股权众筹平台,什么是众筹，众筹网站有哪些",
                description:"传奇工场,Much than money!国内首家专注于品牌众创、股权众投、服务众包的专业众筹平台，陪伴企业成长,成就传奇梦想，传奇众筹，不止筹钱那么简单！",
                title:"传奇众筹-我知道你要的不止是钱！陪伴企业成长,成就传奇梦想！",
                titleName: bodystr.attributes.info.title,
                CreateTime: bodystr.attributes.info.createTime,
                content:bodystr.attributes.info.content
            });
        } catch (e) {
            console.error("获取详细信息失败！", e);
        }
    });

});
module.exports = router;
