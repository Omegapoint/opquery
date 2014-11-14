

(function($) {

  $.fn.contents = function() {
    var children = this.map(function() {
		return this.children[0];
    });
    return $(children);
  };

}(opQuery));
