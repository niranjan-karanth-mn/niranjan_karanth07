import * as React from 'react';
import { IVerification } from "../Verification/IVerification";
// import { LaunchXService } from '../../Shared/DataService';
import 'devextreme/dist/css/dx.common.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'devextreme-react/text-area';
import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Toolbar, Item, Grouping, GroupPanel, SearchPanel, Pager, Paging, HeaderFilter, FilterRow, FilterPanel, Scrolling, Column } from 'devextreme-react/data-grid'; // { Toolbar, Item, Grouping, GroupPanel, SearchPanel, Pager, Paging, HeaderFilter, FilterRow, FilterPanel, Scrolling, Column }
import { Toast } from 'primereact/toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from "primereact/checkbox";
import "./Verification.css";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';
import edit from '../../../../../../src/webparts/assets/images/edit.png';
import { ListBox } from 'primereact/listbox';
import { Row, Col } from 'reactstrap';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { FieldControls } from '../../../../../utils/FieldControls';
import { StatusTemplate } from '../../Shared/TemplateComponent';
import { DataService } from '../../Shared/DataService';

export default class Verification extends React.Component<IVerification, any>{
    public toast: Toast;

    constructor(public props: IVerification, public state: any) {
        super(props);
        this.state = {
            isLoading: false,
            planViewRecords: [],
            SelectedColumnArray: [],
            QueryString: '',
            CommentsHistoryArray: [],
            reasonChangeOptions: [],
            IsColumnsAvialable: false,
            ReasonCodeDropdownOptions: [],
            HistoryColumns: [
                { "caption": "Notes", "dataField": "Notes", "width": "70%", "alignment": "left", "dataType": "string", "visible": true },
                { "caption": "Modified By", "dataField": "ModifiedBy", "width": "15%", "alignment": "left", "dataType": "string", "visible": true },
                { "caption": "Modified date", "dataField": "ModifiedDate", "width": "15%", "alignment": "left", "dataType": "date", "visible": true }
            ],
            showEditCommentsDialog: false,
            showReasonCodeDialog: false,
            activeRecord: null,
            selectedReasonCodes: [],
            activeRecordNotes: "",
            LauchProgress: [],
            LaunchStatus: [],
            ProjectInfo: []
        }
    }
    // Intitial method to get the data
    public componentDidMount = async () => {
        try {
            let verificationColumnsArray = await DataService.fetchVerificationColumns("GLO_VerificationColumns");
            //let plansResultsArray = this.props.plansResults.filter(item => item.ProjectName == this.props.rowData.ProjectName);
            let plansResultsArray = this.props.plansResults.filter(item => item.DRID == this.props.rowData.DRID);
            let uniqueLaunchProgress = [...new Set(this.props.plansResults.map(item => item.LaunchProgress))];
            let uniqueLaunchStatus = [...new Set(this.props.plansResults.map(item => item.LaunchStatus))];
            let lauchProgressArray = [];
            let lauchStatusArray = [];
            if (uniqueLaunchProgress.length > 0) {
                uniqueLaunchProgress.map((item) => {
                    if (item != null) {
                        lauchProgressArray.push({
                            name: item,
                            code: item
                        });
                    }
                });
            }
            if (uniqueLaunchStatus.length > 0) {
                uniqueLaunchStatus.map((item) => {
                    if (item != null) {
                        lauchStatusArray.push({
                            name: item,
                            code: item
                        });
                    }
                });
            }
            let reasonCode = await DataService.fetchVerificationDrodownValues("PGS_ReadinessVerification_Dict_ReasonCodes");
            let uniqueReasoncodes = [];
            if (reasonCode.length > 0) {
                reasonCode.map((item) => {
                    if (item != null && item != "" && item != undefined) {
                        uniqueReasoncodes.push({
                            Title: item.Title, //Description
                            Id: item.ID,
                            Description: item.Description,
                            name: item.Description,
                            code: item.Title,
                            PGSType: item.PGSType

                        });
                    }
                });
            }

            this.setState({
                IsColumnsAvialable: true,
                planViewRecords: plansResultsArray,
                SelectedColumnArray: verificationColumnsArray,
                ReasonCodeDropdownOptions: uniqueReasoncodes,
                LauchProgress: lauchProgressArray,
                LaunchStatus: lauchStatusArray
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

    // callback method
    protected callbackmethod = async () => {
        this.props.onChange(this.state.planViewRecords);
    }

    public ActionColumn(rowData: any, dataType: string, dataField: string) {
        try {
            let fieldValue = rowData.data[dataField]; // .filter(i => i.dataField);
            if (dataType == "dropdown" && dataField == "ReasonCodeLookUp") {
                return (
                    <div>
                        <MultiSelect value={rowData.data.ReasonCodeLookUp} options={this.state.ReasonCodeDropdownOptions} optionValue='Id' optionLabel='Description'
                            style={{ width: '240px' }} placeholder="Select" maxSelectedLabels={1} className="w-full md:w-20rem" onFocus={e => this.onDropdownChanged(e, rowData)} />
                    </div>
                );
            }
            if (dataType == "dropdown" && dataField == "LaunchProgress") {
                return (
                    <div>
                        <Dropdown value={rowData.data.LaunchProgress} disabled onChange={(e) => this.launchProgressOnchange(e, rowData, dataField)} options={this.state.LauchProgress} optionValue="code" optionLabel="name"
                            placeholder="Select a Launch Progress" className="w-full md:w-14rem" />
                    </div>
                );
            }
            if (dataType == "dropdown" && dataField == "LaunchStatus") {
                return (
                    <div>
                        <Dropdown value={rowData.data.LaunchStatus} disabled onChange={(e) => this.launchStatusOnchange(e, rowData, dataField)} options={this.state.LaunchStatus} optionValue="code" optionLabel="name"
                            placeholder="Select a launch Status" className="w-full md:w-14rem" />
                    </div>
                );
            }
            if (dataType == "checkbox") {
                return (
                    <Checkbox checked={fieldValue} disabled={this.props.Mode == "View" ? true : false} onChange={e => this.VerfiedOnchange(e, rowData, dataField)} ></Checkbox>
                );
            }
            if (dataType == "textbox") {
                return (
                    <div>
                        <InputTextarea rows={1} value={rowData.data.Notes} cols={30} onFocus={e => this.NotesOnchange(e, rowData)} />
                    </div>
                );
            }
            if (dataType == "Icon") {
                return (
                    <i className="pi pi-book" style={{ cursor: 'pointer' }} onClick={e => this.commentsHistoryOnchange(e, rowData)}></i>
                );
            }
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected onDropdownChanged = async (e: any, prmRowData) => {
        try {
            let planViewData = this.state.planViewRecords;
            let filteredIndex = planViewData.findIndex(item => item.ID == prmRowData.data.ID);
            this.setState({
                showReasonCodeDialog: true,
                activeRecord: prmRowData.data.ID,
                selectedReasonCodes: planViewData[filteredIndex]['ReasonCodeLookUp']
            });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected launchProgressOnchange = async (e: any, prmRowData, dataField) => {
        try {
            let planViewData = this.state.planViewRecords;
            let filteredIndex = planViewData.findIndex(item => item.ID == prmRowData.data.ID);
            planViewData[filteredIndex][dataField] = e.value;
            await this.setState({ plansResultsArray: planViewData }
                , () => { this.callbackmethod().catch(e => console.log(e)) })
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    protected launchStatusOnchange = async (e: any, prmRowData, dataField) => {
        try {
            let planViewData = this.state.planViewRecords;
            let filteredIndex = planViewData.findIndex(item => item.ID == prmRowData.data.ID);
            planViewData[filteredIndex][dataField] = e.value;
            await this.setState({ plansResultsArray: planViewData }
                , () => { this.callbackmethod().catch(e => console.log(e)) });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected VerfiedOnchange = async (e: any, prmRowData, dataField) => {
        try {
            let planViewData = this.state.planViewRecords;
            let filteredIndex = planViewData.findIndex(item => item.ID == prmRowData.data.ID);
            planViewData[filteredIndex][dataField] = e.checked;
            planViewData[filteredIndex]['IsModified'] = true;
            if (dataField == 'LaunchLeadVerified') {
                if (e.checked == true) {
                    planViewData[filteredIndex]['LaunchLeadVerifiedBy'] = this.props.currentUser.Title;
                } else {
                    planViewData[filteredIndex]['LaunchLeadVerifiedBy'] = "";
                }
            }
            await this.setState({ plansResultsArray: planViewData }
                , () => {
                    this.callbackmethod().catch(e => console.log(e))
                    this.props.handleVerificationDeepDiveChange(planViewData, prmRowData.data)
                });

            if (dataField === 'DeepDive') {
                let itemMatchingCount = this.props.NPL_modifiedProjects.filter(item =>
                    (item.Title === prmRowData.data.Title)).length;

                if (itemMatchingCount > 0) {
                    this.props.updateNplT6CheckedUnchecked(this.props.NPL_modifiedProjects.filter(item =>
                        !(item.Title === prmRowData.data.Title)))
                } else {
                    let tempProjectsArray: any[] = this.props.NPL_modifiedProjects
                    tempProjectsArray.push({
                        'ProjectName': prmRowData.data.ProjectName,
                        'Title': prmRowData.data.Title,
                        'NPLT6Change': e.checked
                    })
                    this.props.updateNplT6CheckedUnchecked(tempProjectsArray);
                }
            }

            await this.setState({ plansResultsArray: planViewData }
                , () => {
                    this.callbackmethod().catch(e => console.log(e));
                    this.props.handleVerificationDeepDiveChange(planViewData, prmRowData.data)
                });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected NotesOnchange = async (e: any, prmRowData) => {
        try {
            let projectInfoArr = [
                { "fieldName": "Project Name", "FieldType": "Text", "fieldValue": prmRowData.data.ProjectName, "width": "100%" },
                { "fieldName": "Launch Lead", "FieldType": "Text", "fieldValue": prmRowData.data.LaunchLead, "width": "50%" },
                { "fieldName": "Business Unit", "FieldType": "Text", "fieldValue": prmRowData.data.BusinessUnit, "width": "50%" },
                { "fieldName": "Launch Readiness Date", "FieldType": "Date", "fieldValue": prmRowData.data.TaskFinishDate, "width": "50%" },
                { "fieldName": "Market", "FieldType": "Text", "fieldValue": prmRowData.data.Market, "width": "25%" },
            ];
            // notes history 
            this.state.CommentsHistoryArray = [];
            await DataService.GetNotesCommetsHistory('PGS_Common_ProjectList', prmRowData.data.ID).then(res => {
                console.log(res);
                res?.Versions?.reverse();
                let initialValue = '';
                for (let i = 0; i < res?.Versions?.length; i++) {
                    let obj = {};
                    if (res.Versions[i].Notes != null && res.Versions[i].Notes != "" && res.Versions[i].Notes != undefined) {
                        if (initialValue != res.Versions[i].Notes) {
                            initialValue = res.Versions[i].Notes;
                            obj["Notes"] = res.Versions[i].Notes;
                            obj["ModifiedBy"] = res.Versions[i].Editor.LookupValue;
                            obj["ModifiedDate"] = res.Versions[i].Modified.split("T")[0];
                            this.state.CommentsHistoryArray.push(obj);
                        }

                    }
                }
            });

            this.setState({
                activeRecordNotes: prmRowData.data.Notes,
                activeRecord: prmRowData.data.ID,
                showEditCommentsDialog: true,
                ProjectInfo: projectInfoArr,
                CommentsHistoryArray: this.state.CommentsHistoryArray
            });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected commentsHistoryOnchange = async (e: any, prmRowData) => {
        try {
            this.state.CommentsHistoryArray = [];
            await DataService.GetNotesCommetsHistory('PGS_Common_ProjectList', prmRowData.data.ID).then(res => {
                console.log(res);
                for (let i = 0; i < res.Versions.length; i++) {
                    let obj = {};
                    if (res.Versions[i].Notes != null && res.Versions[i].Notes != "") {
                        obj["Notes"] = res.Versions[i].Notes;
                        obj["ModifiedBy"] = res.Versions[i].Editor.LookupValue;
                        obj["ModifiedDate"] = res.Versions[i].Modified.split("T")[0];
                        this.state.CommentsHistoryArray.push(obj);
                    }
                }
                this.setState({
                    IsComments: true,
                    CommentsHistoryArray: this.state.CommentsHistoryArray
                })
            });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    public ViewDialogIcon = () => {
        try {
            if (this.state.showReasonCodeDialog) {
                return (
                    <div className='p-dialog-titlebar-icon p-link'>
                        {this.props.Mode != "View" &&
                            <Button className='p-button-raised p-button-rounded okBtn' onClick={this.saveReasoncode} icon='dx-icon-save' label='Ok' />
                        }
                        <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({ showReasonCodeDialog: false, activeRecord: null, activeRecordNotes: "" })} icon='dx-icon-close' label='Close' />
                    </div>
                );
            }
            if (this.state.showEditCommentsDialog) {
                return (
                    <div className='p-dialog-titlebar-icon p-link'>
                        {this.props.Mode != "View" &&
                            <Button className='p-button-raised p-button-rounded okBtn' onClick={this.NotesOnchange1} icon='dx-icon-save' label='Ok' />
                        }
                        <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({ showEditCommentsDialog: false, activeRecord: null, activeRecordNotes: "", ProjectInfo: [] })} icon='dx-icon-close' label='Close' />
                    </div>
                );
            }
            if (this.state.IsComments) {
                return (
                    <div className='p-dialog-titlebar-icon p-link'>
                        <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({ IsComments: false, showEditCommentsDialog: false, showReasonCodeDialog: false, activeRecord: null, activeRecordNotes: "" })} icon='dx-icon-close' label='Close' />
                    </div>
                );
            }
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    public ActionCol(rowData: any) {
        try {
            return (
                <>
                    <div>
                        {/* <img title="View" alt="Card" src={view} onClick={(e) => this.Actionlink('View', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} /> */}
                        <img title="Edit" alt="Card" src={edit} onClick={(e) => this.Actionlink('Edit', rowData)} style={{ cursor: "pointer " }} />
                    </div>
                </>
            );
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    public Actionlink = (type, e) => {
        try {
            this.setState({
                activeRecordNotes: e.data.Notes,
                activeRecord: e.data.ID,
                showEditCommentsDialog: true,
            });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    public OnCheckbox = (flag: any, option: any) => {
        try {
            let selectedReasonCodesArr = this.state.selectedReasonCodes;
            if (flag == true) {
                //let selectedIndexs = planViewData[filteredIndex]['ReasonCodeLookUp'];
                //selectedIndexs.push(option.Id);
                selectedReasonCodesArr.push(option.Id);
            } else {
                //planViewData[filteredIndex]['ReasonCodeLookUp'].pop(option.Id);
                selectedReasonCodesArr = selectedReasonCodesArr.filter(i => i != option.Id);
            }
            this.setState({
                selectedReasonCodes: selectedReasonCodesArr,
                //planViewRecords: planViewData,
                //showEditCommentsDialog: true,
            });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected saveReasoncode = async () => {
        try {
            let planViewData = this.state.planViewRecords;
            let filteredIndex = planViewData.findIndex(item => item.ID == this.state.activeRecord);
            planViewData[filteredIndex]['ReasonCodeLookUp'] = this.state.selectedReasonCodes;
            planViewData[filteredIndex]['IsModified'] = true;
            this.setState({
                planViewRecords: planViewData,
                activeRecord: null,
                showReasonCodeDialog: false
            }, () => { this.callbackmethod().catch(e => console.log(e)) });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected NotesOnchange1 = async () => {
        try {
            let planViewData = this.state.planViewRecords;
            let filteredIndex = planViewData.findIndex(item => item.ID == this.state.activeRecord); // item => item.ID == prmRowData.data.ID
            planViewData[filteredIndex]['Notes'] = this.state.activeRecordNotes;
            planViewData[filteredIndex]['IsModified'] = true;
            this.setState({
                planViewRecords: planViewData,
                activeRecord: null,
                activeRecordNotes: "",
                showEditCommentsDialog: false
            }, () => { this.callbackmethod().catch(e => console.log(e)) });
        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected highlightSelected = (e) => {
        try {
            if ((this.props.SwitchedProjectPlanName == "All" || this.props.SwitchedProjectPlanName == null) && e.rowType == 'data' && e.data.ProjectName == this.props.rowData.ProjectName) {
                e.cellElement.style.backgroundColor = "#e3f2fd";
            }
            
            if (e.rowType != "header" && e.data.ProjectName != this.props.rowData.ProjectName && e.column?.dataField != "DeepDive" && e.column?.dataField != "ReasonCodeLookUp" && e.column?.dataField != "LaunchLeadVerified" && e.column?.dataField != "Notes") {
                e.cellElement.style.backgroundColor = "#eeeeee";
            }
            if (e.rowType == 'data' && e.data.IsModified == true) {
                e.cellElement.style.backgroundColor = "#e3f2fd";
            }
            if (e.rowType == 'data' && (this.props.SwitchedProjectPlanName != "All" && this.props.SwitchedProjectPlanName != null && e.data.ProjectName == this.props.SwitchedProjectPlanName)) {
                e.cellElement.style.backgroundColor = "#e3f2fd";
            }

        } catch (e) {
            let errorMsg = {
                Message: e.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    projectNameRender = (e) => {
        if ((e.data.ProjectName != null && e.data.ProjectName != ''))
            return (<a className='project-link' onClick={() => this.onProjClick(e.data.ProjectName)}>{e.data.ProjectName}</a>);
        else
            return (<span>{e.data.ProjectName}</span>);
    }

    onProjClick = (proj) => {
        let projLink = 'ms-project:osp|u|' + DataService.ProjectCenterUrl + '|g|c10ea28c-31c3-49a5-8977-f94f3fb79743|p|<>\\' + proj + '|r|0';
        window.open(projLink, '_blank');
    }

    public render(): React.ReactElement<IVerification> {
        const pageSizes = [10, 25, 50, 100, 'all'];
        const ReasonCodeyTemplate = (option: any) => {
            return (
                <div className="flex align-items-center">
                    <Checkbox className='ReasonCodeCheckBox' disabled={this.props.Mode === "View"} checked={this.state.selectedReasonCodes.indexOf(option.Id) != -1} onChange={e => this.OnCheckbox(e.checked, option)}> {option.name} </Checkbox>
                    <span className='ReasonCodeText' onClick={() => { if (this.props.Mode != "View") this.state.selectedReasonCodes.indexOf(option.Id) != -1 ? this.OnCheckbox(false, option) : this.OnCheckbox(true, option) }}>{option.name}</span>
                </div>
            );
        };
        return (
            <div className='' style={{ backgroundColor: "#f2f2f8" }}>
                <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' />
                <Toast ref={(el) => { this.toast = el }} position="bottom-right" />
                {this.state.IsColumnsAvialable ?
                    <DataGrid
                        dataSource={this.state.planViewRecords.filter(item => item.DRID == this.props.rowData.DRID)}
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        columnResizingMode={'widget'}
                        filterSyncEnabled={false}
                        showColumnLines={true}
                        rowAlternationEnabled={true}
                        showBorders={true}
                        showRowLines={false}
                        width='100%'
                        height={604}
                        hoverStateEnabled={true}
                        //columnMinWidth={1}
                        onCellPrepared={this.highlightSelected}
                        onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                    // columnAutoWidth={true}
                    >
                        <Toolbar>
                            <Item name='searchPanel' location='after'>
                            </Item>
                            <Item name='groupPanel' location='after'>
                            </Item>
                        </Toolbar>
                        <GroupPanel visible={true} />
                        <SearchPanel visible={true} width={'600px'} text={this.state.QueryString ? this.state.QueryString : ''} placeholder="Search..." highlightCaseSensitive={false} />
                        <Grouping autoExpandAll={false} />
                        <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                        <Paging enabled={true} defaultPageSize={10} />
                        <FilterRow visible={false} />
                        <FilterPanel visible={true} />
                        <HeaderFilter visible={true} />
                        <Scrolling columnRenderingMode='virtual' scrollByContent={true} scrollByThumb={true}></Scrolling>
                        {/* <Column cellRender={e => this.ActionCol(e)} minWidth={110} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} /> */}
                        {
                            this.state.SelectedColumnArray?.map((item, index) => {
                                return (
                                    item.dataType == "string" && item.dataField === 'LaunchStatus' ?
                                        <Column
                                            dataField={item.dataField}
                                            caption={item?.caption}
                                            dataType={item.dataType}
                                            width={item.width}
                                            visible={true}
                                            cellRender={e => <StatusTemplate value={e.value} />}
                                            alignment='center'
                                            fixed={item.allowFixing}
                                        //sortOrder={item.dataField === 'LaunchProgress' ? 'asc' : ''}
                                        /> : item.dataType == "string" && item.dataField === 'ProjectName' ?
                                            <Column
                                                dataField={item.dataField}
                                                caption={item?.caption}
                                                dataType={item.dataType}
                                                width={item.width}
                                                visible={true}
                                                cellRender={this.projectNameRender}
                                                alignment='center'
                                                fixed={item.allowFixing}
                                            /> : item.dataType == "string" ?
                                                <Column
                                                    dataField={item.dataField}
                                                    caption={item?.caption}
                                                    dataType={item.dataType}
                                                    width={item.width}
                                                    visible={true}
                                                    // cellRender={e=> <DropdownCellTemplate value={e.value}/>}
                                                    alignment='center'
                                                    //allowFixing={item.allowFixing}
                                                    fixed={item.allowFixing}
                                                    sortOrder={item.dataField === 'LaunchProgress' ? 'asc' : ''}
                                                //allowEditing={item.allowediting} LaunchStatus
                                                /> :
                                                item.dataType == "date" ?
                                                    <Column
                                                        dataField={item.dataField}
                                                        caption={item?.caption}
                                                        dataType={item.dataType}
                                                        width={item.width}
                                                        visible={true}
                                                        alignment='center'
                                                        format='MMM-dd-yyyy'
                                                        sortOrder={item.dataField === 'TaskFinishDate' ? 'asc' : ''}
                                                    /> :
                                                    item.dataType == "dropdown" ?
                                                        <Column
                                                            dataField={item.dataField}
                                                            caption={item?.caption}
                                                            dataType={item.dataType}
                                                            width={item.width}
                                                            visible={true}
                                                            alignment='center'
                                                            cellRender={e => this.ActionColumn(e, "dropdown", item.dataField)}
                                                            allowEditing={item.allowediting}
                                                        /> :
                                                        item.dataType == "checkbox" ?
                                                            <Column
                                                                dataField={item.dataField}
                                                                caption={item?.caption}
                                                                dataType={item.dataType}
                                                                width={item.width}
                                                                visible={true}
                                                                alignment='center'
                                                                cellRender={e => this.ActionColumn(e, "checkbox", item.dataField)}
                                                                allowEditing={item.allowediting}
                                                                fixed={item.allowFixing}
                                                            /> :
                                                            item.dataType == "textbox" ?
                                                                <Column
                                                                    dataField={item.dataField}
                                                                    caption={item?.caption}
                                                                    dataType={item.dataType}
                                                                    width={item.width}
                                                                    visible={true}
                                                                    alignment='center'
                                                                    cellRender={e => this.ActionColumn(e, "textbox", item.dataField)}
                                                                    allowEditing={item.allowediting}
                                                                /> :
                                                                item.dataType == "Image" ?
                                                                    <Column
                                                                        dataField={item.dataField}
                                                                        caption={item?.caption}
                                                                        dataType={item.dataType}
                                                                        width={item.width}
                                                                        visible={true}
                                                                        alignment='center'
                                                                        //allowEditing={item.allowediting}
                                                                        cellRender={e => this.ActionColumn(e, "Icon", item.dataField)}
                                                                    /> :
                                                                    <Column
                                                                        dataField={item.dataField}
                                                                        caption={item?.caption}
                                                                        dataType={item.dataType}
                                                                        width={item.width}
                                                                        visible={true}
                                                                        alignment={item.alignment}
                                                                    />
                                );
                            })
                        }
                    </DataGrid>
                    : null}
                <Dialog header="History" closable={false} visible={this.state.IsComments} style={{ height: '75vh', width: '75vw' }} icons={this.ViewDialogIcon} onHide={() => this.setState({ IsComments: false })}>
                    <DataGrid
                        dataSource={this.state.CommentsHistoryArray}
                        //allowColumnReordering={true}
                        //allowColumnResizing={true}
                        //columnResizingMode={'widget'}
                        filterSyncEnabled={false}
                        showColumnLines={true}
                        rowAlternationEnabled={true}
                        showBorders={true}
                        showRowLines={false}
                        wordWrapEnabled={true}

                    >
                        {
                            this.state.HistoryColumns?.map((item, index) => {
                                return (
                                    item.dataType == "string" ?
                                        <Column
                                            dataField={item.dataField}
                                            caption={item?.caption}
                                            dataType={item.dataType}
                                            width={item.width}
                                            visible={true}
                                            alignment={item.alignment}
                                        /> :
                                        item.dataType == "date" ?
                                            <Column
                                                dataField={item.dataField}
                                                caption={item?.caption}
                                                dataType={item.dataType}
                                                width={item.width}
                                                visible={true}
                                                alignment='center'
                                                format='MM-dd-yyyy'
                                            /> :
                                            <Column
                                                dataField={item.dataField}
                                                caption={item?.caption}
                                                dataType={item.dataType}
                                                width={item.width}
                                                visible={true}
                                                alignment={item.alignment}
                                            />
                                );
                            })
                        }
                    </DataGrid>
                </Dialog>
                <Dialog header="Notes" closable={false} visible={this.state.showEditCommentsDialog} style={{ height: '98vh', width: '99vw' }} icons={this.ViewDialogIcon} onHide={() => this.setState({ showEditCommentsDialog: false })}>
                    <div className='container proj-data-container'>
                        <Row>
                            <Col>
                                <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-4%' }}  >
                                    <AccordionTab header='Project Info'>
                                        {this.state.ProjectInfo &&
                                            <Row className='section-background'>
                                                <Row>
                                                    {
                                                        this.state.ProjectInfo.map((fieldItem, index) => {
                                                            let widthNumber = 0;
                                                            if (index === 0) {
                                                                widthNumber = 1;
                                                            } else {
                                                                widthNumber = 2;
                                                            }
                                                            return (
                                                                <Col md={widthNumber} className='' style={{ width: fieldItem.width, wordWrap: 'break-word' }}>
                                                                    <label>{fieldItem.fieldName}{fieldItem.isRequired && <span className='asteriskCls'>*</span>}
                                                                        {fieldItem.FieldType === 'Date' &&
                                                                            <span className='dateFormatLabel'>MMM-DD-YYYY</span>
                                                                        }</label>

                                                                    {FieldControls.getFieldControls(fieldItem.InternalName, fieldItem.FieldType,
                                                                        fieldItem.fieldValue, [], true, null)}
                                                                </Col>
                                                            );
                                                        })
                                                    }
                                                </Row>
                                            </Row>}
                                    </AccordionTab>
                                </Accordion>
                            </Col>
                            <Col>
                                <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-4%' }}  >
                                    <AccordionTab header='Notes'>
                                        <InputTextarea value={this.state.activeRecordNotes} readOnly={this.props.Mode == "View" ? true : false} onChange={e => this.setState({ activeRecordNotes: e.currentTarget.value })} rows={8} cols={30} />
                                    </AccordionTab>
                                </Accordion>
                            </Col>
                        </Row>
                        <Row>
                            <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                                <AccordionTab header='Notes history'>
                                    <DataGrid
                                        dataSource={this.state.CommentsHistoryArray}
                                        //allowColumnReordering={true}
                                        //allowColumnResizing={true}
                                        //columnResizingMode={'widget'}
                                        filterSyncEnabled={false}
                                        showColumnLines={true}
                                        rowAlternationEnabled={true}
                                        showBorders={true}
                                        showRowLines={false}
                                        wordWrapEnabled={true}
                                    >
                                        {
                                            this.state.HistoryColumns?.map((item, index) => {
                                                return (
                                                    item.dataType == "string" ?
                                                        <Column
                                                            dataField={item.dataField}
                                                            caption={item?.caption}
                                                            dataType={item.dataType}
                                                            width={item.width}
                                                            visible={true}
                                                            alignment={item.alignment}
                                                        /> :
                                                        item.dataType == "date" ?
                                                            <Column
                                                                dataField={item.dataField}
                                                                caption={item?.caption}
                                                                dataType={item.dataType}
                                                                width={item.width}
                                                                visible={true}
                                                                alignment='center'
                                                                format='MMM-dd-yyyy'
                                                            /> :
                                                            <Column
                                                                dataField={item.dataField}
                                                                caption={item?.caption}
                                                                dataType={item.dataType}
                                                                width={item.width}
                                                                visible={true}
                                                                alignment={item.alignment}
                                                            />
                                                );
                                            })
                                        }
                                    </DataGrid>
                                </AccordionTab>
                            </Accordion>
                        </Row>

                    </div>

                    {/* <div>
                        <InputTextarea value={this.state.activeRecordNotes} onChange={e => this.setState({ activeRecordNotes: e.currentTarget.value })} rows={8} cols={30} />
                    </div> */}
                </Dialog>
                <Dialog header="Reason Code" closable={false} visible={this.state.showReasonCodeDialog} style={{ height: '85vh', width: '75vw' }} icons={this.ViewDialogIcon} onHide={() => this.setState({ showReasonCodeDialog: false })}>
                    <Row >
                        <Col md={6} sm={6}>
                            <label className='ReasonCodeListBoxHeaders'>PGS</label>
                            <div className="card flex ">
                                <ListBox
                                    className='ReasonCodeListBox'
                                    value={this.state.selectedReasonCodes}
                                    filter
                                    options={this.state.ReasonCodeDropdownOptions.filter(i => i.PGSType == "PGS")}
                                    optionLabel="name"
                                    optionValue='code'
                                    itemTemplate={ReasonCodeyTemplate}
                                    listStyle={{ maxHeight: '280px' }} />
                            </div>
                        </Col>
                        <Col md={6} sm={6}>
                            <label className='ReasonCodeListBoxHeaders'>Non-PGS</label>
                            <div className="card flex ">
                                <ListBox
                                    filter
                                    options={this.state.ReasonCodeDropdownOptions.filter(i => i.PGSType == "Non-PGS")}
                                    optionLabel="name"
                                    optionValue='code'
                                    itemTemplate={ReasonCodeyTemplate}
                                    className="w-full md:w-14rem ReasonCodeListBox"
                                    listStyle={{ maxHeight: '280px' }}
                                />
                            </div>
                        </Col>

                    </Row>
                </Dialog>

            </div>
        )
    }
}