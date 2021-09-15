import axios from 'axios';

//Consulta Tableros e Indicadores
export async function getByFilterTableros(csrfToken,filter){
    let jsonRequest = JSON.stringify(filter);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/tableros-indicadores/getByFilter`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            var data = response.data;
            data.sort((a, b) => (a.idTablero > b.idTablero) ? 1 : ((b.idTablero > a.idTablero) ? -1 : 0))
            return data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function getTablerosById(csrfToken,id){
    var request = {
        idTablero: id
    }
    let jsonRequest = JSON.stringify(request);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/tableros-indicadores/getById`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            var data = response.data;
            return data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function getMetasAnualesByIdTablero(csrfToken,id){
    var request = {
        idTablero: id
    }
    let jsonRequest = JSON.stringify(request);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/celdas-anuales/getByFilter`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            var data = response.data;
            return data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function getMetasMensualesByIdTablero(csrfToken,id){
    var request = {
        idTablero: id
    }
    let jsonRequest = JSON.stringify(request);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/celdas-mensuales/getByFilter`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            var data = response.data;
            return data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export const temas = [
	{value:"Tema 1",descripcion:"Tema 1"},
	{value:"Tema 2",descripcion:"Tema 2"},
	{value:"Tema 3",descripcion:"Tema 3"},
	{value:"Tema 4",descripcion:"Tema 4"},
]
export const periodicidades = generatePeriodicidades();
function generatePeriodicidades(){
    let result = [];
    let yearActual = new Date().getUTCFullYear();
    var years = generateYearsBetween(yearActual-5,yearActual+5);
    years.forEach(y =>{result.push({periodo:"1",value:y.toString(),descripcion:y.toString()})});
    var base  = [
        {periodo:"Semestre",value:"20211",descripcion:"Primer Semestre 2021"},
        {periodo:"Semestre",value:"20212",descripcion:"Segundo Semestre 2021"},
        
        {periodo:"Trimestre",value:"202101",descripcion:"Primer Trimeste 2021"},
        {periodo:"Trimestre",value:"202102",descripcion:"Segundo Trimeste 2021"},
        {periodo:"Trimestre",value:"202103",descripcion:"Tercero Trimeste 2021"},
        {periodo:"Trimestre",value:"202104",descripcion:"Cuarto Trimeste 2021"},
                
        {periodo:"6",value:yearActual.toString()+"01",descripcion:"Enero "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"02",descripcion:"Febrero "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"03",descripcion:"Marzo "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"04",descripcion:"Abril "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"05",descripcion:"Mayo "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"06",descripcion:"Junio "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"07",descripcion:"Julio "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"08",descripcion:"Agosto "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"09",descripcion:"Septiembre "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"10",descripcion:"Octubre "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"11",descripcion:"Noviembre "+yearActual.toString()},
        {periodo:"6",value:yearActual.toString()+"12",descripcion:"Diciembre "+yearActual.toString()}
        ]
    base.forEach(b =>{result.push(b)});
    result.push(base);
    return result;
}
function generateYearsBetween(startYear, endYear) {
  const endDate = endYear || new Date().getFullYear();
  let years = [];
  for (var i = startYear; i <= endDate; i++) {
    years.push(startYear);
    startYear++;
  }
  return years;
}
export async function getAmbitos(){
    return await fetch(`${process.env.ruta}/wa/publico/getNivelLlaves`)
		.then(res => res.json())
        .then((data) =>{return data;})
        .catch(error => console.log(error));
}
export async function getPeriodo(){
    return await fetch(`${process.env.ruta}/wa/publico/catPeriodosTableros`)
		.then(res => res.json())
        .then((data) =>{return data;})
        .catch(error => console.log(error));
}
export async function getEntidades(){
    return await fetch(`${process.env.ruta}/wa/publico/catEntidades`)
		.then(res => res.json())
        .then((data) =>{return data;})
        .catch(error => console.log(error));
}
export async function getMunicipios(){
    return await fetch(`${process.env.ruta}/wa/publico/catMunicipios`)
		.then(res => res.json())
        .then((data) =>{return data;})
        .catch(error => console.log(error));
}
export async function getLocalidades(){
    return await fetch(`${process.env.ruta}/wa/publico/catLocalidades`)
		.then(res => res.json())
        .then((data) =>{return data;})
        .catch(error => console.log(error));
}
export async function getLocalidadesByIdEntidadAndIdMunicipio(idEntidad,idMunicipio){
    return await fetch(`${process.env.ruta}/wa/publico/catLocalidades?clave_entidad=${idEntidad}&clave_municipio=${idMunicipio}`)
		.then(res => res.json())
        .then((data) =>{return data;})
        .catch(error => console.log(error));
}
export async function getLocalidadesByTablero(csrfToken,id){
    var request = id
    let jsonRequest = JSON.stringify(request);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/tableros-indicadores/getLocalidadesByTablero`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            var data = response.data;
            return data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}

//Administración GeoEstadistica
export async function getTablasDisponiblesAdmonGeoEstadistica(csrfToken){
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/getTablasDisponibles`,
        headers: requestHeaders,
        withCredentials: true
        };
    var data = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function getColumnasDeTabla(csrfToken,table){
    let jsonRequest = JSON.stringify(table);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/getColumnasDeTabla`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function insertaPreRegistroAdministracionGeoEstadistica(csrfToken,preRegistro){
    let jsonRequest = JSON.stringify(preRegistro);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/insertCatProdEstadisticos`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function getByIdCatProdEstadisticos(csrfToken,id){
    let jsonRequest = JSON.stringify({id:id});
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/getByIdCatProdEstadisticos`,
        headers: requestHeaders,
        withCredentials: true,
        data: id
        };
    var data = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function getByTablaCatColumnasProdest(csrfToken,tabla){
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/catColumnasProdest/getByTabla`,
        headers: requestHeaders,
        withCredentials: true,
        data: tabla
        };
    var data = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function findAllCatProdEstadisticos(csrfToken){
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/findAllCatProdEstadisticos`,
        headers: requestHeaders,
        withCredentials: true
        };
    var data = axios(config)
        .then(function (response) {
            var data = response.data;
            data.sort((a, b) => (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0))
            return data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function updateCatProdEstadisticos(csrfToken,catProdEstadisticos){
    let jsonRequest = JSON.stringify(catProdEstadisticos);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/updateCatProdEstadisticos`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}
export async function updateCatColumnasProdest(csrfToken,catColumnasProdest){
    let jsonRequest = JSON.stringify(catColumnasProdest);
    let requestHeaders = { "Content-Type": "application/json" };
    if(csrfToken=== undefined || csrfToken.headerName=== undefined)return [];
    requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
    let config = {
        method: "post",
        url: `${process.env.ruta}/wa/prot/administracion-geoEstadistica/updateCatColumnasProdest`,
        headers: requestHeaders,
        withCredentials: true,
        data: jsonRequest
        };
    var data = axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
    return data;
}