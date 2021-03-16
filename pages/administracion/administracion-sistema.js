import Link from 'next/link'

export default function administracionSistema() {
    return(
        <>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <Link href="/administracion/autorizacion-usuarios">
                        <a>Autorización de usuarios</a>
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
}