<?php

namespace Gene\Framework\Block\Html;

use Magento\Theme\Block\Html\Topmenu;
use Magento\Framework\View\Element\Template;
use Gene\Framework\Helper\Data;
use Gene\Framework\Block\Adminhtml\Form\Field\FooterLinks;
use Gene\Framework\Block\Theme\SystemConfig;

/**
 * Class FooterMenuLinks
 * Add footer menu links
 */
class FooterMenuLinks extends Template
{
    /**
     * @var Data
     */
    private $helper;

    /**
     * @var SystemConfig
     */
    private $systemConfig;

    /**
     * FooterMenuLinks constructor.
     * @param Template\Context $context
     * @param Data $helper
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        Data $helper,
        SystemConfig $systemConfig,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->helper = $helper;
        $this->systemConfig = $systemConfig;
    }

    /**
     * Get the menu markup
     * @param string $column
     * @return string
     */
    public function getConfigLinks($column)
    {
        return $this->helper->getFooterLinks($column);
    }

    /**
     * Function to get system config for the current store
     * @param null $path
     * @return mixed
     */
    public function getConfig($path = null)
    {
        return $this->systemConfig->getConfig($path);
    }
}
