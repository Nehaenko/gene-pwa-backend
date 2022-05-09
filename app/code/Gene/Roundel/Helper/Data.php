<?php
/**
 * Gene Roundel Helper
 */
namespace Gene\Roundel\Helper;

use Magento\Swatches\Helper\Data as SwatchData;
use Magento\Swatches\Helper\Media;
use Magento\Catalog\Helper\Image;
use Magento\Framework\App\Helper\AbstractHelper;

/**
 * Class Data
 */
class Data extends AbstractHelper
{

    protected $swatchHelper;

    protected $swatchMediaHelper;

    protected $imageBuilder;

    protected $urlBuilder;

    /**
     * @var \Magento\Framework\Filesystem\Directory\WriteInterface
     */
    protected $mediaDirectory;

    const DISABLED = 'disabled';
    const ENABLED = 'enabled';
    const PRODUCT_ONLY = 'enabled_product_only';
    const PRODUCT_LIST = 'enabled_product_list';
    const TOP_LEFT = "top_left";
    const TOP_RIGHT = "top_right";
    const BOTTOM_LEFT = "bottom_left";
    const BOTTOM_RIGHT = "bottom_right";

    /**
     * Data constructor.
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Magento\Framework\UrlInterface $urlBuilder
     * @param SwatchData $swatchHelper
     * @param Media $swatchMediaHelper
     * @param Image $imageBuilder
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\UrlInterface $urlBuilder,
        SwatchData $swatchHelper,
        Media $swatchMediaHelper,
        Image $imageBuilder,
        array $data = []
    ) {
        $this->urlBuilder = $urlBuilder;
        $this->swatchHelper = $swatchHelper;
        $this->swatchMediaHelper = $swatchMediaHelper;
        $this->imageBuilder = $imageBuilder;
        parent::__construct($context);
    }

    /**
     * Function to get system config for the current store
     *
     * @param $config_path
     * @return mixed
     */
    public function getConfig($config_path)
    {
        return $this->scopeConfig->getValue(
            $config_path,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Get the view type config
     *
     * @return mixed
     */
    public function getConfigTypeView()
    {
        return $this->getConfig('roundels/general_settings/display_roundels');
    }

    /**
     * Get the position type config
     *
     * @return mixed
     */
    public function getConfigTypePosition()
    {
        return $this->getConfig('roundels/general_settings/roundel_position');
    }

    /**
     * Check if roundels are product view enabled
     *
     * @return bool
     */
    public function isEnabledProductView()
    {
        $config = $this->getConfigTypeView();
        if ($config === self::ENABLED || $config === self::PRODUCT_ONLY) {
            return true;
        }
        return false;
    }

    /**
     * Check if roundels are product list view enabled
     *
     * @return bool
     */
    public function isEnabledProductList()
    {
        $config = $this->getConfigTypeView();
        if ($config === self::ENABLED || $config === self::PRODUCT_LIST) {
            return true;
        }
        return false;
    }

    /**
     * Get the roundel label
     *
     * @param \Magento\Catalog\Model\Product\Interceptor $product
     * @return mixed
     */

    public function getRoundelTextLabel(\Magento\Catalog\Model\Product\Interceptor $product)
    {
        return $product->getResource()->getAttribute('roundel_value')->getFrontend()->getValue($product);
    }

    /**
     * Set the class of the roundel based on position from config
     *
     * @return string
     */
    public function setRoundelPosition()
    {
        $config = $this->getConfigTypePosition();

        switch ($config) {
            case self::TOP_LEFT:
                $roundelClass = 'gene-roundel--topleft';
                break;
            case self::TOP_RIGHT:
                $roundelClass = 'gene-roundel--topright';
                break;
            case self::BOTTOM_LEFT:
                $roundelClass = 'gene-roundel--bottomleft';
                break;
            case self::BOTTOM_RIGHT:
                $roundelClass = 'gene-roundel--bottomright';
                break;
            default:
                $roundelClass = '';
                break;
        }

        return $roundelClass;
    }

    /**
     * Get the roundel for product pages
     *
     * @param $product
     * @return array
     */

    public function getRoundel($product)
    {
        return [(string) $this->getRoundelTextLabel($product), $this->setRoundelPosition()];
    }
}
