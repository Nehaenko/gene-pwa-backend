/* eslint-disable */
require([
    'jquery'
], function($){

    $(".js-select-nav").each(function() {
        $(this).change(function(e) {
            var url = e.target.value || null;

            if (url) {
                window.location = url;
            }
        });
    });
});