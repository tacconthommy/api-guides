function stickySidebar(){var t=$("#header").outerHeight(),a=$(".footer").outerHeight(),i=$(window).height(),o=$(window).scrollTop();o>=t?$(".tocify-wrapper").css("position","fixed").css("height",i-a):$(".tocify-wrapper").css("position","relative")}$(document).ready(function(){$("#toc").on("click","li a",function(t){var a=$(this).parent("li").attr("data-unique");return $(window).width()>767?void $("html, body").animate({scrollTop:$("#"+a).offset().top},600):($("html, body").animate({scrollTop:$("#"+a).offset().top-$("#header").outerHeight()},600),!1)}),$("#nav-toggle").click(function(){$(this).hasClass("navBtnActive")?($("#bs-navbar").animate({right:"-300px"},500),$("#bs-navbar").removeClass("navShadow"),$(this).removeClass("navBtnActive")):($("#bs-navbar").animate({right:"0"},500),$("#bs-navbar").addClass("navShadow"),$(this).addClass("navBtnActive"))})}),$(document).scroll(function(){stickySidebar()});