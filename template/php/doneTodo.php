<?php
include '../../model.php';

$id=($_POST["id"]);


$func = new userFunc();
$result = $func->doneTodo($id);  

if($result){
    return true;
}
?>