// ******************************************************************************


// IF $( document ).ready HAS TO BE USED, CHANGE THE FUNCTION BELOW, DON'T CREATE ANOTHER, 
// AND DON'T MESS TO MUCH WITH IT, BECAUSE IT WILL FUCK UP THE WHOLE SYSTEM.


// ******************************************************************************


// Get the data for the Load Qh file to run add and/or remove hours and days
$(function() {
	var pathname = window.location.pathname.split("/");
	if (pathname['2'] == 'new-qh') {
		//get deleted elements
		var id_error = $('.has-error').prop('id');
		var children_error = $('.has-error').children();
		var flag_error = 0;
		var remove = [];
		$.each(children_error, function(index,item) {
			if (flag_error == 0) {
				remove.push({id: item.parentElement.id});
				flag_error++;
			}else{
				flag_error = 0;
			}
		});
		$('#remove_qh').val(JSON.stringify(remove));
		// get added elements
		var id = $('.has-success').prop('id');
		var children = $('.has-success').children();
		var flag = 0;
		var add = [];
		$.each(children, function(index,item) {
			if (flag == 0) {
				add.push({id: item.parentElement.id, hour:item.value, journey:item.nextElementSibling.innerHTML});
				flag++;
			}else{
				flag = 0;
			}
		});
		$('#add_qh').val(JSON.stringify(add));
	}
});

$('#paralysed').submit(function (e){
	var ini = $('#ini_date_paralysed').val();
	var end = $('#end_date_paralysed').val();
		if (Date.parse(ini) > Date.parse(end)){
			$('#end_date_paralysed').popover({
				title : 'Erro: Data de fim anterior a de inicio',
				placement: 'bottom',
			});
			$('#end_date_paralysed').on('shown.bs.popover', function(){
				setTimeout(function(){
					$('#end_date_paralysed').popover('hide');
				}, 3000);
				})
			$('#end_date_paralysed').popover('show');
			e.preventDefault();	// previne que seja submetido os dados
			}else{
				var diff = (((Date.parse(end)-(Date.parse(ini)))/(24*60*60*1000)).toFixed(0));
				$('#diff_period').val(diff);
				// $('#diff_period').prop('type', 'text');
				// $('#l_diff_period').show();
		return true;
		}
});

$('#myTab a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});

$(document).ready(function(){
	$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
	$('#plate').mask("aaa 9999");
	  $('.datepicker').datepicker({
    language: 'pt-BR',
    autoclose: true,
    format: 'dd/mm/yyyy'
  });
  $(".dateMask").mask("99/99/9999");
  $("#phone").mask("(99) 9999-9999"); 
  $(".hour").mask("99:99"); 
  $('.help').tooltip();
});

$('.consortium').change(function(){
	$.getJSON('/api/consortium-companies/id/'+this.value, { }, function(data){
		$('.consortium_company').empty();
		$('.consortium_company').append("<option value='0'> -- Selecione uma célula operacional -- </option>");
		$.each(data, function(index,item) {
			$('.consortium_company').append("<option value=" + item.id + ">" + item.name + "</option>");
		});
	});
});

$('#consortiumTransfer').change(function(){
	// console.log($('#cuconscomp').val());
	$.getJSON('/api/consortium-companies-name/id/'+this.value, { }, function(data){
		$('.consortium_company').empty();
		$('.consortium_company').append("<option value=''> -- Selecione uma empresa -- </option>");
		$.each(data, function(index,item) {
			if($('#cuconscomp').val() != item.id){ 
			$('.consortium_company').append("<option value=" + item.id + ">" + item.name + "</option>");
		    }
		});
	});
});

$('#consotiumOption').change(function(){
	$.getJSON('/api/consortium-companies/id/'+this.value, { }, function(data){
		$('#cellOption').empty();
		$('#cellOption').append("<option value='0'> -- Selecione uma célula operacional -- </option>");
		$.each(data, function(index,item) {
			$('#cellOption').append("<option value=" + item.id + ">" + item.name + "</option>");
		});
	});
});

$("#consotiumOption").focusout(function(){
var teste2 = $("#consotiumOption option:selected").text(); 	
$('#consotiumName').val(teste2);	
})

$("#cellOption").focusout(function(){
var teste = $("#cellOption option:selected").text(); 	
$('#cellOptionName').val(teste);	
})

$('#submitMCO').click(function(){
	$("#barProgressMCO").show();
	$("#formMCO").hide();
});


function addHour(hour){
	$('#qhour_'+hour).append('<div class="row"><input type="text" class="hourMask" name="qh_'+hour+'[]" id="qh_'+hour+'" style="width: 25px; text-align: center;" maxlength="2"></div>');
	// $('#qh_'+hour).focus();
	return false;
}

function openData(vehicle){
	if($('#vehicle_'+vehicle).hasClass('hide')){
		$('#vehicle_'+vehicle).removeClass('hide');
		$('#icon_'+vehicle).removeClass('glyphicon-folder-close');
		$('#icon_'+vehicle).addClass('glyphicon-folder-open');
	}
	else{
		$('#vehicle_'+vehicle).addClass('hide');
		$('#icon_'+vehicle).removeClass('glyphicon-folder-open');
		$('#icon_'+vehicle).addClass('glyphicon-folder-close');
	}
}



/**  Message Module Functions **/


	/**
     * Typeahead que retorna o usuario da mensagem
     * @author Guilherme Gibosky
 		 * @date 2014
    */

	$("#receiver").typeahead({

	source:function(query,process){
		var objects=[];
		map={};
		$.getJSON("/api/return-user", {query:query},function(data){
			$.each(data,function(i, object){
				map[object.label]=object;
				objects.push(object.label);
		});
			process(objects);
	});	

	},
	updater:function(item){

		$("#receiver_id").val(map[item].id);
		$('#receiver').attr('disabled',true);
        $('#removeReceiverNew').css('display','');
		return item;

	},

	matcher: function(item){

		if(item===null)
			return false;
		return ~item.toLowerCase().indexOf(this.query.toLowerCase());
	}	
}).on('typeahead:opened', function() {
    $(this).closest('.panel-body').css('overflow','visible');
}).on('typeahead:closed', function() {
    $(this).closest('.panel-body').css('overflow','hidden');
}); 

$('#removeReceiverNew').click(function(){
  $('#receiver_id').val('');
  $('#receiver').attr('disabled',false);
  $('#receiver').val('');
  $('#removeReceiverNew').hide();
});

	/**
     * Typeahead que retorna o usuario da mensagem de encaminhamento
     * @author Guilherme Gibosky
 		 * @date 2014
  */

$("#receiver_forw").typeahead({

	source:function(query,process){
		var objects=[];
		map={};
		$.getJSON("/api/return-user", {query:query},function(data){
			$.each(data,function(i, object){
				map[object.label]=object;
				objects.push(object.label);
		});
			process(objects);
	});	

	},
	updater:function(item){

		$("#receiver_id_forw").val(map[item].id);
		$('#receiver_forw').attr('disabled',true);
        $('#removeReceiverForw').css('display','');
		return item;

	},

	matcher: function(item){

		if(item===null)
			return false;
		return ~item.toLowerCase().indexOf(this.query.toLowerCase());
	}	
}).on('typeahead:opened', function() {
    $(this).closest('.panel-body').css('overflow','visible');
}).on('typeahead:closed', function() {
    $(this).closest('.panel-body').css('overflow','hidden');
}); 

$('#removeReceiverForw').click(function(){
  $('#receiver_id_forw').val('');
  $('#receiver_forw').attr('disabled',false);
  $('#receiver_forw').val('');
  $('#removeReceiverForw').hide();
});

	/**
     * @author Guilherme Gibosky
 		 * @date 2014
  */


function aux_resp_inbox(id,name){ 
	$('#aux').html(''); // limpa o modal
	$('#name_child').hide(); // esconde o nome do remetente
	// $('#loadingmessage').show(); // mostra a figura do load enquanto carrega o ajax
	$('#resp').attr('disabled', true);
	if($('#row_'+id).hasClass('clida') == false || $("#collum_"+id).hasClass('lida') == false || $("#data_"+id).hasClass('lida') == false || $("#dat_"+id).hasClass('lida') == false )
	{
	window.parent.document.getElementById("row_"+id).setAttribute("class","clida");
	window.parent.document.getElementById("collum_"+id).setAttribute("class","lida");
	window.parent.document.getElementById("data_"+id).setAttribute("class","lida");
	window.parent.document.getElementById("dat_"+id).setAttribute("class","lida");
	}
	$.ajax({
		url: '/mail/parent',
		type: 'POST',
		data: { parent: id },
		success: function(data){
			var foo = $.parseJSON(data);
			var aux_date = [];
			$( document ).ready(function() {
			$.each(foo, function(i, aux){ 
			if(aux.date_received_aux != null){
			aux_date.push(aux.date_received_aux);
			}
			else aux_date.push("Mensagem não foi lida");
			$("<div class='panel-group' id='accordion'>" +
					"<div class='panel panel-default'>" +
						"<div class='panel-heading' " +
							"<a id='title_message_"+foo[i].id+"'class='panel-title' data-toggle='collapse' data-parent='#accordion'" + 
								"href='#body_resp_"+foo[i].id +"'>"+ foo[i].title +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ foo[i].name +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+aux_date[i]+"" +
							"</a>" +
						"</div>" +
					"</div>" + 
					"<div id='body_resp_"+foo[i].id +"' class='panel-collapse collapse'>" +
						"<div id='child_body' class='panel-body'>"+
							"<div class='col-md-8'>"+
								foo[i].body+
						  "</div>"+
							"<div class='col-md-4'>"+	
								"<button onclick=\"forwarding("+"'"+ foo[i].body+"','"+foo[i].title+"','"+name+"','"+foo[i].date+"','"+foo[i].id+"','"+
										foo[i].annex+"','"+foo[i].sender+"')\" type='button' class='btn btn-danger btn-xs conteiner'"+
									"href='#myModal_4' id='message_"+foo[i].id +"'data-toggle='modal'>Encaminhar</button>"+	
							"</div>" +
						"</div>" +
						(foo[i].annex !== null ? "<hr>Anexo:   <a id='get_annex_"+foo[i].id+
										"' target='_blank' href='/mail/download/id/"+
										foo[i].id+"/name/"+foo[i].annex+"'"+">"+foo[i].annex+"</a><hr>" : '') +
					"</div>" +
				"</div>").hide().appendTo('#aux').show('slow');
			var tut = foo[i].parent;   // manda pro footer do modal as informações necessarias para responder a mensagem.
			var tot = foo[i].id;
			var tit = foo[i].sender;
			var tet = foo[0].date;
			$('#parent_id_aux').val(tut);
			$('#last_child_id').val(tot);
			$('#sender_id_resp').val(tit);
			$('#name_child').html(name +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ tet);
			$('#name_child_resp').html(name);
			$('#title_message_aux').val(foo[i].title);
			// $('#loadingmessage').hide(); // esconde a figura do load
			$('#name_child').show(); //mostra o nome do remetente
			$('#resp').attr('disabled', false); // ativa o botão de resposta
			})});
		}

	});
	
};


	/**
	   * @author Guilherme Gibosky
		 * @date 2014
	*/

function aux_resp_outbox(id,name){ 
$('#aux').html(''); // limpa o modal
	$('#name_child').hide(); // esconde o nome do remetente
	// $('#loadingmessage').show(); // mostra a figura do load enquanto carrega o ajax
	$('#resp').attr('disabled', true);
	$.ajax({
		url: '/mail/parent-out',
		type: 'POST',
		data: { parent: id },
		success: function(data){
			var foo = $.parseJSON(data);
			var aux_date = [];
			$( document ).ready(function() {
			$.each(foo, function(i, aux){ 
			if(aux.date_received_aux != null){
			aux_date.push(aux.date_received_aux);
			}
			else aux_date.push("Mensagem não foi lida");
			$("<div class='panel-group' id='accordion'>" +
					"<div class='panel panel-default'>" +
						"<div class='panel-heading' " +
							"<a id='title_message_"+foo[i].id+"'class='panel-title' data-toggle='collapse' data-parent='#accordion'" + 
								"href='#body_resp_"+foo[i].id +"'>"+ foo[i].title +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ foo[i].name +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+aux_date[i]+"" +
							"</a>" +
						"</div>" +
					"</div>" + 
					"<div id='body_resp_"+foo[i].id +"' class='panel-collapse collapse'>" +
						"<div id='child_body' class='panel-body'>"+
							"<div class='col-md-8'>"+
								foo[i].body+
						  "</div>"+
							"<div class='col-md-4'>"+	
								"<button onclick=\"forwarding("+"'"+ foo[i].body+"','"+foo[i].title+"','"+name+"','"+foo[i].date+"','"+foo[i].id+"','"+
										foo[i].annex+"','"+foo[i].sender+"')\" type='button' class='btn btn-danger btn-xs conteiner'"+
									"href='#myModal_4' id='message_"+foo[i].id +"'data-toggle='modal'>Encaminhar</button>"+	
							"</div>" +
						"</div>" +
						(foo[i].annex !== null ? "<hr>Anexo:   <a id='get_annex_"+foo[i].id+
										"' target='_blank' href='/mail/download/id/"+
										foo[i].id+"/name/"+foo[i].annex+"'"+">"+foo[i].annex+"</a><hr>" : '') +
					"</div>" +
				"</div>").hide().appendTo('#aux').show('slow');
			var tut = foo[i].parent;   // manda pro footer do modal as informações necessarias para responder a mensagem.
			var tot = foo[i].id;
			var tit = foo[i].sender;
			var tet = foo[0].date;
			$('#parent_id_aux').val(tut);
			$('#last_child_id').val(tot);
			$('#sender_id_resp').val(tit);
			$('#name_child').html(name +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ tet);
			$('#name_child_resp').html(name);
			$('#title_message_aux').val(foo[i].title);
			// $('#loadingmessage').hide(); // esconde a figura do load
			$('#name_child').show(); //mostra o nome do remetente
			$('#resp').attr('disabled', false); // ativa o botão de resposta
			})});
		}

	});
	
};

	/**
	   * @author Guilherme Gibosky
		 * @date 2014
	*/

function fetch_resp(){
		var name = $('#name_child_resp').text();
		var title = $('#title_message_aux').val()
		var parent_id = $('#parent_id_aux').val()
		var last_child_id = $('#last_child_id').val()
		var sender_id_resp = $('#sender_id_resp').val()
		$('#sender').val(name);
		$('#title_ref').val('Re: '+ title);
		$('#sender').attr('disabled',true);
		$('#receiver_id_answer').val(sender_id_resp);
		if (parent_id == '')
		{
			$("#parent_id").val(last_child_id);
		}
		else
		{
			$("#parent_id").val(parent_id);
		}
};


	/**
	   * @author Guilherme Gibosky
		 * @date 2014
	*/

function forwarding(body, title, name, date, id, annex){
		$('#message_forw').html("");
		$('#title_forw').val('Fwd: '+title);
		$('#body_forw').val("\n\n\n"+"----------------------"+
			"Mensagem Encaminhada"+"-----------------------"+"\n"+"Usuário da mensagem: "+name+"\n"+
			"Enviado na data: "+date+"\n"+"Mensagem original: "+body+"\n");
		if (annex !=  'null')
		{ 
			$('#message_forw').append("<a id='get_annex_forw"+id+"' href='/mail/download/id/"+id+"/name/"+annex+"'"+">"+annex+"</a>")
		}
		if (annex !=  'null')
		{  
		$('#annex_forw').val(annex);
		}
		else
		{
			$('#annex_forw').val(null);
		}
		$('#forwarded_message_id').val(id);
		$('#parent_null').val('');

};

	$("#myModal_1").on('shown.bs.modal', function(){ // Coloca o foco no Destinatario do modal 1
		$("#receiver").focus();
	});

	$("#myModal_4").on('shown.bs.modal', function(){ // Coloca o foco no Destinatario do modal 4
		$("#receiver_forw").focus();
	});

$('#receiver_forw').keyup(function(){
	if(($('#body_forw').val().length == 0) || ($('#title_forw').val().length == 0) || ($('#receiver_forw').val().length == 0))
		{
			$("#submit_forw").attr('disabled','disabled');
		}
		else
		{
			$("#submit_forw").removeAttr('disabled');	
		}
});


$('.resp').keyup(function(){
if(($('#body_resp').val().length == 0) || ($('#title_ref').val().length == 0))
		{
			$("#submit").attr('disabled','disabled');
		}
		else
		{
			$("#submit").removeAttr('disabled');	
		}
});

$('.new').keyup(function(){
if(($('#body').val().length == 0) || ($('#title').val().length == 0) || ($('#receiver').val().length == 0))
		{
			$("#submit_new").attr('disabled','disabled');
		}
		else
		{
			$("#submit_new").removeAttr('disabled');	
		}
});


$('#annex_btn').click(function(){
	$('#annex_btn').hide('slow');
	$('#cancel_btn').show('slow');
});

$('#cancel_btn').click(function(){
	$('#annex_btn').show('slow');
});

$('#delete').click(function(){
	$('#deleteMCO').hide();
	$('#statusDelete').css('display','block');
});

$('#delete_calendar').click(function(){
	$('#deleteCalendar').hide();
	$('#statusDelete').css('display','block');
});

/**  VALIDATING VEHICLE FORM **/
$('#service').change(function(){
	if(this.value > 0) {
		$('#form-service').addClass('has-success');
		$('#form-service').addClass('has-feedback');
	} else {
		$('#form-service').removeClass('has-success');
		$('#form-service').removeClass('has-feedback');
	}
});

$('#plate').keyup(function(){
	$('#feedback-success-plate').css('color','#468847');
	$('#feedback-error-plate').css('color','#b94a48');
	if(this.value.indexOf('_') === -1) {
		$('#form-plate').addClass('has-success');
		$('#form-plate').addClass('has-feedback');
		$('#form-plate').removeClass('has-error');
		$('#feedback-success-plate').removeClass('hide');
		$('#feedback-error-plate').addClass('hide');
	} else if(this.value.indexOf('_')) {
		$('#form-plate').addClass('has-error');
		$('#form-plate').addClass('has-feedback');
		$('#form-plate').removeClass('has-success');
		$('#feedback-success-plate').addClass('hide');
		$('#feedback-error-plate').removeClass('hide');
	} else {
		$('#form-plate').removeClass('has-success');
		$('#form-plate').removeClass('has-feedback');
		$('#form-plate').removeClass('has-error');
		$('#feedback-success-plate').addClass('hide');
		$('#feedback-error-plate').addClass('hide');
	}
});


$('#renavam').keyup(function(){
	$('#feedback-success-renavam').css('color','#468847');
	$('#feedback-error-renavam').css('color','#b94a48');
	if(this.value.length > 7 && $.isNumeric(this.value)) {
		$('#form-renavam').addClass('has-success');
		$('#form-renavam').addClass('has-feedback');
		$('#form-renavam').removeClass('has-error');
		$('#feedback-success-renavam').removeClass('hide');
		$('#feedback-error-renavam').addClass('hide');
	} else if( (this.value.length > 1 && this.value.length < 8) || (!$.isNumeric(this.value))) {
		$('#form-renavam').addClass('has-error');
		$('#form-renavam').addClass('has-feedback');
		$('#form-renavam').removeClass('has-success');
		$('#feedback-success-renavam').addClass('hide');
		$('#feedback-error-renavam').removeClass('hide');
	} else {
		$('#form-renavam').removeClass('has-error');
		$('#form-renavam').removeClass('has-success');
		$('#form-renavam').removeClass('has-feedback');
		$('#feedback-success-renavam').addClass('hide');
		$('#feedback-error-renavam').addClass('hide');
	}
});


$('#external-number').keyup(function(){
	$('#feedback-success-external-number').css('color','#468847');
	$('#feedback-error-external-number').css('color','#b94a48');
	if(this.value.length > 4 && $.isNumeric(this.value)) {
		$('#form-external-number').addClass('has-success');
		$('#form-external-number').addClass('has-feedback');
		$('#form-external-number').removeClass('has-error');
		$('#feedback-success-external-number').removeClass('hide');
		$('#feedback-error-external-number').addClass('hide');
	} else if( (this.value.length > 1 && this.value.length < 5) || (!$.isNumeric(this.value))) {
		$('#form-external-number').addClass('has-error');
		$('#form-external-number').addClass('has-feedback');
		$('#form-external-number').removeClass('has-success');
		$('#feedback-success-external-number').addClass('hide');
		$('#feedback-error-external-number').removeClass('hide');
	} else {
		$('#form-external-number').removeClass('has-error');
		$('#form-external-number').removeClass('has-success');
		$('#form-external-number').removeClass('has-feedback');
		$('#feedback-success-external-number').addClass('hide');
		$('#feedback-error-external-number').addClass('hide');
	}
});

$('#consortium').change(function(){
	if(this.value > 0) {
		$('#form-consortium').addClass('has-success');
		$('#form-consortium').addClass('has-feedback');
	} else {
		$('#form-consortium').removeClass('has-success');
		$('#form-consortium').removeClass('has-feedback');
	}
});

$('#pattern').change(function(){
	if(this.value > 0) {
		$('#form-pattern').addClass('has-success');
		$('#form-pattern').addClass('has-feedback');
	} else {
		$('#form-pattern').removeClass('has-success');
		$('#form-pattern').removeClass('has-feedback');
	}
});

$('#color').change(function(){
	if(this.value > 0) {
		$('#form-color').addClass('has-success');
		$('#form-color').addClass('has-feedback');
	} else {
		$('#form-color').removeClass('has-success');
		$('#form-color').removeClass('has-feedback');
	}
});

$('#type').change(function(){
	if(this.value > 0) {
		$('#form-type').addClass('has-success');
		$('#form-type').addClass('has-feedback');
	} else {
		$('#form-type').removeClass('has-success');
		$('#form-type').removeClass('has-feedback');
	}
});


$('#line').keyup(function(){
	$('#feedback-success-line').css('color','#468847');
	$('#feedback-error-line').css('color','#b94a48');
	if(this.value.length == 4 && $.isNumeric(this.value)) {
		$('#form-line').addClass('has-success');
		$('#form-line').addClass('has-feedback');
		$('#form-line').removeClass('has-error');
		$('#feedback-success-line').removeClass('hide');
		$('#feedback-error-line').addClass('hide');
	} else{
		$('#form-line').addClass('has-error');
		$('#form-line').addClass('has-feedback');
		$('#form-line').removeClass('has-success');
		$('#feedback-success-line').addClass('hide');
		$('#feedback-error-line').removeClass('hide');
	} 
});

$('#craft').keyup(function(){
	$('#feedback-success-craft').css('color','#468847');
	$('#feedback-error-craft').css('color','#b94a48');
	if(this.value.length > 6) {
		$('#form-craft').addClass('has-success');
		$('#form-craft').addClass('has-feedback');
		$('#form-craft').removeClass('has-error');
		$('#feedback-success-craft').removeClass('hide');
		$('#feedback-error-craft').addClass('hide');
	} else{
		$('#form-craft').addClass('has-error');
		$('#form-craft').addClass('has-feedback');
		$('#form-craft').removeClass('has-success');
		$('#feedback-success-craft').addClass('hide');
		$('#feedback-error-craft').removeClass('hide');
	} 
});

$('#vehicle_number').keyup(function(){
	$('#feedback-success-vehicle-number').css('color','#468847');
	$('#feedback-error-vehicle-number').css('color','#b94a48');
	if(this.value.length > 4 && $.isNumeric(this.value)) {
		$('#form-vehicle-number').addClass('has-success');
		$('#form-vehicle-number').addClass('has-feedback');
		$('#form-vehicle-number').removeClass('has-error');
		$('#feedback-success-vehicle-number').removeClass('hide');
		$('#feedback-error-vehicle-number').addClass('hide');
	} else if( (this.value.length > 0 && this.value.length < 5) || (!$.isNumeric(this.value))) {
		$('#form-vehicle-number').addClass('has-error');
		$('#form-vehicle-number').addClass('has-feedback');
		$('#form-vehicle-number').removeClass('has-success');
		$('#feedback-success-vehicle-number').addClass('hide');
		$('#feedback-error-vehicle-number').removeClass('hide');
	} else {
		$('#form-vehicle-number').removeClass('has-error');
		$('#form-vehicle-number').removeClass('has-success');
		$('#form-vehicle-number').removeClass('has-feedback');
		$('#feedback-success-vehicle-number').addClass('hide');
		$('#feedback-error-vehicle-number').addClass('hide');
	}
});

$('#start_roulette').keyup(function(){
	$('#feedback-success-start-roulette').css('color','#468847');
	$('#feedback-error-start-roulette').css('color','#b94a48');
	if(this.value.length == 5 && $.isNumeric(this.value)) {
		$('#form-start-roulette').addClass('has-success');
		$('#form-start-roulette').addClass('has-feedback');
		$('#form-start-roulette').removeClass('has-error');
		$('#feedback-success-start-roulette').removeClass('hide');
		$('#feedback-error-start-roulette').addClass('hide');
	} else {
		$('#form-start-roulette').addClass('has-error');
		$('#form-start-roulette').addClass('has-feedback');
		$('#form-start-roulette').removeClass('has-success');
		$('#feedback-success-start-roulette').addClass('hide');
		$('#feedback-error-start-roulette').removeClass('hide');
	}
});

$('#mid_roulette').keyup(function(){
	$('#feedback-success-mid-roulette').css('color','#468847');
	$('#feedback-error-mid-roulette').css('color','#b94a48');
	if(this.value.length == 5 && $.isNumeric(this.value)) {
		$('#form-mid-roulette').addClass('has-success');
		$('#form-mid-roulette').addClass('has-feedback');
		$('#form-mid-roulette').removeClass('has-error');
		$('#feedback-success-mid-roulette').removeClass('hide');
		$('#feedback-error-mid-roulette').addClass('hide');
	} else{
		$('#form-mid-roulette').addClass('has-error');
		$('#form-mid-roulette').addClass('has-feedback');
		$('#form-mid-roulette').removeClass('has-success');
		$('#feedback-success-mid-roulette').addClass('hide');
		$('#feedback-error-mid-roulette').removeClass('hide');
	}
});

$('#end_roulette').keyup(function(){
	$('#feedback-success-end-roulette').css('color','#468847');
	$('#feedback-error-end-roulette').css('color','#b94a48');
	if(this.value.length == 5 && $.isNumeric(this.value)) {
		$('#form-end-roulette').addClass('has-success');
		$('#form-end-roulette').addClass('has-feedback');
		$('#form-end-roulette').removeClass('has-error');
		$('#feedback-success-end-roulette').removeClass('hide');
		$('#feedback-error-end-roulette').addClass('hide');
	} else{
		$('#form-end-roulette').addClass('has-error');
		$('#form-end-roulette').addClass('has-feedback');
		$('#form-end-roulette').removeClass('has-success');
		$('#feedback-success-end-roulette').addClass('hide');
		$('#feedback-error-end-roulette').removeClass('hide');
	}
});

$('#start_hour').keyup(function(){
	$('#feedback-success-start-hour').css('color','#468847');
	$('#feedback-error-start-hour').css('color','#b94a48');
	if(this.value.indexOf('_') == -1) {
		$('#form-start-hour').addClass('has-success');
		$('#form-start-hour').addClass('has-feedback');
		$('#form-start-hour').removeClass('has-error');
		$('#feedback-success-start-hour').removeClass('hide');
		$('#feedback-error-start-hour').addClass('hide');
	} else if(this.value.indexOf('_')) {
		$('#form-start-hour').addClass('has-error');
		$('#form-start-hour').addClass('has-feedback');
		$('#form-start-hour').removeClass('has-success');
		$('#feedback-success-start-hour').addClass('hide');
		$('#feedback-error-start-hour').removeClass('hide');
	} else {
		$('#form-start-hour').removeClass('has-success');
		$('#form-start-hour').removeClass('has-feedback');
		$('#form-start-hour').removeClass('has-error');
		$('#feedback-success-start-hour').addClass('hide');
		$('#feedback-error-start-hour').addClass('hide');
	}
});

$('#mid_hour').keyup(function(){
	$('#feedback-success-mid-hour').css('color','#468847');
	$('#feedback-error-mid-hour').css('color','#b94a48');
	if(this.value.indexOf('_') == -1) {
		$('#form-mid-hour').addClass('has-success');
		$('#form-mid-hour').addClass('has-feedback');
		$('#form-mid-hour').removeClass('has-error');
		$('#feedback-success-mid-hour').removeClass('hide');
		$('#feedback-error-mid-hour').addClass('hide');
	} else if(this.value.indexOf('_')) {
		$('#form-mid-hour').addClass('has-error');
		$('#form-mid-hour').addClass('has-feedback');
		$('#form-mid-hour').removeClass('has-success');
		$('#feedback-success-mid-hour').addClass('hide');
		$('#feedback-error-mid-hour').removeClass('hide');
	} else {
		$('#form-mid-hour').removeClass('has-success');
		$('#form-mid-hour').removeClass('has-feedback');
		$('#form-mid-hour').removeClass('has-error');
		$('#feedback-success-mid-hour').addClass('hide');
		$('#feedback-error-mid-hour').addClass('hide');
	}
});

$('#end_hour').keyup(function(){
	$('#feedback-success-end-hour').css('color','#468847');
	$('#feedback-error-end-hour').css('color','#b94a48');
	if(this.value.indexOf('_') == -1) {
		$('#form-end-hour').addClass('has-success');
		$('#form-end-hour').addClass('has-feedback');
		$('#form-end-hour').removeClass('has-error');
		$('#feedback-success-end-hour').removeClass('hide');
		$('#feedback-error-end-hour').addClass('hide');
	} else if(this.value.indexOf('_')) {
		$('#form-end-hour').addClass('has-error');
		$('#form-end-hour').addClass('has-feedback');
		$('#form-end-hour').removeClass('has-success');
		$('#feedback-success-end-hour').addClass('hide');
		$('#feedback-error-end-hour').removeClass('hide');
	} else {
		$('#form-end-hour').removeClass('has-success');
		$('#form-end-hour').removeClass('has-feedback');
		$('#form-end-hour').removeClass('has-error');
		$('#feedback-success-end-hour').addClass('hide');
		$('#feedback-error-end-hour').addClass('hide');
	}
});

$('#start_date').keyup(function(){
	$('#feedback-success-start-date').css('color','#468847');
	$('#feedback-error-start-date').css('color','#b94a48');
	if(this.value.indexOf('_') == -1) {
		$('#form-start-date').addClass('has-success');
		$('#form-start-date').addClass('has-feedback');
		$('#form-start-date').removeClass('has-error');
		$('#feedback-success-start-date').removeClass('hide');
		$('#feedback-error-start-date').addClass('hide');
	} else if(this.value.indexOf('_')) {
		$('#form-start-date').addClass('has-error');
		$('#form-start-date').addClass('has-feedback');
		$('#form-start-date').removeClass('has-success');
		$('#feedback-success-start-date').addClass('hide');
		$('#feedback-error-start-date').removeClass('hide');
	} else {
		$('#form-start-date').removeClass('has-success');
		$('#form-start-date').removeClass('has-feedback');
		$('#form-start-date').removeClass('has-error');
		$('#feedback-success-start-date').addClass('hide');
		$('#feedback-error-start-date').addClass('hide');
	}
});

$('#mid_date').keyup(function(){
	$('#feedback-success-mid-date').css('color','#468847');
	$('#feedback-error-mid-date').css('color','#b94a48');
	if(this.value.indexOf('_') == -1) {
		$('#form-mid-date').addClass('has-success');
		$('#form-mid-date').addClass('has-feedback');
		$('#form-mid-date').removeClass('has-error');
		$('#feedback-success-mid-date').removeClass('hide');
		$('#feedback-error-mid-date').addClass('hide');
	} else if(this.value.indexOf('_')) {
		$('#form-mid-date').addClass('has-error');
		$('#form-mid-date').addClass('has-feedback');
		$('#form-mid-date').removeClass('has-success');
		$('#feedback-success-mid-date').addClass('hide');
		$('#feedback-error-mid-date').removeClass('hide');
	} else {
		$('#form-mid-date').removeClass('has-success');
		$('#form-mid-date').removeClass('has-feedback');
		$('#form-mid-date').removeClass('has-error');
		$('#feedback-success-mid-date').addClass('hide');
		$('#feedback-error-mid-date').addClass('hide');
	}
});

$('#end_date').keyup(function(){
	$('#feedback-success-end-date').css('color','#468847');
	$('#feedback-error-end-date').css('color','#b94a48');
	if(this.value.indexOf('_') == -1) {
		$('#form-end-date').addClass('has-success');
		$('#form-end-date').addClass('has-feedback');
		$('#form-end-date').removeClass('has-error');
		$('#feedback-success-end-date').removeClass('hide');
		$('#feedback-error-end-date').addClass('hide');
	} else if(this.value.indexOf('_')) {
		$('#form-end-date').addClass('has-error');
		$('#form-end-date').addClass('has-feedback');
		$('#form-end-date').removeClass('has-success');
		$('#feedback-success-end-date').addClass('hide');
		$('#feedback-error-end-date').removeClass('hide');
	} else {
		$('#form-end-date').removeClass('has-success');
		$('#form-end-date').removeClass('has-feedback');
		$('#form-end-date').removeClass('has-error');
		$('#feedback-success-end-date').addClass('hide');
		$('#feedback-error-end-date').addClass('hide');
	}
});

	/**
   	* Handler the selection on Travel Occupancy
   	* @author Guilherme Gibosky
		* @date 2016-05-10
  */

	$('#occupancyOption').on('change',function(){
		var option = $('#occupancyOption').val();
		if (option == 3){
			$('#occupancy_form').attr('action','/mco/report-travel-occupancy-line');
			$('#cell_choice').hide("slow");
			$( ".myBrCell" ).remove();
				if ($('#line_choice').length) {
					$('#line_choice').slideDown("slow");
				}else{
					$('#line_choice').slideDown("slow");
	    	}
		}else if (option == 4){
			$('#occupancy_form').attr('action','/mco/report-travel-occupancy-cell');
			$('#line_choice').hide("slow");
			$( ".myBrLine" ).remove();
			if ($('#cell_choice').length) {
					$('#cell_choice').slideDown("slow");
				}else{
					$('#cell_choice').slideDown("slow");
	    	}
		}else{
			$( ".myBrLine" ).remove();
			$( ".myBrCell" ).remove();
			if (($('#line_choice').length) || $('#cell_choice').length) {
				$('#line_choice').hide("slow");
				$('#cell_choice').hide("slow");
			}
				switch(option) {
		    case "0":
		    $('#occupancy_form').attr('action','/mco/report-travel-occupancy'); 
		        break;
		    case "1":
		        $('#occupancy_form').attr('action','/mco/report-travel-occupancy');
		        break;
	    	case "2":
	     	   $('#occupancy_form').attr('action','/mco/report-travel-occupancy-delegatee');
	         break;
				}
		}
	});

/**
   	* Handler the selection on Travel Report
   	* @author Guilherme Gibosky
		* @date 2016-06-23
*/

	$('#travelOption').on('change',function(){
		var option = $('#travelOption').val();

		// HTML snippet code template to be added

		var input = '<div id="travel_line_div" hidden="true">'+
              '<label class="control-label" id ="line_label" for="line_travel">'+
              'Linha</label><input class="form-control" id ="line_travel"'+
               'name="line_travel" type="text"'+
               'placeholder="Digite a Linha escolhida" type="text">'+
		      		'</div><br id="br_fim"/>';
		var b_line = '<br id="br_fim"/>';

		// Function that find and replace all the occurences of a string

		function escapeRegExp(string) {
   		 return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}

		function replaceAll(string, find, replace) {
		  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
		}

		// Auxiliar Function to hide not selected elements and clean the value field

		function hideText(){
			$('#travel_line_div').fadeOut();
			$('#travel_ali_div').fadeOut();
			$('#travel_ter_div').fadeOut();
			$('#travel_tron_div').fadeOut();
			$('#travel_com_div').fadeOut();
			$('#travel_line_div').val("");
			$('#travel_ali_div').val("");
			$('#travel_ter_div').val("");
			$('#travel_tron_div').val("");
			$('#travel_com_div').val("");
			$('#br_fim').remove();
		}

		// check the type selected and do the show animation

		if (option == 2){
			$('#travel_rep_form').attr('action','/mco/report-travel-by-common');
			hideText();
			if (document.getElementById("travel_com_div") !== null) {
				$('#travel_com_div').slideDown("slow");
				$('#travel_com_div').after(b_line);
			}else{
				var aux = replaceAll(input, "line", "com"); // change the div id to travel_com_div
				var com = replaceAll(aux, "Linha", "Convencional"); // change the placeholder text
				$('#fim_br').after(com);
				$('#travel_com_div').slideDown("slow");
			}
		}else if(option == 3){
			$('#travel_rep_form').attr('action','/mco/report-travel-by-line');
			hideText();
			if (document.getElementById("travel_line_div") !== null) {
				$('#travel_line_div').slideDown("slow");
				$('#travel_line_div').after(b_line);
				$('#travel_line_div').prop('type','number');
			}else{
				$('#fim_br').after(input);
				$('#travel_line_div').slideDown("slow");
				$('#travel_line_div').prop('type','number');
			}
		}else if(option == 4){
			$('#travel_rep_form').attr('action','/mco/report-travel-by-alimentadora');
			hideText();
			if (document.getElementById("travel_ali_div") !== null) {
				$('#travel_ali_div').slideDown("slow");
				$('#travel_ali_div').after(b_line);
			}else{
				var aux = replaceAll(input, "line", "ali"); // change the div for travel_ali_div
				var ali = replaceAll(aux, "Linha", "Alimentadora"); // change the placeholder text
				$('#fim_br').after(ali);
				$('#travel_ali_div').slideDown("slow");
			}
		}else if(option == 5){
			$('#travel_rep_form').attr('action','/mco/report-travel-by-terminal');
			hideText();
			if (document.getElementById("travel_ter_div") !== null) {
				$('#travel_ter_div').slideDown("slow");
				$('#travel_ter_div').after(b_line);
			}else{
				var aux = replaceAll(input, "line", "ter"); // change the div for travel_ter_div
				var ter = replaceAll(aux, "Linha", "Terminal"); // change the placeholder text
				$('#fim_br').after(ter);
				$('#travel_ter_div').slideDown("slow");
			}
		}else if(option == 6){
			$('#travel_rep_form').attr('action','/mco/report-travel-by-troncal');
			hideText();
			if (document.getElementById("travel_tron_div") !== null) {
				$('#travel_tron_div').slideDown("slow");
				$('#travel_tron_div').after(b_line);
			}else{
				var aux = replaceAll(input, "line", "tron"); // change the div for travel_tron_div
				var tron = replaceAll(aux, "Linha", "Troncal"); // change the placeholder text
				$('#fim_br').after(tron);
				$('#travel_tron_div').slideDown("slow");
			}
		}else{
			hideText();
			$('#travel_rep_form').attr('action','/mco/report-travel');
		}
	});

/**
   	* Input Validation of Justify Roullete
   	* @author Guilherme Gibosky
		* @date 2016-05-23
*/

	$(".accept_jus").on('click', function(){
		// get id value from link text

		var aux = $(this).attr('href');
		id = aux.substring(8);
		
		//validate justification input - Textarea

		$('#justify_accept'+id).keyup(function(){
		var value = $('#justify_accept'+id).val();
		if(value.length != 0) {
			$("#justify_accept"+id).css('border','solid 2px #468847');
		}else{
			$("#justify_accept"+id).css('border','solid 2px #b94a48');
		}
	});

	//validate accredit_passenger input to prevent forbidden or empty values  - Numeric

	$('#accredit_passenger'+id).keypress(function(event) {
			var accr = $('#accredit_passenger'+id).val();
			if (event.charCode == 45) {
				$("#accredit_passenger"+id).css('border','solid 2px #FFF000');
			}else if(event.charCode < 48 ||  event.charCode > 57){
	    	event.preventDefault();
	    	$("#accredit_passenger"+id).css('border','solid 2px #b94a48');
	    }else{
	    	$("#accredit_passenger"+id).css('border','solid 2px #468847');
	    }
	});

	$('#btn_accept'+id).on("click", function(event){
		var jus = $('#justify_accept'+id).val();
		var accr = $('#accredit_passenger'+id).val();
		if(accr.length == 0 || jus.length == 0){
			event.preventDefault();
			if (accr.length == 0) {
				$("#accredit_passenger"+id).css('border','solid 2px #b94a48');
			}
			else if (jus.length == 0) {
				$("#justify_accept"+id).css('border','solid 2px #b94a48');
			}
		}else if(accr == "-") {
			event.preventDefault();
		}else{

		}
	});
});

$(".denial_jus").on('click', function(){
		var aux = $(this).attr('href');
		id = aux.substring(8);
		
		$('#justify_denial'+id).keyup(function(){
		var value = $('#justify_denial'+id).val();
		if(value.length != 0) {
			$("#justify_denial"+id).css('border','solid 2px #468847');
		}else{
			$("#justify_denial"+id).css('border','solid 2px #b94a48');
		}
	})

	$('#btn_denial'+id).on("click", function(event){
		var jus = $('#justify_denial'+id).val();
		if(jus.length == 0){
			event.preventDefault();
		}else{
		}
	})
});

/**
   	* Handler the selection on Overcrowd Report
   	* @author Guilherme Gibosky
		* @date 2016-07-14
*/

	$('#overOption').on('change',function(){

		// Auxiliar Function to hide not selected elements and clean the value field

		function hideDivs(){
			$('#line_travel_over').fadeOut();
			$('#vehicle_travel_over').fadeOut();
			$('#day_travel_over').fadeOut();
			$('#delegatee_choice').fadeOut();
			$('#cell_choice').fadeOut();
			$('#line_input_over').val("");
			$('#vehicle_input_over').val("");
			$('#dayOption').val("");
			$('#delegateeOver').val("");
			$('#cellOver').val("");
			$('#br_over').remove();
		}

		

		$('#over_pdf').removeAttr("disabled"); // Enable the submit button
		$('#over_csv').removeAttr("disabled"); // Enable the submit button
		var option = $('#overOption').val(); //get the code of the user selection
		var b_line = "<br id='br_over'/>"; // HTML snippet code template for break line
		hideDivs();
		
		// check the type selected and do the show animation
		if (option == 1){
			$('#over_form').attr('action','/mco/report-overcrowded-all');
		}else if (option == 2){
			$('#over_form').attr('action','/mco/report-overcrowded');
		}else if(option == 3){
			$('#over_form').attr('action','/mco/report-over-line'); 
			$('#line_travel_over').slideDown("slow");
			$('#line_travel_over').after(b_line);
		}else if(option == 4){
			$('#over_form').attr('action','/mco/report-over-vehicle');
			$('#vehicle_travel_over').slideDown("slow");
			$('#vehicle_travel_over').after(b_line);
		}else if(option == 5){
			$('#over_form').attr('action','/mco/report-over-day');
			$('#day_travel_over').slideDown("slow");
			$('#day_travel_over').after(b_line);
		}else if(option == 6){
			$('#over_form').attr('action','/mco/report-over-delegatee');
			$('#delegatee_choice').slideDown("slow");
			$('#delegatee_choice').after(b_line);
		}else if(option == 7){
			$('#over_form').attr('action','/mco/report-over-cell');
			$('#cell_choice').slideDown("slow");
			$('#cell_choice').after(b_line);
		}else{
			$('#over_pdf').attr('disabled','true');
			$('#over_csv').attr('disabled','true');
		}
	});

	/**
   	* Input Validator of Overcrowd Report
   	* @author Guilherme Gibosky
		* @date 2016-07-29
*/

	$("#over_pdf").on('click', function(){
		var option = $('#overOption').val();
		var v_ini = $('#data_ini_over').val();
		var v_end = $('#data_end_over').val();
		if (option == 3) {
			var line = $('#line_input_over').val();
			if(v_ini.length < 10 || v_end.length < 10 || line.length < 0) {
				event.preventDefault();
				if (v_ini.length < 10) {
					$('#data_ini_over').css('border','solid 2px #b94a48');
				}else if (v_end.length < 10) {
					$('#data_end_over').css('border','solid 2px #b94a48');
				}else if (line.length < 0) {
					$('#line_input_over').css('border','solid 2px #b94a48');
				}
			}	
		}else if (option == 4) {
			var vehicle = $('#vehicle_input_over').val();
			if(v_ini.length < 10 || v_end.length < 10 || vehicle.length < 0) {
				event.preventDefault();
				if (v_ini.length < 10) {
					$('#data_ini_over').css('border','solid 2px #b94a48');
				}else if (v_end.length < 10) {
					$('#data_end_over').css('border','solid 2px #b94a48');
				}else if (vehicle.length < 0) {
					$('#vehicle_input_over').css('border','solid 2px #b94a48');
				}
			}	
		}else{
			if(v_ini.length < 10 || v_end.length < 10 ) {
				event.preventDefault();
				if (v_ini.length < 10) {
					$('#data_ini_over').css('border','solid 2px #b94a48');
				}else if (v_end.length < 10) {
					$('#data_end_over').css('border','solid 2px #b94a48');
				}
			}	
		}
	});

	$("#print_modal").on('click', function(){
		var line = $('#line_input_over').val();
		$("#print_extract").printElement({ printMode: 'popup'});
	});	


// Get the communication numbers of the selected contract - Gibosky
	
$('#contract').change(function(){
	$('#contract').css('border-color','green').popover('destroy')
	$('#start_validity_date').attr("disabled", true);
	$('#number_communication').val("");
	$('#consortium').val("");
	$('#consortium_companies').val("");
	$('#op_type').val("");
	$('#serv_sd').val("");
	$('#city_ori').val("");
	$('#city_des').val("");
	$('#new_qco').attr("disabled", "disabled");
	$.getJSON('/qco/get-communication/id/'+this.value, { }, function(data){
		$('#number_communication').empty();
		if (data.length == 0) {
			$('#number_communication').append("<option value='-1'> -- Contrato não possui atendimentos ativos -- </option>");	
		}else{
			$('#number_communication').append("<option value='0'> -- Selecione um atendimento -- </option>");
		}
		$.each(data, function(index,item) {
				$('#number_communication').append("<option value=" + item.id + ">" + item.communication +" - "+ item.name +"</option>");
		});
	});
});

// Get the date of the active QCO - Gibosky

$('#number_communication').change(function(){
	var aux = $('#number_communication option:selected').text();
	var result = aux.split('-')[0];
	$.getJSON('/qco/get-communication-data', { number : result }, function(data){
		$('#consortium').val(data.consortium_name);
		$('#consortium_companies').val(data.cell_name);
		$('#op_type').val(data.op_name);
		$('#serv_sd').val(data.sd_name);
		$('#city_ori').val(data.city_ori);
		$('#city_des').val(data.city_des);
		$('#start_validity_date').attr("disabled", false);
	});
});

/**
   	* Check if the vality date is older than today or the most, not future, recent QCO. 
		For that, the moment plugin is necessary, since javascript doesn't have native date format.
   		Documentation in the link: http://momentjs.com/docs.
   	* @author Guilherme Gibosky
		* @date 11/01/2017
*/

$('#start_validity_date').change(function(){
	var number = $('#number_communication option:selected').text().split('-')['0'];
 	var today = moment().format("YYYY-MM-DD");
	var aux1 = $('#start_validity_date').val().split('/');
	aux1 = aux1['2']+'-'+aux1['1']+'-'+aux1['0'];
	var new_date = moment(aux1,"YYYY-MM-DD");
	$.getJSON('/api/validity-duplicate/date/'+aux1+'/number/'+number, { }, function(data){
		if (new_date.isBefore(today) == true || new_date.isSame(today) == true) {
				$('#start_validity_date').css('border-color','red');
				$('#start_validity_date').popover({title: "Inválido.", content: "Data igual ou inferior a hoje.", trigger: "hover"});
				$('#new_qco').prop("disabled",true);
		}else{
			if (data == true){
			$('#start_validity_date').css('border-color','red');
			$('#start_validity_date').popover({title: "Inválido.", content: "Existe QCO para essa data.", trigger: "hover"});
			$('#new_qco').prop("disabled",true);
			}else{
				$('#new_qco').prop("disabled",false);
				$('#start_validity_date').css('border-color','green').popover("destroy");
			}	
		}
	});		
});

$('#ini_date_paralyse').change(function(){
	var number = $('#paralyse_communication').val();
 	var today = moment().format("YYYY-MM-DD");
	var aux1 = $('#ini_date_paralyse').val().split('/');
	aux1 = aux1['2']+'-'+aux1['1']+'-'+aux1['0'];
	var new_date = moment(aux1,"YYYY-MM-DD");
	$.getJSON('/api/validity-duplicate/date/'+aux1+'/number/'+number, { }, function(data){
		if (new_date.isBefore(today) == true || new_date.isSame(today) == true) {
				$('#ini_date_paralyse').css('border-color','red');
				$('#ini_date_paralyse').popover({title: "Inválido.", content: "Data igual ou inferior a hoje.", trigger: "hover"});
				$('#paralyse_btn').prop("disabled",true);
				$('#paralyse_justify').prop("disabled",true);
		}else{
			if (data == true){
			$('#ini_date_paralyse').css('border-color','red');
			$('#ini_date_paralyse').popover({title: "Inválido.", content: "Existe QCO para essa data.", trigger: "hover"});
			$('#paralyse_btn').prop("disabled",true);
			$('#paralyse_justify').prop("disabled",true);
			}else{
				$('#paralyse_btn').prop("disabled",false);
				$('#paralyse_justify').prop("disabled",false);
				$('#ini_date_paralyse').css('border-color','green').popover("destroy");
			}	
		}
	});		
});

$('#start_validity_date_edit').change(function(){
	var number = $('#hidden_number').val();
 	var today = moment().format("YYYY-MM-DD");
	var aux1 = $('#start_validity_date_edit').val().split('/');
	aux1 = aux1['2']+'-'+aux1['1']+'-'+aux1['0'];
	var new_date = moment(aux1,"YYYY-MM-DD");
	$.getJSON('/api/validity-duplicate/date/'+aux1+'/number/'+number, { }, function(data){
		if (new_date.isBefore(today) == true || new_date.isSame(today) == true) {
				$('#start_validity_date_edit').css('border-color','red');
				$('#start_validity_date_edit').popover({title: "Inválido.", content: "Data igual ou inferior a hoje.", trigger: "hover"});
				$('#btn1').prop("disabled",true);
				$('#historic_justify').prop("disabled",true);
		}else{
			if (data == true){
			$('#start_validity_date_edit').css('border-color','red');
			$('#start_validity_date_edit').popover({title: "Inválido.", content: "Existe QCO para essa data.", trigger: "hover"});
			$('#btn1').prop("disabled",true);
			$('#historic_justify').prop("disabled",true);
			}else{
				$('#btn1').prop("disabled",false);
				$('#historic_justify').prop("disabled",false);
				$('#start_validity_date_edit').css('border-color','green').popover("destroy");
			}	
		}
	});		
});

$('#clone_validity_date').on('change', function(e){
	$('#clone_validity_date').popover("destroy");
	var number = $('#hidden_number').val();
 	var today = moment().format("YYYY-MM-DD");
	var aux1 = $('#clone_validity_date').val().split('/');
	aux1 = aux1['2']+'-'+aux1['1']+'-'+aux1['0'];
	var new_date = moment(aux1,"YYYY-MM-DD");
	$.getJSON('/api/validity-duplicate/date/'+aux1+'/number/'+number, { }, function(data){
		if (new_date.isBefore(today) == true || new_date.isSame(today) == true) {
			$('#clone_qco').prop("disabled",true);
			$('#clone_validity_date').css('border-color','red');
			$('#clone_validity_date').popover({title: "Inválido.", content: "Data igual ou inferior a hoje.", trigger: "hover"});	
		}else if (data == true){
			$('#clone_qco').prop("disabled",true);
			$('#clone_validity_date').css('border-color','red');
			$('#clone_validity_date').popover({title: "Inválido.", content: "Existe QCO para essa data.", trigger: "hover"});
		}
		else{
			$('#clone_qco').prop("disabled",false);
			$('#clone_validity_date').css('border-color','green');
		}
	});		
});


$(document).on('click','#new_qco', function(e){
	if ($('#contract').val() == 0) {
	 	$('html, body').animate({
        scrollTop: $("#contract")[0].scrollHeight
    }, 1000);
 		$('#contract').css('border-color','red').popover({title: "Inválido.", content: "Campo Obrigatório.", trigger: 'hover'});
 		return false;
	}
	this.disabled=true;this.value='Aguarde, enviando formulário...';this.form.submit();
});

// ******************************************************************************
// Handle the removal of Schedule hours from QCO EDIT
// Author: Guilherme Gibosky
// Date: 11/01/2017
// ******************************************************************************

$(document).on('click','.remove_hour', function(){
	if (this.id.split("_")['1'] == 'new') {
		var ids = [];
		$('.remove_hour').each(function() {
	    ids.push(this.id.split("_")["2"]);
		});
		var id = this.id.split("_")["2"];
		$("#handle_new_"+id).remove();
	}else{
		var qco = this.id.split("_")["1"];
		var id = this.id.split("_")["2"];
		var remove = $("#hidden_remove_"+qco).val();
		var remove_id = $("#hidden_hour_"+qco+"_"+id).val();
		if (remove_id != "") {
			if (remove == " ") {
				$("#hidden_remove_"+qco).val('_'+remove_id);
			}else{
				$("#hidden_remove_"+qco).val(remove+'_'+remove_id);
			}	
		}
		$("#handle_"+qco+"_"+id).remove();
		var teste = $('#qcoHour_'+qco).children().find('div')['2'];
		if (teste == undefined) {
			$('#edit_hour[value="'+qco+'"]').prop("disabled",true);
			var html = '<div id= "schedule_remove_alert" class="row"><div class="col-md-12 text-center alert alert-danger fade in">'+
			'<button type="button" class="close" data-dismiss="alert">×</button><strong>Ops!</strong>'+
			' Para apagar um dia e seus horários, justifique e use o botão Apagar.</div></div>';
			$('.navbar.navbar-inverse.navbar-fixed-top').after(html);
			$('#justify_'+qco).css('border-color','red');
		}
	}
});

// ******************************************************************************
// Handle the addition of Schedule hours from QCO EDIT
// Author: Guilherme Gibosky
// Date: 12/01/2017
// ******************************************************************************

$(document).on('click','.add_hour', function(){
  $(".add_hour").prop( "disabled", true );

    setTimeout(function() {
      $(".add_hour").prop( "disabled", false );
    }, 2000);
	$(".schedule_hour").mask("99:99"); // Quick fix for hour mask on schedule hour manual edit
	if (this.id.split("_")['1'] == 'new') {
		var id = this.id.split("_")["2"];
		var sum = Number($("#count_hours_new").val());
    sum = sum +1;
    $("#count_hours_new").val(sum);
		$("#handle_new_"+id).after('<div id = "handle_new_'+sum+'" class="input-group col-xs-2 form-group'+
			'style="margin-right: 1px;">');
		$("#handle_new_"+sum).append('<i id="add_new_'+sum+'" class="add_hour fa fa-plus-circle fa-lg"'+
				'aria-hidden="true" style="color:green"></i>');
		$("#add_new_"+sum).after('<i id="remove_new_'+sum+'" class="remove_hour fa fa-times fa-lg"'+
				'aria-hidden="true" style="color:red"></i>');
		$("#remove_new_"+sum).after('<input id="edit_hour_new_'+sum+'" name="edit_hour_new_'+sum+
			'" type="text" class="form-control schedule_hour" value="" '+
			'pattern="([0-2]{1})([0-9]{1}):([0-5]{1})([0-9]{1})">');
		$.getJSON('/qco/get-journey',{},function(data){
			$("#edit_hour_new_"+sum).after('<select id="edit_journey_new_'+sum+
				'" name="edit_journey_new_'+sum+'" class="form-control">');
			for (var i = 0; i <= data.length -1; i++) {	
				$("#edit_journey_new_"+sum).append('<option value="'+data[i]["id"]+
					'">'+data[i]["abrev"]+'</option>');
			}
			$("#edit_journey_new_"+sum).after('</select></div>');
		});	
	}else{
		var qco = this.id.split("_")["1"];
		var id = this.id.split("_")["2"];
		var sum = Number($("#count_hours_"+qco).val());
		$("#handle_"+qco+"_"+id).after('<div id = "handle_'+qco+'_'+sum+
			'" class="input-group col-xs-2 form-group'+'style="margin-right: 1px;">');
		$("#handle_"+qco+"_"+sum).append('<i id="add_'+qco+'_'+sum+
			'" class="add_hour fa fa-plus-circle fa-lg"'+'aria-hidden="true" style="color:green"></i>');
		$("#add_"+qco+"_"+sum).after('<i id="remove_'+qco+'_'+sum+
			'" class="remove_hour fa fa-times fa-lg"'+'aria-hidden="true" style="color:red"></i>');
		$("#remove_"+qco+"_"+sum).after('<input id="edit_hour_'+qco+'_'+sum+
			'" name="edit_hour_'+qco+'_'+sum+'" type="text" class="form-control schedule_hour" '+
			'pattern="([0-2]{1})([0-9]{1}):([0-5]{1})([0-9]{1})">');
		$("#edit_hour_"+qco+"_"+sum).after('<input id="hidden_hour_'+qco+'_'+sum+
			'" name="hidden_hour_'+qco+'_'+sum+'" type="text" hidden>');
		$.getJSON('/qco/get-journey',{},function(data){
			$("#hidden_hour_"+qco+"_"+sum).after('<select id="edit_journey_'+qco+'_'+sum+
				'" name="edit_journey_'+qco+'_'+sum+'" class="form-control">');
			for (var i = 0; i <= data.length -1; i++) {	
				$("#edit_journey_"+qco+"_"+sum).append('<option value="'+data[i]["id"]+
					'">'+data[i]["abrev"]+'</option>');
			}
			$("#edit_journey_"+qco+"_"+sum).after('</select></div>');
			sum++;
			$("#count_hours_"+qco).val(sum);
		});	
	}
});

// ******************************************************************************
// Validate empty fields of Schedule hours from QCO EDIT
// Author: Guilherme Gibosky
// Date: 22/01/2017
// ******************************************************************************

$(document).on('click','#edit_hour', function(e){
	if (this.value == 'edit_hour') {
		var check_new_empty = false;
		$("#new_schedule").find('.schedule_hour').each(function( index, aux ) {
			if ($(aux).val() == "") {
				e.preventDefault();
				$(aux).css('border-color','red');
				$(aux).popover({title: "Inválido", content: "Campo Vazio", trigger: "hover"});
			}else{
				$(aux).css('border-color','green').popover("destroy");
				check_new_empty = false;
			}
		});
		if (check_new_empty == true)
			e.preventDefault();
	}else{
		var qco = this.value;
		$("#qcoHour_"+qco).find('.schedule_hour').each(function( index, aux ) {
			if ($(aux).val() == "") {
				e.preventDefault();
				$(aux).css('border-color','red');
				$(aux).popover({title: "Inválido", content: "Campo Vazio", trigger: "hover"});
			}else{
				$(aux).css('border-color','green').popover("destroy");
				check_empty = false;
			}
		});
	}
});

$(document).on('click','.paralyse_link', function(){
	var number = this.name;
	$("#paralyse_communication").val(number);
});

$(document).on('click','#close_paralyse', function(){
	$("#ini_date_paralyse").val('');
	$("#paralyse_communication").val('');
});

$(document).on('click','.clone_qco', function(){
	var id = this.name.split('_');
	$("#hidden_id").val(id['0']);
	$("#status").val(id['1']);
});

$(document).on('click','#btnAddLine', function(e){
	e.preventDefault();
	var number = $('#number_field').val();
	if ($('#station_number').val() == "") {
		var stations = 0;
	}else{
		var stations = $('#station_number').val();		
	}
	$.getJSON('/terminal/get-station',{},function(data){
		var select_option ='<option value="0">-- Selecione uma Estação --</option>\n';
		$.each(data, function( i, n ) {
			select_option = select_option+'<option value="'+n.id+'">'+n.name+
			'</option>\n';
		});
		for (var i = 1; i <= number; i++) {
		$("#terminal_select").append('<select id="station_new_'
			+stations+'" name="station_new_'+stations+'" class="form-control">'+select_option+'</select>');
		$("#terminal_select").append('<i id="remove_new_'+stations+
			'" class="remove_station fa fa-times fa-lg" aria-hidden="true" style="color:red"></i>');
		stations = parseInt(stations)+1;
	}
	$('#station_number').val(stations);
	});	
	
});

$(document).on('click','.remove_station', function(e){
 	var id = this.id.split('_');
	if (id["1"] == "new") {
	 	$("#station_new_"+id["2"]).remove();
		$("#remove_new_"+id["2"]).remove();
		$("#station_br"+id["2"]).remove();
	}else{
		var remove = $("#station_remove").val();
		$("#station_remove").val(remove+'_'+id["1"]);
	 	$("#station_"+id["1"]).remove();
	 	$("#station_id_"+id["1"]).remove();
		$("#remove_"+id["1"]).remove();
		$("#station_br"+id["1"]).remove();
}
});

// Field to tell how many station to add only accept numeric characteres
$(document).on('keypress','#number_field', function(event){
	if(event.which != 8 && isNaN(String.fromCharCode(event.which))){
 		event.preventDefault(); 
 	}
});

$(document).on('click','.cancel_link', function(event){
	var aux = this.name;
	$("#line_cancel_id").val(aux);
});

$(document).on('click','#close_cancel', function(){
	$("#line_cancel_id").val('');
});

$('#renavam').change(function(event){

	// inicialize required fields

	var renavam = $('#renavam').val();
	$.ajax({
    type: "POST",
    url: "/fleet/check-renavam",
    data: {renavam : renavam}
  }).done(function (data){
		var renavam = data;
		if (renavam == 1) {
			$('#renavam').css('border-color','red');
			$('#renavam').popover({title: "Inválido", content: "Já existe no sistema", trigger: "hover"});
			$('.submit_new_vehicle').prop("disabled",true);
			$('#check_renav').val("1");
		}else{
			$('#renavam').css('border-color','green').popover("destroy");
			$('#check_renav').val("0");
			checkSuccess();
		};
  });
});


$('#plate').change(function(event){

	// inicialize required fields
	var plate = $('#plate').val();
	$.ajax({
    type: "POST",
    url: "/fleet/check-plate",
    data: {plate : plate}
  }).done(function (data){
  	var plate = data;
		if (plate == 1) {
			$('#plate').css('border-color','red');
			$('#plate').popover({title: "Inválido", content: "Já existe no sistema", trigger: "hover"});
			$('.submit_new_vehicle').prop("disabled",true);
			$('#check_plate').val("1");
		}else{
			$('#plate').css('border-color','green').popover("destroy");
			$('#check_plate').val("0");
			checkSuccess();
		}
  });
});

$(document).on('change','#external-number', function(event){
	var number = $('#external-number').val();
	if (number.length > 8) {
		$('#external-number').css('border-color','red');
		$('#external-number').popover({title: "Inválido", content: "Número maior que o permitido", trigger: "hover"});
		$('.submit_new_vehicle').prop("disabled",true);
		$('#check_ext').val("1");
	}else{
		$.getJSON('/fleet/check-external',{external : number},function(data){
			if (data == 1) {
				$('#external-number').css('border-color','red');
				$('#external-number').popover({title: "Inválido", content: "Já existe no sistema", trigger: "hover"});
				$('.submit_new_vehicle').prop("disabled",true);
				$('#check_ext').val("1");
			}else{
				$('#external-number').css('border-color','green').popover("destroy");
				$('#check_ext').val("0");
				checkSuccess();
			}
		});
	};
});


$(document).on('change','#chassi_number', function(event){
	var number = $('#chassi_number').val();
	if (number.length > 20) {
		$('#chassi_number').css('border-color','red');
		$('#chassi_number').popover({title: "Inválido", content: "Número maior que o permitido", trigger: "hover"});
		$('#edit_mechanics').prop("disabled",true);
	}else{
		$.getJSON('/fleet/check-chassi',{chassi : number},function(data){
			if (data == 1) {
				$('#chassi_number').css('border-color','red');
				$('#chassi_number').popover({title: "Inválido", content: "Já existe no sistema", trigger: "hover"});
				$('#edit_mechanics').prop("disabled",true);
			}else{
				$('#chassi_number').css('border-color','green').popover("destroy");
				$('#edit_mechanics').prop("disabled",false);
			}
		});
	};
});

function checkSuccess(){
	var ext = $('#check_ext').val();
	var plate = $('#check_plate').val();
	var renavam = $('#check_renav').val();
	if (renavam == "0" && plate == "0" && ext == "0") {
		$('.submit_new_vehicle').prop("disabled",false);
	};
}

// ******************************************************************************
// Generate the dynamic fields for the all qco report on QCO REPORT VIEW
// Author: Guilherme Gibosky
// Date: 22/01/2017
// ******************************************************************************
$(document).on('change','#line_report_qco', function(){
	var option = $('#line_report_qco').val();
	$('#report_stations').remove();
	$('#report_terminals').remove();
	if (option == 3) {
		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
		$.getJSON('/api/get-terminals',{},function(terminals){
			$('#line_report_qco').after('<select id="report_terminals" name="report_terminals" '+
				'class="form-control">');
			$('#report_terminals').append('<option value="0">-- Selecione um Terminal --</option>');
			$.each(terminals, function(e, d){
				$('#report_terminals').append('<option value="'+d.id+'">'+d.initials+' - '+d.name+'</option>');
			})
			$('#line_report_qco').after('</select>');
		});
	}else if(option == 4){
 		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
		$.getJSON('/api/get-stations',{},function(stations){
			$('#line_report_qco').after('<select id="report_stations" name="report_stations" '+
				'class="form-control">');
			$('#report_stations').append('<option value="0">-- Selecione uma Estação --</option>');
			$.each(stations, function(e, d){
				$('#report_stations').append('<option value="'+d.id+'">'+d.initials+' - '+d.name+'</option>');
			})
			$('#line_report_qco').after('</select>');
		});
	}else{
		$('#line_report_pdf').prop('disabled', false);
		$('#line_report_csv').prop('disabled', false);
	}
});

// *********************************************************************************
// Generate the dynamic fields for the communication report on the  QCO REPORT VIEW
// Author: Guilherme Gibosky
// Date: 22/01/2017
// *********************************************************************************
$(document).on('change','#report_qco', function(){
	$('#report_rit').remove();
	$('#report_cell').remove();
	var option = $('#report_qco').val();
	if (option == 1) {
		$('#qco_report_pdf').prop('disabled', true);
		$('#qco_report_csv').prop('disabled', true);
		$.getJSON('/api/get-rit',{},function(rit){
			$('#report_qco').after('<select id="report_rit" name="report_rit" '+
				'class="form-control">');
			$('#report_rit').append('<option value="0">-- Escolha um Rit --</option>');
			$.each(rit, function(e, d){
				$('#report_rit').append('<option value="'+d.id+'">'+d.name+'</option>');
			})
			$('#report_qco').after('</select>');
		});
	}else if(option == 2){
 		$('#qco_report_pdf').prop('disabled', true);
		$('#qco_report_csv').prop('disabled', true);
		var flag;
		$.getJSON('/api/get-cell',{},function(cell){
			$('#report_qco').after('<select id="report_cell" name="report_cell" '+
				'class="form-control">');
			$('#report_cell').append('<option value="0"> -- Escolha uma célula --</option>');
			$.each(cell, function(e, d){
			if (flag == "") {
				flag = d.consortium_name;
			}
			if (flag != d.consortium_name) {
				$('#report_cell').append('</optgroup>');	
				$('#report_cell').append('<optgroup label="'+d.consortium_name+'">');	
			}
			$('#report_cell').append('<option value="'+d.id+'">'+d.name+'</option>');
			flag = d.consortium_name;
			})
			$('#report_qco').after('</select>');
		});
	}else{
		$('#qco_report_pdf').prop('disabled', false);
		$('#qco_report_csv').prop('disabled', false);
	}
});

// *********************************************************************************
// Generate the dynamic fields for the view search on the QCO VIEW
// Author: Guilherme Gibosky
// Date: 22/01/2017
// *********************************************************************************
$(document).on('change','#qco_view_search', function(){
	$('#qco_search_input_div').remove();
	$('#qco_search_select_rit_div').remove();
	$('#qco_search_select_cell_div').remove();
	$('#qco_search_date_div').remove();
	var option = $('#qco_view_search').val();
	if (option == 1) {
		$.getJSON('/api/get-rit',{},function(rit){
			$('#qco_search_container').prepend('<div id="qco_search_select_rit_div" class="col-md-5"'+
				' style="margin-right: -10px; margin-left: -10px;">');
			$('#qco_search_select_rit_div').append('<select id="qco_search_rit" name="qco_search_rit" '+
				'class="form-control">');
			$('#qco_search_rit').append('<option value="0">-- Escolha um Rit --</option>');
			$.each(rit, function(e, d){
				$('#qco_search_rit').append('<option value="'+d.id+'">'+d.name+'</option>');
			})
			$('#qco_search_select_rit_div').after('</div>');
		});
	}else if(option == 2){
 		var flag;
		$.getJSON('/api/get-cell',{},function(cell){
			$('#qco_search_container').prepend('<div id="qco_search_select_cell_div" class="col-md-5"'+
				' style="margin-right: -10px; margin-left: -10px;">');
			$('#qco_search_select_cell_div').append('<select id="qco_search_cell" name="qco_search_cell" '+
				'class="form-control">');
			$('#qco_search_cell').append('<option value="0"> -- Escolha uma célula --</option>');
			$.each(cell, function(e, d){
			if (flag == "") {
				flag = d.consortium_name;
			}
			if (flag != d.consortium_name) {
				$('#qco_search_cell').append('</optgroup>');	
				$('#qco_search_cell').append('<optgroup label="'+d.consortium_name+'">');	
			}
			$('#qco_search_cell').append('<option value="'+d.id+'">'+d.name+'</option>');
			flag = d.consortium_name;
			})
			$('#qco_search_select_cell_div').after('</div>');
		});
	}else if(option == 3){
		var html_div = '<div id="qco_search_date_div" class="col-md-5"'+
		' style="margin-right: -10px; margin-left: -10px;">';
		var html_input = '<input id="qco_search_date" type="date" class="dateMask form-control"'+
		' name="validility_date"></div>';
		$('#qco_search_container').prepend(html_div);
		$('#qco_search_date_div').append(html_input);
	}else{
		var html_div = '<div id="qco_search_input_div" class="col-md-5"'+
		' style="margin-right: -10px; margin-left: -10px;">';
		var html_input = '<input id="qco_search_input" type="text" class="form-control"'+
		' placeholder="Atendimento" name="field"></div>';
		$('#qco_search_container').prepend(html_div);
		$('#qco_search_input_div').append(html_input);
	}
});

// *********************************************************************************
// Validate the fields and turn on/off the submit buttons on the QCO REPORT VIEW
// Author: Guilherme Gibosky
// Date: 22/01/2017
// *********************************************************************************
$(document).on('change','#report_rit', function(){
	var option = $('#report_rit').val();
	if (option == 0) {
		$('#qco_report_pdf').prop('disabled', true);
		$('#qco_report_csv').prop('disabled', true);
	}else{
		$('#qco_report_pdf').prop('disabled', false);
		$('#qco_report_csv').prop('disabled', false);
	}
});

$(document).on('change','#report_cell', function(){
	var option = $('#report_cell').val();
	if (option == 0) {
		$('#qco_report_pdf').prop('disabled', true);
		$('#qco_report_csv').prop('disabled', true);
	}else{
		$('#qco_report_pdf').prop('disabled', false);
		$('#qco_report_csv').prop('disabled', false);
	}
});

$(document).on('change','#report_terminals', function(){
	var option = $('#report_terminals').val();
	if (option == 0) {
		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
	}else{
		$('#line_report_pdf').prop('disabled', false);
		$('#line_report_csv').prop('disabled', false);
	}
});

$(document).on('change','#report_stations', function(){
	var option = $('#report_stations').val();
	if (option == 0) {
		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
	}else{
		$('#line_report_pdf').prop('disabled', false);
		$('#line_report_csv').prop('disabled', false);
	}
});

$(document).on('click','#qco_report_pdf_all', function(e){
	var option = $('#report_qco').val();
	var counter = $('#counter_alert').val();
	if (option == 0) {
		if (counter == 0) {
			alert("Esse relatório é extremamente custoso."+
			" O tempo para ser gerado é grande e trava todo o sistema durante sua execução.\n\n"+
			"Apesar disso, para continuar a gerar o relatório, completo clique no botão \"OK\""+
			" e depois clique no botão \"Emitir Relatório\" novamente.");
		e.preventDefault();
		$('#counter_alert').val('1');
		}
	}
});

$(document).on('click','#qco_report_csv_all', function(e){
	var option = $('#report_qco').val();
	var counter = $('#counter_alert').val();
	if (option == 0) {
		if (counter == 0) {
			alert("Esse relatório é extremamente custoso."+
			" O tempo para ser gerado é grande e trava todo o sistema durante sua execução.\n\n"+
			"Apesar disso, para continuar a gerar o relatório completo, clique no botão \"OK\""+
			" e depois clique no botão \"Emitir Excel\" novamente.");
		e.preventDefault();
		$('#counter_alert').val('1');
		}
	}
});

// *********************************************************************************
// End of validate the fields and turn on/off the submit buttons on the QCO REPORT VIEW
// *********************************************************************************


// ******************************************************************************
// End of QCO REPORT
// ******************************************************************************


// ******************************************************************************
// This part create the Modal Historic Vehicle
// ******************************************************************************
$(document).on('click','.historicModal', function(e){
	var id = this.id.split('_')['2'];
	var aux = "";
	var BRdate;
	$('#infoArea_'+id).val("Carregando as informações... aguarde!");
	$.getJSON('/api/get-historic-vehicle',{id : id},function(data){
		$.each(data, function(k, v){
			BRdate = moment(v.date).format("DD/MM/YY HH:mm:ss");
			aux = aux + v.name_status +" (" + v.name_user +") " + BRdate +"\n";
		})
		$('#infoArea_'+id).val(aux);
	});
});
// ******************************************************************************
// End of Modal Historic Vehicle
// ******************************************************************************
// End of QCO REPORT

// ******************************************************************************
// This part create and validate FLEET REPORT VIEW
// ******************************************************************************

$(document).on('change','#line_report_fleet', function(){
	$('#report_rit').remove();
	$('#report_cell').remove();
	var option = $('#line_report_fleet').val();
	if (option == 1) {
		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
		$.getJSON('/api/get-rit',{},function(rit){
			$('#line_report_fleet').after('<select id="report_rit" name="report_rit" '+
				'class="form-control">');
			$('#report_rit').append('<option value="0">-- Escolha um Rit --</option>');
			$.each(rit, function(e, d){
				$('#report_rit').append('<option value="'+d.id+'">'+d.name+'</option>');
			})
			$('#line_report_fleet').after('</select>');
		});
	}else if(option == 2){
 		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
		var flag;
		$.getJSON('/api/get-cell',{},function(cell){
			$('#line_report_fleet').after('<select id="report_cell" name="report_cell" '+
				'class="form-control">');
			$('#report_cell').append('<option value="0"> -- Escolha uma célula --</option>');
			$.each(cell, function(e, d){
			if (flag == "") {
				flag = d.consortium_name;
			}
			if (flag != d.consortium_name) {
				$('#report_cell').append('</optgroup>');	
				$('#report_cell').append('<optgroup label="'+d.consortium_name+'">');	
			}
			$('#report_cell').append('<option value="'+d.id+'">'+d.name+'</option>');
			flag = d.consortium_name;
			})
			$('#line_report_fleet').after('</select>');
		});
	}else{
		$('#line_report_pdf').prop('disabled', false);
		$('#line_report_csv').prop('disabled', false);
	}
});

$(document).on('change','#report_rit', function(){
	var option = $('#report_rit').val();
	if (option == 0) {
		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
	}else{
		$('#line_report_pdf').prop('disabled', false);
		$('#line_report_csv').prop('disabled', false);
	}
});

$(document).on('change','#report_cell', function(){
	var option = $('#report_cell').val();
	if (option == 0) {
		$('#line_report_pdf').prop('disabled', true);
		$('#line_report_csv').prop('disabled', true);
	}else{
		$('#line_report_pdf').prop('disabled', false);
		$('#line_report_csv').prop('disabled', false);
	}
});

// End of FLEET REPORT

// ******************************************************************************
// This part create the Modal Historic Vehicle
// ******************************************************************************
$(document).on('click','.historicModal', function(e){
	var id = this.id.split('_')['2'];
	var aux = "";
	$('#infoArea_'+id).val("Carregando as informações... aguarde!");
	$.getJSON('/api/get-historic-vehicle',{id : id},function(data){
		console.log(data);
		$.each(data, function(k, v){
			console.log(v.color);
			console.log(v.date);
			aux = aux + v.name_status +" (" + v.name_user +") " + v.date +"\n";
		})
		$('#infoArea_'+id).val(aux);
	});
});
// ******************************************************************************
// End of Modal Historic Vehicle
// ******************************************************************************

// *********************************************************************************
// Validate and logic for the fields from Financial Rate Module
// Author: Guilherme Gibosky
// Date: 10/03/2017
// *********************************************************************************


$("#lifespan").mask("999.999");

// Check if the tread item have protector and camara. If yes load the input fields.
// Author: Guilherme Gibosky
// Date: 10/03/2017

$(document).on('change', '#vehicle_pattern_tread', function(){
	var option = $('#vehicle_pattern_tread').val();
	var camara = '<div id="camara_div" class="form-group">'+
							'<label for="price_cam" class="col-lg-3 control-label '+
							'optional">Custo Camara (R$ - Un)</label><div class="col-lg-7">'+
							'<input type="text" name="price_cam" id="price_cam" value=""'+
							' placeholder="Preço Câmara" class="form-control"></div></div>';
	var protetor = '<div id="prot_div" class="form-group">'+
							'<label for="price_prot" class="col-lg-3 control-label'+
							' optional">Custo Protetor (R$ - Un)</label><div class="col-lg-7">'+
							'<input type="text" name="price_prot" id="price_prot" value=""'+
							' placeholder="Preço Protetor" class="form-control"></div></div>';
	$.getJSON('/api/get-itens', {type: option}, function(data){
		$('#tread_item_id').children().remove();
		$('#tread_item_id').append('<option value="'+data.tread_item_id+'">'+data.name+'</option>');
		if (data.tread_item_id == 1) {
			$("#camara_div").remove();
			$("#prot_div").remove();
		}else if(data.tread_item_id == 2) {
			$("#camara_div").remove();
			$("#prot_div").remove();
		}else if (data.tread_item_id == 3){
			$("#camara_div").remove();
			$("#prot_div").remove();
			$("#recap_div").after(camara);
			$("#camara_div").after(protetor);
		}else if (data.tread_item_id == 4){
			$("#camara_div").remove();
			$("#prot_div").remove();
		}
	});
});


// Check if the tread info is complete for the selected pattern
// Author: Guilherme Gibosky
// Date: 22/01/2017

$(document).on('change', '#vehicle_pattern_acessories', function(){
	var option = $('#vehicle_pattern_acessories').val();
	var pattern = $('#vehicle_pattern_acessories option:selected').text();
	var id = $('#hidden_id').val();
	$.getJSON('/api/check-tread-vpattern', {type: option, id: id}, function(data){
		if(data == 1){
			$('#submit_acessories').prop('disabled', false);
			$('#acessories_body').prop('disabled', false);
			$('#acessories_chassi').prop('disabled', false);
		}else{
			$('#submit_acessories').prop('disabled', true);
			$('#acessories_modal').modal();
			$('#modal_header_ev').text("Padrão "+pattern+" - Dados Incompletos");
			$('#acessories_body').prop('disabled', true);
			$('#acessories_chassi').prop('disabled', true);
		}
	});
});

// Create the Graph in Print

function getPrintRateVariable(w, h, id){
	$.getJSON("/api/get-print-data-variable", {id:id}, function(data){	
		var vis = d3.select('#visualisation_variable'),
	  WIDTH = w,
	  HEIGHT = h,
	  MARGINS = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 50
	  },

	  xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1)
	  .domain(data.map(function(d) {return d.x;}));

	  yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom])
	  .domain([0,d3.max(data, function(d) {return d.y;})]);

	  xAxis = d3.svg.axis()
	    .scale(xRange)
	    .tickSize(5)
	    .tickSubdivide(true);

	  yAxis = d3.svg.axis()
	    .scale(yRange)
	    .tickSize(5)
	    .orient("left")
	    .tickSubdivide(true);

	  vis.append('svg:g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
	    .call(xAxis);

	  vis.append('svg:g')
	    .attr('class', 'y axis')
	    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
	    .call(yAxis);

	  vis.selectAll('rect')
	  .data(data)
	  .enter()
	  .append('rect')
	  .attr('x', function(d) {
	    return xRange(d.x);
	  })
	  .attr('y', function(d) {
	    return yRange(d.y);
	  })
	  .attr('width', xRange.rangeBand())
	  .attr('height', function(d) {
	    return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
	  })
	  .attr('fill', 'grey')
	  .on('mouseover', function(d) {
	    d3.select(this)
	      .attr('fill', 'blue');
	  })
	  .on('mouseout', function(d) {
	    d3.select(this)
	      .attr('fill', 'grey');
	  });

	  vis.append("text")
	  .attr("x", (WIDTH / 2))             
	  .attr("y", 0 - (MARGINS.top / 2) +25)
	  .attr("text-anchor", "middle")  
	  .style("font-size", "15px") 
	  .style("text-decoration", "underline")  
	  .text("Variável");
	});	
}

function getPrintRateFix(w, h, id){
	$.getJSON("/api/get-print-data-variable", {id:id}, function(data){	
		var vis = d3.select('#visualisation_fix'),
	  WIDTH = w,
	  HEIGHT = h,
	  MARGINS = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 50
	  },

	  xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1)
	  .domain(data.map(function(d) {return d.x;}));

	  yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom])
	  .domain([0,d3.max(data, function(d) {return d.y;})]);

	  xAxis = d3.svg.axis()
	    .scale(xRange)
	    .tickSize(5)
	    .tickSubdivide(true);

	  yAxis = d3.svg.axis()
	    .scale(yRange)
	    .tickSize(5)
	    .orient("left")
	    .tickSubdivide(true);

	  vis.append('svg:g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
	    .call(xAxis);

	  vis.append('svg:g')
	    .attr('class', 'y axis')
	    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
	    .call(yAxis);

   
	  vis.selectAll('rect')
	  .data(data)
	  .enter()
	  .append('rect')
	  .attr('x', function(d) {
	    return xRange(d.x);
	  })
	  .attr('y', function(d) {
	    return yRange(d.y);
	  })
	  .attr('width', xRange.rangeBand())
	  .attr('height', function(d) {
	    return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
	  })
	  .attr('fill', 'grey')
	  .on('mouseover', function(d) {
	    d3.select(this)
	      .attr('fill', 'blue');
	  })
	  .on('mouseout', function(d) {
	    d3.select(this)
	      .attr('fill', 'grey');
	  });

   vis.append("text")
	  .attr("x", (WIDTH / 2))             
	  .attr("y", 0 - (MARGINS.top / 2) +25)
	  .attr("text-anchor", "middle")  
	  .style("font-size", "15px") 
	  .style("text-decoration", "underline")  
	  .text("Fixo");
	})	;
}

function getPrintRateTotal(w, h, id){
	$.getJSON("/api/get-print-data-variable", {id: id}, function(data){	
		var vis = d3.select('#visualisation'),
	  WIDTH = w,
	  HEIGHT = h,
	  MARGINS = {
	    top: 20,
	    right: 20,
	    bottom: 20,
	    left: 50
	  },

	  xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1)
	  .domain(data.map(function(d) {return d.x;}));

	  yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom])
	  .domain([0,d3.max(data, function(d) {return d.y;})]);

	  xAxis = d3.svg.axis()
	    .scale(xRange)
	    .tickSize(5)
	    .tickSubdivide(true);

	  yAxis = d3.svg.axis()
	    .scale(yRange)
	    .tickSize(5)
	    .orient("left")
	    .tickSubdivide(true);

	  vis.append('svg:g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
	    .call(xAxis);

	  vis.append('svg:g')
	    .attr('class', 'y axis')
	    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
	    .call(yAxis);

	  vis.selectAll('rect')
	  .data(data)
	  .enter()
	  .append('rect')
	  .attr('x', function(d) {
	    return xRange(d.x);
	  })
	  .attr('y', function(d) {
	    return yRange(d.y);
	  })
	  .attr('width', xRange.rangeBand())
	  .attr('height', function(d) {
	    return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
	  })
	  .attr('fill', 'grey')
	  .on('mouseover', function(d) {
	    d3.select(this)
	      .attr('fill', 'blue');
	  })
	  .on('mouseout', function(d) {
	    d3.select(this)
	      .attr('fill', 'grey');
	  });

	  vis.append("text")
	  .attr("x", (WIDTH / 2))             
	  .attr("y", 0 - (MARGINS.top / 2) +25)
	  .attr("text-anchor", "middle")  
	  .style("font-size", "15px") 
	  .style("text-decoration", "underline")  
	  .text("Total");
	})	;
}

// group function to print all graphs

function getDataPrintRate(){
	var pathname = window.location.pathname.split("/");
	if (pathname['1'] = 'rate-calculation' && pathname['2'] == 'print') {
		id = pathname['4'];
		console.log(id);
		var w = 350;
		var h = 200;
		getPrintRateVariable(w, h, id);
		getPrintRateFix(w, h, id);
		getPrintRateTotal(w, h, id);	
	}
}

getDataPrintRate(); // call for the graph print.


$("input[name=if_clone]").on('click', function(e){
	var value = $("input[name=if_clone]:radio:checked").attr('value');
	console.log(value);
	if (value == 1) {
		$("#form_system_year").slideDown( "slow" );
		$("#year_system").prop('disabled', false);
		$("#year").prop('disabled', false);
		$("#form-year").slideUp( "slow" );
	}else{
		$("#year").prop('disabled', false);
		$("#submit").prop('disabled', false);
		$("#form-year").slideDown( "slow" );
		$("#form_system_year").slideUp( "slow" );
		$("#year_system").val('0');
		$("#year_clone").prop('disabled', true);
		$("#arrow_clone_year").css('color','#0a0a0a');

	}
});

$("#year_system").on('change', function(e){
	var value = $("#year_system").val();
	if (value != 0){
		$("#year_clone").prop('disabled', false);
		$("#submit").prop('disabled', false);
		$("#arrow_clone_year").css('color','#468847');
	}else{
		$("#arrow_clone_year").css('color','#0a0a0a');
		$("#year_clone").prop('disabled', true)
		$("#submit").prop('disabled', true)
	}
});

function showAndEnable(letter){
	var letters = ['a', 'b', 'c', 'd'];
	var i = 0;
	for(i; i < letters.length; i++){
		if (letter == letters[i]){
			$("#group_"+letter).slideDown("slow");
			$(".group_"+letter).prop('disabled', false)
		}else{
			$("#group_"+letters[i]).slideUp("slow");
			$(".group_"+letters[i]).prop('disabled', true);
		}
	}
}

$("#group_social").on('change', function(e){
	var value = $("#group_social").val();
	if (value == 0){
		showAndEnable('a');
	}else if (value == 1){
		showAndEnable('b');
	}else if (value == 2){
		showAndEnable('c');
	}else{
		showAndEnable('d');
	}
});


$(".social_header").popover({
	placement : 'top',
	trigger : 'hover',
	title : $(this).attr("data-title"),
	content : $(this).attr("data-content")
});

$(".dimension_header").popover({
	placement : 'top',
	trigger : 'hover',
	title : $(this).attr("data-title"),
	content : $(this).attr("data-content")
});

function saveData(tax, year){
	toastr.options = {
			  "closeButton": true,
			  "debug": false,
			  "newestOnTop": false,
			  "progressBar": true,
			  "positionClass": "toast-top-right",
			  "preventDuplicates": false,
			  "onclick": null,
			  "showDuration": "500",
			  "hideDuration": "1000",
			  "timeOut": "3000",
			  "extendedTimeOut": "1000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
	};
	$.ajax({
	  type: "POST",
	  url: "/api/save-capital-tax-correction",
	  data: { tax: tax, year: year},
	  success:function( msg ) {
	  	if (msg == 0) {
	  		toastr.warning('Erro. Confira os dados preenchido e tente novamente');
	  	}else{
		   toastr.success('Dados Salvo com Sucesso');
		   $('.cap_correction').text(tax.replace('.', ','));
	  	}
	  },
	  error:function(msg){
	  	toastr.warning('Erro. Confira os dados preenchido e tente novamente');
	  }
 	});
}

$("#btn_cap_correction_tax").on('click', function(e){
	$("#btn_cap_correction_tax").prop('disabled', 'true');
	setTimeout(function(){
		$('#btn_cap_correction_tax').removeAttr('disabled');;
	}, 3000);
	var tax = $("#cap_correction_tax").val();
	var year = window.location.pathname.split("/")['4'];
	saveData(tax, year);

});



// $(document).on('keyup', '#price', function(price, e, field){
// 	var counter = ($(this).val().length);
// 	$(this).mask('999,99');
// 	if (counter > 5)
// 		$(this).mask('9.999,99');
// })

// ******************************************************************************
// Administration module - Lucas Naves
// ******************************************************************************
$('#consId').change(function(){
	$('#consId').css('border-color','green').popover('destroy')

	$('#consortiumCom').val("");
	$.getJSON('/administration/get-communication/id/'+this.value, { }, function(data){
	$('#consortiumCom').empty();
    if (data.length == 0) {
      $('#consortiumCom').append("<option value='-1'> -- Não possui nenhuma célula -- </option>"); 
    }else{
      $('#consortiumCom').append("<option value=''> -- Selecione uma célula -- </option>");
    }
    $.each(data, function(index,item) {
        $('#consortiumCom').append("<option value=" + item.id + ">" + item.celula +" - "+ item.name +"</option>");
    });
  });
});


// ******************************************************************************
// Testes de mascaras - Lucas Naves - 30/03/2017
// ******************************************************************************


 //  function maskCnpj(cnpj, mask){

	//   var campo = cnpj.value.length;
	//   var saida = mask.substring(0,1);
	//   var text = mask.substring(campo);

	//   if(text.substring(0,1) != saida){

	//     cnpj.value += text.substring(0,1);
	//   }
	// }

	function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
	}

	function execmascara(){
    v_obj.value=v_fun(v_obj.value)
	}

	function cnpjMask(v){
    v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/,"$1.$2")             //Coloca ponto entre o segundo e o terceiro dígitos
    v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3") //Coloca ponto entre o quinto e o sexto dígitos
    v=v.replace(/\.(\d{3})(\d)/,".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    v=v.replace(/(\d{4})(\d)/,"$1-$2")              //Coloca um hífen depois do bloco de quatro dígitos
    return v
	}

	function inscriçãoEsta(v){
    v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
    v=v.replace(/^(\d{3})(\d)/,"$1.$2")             //Coloca ponto entre o terceiro e o quarto dígitos
    v=v.replace(/^(\d{3})\.(\d{3})(\d)/,"$1.$2.$3") //Coloca ponto entre o sexto e o setimo dígitos
    v=v.replace(/\.(\d{3})(\d)/,".$1/$2")           //Coloca uma barra entre o oitavo e o nono dígitos
    return v
	}

	function cepMask(v){
    v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
    v=v.replace(/(\d{5})(\d)/,"$1-$2")          //Coloca um traço entre o quinto e o sexto dígitos
    return v
	}


// **************************************************************************************************
// Função que ao clicar na linha de uma tabela direciona para outa pagina - Lucas Naves - 11/04/2017
// **************************************************************************************************
	$(document).ready(function(){
    $('#clickLine').click(function(){
        window.location = $(this).data('url');
        returnfalse;
    });
	});

// verificar se já existe um atendimento. Lucas Naves 


$('#communication').change(function(event){
	var communication = $('#communication').val();
		$.ajax({
	    type: "POST",
	    url: "/administration/check-attendance",
	    data: {communication : communication}
	  }).done(function (data){
			var communication = data;
			if (communication == 1) {
				$('#communication').css('border-color','red');
				$('#communication').popover({title: "Inválido", content: "Já existe no sistema", trigger: "hover"});
				$('#submit_attendance').prop("disabled",true);
				$('#check_communication').val("1");
			}else{
				$('#communication').css('border-color','green').popover("destroy");
				$('#check_communication').val("0");
				checkAttendanceSucesso();
			};
	  });
});

function checkAttendanceSucesso(){
	var communication = $('#check_communication').val();
	if (communication == "0") {
		$('#submit_attendance').prop("disabled",false);
	};
};

// Put the placeholder on input if is empty, and show h4 if input is filled
// Author: Guilherme Gibosky
// Date: 23/05/2017

$('#block_justify').on('keyup', function(e){
	var text = $('#block_justify').val();
	if (text != "") {
		$("#h4_block").slideDown('slow');
		$('#block_justify').prop('placeholder', '');
		$('#btn_block_vis').prop('disabled', false);
	}else{
		$("#h4_block").slideUp('slow');
		$('#block_justify').prop('placeholder', 'Tem certeza que deseja bloquear o veículo'+
			'(seja por reprovação do laudo de vistoria ou alguma iregularidade de vistória em campo)'+
			' e enviá-lo para a SETOP?');
		$('#btn_block_vis').prop('disabled', true);
	}
});

$(".lock_msg_modal").on('click', function(e){
	var id = $(".lock_msg_modal").val();
	$.ajax({
	    type: "POST",
	    url: "/api/get-just-block",
	    data: {id : id}
  }).done(function (data){
  	$('#jus_block_textarea').val(data);	
  	$('#jus_block_textarea').prop('disabled', true);	
	});
});
