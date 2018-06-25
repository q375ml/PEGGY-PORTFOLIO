$(function(){

	//mobile menu bar
	$('.icon-burger').on('click', function(event){
		event.preventDefault();
		$(this).toggleClass('open');
		$('nav').stop().fadeToggle();

	});
	
	$('nav li a').on('click', function(){
		// event.preventDefault()

		$('.icon-burger').toggleClass('open');
		$('nav').stop().fadeOut();
		
		var _href = $(this).attr('href')
		$('html,body').animate({scrollTop:($(_href).offset().top-100)},1200)
	})

    



    
});

//loading


// $(window).load(function() {
// 	$('.loading').remove();
// 	//$('body').css('overflow', '');
	
// });