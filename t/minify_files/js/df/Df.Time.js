Object.extend(Number.prototype, {
    
    toTime: function(){
        if(this < 1000){
            return  { milliseconds : this}	
        }
        else if (this < 1000 * 60) {
            return {
                seconds: Math.floor(this/1000),
                milliseconds : this%1000
            }
        }
        else if (this < 1000 * 60 * 60) {
            return {
                minutes : Math.floor(this/(1000 * 60)),
                seconds: Math.floor((this%(1000 * 60))/1000),
                milliseconds : (this%(1000 * 60))%1000
            }
        }
        else if (this < 1000 * 60 * 60 * 24) {
            return {
                hours : Math.floor(this/(1000 * 60 * 60)),
                minutes : Math.floor((this%(1000 * 60 * 60))/(1000 * 60)),
                seconds : Math.floor((this%(1000 * 60))/1000),
                milliseconds : (this%(1000 * 60))%1000
            }
        }
        else if (this < 1000 * 60 * 60 * 24 * 365) {
            return {
                days : Math.floor(this/(1000 * 60 * 60 * 24)),
                hours : Math.floor((this%(1000 * 60 * 60))/(1000 * 60 * 24)),
                minutes: Math.floor((this%(1000 * 60 * 60))/(1000 * 60)),
                seconds : Math.floor((this%(1000 * 60))/1000),
                milliseconds : (this%(1000 * 60))%1000
            }
        }
        else {
            return {
                years : Math.floor(this/(1000 * 60 * 60 * 24 * 365)),
                days : Math.floor((this%(1000 * 60 * 60))/(1000 * 60 * 24 * 365)),
                hours : Math.floor((this%(1000 * 60 * 60))/(1000 * 60 * 24)),
                minutes : Math.floor((this%(1000 * 60 * 60))/(1000 * 60)),
                seconds : Math.floor((this%(1000 * 60))/1000),
                milliseconds : (this%(1000 * 60))%1000
            }
        }
    }
}