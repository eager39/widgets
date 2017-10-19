<?php
include '../../model.php';

$array=$_POST["delo"];

$array=json_decode($array);
$func = new userFunc();
$result = $func->addTodo($array);  

if($result){
    echo "perfect";
}
?>