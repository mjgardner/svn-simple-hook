if (Object.isUndefined(ess)) {
  var ess = {};
}

ess.sitemap = {};
ess.sitemap.showCategory = function(categoryId) {
    try {
        $$('.category-nav').invoke('removeClassName','active');
        $$('.lvl-1').invoke('addClassName','lvl-1-hidden');
    
        $$('#category-nav-'+categoryId).invoke('addClassName','active');
        $$('#category-content-'+categoryId).invoke('removeClassName','lvl-1-hidden');
    } catch(err) {}
};
