import * as React from 'react';
//import { useRef } from 'react';
import { INPLT6Dashboard } from "../NPLT6Dashboard/INPLT6Dashboard";
// import 'devextreme/dist/css/dx.common.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'devextreme-react/text-area';
// import 'devextreme/dist/css/dx.light.css';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Row, Col } from 'reactstrap';
import { DataService } from '../../Shared/DataService';
import './NPLT6Dashboard.css';
import { format } from 'date-fns';
import DataGrid, { Column, ColumnFixing, Scrolling, Toolbar, Item } from 'devextreme-react/data-grid';
import { CalculateCellValueTemplate, StatusTemplate } from './TemplateComponent';
import { InputText } from 'primereact/inputtext';
//import GetDeepDiveMilestonesAndRiskAssessments from './GetDeepDiveMilestonesAndRiskAssessments';
import DDKeyMilestones from './DDKeyMilestones';
import DDRiskAssessments from './DDRiskAssessments';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { StatusValues } from '../../Shared/DataService';
import DDPPTReport from './DDPPTReport';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';



//let headerFieldColorsRef = useRef({ LRbgColor: '', LRTextColor: '', SCbgColor: '', SCTextColor: '' });
export default class NPLT6Dashboard extends React.Component<INPLT6Dashboard, any>{
    public headerFieldColorsRef: any;
    public toastRef: any;
    public selectedRowsRef: any;
    constructor(public props: INPLT6Dashboard, public state: any) {
        super(props);
        this.state = {
            isLoading: true,
            activeTab: 'QuadViewBtn',
            ProjectCenterPlans: [],
            ExeAppRisks: [],
            SupplyChainDataAll: [],
            BSCRecords: [],
            RiskAssRecords: []
        }
        this.headerFieldColorsRef = React.createRef();
        this.headerFieldColorsRef.current = { LRbgColor: '', LRTextColor: '', SCbgColor: '', SCTextColor: '' }
        this.toastRef = React.createRef();
        this.selectedRowsRef = React.createRef();
        this.selectedRowsRef.current = { 'DDKeyMilestones': [], 'DDRiskAssessments': [], 'DDSupplyChain': [] };
    }

    // Intitial method to get the data
    public componentDidMount = async () => {
        try {
            this.getHeaderColors();
            this.setState({
                isLoading: false
            });
        }
        catch (error) {
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    callbackFunction = (key, childData) => {
        try {
            if (key == "ProjectPlan") {
                this.props.parentCallback("ProjectPlan", childData);
                // this.setState({
                //     ProjectCenterPlans: childData,
                // })
            }
            if (key == "BSC") {
                this.props.parentCallback("BSC", childData);

                // this.setState({
                //     BSCRecords: childData
                // })
                //this.props.BSCDataAll(childData);               
            }
            if (key == "ExeAppRisks") {
                this.props.parentCallback("ExeAppRisks", childData);
                // this.setState({
                //     ExeAppRisks: childData,
                // })
            }
            if (key == "RiskAssRecords") {
                this.props.parentCallback("RiskAssRecords", childData);
                // this.setState({
                //     RiskAssRecords: childData
                // })
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    public getHeaderColors = () => {
        try {
            this.headerFieldColorsRef.current['LRbgColor'] = StatusValues.filter(ele => ele.label == this.props.programData?.['LaunchReadinessStatus'])?.[0]?.['bgColor'];
            this.headerFieldColorsRef.current['LRTextColor'] = StatusValues.filter(ele => ele.label == this.props.programData?.['LaunchReadinessStatus'])?.[0]?.['color'];
            this.headerFieldColorsRef.current['SCbgColor'] = StatusValues.filter(ele => ele.label == this.props.programData?.['SupplyContinuityRisk'])?.[0]?.['bgColor'];
            this.headerFieldColorsRef.current['SCTextColor'] = StatusValues.filter(ele => ele.label == this.props.programData.SupplyContinuityRisk)?.[0]?.['color'];
        } catch (error) {
            let errorMsg = {
                Source: 'DeepDive-getHeaderColors',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    public getFormFields = async () => {
        try {
            await DataService.getRequestListDataNPD('NPLXFormFields', 'ColOrder').then((data) => {
                let oneSrcColor = data.filter(item => item.Source == 'OneSource' && item.sourceColor != null && item.sourceColor != undefined && item.SourceColor != '');
                let DRColor1 = data.filter(item => item.Source == 'DR' && item.sourceColor != null && item.sourceColor != undefined && item.SourceColor != '');
                let legendColorObj = {
                    OneSource: oneSrcColor?.[0]?.['sourceColor'],
                    DR: DRColor1?.[0]?.['sourceColor'],
                    GLOW: data.filter(item => item.Source == 'GLOW' && item.sourceColor != null && item.sourceColor != undefined && item.SourceColor != '')?.[0]?.['sourceColor'],
                };
                this.setState({ legendColors: legendColorObj });
            });
        } catch (error) {
            let errorMsg = {
                Source: 'DeepDive-getHeaderColors',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    public handleExportClick = () => {
        if (this.props.isProgramDataModified) {
            this.toastRef.current.clear();
            this.toastRef.current.show({
                severity: 'warn',
                summary: 'NPL T6 modified',
                detail: 'Please save the changes before exporting !!',
                position: 'bottom-right',
                life: '3000'
            });
            return;
        }
        try {
            //let modifiedMilestones = this.state.BSCRecords?.filter(rec => rec?.IsModified == true);
            let modifiedMilestones = this.props.BSCDataAll?.filter(rec => rec?.IsModified == true);
            let modifiedSupplyChainRecords = this.props.SupplyChainData?.filter(rec => rec.IsModified == true);
            let modifiedRiskAssessments = this.props.PPRiskAssessmentsAll?.filter(rec => rec?.IsModified == true);
            let ModifiedProjectPlansRec = this.props.ProjectCenterPlans?.filter(rec => rec.IsModified == true);
            let ModifiedExeAppRisks = this.props.ExeAppRisks?.filter(rec => rec.IsModified == true);
            if (this.props.LaunchXlist?.IsModified == true || modifiedMilestones?.length > 0 || modifiedSupplyChainRecords?.length > 0 || modifiedRiskAssessments?.length > 0 || ModifiedProjectPlansRec?.length > 0 || ModifiedExeAppRisks?.length > 0) {
                this.toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please save before exporting!!', position: 'bottom-right', life: '3000' });
            } else {
                let milestoneData = [...cloneDeep(this.props.ProjectCenterPlans)?.filter(rec => rec.showInNPLT6Report == true), ...cloneDeep(this.props.BSCDataAll.filter(rec => rec.IsDeepDive && rec.IsActive && rec.showInNPLT6Report == true && rec.TargetDateStatus != '01->New'))]?.filter(rec => rec.showInNPLT6Report);
                let DDRiskData = [...cloneDeep(this.props.ExeAppRisks)?.filter(rec => rec.showInNPLT6Report == true), ...cloneDeep(this.props.PPRiskAssessmentsAll?.filter(rec => rec.IsDeepDive && rec.IsActive && rec.showInNPLT6Report == true))]?.filter(rec => rec.showInNPLT6Report);
                if (milestoneData?.length <= 5 && DDRiskData?.length <= 5) {
                    let DeepDiveDataArr = {
                        'DDSupplyChain': this.props.SupplyChainData.filter(rec => rec.IsDeepDive && rec.IsDeleted != true),
                        'DDRiskAssessments': [...cloneDeep(this.props.ExeAppRisks), ...cloneDeep(this.props.PPRiskAssessmentsAll.filter(rec => rec.IsDeepDive && rec.IsActive))],
                        'DDKeyMilestones': [...cloneDeep(this.props.ProjectCenterPlans), ...cloneDeep(this.props.BSCDataAll.filter(rec => rec.IsDeepDive && rec.IsActive))],
                        'DDCogs': this.props.programData?.COGSNetPrice,
                        'ForecastImg': this.props.programData?.AttachmentFiles,
                        'DDLaunchReadiness': this.props.programData?.LaunchReadinessStatus,
                        'DDSupplyContinuity': this.props.programData?.SupplyContinuityRisk
                    }; //LaunchReadinessStatus SupplyContinuityRisk COGSNetPrice 
                    let attachURL = '';
                    if (DataService.NPDUrl == 'https://pfizer.sharepoint.com/sites/LaunchXNPD') {
                        attachURL = 'https://pfizer.sharepoint.com/sites/NPL_Digital_Apps/_layouts/download.aspx?SourceUrl=';
                    } else if (DataService.NPDUrl == 'https://pfizer.sharepoint.com/sites/LaunchXNPD_QA') {
                        attachURL = 'https://pfizer.sharepoint.com/sites/NPL_Digital_Apps_QA/_layouts/download.aspx?SourceUrl=';
                    } else {
                        attachURL = 'https://pfizer.sharepoint.com/sites/NPL_Digital_Apps_Dev/_layouts/download.aspx?SourceUrl=';
                    }
                    if (this.selectedRowsRef.current['DDKeyMilestones'].length > 5) {
                        this.toastRef.current.clear();
                        this.toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select maximum of 5 Key Milestones!!', position: 'bottom-right', life: '3000' });
                    }
                    else if (this.selectedRowsRef.current['DDRiskAssessments'].length > 5) {
                        this.toastRef.current.clear();
                        this.toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select maximum of 5 Risk Assessments!!', position: 'bottom-right', life: '3000' });
                    }
                    else if (this.selectedRowsRef.current['DDSupplyChain'].length > 5) {
                        this.toastRef.current.clear();
                        this.toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select maximum of 5 Supply Chain Markets!!', position: 'bottom-right', life: '3000' });
                    }
                    else
                        DDPPTReport(DeepDiveDataArr, this.selectedRowsRef.current, this.props.LaunchXlist, DataService.NPDUrl, attachURL);
                } else {
                    this.toastRef.current.show({ severity: 'warn', summary: '', detail: 'Please select max of 5 records!!', position: 'bottom-right', life: '3000' });

                }
            }
        } catch (error) {
            let errorMsg = {
                Source: 'DeepDive-handleExportClick',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };


    public render(): React.ReactElement<INPLT6Dashboard> {
        return (
            <>
                <LoadSpinner isVisible={this.state.isLoading == true} label='Please wait...' />
                <Toast ref={this.toastRef} position='bottom-right' />
                <Row style={{ marginBottom: '0.4rem', marginTop: '-0.5rem' }}>
                    <Col md={6} sm={6} style={{ display: 'flex', alignItems: 'center' }}>
                        <Button className={this.state.activeTab == 'QuadViewBtn' ? 'QuadViewBtn TabBtn' : 'TabBtn'} label='Summary View' onClick={() => this.setState({ activeTab: 'QuadViewBtn' })} />
                        <Button className={this.state.activeTab == 'KeyMilestonesBtn' ? 'KeyMilestonesBtn TabBtn' : 'TabBtn'} label='Key Milestones' onClick={() => this.setState({ activeTab: 'KeyMilestonesBtn' })} />
                        <Button className={this.state.activeTab == 'RiskAssessmentsBtn' ? 'RiskAssessmentsBtn TabBtn' : 'TabBtn'} label='Risk Assessment' onClick={() => this.setState({ activeTab: 'RiskAssessmentsBtn' })} />
                    </Col>
                    <Col md={6} sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <table>
                            <tr>
                                <th className='label'>NPL T6 Launch Readiness</th>
                                <th className='label'>Supply Continuity Risk</th>
                                <th className='label'>Co-Dev Lead</th>
                                <th className='label'>Launch Lead</th>
                            </tr>
                            <tr>
                                <td className='value val1' style={{ backgroundColor: `${this.headerFieldColorsRef.current['LRbgColor']}`, color: `${this.headerFieldColorsRef.current['LRTextColor']}` }}>{this.props.programData?.['LaunchReadinessStatus']}</td>
                                <td className='value' style={{ backgroundColor: `${this.headerFieldColorsRef.current['SCbgColor']}`, color: `${this.headerFieldColorsRef.current['SCTextColor']}` }}>{this.props.programData?.['SupplyContinuityRisk']}</td>
                                <td className='value'>{this.props.LaunchXlist?.['Co_x002d_devLead'] ? this.props.LaunchXlist?.['Co_x002d_devLead'] : ''}</td>
                                <td className='value'>{this.props.LaunchXlist?.['LaunchLead'] ? this.props.LaunchXlist?.['LaunchLead'] : '  '}</td>
                            </tr>
                        </table>
                        <Button label='Export' className='DDexportBtn' icon={'pi pi-download'} onClick={this.handleExportClick} />
                    </Col>
                </Row>
                {this.state.activeTab == 'QuadViewBtn' &&
                    <>
                        <Row className='QuadViewRow1'>
                            <Col md={6} className='Accomplishments'>
                                <span className='deepDiveQuad1Header'>Product Details & Supply Chain</span>
                                <Row className='DDKeyProdDetailsRow'>
                                    <Col md={8} className='DeepDiveKeyProdCol'>
                                        <Row className='keyProdDiv'>
                                            <Col md={4} className=' DDKeyProdLabel' title='Mechanism of Action'>Mechanism:</Col>
                                            <Col md={8} style={{ borderLeft: `5px solid ${this.props.legendColors?.OneSource}` }} className={this.props.LaunchXlist?.['MechanismOfAction'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'} >{this.props.LaunchXlist ? this.props.LaunchXlist?.['MechanismOfAction'] : '   '}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={4} className='DeepDiveKeyProdCol'>
                                        <Row className='keyProdDiv'>
                                            <Col md={5} className=' DDKeyProdLabel'>Peak Revenue:</Col>
                                            <Col md={7} className={'DDkeyProdVal'}>{this.props.LaunchXlist?.PeakRevenue?.includes('->') ? this.props.LaunchXlist?.['PeakRevenue'].split('->')?.[1] : this.props.LaunchXlist?.['PeakRevenue']}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={8} className='DeepDiveKeyProdCol'>
                                        <Row className='keyProdDiv'>
                                            <Col md={4} className=' DDKeyProdLabel'>Indication:</Col>
                                            <Col md={8} style={{ borderLeft: `5px solid ${this.props.legendColors?.OneSource}` }} className={this.props.LaunchXlist?.['Indication'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'}>{this.props.LaunchXlist?.['Indication'] ? this.props.LaunchXlist?.['Indication'] : '   '}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={4} className='DeepDiveKeyProdCol'>
                                        <Row className='keyProdDiv'>
                                            <Col md={5} className=' DDKeyProdLabel'>Submission:</Col>
                                            {/* <Col md={7} style={{ borderLeft: `5px solid ${props.legendColors.OneSource}` }} className={CurrentProgramData_R?.['EarliestSubmissionDate'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'}>{CurrentProgramData_R['EarliestSubmissionDate'] ? format(new Date(CurrentProgramData_R['EarliestSubmissionDate']), 'MMM-dd-yyyy') : ' '}</Col> */}
                                            <Col md={7} style={{ borderLeft: `5px solid ${this.props.legendColors?.OneSource}` }} className={this.props.LaunchXlist?.['EarliestSubmissionDate'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'}>{this.props.LaunchXlist?.['EarliestSubmissionDate'] ? format(new Date(this.props.LaunchXlist?.['EarliestSubmissionDate']), 'MMM-dd-yyyy') : ' '}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={8} className='DeepDiveKeyProdCol'>
                                        <Row className='keyProdDiv'>
                                            <Col md={4} className=' DDKeyProdLabel'>Primary Formulation:</Col>
                                            {/* <Col md={8} style={{ borderLeft: `5px solid ${props.legendColors.OneSource}` }} className={CurrentProgramData_R?.['Category'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'}>{CurrentProgramData_R?.['Category'] ? CurrentProgramData_R?.['Category'] : '   '}</Col> */}
                                            <Col md={8} style={{ borderLeft: `5px solid ${this.props.legendColors?.OneSource}` }} className={this.props.LaunchXlist?.['Category'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'}>{this.props.LaunchXlist?.['Category'] ? this.props.LaunchXlist?.['Category'] : '   '}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={4} className='DeepDiveKeyProdCol'>
                                        <Row className='keyProdDiv'>
                                            <Col md={5} className=' DDKeyProdLabel'>Approval:</Col>
                                            {/* <Col md={7} style={{ borderLeft: `5px solid ${props.legendColors.OneSource}` }} className={CurrentProgramData_R?.['EarliestApprovalDate'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'}>{CurrentProgramData_R['EarliestApprovalDate'] ? format(new Date(CurrentProgramData_R['EarliestApprovalDate']), 'MMM-dd-yyyy') : ' '}</Col> */}
                                            <Col md={7} style={{ borderLeft: `5px solid ${this.props.legendColors?.OneSource}` }} className={this.props.LaunchXlist?.['EarliestApprovalDate'] ? 'DDkeyProdVal oneSrcKeyProdVal' : 'DDkeyProdVal'}>{this.props.LaunchXlist?.['EarliestApprovalDate'] ? format(new Date(this.props.LaunchXlist?.['EarliestApprovalDate']), 'MMM-dd-yyyy') : ' '}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <DataGrid
                                    className='AccomGrid DDSupplyChainGrid'
                                    //ref={ref => SupplyChainGridRef.current = ref}
                                    wordWrapEnabled
                                    showRowLines
                                    showBorders
                                    showColumnLines
                                    allowColumnResizing
                                    allowColumnReordering
                                    dataSource={this.props.SupplyChainData.filter(rec => rec.IsDeepDive && rec.IsDeleted != true)}
                                // selectedRowKeys={selectedRowsRef.current['DDSupplyChain']}
                                // onOptionChanged={e => handleOptionChange('DDSupplyChain', e)}
                                >
                                    <ColumnFixing enabled={true} />
                                    {/* <Column type='selection' width={50} /> */}
                                    <Column
                                        caption='RSM'
                                        dataField={'RSMIntermediateSite'}
                                        dataType='string'
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'RSMIntermediateSite')}
                                        alignment={'left'}
                                        width='22%'
                                        allowSorting />
                                    <Column
                                        caption='API/DS'
                                        dataField={'DS_x002f_APISite'}
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'DS_x002f_APISite')}
                                        alignment={'left'}
                                        width='17%'
                                        allowSorting />
                                    <Column
                                        caption='DP'
                                        dataField={'DPSite'}
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'DPSite')}
                                        alignment={'left'}
                                        width='17%'
                                        allowSorting />
                                    <Column
                                        caption='Primary Pkg'
                                        dataField={'PPKGSite'}
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'PPKGSite')}
                                        alignment={'left'}
                                        width='22%'
                                        allowSorting />
                                    <Column
                                        caption='Secondary Pkg'
                                        dataField={'SPKGSite'}
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'SPKGSite')}
                                        alignment={'left'}
                                        width='22%'
                                        allowSorting />
                                    <Scrolling mode='infinite' />
                                </DataGrid>
                            </Col>
                            <Col md={6} className='PP_Milestone'>
                                <DataGrid
                                    //dataSource={[...cloneDeep(this.state.ProjectCenterPlans)?.filter(rec => rec.showInNPLT6Report == true), ...cloneDeep(this.state.BSCRecords.filter(rec => rec.IsDeepDive && rec.IsActive && rec.showInNPLT6Report == true && rec.TargetDateStatus != '01->New'))]}                                    
                                    dataSource={[...cloneDeep(this.props.ProjectCenterPlans).filter(rec => rec.showInNPLT6Report == true), ...cloneDeep(this.props.BSCDataAll.filter(rec => rec.IsDeepDive && rec.IsActive && rec.showInNPLT6Report == true && rec.TargetDateStatus != '01->New'))]}
                                    className='summaryGrid MilestoneGrid'
                                    //ref={ref => keyMilestoneGridRef.current = ref}
                                    wordWrapEnabled
                                    showRowLines
                                    showBorders
                                    showColumnLines
                                    allowColumnResizing
                                    allowColumnReordering
                                    noDataText='Kindly select the milestones from Key Milestones tab'
                                    // selectedRowKeys={selectedRowsRef.current['DDKeyMilestones']}
                                    // onOptionChanged={e => handleOptionChange('DDKeyMilestones', e)}
                                    onRowPrepared={rowData => {
                                        if (!rowData?.data?.IsActive) {
                                            rowData.rowElement.classList.remove('dx-data-row');
                                            rowData.rowElement.classList.add('disableInActiveRow');
                                        }
                                        else rowData.rowElement.classList.add('gridRowCls');
                                    }}
                                >
                                    <Toolbar>
                                        <Item location={'after'}>
                                            <span className='gridHeader2'>Milestones</span>
                                        </Item>
                                    </Toolbar>
                                    <ColumnFixing enabled={true} />
                                    <Column
                                        caption='Milestone/Deliverables'
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'Milestone')}
                                        dataField={'Milestone'}
                                        dataType='string'
                                        width='29%' />
                                    <Column
                                        caption='Milestone Description'
                                        dataField={'MilestoneDescription'}
                                        dataType={'string'}
                                        width='33%'
                                        alignment={'left'} />
                                    <Column
                                        caption='Target Date'
                                        dataField={'TargetDate'} sortOrder={'desc'}
                                        dataType={'date'}
                                        alignment={'center'}
                                        format='MMM yyyy'
                                        width='18%'
                                    />
                                    <Column
                                        caption='Milestone Status'
                                        dataField={'MilestoneOnTrackMet'}
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'MilestoneOnTrackMet')}
                                        cellRender={StatusTemplate}
                                        dataType={'string'}
                                        width='20%'
                                    />
                                    <Scrolling mode='infinite' />
                                    {/* <Selection mode='multiple' showCheckBoxesMode={'always'} /> */}
                                </DataGrid>
                            </Col>
                        </Row>
                        <Row className='QuadViewRow2'>
                            <Col md={6} className='PP_Activities'>
                                {/* </div> */}
                                <span className='deepDiveQuad1Header'>Forecast & Capacity</span>
                                <Row className='DDForecastFields'>
                                    <Col md={6}>
                                        <label>COGS % Net Price</label>
                                        {/* <InputText disabled style={{ borderLeft: `5px solid ${props.legendColors.DR}`, borderRadius: '6px' }} value={CurrentProgramGLOWDetails_R?.['COGSNetPrice']} /> */}
                                        <InputText disabled style={{ borderLeft: `5px solid `, borderRadius: '6px' }} value={this.props.programData?.COGSNetPrice} />
                                    </Col>
                                    <span style={{ fontWeight: 'bold', marginTop: '1%' }}> Forecast Image:</span>
                                    <Col md={12} className='DeepDiveForecastImgSection' style={{ marginTop: '3% !important' }}>
                                        {this.props.programData?.AttachmentFiles?.length > 0 &&
                                            <img src={this.props.programData?.AttachmentFiles[0]?.ServerRelativeUrl} className='GLOWForecastImg' width={600} height={200} />}

                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6} className='PP_RiskAssessment'>
                                {/* <div className='PP_RiskAssessment'> */}
                                <DataGrid
                                    //dataSource={[...cloneDeep(ExeAppRisks_R)?.filter(rec => rec.showInNPLT6Report == true), ...cloneDeep(this.state.RiskAssRecords.filter(rec => rec.IsDeepDive && rec.IsActive && rec.showInNPLT6Report == true))]}                                    
                                    dataSource={[...cloneDeep(this.props.ExeAppRisks)?.filter(rec => rec.showInNPLT6Report == true), ...cloneDeep(this.props.PPRiskAssessmentsAll.filter(rec => rec.IsDeepDive && rec.IsActive && rec.showInNPLT6Report == true))]}
                                    className='summaryGrid RiskAssGrid'
                                    //ref={ref => DDRiskAssGridRef.current = ref}
                                    wordWrapEnabled
                                    showRowLines
                                    showColumnLines
                                    showBorders
                                    allowColumnResizing
                                    allowColumnReordering
                                    noDataText='Kindly select the risks from Risk Assesment tab'
                                    // selectedRowKeys={selectedRowsRef.current['DDRiskAssessments']}
                                    // onOptionChanged={e => handleOptionChange('DDRiskAssessments', e)}
                                    // dataRowTemplate={RiskAssCustomRowTemplate}
                                    onRowPrepared={rowData => {
                                        if (!rowData?.data?.IsActive) {
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
                                    </Toolbar>
                                    <ColumnFixing enabled={true} />
                                    <Column
                                        caption='Risk/Issue'
                                        dataField={'RiskOrIssue'}
                                        dataType='string'
                                        alignment={'left'}
                                        width='50%'
                                        allowSorting />
                                    <Column
                                        caption='Risk Category'
                                        dataField={'RiskCategory'}
                                        dataType='string'
                                        alignment={'left'}
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'RiskCategory')}
                                        width='20%'
                                        allowSorting />
                                    <Column
                                        caption='Risk Status'
                                        dataField={'RiskStatus'}
                                        dataType={'string'}
                                        alignment={'center'}
                                        calculateCellValue={e => CalculateCellValueTemplate(e, 'RiskStatus')}
                                        cellRender={StatusTemplate}
                                        width='20%'
                                        allowSorting
                                    />
                                    <Scrolling mode='infinite' />
                                </DataGrid>
                            </Col>
                        </Row>
                    </>
                }
                {this.state.activeTab == 'KeyMilestonesBtn' &&
                    // <DDKeyMilestones userGroups={this.props.userGroups} ProjectCenterPlans={this.state.ProjectCenterPlans} BSCAllRecords={this.state.BSCRecords} parentCallback={this.callbackFunction} Mode= {this.props.Mode}/>
                    <DDKeyMilestones userGroups={this.props.userGroups} ProjectCenterPlans={this.props.ProjectCenterPlans} BSCAllRecords={this.props.BSCDataAll} parentCallback={this.callbackFunction} Mode={this.props.Mode} />
                }
                {this.state.activeTab == "RiskAssessmentsBtn" &&
                    <DDRiskAssessments userGroups={this.props.userGroups} ExeAppRisks={this.props.ExeAppRisks} RiskAssRecords={this.props.PPRiskAssessmentsAll} LaunchXlist={this.props.LaunchXlist} parentCallback={this.callbackFunction} Mode={this.props.Mode} />
                }
            </>
        )
    }
}