<?php
include 'baza/model.php';

    $widget_id=$_GET["id"];
    //$userid=$_GET["userid"];
    $func = new userFunc();
    $result = $func->widgetConfig($widget_id);  
    echo json_encode($result);

?>