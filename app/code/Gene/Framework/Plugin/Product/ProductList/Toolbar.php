<?php

namespace Gene\Framework\Plugin\Product\ProductList;

/**
 * Class Toolbar
 * Set Collection for custom 'Sort By' option
 */
class Toolbar
{
    /**
     * Plugin
     *
     * @param \Magento\Catalog\Block\Product\ProductList\Toolbar $subject
     * @param \Closure $proceed
     * @param \Magento\Framework\Data\Collection $collection
     * @return \Magento\Catalog\Block\Product\ProductList\Toolbar
     */
    public function aroundSetCollection(
        \Magento\Catalog\Block\Product\ProductList\Toolbar $subject,
        \Closure $proceed,
        $collection
    ) {
        $currentOrder = $subject->getCurrentOrder();
        $result = $proceed($collection);

        if ($currentOrder) {

            /**
             * Order Sort By returns the same collection order as Position
             */
            if ($currentOrder == 'sort_by') {
                $collection->addAttributeToSort(
                    $subject->getCurrentOrder(),
                    $subject->getCurrentDirection()
                );
            }
        }

        return $result;
    }
}
