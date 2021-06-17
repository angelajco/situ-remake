import React, { useState } from 'react'

export default function GenericTable(props) {

    const tabular = props
    const [dinamicData, setDinamicData] = useState(tabular.table.data);
    const [placeholder, setPlaceholder] = useState();
    const [dragged, setDragged] = useState();

    function onDrag(event) {
        console.log('onDrag: ', event)
        setPlaceholder(document.createElement('li'))
        setDragged(event.currentTarget);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', dragged);
    }

    function onDrop(event) {
        console.log('onDrop.event: ', event)
        dragged.style.display = 'block';
        dragged.parentNode.removeChild(placeholder); //TODO aquí
        
        // update state
        var data = dinamicData;
        var from = Number(dragged.dataset.id);
        var to = Number(event.over.dataset.id);
        if(from < to) to--;
        data.splice(to, 0, data.splice(from, 1)[0]);
        setDinamicData(data);
    }

    function onDragOver(event) {
        console.log('onDragOver: ', event)
        event.preventDefault();
        dragged.style.display = "none";
        if(event.target.className === 'placeholder') return;
        event.over = event.target;
        event.target.parentNode.insertBefore(placeholder, event.target);
    }

    return (
        <>
            {
                (dinamicData && dinamicData.length > 0)
                ?
                    <div className="row mx-0 mb-2">
                        {/* <div className="row">
                            <ul id='list-columns' onDragOver={(event) => onDragOver(event)}>
                                {
                                    Object.keys(dinamicData[0]).map((element, index) => (
                                        <li key={index}
                                            draggable='true'
                                            onDragEnd={(event) => onDrop(event)}
                                            onDragStart={(event) => onDrag(event)}>
                                            {element}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div> */}
                        <div className="row table-responsive mx-0">
                            <table className="tw-w-full table-hover">
                                <thead className="tw-bg-titulo" >
                                    <tr>
                                        <th className="tw-px-2 tw-text-white" colSpan={Object.keys(dinamicData[0]).length}>{tabular.table.title}</th>
                                    </tr>
                                    <tr>
                                    {
                                        Object.keys(dinamicData[0]).map((header, index) => (
                                            <th className="tw-px-2 tw-text-white text-center" key={index}>{header}</th>
                                        ))
                                    }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    dinamicData.map((item, index) => (
                                        <tr key={index}>
                                        {
                                            Object.keys(dinamicData[0]).map((item2, index2) => (
                                                <td className={
                                                    item[item2].constructor.name === "String" ?
                                                    "border-bottom border-green-600" :
                                                    "border-bottom border-green-600 text-right"
                                                } key={index2}>{item[item2].constructor.name === "String" ?
                                                    item[item2] :
                                                    new Intl.NumberFormat('en-US').format(item[item2])}
                                                </td>
                                            ))
                                        }
                                        </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                :
                    <h4>
                        No se encontr&oacute; informaci&oacute;n
                    </h4>
            }
        </>
    )
}