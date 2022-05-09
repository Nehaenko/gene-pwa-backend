<?php

declare(strict_types=1);

namespace Gene\Framework\Block;

/**
 * Class Payment
 * Configurable payment gateway block.
 */
class Payment extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \Gene\Framework\Helper\Data
     */
    protected $helper;

    /**
     * Payment constructor.
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
     * get enabled payment gateway objects
     * @return \Magento\Framework\DataObject[]
     */
    public function getEnabledPaymentGateway()
    {
        $paymentGateway = [];

        foreach ($this->helper->getPaymentGatewayList() as $code) {
            if ($gateway = $this->helper->getGatewayData($code)) {
                $paymentGateway[] = $gateway;
            }
        }

        return $paymentGateway;
    }
}
