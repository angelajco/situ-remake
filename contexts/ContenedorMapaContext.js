import { createContext } from 'react'

const ContenedorMapaContext = createContext({
    refMap: null,
    objL: null,
    tipoCoord: 1,
    zoom: null,
    referenciaMapa: () => { }
});

export default ContenedorMapaContext