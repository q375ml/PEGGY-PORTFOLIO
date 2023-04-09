$(function () {
  var $win = $(window);

  //mobile menu bar
  $('.icon-burger').on('click', function (event) {
    event.preventDefault();
    $(this).toggleClass('open');
    $('.navbar-collapse').stop().slideToggle();

    $('.nav a').removeClass('active');
  });

  //nav
  $('nav a').on('click', function () {
    //event.preventDefault();
    $('.icon-burger').toggleClass('open');
    //$('.navbar-collapse').stop().slideToggle();

    $('a').removeClass('active');
    $(this).addClass('active');

    if ($win.width() <= 990) {
      $('.icon-burger').removeClass('open');
      $('.navbar-collapse').slideUp();
    }

    var _href = $(this).attr('href');
    $('html,body').animate({ scrollTop: $(_href).offset().top }, 1200);
  });

  //Main bt
  $(".main .bt_blue").click(function(event) {
    event.preventDefault();
    $("html, body").animate({
        scrollTop: $($(this).attr("href")).offset().top
      }, 1200);
  });

  //back-top
  $('.logo,.back-top').on('click', function (event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 1000);
    $('a').removeClass('active');
  });

  $(window)
    .on('scroll', function () {
      if ($(this).scrollTop() >= 150) $('.back-top').fadeIn();
      else $('.back-top').fadeOut();
    })
    .scroll();
});
