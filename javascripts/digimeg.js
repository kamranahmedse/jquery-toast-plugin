// TODO : Transformation to the modular structure

$(function(){

	///////////////////////////////////////////////
	// Mouse over event for the Main menu items //
	///////////////////////////////////////////////
	$('.digimeg-main-nav>li>a').on('mouseover', function (){

		// Get the subnav's ID from [data-subnav] attribute of the currently hovered menu item
		var navContentId = $(this).data('subnav');
		// Stop (in case the sub nav was sliding up) and slidedown
		$('#'+navContentId).stop().slideDown({ queue : false});	

		////////////////////////////////////////////////////////////////
		// show the little arrow on the currently hovered menu item //
		////////////////////////////////////////////////////////////////
		var $el = $(this);
		var mark = $el.find('.digimeg-active-mark');
		
		mark.css({
		   'left' : ($el.outerWidth()/2)-(mark.outerWidth()/2),
		   'top' : $el.outerHeight()
		}).show();
		////////////////////////////////////////////////////////////////

	});

	//////////////////////////////////////////////
	// Mouse out event for the Main menu items //
	//////////////////////////////////////////////
	$('.digimeg-main-nav>li>a').on('mouseout', function (){

		// Find the subnav's id from the [data-subnav] attribute of the currently hovered item
		var navContentId = $(this).data('subnav');
		// Stop ( in case the sub nav was sliding down ) and slide up
		$('#'+navContentId).stop().slideUp({ queue : false});	

		////////////////////////////////////////////////////////////////////////////////
		// Hide the active mark from the Menu item on which the event was triggered //
		////////////////////////////////////////////////////////////////////////////////
		var $el = $(this);
		var mark = $el.find('.digimeg-active-mark');
		
		mark.css({
		   'left' : ($el.outerWidth()/2)-(mark.outerWidth()/2),
		   'top' : 0
		}).hide();
		//////////////////////////////////////////////////////////////////////////////////
	});


	// Events to make the subnav's stay when they are being hovered over

	/////////////////////////////////////////////////
	// When the mouse is hovering over the subnav //
	/////////////////////////////////////////////////
	$('.digimeg-sub-nav>li').on('mouseover', function () {

		// Stop ( in case the subnav was sliding up) and slide down
		$(this).stop().slideDown({ queue : false});

	});

	/////////////////////////////////////////////////
	// When the mouse has moved out of the subnav //
	/////////////////////////////////////////////////
	$('.digimeg-sub-nav>li').on('mouseout', function (){
		// Stop ( in case the sub nav was sliding down ) and slide up
		$(this).stop().slideUp({ queue : false});
	});
	
});
