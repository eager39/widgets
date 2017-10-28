<?php
include '../../model.php';
   $widget=$_GET["widget"];
    $func = new userFunc();
    $result = $func->getGrafMonthandYear($widget);  
    echo json_encode($result);

?>