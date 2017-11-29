<?php

class Application_Model_General
{
	public static function dateToUs($date)
	{
		if($date == '0000-00-00' || $date == '')
      return new Zend_Db_Expr('NULL');
		$aux = explode('/', $date);
		return rtrim($aux[2]).'-'.$aux[1].'-'.$aux[0];
	}

	

	public static function dateToBr($date)
	{
	    if($date == '0000-00-00' || $date == '')
	      return '';
			$aux = explode('-', $date);
			$date = $aux[2].'/'.$aux[1].'/'.$aux[0];
			return $date;
	}


	public static function dateToUsTrail($date)
	{
		if($date == '0000-00-00' || $date == '')
      return new Zend_Db_Expr('NULL');
		$aux = explode('-', $date);
		return rtrim($aux[2]).'/'.$aux[1].'/'.$aux[0];
	}

	
	public static function dateToBrWithTrail($date) 
	{
    if($date == '0000-00-00' || $date == '')
      return '';
		$aux = explode('-', $date);
		$date = $aux[2].'-'.$aux[1].'-'.$aux[0];
		return $date;
	}

	public static function dateTimeToUs($date) // Kneel before Zod creator of this function!!!
	{
	    if($date == '0000-00-00' || $date == '')
	      return '';
		$aux = explode('/', $date);
		$aux1 = explode(' ', $aux[2]); // separa o dia da hora
		$dateTime = rtrim($aux1[0]).'-'.$aux[1].'-'.$aux[0].' '.$aux1[1];
		return $dateTime;
	}

	public static function convertToMinute($hour)
	{
	    if($hour == '00:00' || $hour == '')
	      return '';
		$aux = explode(':', $hour);
		$min = $aux[1];
		$hour = $aux[0];
		$conv_hour= $hour*60;
		$total_min = $conv_hour + $min;

		return $total_min;
	}

	public static function convertToHour($hour)
	{
	    if($hour == '00:00' || $hour == '')
	      return '';
		$hour = $hour/60;

		return $hour;
	}

	public static function hourToMinute($start_hour,$end_hour)
	{
	    if($start_hour == '0000-00-00' || $start_hour == '' || $end_hour == '0000-00-00' || $end_hour == '')
	      return '';
		$aux = explode(':', $start_hour);
		$min = $aux[1];
		$hour = $aux[0];
		$start_conv_hour= $hour*60;
		$start_total_min = $start_conv_hour + $min;

		$aux1 = explode(':', $end_hour);
		$min2 = $aux1[1];
		$hour2 = $aux1[0];
		if ($hour2 < $hour) { // When the trip ends after 00:00, result will be negative
			$hour2 = 24 + $hour2;
		}
		$end_conv_hour= $hour2*60;
		$end_total_min = $end_conv_hour + $min2;

		$total_time = $end_total_min - $start_total_min;
		return $total_time." min";
	}

	public static function dateTimeToBr($date)
	{
	    if($date == '0000-00-00' || $date == '')
	      return '';
		$aux = explode('-', $date);
		$aux1 = explode(' ', $aux[2]); // separa o dia da hora
		$dateTime = $aux1[0].'/'.$aux[1].'/'.$aux[0].' '.$aux1[1];
		return $dateTime;
	}

	public static function convertHour($hour)
	{
		if($hour == '')
      return new Zend_Db_Expr('NULL');
    return $hour[0].$hour[1].':'.$hour[2].$hour[3];
	}

	public static function returnConsortium($rit)
	{
		$consortium = new Application_Model_DbTable_Consortium();
		$consortiumRow = $consortium->fetchRow($consortium->select()->where('id = ?',$rit));
		return $consortiumRow->name;
	}

	public static function cutString($text, $start=0, $end=100)
	{
		$text = ltrim($text);
		$j = $start;
		if(isset($text[$start-1]) && ( $text[$start] != "" || $text[$start] != " ") )
		{
			while($text[$j] != " ")
  		{
    		$j++;
  		}
		}
		$text = ltrim($text);
		$cutText = substr($text, $j, $end-$j);
		if(strlen($text) < $end)
		{
    	$end = strlen($text);
		}
		$i = $end;
  	if($cutText[strlen($cutText)-1] != " ")
  	{
  		if(isset($text[$i]))
  		{
	  		while($text[$i] != " ")
	  		{
	    		$cutText .= $text[$i];
	    		$i++;
	  		}
  		}
  	}
    return $cutText;
  }

  public function getWrappedText($string, Zend_Pdf_Style $style,$max_width)
	{
    $wrappedText = '' ;
    $lines = explode("\n",$string) ;
    foreach($lines as $line) {
         $words = explode(' ',$line) ;
         $word_count = count($words) ;
         $i = 0 ;
         $wrappedLine = '' ;
         while($i < $word_count)
         {
             /* if adding a new word isn't wider than $max_width,
             we add the word */
             if($this->widthForStringUsingFontSize($wrappedLine.' '.$words[$i]
                 ,$style->getFont()
                 , $style->getFontSize()) < $max_width) {
                 if(!empty($wrappedLine)) {
                     $wrappedLine .= ' ' ;
                 }
                 $wrappedLine .= $words[$i] ;
             } else {
                 $wrappedText .= $wrappedLine."\n" ;
                 $wrappedLine = $words[$i] ;
             }
             $i++ ;
         }
         $wrappedText .= $wrappedLine."\n" ;
     }
     return $wrappedText ;
	}


	 public function widthForStringUsingFontSize($string, $font, $fontSize)
	 {
	     $drawingString = iconv('UTF-8', 'UTF-16BE//IGNORE', $string);
	     $characters = array();
	     for ($i = 0; $i < strlen($drawingString); $i++) {
	         $characters[] = (ord($drawingString[$i++]) << 8 ) | ord($drawingString[$i]);
	     }
	     $glyphs = $font->glyphNumbersForCharacters($characters);
	     $widths = $font->widthsForGlyphs($glyphs);
	     $stringWidth = (array_sum($widths) / $font->getUnitsPerEm()) * $fontSize;
	     return $stringWidth;
	 }

	 public function dateBefore($date){
	 	$aux = explode("/", $date);
	 	return date("d/m/Y", mktime(0,0,0, $aux[1], $aux[0]-1, $aux[2]));
	 }

	 public function dotTocomma()
	 {
	 	str_replace('.', ',', subject);
	 }



	public function validateHourRange($hour){
		if(strlen($hour) == 1){
			if ($hour == 9) {
				$faixa = "0".$hour.":00-".($hour+1).":00";
				return $faixa;
			}else{
				$faixa = "0".$hour.":00-0".($hour+1).":00";
				return $faixa;
			}
		}else{
			$faixa =  $hour.":00-".($hour+1).":00";
			return $faixa;
		}
	}



public function TypeOfDayName($id){
		$day = new Application_Model_DbTable_QcoTypeDay();
   		$aux = $day->fetchRow($day->select('name')->where('id = ?',$id));
   		return $aux->name;
 	}
 	

	public function toUtilityDay($id_day){
		switch ($id_day) {
			case '2':
				$u_day = '8';
				break;
			case '3':
				$u_day = '8';
				break;
			case '4':
				$u_day = '8';
				break;
			case '5':
				$u_day = '8';
				break;
			case '6':
				$u_day = '8';
				break;
			default:
				$u_day = $id_day; // if not a day of week, the id_day is correct
				break;
		}
		return $u_day;
	}



	public function calculateDateWithUtilityFunction($day, $line){
		$aux = Application_Model_Trip::getTypeOfDay($day,$line);
		$real_day = Application_Model_General::toUtilityDay($aux);
		$result = array(Application_Model_General::TypeOfDayName($real_day),$real_day);
		return $result;
	}



	public function calculateDate($day, $line){
		$aux = Application_Model_Trip::getTypeOfDay($day,$line);
		$result = array(Application_Model_General::TypeOfDayName($aux),$aux);
		return $result;
	}



  public function findSerializeError($data1) {
    echo "<pre>";
    $data2 = preg_replace ( '!s:(\d+):"(.*?)";!e', "'s:'.strlen('$2').':\"$2\";'",$data1 );
    $max = (strlen ( $data1 ) > strlen ( $data2 )) ? strlen ( $data1 ) : strlen ( $data2 );

    echo $data1 . PHP_EOL;
    echo $data2 . PHP_EOL;

    for($i = 0; $i < $max; $i ++) {

        if (@$data1 {$i} !== @$data2 {$i}) {

            echo "Diffrence ", @$data1 {$i}, " != ", @$data2 {$i}, PHP_EOL;
            echo "\t-> ORD number ", ord ( @$data1 {$i} ), " != ", ord ( @$data2 {$i} ), PHP_EOL;
            echo "\t-> Line Number = $i" . PHP_EOL;

            $start = ($i - 20);
            $start = ($start < 0) ? 0 : $start;
            $length = 40;

            $point = $max - $i;
            if ($point < 20) {
                $rlength = 1;
                $rpoint = - $point;
            } else {
                $rpoint = $length - 20;
                $rlength = 1;
            }

            echo "\t-> Section Data1  = ", substr_replace ( substr ( $data1, $start, $length ), "<b style=\"color:green\">{$data1 {$i}}</b>", $rpoint, $rlength ), PHP_EOL;
            echo "\t-> Section Data2  = ", substr_replace ( substr ( $data2, $start, $length ), "<b style=\"color:red\">{$data2 {$i}}</b>", $rpoint, $rlength ), PHP_EOL;
        }

    }
	}


  public function moneyToBr($price){
  	$full = substr($price, 0, (strlen($price)-3)); //get the non-decimal part and split;
		$full_final = "";
		$size = strlen($full);
		if ($size % 3 == 0) {
			$full = str_split($full, 3); //get the non-decimal part and split;
			$size = count($full);
			for ($i = 0; $i < $size; $i++){
				if ($i == 0){
					$full_final = $full_final.$full[$i];
				}else{
					$full_final = $full_final.".".$full[$i];	
				}
			}
			return $full_final.",".substr($price, strlen($price)-2);
		}else{
			$split_part = "";
			$j = 0;
			for ($i = $size-1; $i >= 0 ; $i--, $j++) { 
				if ($j != 0 && ($j % 3) == 0){
					$split_part = $full[$i].".".$split_part;
				}
				$split_part = $full[$i].$split_part;
			}
			return substr($split_part, 1).",".substr($price, strlen($price)-2);
  		}
	}
}