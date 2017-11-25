<?php
include 'baza/model.php';
$idslika=trim($_GET["id"]);
$result = file_get_contents("https://maps.googleapis.com/maps/api/place/photo?maxwidth=2000&photoreference=".$idslika."&key=AIzaSyCUi_xtONMcAhv--hJBhLq0sEYw8s3Q6l4");
$base64 = 'data:image/jpg;base64,' . base64_encode($result);
echo $base64;
?>