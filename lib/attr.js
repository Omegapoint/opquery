(function($) {

  $.fn.attr = function(attr, value) {
    if(value || typeof attr === 'object') {
      return this;
    }
    return '';
  };

}(opQuery));
