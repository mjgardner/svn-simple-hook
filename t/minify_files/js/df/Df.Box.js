/*
 -ref		Element.box
 -returns	Df.Box
 -delegate	Df.Box
 -type		Method
 -arg		Object pars
 -example	<script type="text/javascript">
			$('xxx').box();
		</script>
*/
Element.addMethods({
	box: function(element,para){
		return new Df.Box($(element), para);
	}
});

/*
 -ref		Df.Box
 -type		Class
 -extends	Df.Element
 -returns	Df.Box
*/
Df.Box = Class.create(Df.Element, {
	
	initialize: function($super, element, pars){
		$super(element, pars)
		
		this.wrapper;
		
		this.build();
		
		return this;
	},
	
	_initPars: function($super, pars){
		$super()
		this.setPars ({
			sides: {
				top:true,
				right:true,
				bottom:true,
				left:true
			},
			classNames: {
				holder: 'box',
				topLeft: 'tl',
				top: 't',
				topRight: 'tr',
				left: 'l',
				center: 'c',
				right: 'r',
				bottomLeft: 'bl',
				bottom: 'b',
				bottomRight: 'br'
			}
		});
		this.setPars(pars)
	},
	
	/*
	 -ref		Df.Box.getWrapper
	 -type		Method
	 -note		returns table element
	 -returns	Element
	*/
	getWrapper: function(){
		return this.wrapper;
	},

	/** @private */
	build: function() {
		var tbl = document.createElement('table');
		tbl.className = this.pars.classNames.holder;
		tbl.cellSpacing = 0;
		tbl.cellPadding = 0;
		var tbody = document.createElement('tbody');
		tbl.appendChild(tbody);
		
		var tr;
		var td;
		
		//top row
		if (this.pars.sides.top) {
			tr = document.createElement('tr');
			
			if (this.pars.sides.left) {
				td = document.createElement('td');
				td.className = this.pars.classNames.topLeft;
				tr.appendChild(td);
			}
			
			td = document.createElement('td');
			td.className = this.pars.classNames.top;
			tr.appendChild(td);
			
			if (this.pars.sides.right) {
				td = document.createElement('td');
				td.className = this.pars.classNames.topRight;
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		
		//center row
		tr = document.createElement('tr');
		if (this.pars.sides.left) {
			td = document.createElement('td');
			td.className = this.pars.classNames.left;
			tr.appendChild(td);
		}
		td = document.createElement('td');
		td.className = this.pars.classNames.center;
		
		//add content
		td.appendChild(this.element.setStyle({display:"block", visibility:"visible"}));
		tr.appendChild(td)
		
		if(this.pars.sides.right){
			td = document.createElement('td');
			td.className = this.pars.classNames.right;
			tr.appendChild(td);
		}
		tbody.appendChild(tr)
		
		//bottom row
		if (this.pars.sides.bottom) {
			tr = document.createElement('tr');
			if (this.pars.sides.left) {
				td = document.createElement('td');
				td.className = this.pars.classNames.bottomLeft;
				tr.appendChild(td);
			}
			td = document.createElement('td');
			
			td.className = this.pars.classNames.bottom;
			tr.appendChild(td);
			
			if (this.pars.sides.right) {
				td = document.createElement('td');
				td.className = this.pars.classNames.bottomRight;
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		
		this.wrapper = tbl;
	}
});