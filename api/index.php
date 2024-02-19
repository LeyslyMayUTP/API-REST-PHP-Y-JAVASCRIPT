<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

//Archivo de ejecución de la API REST 
require "controllers.php";
require "models.php";

$mainController = new clsMainController();
$mainController->funProcessRequest();
?>