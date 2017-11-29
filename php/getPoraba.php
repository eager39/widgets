<?php
include 'baza/model.php';
    $tMesec=$_GET["tMesec"];
    $widget=$_GET["widget"];
    if(isset($_GET["mesec"])){
   $mesec=$_GET["mesec"];
   $leto=$_GET["leto"];
   
    
    }else{
    $mesec="";
    $leto=""; 
    
}
    $func = new userFunc();
    $result = $func->getPoraba($mesec,$leto,$widget,$tMesec);  
    echo $result;

?>