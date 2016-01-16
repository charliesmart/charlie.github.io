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
    // Cash these values
    var $window = $(window);
    var $skillBars = $('.skill-inner');

    //Trigger a scroll event when you load the page
    $window.trigger('scroll');

    //Main function that checks whether skill bars are on screen
    function animate_bar_on_scroll() {
        var winHeight = $window.height(); //Height of the window
        var winTop = $window.scrollTop(); //How far you've scrolled to top of screen
        var winBottom = winHeight + winTop; //How far you've scrolled to bottom of screen

        //Check if each skill bar is visible on screen
        $.each($skillBars, function(){
            var $bar = $(this); //Cash value
            var barHeight = $bar.outerHeight(); //Get height of bar
            var barTop = $bar.offset().top; //Get top offset of bar
            var barBottom = barHeight + barTop; //Get bottom offset of bar

            //Check if element is in viewport
            if((barBottom >= winTop) && (barTop <= winBottom)) {
                animate_bar($bar); //Call animate_bar function below
            } else {
                $bar.css('width', 0); //Reset bar width
                $bar.children().attr('isSet', 'false'); //Reset isSet - explained below
            }
        })
    }

    //Function that actually does the animating once the bars are visible
    function animate_bar($bar) {

        var percent = $bar.attr('value'); //Get skill percent from value attribut in HTML

        //Set width of bar
        $bar.css('width', function(){
            var maxWidthText = $bar.css('maxWidth'); //Get maximum width of inner bar (comes in 'px' format)
            var maxWidthNum = parseInt(maxWidthText.replace('px', '')) //Convert previous string to useable numbers
            var width = Math.round(percent / 100 * maxWidthNum); //Calculate final bar length
            return width.toString() + 'px'; //Return bar length as string with 'px'
        });

        //Set and animate percentage text
        $bar.children().each(function(){ //Select children (p's containing percentage)

            var $num = $(this); //Cash this

            //We have to check is isSet is true before we execute. isSet becomes true when the percent increment animation
            //first happens, and becomes false when the elements go off screen. This ensure the percent increment animation
            //does not continuously fire as the user scrolls with the elements on screen.
            if ($num.attr('isSet') == 'false') {
                $({numberValue: 0}).animate({numberValue: percent}, { //Animate percent value from 0 to percent, defined earlier in animate_bar
                    duration: 800,
                    easing: 'swing',
                    step: function() {
                        $num.text(Math.ceil(this.numberValue) + '%'); //Actually set the text to the number with eprcent sign
                    },
                    done: function() {
                        $num.text(Math.ceil(this.numberValue) + '%');
                    }
                });
                $num.attr('isSet', 'true'); //Set isSet to true once the animation is complete
            }
        });
    }

    //Fire everything above whenever the user scrolls or resizes the window
    $window.on('scroll resize', animate_bar_on_scroll);


    /*--------------------------------------
    Generate skillbar tooltip
    ---------------------------------------*/
    //Fires on mouseenter over a skillbar
    $('.skill-outer').mouseenter(function() {

        //Here, we define a whole lot of variables
        var $bar = $(this);
        var text = $bar.attr('info'); //Get text to be inserted from HTML attr

        //Set tooltip text to HTML attr value
        $('.skills .tooltip').children().text(text);

        var tooltipHeight = parseInt($('.skills .tooltip').css('height').replace('px', '')); //Get height of tooltip
        var tooltipWidth = parseInt($('.skills .tooltip').css('width').replace('px', '')); //Get width of tooltip
        var winTop = $(window).scrollTop(); //Get window scrolltop

        var top = $bar.offset().top; //Get distance from skill bar to top of window
        var left = $bar.offset().left; //Get distance from skillbar to left of window
        var width = parseInt($bar.css('width').replace('px', '')); //Get width of skillbar

        //Now, we do some calcualtions
        var midPoint = (left + (width / 2) - (tooltipWidth / 2)); //Use skillbar width, tooltip width, and distance from left of screen to center tooltip over skillbar
        var topPoint = (top - winTop - tooltipHeight - 10); //Put tooltip slightly over skillbar

        //Actually set the CSS of the tooltip and make it appear
        $('.skills .tooltip').css('top', topPoint + 'px');
        $('.skills .tooltip').css('left', midPoint + 'px');
        $('.skills .tooltip').css('display', 'block');
        $('.skills .tooltip').animate({opacity: 1}, 200);
    });

    //Fires on mouseleave from a skillbar
    $('.skill-outer').mouseleave(function() {
        $('.skills .tooltip').animate({opacity: 0}, 60, function(){
            $(this).css('display', 'none'); //After opacity animation, change display to none in callback function
        });
    });
});
