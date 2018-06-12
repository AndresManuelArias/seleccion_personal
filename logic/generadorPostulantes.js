'use strict';
function unique (array,columna){
    let colection = [];        
    array.forEach((datoIngreso)=>{
        if (!colection.some(datoBusqueda => datoIngreso[columna] === datoBusqueda )){
            colection.push(datoIngreso[columna]);
        }
    });
    return colection;
}
function convertirValueJsonInJsonKey(columnas){
    let json2 = {};
    return (json)=>{
        if(typeof(eval(json)) === 'object'){
            let texto = 'json2';
            let colectionArray = '';            
            for(let key in json){
                if(columnas.some((columna => key ===  columna))){
                    texto += `["${json[key]}"]`;
                    if(typeof(eval(texto)) === 'undefined'){
                        eval(texto+'={}');
                    }
                }else{
                    if(!Array.isArray(eval(texto))){
                        eval(`${texto} = []`);                        
                    }
                    colectionArray += `"${key}":"${json[key]}",`;
                }                
            }
            let colectionTexto = colectionArray.slice(0,colectionArray.length-1);
            eval(`${texto}.push({${colectionTexto}})`);
        }
        return json2;
    };
}

function encontrarArrayInJsonAplicarFuncion(json,funcion){
    for(let key in json){
       if( Array.isArray( json[key])){
            json[key]  = funcion(json[key]);
       }else{
            encontrarArrayInJsonAplicarFuncion(json[key],funcion);
       }
    }
}
function convertPuntajesPorcentajes(array){
    let total = array.reduce((a,b)=> {
        let numero = typeof(a)=== 'number'?a:parseInt(a.puntaje_habilidad);
        return numero + parseInt(b.puntaje_habilidad);
    });
    return array.map(a => {
        return{'apodo_habilidad':a.apodo_habilidad,'puntaje_habilidad':a.puntaje_habilidad/total*100};
    });
}
module.exports = {convertirValueJsonInJsonKey:convertirValueJsonInJsonKey,
    encontrarArrayInJsonAplicarFuncion:encontrarArrayInJsonAplicarFuncion,
    convertPuntajesPorcentajes:convertPuntajesPorcentajes,
    unique:unique};