if (Object.isUndefined(ess)) {
    var ess = {};
}

ess.swatches = {};
ess.swatches.products = {};

ess.swatches.init = function(options) {
    options = options || { switchOnEvent: "mouseover", preventEventPropagation: false };
    var products = $$(".products li");
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var productId = product.identify().replace("product-", "");
        var productObject = ess.swatches.products[productId];

        if (!productObject) {
            continue;
        }

        var colors = product.select(".colors li a");
		
		function switchHighlight(eventTarget){
                    //parentNode spam is because of IE
				var getSiblings = eventTarget.parentNode.parentNode.parentNode.select('li');
			for (var col = 0; col < getSiblings.length; col++) {
				if (getSiblings[col].hasClassName('active-swatch'))
					getSiblings[col].removeClassName('active-swatch');
			}
			eventTarget.parentNode.parentNode.addClassName('active-swatch');

		};

        for (var j = 0; j < colors.length; j++) {
            var color = colors[j];
            var colorId = color.identify().replace("color-" + productId + "-", "");
            var colorObject = productObject.colors[colorId];

            if (!colorObject) {
                continue;
            }

            if ($$(".family-category")) {
                color.observe("click", function (e) {
                    var colorHref = this.colorElement.rel;
                    var imageType = this.colorElement.classNames().toArray()[0] || 'T240x240';
                    var imageSource = this.colorObject.images[imageType] || 'images/no-image-v150.gif';
					switchHighlight(e.target);
                    this.productElement.select(".product-photo").each(function(photoAnchor) { photoAnchor.href = colorHref; });
                    this.productElement.select(".product-title a").each(function(titleAnchor) { titleAnchor.href = colorHref; });
                    this.productElement.select(".product-photo img").each(function(photoImage) { photoImage.src = imageSource; });
                    Event.stop(e);
                }.bind({colorElement: color, productElement: product, colorObject: colorObject}));
            } else {
                color.observe(options['switchOnEvent'], function (e) {
                    var colorHref = this.colorElement.rel;
                    var imageType = this.colorElement.classNames().toArray()[0] || 'ENH-VAR';
                    var imageSource = this.colorObject.images[imageType] || 'images/no-image-v150.gif';
                    this.productElement.select(".photo").each(function(photoAnchor) { photoAnchor.href = colorHref; });
                    this.productElement.select(".fn a").each(function(titleAnchor) { titleAnchor.href = colorHref; });
                    this.productElement.select(".photo img").each(function(photoImage) { photoImage.src = imageSource; });
                    if (options['preventEventPropagation']) {
                        Event.stop(e);
                    }
                }.bind({colorElement: color, productElement: product, colorObject: colorObject}));
            }
        }
    }
};

document.observe("dom:loaded", function(e) {
    ess.swatches.init({ switchOnEvent: "click", preventEventPropagation: true });
    // for 'mouseover', see default options for ess.swatches.ini
});
