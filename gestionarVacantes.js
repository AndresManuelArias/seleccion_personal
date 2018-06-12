'use strict';
const csvdata = require('csvdata'),
vacantesEmpresa = require('./logic/vacantesEmpresa.js'),
postulantes = require('./logic/postulantes.js'),
candidatosPuestoTrabajo = require('./logic/candidatosSeleccionadosPuestoTrabajo.js'),
fs = require('fs'),
InformarPostulantesSeleccionados = require('./view/informarPostulantesSeleccionados.js')
;

let habilidades_postulantes = 'data/base datos postulaciones - habilidades_postulantes.csv',
postulaciones_a_empresas =  'data/base datos postulaciones - postulaciones.csv',
puestoVacantes ='data/base datos postulaciones - puestoVacantes.csv'
;

function promiseRead(lugar){
    return new Promise((resolve)=>{
        csvdata.load(lugar, {
            delimiter: ',',
            log: true,
            objName: false,
            stream: false
        }).then(data => resolve(data));
    });   
}
// let respuesta = [habilidades_postulantes,postulaciones,puestoVacantes].map((lugar)=>{
//     console.log(lugar)
//     return promiseRead(lugar).then((data)=>data)
// });

// promiseRead(postulaciones_a_empresas).then((data)=>{
//     console.log(data)
// });

promiseRead(puestoVacantes).then((empresasPuestoTrabajo)=>{
    promiseRead(postulaciones_a_empresas).then((postulaciones)=>{  
        promiseRead(habilidades_postulantes).then((habilidadesCandidatos)=>{
            // console.log(empresasPuestoTrabajo);
            // console.log(postulaciones);
            // console.log(habilidadesCandidatos);
            let vacantesJson = vacantesEmpresa.crearPuestos(empresasPuestoTrabajo);
            // console.log(vacantesJson)
            // for(let grupo in vacantesJson ){
            //     console.log(grupo,vacantesJson[grupo]);
            // }
            let postulantesDentroEmpresa = postulantes.generarPostulantes(habilidadesCandidatos,postulaciones);
            // for(let key in postulantesDentroEmpresa ){
            //     console.log(key);
            //     postulantesDentroEmpresa[key].forEach(element => {
            //         console.log(element);
            //     });
            // }
            let candidatos = candidatosPuestoTrabajo.seleccionarCandidatos(vacantesJson,postulantesDentroEmpresa)
            for(let key in candidatos){
                console.log(candidatos[key]);       
            } 
            fs.writeFileSync('data/candidatosSelecionados.json', JSON.stringify(candidatos), 'utf8');        
            let informarPostulantesSeleccionados = new InformarPostulantesSeleccionados('public/empresas.html');
            informarPostulantesSeleccionados.graficar(candidatos);
        });    
    });
});



