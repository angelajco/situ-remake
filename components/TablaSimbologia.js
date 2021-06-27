import React, { useEffect, useState } from 'react';
import Sim from './SimbologiaCapa';
//import ReactHtmlParser from "react-html-parser";

function TablaSimbologia(props) {

    let sim = new Sim();
    sim = props.info;
    

    return (
        Object.keys(sim).length === 0 ? (
            <p></p>
        ) : (
            <div id="tablaR" dangerouslySetInnerHTML={{ __html: sim.tablahtml(1) }} ></div>
        )

    )




}


export default TablaSimbologia;