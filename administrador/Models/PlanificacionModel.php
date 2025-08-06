<?php

use Matrix\Functions;

class PlanificacionModel extends MysqlAcademico
{
    private $db_name;
    private $db_nameAdmin;
    public function __construct()
    {
        parent::__construct();
        $this->db_name = $this->getDbNameMysql();
        $this->db_nameAdmin = $this->getDbNameMysqlAdmin();
    }

    public function consultarDatos()
    {
        $sql = "SELECT a.tpla_id Ids,b.cat_nombre Centro, a.tpla_fecha_incio FechaIni,a.tpla_fecha_fin FechaFin,a.tpla_fechas_rango Rango,a.tpla_estado_logico Estado ";
        $sql .= "    FROM " . $this->db_name . ".planificacion_temp a ";
        $sql .= "        inner join " . $this->db_name . ".centro_atencion b  ";
        $sql .= "            on a.cat_id=b.cat_id ";
        $sql .= "    where a.tpla_estado_logico!=0; ";
        $request = $this->select_all($sql);
        return $request;
    }

    public function consultarDatosAut()
    {
        $sql = "SELECT a.pla_id Ids,b.cat_nombre Centro, a.pla_fecha_incio FechaIni,a.pla_fecha_fin FechaFin,a.pla_fechas_rango Rango,a.pla_estado_logico Estado ";
        $sql .= "    FROM " . $this->db_name . ".planificacion a ";
        $sql .= "        inner join " . $this->db_name . ".centro_atencion b  ";
        $sql .= "            on a.cat_id=b.cat_id ";
        $sql .= "    where a.pla_estado_logico!=0; ";
        $request = $this->select_all($sql);
        return $request;
    }

    public function consultarDatosId(int $Ids)
    {
        $sql = "SELECT *
            FROM {$this->db_name}.planificacion_temp
            WHERE tpla_estado_logico != 0 AND tpla_id = ?";

        $params = [$Ids];
        $request = $this->select($sql, $params);
        return $request;
    }


    public function consultarDatosIdAut(int $Ids)
    {
        $sql = "SELECT * FROM " . $this->db_name . ".planificacion where pla_id={$Ids} and pla_estado_logico!=0;";
        $request = $this->select($sql);
        return $request;
    }




    public function insertData($Cabecera, $Detalle)
    {
        $diasSemana = [
            'LU' => '',
            'MA' => '',
            'MI' => '',
            'JU' => '',
            'VI' => '',
            'SA' => '',
            'DO' => ''
        ];

        $con = $this->getConexion();
        $sql = "SELECT * FROM {$this->db_name}.planificacion_temp 
            WHERE tpla_estado_logico = 1 
              AND cat_id = :centro 
              AND tpla_fecha_incio = :fechaInicio";

        $params = [
            ':centro' => $Cabecera['centro'],
            ':fechaInicio' => $Cabecera['fechaInicio']
        ];

        $request = $this->select($sql, $params);
        if (!empty($request)) {
            return [
                "status" => false,
                "message" => "Ya existe una planificación con esta fecha."
            ];
        }

        $con->beginTransaction();
        try {
            $rangoDia = "";

            foreach ($Detalle as $item) {
                $dia = strtoupper($item['dia']);
                if (array_key_exists($dia, $diasSemana)) {
                    $diasSemana[$dia] = $item['horario'];
                    $fecha = DateTime::createFromFormat('Y-m-d', $item['fecha']);
                    if ($fecha) {
                        $rangoDia .= "$dia:" . $fecha->format('Y-m-d') . ";";
                    }
                }
            }

            $arrData = [
                $Cabecera['centro'],
                $Cabecera['fechaInicio'],
                $Cabecera['fechaFin'],
                $diasSemana['LU'],
                $diasSemana['MA'],
                $diasSemana['MI'],
                $diasSemana['JU'],
                $diasSemana['VI'],
                $diasSemana['SA'],
                $diasSemana['DO'],
                $rangoDia,
                'T',
                retornaUser(),
                1
            ];

            $sqlInsert = "INSERT INTO {$this->db_name}.planificacion_temp (
                            cat_id, tpla_fecha_incio, tpla_fecha_fin,
                            tpla_lunes, tpla_martes, tpla_miercoles,
                            tpla_jueves, tpla_viernes, tpla_sabado, tpla_domingo,
                            tpla_fechas_rango, tpla_estado, tpla_usuario_creacion, tpla_estado_logico
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $this->insertConTrans($con, $sqlInsert, $arrData);

            putMessageLogFile("Insertado correctamente");
            putMessageLogFile($sqlInsert);
            putMessageLogFile(print_r($arrData, true));

            $con->commit();

            return ["status" => true, "numero" => 0];
        } catch (Exception $e) {
            $con->rollBack();
            return [
                "status" => false,
                "message" => "Error al insertar planificación: " . $e->getMessage()
            ];
        }
    }



    public function updateData($Cabecera, $Detalle)
    {
        try {
            $Ids = $Cabecera['ids'];
            $diasSemana = ['LU' => '', 'MA' => '', 'MI' => '', 'JU' => '', 'VI' => '', 'SA' => '', 'DO' => ''];
            $rangoDia = "";

            foreach ($Detalle as $item) {
                $dia = $item['dia'];
                $fecha = isset($item['fecha']) ? date("Y-m-d", strtotime($item['fecha'])) : '';
                $horario = $item['horario'] ?? '';

                if (array_key_exists($dia, $diasSemana)) {
                    $diasSemana[$dia] = $horario;
                    $rangoDia .= $dia . ':' . $fecha . ';';
                }
            }

            $arrData = [
                $Cabecera['fechaInicio'] ?? '',
                $Cabecera['fechaFin'] ?? '',
                $diasSemana['LU'],
                $diasSemana['MA'],
                $diasSemana['MI'],
                $diasSemana['JU'],
                $diasSemana['VI'],
                $diasSemana['SA'],
                $diasSemana['DO'],
                $rangoDia,
                retornaUser()
            ];

            $sql = "UPDATE {$this->db_name}.planificacion_temp 
                SET tpla_fecha_incio = ?, tpla_fecha_fin = ?,
                    tpla_lunes = ?, tpla_martes = ?, tpla_miercoles = ?, 
                    tpla_jueves = ?, tpla_viernes = ?, tpla_sabado = ?, tpla_domingo = ?,
                    tpla_fechas_rango = ?, tpla_usuario_modificacion = ?, 
                    tpla_fecha_modificacion = CURRENT_TIMESTAMP() 
                WHERE tpla_id = ?";

            $arrData[] = $Ids; // ID al final, para el WHERE
            $request = $this->update($sql, $arrData);

            return [
                "status" => (bool) $request,
                "numero" => 0
            ];

        } catch (Exception $e) {
            return [
                "status" => false,
                "message" => "Fallo: " . $e->getMessage()
            ];
        }
    }


    public function deleteRegistro(int $Ids)
    {
        $usuario = retornaUser();
        $sql = "UPDATE " . $this->db_name . ".planificacion_temp SET tpla_estado_logico = ?,tpla_usuario_modificacion='{$usuario}',
                    tpla_fecha_modificacion = CURRENT_TIMESTAMP() WHERE tpla_id = {$Ids} ";
        $arrData = array(0);
        $request = $this->update($sql, $arrData);
        return $request;
    }

    public function clonarRegistro($dataObj)
    {
        $Ids = $dataObj['ids'];
        $centroId = $dataObj['CentroAtencionID'];
        $fecha_desde = $dataObj['fecIni'];
        $fecha_hasta = $dataObj['fecFin'];
        $usuario = retornaUser();
        $sql = "INSERT INTO " . $this->db_name . ".planificacion_temp 
                        (`cat_id`,`tpla_fecha_incio`,`tpla_fecha_fin`,`tpla_lunes`,`tpla_martes`,`tpla_miercoles`,`tpla_jueves`,
                        `tpla_viernes`,`tpla_sabado`,`tpla_domingo`,`tpla_fechas_rango`,`tpla_estado`,`tpla_usuario_creacion`,`tpla_estado_logico`)
                        SELECT '{$centroId}','{$fecha_desde}','{$fecha_hasta}',`tpla_lunes`,`tpla_martes`,`tpla_miercoles`,`tpla_jueves`,
                         `tpla_viernes`,`tpla_sabado`,`tpla_domingo`,'',`tpla_estado`,'{$usuario}',1
                                FROM " . $this->db_name . ".planificacion_temp WHERE tpla_id = {$Ids} ";

        $arrData = array();
        $request = $this->update($sql, $arrData);
        return $request;
    }


    public function autorizarRegistro(int $Ids)
    {
        $usuario = retornaUser();
        $sql = "INSERT INTO " . $this->db_name . ".planificacion 
                        (`cat_id`,`pla_fecha_incio`,`pla_fecha_fin`,`pla_lunes`,`pla_martes`,`pla_miercoles`,`pla_jueves`,
                        `pla_viernes`,`pla_sabado`,`pla_domingo`,`pla_fechas_rango`,`pla_estado`,`pla_usuario_creacion`,`pla_estado_logico`)
                        SELECT `cat_id`,`tpla_fecha_incio`,`tpla_fecha_fin`,`tpla_lunes`,`tpla_martes`,`tpla_miercoles`,`tpla_jueves`,
                         `tpla_viernes`,`tpla_sabado`,`tpla_domingo`,`tpla_fechas_rango`,`tpla_estado`,'{$usuario}',1
                                FROM " . $this->db_name . ".planificacion_temp WHERE tpla_id = {$Ids} ";

        $arrData = array();
        $request = $this->update($sql, $arrData);
        return $request;
    }

}