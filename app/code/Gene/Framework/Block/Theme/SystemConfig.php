<?php

declare(strict_types=1);

namespace Gene\Framework\Block\Theme;

use Magento\Framework\UrlInterface;

/**
 * Class SystemConfig
 * Gene Framework
 */
class SystemConfig extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var \Magento\Customer\Model\Session
     */
    protected $session;

    /**
     * @var \Magento\Customer\Model\Url
     */
    protected $customerUrl;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
     * SystemConfig constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Customer\Model\Url $customerUrl
     * @param \Magento\Customer\Model\Session $session
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Customer\Model\Url $customerUrl,
        \Magento\Customer\Model\Session $session,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        array $data = []
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->customerUrl = $customerUrl;
        $this->session = $session;
        $this->storeManager = $storeManager;

        parent::__construct($context, $data);
    }

    /**
     * Function to get system config for the current store
     * @param null $path
     * @return mixed
     */
    public function getConfig($path = null)
    {
        // Set in XML argument
        $config_path = $path ? $path : $this->getConfigPath();

        return $this->scopeConfig->getValue(
            $config_path,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Get WYSIWYG media path
     * @param null $path
     * @return string
     */
    public function getMediaUrl($imagePath = null)
    {
        return $this->storeManager->getStore()->getBaseUrl(UrlInterface::URL_TYPE_MEDIA) . $imagePath;
    }
}
