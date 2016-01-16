$(document).ready(function(){

    /*--------------------------------------
    Autosrcoll to point when user clicks nav
    bar links.
    ---------------------------------------*/
    $('.autoscroll').on('click', function(){
        var id = $(this).attr('id'); //Gets id of link
        $('html, body').animate({
            scrollTop: $('.' + id).offset().top-60 //Finds div with class that matches link id and scrolls to it
        }, 500, "swing");
    });


    /*--------------------------------------
    Create the 'sticky nav'
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


    /*--------------------------------------
    Set skills bars and text to proper values
    ---------------------------------------*/
    $('.skill-inner').css('width', function(){
        var percent = $(this).attr('value'); //Get percent value for bar
        var maxWidthText = $(this).css('maxWidth'); //Get maximum width of inner bar (comes in 'px' format)
        var maxWidthNum = parseInt(maxWidthText.replace('px', '')) //Convert previous string to useable numbers
        var width = Math.round(percent / 100 * maxWidthNum); //Calculate final bar length
        return width.toString() + 'px'; //Return bar length as string with 'px'
    });

    $('.skill-inner p').text(function(){
        return $(this).parent().attr('value').toString() + '%';
    });
});
