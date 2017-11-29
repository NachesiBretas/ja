<?php

class Application_Form_User extends Twitter_Bootstrap_Form_Horizontal
{

    public function init()
    {
      $this->setIsArray(true);

      $this->addElement('text', 'name', array(
      		'label'					=> 'Nome',
          'placeholder'   => 'nome completo',
          'class'					=> 'form-control'
      ));

      $this->addElement('text', 'phone', array(
      		'label'					=> 'Telefone',
          'placeholder'   => 'telefone',
          'class'					=> 'form-control phone'
      ));

      $this->addElement('text', 'email', array(
      		'label'					=> 'E-mail',
          'placeholder'   => 'email',
          'class'					=> 'form-control'
      ));

      $this->addElement('text', 'username', array(
      		'label'					=> 'Usuário no sistema',
          'placeholder'   => 'usuário para logar no sistema',
          'class'					=> 'form-control'
      ));

      $this->addElement('password', 'password', array(
      		'label'					=> 'Senha',
          'placeholder'   => 'senha',
          'class'					=> 'form-control'
      ));

      $this->addElement('password', 'confirm_password', array(
      		'label'					=> 'Confirme a senha',
          'placeholder'   => 'confirme a senha',
          'class'					=> 'form-control'
      ));

      $this->addElement('select','institution', array(
          'label'             => 'Organização',
          'class'             => 'form-control',
          'MultiOptions'      => array(
                      0 => '-- Selecione uma organização --',
                      1 => 'Administrador',
                      2 => 'Árbitro',
                      3 => 'Conciliador',
                      5 => 'Mediador',
                      4 => 'Sub-administrador',
                      6 => 'Cidadão',
                      7 => 'Empresa',
                      8 => 'Advogado',
                      10 => 'Arbitragem'
            )
      ) );

      $this->addElement('submit', 'submit', array(
        'buttonType' 			=> Twitter_Bootstrap_Form_Element_Submit::BUTTON_PRIMARY,
        'label'      			=> 'Salvar',
        'class'           => 'col-lg-offset-5'
      ));
    }


}

