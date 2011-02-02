// JavaScript Document
AddressBook = function(abJSONObject) {
  this.billingAddressId = abJSONObject.billingAddressId;
  this.shippingAddressId = abJSONObject.shippingAddressId;
  this.addresses = 	abJSONObject.addresses;
  this.billingAddressUpdateListeners = [];
  this.shippingAddressUpdateListeners = [];
  this.updateListeners = [];
  this.multiShipTo = abJSONObject.multiShipTo;
  if(abJSONObject.preferredBillingAddressId)
	  this.preferredBillingAddressId = abJSONObject.preferredBillingAddressId;
  if(abJSONObject.preferredShippingAddressId)
	  this.preferredShippingAddressId = abJSONObject.preferredShippingAddressId;

  this.addBillingAddressUpdateListener = function(listener) {
    this.billingAddressUpdateListeners.push(listener);
  }
  this.addShippingAddressUpdateListener = function(listener) {
    this.shippingAddressUpdateListeners.push(listener);
  }

  this.addUpdateListener = function(listener) {
    this.updateListeners.push(listener);
  }

  this.setMultiShipTo = function(multiShipTo) {
    this.multiShipTo = multiShipTo;
  }
  this.setBillingAddressId = function(addressId) {
    this.billingAddressId = addressId;
    for(var i=0;i<this.billingAddressUpdateListeners.length;i++) {
      this.billingAddressUpdateListeners[i].observeBillingAddressUpdate(this);
    }
    this.updated();
  }
  this.setShippingAddressId = function(addressId) {
    this.shippingAddressId = addressId;
    for(var i=0;i<this.shippingAddressUpdateListeners.length;i++) {
      this.shippingAddressUpdateListeners[i].observeShippingAddressUpdate(this);
    }
    this.updated();
  }
  this.updated = function() {
    for(var i=0;i<this.updateListeners.length;i++) {
      this.updateListeners[i].observeAddressBookUpdate(this);
    }
  }

  this.getAddress = function(addressId) {
    for(var i=0;i<this.addresses.length;i++) {
      if(this.addresses[i].id==addressId) {
        return this.addresses[i];
      }
    }
    return null;
  }

}

Address = function(aJSONObject) {
  this.addresses = 	aJSONObject.addresses;
  this.getAddress = function(addressId) {
    for(var i=0;i<this.addresses.length;i++) {
      if(this.addresses[i].id==addressId) {
        return this.addresses[i];
      }
    }
    return null;
  }

}
