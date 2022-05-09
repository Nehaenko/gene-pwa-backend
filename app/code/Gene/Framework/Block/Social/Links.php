<?php

declare(strict_types=1);

namespace Gene\Framework\Block\Social;

/**
 * Class Links
 * Social Links Urls
 */
class Links extends \Magento\Framework\View\Element\Template
{
    /**
     * Get Social Links
     * @return array
     */
    public function getSocialLinks()
    {
        return [
            [
                'label' => 'Facebook',
                'icon' => 'facebook',
                'url' => $this->getFacebookShareLink()
            ],
            [
                'label' => 'Twitter',
                'icon' => 'twitter',
                'url' => $this->getTwitterShareLink()
            ],
            [
                'label' => 'Pinterest',
                'icon' => 'pinterest',
                'url' => $this->getPinterestShareLink()
            ]
        ] ;
    }

    /**
     * Get Twitter Share Url
     * @return string
     */
    public function getTwitterShareLink()
    {
        $baseUrl = $this->getCurrentUrl();
        return 'https://twitter.com/intent/tweet?url=' . $baseUrl;
    }

    /**
     * Get Facebook Share Url
     * @return string
     */
    public function getFacebookShareLink()
    {
        $baseUrl = $this->getCurrentUrl();
        return 'https://www.facebook.com/sharer.php?u=' . $baseUrl;
    }

    /**
     * Get Pinterest Share Url
     * @return string
     */
    public function getPinterestShareLink()
    {
        $baseUrl = $this->getCurrentUrl();
        return 'https://pinterest.com/pin/create/button/?url=' . $baseUrl;
    }

    /**
     * Get URL of current page
     *
     * @return string
     */
    protected function getCurrentUrl(): string
    {
        return $this->getUrl('*/*/*', ['_current' => true, '_use_rewrite' => true]);
    }
}
