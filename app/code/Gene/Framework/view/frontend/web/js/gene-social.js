/* eslint-disable */
require([
    'jquery'
], function($){

    /**
     * Create a small, centred browser window fo social share links
     */
    function socialWindow(url) {
        var left = (screen.width - 570) / 2;
        var top = (screen.height - 570) / 2;
        var params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top + ",left=" + left;
        window.open(url,"NewWindow",params);
    }

    $(".js-social-trigger").each(function() {
        $(this).click(function() {
            if (navigator.share) {
                var title = document.title;
    
                navigator.share({
                    title: title,
                    url: window.location.href
                }).then(() => {
                    // do nothing
                })
                .catch(console.error);
            } else {
                if ($(this).attr('aria-expanded') === 'false') {                        
                    $('.js-social-box').attr('aria-hidden', 'false');
                    $(this).attr('aria-expanded', 'true');
                } else {
                    $('.js-social-box').attr('aria-hidden', 'true');
                    $(this).attr('aria-expanded', 'false');
                }    
            }
        });
    });



    /**
     * Open Window on click
     */
    $(".js-social-share").click(function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        socialWindow(url);
    });

});