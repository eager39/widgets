<?php
include 'baza/model.php';

$id=($_POST["id"]);


$func = new userFunc();
$result = $func->deleteDogodek($id);  

if($result){
    return true;
}
?>