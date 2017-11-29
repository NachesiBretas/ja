<?php

class Application_Model_User
{

	public function newUser($data)
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
			$userRow->password = sha1($data['cidadao_senha']);
			$userRow->email = $data['cidadao_email'];
			$userRow->phone = $data['cidadao_phone'];
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 6;
			return $userRow->save();
		}

		if($data['empresa_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['empresa_nome'];
			$userRow->username = $data['empresa_email'];
			$userRow->password = sha1($data['empresa_senha']);
			$userRow->email = $data['empresa_email'];
			$userRow->phone = $data['empresa_phone'];
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 7;
			return $userRow->save();
		}

		if($data['adv_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['adv_nome'];
			$userRow->username = $data['adv_email'];
			$userRow->password = sha1($data['adv_senha']);
			$userRow->email = $data['adv_email'];
			$userRow->phone = $data['adv_phone'];
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 8;
			return $userRow->save();
		}

		/////////// 9 é o geral do sistema pra consulta Ajax

		if($data['arbitragem_nome'])
		{
			$user = new Application_Model_DbTable_User();
			$userRow = $user->createRow();
			$userRow->name = $data['arbitro_nome'];
			$userRow->username = $data['arbitro_email'];
			$userRow->password = sha1($data['arbitro_senha']);
			$userRow->email = $data['arbitro_email'];
			$userRow->phone = $data['arbitro_phone'];
			$userRow->date = new Zend_Db_Expr('NOW()');
			$userRow->institution = 10;
			return $userRow->save();
		}

    	return false;
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
}

