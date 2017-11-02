<?php
include 'baza/model.php';
$secret="6LdW2jUUAAAAABuJKTcn1gHXka5bY-UxtbvyPKSm";
$response=$_GET["response"];
$result = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$response);
echo $result;
?>