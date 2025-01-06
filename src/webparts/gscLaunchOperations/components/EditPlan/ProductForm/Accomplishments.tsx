import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import DataGrid, {
    Column, Paging, Pager,
    Toolbar, Item, ColumnFixing
} from 'devextreme-react/data-grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";

import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import AttachmentCellTemplate from './AttachmentCellTemplate';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Row, Col } from 'reactstrap';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { DataService } from '../../Shared/DataService';

import './ProductPages.css';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';
import { ConfirmDialog } from 'primereact/confirmdialog';

import viewIcon from '../../../../assets/images/view.png';
import editIcon from '../../../../assets/images/edit.png';
import deleteIcon from '../../../../assets/images/delete.png';
import plusNew from '../../../../assets/images/plusNew.png';


export default function Accomplishments(props) {
    const pageSizes = [10, 25, 50, 100, 'all'];
    let accomplishmentIndex = useRef(props.index);
    let accomplishmentMode = useRef('Create');
    const accomplishmentGridDataRef = useRef([]);
    let activeAccomplishmentRef = useRef({});
    let activeIndex = useRef(null);
    let deleteAccomRef = useRef(null);

    const [isChecked, setIsChecked] = useState(true);
    const [accomplishmentGridData, setaccomplishmentGridData] = useState([]);
    const [showAccomplishmentDialog, setShowAccomplishmentDialog] = useState(false);
    const [deleteAccomDialog, setDeleteAccomDialog] = useState(false);
    const [LoadCnt, setLoadCnt] = useState(0);
    const [isAccomEmpty, setIsAccomEmpty] = useState(false);
    const [cnfrmSaveDialog, setCnfrmSaveDialog] = useState(false);
    const [count, setRenderCount] = useState(0);
    const [IsModified, setIsModified] = useState(false);

    const updateActiveAccomplishment = (data) => {
        console.log('new button clicked');
        try {
            if (accomplishmentMode.current != 'Create') {
                activeAccomplishmentRef.current['Date'] =
                    data['Date'] ? new Date(data['Date']) : null;
                activeAccomplishmentRef.current['Task'] = data['Task'];
                activeAccomplishmentRef.current['Active'] = data['Active'];
                activeAccomplishmentRef.current['Id'] = data['Id'];
                activeAccomplishmentRef.current['AttachmentData'] = data['AttachmentData'];
                activeAccomplishmentRef.current['NewAttachmentData'] = data['NewAttachmentData'];
                activeAccomplishmentRef.current['DeletedAttachmentData'] = data['DeletedAttachmentData'] ? data['DeletedAttachmentData'] : [];

                if (data['AttachmentData']) {
                    activeAccomplishmentRef.current['AttachmentURL'] =
                        data['AttachmentData']?.['ServerRelativeUrl'] ?
                            props.attachURL + data['AttachmentData']?.['ServerRelativeUrl'] :
                            data['AttachmentData']?.['objectURL'];
                    activeAccomplishmentRef.current['AttachmentName'] =
                        data['AttachmentData']?.['FileName'] ? data['AttachmentData']?.['FileName'] :
                            data['AttachmentData']?.['name'];
                    activeAccomplishmentRef.current['AttachmentData'] = data['AttachmentData'];
                    activeAccomplishmentRef.current['NewAttachmentData'] = data['NewAttachmentData'];
                    //activeAccomplishmentRef.current['DeletedAttachmentData'] = activeAccomplishmentRef.current['DeletedAttachmentData'] ? activeAccomplishmentRef.current['DeletedAttachmentData'] : [];
                }
            }
            if (accomplishmentMode.current == 'Create') {
                activeAccomplishmentRef.current['Active'] = true;
            }
            setShowAccomplishmentDialog(true);
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-updateActiveAccomplishment',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const deleteAccomLocal = () => {
        try {
            let accomtoDelete = deleteAccomRef.current;
            let localAccom = [...accomplishmentGridData];
            if (accomtoDelete['rowID']) {
                localAccom?.map(rec => {
                    if (rec.index == accomtoDelete?.['index']) {
                        rec['IsDeleted'] = true;
                        rec['IsModified'] = true;
                    }
                });
            } else {
                localAccom = localAccom.filter(record => record.index != accomtoDelete['index']);
            }

            setaccomplishmentGridData(localAccom);
            accomplishmentGridDataRef.current = localAccom;
            setDeleteAccomDialog(false);

        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-deleteAccomLocal',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const hideAccomplishmentDialog = () => {
        try {
            activeAccomplishmentRef.current = {};
            accomplishmentMode.current = null;
            setShowAccomplishmentDialog(false);
            setIsAccomEmpty(false);
            setIsModified(false);
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-hideAccomplishmentDialog',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const hideDeleteAccomDialog = () => {
        try {
            setDeleteAccomDialog(false);
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-hideDeleteAccomDialog',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const checkForSaveBeforeClose = () => {
        try {
            if ((accomplishmentMode.current == 'Create' && Object.keys(activeAccomplishmentRef.current).length >= 2) || (accomplishmentMode.current === 'Edit' && IsModified)) {
                setCnfrmSaveDialog(true);
                // return <CancelConfirmationDialog saveChanges={saveAccomplishmentLocal} discardChanges={hideAccomplishmentDialog} />;
            } else {
                hideAccomplishmentDialog();
            }
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-checkForSaveBeforeClose',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const updateInputValue = (internalName, value) => {
        try {
            if (internalName == 'NewAttachmentData') setLoadCnt(prevState => prevState + 1);
            activeAccomplishmentRef.current[internalName] = value;

            if (internalName == 'NewAttachmentData') setTimeout(() => setLoadCnt(prevState => prevState - 1), 800);

            setRenderCount(prevState => 1 + prevState);
            // setTimeout(() => setLoadCnt(prevState => prevState - 1), 400);
            setIsModified(true);

        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-updateInputValue',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const saveAccomplishmentLocal = () => {
        try {
            if (activeAccomplishmentRef.current['Task']) {
                let localAccomplishmentGridData = [...accomplishmentGridData];
                if (accomplishmentMode.current == 'Create') {
                    let activeAccomplishmentData = activeAccomplishmentRef.current;
                    activeAccomplishmentData['index'] = accomplishmentIndex.current;
                    activeAccomplishmentData['IsModified'] = true;
                    localAccomplishmentGridData.unshift(activeAccomplishmentData);
                    accomplishmentIndex.current = 1 + accomplishmentIndex.current;
                }
                if (accomplishmentMode.current == 'Edit') {
                    localAccomplishmentGridData?.map(item => {
                        if (item['index'] == activeIndex.current) {
                            item['Date'] = activeAccomplishmentRef.current['Date'] ? activeAccomplishmentRef.current['Date'] : null;
                            item['Task'] = activeAccomplishmentRef.current['Task'];
                            item['Active'] = activeAccomplishmentRef.current['Active'];
                            item['AttachmentData'] = activeAccomplishmentRef.current['AttachmentData'];
                            item['DeletedAttachmentData'] = activeAccomplishmentRef.current['DeletedAttachmentData'];
                            item['NewAttachmentData'] = activeAccomplishmentRef.current['NewAttachmentData'];
                            item['IsModified'] = true;
                        }
                    });

                }
                accomplishmentGridDataRef.current = localAccomplishmentGridData;
                setaccomplishmentGridData(localAccomplishmentGridData);
                hideAccomplishmentDialog();
            } else {
                setIsAccomEmpty(true);
            }
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-saveAccomplishmentLocal',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const headerIcons = () => {
        try {
            return (
                <div className='p-dialog-titlebar-icon p-link'>
                    <Button className='p-button-rounded toggleBtn' >
                        <InputSwitch checked={activeAccomplishmentRef.current['Active']} onChange={e => updateInputValue('Active', e.value)} disabled={accomplishmentMode.current == 'View'} />
                        <span className='toggleBtnTxt toggleBtnTxt2' style={{ color: "white" }}>Active</span>
                    </Button>
                    {
                        accomplishmentMode.current != 'View' &&
                        <Button
                            className='p-button-raised p-button-rounded okBtn'
                            onClick={saveAccomplishmentLocal}
                            icon='dx-icon-check'
                            label='Ok' />
                    }
                    <Button
                        className='p-button-raised p-button-rounded closeBtn'
                        onClick={checkForSaveBeforeClose}
                        icon='dx-icon-close'
                        label='Cancel' />
                </div>
            );
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-headerIcons',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const actionTemplate = (rowData) => {
        try {
            return (
                <>
                    <img
                        alt="Card"
                        src={viewIcon}
                        onClick={e => {
                            accomplishmentMode.current = 'View';
                            updateActiveAccomplishment(rowData.data);
                        }} />
                    {(props.ParentMode != 'View' && props.selectedprojectName != 'All') &&
                        <>
                            <img
                                alt="Card"
                                className='editIconImg'
                                src={editIcon}
                                onClick={e => {
                                    accomplishmentMode.current = 'Edit';
                                    activeIndex.current = rowData.data.index;
                                    updateActiveAccomplishment(rowData.data);
                                }} />
                            <img
                                alt='Card'
                                src={deleteIcon}
                                onClick={e => {
                                    setDeleteAccomDialog(true);
                                    deleteAccomRef.current = {
                                        rowID: rowData.data.ID,
                                        index: rowData.data.index
                                    };
                                }} />
                        </>
                    }
                </>
            );
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-actionTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const attachCellTemplate = (value, attachmentData, NewAttachmentData) => {
        try {
            return <AttachmentCellTemplate Value={value} AttachmentData={attachmentData} NewAttachmentData={NewAttachmentData} />;
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-attachCellTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    useEffect(() => {
        accomplishmentGridDataRef.current = props.data;
        accomplishmentIndex.current = props.index;
        setaccomplishmentGridData(props.data);
        console.log(count);
    }, [props]);
    useEffect(() => {
        return () => {
            props.handleUnmount(accomplishmentGridDataRef.current, accomplishmentIndex.current);
        };
    }, [accomplishmentGridData]);

    const clearAttachment = (e, item) => {
        try {
            setLoadCnt(prevState => 1 + prevState);
            let deletedFilesArr: Array<String>;
            deletedFilesArr = activeAccomplishmentRef.current['DeletedAttachmentData'];
            deletedFilesArr.push(item.FileName);
            //deletedFilesArr = "'"+ item.FileName  +"'" + "," + deletedFilesArr;
            if (activeAccomplishmentRef.current['AttachmentData']) {
                activeAccomplishmentRef.current['AttachmentData'] = activeAccomplishmentRef.current['AttachmentData'].filter(i => i.FileName != item.FileName);
                activeAccomplishmentRef.current['DeletedAttachmentData'] = deletedFilesArr;
            }
            // activeAccomplishmentRef.current['AttachmentData'] = null;
            // activeAccomplishmentRef.current['AttachmentName'] = null;
            // activeAccomplishmentRef.current['AttachmentURL'] = null;
            //setLoadCnt(prevState => 1 + prevState);
            setTimeout(() => setLoadCnt(prevState => prevState - 1), 400);
        } catch (error) {
            let errorMsg = {
                Source: 'Activities-clearAttachment',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    return (
        <>
            <div className='Accomplishments' style={{ marginLeft: "1%" }}>
                <DataGrid
                    noDataText='No accomplishments to display.'
                    height={500}
                    className='AccomplishmentGrid'
                    dataSource={isChecked ? accomplishmentGridData
                        .filter(rec => rec.Active == isChecked && rec.IsDeleted != true) :
                        accomplishmentGridData.filter(rec => rec.IsDeleted != true)}
                    hoverStateEnabled
                    showBorders
                    showRowLines
                    showColumnLines
                    allowColumnReordering
                    allowColumnResizing
                    onRowPrepared={rowData => {
                        if (!rowData?.data?.Active) {
                            rowData.rowElement.classList.remove('dx-data-row');
                            rowData.rowElement.classList.add('disableInActiveRow');
                        }
                        else rowData.rowElement.classList.add('gridRowCls');
                    }}
                >
                    <Toolbar>
                        <Item>
                            <Button className="newRecBtn"
                                hidden={(props?.ParentMode == 'View' || props.selectedprojectName === "All")} onClick={() => {
                                    accomplishmentMode.current = 'Create';
                                    updateActiveAccomplishment({});
                                }} >
                                <img src={plusNew} className='newRecIcon' />  New
                            </Button>
                        </Item>
                        <Item location={'after'}>
                            <Button className='p-button-rounded toggleBtn' >
                                <span className='toggleBtnTxt toggleBtnTxt1' style={{ color: "white" }}>All</span>
                                <InputSwitch checked={isChecked} onChange={e => setIsChecked(e.value)} />
                                <span className='toggleBtnTxt toggleBtnTxt2' style={{ color: "white" }}>Active</span>
                            </Button>
                        </Item>
                    </Toolbar>
                    <ColumnFixing enabled={true} />

                    <Column
                        caption='Action'
                        width='10%'
                        fixed={true}
                        alignment={'center'}
                        cellRender={actionTemplate} />

                    {props.selectedprojectName === 'All' &&
                        <Column
                            caption='Project Name'
                            dataField={'ProjectID.ProjectName'}
                            dataType='string'
                            alignment={'left'}
                            width='30%' />}


                    <Column
                        caption='Accomplishment'
                        dataField={'Task'}
                        dataType='string'
                        alignment={'left'}
                        width={props.selectedprojectName === 'All' ? '50%' : "80%"}
                        cellRender={e =>
                            attachCellTemplate(e.data.Task, e.data.AttachmentData, e.data.NewAttachmentData)
                        } />

                    <Column
                        caption='Date'
                        dataField={'Date'}
                        dataType={'date'}
                        alignment={'center'}
                        width='10%'
                        format='MMM-dd-yyyy'
                    />

                    <Pager
                        showInfo={true}
                        infoText="Total Rows: {2}"
                        displayMode={'full'}
                        visible={true}
                        allowedPageSizes={pageSizes}
                        showPageSizeSelector='true' />

                    <Paging
                        enabled={true}
                        defaultPageSize={10} />
                </DataGrid>
            </div >
            <Dialog
                visible={showAccomplishmentDialog}
                header={`${accomplishmentMode.current} Accomplishment`}
                closable={false}
                icons={headerIcons}
                modal
                style={{ width: '50vw' }}
                onHide={hideAccomplishmentDialog}>
                <div className='fieldContainer'>
                    <LoadSpinner isVisible={LoadCnt != 0} />
                    <label>Accomplishment</label><span className='asteriskCls'>*</span>
                    <InputTextarea
                        className=''
                        readOnly={accomplishmentMode.current == 'View'}
                        value={activeAccomplishmentRef.current['Task']}
                        onChange={e => updateInputValue('Task', e.currentTarget.value)}
                        // maxLength={100}
                        rows={4}
                    />
                    {isAccomEmpty && <div className='invalidMsg'>Please enter Task</div>}
                    {/* {<CharsRemaining count={100} value={activeAccomplishmentRef.current['Task']} />} */}
                    <Row>
                        <Col md={6}>
                            <label>Date</label>
                            <Calendar
                                className='dateCntrl'
                                value={activeAccomplishmentRef.current['Date']}
                                onChange={e => updateInputValue('Date', e.value)}
                                dateFormat='M-dd-yy'
                                disabled={accomplishmentMode.current == 'View'}
                                showIcon
                            />
                        </Col>
                    </Row>
                    <Row className='attachRow'>
                        <Col md={12} className='attachHeader AttachLabel'> Attachments</Col>
                        <Row>
                            {activeAccomplishmentRef.current['AttachmentData']?.map(item => {
                                return (
                                    <Col md={4}>
                                        <a className='attachLink' onClick={e => window.open(item.ServerRelativeUrl, '_blank')}>{item.FileName}</a>
                                        {item.FileName &&
                                            accomplishmentMode.current != 'View' ?
                                            <i className='dx-icon dx-icon-clear clearAttachIcon' onClick={e => clearAttachment(e, item)}></i> : <></>}
                                    </Col>)
                            })}
                            {activeAccomplishmentRef.current['NewAttachmentData']?.map(item => {
                                return (
                                    <span>{item.name}</span>
                                )
                            })}
                            <br />
                            <br />
                            {accomplishmentMode.current !== 'View' &&
                                (<Col md={6}>
                                    <FileUpload
                                        mode='basic'
                                        chooseLabel='Choose File'
                                        multiple
                                        disabled={accomplishmentMode.current === 'View'}
                                        auto
                                        url=''
                                        onUpload={e => updateInputValue('NewAttachmentData', e.files)}
                                        accept='image/*'
                                    />
                                </Col>)}
                        </Row>
                    </Row>
                </div>
            </Dialog>
            <Dialog modal visible={deleteAccomDialog} style={{ minWidth: '35%' }} showHeader={false} onHide={hideDeleteAccomDialog} >
                <div className="confirmation-content">
                    <h4 className='cnfrmDelText'>Confirm Delete?</h4>
                    <h5 className='sureDelText'>Are you sure, you want to delete this record?</h5>
                    <div></div>
                    <Row md={10} style={{ float: "right" }}>
                        <Col md={5} ><Button label="Cancel" onClick={hideDeleteAccomDialog} className="p-button-text cancelBtn" /></Col>
                        <Col md={2}><Button label="Confirm" onClick={deleteAccomLocal} className="p-button-text confirmBtn" /></Col>
                    </Row>
                </div>
            </Dialog>
            <ConfirmDialog visible={cnfrmSaveDialog}
                onHide={() => setCnfrmSaveDialog(false)}
                style={{ minWidth: '35%' }}
                message='Do you want to save your changes?'
                header='Confirm Save?'
                acceptClassName='acceptBtn'
                rejectClassName='rejectBtn'
                accept={saveAccomplishmentLocal}
                acceptLabel='Save'
                acceptIcon='dx-icon-save'
                rejectIcon='dx-icon-close'
                rejectLabel='Discard'
                reject={hideAccomplishmentDialog}
            />
        </>

    );
}