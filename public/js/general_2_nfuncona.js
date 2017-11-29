
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
	

/**  Message Module Functions **/


	/**
     * Typeahead que retorna o usuario da mensagem
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
