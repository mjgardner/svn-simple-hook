if('object'!=typeof(ess))var ess={};

ess.Product = function(productJSONObject) {
	this.p = productJSONObject;
	
	this.colorId = "";
	this.skuId = "";
	this.quantity = 0;
	this.colorChangeListeners = new Array();
	this.viewChangeListeners = new Array();
	this.qtyChangeListeners = new Array();
	this.skuChangeListeners = new Array();
	this.viewIndex = 0;
	this.currentView = this;
	this.currentColorSlice = null;

	this.addColorChangeListener = function(listener) {
		this.colorChangeListeners[this.colorChangeListeners.length] = listener;
	};
	this.addQtyChangeListener = function(listener) {
		this.qtyChangeListeners[this.qtyChangeListeners.length] = listener;
	};
	this.addSkuChangeListener = function(listener) {
		this.skuChangeListeners[this.skuChangeListeners.length] = listener;
	};
	this.addViewChangeListener = function(listener) {
		this.viewChangeListeners[this.viewChangeListeners.length] = listener;
	};
	
	this.flipButton=function(opts){
		if('object'!=typeof(opts))return false;
		switch(opts.action){
			case 'enable':
				$(opts.id).removeClassName(opts.dClass);
				$(opts.id).addClassName(opts.aClass);
				$(opts.id).disabled=false;
			break;
			
			default:
			case 'disable':
				$(opts.id).removeClassName(opts.aClass);
				$(opts.id).addClassName(opts.dClass);
				$(opts.id).disabled=true;
			break;
		}	
	};
	
	this.changeColor = function(colorId) {
		this.colorId = colorId;
		//this should be updated to select the correct sku id
		this.currentColorSliceValue = null;
		var currentStlyeCode = null;
		for (var i = 0; i < this.p.colorSliceValues.length; i++) {
			if (this.p.colorSliceValues[i].colorId == this.colorId) {
				this.currentColorSliceValue = this.p.colorSliceValues[i];
				//this.currentStlyeCode = this.currentColorSliceValue.availableSkuStyleCodes[i];	
				break;
			}
		}

		for (var c = 0; c < this.p.skus.length; c++) {
			if (this.p.skus[c].colorId == this.colorId) {
				this.currentStlyeCode = this.p.skus[c].jdaStyle;
				break;
			}
		}

		this.changeSku(this.getCurrentColorSliceValue().availableSkuIds[0]);

		this.changeView(0);
		for (var i = 0; i < this.colorChangeListeners.length; i++) {
			this.colorChangeListeners[i].observeProductColorChange(this);
		}
		if($('color-txt'))$('color-txt').update(this.currentStlyeCode);
		styleCode = $('color-txt').innerHTML;
		styleCode = styleCode.split('#');
		/*if (styleCode!='') this.currentStlyeCode = styleCode[1];*/
		if($('color-txt')){
			$('color-txt').update(this.currentColorSliceValue.colorName);
			$('style-txt').update(this.currentStlyeCode);
		}
		};
	this.changeSku = function(skuId) {
		this.skuId = skuId;
		for (var i = 0; i < this.skuChangeListeners.length; i++) {
			this.skuChangeListeners[i].observeProductSkuChange(this);
		}
	};
	this.changeView = function(viewIndex) {
		this.viewIndex = viewIndex;
		if('object'==typeof(video)&&'function'==typeof(video.close))video.close();
		if (viewIndex == 0 && this.getCurrentColorSliceValue() == null) {
			this.currentView = this;
		} else {
			this.currentView = null;
			if (this.getCurrentColorSliceValue() != null) {
				if (viewIndex == 0) {
					this.currentView = this.getCurrentColorSliceValue();
				} else {
					if (this.getCurrentColorSliceValue().alternateViews.length>viewIndex - 1) {
						this.currentView =  this.getCurrentColorSliceValue().alternateViews[viewIndex - 1];
					} else if (this.getCurrentColorSliceValue().alternateViews.length > 0) {
						this.currentView = this.getCurrentColorSliceValue().alternateViews[0];
					}
				}
			}

			if (this.currentView == null) {
				if (this.p.alternateViews.length>viewIndex-1) {
					this.currentView = this.p.alternateViews[viewIndex-1];
				} else if (this.p.alternateViews.length>0) {
					this.currentView = this.p.alternateViews[0];
				} else {
					this.currentView = this;
				}
			}
		}
		for (var i = 0; i < this.viewChangeListeners.length; i++) {
			this.viewChangeListeners[i].observeProductViewChange(this);
		}
	};
	this.getAvailableSizes = function() {
		var sizes = new Array();
		if (this.colorId != "") {
			var skus = this.getCurrentColorSliceValue().availableSkuIds;
			for (var i = 0; i < skus.length; i++) {
				sizes[i] = this.getSkuById(skus[i]).size;
			}
		}
		return sizes;
	};
	this.getCurrentColorSliceValue = function() {
		return this.currentColorSliceValue;
	};
	this.getCurrentView = function() {
		return this.currentView;	
	};
	this.getSkuById = function(id) {
		for (var i = 0; i < this.p.skus.length; i++) {
			if (this.p.skus[i].sku_id == id) {
				return this.p.skus[i];
			}
		}
		return null;
	};
	this.setQuantity = function(qty) {
		this.quantity = qty;
		for (var i=0; i < this.qtyChangeListeners.length; i++) {
			this.qtyChangeListeners[i].observeProductQtyChange(this);
		}
	};
};
