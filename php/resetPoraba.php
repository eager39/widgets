<?php
include 'baza/model.php';

  
    $func = new userFunc();
    $result = $func->resetPoraba();  
    echo $result;

?>