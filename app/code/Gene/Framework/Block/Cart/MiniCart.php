<?php

namespace Gene\Framework\Block\Cart;

/**
 * Class MiniCart
 * Add function to get theme config for MiniCart Display
 */
class MiniCart extends \Magento\Checkout\Block\Cart\Sidebar
{

    /**
     * Path to our custom MiniCart Config
     */
    const XML_ARGUMENT_MINICART_SHOW_SIDEBAR = 'show_sidebar';

    /**
     * Check if MiniCart is set to display Sidebar
     * @return bool
     */
    public function getIsMiniCartSidebar()
    {
        return $this->getData(self::XML_ARGUMENT_MINICART_SHOW_SIDEBAR);
    }
}
