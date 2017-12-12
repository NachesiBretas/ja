<?php

class AdministrationController extends Zend_Controller_Action
{

    public function init()
    {
      $this->_helper->layout()->setLayout('dashboard');
      $authNamespace = new Zend_Session_Namespace('userInformation');
      $this->view->institution = $authNamespace->institution;
      $this->view->userId = $authNamespace->user_id; 
      if($this->view->institution != 1)
      {
      	$this->_redirect('/doesntallow');
      }
      $mail = new Application_Model_Mail();
      $this->view->messages = $mail->getUnreadMessages();

      /// PESQUISAS DE TIPOS DE USUARIOS
      $users = new Application_Model_User();
      $this->view->allUsers = count($users->listAll());
      $this->view->UserAdm = count($users->listByType(1));
      $this->view->UserConciliador = count($users->listByType(3));
      $this->view->UserMediador = count($users->listByType(5));
      $this->view->UserArbitro = count($users->listByType(2));
      $this->view->UserSubAdm = count($users->listByType(4));
      $this->view->UserCidadao = count($users->listByType(6));
      $this->view->UserEmpresa = count($users->listByType(7));
      $this->view->UserAdv = count($users->listByType(8));
      $this->view->UserArbitragem = count($users->listByType(10));

    }

    public function indexAction()
    {
        // action body
    }

    public function userAction()
    {
      if($this->view->institution != 1)
      {
        $this->_redirect('/doesntallow');
      }

      $user = new Application_Model_User();
      $pagination = new Application_Model_Pagination();
      $field = $this->getRequest()->getParam('field');
      $page = $this->getRequest()->getParam('page');

      $this->view->userType = $userType = $this->getRequest()->getParam('type');

      if($page == '') $page = 1;
      if($field != "")
      {
        $users = $user->findByName(urldecode($field));
        $this->view->list = $pagination->generatePagination($users,$page,10);
        $this->view->field = $field;
      }
      else
      {
        if($userType == 1){
          $user = $user->listByType(1);
        }
        else if ($userType == 2) {
          $user = $user->listByType(2);
        }
        else if ($userType == 3) {
          $user = $user->listByType(3);
        }
        else if ($userType == 4) {
          $user = $user->listByType(4);
        }
        else if ($userType == 5) {
          $user = $user->listByType(5);
        }
        else if ($userType == 6) {
          $user = $user->listByType(6);
        }
        else if ($userType == 7) {
          $user = $user->listByType(7);
        }
        else if ($userType == 8) {
          $user = $user->listByType(8);
        }
        else if ($userType == 10) {
          $user = $user->listByType(10);
        }
        else{
          $user = $user->lists();
        }
        $this->view->list = $pagination->generatePagination($user,$page,10);
      }
    }

    public function userNewAction()
    {
      if($this->view->institution != 1 && $this->view->institution != 9)
      {
        $this->_redirect('/doesntallow');
      }
      $this->view->form = new Application_Form_User();
      if ( $this->getRequest()->isPost() ) 
      {
        $data = $this->getRequest()->getPost();
        $inspector = new Application_Model_User();
        if($inspector->newUser($data))
        {
          $this->view->save = 'success';
        }
        else
        {
          $this->view->form->populate($data);
          $this->view->save = 'error';
        }
      }
    }

    public function userEditAction()
    {
      if($this->view->institution != 1)
      {
        $this->_redirect('/doesntallow');
      }
      $this->view->userId = $userId = $this->getRequest()->getParam('id');
      $save = $this->getRequest()->getParam('save');
      $user = new Application_Model_User();
      if ( $this->getRequest()->isPost() ) 
      {
        $data = $this->getRequest()->getPost();
        if($user->editUser($data,$userId))
        {
           $this->view->save = 'success';
        }
        else
        {
          $this->view->save = 'error';
        }
      }
      $this->view->form = new Application_Form_User();
      $user = $user->returnById($userId);
      unset($user->password);
      $this->view->form->reset();
      $this->view->form->populate($user->toArray());
    }

    public function inativaUserAction()
    {
      if($this->view->institution != 1)
      {
        $this->_redirect('/doesntallow');
      }
      //$this->view->userId = $userId = $this->getRequest()->getParam('id');
      //$save = $this->getRequest()->getParam('save');
      $user = new Application_Model_User();
      if ( $this->getRequest()->isPost() ) 
      {
        $data = $this->getRequest()->getPost();
        $user->inativaUser($data['userId']);

        $this->_redirect('/administration/user');
      }
      
    }



}











































