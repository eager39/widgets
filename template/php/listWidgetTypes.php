<?php
include '../../model.php';


    $func = new userFunc();
    $result = $func->listWidgetTypes();
    echo json_encode($result);
  

?>