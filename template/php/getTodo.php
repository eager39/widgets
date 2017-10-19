<?php
include '../../model.php';

session_start();

$id=$_GET["id"];
$func = new userFunc();
$result = $func->getTodo($id);  

echo json_encode($result);

?>