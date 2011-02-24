/**
 *@author Brad Hurley
 *
 *@constructor
 *
 *@type Df.Table
 *@version 1.1
 *@requires Df Df
 */
Df.Table = function(){
	return this;
}

/**
 *@param table {element Node} unlimited number of table nodes
 */
Df.Table.matchCellHeights = function(){
	for(var i=0; i<arguments.length; i++){
		for(var j=0; j<arguments[i].getElementsByTagName('tr').length; j++){
			var thisHeight = parseInt(arguments[i].getElementsByTagName('tr')[j].getElementsByTagName('td')[0].offsetHeight)
			
			if(arguments[i+1]){
				var nextHeight = parseInt(arguments[i+1].getElementsByTagName('tr')[j].getElementsByTagName('td')[0].offsetHeight)
			
				if(nextHeight>thisHeight){
					arguments[i].getElementsByTagName('tr')[j].getElementsByTagName('td')[0].style.height = nextHeight + 'px'
				}else if(nextHeight<thisHeight){
					arguments[i+1].getElementsByTagName('tr')[j].getElementsByTagName('td')[0].style.height = thisHeight + 'px'
				}
			}
		}
	}
}