

(function($) {

  $.fn.addClass = function(cls) {
    this.each(function() {
		var el = this;
    	cls.split(" ").forEach(function(c) {
			el.classList.add(c);
    	});
    });
    return this;
  };

}(opQuery));
