<?php

class IndexController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {


      $auth = new Application_Model_Auth();
      $data = array(
          username => 'guest',
          password => 'guest'
      );
      $teste = $auth->login($data);
      //print_r($teste);
      //echo"<br><br><br> whhjsjhghjkkhu";


      $acl = Zend_Registry::get('acl');
      $auth = Zend_Auth::getInstance();
      //if( $auth->hasIdentity() )
      //{
      //	$this->_redirect('/dashboard');
      //}

      $conflict = new Application_Model_Conflict();
      $valor = count($conflict->listAllAccepted());// qtd de casos aceitos
      $this->view->qtd_casos =  str_pad($valor, 4, "0", STR_PAD_LEFT);


      if($this->getRequest()->isPost()) 
      {
        $data = $this->getRequest()->getPost();
        // var_dump($data);exit;
        if($data['cidadao_nome']){
          
          // insere o usuario novo na tabela de usuarios
          $user = new Application_Model_User();
          $id_user = $user->newUser($data);

          $conflict = new Application_Model_Conflict();
          $conflictId = $conflict->newConflictCid($data,$id_user, $_FILES);
          $this->_redirect('/auth/login');
        }

        if($data['empresa_nome']){
          $user = new Application_Model_User();
          $id_user = $user->newUser($data);

          $conflict = new Application_Model_Conflict();
          $conflictId = $conflict->newConflictEmp($data,$id_user, $_FILES);
          $this->_redirect('/auth/login');
        }
        if($data['adv_nome']){
         
          $user = new Application_Model_User();
          $id_user = $user->newUser($data);

          $conflict = new Application_Model_Conflict();
          $conflictId = $conflict->newConflictadv($data,$id_user, $_FILES);
          $this->_redirect('/auth/login');
        }

        if($data['arbitragem_nome']){
          // var_dump($data);exit;
          $user = new Application_Model_User();
          $id_user = $user->newUser($data, $_FILES);

          $conflict = new Application_Model_Conflict();
          $conflictId = $conflict->newConflictArb($data,$id_user, $_FILES);
          $this->_redirect('/auth/login');
        }

        // $this->_redirect('/auth/login');

        // Cadastro do modulo trabalhe conosco 
        if($data['tc_nome']){
          // var_dump($_FILES);exit;
          $user = new Application_Model_User();
          $id_user = $user->newUser($data, $_FILES);
          $this->_redirect('/index');
        }
      }

    }

    public function sendEmailAction()
    {
      if($this->getRequest()->isPost()) 
      {
        $data = $this->getRequest()->getPost();
         try{
          //require_once 'Zend/Mail.php';
          $mail = new Zend_Mail();
          $nome = $data['name'];
          $email = $data['email'];
          $phone = $data['phone'];
          $mensagem = $data['message'];
          $email_subject = "Formulario de contato do site:  $nome";
          $email_body = "Foi recebida uma mensagem de contato do site.\n\n"."Segue os detalhes:\n\nNome: $nome\n\nEmail: $email\n\nTelefone: $phone\n\nMensagem:\n$mensagem";
          $mail->setFrom($email, $nome) // Quem esta enviando
               ->addTo('contato@justicaalternativa.com.br')// para quem esta enviando
               ->setBodyText($email_body)             // mensagem sem formata?
               ->setSubject($email_subject)               // Assunto
               ->send();  //enviar

          $this->_redirect('/index');
         }catch(Zend_Exception $e){

              echo "Erro ao enviar o email";  

          }    
      }

    }

}



