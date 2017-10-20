<?php
include '../../model.php';
   
    $func = new userFunc();
    $result = $func->getGrafMonthandYear();  
    echo json_encode($result);

?>