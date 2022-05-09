/**
 * Gene Slider
 * An alternative to Slick which utilises CSS scroll snap points
 *
 * @copyright Gene Commerce Ltd 2019
 */

/* eslint-disable */
define(['matchMedia'], function () {
    'use strict';

     /**
     * GeneSlider Prototype.
      * @param {Node} slider
      * @param {Node} controls
      */
     function GeneMGSlider(slider, config) {
        this.slider = slider;
        this.config = config || {};
        this.slides = this.slider.querySelectorAll('li, [data-content-type="slide"]');

        // no slides? quit
        if (this.slides.length === 0) {
            return;
        }

        this.sliderCount = this.slides.length;
        this.itemWidth = this.slides[0].offsetWidth;
        this.itemHeight = this.slides[0].offsetHeight;

        this.previous = null;
        this.next = null;

        this.isVertical = false;

        // options
        this.showArrows = false;
        this.autoSlide = false;
        this.slidesToShow = null;
        this.zoom = false;
        this.manages = false;
        this.controlledSlider = null;

        this.clickSlideToScroll = false;
        this.lightbox = false;
        this.showDots = false;
        this.scrollAllSlides = true;
        this.lazyLoad = true;

        this.scale = '200%';

        // slide index
        this.slideIndex = 0;
    }

    var global = window || global;
    global.GeneMGSlider = GeneMGSlider;

    GeneMGSlider.prototype.getConfig = function(slider) {
        if (
            slider.getAttribute('data-gslider') &&
            !isEmpty(slider.getAttribute('data-gslider'))
        ) {
            var configArray = slider.getAttribute('data-gslider').replace(/\s/g,'').split(',');
            var thisConfig = {};

            configArray.forEach(function(config) {
                var configArr = config.split(':');

                var key = configArr[0];
                var value = configArr[1];

                thisConfig[key] = value;
            });

            return thisConfig;
        }

        return {};
    };

    /**
     * initSlider
     */
    GeneMGSlider.prototype.initSlider = function(reInit, controlledSlider) {
        // Clean HTML if re-init
        if (reInit) {
            var container = this.slider.parentElement;

            Array.from(container.children).forEach(function(child){
                if (child.classList.contains('gene-slider__control--prev') ||
                    child.classList.contains('gene-slider__control--next') ||
                    child.classList.contains('gene-slider-dots') ||
                    child.classList.contains('gene-slider__zoom-outside')) {
                        container.removeChild(child);
                }
            });
        }

        if (this.slides.length === 0) {
            return;
        }

        // If no config provided see if it's in the data attribute
        if (isEmpty(this.config)) {
            this.config = this.getConfig(this.slider);

            // If no options are provided, the slider falls back to a simple scrolling slider
            // Using CSS Snap Points - so no need to execute JS.
            if (isEmpty(this.config)) {
                return;
            }
        }

        var config = this.config;
        this.showArrows = ('arrows' in config) ? config.arrows : false;
        this.showDots = ('dots' in config) ? config.dots : false;
        this.autoSlide = ('autoplay' in config) ? parseInt(config.autoplay, 10) : false;
        this.isVertical = ('vertical' in config) ? config.vertical : false;
        this.zoom = ('zoom' in config) ? config.zoom : false;
        this.clickSlideToScroll = ('clickslide' in config) ? config.clickslide : false;
        this.lightbox = ('lightbox' in config) ? config.lightbox : false;
        this.lazyLoad = ('lazyLoad' in config) ? config.lazyLoad : true;
        this.isDesktop = window.matchMedia('(min-width: 1024px)').matches;

        // Specifying "slidesToShow" changes behaviour to always increment slider scroll by slide-width
        // as opposed to maintaining an index
        // change the number provided based on window.matchMedia for different slides per screen size
        this.slidesToShow = ('slidesToShow' in config) ? parseInt(config.slidesToShow, 10) : false;
        this.scrollAllSlides = this.slidesToShow;

        if (typeof controlledSlider === 'object') {
            this.manages = true;
            this.controlledSlider = controlledSlider;
        }

        if (this.scrollAllSlides) {
            this.sliderCount = Math.ceil(this.sliderCount / (this.slidesToShow || 0));
        }

        if (this.showArrows) {
            this.addControls();
        }

        if (this.showDots) {
            this.addDots();
        }

        if (this.autoSlide) {
            this.autoSliding();
        }

        if (this.zoom && this.isDesktop) {
            if (this.zoom === 'outside') {
                this.initZoomOutside();
            } else {
                this.initZoom();
            }
        }

        if (this.slidesToShow) {
            for (var i = 0; i < this.slides.length; i++) {
                var width = 100 / this.slidesToShow;
                var slide = this.slides[i];
                slide.style.flexBasis = width + '%';
                slide.style.minWidth = width + '%';
            }
        }

        if (this.clickSlideToScroll) {
            for (var i = 0; i < this.slides.length; i++) {
                var that = this;
                var anchor = this.slides[i].querySelectorAll('a')[0];

                if (anchor) {
                    anchor.onclick = function(e){
                        e.preventDefault();
                        that.scrollToSlide(e);
                    };
                }
            }
        }

        if (this.lightbox) {
            this.initLightbox();
        }

        // Video
        this.showVideo();

        // Lazy load
        if (this.lazyLoad) {
            this.runLazyLoad();
        }

        var that = this;
        this.slider.addEventListener('scroll', debounce(function() {
            var index = Math.round((that.slider.scrollLeft / that.slider.scrollWidth) * that.sliderCount);
            var activeSlide = that.slides[index];

            // Add/remove active class
            for (var i = 0; i < that.slides.length; i++) {
                that.slides[i].classList.remove('is-active');
            }

            activeSlide.classList.add('is-active');
            that.checkDots(that.slider, index, that.showDots);
        }, 250));

        this.slides[this.slideIndex].classList.add('is-active');
        this.slider.classList.add('is-ready');
    };

    GeneMGSlider.prototype.addControls = function() {
        var leftControl = document.createElement('button'),
            rightControl = document.createElement('button'),
            container = this.slider.parentElement;

        // Don't show if there aren't enough slides to scroll
        var sliderSize = this.isVertical ? this.slider.offsetHeight : this.slider.offsetWidth;
        var slidesSize = (this.isVertical ? this.itemHeight : this.itemWidth)*this.sliderCount;
        if (slidesSize < (sliderSize + 10) ) {
            return;
        }

            leftControl.classList.add('gene-slider__control--prev');
            rightControl.classList.add('gene-slider__control--next');

            if (this.isVertical) {
                leftControl.classList.add('gene-slider__control--vertical');
                rightControl.classList.add('gene-slider__control--vertical');
            }

            leftControl.setAttribute('aria-label', 'Previous');
            rightControl.setAttribute('aria-label', 'Next');

            if (this.manages) {
                leftControl.setAttribute('data-next-controls', this.slider.id);
                rightControl.setAttribute('data-prev-controls', this.slider.id);
            }

            leftControl.innerHTML = "<svg class=\"icon icon-arrow icon-arrow--left\"><use xlink:href=\"#icon-arrow\"></use></svg>";
            rightControl.innerHTML = "<svg class=\"icon icon-arrow icon-arrow--right\"><use xlink:href=\"#icon-arrow\"></use></svg>";

            leftControl.type = "button";
            rightControl.type = "button";


        this.next = rightControl;
        this.previous = leftControl;

        // bind events
        var that = this;
        this.next.onclick = function(){ that.nextSlide() };
        this.previous.onclick = function(){ that.previousSlide() };

        // append
        container.appendChild(leftControl);
        container.appendChild(rightControl);
    };

    GeneMGSlider.prototype.addDots = function() {
        var that = this,
            sliderCount = this.sliderCount,
            container = this.slider.parentElement,
            controlCollection = document.createDocumentFragment();

        var dotsContainer = document.createElement('ul');
            dotsContainer.classList.add('gene-slider-dots');

        // Create Html
        for (var index = 0; index < sliderCount; ++index) {

            // Create Li
            var li = document.createElement('li');
            li.classList.add('gene-slider-dots__next');

            var button = document.createElement('button');
            button.classList.add('gene-slider-dots__button');

            // Add active class to first slide dot as this is first slide visible
            if (index === 0) {
                button.classList.add('is-active');
            }

            button.setAttribute('data-genemg-value', index);
            li.appendChild(button);

            var span = document.createElement('span');
            span.innerHTML = index;
            button.appendChild(span);

            button.onclick = function(e){
                e.stopPropagation();
                var slideIndex = parseInt(e.currentTarget.getAttribute('data-genemg-value'), 10);
                that.scrollToSlide(null, slideIndex);
            };

            controlCollection.appendChild(li);
        }

        // Replace Gallery Controls
        dotsContainer.innerHTML = '';
        dotsContainer.appendChild(controlCollection);
        container.appendChild(dotsContainer);
    };

    GeneMGSlider.prototype.checkDots = function(slider, index, hasDots) {
        if (!hasDots || index === undefined) { return; }

        var dots = slider.parentElement.querySelectorAll('.gene-slider-dots li button');
        var activeDot = dots[index];

        // Add/remove active class
        this.setActiveState(dots, activeDot);
    };

    GeneMGSlider.prototype.autoSliding = function() {
        var that = this,
            autoSlide = this.autoSlide;

        setInterval(function() {
            that.nextSlide();
        }, autoSlide);
    };

    /**
     * nextSlide
     */
    GeneMGSlider.prototype.nextSlide = function() {
        // Maintain index
        this.slideIndex = (this.slideIndex === this.sliderCount - 1) ? 0 : this.slideIndex + 1;
        this.slideVisibilityCheck(this.slider, this.isVertical, this.slideIndex, this.showDots);
        if (this.manages) {
            this.controlledSlider.controlledNextSlide();
        }
    };

    /**
     * previousSlide
     */
    GeneMGSlider.prototype.previousSlide = function() {
        this.slideIndex = (this.slideIndex === 0) ? (this.sliderCount - 1) : this.slideIndex - 1;
        this.slideVisibilityCheck(this.slider, this.isVertical, this.slideIndex, this.showDots);
        if (this.manages) {
            this.controlledSlider.controlledPreviousSlide();
        }
    };


    GeneMGSlider.prototype.controlledNextSlide = function() {
        this.slideIndex = (this.slideIndex === this.sliderCount - 1) ? 0 : this.slideIndex + 1;
        this.slideVisibilityCheck(this.slider, this.isVertical, this.slideIndex, this.showDots);
    };

    GeneMGSlider.prototype.controlledPreviousSlide = function() {
        this.slideIndex = (this.slideIndex === 0) ? (this.sliderCount - 1) : this.slideIndex - 1;
        this.slideVisibilityCheck(this.slider, this.isVertical, this.slideIndex, this.showDots);
    };

    /**
     * scroll to a slide
     */
    GeneMGSlider.prototype.scrollToSlide = function(event, index, managed) {
        var element = event ? event.target : null;
        var item;

        if (element) {
            while(element.parentNode) {
                element = element.parentNode;

                // Loop parent nodes until we get the list item
                if (element.parentNode.nodeName === "LI") {
                    item = element.parentNode;
                    break;
                }
            }

            this.slideIndex = Array.from(this.slides).indexOf(item);
            this.slideVisibilityCheck(this.slider, this.isVertical, this.slideIndex, this.showDots);

            if (this.manages && !managed) {
                this.controlledSlider.scrollToSlide(false, this.slideIndex, true);
            }
        }

        if (index !== undefined) {
            this.slideIndex = index;
            this.slideVisibilityCheck(this.slider, this.isVertical, this.slideIndex, this.showDots);

            if (this.manages && !managed) {
                this.controlledSlider.scrollToSlide(false, index, true);

                // Add/remove active class
                this.setActiveState(this.slides, item);
            }
        }
    };

    GeneMGSlider.prototype.slideVisibilityCheck = function(slider, isVertical, index, hasDots) {
        if (index === undefined) { return; }

        if (this.scrollAllSlides && !isVertical) {
            this.checkDots(slider, index, hasDots);
            return slider.scrollLeft = slider.offsetWidth*index;
        }

        if (this.scrollAllSlides && isVertical) {
            this.checkDots(slider, index, hasDots);
            return slider.scrollTop = slider.offsetHeight*index;
        }

        var slides = slider.querySelectorAll('li') || slider.querySelectorAll('> div');
        var activeSlide = slides[index];

        var parentPos = slider.getBoundingClientRect(),
            childPos = activeSlide.getBoundingClientRect(),
            relativePos = {};

        relativePos.top = childPos.top - parentPos.top,
        relativePos.right = childPos.right - parentPos.right,
        relativePos.bottom = childPos.bottom - parentPos.bottom,
        relativePos.left = childPos.left - parentPos.left;

        // Add/remove active class
        this.setActiveState(slides, activeSlide);

        this.checkDots(slider, index, hasDots);

        var observer = new IntersectionObserver(function (entries) {
            var slideVisible = entries[0].isVisible;

            if (!slideVisible) {
                // slide is not visible so lets scroll

                if (isVertical) {
                    slider.scrollTop = relativePos.top + slider.scrollTop;
                }

                if (!isVertical) {
                    slider.scrollLeft = relativePos.left + slider.scrollLeft;
                }
            }

            observer.disconnect();
        });

        observer.observe(activeSlide);
    };

    GeneMGSlider.prototype.imageZoom = function(image, result, lens) {
        var img, cx, cy,
            that = this;
        img = image;

        /* insert lens */
        img.parentElement.insertBefore(lens, img);

        /* calculate the ratio between result DIV and lens */
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;

        /* set background properties for the result DIV */
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

        /* execute a function when someone moves the cursor over the image, or the lens */
        lens.addEventListener("mousemove", function(e) {
            that.moveLens(e, lens, img, result, cx, cy);
        });

        img.addEventListener("mousemove", function(e) {
            that.moveLens(e, lens, img, result, cx, cy);
        });

        lens.addEventListener("touchmove", function(e) {
            that.moveLens(e, lens, img, result, cx, cy);
        });

        img.addEventListener("touchmove", function(e) {
            that.moveLens(e, lens, img, result, cx, cy);
        });
    };

    GeneMGSlider.prototype.moveLens = function(e, lens, img, result, cx, cy) {
        var pos, x, y;

        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();

        /* Get the x and y positions of the cursor: */
        pos = this.getCursorPos(e, img);

        /* Calculate the position of the lens: */
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);

        /* Prevent the lens from being positioned outside the image: */
        if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
        if (x < 0) {x = 0;}
        if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
        if (y < 0) {y = 0;}

        /* Set the lens position: */
        lens.style.left = x + "px";
        lens.style.top = y + "px";

        /* Display what the lens "sees": */
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    };

    GeneMGSlider.prototype.getCursorPos = function(e, img) {
        var a, x = 0, y = 0;
        e = e || window.event;

        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();

        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;

        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
    };

    GeneMGSlider.prototype.initZoom = function() {
        var items = this.slider.querySelectorAll('figure:not([data-gslider-video-item])');

        Array.prototype.forEach.call(items, function (item) {
            var image = item.querySelector('img');

            var data = {
                imageZoom: image.getAttribute('data-zoom') || image.getAttribute('src')
            };

            var offsetX,
                offsetY;

            item.style.backgroundImage = "url(" + data.imageZoom + ")";
            item.classList.add('is-zooming');

            item.addEventListener('mousemove', function(event) {
                var zoomer = event.currentTarget;
                event.offsetX ? offsetX = event.offsetX : offsetX = (event.touches ? event.touches[0].pageX : 0);
                event.offsetY ? offsetY = event.offsetY : offsetY = (event.touches ? event.touches[0].pageY : 0);
                var x = offsetX/zoomer.offsetWidth*100;
                var y = offsetY/zoomer.offsetHeight*100;
                zoomer.style.backgroundPosition = x + '% ' + y + '%';
            });
        });

    };

    GeneMGSlider.prototype.initZoomOutside = function() {
        var that = this,
            container = this.slider.parentElement,
            items = this.slider.querySelectorAll('figure:not([data-gslider-video-item])'),
            image,
            imageFunction,
            result = document.createElement('div'),
            lens = document.createElement("div");

        result.classList.add('gene-slider__zoom-outside');
        lens.classList.add('gene-slider__zoom-lens');

        container.appendChild(result);

        Array.prototype.forEach.call(items, function (item) {

            item.addEventListener("mouseenter", function( event ) {
                image = item.querySelector('img');
                result.style.display = 'block';
                lens.style.display = 'block';

                imageFunction = that.imageZoom(image, result, lens);
            });

            item.addEventListener("mouseleave", function( event ) {
                imageFunction = null;
                result.style.display = 'none';
                lens.style.display = 'none';
            });

        });

    };

    /* Basic Lightbox */
    GeneMGSlider.prototype.initLightbox = function() {
        var lightbox = document.querySelector('.gallery-lightbox'),
            lightboxClose = document.querySelectorAll('[data-lightbox-close]'),
            lightboxSlider = document.querySelector('[data-lightbox-slider]'),
            that = this;

        var items = Array.from(this.slides).filter(function(item) {
                return !item.classList.contains('gene-slider__item--video');
            });

        Array.prototype.forEach.call(items, function (item) {
            var slideIndex = Array.from(items).indexOf(item);

            item.addEventListener('click', function (event) {
                event.preventDefault();
                that.openLightbox(slideIndex);
            }, false);
        });

        for(var i = 0; i<lightboxClose.length; i++) {
            lightboxClose[i].addEventListener('click', function () {

                lightbox.classList.remove("is-lightbox-active");
                lightbox.setAttribute('aria-hidden', true);
                lightboxSlider.innerHTML = '';

            }, false);
        }
    };

    GeneMGSlider.prototype.openLightbox = function(slideIndex) {
        var lightbox = document.querySelector('.gallery-lightbox'),
            lightboxSlider = document.querySelector('[data-lightbox-slider]'),
            lightboxSliderInstance,
            sliderEl = this.slider,
            sliderParent;

        sliderParent = sliderEl.parentNode;

        var lightboxSliderClone = sliderParent.cloneNode(true);

        lightboxSlider.appendChild(lightboxSliderClone);
        lightbox.classList.add('is-lightbox-active');

        var lightboxSlideList = lightboxSlider.querySelector('.gene-slider');
        lightboxSlideList.style.scrollBehavior = 'auto';

        lightboxSliderInstance = new GeneMGSlider(
            lightboxSlideList, {
                arrows: true,
                dots: true,
           }
        );

        lightboxSliderInstance.initSlider(true);
        lightboxSliderInstance.slideVisibilityCheck(lightboxSliderInstance.slider, false, slideIndex);

        setTimeout(function() {
            lightboxSlideList.style.scrollBehavior = 'smooth';
        }, 100);
    };

    /**
     * Add Click Event to Video Items to show embed videos.
     */
    GeneMGSlider.prototype.showVideo = function() {
        var that = this,
            slider = this.slider,
            items = slider.querySelectorAll('li[data-gslider-video]');

        if (items.length > 0) {
            Array.prototype.forEach.call(items, function (item) {

                item.addEventListener('click', function (event) {
                    event.preventDefault();

                    var videoImage = item.querySelector('img'),
                        videoUrl = videoImage.getAttribute('data-video-url'),
                        videoSrc = that.getVideoSrc(videoUrl);

                    // Delete any other iframe element, show picture again
                    var prevIframe = slider.querySelector('iframe');
                    if (prevIframe) {
                        var galleryItem = prevIframe.parentNode;
                        galleryItem.querySelector('figure').style.display = "block";
                        prevIframe.remove();
                    }

                    // Create New Iframe
                    that.createVideoIframe(videoSrc, item);

                }, false);
            });
        }
    };

    /**
     * Get Video Src
     * @param url
     * @returns {string}
     */
    GeneMGSlider.prototype.getVideoSrc = function(url) {
        if (url.includes('youtube')) {
            return this.getYoutubeEmbedSrc(url);
        } else if(url.includes('vimeo')) {
            return this.getVimeoEmbedSrc(url);
        }
    };

    /**
     * Get Youtube Embed Src
     * @param url
     * @returns {string}
     */
    GeneMGSlider.prototype.getYoutubeEmbedSrc = function(url) {

        // Get Video Id - https://gist.github.com/takien/4077195
        var Id = '';
        url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

        if (url[2] !== undefined) {
            Id = url[2].split(/[^0-9a-z_\-]/i);
            Id = Id[0];
            return 'https://youtube.com/embed/' + Id + '?autoplay=1&mute=1';
        }
        else {
           return '';
        }

    };

    /**
     * Get Vimeo Embed Src
     * @param url
     * @returns {string}
     */
    GeneMGSlider.prototype.getVimeoEmbedSrc = function(url) {

        // Get Video Id - https://stackoverflow.com/a/10041988
        var regExp = /http(s)?:\/\/(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/,
            match = url.match(regExp);

        if (match) {
            return 'https://player.vimeo.com/video/' + match[3];
        }

    };

    /**
     * Create Iframe and add in to VideoContainer
     * @param videoSrc
     * @param videoContainer
     */
    GeneMGSlider.prototype.createVideoIframe = function(videoSrc, videoContainer) {
        var iframe = document.createElement('iframe');

        iframe.setAttribute('src', videoSrc);
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', '0');

        videoContainer.querySelector('figure').style.display = "none";
        videoContainer.append(iframe);
    };

    GeneMGSlider.prototype.runLazyLoad = function() {
        if (window.Lazyload) {
            var lazyImages = this.slider.querySelectorAll('[loading=lazy]');
            var RunLazy = new Lazyload({ images: lazyImages });
            RunLazy.init();
        }
    };

    /**
     * Set active state for target element
     */
    GeneMGSlider.prototype.setActiveState = function(items, activeItem) {
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('is-active');
        }

        activeItem.classList.add('is-active');
    };

    // The slider and controls selectors
    var sliderEl = document.querySelectorAll('[data-gslider]'),
        isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    for (var i = 0, sliderCount = sliderEl.length; sliderCount > i; i++) {
        var thisSlider = new GeneMGSlider(
            sliderEl[i]
        );

        // init
        window.onload = thisSlider.initSlider(!isDesktop);
    }
});


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
