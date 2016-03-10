$(document).ready(function(){

$('#toc').on("click", "li a", function(event){
	var dataUnique = $(this).parent('li').attr('data-unique');
	if($(window).width() > 767)
	{
	$('html, body').animate({
      scrollTop: $('#'+dataUnique).offset().top
    }, 600);
	}
	else
	{
		$('html, body').animate({
      scrollTop: ($('#'+dataUnique).offset().top-$('#header').outerHeight())
    }, 600);
	return false;
	}
});


$('#nav-toggle').click(function() {
	if ($(this).hasClass("navBtnActive") ) 
	{
		$( "#bs-navbar" ).animate({ right: "-300px"}, 500 );
		$( "#bs-navbar" ).removeClass('navShadow');
		$(this).removeClass('navBtnActive');
	} 
	else 
	{
		$( "#bs-navbar" ).animate({ right: "0" }, 500 );
		$( "#bs-navbar" ).addClass('navShadow');
		$(this).addClass('navBtnActive');
	}	
});
})

function stickySidebar() {
var headerHeight = $('#header').outerHeight();
var footerHeight = $('.footer').outerHeight();
var windowHeight = $(window).height();
var scrollPosition = $(window).scrollTop();
	if (scrollPosition >= headerHeight) {
		$('.tocify-wrapper').css('position','fixed').css('height',(windowHeight-footerHeight));
	}
	else {
		$('.tocify-wrapper').css('position','absolute');
	}
		
}
 

$(document).scroll(function(){ 
   stickySidebar();
});
