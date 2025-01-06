import * as React from 'react';
import './ProductPages.css';
import { useState, useEffect, useRef } from 'react';
// import { useQuery } from 'react-query';
import DataGrid, { Column, Paging, Pager, Toolbar, Item, ColumnFixing } from 'devextreme-react/data-grid';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
// import { LaunchXService } from '../../Shared/DataService';
import { Row, Col } from 'reactstrap';
// import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';

import AttachmentCellTemplate from './AttachmentCellTemplate';
import { InputSwitch } from 'primereact/inputswitch';
// import CancelConfirmationDialog from './CancelConfirmationDialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';
import { StatusTemplate } from './TemplateComponent';
//import CharsRemaining from '../../../../../utils/CharsRemaining';

import viewIcon from '../../../../assets/images/view.png';
import editIcon from '../../../../assets/images/edit.png'
import deleteIcon from '../../../../assets/images/delete.png'
import plusNew from '../../../../assets/images/plusNew.png'
import { DataService } from '../../Shared/DataService';

export default function Activities(props) {

    const [showActivityDialog, setShowActivityDialog] = useState(false);
    const [activityGridData, setActivityGridData] = useState([]);
    const [deleteActivityDialog, setDeleteActivityDialog] = useState(false);
    const [isActivityEmpty, setIsActivityEmpty] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [cnfrmSaveDialog, setCnfrmSaveDialog] = useState(false);
    const [LoadCnt, setLoadCnt] = useState(0);
    const [IsModified, setIsModified] = useState(false);

    let activityIndex = useRef(props.index);
    let activityMode = useRef('Create');
    const activityGridDataRef = useRef([]);
    let activeActivityRef = useRef({});
    let activeIndex = useRef(null);
    let deleteActivityRef = useRef(null);
    let dropdownOptionsRef = useRef({});
    const [count, setRenderCount] = useState(0);

    const pageSizes = [10, 25, 50, 100, 'all'];

    const getDropdownOptions = async () => {
        try {
            await DataService.fetchAllItemsDigitalApp('GLO_PPDropdownOptions').then(items => {
                items = items.filter(data2 => data2.IsActive == true);
                const unique = [...new Set(items.map(item => item.DropdownCategory))];
                let grouped1 = {};
                unique.map((data4: string, index1) => {
                    let data6 = items.filter(item => item.DropdownCategory == data4);
                    let itemsArr = [];
                    data6.map(data7 => {
                        if (data7.IsKeyValuePair)
                            //itemsArr.push({ label: data7.DropdownValue, value: data7.DropdownKey + "->" + data7.DropdownValue });
                            itemsArr.push({ label: data7.DropdownValue, value: data7.DropdownValue });
                        else
                            itemsArr.push({ label: data7.DropdownValue, value: data7.DropdownValue });

                    });
                    grouped1[data4] = itemsArr;
                });
                dropdownOptionsRef.current = grouped1;

            }).catch(error => {
                let errorMsg = {
                    Source: 'Activities-getDropdownOptions - fetchDropdownOptions',
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });

        } catch (error) {
            let errorMsg = {
                Source: 'PP-getDropdownOptions',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const updateActiveActivity = (data) => {
        try {
            if (activityMode.current != 'Create') {
                activeActivityRef.current['Date'] = data['Date'] ? new Date(data['Date']) : null;
                activeActivityRef.current['Activity'] = data['Activity'];
                activeActivityRef.current['Active'] = data['Active'];
                activeActivityRef.current['Status'] = data['Status'];
                activeActivityRef.current['AttachmentData'] = data['AttachmentData'];
                activeActivityRef.current['NewAttachmentData'] = data['NewAttachmentData'];
                activeActivityRef.current['DeletedAttachmentData'] = data['DeletedAttachmentData'] ? data['DeletedAttachmentData'] : [];
                if (data['AttachmentData']) {
                    activeActivityRef.current['AttachmentURL'] = data['AttachmentData']?.['ServerRelativeUrl'] ? props.attachURL + data['AttachmentData']?.['ServerRelativeUrl'] : data['AttachmentData']?.['objectURL'];
                    activeActivityRef.current['AttachmentName'] = data['AttachmentData']?.['FileName'] ? data['AttachmentData']?.['FileName'] : data['AttachmentData']?.['name'];
                    activeActivityRef.current['AttachmentData'] = data['AttachmentData'];
                    activeActivityRef.current['NewAttachmentData'] = data['NewAttachmentData'];
                }
            }
            if (activityMode.current == 'Create') {
                activeActivityRef.current['Active'] = true;
            }
            setShowActivityDialog(true);

        } catch (error) {
            let errorMsg = {
                Source: 'Activity-updateActiveActivity',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const hideActivityDialog = () => {
        try {
            activeActivityRef.current = {};
            activityMode.current = null;
            setShowActivityDialog(false);
            setIsActivityEmpty(false);
            setIsModified(false);
        } catch (error) {
            let errorMsg = {
                Source: 'Activity-hideActivityDialog',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const saveActivityLocal = () => {
        try {
            if (activeActivityRef.current['Activity']) {
                let localActivityGridData = [...activityGridData];
                if (activityMode.current == 'Create') {
                    let activeActivityData = activeActivityRef.current;
                    activeActivityData['index'] = activityIndex.current;
                    activeActivityData['IsModified'] = true;
                    localActivityGridData.unshift(activeActivityData);
                    activityIndex.current = 1 + activityIndex.current;
                }
                if (activityMode.current == 'Edit') {
                    localActivityGridData?.map(item => {
                        if (item['index'] == activeIndex.current) {
                            item['Date'] = activeActivityRef.current['Date'] ? activeActivityRef.current['Date'] : null;
                            item['Activity'] = activeActivityRef.current['Activity'];
                            item['Active'] = activeActivityRef.current['Active'];
                            item['Status'] = activeActivityRef.current['Status'];
                            item['AttachmentData'] = activeActivityRef.current['AttachmentData'];
                            item['DeletedAttachmentData'] = activeActivityRef.current['DeletedAttachmentData'];
                            item['NewAttachmentData'] = activeActivityRef.current['NewAttachmentData'];
                            item['IsModified'] = true;
                        }
                    });

                }

                activityGridDataRef.current = localActivityGridData;
                setActivityGridData(localActivityGridData);
                hideActivityDialog();
            } else {
                setIsActivityEmpty(true);
            }
        } catch (error) {
            let errorMsg = {
                Source: 'Activity-saveActivityLocal',
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
                    <img alt="Card" src={viewIcon} onClick={e => { activityMode.current = 'View'; updateActiveActivity(rowData.data); }} />
                    {(props.ParentMode != 'View' && props.selectedprojectName != 'All') &&
                        <>
                            <img alt="Card" className='editIconImg' src={editIcon} onClick={e => { activityMode.current = 'Edit'; activeIndex.current = rowData.data.index; updateActiveActivity(rowData.data); }} />
                            <img alt='Card' src={deleteIcon} onClick={e => { setDeleteActivityDialog(true); deleteActivityRef.current = { rowID: rowData.data.ID, index: rowData.data.index }; }} />
                        </>
                    }
                </>
            );
        } catch (error) {
            let errorMsg = {
                Source: 'Activity-actionTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const deleteActivityLocal = () => {
        try {
            let accomtoDelete = deleteActivityRef.current;
            let localActivities = [...activityGridData];
            if (accomtoDelete['rowID']) {
                localActivities.map(rec => {
                    if (rec.index == accomtoDelete?.['index']) {
                        rec['IsDeleted'] = true;
                        rec['IsModified'] = true;
                    }
                });

            } else {
                localActivities = localActivities.filter(record => record.index != accomtoDelete['index']);
            }

            setActivityGridData(localActivities);
            activityGridDataRef.current = localActivities;
            setDeleteActivityDialog(false);

        } catch (error) {
            let errorMsg = {
                Source: 'Activity-deleteActivityLocal',
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
            if ((activityMode.current == 'Create' && Object.keys(activeActivityRef.current).length >= 2) || (activityMode.current == 'Edit' && IsModified)) {
                setCnfrmSaveDialog(true);
                // return <CancelConfirmationDialog saveChanges={saveActivityLocal} discardChanges={hideActivityDialog}/>;
            } else {
                hideActivityDialog();
            }
        } catch (error) {
            let errorMsg = {
                Source: 'Activity-hideActivityDialog',
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
            // if (internalName == 'AttachmentData') {
            //     //setLoadCnt(prevState => prevState + 1);
            //     activeActivityRef.current['AttachmentName'] = value?.['name'];
            //     activeActivityRef.current['AttachmentURL'] = value?.['objectURL'];
            // }
            activeActivityRef.current[internalName] = value;
            if (internalName == 'NewAttachmentData') setTimeout(() => setLoadCnt(prevState => prevState - 1), 400);
            setRenderCount(prevState => 1 + prevState);
            //setTimeout(() => setLoadCnt(prevState => prevState - 1), 400);
            setIsModified(true);


        } catch (error) {
            let errorMsg = {
                Source: 'Activity-updateInputValue',
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
                        <InputSwitch checked={activeActivityRef.current['Active']} onChange={e => updateInputValue('Active', e.value)} disabled={activityMode.current == 'View'} />
                        <span className='toggleBtnTxt toggleBtnTxt2' style={{ color: "white" }}>Active</span>
                    </Button>
                    {activityMode.current != 'View' && <Button className='p-button-raised p-button-rounded okBtn' onClick={saveActivityLocal} icon='dx-icon-check' label='Ok' />}
                    <Button className='p-button-raised p-button-rounded closeBtn' onClick={checkForSaveBeforeClose} icon='dx-icon-close' label='Cancel' />
                </div>
            );
        } catch (error) {
            let errorMsg = {
                Source: 'Activity-headerIcons',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const hideDeleteActivityDialog = () => {
        try {
            setDeleteActivityDialog(false);
        } catch (error) {
            let errorMsg = {
                Source: 'Activity-hideDeleteActivityDialog',
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
                Source: 'Activities-attachCellTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const clearAttachment = (e, item) => {
        try {
            setLoadCnt(prevState => 1 - prevState);
            let deletedFilesArr: Array<String>;
            deletedFilesArr = activeActivityRef.current['DeletedAttachmentData'];
            deletedFilesArr.push(item.FileName);
            if (activeActivityRef.current['AttachmentData']) {
                activeActivityRef.current['AttachmentData'] = activeActivityRef.current['AttachmentData'].filter(i => i.FileName != item.FileName);
                activeActivityRef.current['DeletedAttachmentData'] = deletedFilesArr;
            }
            // activeActivityRef.current['AttachmentData'] = null;
            // activeActivityRef.current['AttachmentName'] = null;
            // activeActivityRef.current['AttachmentURL'] = null;
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

    useEffect(() => {
        // if(props.data.length)
        activityGridDataRef.current = props.data;
        activityIndex.current = props.index;
        setActivityGridData(props.data);
        console.log(count);
    }, [props]);

    useEffect(() => {
        getDropdownOptions().catch(e => console.log(e));
    }, []);

    useEffect(() => {
        return () => {
            props.handleUnmount(activityGridDataRef.current, activityIndex.current);
        };
    }, [activityGridData]);

    return (
        <>
            <div className='Activities' style={{ marginLeft: "1%" }}>
                <DataGrid
                    noDataText='No upcoming activities to display.'
                    height={500}
                    className='ActivitiesGrid'
                    dataSource={isChecked ? activityGridData
                        .filter(rec => rec.Active == isChecked && rec.IsDeleted != true) :
                        activityGridData.filter(rec => rec.IsDeleted != true)}
                    hoverStateEnabled
                    showRowLines
                    showColumnLines
                    showBorders
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
                            <Button className="newRecBtn" hidden={(props?.ParentMode == 'View' || props.selectedprojectName === "All")} onClick={() => { activityMode.current = 'Create'; updateActiveActivity({}); }} >
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

                    <Column caption='Action' width='10%' alignment={'center'} fixed={true} cellRender={actionTemplate} />

                    {props.selectedprojectName === 'All' &&
                        <Column
                            caption='Project Name'
                            dataField={'ProjectID.ProjectName'}
                            dataType='string'
                            alignment={'left'}
                            width='30%' />}

                    <Column caption='Upcoming Activities' dataField={'Activity'} dataType='string' alignment={'left'}
                        width={props.selectedprojectName === 'All' ? '30%' : "60%"}
                        allowSorting cellRender={e => attachCellTemplate(e.data.Activity, e.data.AttachmentData, e.data.NewAttachmentData)} />

                    <Column caption='Date' dataField={'Date'} dataType={'date'} alignment={'center'} width='15%' allowSorting format='MMM-dd-yyyy' />
                    <Column caption='Status' dataField={'Status'} cellRender={StatusTemplate} dataType='15%' alignment={'center'} width='150px' allowSorting />

                    <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                    <Paging enabled={true} defaultPageSize={10} />
                </DataGrid>
            </div>
            <Dialog visible={showActivityDialog} header={`${activityMode.current} Activity`} closable={false} icons={headerIcons} modal style={{ width: '50vw' }} onHide={hideActivityDialog}>
                <div className='fieldContainer'>
                    <LoadSpinner isVisible={LoadCnt != 0} />
                    <label>Activity</label><span className='asteriskCls'>*</span>
                    <InputTextarea
                        className={isActivityEmpty ? 'p-invalid' : ''}
                        readOnly={activityMode.current == 'View'}
                        value={activeActivityRef.current['Activity']}
                        onChange={e => updateInputValue('Activity', e.currentTarget.value)}
                        rows={4}
                    // maxLength={100}
                    />
                    {isActivityEmpty && <div className="invalidMsg">Please Enter Activity</div>}
                    {/* {<CharsRemaining count={100} value={activeActivityRef.current['Activity']} />} */}
                    <Row>
                        <Col md={4}>
                            <label>Status</label>
                            <Dropdown
                                className='dropdownCntrlPP'
                                // appendTo={'self'}
                                placeholder='Select status...'
                                options={dropdownOptionsRef.current?.['ActivityStatus']}
                                value={activeActivityRef.current['Status']}
                                onChange={e => updateInputValue('Status', e.value)}
                                disabled={activityMode.current == 'View'}
                                itemTemplate={StatusTemplate}
                                valueTemplate={StatusTemplate}
                            />
                        </Col>
                        <Col md={4}>
                            <label>Date</label>
                            <Calendar
                                className='dateCntrl'
                                value={activeActivityRef.current['Date']}
                                onChange={e => updateInputValue('Date', e.value)}
                                showIcon
                                dateFormat='M-dd-yy'
                                disabled={activityMode.current == 'View'}
                            />
                        </Col>
                    </Row>
                    <Row className='attachRow'>
                        <Col md={12} className='attachHeader AttachLabel'> Attachments</Col>
                        <Row>
                            {activeActivityRef.current['AttachmentData']?.map(item => {
                                return (
                                    <Col md={6}>
                                        <a className='attachLink' onClick={e => window.open(item.ServerRelativeUrl, '_blank')}>{item.FileName}</a>
                                        {item.FileName && activityMode.current != 'View' ?
                                            <i className='dx-icon dx-icon-clear clearAttachIcon' onClick={e => clearAttachment(e, item)}></i> : <></>}
                                    </Col>
                                )
                            })
                            }
                            {activeActivityRef.current['NewAttachmentData']?.map(item => {
                                return (
                                    <span>{item.name}</span>
                                )
                            })
                            }
                            <br />
                            <br />
                            {activityMode.current !== 'View' &&
                                (<Col md={6}>
                                    <FileUpload
                                        mode='basic'
                                        chooseLabel='Choose File'
                                        multiple
                                        disabled={activityMode.current === 'View'}
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
            <Dialog modal visible={deleteActivityDialog} style={{ minWidth: '35%' }} showHeader={false} onHide={hideDeleteActivityDialog} >
                <div className="confirmation-content">
                    <h4 className='cnfrmDelText'>Confirm Delete?</h4>
                    <h5 className='sureDelText'>Are you sure, you want to delete this record?</h5>
                    <div></div>
                    <Row md={10} style={{ float: "right" }}>
                        <Col md={5} ><Button label="Cancel" onClick={hideDeleteActivityDialog} className="p-button-text cancelBtn" /></Col>
                        <Col md={2}><Button label="Confirm" onClick={deleteActivityLocal} className="p-button-text confirmBtn" /></Col>
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
                accept={saveActivityLocal}
                acceptLabel='Save'
                acceptIcon='dx-icon-save'
                rejectIcon='dx-icon-close'
                rejectLabel='Discard'
                reject={hideActivityDialog}
            />
        </>
    );
}