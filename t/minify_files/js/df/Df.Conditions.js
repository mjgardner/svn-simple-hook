/*
 ref:		Df.Conditions
 note:		this is a mixin for native javascript object types
 note:		adds ruby style conditionals
 returns:	Object
 type:		Static Class
 example:	<script type="text/javascript">
			var s = 'wertew'.df_if(1==10).df_else('erwr')
			alert(s)
		</script>
 example:	<script type="text/javascript">
			var s = 'rrr'.df_unless(1==1).df_else('ttt')
			alert(s)
		</script>
 example:	<script type="text/javascript">
			var s = $A([
				'rrr'.df_if(10==1),
				'sss'.df_if(1==10),
				'fff'
			]).detect(function(v){return v})
			
			alert(s)
		</script>
*/
Df.Conditions = {
	/*
	 ref:		Df.Conditions.df_if
	 hint:		use as a mixin
	 hint:		not to be used in its staic form
	 returns:	this|false
	 type:		Static Method
	 arg:		Expression condition
	*/
	df_if: function(condition){
		if(condition){
			if(this.constructor && this.constructor == Function){
				return this()
			} else {
				return this
			}
		} else {
			return false
		}
	},
	/*
	 ref:		Df.Conditions.df_unless
	 hint:		use as a mixin
	 hint:		not to be used in its staic form
	 returns:	this|false
	 type:		Static Method
	 arg:		Expression condition
	*/
	df_unless: function(condition){
		if(condition){
			return false
		} else {
			if(this.constructor && this.constructor == Function){
				return this()
			} else {
				return this
			}
		}
	},
	/*
	 ref:		Df.Conditions.df_else
	 hint:		use as a mixin
	 hint:		not to be used in its staic form
	 returns:	this|false
	 type:		Static Method
	 arg:		Object a 
	*/
	df_else: function(a){
		if(this == false){	
			if(a.constructor && a.constructor == Function){
				return a()
			} else {
				return a
			}
		} else {
			if(this.constructor && this.constructor == Function){
				return this()
			} else {
				return this
			}
		}
	}
}
/*
 ref:		Df.Conditions.df_then
 hint:		use as a mixin
 hint:		not to be used in its staic form
 returns:	this|false
 type:		Static Method
 arg:		Object a 
*/
Df.Conditions.df_then = Df.Conditions.df_else

/*
 ref:		Number.df_if
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Number.df_unless
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Number.df_else
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
/*
 ref:		Number.df_then
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
Object.extend(Number.prototype, Df.Conditions)

/*
 ref:		String.df_if
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		String.df_unless
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		String.df_else
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
/*
 ref:		String.df_then
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
Object.extend(String.prototype, Df.Conditions)

/*
 ref:		Array.df_if
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Array.df_unless
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Array.df_else
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
/*
 ref:		Array.df_then
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
Object.extend(Array.prototype, Df.Conditions)

/*
 ref:		Boolean
 returns:	Boolean
 type:		Class
*/
/*
 ref:		Boolean.df_if
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Boolean.df_unless
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Boolean.df_else
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
/*
 ref:		Boolean.df_then
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
Object.extend(Boolean.prototype, Df.Conditions)

/*
 ref:		Function
 returns:	Function
 type:		Class
*/
/*
 ref:		Function.df_if
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Function.df_unless
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Function.df_else
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
/*
 ref:		Function.df_then
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
Object.extend(Function.prototype, Df.Conditions)

/*
 ref:		Hash.df_if
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Hash.df_unless
 returns:	this|false
 type:		Method
 arg:		Expression condition
*/
/*
 ref:		Hash.df_else
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
/*
 ref:		Hash.df_then
 returns:	this|false
 type:		Method
 arg:		Object a 
*/
Object.extend(Hash.prototype, Df.Conditions)
