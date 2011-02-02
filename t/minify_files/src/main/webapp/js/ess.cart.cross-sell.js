/* derived from: /store-webapp/gsi-store-webapp-war/src/main/webapp/js/ess.cart.js */
CrossSell = Class.create(Df.Base,{
    initialize: function(element, skus, formName){
        this.element = $(element);
        this.skus = skus;
        this.isCartable = false;

        this.colorSelect = this.element.select('select.colorCrossSell')[0];
        this.sizeSelect = this.element.select('select.sizeCrossSell')[0];
        this.skuInputId = this.element.select('input.skuCrossSell')[0].id;
        this.productId = this.element.select('input.pidCrossSell')[0].value;
        this.priceLabel = this.element.select('dd.priceAnim')[0];
        this.defaultPriceVal = this.element.select('dd.priceAnim')[0].innerHTML;
        this.addToCartButton = this.element.select('a.addToCart')[0];

        this.formName = formName;
        this.priceLabel.setStyle({opacity:1});

        if(this.colorSelect){
            this.colorInit();
        }
        if(this.sizeSelect){
            this.sizeInit();
        }
        if(!this.sizeSelect && !this.colorSelect){
            this.isCartable = true;
        }

        this.updateState();

        if(this.colorSelect){
            this.colorSelect.observe('change', function(e){
                this.updateSelects(e.target);
            }.bind(this));
        }

        if(this.sizeSelect){
            this.sizeSelect.observe('change', function(e){
                this.updateSelects(e.target);
            }.bind(this));
        }
    },

    updateSelects: function(trigger){
        var smartSelects = {}
        if(trigger == this.colorSelect){
            this.skus.sort(this.sizeSort);
            smartSelects.trigger = this.colorSelect
            smartSelects.listener = this.sizeSelect;
            smartSelects.listenerTextKey = 'size';
            smartSelects.triggerTextKey = 'colorLabel';
            smartSelects.listenerValueKey = 'sku';
            smartSelects.listenerProductId = this.productId;
        } else {
            this.skus.sort(this.colorSort);
            smartSelects.trigger = this.sizeSelect
            smartSelects.listener = this.colorSelect;
            smartSelects.listenerTextKey = 'colorLabel';
            smartSelects.triggerTextKey = 'size';
            smartSelects.listenerValueKey = 'color';
            smartSelects.listenerProductId = "";
        }
        smartSelects.listenerCurrent = smartSelects.listener[$(smartSelects.listener).options.selectedIndex].text
        smartSelects.triggerCurrent = smartSelects.trigger[$(smartSelects.trigger).options.selectedIndex].text

        if(smartSelects.triggerCurrent == 'Size' || smartSelects.triggerCurrent == 'Color'){
            this.colorInit();
            this.sizeInit();
        } else {
            $(smartSelects.listener).length = 1;
            var count = 0;
            var currentIndex = 0;

            this.skus.each(function(elem){
                if(elem[smartSelects.triggerTextKey] == smartSelects.triggerCurrent){
                    var newOption = document.createElement('option');
                    newOption.text = elem[smartSelects.listenerTextKey]
                    newOption.value = elem[smartSelects.listenerValueKey];
                    if(smartSelects.listenerProductId!=""){
                        newOption.value = smartSelects.listenerProductId+"|"+newOption.value;
                    }
                    try {
                        $(smartSelects.listener).add(newOption, null);
                    } catch(ex) {
                        $(smartSelects.listener).add(newOption);
                    }
                    count += 1;
                    if(elem[smartSelects.listenerTextKey] == smartSelects.listenerCurrent){
                        currentIndex = count;
                    }
                }
            });
            $(smartSelects.listener).selectedIndex = currentIndex;
        }
        this.updateImage();
        this.updatePrice();
        this.updateState();
    },

    updatePrice: function(){
        var obj = this;
        var color = this.colorSelect[$(this.colorSelect).options.selectedIndex].text;
        var size = this.sizeSelect[$(this.sizeSelect).options.selectedIndex].text;

        var price = "";
        obj.isCartable = false;
        this.skus.each(function(elem){
            if(elem.colorLabel == color && elem.size == size){
                price = elem.price;
                obj.isCartable = true;
            }
        });
        if(price==""){
            price = this.defaultPriceVal;
        }
        if(price!=this.priceLabel.innerHTML){
            var priceAnim = new Df.Animate(this.priceLabel);
            priceAnim.run({time:400, opacity:0});

            priceAnim.observe(':complete', function(){
                obj.priceLabel.update(price);
                priceAnim.run({time:400, opacity:1});
            });
        }

        this.updateState();
    },

    updateImage: function(){
        var obj = this;
        var color = this.colorSelect[$(this.colorSelect).options.selectedIndex].text;
        var thumbnailImageURL = obj.element.select('dt a img')[0].src;
        var thumbnailImageChanged = false;
        this.skus.each(function(elem){
            if(elem.colorLabel == color && elem.thumbnailImageURL){
                thumbnailImageURL = elem.thumbnailImageURL;
                thumbnailImageChanged = true;
            }
        });

        if(thumbnailImageChanged){
            obj.element.select('dt a img')[0].src = thumbnailImageURL;
            /* Fade in/out animation - causing issues when color changed before animation completes */
            var imageAnim = new Df.Animate(obj.element.select('dt a img')[0]);
            imageAnim.run({time:40, opacity:0});

            imageAnim.observe(':complete', function(){
                obj.element.select('dt a img')[0].src = thumbnailImageURL;
                imageAnim.run({time:40, opacity:1});
            });
        }
    },

    updateState: function(){
        if(this.isCartable){
            this.isCartable = true;
            this.addToCartButton.className = 'addToCart';
            var color = this.colorSelect[$(this.colorSelect).options.selectedIndex].text;
            var size = this.sizeSelect[$(this.sizeSelect).options.selectedIndex].text;
            var skuValue = "";
            this.skus.each(function(elem){
                if(elem.colorLabel == color && elem.size == size){
                    skuValue = elem.sku;
                }
            });
            $(this.skuInputId).value = skuValue;
            this.addToCartButton.observe('click', function(){
                $(this.formName).submit();

            }.bind(this));
            new Df.Animate($(this.addToCartButton)).run({opacity:1, time:400});
        } else {
            this.isCartable = false;
            $(this.skuInputId).value = "";
            this.addToCartButton.className = 'addToCartDisabled';
            this.addToCartButton.href = 'javascript:void(0);';
            new Df.Animate($(this.addToCartButton)).run({opacity:.3, time:400});
        }
    },

    submitForm: function(){
        $(this.formName).submit();
    },

    colorSort: function(a,b){
        return (a.color < b.color) ? -1 : 1;
    },

    sizeSort: function(a,b){
        return (a.sizeIndex < b.sizeIndex) ? -1 : 1;
    },

    colorInit: function(){
        var currentValue = this.colorSelect[$(this.colorSelect).options.selectedIndex].text;
        this.skus.sort(this.colorSort);
        this.colorSelect.length = 1;
        var currentOption = "";
        var count = 0;
        var currentIndex = 0;
        var colorSelect = this.colorSelect;

        this.skus.each(function(elem){
            if(elem.colorLabel != currentOption){
                var newOption = document.createElement('option');
                newOption.text = elem.colorLabel;
                newOption.value = elem.color;
                try {
                    $(colorSelect).add(newOption, null);
                } catch(ex) {
                    $(colorSelect).add(newOption);
                }
                currentOption = elem.colorLabel;

                count += 1;
                if(currentValue == currentOption){
                    currentIndex = count;
                }
            }
        });
        $(this.colorSelect).selectedIndex = currentIndex;
    },

    sizeInit: function(){
        var currentValue = this.sizeSelect[$(this.sizeSelect).options.selectedIndex].text;
        this.skus.sort(this.sizeSort);
        this.sizeSelect.length = 1;
        var currentOption = "";
        var count = 0;
        var currentIndex = 0;
        var sizeSelect = this.sizeSelect;
        var thisProductId = this.productId;
        this.skus.each(function(elem){
            if(elem.size != currentOption){
                var newOption = document.createElement('option');
                newOption.text = elem.size;
                newOption.value = thisProductId+"|"+elem.sku;
                try {
                    $(sizeSelect).add(newOption, null);
                } catch(ex) {
                    $(sizeSelect).add(newOption);
                }
                currentOption = elem.size;

                count += 1;
                if(currentValue == currentOption){
                    currentIndex = count;
                }
            }
        });
        $(this.sizeSelect).selectedIndex = currentIndex;
    }
});
