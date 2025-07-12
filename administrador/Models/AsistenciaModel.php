<?php

use Matrix\Functions;

class AsistenciaModel extends MysqlAcademico
{
    private $db_name;
    private $db_nameAdmin;
    public function __construct()
    {
        parent::__construct();
        $this->db_name = $this->getDbNameMysql();
        $this->db_nameAdmin = $this->getDbNameMysqlAdmin();
    }



    public function consultarAsistenciaFechaHora($catId, $plaId, $insId, $fecha, $hora,$estadoAsist)
    {
        $db = $this->db_name;
        $dbAdmin = $this->db_nameAdmin;

        $sql = "
        SELECT 
            a.res_id, a.cat_id, a.pla_id, a.act_id, d.act_nombre,
            a.niv_id, f.niv_nombre, a.ben_id, a.ins_id,
            a.sal_id, e.sal_nombre, a.res_fecha_reservacion AS FechaRes,
            a.res_unidad, a.res_dia, a.res_hora, a.res_asistencia,
            CONCAT(c.per_nombre, ' ', c.per_apellido) AS Nombres,
            (
                SELECT CONCAT(z.per_nombre, ' ', z.per_apellido)
                FROM db_academico.instructor x
                INNER JOIN db_administrador.persona z ON x.per_id = z.per_id
                WHERE x.ins_id = a.ins_id
            ) AS Instructor
        FROM {$db}.reservacion a
        INNER JOIN {$db}.beneficiario b ON a.ben_id = b.ben_id
        INNER JOIN {$dbAdmin}.persona c ON b.per_id = c.per_id
        INNER JOIN {$db}.actividad d ON d.act_id = a.act_id
        INNER JOIN {$db}.salon e ON e.sal_id = a.sal_id
        INNER JOIN {$db}.nivel f ON f.niv_id = a.niv_id
        WHERE 
            a.res_estado_logico != 0 
            AND a.cat_id = {$catId} 
            AND DATE(a.res_fecha_reservacion) = '{$fecha}'";

        if ($insId !== "0") {
            $sql .= " AND a.ins_id = {$insId}";
        }
        if ($hora !== "0") {
            $sql .= " AND a.res_hora = {$hora}";
        }

        if ($estadoAsist !== "0") {
            $sql .= " AND a.res_asistencia = '{$estadoAsist}'";
        }

        $sql .= " ORDER BY a.ins_id, CONVERT(a.res_hora, SIGNED)";


        $result = $this->select_all($sql);

        $rowData = [];
        $horas = [];
        $currentInsId = null;
        $index = -1;

        foreach ($result as $i => $row) {
            if ($row['ins_id'] !== $currentInsId) {
                $currentInsId = $row['ins_id'];
                $index++;
                $horas = [];

                $rowData[$index] = [
                    'CatId' => $row['cat_id'],
                    'PlaId' => $row['pla_id'],
                    'Fecha' => $row['FechaRes'],
                    'Dia' => $row['res_dia'],
                    'InsId' => $row['ins_id'],
                    'InsNombre' => $row['Instructor'],
                    'Reservado' => []
                ];
            }

            // Acumula horas con tu función externa
            $horas = $this->retonarHoras($result, $i, $horas, count($horas));
            $rowData[$index]['Reservado'] = $horas;
        }

        return $rowData;
    }
    public function retonarHoras($result, $i, $horas, $h)
    {
        $horas[$h] = [
            'ResId' => $result[$i]['res_id'],
            'ResHora' => $result[$i]['res_hora'],
            'ActNombre' => $result[$i]['act_nombre'],
            'NivNombre' => $result[$i]['niv_nombre'],
            'ResUnidad' => $result[$i]['res_unidad'],
            'BenId' => $result[$i]['ben_id'],
            'BenNombre' => $result[$i]['Nombres'],
            'SalId' => $result[$i]['sal_id'],
            'SalNombre' => $result[$i]['sal_nombre'],
            'Estado' => $result[$i]['res_asistencia'],
        ];

        return $horas;
    }





    public function marcarAsistencia(int $resId)
    {
        //A=ASISTIO
        //R=RESERVADO
        
        $usuario = retornaUser();
        $con = $this->getConexion();

        // Verifica que la reservación exista y esté activa
        $sql = "SELECT * FROM " . $this->db_name . ".reservacion where res_id='{$resId}' AND res_estado_logico=1";
        $reservacion = $this->select($sql);

        if (empty($reservacion)) {
            return [
                "status" => false,
                "message" => "La reservación no existe o ya fue procesada."
            ];
        }

        try {
            $con->beginTransaction();

            // Insertar en control_academico
            $arrDataInsert = [
                $reservacion['ben_id'],        // Beneficiario
                $reservacion['act_id'],        // Actividad
                $reservacion['ins_id'],        // Instructor
                $reservacion['niv_id'],        // Nivel
                $reservacion['res_id'],        // Reservación ID
                $reservacion['res_unidad'],    // Unidad
                null,                          // val_id
                null,                          // cac_valoracion
                $reservacion['res_hora'],      // Hora
                null,                          // Observación
                $usuario,                      // Usuario creador
                1                              // Estado lógico
            ];

            $sqlInsert = "INSERT INTO {$this->db_name}.control_academico (
                        ben_id, act_id, ins_id, niv_id, res_id, cac_unidad,
                        val_id, cac_valoracion, cac_hora, cac_observacion,
                        cac_usuario_creacion, cac_estado_logico
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $insertId = $this->insertConTrasn($con, $sqlInsert, $arrDataInsert);

            // Actualizar asistencia en reservación
            $sqlUpdate = "UPDATE {$this->db_name}.reservacion 
                      SET res_asistencia = ?, 
                          res_usuario_modificacion = ?, 
                          res_fecha_modificacion = CURRENT_TIMESTAMP() 
                      WHERE res_id = ?";

            $updateData = ["A", $usuario, $reservacion['res_id']];
            $this->updateConTrasn($con, $sqlUpdate, $updateData);

            // Confirmar transacción
            $con->commit();

            return [
                "status" => true,
                "numero" => $insertId
            ];

        } catch (Exception $e) {
            $con->rollBack();
            putMessageLogFile("Error al marcar asistencia: " . $e->getMessage());
            return [
                "status" => false,
                "message" => "Error al registrar la asistencia: " . $e->getMessage()
            ];
        }
    }







}