<?php

    session_start();
    if(isset($_SESSION['user'])) {
        echo json_encode($_SESSION);
    } else {
        echo "gtfo";
    }
   
?>