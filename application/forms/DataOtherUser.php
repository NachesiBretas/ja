<?php

class Application_Form_DataOtherUser extends Twitter_Bootstrap_Form_Horizontal
{

    public function init()
    {      
      $this->addElement('text', 'name_ou', array(
      		'label'					=> 'Nome',
          'placeholder'   => 'nome',
          'class'					=> 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'email_ou', array(
          'label'         => 'E-mail',
          'placeholder'   => 'email',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'phone_ou', array(
      		'label'					=> 'Telefone',
          'placeholder'   => 'telefone',
          'class'					=> 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'cpf_cnpj_ou', array(
          'label'         => 'CPF',
          'placeholder'   => 'CPF',
          'class'         => 'form-control',
          'required '     => ''
      ));


      $this->addElement('text', 'place_ou', array(
          'label'         => 'Logradouro',
          'placeholder'   => 'logradouro',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'number_ou', array(
          'label'         => 'Número',
          'placeholder'   => 'número',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'complement_ou', array(
          'label'         => 'Complemento',
          'placeholder'   => 'complemento',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'neighborhood_ou', array(
          'label'         => 'Bairro',
          'placeholder'   => 'bairro',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'uf_ou', array(
          'label'         => 'UF',
          'placeholder'   => 'UF',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'city_ou', array(
          'label'         => 'Cidade',
          'placeholder'   => 'cidade',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'cep_ou', array(
          'label'         => 'CEP',
          'placeholder'   => 'CEP',
          'class'         => 'form-control',
          'required '     => ''
      ));
      
    }


}