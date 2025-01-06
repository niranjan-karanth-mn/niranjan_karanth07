import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './ProductPages.css';
import { Row, Col } from 'reactstrap';
import { Button } from 'primereact/button';
import { DataService } from '../../Shared/DataService';
import AttachmentCellTemplate from './AttachmentCellTemplate';
import { DropDownButton } from 'devextreme-react/drop-down-button';
import DataGrid, { Column, Selection, Toolbar, Item, ColumnFixing } from 'devextreme-react/data-grid';
import { InputSwitch } from 'primereact/inputswitch';
import {
    StatusTemplate,
    DeepDiveTemplateCheckBox,
    statusCol
} from './TemplateComponent';
import RiskAssessment from './RiskAssessment';
import Accomplishments from './Accomplishments';
import Activities from './Activities';
import PPMilestones from './PPMilestones';
import GeneratePPT from './ExportExeAppData/PPTReport';
import PDFReport from './ExportExeAppData/PDFReport';
import ExcelReport from './ExportExeAppData/ExcelReport';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';


export default function ProductPages(props) {
    const [checked, setChecked] = useState({ PPAccomplishment: true, PPMilestone: true, PPActivities: true, PPRiskAssessment: true });

    const PPDataRef = useRef(props?.PPData);
    let selectedRowsRef = useRef({ 'Accom': [], 'Milestone': [], 'Activities': [], 'RiskAss': [], 'SupplyChain': [] });
    let toastRef = useRef(null);
    let MilestoneGridRef = useRef(null);
    let AccomGridRef = useRef(null);
    let ActivitiesGridRef = useRef(null);
    let RiskAssGridref = useRef(null);
    let attachURL = useRef(null);

    const updateProductPagesData = async () => {
        try {
            PPDataRef.current = props.PPData;
        } catch (error) {
            let errorMsg = {
                Source: 'PP-updateParentData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    useEffect(() => {
        if (props.siteURL == DataService.NPLDigitalApps_Url) {
            attachURL.current = DataService.NPLDigitalApps_Url + '/_layouts/download.aspx?SourceUrl=';
        }
        updateProductPagesData().catch(error => {
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        });
    }, [props]);

    const handleAccomplishmentsUnmount = (accData, index) => {
        try {
            PPDataRef.current['accomData'] = accData;
            PPDataRef.current['accomIndex'] = index;
            props.onUnmount(PPDataRef.current);
        } catch (error) {
            let errorMsg = {
                Source: 'PP-handleAccomplishmentsUnmount',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const handleActivitiesUnmount = (actData, index) => {
        try {
            PPDataRef.current['activityData'] = actData;
            PPDataRef.current['activityIndex'] = index;
            props.onUnmount(PPDataRef.current);
            //incrementing count to render changes in UI
        } catch (error) {
            let errorMsg = {
                Source: 'PP-handleActivitiesUnmount',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const handleRiskAssUnmount = (riskAssData, index) => {
        try {
            PPDataRef.current['riskAssessmentData'] = riskAssData;
            PPDataRef.current['riskAssessmentIndex'] = index;
            props.onUnmount(PPDataRef.current);
            //incrementing count to render changes in UI
        } catch (error) {
            let errorMsg = {
                Source: 'PP-handleActivitiesUnmount',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const handleExportClick = (data: any) => {
        try {
            console.log('export data : ', PPDataRef.current);
            let modifiedAccom = PPDataRef.current['accomData']?.filter(rec => rec.IsModified == true);
            let modifiedMilestones = PPDataRef.current['milestoneData']?.filter(rec => rec.IsModified == true);
            let modifiedActivities = PPDataRef.current['activityData']?.filter(rec => rec.IsModified == true);
            let modifiedRiskAss = PPDataRef.current['riskAssessmentData']?.filter(rec => rec.IsModified == true);
            if (modifiedAccom?.length > 0 || modifiedActivities?.length > 0 || modifiedMilestones?.length > 0 || modifiedRiskAss?.length > 0) {
                toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please save before exporting!!', position: 'bottom-right', life: '3000' });
            } else {
                let header2Values = {
                    'LaunchStatus': props.launchStatus?.key,
                    'LaunchProgress': props.launchProgress?.Key,
                    'ResourceStatus': props.resourceStatus?.key,
                    'RiskStatus': props.riskStatus?.key,
                    'LaunchReadinessDate': props.pgsReadiness
                }
                switch (data.itemData) {
                    case 'PPT': {
                        if (selectedRowsRef.current['Accom'].length > 5) {
                            toastRef.current.clear();
                            toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select maximum of 5 Accomplishments!!', position: 'bottom-right', life: '10000000' });
                        } else if (selectedRowsRef.current['Activities'].length > 5) {
                            toastRef.current.clear();
                            toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select maximum of 5 Upcoming Activities!!', position: 'bottom-right', life: '3000' });
                        }
                        else if (selectedRowsRef.current['RiskAss'].length > 5) {
                            toastRef.current.clear();
                            toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select maximum of 5 Risk Assessments!!', position: 'bottom-right', life: '3000' });
                        }
                        else if (selectedRowsRef.current['Milestone'].length > 5) {
                            toastRef.current.clear();
                            toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select maximum of 5 Milestones!!', position: 'bottom-right', life: '3000' });
                        } else {
                            GeneratePPT(props.selectedProject, PPDataRef.current, selectedRowsRef.current, checked, props.selectedProject?.ProjectName, props.SelectedView, header2Values);
                        }
                        break;
                    }
                    case 'PDF': {
                        PDFReport(props.selectedProject, PPDataRef.current, props.selectedProject?.ProjectName, props.SelectedView, header2Values).catch(e => console.log(e));
                        break;
                    }
                    case 'EXCEL': {
                        ExcelReport(props.selectedProject, PPDataRef.current, props.selectedProject?.ProjectName, props.planRecords, props.SelectedView, props.ProductName).catch(e => console.log(e));
                        break;
                    }
                    default: console.log('invalid export btn'); break;
                }
            }
        } catch (error) {
            let errorMsg = {
                Source: 'PP-handleExportClick',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const handleOptionChange = (type, e) => {
        try {
            if (e.fullName == 'selectedRowKeys') {
                if (e.value?.length > 5) {
                    toastRef.current.clear();
                    toastRef.current.show({ severity: 'warn', summary: '', detail: 'Only 5 rows can be selected at a time!!', position: 'bottom-right', life: '3000' });
                }
                selectedRowsRef.current[type] = e.value;
            }
        } catch (error) {
            let errorMsg = {
                Source: 'PP-handleOptionChange',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const attachCellTemplate = (value, attachmentData) => {
        try {
            return <AttachmentCellTemplate Value={value} AttachmentData={attachmentData} />;
        } catch (error) {
            let errorMsg = {
                Source: 'PP-attachCellTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const getLaunchReadinessString = (): string => {
        const value = (props.pgsReadiness != null && props.pgsReadiness != undefined) ? props.pgsReadiness : 'Pending';
        return value;
    }

    return (
        <>
            <Toast ref={toastRef} />
            {props.selectedProject?.ProjectName !== 'All' &&
                <Row>
                    <Col md={11} sm={9} style={{ padding: "0rem 0rem .5rem .5rem" }}>
                        {props.selectedProject?.ProjectName !== 'All' &&
                            <Tag severity="info" value={props.selectedProject.ProjectName}
                                style={{ color: 'black', backgroundColor: 'white' }} />}
                    </Col>
                    <Col md={1} sm={3}>
                        <div className='ProjeDetailHeaderExportBtnDiv'>
                            <DropDownButton
                                // width={120}
                                text="Export"
                                icon='download'
                                className='PPexportBtn'
                                // type="normal"
                                items={props.selectedProject?.ProjectName == 'All' ? ['EXCEL'] : ['PPT', 'PDF', 'EXCEL']}
                                onItemClick={handleExportClick}
                                stylingMode="contained"
                            />
                        </div>
                    </Col>
                </Row>}

            <Row style={{ padding: ".1rem 0rem" }}>
                <Col style={{ width: "60%" }} className='PPTabBtnGroup'>
                    {props.selectedProject?.ProjectName !== 'All' &&
                        <Button className={props.activeTab == 'QuadViewBtn' ? 'QuadViewBtn PPTabBtn' : 'PPTabBtn'} label='Summary View'
                            onClick={() => { props.setActiveTab('QuadViewBtn'); props.updateAutoOpenCreateRisk(); }} />}

                    <Button className={props.activeTab == 'AccomplishmentsBtn' ? 'AccomplishmentsBtn PPTabBtn' : 'PPTabBtn'} label='Accomplishments'
                        onClick={() => { props.setActiveTab('AccomplishmentsBtn'); props.updateAutoOpenCreateRisk(); }} />
                    <Button className={props.activeTab == 'ActivitiesBtn' ? 'ActivitiesBtn PPTabBtn' : 'PPTabBtn'} label='Upcoming Activities'
                        onClick={() => { props.setActiveTab('ActivitiesBtn'); props.updateAutoOpenCreateRisk(); }} />
                    <Button className={props.activeTab == 'MilestonesBtn' ? 'MilestonesBtn PPTabBtn' : 'PPTabBtn'} label='Milestone'
                        onClick={() => { props.setActiveTab('MilestonesBtn'); props.updateAutoOpenCreateRisk(); }} />
                    <Button className={props.activeTab == 'RiskAssessmentsBtn' ? 'RiskAssessmentsBtn PPTabBtn' : 'PPTabBtn'} label='Risk Assessment'
                        onClick={() => { props.setActiveTab('RiskAssessmentsBtn'); props.updateAutoOpenCreateRisk(); }} />
                </Col>

                <Col style={{ width: "40%" }} >
                    {props.selectedProject?.ProjectName !== 'All' ?
                        (<table style={{ position: 'relative', float: 'right' }}>
                            <tr>
                                <th className='label'>Launch Progress</th>
                                <th className='label'>Launch Status</th>
                                <th className='label'>Resource Status</th>
                                <th className='label'>Risk/Issue Status</th>
                                <th className='label'>Launch Readiness Date</th>
                            </tr>
                            <tr style={{ height: "1rem", textAlign: 'center' }}>
                                <td className='value val1'>
                                    {props.launchProgress == null ? "" : props.launchProgress?.Key}
                                </td>
                                <td className='value'>
                                    {props.launchStatus == null ? "" :
                                        StatusTemplate({ value: props.launchStatus?.key })}
                                </td>
                                <td className='value'>
                                    {props.resourceStatus == null ? "" :
                                        StatusTemplate({ value: props.resourceStatus?.key })}
                                </td>
                                <td className='value'>
                                    {props.riskStatus == null ? "" :
                                        StatusTemplate({ value: props.riskStatus?.key })}
                                </td>
                                <td className='value'>
                                    {getLaunchReadinessString()}
                                </td>
                            </tr>
                        </table>) :
                        (<div className='ProjeDetailHeaderExportBtnDiv'>
                            <DropDownButton
                                text="Export"
                                icon='download'
                                className='PPexportBtn'
                                items={props.selectedProject?.ProjectName == 'All' ? ['EXCEL'] : ['PPT', 'PDF', 'EXCEL']}
                                onItemClick={handleExportClick}
                                stylingMode="contained"
                            />
                        </div>)
                    }
                </Col>
            </Row>
            {/* <Row style={{ padding: "0rem 1.2rem" }}>
                <ol className='breadcrumb v1'>                    
                    <li className='breadcrumb-level'><div onClick={() => { props.setActiveTab('QuadViewBtn'); props.updateAutoOpenCreateRisk(); }}>Summarry View</div></li>
                    <li className='breadcrumb-level'><div onClick={() => { props.setActiveTab('AccomplishmentsBtn'); props.updateAutoOpenCreateRisk(); }}>Accomplishments</div></li>
                    <li className='breadcrumb-level'><div onClick={() => { props.setActiveTab('ActivitiesBtn'); props.updateAutoOpenCreateRisk(); }}>Upcoming Activities</div></li>
                    <li className='breadcrumb-level'><div onClick={() => { props.setActiveTab('MilestonesBtn'); props.updateAutoOpenCreateRisk(); }}>Milestones</div></li>
                    <li className='breadcrumb-level'><div onClick={() => { props.setActiveTab('RiskAssessmentsBtn'); props.updateAutoOpenCreateRisk(); }}>Risk Assessment</div></li>
                </ol>
            </Row> */}

            {props.activeTab == 'QuadViewBtn' && <>
                <Row className='QuadViewRow1' style={{ marginLeft: "0%" }}>
                    <Col md={6} className='Accomplishments'>
                        <DataGrid
                            noDataText='No accomplishments to display. Please create it by navigating to Accomplishments tab.'
                            className='summaryGrid AccomGrid'
                            ref={ref => { AccomGridRef.current = ref }}
                            wordWrapEnabled
                            showRowLines
                            showBorders
                            showColumnLines
                            allowColumnResizing
                            allowColumnReordering
                            dataSource={checked?.PPAccomplishment ?
                                PPDataRef.current?.accomData?.filter(rec => rec.Active && rec.IsDeleted != true) :
                                PPDataRef.current?.accomData?.filter(rec => rec.IsDeleted != true)}
                            selectedRowKeys={selectedRowsRef.current?.Accom}
                            onOptionChanged={e => handleOptionChange('Accom', e)}
                            onRowPrepared={rowData => {
                                if (!rowData?.data?.Active) {
                                    rowData.rowElement.classList.remove('dx-data-row');
                                    rowData.rowElement.classList.add('disableInActiveRow');
                                }
                                else rowData.rowElement.classList.add('gridRowCls');
                            }}
                        >
                            <Toolbar>
                                <Item location={'after'}>
                                    <span className='gridHeader1'>Accomplishments</span>
                                </Item>
                                <Item location={'after'}>
                                    <Button className='p-button-rounded toggleBtnPP' >
                                        <span className='toggleBtnTxtPP toggleBtnTxt1' >All</span>
                                        <InputSwitch checked={checked['PPAccomplishment']} onChange={e => setChecked(prevState => ({ ...prevState, ['PPAccomplishment']: e.value }))} />
                                        <span className='toggleBtnTxtPP toggleBtnTxt2' >Active</span>
                                    </Button>
                                </Item>
                            </Toolbar>
                            <ColumnFixing enabled={true} />
                            <Selection mode='multiple' showCheckBoxesMode={'always'} />
                            <Column
                                caption='Accomplishment'
                                dataField={'Task'}
                                dataType='string'
                                alignment={'left'}
                                width='70%'
                                allowSorting
                                cellRender={e => attachCellTemplate(e.data.Task, e.data.AttachmentData)} />
                            <Column
                                caption='Date'
                                dataField={'Date'}
                                dataType={'date'}
                                format='MMM-dd-yyyy'
                                alignment={'center'}
                                width='20%'
                                allowSorting />
                        </DataGrid>
                    </Col>

                    <Col md={6} className='PP_Milestone'>
                        <DataGrid
                            noDataText='No milestones to display. Please create it from Project Center.'
                            dataSource={PPDataRef.current?.milestoneData}
                            className='summaryGrid MilestoneGrid'
                            ref={ref => { MilestoneGridRef.current = ref }}
                            wordWrapEnabled
                            showRowLines
                            showBorders
                            showColumnLines
                            allowColumnResizing
                            allowColumnReordering
                            selectedRowKeys={selectedRowsRef.current?.Milestone}
                            onOptionChanged={e => handleOptionChange('Milestone', e)}
                            columnMinWidth={1}
                            columnAutoWidth={true}
                        >
                            <Toolbar>
                                <Item location={'after'}>
                                    <span className='gridHeader2'>Milestones (Project Center)</span>
                                </Item>
                            </Toolbar>
                            <ColumnFixing enabled={true} />
                            <Selection mode='multiple' showCheckBoxesMode={'always'} />

                            <Column
                                caption='NPL T6'
                                dataField={'NPLT6Milestone'}
                                dataType='boolean'
                                alignment={'center'}
                                allowSorting
                                cellRender={DeepDiveTemplateCheckBox}
                            />
                            <Column
                                caption='Milestone/Deliverables'
                                dataField={'TaskName'}
                                dataType='string'
                                alignment={'left'}
                            />
                            <Column
                                caption='Target Date'
                                dataField={'TaskFinishDate'}
                                dataType={'date'}
                                alignment={'left'}
                                format='MMM-dd-yyyy'
                                width={"20%"}
                            />
                            <Column
                                caption='Status'
                                dataField={'LaunchHealth'}
                                alignment={'center'}
                                dataType={'string'}
                                cellRender={statusCol}
                                width={"20%"}
                            />
                        </DataGrid>
                    </Col>
                </Row>

                <Row className='QuadViewRow2' style={{ marginLeft: "0%" }}>

                    <Col md={6} className='PP_Activities'>
                        <DataGrid
                            noDataText='No upcoming activities to display. Please create it by navigating to Upcoming Activities tab.'
                            dataSource={checked?.PPActivities ?
                                PPDataRef.current?.activityData?.filter(rec => rec.Active && rec.IsDeleted != true) :
                                PPDataRef.current?.activityData?.filter(rec => rec.IsDeleted != true)}
                            className='summaryGrid ActGrid'
                            wordWrapEnabled
                            ref={ref => { ActivitiesGridRef.current = ref }}
                            showRowLines
                            showColumnLines
                            showBorders
                            allowColumnResizing
                            allowColumnReordering
                            selectedRowKeys={selectedRowsRef.current?.Activities}
                            onOptionChanged={e => handleOptionChange('Activities', e)}
                            onRowPrepared={rowData => {
                                if (!rowData?.data?.Active) {
                                    rowData.rowElement.classList.remove('dx-data-row');
                                    rowData.rowElement.classList.add('disableInActiveRow');
                                }
                                else rowData.rowElement.classList.add('gridRowCls');
                            }}
                        >
                            <Toolbar>
                                <Item location={'after'}>
                                    <span className='gridHeader1'>Upcoming Activities</span>
                                </Item>
                                <Item location={'after'}>
                                    <Button className='p-button-rounded toggleBtnPP' >
                                        <span className='toggleBtnTxtPP toggleBtnTxt1' >All</span>
                                        <InputSwitch checked={checked['PPActivities']} onChange={e => setChecked(prevState => ({ ...prevState, ['PPActivities']: e.value }))} />
                                        <span className='toggleBtnTxtPP toggleBtnTxt2' >Active</span>
                                    </Button>
                                </Item>
                            </Toolbar>
                            <ColumnFixing enabled={true} />
                            <Selection mode='multiple' showCheckBoxesMode={'always'} />

                            <Column
                                caption='Upcoming Activities'
                                dataField={'Activity'}
                                dataType='string'
                                alignment={'left'}
                                width='45%'
                                allowSorting
                                cellRender={e => attachCellTemplate(e.data.Activity, e.data.AttachmentData)} />
                            <Column
                                caption='Date'
                                dataField={'Date'}
                                dataType={'date'}
                                format='MMM-dd-yyyy'
                                alignment={'center'}
                                width='25%'
                                allowSorting />
                            <Column
                                caption='Status'
                                dataField={'Status'}
                                dataType={'string'}
                                alignment={'center'}
                                width='30%'
                                allowSorting
                                cellRender={StatusTemplate}
                            />
                        </DataGrid>
                        {/* </div> */}
                    </Col>

                    <Col md={6} className='PP_RiskAssessment'>
                        <DataGrid
                            noDataText='No risk assessments to display. Please create it by navigating to Risk Assessment tab.'
                            dataSource={checked?.PPRiskAssessment ?
                                PPDataRef.current?.riskAssessmentData?.filter(rec => rec.Active && rec.IsDeleted != true) :
                                PPDataRef.current?.riskAssessmentData?.filter(rec => rec.IsDeleted != true)}
                            className='summaryGrid RiskAssGrid'
                            ref={ref => { RiskAssGridref.current = ref }}
                            showRowLines
                            showColumnLines
                            showBorders
                            allowColumnResizing
                            allowColumnReordering
                            columnMinWidth={1}
                            columnAutoWidth={true}
                            selectedRowKeys={selectedRowsRef.current?.RiskAss}
                            onOptionChanged={e => handleOptionChange('RiskAss', e)}
                            onRowPrepared={rowData => {
                                if (!rowData?.data?.Active) {
                                    rowData.rowElement.classList.remove('dx-data-row');
                                    rowData.rowElement.classList.add('disableInActiveRow');
                                }
                                else rowData.rowElement.classList.add('gridRowCls');
                            }}
                        >
                            <Toolbar>
                                <Item location={'after'}>
                                    <span className='gridHeader2'>Risk Assessment</span>
                                </Item>
                                <Item location={'after'}>
                                    <Button className='p-button-rounded toggleBtnPP' >
                                        <span className='toggleBtnTxtPP toggleBtnTxt1' >All</span>
                                        <InputSwitch checked={checked['PPRiskAssessment']} onChange={e => setChecked(prevState => ({ ...prevState, ['PPRiskAssessment']: e.value }))} />
                                        <span className='toggleBtnTxtPP toggleBtnTxt2' >Active</span>
                                    </Button>
                                </Item>
                            </Toolbar>
                            <ColumnFixing enabled={true} />
                            <Selection mode='multiple' showCheckBoxesMode={'always'} />

                            <Column
                                caption='NPL T6'
                                dataField={'DeepDive'}
                                dataType='boolean'
                                alignment={'center'}
                                allowSorting
                                cellRender={DeepDiveTemplateCheckBox}
                            />
                            <Column
                                caption='Risk/Issue'
                                dataField={'RiskTitle'}
                                dataType='string'
                                alignment={'left'}
                                allowSorting
                            />
                            <Column
                                caption='Risk Category'
                                dataField={'DeepDiveRiskCategory'}
                                dataType='string'
                                alignment={'left'}
                                allowSorting
                            />
                            <Column
                                caption='Risk Date'
                                dataField={'RiskDate'}
                                dataType={'date'}
                                format='MMM-dd-yyyy'
                                alignment={'center'}
                                allowSorting
                            />
                            <Column
                                caption='Risk Status'
                                dataField={'RiskStatus'}
                                dataType={'string'}
                                alignment={'center'}
                                allowSorting
                                cellRender={StatusTemplate}
                            />
                            <Column
                                caption='Mitigation'
                                dataField={'Mitigation'}
                                dataType={'string'}
                                alignment={'center'}
                                allowSorting
                            />
                            <Column
                                caption='Mitigation Date'
                                dataField={'MitigationDate'}
                                dataType={'date'}
                                format='MMM-dd-yyyy'
                                alignment={'center'}
                                allowSorting
                            />
                            <Column
                                caption='Mitigation Status'
                                dataField={'MitigationStatus'}
                                dataType={'string'}
                                alignment={'center'}
                                allowSorting
                                cellRender={StatusTemplate}
                            />
                        </DataGrid>
                    </Col>
                </Row>
            </>}

            {props.activeTab == 'AccomplishmentsBtn' && <>
                <Accomplishments
                    selectedprojectName={props.selectedProject?.ProjectName}
                    ParentMode={props.programMode}
                    ParentID={props.ParentID}
                    attachURL={attachURL.current}
                    index={PPDataRef.current['accomIndex']}
                    data={PPDataRef.current['accomData']}
                    handleUnmount={handleAccomplishmentsUnmount}
                    SelectedProjects={props.selectedProject}
                />
            </>}

            {props.activeTab == 'ActivitiesBtn' && <>
                <Activities
                    selectedprojectName={props.selectedProject?.ProjectName}
                    ParentMode={props.programMode}
                    ParentID={props.ParentID}
                    attachURL={attachURL.current}
                    index={PPDataRef.current['activityIndex']}
                    data={PPDataRef.current['activityData']}
                    handleUnmount={handleActivitiesUnmount}
                />
            </>}

            {props.activeTab == 'MilestonesBtn' && <>
                <PPMilestones
                    selectedprojectName={props.selectedProject?.ProjectName}
                    milestoneData={PPDataRef.current['milestoneData']}
                />
            </>
            }

            {props.activeTab == 'RiskAssessmentsBtn' && <>
                <RiskAssessment
                    updateAutoOpenCreateRisk={props.updateAutoOpenCreateRisk}
                    autoOpenRiskItemId={props.autoOpenRiskItemId}
                    autoOpenNewRiskWindow={props.openCreateRiskWindow}
                    nplt6={props.selectedProject?.DeepDive}
                    selectedprojectName={props.selectedProject?.ProjectName}
                    ParentMode={props.programMode}
                    ParentID={props.ParentID}
                    attachURL={attachURL.current}
                    index={PPDataRef.current['riskAssessmentIndex']}
                    data={PPDataRef.current['riskAssessmentData']}
                    handleUnmount={handleRiskAssUnmount}
                />
            </>}
        </>
    );
}
