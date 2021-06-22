import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faAlignJustify, faAlignLeft, faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Card, Form, Modal, OverlayTrigger, Tooltip, Tab, Row, Col, Nav } from 'react-bootstrap'
import { CSVLink } from "react-csv";

import * as toPdf from '@react-pdf/renderer';
import * as htmlToImage from 'html-to-image';

import Loader from '../Loader'

export default function GenericTable(props) {

    const tabular = props
    const [dinamicData, setDinamicData] = useState(tabular.table.data);
    const [placeholder, setPlaceholder] = useState();
    const [dragged, setDragged] = useState();
    const [csvData, setCsvData] = useState([]);
    const [csvFileName, setCsvFileName] = useState('');
    const [isHiddenTools, setHiddenTools] = useState(true);
    const [pdfDocument, setPdfDocument] = useState(<toPdf.Document></toPdf.Document>);
    const [isLoading, setIsLoading] = useState(false);

    const styles = toPdf.StyleSheet.create({
        page: {
            // flexDirection: 'row',
            backgroundColor: '#FFFFFF'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

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

    function addToExportWithPivot(rasgosObtenidos) {
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

    function generateFileName(success) {
        let f = new Date();
        let fileName = '';
        fileName = `${tabular.table.title}-`;
        fileName += (f.getDate() < 10 ? '0' : '') + f.getDate() + (f.getMonth() < 10 ? '0' : '') + (f.getMonth() + 1) + f.getFullYear() + f.getHours() + f.getMinutes() + f.getSeconds();
        setCsvFileName(fileName);
        success();
    }

    function generatePdf() {
        var node = document.getElementById(`table-estatitistics-${tabular.index}`);
        htmlToImage.toPng(node).then(function (dataUrl) {
            setPdfDocument(
                <toPdf.Document>
                    <toPdf.Page size="A4" style={styles.page} wrap>
                        <toPdf.View style={styles.section}>
                            <toPdf.Text>{tabular.table.title}</toPdf.Text>
                            <toPdf.Image src={dataUrl} />
                        </toPdf.View>
                    </toPdf.Page>
                </toPdf.Document>
            );
        }).catch(function (error) {
            console.log('errorPdfImage: ', error);
            // setDatosModalAnalisis({
            //     title: '¡Error!',
            //     body: 'No se pudó generar el contenido del PDF (mapa)',
            // });
            // setShowModalAnalisis(true)
        });
    }

    function renderTools() {
        setIsLoading(true);
        generateFiles(function() {
            setHiddenTools(!isHiddenTools);
            setIsLoading(false);
        });
    }
    
    function generateFiles(success) {
        setDinamicData(dinamicData);
        addToExportWithPivot(dinamicData);
        generatePdf();
        success();
    }

    return (
        <>
            {
                isLoading ?
                    <Loader/> :
                    ''
            }
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
                                                        <div className="col-6 text-center">
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
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="2">
                                                    pane 2
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
                                    {/* <tr>
                                        <th className="tw-px-2 tw-text-white" colSpan={Object.keys(dinamicData[0]).length}>{tabular.table.title}</th>
                                    </tr> */}
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