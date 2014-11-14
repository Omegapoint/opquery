

(function($) {


  $.fn.text = function() {
    return this.map(function() {
    	return this.innerText;
    });
  };

}(opQuery));
