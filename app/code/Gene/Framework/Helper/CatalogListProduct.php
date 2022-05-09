<?php
namespace Gene\Framework\Helper;

/**
 * Class CatalogListProduct
 * Catalog Data Helper
 */
class CatalogListProduct extends \Magento\Framework\App\Helper\AbstractHelper
{

    /**
     * Catalog Helper
     * @var \Magento\Catalog\Helper\Output
     */
    protected $catalogHelper;

    /**
     * Object Factory
     * @var \Magento\Framework\DataObjectFactory
     */
    protected $objectFactory;

    /**
     * @var \Magento\Catalog\Block\Product\ListProduct
     */
    protected $listProduct;

    /**
     * CatalogListProduct constructor.
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Magento\Catalog\Helper\Output $catalogHelper
     * @param \Magento\Framework\DataObjectFactory $objectFactory
     * @param \Magento\Catalog\Block\Product\ListProduct $listProduct
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Catalog\Helper\Output $catalogHelper,
        \Magento\Framework\DataObjectFactory $objectFactory,
        \Magento\Catalog\Block\Product\ListProduct $listProduct
    ) {
        $this->catalogHelper = $catalogHelper;
        $this->objectFactory = $objectFactory;
        $this->listProduct = $listProduct;
        parent::__construct($context);
    }

    /**
     * @return mixed
     */
    public function getCatalogData()
    {
        $obj = $this->objectFactory->create();
        if ($this->listProduct->getMode() == 'grid') {
            $data = [
                'view_mode' => 'grid',
                'image' => 'category_page_grid',
                'retina_image' => 'category_page_grid_2x',
                'show_description' => false,
                'template_type' => \Magento\Catalog\Block\Product\ReviewRendererInterface::SHORT_VIEW
            ];
        } else {
            $data = [
                'view_mode' => 'list',
                'image' => 'category_page_list',
                'retina_image' => 'category_page_list_2x',
                'show_description' => true,
                'template_type' => \Magento\Catalog\Block\Product\ReviewRendererInterface::FULL_VIEW
            ];
        }
        $obj->setData($data);
        return $obj;
    }
    /**
     * Get Short Description
     * @param $product
     * @return bool
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getShortDescription($product)
    {
        $shortDescription = $product->getShortDescription();
        if ($this->getCatalogData()->getShowDescription() && $shortDescription) {
            return $this->catalogHelper->productAttribute($product, $shortDescription, 'short_description');
        }
        return false;
    }

    /**
     * Get Template Type
     * @return mixed
     */
    public function getTemplateType()
    {
        return $this->getCatalogData()->getTemplateType();
    }

    /**
     * Get Lazy Loading Product Image URL
     * @param $product
     * @return mixed
     */
    public function getProductImageUrl($product)
    {
        $image = $this->getCatalogData()->getImage();
        return $this->listProduct->getImage($product, $image)->getImageUrl();
    }

    /**
     * Get Lazy Loading Product Retina Image URL
     * @param $product
     * @return mixed
     */
    public function getRetinaProductImageUrl($product)
    {
        $retinaImage = $this->getCatalogData()->getRetinaImage();
        return $this->listProduct->getImage($product, $retinaImage)->getImageUrl();
    }
}
