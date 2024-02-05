<?php

//Archivo de ejecución de la API REST 
require "controllers.php";
require "models.php";

$mainController = new clsMainController();
$mainController->funProcessRequest();
?>