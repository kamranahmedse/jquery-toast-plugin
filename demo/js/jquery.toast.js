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

		_positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left'],

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
			_toastEl.addClass( 'jq-toast-single' );

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
			 var _container = $('.jq-toast-wrap');
			 
			 if ( _container.length === 0 ) {
			 	_container = $('<div class="jq-toast-wrap"></div>');
			 	$('body').append( _container );
			 } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
			 	_container.empty();
			 }

			 _container.append( this.options.toastEl );

		  	if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {
		 	 	
		 	 	var _prevToastCount = _container.find('.jq-toast-single').length,
		 	 		_extToastCount = _prevToastCount - this.options.stack;

		 	 	if ( _extToastCount > 0 ) {
		  			$('.jq-toast-wrap').find('.jq-toast-single').slice(0, _extToastCount).remove();
		 	 	};

		  	}

		  	if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {
		  		_container.addClass( this.options.position );
		  	} else {
		  		_container.addClass( 'bottom-left' );
		  	}
		},
		animate: function () {
			this.options.toastEl.hide();
			if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
				this.options.toastEl.fadeIn();
			} else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
				this.options.toastEl.slideDown();
			} else {
				this.options.toastEl.show();
			}

			if ( ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) ) ) {

				var that = this;

				window.setTimeout(function(){
					
					if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
						that.options.toastEl.fadeOut();
					} else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
						that.options.toastEl.slideUp();
					} else {
						that.options.toastEl.hide();
					}

				}, this.options.hideAfter);
			};
		},
		reset: function () {
			$('.jq-toast-wrap').remove();
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
		text: '',
		heading: '',
		showHideTransition: 'fade',
		hideAfter: 2000,
		stack: 5,
		position: 'bottom-left'
	};

})( jQuery, window, document );