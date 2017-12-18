<?php

class ConflictsController extends Zend_Controller_Action
{

    public function init()
    {

      $this->_helper->layout()->setLayout('dashboard');
      $authNamespace = new Zend_Session_Namespace('userInformation');
      $this->view->institution = $authNamespace->institution;
      $this->view->userId = $authNamespace->user_id;

      $conflict = new Application_Model_Conflict();

      if($this->view->institution == 1)
        {
          //echo"em todas as paginas";
          $this->view->allConflicts = count($conflict->listAll());
          $this->view->citizenConflicts = count($conflict->listNewsByType(0,1));
          $this->view->companyConflicts = count($conflict->listNewsByType(0,2));
          $this->view->lawyerConflicts = count($conflict->listNewsByType(0,3));
          $this->view->arbitrationConflicts = count($conflict->listNewsByType(0,4));

          $this->view->allAcceptedConflicts = count($conflict->listAllAccepted());
          $this->view->allReturnedConflicts = count($conflict->listAcceptedByType(4));
          $this->view->mediadorConflicts = count($conflict->listAcceptedByType(1));
          $this->view->conciliadorConflicts = count($conflict->listAcceptedByType(2));
          $this->view->arbitroConflicts = count($conflict->listAcceptedByType(3));
          //echo "aqui";
        }

        if($this->view->institution == 5) // mediador
        {
          $this->view->allConflicts = count($conflict->listNewsByType(1,1));
          $this->view->allAcceptedConflicts = count($conflict->listAcceptedByType(1));
          $this->view->allReturnedConflicts = count($conflict->listAcceptedByType(4));
        }

        if($this->view->institution == 3) //conciliador
        {
          $this->view->allConflicts = count($conflict->listNewsByType(2,1));
          $this->view->allAcceptedConflicts = count($conflict->listAcceptedByType(2));
          $this->view->allReturnedConflicts = count($conflict->listAcceptedByType(5));
        }

        if($this->view->institution == 2) //arbitro
        {
          $this->view->allConflicts = count($conflict->listNewsByType(3,1));
          $this->view->allAcceptedConflicts = count($conflict->listAcceptedByType(3));
          $this->view->allReturnedConflicts = count($conflict->listAcceptedByType(6));
        }


    }

    public function indexAction()
    {
        // action body
    }

    public function typesAction()
    {
        // action body
    }

    public function acceptedAction()
    {
        // action body
    }

    public function returnedsAction()
    {
        // action body
      if ( $this->getRequest()->isPost()) 
      {
        $conflict = new Application_Model_Conflict();
        $data = $this->getRequest()->getPost(); 

        $conflict->changeStatusReturneds($data['conflictId'],$data['grupo']);
        $this->redirect('/conflicts/returneds');

      }
    }

    public function paymentAction()
    {
        // action payment
      $conflict = new Application_Model_Conflict();
      //print_r($conflict); 
      $teste = $conflict->buscaTaxaReg();

      //if($teste !=)
      $this->view->taxaReg = $teste;
    }

    public function verificaCupomAction()
    {
      $this->_helper->layout->disableLayout();
      Zend_Controller_Front::getInstance()->setParam('noViewRenderer', true);
      $this->_helper->viewRenderer->setNoRender(true);

      $cupom = $this->getRequest()->getParam('cupom');
      $conflict = new Application_Model_DbTable_Cupom();
      $select = $conflict->select()->where('cupom = ?',$cupom);
      $tem_cupom = $conflict->fetchRow($select);
      //print_r($tem_cupom);exit();
      if(isset($tem_cupom) && $tem_cupom['cupom'] != ''){
        if($tem_cupom['status'] == 0){
          // muda status para invalidar o cupom
          //$tem_cupom->status = 1;
          //$conflict->save();

          echo json_encode("<#".$tem_cupom['desconto']."#>");
        }
        else if($tem_cupom['status'] == 1) {
          echo json_encode("<# us #>"); // cupom usado
        }
      }
      else{
        echo json_encode("<# ne #>"); // cupom nao existe
      }
      
    }

    public function calculaPrecoAction()
    {
      $this->_helper->layout->disableLayout();
      Zend_Controller_Front::getInstance()->setParam('noViewRenderer', true);
      $this->_helper->viewRenderer->setNoRender(true);

      $cupom = $this->getRequest()->getParam('desconto');
      $valor = $this->getRequest()->getParam('valor');
      $conflict = new Application_Model_DbTable_ValorCausa();
      $select = $conflict->select()->where('de <= ?',$valor)->where('ate >= ?',$valor); //de <= 26032.03 and ate >= 26032.03
      $valores = $conflict->fetchRow($select);
      //print_r($tem_cupom);exit();
      if(isset($valores) && $valores['id'] != ''){
        $valor = str_replace(',','.',str_replace('.','',$valor));
        $taxa_registro = (($valor*$valores['taxa_registro']));
        $taxa_adm = (($valor*$valores['taxa_adm']));
        $honorario = (($valor*$valores['honorario'])/100);
        
        if($cupom != 0 && $cupom != '') {
          //$taxa_registro = $taxa_registro - (($taxa_registro*$cupom)/100);
          //$taxa_adm = $taxa_adm - (($taxa_adm*$cupom)/100);
          $honorario = $honorario - (($honorario*$cupom)/100);
        }

        echo json_encode("<treg".$taxa_registro."treg> <tadm".$taxa_adm."tadm> <hon".$honorario."hon>");
      }
      else{
        echo json_encode("<# ne #>"); // cupom nao existe
      }
      
    }

    public function cupomAction()
    {
        $data = $this->getRequest()->getPost(); 
        $this->view->cupom = $this->getRequest()->getParam('cod_cupom');

        if($data){
          if($data['desconto'] != 0){
            $cupom = rand(1000,10000000000);
            // testar se for repetido nao gravar denovo
            $cupomModel = new Application_Model_DbTable_Cupom();
            $data['cupom'] = $cupom;
            $data['desconto'] = $data['desconto'];
            $data['status'] = 0;
            $cupomNew = $cupomModel->createRow($data);
            $cupomNew->save();

            $this->_redirect('/conflicts/cupom/cod_cupom/'.$cupom);
          }
          else{
            $this->view->save = 'msg_cupom';  
          }      
        }
    }


    public function viewAction()
    {
      try
      {
 
        $type = $this->getRequest()->getParam('type');
        $this->view->save = $this->getRequest()->getParam('save');

        if($type == 1){
          $this->view->type = 'Cidadão';
        }
        elseif ($type == 2) {
          $this->view->type = 'Empresa';
        }
        elseif ($type == 3) {
          $this->view->type = 'Advogado';
        }
        elseif ($type == 4) {
          $this->view->type = 'Arbitragem';
        }
        $conflict = new Application_Model_Conflict();
        $pagination = new Application_Model_Pagination();

        $conflicts = $conflict->lists($type);
        if(isset($conflicts) && count($conflicts)){
          $this->view->list = $pagination->generatePagination($conflicts,$page,10);
        }
      }catch(Zend_Exception $e){
        // $this->view->save = 'error';
      }
    }


    public function viewAcceptedAction()
    {
      try
      {
        $type = $this->getRequest()->getParam('type');

        if($type == 1){
          $this->view->type = 'Mediador';
        }
        elseif ($type == 2) {
          $this->view->type = 'Conciliador';
        }
        elseif ($type == 3) {
          $this->view->type = 'Árbitro';
        }

        $conflict = new Application_Model_Conflict();
        $pagination = new Application_Model_Pagination();

        $conflicts = $conflict->listsAccepted($type);
        if(isset($conflicts) && count($conflicts)){
          $this->view->list = $pagination->generatePagination($conflicts,$page,10);
        }

      }catch(Zend_Exception $e){
        // $this->view->save = 'error';
      }
    }


    public function mycasesAction()
    {
      try
      {
        $conflict = new Application_Model_Conflict();
        $pagination = new Application_Model_Pagination();

        $conflicts = $conflict->listsAcceptedByUser();
        if(isset($conflicts) && count($conflicts)){
          $this->view->list = $pagination->generatePagination($conflicts,$page,10);
        }

      }catch(Zend_Exception $e){
        // $this->view->save = 'error';
      }
    }



    public function editAction()
    {
      try{

        $this->view->type = $this->getRequest()->getParam('type');
        $conflictId = $this->getRequest()->getParam('id');
        $this->view->result = 1;
        $this->view->save = $this->getRequest()->getParam('save');
        $conflict = new Application_Model_Conflict();
        
        /*if ( $this->getRequest()->isPost() ){
          $data = $this->getRequest()->getPost();
          echo"hhhhhhhhhh"; exit();
          $conflict->saveConflictHistoric($data,$conflictId);
        }*/

        $this->view->conflictId = $conflictId;
        $this->view->conflictRow = $conflict->returnById($conflictId);  
         //echo"aajajaja";exit();  

        $this->view->mainForm = new Application_Form_Conflict();
        $this->view->mainForm->populate($this->view->conflictRow->toArray());

        $this->view->dataUserForm = new Application_Form_DataUser();
        $this->view->dataUserForm->populate($this->view->conflictRow->toArray());

        $this->view->dataOtherUserForm = new Application_Form_DataOtherUser();
        $this->view->dataOtherUserForm->populate($this->view->conflictRow->toArray());

        $this->view->allConflictHistoric = $conflict->listAllConflictHistoric($conflictId);

      }catch(Zend_Exception $e){
        
        $this->view->save = 'error';
      }
    }

    public function researchAction()
    {
        $conflict = new Application_Model_Conflict();
        $field = $this->getRequest()->getParam('field');
        $option = $this->getRequest()->getParam('option');

        if($field != ""){
          if($option == 2)
          {
            $this->view->conflicts = $conflict->returnByCity($field);
          }

          if($option == 1)
          {
            $this->view->conflicts = $conflict->returnByState($field);
          }

          if($option == 3) // cid emp arb ou adv
          {
            //SELECT * FROM `conflict` WHERE type =
            if(strtoupper($field) == 'CIDADÃO' || strtoupper($field) == 'CIDADAO'){
              $this->view->conflicts = $conflict->returnByType(1);
            }
            if(strtoupper($field) == 'EMPRESA' || strtoupper($field) == 'ENTE CONVENIADO'){
              $this->view->conflicts = $conflict->returnByType(2);
            }
            if(strtoupper($field) == 'ADVOGADO'){
              $this->view->conflicts = $conflict->returnByType(3);
            }
            if(strtoupper($field) == 'ARBITRAGEM'){
              $this->view->conflicts = $conflict->returnByType(4);
            }

          }

          if($option == 4) // judicializado ou nao
          {
            $c_type = 0;
            if(strtoupper($field) == 'JUDICIALIZADO'){
              $c_type=1;
            }
            //SELECT * FROM `conflict` WHERE type = 3 and conflict_type = $c_type
            $this->view->conflicts = $conflict->returnByTypeDemand($c_type);
          }

        }

    }

    public function verificaCasoAction()
    {
      $valor = $this->getRequest()->getParam('valor');
      $conflict = new Application_Model_Conflict();
      $verificaConflict = $conflict->listConflictHistoricById($valor);

      if(isset($verificaConflict) && $verificaConflict['id_historic'] != ''){
        echo json_encode(1);exit(); //existe caso
      }
      else{
        echo json_encode(0);exit(); // nao existe caso
      }
    }


    public function acceptCaseAction()
    {
     if ( $this->getRequest()->isPost()) 
      {
        $conflict = new Application_Model_Conflict();
        $data = $this->getRequest()->getPost(); 

        $conflict->changeStatus($data['conflictId'],$data['grupo']);
        $this->redirect('/conflicts/types');

      }
    }


    public function saveStatusAction()
    {
     if ( $this->getRequest()->isPost()) 
      {

          $conflict = new Application_Model_Conflict();
          $data = $this->getRequest()->getPost();
          $conflict->saveConflictHistoric($data);
          $this->redirect('/conflicts/edit/id/'.$data['conflictId']);
      }
    }

   
    public function downloadFileAction()
    {
      $conflictId = $this->getRequest()->getParam('id');
      $file = $this->getRequest()->getParam('file');
      $conflict = new Application_Model_Conflict();

      $fileDir = APPLICATION_PATH.'/conflitos/'.$conflictId.'/'.$file;
      if(file_exists($fileDir))
      {
        $fd = fopen($fileDir, "r");
        $fsize = filesize($fileDir);
        $path_parts = pathinfo($fileDir);
        $ext = strtolower($path_parts["extension"]);

        header("Content-Type: application/download");
        header("Content-Disposition: attachment; filename=\"".$path_parts["basename"]."\"");
        header("Content-length: $fsize");
        header("Cache-control: private");

        while(!feof($fd)) {
          $buffer = fread($fd, 2048);
          echo $buffer;
        }

        fclose($fd);
        exit;

      }
    }


    public function protocolAction()
    {
      $this->view->id = $this->getRequest()->getParam('id');
    }


    public function addDocumentsAction()
    {
      $this->view->conflictId = $this->getRequest()->getParam('id');
      $this->view->documentsForm = new Application_Form_ConflictDocuments();
      if ( $this->getRequest()->isPost() ) 
      {
        $conflict = new Application_Model_Conflict(); 
        $data = $this->getRequest()->getPost();
        if(isset($_FILES['file']) && !is_null($_FILES['file']))
        { 
          if($conflict->saveDocument($_FILES,$data,$this->view->conflictId))
          {
            $this->view->save = 'success';
          }
          else
          {
            $this->view->save = 'error';
          }
        }
      }
    }



    
}
?>

