/**
 * Gene Framework - Checkout JS config

 */
var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/action/update-shopping-cart': {
                'Magento_Checkout/js/action/update-shopping-cart-mixin': true
            }
        }
    },
    map: {
        '*': {
            minicart_sidebar: 'Magento_Checkout/js/modal_sidebar'
        }
    }
};
