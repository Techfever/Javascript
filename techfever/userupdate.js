<?php 
$updateuri = $parameter['updateformuri'];
$updateform = str_replace('/', '_', $parameter['updateformid']);
?>

$(document).ready(function($) {	
	$.fn.UserUpdate = function() { 
		var actionUpdate = "<?php echo $this->translate('text_update') ?>";
		var actionPreview = "<?php echo $this->translate('text_preview') ?>";
		var actionClear = "<?php echo $this->translate('text_clear') ?>";
		var actionCancel = "<?php echo $this->translate('text_cancel') ?>";

	    $("form[id=<?php echo $updateform; ?>]").submit(function(e) {
	        e.preventDefault();
	        return false;
	    });
		$("form[id=<?php echo $updateform; ?>] table[class=form]").find( "tr" ).each(
			function() {
				var id = $(this).attr('id');
				
				$(this).hover(
					function () {
						if (typeof id !== 'undefined' && id !== false) {
							if(id.toLowerCase().indexOf("seperator") < 0 && id.toLowerCase().indexOf("action") < 0 && id.toLowerCase().indexOf("cancel") < 0 && id.toLowerCase().indexOf("submit") < 0){
							    $(this).addClass("Hover"); 
							}
						}
					}, 
					function () {
						if (typeof id !== 'undefined' && id !== false) {
							if(id.toLowerCase().indexOf("seperator") < 0 && id.toLowerCase().indexOf("action") < 0&& id.toLowerCase().indexOf("cancel") < 0 && id.toLowerCase().indexOf("submit") < 0){
							    $(this).removeClass("Hover");
							}
						}
					}
				);
		
				$(this).find( ':input' ).not(':button, :submit, :reset').each(
					function() {					
						$(this).focus(function() {  
						    $(this).addClass("Focus");  
						});  
						
						$(this).focusout(function() {
						    $(this).removeClass("Focus");
						    $(this).formValidator({  
								uri: "<?php echo $this->url($updateuri, array('action' => 'Update')); ?>",
								form: "<?php echo $updateform; ?>",  
								data: $("form[id=<?php echo $updateform; ?>]").serialize(),  
								values: '&Input=' + id,
						    });
							return false;
						}); 
					}
				);
		
				$(this).find( 'div[id=radio]' ).each(
					function() {				
						$(this).buttonset();
					}
				);
				 
				$(this).find( '.tooltip' ).each(
					function() {
						$(this).tooltip({
							position: {
								my: 'left top-20', 
								at: 'right+8 bottom'
							},
							content: function () {
					            return $(this).prop('title');
					        },  	
					        open: function( event, ui ) {
					            setTimeout(function(){
					                $(ui.tooltip).hide('fade');
					            }, 10000);
					        },
							tooltipClass: 'right'
						});
					}
				);
			}
		);

		$("form[id=<?php echo $updateform; ?>] button[id=update]").click(
			function() {
			    $(this).formSubmit({  
					uri: "<?php echo $this->url($updateuri, array('action' => 'Update')); ?>",  
					form: "<?php echo $updateform; ?>",  
					data: $("form[id=<?php echo $updateform; ?>]").serialize() + '&subaction=submit',
					title: "<?php echo $this->translate('text_dialog_user_update_status_title') ?>",  
					message: "<?php echo $this->translate('text_dialog_user_update_status_content') ?>",
					failcallback: function(){
						searchInput.val("");
						searchButton.html("<?php echo $this->translate('text_search') ?>");
			            $(this).formClear({  
							form: "<?php echo $updateform; ?>",  
			            });
					},
			    });
			}
		);

		$("form[id=<?php echo $updateform; ?>] button[id=clear]").click(
			function() {
	            $(this).formClear({  
					form: "<?php echo $updateform; ?>",  
	            });
			}
		);
	}
});