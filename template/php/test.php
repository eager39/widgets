<?php
include '../../model.php';

  
    $func = new userFunc();
    $result = $func->getPoraba();  
    echo $result;

?>