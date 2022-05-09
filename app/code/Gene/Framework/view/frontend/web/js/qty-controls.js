/*
 * Gene Framework - Qty Controls
 */
define([
    'jquery'
], function ($) {

    $.widget('gene.qtyControls', {
        _create: function() {
            this._initControls();
        },

        _initControls: function() {
            var self = this,
                el = $(self.element);

            if (!el.hasClass()) {
                el.addClass('js-qty-controls-init');
            }

            /**
             * On Click
             */
            el.find('.js-qty-iterator').on('click', function(e) {
                e.preventDefault();

                var iterator = $(this),
                    elQtyWrap = iterator.closest('div.js-qty-controls-init'),
                    elCurrentQty = elQtyWrap.find('input.qty'),
                    elCurrentQtyVal = elCurrentQty.val(),
                    elIteratorType = iterator.data("iterator-type");

                elQtyWrap.addClass('is-dirty');

                if (typeof elIteratorType != 'undefined') {
                    /**
                     * don't update qty lte 1
                     */
                    if (elIteratorType == "decrement" && elCurrentQtyVal > 1) {
                        elCurrentQty.attr('value', parseInt(elCurrentQtyVal) - 1);
                    }

                    if (elIteratorType == "increment") {
                        elCurrentQty.attr('value', parseInt(elCurrentQtyVal) + 1);

                    }
                }
            });

            /**
             * On Text Input
             */
            el.find('.js-qty').on('input', function(){
                var input = $(this),
                    elQtyWrap = input.parents('.js-qty-controls-init');

                //
                // Only show Update if input has value
                //
                if (input.val()) {
                    elQtyWrap.addClass('is-dirty');
                } else {
                    elQtyWrap.removeClass('is-dirty');
                }

            });
        }
    });

    return $.gene.qtyControls;

});
