<?php
include 'baza/model.php';

$array=($_POST["data"]);

$array=json_decode($array);
$func = new userFunc();
$result = $func->updateWidgetConfig($array);  

if($result){
    echo "perfect";
}
?>