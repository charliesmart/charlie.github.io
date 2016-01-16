$(document).ready(function(){

    /*--------------------------------------
    Function to autosrcoll to point when user
    clicks nav bar links.
    ---------------------------------------*/
    $('.autoscroll').on('click', function(){
        var id = $(this).attr('id'); //Gets id of link
        $('html, body').animate({
            scrollTop: $('.' + id).offset().top-60 //Finds div with class that matches link id and scrolls to it
        }, 500, "swing");
    });


    /*--------------------------------------
    Function to create the 'sticky nav'
    ---------------------------------------*/
    var navTop = $('.nav-main').offset().top; //Finds offset of nav

    $(window).resize(function(){
        navTop = $('.nav-main').offset().top; //Resets navTop on window resize
    });

    var stickyNav = function() {
        var scrollTop = $(window).scrollTop();
        if(scrollTop > navTop) {                 //If scroll is greater than nav offset, make nav sticky
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
