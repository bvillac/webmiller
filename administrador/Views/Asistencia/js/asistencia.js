

$(document).ready(function () {

  $("#btn_buscar").click(function () {
    buscarReservaciones();;
  });

  $("#btn_imprimir").click(function () {
    var parametros = {
      centro: ($('#cmb_CentroAtencion').val() != 0) ? $('#cmb_CentroAtencion').val() : 0,
      InsId: ($('#cmb_instructor').val() != 0) ? $('#cmb_instructor').val() : 0,
      hora: ($('#cmb_hora').val() != 0) ? $('#cmb_hora').val() : 0,
      fechaDia: $("#dtp_fecha").val()
    };
    var url = base_url + '/Asistencia/generarAsistenciaPDF?' + new URLSearchParams(parametros).toString();
    // Redirigir a la nueva URL
    window.location.href = url;
  });

  

});

function fntInstructor(ids) {
    var arrayList = new Array();
    $("#cmb_instructor").html(
      '<option value="0">SELECCIONAR INSTRUCTOR</option>'
    );
    if (ids != 0) {
      let link = base_url + "/Planificacion/bucarInstructorCentro";
      $.ajax({
        type: "POST",
        url: link,
        data: {
          Ids: ids,
        },
        success: function (data) {
          if (data.status) {
            $("#cmb_instructor").prop("disabled", false);
            var result = data.data;
            var c = 0;
            for (var i = 0; i < result.length; i++) {
              $("#cmb_instructor").append(
                '<option value="' +
                result[i].Ids +
                '">' +
                result[i].Nombre +
                "</option>"
              );
              let rowInst = new Object();
              rowInst.ids = result[i].Ids;
              rowInst.Nombre = result[i].Nombre;
              rowInst.Horario = result[i].Horario;
              rowInst.Salones = result[i].Salones;
              arrayList[c] = rowInst;
              c += 1;
            }
            sessionStorage.dts_PlaInstructor = JSON.stringify(arrayList);
            //$('#cmb_instructor').selectpicker('render');
            $("#cmb_instructor").selectpicker("refresh");
          } else {
            swal("Error", data.msg, "error");
          }
        },
        dataType: "json",
      });
    } else {
      $("#cmb_instructor").prop("disabled", true);
      swal("Información", "Seleccionar un Instructor", "info");
    }
  }
  function buscarReservaciones() {
    const link = `${base_url}/Asistencia/asistenciaFechaHora`;
    const Centro = $('#cmb_CentroAtencion').val() || 0;
    const InsId = $('#cmb_instructor').val() || 0;
    const hora = $('#cmb_hora').val() || 0;
    const fechaDia = $("#dtp_fecha").val();
    const EstAsist = $('#cmb_estadoAsist').val() || 0;

    $.ajax({
      type: 'POST',
      url: link,
      data: {
        catId: Centro,
        insId: InsId,
        hora: hora,
        fechaDia: fechaDia,
        EstadoAsist: EstAsist,
      },
      dataType: "json",
      success: function (data) {
        $("#list_tables").empty();
        if (data.status && Array.isArray(data.data) && data.data.length) {
          data.data.forEach(function (tutor) {
            let nombreInstructor = tutor.InsNombre && tutor.InsNombre.trim() !== '' ? tutor.InsNombre : 'INSTRUCTOR NO SELECCIONADO';
            $('#list_tables').append(`<h3 class="tile-title">TUTOR: ${nombreInstructor}</h3>`);
            let strFila = "";
            let prevHora = null;
            let lastThora = null;
            tutor.Reservado.forEach(function (thora, idx) {
              if (prevHora !== thora.ResHora && strFila) {
                fntNewTable(prevHora, lastThora, strFila);
                strFila = "";
              }
              prevHora = thora.ResHora;
              strFila += fntRowHora(thora);
              lastThora = thora;
            });
            if (strFila) {
              fntNewTable(prevHora, lastThora, strFila);
            }
          });
        } else {
          swal("Atención!", data.msg || "No se encontraron datos.", "info");
        }
      },
      error: function () {
        swal("Error", "Ocurrió un error al buscar las reservaciones.", "error");
      }
    });
  }

function fntNewTable(auxHora,thoras,strFila) {
  let nHora='HORA: '+auxHora+':00 --> ';
  let nSalon='SALÓN: '+thoras['SalNombre'];
  let strtable = '<h1 class="tile-title">' + nHora +  nSalon+' </h1>';
  strtable += '<table id="tabHor_' + auxHora + '" class="table table-hover">';
  strtable += fntHeadHora();
  strtable += '<tbody>';
  strtable += strFila;
  strtable += '</tbody>';
  strtable += '</table>';
  strtable += '<br>';
  $('#list_tables').append(strtable);
}

function fntHeadHora() {
  let strtable = '<thead>';
    strtable += '<tr>';
      strtable += '<th>NIVEL</th>';
      strtable += '<th>UNIDAD</th>';
      strtable += '<th>ACTIVIDAD</th>';
      strtable += '<th>USUARIO</th>';
      strtable += '<th>ASISTÍO</th>';
    strtable += '</tr>';
  strtable += '</thead>';
  return strtable;
}

function fntRowHora(thoras) {
  let strFila = '<td>' + thoras['NivNombre'] + '</td>';
  strFila += '<td>' + thoras['ResUnidad'] + '</td>';
  strFila += '<td>' + thoras['ActNombre'] + '</td>';
  strFila += '<td>' + thoras['BenNombre'] + '</td>';
  //strFila += '<td>' + thoras['Estado'] + '</td>';
  strFila +='<td><div class="toggle-flip">';
  strFila +='<label>';
  let nCheck=(thoras['Estado']=="A")?"checked disabled":"";
  strFila +='<input type="checkbox" '+nCheck+' onclick="fntAsistencia(' + thoras['ResId'] + ');" id="ASI_' + thoras['ResId'] + '"><span class="flip-indecator" data-toggle-on="SI" data-toggle-off="NO"></span>';
  strFila +='</label>';
  strFila +='</div></td>';
  return '<tr>' + strFila + '</tr>';
}


function fntAsistencia(ids) {
  //var estaDeshabilitado = $("#ASI_" + ids).prop('disabled');
  swal({
    title: "Registrar Asistencia",
    text: "¿Esta seguro de registrar?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, Registrar!",
    cancelButtonText: "No, cancelar!",
    closeOnConfirm: false,
    closeOnCancel: true
  }, function (isConfirm) {

    if (isConfirm) {
      if (ids != 0) {
        let link = base_url + "/Asistencia/marcarAsistencia";
        $.ajax({
          type: "POST",
          url: link,
          data: {
            Ids: ids,
          },
          success: function (data) {
            if (data.status) {
              $("#ASI_" + ids).prop("disabled", true);
              swal("Información", data.msg, "info");

            } else {
              swal("Error", data.msg, "error");
            }
          },
          dataType: "json",
        });
      } else {
        //$("#cmb_instructor").prop("disabled", true);
        
        swal("Información", "Seleccionar un Horario", "info");
      }

    }else{
      $("#ASI_" + ids).prop("checked", false);
    }

  });

}





  