document.observe('dom:loaded', function(e){
    
    if(ess.totalProducts && ess.productsPerPages && ess.totalProducts > ess.productsPerPages){
        
        /*
        $$('.pagination').each(function(v){
            v.setStyle({
                display: 'none'
            })
        });
        */
        
        var containerWidth = parseInt($('products').offsetWidth)
        var cols = Math.floor(containerWidth/parseInt($('products').down('li').offsetWidth))
        
        var productCollection = new Df.DocumentScroll($('products'), {
            rows: Math.ceil(ess.totalProducts/cols),
            rowHeight: $('products').down('li').getHeight(),
            colWidth: containerWidth,
            useCache: false,
            onCreateCell: function(node, row, col){
                
                node.addClassName('df_loading')
                
                var url = location.href
                
                if(url.match(/page=/)){
                    url = url.replace(/&page=[0-9]+/, '')
                }
                if(url.match(/size=/)){
                    url = url.replace(/&size=[0-9]+/, '')
                }
                url += '&page=' + row + '&template=partial&size=' + cols
                
                new Ajax.Request(url, {
                    method: 'get',
                    evalJS: 'force',
                    onComplete: function(x){
                        this.removeClassName('df_loading')
                        
                        this.update(x.responseText)
                        
                        x.responseText.match(/rel="product-([0-9]+?)"/g).each(function(v){
                            ess.productQuickView.add($$('#products div a['+ v +']')[0])
                        })
                    
                    }.bind(node)
                })
            }
        })
    } 
})