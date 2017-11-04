<?php
include 'baza/model.php';

  
    $func = new userFunc();
    $result = $func->getVrste();  
    echo json_encode($result);

?>