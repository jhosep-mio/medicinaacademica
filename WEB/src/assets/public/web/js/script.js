
/* MENU MÓVIL*/
$('#call_menumovil').click(function() {
    $('.pestañas_menu').addClass('activemain');
});
$('#close_menumovil').click(function() {
    $('.pestañas_menu').removeClass('activemain');
});


/* global NaN */
$(document).ready(function(){
    $('.ir-arriba').click(function(){
        $('body, html').animate({
            scrollTop: '0px'
        }, 300);
    });

    $(window).scroll(function(){
        if( $(this).scrollTop() > 0 ){
            $('.ir-arriba').slideDown(300);
        } else {
            $('.ir-arriba').slideUp(300);
        }
    });
});

/*DROPDOWN*/
$('.nav li.dropdown').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).slideDown(500);
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
});
/*END DROPDOWN*/

$(document).ready(function(){
    $('#slider').nivoSlider({
        pauseTime: 3000
    }); 
});


/*PROGRESS BAR
var altura = ($('.sect_progress').offset() || { "top": NaN }).top;
$(window).on('scroll', function () {
    if ($(window).scrollTop() > altura) {

        var progress = $(".loading-progress").progressTimer({
          timeLimit: 10,
          onFinish: function () {
            }
        });
        
    }
});*/
/*END PROGRESS BAR*/

//LISTADO

$('#grid').click(function() {
    $(this).addClass("active");
    $("#list").removeClass("active");
    $("ul.prodlist-grid").fadeOut(300, function() {
        $(this).addClass("grid").removeClass("list").fadeIn(300)
    });
});

$('#list').click(function() {
    $(this).addClass("active");
    $("#grid").removeClass("active");
    $("ul.prodlist-grid").fadeOut(300, function() {
        $(this).removeClass("grid").addClass("list").fadeIn(300)
    });
});







/*OWL CAROUSEL*/
$('.produc').owlCarousel({
    loop:true,
    nav:true,
    margin:0,
    responsiveClass:true,
    items:1,
    autoplay:true,
    autoplayTimeout:10000,
    autoplayHoverPause:true,
});

$('.list_products').owlCarousel({
    loop:true,
    margin:40,
    dots: false,
    nav: true,
    responsiveClass:true,
    responsive:{
        0:{
            items:1
        },
        767:{
            items:2
        },
        1000:{
            items:3
        }
    },
    autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:true,
});

$('.list_news').owlCarousel({
    loop:false,
    margin:40,
    dots: false,
    responsiveClass:true,
    responsive:{
        0:{
            items:1
        },
        767:{
            items:3
        },
        1000:{
            items:5,
            nav:true
        }
    },
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
});

$('.banner').owlCarousel({
    loop:false,
    margin:20,
    dots: false,
    responsiveClass:true,
    responsive:{
        0:{
            items:2
        },
        767:{
            items:3
        },
        1000:{
            items:5,
            nav:true
        }
    },
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
});

 $(document).ready(function(){
    $('.carousel').carousel({
        indicators:true
    });
});


/*CONTADOR DE OFERTA
var countDownDate = new Date("Sep 16, 2017 15:37:25").getTime();

// Actualizar la cuenta regresiva cada segundo
var x = setInterval(function() {
  // Obetener la fecha y hora actual
  var now = new Date().getTime();

  // Encuentra la distancia entre ahora y la fecha de la cuenta regresiva
  var distance = countDownDate - now;

  // Cálculos de tiempo para días, horas, minutos y segundos
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Mostrar el resultado en el elemento con id = "demo"
  document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // Si la cuenta atrás está terminada, escriba algún texto
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "LA OFERTA EXPIRÓ";
  }
}, 1000);*/

/*ACTIVE MENU*/
/*$(document).ready(function(){
        var cambio = false;
        $('.nav li a').each(function(index) {
            if(this.href.trim() == window.location){
                $(this).parent().addClass("active");
                cambio = true;
            }
        });
        if(!cambio){
            $('.nav li:first').addClass("active");
        }
    });*/
/*END ACTIVE MENU

/*$('.center').slick({
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
});*/



        
/*MENU FIXED*/
var altura = ($('.navigation-allgs').offset() || { "top": NaN }).top;

$(window).on('scroll', function () {
    if ($(window).scrollTop() > altura) {
        $('.eonav-cntfluid').addClass('menu-fixed');
    } else {
        $('.eonav-cntfluid').removeClass('menu-fixed');
    }
});


$(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });

/*GOOGLE MAPS*/
$('.maps').click(function () {
    $('.maps iframe').css("pointer-events", "auto");
});

$(".maps").mouseleave(function () {
    $('.maps iframe').css("pointer-events", "none");
});


/* --FACEBOOK -- */
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.5";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//TWITTER

!function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
    }
}(document, 'script', 'twitter-wjs');


var wow = new WOW(
  {
    boxClass:     'wow',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       30,          // distance to the element when triggering the animation (default is 0)
    mobile:       true,       // trigger animations on mobile devices (default is true)
    live:         true,       // act on asynchronously loaded content (default is true)
    callback:     function(box) {
      // the callback is fired every time an animation is started
      // the argument that is passed in is the DOM node being animated
    },
    scrollContainer: null // optional scroll container selector, otherwise use window
  }
);
wow.init();