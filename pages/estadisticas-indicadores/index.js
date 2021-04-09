import GenericChart from '../../components/GenericChart';

export default function index() {
    
    const content = [
        {
            tipo: "barra",
            datos: [
                {
                    name: "Estatales",
                    value: 54.7,
                    representation: "percentage"
                }
            ]
        },
        {
            tipo: "barra",
            datos: [
                {
                    name: "Municipales",
                    value: 17,
                    representation: "percentage"
                }
            ]
        }
    ];

    return (
        <>
            <section className="container-fluid custom-max-width custom-mx-b-1">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Poblaci&oacute;n
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h6 className="text-center">
                                100'000,000
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Mujeres
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h6 className="text-center">
                                52'000,000
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-inst-dorado">
                                Hombres
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-amounts">
                            <h6 className="text-center">
                                48'000,000
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-titulo">
                                Marginaci&oacute;n
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-leves">
                            <h6>
                                MEDIA
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                        <div className="row justify-content-center tw-mx-1">
                            <h4 className="tw-text-titulo">
                                Rezago social
                            </h4>
                        </div>
                        <div className="row justify-content-center tw-mx-1 main-statics-leves">
                            <h6>
                                MEDIO
                            </h6>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <GenericChart chart = {content[0]} />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 custom-mx-t-1">
                                <div className="row justify-content-center tw-mx-1">
                                    <GenericChart chart = {content[1]} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="row justify-content-center custom-mx-t-1">
                            <h4>
                                Tabular
                            </h4>
                        </div>
                        <div className="row custom-mx-t-1">
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="row justify-content-center tw-mx-1">
                                    <h6>
                                        Combo columna gr&aacute;fica
                                    </h6>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="row justify-content-center tw-mx-1">
                                    <h6>
                                        Combo tipo gr&aacute;fica
                                    </h6>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="row justify-content-center tw-mx-1">
                                    <h6>
                                        Combo columna mapa
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center custom-mx-t-1">
                            <h4>
                                Gr&aacute;fica
                            </h4>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                        <div className="row justify-content-center custom-mx-t-1">
                            <h4>
                                Mapa
                            </h4>
                        </div>
                        <div className="row justify-content-center custom-mx-t-1">
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                <h6 className="text-center">
                                    Descarga CSV
                                </h6>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                <h6 className="text-center">
                                    Descarga PDF
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}