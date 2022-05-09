define([
    'jquery',
    'accordion',
    'mage/translate'
], function ($) {
    'use strict';

    return function (config, historyElement) {
        var $element = $(historyElement);

        var revealText = $.mage.__('Show complete timeline'),
            revealTriggerWrapper = $("<div>", {"class": "pagebuilder-history__reveal"}),
            revealTrigger = $("<button>", {"type": "button"}).append("<span>" + revealText + "</span>"),
            readMoreBtn = $('.read-more'),
            readLessBtn = $('.read-less');

        revealTriggerWrapper.append(revealTrigger);
        $element.append(revealTriggerWrapper);

        revealTrigger.on('click', function() {
          $element.addClass('revealed');
        });

        var allItems = $element.find('[data-content-type="history-item"]');
        var openItems = $element.find('[data-content-type="history-item"][data-expanded="yes"]');

        var activeItemsArray = [];

        mediaCheck({
          media: '(min-width: 1024px)',

          /** @inheritdoc */
          entry: function () {
            $.each(openItems, function() {
              activeItemsArray.push(allItems.index($(this)));
            });
          }
      });

      if ($('.pagebuilder-history-item [data-role="collapsible"]').hasClass('active')) {
          readMoreBtn.hide();
          readLessBtn.show();
      } else {
          readMoreBtn.show();
          readLessBtn.hide();
      }

        readMoreBtn.click(function () {
          readMoreBtn.hide();
          readLessBtn.show();
      })

        readLessBtn.click(function () {
          readMoreBtn.show();
          readLessBtn.hide();
      })

        $element.accordion({
        'active': activeItemsArray,
        'openedState': 'active',
        'collapsible': true,
        'multipleCollapsible': true
      });
    };
});
