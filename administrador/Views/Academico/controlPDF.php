<?php
setlocale(LC_ALL, "es_ES@euro", "es_ES", "esp");
//$empresa = $data['empData'];
//$cabContrato = $data['cabData'];
$detBeneficiario = $data['control'];
$fechaActual= strftime("%d de %B de %Y", strtotime(date("Y-m-d H:i:s")));
?>
<!DOCTYPE html>
<html lang="es">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Contrato</title>
	<style>
		/* Reset y base styles */
		* {
			box-sizing: border-box;
		}

		body {
			font-family: 'Arial', sans-serif;
			margin: 0;
			padding: 10px;
			line-height: 1.4;
			font-size: 12px;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			margin-bottom: 15px;
		}

		table td,
		table th {
			font-size: 11px;
			padding: 4px;
			vertical-align: top;
		}

		h4 {
			margin: 5px 0;
			font-size: 14px;
			line-height: 1.2;
		}

		.text-center {
			text-align: center;
		}

		.text-right {
			text-align: right;
		}

		.text-left {
			text-align: left;
		}

		/* Layout responsive */
		.wd33 {
			width: 33.33%;
			min-width: 120px;
		}

		.wd2 {
			width: 2%;
			min-width: 10px;
		}

		.wd5 {
			width: 5%;
			min-width: 20px;
		}

		.wd10 {
			width: 10%;
			min-width: 40px;
		}

		.wd15 {
			width: 15%;
			min-width: 60px;
		}

		.wd40 {
			width: 40%;
			min-width: 120px;
		}

		.wd55 {
			width: 55%;
			min-width: 150px;
		}

		/* Header table */
		.tbl-hader {
			margin-bottom: 20px;
		}

		.tbl-hader img {
			max-width: 100px;
			height: auto;
			max-height: 60px;
		}

		/* Cliente info table */
		.tbl-cliente {
			border: 1px solid #CCC;
			border-radius: 5px;
			padding: 8px;
			margin-bottom: 15px;
		}

		.tituloLabel {
			font-weight: bold;
			white-space: nowrap;
			padding-right: 10px;
			min-width: 80px;
		}

		/* Responsive info table */
		.table-responsive {
			width: 100%;
			overflow-x: visible;
		}

		.table-responsive td {
			padding: 3px 5px;
			word-wrap: break-word;
		}

		/* Detalle table responsive */
		.table-responsive-sm {
			width: 100%;
			overflow-x: auto;
			margin-bottom: 20px;
		}

		.tbl-detalle {
			border-collapse: collapse;
			min-width: 100%;
			font-size: 10px;
		}

		.tbl-detalle thead th {
			padding: 6px 4px;
			background-color: #009688;
			color: #FFF;
			font-weight: bold;
			text-align: center;
			white-space: nowrap;
			border: 1px solid #007A6B;
		}

		.tbl-detalle tbody td {
			border: 1px solid #CCC;
			padding: 4px 3px;
			word-wrap: break-word;
			max-width: 80px;
		}

		.tbl-detalle tfoot td {
			padding: 6px 4px;
			border-top: 2px solid #009688;
		}

		/* Responsive adjustments for smaller content */
		.tbl-detalle th:nth-child(1), /* Nivel */
		.tbl-detalle td:nth-child(1) {
			width: 8%;
			min-width: 50px;
		}

		.tbl-detalle th:nth-child(2), /* Unidad */
		.tbl-detalle td:nth-child(2) {
			width: 8%;
			min-width: 50px;
		}

		.tbl-detalle th:nth-child(3), /* Actividad */
		.tbl-detalle td:nth-child(3) {
			width: 25%;
			min-width: 100px;
		}

		.tbl-detalle th:nth-child(4), /* Hora */
		.tbl-detalle td:nth-child(4) {
			width: 8%;
			min-width: 50px;
		}

		.tbl-detalle th:nth-child(5), /* Tutor */
		.tbl-detalle td:nth-child(5) {
			width: 20%;
			min-width: 80px;
		}

		.tbl-detalle th:nth-child(6), /* F.Asistencia */
		.tbl-detalle td:nth-child(6) {
			width: 10%;
			min-width: 70px;
		}

		.tbl-detalle th:nth-child(7), /* F.Evaluación */
		.tbl-detalle td:nth-child(7) {
			width: 10%;
			min-width: 70px;
		}

		.tbl-detalle th:nth-child(8), /* Valoración */
		.tbl-detalle td:nth-child(8) {
			width: 8%;
			min-width: 60px;
		}

		.tbl-detalle th:nth-child(9), /* Valor */
		.tbl-detalle td:nth-child(9) {
			width: 8%;
			min-width: 50px;
		}

		/* Media queries for PDF generation */
		@media print {
			body {
				font-size: 11px;
			}
			
			.tbl-detalle {
				font-size: 9px;
			}
			
			.tbl-detalle th,
			.tbl-detalle td {
				padding: 2px;
			}
			
			table {
				page-break-inside: auto;
			}
			
			tr {
				page-break-inside: avoid;
				page-break-after: auto;
			}
		}

		/* Responsive behavior for narrow screens */
		@media (max-width: 800px) {
			.tbl-hader .wd33 {
				display: block;
				width: 100%;
				text-align: center;
				margin-bottom: 10px;
			}
			
			.table-responsive {
				font-size: 10px;
			}
			
			.tbl-detalle {
				font-size: 8px;
			}
		}
	</style>
</head>

<body>
	<table class="tbl-hader">
		<tbody>
			<tr>
				<td class="wd33">
					<img src="<?= mediaImg() ?>/logo/<?= $_SESSION['empresaData']['Logo'] ?>" alt="Logo">
				</td>
				<td class="text-center wd33">
					<h4><strong>CONTROL ACADÉMICO DE MILLER TRAINING</strong></h4>
				</td>
				<td class="text-right wd33">
					<h4>CONTRATO N° <strong><?= $data['Contrato'] ?></strong></h4>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="text-right">
		<h4>Guayaquil, <?= $fechaActual ?></h4>
	</div>

	<div class="table-responsive">
		<table>
			<tbody>
				<tr>
					<td class="tituloLabel">Fecha Contrato:</td>
					<td><?= $data['FechaIngreso'] ?></td>
					<td class="wd2"></td>
					<td class="tituloLabel">DNI:</td>
					<td><?= $data['DNI'] ?></td>
				</tr>
				<tr>
					<td class="tituloLabel">Nombre:</td>
					<td colspan="3"><?= $data['Nombres'] ?></td>
					<td></td>
				</tr>
				<tr>
					<td class="tituloLabel">Tipo:</td>
					<td><?= $data['Tipo'] ?></td>
					<td class="wd2"></td>
					<td class="tituloLabel">Género:</td>
					<td><?= $data['Genero'] ?></td>
				</tr>
				<tr>
					<td class="tituloLabel">Teléfono:</td>
					<td><?= $data['Telefono'] ?></td>
					<td class="wd2"></td>
					<td class="tituloLabel">Dirección:</td>
					<td><?= $data['Direccion'] ?></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="table-responsive-sm">
		<table class="table tbl-detalle">
			<thead>
				<tr>
					<th>Nivel</th>
					<th>Unidad</th>
					<th>Actividad</th>
					<th>Hora</th>
					<th>Tutor</th>
					<th>F.Asist.</th>
					<th>F.Eval.</th>
					<th>Valoración</th>
					<th>Valor</th>
				</tr>
			</thead>
			<tbody>
				<?php
				foreach ($detBeneficiario as $beneficiario) {
					$valorPor = ($beneficiario['Valor'] != "") ? $beneficiario['Valor'] . " %" : "";
				?>
					<tr>
						<td class="text-center"><?= $beneficiario['Nivel'] ?></td>
						<td class="text-center"><?= $beneficiario['Unidad'] ?></td>
						<td class="text-left"><?= $beneficiario['Actividad'] ?></td>
						<td class="text-center"><?= $beneficiario['Hora'] ?></td>
						<td class="text-left"><?= $beneficiario['Instructor'] ?></td>
						<td class="text-center"><?= $beneficiario['FechaAsistencia'] ?></td>
						<td class="text-center"><?= $beneficiario['FechaEvaluacion'] ?></td>
						<td class="text-center"><?= $beneficiario['Valoracion'] ?></td>
						<td class="text-center"><?= $valorPor ?></td>
					</tr>
				<?php } ?>
			</tbody>
		</table>
	</div>

</body>

</html>