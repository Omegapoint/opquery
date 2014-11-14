(function($) {

  $.fn.count = function() {
    var num = 0;
    this.each(function() {
      num++;
    });
    return num;
  };

}(opQuery));
