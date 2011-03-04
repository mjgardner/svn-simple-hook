$(document).observe('dom:loaded', function(e){
	if ( $('add-to-cart') ) {
		$('add-to-cart').observe( 'click', function(e) {
			e.stop();
			Store.productsAdded = $F('quantity');
			if ( ess.validateProduct() ) {
				parent.modal.loading();
				$(parent.document.body).fire( ':addItemToCart', { cartAddSrc: "PCSD",
					products: [ {
						productId: $F('productId'),
						skuId: $F('skuId'),
						quantity: Store.productsAdded
					}],
					onOpen: function(args) {
						//resize and close modal
						parent.document.body.scrollTo();
						parent.modal.loaded();
/*						parent.modal.resize( { width: '250px', height: '100px', onComplete: function() {
							parent.modal.sensitive(true);
							parent.modal.setData( new Element( 'p', { className: 'quick-add-added' } ).update( "Thank you. Items have been added to your cart." ) );
						}});
*/						parent.modal.close();
					}
				});
			}
		});
	}
});