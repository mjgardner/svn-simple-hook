//var ess = ess || {};
if(!ess) {
    ess = {};
}
ess.swatches = {};
ess.swatches.products = {};

ess.swatches.init = function(options) {
  options = options || { switchOnEvent: "mouseover", preventEventPropagation: false };
  var products = $$(".hproduct");
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    var productId = product.identify().replace("product-", "");
    var productObject = ess.swatches.products[productId];

    if (!productObject) {
      continue;
    }

    var colors = product.select(".colors li a");

    for (var j = 0; j < colors.length; j++) {
      var color = colors[j];
      var colorId = color.identify().replace("color-" + productId + "-", "");
      var colorObject = productObject.colors[colorId];

      if (!colorObject) {
        continue;
      }

      color.observe(options['switchOnEvent'], function (e) {
          var colorHref = this.colorElement.href;
          var imageType = this.colorElement.classNames().toArray()[0] || 'ENH-VAR';
          var imageSource = this.colorObject.images[imageType] || 'images/no-image-available-v150.gif';
          this.productElement.select(".photo").each(function(photoAnchor) { photoAnchor.href = colorHref; });
          this.productElement.select(".fn a").each(function(titleAnchor) { titleAnchor.href = colorHref; });
          this.productElement.select(".photo img").each(function(photoImage) { photoImage.src = imageSource; });
          if (options['preventEventPropagation']) {
              Event.stop(e);
          }
      }.bind({colorElement: color, productElement: product, colorObject: colorObject}));

    }
  }
};

document.observe("dom:loaded", function(e) {
  ess.swatches.init({ switchOnEvent: "click", preventEventPropagation: true });
  // for 'mouseover', see default options for ess.swatches.init()
});
