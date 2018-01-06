<?php
include 'baza/model.php';

    $widget_id=$_GET["id"];
    $func = new userFunc();
    $result = $func->widgetConfig($widget_id);  
    echo json_encode($result);

?>