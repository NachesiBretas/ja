<?php

class DashboardController extends Zend_Controller_Action
{

    public function init()
    {
      $authNamespace = new Zend_Session_Namespace('userInformation');
      $user = new Application_Model_User();
      $status = $user->validUser($authNamespace->user_id);
      if($status['status'] == 0){
        $this->_redirect('/doesntallow');
      }
      else{
        $this->_helper->layout()->setLayout('dashboard');
        //$mail = new Application_Model_Mail();
        //$this->view->messages = $mail->getUnreadMessages();
        
        $conflict = new Application_Model_Conflict();
        $this->view->institution = $authNamespace->institution;

        if($this->view->institution == 1)
        {
          echo"esta aparecendo no dashboard";
          $this->view->allConflicts = count($conflict->listAll());
          $this->view->citizenConflicts = count($conflict->listNewsByType(0,1));
          $this->view->companyConflicts = count($conflict->listNewsByType(0,2));
          $this->view->lawyerConflicts = count($conflict->listNewsByType(0,3));
          $this->view->arbitrationConflicts = count($conflict->listNewsByType(0,4));

          $this->view->allAcceptedConflicts = count($conflict->listAllAccepted());
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
    }

    public function indexAction()
    {
        // action body
    }
}

