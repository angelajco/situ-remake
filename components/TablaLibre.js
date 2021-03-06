import React, { useEffect, useState } from 'react';

function TablaLibre(props) {
    let num = props.rango;

    function filaHtml(i) {
		return `<tr><td><input size='10' type="text" id='${i}'></input></td><td><input size='10' type="text" id='${i + 1}'></input></td><td><input size='10' type="text" id='${i + 2}'></input></td><td><input type="color" id='${i + 3}'></input></td><td><input type="color" id='${i + 4}'></input></td><td style='width: 20px;'><input size='10' type="number" value='1' id='${i + 5}'></input></td><td><input style='width: 100px;' type="number" value='1' id='${i + 6}'></input></td></tr>`
	}

    function tabla(aux) {

        let aux1 = 0;
        let salida = `<table class="table-responsive"><tr><th>Minimo</th><th>Maximo</th><th>Leyenda</th><th>Color</th><th>Borde</th><th>Grosor</th><th>Radio</th><tr>`;
        for (let i = 0; i < aux; i++) {
            salida += filaHtml(aux1);
            aux1 = aux1 + 7;
        }
        salida += `</table>`;
        return salida;
    }


    return (
        num > 0 ? (
            <div id="tablaR" dangerouslySetInnerHTML={{ __html: tabla(num) }} ></div>
        ) : (
            <div></div>
        )


    )




}


export default TablaLibre;