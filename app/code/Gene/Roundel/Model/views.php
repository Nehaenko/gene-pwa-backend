<?php

namespace Gene\Roundel\Model;

class Views implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * Return array of options as value-label pairs, eg. value => label
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            'disabled' => 'Disabled',
            'enabled' => 'Enabled',
            'enabled_product_only' => 'Product Pages Only',
            'enabled_product_list' => 'List Pages Only'
        ];
    }
}
