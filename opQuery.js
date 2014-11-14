(function(window) {

  function _forEach(items, fn) {
    var l = items.length - 1;
    while(l >= 0) {
      fn.call(items[l], items[l], l);
      l--;
    }
  }
  function _map(items, fn) {
    var l = items.length  - 1;
    var res = [];
    while(l >= 0) {
      res.push(fn.call(items[l], items[l], l));
      l--;
    }
    return res;
  }
  function _filter(items, fn) {
    var l = items.length  - 1;
    var res = [];
    while(l >= 0) {
      if(fn(items[l])) {
        res.push(fn.call(items[l], items[l], l));
      }
      l--;
    }
    return res;
  }

  var newQuery = function newQuery(nodes) {
    var o =  new opQuery(nodes);
    // o.elements = nodes;
    // var nodesArray = [].slice.call(nodes);
    o.length = nodes.length;
    o.each = function each(fn) {
      _forEach(nodes, fn);
    };
    o.map = function map(fn) {
      return _map(nodes, fn);
    };
    o.filter = function filter(fn) {
      return _filter(nodes, fn);
    };

    o.debug = function() {
      o.each(function() {
          console.log(this);
      });
    }
    return o;
  };

  function findNodes(root, selectors) {
    return flatten(selectors.split(',').map(function(selector) {
      return root.querySelectorAll(selectors);
    }));
  }

  function flatten(arr) {
    var merged = [];
    for(var i = 0; i < arr.length; i++) {
      for(var j = 0; j < arr[i].length; j++) {
        merged.push(arr[i][j]);
      }
    }
    return merged;
  }

function createHtml(html) {
  var el = document.createElement('div');
  el.innerHTML = html;
  var c = el.children[0];
  if(Array.isArray(c)) {
    return c;
  } else {
    return [c];
  }
}

  var opQuery = function opQuery(selectorOrNodes, context) {
    if(typeof selectorOrNodes === 'string') {
      if(selectorOrNodes.substr(0, 1) === '<') {
        return newQuery(createHtml(selectorOrNodes));
      }
      if(context) {
        var c = opQuery(context);
        var nodes = c.map(function(el) {
          return findNodes(el, selectorOrNodes); //el.querySelectorAll(selectorOrNodes);
        });
        var merged = flatten(nodes);
        return newQuery(merged);
      } else {
        return opQuery(findNodes(document, selectorOrNodes)); //document.querySelectorAll(selectorOrNodes));
      }
    } else {
      if (!(this instanceof opQuery)) {
        return newQuery(selectorOrNodes);
      }
    }
  };

  opQuery.fn = opQuery.prototype;

  window.opQuery = window.jQuery = window.$ = opQuery;

}(window));
