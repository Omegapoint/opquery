(function($) {

  $.trim = function(string) {
      if (string === undefined || string === null) {
          return "";
      }
      string = "" + string;

      function isSpace(c) {
          return c === ' ' || c === '\xA0' || c === '\uFEFF';

      }
      for (var start = 0; start < string.length; start++) {
          if (!isSpace(string[start])) {
              break;
          }
      }
      for (var end = string.length; end > 0; end--) {
          if (!isSpace(string[end-1])) {
              break;
          }
      }
      return string.substr(start, end - start);
  };

}(opQuery));
