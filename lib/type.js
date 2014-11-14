
(function($) {

  $.type = function(obj) {
      if (obj === null) {
          return "null";
      }
      else if (obj instanceof RegExp) {
          return 'regexp';
      }
      else if (obj instanceof Array) {
          return 'array';
      }
      else if (obj instanceof Date) {
          return 'date';
      }
      else if (obj instanceof Error) {
          return 'error';
      }
      else if (obj instanceof Boolean) {
          return 'boolean';
      }
      else if (obj instanceof Number) {
          return 'number';
      }
      else if (obj instanceof String) {
          return 'string';
      }
      return typeof obj;
  };

}(opQuery));
