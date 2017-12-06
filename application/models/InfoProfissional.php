<?php

class Application_Model_InfoProfissional
{
	public function newProfissional($user_id, $data)
	{

		$user = new Application_Model_DbTable_InfoProfissional();
		$userRow = $user->createRow();
		$userRow->id_user = $user_id;
		$userRow->cetificado_formacao = $data['certificado'];
		$userRow->especialidade = $data['especialidade'];
		$userRow->minicurriculo = $data['minicurriculo'];
		$user_id = $userRow->save();
		
		return $user_id;
	
	}

	public function createAnnexCertificado($user_id, $file)
	{		
		// var_dump($file);exit;
	    $permittedNot = array('application/x-msdownload', 'application/octet-stream', 'application/javascript');
	    
      // O nome original do arquivo no computador do usuário
      $fileName = $file['name'];

      // O tipo mime do arquivo. Um exemplo pode ser "image/gif"
      $fileType = $file['type'];
      // O tamanho, em bytes, do arquivo
      $fileSize = $file['size'];
      // O nome temporário do arquivo, como foi guardado no servidor
      $fileTemp = $file['tmp_name'];
      // O código de erro associado a este upload de arquivo
      $fileError = $file['error'];
     	//var_dump($fileType);exit;
      if ($fileError == 0) {
        // Verifica o tipo de arquivo enviado
        if (array_search($fileType, $permittedNot) !== false) {

          return 0;
        // Não houveram erros, move o arquivo
        }else{
        	// echo "string";exit;
        	mkdir("../public/upload/certificado/$user_id/");
          $folder = "../public/upload/certificado/$user_id/";
          // var_dump($fileTemp);exit;
          $upload = move_uploaded_file($fileTemp, $folder.$fileName);
          // var_dump($upload);exit;
        } 
      }
      // var_dump($upload);exit;
      if ($upload == true) {

        $doc = new Application_Model_DbTable_InfoProfissional(); 
       	$annexBox = $doc->fetchRow($doc->select()->where('id = ?',$user_id));
        if($annexBox)
				{      
					//var_dump($fileName);exit;
					$annexBox->annex_certificado = $fileName;
					return $annexBox->save();
				}
				
			}
		
	}

	public function createAnnexCurriculo($user_id, $file)
	{		
	    $permittedNot = array('application/x-msdownload', 'application/octet-stream', 'application/javascript');
	    
      // O nome original do arquivo no computador do usuário
      $fileName = $file['name'];

      // O tipo mime do arquivo. Um exemplo pode ser "image/gif"
      $fileType = $file['type'];
      // O tamanho, em bytes, do arquivo
      $fileSize = $file['size'];
      // O nome temporário do arquivo, como foi guardado no servidor
      $fileTemp = $file['tmp_name'];
      // O código de erro associado a este upload de arquivo
      $fileError = $file['error'];
     	//var_dump($fileType);exit;
      if ($fileError == 0) {
        // Verifica o tipo de arquivo enviado
        if (array_search($fileType, $permittedNot) !== false) {

          return 0;
        // Não houveram erros, move o arquivo
        }else{
        	mkdir("../public/upload/curriculo/$user_id/");
          $folder = "../public/upload/curriculo/$user_id/";
          //var_dump($folder);exit;
          $upload = move_uploaded_file($fileTemp, $folder.$fileName);
        } 
      }
      //var_dump($upload);exit;
      if ($upload == true) {
        $doc = new Application_Model_DbTable_InfoProfissional(); 
       	$annexBox = $doc->fetchRow($doc->select()->where('id = ?',$user_id));
        if($annexBox)
				{      
					//var_dump($fileName);exit;
					$annexBox->annex_curriculo = $fileName;
					return $annexBox->save();
				}
				
			}
		
	}

}