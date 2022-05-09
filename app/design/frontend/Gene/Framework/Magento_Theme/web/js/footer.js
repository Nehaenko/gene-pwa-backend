define([
    'jquery',
    'collapsible',
    'matchMedia'
], function ($) {
    'use strict';

    var $container = $('.js-collapsible'),
        accordionOptions = {
            header : '.column-title',
            content: '.column-content'
        };

    $container.each(function (index, elem) {
        var $this = $(elem),
            $accordion = $this.collapsible(accordionOptions);

        mediaCheck({
            media: '(max-width: 1023px)',
            entry: function () {
                $accordion.collapsible('deactivate');
                $accordion.collapsible('option', 'collapsible', true);
            },
            exit: function () {
                $accordion.collapsible('activate');
                $accordion.collapsible('option', 'collapsible', false);

            }
        });
    });
});