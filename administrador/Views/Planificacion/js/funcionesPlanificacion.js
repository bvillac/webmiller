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
  if (typeof accionForm !== "undefined" && accionForm === "Edit") {
    // La variable existe EDITAR
    fntupdateInstructor(resultInst);
    fntupdateSalones(resultSalon);
    CargarHorarioTemp(diasSemanaEdit);
    generarPlanificacionEdit("Edit", diasSemanaEdit, fechaIni, fechaFin);
  } else {
    // La variable no existe NUEVO
    //console.log("es nuevo");
  }

 
  if (typeof accionFormAut !== "undefined" && accionFormAut === "Aut") {
    // La variable existe EDITAR
    fntupdateInstructor(resultInst);
    fntupdateSalones(resultSalon);
    CargarHorarioTemp(diasSemanaEdit);
    generarPlanificacionAut("Edit", diasSemanaEdit, fechaIni, fechaFin);
    //generarPlanificacionAut("Edit", nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo, fechaIni, fechaFin);
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
    sessionStorage.removeItem("dts_PlaTemporal");
    generarPlanificacion("Gen");
  });
  $("#btn_siguiente").click(function () {
    generarPlanificacion("Next");// Nueva Función para generar la planificación
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
    generarPlanificacionEdit("Next", diasSemanaEdit, fechaIni, fechaFin);
  });
  $("#btn_anteriorEdit").click(function () {
    generarPlanificacionEdit("Back", diasSemanaEdit, fechaIni, fechaFin);
  });


  //Autorizados
  $("#btn_siguienteAut").click(function () {
    generarPlanificacionAut("Next", diasSemanaEdit, fechaIni, fechaFin);
  });

  $("#btn_anteriorAut").click(function () {
    generarPlanificacionAut("Back", diasSemanaEdit, fechaIni, fechaFin);
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
  if (!str || str.length < 4) return "";

  const dias = {
    LU: "LUN",
    MA: "MAR",
    MI: "MIE",
    JU: "JUE",
    VI: "VIE",
    SA: "SÁB",
    DO: "DOM"
  };

  const nDia = str.substring(0, 2).toUpperCase();
  const nHora = str.substring(2, 4).padStart(2, "0");

  return dias[nDia] ? `${dias[nDia]}-${nHora}:00` : "";
}


/**************** GENERAR PLANIFICACION  NUEVA******************/
function generarPlanificacion(accionMove) {  
  const tabla = $("#dts_Planificiacion");
  //extrae los datos del instructor planificado en su ingreso
  const Grid = sessionStorage.dts_PlaInstructor ? JSON.parse(sessionStorage.dts_PlaInstructor) : [];

  if (!Grid.length) return;

  const fechaIni = $("#dtp_fecha_desde").val();
  const fechaFin = $("#dtp_fecha_hasta").val();

  if (accionMove === "Gen") {//Es la primera vez que se genera la planificación
    fechaDia = obtenerFormatoFecha(fechaIni);//Convertir la fecha de string a objeto Date
  } else {
    //Entra por next o back
    const estadoFecha = estaEnRango(accionMove, fechaDia, obtenerFormatoFecha(fechaIni), obtenerFormatoFecha(fechaFin));
    if (estadoFecha.estado === "FUE") {
      swal("Atención!", "Fechas fuera de Rango", "error");
      return;
    }
    fechaDia = estadoFecha.fecha;//ACtualiza la fechaDia con la nueva fecha
  }



  // Crear fila de encabezado con las horas y los nombres de los instructores
  const encabezado = crearEncabezado(Grid);
  $("#FechaDia").html(obtenerFechaConLetras(fechaDia));
  tabla.find("thead").html(encabezado);
  tabla.find("tbody").empty();

  const nLetIni = obtenerCodigoDia();//Obtiene el código del día actual iniciales
  // Si no existe planificación, se crea una nueva tabla con los datos del instructor
  for (let hora = 8; hora < 22; hora++) {
    const fila = $("<tr></tr>").append(`<td>${hora}:00</td>`);
    Grid.forEach(instr => {
      const td = generarCeldaHorario(nLetIni, hora, instr);
      fila.append(td);
    });
    tabla.find("tbody").append(fila);
  }

}

function crearEncabezado(Grid) {
  const fila = $("<tr></tr>").append("<th>Horas</th>");
  Grid.forEach(instr => {
    fila.append(`<th>${instr.Nombre.substring(0, 15).toUpperCase()}</th>`);
  });
  return fila;
}


function obtenerHorarioCoincidente(nDiaHora) {
  const plaTemporal = sessionStorage.dts_PlaTemporal
    ? JSON.parse(sessionStorage.dts_PlaTemporal)
    : [];
  
  // Forzar que siempre busque con subguion al final
  const patron = nDiaHora + "_";

  for (const item of plaTemporal) {
    const coincidencia = item.horario
      .split(',')
      //.find(h => h.trim() === nDiaHora); // Comparación exacta
      .find(h => h.startsWith(patron));

    if (coincidencia) return coincidencia;
  }

  return null; // No encontrado
}



function generarCeldaHorario(nLetIni, hora, instr) {
  const nDiaHora = nLetIni + hora;
  // Generar un ID base para la celda  Esto es para identificar la celda de forma única y evitar conflictos con reservas temporales
  // Ejemplo: "LU_08_123" para Lunes a las 8:00 con instructor 123
  const idBase = `${nLetIni}_${hora}_${instr["ids"]}`;

  const reservaTemporal = obtenerHorarioCoincidente(idBase);// Verifica si existe una reserva temporal
  // Si existe una reserva temporal, se muestra el botón con el nombre del salón y el color
  // Si no existe, se verifica si hay un horario asignado al instructor
  // Si no hay horario asignado, se muestra un botón para agregar 
  if (reservaTemporal) {
    const idPlan = reservaTemporal;
    const idsSalon = idPlan.split("_").pop(); // retorna el último elemento del idPlan
    const salon = buscarSalonColor(idsSalon);
    return CeldaReservada(idPlan, salon);

  } else if (existeHorario(instr["Horario"], nDiaHora)) {//Verifica si existe una reserva temporal
    const salon = buscarSalonColor(instr["Salones"].split(",")[0]);
    // Si existe un salón asignado, se muestra el botón con el nombre del salón y el color
    const idPlan = `${idBase}_${salon["ids"]}`;
    return CeldaReservada(idPlan, salon);

  } else {
    return CeldaDisponible(idBase);
  }
}

function CeldaReservada(idPlan, salon) {
  return `
      <td>
        <button type="button" id="${idPlan}" class="btn ms-auto btn-lg asignado-true"
          style="color:white; background-color:${salon["Color"]}"
          onclick="fnt_eventoPlanificado(this)">
          ${salon["Nombre"]}
        </button>
      </td>`;
}

function CeldaDisponible(idPlan) {
  return `
    <td>
      <button type="button" id="${idPlan}" class="btn ms-auto btn-lg btn-light"
        onclick="fnt_eventoPlanificado(this)">
        AGREGAR
      </button>
    </td>`;
}


function existeHorario(nHorArray, nDiaHora) {
  //console.log("nHorArray", nHorArray, "nDiaHora", nDiaHora);
  if (!nHorArray) return false; // Si es null, undefined o vacío, no existe

  // Si ya es un array, usamos directamente includes()
  if (Array.isArray(nHorArray)) {
    return nHorArray.includes(nDiaHora);
  }

  // Si es string, dividimos y buscamos
  if (typeof nHorArray === "string") {
    return nHorArray.split(",").includes(nDiaHora);
  }

  // En cualquier otro caso, no se considera existente
  return false;
}


function buscarSalonColor(ids) {
  const Grid = sessionStorage.dts_SalonCentro ? JSON.parse(sessionStorage.dts_SalonCentro) : [];
  return Grid.find(salon => salon["ids"] == ids) || 0;
}



function fnt_eventoPlanificado(comp) {
  const btn = $(comp);
  const currentText = btn.html().trim();
  const salonId = $("#cmb_Salon").val();
  const originalId = comp.id;
  let actualizar = false;

  if (salonId != 0) {
    if (currentText === "AGREGAR") {
      actualizar = true;
    } else {
      const confirmarCambio = confirm("¿Está seguro de cambiar el salón?");
      if (confirmarCambio) {
        actualizar = true;
      }
    }
  } else {
    const confirmarEliminar = confirm("¿Desea eliminar la reservación del salón?");
    if (confirmarEliminar) {
      // Reestablecer a botón vacío
      btn.removeClass("asignado-true").addClass("btn-light")
        .removeAttr("style")
        .html("AGREGAR");

      // Opcionalmente puedes quitar el ID anterior si tenía salón
      // btn.attr("id", originalIdSinSalon);
    }

    return; // No continuar si se elimina
  }

  if (actualizar) {
    const salon = buscarSalonColor(salonId);
    const partesId = originalId.split("_");

    // Construir nuevo ID
    const nuevoId = partesId.length >= 3
      ? `${partesId[0]}_${partesId[1]}_${partesId[2]}_${salon.ids}`
      : `${originalId}_${salon.ids}`;

    // Aplicar estilos y actualizar ID/texto
    btn.removeClass("btn-light").addClass("asignado-true")
      .css({
        color: "white",
        "background-color": salon.Color
      })
      .html(salon.Nombre)
      .attr("id", nuevoId);
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
  //obtiene el código del día actual iniciales LU, MA, MI, JU, VI, SA, DO
  const nLetIni = obtenerCodigoDia();

  const arrayList = sessionStorage.dts_PlaTemporal
    ? JSON.parse(sessionStorage.dts_PlaTemporal)
    : [];

  //Crear nueva fila con los datos del día y almacenarla por dia  horarios y fecha
  // Si no hay datos, se crea una nueva fila .asignado-true
  const nuevaFila = objDataRow(nLetIni);

  if (arrayList.length === 0) {
    // Si no hay datos, simplemente guardamos la nueva fila en el Json
    guardarFila(arrayList, nuevaFila);
    return;
  }

  if (codigoExiste(nLetIni, "dia", sessionStorage.dts_PlaTemporal)) {
    guardarFila(arrayList, nuevaFila);
  } else {
    confirmarModificacion(() => {
      eliminarItemsDia(nLetIni);//elimina los items del dia seleccionado y filtra los demás
      const actualizada = JSON.parse(sessionStorage.dts_PlaTemporal);
      guardarFila(actualizada, nuevaFila);
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
    function (isConfirm) {
      if (isConfirm) callback();
    }
  );
}


/**
 * Elimina todos los ítems de un día específico de sessionStorage.
 * @param {string} nDia - Código del día a eliminar (ej: "LU").
 */
function eliminarItemsDia(nDia) {
  const rawData = sessionStorage.getItem('dts_PlaTemporal');
  if (!rawData) return;
  try {
    const lista = JSON.parse(rawData);

    // Filtrar los elementos que no coincidan con el día a eliminar 
    const nuevaLista = lista.filter(item => item.dia !== nDia);

    // Actualizar el almacenamiento
    actualizarStorage(nuevaLista);
  } catch (error) {
    console.error('Error al eliminar elementos del día eliminarItemsDia:', error);
  }
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
      cabPlan.ids = (accion != 'Create') ? IdsTemp : 0;
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




//####################################################

//function generarPlanificacionEdit(accionMove, nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo, fechaIni, fechaFin) {
function generarPlanificacionEdit(accionMove, diasSemanaEdit, fechaIni, fechaFin) {
  const tabla = $("#dts_Planificiacion");
  const Grid = sessionStorage.dts_PlaInstructor ? JSON.parse(sessionStorage.dts_PlaInstructor) : [];
  if (!Grid.length) return;

  if (accionMove === "Edit") {
    fechaDia = obtenerFormatoFecha(fechaIni);
  } else {
    const estadoFecha = estaEnRango(accionMove, fechaDia, obtenerFormatoFecha(fechaIni), obtenerFormatoFecha(fechaFin));
    if (estadoFecha.estado === "FUE") {
      swal("Atención!", "Fechas fuera de Rango", "error");
      return;
    }
    fechaDia = estadoFecha.fecha;
  }

  // Establecer encabezado
  const encabezado = crearEncabezado(Grid);
  $("#FechaDia").html(obtenerFechaConLetras(fechaDia));
  tabla.find("thead").html(encabezado);
  tabla.find("tbody").empty();

  const nLetIni = obtenerCodigoDia();

  for (let hora = 8; hora < 22; hora++) {
    const fila = $("<tr></tr>").append(`<td>${hora}:00</td>`);
    Grid.forEach(instr => {
      instr["Horario"]=[]; // Inicializar Horario como un array vacío para que solo pudeda agregar horas de la temporal y no de las por defecto
      const td = generarCeldaHorario(nLetIni, hora, instr);
      fila.append(td);
    });
    tabla.find("tbody").append(fila);
  }


}



function CargarHorarioTemp(diasSemanaEdit) {
  const resultado = Object.entries(diasSemanaEdit)
    .filter(([_, horario]) => horario && horario.length > 0)
    .map(([dia, horario]) => {
      // Convertir a string si es array, dejar como está si ya es string
      const horarioStr = Array.isArray(horario)
        ? horario.join(',')
        : (typeof horario === 'string' ? horario : '');

      return {
        dia,
        horario: horarioStr,
        fecha: ''
      };
    });

  // Guardar en sessionStorage
  sessionStorage.setItem('dts_PlaTemporal', JSON.stringify(resultado));
}

function existeHorarioEdit(horariosArray, nDiaHora) {
  if (!Array.isArray(horariosArray) || !nDiaHora) return false;
  return horariosArray.some(h => h.startsWith(nDiaHora));
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

function fntSaveClonar() {
  let accion = "";
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

//function generarPlanificacionAut(accionMove, nLunes, nMartes, nMiercoles, nJueves, nViernes, nSabado, nDomingo, fechaIni, fechaFin) {
function generarPlanificacionAut(accionMove, diasSemanaEdit, fechaIni, fechaFin) {
  const tabla = $("#dts_PlanificiacionAut");
  const Grid = sessionStorage.dts_PlaInstructor ? JSON.parse(sessionStorage.dts_PlaInstructor) : [];
  if (!Grid.length) return;

  if (accionMove === "Edit") {
    fechaDia = obtenerFormatoFecha(fechaIni);
  } else {
    const estadoFecha = estaEnRango(accionMove, fechaDia, obtenerFormatoFecha(fechaIni), obtenerFormatoFecha(fechaFin));
    if (estadoFecha.estado === "FUE") {
      swal("Atención!", "Fechas fuera de Rango", "error");
      return;
    }
    fechaDia = estadoFecha.fecha;
  }

  // Establecer encabezado
  const encabezado = crearEncabezado(Grid);
  $("#FechaDia").html(obtenerFechaConLetras(fechaDia));
  tabla.find("thead").html(encabezado);
  tabla.find("tbody").empty();

  const nLetIni = obtenerCodigoDia();
  for (let hora = 8; hora < 22; hora++) {
    const fila = $("<tr></tr>").append(`<td>${hora}:00</td>`);
    Grid.forEach(instr => {
      const td = generarCeldaHorarioAut(nLetIni, hora, instr);
      fila.append(td);
    });
    tabla.find("tbody").append(fila);
  }
}

function generarCeldaHorarioAut(nLetIni, hora, instr) {
  const nDiaHora = nLetIni + hora;
  // Generar un ID base para la celda  Esto es para identificar la celda de forma única y evitar conflictos con reservas temporales
  // Ejemplo: "LU_08_123" para Lunes a las 8:00 con instructor 123
  const idBase = `${nLetIni}_${hora}_${instr["ids"]}`;

  const reservaTemporal = obtenerHorarioCoincidente(idBase);// Verifica si existe una reserva temporal
  if (reservaTemporal) {
    const idPlan = reservaTemporal;
    const idsSalon = idPlan.split("_").pop(); // retorna el último elemento del idPlan
    const salon = buscarSalonColor(idsSalon);
    return `
      <td>
        <button type="button" id="${idPlan}" class="btn ms-auto btn-lg asignado-true"
          style="color:white; background-color:${salon["Color"]}" >
          ${salon["Nombre"]}
        </button>
      </td>`;
  } else {
    return `<td></td>`;
  }
}