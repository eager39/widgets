<?php
include 'baza/model.php';

$result = file_get_contents("../images/weather.jpeg");
$base64 = 'data:image/jpeg;base64,' . base64_encode($result);
echo $base64;
?>