import Router, { useRouter } from 'next/router'
import { useAuthState } from '../context';
import publicPages from "../shared/jsons/publicPages.json";
import ModalComponent from '../components/ModalComponent';

function encuentraRutaPrivada(menu, ruta) {
    return menu.filter(menuItem => {
        if (menuItem.submenu) {
            let rutaEncontrada = encuentraRutaPrivada(menuItem.submenu, ruta);
            return (rutaEncontrada && rutaEncontrada.length > 0);
        } else {
            return menuItem.pagina === ruta;
        }
    });
}

export default function PageSecurityInterceptor({ children }) {
    const router = useRouter();

    let ruta = router.pathname;
    let rutaPublicaEncontrada = publicPages.filter(pbPg => pbPg.pagina === ruta);

    let muestraModalAccesoRestringido = false;

    if (!rutaPublicaEncontrada || rutaPublicaEncontrada.length == 0) {
        //No es una página pública, verificamos que el usuario tenga acceso
        const userDetails = useAuthState().user;

        if (userDetails.username) {
            //Hay un usuario firmado
            let rutaPrivadaEncontrada = encuentraRutaPrivada(userDetails.menu, ruta);
            if (!rutaPrivadaEncontrada || rutaPrivadaEncontrada.length == 0) {
                //Pero no tiene acceso a la ruta solicitada
                muestraModalAccesoRestringido = true;
            }
        } else {
            //No hay usuario firmado
            muestraModalAccesoRestringido = true;
        }
    }

    if (muestraModalAccesoRestringido) {
        const handleClose = async () => {
            await Router.push("/");
            muestraModalAccesoRestringido = false;
        };

        return (
            <ModalComponent
                show={muestraModalAccesoRestringido}
                datos={{
                    title: 'Acceso Restringido',
                    body: 'No cuenta con autorización para ejecutar la funcionalidad indicada'
                }}
                onHide={handleClose}
                onClick={handleClose}
            />
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}