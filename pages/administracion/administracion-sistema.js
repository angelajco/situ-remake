import Link from 'next/link'
import { useState, useEffect } from 'react'

import axios from 'axios'
import Router from 'next/router'

import Cookies from 'universal-cookie'
const cookies = new Cookies()

import Loader from '../../components/Loader'

export default function administracionSistema() {

    // Estado para guardar el web token que se pide a la API
    const [tokenSesion, setTokenSesion] = useState(false)
    // Guarda el token que viene en la cookie para verificar que la tenga
    const tokenCookie = cookies.get('SessionToken')
    const rolCookie = cookies.get('RolUsuario')
    const estatusCookie = cookies.get('EstatusUsuario')

    useEffect(() => {
        if ((rolCookie != 1 && rolCookie != 2) || estatusCookie != 10) {
            Router.push('/');
        }

        if (tokenCookie != undefined) {
            // Configuracion para verificar el token
            var config = {
                method: 'get',
                url: `${process.env.ruta}/wa/prot/acceso`,
                headers: {
                    'Authorization': `Bearer ${tokenCookie}`
                },
            };
            axios(config)
                .then(function (response) {
                    setTokenSesion(response.data['success-boolean'])
                })
                .catch(function (error) {
                    console.log(error)
                    cookies.remove('SessionToken', { path: "/" })
                    Router.push("/administracion/inicio-sesion")
                })
        }
        else {
            Router.push('/administracion/inicio-sesion')
        }
    }, [tokenCookie, rolCookie, estatusCookie])

    return (
        <>
            {
                tokenSesion ?
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <Link href="/administracion/autorizacion-usuarios">
                                    <a>Autorización de usuarios</a>
                                </Link>
                            </div>
                            <div className="col-12">
                                <Link href="/administracion/administracion-catalogos">
                                    <a>Administración de Catálogos</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    :
                    <Loader />
            }
        </>
    )
}
