<?php
include '../../model.php';
$active = $_POST["active"];
$id=$_POST["id"];


$func = new userFunc();

	$result = $func->widgetVisibility($active,$id);
    if($result){
        echo "uspeh";
    }else{
        echo "error";
    }

 
?>