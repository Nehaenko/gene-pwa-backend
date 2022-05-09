/**
 * Gene Framework - Slick Product Slider

 */
define([
    'jquery',
    'slick'
], function ($, slick) {

    $.widget('gene.slickProductSlider', {

        options: {
            infinite: false,
            dots: false,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: true,
            autoplay: false,
            lazyLoad: 'ondemand',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3
                    }
                }
            ]
        },

        _create: function() {
            this._initSlider();
        },

        _initSlider: function() {
            var self = this,
                el = $(self.element);

            el.slick(self.options);
        }
    });

    return $.gene.slickProductSlider;

});