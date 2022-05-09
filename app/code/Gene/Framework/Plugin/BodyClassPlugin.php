<?php
namespace Gene\Framework\Plugin;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Event\Observer;
use Magento\Framework\View\Page\Config;
use Magento\Store\Model\StoreManagerInterface;
use Gene\Base\Helper\Data as GeneHelper;

/**
 * Class BodyClassPlugin
 * Add Body Class
 */
class BodyClassPlugin implements ObserverInterface
{
    /**
     * @var Config
     */
    protected $config;

    /**
     * @var StoreManagerInterface
     */
    protected $helper;

    /**
     * BodyClassPlugin constructor.
     * @param Config $config
     * @param GeneHelper $helper
     */
    public function __construct(
        Config $config,
        GeneHelper $helper
    ) {
        $this->config = $config;
        $this->helper = $helper;
    }

    /**
     * Add sticky header class if sticky header is enabled in the admin
     * @param Observer $observer
     * @return bool|void
     */
    public function execute(Observer $observer)
    {
        $config = $this->helper->getConfig('gene_theme/header/enable_sticky_header');

        if ($config) {
            $this->config->addBodyClass('__sticky-header-enabled');
        }
    }
}
