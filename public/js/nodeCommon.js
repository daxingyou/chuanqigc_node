$(document).ready(function() {
    //var picpath="http://fs.chuanqigongchang.com/"
    var picpath="http://file.chuanqigongchang.com/"
    //倒计时
    $(".timeDJS").each(function(){
        var timeCha=$(this).attr("timecha");
        var self=$(this);
        setInterval(function(){
            timeCha=timeCha-1;
            self.html(MillisecondToDate(timeCha));
        },1000)
    });
    $(".formdatamoney").each(function(){
        $(this).html(formatMoney($(this).text()))
    })
    $(".top_nav a").each(function(){
        if($(this)[0].href==String(window.location)){
            $(".top_nav li").attr("class","")
            $(this).parent("li").attr("class","on")
            $(this).parent("li").find("span").attr("class","red_span");
        }
    })

    $("#ucLeft>li>a").each(function() {
        if ($(this)[0].href == String(window.location)) {
            $("#ucLeft>li").attr("class", "help_change_li")
            $(this).parent().attr("class","help_active_li");
        }
    })
    $("#ucLeft .helpCenter_leftSubBar li a").each(function(){
        if($(this)[0].href==String(window.location)){
            $("#ucLeft .helpCenter_leftSubBar li a").attr("class","")
            $(this).attr("class","active_subMenu");
            $("#ucLeft>li").attr("class", "help_change_li")
            $(this).parents(".helpCenter_leftSubBar").parent().attr("class", "help_active_li");
            $("#ucLeft>li>a").attr("class", "header closed")
            $(this).parent().parent().siblings("a").attr("class", "header opened")
        }
    })


    $.ajax({
        url: '/footer',
        type: 'get',
        dataType: 'json',
        success: function(data, textStatus) {
            if (!data)
                return;
            var linkHtml = '';
            var help_foot = '';
            var about_foot = '';
            //友情链接
            var linkList = data.attributes.linksList;
            for (var i = 0; i < linkList.length; i++) {
                linkHtml += '<a target="_blank" href="' + linkList[i].url + '">' + linkList[i].linksName + '</a>'
            }
            //微信公众号
            $("#wxgzh").attr("src", picpath + data.attributes.weixin.imageURL);

            $(".links_wrap").html(linkHtml);
            $('#icpcode').html(data.attributes.site.icpcode);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
})
// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
var Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
};
//验证码倒计时
function djs(about, style, second) {
    var validCode = true;
    var timer = null;
    clearInterval(timer);
    if (validCode) {
        validCode = false;
        about = $(about);
        about.addClass(style);
        about.attr("disabled", true);
        timer = setInterval(function() {
            second--;
            about.html(second + "秒");
            if (second == 0) {
                clearInterval(timer);
                about.removeClass(style);
                about.html("重新获取");
                about.attr("disabled", false);
                validCode = true;
                second = second;
            }
        }, 1000);
    }
    validCode = true;
}
var imagePath=function(){
   return picpath;
};
var PahtReturn=function(url){
    var arry=[];
     arry=url.toString().split('image');
     return '/image'+arry[1];
};
/*上传文件到文件服务器*/
function uploadfile(id, clallk) {
    $('#' + id + '').uploadify({
        debug: false,

        swf: '/js/uploadify.swf', //swf文件路径
        method: 'post', // 提交方式
        //uploader: 'http://101.251.234.246:8355/TngouFS/controller?action=uploadimage&path=test', // 服务器端处理该上传请求的程序(servlet, struts2-Action)
        uploader: 'http://101.251.234.243:8082/TngouFS/controller?action=uploadimage&path=test', // 服务器端处理该上传请求的程序(servlet, struts2-Action)
        //uploader: 'http://fs.chuanqigongchang.com/controller?action=uploadimage&path=test', // 服务器端处理该上传请求的程序(servlet, struts2-Action)
        preventCaching: true, // 加随机数到URL后,防止缓存

        buttonCursor: 'hand', // 上传按钮Hover时的鼠标形状
        //  buttonImage     : 'img/.....png',   // 按钮的背景图片,会覆盖文字
        buttonText: '浏览', //按钮上显示的文字，默认”SELECTFILES”
        height: 31, // 30 px
        width: 88, // 120 px

        fileObjName: 'filedata', //文件对象名称, 即属性名
        fileSizeLimit: 1000, // 文件大小限制, 100 KB
        fileTypeDesc: 'any', //文件类型说明 any(*.*)
        fileTypeExts: '*.gif; *.jpg; *.png;*.jpeg', // 允许的文件类型,分号分隔
        formData: {
            'id': '1',
            'name': 'myFile'
        }, //指定上传文件附带的其他数据。也动态设置。可通过getParameter()获取

        multi: true, // 多文件上传
        progressData: 'speed', // 进度显示, speed-上传速度,percentage-百分比
        queueID: 'fileQueue', //上传队列的DOM元素的ID号
        queueSizeLimit: 99, // 队列长度
        removeCompleted: false, // 上传完成后是否删除队列中的对应元素
        removeTimeout: 10, //上传完成后多少秒后删除队列中的进度条,
        requeueErrors: true, // 上传失败后重新加入队列
        uploadLimit: 20, // 最多上传文件数量

        successTimeout: 30, //表示文件上传完成后等待服务器响应的时间。超过该时间，那么将认为上传成功。
        onUploadSuccess: function(file, data, response) {
            if (!data) {
                return;
            }
            clallk(file, data, response);
        }
    });

}

//ajax回调函数
function ajaxFunc(data, url, func) {
    var data = data;
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: data,
        success: function(data) {
            if (!data)
                return;
            func(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            dialog("信息有误");
        }
    });
}


//重定向
function ycrediect(time, url) {
    if (time <= 0) {
        window.location.href = url;
    } else {
        var t = setInterval(function() {
            time--;
            if (time <= 0) {
                window.location.href = url;
                clearInterval(t);
            }
        }, 1000);
    }
}
//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//将number转化为货比格式
function formatMoney(num) {
    num = parseFloat(num);
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)||num==null)
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


//根据传的值让相同文本的select option选中
function selectText(id, value) {
    $("#" + id + " option").each(function() {
        if ($.trim($(this).val()) == value) {
            $(this).attr("selected", "true");
        }
    });
}
//根据省市获取市区
function getCity(provinceId, cityId) {
    var provinceId = $("#" + provinceId + " option:selected").val();
    if (provinceId == "0") {
        $("#" + cityId).empty();
        $("#" + cityId).append($("<option>").val("0").text("请选择"));
        $("#" + cityId).next().append($("<option>").val("0").text("请选择"));
    }
    var data = {
        "areaFatherId": provinceId
    }
    ajaxFunc(data, "/usercenter/safeset/getCity", function ajaxBack(data) {
        if (data.success) {
            $("#" + cityId).html('<option value="0">请选择</option>');
            $("#" + cityId).next().html('<option value="0">请选择</option>');
            var cityData = data.attributes.areas;
            for (var i = 0; i < cityData.length; i++) {
                var option = $("<option>").val(cityData[i].id).text(cityData[i].areaName);
                $("#" + cityId).append(option);
            }
        } else {
            alert(data.msg);
        }
    })
}
//初始省市获取市区
function getCityBegin(optionValue, selectValue, cityId) {
    if (optionValue == "" || selectValue == "") {
        return;
    }
    if (optionValue == "请选择") {
        $("#" + cityId).empty();
        $("#" + cityId).append($("<option>").val("请选择").text("请选择"));
    }
    var data = {
        "areaFatherId": optionValue
    }
    ajaxFunc(data, "/usercenter/safeset/getCity", function ajaxBack(data) {
        if (data.success) {

            $("#" + cityId).html('<option value="请选择">请选择</option>');
            var cityData = data.attributes.areas;
            for (var i = 0; i < cityData.length; i++) {
                var option = $("<option>").val(cityData[i].id).text(cityData[i].areaName);
                $("#" + cityId).append(option);
                selectText(cityId, selectValue);
            }
        } else {
            alert(data.msg)
        }
    })
}

//获取行业子列表
function getIndustry(industryCategory, industryId) {
    var industryCategory = $("#" + industryCategory + " option:selected").val();
    if (industryCategory == "请选择") {
        $("#" + industryId).empty();
        $("#" + industryId).append($("<option>").val("请选择").text("请选择"));
    } else {
        var data = {
            "industryFatherId": industryCategory
        };
        ajaxFunc(data, "/usercenter/publishProject/getIndustryChild", function ajaxBack(data) {
            if (data.success) {
                $("#" + industryId).html('<option value="请选择">请选择</option>');
                var industryList = data.attributes.industryList;
                for (var i = 0; i < industryList.length; i++) {
                    var option = $("<option>").val(industryList[i].sortId).text(industryList[i].industryName);
                    $("#" + industryId).append(option);
                }
            } else {
                alert(data.msg);
            }
        });
    }
}
//初始行业子列表
function getIndustryBegin(optionValue, selectValue, industryId) {
    if (optionValue == "" || selectValue == "") {
        return;
    }
    if (optionValue == "请选择") {
        $("#" + industryId).empty();
        $("#" + industryId).append($("<option>").val("请选择").text("请选择"));
    } else {
        var data = {
            "industryFatherId": optionValue
        };
        ajaxFunc(data, "/usercenter/publishProject/getIndustryChild", function ajaxBack(data) {
            if (data.success) {
                $("#" + industryId).html('<option value="请选择">请选择</option>');
                var industryList = data.attributes.industryList;
                for (var i = 0; i < industryList.length; i++) {
                    var option = $("<option>").val(industryList[i].sortId).text(industryList[i].industryName);
                    $("#" + industryId).append(option);

                    selectText(industryId, selectValue);
                }
            } else {
                alert(data.msg);
            }
        });
    }
}
function checkBoxValue(name){
    obj = document.getElementsByName(name);
    check_val = [];
    for(k in obj){
        if(obj[k].checked)
            check_val.push(obj[k].value);
    }
    check_val=check_val.join(",")
    return check_val;
}

function remainDay(strDateStart,strDateEnd){
    if(strDateEnd==""){
        return "";
    }
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1= strDateStart.split(strSeparator);
    oDate2= strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
    return iDays ;
}
//倒计时
function MillisecondToDate(msd) {

    var time = parseFloat(msd);

    if (null!= time &&""!= time) {
        if(time>0){
            time = Math.floor(time/86400) +"天"+

            Math.floor(time%86400/3600) +"小时"+

            Math.floor(time%86400%3600/60) +"分钟"+

            Math.floor(time%60) +"秒"

        }else{
            time = "已截止";
        }
    }
    return time;

}
//把字符串转换成数组用“,”号分割
var toArray = function(str) {
    if (!str) {
        return [];
    }
    var array = new Array;
    array = str.split(",");
    return array;
};
//判断是否是数组
var isArray=function (object){
    return object && typeof object==='object' &&
            Array == object.constructor;
}