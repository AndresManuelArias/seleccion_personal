
'use strict';
//@ts-check
const fs = require('fs');
function organizador(jsonEmpresasSeleccionados){
    let gruposEmpresa = [];
    for(let empresa in jsonEmpresasSeleccionados){
        let resultEmpresa = {};    
        resultEmpresa.nombre = empresa;
        resultEmpresa.candidatos = [];
        for( let vacanteDeEmpresa in jsonEmpresasSeleccionados[empresa]){                     
            resultEmpresa.candidatos.push({
                puesto:vacanteDeEmpresa,
                candidato:jsonEmpresasSeleccionados[empresa][vacanteDeEmpresa].nickName,
                score:jsonEmpresasSeleccionados[empresa][vacanteDeEmpresa].puntajeDiferencia
            });
            
        }
        gruposEmpresa.push(resultEmpresa);
    }
    return gruposEmpresa;
}

function paintGraphicsTeam(team){
    /**
     * @param {string[]} team.roles
     */
    let countPeople = team.candidatos.length;
    let  datasets = team.candidatos.map((resultUsser,index)=>{
        return{
            label:`${resultUsser.candidato}`,
            backgroundColor: `rgba(216, ${index/countPeople*255},${Math.floor(Math.random()*255)}, 0.4)`,
            borderColor: `rgba(100,${index/countPeople*255},${Math.floor(Math.random()*255)},0.6)`,
            data:`${JSON.stringify(resultUsser.score)}`
        };
    });
    console.log('datasets.map(dato => dato.label)',datasets.map(dato => dato.label));
    return ` 
        <h2> Grafico del equipo ${team.nombre} </h2>
        <canvas id="myChart${team.nombre.replace(/\s+/g,'')}}" width="331" height="165" class="chartjs-render-monitor" style="display: block; width: 331px; height: 165px;">
        </canvas>
        <script>
            var marksData = {
                labels:${JSON.stringify(datasets.map(dato => dato.label))},
                datasets: [
                    {
                        label: '# diferencia de parecido al puesto  ',
                        data: ${JSON.stringify(datasets.map(dato => dato.data))},
                        backgroundColor: ${JSON.stringify(datasets.map(dato => dato.backgroundColor))},
                        borderColor:${JSON.stringify(datasets.map(dato => dato.borderColor))},
                        borderWidth: 1
                    }
                ]
            };     
            var ctx = document.getElementById("myChart${team.nombre.replace(/\s+/g,'')}}");
            var myRadarChart = new Chart(ctx, {
                type: 'bar',
                data: marksData,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });

        
        </script>
    `;
}
function paintEmpresas(array,...functionsPaint){
    console.log('array',array);
    let concatenate = ``;
    array.forEach(element => {
        functionsPaint.forEach((funcionPaint)=>{
            concatenate += 
    ` 
    <section> 
        ${funcionPaint(element)} 
    </section> ` ;
        });
    });
    return concatenate;
}
function encapsularHTML(datosAgregados){
    return `
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">              
    <title>
        ${datosAgregados.title}
    </title>
</head> 
<body>     
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>          
    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>   
    <script src="http://www.chartjs.org/dist/2.7.1/Chart.bundle.js"></script>   
    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js"></script>                   
    <h1> ${datosAgregados.title} </h1>
            ${datosAgregados.body} 
</body>    
</html>  `;
}



function paintTableEmpresa(resultEmpresa){
    return `
        <h1> ${resultEmpresa.nombre} </h1>
        <table class="table table-bordered panel-body">
            <thead class="bg-primary text-white">
                <tr>
                    <th> Puesto </th>
                    <th>Candidato seleccionados </th>
                    <th>Puntaje </th>
                </tr>
            </thead>
            <tbody id="app${resultEmpresa.nombre.replace(/\s+/g,'')}">
                <tr v-for="todo in todos">
                    <td> {{ todo.puesto}} </td>
                    <td> {{ todo.candidato}} </td>
                    <td> {{ todo.score}} </td>
                </tr>
            </tbody>  
        </table>

        <script>
            new Vue({
                el: "#app${resultEmpresa.nombre.replace(/\s+/g,'')}",
                data: {
                    todos: ${JSON.stringify(resultEmpresa.candidatos.sort((a, b) => a.score > b.score ))}
                }
            })  
        </script>
    `;
}

 

class InformarPostulantesSeleccionados {
    constructor(lugarGraficos){
        this.lugarGraficos = lugarGraficos;
    }
    graficar(jsonEmpresa){
        let arrayEmpresas =organizador(jsonEmpresa);
        console.log(arrayEmpresas);
        arrayEmpresas.forEach((a)=>console.log(a));
        fs.writeFileSync(this.lugarGraficos, encapsularHTML({
            title:'Seleccion candidatos',
           body: paintEmpresas(arrayEmpresas,paintTableEmpresa,paintGraphicsTeam)
        }));
    }
}
module.exports = InformarPostulantesSeleccionados;