<?php 
error_reporting(E_ALL);
ini_set('display_errors', 'on');
session_start();

if(isset($_COOKIE["user"])){

	$_SESSION["user"]=$_COOKIE["user"];

}

          

              if (isset($_REQUEST['stran']) && $_REQUEST['stran']=="nastavitve" && isset($_SESSION["user"]) )

 {

	 include 'template/nastavitve.html.php';

	  	 

 } else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="index") )

 {

	 include 'template/index.html.php';

	

	  	 

 }

  else if (!isset($_REQUEST["stran"]))

 {

	 include 'template/index.html.php';

	

	  	 

 }

  else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="vnos")&& isset($_SESSION["user"]))

 {

	 include 'template/vnos.html.php';

	  	 

 }

 else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="poraba")&& isset($_SESSION["user"]))

 {

	 include 'template/poraba.html.php';

	  	 

 }

  else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="registracija"))

 {

	 include 'template/registracija.html.php';

	  	 

 }

  else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="prijava") && !isset($_SESSION["user"]))

 {

	 include 'template/prijava.html.php';

	  	 

 }

  else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="odjava") && isset($_SESSION["user"]))

 {

	 include 'template/odjava.html.php';

	  	 

 }

  else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="naloge") && isset($_SESSION["user"]))

 {

	 include 'template/naloge.html.php';

	  	 

 }

  else if (isset($_REQUEST['stran']) && ($_REQUEST['stran']=="urejanje") && isset($_SESSION["user"]))

 {

	 include 'template/urejanje.html.php';

	  	 

 }









 

else  {



	include "template/error.html.php";

	

	  	 

 }

            

?>