<?php

class AgendamentoController extends Zend_Controller_Action
{

    public function init()
    {
      $this->_helper->layout()->setLayout('dashboard');
    }

    public function indexAction()
    {
      $scheduling = new Application_Model_Scheduling();
			$conflict = new Application_Model_Conflict();
      $general = new Application_Model_General();
      $conflictId = $this->getRequest()->getParam('id');
      $this->view->save = $this->getRequest()->getParam('save');

    	if ( $this->getRequest()->isPost() ) 
      {
        $data = $this->getRequest()->getPost(); 
        date_default_timezone_set('America/Sao_Paulo');

        $schedulingHour = new Application_Model_DbTable_SchedulingHourAllowed();
        $select = $schedulingHour->select()->setIntegrityCheck(false);
        $select ->from(array('scheduling_hour_allowed'), array('hour') )
                ->where('id = ?', $data['hour']);
        $hour = $schedulingHour->fetchRow($select);// var_dump($data['date'] ); exit;

        if(strtotime($data['date']." ".$hour->hour) < strtotime(date('Y-n-j H:i:s', strtotime("+6 hour")))){
          $this->view->save = 'scheduling_error';
        }
        else if($scheduling->newSchedule($data))
        {
					$this->_redirect('/agendamento/success/id/'.$conflictId);
        }
        else
        {
        	$this->view->save = 'error';
        }
      }
      
      $this->view->hour = $scheduling->returnHour();
    }

    public function successAction()
    {

      $conflict = new Application_Model_Conflict();
      $scheduling = new Application_Model_Scheduling();
      $this->view->conflictId = $this->getRequest()->getParam('id');
      $this->view->conflictType = $this->getRequest()->getParam('type');
      $this->view->schedule = $scheduling->returnScheduling($this->view->conflictId);
    }

    public function cancelSchedulingAction()
    {
      $scheduling = new Application_Model_Scheduling();
      $scheduleId = $this->getRequest()->getParam('id');
      if( $scheduling->remove($scheduleId) ){
        return $this->_redirect('/agendamento/cancel-protocol');
      }
      return $this->_redirect('/agendamento/success/save/failed');
    }

    public function cancelProtocolAction()
    {
    }


}

