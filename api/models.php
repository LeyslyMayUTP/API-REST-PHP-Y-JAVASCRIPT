<?php

/* Se creo una clase en general que contiene al constructor 
que permite establecer la conexion a la base de datos con los atributos 
correspondientes y a su vez las diferentes funciones de cada método de 
la api rest que permiten la comunicación a la base de datos para su fácil
manipulación
----- 01 de febrero de 2024*/

class clsPcModel{
    //Permite la conexión a la base de datos correspondiente
    private $conexion;

    public function __construct()
    {
        $this->conexion = new mysqli("localhost", "sqluser", "password", "bdlab");

        if ($this->conexion->connect_error) {
            die("Conexión no establecida" . $this->conexion->connect_error);
        }
    }

    //Función para obtener o consultar todos los datos de la base de datos
    public function funGetAllPcs(){
        $sql = "SELECT pc.*, estado.estado
                FROM pc INNER JOIN estado ON pc.id_Estado = estado.id_Estado";

        $resultado = $this->conexion->query($sql);

        if ($resultado) {
            $pcs = array();
            while ($fila = $resultado->fetch_assoc()) {
                unset($fila['id_Estado']);
                $pcs[] = $fila;
            }
            return $pcs;
        }
        return ["error" => "Error al obtener los registros"];
    }

    //Función para obtener o consultar por medio del id un dato de la base de datos
    public function funGetPcById($id_pc){
        $sql = "SELECT pc.*, estado.estado
                FROM pc
                INNER JOIN estado ON pc.id_Estado = estado.id_Estado
                WHERE pc.id_Pc = $id_pc";

        $resultado = $this->conexion->query($sql);

        if ($resultado) {
            $fila = $resultado->fetch_assoc();
            unset($fila['id_Estado']);
            return $fila;
        }
        return ["error" => "Error al obtener el registro por ID"];
    }

    //Función para insertar un nuevo dato en la base de datos
    public function funPostInsertPc($datos_post){
        // Validar que se han proporcionado todos los datos necesarios
        if (!isset($datos_post['nombre'], $datos_post['modelo'], $datos_post['numSerie'],
            $datos_post['teclado'], $datos_post['mouse'], $datos_post['observaciones'],
            $datos_post['estado'])) {
            return ["error" => "Faltan datos necesarios"];
        }

        $estado = $datos_post['estado'];
        $insertar_estado = "INSERT INTO estado (estado) VALUES ('$estado')";
        $this->conexion->query($insertar_estado);

        $id_estado = $this->conexion->insert_id;

        $nombre = $datos_post['nombre'];
        $modelo = $datos_post['modelo'];
        $numSerie = $datos_post['numSerie'];
        $teclado = $datos_post['teclado'];
        $mouse = $datos_post['mouse'];
        $observaciones = $datos_post['observaciones'];

        $insertar_pc = "INSERT INTO pc (nombre, modelo, numSerie, teclado, mouse, observaciones, id_Estado) 
                        VALUES ('$nombre', '$modelo', '$numSerie', '$teclado', '$mouse', '$observaciones', $id_estado)";

        $resultado_pc = $this->conexion->query($insertar_pc);

        if ($resultado_pc) {
            return ["mensaje" => "Registro insertado correctamente"];
        } else {
            return ["error" => "Error al insertar el registro"];
        }
    }

    //PRACTICA 5
    /*Función para editar o actualizar los atributos de un dato de la base de datos 
    ----- 13 de febrero de 2024*/
    public function funPutUpdatePc($id_pc, $datos_put){
        // Validar que se han proporcionado datos para actualizar
        if (empty($datos_put)) {
            return ["error" => "No se proporcionaron datos para actualizar"];
        }
    
        // Verificar si el campo 'estado' está presente en los datos PUT
        if (isset($datos_put['estado'])) {
            $estado = $datos_put['estado'];
    
            // Construir la consulta de actualización para el campo 'estado' en la tabla 'estado'
            $sql_estado = "UPDATE estado SET estado = '$estado' WHERE id_Estado = (
                SELECT id_Estado FROM pc WHERE id_Pc = $id_pc
            )";
    
            $resultado_estado = $this->conexion->query($sql_estado);
    
            if (!$resultado_estado) {
                return ["error" => "Error al actualizar el campo 'estado' en la tabla 'estado'"];
            }
        }
    
        // Verificar si el campo 'imagen' está presente en los datos PUT
        if (isset($datos_put['imagen'])) {
            $imagen = $datos_put['imagen'];
    
            // Construir la consulta de actualización para el campo 'imagen' en la tabla 'pc'
            $sql_imagen = "UPDATE pc SET imagen = '$imagen' WHERE id_Pc = $id_pc";
    
            $resultado_imagen = $this->conexion->query($sql_imagen);
    
            if (!$resultado_imagen) {
                return ["error" => "Error al actualizar el campo 'imagen' en la tabla 'pc'"];
            }
        }
    
        return ["mensaje" => "Registro actualizado correctamente"];
    }

    //Función para eliminar un dato en la base de datos
    public function funDeletePc($id_pc){
        $sql = "SELECT id_Estado FROM pc WHERE id_Pc = $id_pc";
        $resultado = $this->conexion->query($sql);

        if ($resultado && $resultado->num_rows > 0) {
            $fila = $resultado->fetch_assoc();
            $id_estado = $fila['id_Estado'];

            $eliminar_pc = "DELETE FROM pc WHERE id_Pc = $id_pc";
            $this->conexion->query($eliminar_pc);

            $eliminar_estado = "DELETE FROM estado WHERE id_Estado = $id_estado";
            $this->conexion->query($eliminar_estado);

            return ["mensaje" => "Registro eliminado correctamente"];
        } else {
            return ["error" => "No se pudo encontrar el registro para eliminar"];
        }
    }
}

?>