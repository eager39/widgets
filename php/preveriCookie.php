<?php
include 'baza/model.php';
$cookie = strip_tags(trim(addslashes($_GET["cookie"])));

$func = new userFunc();
$result = $func->preveriCookie($cookie);
if($result ==1){
	echo json_encode($_SESSION);
}
?>