/**
 * 倒计时插件
 */
(function($){
    $.fn.yomi=function(){
        var data="";
        var _DOM=null;
        var TIMER;
        createdom =function(dom){
            _DOM=dom;
            data=$(dom).attr("data");
            if(data==""){
                return ""
            }
            data = data.replace(/-/g,"/");
            data = Math.round((new Date(data)).getTime()/1000);
            $(_DOM).append("<font class='yomiday'></font><font class='split'>天</font><font class='yomihour'></font>小时<font class='yomimin'></font>分<font class='yomisec'></font>秒")
            reflash();
            if($(_DOM).text()=="00天00小时00分00秒"){
                $(_DOM).html("已截止");
            }
        };
        reflash=function(){
            var	range  	= data-Math.round((new Date()).getTime()/1000),
                secday = 86400, sechour = 3600,
                days 	= parseInt(range/secday),
                hours	= parseInt((range%secday)/sechour),
                min		= parseInt(((range%secday)%sechour)/60),
                sec		= ((range%secday)%sechour)%60;
            $(_DOM).find(".yomiday").html(nol(days));
            $(_DOM).find(".yomihour").html(nol(hours));
            $(_DOM).find(".yomimin").html(nol(min));
            $(_DOM).find(".yomisec").html(nol(sec));
        };
        TIMER = setInterval( reflash,1000 );
        nol = function(h){
            if(h<0){
                return "00"
            }
            return h>9?h:'0'+h;
        }
        return this.each(function(){
            var $box = $(this);
            createdom($box);
        });
    }
})(jQuery);
$(function(){
    $(".yomibox").each(function(){
        $(this).yomi();
    });
});