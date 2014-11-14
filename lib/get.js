(function($) {

  $.fn.get = function(index) {
    return this.map(function(el) {
      return el;
    });
  };

}(opQuery));
