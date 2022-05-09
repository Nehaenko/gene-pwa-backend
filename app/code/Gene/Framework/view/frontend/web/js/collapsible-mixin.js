define([
    'jquery'
], function ($) {
    "use strict";

    return function (target) {
        $.widget('mage.collapsible', target, {

            /**
             * Add Check If Sticky Header Is Enabled,
             * Amend Scroll Action
             * @private
             */
            _scrollToTopIfNotVisible: function () {


                if (this._isElementOutOfViewport()) {

                    if ($('body').hasClass('__sticky-header-enabled')) {

                        var headerHeight = $('.page-header').outerHeight(),
                            offset = $(this.header[0]).offset().top - headerHeight;

                        $('html, body').animate({
                            scrollTop: offset
                        }, 600);

                    } else {
                        this.header[0].scrollIntoView();
                    }
                }
            }

        });
        return $.mage.collapsible;
    }
});