define([
    'jquery',
    'underscore',
    'accordion',
    'mage/translate'
], function ($) {
    'use strict';

    return function (config, scrollButtons) {
        var $element = $(scrollButtons);

        var isScrollButtons = $element.attr('data-scroll-buttons') === 'true';
        var intersectingRows = [];

        function addScrollButtonEvents(parentEl) {
          var scrollButtonAnchors = Array.from(parentEl.querySelectorAll('[data-content-type=button-item] a'));
          Array.prototype.forEach.call(scrollButtonAnchors, function (item) {
              item.addEventListener('mouseenter', function() {
                  this.classList.add('hovered');
              });

              item.addEventListener('mouseleave', function() {
                  this.classList.remove('hovered');
              });

              item.addEventListener('click', function(e) {
                e.preventDefault();
                var headerOffset = document.querySelector('.page-header__main').offsetHeight;
                var rowElementId = e.currentTarget.hash;
                var rowElement = document.querySelector(rowElementId);

                if (rowElement) {
                  var rowPosition = rowElement.getBoundingClientRect().top;
                  var offsetPosition = (rowPosition + window.scrollY) - headerOffset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                  });
                }
              });
          });
        }

        function getRowAnchorLink(stickyButtons, row) {
          return stickyButtons.find(function(anchor) {
            return anchor.hash.substring(1) === row.id || row.classList.contains(anchor.hash.substring(1));
          });
        }

        function createRowObserver(rowElement) {
          var observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              var stickyButtons = Array.from(document.querySelectorAll('[data-content-type=buttons][data-appearance=sticky] a'));
              var videoOverlay = document.getElementsByClassName('video-overlay')[0];

              Array.prototype.forEach.call(stickyButtons, function (item) {
                  if (videoOverlay) {
                      item.addEventListener('mouseenter', function () {
                          videoOverlay.classList.add('hovered');
                      })

                      item.addEventListener('mouseleave', function () {
                          videoOverlay.classList.remove('hovered');
                      })
                  }
              });

              // If this row is visible, add to the array of all visible rows
              if (entry.isIntersecting){
                intersectingRows.push(entry.target);
              } else {
                // If not visible, remove necessary classes etc
                var elementIndex = intersectingRows.indexOf(entry.target);
                if (elementIndex > -1) {
                  var anchorLink = getRowAnchorLink(stickyButtons, entry.target);
                  if (anchorLink) {
                    anchorLink.classList.remove('active');
                  }
                  intersectingRows.splice(elementIndex, 1);
                }
              }

              // For all visible rows, add the anchor class but only if it's not already added
              intersectingRows.forEach(function(activeRow) {
                var anchorLink = getRowAnchorLink(stickyButtons, activeRow);
                if ($('.pagebuilder-button-link.active').length <=2 && anchorLink && !anchorLink.classList.contains('active')) {
                  anchorLink.classList.add('active');
                }
              });
            });
          }, {
            rootMargin: "0px 0px 0px 0px",
            threshold: [0.2],
          });

          observer.observe(rowElement);
        }

        function createStickyButtonsObserver(stickyButtonsEl, pageHeader) {
          var pageHeader = document.querySelector('.page-header__main');
          var cloned = false;

          var stickyHeaderEnabled = document.querySelector('body').classList.contains('__sticky-header-enabled');
          var headerHeight = 0;
          if (stickyHeaderEnabled) {
            headerHeight = document.querySelector('.page-header__main').offsetHeight;
          }

          _.debounce(document.addEventListener('scroll', function(e) {
            var rect = stickyButtonsEl.getBoundingClientRect();

            if ((rect.top < headerHeight) && !cloned) {
              var stickyClone = stickyButtonsEl.cloneNode(true);
              stickyClone.setAttribute('data-scroll-buttons', 'false');
              pageHeader.appendChild(stickyClone);
              pageHeader.classList.add('pagebuilder-sticky-active');
              cloned = true;
              addScrollButtonEvents(stickyClone);
            }

            if (rect.top >= headerHeight) {
              var pageHeaderStickyChild = pageHeader.querySelector('[data-content-type=buttons]');
              if (pageHeaderStickyChild) {
                pageHeader.removeChild(pageHeaderStickyChild);
                pageHeader.classList.remove('pagebuilder-sticky-active');
                cloned = false;
              }
            }
          }));
        }

        if (isScrollButtons) {
          // Add smooth scroll
          addScrollButtonEvents(document.querySelector('[data-scroll-buttons]'));

          // Add body class based on active row
          document.querySelectorAll('.column.main > [data-content-type=row]').forEach(function(row) {
            createRowObserver(row);
          });

          createStickyButtonsObserver(scrollButtons[0]);
        }
    };
});
