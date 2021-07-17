import {createContext, useState} from 'react'

//Se define el contexto
export const ContextoCreado = createContext()

//Regresa el proveedor del contexto
export default function contextoMapasProvider(componentesHijos){
    const [valoresMapa, setValoresMapa] = useState({
        centro: null,
        zoom: null,
    })

    const [valoresMapaEspejo, setValoresMapaEspejo] = useState({
        centro: null,
        zoom: null,
    })

    return(
        <ContextoCreado.Provider value={{valoresMapa, setValoresMapa, valoresMapaEspejo, setValoresMapaEspejo}}>
            {componentesHijos.children}
        </ContextoCreado.Provider>
    )
}