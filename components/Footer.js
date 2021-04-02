export default function Footer() {
    return (
        <footer className="tw-bg-inst-verdef tw-text-white simi-gob-mx-content">
            <div className="container tw-py-12 tw-flex tw-justify-between tw-flex-wrap">
                <div className="row custom-max-width">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <img src="/images/escudo_2.png" className="w-100 custom-mx-b-1"></img>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <h6 className="simi-gob-mx-title">Enlaces</h6>
                        <ul className="tw-p-0">
                            <li className="tw-list-none">
                                <a className="tw-text-white" target="_blank" href="https://www.participa.gob.mx/">Participa</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" target="_blank" href="https://datos.gob.mx/">Datos</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" target="_blank" href="https://www.gob.mx/publicaciones">Publicaciones oficiales</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" target="_blank" href="http://portaltransparencia.gob.mx/pot/estructura/showOrganigrama.do?method=showOrganigrama&_idDependencia=15">Portal de obligaciones de transparencia</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" target="_blank" href="https://www.infomex.org.mx/gobiernofederal/home.action">PNT</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" target="_blank" href="https://home.inai.org.mx/">INAI</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <h6 className="simi-gob-mx-title">¿Qu&eacute; es gob.mx?</h6>
                        <p>Es el portal &uacute;nico de tr&aacute;mites, informaci&oacute;n y participaci&oacute;n ciudadana.<a className="tw-text-white" href="https://www.gob.mx/que-es-gobmx" target="_blank">&nbsp;Leer m&aacute;s</a></p>
                        <h6 className="simi-gob-mx-title">Temas</h6>
                        <ul className="tw-p-0">
                            <li className="tw-list-none">
                                <a className="tw-text-white" href="https://www.gob.mx/accesibilidad" target="_blank">Declaración de accesibilidad</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" href="https://www.gob.mx/aviso_de_privacidad" target="_blank">Aviso de privacidad integral</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" href="https://www.gob.mx/privacidadsimplificado" target="_blank">Aviso de privacidad simplificado</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" href="https://www.gob.mx/terminos" target="_blank">Términos y condiciones</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" href="https://www.gob.mx/terminos#medidas-seguridad-informacion" target="_blank">Política de seguridad</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" href="http://www.ordenjuridico.gob.mx/#gsc.tab=0" target="_blank">Marco jurídico</a>
                            </li>
                            <li className="tw-list-none">
                                <a className="tw-text-white" href="https://www.gob.mx/sitemap" target="_blank">Mapa de sitio</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <h6 className="simi-gob-mx-title">Contacto</h6>
                        <p className="">Dudas e información a <a className="tw-text-white tw-break-words" href="mailto:controlgestion@sedatu.gob.mx">controlgestion@sedatu.gob.mx</a></p>
                        <h6>Síguenos en</h6>
                        <a href="https://www.facebook.com/gobmexico" className="tw-mr-2" target="_blank">
                            <img src="/images/facebook.svg" alt="facebook"/>
                        </a>
                        <a href="https://twitter.com/GobiernoMX" target="_blank">
                            <img src="/images/twitter.svg" alt="twitter" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="container-fluid stick-footer">

            </div>
        </footer>
    )
}
