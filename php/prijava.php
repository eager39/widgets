<?php
include 'baza/model.php';
$email = strip_tags(trim(addslashes($_POST["email"])));
$password = $_POST["password"];
$func = new userFunc();
$result = $func->prijava($email,$password);
if($result =="legit"){
	echo json_encode($_SESSION);
}else{
	echo $result;
}
?>