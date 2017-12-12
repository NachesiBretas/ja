<?php

class Application_Model_User
{

	public function newUser($data, $file)
	{

		if($data['username'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['name'];
			$userRow->username = $data['username'];
			$userRow->password = sha1($data['password']);
			$userRow->email = $data['email'];
			$userRow->phone = $data['phone'];
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = $data['institution'];
			return $userRow->save();
		}

		if($data['cidadao_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['cidadao_nome'];
			$userRow->username = $data['cidadao_email'];
			$userRow->email = $data['cidadao_email'];
			$userRow->phone = $data['cidadao_phone'];
			$userRow->cpf_cnpj = $data['cidadao_cpf'];
			$userRow->sex = $data['cidadao_sexo'];
			$userRow->marital_status = $data['cidadao_estado_civil'];
			$userRow->date_birth = $data['cidadao_data_nascimento'];
			$userRow->nationality = $data['cidadao_nationalidade'];
			$userRow->password = sha1($data['cidadao_senha']);
			$userRow->profession = $data['cidadao_profissao'];
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 6;
			$userRow->status = 1;
			$user_id = $userRow->save();

			$this->newAddressUser($user_id,$data);

			return $user_id;
		}

		if($data['empresa_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['empresa_nome'];
			$userRow->username = $data['empresa_email'];
			$userRow->email = $data['empresa_email'];
			$userRow->phone = $data['empresa_phone'];
			$userRow->cpf_cnpj = $data['empresa_cnpj'];
			$userRow->password = sha1($data['empresa_senha']);
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 7;
			$userRow->status = 1;
			$user_id = $userRow->save();

			$this->newAddressUser($user_id,$data);

			return $user_id;
		}

		if($data['adv_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['adv_nome'];
			$userRow->username = $data['adv_email'];
			$userRow->email = $data['adv_email'];
			$userRow->phone = $data['adv_phone'];
			$userRow->cpf_cnpj = $data['adv_cpf_cnpj'];
			$userRow->sex = $data['adv_sexo'];
			$userRow->marital_status = $data['adv_estado_civil'];
			$userRow->date_birth = $data['adv_data_nascimento'];
			$userRow->nationality = $data['adv_nationalidade'];
			$userRow->password = sha1($data['adv_senha']);
			$userRow->oab_number = $data['adv_num_oab'];
			$userRow->type_user = $data['user_type_adv'];
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 8;
			$userRow->status = 1;
			$user_id = $userRow->save();

			$this->newAddressUser($user_id,$data);

			return $user_id;
		}

		/////////// 9 é o geral do sistema pra consulta Ajax

		if($data['arbitragem_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['arbitragem_nome'];
			$userRow->username = $data['arbitragem_email'];
			$userRow->email = $data['arbitragem_email'];
			$userRow->phone = $data['arbitragem_telefone'];
			$userRow->type_user = $data['arbitragem_type_user'];
			$userRow->cpf_cnpj = $data['arbitragem_cpf'];
			$userRow->sex = $data['arbitragem_sexo'];
			$userRow->date_birth = $data['arbitragem_data_nascimento'];
			$userRow->password = sha1($data['arbitragem_senha']);
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 10;
			$userRow->status = 1;
			$user_id = $userRow->save();

			$this->newAddressUser($user_id,$data);
			$conflict = new Application_Model_Conflict();
			$annex = $conflict->createAnnex($id_conflito,$user_id,4,$_FILES);

			return $user_id;
		}

		// usuario trabalhe conosco 

		if($data['tc_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['tc_nome'];
			$userRow->username = $data['tc_email'];
			$userRow->email = $data['tc_email'];
			$userRow->email_secundario = $data['tc_email_2'];
			$userRow->phone = $data['tc_phone'];
			$userRow->phone_secundario = $data['tc_cell'];
			$userRow->cpf_cnpj = $data['tc_cpf'];
			$userRow->sex = $data['tc_sexo'];
			$userRow->date_birth = $data['tc_nascimento'];
			$userRow->password = sha1($data['tc_senha']);
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = $data['type_user'];
			$userRow->status = 0;
			$user_id = $userRow->save();
			
			$this->newAddressUserTc($user_id,$data);
			$profissional = new Application_Model_InfoProfissional();
			$new = $profissional->newProfissional($user_id, $data);
			$annexCertficado = $profissional->createAnnexCertificado($new, $file['annex_certificado']);
			$annexCurriculo = $profissional->createAnnexCurriculo($new, $file['annex_curriculo']);
			return $user_id;
		}

    	return false;
	}

	public function newAddressUser($user_id,$data)
	{
		$user = new Application_Model_DbTable_UserAddress();
		$userRow = $user->createRow();
		$userRow->place = $data['logradouro'];
		$userRow->number = $data['num_logradouro'];
		$userRow->complement = $data['complemento'];
		$userRow->neighborhood = $data['bairro'];
		$userRow->uf = $data['uf'];
		$userRow->city = $data['cidade'];
		$userRow->cep = $data['cep'];
		$userRow->user_id = $user_id;
		$userRow->other_user_id = NULL;		
		$userRow->type = 0;
		return $userRow->save();
	}

	public function newAddressUserTc($user_id,$data)
	{
		$user = new Application_Model_DbTable_UserAddress();
		$userRow = $user->createRow();
		$userRow->place = $data['tc_logradouro'];
		$userRow->number = $data['tc_numero'];
		$userRow->neighborhood = $data['tc_bairro'];
		$userRow->uf = $data['tc_uf'];
		$userRow->city = $data['tc_cidade'];
		$userRow->cep = $data['tc_cep'];
		$userRow->user_id = $user_id;
		$userRow->other_user_id = NULL;		
		$userRow->type = 0;
		return $userRow->save();
	}

	public function lists()
	{
		$user = new Application_Model_DbTable_User();
		return $user->fetchAll($user->select()->where('status = 1 and id != 169'));
		 
	}

	public function validUser($userId)
	{
		$user = new Application_Model_DbTable_User();
		return $user->fetchRow($user->select()->where('id = ?',$userId));
		 
	}

	public function editUser($data,$userId)
	{
		$user = new Application_Model_DbTable_User();
		$userRow = $user->fetchRow($user->select()->where('id = ?',$userId));
		if($userRow)
		{
			$userRow->name = $data['name'];
			$userRow->username = $data['username'];
			$userRow->email = $data['email'];
			$userRow->phone = $data['phone'];
			$userRow->institution = $data['institution'];
			if($data['cpf']) $userRow->cpf = $data['cpf'];
			return $userRow->save();
		}
		return false;
	}

	public function inativaUser($userId)
	{
		$user = new Application_Model_DbTable_User();
		$userRow = $user->fetchRow($user->select()->where('id = ?',$userId));
		if($userRow)
		{
			$userRow->status = 0;
			return $userRow->save();
		}
		return false;
	}

	public function returnById($userId)
	{
		$user = new Application_Model_DbTable_User();
		$select = $user->select()->setIntegrityCheck(false);
		$select	->from(array('u' => 'user'));
		return $user->fetchRow($user->select()->where('status = 1 and id = ?',$userId));
	}


	public function findByName($name)
	{
		$user = new Application_Model_DbTable_User();
		return $user->fetchAll($user->select()->where('status = 1 and id != 169 and name LIKE ?', '%'.$name.'%'));
	}

	public function findAjaxByName($query)
	{

		$user = new Application_Model_DbTable_User();
		$userRow = $user->fetchAll($user->select()->where('status = 1 and name LIKE ?', '%'.$query.'%'));
		$aux=array();
		foreach($userRow as $flag)
		{
			$aux1=array('id'=>$flag->id, 'label'=>$flag->name);
			array_push($aux,$aux1);
		}

		return $aux;
	}


	public function returnUserInformation($userId)
	{
		$user = new Application_Model_DbTable_User();
		$select = $user->select()->setIntegrityCheck(false);
		$select	->from(array('u' => 'user'), array('id', 'name', 'username'))
				->joinLeft(array('sy' => 'system_access'), 'sy.id_user = u.id', array('access_date' => 'date'))
				->where('u.status = 1 and u.id = ?',$userId)
				->order('sy.date DESC')
				->limit(1,1);
				//echo ($select);
				//$teste = $user->fetchRow($select); var_dump($teste); exit;
		return $user->fetchRow($select);
	}



	public function listAll()
	{
		$user = new Application_Model_DbTable_User();
		$select = $user->select()->setIntegrityCheck(false);
		$select	->from(array('u' => 'user'));
		return $user->fetchAll($select);	
	}

	public function listByType($type)
	{
		$user = new Application_Model_DbTable_User();
		$select = $user->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'user') )
				->where('institution = ?',$type)
				->where('id != 169'); // 166 desenvolvimento e 169 produção
				//echo $select."<br>";
		return $user->fetchAll($select);
			
	}

}

