<?php 
$searchuri = $parameter['searchformuri'];
$searchform = str_replace('/', '_', $parameter['searchformid']);
$updateform = str_replace('/', '_', $parameter['updateformid']);
?>

$(document).ready(function() {	
	var actionSearch = "<?php echo $this->translate('text_search') ?>";
	var actionCancel = "<?php echo $this->translate('text_cancel') ?>";
	
    $("form[id=<?php echo $searchform; ?>]").submit(function(e) {
        e.preventDefault();
        return false;
    });

	var flashmessage = $("div[id=flashmessager]");
	var searchButton = $("form[id=<?php echo $searchform; ?>] button[id=search]");
	var searchInput = $("form[id=<?php echo $searchform; ?>] input[id=search_username]");
	var messageDiv = $("td[class=help] div[class=ui-widget] div[class=ui-state-active]");
	var formDiv = $("div[class=content] div[class=form]");
	searchButton.click(
		function() {			
			flashmessage.html("");
			messageDiv.html("");
			formDiv.html("");
			formDiv.hide();
			searchInput.prop('disabled', false);
			if(searchButton.html() == 'Cancel'){
				searchInput.val("");
				searchButton.html(actionSearch);
	            $(this).formClear({  
					form: "<?php echo $updateform; ?>",  
	            });
				$(this).JSONAjax("<?php echo $this->url($searchuri, array('action' => 'Search')); ?>", $("form[id=<?php echo $searchform; ?>]").serialize());
			}else if(searchButton.html() == 'Search'){
				$(this).JSONAjax("<?php echo $this->url($searchuri, array('action' => 'Search')); ?>", $("form[id=<?php echo $searchform; ?>]").serialize(), function(JsonReturn) {
					if(JsonReturn.valid == true){
						formDiv.html(JsonReturn.inputmodel);

						if(formDiv){
							formDiv.show();
						}
						searchInput.prop('disabled', true);
						searchButton.html(actionCancel);
						if(JsonReturn.js){
							eval(JsonReturn.js);
						}
					}else{
						if(JsonReturn.messages){
							if(messageDiv){
								messageDiv.html('<span class="ui-icon ui-icon-alert"></span>' + JsonReturn.messages);
							}
						}
					}
				});
			}
		}
	);
});