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

		_positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center'],

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
			this._toastEl = _toastEl;
		},
		process: function () {
			this.setup();
			this.addToDom();
			this.position();
			this.animate();
		},
		position: function () {
			if ( ( typeof this.options.position === 'string' ) && ( $.inArray( this.options.position, this._positionClasses) !== -1 ) ) {

				if ( this.options.position === 'bottom-center' ) {
					this._container.css({
					    left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
					    bottom: 20
					});
				} else if ( this.options.position === 'top-center' ) {
					this._container.css({
					    left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
					    top: 20
					});
				} else {
					this._container.addClass( this.options.position );
				}

			} else if ( typeof this.options.position === 'object' ) {
				this._container.css({
					top : this.options.position.top ? this.options.position.top : 'auto',
					bottom : this.options.position.bottom ? this.options.position.bottom : 'auto',
					left : this.options.position.left ? this.options.position.left : 'auto',
					right : this.options.position.right ? this.options.position.right : 'auto'
				});
			} else {
				this._container.addClass( 'bottom-left' );
			}
		},
		addToDom: function () {
			 var _container = $('.jq-toast-wrap');
			 
			 if ( _container.length === 0 ) {
			 	_container = $('<div class="jq-toast-wrap"></div>');
			 	$('body').append( _container );
			 } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
			 	_container.empty();
			 }

			 _container.append( this._toastEl );

		  	if ( this.options.stack && !isNaN( parseInt( this.options.stack ), 10 ) ) {
		 	 	
		 	 	var _prevToastCount = _container.find('.jq-toast-single').length,
		 	 		_extToastCount = _prevToastCount - this.options.stack;

		 	 	if ( _extToastCount > 0 ) {
		  			$('.jq-toast-wrap').find('.jq-toast-single').slice(0, _extToastCount).remove();
		 	 	};

		  	}

		  	this._container = _container;
		},
		animate: function () {
			this._toastEl.hide();
			if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
				this._toastEl.fadeIn();
			} else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
				this._toastEl.slideDown();
			} else {
				this._toastEl.show();
			}

			if ( ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) ) ) {

				var that = this;

				window.setTimeout(function(){
					
					if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
						that._toastEl.fadeOut();
					} else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
						that._toastEl.slideUp();
					} else {
						that._toastEl.hide();
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