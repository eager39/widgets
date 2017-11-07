<?php
include 'baza/model.php';

    $widget=$_GET["widget"];
    $mesec=$_GET["mesec"];
    $func = new userFunc();
    $result = $func->getAllPoraba($widget,$mesec);  
    echo json_encode($result);

?>