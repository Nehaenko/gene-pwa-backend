define([
    'jquery',
    'Magento_Ui/js/modal/modal',
    'mage/translate',
    'matchMedia',
    'jquery/ui'
], function ($, modal, $t) {
    'use strict';


    $.widget('gene.filters', {

        _create: function () {
            mediaCheck({
                media: '(max-width: 767px)',
                entry: function() {
                    $('.filter').modal({
                        type: 'slide',
                        responsive: true,
                        modalClass: 'filter-modal-wrapper',
                        title: $t('Filter by'),
                        trigger: '.filter-by',
                        buttons: []
                    });
                }
            });
        }
    });


    return $.gene.filters;
});
