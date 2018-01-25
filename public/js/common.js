// JavaScript Document
$(function(){
	//获取透明层的高度
	$(".momblack").css("height",$(document).height())	
	//点黑色透明层，弹框消失
	$(".momblack").click(function(){
		$(".module_dialog").hide();
		$(".momblack").hide();	
	})
		//点击关闭按钮
	$(".module_close").click(function(){
        var i=0;
        $(".module_dialog").each(function(){
            if($(this).css("display")=="block"){
                i++;
            }
        })
        if(i==1){
            $(".momblack").hide();
        }
        $(".error").each(function(){
            $(this).html("");
        })
        $(this).parent().parent(".module_dialog").hide();

	})

	//点击取消按钮，关闭透明层和对话框
	$(".cancel").click(function(e){
        e.preventDefault();
        $(this).parents(".module_dialog").find(".module_close").click();
	})
	//鼠标经过关闭按钮，透明度改变
	$(".module_close").hover(function(){
		$(this).css("opacity","1");	
	},function(){
		$(this).css("opacity","0.2");	
	})
	
	
	//背景图片的高度
	function usercenter_bgH(){
		var documentH=$(document).height();
		var footerH=$(".footer").innerHeight();
		var headerH=$(".top_header").height();
		var topnavH=$(".nav_box_bg").height();
		var fxchq_bgH=documentH-footerH;
		var prehotItem_bgH=documentH-footerH;
		//发现传奇——背景图片高度
		$(".fxchq_bg").css("height",fxchq_bgH);
		//发现传奇——预热项目背景图片高度
		$(".prehotItem_bg").css("height",prehotItem_bgH);
	}
	usercenter_bgH();
	
	
	//鼠标经过显示子菜单
	function mouse_hover(hoverObj,listGroup){
		$(hoverObj).hover(
		function(){
			$(listGroup).show();
		},function(){
			$(listGroup).hide();
		})
	}
	function sub_list(listGroup1){
		$(listGroup1).hover(function(){
			$(this).show();
		},function(){
			$(this).hide();
		})
	}
	
	//遍历顶部导航的Li
	$(".top_header").find("li").each(function(index,element){

		//如果li有on类
		if($(element).hasClass("on")){
			//顶部导航，下划线跟随菜单滑动
			$(".top_header ul").append('<i class="nav_under"></i>')
				var now = $(".on"),line=$(".nav_under"),timer;
				line.stop().css({
					"left":now.position().left,
					"width":now.width()
				});
				
				$(".top_header ul").find("li").hover(function() {
					clearInterval(timer);
					line.stop().animate({
						"left": $(this).position().left,
						"width": $(this).width()
					});
					
				},function() {
					timer = setTimeout(function() {
						line.stop().animate({
							"left": now.position().left,
							"width": now.width()
						});
						
						//判断当下滑线与下拉框的左侧距离一样时显示下拉框
						if(line.position().left==$("#find_chq").position().left){
							mouse_hover(".nav_under",".find_chq_list");
						}
						
					},200);
					
    		});
			//鼠标经过“发现传奇”下方三角变成红色
			$(".find_chq").hover(function(){
				$(".find_chq span").css("borderColor","#f2941a transparent transparent transparent")
				clearInterval(timer);
				},function(){
					$(".find_chq span").css("borderColor","#fff transparent transparent transparent")	
				})
			}
		//如果li有on类	
	})
	/*-----------------------Begin 传奇工场2.1--------------------------------*/
	

	//鼠标经过显示子菜单
	function mouse_hover(hoverObj,listGroup){
		$(hoverObj).hover(
		function(){
			$(listGroup).show();
		},function(){
			$(listGroup).hide();
		})
	}
	function sub_list(listGroup1){
		$(listGroup1).hover(function(){
			$(this).show();
		},function(){
			$(this).hide();
		})
	}
	//鼠标经过发现传奇，显示子菜单
	mouse_hover("#find_chq",".find_chq_list");
	//sub_list(".find_chq_list");
	
	
	//鼠标经过顶部导航，右侧用户信息时，弹出下拉菜单
	mouse_hover(".user_infor",".usercener_list");
	sub_list(".usercener_list");
	
	//发现传奇页，小三角
	if($("#find_chq span").hasClass("red_span")){
		$("#find_chq").hover(function(){
		$("#find_chq span").css("borderColor","#f2941a transparent transparent transparent")
		},function(){
			$("#find_chq span").css("borderColor","#f2941a transparent transparent transparent")	
		})
	}else{
		$("#find_chq").hover(function(){
		$("#find_chq span").css("borderColor","#f2941a transparent transparent transparent")
		},function(){
			$("#find_chq span").css("borderColor","#fff transparent transparent transparent")	
		})
	}
	

	//点击顶部导航的注册，弹出“注册对话框”
	$(".click_register").click(function(){
		$(".momblack").show();
		$("#register_box").show();
		$(".title_register").addClass("f_e4312b").siblings().removeClass("f_e4312b");
		$("#register_form").show();
		$("#login_form").hide();
	})
	//点击顶部导航的登录，弹出“登录对话框”
	$(".click_login").click(function(){
		$(".momblack").show();
		$("#register_box").show();
		$(".title_login").addClass("f_e4312b").siblings().removeClass("f_e4312b");
		$("#login_form").show();
		$("#register_form").hide();
		
		$.ajax({
            url: '/login/isCookies',
            type: 'get',
            data: {},
            datatype: 'json',
            error: function(msg) {
                console.log('error' + msg);
            },
            success: function(data) {
                if (data) {
                	$('#isPwd').attr("checked", 'checked');
                    $('#telephone').val(data.userName);
                    $('#password').val(data.password);
                }
            }
        });
	})
			
    //点击注册、登录对话框上的标题，转换到————登录对话框
	$(".title_login").click(function(){
		$(this).addClass("f_e4312b").siblings().removeClass("f_e4312b");
		$("#login_form").show();
		$("#register_form").hide();	
	})
	//点击注册、登录对话框上的标题，转换到————注册对话框
	$(".title_register").click(function(){
		$(this).addClass("f_e4312b").siblings().removeClass("f_e4312b");
		$("#register_form").show();
		$("#login_form").hide();	
	})

   
	 //帮助中心，下拉子菜单
	$(".helpCenter_leftBar li").hover(function(){
		if($(this).hasClass("help_active_li")){
			$(this).removeClass("help_change_li");
		}
	},function(){
		if($(this).hasClass("help_active_li")){
			$(this).removeClass("help_change_li");
		}
		
	})
	
	
	//众创基地页——鼠标经过如何参与众创之旅时，第一个圆圈“获取收益”动画开始
	$(".zhch_animate").mouseover(function(){
		$(".zhch_circle li:first").addClass("start_animate");	
	})
	
	//input输入框属性为readonly时，字体颜色为909090
	$('input:text[readonly]').css("color","#909090");
	
	
})

function dialog(html){
	//获取透明层的高度
	$(".momblack").css("height",$(document).height())
  	$(".momblack").show()
	$("#tips_dialog").fadeIn().find(".module_body").html(html);
}
function dialogLoad(html){
    //获取透明层的高度
    $(".momblack").css("height",$(document).height())
    $(".momblack").show()
    $("#tips_dialog_load").fadeIn().find(".module_body").html(html);
}
function box_dialog(clickId,dialogId){
	$(clickId).click(function(e){
		e.preventDefault();
		//获取透明层的高度
		$(".momblack").css("height",$(document).height())
		$(".momblack").show();
		$(dialogId).show();
	})
}




	




