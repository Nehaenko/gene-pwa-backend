/*
 * Gene Sticky Element

 *
 */

/* eslint-disable */
define([
    'jquery'
], function ($) {

    $.widget('gene.StickyElement', {

        options: {
            container: '.sticky-header-sentinal',
            target: 'body',
            class: '__sticky-header-active'
        },

        /**
         * Initialise Sticky
         * @private
         */
        _create: function () {

            var _opts = this.options,
                  container = document.querySelector(_opts.container),
                  target = $(_opts.target);

           // Stops it throwing an error if the elem doesn't exisit on a page
            if (!$(_opts.container).length) {
                return;
            }

            var time,
                timeout = 20,
                offset = 0;

            $(window).on('scroll', function () {
                clearTimeout(time);
                time = setTimeout(function () {

                    /* Get the position of the bottom of the window */
                    var position = $(window).scrollTop();
                    if (position > offset) {
                        target.addClass(_opts.class);
                    } else {
                        target.removeClass(_opts.class);
                    }

                }, timeout);

            });
        }
    });

    return $.gene.StickyElement;

});
