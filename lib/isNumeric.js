
(function($) {

  $.isNumeric = function(obj) {
      if (typeof obj === 'number' && !isNaN(obj) && isFinite(obj)) {
          return true;
      }
      else if (typeof obj === 'string') {
          if (obj.match(/^-?[0-9]+((\.|e-?)[0-9]+)?$/)) {
              return true;
          }
          if (obj.match(/^0x[0-9a-fA-F]+$/)) {
              return true;
          }
      }
      if (obj && obj.hasOwnProperty('toString')) {
          return $.isNumeric(obj.toString());
      }
      return false;
  };

}(opQuery));
