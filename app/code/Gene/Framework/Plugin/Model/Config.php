<?php

namespace Gene\Framework\Plugin\Model;

/*
 * Class Config
 * Customise the options in the Sort By on PLP
 */
class Config
{

    /**
     * Adding Sort By in to Options Array
     *
     * @param \Magento\Catalog\Model\Config $catalogConfig
     * @param array $options
     * @return array
     */
    public function afterGetAttributeUsedForSortByArray(\Magento\Catalog\Model\Config $catalogConfig, $options)
    {

        /*
         * Add Sort By Option
         */
        $customOption['sort_by'] = __('Sort By');

        /*
         * Merge default sorting options with custom option
         */
        $options = array_merge($customOption, $options);

        /*
         * @return array
         */
        return $options;
    }
}
