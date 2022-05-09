<?php

declare(strict_types=1);

namespace Gene\Framework\Block;

/**
 * Class Social
 * Configurable social network block
 */
class Social extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \Gene\Framework\Helper\Data
     */
    protected $helper;

    /**
     * Social constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Gene\Framework\Helper\Data $helper
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Gene\Framework\Helper\Data $helper
    ) {
        $this->helper = $helper;

        parent::__construct($context);
    }

    /**
     * get enable social network objects
     * @return \Magento\Framework\DataObject[]
     */
    public function getEnabledSocialNetwork()
    {
        $socialNetworks = [];

        foreach ($this->helper->getSocialNetworkList() as $code) {
            if ($network = $this->helper->getNetworkData($code)) {
                $socialNetworks[] = $network;
            }
        }

        return $socialNetworks;
    }
}
