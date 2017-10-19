<?php
include '../../model.php';

  
    $func = new userFunc();
    $result = $func->getVrste();  
    echo json_encode($result);

?>