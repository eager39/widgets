<?php
include 'baza/model.php';
$kraj=trim($_GET["kraj"]);
$result = file_get_contents("https://maps.googleapis.com/maps/api/place/textsearch/json?query=".urlencode($kraj)."&key=AIzaSyCUi_xtONMcAhv--hJBhLq0sEYw8s3Q6l4");
echo $result;
?>

