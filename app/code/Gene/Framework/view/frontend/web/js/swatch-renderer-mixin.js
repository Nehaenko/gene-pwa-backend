/*
 * Gene Framework
 * swatch-renderer-mixin.js
 */

define([
    'jquery'
], function ($) {
    'use strict';

    return function (widget) {

        /**
         * Update Srcset attribute
         */
        $.widget('mage.SwatchRenderer', widget, {

            _init: function () {
                if (_.isEmpty(this.options.jsonConfig.images)) {
                    this.options.useAjax = true;
                    // creates debounced variant of _LoadProductMedia()
                    // to use it in events handlers instead of _LoadProductMedia()
                    this._debouncedLoadProductMedia = _.debounce(this._LoadProductMedia.bind(this), 500);
                }

                if (this.options.jsonConfig !== '' && this.options.jsonSwatchConfig !== '') {
                    // store unsorted attributes
                    this.options.jsonConfig.mappedAttributes = _.clone(this.options.jsonConfig.attributes);
                    this._sortAttributes();
                    this._RenderControls();
                    this._setPreSelectedGallery();
                    $(this.element).trigger('swatch.initialized');
                } else {
                    console.log('SwatchRenderer: No input data received');
                }
                this.options.tierPriceTemplate = $(this.options.tierPriceTemplateSelector).html();


                // Store original gallery images
                var productData = this._determineProductData();
                if (productData.isInProductView) {
                    var galleryEls = $('#product-gallery img');

                    this.options.mediaGalleryInitial = $.map(galleryEls, function(element) {
                        return {
                            'img': element.src,
                            'data-video-url': element.getAttribute('data-video-url')
                        };
                    });
                }
            },

            /**
             * Update [gallery-placeholder] or [product-image-photo]
             * @param {Array} images
             * @param {jQuery} context
             * @param {Boolean} isInProductView
             */
            updateBaseImage: function (images, context, isInProductView) {

                var that = this,
                    justAnImage = images[0];

                if (isInProductView) {

                    // Create Fragments
                    var imageCollection = document.createDocumentFragment();
                    var thumbCollection = document.createDocumentFragment();

                    // Create Html
                    for (var index = 0; index < images.length; ++index) {
                        that._createGalleryItem(imageCollection, images[index]);
                        that._createThumbItem(thumbCollection, images[index]);
                    }

                    // Replace Gallery with correct product images
                    that._updateGallery(imageCollection, thumbCollection);

                } else if (justAnImage && justAnImage.img) {
                    context.find('.product-image-photo').attr('src', justAnImage.img);
                    context.find('.product-image-photo').attr('srcset', justAnImage.img);
                }
            },

            /**
             * Create Gallery Item
             * @param fragment
             * @param image
             * @private
             */
            _createGalleryItem: function (fragment, image) {

                // Create Li
                var li = document.createElement('li');
                li.classList.add('gene-slider__item');
                li.classList.add('gallery__item');

                // add video classes/attributes
                if (image['data-video-url']) {
                    li.setAttribute('data-gslider-video','');
                    li.classList.add('gene-slider__item--video');
                }

                // Create Figure
                var figure = document.createElement('figure');
                figure.classList.add('gene-slider__item-zoom');

                // add video classes/attributes
                if (image['data-video-url']) {
                    figure.setAttribute('data-gslider-video-item','');
                }

                li.appendChild(figure);

                // Create image
                var img = document.createElement('img');
                img.setAttribute('src', image.img);
                img.setAttribute('data-zoom', image.full);
                // add video classes/attributes
                if (image['data-video-url']) {
                    img.setAttribute('data-video-url', image['data-video-url']);

                }

                figure.appendChild(img);

                fragment.appendChild(li);
            },

            /**
             * Create Thumb Items
             * @param fragment
             * @param image
             * @private
             */
            _createThumbItem: function (fragment, image) {

                // Create Li
                var li = document.createElement('li');
                li.classList.add('gene-slider__item');
                li.classList.add('thumbs__item');

                // Create Anchor
                var anchor = document.createElement('a');
                anchor.setAttribute('href', image.full);
                li.appendChild(anchor);

                // Create image
                var img = document.createElement('img');
                img.setAttribute('src', image.img);
                anchor.appendChild(img);

                fragment.appendChild(li);
            },

            /**
             * Update Main Gallery and Thumb Controls
             * @param gallery
             * @param thumbGallery
             * @private
             */
            _updateGallery: function(gallery, thumbGallery) {
                if (!window.productGallery || !window.productThumbs) {
                    return;
                }

                var galleryObject = document.getElementById('product-gallery'),
                    thumbControls = document.getElementById('gallery-thumbs');

                if (!galleryObject || !thumbControls) {
                    return;
                }

                // Empty the galleries
                galleryObject.innerHTML = '';
                thumbControls.innerHTML = '';

                // Add our new fragments
                galleryObject.appendChild(gallery);
                thumbControls.appendChild(thumbGallery);

                // Re-initialise the galleries
                var productGallery = new GeneMGSlider(galleryObject, window.productGallery.config);

                var productGalleryThumbs = new GeneMGSlider(thumbControls, window.productThumbs.config);

                productGallery.initSlider(true, productGalleryThumbs);
                productGalleryThumbs.initSlider(true, productGallery);
            }

        });

        return $.mage.SwatchRenderer;
    }
});
