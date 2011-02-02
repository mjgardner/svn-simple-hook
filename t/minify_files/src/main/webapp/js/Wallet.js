// JavaScript Document
Wallet = function(walletJSONObject) {
	this.selectedCardId = walletJSONObject.selectedCardId;
	this.cards = 	walletJSONObject.cards;
	this.updateListeners = [];
	
	this.addUpdateListener = function(listener) {
		this.updateListeners.push(listener);
	}
	
	this.setSelectedCardId = function(selectedCardId) {
		this.selectedCardId = selectedCardId;
		this.fireUpdateEvent();
	}
	
	this.getSelectedCard = function() {
		return this.getCard(this.selectedCardId);
	}
	
	this.fireUpdateEvent = function() {
		for(var i=0;i<this.updateListeners.length;i++) {
			this.updateListeners[i].observeWalletUpdate(this);
		}
	}
	
	this.getCard = function(cardId) {
		for(var i=0;i<this.cards.length;i++) {
			if(this.cards[i].id==cardId) {
				return this.cards[i];
			}
		}
		return null;
	}
	this.getSelectedCard = function() {
		return this.getCard(this.selectedCardId);
	}
	
}