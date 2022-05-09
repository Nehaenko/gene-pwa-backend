<?php
/**
 * Gene/Framework InstallData
 */
namespace Gene\Framework\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
 
/**
 * @codeCoverageIgnore
 */
class InstallData implements InstallDataInterface
{
    /**
     * @var EavSetupFactory
     */
    protected $eavSetupFactory;

    /**
     * @var \Magento\Catalog\Model\Category
     */
    protected $categoryModel;

    /**
     * InstallData constructor.
     * @param EavSetupFactory $eavSetupFactory
     */
    public function __construct(
        EavSetupFactory $eavSetupFactory,
        \Magento\Catalog\Model\Category $categoryModel
    ) {
        $this->eavSetupFactory = $eavSetupFactory;
        $this->categoryModel = $categoryModel;
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
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        /** @var EavSetup $eavSetup */
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

        // setup sub-title attribute
        if (!$this->attributeExists('category_sub_title')) {
            $eavSetup->addAttribute(
                \Magento\Catalog\Model\Category::ENTITY,
                'category_sub_title',
                [
                    'type' => 'text',
                    'label' => 'Sub Title',
                    'input' => 'textarea',
                    'required' => false,
                    'sort_order' => 70,
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'group' => 'Content',
                    'wysiwyg_enabled' => true,
                    'is_html_allowed_on_front' => true
                ]
            );
        }

        // setup addition-content attribute
        if (!$this->attributeExists('category_additional_content')) {
            $eavSetup->addAttribute(
                \Magento\Catalog\Model\Category::ENTITY,
                'category_additional_content',
                [
                    'type' => 'text',
                    'label' => 'Additional Content',
                    'input' => 'textarea',
                    'required' => false,
                    'sort_order' => 80,
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'group' => 'Content',
                    'wysiwyg_enabled' => true,
                    'is_html_allowed_on_front' => true
                ]
            );
        }

        // setup megamenu_featured_image attribute
        if (!$this->attributeExists('megamenu_featured_image')) {
            $eavSetup -> addAttribute(
                \Magento\Catalog\Model\Category :: ENTITY,
                'megamenu_featured_image',
                [
                    'type' => 'text',
                    'label' => 'Featured Image',
                    'input' => 'textarea',
                    'required' => false,
                    'sort_order' => 110,
                    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                    'is_html_allowed_on_front' => false,
                    'group' => 'Display Settings',
                    'wysiwyg_enabled' => true,
                    "default" => "",
                    "class"  => "",
                    "note"   => "Featured Image Content"
                ]
            );
        }
    }
}
