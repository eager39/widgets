<?php
include '../../model.php';

    $widget_id=$_GET["id"];
    $userid=$_GET["test"];
    $func = new userFunc();
    $result = $func->widgetConfig($widget_id,$userid);  
    echo json_encode($result);

?>