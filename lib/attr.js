(function($) {

  $.fn.attr = function(attr, value) {

	function set(el, attr, value) {
		el.setAttribute(attr, $.trim(value));
	}

	function get(el, attr) {
		return el.getAttribute(attr);
	}

	var r = this.map(function() {
    	if(value) {
			set(this, attr, value);
			return this;
    	} else if(typeof attr === 'object') {
    		Object.keys(attr).forEach(function(key) {
				set(this, key, attr[key]);
    		});
    		return this;
    	} else {
    		return get(this, attr);
    	}
	});
	return r[0];
  };

}(opQuery));
