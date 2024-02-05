<?php

/* Se creo una clase en general que contiene al constructor 
que permite llamar a la clase de los models y a su vez las diferentes 
funciones de cada método de la api rest en un switch. Al final 
se llaman las funciones del archivo models para establecer la forma en que
se mostraran los datos de la base de datos en este caso en un formato
JSON
----- 01 de febrero de 2024*/

class clsMainController{
    private $pcModel;

    public function __construct(){
        $this->pcModel = new clsPcModel();
    }

    public function funProcessRequest(){
        header("Access-Control-Allow-Origin: *");
        header('Content-Type: application/json');
        $metodo = $_SERVER['REQUEST_METHOD'];

        switch ($metodo) {
            case 'GET':
                $this->funHandleGetRequest();
                break;
            case 'POST':
                $this->funHandlePostRequest();
                break;
            case 'PUT':
                $this->funHandlePutRequest();
                break;
            case 'DELETE':
                $this->funHandleDeleteRequest();
                break;
            default:
                echo json_encode(["error" => "Método no permitido"]);
                break;
        }
    }

    //Funciones que contienen las condiciones de cada caso del switch
    private function funHandleGetRequest(){
        if (isset($_GET['id_Pc'])) {
            $id_pc = $_GET['id_Pc'];
            $this->funGetPcById($id_pc);
        } else {
            $this->funGetAllPcs();
        }
    }

    private function funHandlePostRequest(){
        $datos_post = json_decode(file_get_contents("php://input"), true);
        $this->funPostInsertPc($datos_post);
    }

    private function funHandlePutRequest(){
        $id_pc = $_GET['id_Pc'];
        $datos_put = json_decode(file_get_contents("php://input"), true);
        $this->funPutUpdatePc($id_pc, $datos_put);
    }

    private function funHandleDeleteRequest(){
        $id_pc = $_GET['id_Pc'];
        $this->funDeletePc($id_pc);
    }

    //Funciones que permiten establecer el formato en que se nos mostraran los datos de la Bd
    private function funGetAllPcs(){
        $pcs = $this->pcModel->funGetAllPcs();
        echo json_encode($pcs);
    }

    private function funGetPcById($id_pc){
        $pc = $this->pcModel->funGetPcById($id_pc);
        echo json_encode($pc);
    }

    private function funPostInsertPc($datos_post){
        $result = $this->pcModel->funPostInsertPc($datos_post);
        echo json_encode($result);
    }

    private function funPutUpdatePc($id_pc, $datos_put){
        $result = $this->pcModel->funPutUpdatePc($id_pc, $datos_put);
        echo json_encode($result);
    }

    private function funDeletePc($id_pc){
        $result = $this->pcModel->funDeletePc($id_pc);
        echo json_encode($result);
    }
}
?>