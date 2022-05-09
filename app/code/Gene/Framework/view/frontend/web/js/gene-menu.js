/*
 * Gene Framework - Menu
 *

 *
 * Features:
 *
 * - Menu Toggle
 * - Mobile Menu Parent Links Active State
 *
 * @todo - Add up / down / space / enter controls for mobile
 */

/* eslint-disable */
define([
    'jquery',
], function ($) {

    $.widget('gene.megaMenu', {

        options: {
            parentLinkItem: '.js-menu-parent-link', // Selector for parent links
            topLevelParentLinkItem: '.js-menu-parent-link-top', // Selector for top level parent links
            backLinkItem: '.js-menu-back-link', // Selector for back link
            sectionItem: '.js-menu-mobile-section', // Selector for mobile section
            toggleMenuItem: '.js-menu-toggle', // Selector for toggle link
            menuContainerItem: '.js-menu-container', // Selector for menu container
            openSectionClass: '__menu-section-open', // Class added to open section
            openMenuClass: '__menu-open', // Class added to body when menu is open
            hasTabTrapClass: '__has-tab-trap', // Class added to container that has tab trap
            mobileMenuWidth: 1023, // Max width for mobile events
            backKey: 37, // Which key goes back
            upKey: 38, // Which key goes up
            forwardKey: 39, // Which key goes forwards
            downKey: 40, // Which key goes down
            tabKey: 9, // Which key tabs
            escKey: 27, // Which key escapes
            focusableElements: 'a:visible, button:visible', // Focusable elements
            desktopTimeout: 200 // Timeout for Desktop Menu

        },

        // Init Menu
        _create: function() {
            this._initToggleLinks();
            this._initParentMenuLinks();
            this._initBackLinks();
            this._initKeyboardClose();
            this._initDesktopControls();
            this._initAriaRoles();
        },

        /**
         * Main Toggle function to hide and show the menu
         * @private
         */
        _initToggleLinks: function() {
            var _self = this,
                _opts = _self.options,
                openMenuClass = _opts.openMenuClass,
                toggleMenuItem = _opts.toggleMenuItem,
                mobileMenuWidth = _opts.mobileMenuWidth,
                body = $('body');

            // Toggle menu open and close
            $(toggleMenuItem).on('click', function() {

                // Only for mobile
                if ($(window).width() <= mobileMenuWidth) {

                    if (body.hasClass(openMenuClass)) {
                        _self._menuCloseAction();

                    } else {
                        _self._menuOpenAction();
                    }
                }
            });
        },

        /**
         * Close Menu by pressing escape
         * @private
         */
        _initKeyboardClose: function() {
            var _self = this,
                _opts = _self.options,
                escKey = _opts.escKey,
                menuContainerItem = _opts.menuContainerItem;

            $(menuContainerItem).on('keyup', function(event) {

                if (event.key === escKey || event.key === 'Escape') {
                    event.preventDefault();
                    _self._menuCloseAction();
                }
            });
        },

        /**
         * Close Menu
         * @private
         */
        _menuCloseAction: function() {
            var _self = this,
                _opts = _self.options,
                toggleMenuItem = _opts.toggleMenuItem,
                openMenuClass = _opts.openMenuClass,
                menuContainerItem = _opts.menuContainerItem,
                openSectionClass = _opts.openSectionClass,
                body = $('body');

            body.removeClass(openMenuClass);

            // All toggles are not expanded
            $(toggleMenuItem).attr('aria-expanded', 'false');

            // Menu is hidden
            $(menuContainerItem).attr('aria-hidden', 'true');

            // Remove the active class from all children
            $(menuContainerItem).find('.' + openSectionClass).removeClass(openSectionClass);

            // Remove Tab Trap + Focus at the top of the page
            _self._removeTabTrap($(menuContainerItem));
            body.focus();

        },

        /**
         * Open Menu
         * @private
         */
        _menuOpenAction: function() {
            var _self = this,
                _opts = _self.options,
                toggleMenuItem = _opts.toggleMenuItem,
                openMenuClass = _opts.openMenuClass,
                menuContainerItem = _opts.menuContainerItem,
                body = $('body');

            body.addClass(openMenuClass);

            // All toggles are not expanded
            $(toggleMenuItem).attr('aria-expanded', 'true');

            // Menu is hidden
            $(menuContainerItem).attr('aria-hidden', 'false');

            // Add Tab Trap + Focus in the menu
            _self._focusFirstElement($(menuContainerItem));
            _self._addTabTrap($(menuContainerItem));
        },


        /**
         * Parent Link
         * @private
         */
        _initParentMenuLinks: function() {
            var _self = this,
                _opts = _self.options,
                parentLinkItem = _opts.parentLinkItem,
                forwardKey = _opts.forwardKey;

            // Click Action
            $(parentLinkItem).on('click', function (event) {
                _self._parentLinkAction($(this), event);
            });

            // Back Key Action
            $(parentLinkItem).on('keydown', function (event){

                var linkItem = $(this);

                if(event.keyCode === forwardKey) {
                    _self._parentLinkAction(linkItem, event);
                }
            });

            if ($(".main-nav__wrapper").hasClass("expanded")) {
                var menuItemsLi = $('.main-nav__wrapper li [data-role="content"]');
                menuItemsLi.each(function (index, elem) {
                    if ($(elem).is(':empty')) {
                        $(elem).closest("li").addClass('cats-empty');
                    }
                });

                $('.cats-empty [data-role="title"]').click(function () {
                    var emptyCatLinkHref = $(this).find('.main-nav__link').attr('href');
                    var emptyCatCMSLinkHref = $(this).find('[data-element="link"]').attr('href');

                    if (emptyCatLinkHref) {
                        window.location.replace(emptyCatLinkHref);
                    }

                    if (emptyCatCMSLinkHref) {
                        window.location.replace(emptyCatCMSLinkHref);
                    }
                });
            }
        },

        /**
         * Parent Link Action
         * @param linkItem
         * @param event
         * @private
         */
        _parentLinkAction: function(linkItem, event) {
            var _self = this,
                _opts = _self.options,
                sectionItem = _opts.sectionItem,
                openSectionClass = _opts.openSectionClass,
                mobileMenuWidth = _opts.mobileMenuWidth,
                parentLinkItem = _opts.parentLinkItem,
                width = $(window).width();


            // Only prevent default action for mobile menu
            if (width <= mobileMenuWidth) {
                event.preventDefault();

                // On mobile, all other links are not expanded
                $(parentLinkItem).attr('aria-expanded', 'false');
                linkItem.attr('aria-expanded', 'true');
            }

            var container = linkItem.parent().find(sectionItem).first();
            container.addClass(openSectionClass).attr('aria-hidden', 'false');

            // Focus on the first focusable element if the current link has focus
            if (linkItem.is(':focus')) {
                _self._focusFirstElement(container);
            }
            _self._addTabTrap(container);

        },

        /**
         * Close all child links
         * @private
         */
        _closeAllChildren: function() {
            var _self = this,
                _opts = _self.options,
                openSectionClass = _opts.openSectionClass;

            $('.'+openSectionClass).removeClass(openSectionClass).attr('aria-hidden', 'true');
        },

        /**
         * Back Links
         * @private
         */
        _initBackLinks: function() {
            var _self = this,
                _opts = _self.options,
                backLinkItem = _opts.backLinkItem,
                backKey = _opts.backKey;

            // Click Action
            $(backLinkItem).on('click', function (event) {
                _self._backAction($(this), event);
            });

            // Back Key Action
            $(backLinkItem).on('keydown', function (event){

                var linkItem = $(this);

                if(event.keyCode === backKey) {
                    _self._backAction(linkItem, event);
                }
            });
        },


        /**
         * Back Link Action
         * @param linkItem
         * @param event
         * @private
         */
        _backAction: function(linkItem, event) {
            var _opts = this.options,
                sectionItem = _opts.sectionItem,
                parentLinkItem = _opts.parentLinkItem,
                menuContainerItem = _opts.menuContainerItem,
                openSectionClass = _opts.openSectionClass,
                mobileMenuWidth = _opts.mobileMenuWidth,
                width = $(window).width();


            // Only prevent default action for mobile menu
            if (width <= mobileMenuWidth) {
                event.preventDefault();
            }

            // If there is no container focus on the menu container
            var container = linkItem.parents(sectionItem).first(),
                parentContainer = (container.parents(sectionItem).length) ? container.parents(sectionItem).first() : $(menuContainerItem);

            container.removeClass(openSectionClass).attr('aria-hidden', 'true');
            parentContainer.attr('aria-hidden', 'false');
            parentContainer.find(parentLinkItem).attr('aria-expanded', 'false');


            // Focus on the first focusable elem
            this._focusFirstElement(parentContainer);
            this._addTabTrap(parentContainer);

        },

        /**
         * Focus first element
         * @param container
         * @private
         */
        _focusFirstElement: function(container) {
            var _opts = this.options,
                focusableElements = _opts.focusableElements;


            container.find(focusableElements).first().focus();
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
                lastFocusableElement = focusableElements.last(),
                mobileMenuWidth = _opts.mobileMenuWidth,
                width = $(window).width();

            // We don't want to tab trap sub menus on desktop
            if (element.data('level') > 0 && (width > mobileMenuWidth)) {
                return;
            }

            // Remove existing tab traps
            _self._removeTabTrap();

            element.addClass(hasTabTrapClass);

            element.on('keydown', function(event) {

                var isTabPressed = (event.key === 'Tab' || event.keyCode === tabKey);

                if (!isTabPressed) {
                    return;
                }

                if (event.shiftKey) /* shift + tab */ {
                    if (document.activeElement === firstFocusableElement.get(0)) {
                        lastFocusableElement.focus();
                        event.preventDefault();
                    }
                } else /* tab */ {
                    if (document.activeElement === lastFocusableElement.get(0)) {
                        firstFocusableElement.focus();
                        event.preventDefault();
                    }
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

            $(document).find('.'+hasTabTrapClass).unbind('keydown').removeClass(hasTabTrapClass);
        },

        /**
         * Desktop Actions
         * @private
         * @todo - this method is pretty massive and should be split up
         */
        _initDesktopControls: function() {
            var _self = this,
                _opts = _self.options,
                topLevelParentLinkItem = _opts.topLevelParentLinkItem,
                sectionItem = _opts.sectionItem,
                menuContainerItem = _opts.menuContainerItem,
                downKey = _opts.downKey,
                mobileMenuWidth = _opts.mobileMenuWidth,
                upKey = _opts.upKey,
                desktopTimeout = _opts.desktopTimeout,
                timer;

            // Mouse Over event
            $(topLevelParentLinkItem).on('mouseover', function(event) {
                var width = $(window).width(),
                    linkItem = $(this);

                // Only for desktop
                if (width > mobileMenuWidth) {

                    // Clear the timer
                    if(timer) {

                        clearTimeout(timer);
                        timer = null
                    }

                    // Open the menu
                    timer = setTimeout(function() {

                        _self._closeAllChildren();
                        _self._parentLinkAction(linkItem, event);

                    }, desktopTimeout);
                }
            });

            // Mouse Leave
            $(menuContainerItem).on('mouseleave', function() {

                // Only for desktop
                var width = $(window).width();
                if (width > mobileMenuWidth) {

                    // Clear the timer
                    if(timer) {

                        clearTimeout(timer);
                        timer = null
                    }

                    _self._closeAllChildren();
                }
            });

            // Press down to open dropdown
            $(topLevelParentLinkItem).on('keydown', function (event){
                var linkItem = $(this),
                    width = $(window).width();

                // Only for Desktop
                if(event.keyCode === downKey && width > mobileMenuWidth) {

                    // Close other menus
                    _self._closeAllChildren();
                    _self._parentLinkAction(linkItem, event);

                    event.preventDefault();
                }
            });

            // Press up to close drop down
            $(sectionItem).find('a').on('keydown', function (event){
                var width = $(window).width();

                if(event.keyCode === upKey && width > mobileMenuWidth) {
                    // Close other menus
                    _self._closeAllChildren();

                    event.preventDefault();
                }
            });


        },

        /**
         * Init Aria Roles
         * @private
         */
        _initAriaRoles: function() {
            var _opts = this.options,
                sectionItem = _opts.sectionItem,
                parentLinkItem = _opts.parentLinkItem,
                menuContainerItem = _opts.menuContainerItem,
                toggleMenuItem = _opts.toggleMenuItem,
                topLevelParentLinkItem = _opts.topLevelParentLinkItem,
                mobileMenuWidth = _opts.mobileMenuWidth;

            // Mobile Aria Roles
            if ($(window).width() <= mobileMenuWidth) {

                // All toggles are not expanded
                $(toggleMenuItem).attr('aria-expanded', 'false');
                $(parentLinkItem).attr('aria-expanded', 'false').attr('aria-haspopup', 'true');

                // All menus are hidden
                $(menuContainerItem).attr('aria-hidden', 'true');
                $(sectionItem).attr('aria-hidden', 'true');

            } else {
                $(topLevelParentLinkItem).attr('aria-haspopup', 'true');
            }
        }


    });

    return $.gene.megaMenu;

});
