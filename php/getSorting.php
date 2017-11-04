<?php
include 'baza/model.php';
   $id=$_GET["id"];
    $func = new userFunc();
    $result = $func->getSorting($id);  
    echo json_encode($result);

?>