/* 
 * IMPORTANT:
 * Keep CSS styles below synced with styles in helvetia-neue-condensed.css 
 */
if (window.addEventListener) {
    window.addEventListener('load',function(){
        var tagname = '#sign-up p, #sign-up-success span, #sign-up-success a,h1, .aside h2, .aside h3, #featured h3, #header-search label,#nav-category li a, #nav-category a.sale, #top-category #sidebar .side-nav a.sale, .size-guide p.h1, .account h2, .account h3, .cart h2, #nav-checkout li, #forgot-password legend, .checkout h2, .checkout h3, #account-login h2, #receipt #sidebar h3, h4.shipBucket span.shippingTo, #account-main h2, #ins1 h3, .total-items, h2.subtitle, #wishlist #no-items-in-wishlist';
        var face = 'HelveticaNeue Condensed';
        if (!document.supportsFont(face)) {
            document.applyFont(tagname, face);
        }
    },false);
}

