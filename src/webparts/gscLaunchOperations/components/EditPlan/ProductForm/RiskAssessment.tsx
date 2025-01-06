import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import DataGrid, { Column, Toolbar, Item, Paging, Pager, ColumnFixing } from 'devextreme-react/data-grid';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { Row, Col } from 'reactstrap';
import { Button } from 'primereact/button';

import ShowDropdownDataInGrid from './ShowDropdownDataInGrid';
import AttachmentCellTemplate from './AttachmentCellTemplate';
import { InputSwitch } from 'primereact/inputswitch';

import { ConfirmDialog } from 'primereact/confirmdialog';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';
//import { StatusTemplate, CalculateCellValueTemplate } from './TemplateComponent';
import { DeepDiveTemplateCheckBox, StatusTemplate } from './TemplateComponent';
import { DataService } from '../../Shared/DataService';
import CharsRemaining from '../../../../../utils/CharsRemaining';
import { Calendar } from 'primereact/calendar';
//import TextArea from 'devextreme-react/text-area';
//import { Checkbox } from 'office-ui-fabric-react';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';

import viewIcon from '../../../../assets/images/view.png';
import editIcon from '../../../../assets/images/edit.png'
import deleteIcon from '../../../../assets/images/delete.png'
import plusNew from '../../../../assets/images/plusNew.png'

export default function RiskAssessment(props) {
    const [showRiskAssDialog, setShowRiskAssDialog] = useState(false);
    const [riskAssGridData, setRiskAssGridData] = useState([]);
    const [deleteRiskAssDialog, setDeleteRiskAssDialog] = useState(false);
    const [isRiskIssueEmpty, setIsRiskIssueEmpty] = useState(false);
    const [isDeepDiveRiskCategEmpty, setIsDeepDiveRiskCategEmpty] = useState(false);
    const [isDeepDiveRiskStatusEmpty, setIsDeepDiveRiskStatusEmpty] = useState(false);
    const [isDeepDivRiskIssueEmpty, setDeepDivRiskIssueEmpty] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [cnfrmSaveDialog, setCnfrmSaveDialog] = useState(false);
    const [LoadCnt, setLoadCnt] = useState(0);
    //const [RenderCount, setRenderCount] = useState(0);
    const [count, setRenderCount] = useState(0);
    const [IsModified, setIsModified] = useState(false);

    let riskAssIndex = useRef(props.index);
    let riskAssMode = useRef('Create');
    const riskAssGridDataRef = useRef([]);
    let activeRiskAssRef = useRef({});
    let activeIndex = useRef(null);
    let deleteRiskAssRef = useRef(null);
    let dropdownOptionsRef = useRef({});
    let dropdownGridColumnsRef = useRef({});

    const pageSizes = [10, 25, 50, 100, 'all'];

    const getDropdownOptions = async () => {
        try {
            await DataService.fetchAllItemsDigitalApp('GLO_PPDropdownOptions').then(async items => {
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
                    // let d4 = itemsArr.sort((a, b) => (a.label?.toString().toLowerCase() > b.label?.toString().toLowerCase() ? 1 : a.label?.toString().toLowerCase() < b.label?.toString().toLowerCase() ? -1 : 0));
                });
                await DataService.getRequestListData('DeepDiveDropdownOptions', 'Order0').then(res => {
                    res = res.filter(rec => rec.IsVisible == true && rec.Category == 'RiskCategory');
                    //let data3 = [{ RiskCategory: '', Definition: '', actualValue: '' }];
                    let data3 = [];
                    res.map(rec => {
                        //data3.push({ DeepDiveRiskCategory: rec.Title, Definition: rec.Definition, actualValue: rec.DropdownKey + "->" + rec.Title });
                        data3.push({ DeepDiveRiskCategory: rec.Title, Definition: rec.Definition, actualValue: rec.Title });
                    });
                    let columnsArr = [];
                    columnsArr.push(
                        { caption: 'Risk Category', dataField: 'DeepDiveRiskCategory', width: '25%', alignment: 'center' },
                        { caption: 'Definition', dataField: 'Definition', width: '70%', alignment: 'left' }
                    );
                    data3 = data3.sort((a, b) => (a.DeepDiveRiskCategory?.toString().toLowerCase() > b.DeepDiveRiskCategory?.toString().toLowerCase() ? 1 : a.DeepDiveRiskCategory?.toString().toLowerCase() < b.DeepDiveRiskCategory?.toString().toLowerCase() ? -1 : 0));
                    dropdownGridColumnsRef.current['DeepDiveRiskCategory'] = columnsArr;

                    // newly added
                    // let riskStatusDD = res.filter(rec => rec.IsVisible == true && rec.Category == 'RiskStatus');
                    // let data4 = [];
                    // res.map(rec => {
                    //     data4.push({ RiskCategory: riskStatusDD.Title, Definition: riskStatusDD.Definition, actualValue: riskStatusDD.DropdownKey + "->" + riskStatusDD.Title });
                    // });
                    // data4 = data4.sort((a, b) => (a.RiskCategory?.toString().toLowerCase() > b.RiskCategory?.toString().toLowerCase() ? 1 : a.RiskCategory?.toString().toLowerCase() < b.RiskCategory?.toString().toLowerCase() ? -1 : 0));
                    // grouped1['DeepDiveRiskStatus'] = data4;

                    grouped1['DeepDiveRiskCategory'] = data3;
                });
                dropdownOptionsRef.current = grouped1;

            }).catch(error => {
                let errorMsg = {
                    Source: 'RiskAssessment-getDropdownOptions - fetchDropdownOptions',
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
            });
        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-getDropdownOptions',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const hideRiskAssDialog = () => {
        try {
            activeRiskAssRef.current = {};
            riskAssMode.current = null;
            setShowRiskAssDialog(false);
            setIsRiskIssueEmpty(false);
            setIsDeepDiveRiskCategEmpty(false);
            setIsDeepDiveRiskStatusEmpty(false);
            setDeepDivRiskIssueEmpty(false);
            setIsModified(false);
        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-hideRiskAssDialog',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const saveRiskAssLocal = () => {
        try {
            if (activeRiskAssRef.current['RiskTitle']) {
                let localRiskAssGridData = [...riskAssGridData];
                let flag = true;
                if (activeRiskAssRef.current['DeepDive']) {
                    if (activeRiskAssRef.current['DeepDiveRiskCategory'] == undefined) {
                        flag = false;
                        setIsDeepDiveRiskCategEmpty(true);
                    }
                    if (activeRiskAssRef.current['DeepDiveRiskStatus'] == undefined) {
                        flag = false;
                        setIsDeepDiveRiskStatusEmpty(true);
                    }
                    if (activeRiskAssRef.current['DeepDiveRiskTitle'] == undefined) {
                        flag = false;
                        setDeepDivRiskIssueEmpty(true);
                    }
                }
                else {
                    activeRiskAssRef.current['DeepDiveRiskCategory'] = "";
                    activeRiskAssRef.current['DeepDiveRiskStatus'] = "";
                    activeRiskAssRef.current['DeepDiveRiskTitle'] = "";
                }

                if (flag) {
                    if (riskAssMode.current == 'Create') {
                        let activeRiskAss = activeRiskAssRef.current;
                        activeRiskAss['index'] = riskAssIndex.current;
                        activeRiskAss['IsModified'] = true;
                        localRiskAssGridData.unshift(activeRiskAss);
                        riskAssIndex.current = 1 + riskAssIndex.current;
                    }
                    // add new columns
                    if (riskAssMode.current == 'Edit') {
                        localRiskAssGridData?.map(item => {
                            //below condition is to check when the user opens the edit page using query string
                            //and opening directly through ui edit icon
                            if (item['index'] == activeIndex.current || (!activeIndex.current && item.Id == props.autoOpenRiskItemId)) {
                                item['showInNPLT6Report'] = activeRiskAssRef.current?.['showInNPLT6Report'];
                                item['RiskTitle'] = activeRiskAssRef.current['RiskTitle'];
                                item['Mitigation'] = activeRiskAssRef.current['Mitigation'];
                                item['RiskDate'] = activeRiskAssRef.current['RiskDate'];
                                item['MitigationDate'] = activeRiskAssRef.current['MitigationDate'];
                                item['RiskStatus'] = activeRiskAssRef.current['RiskStatus'];
                                item['MitigationStatus'] = activeRiskAssRef.current['MitigationStatus'];
                                item['Active'] = activeRiskAssRef.current['Active'];

                                item['DeepDive'] = activeRiskAssRef.current['DeepDive'];
                                item['DeepDiveRiskCategory'] = activeRiskAssRef.current['DeepDiveRiskCategory'];
                                item['DeepDiveRiskStatus'] = activeRiskAssRef.current['DeepDiveRiskStatus'];
                                item['DeepDiveRiskTitle'] = activeRiskAssRef.current['DeepDiveRiskTitle'];
                                item['AttachmentData'] = activeRiskAssRef.current['AttachmentData'];
                                item['DeletedAttachmentData'] = activeRiskAssRef.current['DeletedAttachmentData'];
                                item['NewAttachmentData'] = activeRiskAssRef.current['NewAttachmentData'];
                                item['IsModified'] = true;
                                //item['IsActiveDeepDive'] = activeRiskAssRef.current['IsActiveDeepDive'];
                            }
                        });
                    }
                    riskAssGridDataRef.current = localRiskAssGridData;
                    setRiskAssGridData(localRiskAssGridData);
                    hideRiskAssDialog();
                }
            } else {
                setIsRiskIssueEmpty(true);
            }
            props.updateAutoOpenCreateRisk();
        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-saveRiskAssLocal',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const checkForSaveBeforeClose = () => {
        try {
            if ((riskAssMode.current == 'Create' && Object.keys(activeRiskAssRef.current).length >= 3) || (riskAssMode.current === 'Edit' && IsModified)) {
                setCnfrmSaveDialog(true);
                // return <CancelConfirmationDialog saveChanges={saveRiskAssLocal} discardChanges={hideRiskAssDialog}/>;
            } else {
                hideRiskAssDialog();
            }
            props.updateAutoOpenCreateRisk();
        } catch (error) {
            let errorMsg = {
                Source: 'Activity-hideActivityDialog',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const updateActiveRiskAssessment = (data) => {
        try {
            console.log("updateActiveRiskAssessment : " + riskAssMode.current);

            if (riskAssMode.current != 'Create') {
                activeRiskAssRef.current['RiskTitle'] = data['RiskTitle'];
                activeRiskAssRef.current['Mitigation'] = data['Mitigation'];
                activeRiskAssRef.current['RiskCategory'] = data['RiskCategory'];
                activeRiskAssRef.current['RiskStatus'] = data['RiskStatus'];
                activeRiskAssRef.current['Active'] = data['Active'];
                // new code
                activeRiskAssRef.current['RiskDate'] = data['RiskDate'] ? new Date(data['RiskDate']) : null;
                activeRiskAssRef.current['MitigationDate'] = data['MitigationDate'] ? new Date(data['MitigationDate']) : null;
                activeRiskAssRef.current['MitigationStatus'] = data['MitigationStatus'];
                activeRiskAssRef.current['DeepDive'] = data['DeepDive'];
                activeRiskAssRef.current['DeepDiveRiskCategory'] = data['DeepDiveRiskCategory'];
                activeRiskAssRef.current['DeepDiveRiskStatus'] = data['DeepDiveRiskStatus'];
                activeRiskAssRef.current['DeepDiveRiskTitle'] = data['DeepDiveRiskTitle'];

                activeRiskAssRef.current['AttachmentData'] = data['AttachmentData'];
                activeRiskAssRef.current['NewAttachmentData'] = data['NewAttachmentData'];
                activeRiskAssRef.current['DeletedAttachmentData'] = data['DeletedAttachmentData'] ? data['DeletedAttachmentData'] : [];

                if (data['AttachmentData']) {
                    activeRiskAssRef.current['AttachmentURL'] = data['AttachmentData']?.['ServerRelativeUrl'] ? props.attachURL + data['AttachmentData']?.['ServerRelativeUrl'] : data['AttachmentData']?.['objectURL'];
                    activeRiskAssRef.current['AttachmentName'] = data['AttachmentData']?.['FileName'] ? data['AttachmentData']?.['FileName'] : data['AttachmentData']?.['name'];
                    activeRiskAssRef.current['AttachmentData'] = data['AttachmentData'];
                    activeRiskAssRef.current['NewAttachmentData'] = data['NewAttachmentData'];
                }

            }
            if (riskAssMode.current == 'Create') {
                activeRiskAssRef.current['Active'] = true;
                activeRiskAssRef.current['DeepDive'] = false;
            }
            setShowRiskAssDialog(true);
        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-updateActiveRiskAssessment',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const newRiskBtnClick = () => {
        riskAssMode.current = 'Create';
        updateActiveRiskAssessment({});
    }

    const actionTemplate = (rowData) => {
        try {
            return (
                <>
                    <img alt="Card" src={viewIcon} onClick={e => { riskAssMode.current = 'View'; updateActiveRiskAssessment(rowData.data); }} />
                    {(props.ParentMode != 'View' && props.selectedprojectName != 'All') &&
                        <>
                            <img alt="Card" className='editIconImg' src={editIcon} onClick={e => { riskAssMode.current = 'Edit'; activeIndex.current = rowData.data.index; updateActiveRiskAssessment(rowData.data); }} />
                            <img alt='Card' src={deleteIcon} onClick={e => { setDeleteRiskAssDialog(true); deleteRiskAssRef.current = { rowID: rowData.data.ID, index: rowData.data.index }; }} />
                        </>
                    }
                </>
            );
        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-actionTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const deleteRiskAssLocal = () => {
        try {
            let riskAssToDelete = deleteRiskAssRef.current;
            let localRiskAss = [...riskAssGridData];
            if (riskAssToDelete['rowID']) {
                localRiskAss?.map(rec => {
                    if (rec.index == riskAssToDelete?.['index']) {
                        rec['IsDeleted'] = true;
                        rec['IsModified'] = true;
                    }
                });
            } else {
                localRiskAss = localRiskAss.filter(record => record.index != riskAssToDelete['index']);
            }

            setRiskAssGridData(localRiskAss);
            riskAssGridDataRef.current = localRiskAss;
            deleteRiskAssRef.current = null;
            setDeleteRiskAssDialog(false);

        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-deleteRiskAssLocal',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const updateInputValue = (internalName, value) => {
        try {
            if (internalName == 'DeepDive' && !value) {
                activeRiskAssRef.current['showInNPLT6Report'] = false;
            }
            if (internalName == 'NewAttachmentData') setLoadCnt(prevState => prevState + 1);
            // if (internalName == 'AttachmentData') {
            //     activeRiskAssRef.current['AttachmentName'] = value?.['name'];
            //     activeRiskAssRef.current['AttachmentURL'] = value?.['objectURL'];
            // }
            activeRiskAssRef.current[internalName] = value;
            //if (internalName == 'AttachmentData') 
            //setTimeout(() => setLoadCnt(prevState => prevState - 1), 400);
            if (internalName == 'NewAttachmentData') setTimeout(() => setLoadCnt(prevState => prevState - 1), 400);
            //setLoadCnt(prevState => prevState - 1);
            setRenderCount(prevState => 1 + prevState);
            setIsModified(true);

        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-updateInputValue',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const headerIcons = () => {
        try {
            return (
                <div className='p-dialog-titlebar-icon p-link hasDeepDiveCheckbox'>
                    {
                        props.nplt6 &&
                        (
                            <div className="DeepDiveCheckBoxWithLabelDiv">
                                <Checkbox
                                    className='DeepDiveCheckBoxControl'
                                    checked={activeRiskAssRef.current['DeepDive'] ? true : false}
                                    onChange={e => updateInputValue('DeepDive', e.checked)}
                                    disabled={riskAssMode.current == 'View'}
                                />
                                <span className='DeepDiveLabelSpan' onClick={e => riskAssMode.current === 'View' ? null : updateInputValue('DeepDive', !activeRiskAssRef.current['DeepDive'])}>&nbsp;NPL T6&ensp;</span>
                            </div>
                        )
                    }

                    <Button className='p-button-rounded toggleBtn' >
                        <InputSwitch checked={activeRiskAssRef.current['Active']} onChange={e => updateInputValue('Active', e.value)} disabled={riskAssMode.current == 'View'} />
                        <span className='toggleBtnTxt toggleBtnTxt2' style={{ color: "white" }}>Active</span>
                    </Button>
                    {riskAssMode.current != 'View' && <Button className='p-button-raised p-button-rounded okBtn'
                        onClick={saveRiskAssLocal} icon='dx-icon-check' label='Ok' />}
                    <Button className='p-button-raised p-button-rounded closeBtn'
                        onClick={checkForSaveBeforeClose} icon='dx-icon-close' label='Cancel' />
                </div>
            );
        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-headerIcons',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const hideDeleteRiskAssDialog = () => {
        try {
            setDeleteRiskAssDialog(false);
        } catch (error) {
            let errorMsg = {
                Source: 'RiskAssessment-hideDeleteRiskAssDialog',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const updateRiskCategory = (value) => {
        try {
            setLoadCnt(prevState => prevState + 1);
            activeRiskAssRef.current['DeepDiveRiskCategory'] = value;
            setTimeout(() => setLoadCnt(prevState => prevState - 1), 200);

        } catch (error) {
            let errorMsg = {
                Source: 'BSC-updateRiskCategory ',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const attachCellTemplate = (value, attachmentData, NewAttachmentData) => {
        try {
            return <AttachmentCellTemplate Value={value} AttachmentData={attachmentData} NewAttachmentData={NewAttachmentData} />;
        } catch (error) {
            let errorMsg = {
                Source: 'Risk Ass-attachCellTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    const clearAttachment = (e, item) => {
        try {
            setLoadCnt(prevState => 1 - prevState);
            let deletedFilesArr: Array<String>;
            deletedFilesArr = activeRiskAssRef.current['DeletedAttachmentData'];
            deletedFilesArr.push(item.FileName);
            if (activeRiskAssRef.current['AttachmentData']) {
                activeRiskAssRef.current['AttachmentData'] = activeRiskAssRef.current['AttachmentData'].filter(i => i.FileName != item.FileName);
                activeRiskAssRef.current['DeletedAttachmentData'] = deletedFilesArr;
            }
            // activeRiskAssRef.current['AttachmentData'] = null;
            // activeRiskAssRef.current['AttachmentName'] = null;
            // activeRiskAssRef.current['AttachmentURL'] = null;
            // setLoadCnt(prevState => 1 + prevState);
            setTimeout(() => setLoadCnt(prevState => prevState - 1), 400);
        } catch (error) {
            let errorMsg = {
                Source: 'Accomplishment-clearAttachment',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    };

    // useEffect(() => {
    //     riskAssGridDataRef.current = props.data;
    //     riskAssIndex.current = props.index;
    //     setRiskAssGridData(props.data);
    //     console.log(count);
    // }, [props]);

    useEffect(() => {
        riskAssGridDataRef.current = props.data;
        riskAssIndex.current = props.index;
        setRiskAssGridData(props.data);
        console.log(count);
    }, [props.data, props.index]);

    useEffect(() => {
        getDropdownOptions()
            .then(() => {
                if (props.autoOpenNewRiskWindow) {
                    console.log("auto open new risk window")
                    if (props.autoOpenRiskItemId) {
                        riskAssMode.current = 'Edit';

                        const specifcRiskObj = props.data.find(obj => {
                            return obj.Id === props.autoOpenRiskItemId
                        })

                        if (specifcRiskObj) {
                            updateActiveRiskAssessment(specifcRiskObj);
                        } else {
                            newRiskBtnClick();
                        }
                    } else {
                        newRiskBtnClick();
                    }
                }
            })
            .catch((error) => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(e => console.log(e));
            });
    }, []);

    useEffect(() => {
        return () => {
            props.handleUnmount(riskAssGridDataRef.current, riskAssIndex.current);
        };
    }, [riskAssGridData]);

    return (
        <>
            <div className='RiskAssessment' style={{ marginLeft: "1%" }}>
                <DataGrid
                    noDataText='No risk assessments to display.'
                    height={500}
                    className='RiskAssessmentGrid'
                    dataSource={isChecked ? riskAssGridData.filter(rec => rec.Active == isChecked && rec.IsDeleted != true) : riskAssGridData?.filter(rec => rec.IsDeleted != true)}
                    hoverStateEnabled
                    showRowLines
                    showColumnLines
                    showBorders
                    allowColumnReordering
                    allowColumnResizing
                    wordWrapEnabled
                    columnResizingMode={'widget'}
                    width='100%'
                    columnMinWidth={1}
                    columnAutoWidth={true}
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
                                hidden={(props?.ParentMode == 'View' || props.selectedprojectName === "All")}
                                onClick={() => newRiskBtnClick()} >
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
                        width='150px'
                        alignment={'center'}
                        fixed={true}
                        cellRender={actionTemplate}
                    />
                    {props.selectedprojectName === 'All' &&
                        <Column
                            caption='Project Name'
                            dataField={'ProjectID.ProjectName'}
                            dataType='string'
                            alignment={'left'}
                            width='200px'
                        />}
                    <Column
                        caption='NPL T6'
                        dataField={'DeepDive'}
                        dataType='boolean'
                        alignment={'center'}
                        width='80px'
                        allowSorting
                        cellRender={DeepDiveTemplateCheckBox}
                    />
                    <Column
                        caption='Risk/Issue'
                        dataField={'RiskTitle'}
                        dataType='string'
                        alignment={'left'}
                        width='450px'
                        allowSorting
                        cellRender={e => attachCellTemplate(e.data.RiskTitle, e.data.AttachmentData, e.data.NewAttachmentData)}
                    />
                    <Column
                        caption='Risk Category'
                        dataField={'DeepDiveRiskCategory'}
                        dataType='string'
                        alignment={'left'}
                        width='150px'
                        allowSorting
                    />
                    <Column
                        caption='Risk Date'
                        dataField={'RiskDate'}
                        dataType={'date'}
                        alignment={'center'}
                        width='150px'
                        allowSorting format='MMM-dd-yyyy'
                    />
                    <Column
                        caption='Risk Status'
                        dataField={'RiskStatus'}
                        cellRender={StatusTemplate}
                        dataType='string'
                        alignment={'center'}
                        width='150px'
                        allowSorting
                    />
                    <Column
                        caption='Mitigation'
                        dataField={'Mitigation'}
                        dataType='string'
                        alignment={'left'}
                        width='150px'
                        allowSorting
                    />
                    <Column
                        caption='Mitigation Date'
                        dataField={'MitigationDate'}
                        dataType={'date'}
                        alignment={'center'}
                        width='180px'
                        allowSorting
                        format='MMM-dd-yyyy'
                    />
                    <Column
                        caption='Mitigation Status'
                        dataField={'MitigationStatus'}
                        dataType='string'
                        alignment={'left'}
                        width='150px'
                        allowSorting
                        cellRender={StatusTemplate}
                    />
                    <Column
                        caption='NPL T6 Risk Category'
                        dataField={'DeepDiveRiskCategory'}
                        dataType='string'
                        alignment={'left'}
                        width='200px'
                        allowSorting
                    />
                    <Column
                        caption='NPL T6 Risk Status'
                        dataField={'DeepDiveRiskStatus'}
                        dataType='string'
                        alignment={'left'}
                        width='150px'
                        allowSorting
                        cellRender={StatusTemplate}
                    />
                    <Column
                        caption='NPL T6 Risk/Issue'
                        dataField={'DeepDiveRiskTitle'}
                        dataType='string'
                        alignment={'left'}
                        width='150px'
                        allowSorting
                    />

                    <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                    <Paging enabled={true} defaultPageSize={10} />
                </DataGrid>
            </div>
            <Dialog visible={showRiskAssDialog} header={`${riskAssMode.current} Risk Assessment`} closable={false} icons={headerIcons} modal style={{ width: '60vw' }} onHide={hideRiskAssDialog}>
                <>
                    <div className='fieldContainer'>
                        <LoadSpinner isVisible={LoadCnt != 0} />
                        <Row>
                            <Col md={6} >
                                <label>Risk/Issue</label><span className='asteriskCls'>*</span>
                                <InputTextarea
                                    className={isRiskIssueEmpty ? 'p-invalid' : ''}
                                    readOnly={riskAssMode.current == 'View'}
                                    value={activeRiskAssRef.current['RiskTitle']}
                                    onChange={e => updateInputValue('RiskTitle', e.currentTarget.value)}
                                    rows={3}
                                // maxLength={100}
                                />
                                {isRiskIssueEmpty && <div className="invalidMsg">Please Enter Risk/Issue</div>}
                                {/* {<CharsRemaining count={100} value={activeRiskAssRef.current['RiskTitle']} />} */}
                            </Col>
                            <Col md={6} >
                                <label>Mitigation Approach</label>
                                <InputTextarea
                                    readOnly={riskAssMode.current == 'View'}
                                    value={activeRiskAssRef.current['Mitigation']}
                                    onChange={e => updateInputValue('Mitigation', e.currentTarget.value)}
                                    rows={3}
                                // maxLength={100}
                                />
                                {/* {<CharsRemaining count={100} value={activeRiskAssRef.current['Mitigation']} />} */}
                            </Col>
                            <Col md={6} >
                                <label>Risk Identified Date</label>
                                <Calendar
                                    className='dateCntrl'
                                    value={activeRiskAssRef.current['RiskDate']}
                                    onChange={e => updateInputValue('RiskDate', e.value)}
                                    showIcon
                                    dateFormat='M-dd-yy'
                                    disabled={riskAssMode.current == 'View'}
                                />
                            </Col>
                            <Col md={6} >
                                <label>Mitigation Date</label>
                                <Calendar
                                    className='dateCntrl'
                                    value={activeRiskAssRef.current['MitigationDate']}
                                    onChange={e => updateInputValue('MitigationDate', e.value)}
                                    showIcon
                                    dateFormat='M-dd-yy'
                                    disabled={riskAssMode.current == 'View'}
                                />
                            </Col>
                            <Col md={6} className='riskAssRow2'>
                                <label>Risk Status</label>

                                <Dropdown
                                    className='dropdownCntrlPP'
                                    // appendTo={'self'}
                                    placeholder='Select status...'
                                    options={dropdownOptionsRef.current?.['RiskStatus']}
                                    value={activeRiskAssRef.current['RiskStatus']}
                                    onChange={e => updateInputValue('RiskStatus', e.value)}
                                    disabled={riskAssMode.current == 'View'}
                                    itemTemplate={StatusTemplate}
                                    valueTemplate={StatusTemplate}
                                />
                            </Col>
                            <Col md={6} className='riskAssRow2'>
                                <label>Mitigation Status</label>

                                <Dropdown
                                    className='dropdownCntrlPP'
                                    // appendTo={'self'}
                                    placeholder='Select status...'
                                    options={dropdownOptionsRef.current?.['MitigationStatus']}
                                    value={activeRiskAssRef.current['MitigationStatus']}
                                    onChange={e => updateInputValue('MitigationStatus', e.value)}
                                    disabled={riskAssMode.current == 'View'}
                                    itemTemplate={StatusTemplate}
                                    valueTemplate={StatusTemplate}
                                />
                            </Col>
                        </Row>
                        {activeRiskAssRef.current['DeepDive'] == true && <>
                            {/* <Row className='attachRow'> */}
                            {/* <Col md={12} className='attachHeader AttachLabel'> NPL T6</Col> */}
                            <Accordion multiple activeIndex={[0]} style={{ paddingTop: '1rem' }}>
                                <AccordionTab header='NPL T6'>
                                    <Row>
                                        <Col md={6} className='riskAssRow2'>
                                            <label>NPL T6 Risk Category</label><span className='asteriskCls'>*</span>
                                            <ShowDropdownDataInGrid
                                                dataSource={dropdownOptionsRef.current['DeepDiveRiskCategory']}
                                                updateValue={updateRiskCategory}
                                                internalName='DeepDiveRiskCategory'
                                                displayName='Risk Category'
                                                disabled={riskAssMode.current == 'View'}
                                                gridColumns={dropdownGridColumnsRef.current['DeepDiveRiskCategory']}
                                                value={activeRiskAssRef.current['DeepDiveRiskCategory']} />
                                            {isDeepDiveRiskCategEmpty && <div className="invalidMsg">Please select Risk Category</div>}
                                        </Col>
                                        <Col md={6} className='riskAssRow2'>
                                            <label>NPL T6 Risk Status</label><span className='asteriskCls'>*</span>
                                            <Dropdown
                                                className='dropdownCntrlPP'
                                                // appendTo={'self'}
                                                placeholder='Select Risk Status'
                                                options={dropdownOptionsRef.current?.['DeepDiveRiskStatus']}
                                                value={activeRiskAssRef.current['DeepDiveRiskStatus']}
                                                onChange={e => updateInputValue('DeepDiveRiskStatus', e.value)}
                                                disabled={riskAssMode.current == 'View'}
                                                itemTemplate={StatusTemplate}
                                                valueTemplate={StatusTemplate}
                                            />
                                            {isDeepDiveRiskStatusEmpty && <div className="invalidMsg">Please select NPL T6 Risk Status.</div>}
                                        </Col>
                                        <Col md={6} className='riskAssRow2'>
                                            <label>NPL T6 Risk/Issue</label><span className='asteriskCls'>*</span>
                                            <InputTextarea
                                                className={isRiskIssueEmpty ? 'p-invalid' : ''}
                                                readOnly={riskAssMode.current == 'View'}
                                                value={activeRiskAssRef.current['DeepDiveRiskTitle']}
                                                onChange={e => updateInputValue('DeepDiveRiskTitle', e.currentTarget.value)}
                                                rows={3}
                                                maxLength={100}
                                            />
                                            {isDeepDivRiskIssueEmpty && <div className="invalidMsg">Please Enter NPL Risk/Issue</div>}
                                            {<CharsRemaining count={100} value={activeRiskAssRef.current['DeepDiveRiskTitle']} />}
                                        </Col>
                                    </Row>
                                </AccordionTab>
                            </Accordion>
                            {/* </Row> */}
                        </>
                        }

                        <Accordion multiple activeIndex={[0]}>
                            <AccordionTab header='Attachments'>
                                <Row className='attachRow'>
                                    <Row>
                                        {activeRiskAssRef.current['AttachmentData']?.map(item => {
                                            return (
                                                <Col md={6}>
                                                    <a className='attachLink' onClick={e => window.open(item.ServerRelativeUrl, '_blank')}>{item.FileName}</a>
                                                    {item.FileName &&
                                                        riskAssMode.current != 'View' ?
                                                        <i className='dx-icon dx-icon-clear clearAttachIcon' onClick={e => clearAttachment(e, item)}></i> : <></>}
                                                </Col>
                                            )
                                        })
                                        }
                                        {activeRiskAssRef.current['NewAttachmentData']?.map(item => {
                                            return (
                                                <span>{item.name}</span>
                                            )
                                        })}
                                        <br />
                                        <br />
                                        {riskAssMode.current !== 'View' &&
                                            (<Col md={6}>
                                                <FileUpload
                                                    mode='basic'
                                                    chooseLabel='Choose File'
                                                    multiple
                                                    disabled={riskAssMode.current === 'View'}
                                                    auto
                                                    url=''
                                                    onUpload={e => updateInputValue('NewAttachmentData', e.files)}
                                                    accept='image/*'
                                                />
                                            </Col>)}
                                    </Row>
                                </Row>
                            </AccordionTab>
                        </Accordion>
                    </div>
                </>
            </Dialog >
            <Dialog modal visible={deleteRiskAssDialog} style={{ minWidth: '35%' }} showHeader={false} onHide={hideDeleteRiskAssDialog} >
                <div className="confirmation-content">
                    <h4 className='cnfrmDelText'>Confirm Delete?</h4>
                    <h5 className='sureDelText'>Are you sure, you want to delete this record?</h5>
                    <div></div>
                    <Row md={10} style={{ float: "right" }}>
                        <Col md={5} ><Button label="Cancel" onClick={hideDeleteRiskAssDialog} className="p-button-text cancelBtn" /></Col>
                        <Col md={2}><Button label="Confirm" onClick={deleteRiskAssLocal} className="p-button-text confirmBtn" /></Col>
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
                accept={saveRiskAssLocal}
                acceptLabel='Save'
                acceptIcon='dx-icon-save'
                rejectIcon='dx-icon-close'
                rejectLabel='Discard'
                reject={hideRiskAssDialog}
            />
        </>
    );
}