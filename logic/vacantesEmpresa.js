// function unique (array,columna){
//     let colection = [];        
//     array.forEach((datoIngreso)=>{
//         if (!colection.some(datoBusqueda => datoIngreso[columna] === datoBusqueda )){
//             colection.push(datoIngreso[columna]);
//         }
//     });
//     return colection;
// }
'use strict';
const padre = require('./generadorPostulantes.js');
function convertirBaseDatosInJson(vacantes){
    let  generarJsonKey = padre.convertirValueJsonInJsonKey(['nickname_empresa','apodo_puesto_trabajo']);
    vacantes.forEach(vacante => generarJsonKey(vacante));
    return generarJsonKey();
}

function convertirPuntajesPorcentajes(vacantes){
    padre.encontrarArrayInJsonAplicarFuncion(vacantes,padre.convertPuntajesPorcentajes);
    return vacantes;
}

module.exports = {crearPuestos(vacantes){return convertirPuntajesPorcentajes(convertirBaseDatosInJson(vacantes));}};
