/*
 * Gene Framework - Remove no-js
 * If you're going to lazy load images, consider offering <noscript> markup that will show images in case JavaScript is unavailable.
 * See - https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#javascript_availability

 */


require([
    'jquery'
], function ($) {
    'use strict';

    $('html').removeClass('no-js');
});
