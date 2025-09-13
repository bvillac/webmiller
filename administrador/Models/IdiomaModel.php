<?php
class IdiomaModel extends MysqlAcademico
{
    private $db_name;
    public function __construct()
    {
        parent::__construct();
        $this->db_name = $this->getDbNameMysql();
    }

 

    public function consultarDatos()
    {
        $sql = "SELECT idi_id Ids, idi_nombre Nombre,idi_estado_logico Estado ";
        $sql .= " FROM ". $this->db_name .".idioma WHERE idi_estado_logico!=0  ORDER BY idi_nombre ASC";
        $request = $this->select_all($sql);
        return $request;
    }

    
    public function consultarDatosId(int $Ids)
    {
        $sql = "SELECT idi_id Ids, idi_nombre Nombre,idi_estado_logico Estado ";
        $sql .= " FROM ". $this->db_name .".idioma ";
        $sql .= " where idi_estado_logico!=0 AND idi_id={$Ids}";
        $request = $this->select($sql);
        return $request;
    }

    public function insertData($dataObj)
    {
        $con = $this->getConexion();
        $sql = "SELECT * FROM " . $this->db_name . ".idioma where idi_nombre='{$dataObj['nombre']}' ";

        $request = $this->select($sql);
        if (empty($request)) {
            $con->beginTransaction();
            try {
                $arrData = array(
                    $dataObj['nombre'],
                    retornaUser(), 1
                );
                //putMessageLogFile($arrData);
                $SqlQuery  = "INSERT INTO " . $this->db_name . ".idioma 
				    (idi_nombre,         
                    idi_usuario_creacion,                   
                    idi_estado_logico) VALUES(?,?,?) ";
                $Ids = $this->insertConTrans($con, $SqlQuery, $arrData);
                $con->commit();
                $arroout["status"] = true;
                $arroout["numero"] = 0;
                return $arroout;
            } catch (Exception $e) {
                $con->rollBack();
                //echo "Fallo: " . $e->getMessage();
                //throw $e;
                $arroout["message"] = $e->getMessage();
                $arroout["status"] = false;
                return $arroout;
            }
        } else {
            $arroout["status"] = false;
            $arroout["message"] = "Ya exite el Idioma con este Nombre.";
            return $arroout;
        }
    }




    public function updateData($dataObj)
    {
        try {

            $Ids = $dataObj['ids'];
            $arrData = array(
                $dataObj['nombre'],
                $dataObj['estado']
            );
            $sql = "UPDATE " . $this->db_name . ".idioma 
						SET  idi_nombre = ?,idi_estado_logico = ? WHERE idi_id={$Ids}  ";
            $request = $this->update($sql, $arrData);
            $arroout["status"]=($request)?true:false;
            $arroout["numero"] = 0;
            return $arroout;
        } catch (Exception $e) {
            throw $e;
            $arroout["status"] = false;
            $arroout["message"] = "Fallo: " . $e->getMessage();
            return $arroout;
        }
    }

    public function deleteRegistro(int $Ids)
    {
        $sql = "UPDATE " . $this->db_name . ".idioma SET idi_estado_logico = ?
                         WHERE idi_id = {$Ids} ";
        $arrData = array(0);
        $request = $this->update($sql, $arrData);
        return $request;
    }

    public function consultarIdioma(){
        $sql = "SELECT idi_id Ids, idi_nombre Nombre ";
        $sql .= " FROM ". $this->db_name .".idioma WHERE idi_estado_logico!=0  ORDER BY idi_nombre ASC";
        $request = $this->select_all($sql);
        return $request;
    }
 

   



}
