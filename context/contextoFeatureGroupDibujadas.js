import {createContext, useState} from 'react'

//Se define el contexto
export const ContextoCreadoFeature = createContext()

//Regresa el proveedor del contexto
export default function contextoFeatureGroupDibujadas(componentesHijos){
    const [valorFeature, setValorFeature] = useState(null)

    return(
        <ContextoCreadoFeature.Provider value={{valorFeature, setValorFeature}}>
            {componentesHijos.children}
        </ContextoCreadoFeature.Provider>
    )
}