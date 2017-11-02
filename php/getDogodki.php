<?php
include 'baza/model.php';

session_start();

$id=$_GET["id"];
$mesec=$_GET["mesec"];
$func = new userFunc();
$result = $func->getDogodek($id,$mesec);  

echo json_encode($result);

?>