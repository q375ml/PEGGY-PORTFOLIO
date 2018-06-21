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

    //work
     $('#w-d,#w-d2').animatedModal({
        modalTarget:'modal-01',
        animatedIn:'fadeInDown',
        animatedOut:'fadeOutDown',
        color:'#fff',
        
    });
    $('#f-d,#f-d2').animatedModal({
        modalTarget:'modal-02',
        animatedIn:'fadeInDown',
        animatedOut:'fadeOutDown',
        color:'#fff',
        
        
    });
    $('#v-d,#v-d2').animatedModal({
        modalTarget:'modal-03',
        animatedIn:'fadeInDown',
        animatedOut:'fadeOutDown',
        color:'#fff',
        
    });
    $('#u-d,#u-d2').animatedModal({
        modalTarget:'modal-04',
        animatedIn:'fadeInDown',
        animatedOut:'fadeOutDown',
        color:'#fff',
        
    });



    
});

//loading


// $(window).load(function() {
// 	$('.loading').remove();
// 	//$('body').css('overflow', '');
	
// });