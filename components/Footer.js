export default function Footer() {
    return (
    <footer className="tw-bg-inst-verde-fuerte tw-text-white">
        <div className="container tw-py-12 tw-flex tw-justify-between tw-flex-wrap">
                <div className="tw-w-3/12 md:tw-w-full">Logo</div>
                <div className="tw-w-3/12 md:tw-w-full">
                    <p className="tw-font-semibold tw-text-2xl">Enlaces</p>
                    <ul className="tw-p-0">
                        <li className="tw-list-none">Participa</li>
                        <li className="tw-list-none">Datos</li>
                        <li className="tw-list-none">Publicaciones oficiales</li>
                        <li className="tw-list-none">Portal de obligaciones de transparencia</li>
                        <li className="tw-list-none">PNT</li>
                        <li className="tw-list-none">INAI</li>
                    </ul>
                </div>
                <div className="tw-w-3/12 md:tw-w-full">
                    <p className="tw-font-semibold tw-text-2xl">¿Qué es gob.mx?</p>
                    <p className="tw-font-semibold">Es el portal único de trámites, información y participación ciudadana. Leer más</p>
                    <ul className="tw-p-0">
                        <li className="tw-list-none tw-font-semibold tw-text-xl">Temas</li>
                        <li className="tw-list-none">Declaración de accesibilidad</li>
                        <li className="tw-list-none">Aviso de privacidad integral</li>
                        <li className="tw-list-none">Aviso de privacidad simplificado</li>
                        <li className="tw-list-none">Términos y condiciones</li>
                        <li className="tw-list-none">Política de seguridad</li>
                        <li className="tw-list-none">Marco jurídico</li>
                        <li className="tw-list-none">Mapa de sitio</li>
                    </ul>
                </div>
                <div className="tw-w-3/12 md:tw-w-full">
                    <p className="tw-font-semibold tw-text-2xl">Contacto</p>
                    <p className="">Dudas e información a controlgestion@sedatu.gob.mx</p>
                    <p className="tw-font-semibold tw-text-2xl">Síguenos en</p>
                </div>
            </div>
    </footer>
    )
}
