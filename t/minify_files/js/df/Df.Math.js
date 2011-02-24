
Object.extend(Number.prototype, {
    
    factorial: function(){
        function f(i){
            if(i > 0){
                sum *= i
                f(--i)
            }
        }
        
        var sum = 1
        f(this)
        return sum
    },
    
    permutations: function(set){
        return (this.factorial()/(this - set).factorial())
    },
    
    combinations: function(set){
        return (this.permutations(set)/(set).factorial())
    }
})

Object.extend(Array.prototype,{
  
    distribute: function(pars){ 
        var _this = this
        var l = _this.length
        var labels = []
        var s = 0
        var e = l
        if(pars && pars.start)
            s = pars.start
        if(pars && pars.end)
            e = pars.end
        var p = 0
        s = $A($R(0, s))
        
        function walk() {
            if( s[s.length-1] < l ){
                var label = s.collect(function(v){return _this[v] })
                
                if(!labels.any(function(v){ return v.inspect() == label.inspect()}))
                    labels.push( label )
                s[s.length-1]++
                walk()
            } else {
                ++s[p]
                for (var i=1; i<(s.length - p); i++){
                    s[p+i] = s[p+i-1] + 1
                }
                if (s[p] < l) {
                    walk()
                } else {
                    s = $A($R(0, s.length-1))
                    ++p
                    if(p < s.length){
                        walk()
                    } else {
                        s.push(0)
                        if(s.length <= l && s.length <= e){
                            s = $A($R(0, s.length-1))
                            p = 0
                            walk()
                        }
                    }
                }
            }
        }
        walk()
        return labels
    }
});