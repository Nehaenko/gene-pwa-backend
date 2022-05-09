/**
 * Collapsible Filter

 */
define([
    'jquery',
    'accordion',
    'domReady!'
], function ($) {
    'use strict';

    var helpers = {
        domReady: function() {
            $('.filter-subtitle').click(function() {
                $('body').toggleClass('_filters-hidden');
            });
        }
    };

    helpers.domReady();
});
