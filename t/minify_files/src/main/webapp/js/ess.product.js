document.observe("dom:loaded", function(e) {

    if ($(document.body).id === 'product') {
        ess = ess || {};

        ess.displayPrice = function(obj, context) {
            obj.up().style.display = 'none';
            obj.up().next().style.display = 'block';
        };

        ess.printThisPageText = "Print This Page";
        ess.createPrint = function() {
            var utils = $("prodTools");
            if (!utils) {
                return;
            }

            var dd = $(document.createElement("dd"));
            dd.update(ess.printThisPageText);
            dd.addClassName("print");
            dd.observe("click", function() {
                print();
            });
            utils.appendChild(dd);
        };

        /*
         * Get page title
         */
        ess.getPageTitle = function() {
            var pageTitle;
            $$('title').each(function(node){
                pageTitle = node.innerHTML;
            });
            return pageTitle;
        };

        /*
         * Add to Facebook
         */
        ess.addToFacebook = function() {
            var pageUrl = encodeURIComponent(window.location.href);
            var pageTitle = escape(ess.getPageTitle());
            var facebookUrl = "http://www.facebook.com/sharer.php?u=" + pageUrl + "&t=" + pageTitle;
            window.open(facebookUrl);
        };

        ess.addToCartBtnId = "add-to-cart";

        ess.validateProduct = function(cartAction) {
            var isCartable = true;

            var colorContainer = $("colorContainer");
            var quantityContainer = $("quantityContainer");
            var sizeContainer = $("sizeContainer");

            var cErrors = colorContainer.select(".error");
            var qErrors = quantityContainer.select(".error");
            var sErrors = sizeContainer.select(".error");

            var errorArray = [cErrors, sErrors, qErrors];

            // clear errors
            for (var i = 0; i < errorArray.length; i++) {
                var errors = errorArray[i];
                for (var j = 0; j < errors.length; j++) {
                    errors[j].remove();
                }
            }

            // check color
            if (ess.product.currentView.colorId == "" && ess.product.colorSliceValues.length != 0) {
                var error = $(document.createElement("div"));
                error.update(ess.messages.validateColor);
                error.addClassName("error");

                colorContainer.insert(error, {position: "top"});

                isCartable = false;
            }

            // check size
            if (ess.product.skuId == "") {
                var error = $(document.createElement("div"));
                error.update(ess.messages.validateSize);
                error.addClassName("error");

                sizeContainer.insert(error, {position: "top"});

                isCartable = false;
            } else {
                var skuId = $("skuId");
                if (!skuId) {
                    skuId = $(document.createElement("input"));
                    skuId.id = "skuId";
                    skuId.name = "skuId";
                    skuId.type = "hidden";
                    $("addToCartForm").appendChild(skuId);
                }
                skuId.value = ess.product.skuId;
            }

            // check quantity
            var qty = $("quantity");
            if (qty) {
                if (qty.present()) {
                    var qVal = qty.getValue();
                    if (isNaN(qVal) || parseInt(qVal) < 1) {
                        var error = $(document.createElement("div"));
                        error.update(ess.messages.validateQuantity);
                        error.addClassName("error");

                        quantityContainer.insert(error, {position: "top"});

                        isCartable = false;
                    }
                } else {
                    var error = $(document.createElement("div"));
                    error.update(ess.messages.validateQuantity);
                    error.addClassName("error");

                    quantityContainer.insert(error, {position: "top"});

                    isCartable = false;
                }
            }

            return isCartable;
        }
        
        // Create instance of Product
        if (ess.productJSON) {
            ess.product = new ess.Product(ess.productJSON);
        }

        var i;

        /*
         * Color Swatches
         */
        if ($("mainProductSwatches") && ess.product)
        {
            var colorSwatches = $("mainProductSwatches").select("li");

            for (i = 0; i < colorSwatches.length; i++) {
                var swatch = colorSwatches[i];
                swatch.colorId = (swatch.id).substring((swatch.id).lastIndexOf("_") + 1);

                swatch.observe("click", function() {
                    ess.product.changeColor(this.colorId);
                });

                swatch.observeProductColorChange = function(product) {
                    if (this.colorId == product.colorId) {
                        this.className = "selected";
                    } else {
                        this.className = "";
                    }
                };
                ess.product.addColorChangeListener(swatch);
            }
        }

        /*
         * Larger image popup
         */
        var largeImage = $("large-image");
        if (largeImage && ess.product)
        {
            largeImage.href = "javascript:void(0);";
            largeImage.observe("click", function() {
                if (largeImage.hasClassName("inactive")) {
                    return false;
                }

                var viewId = 'main';
                if (ess.product.getCurrentView().viewId != undefined && ess.product.getCurrentView().viewId != null) {
                    viewId = ess.product.getCurrentView().viewId;
                }
                /* alert('ess.product.getCurrentView().colorId = ' + ess.product.getCurrentView().colorId + '\ness.product.getCurrentView().viewId = ' + ess.product.getCurrentView().viewId); */

                var colorCode = ess.product.getCurrentView().colorId;
                var type = "V400";
                var prodId = window.ess.productJSON.productId;
                var url = ess.largeImageUriPrefix + "productId=" + prodId + "&type=" + type + "&colorCode=" + colorCode + '&viewId=' + viewId;

                var popupHeight = 760;
                var popupWidth = 500;
                if (screen.height < 800) {
                    popupHeight = 650;
                    popupWidth = 525;
                }

                window.open(url, "largeImage", "width="+popupWidth+",height="+popupHeight+",scrollbars=yes,resizable=yes");
                var longTitle = window.ess.productJSON.longTitle;
                var shortTitle = window.ess.productJSON.title;
                $(document).fire("pr:view-large-image", {
                    id: prodId,
                    longTitle: longTitle,
                    shortTitle: shortTitle,
                    mfgStyleCode: '',
                    type: 'STANDARD',
                    available: true
                });
            });

            largeImage.observeProductColorChange = function(product) {
                if (product.currentView.enhancedImageURL != "") {
                    this.className = "active";
                } else {
                    this.className = "inactive";
                }
            };
            ess.product.addColorChangeListener(largeImage);
        }

        /*
         * Alternate Views
         */
        if ($("alternate-images") && ess.product)
        {
            var altViewContainer = $("alternate-images");
            var altViews = altViewContainer.select("li");
            for (i = 0; i < altViews.length; i++) {
                var view = altViews[i];
                view.getElementsByTagName("a")[0].href="javascript:ess.product.changeView(" + i + ");";
            }
            altViewContainer.observeProductColorChange = function(product)
            {
                var innerHTML = "";
                var lastClass = "";

                var altsWithThumbnails = 0;
                if (product.getCurrentColorSliceValue().thumbnailImageURL !== ""
                        && product.getCurrentColorSliceValue().alternateViews != null)
                {
                    /* DEFENSIVE CODING: determine how many alternate view images WITH thumbnails are available */
                    for (i = 0; i < product.getCurrentColorSliceValue().alternateViews.length; i++)
                    {
                        if (product.getCurrentColorSliceValue().alternateViews[i].thumbnailImageURL !== "") {
                            altsWithThumbnails =+ 1;
                        }
                    }
                }
                /* alert('altsWithThumbnails = ' + altsWithThumbnails); */

                /* only show alternate images if there is at least one besides the initial image */
                if (product.getCurrentColorSliceValue().thumbnailImageURL !== "" && altsWithThumbnails > 0)
                {
                    /* current image thumbnail */
                    if (product.getCurrentColorSliceValue().thumbnailImageURL !== "") {
                        innerHTML = '<li id="more0"><a href="javascript:ess.product.changeView(0);">'
                            + '<img src="' + product.getCurrentColorSliceValue().thumbnailImageURL + '" alt="alternate product view"/></a></li>';
                    }

                    /* alternate views thumbnails */
                    for (i = 0; i < product.getCurrentColorSliceValue().alternateViews.length; i++)
                    {
                        if (product.getCurrentColorSliceValue().alternateViews[i].thumbnailImageURL !== "") {
                            if (i+1 == product.getCurrentColorSliceValue().alternateViews.length) {
                                lastClass = ' class="last"';
                            }
                            innerHTML += '<li id="more' + (i + 1) + '"' + lastClass + '>'
                                + '<a href="javascript:ess.product.changeView(' + (i + 1) + ');">'
                                + '<img src="' + product.getCurrentColorSliceValue().alternateViews[i].thumbnailImageURL + '"'
                                + 'alt="alternate product view"/></a></li>';
                        }
                    }
                }
                altViewContainer.update(innerHTML);
            };
            ess.product.addColorChangeListener(altViewContainer);
        }

        /*
         * Embedded Zoom
         */
        if ($("zoom") && ess.product)
        {
            var z = $("zoom");

            z.observeProductColorChange = z.observeProductViewChange = function(product) {
                var currentView = product.getCurrentView();
                var o = {
                    base: product.p.mainImageURL,
                    zoom: product.p.zoomImageURL
                };

                if (currentView != null && currentView.mainImageURL != ""
                        && currentView.zoomImageURL != "") {
                    o.base = currentView.mainImageURL;
                    o.zoom = currentView.zoomImageURL;
                }

                var loader2 = $(document.body).e("div", "bottom", {className: "loader"});
                var img2 = new Df.EmbeddedZoom("zoom", {
                    loader: loader2,
                    moveEvent: 'drag'
                }).load(o);

                var zoomIn = $("zoom-in");
                var zoomOut = $("zoom-out");

                if (zoomIn && zoomOut) {
                    // Remove any existing custom zoom events
                    zoomIn.stopObserving('click');
                    zoomOut.stopObserving('click');

                    // Set custom zoom events
                    zoomIn.observe('click', function(event) {
                        img2.element.fire(':zoomIn');
                    });
                    zoomOut.observe('click', function(event) {
                        img2.element.fire(':zoomOut');
                    });
                    img2.element.observe(':zoomIn', function(event) {
                        $('zoom-in').className = 'inactive';
                        $('zoom-out').className ='active';
                    });
                    img2.element.observe(':zoomOut', function(event) {
                        $('zoom-in').className = 'active';
                        $('zoom-out').className = 'inactive';
                    });
                }
            };
            ess.product.addViewChangeListener(z);
            ess.product.addColorChangeListener(z);
        }

        /*
         * Main Product Image
         */
        var mainProductImage = $("mainProductImage");
        if (mainProductImage && ess.product)
        {
            mainProductImage.observeProductViewChange = function(product) {
                var currentView = product.getCurrentView();
                if (currentView != null && currentView.mainImageURL != "") {
                    this.src = currentView.mainImageURL;
                } else {
                    this.src = product.p.mainImageURL;
                }
            };
            ess.product.addViewChangeListener(mainProductImage);
        }

        /*
         * HTML Color Select
         */
        var color = $("color");
        if (color && ess.product)
        {
            color.observe("change", function(e){
                ess.product.changeColor(this.value);
            });
            color.observeProductColorChange = function(product) {
                color.value = product.colorId;
            };
            ess.product.addColorChangeListener(color);
        }

        var availMsg = $("availability-msg");
        if (availMsg && ess.product)
        {
            availMsg.observeProductSkuChange = function(product) {
                if (product.skuId != null && product.skuId != "") {
                    var msg = product.getSkuById(product.skuId).availShipEstMessage;
                    this.innerHTML = msg;
                }
                var disableAddToCartBtn = product.getSkuById(product.skuId).avail == "NOT_AVAILABLE";
                if ($(ess.addToCartBtnId)) {
                    toggleBtn($(ess.addToCartBtnId), disableAddToCartBtn);
                }
            };
            ess.product.addSkuChangeListener(availMsg);
        }

        /*
         * HTML size drop down
         */
        if ($("size") && ess.product)
        {
            var s = $("size");
            s.observe('change', function(e){
                var arr = this.value.split("|");
                var skuId = arr[1];
                ess.product.changeSku(skuId);
            })

            s.observeProductColorChange = function(product) {
                var currentColorSlice = product.getCurrentColorSliceValue();
                var hasPriceRange = product.hasPriceRange;
                /* alert('hasPriceRange = ' + hasPriceRange); */
                var str = "";
                for (i = 0; i < currentColorSlice.availableSkuIds.length; i++)
                {
                    var sku = product.getSkuById(currentColorSlice.availableSkuIds[i]);
                    var skuSizeDisplay = sku.size;
                    if (hasPriceRange) {
                        /* alert('sku.price.current = ' + sku.price.current); */
                        skuSizeDisplay = sku.size + ' - ' + sku.price.current;
                    }
                    str += "<option value=\"" + product.p.productId + "|" + sku.sku_id + "\">" + skuSizeDisplay + "</option>";
                }
                s.update(str);
            };
            ess.product.addColorChangeListener(s);

            s.observeProductSkuChange = function(product) {
                this.value = product.p.productId + "|" + product.skuId;
            }
            ess.product.addSkuChangeListener(s);
        }

        if ($("prod_0") && ess.product)
        {
            $("prod_0").observeProductSkuChange = function(product) {
                this.value = product.p.productId + '|' + product.skuId;
            };
            ess.product.addSkuChangeListener($("prod_0"));
            if ($("prod_0").tagName.toLowerCase() == "input") {
              $("prod_0").value = ess.product.p.productId + '|' + ess.product.skuId;
            }
        }

        /*
         * Good Until Pricing
         */
        try
        {
            var expires = $("gup");
            if (expires && ess.product)
            {
              expires.observeProductSkuChange = function(product) {
                var skus = ess.productJSON.skus;
                for (i=0; i < skus.length; i++) {
                  var sku = skus[i];
                  if (product.skuId !== sku.sku_id) {
                    continue;
                  }
                  var price = sku.price;
                  if (price.goodUntilDate.length > 0) {
                    $("gup").update(price.current + " "
                      + ess.productJSON.goodUntilLabel + " " + price.goodUntilDate);
                  } else {
                    $("gup").update("");
                  }
                }
              };
              ess.product.addSkuChangeListener(expires);
            }
        } catch(err) { /* swallow */ }

        /*
         * Wishlist
         */
        var wishlist = $("wishlistButton");
        var cartForm = $("addToCartForm");
        if (wishlist && cartForm && ess.product)
        {
            wishlist.observe("click", function() {
                this.cartForm.action = this.href;
                if(ess.validateProduct())
                    this.cartForm.submit();
            }.bind({href: wishlist.href, cartForm: cartForm}));
            wishlist.href = "#addToWishlist";
        }

        /*
         * Qty html select
         */
        var qty = $("quantity");
        if (qty && ess.product)
        {
            qty.observe("change", function(e){
                ess.product.setQuantity(this.value);
            })
            qty.observeProductQtyChange = function(product) {
                this.value = product.quantity;
            }
            ess.product.addQtyChangeListener(qty);
        }

        /*
         * get c from the url and put it in colorId
         */
        var colorId = window.location.search.toQueryParams().c;
        if (ess.product)
        {
            if (colorId && colorId.length > 0)
            {
                var setColor = false;
                for (i=0; i < ess.product.p.colorSliceValues.length; i++) {
                    if (ess.product.p.colorSliceValues[i].colorId == colorId) {
                        //we have a match
                        setColor = true;
                        ess.product.changeColor(colorId);
                        break;
                    }
                }
                if (!setColor) {
                    if (ess.product.p.colorSliceValues.length > 0) {
                        ess.product.changeColor(ess.product.p.colorSliceValues[0].colorId);
                    }
                }
            } else if (ess.product.p.colorSliceValues.length > 0) {
                ess.product.changeColor(ess.product.p.colorSliceValues[0].colorId);
            }
        }

        /*
         * Tabset and print
         */
        ess.createTabs("tabset");
        ess.createPrint();

        /*
         * Add to Cart Form
         */
        if ($("addToCartForm") && ess.product)
        {
            $("addToCartForm").onsubmit = function(e) {
                return ess.validateProduct();
            };
        }

        /*
         * Add to facebook
         */
        if ($("add-facebook"))
        {
            $("add-facebook").observe('click', function(e) {
                ess.addToFacebook();
            });
        }

        /*
         * Print page
         */
        if ($("print-page"))
        {
            $("print-page").observe('click', function(e) {
                window.print();
            });
        }

        /*
         * Recently viewed slider
         */
        if ($("history-slider"))
        {
            var rvProds = $("history-slider");
            var rvProdListItems = rvProds.getElementsByTagName("li");
            var width = 0;

            // Fix the width of the slider element
            for (i = 0; i < rvProdListItems.length; i++) {
                width = width + rvProdListItems[i].offsetWidth;
            }
            var productSlider = $("rv-products");
            productSlider.style.width = width + "px";

            // Create slider instance
            var ins3 = new Df.Slider("history-slider");

            ins3.pars.animate = {
                time: 200,
                pause: 20
            };

            ins3.pars.iterateBy = 360;
            ins3.set();
        }

        /*
         * Recent history product tip
         */
        if ($('recent-history') && $('product-tip'))
        {
            var tip = $('product-tip');

            $$('ul#rv-products .hproduct').each(function(el) {
                el.observe('mouseover', function(event) {
                    var prd = Event.findElement(event, '.hproduct');

                    tip.clonePosition(prd, {
                        setWidth: false,
                        setHeight: false,
                        offsetTop: -80,
                        offsetLeft: 60
                    });

                    // Get details of product
                    var prdContent = prd.down('.product-tip-content').innerHTML;
                    tip.down('.tt-inner').innerHTML = prdContent;

                    tip.addClassName('show');
                });

                el.observe('mouseout', function(event) {
                    tip.removeClassName('show');
                });
            });

            tip.observe('mouseover', function(event) {
                tip.addClassName('show');
            });
            tip.observe('mouseout', function(event) {
                tip.removeClassName('show');
            });
        }

        if ($('add-to-cart') && ess.product)
        {
            $('add-to-cart').removeClassName('hide');
        }

        /*
         * Quantity validation
         */
        if (ess.product) {
            ess.validateQuantityOnKeyUp("#quantity", 999);
        }

        /* Quantity selection on click */
        /*$('quantity').observe('click', function(e){
            this.focus();
            this.select();
        });*/
    }
});