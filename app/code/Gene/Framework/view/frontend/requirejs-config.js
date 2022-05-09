/**
 * Gene Framework

 */
var config = {
    map: {
        '*': {
            'GeneStickyElement': 'Gene_Framework/js/sticky-element',
            'GeneQtyControls' : 'Gene_Framework/js/qty-controls',
            'GeneSearchExpand': 'Gene_Framework/js/search-expand',
            'GeneSlider': 'Gene_Framework/js/gene-slider',
            'GeneMenu': 'Gene_Framework/js/gene-menu',
            'GeneSocial': 'Gene_Framework/js/gene-social',
            'GeneSelectNav': 'Gene_Framework/js/gene-select-nav',
            'GeneFilters': 'Gene_Framework/js/gene-filters',
        }
    },
    paths: {
        GeneMGSlider: 'Gene_Framework/js/gene-slider'
    },
    deps: [
        'Gene_Framework/js/minicart-trigger'
    ],
    config: {
        mixins: {
            'Magento_Checkout/js/view/summary/abstract-total': {
                'Gene_Framework/js/abstract-total-mixin': true
            },
            "mage/collapsible": {
                'Gene_Framework/js/collapsible-mixin' : true
            },
            "Magento_Swatches/js/swatch-renderer": {
                'Gene_Framework/js/swatch-renderer-mixin' : true
            }
        }
    }
};

