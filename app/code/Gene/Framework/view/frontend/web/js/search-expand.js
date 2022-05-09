/*
 * Gene Search Expand
 * Use this JS file to add / remove a class when clicking on a targeted element and Focus Search

 *
 */
define([
    'jquery'
], function ($) {

    $.widget('gene.AddClass', {

        options: {
            target: 'body', // Target that will have class added
            input: '#search', // Input class or id
            class: 'is-search-bar-open' // Class that will be added
        },

        /**
         * Initialise Sticky
         * @private
         */
        _create: function () {
            const _opts = this.options,
                _self = this,
                _elem = $(_self.element);

                _elem.on('click', function () {


                    // Add class
                    if($(_opts.target).hasClass(_opts.class)) {
                        $(_opts.target).removeClass(_opts.class);
                    } else {
                        $(_opts.target).addClass(_opts.class);

                        // Toggle value
                        $(_opts.input).focus();
                    }

                    _self.expandAriaRoles(_elem);

                });
        },


        /**
         * Alter aria-expanded
         * @param element
         */
        expandAriaRoles: function (element) {

            // Toggle value
            element.attr('aria-expanded', function (i, attr) {
                return !attr;
            });

        }
    });

    return $.gene.AddClass;

});
