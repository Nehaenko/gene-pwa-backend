/**
 * Magento Theme JS
 * Remove Cart Summary Sticky
 */

define([
    'jquery',
    'mage/smart-keyboard-handler',
    'mage/mage',
    'mage/ie-class-fixer',
    'domReady!'
], function ($, keyboardHandler) {
    'use strict';

    if ($('body').hasClass('checkout-cart-index')) {
        if ($('#co-shipping-method-form .fieldset.rates').length > 0 &&
            $('#co-shipping-method-form .fieldset.rates :checked').length === 0
        ) {
            $('#block-shipping').on('collapsiblecreate', function () {
                $('#block-shipping').collapsible('forceActivate');
            });
        }
    }

    $('.panel.header > .header.links').clone().appendTo('#store\\.links');

    keyboardHandler.apply();

    if (window.Lazyload) {
        var lazyImages = document.querySelectorAll('[loading=lazy]:not(.is-loaded)');
        var RunLazy = new Lazyload({ images: lazyImages });
        RunLazy.init();
    }
});
