/*
 * Gene Framework
 * Return Totals on the shipping step of the checkout

 */

define([], function () {
    "use strict";


    /**
     * Return the totals on the shipping step
     */
    return function (target) {

        return target.extend({

            /**
             * @return {*}
             */
            isFullMode: function () {

                return this.getTotals();
            }
        });
    }
});