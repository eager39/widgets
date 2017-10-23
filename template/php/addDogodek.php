<?php
include '../../model.php';

$array=$_POST["dogodek"];

$array=json_decode($array);
$func = new userFunc();
$result = $func->addDogodek($array);  

if($result){
    echo "perfect";
}
?>