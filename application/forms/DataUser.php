<?php

class Application_Form_DataUser extends Twitter_Bootstrap_Form_Horizontal
{

    public function init()
    {      

      $this->addElement('text', 'name_u', array(
      		'label'					=> 'Nome',
          'placeholder'   => 'nome',
          'class'					=> 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'email_u', array(
          'label'         => 'E-mail',
          'placeholder'   => 'email',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'phone_u', array(
      		'label'					=> 'Telefone',
          'placeholder'   => 'telefone',
          'class'					=> 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'cpf', array(
          'label'         => 'CPF',
          'placeholder'   => 'CPF',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'sex', array(
          'label'         => 'Sexo',
          'placeholder'   => 'sexo',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'date_birth', array(
          'label'         => 'Data de nascimento',
          'placeholder'   => 'data de nascimento',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'marital_status', array(
          'label'         => 'Estado civil',
          'placeholder'   => 'estado civil',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'nationality', array(
          'label'         => 'Nacionalidade',
          'placeholder'   => 'nacionalidade',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'profession', array(
          'label'         => 'Profissão',
          'placeholder'   => 'profissão',
          'class'         => 'form-control',
          'required '     => ''
      ));


      $this->addElement('text', 'place_u', array(
          'label'         => 'Logradouro',
          'placeholder'   => 'logradouro',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'number_u', array(
          'label'         => 'Número',
          'placeholder'   => 'número',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'complement_u', array(
          'label'         => 'Complemento',
          'placeholder'   => 'complemento',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'neighborhood_u', array(
          'label'         => 'Bairro',
          'placeholder'   => 'bairro',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'uf_u', array(
          'label'         => 'UF',
          'placeholder'   => 'UF',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'city_u', array(
          'label'         => 'Cidade',
          'placeholder'   => 'cidade',
          'class'         => 'form-control',
          'required '     => ''
      ));

      $this->addElement('text', 'cep_u', array(
          'label'         => 'CEP',
          'placeholder'   => 'CEP',
          'class'         => 'form-control',
          'required '     => ''
      ));
      
    }


}