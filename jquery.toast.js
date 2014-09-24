;
// jQuery toast plugin created by Kamran Ahmed copyright MIT license 2014
// v0.1
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}
(function( $, window, document, undefined ) {
	"use strict";
	var Toast = {
		init: function (options, elem) {
			var _options = {};
			if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
				_options.text = options;
			} else {
				_options = options;
			}

			this.options = $.extend( {}, $.toast.options, _options );
			this.processToast();
		},
		setup: function () {

			var _toastEl = $('<div></div>');
			_toastEl.addClass( this.options.toastClass );

			if ( this.options.text instanceof Array ) {
				var listContent = '<ul class="jq-toast-ul">';
				for (var i = 0; i < this.options.text.length; i++) {
					listContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
				}
				listContent += '</ul>';
				_toastEl.html( listContent );
			} else {
				_toastEl.html( this.options.text );
			}

			this.options.toastEl = _toastEl;
		},
		processToast: function () {
			this.setup();
			this.showToast();
		},
		showToast: function () {
			 var _container = $('.'+ this.options.containerClass);
			 
			 if ( _container.length === 0 ) {
			 	_container = $('<div class="' + this.options.containerClass + '"></div>');
			 	$('body').append( _container );
			 } 

			 _container.append( this.options.toastEl );
		},
		reset: function () {
			$('.' + this.options.containerClass).remove();
		}
	};
	
	$.toast = function(options) {
		var toast = Object.create(Toast);
		toast.init(options, this);
	};

	$.toast.options = {
		text: 'Default text to be shown for the toast.',
		containerClass: 'jq-toast-wrap',
		toastClass: 'jq-toast-single'
	};

})( jQuery, window, document );