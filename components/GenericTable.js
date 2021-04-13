import React, { useState } from 'react'

export default function GenericTable(props) {

    const tabular = props
    const [refrescaTabular, setRefrescaTabular] = useState(0)

    return (
        <>
            {
                (tabular.table.data && tabular.table.data.length > 0)
                ?
                    <table className="tw-w-full table-hover">
                        <thead className="tw-bg-titulo" >
                            <tr>
                            {
                                Object.keys(tabular.table.data[0]).map((header, index) => (
                                    <th className="tw-px-2 tw-text-white text-center" key={index}>{header}</th>
                                ))
                            }
                            </tr>
                        </thead>
                        <tbody>
                            {
                            tabular.table.data.map((item, index) => (
                                <tr key={index}>
                                {
                                    Object.keys(tabular.table.data[0]).map((item2, index2) => (
                                        <td className={
                                            item[item2].constructor.name === "String" ?
                                            "border-bottom border-green-600" :
                                            "border-bottom border-green-600 text-right"
                                        } key={index2}>{item[item2]}</td>
                                    ))
                                }
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                :
                    <h4>
                        No se encontr&oacute; informaci&oacute;n
                    </h4>
            }
        </>
    )
}