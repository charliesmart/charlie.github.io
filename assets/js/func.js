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

    var $window = $(window);
    var $skillBars = $('.skill-inner');

    $(window).scroll();

    function animate_bar_on_scroll() {
        var winHeight = $window.height();
        var winTop = $window.scrollTop();
        var winBottom = winHeight + winTop;

        $.each($skillBars, function(){
            var $bar = $(this);
            var barHeight = $bar.outerHeight();
            var barTop = $bar.offset().top;
            var barBottom = barHeight + barTop;

            //Check if element is in viewport
            if((barBottom >= winTop) && (barTop <= winBottom)) {
                animate_bar($bar);
            } else {
                $bar.css('width', 0);
                $bar.children().attr('isSet', 'false');
            }
        })
    }

    function animate_bar($bar) {
        var percent = $bar.attr('value');

        $bar.css('width', function(){
            var maxWidthText = $bar.css('maxWidth'); //Get maximum width of inner bar (comes in 'px' format)
            var maxWidthNum = parseInt(maxWidthText.replace('px', '')) //Convert previous string to useable numbers
            var width = Math.round(percent / 100 * maxWidthNum); //Calculate final bar length
            return width.toString() + 'px'; //Return bar length as string with 'px'
        });

        $bar.children().each(function(){
            var $num = $(this);
            var currentValue = $num.text();
            if ($num.attr('isSet') == 'false') {
                $({numberValue: currentValue}).animate({numberValue: percent}, {
                    duration: 800,
                    easing: 'swing',
                    step: function() {
                        $num.text(Math.ceil(this.numberValue) + '%');
                    },
                    done: function() {
                        $num.text(Math.ceil(this.numberValue) + '%');
                    }
                });
                $num.attr('isSet', 'true');
            }
        });
    }

    $window.on('scroll resize', animate_bar_on_scroll);
});
