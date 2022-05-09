/*
 * Gene Framework - Minicart Trigger
 * Trigger cart to open when items are added.
 */
define([
    'jquery',
    'domReady!'
], function ($) {
    $('[data-block="minicart"]').on('contentLoading', function () {
        $('[data-block="minicart"]').on('contentUpdated', function ()  {
            $(".js-open-minicart").trigger("click");
        });
    });
});
