(function () {
    "use strict";
    var treeviewMenu = $('.app-menu');
    var treeviewMenu2 = $('.app-menu2');

    // Toggle Sidebar
    $('[data-toggle="sidebar"]').click(function (event) {
        event.preventDefault();
        $('.app').toggleClass('sidenav-toggled');
    });

    // Activate sidebar treeview toggle
    $("[data-toggle='treeview']").click(function (event) {
        event.preventDefault();
        if (!$(this).parent().hasClass('is-expanded')) {
            treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
        }
        $(this).parent().toggleClass('is-expanded');
    });

    // Activate sidebar treeview2 toggle
    $("[data-toggle='treeview2']").click(function (event) {
        event.preventDefault();
        if (!$(this).parent().hasClass('is-expanded')) {
            treeviewMenu2.find("[data-toggle='treeview2']").parent().removeClass('is-expanded');
        }
        $(this).parent().toggleClass('is-expanded');
    });

    // Set initial active toggle
    $("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

    // Set initial active toggle
    //$("[data-toggle='treeview2.'].is-expanded").parent().toggleClass('is-expanded');

    //Activate bootstrip tooltips
    $("[data-toggle='tooltip']").tooltip();

})();

/*
 * Valida la Entrada del Enter
 */
function isEnter(e) {
    //retornar verdadereo si presiona Enter
    var key;
    if (window.event) // IE
    {
        key = e.keyCode;
        if (key == 13 || key == 9) {
            return true;
        }
    } else if (e.which) { // Netscape/Firefox/Opera
        key = e.which;
        // NOTE: Backspace = 8, Enter = 13, '0' = 48, '9' = 57	
        //var key = nav4 ? evt.which : evt.keyCode;	
        if (key == 13 || key == 9) {
            return true;
        }
    }
    return false;
}

function TextMayus(e) {
    e.value = e.value.toUpperCase();
}

//Convierte su primer carácter en su equivalente mayúscula.
function MyPrimera(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Agrega 0 a la Izq Numeros
function addCeros(tam, num) {
    if (num.toString().length <= tam)
        return addCeros(tam, "0" + num)
    else
        return num;
}

function redondea(sVal, nDec) {
    var sepDecimal = ".";
    var n = parseFloat(sVal);
    var s = "0.00";
    if (!isNaN(n)) {
        n = Math.round(n * Math.pow(10, nDec)) / Math.pow(10, nDec);
        s = String(n);
        //s += (s.indexOf(".") == -1? ".": "") + String(Math.pow(10, nDec)).substr(1);
        s += (s.indexOf(sepDecimal) == -1 ? sepDecimal : "") + String(Math.pow(10, nDec)).substr(1);
        //s = s.substr(0, s.indexOf(".") + nDec + 1);
        s = s.substr(0, s.indexOf(sepDecimal) + nDec + 1);
    }
    return s;
}

function number_format(number, decimals, dec_point, thousands_sep) {
    number = number * 1;//makes sure `number` is numeric value
    var str = number.toFixed(decimals ? decimals : 0).toString().split('.');
    var parts = [];
    for (var i = str[0].length; i > 0; i -= 3) {
        parts.unshift(str[0].substring(Math.max(0, i - 3), i));
    }
    str[0] = parts.join(thousands_sep ? thousands_sep : ',');
    return str.join(dec_point ? dec_point : '.');
}

function calculoCostos(costo, margen, numDecimal) {
    //Aplica para los decuentos sin tener perdidas
    precio = (costo / ((100 - margen) / 100));
    return number_format(precio, numDecimal, SPD, SPM);
}

function calcularEdad(inputFechaNacimiento) {
    //const inputFechaNacimiento = document.getElementById('fechaNacimiento');
    const fechaNacimiento = new Date(inputFechaNacimiento);
    const fechaActual = new Date();

    // Calcular la diferencia en milisegundos entre las dos fechas
    const diferenciaMilisegundos = fechaActual - fechaNacimiento;

    // Calcular la edad dividiendo la diferencia en milisegundos por la cantidad de milisegundos en un año
    const edad = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 365.25));

    //document.getElementById('resultado').innerText = `La edad actual es: ${edad} años`;
    return edad;
}

//Obtener Dia de la Semana
function obtenerDiaSemana(numero) {
    let dias = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
    ];
    return dias[numero];
}

function retornarDiaLetras(nLetIni) {
    switch (nLetIni) {
        case "LU":
            nDia = "Lunes"
            break;
        case "MA":
            nDia = "Martes"
            break;
        case "MI":
            nDia = "Miércoles"
            break;
        case "JU":
            nDia = "Jueves"
            break;
        case "VI":
            nDia = "Viernes"
            break;
        case "SA":
            nDia = "Sábado"
            break;
        default:
            nDia = "Domingo"
    }
    return nDia;
}



//Obtener fecha con Letras
function obtenerFechaConLetras(fechaDia) {
    let meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    var fecha = new Date(fechaDia);
    var dia = fecha.getUTCDate();
    var numeroDia = fecha.getUTCDay();
    var nombreDia = obtenerDiaSemana(numeroDia);
    var mes = meses[fecha.getUTCMonth()];
    var ano = fecha.getUTCFullYear();
    return `${nombreDia}, ${dia} de ${mes} de ${ano}`;
}


// Convierte string "YYYY-MM-DD" en objeto Date
function obtenerFormatoFecha(fechaString) {
    if (!fechaString || typeof fechaString !== "string") return null;
    const [anio, mes, dia] = fechaString.split("-").map(Number);
    return new Date(anio, mes - 1, dia); // El mes es base 0
}

// Convierte objeto Date a string "YYYY-MM-DD" con ceros a la izquierda
function retornarFecha(fecha) {
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${anio}-${mes}-${dia}`;
}

// Verifica si una fecha está dentro del rango, o fuera
function estaEnRango(evento, fecha, fechaInicio, fechaFin) {
    const resultado = {};

    // Avanza o retrocede la fecha según el evento
    const nuevaFecha = contarFechaDia(evento, new Date(fecha)); // Clona la fecha para no modificarla directamente

    const timeNueva = nuevaFecha.getTime();
    const timeInicio = fechaInicio.getTime();
    const timeFin = fechaFin.getTime();

    if (timeNueva > timeInicio && timeNueva < timeFin) {
        resultado.estado = "OK";
        resultado.fecha = nuevaFecha;
    } else if (timeNueva === timeInicio) {
        resultado.estado = "INI";
        resultado.fecha = fechaInicio;
    } else if (timeNueva === timeFin) {
        resultado.estado = "FIN";
        resultado.fecha = fechaFin;
    } else {
        resultado.estado = "FUE";
        resultado.fecha = timeNueva < timeInicio ? fechaInicio : fechaFin;
    }

    return resultado;
}


// Avanza o retrocede una fecha en 1 día
function contarFechaDia(accionMove, fecha) {
    const nuevaFecha = new Date(fecha); // Crear copia para no modificar el original
    if (accionMove === "Next") {
        nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    } else if (accionMove === "Back") {
        nuevaFecha.setDate(nuevaFecha.getDate() - 1);
    }
    return nuevaFecha;
}

//Busca si existe un codigo en la lista JSON
function codigoExiste(value, property, lista) {
    if (lista) {
        var array = JSON.parse(lista);
        for (var i = 0; i < array.length; i++) {
            if (array[i][property] == value) {
                return false;
            }
        }
    }
    return true;
}

// Retorna el índice del primer elemento que coincide con una propiedad y valor
function retornarIndexArray(array, property, value) {
    if (!Array.isArray(array)) return -1;
    return array.findIndex(item => item[property] == value);
  }
  
  // Elimina todos los elementos del array que coincidan con la propiedad y valor
  function findAndRemove(array, property, value) {
    if (!Array.isArray(array)) return [];
  
    return array.filter(item => item[property] != value);
  }
  



function peticionAjax(url, metodo, datos, exitoCallback, errorCallback) {
    $.ajax({
        url: url,
        method: metodo,
        data: datos,
        dataType: 'json', // Puedes ajustar esto según el tipo de datos que esperas
        success: function (data) {
            if (exitoCallback && typeof exitoCallback === 'function') {
                exitoCallback(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(jqXHR, textStatus, errorThrown);
            }
        }
    });
}