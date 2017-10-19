<?php
include '../../model.php';
  $email = strip_tags(trim($_POST["email"]));
  $password =password_hash($_POST["password"], PASSWORD_DEFAULT);
  $repeatpassword = $_POST["password2"];
  $func = new userFunc();
  $result = $func->registracija($email, $password);
  if ($result) {
   echo $result;
  } else {
    echo $result;
  }   
?>