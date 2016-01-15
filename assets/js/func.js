$(document).ready(function(){
    $('.autoscroll').on('click', function(){
        var id = $(this).attr('id');
        $('html, body').animate({
            scrollTop: $('.' + id).offset().top-60
        }, 500, "swing");
    });

    var navTop = $('.nav-main').offset().top;
    var stickyNav = function() {
        var scrollTop = $(window).scrollTop();
        if(scrollTop > navTop) {
            $('.nav-main').addClass('sticky');
        } else {
            $('.nav-main').removeClass('sticky');
        }
    }

    stickyNav();

    $(window).scroll(function() {
        stickyNav();
    });

});
