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
			this.process();
		},
		setup: function () {

			var _toastEl = $('<div></div>'),
				_toastContent = '';
			_toastEl.addClass( this.options.toastClass );

			if ( this.options.text instanceof Array ) {

				if ( this.options.heading ) {
					_toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
				};

				_toastContent += '<ul class="jq-toast-ul">';
				for (var i = 0; i < this.options.text.length; i++) {
					_toastContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
				}
				_toastContent += '</ul>';

			} else {
				if ( this.options.heading ) {
					_toastContent ='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
				};
				_toastContent += this.options.text;
			}

			_toastEl.html( _toastContent );
			this.options.toastEl = _toastEl;
		},
		process: function () {
			this.setup();
			this.addToDom();
			this.animate();
		},
		addToDom: function () {
			 var _container = $('.'+ this.options.containerClass);
			 
			 if ( _container.length === 0 ) {
			 	_container = $('<div class="' + this.options.containerClass + '"></div>');
			 	$('body').append( _container );
			 }

			 _container.append( this.options.toastEl );

		  	if ( this.options.maxToasts && !isNaN( parseInt( this.options.maxToasts ), 10 ) ) {
		 	 	
		 	 	var _prevToastCount = _container.find('.' + this.options.toastClass).length,
		 	 		_extToastCount = _prevToastCount - this.options.maxToasts;

		 	 	if ( _extToastCount > 0 ) {
		  			$('.' + this.options.containerClass).find('.' + this.options.toastClass).slice(0, _extToastCount).remove();
		 	 	};

		  	};
		},
		animate: function () {
			this.options.toastEl.hide();
			if ( this.options.transition.toLowerCase() === 'fade' ) {
				this.options.toastEl.fadeIn();
			} else if ( this.options.transition.toLowerCase() === 'slide' ) {
				this.options.toastEl.slideDown();
			} else {
				this.options.toastEl.show();
			}
		},
		reset: function () {
			$('.' + this.options.containerClass).remove();
		}
	};
	
	$.toast = function(options) {
		var toast = Object.create(Toast);
		toast.init(options, this);

		return {
			reset : function () {
				toast.reset();
			}
		}
	};

	$.toast.options = {
		text: 'Default text to be shown for the toast.',
		heading: '',
		containerClass: 'jq-toast-wrap',
		toastClass: 'jq-toast-single',
		transition: 'fade',
		maxToasts: 5
	};

})( jQuery, window, document );