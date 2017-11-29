<?php

class Application_Form_Conflict extends Twitter_Bootstrap_Form_Horizontal
{

    public function init()
    {
      $authNamespace = new Zend_Session_Namespace('userInformation');
      
      $this->addElement('text', 'desc_conflict', array(
      		'label'					=> 'Descrição do conflito',
          'class'					=> 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'desc_sugest_resolution', array(
          'label'         => 'Sugestão de resolução',
          'class'         => 'form-control',
          'required '     => ''
      ));

      if($authNamespace->institution == 1){
        $this->addElement('text', 'estimate_price', array(
        		'label'					=> 'Preço estimado',
            'class'					=> 'form-control',
            'required '     => ''
        ));

        /*$this->addElement('submit', 'submit', array(
          'buttonType' 			=> Twitter_Bootstrap_Form_Element_Submit::BUTTON_PRIMARY,
          'label'      			=> 'Próximo',
          'class'           => 'col-lg-offset-5'
        ));*/
      }
    }


}

