//add element methods
/*
 -ref		Element.documentScroll
 -returns	Df.DocumentScroll
 -delegate	Df.DocumentScroll
 -type		Method
 -arg		Object pars
 -example	<script type="text/javascript">
			$('xxx').documentScroll();
		</script>
*/
Element.addMethods({
	documentScroll: function(element, pars){
		return new Df.DocumentScroll($(element), pars)
	}
});

/*
 -ref		Df.DocumentScroll
 -type		Class
 -extends	Df.Ui
 -returns	Df.DocumentScroll
*/
Df.DocumentScroll = Class.create(Df.Ui, {
	initialize: function($super, element, pars){
		
		$super(element, pars)
		
		this.__scrollEvent = this.scrollAction.bind(this)
		
		this.cellsToShow = []
		this.cellCache = {}
		
		this.cellHeight
		this.cellWidth
		
		this.enable()
		
		this.adjustToContent()
		
		return this
	},
	
	enable: function(){
		Event.observe(window, 'scroll', this.__scrollEvent)
	},
	
	disable: function(){
		Event.stopObserving(window, 'scroll', this.__scrollEvent)
	},
	
	_initPars: function($super, pars){
		$super()
		this.setPars({
			rowsOverlap: 2,
			colsOverlap: 2,
			delay: 100,
			rowHeight: 100,
			colWidth: false,
			rows: 50,
			cols: 1,
			useCache: true,
			onCreateCell: function(node, row, col){
				if((row%2 && col%2) || (row%2 == 0 && col%2 == 0)){
					node.setStyle({backgroundColor:'#cccccc'})
				}
				node.update(row + ' _ ' + col)
			}
		});
		this.setPars(pars)
	},
	
	adjustToContent: function(e){
		
		this.clearCells()
	
		if(this.pars.rowHeight){
			this.cellHeight = this.pars.rowHeight
			this.element.setStyle({height: (this.pars.rows * this.cellHeight ) + 'px'})
		} else {
			this.cellHeight = parseInt(this.element.getStyle('height'))
			this.element.setStyle({height: this.cellHeight + 'px'})
		}
		
		if(this.pars.colWidth){
			this.cellWidth = this.pars.colWidth
			this.element.setStyle({width: (this.pars.cols * this.cellWidth ) + 'px'})
		} else {
			this.cellWidth = parseInt(this.element.getStyle('width'))
			this.element.setStyle({width: this.cellWidth + 'px'})
		}
		
		this.scrollAction()
	},
	
	clearCells: function(){
		loopie:
		for(p in this.cellCache){
			this.element.childElements().each(function(n){
				n.remove()
			})
			this.cellCache = {}
			this.cellsToShow = []
			break loopie
		}
	},   
       
	scrollAction: function(e){
	    var t = setTimeout(
		this.changePageLogic.bind(this, this.element.viewportOffset()),
		this.pars.delay
	    )
	},
    
	changePageLogic: function(oldScroll){
		var oh = this.element.viewportOffset()
		var vh = document.viewport.getDimensions()
		if(
		   oh[1] == oldScroll[1] && oh[0] == oldScroll[0] &&
		   (oh[1] < vh.height) &&
		   (oh[0] < vh.width)
		){
			var rowsInView = Math.ceil(((-oh[1] + vh.height).toMax(this.element.getHeight()) - ((-oh[1]).toMin(0))) / this.pars.rowHeight)
			var colsInView = Math.ceil(((-oh[0] + vh.width).toMax(this.element.getWidth()) - ((-oh[0]).toMin(0))) / this.pars.colWidth)
			
			var rowTop = parseInt(((-oh[1]).toMin(0)) / this.pars.rowHeight) + 1
			var rowLeft = parseInt(((-oh[0]).toMin(0)) / this.pars.colWidth) + 1 
			
			var rows = $A($R(
				(rowTop - this.pars.rowsOverlap).toRange(1, this.pars.rows),
				(rowTop - 1 + rowsInView + this.pars.rowsOverlap).toRange(1, this.pars.rows)
			))
			
			var cols = $A($R(
				(rowLeft - this.pars.colsOverlap).toRange(1, this.pars.cols),
				(rowLeft - 1 + colsInView + this.pars.colsOverlap).toRange(1, this.pars.cols)
			))
			
			var newCellsToShow = []
		    
			for(var i=0; i<rows.length; i++){
				for(var j=0; j<cols.length; j++){
					newCellsToShow.push([rows[i],cols[j]])
				}	
			}
			
			if(Object.toJSON(this.cellsToShow) != Object.toJSON(newCellsToShow)){
				
				if(this.pars.useCache){
					var dropCells = []
					for(var i=0; i<this.cellsToShow.length; i++){
						if(!newCellsToShow.any(function(a){return Object.toJSON(a) == Object.toJSON(this)}.bind(this.cellsToShow[i])))
							dropCells.push(this.cellsToShow[i])
					}
					if(dropCells.length > 0){
						this.dropCells(dropCells)
					}
				}
				
				var addCells = []
				for(var i=0; i<newCellsToShow.length; i++){
					if(!this.cellsToShow.include(function(a){return Object.toJSON(a) == Object.toJSON(this)}.bind(newCellsToShow[i])))
						if(this.pars.useCache || (!this.pars.useCache && !(this.cellCache[(newCellsToShow[i][0] + '_' + newCellsToShow[i][1])]))){
							addCells.push(newCellsToShow[i])
						}
				}
				if(addCells.length > 0){
					this.addCells(addCells)
				}
				
				this.cellsToShow = newCellsToShow 
				this.element.fire(':page', {cellsInView: this.newCellsToShow})
			}
	    }
	},
    
	dropCells: function(dropCells){
	    dropCells.each(function(v){
		    this.cellCache[(v[0]+'_'+v[1])].remove()
	    }.bind(this))
	    
	    this.element.fire(':dropCells', {cells: dropCells})
	},
    
	addCells: function(addCells){
	    
	    addCells.each(function(v){
		    
		    if(this.cellCache[(v[0]+'_'+v[1])]){
			    this.element.insert(this.cellCache[(v[0]+'_'+v[1])])
		    } else {
			    
			    this.cellCache[(v[0]+'_'+v[1])] = this.element.e('div', 'bottom').setStyle({
				    position: 'absolute',
				    left: ((v[1]-1) * this.cellWidth) + 'px',
				    top: ((v[0]-1) * this.cellHeight) + 'px',
				    height: this.cellHeight + 'px',
				    width: this.cellWidth + 'px'
			    })
			    
			    if(this.pars.onCreateCell){
				    this.pars.onCreateCell(this.cellCache[(v[0]+'_'+v[1])], v[0], v[1])
			    }
			    
			    this.element.fire(':createCell', {cell: this.cellCache[(v[0]+'_'+v[1])], row: v[0], col: v[1]})
		    }
	    
	    }.bind(this))
	    
	    this.element.fire(':addCells', {cells: addCells})
	}
});