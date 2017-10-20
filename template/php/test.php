<?php
include '../../model.php';
    if(isset($_GET["id"])){
    $test=$_GET["id"];
    
    }else{
    $test="";}
    $func = new userFunc();
    $result = $func->getPoraba($test);  
    echo $result;

?>