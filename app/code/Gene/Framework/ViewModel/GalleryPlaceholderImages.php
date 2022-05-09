<?php
namespace Gene\Framework\ViewModel;

use \Magento\Framework\View\Element\Block\ArgumentInterface;
use \Magento\Catalog\Helper\Image;

/**
 * Class GalleryPlaceholderImages
 * Create Array with Placeholder Image Data
 */
class GalleryPlaceholderImages implements ArgumentInterface
{

    /**
     * @var Image
     */
    protected $imageHelper;

    /**
     * GalleryPlaceholderImages constructor.
     * @param Image $imageHelper
     */
    public function __construct(
        Image $imageHelper
    ) {
        $this->imageHelper = $imageHelper;
    }

    /**
     * Get Placeholder Image
     * @return array
     */
    public function getPlaceholderImage()
    {
        return [
            'medium_image_url' => $this->imageHelper->getDefaultPlaceholderUrl('image'),
            'label' => 'Placeholder Image'
        ];
    }
}
