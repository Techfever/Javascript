<?php 
$uri = $parameter['newformuri'];
$form = str_replace('/', '_', $parameter['newformid']);
?>

$(document).ready(function() {	
	var actionRegister = "<?php echo $this->translate('text_register') ?>";
	var actionPreview = "<?php echo $this->translate('text_preview') ?>";
	var actionClear = "<?php echo $this->translate('text_clear') ?>";
	var actionCancel = "<?php echo $this->translate('text_cancel') ?>";

    $("form[id=<?php echo $form; ?>]").submit(function(e) {
        e.preventDefault();
        return false;
    });
	$("form[id=<?php echo $form; ?>] table[class=form]").find( "tr" ).each(
		function() {
			var id = $(this).attr('id');
			
			$(this).hover(
				function () {
					if (typeof id !== 'undefined' && id !== false) {
						if(id.toLowerCase().indexOf("seperator") < 0 && id.toLowerCase().indexOf("preview") < 0 && id.toLowerCase().indexOf("cancel") < 0 && id.toLowerCase().indexOf("submit") < 0){
						    $(this).addClass("Hover"); 
						}
					}
				}, 
				function () {
					if (typeof id !== 'undefined' && id !== false) {
						if(id.toLowerCase().indexOf("seperator") < 0 && id.toLowerCase().indexOf("preview") < 0&& id.toLowerCase().indexOf("cancel") < 0 && id.toLowerCase().indexOf("submit") < 0){
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
							uri: "<?php echo $this->url($uri, array('action' => 'Index')); ?>",
							form: "<?php echo $form; ?>",  
							data: $("form[id=<?php echo $form; ?>]").serialize(),  
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

	var addressCountrySelect = $("form[id=<?php echo $form; ?>] select[id=address_country_select]");
	var addressCountry = $("form[id=<?php echo $form; ?>] select[id=address_country]");
	var addressStateSelect = $("form[id=<?php echo $form; ?>] select[id=address_state_select]");
	var addressStateText = $("form[id=<?php echo $form; ?>] tr[id=address_state]");
	var addressState = $("form[id=<?php echo $form; ?>] input[id=address_state]");
	addressCountrySelect.change(
		function() {			
			if(addressCountrySelect.val() > 0){
				val = addressCountrySelect.find("option:selected").text()
				addressCountry.val(val);	
			}
			$.post("<?php echo $this->url('Ajax/Address', array('action' => 'getState')); ?>", {
				'country' : addressCountrySelect.val()
			}, function(JsonReturn) {
				addressStateSelect.prop('disabled', true);
				addressStateSelect.val("");
				addressStateText.hide();
				if (JsonReturn.success == 1) {										
					addressStateSelect.find('option').remove().end();
					$.each(JsonReturn.data, function (i, elem) {
						addressStateSelect.append($("<option></option>").attr("value",elem.id).text(elem.value)); 
					});
					if (JsonReturn.valid == "0") {
						addressStateSelect.val("0");
						addressStateText.show();
					}else{
						addressStateSelect.prop('disabled', false);
					}
				}
			}, 'json');

			return false;
		}
	);

	addressStateSelect.change(
		function() {	
			addressStateText.hide();
			var id = addressStateSelect.val();
			addressState.val("");
			if(id == 0){
				addressStateText.show();
			}else{				
				val = addressStateSelect.find("option:selected").text()
				addressState.val(val);
			}

			return false;
		}
	);

	var bankNameSelect = $("form[id=<?php echo $form; ?>] select[id=bank_name_select]");
	var bankNameText = $("form[id=<?php echo $form; ?>] tr[id=bank_name]");
	var bankName = $("form[id=<?php echo $form; ?>] input[id=bank_name]");
	var bankCountrySelect = $("form[id=<?php echo $form; ?>] select[id=bank_country_select]");
	var bankCountry = $("form[id=<?php echo $form; ?>] select[id=bank_country]");
	var bankStateSelect = $("form[id=<?php echo $form; ?>] select[id=bank_state_select]");
	var bankStateText = $("form[id=<?php echo $form; ?>] tr[id=bank_state]");
	var bankState = $("form[id=<?php echo $form; ?>] input[id=bank_state]");
	var bankBranchSelect = $("form[id=<?php echo $form; ?>] select[id=bank_branch_select]");
	var bankBranchText = $("form[id=<?php echo $form; ?>] tr[id=bank_branch]");
	var bankBranch = $("form[id=<?php echo $form; ?>] input[id=bank_branch]");

	bankNameSelect.change(
		function() {	
			bankNameText.hide();
			bankCountrySelect.prop('disabled', true);
			bankCountrySelect.val("");
			bankStateSelect.prop('disabled', true);
			bankStateSelect.val("");
			bankStateText.hide();
			bankBranchSelect.val("");
			bankBranchText.hide();
			var id = bankNameSelect.val()
			if(id >= 0 && id != ""){
				bankCountrySelect.prop('disabled', false);
				bankName.val("");
				if(id == 0){
					bankNameText.show();
				}else{				
					val = bankNameSelect.find("option:selected").text()
					bankName.val(val);
				}
			}

			return false;
		}
	);

	bankCountrySelect.change(
		function() {		
			if(bankCountrySelect.val() > 0){
				val = bankCountrySelect.find("option:selected").text()
				bankCountry.val(val);
			}
			$.post("<?php echo $this->url('Ajax/Bank', array('action' => 'getState')); ?>", {
				'country' : bankCountrySelect.val()
			}, function(JsonReturn) {
				bankStateSelect.prop('disabled', true);
				bankStateSelect.val("");
				bankStateText.hide();
				bankBranchSelect.val("");
				bankBranchText.hide();
				if (JsonReturn.success == 1) {
					bankStateSelect.find('option').remove().end();
					$.each(JsonReturn.data, function (i, elem) {
						bankStateSelect.append($("<option></option>").attr("value",elem.id).text(elem.value)); 
					});
					if (JsonReturn.valid == "0") {
						bankStateSelect.val("0");
						bankStateText.show();
					}else{
						bankStateSelect.prop('disabled', false);
					}
				}
			}, 'json');

			return false;
		}
	);

	bankStateSelect.change(
		function() {	
			bankStateText.hide();
			var id = bankStateSelect.val()
			if(id == 0){
				bankState.val("");
				bankStateText.show();
				bankBranchSelect.prop('disabled', true);
				bankBranchSelect.val("0");
				bankBranchText.show();
			} else if(id > 0){
				val = bankStateSelect.find("option:selected").text()
				bankState.val(val);
				$.post("<?php echo $this->url('Ajax/Bank', array('action' => 'getBranch')); ?>", {
					'country' : bankCountrySelect.val(),
					'state' : bankStateSelect.val(),
					'bank' : bankNameSelect.val()
				}, function(JsonReturn) {
					bankBranchSelect.prop('disabled', true);
					bankBranchSelect.val("");
					bankBranchText.hide();
					if (JsonReturn.success == 1) {
						bankBranchSelect.find('option').remove().end();

						$.each(JsonReturn.data, function (i, elem) {
							bankBranchSelect.append($("<option></option>").attr("value",elem.id).text(elem.value)); 
						});
						if (JsonReturn.valid == "0") {
							bankBranchSelect.val("0");
							bankBranchText.show();
						}else{
							bankBranchSelect.prop('disabled', false);
						}
					}
				}, 'json');
			}

			return false;
		}
	);

	bankBranchSelect.change(
		function() {	
			bankBranchText.hide();
			var id = bankBranchSelect.val()
			bankBranch.val("");
			if(id == 0){
				bankBranchText.show();
			}else{
				val = bankBranchSelect.find("option:selected").text()
				bankBranch.val(val);
			}

			return false;
		}
	);

	$("form[id=<?php echo $form; ?>] button[id=preview]").click(
		function() {
			var subaction = $("form[id=<?php echo $form; ?>] input[id=subaction]").val();
			if(subaction == "preview"){	            
			    $(this).formPreview({  
					uri: "<?php echo $this->url($uri, array('action' => 'Index')); ?>",  
					form: "<?php echo $form; ?>",  
					data: $("form[id=<?php echo $form; ?>]").serialize(),
					callback: function() {
				    	$("form[id=<?php echo $form; ?>] button[id=preview]").html(actionRegister);
						$("form[id=<?php echo $form; ?>] input[id=subaction]").val('register');
						$("form[id=<?php echo $form; ?>] button[id=cancel]").html(actionCancel);
		            },
			    });
			}else if(subaction == "register"){
			    $(this).formSubmit({  
					uri: "<?php echo $this->url($uri, array('action' => 'Index')); ?>",  
					form: "<?php echo $form; ?>",  
					data: $("form[id=<?php echo $form; ?>]").serialize(),
					title: "<?php echo $this->translate('text_dialog_user_register_title') ?>",  
					message: "<?php echo $this->translate('text_dialog_user_register_content') ?>",
					failcallback: function(){
						$(this).formCancel({  
							form: "<?php echo $form; ?>",  
							callback: function() {
				                $("form[id=<?php echo $form; ?>] button[id=preview]").html(actionPreview);
								$("form[id=<?php echo $form; ?>] input[id=subaction]").val('preview');
								$("form[id=<?php echo $form; ?>] button[id=cancel]").html(actionClear);
				            },
			            });
					},
			    });
			}
		}
	);

	$("form[id=<?php echo $form; ?>] button[id=cancel]").click(
		function() {
			var subaction = $("form[id=<?php echo $form; ?>] input[id=subaction]").val();
			if(subaction == "register"){
	            $(this).formCancel({  
					form: "<?php echo $form; ?>",  
					callback: function() {
		                $("form[id=<?php echo $form; ?>] button[id=preview]").html(actionPreview);
						$("form[id=<?php echo $form; ?>] input[id=subaction]").val('preview');
						$("form[id=<?php echo $form; ?>] button[id=cancel]").html(actionClear);
		            },
	            });
			}else if(subaction == "preview"){
	            $(this).formClear({  
					form: "<?php echo $form; ?>",  
					callback: function() {
		                $("form[id=<?php echo $form; ?>] button[id=preview]").html(actionPreview);
						$("form[id=<?php echo $form; ?>] input[id=subaction]").val('preview');
						$("form[id=<?php echo $form; ?>] button[id=cancel]").html(actionClear);
		            },
	            });
			}
		}
	);
});