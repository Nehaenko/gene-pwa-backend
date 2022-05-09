# Magento 2 Roundel Module #
**version: 1.0.0**

### Description

This module allows site owners to add roundels to products.

It will automatically add the roundels to product pages, however, to display the roundels elsewhere you'll need to pull in the helper manually into your phtml template file. For example:

```
$roundelHelper = $this->helper('Gene\Roundel\Helper\Data');
$roundel = $roundelHelper->getRoundel($_product);
$show = $roundelHelper->isEnabledProductList();
```
You can then display it using:
```
<?php if ($roundel && $show): ?>
    <div class="gene-roundel <?php echo $roundel[2]; ?>">
        <img src="<?php echo $roundel[0]; ?>" alt="<?php echo $roundel[1]; ?>">
    </div>
<?php endif; ?>
```

### Features

- You can toggle to show roundels either just on product pages, just on product listing pages, everywhere or disabled.
- The module comes with minimal CSS for basic positioning only so you'll need to add styles to your theme.

### Testing

[coming]
 
### Release Notes

- [1.0.0] First implementation.

### Known Bugs

- Currently we are unable to create our own `swatch_image` image size.
