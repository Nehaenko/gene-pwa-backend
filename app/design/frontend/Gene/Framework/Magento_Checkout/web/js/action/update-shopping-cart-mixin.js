/**
 * Gene Framework - Update Shopping Cart Mixin
 * added _updateForm method to trigger parent submitForm
 */
define([
    'jquery'
], function ($) {

    return function (target) {

        $.widget('mage.updateShoppingCart', target, {

            /**
             * inherit parent widget then append new methods
             *
             */
            _create: function () {
                this._super();
                this._updateForm();
                this._handleDirty();
            },

            /**
             * trigger parent submitForm method
             */
            _updateForm: function () {
                var self = this, updateQtyBtn = $('.js-update-qty');
                updateQtyBtn.click(function (e) {
                    e.preventDefault();

                    self.submitForm();
                });
            },

            _handleDirty: function () {
                var quantityControl = $('[data-role="cart-item-qty"]');

                quantityControl.change(function () {
                    $(this).parent('.field').addClass('is-dirty');
                });
            }
        });

        return $.mage.updateShoppingCart;
    }
});