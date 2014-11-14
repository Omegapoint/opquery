



(function($) {

  $.fn.removeClass = function(cls) {
    this.each(function() {
    	var el = this;
    	if(cls) {
	    	cls.split(" ").forEach(function(c) {
				el.classList.remove(c);
	    	});
    	} else {
    		el.className = '';
    	}
    });
    return this;
  };

}(opQuery));
