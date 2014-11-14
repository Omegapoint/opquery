

(function($) {

  $.fn.addClass = function(cls) {
    return this.each(function() {
    	this.classList.add(cls);
    });
  };

}(opQuery));
