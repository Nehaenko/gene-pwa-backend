<?php
namespace Gene\Framework\Setup;

use Magento\Eav\Setup\EavSetup;
use Magento\Framework\Setup\UpgradeDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;

/**
 * Class UpgradeData
 * Upgrade Scripts
 */
class UpgradeData implements UpgradeDataInterface
{
    /**
     * @var \Magento\Eav\Model\Config
     */
    protected $eavConfig;

    /**
     * @var \Magento\Eav\Setup\EavSetupFactory
     */
    protected $eavSetupFactory;

    /**
     * @var \Magento\Catalog\Model\Category
     */
    protected $categoryModel;

    /**
     * @param \Magento\Eav\Model\Config $eavConfig
     */
    public function __construct(
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Eav\Setup\EavSetupFactory $eavSetupFactory,
        \Magento\Catalog\Model\Category $categoryModel
    ) {
        $this->eavSetupFactory = $eavSetupFactory;
        $this->eavConfig = $eavConfig;
        $this->categoryModel = $categoryModel;
    }

    /**
     * @param ModuleDataSetupInterface $setup
     * @param ModuleContextInterface $context
     */
    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        /** @var EavSetup $eavSetup */
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

        if (version_compare($context->getVersion(), '1.0.1', '<')) {
            $this->addAdditionalContent($eavSetup);
        }

        $this->eavConfig->clear();
        $setup->endSetup();
    }

    /**
     * Determine whether an attribute already exists
     *
     * @param $attributeCode
     *
     * @return mixed
     */
    protected function attributeExists($attributeCode)
    {
        if ($this->categoryModel->getResource()->getAttribute($attributeCode)) {
            return true;
        }
    }

    /**
     * @param $eavSetup
     */
    public function addAdditionalContent($eavSetup)
    {
        if (!$this->attributeExists('product_additional')) {
            $eavSetup->addAttribute(
                \Magento\Catalog\Model\Product::ENTITY,
                'additional_content',
                [
                    'type' => 'text',
                    'backend' => '',
                    'frontend' => '',
                    'label' => 'Additional Content',
                    'input' => 'textarea',
                    'class' => '',
                    'source' => \Magento\Catalog\Model\Product\Attribute\Source\Layout::class,
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'group' => 'Content',
                    'visible' => true,
                    'required' => 0,
                    'user_defined' => false,
                    'default' => '',
                    'searchable' => false,
                    'filterable' => false,
                    'comparable' => false,
                    'visible_on_front' => false,
                    'used_in_product_listing' => true,
                    'wysiwyg_enabled' => true,
                    'unique' => false,
                    'apply_to' => ''
                ]
            );
        }
    }
}
