;
// jQuery toast plugin created by Kamran Ahmed copyright MIT license 2015
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

        _positionClasses : ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
        _defaultIcons : ['success', 'error', 'info', 'warning'],

        init: function (options, elem) {
            this.prepareOptions(options, $.toast.options);
            this.process();
        },

        prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },

        process: function () {
            this.setup();
            this.addToDom();
            this.position();
            this.bindToast();
            this.animate();
        },

        setup: function () {
            
            var _toastContent = '',
            	hasDefinedStyle = false;
            
            this._toastEl = this._toastEl || $('<div></div>', {
                class : 'jq-toast-single'
            });

            if ( this.options.allowToastClose ) {
                _toastContent += '<span class="close-jq-toast-single">&times;</span>';
            };

            if ( this.options.heading ) {
                _toastContent +='<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
            };
            
            if ( this.options.text instanceof Array ) {

                _toastContent += '<ul class="jq-toast-ul">';
                for (var i = 0; i < this.options.text.length; i++) {
                    _toastContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
                }
                _toastContent += '</ul>';

            } else {
                _toastContent += this.options.text;
            }

            this._toastEl.html( _toastContent );

            if ( this.options.bgColor !== false ) {
                this._toastEl.css("background-color", this.options.bgColor);
            };

            if ( this.options.textColor !== false ) {
                this._toastEl.css("color", this.options.textColor);
            };

            if ( this.options.textAlign ) {
                this._toastEl.css('text-align', this.options.textAlign);
            }

        	// remove any current icons & styles
        	for (var i=0; i < this._defaultIcons.length; ++i) {
        		this._toastEl.removeClass('jq-icon-' + this._defaultIcons[i]);
        		this._toastEl.removeClass('jq-toast-style-' + this._defaultIcons[i]);
        	}
        	this._toastEl.removeClass('jq-toast-icon-top');
        	this._toastEl.removeClass('jq-has-icon');

            // style from option, overrides icon style
        	if (this.options.style) {
	            if ( $.inArray(this.options.style, this._defaultIcons) !== -1 ) {
	            	hasDefinedStyle = true;
	                this._toastEl.addClass('jq-toast-style-' + this.options.style);
	            }
	            // don't define any style if "default"
	            else if (this.options.style === 'default')
	            	hasDefinedStyle = true;
        	}
        	
            // icon
            if ( this.options.icon !== false ) {
            	this._toastEl.addClass('jq-has-icon');
            	
                if ( $.inArray(this.options.icon, this._defaultIcons) !== -1 ) {
                    this._toastEl.addClass('jq-icon-' + this.options.icon);
                    if (this.options.iconAlign === 'top')
                    	this._toastEl.addClass('jq-toast-icon-top');
                    // set style from icon if not already defined
                    if (!hasDefinedStyle)
                    	this._toastEl.addClass('jq-toast-style-' + this.options.icon);
                }
                else if (this.options.icon == 'spinner') {
                	this._toastEl.prepend('<div class="jq-icon-spinner"></div>');
                    // default to "info" style for spinner
                    if (!hasDefinedStyle)
                    	this._toastEl.addClass('jq-toast-style-info');
                }
                	
            }
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
                } else if ( this.options.position === 'mid-center' ) {
                    this._container.css({
                        left: ( $(window).outerWidth() / 2 ) - this._container.outerWidth()/2,
                        top: ( $(window).outerHeight() / 2 ) - this._container.outerHeight()/2
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

            // FIXME: hack! to middle-align the spinner icon which is an absolutely positioned element (must be done after adding to DOM)
            if (this.options.icon && this.options.icon === 'spinner' && this.options.iconAlign === 'middle') {
            	var $spinner = this._toastEl.find('div.jq-icon-spinner');
            	if ($spinner.length) {
            		this._toastEl.show();
            		$spinner.css('top', (this._toastEl.innerHeight() / 2 - $spinner.outerHeight() / 2) + "px");
            		this._toastEl.hide();
            	}
            }
        },

        bindToast: function () {

            var that = this;

            this._toastEl.on('afterShown', function () {
                that.processLoader();
            });

            this._toastEl.find('.close-jq-toast-single').on('click', function ( e ) {

                e.preventDefault();

                if( that.options.showHideTransition === 'fade') {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.fadeOut(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition === 'slide' ) {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.slideUp(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.hide(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                }
            });

            if ( typeof this.options.beforeShow == 'function' ) {
                this._toastEl.on('beforeShow', function () {
                    that.options.beforeShow();
                });
            };

            if ( typeof this.options.afterShown == 'function' ) {
                this._toastEl.on('afterShown', function () {
                    that.options.afterShown();
                });
            };

            if ( typeof this.options.beforeHide == 'function' ) {
                this._toastEl.on('beforeHide', function () {
                    that.options.beforeHide();
                });
            };

            if ( typeof this.options.afterHidden == 'function' ) {
                this._toastEl.on('afterHidden', function () {
                    that.options.afterHidden();
                });
            };          
        },

        addToDom: function () {

             var _container = $('.jq-toast-wrap');
             
             if ( _container.length === 0 ) {
                
                _container = $('<div></div>',{
                    class: "jq-toast-wrap"
                });

                $('body').append( _container );

             } else if ( !this.options.stack || isNaN( parseInt(this.options.stack, 10) ) ) {
                _container.empty();
             }

             _container.find('.jq-toast-single:hidden').remove();

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

        canAutoHide: function () {
            return ( this.options.hideAfter !== false ) && !isNaN( parseInt( this.options.hideAfter, 10 ) );
        },

        setupAutoHide : function() {
            if (!this.canAutoHide())
                return;

            var that = this;

            window.setTimeout(function(){
                
                if ( that.options.showHideTransition.toLowerCase() === 'fade' ) {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.fadeOut(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else if ( that.options.showHideTransition.toLowerCase() === 'slide' ) {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.slideUp(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                } else {
                    that._toastEl.trigger('beforeHide');
                    that._toastEl.hide(function () {
                        that._toastEl.trigger('afterHidden');
                    });
                }

            }, this.options.hideAfter);
        },
        
        processLoader: function () {
            // Show the loader only if auto-hide is on and loader is demanded
            if (!this.canAutoHide() || this.options.loader === false) {
                return;
            }

            // remove existing loader, if any (required to re-trigger animation on existing element)
            this._toastEl.find('.jq-toast-loader').remove();
            // define loader element
            var loader = $('<span class="jq-toast-loader"></span>');
            
            // 400 is the default time that jquery uses for fade/slide - 100ms for start delay
            var transitionTime = (this.options.hideAfter - 500) + 'ms';
            var style = '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + this.options.loaderBg + ';';

            loader.attr('style', style);
            this._toastEl.prepend(loader);
            // w/out this delay the transition doesn't fire upon toast.update()
            window.setTimeout(function() { loader.addClass('jq-toast-loaded'); }, 100);
        },

        animate: function () {

            var that = this;

            this._toastEl.hide();

            this._toastEl.trigger('beforeShow');

            if ( this.options.showHideTransition.toLowerCase() === 'fade' ) {
                this._toastEl.fadeIn(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else if ( this.options.showHideTransition.toLowerCase() === 'slide' ) {
                this._toastEl.slideDown(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            } else {
                this._toastEl.show(function ( ){
                    that._toastEl.trigger('afterShown');
                });
            }

            this.setupAutoHide();
        },

        reset: function ( resetWhat ) {

            if ( resetWhat === 'all' ) {
                $('.jq-toast-wrap').remove();
            } else {
                this._toastEl.remove();
            }

        },

        update: function(options) {
            this.prepareOptions(options, this.options);
            this.setup();
            this.bindToast();
            this.position();
            this.setupAutoHide();
//          this.processLoader();  // could do this insted of the trigger below
            this._toastEl.trigger('afterShown');
        }
    };
    
    $.toast = function(options) {
        var toast = Object.create(Toast);
        toast.init(options, this);

        return {
            
            reset: function ( what ) {
                toast.reset( what );
            },

            update: function( options ) {
                toast.update( options );
            }
        }
    };

    $.toast.options = {
        text: '',
        heading: '',
        showHideTransition: 'fade',	// 'fade', 'slide', or 'plain'
        allowToastClose: true,
        hideAfter: 3000,			// [ms]
        loader: true,				// the hideAfter time progress bar
        loaderBg: '#9EC600',
        stack: 5,
        position: 'bottom-left',	// 'bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'
        bgColor: false,
        textColor: false,
        textAlign: 'left',			// 'left', 'right', 'center'
        icon: false,				// 'info', 'success', 'warning', 'error'
        iconAlign: 'middle',		// 'middle', 'top'
        style: false,				// false to use icon style (if any), or one of the icon types ('info', etc), or 'default' to force default look
        beforeShow: function () {},
        afterShown: function () {},
        beforeHide: function () {},
        afterHidden: function () {}
    };

})( jQuery, window, document );
