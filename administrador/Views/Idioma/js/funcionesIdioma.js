let tableIdiomas;

document.addEventListener('DOMContentLoaded', function () {
    tableIdiomas = $('#tableIdiomas').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        "language": {
            "url": cdnTable
        },
        "ajax": {
            "url": " " + base_url + "/Idioma/consultarIdioma",
            "dataSrc": ""
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "Estado" },
            { "data": "options" }
        ],
        "columnDefs": [
            { 'className': "textleft", "targets": [0] },
            { 'className': "textcenter", "targets": [1] },
            { 'className': "textcenter", "targets": [2] }
        ],
        'dom': 'lBfrtip',
        'buttons': [],
        "resonsieve": "true",
        "bDestroy": true,
        "iDisplayLength": 10,//Numero Items Retornados
        "order": [[1, "desc"]]  //Orden por defecto 1 columna
    });

});


$(document).ready(function () {
    $("#cmd_guardar").click(function () {
        guardarIdioma();
    });


});


function openModal() {
    document.querySelector('#txth_ids').value = "";//IDS oculto hiden
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");//Cambiar las Clases para los colores
    document.querySelector('#cmd_guardar').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Salón";
    document.querySelector("#formIdioma").reset();
    $('#modalFormIdioma').modal('show');
}

function limpiarText() {
    $('#txth_ids').val("");
    $('#txt_nombreIdioma').val("");
    $('#cmb_estado').val("1");
}

function guardarIdioma() {
    let accion = ($('#btnText').html() == "Guardar") ? 'Create' : 'Edit';
    let Ids = document.querySelector('#txth_ids').value;
    let nombreIdioma = $('#txt_nombreIdioma').val();
    let estado = $('#cmb_estado').val();
    if ( nombreIdioma == '' ) {
        swal("Atención", "Todos los campos son obligatorios.", "error");
        return false;
    }
    let elementsValid = document.getElementsByClassName("valid");
    for (let i = 0; i < elementsValid.length; i++) {
        if (elementsValid[i].classList.contains('is-invalid')) {
            swal("Atención", "Por favor verifique los campos ingresados (Color Rojo).", "error");
            return false;
        }
    }

    var dataObj = new Object();
    dataObj.ids = Ids;
    dataObj.nombre = nombreIdioma;
    dataObj.estado = estado;
    //sessionStorage.dataInstructor = JSON.stringify(dataInstructor);
    let link = base_url + '/Idioma/ingresarIdioma';
    $.ajax({
        type: 'POST',
        url: link,
        data: {
            "idioma": JSON.stringify(dataObj),
            "accion": accion
        },
        success: function (data) {
            if (data.status) {
                swal("Idiomas", data.msg, "success");
                window.location = base_url + '/Idioma/idioma';
            } else {
                swal("Error", data.msg, "error");
            }
        },
        dataType: "json"
    });
}

//Editar Registro
function editarIdioma(ids) {
    document.querySelector('#titleModal').innerHTML = "Actualizar Idioma";
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#cmd_guardar').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML = "Actualizar";
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var ajaxUrl = base_url + '/Idioma/consultarIdiomaId/' + ids;
    request.open("GET", ajaxUrl, true);
    request.send();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var objData = JSON.parse(request.responseText);
            if (objData.status) {
                $('#txth_ids').val(objData.data.Ids);
                $('#txt_nombreIdioma').val(objData.data.Nombre);    
                if (objData.data.Estado == 1) {
                    $('#cmb_estado').val("1");
                } else {
                    $('#cmb_estado').val("1");
                }

            }
        }
        $('#modalFormIdioma').modal('show');
    }
}

function eliminarIdioma(ids) {
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
            var ajaxUrl = base_url + '/Idioma/eliminarIdioma';
            var strData = "ids=" + ids;
            request.open("POST", ajaxUrl, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(strData);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        swal("Eliminar!", objData.msg, "success");
                        tableIdiomas.api().ajax.reload(function () {

                        });
                    } else {
                        swal("Atención!", objData.msg, "error");
                    }
                }
            }
        }

    });

}




