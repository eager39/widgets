<?php
include '../../model.php';

$array=($_POST["asd"]);

$array=json_decode($array);
$func = new userFunc();
$result = $func->addWidget($array);  

if($result){
    echo "perfect";
}
?>