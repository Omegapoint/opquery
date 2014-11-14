
(function($) {

  function setHtml(content) {
    return function(node) {
      node.innerHTML = content;
    };
  }
  function getHtml() {
    return function(node) {
      return node.innerHTML;
    };
  }

  $.fn.html = function(content) {
    if(content) {
      return this.each(setHtml(content));
    } else {
      return this.map(getHtml());
    }
  };
}(opQuery));
