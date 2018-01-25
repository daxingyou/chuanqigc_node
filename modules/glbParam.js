var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');
var crypto = require('crypto');
var request = require('request');
//var serverPath = 'http://192.168.0.43:8090/P2P_2/pc/';
//var serverPath='http://192.168.0.47:8081/P2P/pc/';
var serverPath='http://101.251.234.243:8081/pc/';
//var serverPath= 'http://m.chuanqigongchang.com/pc/';
router.glbpath = serverPath;
router.picpath = "http://file.chuanqigongchang.com/";
//router.picpath = "http://fs.chuanqigongchang.com/";


router.userId = function(req, res) {
    var user = req.session.user;
    var userid = user ? user.id : "";
    return userid;
};
//检测用户登录状态
router.checkLogin = function(req, res, next) {
    if (!req.session || !req.session.user) {
        //if(req.xhr || req.accepts('json,html')=='json'){
        //    res.send({"success":true});
        //}else{
        req.flash('error', '请先登录！');
        return res.redirect("/");
        //}
    }
    next();
};
//获取用户详细信息
router.getUserInfo = function(req, res, next) {
    var data = {
        userId: req.session.user ? req.session.user.id : null
    };
    return request.post(serverPath + "getUserByUserId.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            if (body.obj.isCertified != 1 && body.obj.isCertified != 2) {
                //req.flash("error", "请先实名认证！");
                return res.redirect("/usercenter/safeSet?click=realName");
            } else if (body.obj.isCertified == 1) {
                req.flash("error", "实名认证审核中，请耐心等待！");
                return res.redirect("/usercenter/safeSet?click=realName");
            }
            next();
        } catch (e) {
            console.error("usercenter/publistProject/getUserByUserId获取用户信息失败：", e);
        }
    });
    next();
};
router.getUserInfoReflash = function(req, res) {
    var data = {
        userId: req.session.user ? req.session.user.id : null
    };
    var objJson;
    request.post(serverPath + "getUserByUserId.action", {
        form: data
    }, function callback(err, httpResponse, body) {
        if (err) {
            return console.error("error：" + err);
        }
        try {
            body = JSON.parse(body);
            objJson = body;

        } catch (e) {
            console.error("usercenter/publistProject/getIndustryChild获取子节点失败：", e);
        }

    });
};
router.checkNotLogin = function(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录！');
        return res.redirect('back'); //返回之前的页面
    }
    next();
}
router.getClientIp = function(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

//将number转化为货币格式
router.formatMoney = function(num) {
    num = parseFloat(num);
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
};

//将字符串转为数组
router.toArray = function(str) {
    if (!str) {
        return [];
    }
    var array = new Array;
    array = str.split(",");
    return array;
};
//把银行卡号替换成*号，只显示前四个后四
router.ReplaceBankNum = function(BackNum) {
    var reg = /^(\d{4})\d+(\d{4})$/;
    BackNum = BackNum.replace(reg, "$1 **** **** $2");
    return BackNum;
};
//替换手机号
router.ReplacePhone = function(phone) {
    var reg = /^(\d{3})\d+(\d{4})$/;
    phone = phone.replace(reg, "$1 **** $2");
    return phone;
};
//根据长度截取先使用字符串，超长部分追加…
router.cutString = function(str, len) {
        //length属性读出来的汉字长度为1
        if (str == "" || str == null) {
            return str;
        }
        if (str.length * 2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = "";
        for (var i = 0; i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + "...";
                }
            }
        }
        return s;
    }
    //根据时间差获取剩余天数
router.remainDay = function(end) {
    if (end == null) {
        return "";
    }
    var remain = new Date(end).getTime() / 1000 - new Date().getTime() / 1000;
    var days = Math.floor(remain / 86400);
    return days;
}

//加密
router.encrypt=function (str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};
//解密
router.decrypt=function (str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

module.exports = router;
