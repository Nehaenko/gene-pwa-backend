/**
 * Modal Filter

 */
define([
    'jquery',
    'Magento_Ui/js/modal/modal',
    'matchMedia',
    'domReady!'
], function ($) {
    'use strict';

    var helpers = {
        domReady: function() {
            mediaCheck({
                media: '(max-width: 767px)',
                entry: function() {
                    $('.filter').modal({
                        type: 'slide',
                        responsive: true,
                        modalClass: 'filter-modal-wrapper',
                        trigger: '.filter-by',
                        buttons: [{
                            class: 'filter-close-btn',
                            click: function () {
                                this.closeModal();
                            }
                        }]
                    });
                }
            });
        }
    };

    helpers.domReady();
});