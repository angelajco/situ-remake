import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faAlignJustify, faAlignLeft, faFileCsv, faFilePdf, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { Button, Form, OverlayTrigger, Tooltip, Tab, Row, Col, Nav } from 'react-bootstrap'
import { CSVLink } from "react-csv";
import { DragDropContext, Droppable, Draggable as DraggableDnd, resetServerContext } from 'react-beautiful-dnd';

// import * as toPdf from '@react-pdf/renderer';
import * as htmlToImage from 'html-to-image';

import Loader from '../Loader'

export default function GenericTable(props) {

    const [tabular, setTabular] = useState(props);
    const [dinamicData, setDinamicData] = useState();
    const [spaceData, setSpaceData] = useState();
    const [csvData, setCsvData] = useState([]);
    const [csvFileName, setCsvFileName] = useState('');
    const [isHiddenTools, setHiddenTools] = useState(true);
    // const [pdfDocument, setPdfDocument] = useState(<toPdf.Document></toPdf.Document>);
    const [isLoading, setIsLoading] = useState(false);

    // const styles = toPdf.StyleSheet.create({
    //     page: {
    //         // flexDirection: 'row',
    //         backgroundColor: '#FFFFFF'
    //     },
    //     section: {
    //         margin: 10,
    //         padding: 10,
    //         flexGrow: 1
    //     }
    // });

    resetServerContext();
    
    function handleOnDragEnd(result) {
        if (!result.destination) {
            return
        }
        let tmpObject = {
            nombreTabla: dinamicData.nombreTabla,
            columnas: dinamicData.columnas,
            datos: dinamicData.datos
        };
        let items = Array.from(tmpObject.columnas);
        let [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        tmpObject.columnas = items;
        setDinamicData(tmpObject);
    }
    
    function handleOnDragEndSpaceData(result) {
        if (!result.destination) {
            return
        }
        let tmpObject = {
            nombreTabla: spaceData.nombreTabla,
            columnas: spaceData.columnas,
            datos: spaceData.datos
        };
        let items = Array.from(tmpObject.columnas);
        let [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        tmpObject.columnas = items;
        setSpaceData(tmpObject);
    }

    function addToExportWithPivot_(rasgosObtenidos) {
        generateFileName(function () {
            let csvData_ = [];
            let csvContent = [];
            if (rasgosObtenidos[0]) {
                csvData_.push(Object.keys(rasgosObtenidos[0]))
                rasgosObtenidos.map(rasgo => {
                    csvContent = [];
                    Object.keys(rasgo).map(item => {
                        csvContent.push(rasgo[item]);
                    })
                    csvData_.push(csvContent);
                });
                setCsvData(csvData_);
            }
        });
    }

    function addToExportWithPivot(rasgosObtenidos) {
        generateFileName(function () {
            let csvData_ = [];
            let csvContent = [];
            let csvHeaders = [];
            rasgosObtenidos.columnas.filter(columna => columna[2] == true).map(header => {
                csvHeaders.push(header[1]);
            });
            csvData_.push(csvHeaders);
            if(rasgosObtenidos && rasgosObtenidos.datos && rasgosObtenidos.datos !== null) {
                rasgosObtenidos.datos.map((data) => {
                    csvContent = [];
                    rasgosObtenidos.columnas.filter(columna => columna[2] == true).map((column) => {
                        csvContent.push(data[column[3]]);
                    });
                    csvData_.push(csvContent);
                });
            }
            setCsvData(csvData_);
        });
    }

    function generateFileName(success) {
        let f = new Date();
        let fileName = '';
        fileName = `${tabular.table.title}-`;
        fileName += (f.getDate() < 10 ? '0' : '') + f.getDate() + (f.getMonth() < 10 ? '0' : '') + (f.getMonth() + 1) + f.getFullYear() + f.getHours() + f.getMinutes() + f.getSeconds();
        setCsvFileName(fileName);
        success();
    }

    // function generatePdf() {
    //     var node = document.getElementById(`table-estatitistics-${tabular.index}`);
    //     htmlToImage.toPng(node).then(function (dataUrl) {
    //         setPdfDocument(
    //             <toPdf.Document>
    //                 <toPdf.Page size="A4" style={styles.page} wrap>
    //                     <toPdf.View style={styles.section}>
    //                         <toPdf.Text>{tabular.table.title}</toPdf.Text>
    //                         <toPdf.Image src={dataUrl} />
    //                     </toPdf.View>
    //                 </toPdf.Page>
    //             </toPdf.Document>
    //         );
    //     }).catch(function (error) {
    //         console.log('errorPdfImage: ', error);
    //         // setDatosModalAnalisis({
    //         //     title: '¡Error!',
    //         //     body: 'No se pudó generar el contenido del PDF (mapa)',
    //         // });
    //         // setShowModalAnalisis(true)
    //     });
    // }

    function renderTools() {
        setIsLoading(true);
        // props.showMap(false);
        generateFiles(function() {
            setHiddenTools(!isHiddenTools);
            setIsLoading(false);
        });
    }
    
    function generateFiles(success) {
        setDinamicData(dinamicData);
        addToExportWithPivot(dinamicData);
        // generatePdf();
        success();
    }

    function columnsSelected(index) {
        let tmpObject = {
            nombreTabla: dinamicData.nombreTabla,
            columnas: dinamicData.columnas,
            datos: dinamicData.datos
        };
        let tmparray = [];
        tmpObject.columnas.map(column => {
            if(column[3] == index)
                column[2] = !column[2];
            tmparray.push(column);
        });
        tmpObject.columnas = tmparray;
        setDinamicData(tmpObject);
    }

    function columnsSelectedTospacePresentation(index) {
        let tmpObject = {
            nombreTabla: spaceData.nombreTabla,
            columnas: spaceData.columnas,
            datos: spaceData.datos
        };
        let tmparray = [];
        tmpObject.columnas.map(column => {
            if(column[3] == index)
                column[2] = !column[2];
            tmparray.push(column);
        });
        tmpObject.columnas = tmparray;
        setSpaceData(tmpObject);
    }

    function showColumns(show) {
        let tmpObject = {
            nombreTabla: dinamicData.nombreTabla,
            columnas: dinamicData.columnas,
            datos: dinamicData.datos
        };
        let tmparray = [];
        tmpObject.columnas.map(column => {
            column[2] = show;
            tmparray.push(column);
        });
        tmpObject.columnas = tmparray;
        setDinamicData(tmpObject);
    }

    function showColumnsTospacePresentation(show) {
        let tmpObject = {
            nombreTabla: spaceData.nombreTabla,
            columnas: spaceData.columnas,
            datos: spaceData.datos
        };
        let tmparray = [];
        tmpObject.columnas.map(column => {
            column[2] = show;
            tmparray.push(column);
        });
        tmpObject.columnas = tmparray;
        setSpaceData(tmpObject);
    }

    function reloadTable() {
        let tmpObject = {
            nombreTabla: dinamicData.nombreTabla,
            columnas: tabular.table.data.columnas,
            datos: dinamicData.datos
        };
        let tmparray = [];
        tmpObject.columnas.map(column => {
            column[2] = true;
            tmparray.push(column);
        });
        tmpObject.columnas = tmparray;
        setDinamicData(tmpObject);
    }
    
    
    useEffect(() => {
        var tmpObject = {
            nombreTabla: '',
            columnas: [],
            datos: []
        };
        if(tabular.table.data.columnas) {
            tabular.table.data.columnas.map((column, index) => {
                column.push(true);
                column.push(index);
                tmpObject.columnas.push(column);
            });
        }
        tmpObject.datos = tabular.table.data.datos;
        tmpObject.nombreTabla = tabular.table.data.nombreTabla;
        setDinamicData(tmpObject);
    }, [tabular]);

    useEffect(() => {
        if(dinamicData && dinamicData.datos && dinamicData.columnas) {
            generateFiles(function() {
                var headers = [];
                var row = [];
                var data_ = [];
                dinamicData.columnas.filter(columna => columna[2] == true).map((header) => {
                    header[2] = true;
                    headers.push(header);
                });
                dinamicData.datos.map(data => {
                    row = [];
                    dinamicData.columnas.filter(columna => columna[2] == true).map(header => {
                        row.push(data[header[3]]);
                    });
                    data_.push(row);
                });
                setSpaceData({nombreTabla: dinamicData.nombreTabla, columnas: headers, datos: data_})
            });
        }
    }, [dinamicData]);

    return (
        <>
            {
                isLoading ?
                    <Loader/> :
                    ''
            }
            {
                dinamicData && dinamicData.datos && dinamicData.datos.length > 0 &&
                    <div className="row mx-0 mb-2">
                        <div className="row mx-0 mb-2">
                            <div className="col-12">
                                <b className="w-100">
                                    {tabular.table.title}
                                </b>
                            </div>
                            <div className="col-9"/>
                            <div className="col-1">
                                <OverlayTrigger overlay={<Tooltip>Herramientas de tabular</Tooltip>}>
                                    <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer"
                                        onClick={() => renderTools()}
                                        icon={faCogs} />
                                </OverlayTrigger>
                            </div>
                            <div className="col-1">
                                <OverlayTrigger overlay={<Tooltip>Opción 1</Tooltip>}>
                                    <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer"
                                        // onClick={() => setEditMapName(false)}
                                        icon={faAlignJustify} />
                                </OverlayTrigger>
                            </div>
                            <div className="col-1">
                                <OverlayTrigger overlay={<Tooltip>Opción 2</Tooltip>}>
                                    <FontAwesomeIcon className="tw-ml-4 tw-cursor-pointer"
                                        // onClick={() => setEditMapName(false)}
                                        icon={faAlignLeft} />
                                </OverlayTrigger>
                            </div>
                            <div className="col-12" hidden={isHiddenTools}>
                                <Tab.Container id="left-tabs" defaultActiveKey="1">
                                    <Row>
                                        <Col sm={3}>
                                            <Nav variant="pills" className="flex-column">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="1">Descarga</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="2">Presentaci&oacute;n tabular</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="3">Presentaci&oacute;n espacial</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Col>
                                        <Col sm={9} className="custom-content-tabs">
                                            <Tab.Content>
                                                <Tab.Pane eventKey="1">
                                                    <div className="row my-3">
                                                        <div className="col-6 text-center">
                                                            <OverlayTrigger overlay={<Tooltip>Exportar CSV</Tooltip>}>
                                                                <CSVLink className="tw-text-titulo tw-font-bold tw-cursor-pointer" data={csvData} filename={`${csvFileName}-${tabular.index}.csv`}>
                                                                    <FontAwesomeIcon size="4x" icon={faFileCsv} />
                                                                </CSVLink>
                                                            </OverlayTrigger>
                                                        </div>
                                                        {/* <div className="col-6 text-center">
                                                            <OverlayTrigger overlay={<Tooltip>Exportar PDF</Tooltip>}>
                                                                <toPdf.PDFDownloadLink id="download-pdf" document={pdfDocument} fileName={`${csvFileName}-${tabular.index}.pdf`}>
                                                                    {
                                                                        ({ blob, url, loading, error }) =>
                                                                            loading ?
                                                                                <FontAwesomeIcon className="tw-text-titulo" size="4x" icon={faFilePdf} /> :
                                                                                <FontAwesomeIcon className="tw-text-titulo" size="4x" icon={faFilePdf} />
                                                                    }
                                                                </toPdf.PDFDownloadLink>
                                                            </OverlayTrigger>
                                                        </div> */}
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="2">
                                                    <div className="row">
                                                        <div className="row mx-auto my-2">
                                                            <div className="col-12 tw-p-0 text-center">
                                                                <button className="btn-analisis"
                                                                    onClick={() => reloadTable()}
                                                                    >Reestablecer tabla</button>
                                                            </div>
                                                            <div className="col-12 tw-p-0">
                                                                <p className="text-center m-0">Mostrar:</p>
                                                            </div>
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0 text-center">
                                                                <button className="btn-analisis"
                                                                    onClick={() => showColumns(true)}
                                                                    >Todos</button>
                                                            </div>
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0 text-center">
                                                                <button className="btn-analisis"
                                                                    onClick={() => showColumns(false)}
                                                                    >Ninguna</button>
                                                            </div>
                                                        </div>
                                                        <DragDropContext onDragEnd={handleOnDragEnd}>
                                                            <Droppable droppableId="columns">
                                                                {(provided) => (
                                                                    <div className="row mx-auto columns-container" {...provided.droppableProps} ref={provided.innerRef}>
                                                                        {
                                                                            dinamicData.columnas.map((column, index) => (
                                                                                <DraggableDnd key={index} draggableId={column[0]} index={index}>
                                                                                    {(provided) => (
                                                                                        <div className="row mx-3" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                                            <Form.Check key={index} custom type="checkbox" className="mb-12" onChange={(event) => columnsSelected(event.target.value)}
                                                                                                checked={column[2]} value={column[3]} label={column[1]} id={`dinamic-column-${column[3]}`}/>
                                                                                        </div>
                                                                                    )}
                                                                                </DraggableDnd>
                                                                            ))
                                                                        }
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </DragDropContext>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="3">
                                                    <div className="row">
                                                        <div className="row mx-auto my-2">
                                                            <div className="col-12 tw-p-0 text-center">
                                                                <button className="btn-analisis"
                                                                    onClick={() => props.showMap(true, spaceData)}
                                                                    >Aplicar</button>
                                                            </div>
                                                            <div className="col-12 tw-p-0">
                                                                <p className="text-center m-0">Mostrar:</p>
                                                            </div>
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0 text-center">
                                                                <button className="btn-analisis"
                                                                    onClick={() => showColumnsTospacePresentation(true)}
                                                                    >Todos</button>
                                                            </div>
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 tw-p-0 text-center">
                                                                <button className="btn-analisis"
                                                                    onClick={() => showColumnsTospacePresentation(false)}
                                                                    >Ninguna</button>
                                                            </div>
                                                        </div>
                                                        <div className="row mx-auto columns-container">
                                                            {
                                                                spaceData &&
                                                                spaceData.columnas.map((column, index) => (
                                                                    <div key={index} className="row mx-3">
                                                                        <Form.Check key={index} custom type="checkbox" className="mb-12" onChange={(event) => columnsSelectedTospacePresentation(event.target.value)}
                                                                            checked={column[2]} value={column[3]} label={column[1]} id={`space-column-${column[3]}`}/>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </div>
                        </div>
                        <div className="row table-responsive mx-0 mb-5" style={{maxHeight: 250}}>
                            <table id={`table-estatitistics-${tabular.index}`} className="tw-w-full table-hover">
                                <thead className="tw-bg-titulo" >
                                    <tr>
                                    {
                                        dinamicData.columnas.filter(columna => columna[2] == true).map((header, index) => (
                                            <th className="tw-px-2 tw-text-white text-center" key={index}>
                                                {
                                                    header[1]
                                                }
                                            </th>
                                        ))
                                    }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dinamicData.datos.map((data, index) => (
                                            <tr key={index}>
                                                {
                                                    dinamicData.columnas.filter(columna => columna[2] == true).map((column, index_) => (
                                                        <td className={
                                                            (data[column[3]] !== null ? data[column[3]].constructor.name === "String" : true) ?
                                                            "border-bottom border-green-600" :
                                                            "border-bottom border-green-600 text-right"
                                                        } key={index_}>{(data[column[3]] !== null ? data[column[3]].constructor.name === "String" : true) ?
                                                            data[column[3]] :
                                                            new Intl.NumberFormat('en-US').format(data[column[3]])}
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
            }
        </>
    )
}