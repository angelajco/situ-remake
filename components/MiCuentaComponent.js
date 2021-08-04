import { OverlayTrigger, Tooltip, Table} from 'react-bootstrap'
import React,{useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faBan} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ModalAnalisis from './ModalAnalisis'
import { useAuthState } from '../context';
function MiCuentaComponent(props) {
    // usuario temporal
    
    const userDetails = useAuthState().user;
    let csrfToken = userDetails.csrfToken;
    const [descargas , setDescargas] = useState([]);
    const [showModalAnalisis, setShowModalAnalisis] = useState(false);
    const handleCloseModalAnalisis = () => setShowModalAnalisis(false);
    const [datosModalAnalisis, setDatosModalAnalisis] = useState(
        {
            title: '',
            body: ''
        }
    );   
    // buscar las descargas disponibles por usuario
    useEffect(() => {
        let requestHeaders = { "Content-Type": "application/json" };
		requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
        axios({
            url: `${process.env.ruta}/wa/prot/descargasPorUsuario/${userDetails.id}`,
            method: 'GET',
            withCredentials: true,
            headers: requestHeaders,
          }).then((response) => {
                setDescargas(response.data)
          }).catch(function (error) {
           console.log(error)
        });
    }, []);

    function onClickItemTable(nombreArchivo) {
        let requestHeaders = { "Content-Type": "application/json" };
		requestHeaders[`${csrfToken.headerName}`] = csrfToken.token;
        axios({
            url: `${process.env.ruta}/wa/prot/descargarRepoLocal/${nombreArchivo}`,
            method: 'GET',
            responseType: 'blob',
            withCredentials: true,
            headers: requestHeaders,
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
          }).catch(function (error) {
            setDatosModalAnalisis({
                title: 'Descarga no válida',
                body: "¡Archivo no encontrado!",
            })
            setShowModalAnalisis(true);
        });  
    }
    return(
       <div className="col">
        <ModalAnalisis show={showModalAnalisis}
                datos={datosModalAnalisis}
                onHide={handleCloseModalAnalisis}> </ModalAnalisis>

          <div className="d-flex justify-content-center" >Capas cartográficas</div>
          <div className="d-flex justify-content-center overflow: scroll;">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nombre</th>
                        <th>Solicitado en</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    descargas.map((value, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{value.nombreArchivo}</td>
                            <td>{value.fecha}</td>
                            <td>{value.estatus}</td>
                            <td>
                                {
                                    value.estatus == 'Listo'?(
                                        <a className="tw-text-titulo tw-font-bold tw-cursor-pointer" 
                                            onClick={() => onClickItemTable(value.nombreArchivo)}> 
                                            <OverlayTrigger overlay={<Tooltip>Click para descargar</Tooltip>}>
                                                <FontAwesomeIcon className="tw-px-1" size="2x" icon={faDownload} />
                                            </OverlayTrigger>
                                        </a>)
                                    :(
                                       <a className="tw-text-titulo tw-font-bold tw-cursor-pointer" > 
                                            <OverlayTrigger overlay={<Tooltip>No disponible</Tooltip>}>
                                                <FontAwesomeIcon className="tw-px-1" size="2x" icon={faBan} />
                                            </OverlayTrigger>
                                        </a>
                                    )   
                                }
                            </td>
                           
                        </tr>
                    ))
                    }
                </tbody>    
            </Table>
        </div>  
       </div>

       
    )
}
export default React.memo(MiCuentaComponent)