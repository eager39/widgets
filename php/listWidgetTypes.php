<?php
include 'baza/model.php';


    $func = new userFunc();
    $result = $func->listWidgetTypes();
    echo json_encode($result);
  

?>