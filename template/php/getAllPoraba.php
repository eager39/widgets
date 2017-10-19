<?php
include '../../model.php';

  
    $func = new userFunc();
    $result = $func->getAllPoraba();  
    echo json_encode($result);

?>