<?php

namespace Gene\Framework\Plugin\Model\Config\Source;

/**
 * Class ListSort
 * Add 'Sort By' option so it can be set in the admin as Default
 * Catalog -> StoreFront -> Product Listing Sort by
 */
class ListSort
{

    /**
     * Add Option to Array
     * @param \Magento\Catalog\Model\Config\Source\ListSort $subject
     * @param $result
     * @return array
     */
    public function aftertoOptionArray(
        \Magento\Catalog\Model\Config\Source\ListSort $subject,
        $result
    ) {

        /**
         * Add 'Sort By' First in the options
         */
        array_unshift($result, ['label' => __('Sort By (Position)'), 'value' => 'sort_by']);

        /**
         * Return options array
         */
        return $result;
    }
}
