<?php

namespace Gene\Roundel\Model;

class Position implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * Return array of options as value-label pairs, eg. value => label
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            'top_left' => 'Top Left',
            'top_right' => 'Top Right',
            'bottom_left' => 'Bottom Left',
            'bottom_right' => 'Bottom Right',
            'none' => 'None'
        ];
    }
}
