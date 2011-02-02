(function(){

    // set a requester instance
    Df.AnalyticsLibrary.setRequest(
        new Df.AnalyticsRequest('/analytics/eventListener')
    );

    //register undefined page view listener
    $(document).observe('pv:undefined-page-view', Df.AnalyticsLibrary.UndefinedPageView)

    //register email signup listener
    $(document).observe('em:signup', Df.AnalyticsLibrary.EmailSignup)

    // register view large image
    $(document).observe('pr:view-large-image', Df.AnalyticsLibrary.ProductViewLargeImage)

    // register express shop add to cart
    $(document).observe('es:product-add-to-cart', Df.AnalyticsLibrary.ExpressShopAddToCart)

    // register express shop edit in cart
    $(document).observe('es:product-edit-in-cart', Df.AnalyticsLibrary.ExpressShopEditInCart)

    // register Express Shop Product View Initial
    $(document).observe('es:product-view-initial', Df.AnalyticsLibrary.ExpressShopProductViewInitial)

    // register Express Shop Product View next
    $(document).observe('es:product-view-next', Df.AnalyticsLibrary.ExpressShopProductViewNext)

    // register Express Shop Product View cross sell
    $(document).observe('es:product-view-cross-sell', Df.AnalyticsLibrary.ExpressShopProductViewCrossSell)

    // register Minicart View Request
    $(document).observe('mc:cart-view', Df.AnalyticsLibrary.MiniCartViewCart)

    // register Minicart Product View
    $(document).observe('mc:product-view', Df.AnalyticsLibrary.MiniCartProductView)

    // register Minicart Product Remove
    $(document).observe('mc:product-remove', Df.AnalyticsLibrary.MiniCartProductRemove)

    // register Minicart Crossell View
    $(document).observe('mc:product-view-cross-sell', Df.AnalyticsLibrary.MiniCartViewCrossSell)

    // register Minicart CrossSell add
    $(document).observe('mc:product-add-cross-sell', Df.AnalyticsLibrary.MiniCartAddCrossSell)

    // register Store Locator Search
    $(document).observe('sl:store-locator-search', Df.AnalyticsLibrary.StoreLocatorSearch)

    // register Store Locator Store Select
    $(document).observe('sl:store-locator-store-select', Df.AnalyticsLibrary.StoreLocatorStoreSelect)

    // register Account Creation Complete
    $(document).observe('am:account-creation-complete', Df.AnalyticsLibrary.AccountCreationComplete)

})();
