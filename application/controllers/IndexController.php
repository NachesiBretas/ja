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

        // Check for empty fields
        // if(empty($_POST['name'])      ||
        //    empty($_POST['email'])     ||
        //    empty($_POST['phone'])     ||
        //    empty($_POST['message']) ||
        //    !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
        // {
        //   echo "Preencha os campos!";
        //   return false;
        // }
          
        // $name = strip_tags(htmlspecialchars($_POST['name']));
        // $email_address = strip_tags(htmlspecialchars($_POST['email']));
        // $phone = strip_tags(htmlspecialchars($_POST['phone']));
        // $message = strip_tags(htmlspecialchars($_POST['message']));
          
        // // Create the email and send the message contato@justicaalternativa.com
        // $to = 'nachesi@msn.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
        // $email_subject = "Formulário de contato do site:  $name";
        // $email_body = "Você recebeu uma menssagem do formulário de contato do site.\n\n"."Segue os detales:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
        // $headers = "From: nachesi@msn.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
        // $headers .= "Reply-To: $email_address"; 

        // $teste = mail($to,$email_subject,$email_body,$headers);
        
        // echo $teste.'5555';

        // //$this->_redirect('/index'); 

        // require 'PHPMailerAutoload.php';

        // //Create a new PHPMailer instance
        // $mail = new PHPMailer;
        // // Set PHPMailer to use the sendmail transport
        // //$mail->isSendmail();
        // //Set who the message is to be sent from
        // $mail->setFrom('nachesi@msn.com', 'First Last');
        // //Set an alternative reply-to address
        // $mail->addReplyTo('nachesi@msn.com', 'First Last');
        // //Set who the message is to be sent to
        // $mail->addAddress('nachesi@msn.com', 'John Doe');
        // //Set the subject line
        // $mail->Subject = 'PHPMailer sendmail test';
        // //Read an HTML message body from an external file, convert referenced images to embedded,
        // //convert HTML into a basic plain-text alternative body
        // $mail->msgHTML('teste');
        // //Replace the plain text body with one created manually
        // $mail->AltBody = 'This is a plain-text message body';
        // //Attach an image file
        // //$mail->addAttachment('images/phpmailer_mini.png');

        // //send the message, check for errors
        // if (!$mail->send()) {
        //     echo "Mailer Error: " . $mail->ErrorInfo;
        // } else {
        //     echo "Message sent!". $mail->ErrorInfo;
        // }
          require_once 'Zend/Mail.php';
          $mail = new Zend_Mail();
          $nome = $data['name'];
          $email = $data['email'];
          $phone = $data['phone'];
          $mensagem = $data['message'];
          $email_subject = "Formulário de contato do site:  $name";
          $email_body = "Você recebeu uma menssagem do formulário de contato do site.\n\n"."Segue os detalhes:\n\nNome: $nome\n\nEmail: $email\n\nTelefone: $phone\n\nMensagem:\n$mensagem";
          $mail->setFrom($email, $nome) // Quem esta enviando
               ->addTo('contato@justicaalternativa.com.br')// para quem esta enviando
               ->setBodyText($email_body)             // mensagem sem formata?
               ->setSubject($email_subject)               // Assunto
               ->send();  //enviar
                
        }

    }

}



