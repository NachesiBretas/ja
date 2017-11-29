<?php

class Application_Model_Conflict
{

	public function returnById($conflictId)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('id_conflict', 'desc_conflict', 'id_conflict_documents', 
													  'desc_sugest_resolution', 'estimate_price') )
				->joinLeft(array('u' => 'user'),'c.id_user=u.id', array('name_u' => 'name',
																		'email_u' => 'email',
																		'phone_u' => 'phone',
																		'sex',
																		'cpf',
																		'profession',
																		'nationality',
																		'marital_status',
																		'date_birth'))
				->joinLeft(array('ou' => 'other_user'),'c.id_other_user=ou.id_other_user', array('name_ou' => 'name',
																								 'email_ou' => 'email',
																								 'phone_ou' => 'phone',
																								 'cpf_cnpj'))
				->joinLeft(array('au' => 'user_address'),'u.id_address=au.id_address', array('place_u' => 'place',
																							 'number_u' => 'number',
																							 'complement_u' => 'complement',
																							 'neighborhood_u' => 'neighborhood',
																							 'uf_u' => 'uf',
																							 'city_u' => 'city',
																							 'cep_u' => 'cep'))
				->joinLeft(array('aou' => 'user_address'),'ou.id_address=aou.id_address', array('place_ou' => 'place',
																							 	'number_ou' => 'number',
																								 'complement_ou' => 'complement',
																								 'neighborhood_ou' => 'neighborhood',
																								 'uf_ou' => 'uf',
																								 'city_ou' => 'city',
																								 'cep_ou' => 'cep'))
				->where('c.id_conflict = ?',$conflictId);
				//echo $select;exit;
		return $conflict->fetchRow($select);
	}



	public function returnByType($type)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('c.*') )
				->where('type = ?', $type);
				//echo $select;exit();
		return $conflict->fetchAll($select);
	}
	

	public function returnByTypeDemand($c_type)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('c.*') )
				->where('type = 3 and conflict_type = ?', $c_type);
		return $conflict->fetchAll($select);
	}

	public function returnByCity($city)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('*') )
				->joinLeft(array('u' => 'user'),'c.id_user=u.id', array('name_u' => 'name',
																		'email_u' => 'email',
																		'phone_u' => 'phone',
																		'sex',
																		'cpf',
																		'profession',
																		'nationality',
																		'marital_status',
																		'date_birth'))
				->joinInner(array('ou' => 'other_user'),'c.id_other_user=ou.id_other_user', array('name_ou' => 'name',
																								 'email_ou' => 'email',
																								 'phone_ou' => 'phone',
																								 'cpf_cnpj'))
				->joinInner(array('au' => 'user_address'),'u.id_address=au.id_address', array('place_u' => 'place',
																							 'number_u' => 'number',
																							 'complement_u' => 'complement',
																							 'neighborhood_u' => 'neighborhood',
																							 'uf_u' => 'uf',
																							 'city_u' => 'city',
																							 'cep_u' => 'cep'))
				->where('au.city = ?', $city);
		return $conflict->fetchAll($select);
	}

	public function returnByState($state)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('*') )
				->joinLeft(array('u' => 'user'),'c.id_user=u.id', array('name_u' => 'name',
																		'email_u' => 'email',
																		'phone_u' => 'phone',
																		'sex',
																		'cpf',
																		'profession',
																		'nationality',
																		'marital_status',
																		'date_birth'))
				->joinInner(array('ou' => 'other_user'),'c.id_other_user=ou.id_other_user', array('name_ou' => 'name',
																								 'email_ou' => 'email',
																								 'phone_ou' => 'phone',
																								 'cpf_cnpj'))
				->joinInner(array('au' => 'user_address'),'u.id_address=au.id_address', array('place_u' => 'place',
																							 'number_u' => 'number',
																							 'complement_u' => 'complement',
																							 'neighborhood_u' => 'neighborhood',
																							 'uf_u' => 'uf',
																							 'city_u' => 'city',
																							 'cep_u' => 'cep'))
				->where('au.uf = ?', $state);
		return $conflict->fetchAll($select);
	}


	public function buscaTaxaReg()
	{
		$authNamespace = new Zend_Session_Namespace('userInformation');
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('c.estimate_price') )
						->where('c.id_user = ?',$authNamespace->user_id)
						->where('c.estimate_price != 0.00')
						->order('id_conflict desc');
		$preco_estimado = $conflict->fetchRow($select);
		
		if(isset($preco_estimado) && $preco_estimado !=0){
		$vc = new Application_Model_DbTable_ValorCausa();
		$select2 = $vc->select()->setIntegrityCheck(false);
		$select2	->from(array('c' => 'valor_causa'),array('valor' =>'(c.taxa_registro + c.taxa_adm)') )
						->where('c.de <= ?',$preco_estimado['estimate_price'])
						->where('c.ate >= ?',$preco_estimado['estimate_price']);
						//echo $select2;
		$teste = $vc->fetchRow($select2);
		//print_r($teste); exit();
		
		return  $teste['valor'];
		}
		else
			return 0;
		
	}

	public function listAll()
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'))
				->where('status = 0');
		return $conflict->fetchAll($select);
			
	}

	public function listAllAccepted()
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'))
				->where('status <> 0');
		return $conflict->fetchAll($select);
			
	}

	public function listAllConflictHistoric($id_conflict)
	{
		$conflict = new Application_Model_DbTable_ConflictHistoric();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict_historic'))
				->joinInner(array('u' => 'user'),'c.user_id=u.id',array('name'))
				->joinInner(array('cs' => 'conflict_status'),'cs.id_status=c.status',array('nome'))
				->where('id_conflict = ?',$id_conflict);
		return $conflict->fetchAll($select);
	}

	public function listConflictHistoricById($id_conflictHistoric)
	{
		$conflict = new Application_Model_DbTable_ConflictHistoric();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict_historic'))
				->joinInner(array('cs' => 'conflict_status'),'cs.id_status=c.status',array('nome'))
				->where('(status = 4 or status = 5) and id_historic = ?',$id_conflictHistoric);
				//echo $select;
		return $conflict->fetchRow($select);
	}

	public function lists($type)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('c.id_conflict','c.desc_conflict') )
						->joinLeft(array('u' => 'user'),'c.id_user=u.id',array('name'))
						->where('type = ?',$type);
		return $conflict->fetchAll($select);
			
	}

	public function listsAccepted($type)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('c.id_conflict','c.desc_conflict') )
						->joinLeft(array('u' => 'user'),'c.id_user=u.id',array('name'))
						->where('status = ?',$type);
		return $conflict->fetchAll($select);		
	}

	public function listsAcceptedByUser()
	{
		$authNamespace = new Zend_Session_Namespace('userInformation');
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict'),array('c.id_conflict','c.desc_conflict') )
						->joinLeft(array('u' => 'user'),'c.id_user=u.id',array('name'))
						->where('u.id = ?',$authNamespace->user_id)
						->where('status != 0 ');
		return $conflict->fetchAll($select);		
	}

	public function listNewsByType($status,$type)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict') )
				->where('status = ?', $status ,' and type = ?',$type);
		return $conflict->fetchAll($select);
			
	}

	public function listAcceptedByType($type)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$select = $conflict->select()->setIntegrityCheck(false);
		$select	->from(array('c' => 'conflict') )
				->where('status = ?',$type);
		return $conflict->fetchAll($select);
			
	}

	public function saveConflictHistoric($data,$id_conflict)
	{
		$authNamespace = new Zend_Session_Namespace('userInformation');
		$conflict = new Application_Model_DbTable_ConflictHistoric();
		$conflictRow =  $conflict->createRow();
		$conflictRow->date = new Zend_Db_Expr('NOW()');
		$conflictRow->user_id = $authNamespace->user_id;
		$conflictRow->id_conflict = $data['conflictId'];
		$conflictRow->status = $data['conflict_status'];
		$conflictRow->desc = $data['desc_status'];

		$conflictRow->save();
	}


	
	public function saveDocument($files,$data,$conflictId)
	{
		try{
			$authNamespace = new Zend_Session_Namespace('userInformation');
			$conflictDocuments = new Application_Model_DbTable_ConflictDocuments();
			$ext = substr(strrchr($files['file']['name'],'.'),1);			
			if($this->saveFile($files,$ext,$data,$conflictId))
			{ 
				$conflictNew = $conflictDocuments->createRow();
				$conflictNew->conflict_id = $conflictId;

				$date = date('Y-m-d');
				$conflictNew->document = $data['document'].'_'.$date.'.'.$ext;

				
				$conflictNew->user_id = $authNamespace->user_id; 	
		    	$conflictNew->date = new Zend_Db_Expr('NOW()');
				return $conflictNew->save();
			}
			return false;
			
		}catch(Zend_Exception $e){
			return false;
		}
	}


	protected function saveFile($file,$ext,$data,$conflictId)
	{
		$target_directory = APPLICATION_PATH.'/../public/upload/conflitos/'.$conflictId;
		$this->directory($target_directory);

		$date = date('Y-m-d');
		$newFile = $target_directory.'/'.$data['document'].'_'.$date.'.'.$ext;
		
		return move_uploaded_file($file['file']['tmp_name'], $newFile);
	}



	protected function directory($target_directory)
	{
		if(!is_dir($target_directory))
		{
			mkdir($target_directory,0700);
		}
	}


	public function changeStatus($conflictId,$status)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$conflictRow = $conflict->fetchRow($conflict->select()->where('id_conflict = ?',$conflictId));
		$conflictRow->status = $status;

		return $conflictRow->save();	
	}

	public function changeStatusReturneds($conflictId,$status)
	{
		$conflict = new Application_Model_DbTable_Conflict();
		$conflictRow = $conflict->fetchRow($conflict->select()->where('id_conflict = ?',$conflictId));
		$conflictRow->status = $status;

		return $conflictRow->save();	
	}


	public function returnDocument($conflictId,$document,$hour=0){		
		if($hour != 0){
			$hour = explode(":",$hour); 
			$document = $document.'_'.$hour[0]."-".$hour[1];
		}
		$aux = substr($document,0,4);

		$conflict = new Application_Model_DbTable_ConflictDocuments();
		$select = $conflict->select()->setIntegrityCheck(false);

		$select	->from(array('v' => 'conflict_documents'),array('id_conflict_documents','document') )
						->where('v.conflict_id = ?', $conflictId)
						->where('substr(v.document,1,4) like ?', $aux."%");
		
		$conflictRow = $conflict->fetchAll($select);
		return $conflictRow;
	}

	public function deleteDocument($id){
		$document = new Application_Model_DbTable_ConflictDocuments();
		$documentRow = $document->fetchRow($document->select()->where('id = ?',$id));
		if($documentRow->delete())
		{
			return true;
		}
		return false;
	}


	public function newConflictCid($data,$id_user)
	{
		if($data)
		{

			//$id_user = 153;  //$this->newUserCid($data);

			$conflict = new Application_Model_DbTable_Conflict();
			$data['tribunal'] = NULL;
			$data['comarca'] = NULL;
			$data['process_number'] = NULL;
			$data['desc_conflict'] = $data['cidadao_desc_conflito'];
			$data['desc_sugest_resolution'] = $data['cidadao_desc_resolucao_conflito'];
			$data['id_user'] = $id_user;//$authNamespace->user_id;
 			$data['id_other_user'] = NULL; // TIRAR ESSE CAMPO DESSA TABELA
			$data['estimate_price'] = $data['simulacao'];
			$data['type'] = 1;
			$data['status'] = 0; //0 vai ser NOVO na tabela de status
			$data['conflict_type'] = NULL;
			$data['id_conflict_documents'] = NULL; /// TIRAR ESSE CAMPO DESSA TABELA
			$conflictNew = $conflict->createRow($data);
			$id = $conflictNew->save();

			$this->newOtherUser($id,$data);
			return $id;
		}
		return false;
	}

	public function newConflictEmp($data)
	{
		if($data)
		{
			//$authNamespace = new Zend_Session_Namespace('userInformation');
			$id_user = $this->newUserCid($data);

			$conflict = new Application_Model_DbTable_Conflict();
			$data['tribunal'] = NULL;
			$data['comarca'] = NULL;
			$data['process_number'] = NULL;
			$data['desc_conflict'] = $data['emp_desc_conflito'];
			$data['desc_sugest_resolution'] = $data['emp_desc_resolucao_conflito'];
			$data['id_user'] = $id_user;//$authNamespace->user_id;
 			$data['id_other_user'] = NULL; // TIRAR ESSE CAMPO DESSA TABELA
			$data['estimate_price'] = $data['simulacao'];
			$data['type'] = 1;
			$data['status'] = 0; //0 vai ser NOVO na tabela de status
			$data['conflict_type'] = NULL;
			$data['id_conflict_documents'] = NULL; /// TIRAR ESSE CAMPO DESSA TABELA
			$conflictNew = $conflict->createRow($data);
			$id = $conflictNew->save();

			$this->newOtherUser($id,$data);
			return $id;
		}
		return false;
	}

	public function newUserCid($data,$user_type)
	{
		$user = new Application_Model_DbTable_User();
		$userRow = $user->createRow();
		$userRow->name = $data['cidadao_nome'];
		$userRow->username = $data['cidadao_email'];
		$userRow->password = sha1($data['cidadao_senha']);
		$userRow->email = $data['cidadao_email'];
		$userRow->phone = $data['cidadao_phone'];
		$userRow->date = new Zend_Db_Expr('NOW()');
		$userRow->institution = 2;
		$userRow->cpf = $data['cidadao_cpf'];
		$userRow->sex = $data['cidadao_sexo'];
		$userRow->date_birth = $data['cidadao_data_nascimento']; 
		$userRow->marital_status = $data['cidadao_estado_civil'];
		$userRow->nationality = $data['cidadao_nationalidade'];
		$userRow->profession = $data['cidadao_profissao'];
		$userRow->oab_number = NULL;
		$userRow->id_address = NULL; //TIRAR ESSE CAMPO DESSA TABELA
		$user_id = $userRow->save();

		$this->newUserAddress($user_id,$data,0);

		return $user_id;
	}


	public function newUserAddress($user_id,$data,$user_type)
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
		if($user_type == 0){
			$userRow->user_id = $user_id;
			$userRow->other_user_id = NULL;
		}
		else{
			$userRow->user_id = NULL;
			$userRow->other_user_id = $user_id;
		}
		$userRow->type = $user_type;

		print_r($userRow);exit();
		return $userRow->save();
	}


	public function newOtherUser($id_conflict,$data)
	{
		$user = new Application_Model_DbTable_OtherUser();
		$userRow = $user->createRow();
		$userRow->name = $data['nome_op'];
		$userRow->email = $data['email_op'];
		$userRow->phone = $data['phone_op'];
		$userRow->person_type = $data['tp_op'];
		$userRow->cpf_cnpj = $data['cpf_op'];
		$userRow->id_address = null;
		$userRow->conflict_id = $id_conflict;
		$user_id = $userRow->save();

		$this->newUserAddressOP($user_id,$data,1);

		return $user_id;
	}

	public function newUserAddressOP($user_id,$data,$user_type)
	{
		$user = new Application_Model_DbTable_UserAddress();
		$userRow = $user->createRow();
		$userRow->place = $data['logradouro_op'];
		$userRow->number = $data['num_log_op'];
		$userRow->complement = $data['complemento_op'];
		$userRow->neighborhood = $data['bairro_op'];
		$userRow->uf = $data['uf_op'];
		$userRow->city = $data['cidade_op'];
		$userRow->cep = $data['cep_op'];
		if($user_type == 0){
			$userRow->user_id = $user_id;
			$userRow->other_user_id = NULL;
		}
		else{
			$userRow->user_id = NULL;
			$userRow->other_user_id = $user_id;
		}
		$userRow->type = $user_type;
		return $userRow->save();
	}


}

