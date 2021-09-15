import { useEffect } from "react";
import { useRouter } from 'next/router'
import { useAuthDispatch, logout} from '../context';
import axios from 'axios'

export default function LoggedUserLoader () {

    const dispatch = useAuthDispatch();

    const path = useRouter().pathname;
    
    const getAccionesFor = (menu, path)=>{
        for(let funcion of menu){
            if(funcion.submenu){
                return getAccionesFor(funcion.submenu, path);
            } else {
                if(funcion.pagina == path){
                    return funcion.acciones;
                }
            }
        }
    };

    useEffect(() => {
        let userDetails = localStorage.getItem('currentUser')
            ? JSON.parse(localStorage.getItem('currentUser'))
            : {};
        if (userDetails.username) {
            //Revisamos si el servidor efectivamente mantiene una sesión activa
            let requestHeaders = {};
            requestHeaders[`${userDetails.csrfToken.headerName}`]=userDetails.csrfToken.token;
            axios.get(`${process.env.ruta}/wa/prot/getUserDetails`,{headers: requestHeaders, withCredentials: true})
                    .then(response=>{
                        userDetails.accionesCurrentPath = getAccionesFor(userDetails.menu, path);
                        dispatch({ type: 'LOGIN_SUCCESS', payload: userDetails });
                    })
                    .catch(err=>{
                        logout(dispatch, userDetails.csrfToken);
                    });
        }
      }, []);


    return null;
}
