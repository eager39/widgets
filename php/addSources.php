<?php
include 'baza/model.php';
    
    $sources=json_decode($_POST["sources"]);
    $func = new userFunc();
    $result = $func->addSources($sources);
    echo $result;
?>