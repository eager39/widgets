<?php
include 'baza/model.php';
$array = $_POST["widgetData"];
$array = json_decode($array);

$func = new userFunc();
for($i=0;$i<count($array);$i++){
	$id= $array[$i]->id_widget;
	$posY=$array[$i]->position[1];
	$posX=$array[$i]->position[0];
	$height=$array[$i]->size->y;
	$width=$array[$i]->size->x;
$result = $func->widgetupdate($posX, $posY,$id,$height,$width);

}
 
?>