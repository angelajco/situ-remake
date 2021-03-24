import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
    return (
        <div className="container-fluid tw-bg-inst-verdef tw-py-4">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-flex">
                        <img src="/images/escudo_1.png"></img>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-flex tw-justify-end">
                        <div className="tw-mr-3">
                            <a href="https://www.gob.mx/tramites" target="_blank" className="tw-text-white tw-text-lg hover:tw-text-inst-dorado hover:tw-no-underline">Trámites</a>
                        </div>
                        <div className="tw-mr-3">
                            <a href="https://www.gob.mx/gobierno" target="_blank" className="tw-text-white tw-text-lg hover:tw-text-inst-dorado hover:tw-no-underline">Gobierno</a>
                        </div>
                        <div>
                            <a href="https://www.gob.mx/busqueda?utf8=%E2%9C%93" target="_blank" className="tw-text-white">
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}