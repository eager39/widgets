<?php
include 'baza/model.php';

    $id=$_POST["id"];
    $func = new userFunc();
    $result = $func->deletePoraba($id);  
    echo $result;

?>