<?php
include 'baza/model.php';

$id=($_POST["id"]);


$func = new userFunc();
$result = $func->deleteTodo($id);  

if($result){
    return true;
}
?>