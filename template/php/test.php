<?php
include '../../model.php';
    if(isset($_GET["mesec"])){
   $mesec=$_GET["mesec"];
   $leto=$_GET["leto"];
    
    }else{
    $mesec="";
    $leto=""; 
}
    $func = new userFunc();
    $result = $func->getPoraba($mesec,$leto);  
    echo $result;

?>