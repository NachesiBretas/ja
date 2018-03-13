
// PARA CONTROLAR O BOTÃO DE VERIFICAR O TERMO DE CONCILIAÇÃO
$("#verificaDocumento").keyup(function(){
    $("#verificar").attr("disabled", false);
});


$("#verificar").click(function(){
        $.ajax({
            url: 'conflicts/verifica-caso',
            type: 'POST',
            data: {valor: $('#verificaDocumento').val() },
            success: function(data){

                if(data == 1){
                    $('#blocoResultVerificacaoInvalido').hide();
                    $('#blocoResultVerificacaoValido').show();
                }
                else{
                    $('#blocoResultVerificacaoValido').hide();
                    $('#blocoResultVerificacaoInvalido').show();
                }
            }// fim success ajax preços

        }); // FIM AJAX PREÇOS

});
//////////////////////////////////////////////////////////


// PARA CONTROLAR OS BOTÕES CONTINUAR DOS FORMS
$("#continuarCid").click(function(){
    // testar se o accept_terms_cid is checked
    $('#primeiroFormCid').hide();
    $('#segundoFormCid').show();
});


$("#continuarEmp").click(function(){
    $('#primeiroFormEmp').hide();
    $('#segundoFormEmp').show();
});


$("#continuarAdv").click(function(){
    $('#primeiroFormAdv').hide();
    $('#segundoFormAdv').show();
});
////////////////////////////////////////////////////////



// PARA CONTROLAR OS BOTÕES DE SIMULAÇÃO DE CUSTO/////////////////////////////////////////////////////////////////////////////////
$("#simulacao_cid").keyup(function(){
    $("#simular_custo_cid").attr("disabled", false);
});


$("#simular_custo_cid").click(function(){
    $('#blocoSimulacaoCid').show();

    //$('#taxa_registro').text($('#cupom_cid').val());
    if($('#cupom_cid').val() != ''){
        $.ajax({
            url: 'conflicts/verifica-cupom',
            type: 'POST',
            data: { cupom: $('#cupom_cid').val() },
            success: function(data){
                var posicaoi = data.indexOf("<#");
                var posicaof = data.indexOf("#>");
                var result = data.substring(posicaoi+2, posicaof);

                console.log('hh',result.replace(/^\s+|\s+$/g,""));

                if(result.replace(/^\s+|\s+$/g,"") != 'us' && result.replace(/^\s+|\s+$/g,"") != 'ne'){
                    //alert('Este cupom existe!');
                    $.ajax({
                        url: 'conflicts/calcula-preco',
                        type: 'POST',
                        data: { desconto: result.replace(/^\s+|\s+$/g,"") , valor: $('#simulacao_cid').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro').text(taxa_registro);
                            $('#taxa_adm').text(taxa_adm);
                            $('#taxa_final').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
                else if(result.replace(/^\s+|\s+$/g,"") == 'us'){
                    alert('Este cupom já foi usado!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_cid').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro').text(taxa_registro.toFix(2));
                            $('#taxa_adm').text(taxa_adm.toFix(2));
                            $('#taxa_final').text(honorario.toFix(2));
                        }// fim success ajax preços
                    }); // FIM AJAX PREÇOS
                }
                else{
                    alert('Este cupom não existe!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_cid').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro').text(taxa_registro);
                            $('#taxa_adm').text(taxa_adm);
                            $('#taxa_final').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
            }// fim success do ajax de cupom

        }); // FIM AJAX CUPOM
    } //fim if se tem cupom
    else{
        $.ajax({
            url: 'conflicts/calcula-preco',
            type: 'POST',
            data: { desconto: 0 , valor: $('#simulacao_cid').val() },
            success: function(data){
                var pireg = data.indexOf("<treg");
                var pfreg = data.indexOf("treg>");
                var taxa_registro = data.substring(pireg+5, pfreg);

                var piadm = data.indexOf("<tadm");
                var pfadm = data.indexOf("tadm>");
                var taxa_adm = data.substring(piadm+5, pfadm);

                var pihon = data.indexOf("<hon");
                var pfhon = data.indexOf("hon>");
                var honorario = data.substring(pihon+4, pfhon);
                
                $('#taxa_registro').text(taxa_registro);
                $('#taxa_adm').text(taxa_adm);
                $('#taxa_final').text(honorario);
            }// fim success ajax preços
        }); // FIM AJAX PREÇOS
    }

}); // fim click simular_custo_cid


$("#simulacao_emp").keyup(function(){
    $("#simular_custo_emp").attr("disabled", false);
});


$("#simular_custo_emp").click(function(){
    $('#blocoSimulacaoEmp').show();

    //$('#taxa_registro').text($('#cupom_cid').val());
    if($('#cupom_emp').val() != ''){
        $.ajax({
            url: 'conflicts/verifica-cupom',
            type: 'POST',
            data: { cupom: $('#cupom_emp').val() },
            success: function(data){
                var posicaoi = data.indexOf("<#");
                var posicaof = data.indexOf("#>");
                var result = data.substring(posicaoi+2, posicaof);

                console.log('hh',result.replace(/^\s+|\s+$/g,""));

                if(result.replace(/^\s+|\s+$/g,"") != 'us' && result.replace(/^\s+|\s+$/g,"") != 'ne'){
                    //alert('Este cupom existe!');
                    $.ajax({
                        url: 'conflicts/calcula-preco',
                        type: 'POST',
                        data: { desconto: result.replace(/^\s+|\s+$/g,"") , valor: $('#simulacao_emp').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro1').text(taxa_registro);
                            $('#taxa_adm1').text(taxa_adm);
                            $('#taxa_final1').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
                else if(result.replace(/^\s+|\s+$/g,"") == 'us'){
                    alert('Este cupom já foi usado!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_emp').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro1').text(taxa_registro.toFix(2));
                            $('#taxa_adm1').text(taxa_adm.toFix(2));
                            $('#taxa_final1').text(honorario.toFix(2));
                        }// fim success ajax preços
                    }); // FIM AJAX PREÇOS
                }
                else{
                    alert('Este cupom não existe!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_emp').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro1').text(taxa_registro);
                            $('#taxa_adm1').text(taxa_adm);
                            $('#taxa_final1').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
            }// fim success do ajax de cupom

        }); // FIM AJAX CUPOM
    } //fim if se tem cupom
    else{
        $.ajax({
            url: 'conflicts/calcula-preco',
            type: 'POST',
            data: { desconto: 0 , valor: $('#simulacao_emp').val() },
            success: function(data){
                var pireg = data.indexOf("<treg");
                var pfreg = data.indexOf("treg>");
                var taxa_registro = data.substring(pireg+5, pfreg);

                var piadm = data.indexOf("<tadm");
                var pfadm = data.indexOf("tadm>");
                var taxa_adm = data.substring(piadm+5, pfadm);

                var pihon = data.indexOf("<hon");
                var pfhon = data.indexOf("hon>");
                var honorario = data.substring(pihon+4, pfhon);
                
                $('#taxa_registro1').text(taxa_registro);
                $('#taxa_adm1').text(taxa_adm);
                $('#taxa_final1').text(honorario);
            }// fim success ajax preços
        }); // FIM AJAX PREÇOS
    }
});


$("#simulacao_adv").keyup(function(){
    $("#simular_custo_adv").attr("disabled", false);
});


$("#simular_custo_adv").click(function(){
    $('#blocoSimulacaoAdv').show();
});


$("#simulacao_arb").keyup(function(){
    $("#simular_custo_arb").attr("disabled", false);
});


$("#simular_custo_arb").click(function(){
    $('#blocoSimulacaoArb').show();

    if($('#cupom_arb').val() != ''){
        $.ajax({
            url: 'conflicts/verifica-cupom',
            type: 'POST',
            data: { cupom: $('#cupom_arb').val() },
            success: function(data){
                var posicaoi = data.indexOf("<#");
                var posicaof = data.indexOf("#>");
                var result = data.substring(posicaoi+2, posicaof);

                console.log('hh',result.replace(/^\s+|\s+$/g,""));

                if(result.replace(/^\s+|\s+$/g,"") != 'us' && result.replace(/^\s+|\s+$/g,"") != 'ne'){
                    //alert('Este cupom existe!');
                    $.ajax({
                        url: 'conflicts/calcula-preco',
                        type: 'POST',
                        data: { desconto: result.replace(/^\s+|\s+$/g,"") , valor: $('#simulacao_arb').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro4').text(taxa_registro);
                            $('#taxa_adm4').text(taxa_adm);
                            $('#taxa_final4').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
                else if(result.replace(/^\s+|\s+$/g,"") == 'us'){
                    alert('Este cupom já foi usado!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_arb').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro4').text(taxa_registro.toFix(2));
                            $('#taxa_adm4').text(taxa_adm.toFix(2));
                            $('#taxa_final4').text(honorario.toFix(2));
                        }// fim success ajax preços
                    }); // FIM AJAX PREÇOS
                }
                else{
                    alert('Este cupom não existe!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_arb').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro4').text(taxa_registro);
                            $('#taxa_adm4').text(taxa_adm);
                            $('#taxa_final4').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
            }// fim success do ajax de cupom

        }); // FIM AJAX CUPOM
    } //fim if se tem cupom
    else{
        $.ajax({
            url: 'conflicts/calcula-preco',
            type: 'POST',
            data: { desconto: 0 , valor: $('#simulacao_arb').val() },
            success: function(data){
                var pireg = data.indexOf("<treg");
                var pfreg = data.indexOf("treg>");
                var taxa_registro = data.substring(pireg+5, pfreg);

                var piadm = data.indexOf("<tadm");
                var pfadm = data.indexOf("tadm>");
                var taxa_adm = data.substring(piadm+5, pfadm);

                var pihon = data.indexOf("<hon");
                var pfhon = data.indexOf("hon>");
                var honorario = data.substring(pihon+4, pfhon);
                
                $('#taxa_registro4').text(taxa_registro);
                $('#taxa_adm4').text(taxa_adm);
                $('#taxa_final4').text(honorario);
            }// fim success ajax preços
        }); // FIM AJAX PREÇOS
    }
});

$("#simulacao_nj").keyup(function(){
    $("#simular_custo_nj").attr("disabled", false);
});


$("#simular_custo_nj").click(function(){
    $('#blocoSimulacaoNJ').show();

        if($('#cupom_nj').val() != ''){
        $.ajax({
            url: 'conflicts/verifica-cupom',
            type: 'POST',
            data: { cupom: $('#cupom_nj').val() },
            success: function(data){
                var posicaoi = data.indexOf("<#");
                var posicaof = data.indexOf("#>");
                var result = data.substring(posicaoi+2, posicaof);

                console.log('hh',result.replace(/^\s+|\s+$/g,""));

                if(result.replace(/^\s+|\s+$/g,"") != 'us' && result.replace(/^\s+|\s+$/g,"") != 'ne'){
                    //alert('Este cupom existe!');
                    $.ajax({
                        url: 'conflicts/calcula-preco',
                        type: 'POST',
                        data: { desconto: result.replace(/^\s+|\s+$/g,"") , valor: $('#simulacao_nj').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro2').text(taxa_registro);
                            $('#taxa_adm2').text(taxa_adm);
                            $('#taxa_final2').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
                else if(result.replace(/^\s+|\s+$/g,"") == 'us'){
                    alert('Este cupom já foi usado!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_nj').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro2').text(taxa_registro.toFix(2));
                            $('#taxa_adm2').text(taxa_adm.toFix(2));
                            $('#taxa_final2').text(honorario.toFix(2));
                        }// fim success ajax preços
                    }); // FIM AJAX PREÇOS
                }
                else{
                    alert('Este cupom não existe!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_nj').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro2').text(taxa_registro);
                            $('#taxa_adm2').text(taxa_adm);
                            $('#taxa_final2').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
            }// fim success do ajax de cupom

        }); // FIM AJAX CUPOM
    } //fim if se tem cupom
    else{
        $.ajax({
            url: 'conflicts/calcula-preco',
            type: 'POST',
            data: { desconto: 0 , valor: $('#simulacao_nj').val() },
            success: function(data){
                var pireg = data.indexOf("<treg");
                var pfreg = data.indexOf("treg>");
                var taxa_registro = data.substring(pireg+5, pfreg);

                var piadm = data.indexOf("<tadm");
                var pfadm = data.indexOf("tadm>");
                var taxa_adm = data.substring(piadm+5, pfadm);

                var pihon = data.indexOf("<hon");
                var pfhon = data.indexOf("hon>");
                var honorario = data.substring(pihon+4, pfhon);
                
                $('#taxa_registro2').text(taxa_registro);
                $('#taxa_adm2').text(taxa_adm);
                $('#taxa_final2').text(honorario);
            }// fim success ajax preços
        }); // FIM AJAX PREÇOS
    }
});


$("#simulacao_j").keyup(function(){
    $("#simular_custo_j").attr("disabled", false);
});


$("#simular_custo_j").click(function(){
    $('#blocoSimulacaoJ').show();

    if($('#cupom_j').val() != ''){
        $.ajax({
            url: 'conflicts/verifica-cupom',
            type: 'POST',
            data: { cupom: $('#cupom_j').val() },
            success: function(data){
                var posicaoi = data.indexOf("<#");
                var posicaof = data.indexOf("#>");
                var result = data.substring(posicaoi+2, posicaof);

                console.log('hh',result.replace(/^\s+|\s+$/g,""));

                if(result.replace(/^\s+|\s+$/g,"") != 'us' && result.replace(/^\s+|\s+$/g,"") != 'ne'){
                    //alert('Este cupom existe!');
                    $.ajax({
                        url: 'conflicts/calcula-preco',
                        type: 'POST',
                        data: { desconto: result.replace(/^\s+|\s+$/g,"") , valor: $('#simulacao_j').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro3').text(taxa_registro);
                            $('#taxa_adm3').text(taxa_adm);
                            $('#taxa_final3').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
                else if(result.replace(/^\s+|\s+$/g,"") == 'us'){
                    alert('Este cupom já foi usado!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_j').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro3').text(taxa_registro.toFix(2));
                            $('#taxa_adm3').text(taxa_adm.toFix(2));
                            $('#taxa_final3').text(honorario.toFix(2));
                        }// fim success ajax preços
                    }); // FIM AJAX PREÇOS
                }
                else{
                    alert('Este cupom não existe!');

                    $.ajax({
                    url: 'conflicts/calcula-preco',
                    type: 'POST',
                    data: { desconto: 0 , valor: $('#simulacao_j').val() },
                        success: function(data){
                            var pireg = data.indexOf("<treg");
                            var pfreg = data.indexOf("treg>");
                            var taxa_registro = data.substring(pireg+5, pfreg);

                            var piadm = data.indexOf("<tadm");
                            var pfadm = data.indexOf("tadm>");
                            var taxa_adm = data.substring(piadm+5, pfadm);

                            var pihon = data.indexOf("<hon");
                            var pfhon = data.indexOf("hon>");
                            var honorario = data.substring(pihon+4, pfhon);
                            
                            $('#taxa_registro3').text(taxa_registro);
                            $('#taxa_adm3').text(taxa_adm);
                            $('#taxa_final3').text(honorario);
                        }// fim success ajax preços

                    }); // FIM AJAX PREÇOS
                }
            }// fim success do ajax de cupom

        }); // FIM AJAX CUPOM
    } //fim if se tem cupom
    else{
        $.ajax({
            url: 'conflicts/calcula-preco',
            type: 'POST',
            data: { desconto: 0 , valor: $('#simulacao_j').val() },
            success: function(data){
                var pireg = data.indexOf("<treg");
                var pfreg = data.indexOf("treg>");
                var taxa_registro = data.substring(pireg+5, pfreg);

                var piadm = data.indexOf("<tadm");
                var pfadm = data.indexOf("tadm>");
                var taxa_adm = data.substring(piadm+5, pfadm);

                var pihon = data.indexOf("<hon");
                var pfhon = data.indexOf("hon>");
                var honorario = data.substring(pihon+4, pfhon);
                
                $('#taxa_registro3').text(taxa_registro);
                $('#taxa_adm3').text(taxa_adm);
                $('#taxa_final3').text(honorario);
            }// fim success ajax preços
        }); // FIM AJAX PREÇOS
    }
});


function moeda(z){
v = z.value;
v=v.replace(/\D/g,"") // permite digitar apenas numero
v=v.replace(/(\d{1})(\d{14})$/,"$1.$2") // coloca ponto antes dos ultimos digitos
v=v.replace(/(\d{1})(\d{11})$/,"$1.$2") // coloca ponto antes dos ultimos 11 digitos
v=v.replace(/(\d{1})(\d{8})$/,"$1.$2") // coloca ponto antes dos ultimos 8 digitos
v=v.replace(/(\d{1})(\d{5})$/,"$1.$2") // coloca ponto antes dos ultimos 5 digitos
v=v.replace(/(\d{1})(\d{1,2})$/,"$1,$2") // coloca virgula antes dos ultimos 2 digitos
z.value = v;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// PARA CONTROLAR O 2 FORM ADV

$("#tipo_conflito").change(function(){
    //console.log($("#user_type_adv").val(),'hhhhh');

	if($("#tipo_conflito").val() == 1){
        //alert($("#user_type_adv").val());
        if($("#user_type_adv").val() == 2){
            $('#blocoJud').hide();
            $('#blocoNJud').hide();

            $('#blocoNJud2').hide(); 
            $('#blocoJud2').show();
        }
        else{
            $('#blocoNJud2').hide(); 
            $('#blocoJud2').hide();

        	$('#blocoNJud').hide();	
        	$('#blocoJud').show();
        }
	}
	else{
        //alert($("#user_type_adv").val());

        if($("#user_type_adv").val() == 2){
            $('#blocoJud').hide();
            $('#blocoNJud').hide();

            $('#blocoJud2').hide();
            $('#blocoNJud2').show();
        }
        else{
            $('#blocoJud2').hide();
            $('#blocoNJud2').hide();

    		$('#blocoJud').hide();
    		$('#blocoNJud').show();
        }	
	}
});
////////////////////////////////////////////////////////////////////////////////




/////////// RECAPTCHA /////////////////////////////////////////////////////////////

// $("#accept_terms_cid").change(function(){
//     $('#captchaModal').modal();
// });

// $("#accept_terms_emp").change(function(){
//     $('#captchaModal').modal();
// });

// $("#accept_terms_adv").change(function(){ 
//      $('#captchaModal').modal();
// });

// $("#accept_terms_arb").change(function(){
//      $('#captchaModal').modal();
// });


// $("#ok_captcha").click(function(){
//      // preencher alguma variavel pra ver se retornou valido ou nao
// });

//comecei a mexer aqui - Lucas Naves
$(".captcha").click(function(){

    $("#captchaModal").show();
    $("html,body").css({"overflow":"hidden"});
});

$("#ok").click(function(){
    $("#captchaModal").hide();
    $("html,body").css({"overflow":"auto"});
});

$("#closeCaptcha").click(function(){
    $("#captchaModal").hide();
    $("html,body").css({"overflow":"auto"});
});

///////////////////////////////////////////////////////////////////////////////////
// controle de modais.

$(".fechar").click(function(){
    $("#politicaModal").hide();
    $("html,body").css({"overflow":"auto"});
});
//cidadao 
$(".abrirCidadao").click(function(){
    $("#cadastroCidadaoModal").show();
    $("html,body").css({"overflow":"hidden"});
});
$(".fechar_cidadao1").click(function(){
    $("#cadastroCidadaoModal").hide();
    $('.abrirCidadao1').prop('hidden', false);
      $('.abrirCidadao2').prop('hidden', true);
    $("html,body").css({"overflow":"auto"});
});

//empresa 
$(".abrirEmpresa").click(function(){
    $("#cadastroEmpresaModal").show();
    $("html,body").css({"overflow":"hidden"});
});
$(".fechar_empresa").click(function(){
    $("#cadastroEmpresaModal").hide();
    $('.abrirEmpresa1').prop('hidden', false);
      $('.abrirEmpresa2').prop('hidden', true);
    $("html,body").css({"overflow":"auto"});
});

$("#politica1").click(function(){
      $('#esconderPolitica').prop('hidden', true);
      $('#atualizarPolitica').prop('hidden', false);
      $('#Xesconder').prop('hidden', true);
      $('#Xatualizar').prop('hidden', false);
});


$(".atualizar").click(function(){
    window.location = "/index";

});


//Mascaras de campos imput 
$(document).ready(function(){
    $(".cell").mask("(99) 99999-9999");
    $(".tel_casa").mask("(99) 9999-9999");
    $(".cpf").mask("999.999.999-99"); 
    $(".cep").mask("99999-999");  
  $(".cnpj").mask("99.999.999/9999-99");    
    $('.help').tooltip();
  $(".dateMask").mask("99/99/9999");
  $(".hourMask").mask("99:99");  
  $(".oab").mask("999.999/aa");
  $(".cpfcnpj").mask("");
});

// Verificar se o usuario ecolheu pessoa juridica ou fisica se for pessoa juridica mascara de cnpj se nao mascara de cpf
$('#tp_op').change(function(){
    var x = $('#tp_op').val();
    if (x == 'juridica') {
      $('#inputCnpj').prop('hidden', false);
      $('#inputCpf').prop('hidden', true);
    }else if(x == 'fisica'){
      $('#inputCnpj').prop('hidden', true);
      $('#inputCpf').prop('hidden', false);
    }else{
      $('#inputCnpj').prop('hidden', true);
      $('#inputCpf').prop('hidden', true);
    }
});
//Mascara para deixar digitar apenas numeros e que funciona com maxlength
function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
  }

  function execmascara(){
    v_obj.value=v_fun(v_obj.value)
  }
  function soNumber(v){
    v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
    return v
  }
  function phone(v){
    v=v.replace(/\D/g,"")                           //Remove tudo o que não é dígito
    v=v.replace(/(\d{0})(\d)/,"$1($2")            //Abre o parentes antes de qualquer digito
     v=v.replace(/(\d{2})(\d)/,"$1)$2")          //Fecha o parentes depois do 2 digito 
    return v
  }

//Inicio da Validação de campos 

// $('#cidadao_nome').keyup(function(){
//     var value = $('#cidadao_nome').val();
//     if(value.length != "") {
//       $('.submit').prop('disabled', false);
//     }else if(value.length == "" & $('#cidadao_email').val() == ""){
//       $("#cidadao_nome").css('border','solid 2px red');
//       $('.submit').prop('disabled', true);
//     }
//   })

// validação dos formularios de cidadao 
$('#accept_terms_cid').bind('change',function(){
    var value = $('#cidadao_nome').val();
    if($('#accept_terms_cid').is(':checked')== true & value.length != "" & $('#cidadao_email').val() != "" & $('#cidadao_phone').val() != "" & $('#cidadao_cpf').val() != "" & $('#cidadao_senha1').val() != "" & $('#logradouro').val() != "" & $('#num_logradouro').val() != "" & $('#bairro').val() != "" & $('#uf').val() != "" & $('#cidade').val() != "") {
      
      $('#continuarCid').prop('disabled', false);
        $('#preencher').prop('hidden', true);
    }else if($(this).is(':checked')== false & value.length == "" & $('#cidadao_email').val() == "" & $('#cidadao_phone').val() == "" & $('#cidadao_cpf').val() == "" & $('#cidadao_senha1').val() == "" & $('#logradouro').val() == "" & $('#num_logradouro').val() == "" & $('#bairro').val() == "" & $('#uf').val() == "" & $('#cidade').val() == "") {
      $('#continuarCid').prop('disabled', true);
      $('#preencher').prop('hidden', false);
    }else{
        $('#continuarCid').prop('disabled', true);
        $('#preencher').prop('hidden', false);
    }
  })

//Exemplo
  // $('#accept_terms_cid').bind('change',function(){
  //   // alert('Checkbox checado?'+ $(this).is(':checked'));
  //   if ($(this).is(':checked')== true) {
  //     $('#continuarCid').prop('disabled', false);
  //         $('#preencher').prop('hidden', true);
  //   }else{
  //     $('#continuarCid').prop('disabled', true);
  //     $('#preencher').prop('hidden', false);
  //   }
  //   //Seu ajax aqui
  // })

$('#cidForm').keyup(function(){
    var value = $('#cidadao_desc_conflito').val();
    if(value.length != "" & $('#cidadao_desc_resolucao_conflito').val() != "" & $('#nome_op').val() != "" & $('#email_op').val() != "" & $('#cpf_op').val() != "" & $('#logradouro_op').val() != "" & $('#num_log_op').val() != "" & $('#bairro_op').val() != "" & $('#estado_op').val() != "" & $('#cidade_op').val() != "" ) 
    {
        $('#finalizarCid').prop('disabled', false);
        $('#preencherFim').prop('hidden', true);
    }else if(value.length == "" & $('#cidadao_desc_resolucao_conflito').val() == "" & $('#nome_op').val() == "" & $('#email_op').val() == "" & $('#cpf_op').val() == "" & $('#logradouro_op').val() == "" & $('#num_log_op').val() == "" & $('#bairro_op').val() == "" & $('#estado_op').val() == "" & $('#cidade_op').val() == "" ) {
        $('#finalizarCid').prop('disabled', true);
    }else{
        $('.finalizarCid').prop('disabled', true);
    }
  })

// Validação de campos das empresas 

$('#accept_terms_emp').bind('change',function(){
    var value = $('#empresa_nome').val();
    if($(this).is(':checked')== true & value.length != "" & $('#empresa_email').val() != "" & $('#empresa_phone').val() != "" & $('#empresa_cnpj').val() != "" & $('#empresa_senha').val() != "" & $('#logradouroEmp').val() != "" & $('#num_logradouroEmp').val() != "" & $('#bairroEmp').val() != "" & $('#ufEmp').val() != "" & $('#cidadeEmp').val() != "") {
      $('#continuarEmp').prop('disabled', false);
        $('#preencherEmp').prop('hidden', true);
    }else if($(this).is(':checked')== false & value.length == "" & $('#empresa_email').val() == "" & $('#empresa_phone').val() == "" & $('#empresa_cnpj').val() == "" & $('#empresa_senha').val() == "" & $('#logradouroEmp').val() == "" & $('#num_logradouroEmp').val() == "" & $('#bairroEmp').val() == "" & $('#ufEmp').val() == "" & $('#cidadeEmp').val() == "") {
      $('#continuarEmp').prop('disabled', true);
      $('#preencherEmp').prop('hidden', false);
    }else{
        $('#continuarEmp').prop('disabled', true);
        $('#preencherEmp').prop('hidden', false);
    }
  })

$('#empForm').keyup(function(){
    var value = $('#emp_desc_conflito').val();
    if(value.length != "" & $('#emp_desc_resolucao_conflito').val() != "" & $('#nome_opEmp').val() != "" & $('#email_opEmp').val() != "" & $('#cpf_opEmp').val() != "" & $('#logradouro_opEmp').val() != "" & $('#num_log_opEmp').val() != "" & $('#bairro_opEmp').val() != "" & $('#estado_opEmp').val() != "" & $('#cidade_opEmp').val() != "") 
    {
        $('#finalizarEmp').prop('disabled', false);
        $('#preencheremp2').prop('hidden', true);
    }else if(value.length == "" & $('#emp_desc_resolucao_conflito').val() == "" & $('#nome_op').val() == "" & $('#email_op').val() == "" & $('#cpf_op').val() == "" & $('#logradouro_op').val() == "" & $('#num_log_op').val() == "" & $('#bairro_op').val() == "" & $('#estado_op').val() == "" & $('#cidade_op').val() == "") {
        $('#finalizarEmp').prop('disabled', true);
    }else{
        $('.finalizarEmp').prop('disabled', true);
    }
  })


// validação de campos arbitragem 

$('#accept_terms_arb').bind('change',function(){
    var value = $('#arbitragem_nome').val();
    if($(this).is(':checked')== true & value.length != "" & $('#arbitragem_email').val() != "" & $('#arbitragem_telefone').val() != "" & $('#arbitragem_cpf').val() != "" & $('#arbitragem_senha').val() != "" & $('#logradouro2').val() != "" & $('#num_logradouro2').val() != "" & $('#bairro2').val() != "" & $('#uf2').val() != "" & $('#cidade2').val() != "") {
      $('#finalizarArb').prop('disabled', false);
        $('#preencherArb').prop('hidden', true);
    }else if($(this).is(':checked')== false & value.length == "" & $('#arbitragem_email').val() == "" & $('#arbitragem_telefone').val() == "" & $('#arbitragem_cpf').val() == "" & $('#arbitragem_senha').val() == "" & $('#logradouro').val() == "" & $('#num_logradouro').val() == "" & $('#bairro').val() == "" & $('#uf').val() == "" & $('#cidade').val() == "") {
      $('#finalizarArb').prop('disabled', true);
      $('#preencherArb').prop('hidden', false);
    }else{
        $('#finalizarArb').prop('disabled', true);
        $('#preencherArb').prop('hidden', false);
    }
  })


// validação de campos Adv 

$('#accept_terms_adv').bind('change',function(){
    var value = $('#adv_nome').val();
    if($(this).is(':checked')== true & $('#adv_nome').val() != "" & $('#adv_email').val() != "" & $('#adv_phone').val() != "" & $('#adv_cpf_cnpj').val() != "" & $('#adv_senha').val() != "" & $('#logradouro1').val() != "" & $('#num_logradouro1').val() != "" & $('#bairro1').val() != "" & $('#uf1').val() != "" & $('#cidade1').val() != "" & $('#accept_terms_adv').val() != "") 
    {
      $('#continuarAdv').prop('disabled', false);
        $('#preencherAdv').prop('hidden', true);
    }else if($(this).is(':checked')== false & $('#adv_nome').val() == "" & $('#adv_email').val() == "" & $('#adv_phone').val() == "" 
        & $('#adv_cpf_cnpj').val() == "" & $('#adv_senha').val() == "" 
        & $('#logradouro1').val() == "" & $('#num_logradouro1').val() == "" 
        & $('#bairro1').val() == "" & $('#uf1').val() == "" & $('#cidade1').val() == "" 
        & $('#accept_terms_adv').val() == "") {
      $('#continuarAdv').prop('disabled', true);
      $('#preencherAdv').prop('hidden', false);
    }else{
        $('#continuarAdv').prop('disabled', true);
        $('#preencherAdv').prop('hidden', false);
    }
  })


// validação de campos Trabalhe conosco

$('#tcForm').keyup(function(){
    var value = $('#tc_nome').val();
    if(value.length != "" & $('#tc_cpf').val() != "" & $('#tc_nascimento').val() != "" & $('#tc_sexo').val() != "" & $('#especialidade').val() != "" & $('#minicurriculo').val() != "" & $('#tc_email').val() != "" & $('#tc_phone').val() != "" & $('#tc_cell').val() != "" & $('#tc_senha').val() != "" & $('#tc_cep').val() != "" & $('#tc_logradouro').val() != "" & $('#tc_numero').val() != "" & $('#tc_bairro').val() != "" & $('#tc_cidade').val() != "" & $('#tc_uf').val() != "") {
      $('#enviarCadConosco').prop('disabled', false);
        $('#prencherCad').prop('hidden', true);
    }else if(value.length == "" & $('#tc_cpf').val() == "" & $('#tc_nascimento').val() == "" & $('#tc_sexo').val() == "" & $('#especialidade').val() == "" & $('#minicurriculo').val() == "" & $('#tc_email').val() == "" & $('#tc_phone').val() == "" & $('#tc_cell').val() == "" & $('#tc_senha').val() == "" & $('#tc_cep').val() == "" & $('#tc_logradouro').val() == "" & $('#tc_numero').val() == "" & $('#tc_bairro').val() == "" & $('#tc_cidade').val() == "" & $('#tc_uf').val() == "") {
      $('#enviarCadConosco').prop('disabled', true);
    }else{
        $('#enviarCadConosco').prop('disabled', true);
    }
  })


$('#user_type_adv').change(function(){
    // var x = $('#user_type_adv').val();
    console.log($('#user_type_adv').val());
    if ($('#user_type_adv').val() == 0) {
      $('#apaga').prop('hidden', true);
      $('#apaga2').prop('hidden', true);
    }else{
      $('#apaga').prop('hidden', false);
      $('#apaga2').prop('hidden', false);
    }
});
// $('#recaptcha-accessible-status').keyup(function(){
//     // var x = $('#user_type_adv').val();
    
//     if ($('#recaptcha-accessible-status').val() != "") {
//       $('#ok').prop('disabled', false);
//     }else{
//       $('#ok').prop('disabled', true);
//     }
// });


