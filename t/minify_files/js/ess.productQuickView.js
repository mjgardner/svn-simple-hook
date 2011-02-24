ess.productQuickView = {
    instance: null,
    add: function(n){
        ess.productQuickView.instance.addController(new Df.Ui(n))
        n.observe('mouseover', function(e){
            ess.productQuickView.instance.pars.data = ess.productQuickView.template.evaluate(ess.productCollection[e.target.rel.replace('product-','')])
            ess.productQuickView.instance.element = e.target
            ess.productQuickView.instance._show(e)
            ess.productQuickView.instance.holder.fire(':position')
            if(ess.productQuickView.instance.holder.select('.esButton').length > 0){
                if(ess.productCollection[e.target.rel.replace('product-','')].expressShoppingEligible){
                    ess.productQuickView.instance.holder.select('.esButton')[0].show()
                }else{
                    ess.productQuickView.instance.holder.select('.esButton')[0].hide()
                }
            }
        });
    },
    template: new Template('\
        <img src="#{image}" \/>\
        <dl class="details">\
            <dt>#{title}<\/dt>\
            <dd>#{promo}<\/dd>\
            <dd>#{description}<\/dd>\
        <\/dl>')
}

document.observe('dom:loaded', function(e){
    ess.productQuickView.instance = new Df.NewTip({
        data: 'test',
        xOrientation: 'center',
        yOrientation: 'top',
        className: 'productViewTip',
        pointerOrientation: 'top',
        yOffsetPointer: -1,
        controller: []
    });
    $$('.productGrid .title a').map(ess.productQuickView.add)
});
