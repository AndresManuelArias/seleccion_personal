
'use strict';
const padre = require('./generadorPostulantes.js');
function transFormJsonHabilidadesCandidatos(habilidadesCandidatos){
    let  generarJsonKey = padre.convertirValueJsonInJsonKey(['nickName']);
    habilidadesCandidatos.forEach(candidato => generarJsonKey(candidato));
    let habilidadesCandidatosJsonkey = generarJsonKey();
    padre.encontrarArrayInJsonAplicarFuncion(habilidadesCandidatosJsonkey,padre.convertPuntajesPorcentajes);
    return habilidadesCandidatosJsonkey;
}
function transFormInJsonPostulaciones(postulaciones){
    let  generarJsonKey = padre.convertirValueJsonInJsonKey(['nickname_empresa']);
    postulaciones.forEach(candidato => generarJsonKey(candidato));
    return generarJsonKey();
}

function mostrarPostulacionesDentroEmpresas(habilidadesCandidatos,postulaciones){
    let candidatos = transFormJsonHabilidadesCandidatos(habilidadesCandidatos);
    let jsonPostulaciones = transFormInJsonPostulaciones(postulaciones);
    padre.encontrarArrayInJsonAplicarFuncion(jsonPostulaciones,(empresaArray)=>{
        return empresaArray.map((user)=>{
            return {'nickName':user.nickName,'habilidades':candidatos[user.nickName]};
        });
    });
    return jsonPostulaciones;
}
module.exports = {
    generarPostulantes(habilidadesCandidatos,postulaciones){
        return mostrarPostulacionesDentroEmpresas(habilidadesCandidatos,postulaciones);
    }
};
