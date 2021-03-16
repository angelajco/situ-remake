export default function Footer() {
    return (
        <footer className="tw-bg-inst-verdef tw-text-white">
            <div className="container tw-py-12 tw-flex tw-justify-between tw-flex-wrap">
                <div className="tw-w-3/12 sm:tw-w-full">Logo</div>
                <div className="tw-w-3/12 sm:tw-w-full">
                    <p className="tw-font-semibold tw-text-2xl">Enlaces</p>
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
                <div className="tw-w-3/12 sm:tw-w-full">
                    <p className="tw-font-semibold tw-text-2xl">¿Qué es gob.mx?</p>
                    <p className="tw-font-semibold">Es el portal único de trámites, información y participación ciudadana.<a className="tw-text-white" href="https://www.gob.mx/que-es-gobmx" target="_blank">&nbsp;Leer más</a></p>
                    <ul className="tw-p-0">
                        <li className="tw-list-none tw-font-semibold tw-text-xl">Temas</li>
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
                <div className="tw-w-3/12 sm:tw-w-full">
                    <p className="tw-font-semibold tw-text-2xl">Contacto</p>
                    <p className="">Dudas e información a <a className="tw-text-white tw-break-words" href="mailto:controlgestion@sedatu.gob.mx">controlgestion@sedatu.gob.mx</a></p>
                    <p className="tw-font-semibold tw-text-2xl">Síguenos en</p>
                    <a href="https://www.facebook.com/gobmexico" className="tw-mr-2" target="_blank">
                        <img src="/images/facebook.svg" alt="facebook"/>
                    </a>
                    <a href="https://twitter.com/GobiernoMX" target="_blank">
                        <img src="/images/twitter.svg" alt="twitter" />
                    </a>
                </div>
            </div>
        </footer>
    )
}
