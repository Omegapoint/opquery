(function($) {

  $.fn.get = function(index) {
    if (index === undefined) {
		var reversed = [];
		var list = this.map(function(el) {
			return el;
		});
		for (var i = 0, j = list.length; j > 0; j--, i++) {
			reversed[i] = list[j - 1];
		}
		return reversed;
	} else {
		return this[index];
	}
};

}(opQuery));