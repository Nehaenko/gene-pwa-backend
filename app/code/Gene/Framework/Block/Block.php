<?php
/**
 * Custom Cms/Block, Added getTitle and isActive method
 *
 * @package Gene/Framework

 */
namespace Gene\Framework\Block;

class Block extends \Magento\Cms\Block\Block
{
    /**
     * We need to load BlockRepositoryInterface to get the static
     * block title.
     * @var \Magento\Cms\Api\BlockRepositoryInterface
     */
    protected $_blockRepository;

    public function __construct(
        \Magento\Framework\View\Element\Context $context,
        \Magento\Cms\Model\Template\FilterProvider $filterProvider,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Cms\Model\BlockFactory $blockFactory,
        \Magento\Cms\Api\BlockRepositoryInterface $blockRepository,
        array $data = []
    ) {
        parent::__construct($context, $filterProvider, $storeManager, $blockFactory, $data);
        $this->_blockRepository = $blockRepository;
    }

    /**
     * Returns static block title, M1 have this method.
     *
     * @return string|null
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function getTitle()
    {
        $blockId = $this->getBlockId();
        $title = "";
        if ($blockId) {
            $block = $this->_blockRepository->getById($blockId);
            $title = $block->getTitle();
        }
        return $title;
    }

    /**
     * Performs check if the static block exist/active.
     *
     * @return bool
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function isActive()
    {
        $blockId = $this->getBlockId();
        $isActive = false;
        if ($blockId) {
            $storeId = $this->_storeManager->getStore()->getId();
            /** @var \Magento\Cms\Model\Block $block */
            $block = $this->_blockFactory->create();
            $block->setStoreId($storeId)->load($blockId);
            $isActive = $block->isActive();
        }
        return $isActive;
    }
}
