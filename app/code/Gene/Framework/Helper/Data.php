<?php
namespace Gene\Framework\Helper;

use Magento\Store\Model\ScopeInterface;
use Magento\Framework\Serialize\SerializerInterface;

/**
 * Class Data
 * Generic helper
 */
class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    const XML_PATH_GENE_SOCIAL = 'gene_theme/social/';
    const XML_PATH_GENE_PAYMENT = 'gene_theme/payment_gateway/';
    const XML_PATH_GENE_NEWSLETTER = 'gene_theme/newsletter/';

    const XML_PATH_GENE_FOOTER_COLUMN_ONE_LINKS = 'gene_theme/footer/column_1_links';
    const XML_PATH_GENE_FOOTER_COLUMN_TWO_LINKS = 'gene_theme/footer/column_2_links';
    const XML_PATH_GENE_FOOTER_COLUMN_THREE_LINKS = 'gene_theme/footer/column_3_links';

    /**
     * list of Social Networks codes
     * @var array
     */
    protected $socialNetworkList = [
        'facebook',
        'instagram',
        'linkedin',
        'pinterest',
        'twitter',
        'vimeo',
        'youtube'
    ];

    /**
     * list of Payment Gateway codes
     * @var array
     */
    protected $paymentGatewayList = [
        'maestro',
        'visa',
        'mastercard',
        'paypal'
    ];

    /**
     * @var \Magento\Framework\DataObject\Factory
     */
    protected $dataObjectFactory;

    /**
     * @var SerializerInterface
     */
    protected $serializer;

    /**
     * Data constructor.
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Magento\Framework\DataObject\Factory $dataObjectFactory
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\DataObject\Factory $dataObjectFactory,
        SerializerInterface $serializer
    ) {
        parent::__construct($context);
        $this->dataObjectFactory = $dataObjectFactory;
        $this->serializer = $serializer;
    }

    /**
     * @param $field
     * @param null $storeId
     * @return mixed
     */
    public function getConfigValue($field, $storeId = null)
    {
        return $this->scopeConfig->getValue(
            $field,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }

    /**
     * @return array
     */
    public function getSocialNetworkList()
    {
        return $this->socialNetworkList;
    }

    /**
     * create social network object
     * @param $code
     * @return bool|\Magento\Framework\DataObject
     */
    public function getNetworkData($code)
    {
        $networkUrl = $this->scopeConfig->getValue(
            self::XML_PATH_GENE_SOCIAL . $code,
            ScopeInterface::SCOPE_STORE
        );

        if ($networkUrl) {
            return $this->dataObjectFactory->create([
                'code'  => $code,
                'title' => ucfirst($code),
                'url'   => $networkUrl,
                'icon'  => $code . '_icon'
            ]);
        }
        return false;
    }

    /**
     * @return array
     */
    public function getPaymentGatewayList()
    {
        return $this->paymentGatewayList;
    }

    /**
     * create payment gateway object
     * @param $code
     * @return bool|\Magento\Framework\DataObject
     */
    public function getGatewayData($code)
    {
        $gateway = $this->scopeConfig->getValue(
            self::XML_PATH_GENE_PAYMENT . $code,
            ScopeInterface::SCOPE_STORE
        );

        if ($gateway) {
            $gateway_icon = $this->scopeConfig->getValue(
                self::XML_PATH_GENE_PAYMENT . $code . '_icon',
                ScopeInterface::SCOPE_STORE
            );

            if ($gateway_icon) {
                return $this->dataObjectFactory->create([
                    'code'  => $code,
                    'title' => ucfirst($code),
                    'icon'  => $gateway_icon
                ]);
            }
        }
        return false;
    }

    /**
     * get newsletter title from system config
     * @return bool|string
     */
    public function getNewsletterTitle()
    {
        $config_value = $this->scopeConfig->getValue(
            self::XML_PATH_GENE_NEWSLETTER . 'newsletter_title',
            ScopeInterface::SCOPE_STORE
        );
        return $config_value ?: false;
    }

    /**
     * get newsletter title from system config.
     * @return bool|string
     */
    public function getNewsletterContent()
    {
        $config_value = $this->scopeConfig->getValue(
            self::XML_PATH_GENE_NEWSLETTER . 'newsletter_content',
            ScopeInterface::SCOPE_STORE
        );
        return $config_value ?: false;
    }

    /**
     * @param string $column
     * @return array
     */
    public function getFooterLinks($column)
    {
        if (!$column) {
            return [];
        }

        if ($column === "one") {
            $rawValue = $this->getConfigValue(self::XML_PATH_GENE_FOOTER_COLUMN_ONE_LINKS);
        } elseif ($column === "two") {
            $rawValue = $this->getConfigValue(self::XML_PATH_GENE_FOOTER_COLUMN_TWO_LINKS);
        } elseif ($column === "three") {
            $rawValue = $this->getConfigValue(self::XML_PATH_GENE_FOOTER_COLUMN_THREE_LINKS);
        } else {
            return [];
        }

        try {
            $serializedValue = $this->serializer->unserialize($rawValue);
            
            if (!is_array($serializedValue)) {
                throw new \InvalidArgumentException(
                    "Expected array for getFooterLinks::rawValue"
                );
            }

            return $serializedValue;
        } catch (\Exception $exception) {
            return [];
        }
    }
}
