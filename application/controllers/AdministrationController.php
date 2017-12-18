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
      if($page == '') $page = 1;
      if($field != "")
      {
        $users = $user->findByName(urldecode($field));
        $this->view->list = $pagination->generatePagination($users,$page,10);
        $this->view->field = $field;
      }
      else
      {
        $user = $user->lists();
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

    public function newValorAction()
    {
      $user = new Application_Model_User();
      if ( $this->getRequest()->isPost() ) 
      {
        $data = $this->getRequest()->getPost();
        $user->newValorCausa($data);

        $this->_redirect('/administration/valor-causa');
      }
    }

    public function valorCausaAction()
    {
       
      $user = new Application_Model_User();
      // $pagination = new Application_Model_Pagination();
      $field = $this->getRequest()->getParam('field');
      // $page = $this->getRequest()->getParam('page');
      if($page == '') $page = 1;
      if($field != "")
      {
        $this->view->list = $user->findValorCausa(urldecode($field));
        // $this->view->list = $pagination->generatePagination($valorCausa,$page,10);
        $this->view->field = $field;
      }
      else
      {
        $this->view->list = $user->listValorCausa();
        // $this->view->list = $pagination->generatePagination($valorCausa,$page,10);
      }
    }

    public function valorCausaEditAction()
    {
      $userId = $this->getRequest()->getParam('id');
      $user = new Application_Model_User();
      if ( $this->getRequest()->isPost() ) 
      {
        $data = $this->getRequest()->getPost();
        $user->editValorCausa($data, $userId);

        $this->_redirect('/administration/valor-causa');
      }

      $this->view->valorCausa = $user->returnValorCausaId($userId);
    }

    



}











































