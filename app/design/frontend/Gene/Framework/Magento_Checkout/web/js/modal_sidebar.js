/**
 * Minicart Sidebar
 */

define([
    'jquery'
], function ($) {
    'use strict';

    // Minicart Sidebar Widget
    $.widget('mage.minicart_sidebar', {
        options: {
            minicartContainer: '.gt-minicart', // Minicart Content
            openMinicartAction: '.js-open-minicart', // Action that opens mini-cart
            closeMiniCartAction: '.js-close-minicart', // Action that closes mini-cart
            openMinicartClass: '__minicart-open', // Class added to body when mini-cart is open
            emptyCart: '.js-empty', // Class to check if  mini-cart is empty
            hasTabTrapClass: '__has-tab-trap', // Class added to container that has tab trap
            tabKey: 9, // Which key tabs
            escKey: 27, // Which key escapes
            focusableElements: 'a:visible, button:visible, input', // Focusable elements for tab trapping
            tabIndexElements: 'a:visible, button:visible, input, iframe' // Focusable elements that needs tab-index
        },

        /**
         * Initialise
         * @private
         */
        _create: function () {
            var _self = this,
                _opts = _self.options,
                minicartContainer = _opts.minicartContainer;

            _self._initMinicartSidebar();
            _self._setTabIndex($(minicartContainer));
            _self._closeEmptyMinicart();
            _self._initKeyboardClose();
        },

        /**
         * Init sidebar open functionality
         * @private
         */
        _initMinicartSidebar: function() {
            var _self = this,
                _opts = _self.options,
                openMinicartAction = _opts.openMinicartAction;

            // Open Sidebar
            $(openMinicartAction).on('click', function(e) {


                e.preventDefault();
                if ($('.gt-minicart-items-wrapper').length > 0) {
                    _self._minicartOpenAction();
                }
            });

        },

        /**
         * Open Minicart
         * Add Event Listener for Close Action
         * @private
         */
        _minicartOpenAction: function() {
            var _self = this,
                _opts = _self.options,
                openMinicartClass = _opts.openMinicartClass,
                minicartContainer = _opts.minicartContainer,
                closeMiniCartAction = _opts.closeMiniCartAction,
                body = $('body');

            body.addClass(openMinicartClass);

            // Menu is hidden
            $(minicartContainer).attr('aria-hidden', 'false');

            // Remove Tab Index
            _self._removeTabIndex($(minicartContainer));

            // Add Tab Trap
            _self._addTabTrap($(minicartContainer));

            // Close Sidebar Action
            // Is rendered with knockout so need to be called once we know the action exists.
            $(closeMiniCartAction).on('click', function() {
                _self._minicartCloseAction();
            });

        },

        /**
         * Close Minicart
         * @private
         */
        _minicartCloseAction: function() {
            var _self = this,
                _opts = _self.options,
                openMinicartClass = _opts.openMinicartClass,
                minicartContainer = $(_opts.minicartContainer),
                openMinicartAction = $(_opts.openMinicartAction),
                body = $('body');

            body.removeClass(openMinicartClass);

            // Menu is hidden
            minicartContainer.attr('aria-hidden', 'true');

            // Set TabIndex again
            _self._setTabIndex(minicartContainer);

            // Remove Tab Trap
            _self._removeTabTrap();

            // Set Focus on Basket Button again
            // Only if sticky header is active to avoid page moving up
            if (body.hasClass('sticky-header') && body.hasClass('__direction-up')) {
                openMinicartAction.focus();
            }

        },

        /**
         * If there are no items in the minicart, close sidebar.
         * @private
         */
        _closeEmptyMinicart: function() {
            var _self = this,
                emptyCart = $(_self.options.emptyCart),
                body = $('body');

            if (emptyCart.hasClass('empty')) {
                _self._minicartCloseAction();
            }
        },

        /**
         * Create Tab Trap
         * @param element
         * @private
         */
        _addTabTrap: function(element) {
            var _self = this,
                _opts = _self.options,
                tabKey = _opts.tabKey,
                hasTabTrapClass = _opts.hasTabTrapClass,
                focusableElements = element.find(_opts.focusableElements),
                firstFocusableElement = focusableElements.first(),
                lastFocusableElement = focusableElements.last();

            // Remove existing tab traps
            firstFocusableElement.focus();

            // Add Tab Trapping Class
            element.addClass(hasTabTrapClass);

            // Tab events
            element.on('keydown', function (event) {

                var isTabPressed = (event.key === 'Tab' || event.key === tabKey);

                if (!isTabPressed) {
                    return;
                }

                if (event.shiftKey) /* shift + tab */ {
                    if (document.activeElement === firstFocusableElement.get(0)) {
                        lastFocusableElement.focus();
                        event.preventDefault();
                    }
                } else /* tab */ {
                    if (document.activeElement === lastFocusableElement.get(0)){
                        firstFocusableElement.focus();
                        event.preventDefault();
                    }
                }

            });
        },

        /**
         * Close by pressing escape
         * @private
         */
        _initKeyboardClose: function() {
            var _self = this,
                _opts = _self.options,
                escKey = _opts.escKey,
                menuContainerItem = _opts.minicartContainer;

            $(menuContainerItem).on('keyup', function(event) {

                if (event.key === escKey || event.key === 'Escape') {
                    event.preventDefault();
                    _self._minicartCloseAction();
                }
            });
        },

        /**
         * Remove Tab Trap
         * @private
         */
        _removeTabTrap: function() {
            var _opts = this.options,
                hasTabTrapClass = _opts.hasTabTrapClass;

            // Remove tab trapping class
            $(document).find('.'+hasTabTrapClass).unbind('keydown').removeClass(hasTabTrapClass);

        },

        /**
         * Set tabindex : -1
         * Stop the elements from being tabbable when minicart is not open
         * @param element
         * @private
         */
        _setTabIndex: function(element) {
            var _opts = this.options,
                tabIndexElements = element.find(_opts.tabIndexElements);

            // Loop over each element and set tab index
            for (var i = 0; i < tabIndexElements.length; i++) {
                $(tabIndexElements[i]).attr("tabindex", "-1");
            }
        },

        /**
         * Remove tabindex
         * Make elements tabbable again when minicart is open
         * @param element
         * @private
         */
        _removeTabIndex: function(element) {
            var _opts = this.options,
                tabIndexElements = element.find(_opts.tabIndexElements);

            for (var i = 0; i < tabIndexElements.length; i++) {
                $(tabIndexElements[i]).removeAttr("tabindex");
            }
        }

    });

    return $.mage.minicart_sidebar;
});