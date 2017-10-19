
<?php
include '../../model.php';

$array=$_POST["poraba"];

$array=json_decode($array);
$func = new userFunc();
$result = $func->addPoraba($array);  

if($result){
    echo "perfect";
}
?>