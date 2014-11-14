

(function($) {

  $.fn.hasClass = function(cls) {
  	var ret = true;
  	this.each(function() {
  		ret = ret && this.classList.contains(cls);
  	});
  	return ret;
  };

}(opQuery));
