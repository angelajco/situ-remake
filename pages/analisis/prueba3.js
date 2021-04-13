import { useState } from "react";
import Componente from '../../components/aa'
import Componente2 from '../../components/aaa'

function Prueba3() {
    const [count, setCount] = useState(0)

    const aumenta = () => {
        setCount(count + 1)
    }

    return (
        <>
            <button onClick={aumenta}>aumenta</button>
            <Componente datos={count}/>
            <Componente2 />
        </>
    )
}

export default Prueba3