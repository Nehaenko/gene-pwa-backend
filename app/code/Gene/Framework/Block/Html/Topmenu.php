<?php

declare(strict_types=1);

namespace Gene\Framework\Block\Html;

use Magento\Framework\Data\Tree\Node;
use Magento\Framework\View\Element\Template;
use Magento\Framework\Data\TreeFactory;
use Magento\Framework\Data\Tree\NodeFactory;
use Magento\Cms\Model\Template\FilterProvider;

/**
 * Class Topmenu
 * Custom Menu HTML
 */
class Topmenu extends \Magento\Theme\Block\Html\Topmenu
{
    /**
     * @var FilterProvider
     */
    private $filterProvider;

    /**
     * Topmenu constructor.
     * @param Template\Context $context
     * @param NodeFactory $nodeFactory
     * @param TreeFactory $treeFactory
     * @param FilterProvider $filterProvider
     * @param array $data
     */
    public function __construct(
        Template\Context $context,
        NodeFactory $nodeFactory,
        TreeFactory $treeFactory,
        FilterProvider $filterProvider,
        array $data = []
    ) {
        parent::__construct($context, $nodeFactory, $treeFactory, $data);
        $this->filterProvider = $filterProvider;
    }

    /**
     * Get block cache life time
     *
     * @return int
     * @since 100.1.0
     */
    protected function getCacheLifetime()
    {
        return parent::getCacheLifetime() ?: 2678400;
    }

    /**
     * This removes the current URL from the cache key & has significant performance benefits to page load.
     * Downside of this is the "active" state on a menu item will never work; but this is never used.
     * @inheritdoc
     */
    public function getCacheKeyInfo()
    {
        return [
            'BLOCK_TPL',
            $this->_storeManager->getStore()->getCode(),
            $this->getTemplateFile(),
            'base_url' => $this->getBaseUrl(),
            'template' => $this->getTemplate()
        ];
    }

    /**
     * Add sub menu HTML code for current menu item
     *
     * @param Node $child
     * @param string $childLevel
     * @param string $childrenWrapClass
     * @param int $limit
     * @return string HTML code
     * @throws \Exception
     */
    protected function _addSubMenu($child, $childLevel, $childrenWrapClass, $limit)
    {
        $html = '';
        if (!$child->hasChildren()) {
            return $html;
        }
        $colStops = [];
        if ($childLevel == 0 && $limit) {
            $colStops = $this->_columnBrake($child->getChildren(), $limit);
        }
        // @codingStandardsIgnoreLine
        $html .= '<ul class="main-nav__list main-nav__list--level' . $childLevel . ' ' . $childrenWrapClass . '" data-level="' . $childLevel . '" aria-hidden="true" aria-label="' . __('Submenu') . '">';

        $displayName = ($childLevel == 0) ? __('Main Menu') : $this->escapeHtml($child->getName());

        // Display Back Arrow
        $html .=  '<li class="main-nav__item main-nav__item--level' . ($childLevel+1) . ' is-hidden-desktop">';
        // @codingStandardsIgnoreLine
        $html .= '<button type="button" class="js-menu-back-link main-nav__back-button" aria-label="'. __('Back to %1', $displayName). '">';
        // @codingStandardsIgnoreLine
        $html .= '<svg width="14" height="16" viewBox="0 0 14 16" class="main-nav__back-arrow icon icon-arrow icon-arrow--left"><use xlink:href="#icon-arrow"></use></svg>';
        $html .= '<span>' . $displayName . '</span>';
        $html .= '</button>';
        $html .= '</li>';

        // View All Link
        // @codingStandardsIgnoreLine
        $html .= '<li class="main-nav__item main-nav__item--level' . ($childLevel+1) . ' view-all is-hidden-desktop"><a href="' . $child->getUrl() .'" class="main-nav__link main-nav__link--level'. ($childLevel+1) . '">' . $this->escapeHtml( __("View All %1", $child->getName())) . '</a></li>';

        $html .= $this->_getHtml($child, $childrenWrapClass, $limit, $colStops);
        $html .= '</ul>';

        return $html;
    }

    /**
     * Recursively generates top menu html from data that is specified in $menuTree
     *
     * @param Node $menuTree
     * @param string $childrenWrapClass
     * @param int $limit
     * @param array $colBrakes
     * @return string
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     * @throws \Exception
     */
    protected function _getHtml(
        Node $menuTree,
        $childrenWrapClass,
        $limit,
        array $colBrakes = []
    ) {
        $html = '';

        $children = $menuTree->getChildren();
        $parentLevel = $menuTree->getLevel();
        $childLevel = $parentLevel === null ? 0 : $parentLevel + 1;

        $counter = 1;
        $itemPosition = 1;
        $childrenCount = $children->count();

        $parentPositionClass = $menuTree->getPositionClass();
        $itemPositionClassPrefix = $parentPositionClass ? $parentPositionClass . '-' : 'nav-';

        /** @var Node $child */
        foreach ($children as $child) {
            if ($childLevel === 0 && $child->getData('is_parent_active') === false) {
                continue;
            }
            $child->setLevel($childLevel);
            $child->setIsFirst($counter == 1);
            $child->setIsLast($counter == $childrenCount);
            $child->setPositionClass($itemPositionClassPrefix . $counter);

            // Add class to parent list if content exists
            if ($child->getMegamenuFeaturedImage()) {
                $childrenWrapClass .= ' main-nav__list--with-featured';
            }

            // Add class to sub levels
            if ($childLevel > 0) {
                $childrenWrapClass .= ' main-nav__mobile-section js-menu-mobile-section';
            }

            $linkClasses = 'main-nav__link main-nav__link--level'. $childLevel;

            if ($child->hasChildren()) {
                $linkClasses .= ' js-menu-parent-link';
            }

            if ($childLevel === 0) {
                $linkClasses .= ' js-menu-parent-link-top';
            }

            $linkAria = '';
            if ($childLevel == 0) {
                $linkAria .= ' aria-expanded="false"';
            }

            $html .= '<li ' . $this->_getRenderedMenuItemAttributes($child) . ' data-level=level'. $childLevel . '>';
            // @codingStandardsIgnoreLine
            $html .= '<a href="' . $child->getUrl() . '" class="'. $linkClasses . '"' . ' data-level=level'. $childLevel . $linkAria . '><span>' . $this->escapeHtml($child->getName()) . '</span>';
            if ($child->hasChildren()) {
                // @codingStandardsIgnoreLine
                $html .= '<svg width="14" height="16" viewBox="0 0 14 16" class="main-nav__parent-arrow icon icon-arrow icon-arrow--right"><use xlink:href="#icon-arrow"></use></svg>';
            }
            $html .='</a>';

            if ($childLevel == 0 && $child->hasChildren()) {
                // @codingStandardsIgnoreLine
                $html .= '<div class="main-nav__dropdown main-nav__mobile-section js-menu-mobile-section"><div class="main-nav__wrapper main-nav__dropdown-wrapper">';
            }

            $html .=  $this->_addSubMenu(
                $child,
                $childLevel,
                $childrenWrapClass,
                $limit
            );

            if ($childLevel == 0 && $child->hasChildren()) {
                if ($featuredImage = $child->getMegamenuContent()) {
                    $html .= '<div class="main-nav__featured-content accessible-megamenu-panel-group">';
                    $html .= $this->filterProvider->getPageFilter()->filter($featuredImage);
                    $html .= '</div>';
                }
            }

            if ($childLevel == 0 && $child->hasChildren()) {
                $html .= '</div></div>';
            }

            $html .= '</li>';

            $itemPosition++;
            $counter++;
        }

        return $html;
    }

    /**
     * Returns array of menu item's classes
     * Customised to add has-featured-content class
     * @param Node $item
     * @return array
     */
    protected function _getMenuItemClasses(Node $item)
    {
        $classes = [];
        $classes[] = 'main-nav__item';
        $classes[] = 'main-nav__item--level' . $item->getLevel();
        $classes[] = $item->getPositionClass();
        if ($item->getIsCategory()) {
            $classes[] = 'main-nav__item--category-item';
        }
        if ($item->getIsFirst()) {
            $classes[] = 'main-nav__item--first';
        }
        if ($item->getIsLast()) {
            $classes[] = 'main-nav__item--last';
        }
        if ($item->getClass()) {
            $classes[] = $item->getClass();
        }
        if ($item->hasChildren()) {
            $classes[] = 'main-nav__item--parent';
        }
        //
        // Add Class if category has Featured Block content
        //
        if ($featuredImage = $item->getMegamenuFeaturedImage()) {
            $classes[] = 'main-nav__item--with-featured';
        }
        return $classes;
    }
}
