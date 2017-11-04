<?php
include 'baza/model.php';

$id=($_POST["id"]);
$type=$_POST["type"];


$func = new userFunc();
$result = $func->deleteWidget($id,$type);  

if($result){
    echo $result;
}

//emmm return ti nič ne pomaga moga boš printateč de hteja angular readate  bedna XD
?>