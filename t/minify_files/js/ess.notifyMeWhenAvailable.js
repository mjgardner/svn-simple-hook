/** Notify Me When Available */
var NotifyMeWhenAvailable = Class.create({
	initialize: function(container, signUpLink, notifyMePath) {
		this.container = container;
		this.signUpLink = signUpLink;
		this.notifyMePath = notifyMePath;
		this.addToCart = null;

		// Include reCAPTCHA AJAX API
		this.includeJsFile("http://api.recaptcha.net/js/recaptcha_ajax.js");
	},

	/* Set sku change listener to toggle NMWA feature. Typically, only required on product page. */
	setSkuChangeListener: function() {
		this.observeProductSkuChange = this.displayLink.bind(this);
		ess.product.addSkuChangeListener(this);
	},

	/* Set sign-up link/button event listener */
	setSignUpLink: function() {
		this.signUpLink.observe("click", function(e){
			Event.stop(e);

			this.show(this.container);
			this.hide(this.signUpLink);

			this.updatePanel(ess.product.p.productId, ess.product.skuId);

			return false;
		}.bind(this));
	},

	/* Show or hide NMWA link/button depending on eligibility of current sku */
	displayLink: function(product) {
		var nmwaSku = product.getSkuById(product.skuId);

		// FOR TESTING PURPOSES ONLY -- TODO: Comment out or remove for production
		//nmwaSku.avail = "NOT_AVAILABLE";
		//nmwaSku.eligibleForNMWA = true;

		if (nmwaSku.eligibleForNMWA) {
			this.show(this.signUpLink);
			if (this.addToCart != null) {
				this.hide(this.addToCart);
			}
		} else {
			this.hide(this.signUpLink);
			this.hide(this.container);
			if (this.addToCart != null) {
				this.addToCart.setStyle({display: 'inline'});
			}
		}
	},

	/* Update the NMWA panel */
	updatePanel: function(productId, skuId) {
		if (!$('nmwa-signup')) {
			var params = null;

			if (skuId === undefined) {
				params = { productId: productId, skuId: '0' };
			} else {
				params = { productId: productId, skuId: skuId };
			}

			new Ajax.Updater('nmwa-panel', this.notifyMePath, {
				  parameters: params,
				  method: 'get',
				  onCreate: this.showLoader($('nmwa-panel')),
				  onComplete: this.setSignUpForm.bind(this)
			});
		}
	},

	/* Load and display NMWA form upon sign-up request */
	setSignUpForm: function() {
		if ($('nmwa-signup')) {
			$('nmwa-submit').observe("click", function(e) {
				Event.stop(e);
				new Ajax.Updater('nmwa-panel', this.notifyMePath, {
					parameters: $('nmwa-signup-form').serialize(true),
					method: 'post',
					onCreate: this.showLoader($('nmwa-panel')),
					onComplete: this.setConfirmation.bind(this)
				});
				return false;
			}.bind(this));

			$('nmwa-cancel').observe("click", function(n) {
				this.hide(this.container);
				this.show(this.signUpLink);
				return false;
			}.bind(this));

			// Create reCAPTCHA area
			Recaptcha.create($("recaptcha-public-key").value, "recaptcha-container", {
			   theme: "red",
			   lang: $("recaptcha-lang").value,
			   callback: Recaptcha.focus_response_field
			});
		}
	},

	/* Load and display confirmation content after NMWA form was submitted */
	setConfirmation: function() {
		if ($('nmwa-success')) {
			$('nmwa-close').observe("click", function(e) {
				Event.stop(e);
				this.hide(this.container);
				this.show(this.signUpLink);
				return false;
			}.bind(this));
		} else if ($('nmwa-signup-form')) {
			// in case of error the sign-up form is returned again and listeners have to be reapplied
			this.setSignUpForm();
		}
	},

	/* Position and show the NMWA container relative to the anchor element */
	positionAndShow: function(anchor, productId) {
		this.container.setStyle({
			display: 'block',
			position: 'absolute',
			width: '315px',
			border: '2px solid #333',
			zIndex: '555'
		});
		this.container.clonePosition(anchor, {setWidth: false, setHeight: false, offsetLeft: -100, offsetTop: -15});
		this.updatePanel(productId);
	},

	/* Include an external JavaScript file */
	includeJsFile: function(src) {
		var base = document.getElementsByTagName("base")[0];
		var includeBase = base ? base.href : "";
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement("script");

		script.src = src.match(/^\//) ? src : includeBase + src;
		script.type = "text/javascript";
		script.language = "javascript";

		head.appendChild(script);
		return script;
	},

	/* Show loader image in given element */
	showLoader: function(e) {
		e.update('<div class="loader">Loading...</div>');
	},

	/* Hide element */
	hide: function(e) {
		if (e != null) {
			e.setStyle({display : 'none'});
		}
	},

	/* Show element (as block) */
	show: function(e) {
		if (e != null) {
			e.setStyle({display: 'block'});
		}
	}
});
