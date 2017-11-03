<?php
include 'baza/model.php';
session_start();
if(!isset($_SESSION["user"])){
    echo "error";
}  else {
    $func = new userFunc();
    $result = $func->widgetinit();  
    echo json_encode($result);
}
?>