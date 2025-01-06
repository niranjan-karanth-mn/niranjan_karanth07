import * as React from 'react';
import { IProjectPlanProps } from './IProjectPlanProps';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';
import { Toast } from 'primereact/toast';
import DataGrid, { Toolbar, Item, SearchPanel, Column, Editing, HeaderFilter, Pager, Paging } from 'devextreme-react/data-grid';
import { Button } from 'primereact/button';
import { ProjectPlanPopupWrapper } from './ProjectPlanPopup';

import view from '../../../../../../src/webparts/assets/images/view.png';
import edit from '../../../../../../src/webparts/assets/images/edit.png';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Row, Col } from 'reactstrap';
import { PlanFieldControls } from './PlanFieldControls';
import { RadioButton } from 'primereact/radiobutton';
import { format } from 'date-fns/esm';
import * as moment from 'moment';
import { DataService } from '../../Shared/DataService';

let exportIcon: any = require('../../../../../webparts/assets/images/exportIcon.png');

export default class ProjectPlan extends React.Component<IProjectPlanProps, {}> {
    public toast: Toast;
    private dataGrid: any;
    public ProjectPlanTabDataRef: any;

    public constructor(props: any, public state: any) {
        super(props);
        this.state = {
            isLoading: false,
            PlanGridData: this.props.ProjectPlanTabData.ProjectPlanData,
            DRID: this.props.DRID,
            DRdetails: this.props.DRdetails,
            QueryString: '',
            QueryStringPC: '',
            planPopupOpen: false,
            AddEditPlan: false,
            formFields: [],
            planFieldsData: null,
            Template: [],
            WaveType: [],
            PackWaveType: [],
            lstLabels: [],
            lstCountry: [],
            lstMarket: [],
            lstRegion: [],
            Action: null,
            planfieldValues: [],
            IndicationVal: null,
            ProjectPrefix: null,
            ProjectPlanPopupGrid: [],
            formType: this.props.formType,
            systemMsg: '',
            showSystemMsg: false,
            lstDefaultWave: [],
            newLabelAry: [],
            PfizerConnectdialogOpen: false,
            PfizerConnecfieldValues: [],
            AllPfizerConnectData: [],
            showAllPfizerConnectData: false,
            ALLApiShipmentDateData: [],
            selectedPCID: null,
            selectedPCRecord: []
        }

        this.NewProjectPlanData = this.NewProjectPlanData.bind(this);
        this.handlePfizerConnectDataFieldChange = this.handlePfizerConnectDataFieldChange.bind(this);
        this.getPfizerConnectData = this.getPfizerConnectData.bind(this);
        this.getPfizerConnectDataPC = this.getPfizerConnectDataPC.bind(this);

        this.ProjectPlanTabDataRef = React.createRef();
    }

    //Add new Plans to grid
    NewProjectPlanData(planData: []): void {
        let ProjectPlans = this.state.PlanGridData;
        ProjectPlans = planData.length > 0 ? [...ProjectPlans, ...planData] : ProjectPlans;
        this.setState({
            PlanGridData: ProjectPlans
        }, () => this.handleProjectPlanTabUnmount);
    }

    public componentDidMount = async () => {
        this.ProjectPlanTabDataRef.current = this.props.ProjectPlanTabData;
        this.gettAllProjectPlanFieldsData();
        this.setPfizerConnectFieldValues();

        this.setState({
            PlanGridData: this.props.ProjectPlanTabData.ProjectPlanData,
            formFields: this.props.ProjectPlanTabData.ProjectPlanFields
        });
    }

    private handleProjectPlanTabUnmount = () => {
        try {
            let refObj = {
                ProjectPlanData: this.state.PlanGridData,
                ProjectPlanFields: this.state.formFields
            };
            this.props.onUnmount(refObj);

        } catch (error) {
            let errorMsg = {
                Source: 'Project Plan-handleProjectPlanTabUnmount',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    gettAllProjectPlanFieldsData = () => {
        let DRIDVal = this.state.DRID;
        //let projectPlanRecords = [];
        let lstWaveType = [];
        let lstPackWaveType = [];

        if (!DRIDVal) {
            alert("DRID not found");
            this.setState({
                formFields: [],
                programData: {},
            }, () => this.handleProjectPlanTabUnmount)
            //this.props.handleClose();
        }

        //set Template Values
        let lstTemplates = [{ key: 'GLO', value: 'GLO' },
        { key: 'GLOFINISHEDPACK', value: 'GLOFINISHEDPACK' },
        { key: 'FINISHEDPACK', value: 'FINISHEDPACK' },
        { key: 'SHAREDPACK', value: 'SHAREDPACK' },
        { key: 'NPLO', value: 'NPLO' }
        ];
        this.setState({
            Template: lstTemplates
        });

        //get Wave type data - wave type & Packwave type
        const fetchWaveTypeValues = DataService.fetchAllItemsGenericFilter('NPL_DRApplicationConfig', 'Value,*', `LinkTitle eq 'Wave Types' or LinkTitle eq 'Pack Wave Types'`)
        Promise.all([fetchWaveTypeValues]).then((responses) => {
            // console.log('Wave type :', responses);
            if (responses.length > 0) {
                responses.map((dt) => {
                    if (dt.filter(a => a.Title == 'Wave Types')) {
                        let waveTypeDt = dt.filter(a => a.Title == 'Wave Types');
                        let waves = waveTypeDt[0]?.Value.split(';');
                        let waveTypes = waves.map(e => {
                            if (e != undefined && e != null && e.trim() != '') {
                                return ({
                                    key: e.trim(), value: e.trim()
                                })
                            }
                        });
                        let filterdWaves = waveTypes.filter(e => e != undefined);
                        lstWaveType = filterdWaves;
                    }
                    if (dt.filter(a => a.Title == 'Pack Wave Types')) {
                        let packWaveTypeDt = dt.filter(a => a.Title == 'Pack Wave Types');
                        let packWaves = packWaveTypeDt[0]?.Value.split(';');
                        //packwavetypes
                        let PackWaveTypes = packWaves.map(e => {
                            if (e != undefined && e != null && e.trim() != '') {
                                return ({
                                    key: e.trim(), value: e.trim()
                                })
                            }
                        });
                        let filterdPackWaves = PackWaveTypes.filter(e => e != undefined);
                        lstPackWaveType = filterdPackWaves;
                    }
                });
                this.setState({
                    WaveType: lstWaveType,
                    PackWaveType: lstPackWaveType
                });
            }
        }).catch((error) => {
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        });

        //get label dropdown data for selected GRP code -from MultilabelMaster list 
        //this.state.DRdetails.LabelName
        let labelsData = [];
        let grpVal = this.state.DRdetails?.GRP;
        let DRLabel = this.state.DRdetails?.LabelName;
        let MVal = this.state.DRdetails?.API;
        let grpCode = grpVal && grpVal != null && grpVal.toString().split('->').length > 0 ? grpVal.toString().split('->')[0] : '';
        if (grpCode && grpCode != '') //get grp based Label data
        {
            //m
            const fetchProjectPlanData = DataService.fetchAllItemsGenericFilter('MultiLabelMaster', `*`,
                `GRPCode eq '${grpCode}'`)
            Promise.all([fetchProjectPlanData]).then((responses) => {
                // console.log("MultiLabel data for GRP", responses);
                let labelDt = responses[0];

                labelDt.map(async item => {
                    labelsData.push({
                        ID: item.ID,
                        key: item['LabelKey'] + '->' + item['LabelText'],
                        value: item['LabelText'],
                        Active: item.Active,
                        BrandGroup: item.BrandGroup,
                        BusinessUnit: item.BusinessUnit,
                        SubBusinessUnit: item.SubBusinessUnit,
                        Division: item.Division,
                        LabelCode: item.LabelCode
                    })
                });
                labelsData = labelsData.length > 0 ? labelsData.filter(a => a.Active == true) : [];
                if (labelsData.length > 0) {
                    this.setState({ lstLabels: labelsData });
                }
                else if (DRLabel)   //else get selected Label from Project data
                {
                    let lblVal = (DRLabel && DRLabel.indexOf("->") > 0 ? DRLabel.split("->")[1] : '');
                    let labelsData = [{
                        key: DRLabel,
                        value: lblVal,
                        //IntegrationFlag: null,
                        Active: false
                    }];
                    this.setState({ lstLabels: labelsData });
                }
                //else get molecule api value 
                else if (MVal && MVal != null) {
                    let molecule = [{
                        key: MVal,
                        value: (MVal && MVal.indexOf("->") > 0 ? MVal.split("->")[1] : ''),
                        // IntegrationFlag: null,
                        Active: false
                    }];
                    this.setState({ lstLabels: molecule });
                }

            }).catch((error) => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
        }
        else if (DRLabel)   //else get selected Label from Project data
        {
            let lblVal = (DRLabel && DRLabel.indexOf("->") > 0 ? DRLabel.split("->")[1] : '');
            let labelsData = [{
                key: DRLabel,
                value: lblVal,
                //IntegrationFlag: null,
                Active: false
            }];
            this.setState({ lstLabels: labelsData });
        }
        //else get molecule api value 
        else if (MVal && MVal != null) {
            let molecule = [{
                key: MVal,
                value: (MVal && MVal.indexOf("->") > 0 ? MVal.split("->")[1] : ''),
                // IntegrationFlag: null,
                Active: false
            }];
            this.setState({ lstLabels: molecule });
        }
        //get Country,Region,Market data from RegionMarket list
        let countryList = [];
        let marketList = [];
        let regionList = [];
        //m
        const fetchProjectPlanData = DataService.fetchAllDRListItemsWithFilters('RegionMarketList', `MappingCode/Code,*`,
            `IsActive eq '${1}'`, 'MappingCode', 'CodeType asc,Code')
        Promise.all([fetchProjectPlanData]).then((responses) => {
            // console.log("RegionMarketList data", responses);
            let RegionMarketData = responses[0];
            RegionMarketData.map((item) => {
                switch (item.CodeType) {
                    case "Country":
                        countryList.push({ type: item.CodeType, key: item.Code, title: item.Code + '->' + item.Title, display: item.Title, name: item.MappingCode.Code + '-' + item.Code + '->' + item.Title, id: item.ID, parent: item.MappingCode.Code, disable: false });
                        break;
                    case "Market":
                        marketList.push({ type: item.CodeType, key: item.Code, title: item.Code + '->' + item.Title, display: item.Title, name: item.MappingCode.Code + '-' + item.Code + '->' + item.Title, id: item.ID, parent: item.MappingCode.Code, disable: true });
                        break;
                    case "Region":
                        regionList.push({ type: item.CodeType, key: item.Code, title: item.Code + '->' + item.Title, display: item.Title, name: item.Code + '->' + item.Title, id: item.ID, parent: 0, disable: false });
                        break;
                }
            });
            this.setState({
                lstCountry: countryList,
                lstMarket: marketList,
                lstRegion: regionList
            });
        }).catch((error) => {
            alert('error async call')
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        });
        //get DR indication value - set project prefix
        let IndicationVal = this.state.DRdetails?.Indication;
        let indication = IndicationVal?.substring(
            IndicationVal.indexOf("\"") + 1,
            IndicationVal.lastIndexOf("\"")
        );
        let acronym = IndicationVal?.match(/\b(\w)/g).join('').toUpperCase();
        // console.log("IndicationVal", indication + 'acronym ' + acronym);
        let projectName = (indication && indication != "" ? indication : acronym);
        let projectPrefix = projectName?.length > 5 ? projectName?.substring(0, 5) : projectName;
        // console.log("Project prefix", projectPrefix);
        this.setState({
            ProjectPrefix: projectPrefix,
            IndicationVal: projectPrefix
        });

        //Added for getting the default wave-region-market-country mapping
        // let WaveMappingUrl = props.createdrprops.siteUrl + `/_api/web/lists/GetByTitle('ProjectPlanConfiguration')/Items?$select=*&$orderby=Region%20asc,Market%20asc,Country%20asc&$filter=IsActive%20eq%201&$top=4999`;

        const fetchDefaultWaveTypeValues = DataService.fetchAllItemsGenericFilter('ProjectPlanConfiguration', '*', 'IsActive eq 1')
        Promise.all([fetchDefaultWaveTypeValues]).then((responses) => {
            // console.log('Wave type :', responses);

            // .then(item => {
            // console.log('wave-region-market-country mapping', responses[0]);
            if (responses && responses.length > 0) {
                let LstDefaultWave = this.state.lstDefaultWave;
                responses[0].map((item) => {
                    LstDefaultWave.push({ template: item.Template, wave: item.Title, id: item.ID, region: item.Region, market: item.Market, country: item.Country });
                });
                this.setState({
                    lstDefaultWave: LstDefaultWave
                });
            }
        }).catch((error) => {
            alert('error async call')
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        });
    }

    public onHide = (name) => {
        this.setState({
            [`${name}`]: false, newViewInputVisible: false
        });
        //this.getcolArr();
    }

    public ActionCol(rowData: any) {
        if (this.state.formType == 'View') {
            return (
                <>
                    <div>
                        <img title="View" alt="Card" src={view} onClick={(e) => this.Actionlink('View', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} />
                        {/* <img title="Edit" alt="Card" src={edit} onClick={(e) => this.Actionlink('Edit', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} /> */}
                        {/* <img title="delete" alt="Card" src={deleteIcon} onClick={(e) => this.Actionlink('Delete', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} /> */}
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div>
                        <img title="View" alt="Card" src={view} onClick={(e) => this.Actionlink('View', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} />
                        <img title="Edit" alt="Card" src={edit} onClick={(e) => this.Actionlink('Edit', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} />
                        {/* <img title="delete" alt="Card" src={deleteIcon} onClick={(e) => this.Actionlink('Delete', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} /> */}
                    </div>
                </>
            );
        }

    }

    Actionlink = (type, e) => {
        // console.log('action link clicked', type, e);
        let country = [...this.state.lstCountry].filter(c => c.display == e.data.Country);
        let market = [...this.state.lstMarket].filter(c => c.display == e.data.Market);
        let region = [...this.state.lstRegion].filter(c => c.display == e.data.Region);
        let labelnameArr = [...this.state.lstLabels].filter(lbl => lbl.value == e.data.LabelText);
        let labelnameval = labelnameArr.length != 0 ? labelnameArr[0].value : e.data.LabelText;
        let labelsDD = [...this.state.lstLabels, ...this.state.newLabelAry];
        if (labelnameArr.length == 0) {
            labelsDD.push({
                key: `${e.data.LabelName}`,
                value: `${e.data.LabelText}`
            })
        }


        let acronym = e.data.Indication != null && e.data.Indication != '' ? e.data.Indication.match(/\b(\w)/g).join('').toUpperCase() : '';
        let projectName = (e.data.Indication && e.data.Indication != "" ? e.data.Indication : acronym);
        let projectPrefix = projectName?.length > 5 ? projectName?.substring(0, 5) : projectName;
        // console.log("Project prefix", projectPrefix);

        let parent_plan = {};
        let allPlansData = [...this.state.PlanGridData];
        let parentPlanRaw = allPlansData.filter(plan => plan.ProjectName === e.data.Parent);
        if (parentPlanRaw.length > 0) {
            parent_plan = parentPlanRaw[0];
        }
        let pPlansFinal = [];
        allPlansData.map(item => {
            if (item.Template == parent_plan['Template'] && item.PlanStatus != 'ERROR') {
                pPlansFinal.push(
                    {
                        key: item.ProjectName,
                        value: item.ProjectName,
                        // ParentID: item.ParentID,
                        // ParentMarket: item.Country
                    }
                )
            }
        })

        let fieldValues = {};
        fieldValues = {
            DRID: e.data.DRID,
            DeepDive: e.data.DeepDive != null && e.data.DeepDive != '' ? e.data.DeepDive : false,
            Template: e.data.Template == 'PGSGLO' ? 'GLO' : e.data.Template,
            WaveType: e.data.WaveType,
            LabelName: e.data.LabelText && e.data.LabelText != '' ? e.data.LabelText.split('$')[0] : '',
            LabelNames: labelnameval,
            // Indication : this.state.IndicationVal,
            ProjectPrefix: this.state.ProjectPrefix,
            PlanProjectName: e.data.PlanProjectName,
            Country: country,
            Market: market,
            Region: region,
            ParentPlans: e.data.Parent,
            ProjectName: e.data.ProjectName,
            Indication: projectPrefix,// acronym,
            RecordID: e.data.RecordID,
            RecordType: type == 'Edit' ? 'E' : 'V',
            PlanStatus: e.data.PlanStatus
        }

        let marketGrid = [{
            WaveType: e.data.WaveType,
            Template: e.data.Template == 'PGSGLO' ? 'GLO' : e.data.Template,
            DeepDive: e.data.DeepDive != null && e.data.DeepDive != '' ? e.data.DeepDive : false,
            Country: e.data.Country,
            Market: e.data.Market,
            PackSize: e.data.PackSize,
            ParentMarket: e.data.ParentMarket,
            Parent: e.data.Parent,
            LabelVal: e.data.LabelText && e.data.LabelText != '' ? e.data.LabelText.split('$')[0] : '',
            RecordID: e.data.RecordID,
            RecordType: type == 'Edit' ? 'E' : 'V',
            PlanStatus: e.data.PlanStatus,
            LabelName: e.data.LabelText,
            DRID: e.data.DRID,
            ProjectName: e.data.ProjectName,
        }];
        let planPopupData = {};
        if (e.data.Parent != null && e.data.Parent != '') {
            planPopupData = {
                DeepDive: false,
                Template: this.state.Template,
                WaveType: this.state.PackWaveType,
                LabelNames: labelsDD,
                ParentPlans: pPlansFinal,
                Country: this.state.lstCountry,
                // PackWaveType: this.state.PackWaveType,
                Market: this.state.lstMarket,
                Region: this.state.lstRegion,
                Indication: this.state.IndicationVal,
                ProjectPrefix: this.state.ProjectPrefix,

            }
        } else {
            planPopupData = {
                DeepDive: false,
                Template: this.state.Template,
                WaveType: this.state.WaveType,
                LabelNames: labelsDD,
                ParentPlans: pPlansFinal,
                Country: this.state.lstCountry,
                // PackWaveType: this.state.PackWaveType,
                Market: this.state.lstMarket,
                Region: this.state.lstRegion,
                Indication: this.state.IndicationVal,
                ProjectPrefix: this.state.ProjectPrefix,

            }
        }
        this.setState({ Action: type, planfieldValues: fieldValues, planPopupOpen: true, planFieldsData: planPopupData, ProjectPlanPopupGrid: marketGrid })
    }

    //set Projectplan popup data
    setProjectPlanPopupData = () => {
        this.setState({ isLoading: true });
        let drDetails = this.props.DRdetails;
        let labelsDD = [...this.state.lstLabels, ...this.state.newLabelAry]
        //setdialogMsg('Business Unit, Indication, Molecule API/Global Brand fields are empty. Project Plans cannot be created!!');
        //if ((IndicationVal !== null && IndicationVal !== '') && (BusinessUnit !== null && BusinessUnit !== '') 
        //&& ((GBrand !== null && GBrand !== '') || (MoleculeVal !== null && MoleculeVal !== ''))) {
        //else if ((IndicationVal !== null && IndicationVal !== '') && (BusinessUnit !== null && BusinessUnit !== '') && ((GBrand !== null && GBrand !== '') || (MoleculeVal !== null && MoleculeVal !== ''))) {
        if (drDetails != null &&
            (drDetails.Indication !== null && drDetails.Indication !== '') && (drDetails.BUnit !== null && drDetails.BUnit !== '') && (drDetails.SubBusinessUnit != null && drDetails.SubBusinessUnit != '')
            && ((drDetails.GlobalBrandAPI !== null && drDetails.GlobalBrandAPI !== '') || (drDetails.API !== null && drDetails.API != ''))) {
            const planPopupData = {
                DeepDive: false,
                Template: this.state.Template,
                WaveType: this.state.WaveType,
                LabelNames: labelsDD,
                ParentPlans: null,
                Country: this.state.lstCountry,
                PackWaveType: this.state.PackWaveType,
                Market: this.state.lstMarket,
                Region: this.state.lstRegion,
                Indication: this.state.IndicationVal,
                ProjectPrefix: this.state.ProjectPrefix
            }
            let fieldValues = {};
            // let Template = this.state.Template[0];
            //let waveType = this.state.WaveType[0];
            fieldValues = {
                DRID: this.state.DRID,
                DeepDive: false,
                Template: this.state.Template[0]?.key,
                WaveType: this.state.WaveType[0]?.key,
                Indication: this.state.IndicationVal,
                ProjectPrefix: this.state.ProjectPrefix,
                PlanProjectName: ''
            }
            // console.log("fieldValues", fieldValues);

            this.setState({
                Action: 'New',
                planfieldValues: fieldValues,
                planFieldsData: planPopupData, planPopupOpen: true
            }, () => console.log("Plan Field Details logged after setting popup state", planPopupData));
        }
        else {
            this.setState({
                showSystemMsg: true,
                systemMsg: `Business Unit,Sub Business Unit, Indication, Molecule API/Global Brand fields are empty. Project Plans cannot be created!.  Kindly Connect to the ${this.state.DRdetails.DataSteward ? 'Data Steward: ' + this.state.DRdetails.DataSteward : 'Data Steward'}`
            });
        }
        // this.gettAllProjectPlanFieldsData();
        this.setState({ isLoading: false });
    }

    refreshProjectPlanData = () => {
        // this.setState({ isLoading: true });
        this.props.refreshData(this.state.DRID);
        // this.setState({ isLoading: false });
    }

    highlightSelected = (e) => {
        if (e.rowType == 'data' && (this.props.SwitchedProjectPlanName == "All" || this.props.SwitchedProjectPlanName == null) && e.data.ProjectName == this.props.planProps.ProjectName) {
            e.cellElement.style.backgroundColor = "#e3f2fd";
            // e.rowElement.style.cssText="background-color:#e3f2fd;";
            // e.component.repaint();
        }
        if (e.rowType == 'data' && (this.props.SwitchedProjectPlanName != "All" && this.props.SwitchedProjectPlanName != null && e.data.ProjectName == this.props.SwitchedProjectPlanName)) {
            e.cellElement.style.backgroundColor = "#e3f2fd";
            // e.rowElement.style.cssText="background-color:#e3f2fd;";
            // e.component.repaint();
        }

    }

    ClosePopup = (val) => {
        let plnGridData = [...this.state.PlanGridData];
        if (plnGridData.length > 0) {
            plnGridData = plnGridData.filter(a => a.PlanStatus != 'Draft');
        }
        this.setState({
            //ProjectPlanPopup : false,
            planPopupOpen: false,
            ProjectPlanPopupGrid: [],
            planFieldsData: {},
            planfieldValues: {},
            PlanGridData: plnGridData
        });
    }

    savePlanData = async (action, ProjectPlanPopupGrid, newLabelAry) => {
        this.setState({ isLoading: true });
        let AllPlanData = [...this.state.PlanGridData, ...ProjectPlanPopupGrid]; //...ProjectPlanPopupGrid];

        let DRdetails = this.state.DRdetails;
        //update chile plans data if parent plan updated.
        let newPlans = ProjectPlanPopupGrid.filter(a => a.PlanStatus == 'Draft');
        if (newPlans.length > 0) {

            // console.log("newplanDT", newPlans, newPlans);
            let newPlansData = null;

            let batch = DataService.NPL_Context.createBatch();
            let listDLPP = DataService.NPL_Context.lists.getByTitle('DLPPList');
            let UserData = await DataService.NPL_Context.ensureUser(this.props.currentUser.LoginName).then((item) => {
                return item;
            });
            // console.log(UserData);
            newPlans.map((dt) => {
                let tempVal = (dt.Template == 'SHAREDPACK' || dt.Template == 'FINISHEDPACK' || dt.Template == 'GLOFINISHEDPACK') ?
                    dt.Template : ('PGS' + dt.Template);

                newPlansData = {
                    'DRID': dt.DRID,
                    'ProjectName': dt.ProjectName,
                    'PlanStatus': dt.PlanStatus == 'Draft' ? 'NEW' : dt.PlanStatus,
                    'WaveType': dt.WaveType,
                    'Template': tempVal,
                    'GRProduct': DRdetails.GRP,
                    'BusinessUnit': DRdetails.SBUnit,
                    'BU': DRdetails.BUnit,
                    'TherapeuticArea': DRdetails.TherapeuticArea,
                    'RnDProjNo': DRdetails.RnDProjNo,
                    'OtherAlias': DRdetails.OtherAlias,
                    'MoleculeName': DRdetails.API,
                    'GlobalBrand': DRdetails.GlobalBrandAPI,
                    'Indication': DRdetails.Indication,
                    'PfizerCode': DRdetails.PlaniswareLeadCode,
                    'Region': dt.cRegion,
                    'Market': dt.cMarket,
                    'Country': dt.cCountry,
                    'Parent': dt.Parent,
                    'PlanProjectName': dt.PlanProjectName,
                    'PackSize': dt.PackSize,
                    'ParentMarket': dt.ParentMarket,
                    'LabelName': dt.LabelName,
                    'LabelText': dt.LabelName ? dt.LabelName.split('->')[1] : '',
                    'PlanOwnerId': UserData ? UserData.data.Id : '',
                    'DeepDive': dt.DeepDive != null && dt.DeepDive != '' ? dt.DeepDive : false,
                }
                // console.log("new plans to add", newPlansData);

                listDLPP.items.inBatch(batch).add(newPlansData).then((items) => {
                    return items;
                }).catch(error => {
                    console.log("Error while adding plans data to batch", error);
                });
            });
            await batch.execute()
                .then(async (items) => {

                    let projectDetailsListName = "";
                    if (DataService.environment === "DEV") {
                        projectDetailsListName = "ProjectDetailsList";
                    }
                    else if (DataService.environment === "QA" || DataService.environment === "PROD") {
                        projectDetailsListName = "ProjectDetailsList_Prod";
                    }
                    if (this.state.DRdetails.LaunchLeaderUserId == null || this.state.DRdetails.LaunchLeaderUserId == undefined) {
                        DataService.NPL_Context.lists.getByTitle(projectDetailsListName).items
                            .getById(this.state.DRID).update({ LaunchLeaderUserId: UserData ? UserData.data.Id : '' }).then(res =>
                                console.log('DR data updated with New Launch leader:', res));
                    }
                    setTimeout(() => {
                        if (newLabelAry && newLabelAry.length > 0) {
                            //save New Label to multilabel list
                            this.saveLabelToList(newLabelAry, AllPlanData, DRdetails.GRP);
                        }
                    }, 1000);

                    // //get data from dlpplist
                    setTimeout(() => {
                        this.props.refreshData(this.state.DRID);
                    }, 1000);
                    //show message
                    let systemMsg = <span>{"Data Saved Successfully."} <br /> {"Project Plan will be created in DLPP, please allow 1-2 minutes for the project link to appear"}</span>;
                    this.setState({ showSystemMsg: true, systemMsg: systemMsg });
                    this.ClosePopup(false);
                    //return items;
                }).catch(error => {
                    console.log("Error while saving plans data", error);
                });
        }
        //update plans   
        let AllUpdatedPlansDt = this.updateSubPlanData(ProjectPlanPopupGrid);
        // console.log("AllUpdatedPlansDt", AllUpdatedPlansDt);

        let updatePlansDt = AllUpdatedPlansDt.filter(a => a.PlanStatus == 'DRAFT MODIFIED');
        // console.log("updatePlansDt", updatePlansDt);
        if (updatePlansDt.length > 0) {
            //let plangridData = this.state.planGridData;
            let updatePlansData = null;

            let batch = DataService.NPL_Context.createBatch();
            let listDLPP = DataService.NPL_Context.lists.getByTitle('DLPPList');

            let UserData = await DataService.NPL_Context.ensureUser(this.props.currentUser.LoginName).then((item) => {
                return item;
            });
            console.log(UserData);

            updatePlansDt.map((dt) => {
                let tempVal = (dt.Template == 'SHAREDPACK' || dt.Template == 'FINISHEDPACK' || dt.Template == 'GLOFINISHEDPACK') ?
                    dt.Template : ('PGS' + dt.Template);

                updatePlansData = {
                    'DRID': dt.DRID,
                    'ProjectName': dt.ProjectName,
                    'PlanStatus': dt.PlanStatus == 'Draft' ? 'NEW' : 'MODIFIED',
                    'WaveType': dt.WaveType,
                    'Template': tempVal,
                    'GRProduct': DRdetails.GRP,
                    'BusinessUnit': DRdetails.SBUnit,
                    'BU': DRdetails.BUnit,
                    'TherapeuticArea': DRdetails.TherapeuticArea,
                    'RnDProjNo': DRdetails.RnDProjNo,
                    'OtherAlias': DRdetails.OtherAlias,
                    'MoleculeName': DRdetails.API,
                    'GlobalBrand': DRdetails.GlobalBrandAPI,
                    'Indication': DRdetails.Indication,
                    'PfizerCode': DRdetails.PlaniswareLeadCode,
                    'Region': dt.cRegion,
                    'Market': dt.cMarket,
                    'Country': dt.cCountry,
                    'Parent': dt.Parent,
                    'PlanProjectName': dt.PlanProjectName,
                    'PackSize': dt.PackSize,
                    'ParentMarket': dt.ParentMarket,
                    'LabelName': dt.LabelNames,
                    'LabelText': dt.LabelName ? dt.LabelName.split('->')[1] : '',
                    // 'PlanOwnerId': UserData ? UserData.data.Id : '', //not updating owner on plan update
                    'DeepDive': dt.DeepDive != null && dt.DeepDive != '' ? dt.DeepDive : false,
                }
                // console.log("plans to update", updatePlansData);
                //listDLPP.items.inBatch(batch).add(updatePlansData)
                listDLPP.items.inBatch(batch).getById(dt.RecordID).update(updatePlansData)
                    .then((items) => {
                        return items;
                    }).catch(error => {
                        console.log("Error while updating plans data to batch", error);
                        this.ClosePopup(false);
                    });
            });
            batch.execute()
                .then((items) => {

                    setTimeout(() => {
                        if (newLabelAry && newLabelAry.length > 0) {
                            //save New Label to multilabel list
                            this.saveLabelToList(newLabelAry, AllPlanData, DRdetails.GRP);
                        }
                    }, 1000);

                    //  //get data from dlpplist
                    setTimeout(() => {
                        this.props.refreshData(this.state.DRID);
                    }, 1000);
                    //show message
                    let systemMsg = "Data Saved Successfully.";
                    this.setState({ showSystemMsg: true, systemMsg: systemMsg });
                    this.ClosePopup(false);
                    return items;
                }).catch(error => {
                    console.log("Error while saving plans data", error);
                    this.ClosePopup(false);
                });
        }
        this.setState({ isLoading: false });
    }

    updateSubPlanData = (ProjectPlanPopupGrid) => {
        let updatedPlans = [];
        let planGridData = [...this.state.PlanGridData];
        if (ProjectPlanPopupGrid.length > 0) {
            let updatePlansDt = ProjectPlanPopupGrid.filter(a => a.PlanStatus == 'DRAFT MODIFIED');

            updatePlansDt.map((dt) => {
                if (dt.Template == 'GLO' || dt.Template == 'NPLO') {
                    updatedPlans.push(dt);
                }
                //if parentplan value change, update parent -wavetype, label for sharedpack plan
                if (dt.Template == "GLOFINISHEDPACK") {
                    let parentUpdated = planGridData.filter(a => a.ProjectName == dt.Projectname && a.Parent != dt.Parent);
                    if (parentUpdated.length > 0) {
                        parentUpdated.map((pt) => {
                            pt.Wavetype = dt.WaveType,
                                pt.LabelName = dt.LabelName,
                                pt.LabelText = dt.LabelTval,
                                pt.PlanStatus = pt.PlansStatus == 'Draft' ? 'Draft' : 'DRAFT MODIFIED'
                        });
                    }
                    updatedPlans.push(dt);
                    //updatedPlans.push(parentUpdated);
                    updatedPlans = updatedPlans.length > 0 ? [...updatedPlans, ...parentUpdated] : [...parentUpdated];
                }
                if (dt.Template == "FINISHEDPACK") {
                    let subPlans = planGridData.filter(a => a.Parent == dt.ProjectName);
                    subPlans.map((subP) => {
                        subP.LabelName = dt.LabelName,
                            subP.LabelText = dt.LabelTval,
                            subP.WaveType = dt.WaveType,
                            subP.PlanStatus = subP.PlansStatus == 'Draft' ? 'Draft' : 'DRAFT MODIFIED'
                    });
                    updatedPlans.push(dt);
                    //updatedPlans.push(subPlans);
                    updatedPlans = updatedPlans.length > 0 ? [...updatedPlans, ...subPlans] : [...subPlans];
                }
                //if parentplan value change, update parent -wavetype, label for sharedpack plan
                if (dt.Template === 'SHAREDPACK') {
                    let subPlans = planGridData.filter(a => a.ProjectName == dt.Projectname && a.Parent != dt.Parent);
                    if (subPlans.length > 0) {
                        subPlans.map((pt) => {
                            pt.Wavetype = dt.WaveType,
                                pt.LabelName = dt.LabelName,
                                pt.LabelText = dt.LabelTval,
                                pt.PlanStatus = pt.PlansStatus == 'Draft' ? 'Draft' : 'DRAFT MODIFIED'
                        });
                    }
                    updatedPlans.push(dt);
                    //updatedPlans.push(subPlans);
                    updatedPlans = updatedPlans.length > 0 ? [...updatedPlans, ...subPlans] : [...subPlans];
                }
            });
        }
        return updatedPlans;
    }

    saveLabelToList = (newlabelary, PlansData, GRPVal) => {
        let grpCode = GRPVal && GRPVal != null && GRPVal.toString().split('->').length > 0 ? GRPVal.toString().split('->')[0] : '';
        if (grpCode && grpCode !== null) {

            let batch = DataService.NPL_Context.createBatch();
            let listDLPP = DataService.NPL_Context.lists.getByTitle('MultiLabelMaster');
            if (newlabelary && newlabelary.length > 0) {
                let NewLabels = newlabelary.filter(a => a.integrationFlag === 'N');
                let NewLabelsData = NewLabels;
                let newLabelObj = null;
                NewLabels.map((dt) => {
                    let isNewLabel = PlansData.filter(a => a.LabelVal == dt.value && a.PlanStatus != '');
                    //add new label to list
                    if (isNewLabel != null && isNewLabel.length > 0) {
                        newLabelObj = {
                            'LabelKey': '999',
                            'LabelText': dt.value,
                            'GRPCode': grpCode,
                            'Active': false
                        }
                        dt.integrationFlag = "";
                        // remove new labels which are saved in multilabel list 
                        // NewLabelsData = NewLabelsData.filter(a => a.key != dt.key);
                    }
                    // else {
                    //     NewLabelsData = NewLabelsData.filter(a => a.key != dt.key);
                    // }
                    listDLPP.items.inBatch(batch).add(newLabelObj).then((items) => {
                        return items;
                    }).catch(error => {
                        console.log("Error while adding plans data to batch", error);
                    });
                });
                batch.execute()
                    .then((items) => {
                        console.log("New Label Data Saved Successfully");
                        this.setState({
                            newLabelAry: NewLabelsData
                        });
                        return items;
                    }).catch(error => {
                        console.log("Error while saving new labels data", error);
                    });
            }
        }
    }

    UpdateNewLabelAry = (newLabelAry, plFieldsData) => {
        this.setState({
            newLabelAry: newLabelAry,
            planFieldsData: plFieldsData
        })
    }

    projectNameRender = (e) => {
        // console.log('Project name render:',e);
        // if ((e.data.PlanExistURL != null && e.data.PlanExistURL != '') || e.data.PlanStatus != 'ERROR' || e.data.PlanStatus != 'NEW' || e.data.PlanStatus != 'Draft')
        if ((e.data.PlanExistURL != null && e.data.PlanExistURL != '') && (e.data.PlanStatus != 'ERROR' || e.data.PlanStatus != 'NEW' || e.data.PlanStatus != 'Draft'))
            return (<a className='project-link' onClick={() => this.onProjClick(e.data.ProjectName)}>{e.data.ProjectName}</a>);
        else
            return (<span>{e.data.ProjectName}</span>);
    }

    onProjClick = (proj) => {
        //let projLink = 'ms-project:osp|u|https://pfizer.sharepoint.com/sites/nplpwa-dev|g|c10ea28c-31c3-49a5-8977-f94f3fb79743|p|<>\\' + proj + '|r|0';
        let projLink = 'ms-project:osp|u|' + DataService.ProjectCenterUrl + '|g|c10ea28c-31c3-49a5-8977-f94f3fb79743|p|<>\\' + proj + '|r|0';
        window.open(projLink, '_blank');
    }

    viewDialogAlert = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link'>
                {/* <Button className='p-button-raised p-button-rounded okBtn' onClick={e => this.setState({ showSystemMsg: false, systemMsg: '' })} icon='dx-icon-save' label='Ok' /> */}
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({ showSystemMsg: false, systemMsg: '' })} icon='dx-icon-close' label='Close' />
            </div>
        );
    }

    public ActionColumn(rowData: any, dataType: string, dataField: string) {
        let fieldValue = rowData.data[dataField];
        if (dataType == "checkbox") {
            return (
                <Checkbox checked={fieldValue} disabled={true}
                // onChange={e => this.VerfiedOnchange(e, rowData, dataField)} 
                ></Checkbox>
            );
        }
    }

    VerfiedOnchange = async (e: any, prmRowData, dataField) => {
        let planGridData = [...this.state.PlanGridData];
        let filteredIndex = planGridData.findIndex(item => item.id == prmRowData.data.id);
        let changes = {
            DRID: prmRowData.data.DRID,
            // ProjectName:e[0].key.ProjectName,
            DeepDive: e.checked,
            PlanStatus: 'MODIFIED',
            spID: prmRowData.data.RecordID,
            ProjectGUID: prmRowData.data.ProjectGUID
        };
        planGridData[filteredIndex][dataField] = e.checked;
        await this.setState({ PlanGridData: planGridData }, () => {
            this.handleProjectPlanTabUnmount();
            if (dataField == 'DeepDive') {
                this.props.handleProjectPlan(changes);
            }
        });
    }

    dtChanges = (e) => {
        // console.log('on changes change of npl t6:', e);
        if (e.length > 0) {

            let changes = {
                // DRID:e[0].key.DRID,
                // ProjectName:e[0].key.ProjectName,
                DeepDive: e[0].data.DeepDive,
                PlanStatus: 'MODIFIED',
                spID: e[0].key.RecordID,
                GUID: e[0].key.GUID
            };
            this.props.handleProjectPlan(changes);
        }
    }

    onExporting = () => {
        const dataGrid = this.dataGrid.instance;
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Programs');
        exportDataGrid({
            component: dataGrid,
            worksheet: worksheet
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                //new Date().toLocaleString() +
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ProjectPlan' + '.xlsx');
            });

        })
    }

    showPfizerConnectPopup = () => {

        let drDetails = this.props.DRdetails;
        if (drDetails.PfizerConnectID != null && drDetails.PfizerConnectID != '') {
            this.getAllApiShipmentDate(); // get all apishipmentdate data
            this.setState({
                PfizerConnectdialogOpen: true
            });
        }
        else if ((drDetails.LaunchLeader && drDetails.LaunchLeader !== '')
            && (drDetails.RnDProjNo && drDetails.RnDProjNo !== '')
            && (drDetails.PlaniswareLeadCode && drDetails.PlaniswareLeadCode !== '')
            //&& (drDetails.PfizerConnectID == '' || drDetails.PfizerConnectID == null))
        ) {
            this.getAllApiShipmentDate(); // get all apishipmentdate data
            this.setState({
                PfizerConnectdialogOpen: true
            });
        }
        else {
            this.setState({
                PfizerConnectdialogOpen: false,
                showSystemMsg: true,
                systemMsg: `PF/Compound Number,Planisware ID / Pfizer Code,Launch Leader fields are empty. Pfizer Connect ID cannot be created!  Kindly Connect to the ${this.state.DRdetails.DataSteward ? 'Data Steward: ' + this.state.DRdetails.DataSteward : 'Data Steward'}`
            });
        }
    }

    setPfizerConnectFieldValues = () => {
        let drDetails = this.state.DRdetails;
        if (drDetails?.PfizerConnectID != '' && drDetails?.PfizerConnectID != null) {
            this.getPfizerConnectData(drDetails);
        }
        else {
            let pfizerConnectFieldVal = {
                ProjectTitle: drDetails.ProductDescription,
                PfizerConnectID: drDetails.PfizerConnectID,
                PCRecordID: drDetails.PfizerConnectRecordID,
                PfizerConnectHistoryID: drDetails.PfizerConnectHistoryID,
                PfCompoundNumber: drDetails.RnDProjNo,
                Pfcode: drDetails.PlaniswareLeadCode,
                APIShipmentDate: '',
                FirstShipmentDate: '',
                LaunchLeader: drDetails.LaunchLeader,
                LaunchLeaderEmail: drDetails.LaunchLeaderEmail,
                ProjectImplementationDate: '',
                NetworkChangeTrigger: '4 - New Pfizer Product Launch'
            }
            this.setState({
                PfizerConnecfieldValues: pfizerConnectFieldVal
            });
        }
    }

    getPfizerConnectData = async (drData) => {
        let pfizerConnectFieldValues = [];
        let PCID = drData.PfizerConnectID;
        let PCRecordID = drData.PfizerConnectHistoryID;

        console.log('pfizerConnectFieldValues', pfizerConnectFieldValues, PCID);

        const fetchPfizerConnectData = DataService.getPfizerConnectData(PCID);
        Promise.all([fetchPfizerConnectData]).then((responses) => {
            if (responses.length > 0) {
                // console.log("", responses);
                let res = responses[0][0];
                let pfizerConnectFieldValues = {
                    // ProjectTitle: res?.ProjectName,
                    // PfizerConnectID: res?.ConnectID,
                    // PCRecordID: res?.ID,
                    ProjectTitle: res ? res.ProjectName : drData.ProductDescription,
                    PfizerConnectID: res ? res.ConnectID : drData.PfizerConnectID,
                    PCRecordID: res ? res.ID : drData.PfizerConnectRecordID,
                    PfizerConnectHistoryID: PCRecordID,
                    PfCompoundNumber: drData.RnDProjNo,
                    Pfcode: drData.PlaniswareLeadCode,
                    //APIShipmentDate : '',
                    FirstShipmentDate: res?.FirstShipmentDate,
                    LaunchLeader: drData.LaunchLeader,
                    LaunchLeaderEmail : drData.LaunchLeaderEmail,
                    ProjectImplementationDate: res?.ProjectImplementationDate,
                    //NetworkChangeTrigger: res?.NetworkChangeTrigger
                    NetworkChangeTrigger: res ? res.NetworkChangeTrigger : '4 - New Pfizer Product Launch'
                }
                this.setState({
                    PfizerConnecfieldValues: pfizerConnectFieldValues
                }, async () => {
                    let earliestApiSPDate = await this.getApiShipmentDateData(PCID);
                    console.log("earliestApiSPDate", earliestApiSPDate);
                });
            }
        }).catch((error) => {
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        });
    }

    getAllPfizerConnectData = () => {
        let AllPCData = [];
        //let drDetails = this.state.DRdetails;
        //let APIShipmentDateData =  this.getAllApiShipmentDate();
        let APIShipmentDateData = [...this.state.ALLApiShipmentDateData]
        if (!this.state.showAllPfizerConnectData) {
            const fetchAllPfizerConnectData = DataService.getAllPfizerConnectData();
            Promise.all([fetchAllPfizerConnectData]).then((responses: any[]) => {
                let result = responses[0];
                result.map((dt) => {

                    let EarliestAPIShipmentDate = APIShipmentDateData.filter(a => a.ConnectID == dt.ConnectID).length > 0 ?
                        APIShipmentDateData.filter(a => a.ConnectID == dt.ConnectID)[0].Date : null;

                    AllPCData.push({
                        PCRecordID: dt?.ID,
                        PfizerConnectID: dt?.ConnectID,
                        ProjectName: dt?.ProjectName,
                        ProjectTitle: dt?.ProjectName,
                        ChangeOwner: dt?.ChangeOwner ? dt.ChangeOwner[0]?.Title : '',
                        ConnectPM: dt?.ConnectPM ? dt.ConnectPM[0]?.Title : '',
                        APIShipmentDate: EarliestAPIShipmentDate ? EarliestAPIShipmentDate : dt.ProjectImplementationDate,
                        FirstShipmentDate: dt?.FirstShipmentDate,
                        ProjectImplementationDate: dt?.ProjectImplementationDate,
                        PfCompoundNumber: dt.ProjectDescription ? dt.ProjectDescription.split(' ')[0] : '',
                        Pfcode: dt.ProjectDescription ? dt.ProjectDescription.split(' ')[1] : '',
                        LaunchLeader: dt.ChangeOwner ? dt.ChangeOwner[0].Title : '',
                        NetworkChangeTrigger: dt.NetworkChangeTrigger
                    });
                });
                this.setState({
                    AllPfizerConnectData: AllPCData,
                    showAllPfizerConnectData: true
                });
            }).catch((error) => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
        }
    }

    getAllApiShipmentDate = () => {
        let AllASData = [];
        const fetchAllAPIShipmentDateData = DataService.getApiShipmentDate();
        Promise.all([fetchAllAPIShipmentDateData]).then((responses: any[]) => {
            let result = responses.length > 0 ? responses[0].filter(a => a.Title == 'API Shipment') : [];
            let res = result.filter(a => a.Date != null);
            let sortedDateList = res.length > 0 ? res.sort((a, b) =>
                new Date(a.Date).getTime() - new Date(b.Date).getTime()) : [];
            // console.log("sortedDateList", sortedDateList);
            AllASData = sortedDateList;
            this.setState({
                ALLApiShipmentDateData: AllASData
            });
        });
    }

    getApiShipmentDateData = (PfizerConnectID) => 
        {
        let earliestDate = null;

        let pcFieldValues = this.state.PfizerConnecfieldValues;
        const fetchAPIShipmentDateData = DataService.getApiShipmentDateData(PfizerConnectID);
        Promise.all([fetchAPIShipmentDateData]).then((responses: any[]) => {
            let result = responses[0];
            let dtAry = result ? result.filter(a => a.Title == 'API Shipment') : [];
            if (dtAry.length > 0) {
                let filteredDateAry = dtAry.filter(a => a.Date !== null);
                if (filteredDateAry.length != 0) {
                    if (filteredDateAry.length > 1) {
                        let sortedDateList = filteredDateAry.sort((a, b) =>
                            new Date(a.Date).getTime() - new Date(b.Date).getTime()
                        )
                        // console.log("_APISPDates", sortedDateList);

                        earliestDate = sortedDateList.length > 0 ? sortedDateList[0].Date : null;
                        // console.log("earliestAPISPDate", earliestDate);
                    }
                    else if (filteredDateAry.length > 0) {
                        earliestDate = (filteredDateAry[0].Date);
                        // console.log("earliestAPISPDate", earliestDate);
                    }
                }
                if(earliestDate != null){ //. Trupti - 14-5-2024 - fixed issue 
                let drDetails = this.state.DRdetails;
                if(drDetails?.PfizerConnectID != null && drDetails?.PfizerConnectID != ''){
                    let apiShipmentDate = new Date(earliestDate);
                    let finalDate = apiShipmentDate.setMonth(apiShipmentDate.getMonth() + 2);
                    pcFieldValues.APIShipmentDate = finalDate;               
                }
                else{
                    pcFieldValues.APIShipmentDate = earliestDate;
                }
                  
                this.setState({
                    PfizerConnecfieldValues: pcFieldValues
                }, () => {
                    //this.getProjectDetailsListData();
                });
            }
            else{ // if API shipment date is null get ProjectImplementation date and add 2 months to set api shipment date
                   
                let apiShipmentDate = new Date(pcFieldValues.ProjectImplementationDate);
                    let finalDate = apiShipmentDate.setMonth(apiShipmentDate.getMonth() + 2);
                    pcFieldValues.APIShipmentDate = finalDate;               
                this.setState({
                    PfizerConnecfieldValues: pcFieldValues
                }, () => {
                });
            } //.
                return earliestDate;
            }
            else if (pcFieldValues.ProjectImplementationDate != null) {
                let apiShipmentDate = new Date(pcFieldValues.ProjectImplementationDate);
                let finalDate = apiShipmentDate.setMonth(apiShipmentDate.getMonth() + 2);
                pcFieldValues.APIShipmentDate = finalDate;
                this.setState({
                    PfizerConnecfieldValues: pcFieldValues
                }, () => {
                });
                return earliestDate;
            }
        });
    }

    async handlePfizerConnectDataFieldChange(fieldName: string, fieldValue: any): Promise<void> {
        if (fieldName == 'APIShipmentDate' || fieldName == 'FirstShipmentDate' || fieldName == 'ProjectImplementationDate') {
            let PCFieldVal = this.state.PfizerConnecfieldValues;
            let PCID = PCFieldVal ? PCFieldVal.PfizerConnectID : null;
            let ProjectImpDate = PCID != null && PCID != '' ? this.state.PfizerConnecfieldValues?.ProjectImplementationDate : fieldValue;
            if (fieldName == 'APIShipmentDate') {
                PCFieldVal['ProjectImplementationDate'] = ProjectImpDate;
            }
            PCFieldVal[fieldName] = fieldValue;

            this.setState({
                PfizerConnecfieldValues : PCFieldVal
            });
        }
        //return fieldValue;
    }

    ValidatePCData = async (val) => {
        let isValid = this.validatePCFields();
        if (isValid) {
            this.getCurrentPfizerProjectID();
        }
        else {
            //Enter all mandatory
            // this.setState({
            //     showSystemMsg: true,
            //     systemMsg: 'Please Enter all mandatory fields'
            // });
            this.toast.show({ severity: 'warn', summary: 'Alert Message', detail: 'Please Enter all mandatory fields', life: 4000 })

        }
    }

    //Get pfizer current Pfizer Connect ID 
    getCurrentPfizerProjectID = () => {
        let CurrentPCID = null;
        const fetchAPIShipmentDateData = DataService.getCurrentPfizerConnectID();
        Promise.all([fetchAPIShipmentDateData]).then((responses: any[]) => {
            CurrentPCID = responses.length > 0 ? responses[0][0].ConnectID + 1 : null;
            if (CurrentPCID != null) {
                this.handlePfizerConnectSaveUpdate(CurrentPCID);
            }
        });
    }

    handlePfizerConnectSaveUpdate = async (CurrentPCID) => {
        let selectedPCID = this.state.selectedPCID;
        let PCFieldVal = this.state.PfizerConnecfieldValues;

        if (selectedPCID != null) {//update
            let selectedPPCRec = [...this.state.selectedPCRecord];
            //set current pfizerconnectid rec isactive to false in pcupdatehistory dr list
            this.handleUpdatePCIDHistory(selectedPPCRec) //
        }
        else if (this.state.DRdetails.PfizerConnectID == null || this.state.DRdetails.PfizerConnectID == '') { //create new PC ID

            //if (isValid) {
            let newPCRec = null;

            //let batch = DataService.PCNCM_Context.createBatch();
            let listPC = DataService.PCNCM_Context.lists.getByTitle("ConnectProject Master");
            let UserData = await DataService.PCNCM_Context.ensureUser(PCFieldVal.LaunchLeaderEmail).then((item) => {
            //await DataService.PCNCM_Context.ensureUser(PCFieldVal.LaunchLeader).then((item) => {
                
                return item;
            });
            // console.log("PC LaunchLeader", UserData);

            //set First Shipment date
            let firstSPDate = '';
            if (PCFieldVal.FirstShipmentDate != null && PCFieldVal.FirstShipmentDate != '') {
                const currentDate = new Date();
                const currentdt = format(currentDate, "yyyy-MM-dd HH:mm");

                const FirstAPIDate = new Date(PCFieldVal.FirstShipmentDate);
                const formattedDate = format(FirstAPIDate, "yyyy-MM-dd HH:mm");
                const FirstApiShipmentDate = new Date(formattedDate.substring(0, 10) + "T" + currentdt.substring(11, 16));
                firstSPDate = new Date(FirstApiShipmentDate).toISOString();
            }
            let ProjectImpDate = '';
            if (PCFieldVal.APIShipmentDate != null && PCFieldVal.APIShipmentDate != '') {
                const currentDate = new Date();
                const currentdt = format(currentDate, "yyyy-MM-dd HH:mm");

                const ApiDSDate = new Date(PCFieldVal.APIShipmentDate);
                const formattedDate = format(ApiDSDate, "yyyy-MM-dd HH:mm");
                let apiShipmentDate = new Date(formattedDate.substring(0, 10) + "T" + currentdt.substring(11, 16));
                let finalDate = apiShipmentDate.setMonth(apiShipmentDate.getMonth() - 2);

                //add apishipment date in ConnectProjectDatabase list and apishipment date as Project implementation Date value
                ProjectImpDate = new Date(finalDate).toISOString();
                this.handleSaveAPIShipmentDate(CurrentPCID, ProjectImpDate);
            }
            //changeOwnerId:{results:[]}
            let changeOwnerval = { results: [UserData.data.Id] };
            let ProjectDesc = PCFieldVal.PfCompoundNumber + ' ' + PCFieldVal.Pfcode;
            let grpVal = this.state.DRdetails?.GRP;
            let ProjectIDVal = this.state.DRdetails?.DRID;
            newPCRec = {
                ProjectName: PCFieldVal.ProjectTitle,
                ConnectID: CurrentPCID,
                ChangeOwnerId: UserData ? changeOwnerval : '',
                FirstShipmentDate: firstSPDate,
                ProjectImplementationDate: ProjectImpDate,
                ProjectDescription: ProjectDesc,
                GRP: grpVal,
                NetworkChangeTrigger: "4 - New Pfizer Product Launch"
            }

            // console.log("newPCRec", newPCRec);
            let PCRecordID = null;
            await listPC.items.add(newPCRec).then(async (items) => {
                PCRecordID = items.data.ID;
                let systemMsg = "Data Saved Successfully."
                this.setState({ showSystemMsg: true, systemMsg: systemMsg, PfizerConnectdialogOpen: false });
                if (PCRecordID != null) {
                    await this.handelPCUpdateHistory(PCRecordID, CurrentPCID, 'Add', ProjectIDVal);
                }
            }).catch(error => {
                console.log("Error while adding Pfizer Connect data to batch", error);
                this.setState({ PfizerConnectdialogOpen: false });
            });
        } else {
            this.setState({
                AllPfizerConnectData: [],
                showAllPfizerConnectData: false,
                PfizerConnectdialogOpen: false
            });
            // this.ClosePopup(false);
        }
    }

    handleSaveAPIShipmentDate = async (CurrentPCID, ProjectImpDate) => {
        let newAPISPRec = null;

        //let batch = DataService.PCNCM_Context.createBatch();
        let listPC = DataService.PCNCM_Context.lists.getByTitle("ConnectProjectDatabase");

        newAPISPRec = {
            ConnectID: CurrentPCID,
            Title: 'API Shipment',
            Date: ProjectImpDate
        };

        listPC.items.add(newAPISPRec).then((items) => {
            console.log("Api Shipment Date Saved Successfully");
            return items;
        }).catch(error => {
            console.log("Error while adding API ShipmentDate to batch", error);
        });
    }

    handelPCUpdateHistory = async (PCRecordID, CurrentPCID, Action, ProjectIDVal) => {
        //let PCList = clientContext.get_web().get_lists().getByTitle("PfizerConnectUpdateDetails");

        //let PCbatch = DataService.NPL_Context.createBatch();
        let listDR = DataService.NPL_Context.lists.getByTitle("PfizerConnectUpdateDetails");
        let PCFieldValues = this.state.PfizerConnecfieldValues;

        if (Action == 'Add') {

            let newRec = {
                ProjectID: ProjectIDVal,
                ProjectName: PCFieldValues.ProjectTitle,
                FirstShipmentDate: new Date(PCFieldValues.FirstShipmentDate),
                APIShipmentDate: new Date(PCFieldValues.APIShipmentDate),
                PlaniswareID: PCFieldValues.Pfcode,
                RnDProjNo: PCFieldValues.PfCompoundNumber,
                LaunchLeader: PCFieldValues.LaunchLeader,
                PfizerConnectID: CurrentPCID ? CurrentPCID.toString() : CurrentPCID,
                PfizerConnectRecordID: PCRecordID ? PCRecordID.toString() : PCRecordID,
                NetworkChangeTriggerCategory: PCFieldValues.NetworkChangeTrigger,
                IsActive: true,
                ProjectImplementationDate: new Date(PCFieldValues.ProjectImplementationDate)
            }
            console.log("PChistoryRec", newRec);


            await listDR.items.add(newRec).then(async (items) => {
                let PCHistoryID = items.data.ID
                let PCRecordID = items.data.PfizerConnectRecordID;
                let PCID = items.data.PfizerConnectID;

                if (PCHistoryID != null) {
                    console.log("Pfizer Connect Update History Details");
                    //3.Update pfizer details list with pfizer connect id and History ID
                    await this.handleProjectDRSave(PCRecordID, PCID, PCHistoryID, ProjectIDVal);
                }
                //return items;
            }).catch(error => {
                console.log("Error while adding PC History data to batch", error);
            });
            // await PCbatch.execute()
            //     .then(async (items) => {
            //         // let PCHistoryID = items[0].ID
            //         // let PCRecordID = items[0].PfizerConnectRecordID;
            //         // let PCID = items[0].PfizerConnectID;

            //         // if (PCHistoryID) {
            //         console.log("Pfizer Connect Update History Details");
            //         // //3.Update pfizer details list with pfizer connect id and History ID
            //         //  // //get data from dlpplist
            //         //  setTimeout(() => {
            //         //     this.handleProjectDRSave(PCRecordID, PCID, PCHistoryID, ProjectIDVal);
            //         // }, 1000);
            //         // }
            //         //return items;
            //     }).catch(error => {
            //         console.log("Error while saving plans data", error);
            //     });

        }
        else {//pfizer connect update
            let selectedPCRec = [...this.state.selectedPCRecord];
            // let UserData = await web.ensureUser(selectedPCRec[0]?.LaunchLeader,).then((item) => {
            //     return item;
            // });
            if (selectedPCRec.length > 0) {
                let newRec = {
                    ProjectID: ProjectIDVal,
                    ProjectName: selectedPCRec[0]?.ProjectName,
                    FirstShipmentDate: selectedPCRec[0]?.FirstShipmentDate,
                    APIShipmentDate: selectedPCRec[0]?.APIShipmentDate,
                    PlaniswareID: selectedPCRec[0]?.Pfcode,
                    RnDProjNo: selectedPCRec[0]?.PfCompoundNumber,
                    LaunchLeader: selectedPCRec[0]?.LaunchLeader,
                    PfizerConnectID: CurrentPCID.toString(),
                    PfizerConnectRecordID: PCRecordID.toString(),
                    NetworkChangeTriggerCategory: selectedPCRec[0]?.NetworkChangeTrigger,
                    IsActive: true,
                    ProjectImplementationDate: selectedPCRec[0]?.ProjectImplementationDate
                }
                console.log("PChistoryRec", newRec);
                listDR.items.add(newRec).then((items) => {
                    let PCHistoryID = items.data.ID
                    let PCRecordID = items.data.PfizerConnectRecordID;
                    let PCID = items.data.PfizerConnectID;

                    if (PCHistoryID != null) {
                        console.log("Pfizer Connect Update History Details");
                        this.handleProjectDRSave(PCRecordID, PCID, PCHistoryID, ProjectIDVal);
                    }
                    let systemMsg = "Data Saved Successfully."
                    this.setState({ showSystemMsg: true, systemMsg: systemMsg, PfizerConnectdialogOpen: false });
                    //return items;
                }).catch(error => {
                    console.log("Error while adding PC History data to batch", error);
                });
                // await batch.execute()
                //     .then(async (items) => {
                //         // let PCHistoryID = items[0].ID
                //         // let PCRecordID = items[0].PfizerConnectRecordID;
                //         // let PCID = items[0].PfizerConnectID;

                //         // if (PCHistoryID) {
                //         console.log("Pfizer Connect Update History Details");
                //         //     setTimeout(() => {
                //         //         this.handleProjectDRSave(PCRecordID, PCID, PCHistoryID, ProjectIDVal);
                //         //     }, 1000);
                //         // }
                //         //return items;
                //     }).catch(error => {
                //         console.log("Error while saving Pfizer Connect Update History data", error);
                //     });
            }
        }
    }

    handleProjectDRSave = async (PCRecordID, PCID, PCHistoryID, ProjectIDVal) => {

        //let batch = DataService.NPL_Context.createBatch();
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        } else {

        }
        let listDR = DataService.NPL_Context.lists.getByTitle(projectDetailsListName);

        if (PCHistoryID != null) {
            let updatePCData = {
                PfizerConnectID: PCID ? PCID.toString() : PCID,
                PfizerConnectHistoryID: PCHistoryID ? PCHistoryID.toString() : PCHistoryID,
                PfizerConnectRecordID: PCRecordID ? PCRecordID.toString() : PCRecordID
            }
            await listDR.items.getById(ProjectIDVal).update(updatePCData)
                .then(async (items) => {
                    //return items;
                    await this.getProjectDetailsListData();
                }).catch(error => {
                    console.log("Error while updating PC data to batch", error);
                    this.ClosePopup(false);
                });
            //   await batch.execute()
            //     .then((items) => {

            //         //show message
            //         console.log("PC data to DR Saved Successfully.");
            //     }).catch(error => {
            //         console.log("Error while saving PC data to DR", error);
            //         //this.ClosePopup(false);
            //     });
        }
    }

    handleUpdatePCIDHistory = async (selectedPPCRec) => {
        let listDR = DataService.NPL_Context.lists.getByTitle("PfizerConnectUpdateDetails");
        //let listDR = web.lists.getByTitle("PfizerConnectUpdateDetails");
        let PCFieldValues = this.state.PfizerConnecfieldValues;
        let ProjectIDVal = this.state.DRdetails?.DRID;
        if (PCFieldValues.PfizerConnectHistoryID != null && PCFieldValues.PfizerConnectHistoryID != '') {
            let updateItem = {
                IsActive: false
            }
            await listDR.items.getById(PCFieldValues.PfizerConnectHistoryID).update(updateItem)
                .then(async (items) => {
                    console.log("Pfizer Connect Update History Details");
                    //add updated pfizer connect id's data in history list
                    await this.handelPCUpdateHistory(selectedPPCRec[0]?.PCRecordID, selectedPPCRec[0]?.PfizerConnectID, 'update', ProjectIDVal);
                    //return items;
                }).catch(error => {
                    console.log("Error while updating PC data to batch", error);
                    this.ClosePopup(false);
                });
            // await batch.execute()
            //     .then((items) => {
            //         //let itemId = pcListItem.get_item("ID");
            //         //if (itemId) {
            //         console.log("Pfizer Connect Update History Details");
            //         //add updated pfizer connect id's data in history list
            //         this.handelPCUpdateHistory(selectedPPCRec[0]?.PCRecordID, selectedPPCRec[0]?.PfizerConnectID, 'update', ProjectIDVal);
            //         //}
            //     });
        }
        else {
            //add updated pfizer connect id's data in history list
            this.handelPCUpdateHistory(selectedPPCRec[0]?.PCRecordID, selectedPPCRec[0]?.PfizerConnectID, 'update', ProjectIDVal);
        }
    }

    validatePCFields = () => {
        let isValid = false;
        let PCFieldVal = this.state.PfizerConnecfieldValues;

        if (PCFieldVal != null) {
            if ((PCFieldVal.LaunchLeader != null) &&
                //(PCFieldVal.APIShipmentDate != null && PCFieldVal.APIShipmentDate != '') &&
                (PCFieldVal.FirstShipmentDate != null && PCFieldVal.FirstShipmentDate != '') &&
                (PCFieldVal.Pfcode != null && PCFieldVal.Pfcode != '') &&
                (PCFieldVal.PfCompoundNumber != null && PCFieldVal.PfCompoundNumber != '')
            ) {
                isValid = true;
            }
        }
        return isValid;
    }

    viewPFDialogAlert = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link'>
                <Button className='p-button-raised p-button-rounded okBtn' disabled={this.state.formType == 'View'} onClick={e =>{ this.getAllPfizerConnectData(); this.getPfizerConnectData(this.state.DRdetails);}} label='Link Pfizer Connect' />
                <Button className='p-button-raised p-button-rounded saveBtn' onClick={e => this.ValidatePCData(e)}
                    disabled={
                        // (this.state.DRdetails.PfizerConnectID != null && this.state.DRdetails.PfizerConnectID != '') ?
                        // (this.state.selectedPCID == null || this.state.selectedPCID == '') :
                        // !(this.state.selectedPCID != null && this.state.selectedPCID != '')
                        this.state.formType == 'View' || (this.state.selectedPCID == null && this.state.selectedPCID == '') ?
                            this.state.formType == 'View' || this.state.DRdetails.PfizerConnectID == null || this.state.DRdetails.PfizerConnectID == ''
                            : false
                    }
                    label={(this.state.DRdetails.PfizerConnectID != null && this.state.DRdetails.PfizerConnectID != '') ?
                        'Update & Confirm' : 'Confirm'} />
                <Button className='p-button-raised p-button-rounded closeBtn'
                    onClick={e => this.setState({ PfizerConnectdialogOpen: false, AllPfizerConnectData: [], showAllPfizerConnectData: false, selectedPCID: null })}
                    icon='dx-icon-close' label='Close' />
            </div>
        );
    }

    deletePlanUpdate = (popupPlanGrid, deleteRecID) => {
        //ProjectPlanPopupGrid 
        let planGridDt = [...this.state.PlanGridData];
        let recordTodelete = planGridDt.filter(a => a.id == deleteRecID);
        let subPlansToDelete = planGridDt.filter(a => a.Parent == recordTodelete[0].ProjectName);
        //delete plan
        planGridDt = planGridDt.filter(a => a.id != deleteRecID);
        if (subPlansToDelete.length > 0) {
            subPlansToDelete.map((dt) => {
                planGridDt = planGridDt.filter(a => a.id != dt.id);
            });
        }
        this.setState({
            ProjectPlanPopupGrid: popupPlanGrid,
            PlanGridData: planGridDt
        });
    }

    //Trupti - 14-5-2024 - added new condition on checked property to set checked value for current record
    public PCActionCol(rowData: any) {
        return (
            <>
                <RadioButton inputId="PCID" name="PCID" value={rowData.data?.PfizerConnectID}
                    onChange={(e) => this.setSelectedPCRecord(e)}
                    checked={
                         (this.state.selectedPCID != null && this.state.selectedPCID == rowData.data?.PfizerConnectID)
                        || (this.state.selectedPCID== null && this.props.DRdetails?.PfizerConnectID == rowData.data?.PfizerConnectID)
                    } />
            </>)
    }

    getPfizerConnectDataPC = async (pcData) => {
        // This method is derived from getPfizerConnectData due to production issue -PRAMATH
        let drLocal = {...this.state.DRdetails};
        var pfizerConnectRecord = null;
        if(pcData.length){
            pfizerConnectRecord={...pcData[0]};
        }
        
        // const fetchPfizerConnectData = DataService.getPfizerConnectData(pcData.ID);
        // Promise.all([fetchPfizerConnectData]).then((responses) => {
            if (pfizerConnectRecord) {
                // console.log("", responses);
                // let res = responses[0][0];
                let pfizerConnectFieldValues = {
                    // ProjectTitle: res?.ProjectName,
                    // PfizerConnectID: res?.ConnectID,
                    // PCRecordID: res?.ID,
                    ProjectTitle: pfizerConnectRecord ? pfizerConnectRecord.ProjectName : drLocal.ProductDescription,
                    PfizerConnectID: pfizerConnectRecord ? pfizerConnectRecord.PfizerConnectID : drLocal.PfizerConnectID,
                    PCRecordID: pfizerConnectRecord ? pfizerConnectRecord.PCRecordID : drLocal.PfizerConnectRecordID,
                    PfizerConnectHistoryID: drLocal.PfizerConnectHistoryID,
                    PfCompoundNumber: drLocal.RnDProjNo,
                    Pfcode: drLocal.PlaniswareLeadCode,
                    //APIShipmentDate : '',
                    FirstShipmentDate: pfizerConnectRecord?.FirstShipmentDate,
                    LaunchLeader: drLocal.LaunchLeader,
                    ProjectImplementationDate: pfizerConnectRecord?.ProjectImplementationDate,
                    //NetworkChangeTrigger: res?.NetworkChangeTrigger
                    NetworkChangeTrigger: pfizerConnectRecord ? pfizerConnectRecord.NetworkChangeTrigger : '4 - New Pfizer Product Launch'
                }
                this.setState({
                    PfizerConnecfieldValues: pfizerConnectFieldValues
                }, async () => {
                    let earliestApiSPDate = await this.getApiShipmentDateData(pfizerConnectRecord.PfizerConnectID);
                    console.log("earliestApiSPDate", earliestApiSPDate);
                });
            }
        // }).catch((error) => {
        //     let errorMsg = {
        //         Message: error.message,
        //         StackTrace: new Error().stack
        //     };
        //     DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
        //         console.error(error);
        //     });
        // });
    }

    setSelectedPCRecord = (dt) => {
        if (dt.target.checked) {
            
            let AllPCData = [...this.state.AllPfizerConnectData];
            let selectedPCRec = AllPCData.filter(a => a.PfizerConnectID == dt.target.value);
            this.getPfizerConnectDataPC(selectedPCRec);
            this.setState({ selectedPCID: dt.target.value, selectedPCRecord: selectedPCRec, AllPfizerConnectData: AllPCData });
        }
        else {
            this.setState({ selectedPCID: null, selectedPCRecord: [] });
        }
    }

    getPCFieldValues = (fieldName) => {
        let fieldVal = null;
        let selectedPCID = this.state.selectedPCID;
        let selectedPCRec = [...this.state.selectedPCRecord];
        let PCFieldVal = this.state.PfizerConnecfieldValues;
        if (selectedPCID != null) {
            if (fieldName == 'APIShipmentDate' || fieldName == 'FirstShipmentDate' || fieldName == 'ProjectImplementationDate') {
                fieldVal = selectedPCRec[0]?.[fieldName] ? moment((selectedPCRec[0]?.[fieldName])).format('YYYY-MM-DD') : null;
            }
            if (fieldName == "PfCompoundNumber" || fieldName == "Pfcode" || fieldName == "LaunchLeader") {
                fieldVal = PCFieldVal?.[fieldName];
            }
            else {
                fieldVal = selectedPCRec[0]?.[fieldName];
            }
        }
        else {
            if (fieldName == 'APIShipmentDate' || fieldName == 'FirstShipmentDate' || fieldName == 'ProjectImplementationDate') {
                fieldVal = PCFieldVal?.[fieldName] ? moment((PCFieldVal?.[fieldName])).format('YYYY-MM-DD') : null;
            }
            else {
                fieldVal = PCFieldVal?.[fieldName];
            }
        }
        return fieldVal;
    }

    getLabelTextVal = (dt) => {
        let labelText = '';
        let labelData = this.state.lstLabels;
        if (labelData.length > 0) {
            let labels = labelData.filter(a => a.value == dt.data.LabelText);
            if (labels.length > 0) {
                //labelText = labels[0].value;
                labelText = labels[0].value.split('$').length > 0 ? labels[0].value.split('$')[0] : labels[0].value;
                // let _labelText = dt.data.LabelText.split('$').length > 0 ? dt.data.LabelText.split('$')[0] : dt.data.LabelText;
                // console.log('_labelText', _labelText);

            }
            else {
                labelText = dt.data.LabelText;
            }
        }
        return labelText;
    }

    handleConnectLaunch = () => {
        //let PCRecordIDVal = this.state.PfizerConnecfieldValues?.PfizerConnectRecordID
        let PCRecordIDVal = this.state.PfizerConnecfieldValues?.PfizerConnectRecordID ? this.state.PfizerConnecfieldValues?.PfizerConnectRecordID
            : this.state.PfizerConnecfieldValues?.PCRecordID;
        if (PCRecordIDVal && PCRecordIDVal != '') {
            // console.log("siteUrl", DataService.PCNCM_Url + '#/EditForm/' + PCRecordIDVal + '/Edit');
            let siteUrl = DataService.PCNCM_Url + '#/EditForm/' + PCRecordIDVal + '/Edit';
            window.open(siteUrl, '_blank');
        }
    };

    getProjectDetailsListData = () => {
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        } else {

        }
        let PCfieldVal = this.state.PfizerConnecfieldValues;
        let drDetails = this.state.DRdetails;
        const fetchDRdetails =
            DataService.fetchAllItems_DR_WithFilter(projectDetailsListName,
                `ID eq ${this.props.DRID}`)
        Promise.all([fetchDRdetails])
            .then(async (responses) => {
                let res = responses.length > 0 ? responses[0][0] : responses;
                const drData = {
                    DRID: this.props.DRID,
                    ProjectTitle: res?.ProjectTitle,
                    API: res?.MoleculeName,
                    PlaniswareLeadCode: res?.PlaniswareID,
                    GRP: res?.ProposedGRP0,
                    OperationalUnit: res?.OperationalUnit,
                    BusinessUnit: res?.BU?.indexOf('->') !== -1 ? res?.BU?.split('->')[1] : res?.BU,
                    SubBusinessUnit: res?.BusinessUnit?.indexOf('->') !== -1 ? res?.BusinessUnit?.split('->')[1] : res?.BusinessUnit,
                    LabelName: res?.TradeName,
                    Indication: res?.Indication,
                    RnDProjNo: res.RnDProjNo,
                    OtherAlias: res.OtherAlias,
                    GlobalBrandAPI: res.GlobalBrandAPI,
                    TherapeuticArea: res.TherapeuticArea,
                    BUnit: res?.BU,
                    SBUnit: res?.BusinessUnit,
                    LaunchLeader: res?.LaunchLeaderUser?.Title,
                    PfizerConnectID: res.PfizerConnectID,
                    PfizerConnectRecordID: res.PfizerConnectRecordID,
                    PfizerConnectHistoryID: res.PfizerConnectHistoryID
                }
                // console.log('Drdata', drData);
                PCfieldVal.LaunchLeader = drData.LaunchLeader,
                    PCfieldVal.PfCompoundNumber = drData.RnDProjNo,
                    PCfieldVal.Pfcode = drData.PlaniswareLeadCode,
                    PCfieldVal.ProjectTitle = drData.ProjectTitle,
                    PCfieldVal.PfizerConnectID = drData.PfizerConnectID,
                    PCfieldVal.PfizerConnectRecordID = drData.PfizerConnectRecordID,
                    PCfieldVal.PfizerConnectHistoryID = drData.PfizerConnectHistoryID
                //
                    drDetails.PfizerConnectID = drData.PfizerConnectID,
                    drDetails.PfizerConnectRecordID = drData.PfizerConnectRecordID,
                    drDetails.PfizerConnectHistoryID = drData.PfizerConnectHistoryID,
                    this.setState({
                        PfizerConnecfieldValues: PCfieldVal,
                        DRdetails: drDetails
                    });
                    await this.getPfizerConnectData(drDetails);
            });
    }

    public render(): React.ReactElement<IProjectPlanProps> {
        const pageSizes = [10, 25, 50, 100, 'all'];
        return (
            <div className='ProductGrid ppgrid' style={{ backgroundColor: "#f2f2f8" }} >
                <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' />
                <Toast ref={(el) => { this.toast = el }} position="bottom-right" />
                <DataGrid
                    // dataSource={this.state.PlanGridData}
                    dataSource={this.props.ProjectPlanTabData.ProjectPlanData}
                    filterValue={this.state.gridFilterValue}
                    defaultFilterValue={this.state.gridFilterValue}
                    ref={(ref) => { this.dataGrid = ref; }}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    columnResizingMode={'widget'}
                    filterSyncEnabled={false}
                    showColumnLines={true}
                    rowAlternationEnabled={false}
                    showBorders={true}
                    showRowLines={false}
                    width='100%'
                    height={604}
                    hoverStateEnabled={true}
                    columnMinWidth={100}
                    onCellPrepared={this.highlightSelected}
                    onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                    columnAutoWidth={true}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    <Editing
                        mode="cell"
                        // onChangesChange={this.dtChanges}
                        // allowUpdating={checkForComments}
                        allowUpdating={false}
                        allowAdding={false}
                        allowDeleting={false} />
                    <Toolbar>
                        <Item name='searchPanel' location='after'>
                        </Item>
                        <Item location="after">
                            <Button style={{ marginLeft: '10px' }} title='Add Market' className='p-button-rounded p-button-raised feedbackBtn' disabled={this.state.formType == 'View'} icon='dx-icon-add' label='Add Market' onClick={() => this.setProjectPlanPopupData()} />
                        </Item>
                        <Item location="after">
                            <div style={{ border: '1px solid lightgray', height: '33px' }}></div>
                        </Item>
                        <Item>
                            <Button style={{ marginLeft: '5px' ,cursor:this.state.DRdetails.PfizerConnectID == null || this.state.DRdetails.PfizerConnectID == '' ? 'not-allowed':'pointer' }}
                            disabled={this.state.DRdetails.PfizerConnectID == null || this.state.DRdetails.PfizerConnectID == ''&& this.state.formType==='View'} title='Pfizer Connect' className='p-button-rounded p-button-raised feedbackBtn' icon='' label='Pfizer Connect' onClick={() => this.showPfizerConnectPopup()} />
                        </Item>
                        <Item location="after">
                            <div style={{ border: '1px solid lightgray', height: '33px' }}></div>
                        </Item>
                        <Item location="after">
                            <Button style={{ marginLeft: '5px' }} title='Refresh' className='p-button-rounded p-button-raised feedbackBtn' disabled={this.state.formType == 'View'} icon='dx-icon-refresh' label='Refresh' onClick={() => this.refreshProjectPlanData()} />
                        </Item>
                        <Item location="after">
                            <div style={{ border: '1px solid lightgray', height: '33px' }}></div>
                        </Item>
                        <Item location="after">
                            <Button className='p-button-raised p-button-rounded feedbackBtn'
                                onClick={this.onExporting}>
                                <img src={exportIcon} style={{ paddingRight: "0.4rem" }} />Export
                            </Button>
                        </Item>
                    </Toolbar>
                    <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                    <Paging enabled={true} defaultPageSize={10} />
                    <SearchPanel visible={true} text={this.state.QueryString ? this.state.QueryString : ''} placeholder="Search..." highlightCaseSensitive={false} />
                    <HeaderFilter visible={true} />
                    <Column cellRender={e => this.ActionCol(e)} minWidth={110} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                    <Column
                        dataField={'ProjectName'} cellRender={this.projectNameRender} caption={'Project Name'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'DeepDive'}
                        caption={'NPL T6'} dataType={'boolean'} visible={true}
                        allowEditing={false}
                        cellRender={rowData => this.ActionColumn(rowData, 'checkbox', 'DeepDive')}
                    />
                    <Column
                        dataField={'LaunchLead'} caption={'Launch Leader'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'LaunchReadinessDate'} caption={'Launch Readiness Date'}
                        dataType={'date'} format='MMM-dd-yyyy' visible={true} alignment='center'
                        sortOrder={'asc'}
                    />
                    <Column
                        dataField={'LaunchProgress'} caption={'Launch Progress'} dataType={'string'} visible={true}
                        // cellRender={e => <StatusTemplate value={e.value} />} 
                        sortOrder={true}
                    />
                    <Column
                        dataField={'Template'} caption={'Template'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'WaveType'} caption={'Wave Type'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'LabelText'} caption={'Label'} dataType={'string'} minWidth={'150px'} visible={true}
                        cellRender={(e) => this.getLabelTextVal(e)}
                    //{e=> (e.value?.split('$').length > 0 ? e.value.split('$')[0] : e.value) }
                    />
                    <Column
                        dataField={'Region'} caption={'Region'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'Market'} caption={'Market'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'Country'} caption={'Country'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'ParentMarket'} caption={'Shares Presentation With'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'PackSize'} caption={'Pack Size'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                    <Column
                        dataField={'PlanStatus'} caption={'Plan Creation Status'} dataType={'string'} visible={true} //alignment={item.alignment}
                    />
                </DataGrid>

                {this.state.planPopupOpen &&
                    <ProjectPlanPopupWrapper
                        PlanGridData={this.props.ProjectPlanTabData.ProjectPlanData}
                        //{this.state.PlanGridData}
                        closePopup={this.ClosePopup}
                        planFieldsData={this.state.planFieldsData}
                        planFormFields={this.state.formFields}
                        planPopupOpen={this.state.planPopupOpen}
                        Action={this.state.Action}
                        planfieldValues={this.state.planfieldValues}
                        onConfirmSave={this.savePlanData}
                        ProjectPlanPopupGrid={this.state.ProjectPlanPopupGrid}
                        currentUser={this.props.currentUser}
                        lstDefaultWave={this.state.lstDefaultWave}
                        newLabelArry={this.state.newLabelAry}
                        OnNewLabelAdd={this.UpdateNewLabelAry}
                        onPlanDelete={this.deletePlanUpdate}
                        DRdetails={this.state.DRdetails}
                    />
                }

                {/* Alert Message popup */}
                <Dialog
                    closable={false}
                    visible={this.state.showSystemMsg}
                    style={{ height: '30vh', width: '35vw' }}
                    onHide={() => this.setState({ showSystemMsg: false })}
                    icons={this.viewDialogAlert}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className='label-name' style={{ color: "black" }}>
                            {this.state.systemMsg}
                        </span>
                    </div>
                </Dialog>

                {/* Pfizer connect Popup */}
                <Dialog
                    header={(this.props.DRdetails?.PfizerConnectID != '' && this.props.DRdetails?.PfizerConnectID != null) ? 'Pfizer Connect Details' : 'Create Pfizer Connect ID'}
                    closable={false}
                    visible={this.state.PfizerConnectdialogOpen}
                    style={{ height: '90vh', width: '70vw' }}
                    onHide={() => this.setState({ PfizerConnectdialogOpen: false, showAllPfizerConnectData: false })}
                    icons={this.viewPFDialogAlert}>
                    {/* legends */}
                    <div style={{ display: 'inline-flex', width: '-webkit-fill-available', justifyContent: 'end', marginLeft: '0.5%' }}>
                        <div style={{ marginLeft: '1%' }}>
                            <i className='pi pi-stop' style={{ background: `#a9a9a9`, color: `#a9a9a9` }}></i>
                            <span > DR</span>
                        </div>
                        <div style={{ marginLeft: '1%' }}>
                            <i className='pi pi-stop' style={{ background: `#d60055`, color: `#d60055` }}></i>
                            <span > PfizerConnect</span>
                        </div>
                    </div>

                    <Toast ref={(el) => this.toast = el} position="bottom-right" />
                    <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                        <AccordionTab header='Pfizer Connect'>
                            <Row style={{ marginTop: '5px' }}>
                                <Col md={6} className=''>
                                    <label>Project Name</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("ProjectTitle", "Text",
                                        // (this.state.selectedPCID != null ? this.state.selectedPCRecord?.ProjectTitle :
                                        //     this.state.PfizerConnecfieldValues?.ProjectTitle),
                                        this.getPCFieldValues('ProjectTitle'),
                                        [],
                                        true, this.handlePfizerConnectDataFieldChange, "", '#a9a9a9')}
                                </Col>
                                <div style={{ width: '50%', }}>
                                    <label>Pfizer Connect ID</label>
                                    {/* <span className='asteriskCls'>*</span> */}
                                    <Col style={{
                                        width: (this.state.PfizerConnecfieldValues?.PfizerConnectID != null &&
                                            this.state.PfizerConnecfieldValues?.PfizerConnectID != '') ? '95%' : '100%', display: 'inline-flex'
                                    }}
                                        md={6} className=''>
                                        {PlanFieldControls.getFieldControls("PfizerConnectID", "Text",
                                            // (this.state.selectedPCID != null ? this.state.selectedPCRecord?.PfizerConnectID :
                                            // this.state.PfizerConnecfieldValues?.PfizerConnectID), 
                                            this.getPCFieldValues('PfizerConnectID'),
                                            [],
                                            true, this.handlePfizerConnectDataFieldChange)}
                                    </Col>
                                    <span style={{
                                        display: (this.state.PfizerConnecfieldValues?.PfizerConnectID != null ? '' :
                                            (this.state.selectedPCID != null ? 'inline-flex' : 'none')), color: 'green', marginLeft: '5px'
                                        , cursor: 'pointer'
                                    }} onClick={(e) => this.handleConnectLaunch()}
                                    ><i className="pi pi-external-link" title='Launch Pfizer Connect' style={{ fontSize: '1rem' }}></i></span>
                                </div>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col md={6} className=''>
                                    <label>PF/Compound Number</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("PfCompoundNumber", "Text",
                                        // (this.state.selectedPCID != null ? this.state.selectedPCRecord?.PfCompoundNumber :
                                        //     this.state.PfizerConnecfieldValues?.PfCompoundNumber),
                                        this.getPCFieldValues('PfCompoundNumber'),
                                        [],
                                        true, this.handlePfizerConnectDataFieldChange, "", '#a9a9a9')}
                                </Col>
                                <Col md={6} className=''>
                                    <label>Planisware ID / Pfizer Code</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("Pfcode", "Text",
                                        //this.state.PfizerConnecfieldValues?.Pfcode, 
                                        this.getPCFieldValues('Pfcode'),
                                        [],
                                        true, this.handlePfizerConnectDataFieldChange, "", '#a9a9a9')}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col md={6} className=''>
                                    <label>API Shipment Date</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("APIShipmentDate", "Date",
                                        //this.state.PfizerConnecfieldValues?.APIShipmentDate, 
                                        this.getPCFieldValues('APIShipmentDate'),
                                        [],
                                        (this.state.PfizerConnecfieldValues?.PfizerConnectID != null &&
                                            this.state.PfizerConnecfieldValues?.PfizerConnectID != ''),
                                        this.handlePfizerConnectDataFieldChange, "", '#d60055')}
                                </Col>
                                <Col md={6} className=''>
                                    <label>First shipment Date</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("FirstShipmentDate", "Date",
                                        //this.state.PfizerConnecfieldValues?.FirstShipmentDate, 
                                        this.getPCFieldValues('FirstShipmentDate'),
                                        [],
                                        (this.state.PfizerConnecfieldValues?.PfizerConnectID != null &&
                                            this.state.PfizerConnecfieldValues?.PfizerConnectID != ''),
                                        this.handlePfizerConnectDataFieldChange, "", '#d60055')}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col md={6} className=''>
                                    <label>Launch Leader</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("LaunchLeader", "Text",
                                        //this.state.PfizerConnecfieldValues?.LaunchLeader,
                                        this.getPCFieldValues('LaunchLeader'),
                                        [],
                                        true, this.handlePfizerConnectDataFieldChange, "", '#a9a9a9')}
                                </Col>
                                <Col md={6} className=''>
                                    <label>Project Implementation Date</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("ProjectImplementationDate", "Date",
                                        //this.state.PfizerConnecfieldValues?.ProjectImplementationDate, 
                                        this.getPCFieldValues('ProjectImplementationDate'),
                                        [],
                                        true, this.handlePfizerConnectDataFieldChange, "", '#d60055')}
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col md={6} className=''>
                                    <label>Network Change Trigger</label><span className='asteriskCls'>*</span>
                                    {PlanFieldControls.getFieldControls("NetworkChangeTrigger", "Text",
                                        //this.state.PfizerConnecfieldValues?.NetworkChangeTrigger,
                                        this.getPCFieldValues('NetworkChangeTrigger'),
                                        [],
                                        true, this.handlePfizerConnectDataFieldChange, "", '#d60055')}
                                </Col>
                            </Row>

                            {this.state.showAllPfizerConnectData ?
                                <>
                                    <div style={{
                                        fontSize: 'medium', fontWeight: 'bold', background: '#0000c9', width: '100%',
                                        textAlign: 'center', marginTop: '2rem', padding: '3px', color: 'white',
                                    }}>
                                        Select Pfizer Connect ID to update
                                    </div>

                                    <div className='PCGrid' style={{ marginTop: "10px" }} >
                                        <DataGrid
                                            dataSource={this.state.AllPfizerConnectData}
                                            filterValue={this.state.gridFilterValue}
                                            defaultFilterValue={this.state.gridFilterValue}
                                            ref={(ref) => { this.dataGrid = ref; }}
                                            allowColumnReordering={true}
                                            allowColumnResizing={true}
                                            columnResizingMode={'widget'}
                                            filterSyncEnabled={false}
                                            showColumnLines={true}
                                            rowAlternationEnabled={false}
                                            showBorders={true}
                                            showRowLines={false}
                                            width='100%'
                                            height={604}
                                            hoverStateEnabled={true}
                                            columnMinWidth={50} onCellPrepared={this.highlightSelected}
                                            onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryStringPC: e.value }); e.element.autofocus = true; } }}
                                            columnAutoWidth={true}>
                                            <Editing
                                                mode="cell"
                                                // onChangesChange={this.dtChanges}
                                                // allowUpdating={checkForComments}
                                                allowUpdating={false}
                                                allowAdding={false}
                                                allowDeleting={false} />
                                            <Toolbar>
                                                <Item name='searchPanel' location='after'>
                                                </Item>
                                            </Toolbar>
                                            <SearchPanel visible={true} text={this.state.QueryStringPC ? this.state.QueryStringPC : ''} placeholder="Search..." highlightCaseSensitive={false} />
                                            <Column cellRender={e => this.PCActionCol(e)} minWidth={110} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                            <Column
                                                dataField={'PfizerConnectID'} caption={'Pfizer Connect ID'} dataType={'string'} minWidth={'120px'} visible={true} //alignment={item.alignment}
                                                allowEditing={false}
                                            />
                                            <Column
                                                dataField={'ProjectName'} caption={'Project Name'} dataType={'string'} minWidth={'200px'} visible={true} //alignment={item.alignment}
                                                allowEditing={false}
                                            />
                                            <Column
                                                dataField={'ChangeOwner'} caption={'Change Owner'} dataType={'string'} minWidth={'120px'} visible={true} //alignment={item.alignment}
                                                allowEditing={false}
                                            />
                                            <Column
                                                dataField={'ConnectPM'} caption={'Connect PM'} dataType={'string'} minWidth={'120px'} visible={true} //alignment={item.alignment}
                                                allowEditing={false}
                                            />
                                            <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                                            <Paging enabled={true} defaultPageSize={10} />
                                        </DataGrid>
                                    </div>
                                </>
                                : <></>}
                        </AccordionTab>
                    </Accordion>
                    {/* </div> */}
                </Dialog>

            </div >
        );
    }
}