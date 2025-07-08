//NOTA IMPORTANTE: Los datos de Aula y instructor se guardan en session Store es decir que se mantienen en memoria mientras dure la selsion
//si existe algun cambio en estas tablas los cambios no se reflejna mientras no se destruya la session o ce cierre el navegador
let delayTimer;
let fechaDia = new Date();
let numeroDia = 0;
let tablePlanificacion;
let tablePlanificacionAut;


document.addEventListener("DOMContentLoaded", function () {
  // Aquí puedes colocar el código que deseas ejecutar después de que la página se ha cargado completamente
  // Por ejemplo, puedes llamar a una función o realizar alguna operación
  tablePlanificacion = $("#tablePlanificacion").dataTable({
    aProcessing: true,
    aServerSide: true,
    language: {
      url: cdnTable,
    },
    ajax: {
      url: " " + base_url + "/Planificacion/consultarPlanificacion",
      dataSrc: "",
    },
    columns: [
      { data: "Centro" },
      { data: "FechaIni" },
      { data: "FechaFin" },
      { data: "Rango" },
      { data: "Estado" },
      { data: "options" },
    ],
    columnDefs: [
      { className: "textleft", targets: [0] },
      { className: "textcenter", targets: [1] }, //Agregamos la clase que va a tener la columna
      { className: "textcenter", targets: [2] },
      { className: "textleft", targets: [3] },
      { className: "textcenter", targets: [4] },
      { className: "textright", targets: [5] },
    ],
    dom: "lBfrtip",
    buttons: [],
    resonsieve: "true",
    bDestroy: true,
    iDisplayLength: 10, //Numero Items Retornados
    order: [[1, "desc"]], //Orden por defecto 1 columna
  });



  tablePlanificacionAut = $("#tablePlanificacionAut").dataTable({
    aProcessing: true,
    aServerSide: true,
    language: {
      url: cdnTable,
    },
    ajax: {
      url: " " + base_url + "/Planificacion/consultarPlanificacionAut",
      dataSrc: "",
    },
    columns: [
      { data: "Centro" },
      { data: "FechaIni" },
      { data: "FechaFin" },
      { data: "Rango" },
      { data: "Estado" },
      { data: "options" },
    ],
    columnDefs: [
      { className: "textleft", targets: [0] },
      { className: "textcenter", targets: [1] }, //Agregamos la clase que va a tener la columna
      { className: "textcenter", targets: [2] },
      { className: "textleft", targets: [3] },
      { className: "textcenter", targets: [4] },
      { className: "textright", targets: [5] },
    ],
    dom: "lBfrtip",
    buttons: [],
    resonsieve: "true",
    bDestroy: true,
    iDisplayLength: 10, //Numero Items Retornados
    order: [[1, "desc"]], //Orden por defecto 1 columna
  });





  //FUNCIONES PARA EDICION
  if (typeof accionForm !== "undefined") {
    // La variable existe EDITAR
    fntupdateInstructor(resultInst);
    fntupdateSalones(resultSalon);
    generarPlanificiacionEdit("Edit", nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin);
  } else {
    // La variable no existe NUEVO
    //console.log("es nuevo");
  }

  if (typeof accionFormAut !== "undefined") {
    // La variable existe EDITAR
    fntupdateInstructor(resultInst);
    fntupdateSalones(resultSalon);
    generarPlanificiacionAut("Edit", nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin);
  } else {
    // La variable no existe NUEVO
    //console.log("es nuevo");
  }


});



$(document).ready(function () {
  $("#cmb_instructor").selectpicker("render");
  //Nueva Orden
  $("#btn_nuevo").click(function () {
    //eliminarStores();
    window.location = base_url + "/Planificacion/nuevo"; //Retorna al Portal Principal
  });

  $("#cmd_retornar").click(function () {
    //eliminarStores();
    window.location = base_url + "/planificiacion"; //Retorna al Portal Principal
  });

  $("#external-events .fc-event").each(function () {
    // store data so the calendar knows to render an event upon drop
    $(this).data("event", {
      title: $.trim($(this).text()), // use the element's text as the event title
      stick: true, // maintain when user navigates (see docs on the renderEvent method)
    });

    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 999,
      revert: true, // will cause the event to go back to its
      revertDuration: 0, //  original position after the drag
    });
  });

  $("#agregarBoton").click(function () {
    const contenedorPadre = document.getElementById("contenedor-padre");
    const nuevoDiv = document.createElement("div");
    nuevoDiv.textContent = "Nuevo Div Agregado";
    nuevoDiv.classList.add("nuevo-div");
    contenedorPadre.appendChild(nuevoDiv);
  });

  $("#btn_generar").click(function () {
    generarPlanificacion("Gen");
  });
  $("#btn_siguiente").click(function () {
    generarPlanificacion("Next");
  });
  $("#btn_anterior").click(function () {
    generarPlanificacion("Back");
  });

  $("#btn_saveTemp").click(function () {
    guardarTemp();
  });

  $("#btn_saveAll").click(function () {
    guardarAll("Create");
  });

  $("#btn_saveAllEdit").click(function () {
    guardarAll("Edit");
  });

  $("#btn_siguienteEdit").click(function () {
    generarPlanificiacionEdit("Next", nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin);
  });
  $("#btn_anteriorEdit").click(function () {
    generarPlanificiacionEdit("Back", nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin);
  });


  //Autorizados
  $("#btn_siguienteAut").click(function () {
    generarPlanificiacionAut("Next", nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin);
  });
  $("#btn_anteriorAut").click(function () {
    generarPlanificiacionAut("Back", nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin);
  });

  $("#cmd_clonar").click(function () {
    fntSaveClonar();
  });

});

function fntSalones(ids) {
  $("#cmb_Salon").html('<option value="0">SELECCIONAR SALÓN</option>');

  if (ids == 0) {
    $("#cmb_Salon").prop("disabled", true);
    swal("Información", "Seleccionar un Salón", "info");
    return;
  }

  const link = `${base_url}/Planificacion/bucarSalonCentro`;

  $.ajax({
    type: "POST",
    url: link,
    data: { Ids: ids },
    dataType: "json",
    success: function (data) {
      if (!data.status) {
        swal("Error", data.msg, "error");
        return;
      }

      $("#cmb_Salon").prop("disabled", false);
      const arrayList = [];

      data.data.forEach((salon) => {
        $("#cmb_Salon").append(
          `<option value="${salon.Ids}">${salon.Nombre}</option>`
        );
        arrayList.push({
          ids: salon.Ids,
          Nombre: salon.Nombre,
          Color: salon.Color,
        });
      });

      sessionStorage.setItem("dts_SalonCentro", JSON.stringify(arrayList));

      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        fntInstructor(ids);
      }, 500);
    },
  });
}

function fntInstructor(ids) {
  $("#cmb_instructor").html('<option value="0">SELECCIONAR INSTRUCTOR</option>');

  if (ids == 0) {
    $("#cmb_instructor").prop("disabled", true);
    swal("Información", "Seleccionar un Instructor", "info");
    return;
  }

  const link = `${base_url}/Planificacion/bucarInstructorCentro`;

  $.ajax({
    type: "POST",
    url: link,
    data: { Ids: ids },
    dataType: "json",
    success: function (data) {
      if (!data.status) {
        swal("Error", data.msg, "error");
        return;
      }

      $("#cmb_instructor").prop("disabled", false);
      const arrayList = [];

      data.data.forEach((inst) => {
        $("#cmb_instructor").append(
          `<option value="${inst.Ids}">${inst.Nombre}</option>`
        );
        arrayList.push({
          ids: inst.Ids,
          Nombre: inst.Nombre,
          Horario: inst.Horario,
          Salones: inst.Salones,
        });
      });

      sessionStorage.setItem("dts_PlaInstructor", JSON.stringify(arrayList));
      $("#cmb_instructor").selectpicker("refresh");
    },
  });
}

function fntHorasInstructor(ids) {
  $("#contenedor-padre").html("");

  if (ids == 0) {
    swal("Información", "Seleccionar un Instructor", "info");
    return;
  }

  const link = `${base_url}/Planificacion/bucarInstructor`;

  $.ajax({
    type: "POST",
    url: link,
    data: { Ids: ids },
    dataType: "json",
    success: function (data) {
      if (!data.status) {
        swal("Error", data.msg, "error");
        return;
      }

      $("#TituloHoras").html(`<h5 class="mb-4">Horas ${data.data.Nombres}</h5>`);

      const arrayHoras = data.data.Horas.split(",").sort();

      arrayHoras.forEach((hora) => {
        $("#contenedor-padre").append(
          `<div id="${hora}" class="fc-event">${fntNameHoras(hora)}</div>&nbsp;`
        );
      });
    },
  });
}


function fntNameHoras(str) {
  let nDia = str.substring(0, 2);
  let nHora = str.substring(2, 4);
  let result = "";
  switch (nDia) {
    case "LU":
      result = "LUN-" + nHora + ":00";
      break;
    case "MA":
      result = "MAR-" + nHora + ":00";
      break;
    case "MI":
      result = "MIE-" + nHora + ":00";
      break;
    case "JU":
      result = "JUE-" + nHora + ":00";
      break;
    case "VI":
      result = "VIE-" + nHora + ":00";
      break;
    case "SA":
      result = "SÁB-" + nHora + ":00";
      break;
    default:
  }
  return result;
}

/**************** GENERAR PLANIFICACION  ******************/
function generarPlanificacion(accionMove) {
  const tabla = $("#dts_Planificiacion");
  const grid = sessionStorage.dts_PlaInstructor ? JSON.parse(sessionStorage.dts_PlaInstructor) : [];

  if (!grid.length) return;

  const fechaIni = $("#dtp_fecha_desde").val();
  const fechaFin = $("#dtp_fecha_hasta").val();

  if (accionMove === "Gen") {
    fechaDia = obtenerFormatoFecha(fechaIni);
  } else {
    const estadoFecha = estaEnRango(accionMove, fechaDia, obtenerFormatoFecha(fechaIni), obtenerFormatoFecha(fechaFin));
    if (estadoFecha.estado === "FUE") {
      swal("Atención!", "Fechas fuera de Rango", "error");
      return;
    }
    fechaDia = estadoFecha.fecha;
  }
  alert("LLEGO: " + fechaDia);

  // Generar encabezado
  const filaEncabezado = $("<tr></tr>").append("<th>Horas</th>");
  grid.forEach(instr => {
    const nombre = instr["Nombre"].substring(0, 15).toUpperCase();
    filaEncabezado.append(`<th>${nombre}</th>`);
  });

  $("#FechaDia").html(obtenerFechaConLetras(fechaDia));
  tabla.find("thead").html(filaEncabezado);
  tabla.find("tbody").empty();

  const nLetIni = obtenerCodigoDiaAbreviado($("#FechaDia").text());

  for (let hora = 8; hora < 22; hora++) {
    const fila = $("<tr></tr>").append(`<td>${hora}:00</td>`);
    grid.forEach(instr => {
      const td = generarCeldaHorario(nLetIni, hora, instr);
      fila.append(td);
    });
    tabla.find("tbody").append(fila);
  }
}


function obtenerCodigoDiaAbreviado(texto) {
  let code = texto.toUpperCase().substring(0, 2);
  return code === "SÁ" ? "SA" : code;
}

function generarCeldaHorario(nLetIni, hora, instr) {
  const nDiaHora = nLetIni + hora;
  const idBase = `${nLetIni}_${hora}_${instr["ids"]}`;

  if (existeHorario(instr["Horario"], nDiaHora)) {
    const salon = buscarSalonColor(instr["Salones"].split(",")[0]);
    const idPlan = `${idBase}_${salon["ids"]}`;
    return `
      <td>
        <button type="button" id="${idPlan}" class="btn ms-auto btn-lg asignado-true"
          style="color:white; background-color:${salon["Color"]}"
          onclick="fnt_eventoPlanificado(this)">
          ${salon["Nombre"]}
        </button>
      </td>`;
  } else {
    return `
      <td>
        <button type="button" id="${idBase}" class="btn ms-auto btn-lg btn-light"
          onclick="fnt_eventoPlanificado(this)">
          AGREGAR
        </button>
      </td>`;
  }
}



function existeHorario(nHorArray, nDiaHora) {
  return nHorArray.split(",").includes(nDiaHora);
}

function buscarSalonColor(ids) {
  const Grid = sessionStorage.dts_SalonCentro ? JSON.parse(sessionStorage.dts_SalonCentro) : [];
  return Grid.find(salon => salon["ids"] == ids) || {};
}

function fnt_eventoPlanificado(comp) {
  let nEstado = false;
  let textobutton = comp.innerHTML;
  let idSalon = document.querySelector("#cmb_Salon").value;
  if (idSalon != 0) {
    if (textobutton == "AGREGAR") {
      nEstado = true;
      //openModalSalon(comp);
    } else {
      var respuesta = confirm("Esta seguro de Cambiar.");
      if (respuesta) {
        nEstado = true;
      }
    }
  } else {
      //ELIMINAR SALON RESERVADO
      var respuesta = confirm("Seleccionar un Salón / Eliminar la reservacion.");
      if (respuesta) {
        //'" class="btn ms-auto btn-lg btn-light" onclick="fnt_eventoPlanificado(this)">AGREGAR</button></td>';
        $("#" + comp.id).removeClass("asignado-true").addClass("btn-light");
        $("#" + comp.id).removeAttr("style");
        $("#" + comp.id).html("AGREGAR");
      }
      nEstado = false;
      //swal("Información", "Seleccionar un Salón / Eliminar la reservacion.", "info");
      
    
  }

  if (nEstado) {
    //Camia el Salon cuando es True
    let objSalon = buscarSalonColor(idSalon);
    let nButton = $("#" + comp.id);
    nButton.removeClass("btn-light").addClass("asignado-true");
    nButton.css("color", "white");
    nButton.css("background-color", objSalon["Color"]);
    $("#" + comp.id).html(objSalon["Nombre"]);
    let arrayIds = comp.id.split("_");
    let nuevoId = comp.id;
    if (arrayIds.length > 3) {
      nuevoId =
        arrayIds[0] +
        "_" +
        arrayIds[1] +
        "_" +
        arrayIds[2] +
        "_" +
        objSalon["ids"];
    } else {
      nuevoId += "_" + objSalon["ids"];
    }
    $("#" + comp.id).attr("id", nuevoId); //Se Cambia el Id y se Agrega el Salon asignado
  }
}

function openModalSalon(comp) {
  //document.querySelector('#txth_ids').value = "";//IDS oculto hiden
  //document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");//Cambiar las Clases para los colores
  //document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
  //document.querySelector('#btnText').innerHTML = "Guardar";
  //document.querySelector('#titleModal').innerHTML = "Nueva Registro";
  //document.querySelector("#formSalon").reset();
  //document.querySelector("#"+comp.id).classList.replace("btn ms-auto btn-lg btn-light", "btn ms-auto btn-lg asignado-true");
  //$('#modalFormSalon').modal('show');
}

/*function objDataRow(nLetIni) {
  let selecionados = "";
  $("#dts_Planificiacion .asignado-true").each(function (index, boton) {
    var botonId = $(boton).attr("id");
    selecionados += botonId + ",";
    //console.log('ID del botón:', botonId);
  });
  selecionados = selecionados.slice(0, selecionados.length - 1); //Quitar la ultima coma
  //let nLetIni = $('#FechaDia').html().toUpperCase();
  //nLetIni = nLetIni.substring(0, 2);
  //nLetIni = (nLetIni == "SÁ") ? "SA" : nLetIni;//Se cambia por la Tilde
  let rowGrid = new Object();
  rowGrid.dia = nLetIni;
  rowGrid.horario = selecionados;
  rowGrid.fecha = new Date(fechaDia);
  return rowGrid;
}*/

/*function guardarTemp() {
  let nLetIni = $("#FechaDia").html().toUpperCase().substring(0, 2);
  alert(nLetIni);
  nLetIni = (nLetIni === "SÁ") ? "SA" : nLetIni; // Ajuste por tilde

  let arrayList = sessionStorage.dts_PlaTemporal
    ? JSON.parse(sessionStorage.dts_PlaTemporal)
    : [];

  const nuevaFila = objDataRow(nLetIni);

  // Si ya hay registros
  if (arrayList.length > 0) {
    if (codigoExiste(nLetIni, "dia", sessionStorage.dts_PlaTemporal)) {
      // Ya existe código, agregamos nueva fila
      arrayList.push(nuevaFila);
      sessionStorage.dts_PlaTemporal = JSON.stringify(arrayList);
      swal("Información!", "Planificación Temporal Guardada.", "success");
    } else {
      // Confirmar modificación
      swal(
        {
          title: "Actualizar",
          text: "¿Realmente quiere Modificar Planificación?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Modificar!",
          cancelButtonText: "No, cancelar!",
          closeOnConfirm: false,
          closeOnCancel: true,
        },
        function (isConfirm) {
          if (isConfirm) {
            eliminarItemsDia(nLetIni); // Elimina el existente
            let actualizada = JSON.parse(sessionStorage.dts_PlaTemporal);
            actualizada.push(nuevaFila);
            sessionStorage.dts_PlaTemporal = JSON.stringify(actualizada);
            swal("Información!", "Planificación Temporal Guardada.", "success");
          }
        }
      );
    }
  } else {
    // Primera vez
    arrayList.push(nuevaFila);
    sessionStorage.dts_PlaTemporal = JSON.stringify(arrayList);
    swal("Información!", "Planificación Temporal Guardada.", "success");
  }
}*/

function objDataRow(nLetIni) {
  const seleccionados = Array.from($("#dts_Planificiacion .asignado-true"))
    .map(boton => boton.id)
    .filter(id => !id.includes("undefined")) // Elimina los inválidos
    .join(",");

  return {
    dia: nLetIni,
    horario: seleccionados,
    fecha: new Date(fechaDia)//retonarFecha(fechaDia)//
  };
}



function guardarTemp() {
  const nLetIni = obtenerCodigoDia();

  const arrayList = sessionStorage.dts_PlaTemporal
    ? JSON.parse(sessionStorage.dts_PlaTemporal)
    : [];

  const nuevaFila = objDataRow(nLetIni);

  if (arrayList.length === 0) {
    guardarFila(arrayList, nuevaFila);
    return;
  }

  if (codigoExiste(nLetIni, "dia", sessionStorage.dts_PlaTemporal)) {
    arrayList.push(nuevaFila);
    actualizarStorage(arrayList);
    mostrarMensaje("Información!", "Planificación Temporal Guardada.", "success");
  } else {
    confirmarModificacion(() => {
      eliminarItemsDia(nLetIni);
      const actualizada = JSON.parse(sessionStorage.dts_PlaTemporal);
      actualizada.push(nuevaFila);
      actualizarStorage(actualizada);
      mostrarMensaje("Información!", "Planificación Temporal Guardada.", "success");
    });
  }
}

// 🔹 Funciones auxiliares
function obtenerCodigoDia() {
  let codigo = $("#FechaDia").html().toUpperCase().substring(0, 2);
  return codigo === "SÁ" ? "SA" : codigo;
}

/**
 * Agrega una fila a la lista y guarda en sessionStorage.
 * @param {Array} array - Lista actual.
 * @param {Object} fila - Fila a insertar.
 */
function guardarFila(array, fila) {
  array.push(fila);
  actualizarStorage(array);
  mostrarMensaje("Información", "Planificación Temporal guardada exitosamente.", "success");
}

/**
 * Guarda el array en sessionStorage como JSON.
 * @param {Array} array - Lista a guardar.
 */
function actualizarStorage(array) {
  sessionStorage.setItem("dts_PlaTemporal", JSON.stringify(array));
}

/**
 * Muestra una alerta tipo swal.
 * @param {string} titulo - Título del mensaje.
 * @param {string} mensaje - Contenido del mensaje.
 * @param {string} tipo - Tipo de alerta (success, warning, error).
 */
function mostrarMensaje(titulo, mensaje, tipo = "info") {
  swal(titulo, mensaje, tipo);
}

/**
 * Muestra una confirmación de modificación y ejecuta un callback si se acepta.
 * @param {Function} callback - Función a ejecutar si el usuario confirma.
 */
function confirmarModificacion(callback) {
  swal(
    {
      title: "Actualizar",
      text: "¿Desea modificar la planificación existente?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, modificar!",
      cancelButtonText: "No, cancelar!",
      closeOnConfirm: false,
      closeOnCancel: true
    },
    function(isConfirm) {
      if (isConfirm) callback();
    }
  );
}


/**
 * Elimina todos los ítems de un día específico de sessionStorage.
 * @param {string} nDia - Código del día a eliminar (ej: "LU").
 */
function eliminarItemsDia(nDia) {
  const data = sessionStorage.getItem("dts_PlaTemporal");
  if (!data) return;

  const lista = JSON.parse(data);
  const nuevaLista = lista.filter(item => item.dia !== nDia);
  actualizarStorage(nuevaLista);
}



//Guardar todo
function guardarAll(accion) {

  let fechaInicio = $("#dtp_fecha_desde").val();
  let fechaFin = $("#dtp_fecha_hasta").val();
  let centroAT = $("#cmb_CentroAtencion").val();
  if (fechaInicio == "" || fechaFin == "" || centroAT == 0) {
    swal(
      "Atención",
      "Todos los Fecha inicio,fecha fin, y Centro de Atención son obligatorios.",
      "error"
    );
    return false;
  }
  if (sessionStorage.dts_PlaTemporal) {
    var Grid = JSON.parse(sessionStorage.dts_PlaTemporal);
    if (Grid.length > 0) {
      let cabPlan = new Object();
      cabPlan.ids = (accion!='Create')?IdsTemp:0;
      cabPlan.fechaInicio = fechaInicio;
      cabPlan.fechaFin = fechaFin;
      cabPlan.centro = centroAT;
      let link = base_url + "/Planificacion/ingresarPlanificacion";
      $.ajax({
        type: "POST",
        url: link,
        data: {
          cabecera: cabPlan,
          detalle: Grid,
          accion: accion,
        },
        success: function (data) {
          if (data.status) {
            sessionStorage.removeItem("dts_PlaInstructor");
            sessionStorage.removeItem("dts_PlaTemporal");
            sessionStorage.removeItem("dts_SalonCentro");
            swal("Planificación", data.msg, "success");
            window.location = base_url + "/planificacion"; //Retorna al Portal Principal
          } else {
            swal("Error", data.msg, "error");
          }
        },
        dataType: "json",
      });
    } else {
      swal("Atención!", "No existe Planificación", "error");
    }
  } else {
    swal("Atención!", "No existe Planificación", "error");
  }
}

//FUNCION DE EDITAR
function fntupdateInstructor(resultInst) {
  var arrayList = new Array();
  var c = 0;
  for (var i = 0; i < resultInst.length; i++) {
    let rowInst = new Object();
    rowInst.ids = resultInst[i].Ids;
    rowInst.Nombre = resultInst[i].Nombre;
    rowInst.Horario = resultInst[i].Horario;
    rowInst.Salones = resultInst[i].Salones;
    arrayList[c] = rowInst;
    c += 1;
  }
  sessionStorage.dts_PlaInstructor = JSON.stringify(arrayList);
}

function fntupdateSalones(resultSalon) {
  var c = 0;
  var arrayList = new Array();
  for (var i = 0; i < resultSalon.length; i++) {
    let rowInst = new Object();
    rowInst.ids = resultSalon[i].Ids;
    rowInst.Nombre = resultSalon[i].Nombre;
    rowInst.Color = resultSalon[i].Color;
    arrayList[c] = rowInst;
    c += 1;
  }
  sessionStorage.dts_SalonCentro = JSON.stringify(arrayList);
}


function generarPlanificiacionEdit(accionMove, nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin) {
  
  var tabla = document.getElementById("dts_Planificiacion");
  var nDia = "";
  let salonArray = 0;
  let idsSalon = 0;
  if (sessionStorage.dts_PlaInstructor) {
    var Grid = JSON.parse(sessionStorage.dts_PlaInstructor);
    if (Grid.length > 0) {

      if (accionMove == "Edit") {
        fechaDia = obtenerFormatoFecha(fechaIni);
      } else {
        let estadoFecha = estaEnRango(accionMove,fechaDia, obtenerFormatoFecha(fechaIni), obtenerFormatoFecha(fechaFin));
        //console.log(estadoFecha);
        if(estadoFecha.estado=="FUE"){
          fechaDia=estadoFecha.fecha;
          swal("Atención!", "Fechas fuera de Rango", "error");
          return;
        }
        
      }

   

      var filaEncabezado = $("<tr></tr>");
      $("#FechaDia").html(obtenerFechaConLetras(fechaDia));
      //ENCABEZADO DE PLANIFICACION INSTRUCTOR
      filaEncabezado.append($("<th>Horas</th>"));
      for (var i = 0; i < Grid.length; i++) {
        filaEncabezado.append(
          $("<th>" + Grid[i]["Nombre"].substring(0, 15).toUpperCase() + "</th>")
        );
      }
      $("#dts_Planificiacion thead").html("");
      $("#dts_Planificiacion thead").append(filaEncabezado);
      //FIN PLANIFICION
      let nLetIni = $("#FechaDia").html().toUpperCase();
      nLetIni = nLetIni.substring(0, 2);
      nLetIni = nLetIni == "SÁ" ? "SA" : nLetIni; //Se cambia por la Tilde
      numeroHora = 8;

      switch (nLetIni) {
        case "LU":
          nDia = nLunes.split(",");
          break;
        case "MA":
          nDia = nMartes.split(",");
          break;
        case "MI":
          nDia = nMiercoles.split(",");
          break;
        case "JU":
          nDia = nJueves.split(",");
          break;
        case "VI":
          nDia = nViernes.split(",");
          break;
        case "SA":
          nDia = nSabado.split(",");
          break;
        default:
          nDia=new Array();
      }
      var tabla = $("#dts_Planificiacion tbody");
      $("#dts_Planificiacion tbody").html("");
      for (var i = 0; i < 14; i++) {
        //GENERA LAS FILAS
        var fila = "<tr><td>" + numeroHora + ":00</td>";
        for (var col = 0; col < Grid.length; col++) {
          //nLetIni=>inicialDia;numeroHora=>horaDia;Grid[col]['ids']=>Id Instructor
          let idPlan = nLetIni + "_" + numeroHora + "_" + Grid[col]["ids"];
          let nResArray = existeHorarioEditar(nDia, idPlan);
          let nExiste = false;
          if (nResArray != "0") {
            salonArray = nResArray[0].split("_");
            idsSalon = salonArray[3];
            nExiste = true;
          }

          if (nExiste) {
            let objSalon = buscarSalonColor(idsSalon);
            idPlan += "_" + objSalon["ids"]; //Agrega el Id del Salon
            fila += "<td>";
            fila +=
              '<button type="button" id="' +
              idPlan +
              '" class="btn ms-auto btn-lg asignado-true" style="color:white;background-color:' +
              objSalon["Color"] +
              '" onclick="fnt_eventoPlanificado(this)">' +
              objSalon["Nombre"] +
              "</button>";
            fila += "</td>";
          } else {
            fila +=
              '<td><button type="button" id="' +
              idPlan +
              '" class="btn ms-auto btn-lg btn-light" onclick="fnt_eventoPlanificado(this)">AGREGAR</button></td>';
          }
        }
        fila += "</tr>";
        tabla.append(fila);
        numeroHora++;
      }
    }
  }
}

function existeHorarioEditar(nHorArray, nDiaHora) {
  const resultados = nHorArray.filter(function (element) {
    return element.includes(nDiaHora);
  });

  if (resultados.length > 0) {
    //console.log(`Se encontraron elementos en el array que contienen "${nDiaHora}":`);
    //console.log(resultados);
    return resultados;
  }
  //console.log(`No se encontraron elementos en el array que contengan "${nDiaHora}".`);
  return "0";
}

//Eliminar Planificacion 
function fntDeletePlanificacion(ids) {
  var ids = ids;
  swal({
    title: "Eliminar Registro",
    text: "¿Realmente quiere eliminar el Registro?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, eliminar!",
    cancelButtonText: "No, cancelar!",
    closeOnConfirm: false,
    closeOnCancel: true
  }, function (isConfirm) {

    if (isConfirm) {
      var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      var ajaxUrl = base_url + '/Planificacion/eliminar';
      var strData = "ids=" + ids;
      request.open("POST", ajaxUrl, true);
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.send(strData);
      request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
          var objData = JSON.parse(request.responseText);
          if (objData.status) {
            swal("Eliminar!", objData.msg, "success");
            tablePlanificacion.api().ajax.reload(function () {

            });
          } else {
            swal("Atención!", objData.msg, "error");
          }
        }
      }
    }

  });
}

function fntSaveClonar(){
    let accion="";
    var dataObj = new Object();
    dataObj.ids = document.querySelector('#txth_ids').value;
    dataObj.CentroAtencionID = $('#cmb_CentroAtencion').val();
    dataObj.fecIni = $("#dtp_fecha_desde").val();
    dataObj.fecFin = $("#dtp_fecha_hasta").val();
    let link = base_url + '/Planificacion/clonar';
    $.ajax({
        type: 'POST',
        url: link,
        data: {
            "data": JSON.stringify(dataObj),
            "accion": accion
        },
        success: function (data) {
            if (data.status) {
                //sessionStorage.removeItem('cabeceraOrden');
                swal("Clonado!", data.msg, "success");
                tablePlanificacion.api().ajax.reload(function () { });
                $('#modalFormClonar').modal('hide');
                //$('#modalFormClonar').modal('dispose');
            } else {
                swal("Atención!", data.msg, "error");
            }
        },
        dataType: "json"
    });
    
}


//CLONAR PLANIFICACION
function fntClonarPlanificacion(ids) {
  $('#txth_ids').val(ids);
  document.querySelector('#titleModal').innerHTML = "Clonar Planificación";
  $('#modalFormClonar').modal('show');
}


//AUTORIZAR PLANIFICACION
function fntAutorizarPlanificacion(ids) {
  var ids = ids;
  swal({
    title: "Autorizar Planificación",
    text: "¿Realmente quiere Autorizar la Planificación?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, Continuar!",
    cancelButtonText: "No, cancelar!",
    closeOnConfirm: false,
    closeOnCancel: true
  }, function (isConfirm) {

    if (isConfirm) {
      var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      var ajaxUrl = base_url + '/Planificacion/autorizar';
      var strData = "ids=" + ids;
      request.open("POST", ajaxUrl, true);
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.send(strData);
      request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
          var objData = JSON.parse(request.responseText);
          if (objData.status) {
            swal("Autorizado!", objData.msg, "success");
            window.location = base_url + "/planificacion/autorizado"; //Retorna al Portal Principal
            //tablePlanificacion.api().ajax.reload(function () {        });
          } else {
            swal("Atención!", objData.msg, "error");
          }
        }
      }
    }

  });
}


//AUTORIZADOS

function generarPlanificiacionAut(accionMove, nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo,fechaIni,fechaFin) {
  var tabla = document.getElementById("dts_PlanificiacionAut");
  var nDia = "";
  let salonArray = 0;
  let idsSalon = 0;
  if (sessionStorage.dts_PlaInstructor) {
    var Grid = JSON.parse(sessionStorage.dts_PlaInstructor);
    if (Grid.length > 0) {
      /*fechaDia = new Date(fechaDia);      
      if (accion != "") {
        if (accion == "Next") {
          fechaDia.setDate(fechaDia.getDate() + 1);
        } else {
          fechaDia.setDate(fechaDia.getDate() - 1);
        }
      } else {
        fechaDia = $("#dtp_fecha_desde").val();
      }*/

      if (accionMove == "Edit") {
        fechaDia = obtenerFormatoFecha(fechaIni);
      } else {
        let estadoFecha = estaEnRango(accionMove,fechaDia, obtenerFormatoFecha(fechaIni), obtenerFormatoFecha(fechaFin));
        //console.log(estadoFecha);
        if(estadoFecha.estado=="FUE"){
          fechaDia=estadoFecha.fecha;
          swal("Atención!", "Fechas fuera de Rango", "error");
          return;
        }
        
      }

      var filaEncabezado = $("<tr></tr>");
      $("#FechaDia").html(obtenerFechaConLetras(fechaDia));
      //ENCABEZADO DE PLANIFICACION INSTRUCTOR
      filaEncabezado.append($("<th>Horas</th>"));
      for (var i = 0; i < Grid.length; i++) {
        filaEncabezado.append(
          $("<th>" + Grid[i]["Nombre"].substring(0, 15).toUpperCase() + "</th>")
        );
      }
      $("#dts_PlanificiacionAut thead").html("");
      $("#dts_PlanificiacionAut thead").append(filaEncabezado);
      //FIN PLANIFICION
      let nLetIni = $("#FechaDia").html().toUpperCase();
      nLetIni = nLetIni.substring(0, 2);
      nLetIni = nLetIni == "SÁ" ? "SA" : nLetIni; //Se cambia por la Tilde
      numeroHora = 8;

      switch (nLetIni) {
        case "LU":
          nDia = nLunes.split(",");
          break;
        case "MA":
          nDia = nMartes.split(",");
          break;
        case "MI":
          nDia = nMiercoles.split(",");
          break;
        case "JU":
          nDia = nJueves.split(",");
          break;
        case "VI":
          nDia = nViernes.split(",");
          break;
        case "SA":
          nDia = nSabado.split(",");
          break;
        default:
          nDia=new Array();
      }
      var tabla = $("#dts_PlanificiacionAut tbody");
      $("#dts_PlanificiacionAut tbody").html("");
      for (var i = 0; i < 14; i++) {
        //GENERA LAS FILAS
        var fila = "<tr><td>" + numeroHora + ":00</td>";
        for (var col = 0; col < Grid.length; col++) {
          //nLetIni=>inicialDia;numeroHora=>horaDia;Grid[col]['ids']=>Id Instructor
          let idPlan = nLetIni + "_" + numeroHora + "_" + Grid[col]["ids"];
          let nResArray = existeHorarioEditar(nDia, idPlan);
          let nExiste = false;
          if (nResArray != "0") {
            salonArray = nResArray[0].split("_");
            idsSalon = salonArray[3];
            nExiste = true;
          }

          if (nExiste) {
            let objSalon = buscarSalonColor(idsSalon);
            idPlan += "_" + objSalon["ids"]; //Agrega el Id del Salon
            fila += "<td>";
            fila +='<button type="button" id="' + idPlan +'" class="btn ms-auto btn-lg asignado-true" style="color:white;background-color:' +objSalon["Color"] +'" >' + objSalon["Nombre"] + "</button>";
            fila += "</td>";
          } else {
            //fila +='<td><button type="button" id="' +idPlan + '" class="btn ms-auto btn-lg btn-light" onclick="fnt_eventoPlanificado(this)">AGREGAR</button></td>';
            fila +='<td></td>';
          }
        }
        fila += "</tr>";
        tabla.append(fila);
        numeroHora++;
      }
    }
  }
}


