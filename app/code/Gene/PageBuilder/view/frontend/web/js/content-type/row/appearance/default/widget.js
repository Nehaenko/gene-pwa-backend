define([
    'jquery',
    'jarallax',
    'accordion'
], function ($) {
    'use strict';

    return function (config, element) {
        var $element = $(element),
            parallaxSpeed = null;

        if ($element.data('appearance') === 'accordion') {
            $element.addClass('accordion');
            var accordionTitle = $element.data('accordion-title');
            $element.find('.accordion-block-title').html('<p>' + accordionTitle + '</p>');
            $element.find('.row-full-width-inner').accordion({
                'active': true,
                'collapsible': true,
                'multipleCollapsible': false,
                'accordionMediaCheck': '(min-width: 768px)',
                'animate': {
                    'duration': 200
                }
            });

            $element.on('click', function () {
                $(this).toggleClass('active')
            })
        }

        if ($element.data('appearance') === 'contained') {
            $element = $(element).find('[data-element="inner"]');
        }

        if ($element.data('enableParallax') !== 1) {
            return;
        }

        $element.addClass('jarallax');
        $element.attr('data-jarallax', '');

        parallaxSpeed = parseFloat($element.data('parallaxSpeed'));

        window.jarallax($element[0], {
            imgPosition: $element[0].style.backgroundPosition || '50% 50%',
            imgRepeat: $element[0].style.backgroundRepeat || 'no-repeat',
            imgSize: $element[0].style.backgroundSize || 'cover',
            speed: !isNaN(parallaxSpeed) ? parallaxSpeed : 0.5
        });
    };
});
