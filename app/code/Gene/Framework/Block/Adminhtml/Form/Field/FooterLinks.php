<?php
namespace Gene\Framework\Block\Adminhtml\Form\Field;

use Magento\Config\Block\System\Config\Form\Field\FieldArray\AbstractFieldArray;

class FooterLinks extends AbstractFieldArray
{
    const LABEL = 'label';
    const LINK = 'link';
    const CSS_CLASSES = 'css_classes';

    protected function _prepareToRender()
    {
        $this->addColumn(
            self::LABEL,
            [
                'label' => __('Label'),
                "class" => "required-entry"
            ]
        );
        $this->addColumn(
            self::LINK,
            [
                'label' => __('Link'),
                'class' => 'required-entry',
            ]
        );
        $this->addColumn(
            self::CSS_CLASSES,
            [
                'label' => __('CSS Classes'),
            ]
        );
        $this->_addAfter = true;
        $this->_addButtonLabel = __('Add Link');
    }
}
