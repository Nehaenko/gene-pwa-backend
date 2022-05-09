<?php
/**
 * Newsletter subscribe block

 */
namespace Gene\Framework\Block\Newsletter;

class Subscribe extends \Magento\Newsletter\Block\Subscribe
{
    /**
     * @var \Gene\Framework\Helper\Data
     */
    protected $helper;

    /**
     * Subscribe constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Gene\Framework\Helper\Data $helper
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Gene\Framework\Helper\Data $helper,
        array $data = []
    ) {
        $this->helper = $helper;
        parent::__construct($context, $data);
    }

    /**
     * get newsletter title from system config.
     * @return bool|string
     */
    public function getTitle()
    {
        return $this->helper->getNewsletterTitle();
    }

    /**
     * get newsletter content from system config.
     * @return bool|string
     */
    public function getContent()
    {
        return $this->helper->getNewsletterContent();
    }
}
