
'use strict';
function generarDiferenciaHabilidades(vacanteEmpresa,habilidadesPostulante){
    let sumatoriaDiferencias = 0;
    vacanteEmpresa.forEach((habilidadVacante) => {
        let indexPostulante = habilidadesPostulante.findIndex((habilidadPostulante)=>{ 
            return habilidadPostulante.apodo_habilidad === habilidadVacante.apodo_habilidad;
        });
        sumatoriaDiferencias += Math.pow( habilidadVacante.puntaje_habilidad - habilidadesPostulante[indexPostulante].puntaje_habilidad,2);
    });
    return sumatoriaDiferencias/habilidadesPostulante.length;
}
function organizarCandidatosVacante(vacanteEmpresa,candidatos){
    let candidatosPuntajeDiferencia = candidatos.map(candidato => {
       return {nickName:candidato.nickName ,
        puntajeDiferencia:generarDiferenciaHabilidades(vacanteEmpresa,candidato.habilidades)};
    });
    return candidatosPuntajeDiferencia.sort((a,b)=>a.puntajeDiferencia > b.puntajeDiferencia);
}
function  mostrarPositionOfCandidatos(habilidadesVacantesEmpresa,postulantesEmpresas){
    let empresaVacantesCandidatos = {};
    for(let empresa in postulantesEmpresas){
        empresaVacantesCandidatos[empresa]={};
        for(let vacante in  habilidadesVacantesEmpresa[empresa]){
            empresaVacantesCandidatos[empresa][vacante] = organizarCandidatosVacante(habilidadesVacantesEmpresa[empresa][vacante],postulantesEmpresas[empresa]);
        }
    }
    return empresaVacantesCandidatos;
}
function generarSumatoriaPuntajeDiferencia(empresaVacantesCandidatos){
    let sumatoriaDiferenciasVacantesEmpresas = {};
    for(let empresa in empresaVacantesCandidatos){
        sumatoriaDiferenciasVacantesEmpresas[empresa] = [];
        for(let vacantes in empresaVacantesCandidatos[empresa] ){
            sumatoriaDiferenciasVacantesEmpresas[empresa].push({
                'apodo_vacante':vacantes,
                'puntaje_grupal':empresaVacantesCandidatos[empresa][vacantes]
            .reduce((a,b)=>{
                let numero = typeof(a)=== 'number'?a:parseInt(a.puntajeDiferencia);
                return numero + parseInt(b.puntajeDiferencia);
            })
        });
        }
        sumatoriaDiferenciasVacantesEmpresas[empresa].sort((a,b)=> a.puntaje_grupal < b.puntaje_grupal);
    }
    return sumatoriaDiferenciasVacantesEmpresas;
}
module.exports = {
    seleccionarCandidatos(habilidadesVacantesEmpresa,postulantesEmpresas){
        let empresasVacantesCandidatoSeleccionado = {};     
        let candidatosOrdenadosVacantesEmpresas = mostrarPositionOfCandidatos(habilidadesVacantesEmpresa,postulantesEmpresas);
        console.log('candidatosOrdenadosVacantesEmpresas');
        for(let j in candidatosOrdenadosVacantesEmpresas){
            console.log(j);
            console.log(candidatosOrdenadosVacantesEmpresas[j]);
        }
        let empresasVacantesOrdenadas = generarSumatoriaPuntajeDiferencia( candidatosOrdenadosVacantesEmpresas);
        console.log('empresasVacantesOrdenadas');
        for(let j in empresasVacantesOrdenadas){
            console.log(j);
            console.log(empresasVacantesOrdenadas[j]);
        }
        for(let empresa in empresasVacantesOrdenadas){
            let escogidos = [];
            empresasVacantesCandidatoSeleccionado[empresa] = {};
            empresasVacantesOrdenadas[empresa].forEach((vacante)=>{
                let candidatosSelecionados = candidatosOrdenadosVacantesEmpresas[empresa][vacante.apodo_vacante].filter((candidato)=>{
                    return !escogidos.some((escogido) => {
                        return candidato.nickName === escogido.nickName;
                    });
                });
                // console.log(candidatosSelecionados);
                escogidos.push(candidatosSelecionados[0]);
                // console.log(escogidos);
                empresasVacantesCandidatoSeleccionado[empresa][vacante.apodo_vacante]  = candidatosSelecionados[0];
            });
       }
       return empresasVacantesCandidatoSeleccionado;
    }
};