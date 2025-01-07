import * as React from 'react';
import { IProductGridTable } from "./IProductGridTable";
import { statusValues } from '../Shared/Objects';
import 'devextreme/dist/css/dx.common.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'devextreme-react/text-area';
import 'devextreme/dist/css/dx.light.css';
import Drawer from 'devextreme-react/drawer';
import { Toolbar as CustomToolbar } from 'devextreme-react/toolbar';
import { Button } from 'primereact/button';
import "./ProductGridTable.css";
import { ListBox } from "primereact/listbox";
import { CheckBox } from 'devextreme-react/check-box';
import { InputSwitch } from 'primereact/inputswitch';
import { Editing, Export, MasterDetail } from 'devextreme-react/data-grid';
import { Panel } from 'primereact/panel';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import DataGrid, { Toolbar, Item, Grouping, GroupPanel, SearchPanel, Pager, Paging, HeaderFilter, FilterRow, FilterPanel, Scrolling, Column } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import { Row, Col } from 'reactstrap';
import LoadSpinner from '../LoadSpinner/LoadSpinner';
//import DropDownButton from 'devextreme-react/drop-down-button';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { TabView, TabPanel } from 'primereact/tabview';
import { Autocomplete } from '@material-ui/lab';
import Popper from '@material-ui/core/Popper';
//import { OrganizationChart } from 'primereact/organizationchart';
import { Dialog } from 'primereact/dialog';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { InputTextarea } from 'primereact/inputtextarea';
//import { PermissionKind } from "@pnp/sp/presets/all";
import { Accordion, AccordionTab } from 'primereact/accordion';
import EditPlan from "../EditPlan/EditPlan";
import { format } from 'date-fns';
//import { StatusTemplate, TrendTemplate } from '../Shared/TemplateComponent';
import { Card } from 'primereact/card';

import view from '../../../../../src/webparts/assets/images/view.png';
//import views from '../../../../../src/webparts/assets/images/views.png';
import plus from '../../../../../src/webparts/assets/images/plus.png';
import minus from '../../../../../src/webparts/assets/images/minus.png';
import edit from '../../../../../src/webparts/assets/images/edit.png';
import { DataService } from '../Shared/DataService';
//import PowerbiIFRAME from './PowerbiIFRAME';
//import IPORTGrid from '../IPORTGrid/IPORTGrid';
//Arpita
import IPORTEdit from '../IPORTEdit/IPORTEdit';
import LightSpeedIndicator from '../../../../../src/webparts/assets/images/LightSpeedIndicator.png';
import { RadioButton } from 'primereact/radiobutton';
import { Label } from 'office-ui-fabric-react';
import { MultiSelect } from 'primereact/multiselect';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import deleteIcon from '../../../../../src/webparts/assets/images/delete.png';
import { Switch, TextField } from '@material-ui/core';
import { uniqBy } from '@microsoft/sp-lodash-subset';
import DataRepositoryTab from '../EditPlan/DataRepository/DataRepositoryTab';
//import { sp } from "@pnp/sp/presets/all";


//const GscDropdownValues=['Record Match','Molecule', 'Brand', 'Status'];
const GscDropdownValues = ['Record Match', 'Record Status'];
const GoldDropdownValues = ['Plan Managed'];
const dropdownValues = ['Record Match', 'Molecule', 'Brand', 'Launch Lead', 'Launch Status', 'Launch Progress', 'Launch Priority', 'Launch Category'];
const LaunchListDropdownValues = ['Launch Lead', 'Launch Status', 'Launch Progress', 'Launch Priority', 'Launch Characterstic'];


//const buttonDropDownOptions = { width: 330 };

export default class ProductGridTable extends React.Component<IProductGridTable, any>{
    private dataGrid: any;
    public toast: Toast;
    private dropdownColsRef: any;
    public dragItemRef: any;
    public dragOverItemRef: any;
    public selectedRowData: any;
    // public autoOpenCreateRisk: boolean = false;
    public autoOpenRiskItemId: number = null;
    public ExeAppDataRef: any;
    public refreshFlag = false;
    public projectDetailsListRef: any;
    public commonProjectListRef: any;
    //public isEditPermission: true;

    constructor(public props: IProductGridTable, public state: any) {
        super(props);
        this.state = {
            autoOpenCreateRisk: false,
            pgsLeadersArraySort: [],
            DropdownCategory: dropdownValues,
            AllC: [],
            selectedCategory: '',
            Molecule: [],
            Brand: [],
            Indication: [],
            AllDropdownCategory: [],
            multiVals: [],
            confirmCreateDR: false,
            confirmCreateDR1: false,
            lovMoleculeKey: '',
            lovBrandKey: '',
            onValueChangedValKey: '',
            pdlResponse: null,
            indicationSelected: null,
            showMarketErrorPop: false,
            showConfirmDialog0: false,
            // defaultUser: [],
            collapseSku: true,
            skuDetails: null,
            showSKUpop: false,
            skuActiveChecked: true,
            skuGroupName: null,
            skuListName: null,
            skuComments: '',
            skuListValues: [],
            skuSearchItems: null,
            AccStrategy: null,
            AccStrategyValues: [],
            ReasonCode0: null,
            ReasonCodeValues: [],
            PresentationListValues: null,
            ReasonCodesFromList: null,
            AccStrategyFromList: null,
            AutoCompleteValue: [],
            AutoCompleteValues: [],
            selectedSKUID: null,
            skuForIndID: null,
            skuListError: null,
            skuValidation0: false,
            skuForIndividualItem: null,
            selectedIDForValid: 0,
            remainingChars: 500,
            similarCountries: null,
            similarCountries1: null,
            userGroupsForNPL: null,
            detailsData: null,
            DRPChecked: true,
            DataRepoData: [],
            AIActionlinkMolecules: null,
            AIActionlinkLabels: null,
            AIActionlinkBUs: null,
            AIActionlinkSBUs: null,
            AIActionlinkMoleculeSelected: null,
            AIActionlinkLabelSelected: null,
            AIActionlinkBUSelected: null,
            AIActionlinkSBUSelected: null,
            linkOrCreateDR: null,
            pTitleForDR: '',
            NewIds: [],
            SelectedGRPForNewID: '',
            SelectedMoleculeForNewID: null,
            SelectedMoleculeForNewIDOps: null,
            SelectedLabelForNewID: null,
            SelectedLabelForNewIDOps: null,
            showLinkAndCreateIDPop: false,
            ProposedGRPOptionsInterface: [],
            selectedProposedGRPOptionInterface: null,
            moleculeExisted: false,
            indicationErrorPop: false,
            indicationErrorPopValues: null,
            shouldClearGlobally: false,
            ShowDRIDMatchPopupWarning: false,
            planExistPopData: null,
            planExistPop: false,
            //checked: false,
            checked1: false,
            isLoading: false,
            ProductChecklist: [],//object contains the program data to bind the data grid 
            //columnsName: [],//object conatins the list of column binding - to grid table 
            opened: true,//used to left nav collapsing 
            openedStateMode: 'shrink',//used to left nav collapsing 
            revealMode: 'slide',//used to left nav collapsing 
            position: 'left',//used to left nav collapsing 
            AllColumnArray: [],
            AvailableColArray: [],
            SelectedColArray: [],
            AllFilterArr: [],
            SelectedFilterArr: [],
            AvailableFilterArr: [],
            AllNoneFilter: [],
            filterAvailablecolTitle: [],
            filterSelectedcolArray: [],
            programColListArr: [],
            defaultView: false,
            newViewName: '',
            SelectedProductName: '',
            activeViewID: null,
            newViewInputVisible: false,
            filterStatus: '',//set the default value to drp control
            selectednavitem: null,//this is the left category list filter salected value 
            Navitem: [],
            ViewPubOrPri: [
                { label: 'Public View', value: 'Public' },
                { label: 'Private View', value: 'Private' }
            ],//drpview options 
            viewDropdownOptions: [], // all view options in label/value format
            gridViewOptionsProject: [],
            gridViewOptionsPlan: [],
            currentViewName: '',
            ViewType: 'Public',
            customViewFilterArr: [],
            selecteddrpView: { name: 'Coder', id: '1' },//drp view
            AllCatColVal: [],
            IsMultiCategoryEnbaled: false,
            displayResponsive: false,//dialog
            dialogposition: 'center',//dialog           
            rowId: null,
            drid: null,
            gridFilterValue: [],
            QueryString: '',
            QueryStringLL: '',
            IsAdmin: false,
            defaultViewName: '',
            inValidColumns: [],
            EditIconFlag: false,
            deleteRecDialogVisible: false,
            configVal: {},
            // newly added
            planViewRecordsArray: [],
            reasonCode: null,
            reasonCodeValue: null,
            isVerified: null,
            Notes: null,
            jsonDataArray: [],
            jsonDataArrayProduct: [],
            jsonDataLaunchLead: [],
            jsonDataProductLaunchLead: [],
            jsonDataPlanLaunchStatus: [],
            IsComments: false,
            CommentsHistoryArray: [],
            reasonChangeOptions: [],
            jsonDataArrayLaunchStatus: [],
            ActiveIndex: 0,
            IsRedirect: false,
            showEditPlanDialog: false,
            ProductViewToDisplayArray: [],
            PlanViewToDisplayArray: [],
            Mode: "",
            SelectedView: "",
            setAsDefaultCheckboxVal: false,

            //Arpita
            IPortData: [],
            SelectedIportMode: '',
            SelectedIportData: [],
            showIportEditDialog: false,
            SelectedPlaniswareId: '',
            SelectedIportPlans: [],
            showCreatDRDialog: false,
            FormLabels: [],
            selectedPrimaryPlaniswareRec: [],
            // radioChecked:false

            //Arpita AI Assist
            GOLDStgListData: [],
            SelectedGOLDStgData: [],
            showAIAssestPopup: false,
            SelectedAIMode: '',
            selectedProjectDetails: [],
            selectedDRID: '',
            showConfirmDialog: false,
            ProposedGRPOptions: [],
            MoleculeAPIOptions: [],
            LabelNameOptions: [],
            BUOptions: [],
            SubBUOptions: [],
            SelectedGRP: '',
            ProposedGRPVal: '',
            SelectedMoleculeAPI: '',
            SelectedLabelname: '',
            SelectedBU: '',
            SelectedSubBU: '',

            //Arpita GOLD tab
            GOLDTabData: [],
            showMarketPopUp: false,
            SelectedGOLDTabMode: '',
            SelectedIDData: [],
            // SelectedGOLDTabDRID:'',
            SimilarCountriesArray: [],
            CountryList: [],
            selectedCountries: [],
            MarketData: {
                Priority: '03->Must Win',
                Country: this.state.SimilarCountriesArray ? this.state.SimilarCountriesArray : [],
                //  CountryWithKey:[],
                Indication: [],
                TradeName: '',
                LaunchChar: '02->Market Expansion',
                LaunchLeader: null,
                MarketPlanner: null,
                MarketPlannerSup: null,
                RegSupplierLeader: null,
                AboveMarketPlanner: null,
                AboveMarketPlannerSup: null,
                ProjectNameSuffix: '',
                DLPPManaged: 'NO',
                LaunchLeaderTitle: '',
                MarketPlannerTitle: '',
                MarketPlannerSupTitle: '',
                RegSupplierLeaderTitle: '',
                AboveMarketPlannerTitle: '',
                AboveMarketPlannerSupTitle: '',
            },
            GOLDConfigData: [],
            // AllSelectedCountries: [],

            LaunchCharacteristicsValues: [],
            PriorityValues: [],
            IndicationValues: [],
            DLPPManagedValues: [],
            MarketGridDataArray: [],
            MarketGridDataArrayCopy:[],
            IndicationPrefix: '',
            LabelNameValues: [],
            CountryMarketRegionMap: [],
            MarketsCreatedPopup: false,
            GoldTabID: 0,
            DLPPDataForSelectedDRID: [],
            GOLDTabDRID: '',
            GOLDTabCountry: '',
            selectedGOLDTabRec: [],

            // Launch list GSC Tab Arpita
            GSCProjects: [],
            showLaunchMarketPopup: false,
            dlppForDRID: [],
            SelectedMarketMode: '',
            SelectedDRMarketData: [],
            showEditPlanDialog0: false,
            selectedID: [],
            SelectedTabName: 'Launch List',
            SelectedProjectPlanMode: '',

            //launch list Market plan
            LaunchListMarketData: {
                Priority: '',
                Country: [],
                Indication: [],
                TradeName: '',
                LaunchChar: '',
                LaunchLeader: null,
                MarketPlanner: null,
                MarketPlannerSup: null,
                RegSupplierLeader: null,
                AboveMarketPlanner: null,
                AboveMarketPlannerSup: null,
                ProjectNameSuffix: '',
                DLPPManaged: 'NO',
                LaunchLeaderTitle: '',
                MarketPlannerTitle: '',
                MarketPlannerSupTitle: '',
                RegSupplierLeaderTitle: '',
                AboveMarketPlannerTitle: '',
                AboveMarketPlannerSupTitle: '',
            },
            LaunchIndicationvalues: [],
            //DRID Match pop up
            ShowDRIDMatchPopup: false,
            MatchedDRIDData: [],
            SelectedPlan: [],
            SelectedPlanID: null,
            ShowCoutryDRIDMatchPopup: false,
            CountryDRIDMatchData: [],
            DRURl: '',
            showOtherTemplatePopup: false,
            OtherTemplateRecs: [],
            SelectedRadioOption: null,
            RadioOptions: [
                { label: `Do you want to check with the Launch Leader before "Processing"  this record?`, value: "LaunchLeader" },
                { label: `Do you want to link this commercial-gold record to an existng "GTEL"?`, value: "GTEL" }
            ],
        }


        this.Actionlink = this.Actionlink.bind(this);
        this.componentDidUpdateRenamed = this.componentDidUpdateRenamed.bind(this);
        this.dropdownColsRef = React.createRef();
        this.dragItemRef = React.createRef();
        this.dragOverItemRef = React.createRef();
        this.ExeAppDataRef = React.createRef();
        this.projectDetailsListRef = React.createRef();
        this.commonProjectListRef = React.createRef();

    }
    public LABEL_NAME: any = '';
    public PREFIX: any = '';
    public SUFFIX: any = '';
    public ProposedProjectName: any = '';
    public LABEL_NAME1: any = '';


    //Launch List
    public LaunchLABEL_NAME: any = '';
    public LaunchPREFIX: any = '';
    public LaunchSUFFIX: any = '';
    public LaunchProposedProjectName: any = '';
    public LaunchLABEL_NAME1: any = '';




    public componentDidMount = async () => {
        try {
            this.setState({ isLoading: true });
            await this.getTabNames();

            if (DataService.environment === "DEV") {
                this.props.headerText('Commercial/GOLD Projects');
                this.setState({ DRURl: 'https://pfizer.sharepoint.com/sites/NPLTestSite/SitePages/CreateDR.aspx?mode=Edit&ProjectID=' });
            } else if (DataService.environment === "QA") {
                this.props.headerText('Commercial/GOLD Projects - DEMO');
                this.setState({ DRURl: 'https://pfizer.sharepoint.com/sites/NPLQA/SitePages/CreateDRProd.aspx?mode=Edit&ProjectID=' });
            } else {
                this.props.headerText('Commercial/GOLD Projects');
            }
            // this.setState({ isLoading: true });
            await this.getGOLDConfig();
            await this.getGOLDStgListData();
            await this.getGOLDTabData();
            await this.getCountryList();
            await this.getMasterDropdown();
            await this.getGSCProjects();
            await this.getUserGroupsNPL();
            await this.CheckAdmin();
            const dataGrid = this.dataGrid.instance;
            await this.getBUAndSubBuOptions();
            await this.getGRPOptions();
            this.setState({ isLoading: false });

            let filtervaluesArr = this.state['AllCatColVal'].filter(val => ((val.Title == "Launch Lead") && (val.actualValue == this.props?.currentUser?.Title) && (val.viewType === "Plan")));
            if (filtervaluesArr?.length > 0) {
                dataGrid?.filter([["Launch Lead", '=', this.props?.currentUser?.Title]]);
                filtervaluesArr = filtervaluesArr[0];
            } else {
                filtervaluesArr = null;
            }

            // let filtervalues = [];

            // filtervalues = this.state['AllCatColVal']?.filter(val => (val.Title == 'Launch Lead' && (val.viewType == "Plan")));
            // filtervalues = filtervalues.filter(ele => ele.text != 'All')?.sort((a, b) => a.actualValue?.toString().toLowerCase() > b.actualValue?.toString().toLowerCase() ? 1 : a.actualValue?.toString().toLowerCase() < b.actualValue?.toString().toLowerCase() ? -1 : 0);
            // filtervalues?.length > 0 && filtervalues.unshift({ Title: filtervalues[0].Name, InternalGridColName: filtervalues[0].Name, id: filtervalues.length + 1, text: 'All', actualValue: 'All', viewType: "Both" });
            const fltrStatus = this.state.SelectedTabName == "Launch List" ? 'Launch Lead' : this.state.SelectedTabName == "GOLD" ? 'Plan Managed' : 'Record Match'

            await this.setState((prev) => ({
                ...prev,
                filterStatus: fltrStatus,
                // Navitem: filtervalues,
                selectednavitem: filtervaluesArr,

            }));

            //await this.getProductChecklist();
            //await this.getProductAndPlanDetails();
            await this.setState({ EditIconFlag: true });
            // await this.getcolArr();
            //Arpita
            // await this.getIportListData();
            // await this.getDynamicIportFormData();


            // await this.componentDidUpdateRenamed();
        }
        catch (error) {
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            console.error("errorMsg", errorMsg);
            // DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
            //     console.error(error);
            // }); //Arpita
        }
    }

    public componentDidUpdate = (prevProps, prevState) => {
        if (this.state.shouldClearGlobally) {
            this.dataGrid?.instance?.clearFilter();
            this.dataGrid?.instance?.clearGrouping();
            this.dataGrid?.instance?.clearSorting();
            this.setState({ shouldClearGlobally: false })
        }
    }


    public formatDate(dateValue) {
        var date = new Date(dateValue);
        var formattedDate = format(date, "yyyy/MM/dd");
        return formattedDate;
    }
    public formatLaunchDate(dateValue) {
        var date = new Date(dateValue);
        var utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        var formattedDate = format(utcDate, "yyyy-MM");
        return formattedDate;
    }
    //GSC Projects
    public getGSCProjects = async () => {
        //this.setState({ isLoading: true })
       // setTimeout(() => { this.setState({ isLoading: false }) }, 3000);
        await DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,
    *,PlanOwner/Title,PlanOwner/Id,MarketPlanner/Title,MarketPlannerSupervisor/Title,RegionalSupplyLeader/Title,AboveMarketPlanner/Title,AboveMarketPlannerSupervisor/Title,
    MarketPlanner/Id,MarketPlannerSupervisor/Id,RegionalSupplyLeader/Id,AboveMarketPlanner/Id,AboveMarketPlannerSupervisor/Id,PGSReadiness`,
            `Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed'`, 'PGSReadiness').then(res1 => {
                // console.log(res1)
                if (res1?.length > 0) {
                    let res = res1.sort((a, b) => b.res?.data?.ID - a.res?.data?.ID);
                    const mappedRes = res?.map(obj => ({
                        ...obj,
                        PTitle: obj?.PlanOwner?.Title,
                        LaunchReadinessDate: obj?.PGSReadiness !== null ? format(new Date(obj?.PGSReadiness), 'MMM-dd-yyyy') : ''
                    }))
                    //Niranjan
                    let userFilterVal = mappedRes.filter((item, i) => this.props?.currentUser?.Title === item?.PlanOwner?.Title)
                    if (userFilterVal) {
                        this.setState({
                            GSCProjects: userFilterVal
                        })
                    }
                    else {
                        this.setState({
                            GSCProjects: mappedRes
                        });
                    }
                    // console.log("getGSCProjects",mappedRes);
                }
            });
    }
    public getGSCProjectsonChangeUser = async () => {
        this.setState({ isLoading: true })
        setTimeout(() => { this.setState({ isLoading: false }) }, 1000);
        await DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,
    *,PlanOwner/Title,PlanOwner/Id,MarketPlanner/Title,MarketPlannerSupervisor/Title,RegionalSupplyLeader/Title,AboveMarketPlanner/Title,AboveMarketPlannerSupervisor/Title,
    MarketPlanner/Id,MarketPlannerSupervisor/Id,RegionalSupplyLeader/Id,AboveMarketPlanner/Id,AboveMarketPlannerSupervisor/Id,PGSReadiness`,
            `Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed'`, 'PGSReadiness').then(res1 => {
                // console.log(res1)
                if (res1?.length > 0) {
                    let res = res1.sort((a, b) => b.res?.data?.ID - a.res?.data?.ID);
                    const mappedRes = res?.map(obj => ({
                        ...obj,
                        PTitle: obj?.PlanOwner?.Title,
                        LaunchReadinessDate: obj?.PGSReadiness !== null ? format(new Date(obj?.PGSReadiness), 'MMM-dd-yyyy') : ''
                    }))
                    //Niranjan
                    let userFilterVal = mappedRes.filter((item, i) => this.state.onValueChangedValKey === item?.PlanOwner?.Title)
                    if (userFilterVal) {
                        this.setState({
                            GSCProjects: userFilterVal
                        })
                    }
                    else {
                        this.setState({
                            GSCProjects: mappedRes
                        });
                    }
                    // console.log("getGSCProjects",mappedRes);
                }
            });
    }

    public getUserGroupsNPL = async () => {
        const userData = await DataService.fetchAllItemsGenericFilter("User Assignment", '*', `NTIDId eq '${this.props?.currentUser?.Id}'`, null)
        this.setState({ userGroupsForNPL: [userData[0]?.UserGroup] })
    }

    //Arpita
    public getDynamicIportFormData = async () => {
        const items = await DataService.NPLDigitalApps_Context.lists.getByTitle("IportConfig").items.select('Title,Key').filter('Active eq 1').get()
        // console.log("getDynamicIportFormData", items);
        this.setState({ FormLabels: items });
    }
    public removeDup = (arr) => {
        const mapp = new Map()
        arr.forEach(obj => mapp.set(JSON.stringify(obj), obj))
        return Array.from(mapp.values())
    }
    public getDrDetailsandFormFields = (DRID) => {
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        const fetchFormFields = DataService.getRequestListData_NPL_Digital_Apps('GLO_FormFields', 'SortOrder');
        Promise.all([fetchFormFields]).then((responsesFirst) => {
            if (DRID) {
                const getDRdetails =
                    DataService.fetchAllItems_DR_WithFilter(projectDetailsListName,
                        `ID eq ${DRID}`)
                const fetchRelatedProjects =
                    DataService.fetchAllItemsGenericFilter_NPL_Digital_Apps('PGS_Common_ProjectList',
                        `ID,DRID,ProjectName,Title,DeepDive,LaunchLead,Market,BusinessUnit,Risk_x002f_IssueStatus,
                        LaunchProgress,LaunchStatus,ResourceStatus,TaskFinishDate,DeepDive`,
                        `DRID eq '${DRID}'`, 'TaskFinishDate');
                const fetchDropdownValues =
                    DataService.getRequestListData_NPL_Digital_Apps('GLO_ProjectDetailsDropdownOptions', 'SortOrder');
                //below order swapped by jefin to fix issue
                Promise.all([fetchRelatedProjects, getDRdetails, fetchDropdownValues])
                    .then((responsesSecond) => {
                        const drData = {
                            DRID: DRID,
                            ...responsesSecond[1][0],
                            ProjectSubType: responsesSecond[1][0]?.ProjectSubType?.indexOf('->') !== -1 ? responsesSecond[1][0]?.ProjectSubType?.split('->')[1] : responsesSecond[1][0]?.ProjectSubType,
                            PhaseStatus: responsesSecond[1][0]?.PhaseStatus?.indexOf('->') !== -1 ? responsesSecond[1][0]?.PhaseStatus?.split('->')[1] : responsesSecond[1][0]?.PhaseStatus,
                            ProjectType: responsesSecond[1][0]?.ProjectType?.indexOf('->') !== -1 ? responsesSecond[1][0]?.ProjectType?.split('->')[1] : responsesSecond[1][0]?.ProjectType,
                            ProductDescription: responsesSecond[1][0]?.ProjectTitle,
                            API: responsesSecond[1][0]?.MoleculeName,
                            PlaniswareLeadCode: responsesSecond[1][0]?.PlaniswareID,
                            GRP: responsesSecond[1][0]?.ProposedGRP0,
                            OperationalUnit: responsesSecond[1][0]?.OperationalUnit,
                            NewProductPlanner: responsesSecond[1][0]?.NewProductsPlanner?.EMail,
                            NewProductsPlanner: responsesSecond[1][0]?.NewProductsPlanner?.EMail,
                            NewProductsPlannerEmail: responsesSecond[1][0]?.NewProductsPlanner?.EMail,
                            // BusinessUnit: responsesSecond[1][0]?.BU?.indexOf('->') !== -1 ? responsesSecond[1][0]?.BU?.split('->')[1] : responsesSecond[1][0]?.BU,
                            BusinessUnit: responsesSecond[1][0]?.BU,
                            DataSteward: responsesSecond[1][0]?.DataSteward?.EMail,
                            DataStewardEmail: responsesSecond[1][0]?.DataSteward?.EMail,
                            DataStewardTitle: responsesSecond[1][0]?.DataSteward?.Title,
                            // SubBusinessUnit: responsesSecond[1][0]?.BusinessUnit?.indexOf('->') !== -1 ? responsesSecond[1][0]?.BusinessUnit?.split('->')[1] : responsesSecond[1][0]?.BusinessUnit,
                            SubBusinessUnit: responsesSecond[1][0]?.BusinessUnit,
                            LXCoDev: responsesSecond[1][0]?.CoDevLead?.EMail,
                            LXCoDevEmail: responsesSecond[1][0]?.CoDevLead?.EMail,
                            LaunchDate: responsesSecond[1][0]?.Wave1StartDate,
                            GLOLaunchLead: responsesSecond[1][0]?.LaunchLeaderUser?.EMail,
                            GLOLaunchLeadTitle: responsesSecond[1][0]?.LaunchLeaderUser?.Title,
                            GLOLaunchLeadEmail: responsesSecond[1][0]?.LaunchLeaderUser?.EMail,
                            ManagedType: responsesSecond[1][0]?.ManagedBy?.indexOf('->') !== -1 ? responsesSecond[1][0]?.ManagedBy?.split('->')[1] : responsesSecond[1][0]?.ManagedBy,
                            ManagedBy: responsesSecond[1][0]?.ManagedByEmail,
                            ManagedByEmail: responsesSecond[1][0]?.ManagedByEmail,
                            //added by trupti
                            LabelName: responsesSecond[1][0]?.TradeName,
                            Indication: responsesSecond[1][0]?.Indication,
                            RnDProjNo: responsesSecond[1][0]?.RnDProjNo,
                            OtherAlias: responsesSecond[1][0]?.OtherAlias,
                            GlobalBrandAPI: responsesSecond[1][0]?.GlobalBrandAPI,
                            TherapeuticArea: responsesSecond[1][0]?.TherapeuticArea,
                            BUnit: responsesSecond[1][0]?.BU,
                            SBUnit: responsesSecond[1][0]?.BusinessUnit,
                            LaunchLeader: responsesSecond[1][0]?.LaunchLeaderUser?.Title,
                            PfizerConnectID: responsesSecond[1][0]?.PfizerConnectID,
                            PfizerConnectRecordID: responsesSecond[1][0]?.PfizerConnectRecordID,
                            PfizerConnectHistoryID: responsesSecond[1][0]?.PfizerConnectHistoryID,
                            LaunchLeaderEmail: responsesSecond[1][0]?.LaunchLeaderUser?.EMail, //Trupti -15-5-2024
                        }

                        this.setState({
                            DRdetails: drData,
                            formFields: responsesFirst[0],
                        })
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
        }).catch(e => console.log(e));
    }
    public getGOLDConfig = async () => {
        await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Config", 'Title,Value', "IsActive eq 1", null).then(res => {
            let TemplateFilter = res?.filter(item => item?.Title === 'Templates')[0]?.Value?.split(";")
            this.setState({ GOLDConfigData: TemplateFilter });
        })

    }
    public getGOLDStgListData = async () => {

        const items = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", '*', "IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1", 'Modified')
        const itemsForGoldTab = items?.filter(item => item.IntegrationStatus === 'Assigned' || item.IntegrationStatus === 'Published')
        const dlppItems = await DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,DLPPManaged,Country,
        *,PlanOwner/Title,PlanOwner/Id,MarketPlanner/Title,MarketPlannerSupervisor/Title,RegionalSupplyLeader/Title,AboveMarketPlanner/Title,AboveMarketPlannerSupervisor/Title,
        MarketPlanner/Id,MarketPlannerSupervisor/Id,RegionalSupplyLeader/Id,AboveMarketPlanner/Id,AboveMarketPlannerSupervisor/Id`,
            `Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed'`, 'PGSReadiness')
        const order = { "New": 0, "Assigned": 1, "Published": 2 , "Processed":3};
        const sortedOrder = items?.sort((a, b) => order[a.IntegrationStatus] - order[b.IntegrationStatus]);
        const mappedRes = sortedOrder?.map(obj => ({
            ...obj,
            DatePart_x003a_LaunchBaseGeneratX: obj?.DatePart_x003a_LaunchBaseGenerat ? format(new Date(obj?.DatePart_x003a_LaunchBaseGenerat), 'MMM-dd-yyyy') : '',
            DatePart_x003a_LaunchBaseOscarX: obj?.DatePart_x003a_LaunchBaseOscar ? format(new Date(obj?.DatePart_x003a_LaunchBaseOscar), 'MMM-dd-yyyy') : '',
            DatePart_x003a_LaunchActualX: obj?.DatePart_x003a_LaunchActual ? format(new Date(obj?.DatePart_x003a_LaunchActual), 'MMM-dd-yyyy') : '',
            DatePart_x003a_LaunchBaseX: obj?.DatePart_x003a_LaunchBase ? format(new Date(obj?.DatePart_x003a_LaunchBase), 'MMM-dd-yyyy') : '',
            ReimbursementX: obj?.Reimbursement ? format(new Date(obj?.Reimbursement), 'MMM-dd-yyyy') : '',
            ReimbursementGeneratedX: obj?.ReimbursementGenerated ? format(new Date(obj?.DatePart_x003a_LaunchBase), 'MMM-dd-yyyy') : '',
            ReimbursementBaseX: obj?.ReimbursementBase ? format(new Date(obj?.DatePart_x003a_LaunchBase), 'MMM-dd-yyyy') : '',
            GOLD_DLPPMappedX: obj?.GOLD_DLPPMapped ? 'Yes' : 'No'
        }))
        this.setState({
            GOLDStgListData: mappedRes,
            filterStatus: dropdownValues[0]
        });
        // if (dlppItems?.length > 0) {
        //     //  console.log("DLPPList",dlppItems);
        //     itemsForGoldTab.forEach((goldItem) => {
        //         const matchingRecords = dlppItems.filter(
        //             (mainItem) =>
        //                 mainItem.DRID == parseInt(goldItem.MappedDRID) && mainItem.Country?.indexOf('->') !== -1 && mainItem.Country?.split('->')[0] == goldItem.ProposedCountryCode
        //         );
        //         if (matchingRecords?.length > 0) {
        //             const hasDLPP = matchingRecords.reduce(
        //                 (result, record) => result || (record.DLPPManaged === true),
        //                 false
        //             );
        //             goldItem.PlanManaged = hasDLPP ? 'DLPP' : 'SIQ';
        //         } else {
        //             goldItem.PlanManaged = "New"
        //         }
        //     });
        //     // console.log("getGOLDTabData",filteredGolds);
        // }

        let molecules = [];
        let brands = [];
        let indications = [];
        let statuss = [];
        let pManaged = [];
        let lCharacteristic = [];
        let lLead = [];
        let lPriority = [];
        let lProgress = [];
        let lStatus = [];
        if (items) {
            if (this.state.SelectedTabName == "GOLD") {
                itemsForGoldTab.map(async (item, i) => {
                    molecules.push({ actualValue: item?.Molecule })
                    brands.push({ actualValue: item?.Brand })
                    indications.push({ actualValue: item?.Indication })
                    statuss.push({ actualValue: item?.IntegrationStatus })
                    if (item?.PlanManaged) {
                        pManaged.push({ actualValue: item?.PlanManaged })
                    }
                })
            } else {
                items.map(async (item, i) => {
                    molecules.push({ actualValue: item?.Molecule })
                    brands.push({ actualValue: item?.Brand })
                    indications.push({ actualValue: item?.Indication })
                    statuss.push({ actualValue: item?.IntegrationStatus })
                    if (item?.PlanManaged) {
                        pManaged.push({ actualValue: item?.PlanManaged })
                    }
                    // lCategory.push({actualValue: item?.LaunchCategory})
                    // lLead.push({actualValue: item?.LaunchLead})
                    // lPriority.push({actualValue: item?.LaunchPriority})
                    //lProgress.push({actualValue: item?.LaunchProgress})
                    //lStatus.push({actualValue: item?.LaunchStatus})
                })
            }
            if (dlppItems) {
                dlppItems.map(async (item, i) => {
                    lProgress.push({ actualValue: item?.LaunchProgress })
                    lStatus.push({ actualValue: item?.LaunchStatus })
                    lLead.push({ actualValue: item?.PlanOwner?.Title })
                    lPriority.push({ actualValue: item?.LaunchPriorityCategory })
                    lCharacteristic.push({ actualValue: item?.LaunchCharacteristic })
                })
            }
            molecules.unshift({ actualValue: 'All' })
            brands.unshift({ actualValue: 'All' })
            indications.unshift({ actualValue: 'All' })
            statuss.unshift({ actualValue: 'All' })
            pManaged.unshift({ actualValue: 'All' })
            lCharacteristic.unshift({ actualValue: 'All' })
            lLead.unshift({ actualValue: 'All' })
            lPriority.unshift({ actualValue: 'All' })
            lProgress.unshift({ actualValue: 'All' })
            lStatus.unshift({ actualValue: 'All' })
        }
        const obj = [
            { key: 'Record Match', value: [{ actualValue: 'All' }, { actualValue: 'Exact' }, { actualValue: 'Partial' }, { actualValue: 'No Match' }] },
            { key: 'Molecule', value: this.removeDup(molecules) },
            { key: 'Brand', value: this.removeDup(brands) },
            { key: 'Record Status', value: this.removeDup(statuss) },
            { key: 'Plan Managed', value: this.removeDup(pManaged) },
            { key: 'Launch Characterstic', value: this.removeDup(lCharacteristic) },
            { key: 'Launch Lead', value: this.removeDup(lLead) },
            { key: 'Launch Priority', value: this.removeDup(lPriority) },
            { key: 'Launch Progress', value: this.removeDup(lProgress) },
            { key: 'Launch Status', value: this.removeDup(lStatus) },
        ]
        this.setState({
            AllC: [...obj]
        })


    }
    public getGOLDTabData = async () => {
        let data: any;
        const items = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", '*', `IsActive eq 1 and IsMerged ne 1 and IntegrationStatus ne 'New' and IntegrationStatus ne 'Processed' and IsPlanExist ne 'Yes'`, 'Modified');
        const filteredGolds = items?.filter(item => item?.IsPlanExist !== 'Yes' && item?.IsMerged != true);
        data = filteredGolds;
        const FilteredGOLDRecs = filteredGolds?.filter(obj=>obj?.PlanManaged!=='GTEL');


        //GTEL check -- check for any GOLD recs if PGS template exists, If yes update Plan Managed to GTEL
        let GTelArray = [];
        const IdsToFetch1 = filteredGolds?.map(item => item?.MappedDRID);
        await DataService.fetchAllDRListItemsWithFilters('DLPPList', `ID,DRID,Template,Country`, `DRID ne ${null}`, '', null).then(res => {
            const filteredDlpp = res?.filter(item => IdsToFetch1?.includes(item?.DRID.toString()));
            filteredDlpp?.forEach(DlppItem => {
                filteredGolds?.forEach(goldItem => {
                    if (this.state.GOLDConfigData?.includes(DlppItem?.Template) && goldItem?.MappedDRID == DlppItem?.DRID?.toString() && goldItem.ProposedCountryCode == DlppItem.Country?.split("->")[0]) {
                        GTelArray.push(goldItem);
                    }
                })
            });
        });
        let UpdatedData = GTelArray?.filter(obj=>obj?.PlanManaged!=='GTEL');

            if (UpdatedData?.length > 0) {
                for (let item of UpdatedData) {
                    await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item.Id, { PlanManaged: 'GTEL' }).then(async res => {
                    });
                }
            } else {
                //Do Nothing
            }
       

        //New/DLPP/SIQ check -- check for any GOLD recs if Markets already exists in DLPP list for the particular country and DRID , If Yes 
        //update plan Managed col to DLPP(if DLPPManged col is true), SIQ(if DLPPManged col is false) and New (if market not found in DLPP List)
            await DataService.fetchAllDRListItemsWithFilters('DLPPList', `ID,DRID,DLPPManaged,Country`,
                `Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed'`, '', null).then(async res1 => {
                    if (res1?.length > 0) {
                        FilteredGOLDRecs.forEach((goldItem) => {
                            const matchingRecords = res1.filter(
                                (mainItem) =>
                                    mainItem.DRID == parseInt(goldItem.MappedDRID) && mainItem.Country?.indexOf('->') !== -1 && mainItem.Country?.split('->')[0] == goldItem.ProposedCountryCode
                            );
                            if (matchingRecords?.length > 0) {
                                const hasDLPP = matchingRecords.reduce(
                                    (result, record) => result || (record.DLPPManaged === true), // Check if market for a particular country and DRID has both DLPPmanged true and false-- then Prioritize and update as DLPP to Plan managed col
                                    false
                                );
                                goldItem.PlanManaged = hasDLPP ? 'DLPP' : 'SIQ';
                            } else {
                                goldItem.PlanManaged = "New"
                            }
                        });

                        //Instead of updating all the recs in GOLD tab to either DLPP/SIQ/New, fetch GOLD tab recs from Stg list and compare the present PlanManged value and update only it's change
                        const IdsToFetch = FilteredGOLDRecs?.map(item => item?.Id);
                        const AllItemsZ = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", 'Id,PlanManaged', `PlanManaged ne 'GTEL'`, null)                   // const order = { "New": 0, "SIQ": 1, "DLPP": 2, "GTEL": 3 };
                        const filteredItems = AllItemsZ?.filter(item => IdsToFetch?.includes(item?.Id))
                        const updates = [];
                        FilteredGOLDRecs?.forEach(Fitem => {
                            const ListItem = filteredItems?.find(item => item?.Id === Fitem?.Id);
                            if (ListItem) {
                                if (ListItem?.PlanManaged !== Fitem?.PlanManaged) { // check if Json filteredItems PlanManaged value has the same the same value in stg list -- if yes then ignore
                                    updates?.push({
                                        Id: Fitem?.Id,
                                        PlanManaged: Fitem?.PlanManaged// if not push only those recs where planmanaged val is diff
                                    })
                                }
                            }
                        });
                        // update only those recs whose PlanManged val is different
                        if (updates?.length > 0) {
                            for (let item of updates) {
                                await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item.Id, { PlanManaged: item?.PlanManaged }).then(async res => {
                                });
                            }

                            const GOlDItems = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", '*', `IsActive eq 1 and IsMerged ne 1 and IntegrationStatus ne 'New' and IsPlanExist ne 'Yes' and IntegrationStatus ne 'Processed'`, 'Modified')
                            this.setState({ GOLDTabData: GOlDItems });


                        } else {
                            this.setState({ GOLDTabData: data });

                        }
                    }
                })
    }

    public showBottomLeft = () => {
        this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: 'Meterial Nember already selected for another SKU List', life: 3000 });
    }

    public getTabNames = async () => {
        const userGroupVal: any = await DataService.fetchItems("User Assignment", `*,NTID/Title,NTID/Id`, 'NTID');
        const currentuserGroup = userGroupVal.filter((item) => { if (item.NTID.Title == this.props?.currentUser?.Title) { return item } })
        const currentuserGroupVal = (currentuserGroup[0].UserGroup).replace(/\s/g, "");
        const items = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Tab_Config", '*', `visible eq 1 and ${currentuserGroupVal} eq 1`, null);
        const sortedItems = items.sort((a, b) => (a.Order0 ?? 0) > (b.Order0 ?? 0) ? 1 : -1);
        // console.log("getGOLDTabData", items);
        this.setState({ SelectedTabName: sortedItems[0].Title, TabNameDetails: sortedItems });
    }
    public getCountryList = async () => {

        const fetchProjectPlanData = DataService.fetchAllDRListItemsWithFilters('RegionMarketList', `MappingCode/Code,*`,
            "IsActive eq 1 and CodeType eq 'Country'", 'MappingCode', 'Title')
        Promise.all([fetchProjectPlanData]).then((responses) => {
            let RegionMarketData = responses[0];
            // let CountryListData = RegionMarketData.map((item) => item.Title);
            let CountryListData = RegionMarketData.map((item) => ({ Key: item?.Code, Value: item?.Title, KeyValue: `${item?.Code}->${item?.Title}` }));
            let unique = [...new Set(CountryListData)];
            this.setState({ CountryList: unique })
            // console.log("RegionMarketList data", unique,RegionMarketData);
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
    public getCountries = async (DrId, Ind) => {
        let countryCodes = [];
        let ItemsFromRMD = [];
        let idExists = false;
        let frequencyMap = {};
        let MergeAvailableContry = [];
        const items1 = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", '*', `(IsActive eq 1 and MappedDRID eq '${DrId}' and IsPlanExist ne 'Yes' and IsMerged ne 1 and (IntegrationStatus eq 'Assigned' or IntegrationStatus eq 'Published'))`, null)
        const regionData = await DataService.fetchAllDRListItemsWithFilters('RegionMarketList', 'MappingCode/Code,CodeType,Title,Code,ID', `IsActive eq 1 and CodeType eq 'Country'`, 'MappingCode', null)

        //removing Country from pre-selection if it's available for Merge
        for (const item of items1) {
            const code = item?.ProposedCountryCode;
            if (frequencyMap[code]) {
                frequencyMap[code]++;
            } else {
                frequencyMap[code] = 1;
            }
        }
        const FilteredArrayRes = items1?.filter((item) => {
            if (frequencyMap[item?.ProposedCountryCode] > 1) {
                MergeAvailableContry?.push(item?.Country);
                return false;
            }
            return true;
        });
        // let UniqueMergeCountry = [...new Set(MergeAvailableContry)];
        // const CountryString = UniqueMergeCountry?.join("; ");
        // this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: `'${CountryString}' not Auto-selected as it's available for Merge`, life: 5000 });


        //removing Copuntry from pre-selection if it's Plan manged is DLPP/SIQ
        let items = FilteredArrayRes?.filter(item => item?.PlanManaged == 'New' && item?.Indication?.toLowerCase() === Ind?.toLowerCase());
        for (let i = 0; i < items?.lenth; i++) {
            if (items[i].Id === this.state.selectedGOLDTabRec?.Id) {
                idExists = true;
                break;
            }
        }
        if (!idExists) {
            items?.push(this.state.selectedGOLDTabRec);
        }
        items?.map(item => countryCodes?.push(item?.ProposedCountryCode))
        // console.log(regionData)
        countryCodes?.map(code => {
            const RMD = regionData?.filter(item => item?.Code === code);
            ItemsFromRMD?.push(RMD?.[0]);
        })
        const countryList1 = items.map((item) => item?.Country);
        const countryList2 = ItemsFromRMD.map((item) => `${item?.Code}->${item?.Title}`);
        const uniqueCountries = [...new Set(countryList1)];
        const uniqueCountryCodes = [...new Set(countryCodes)];
        const uniqueCountry2 = [...new Set(countryList2)];
        const otherOptions1 = this.state.CountryList?.filter((opt: any) => uniqueCountryCodes?.indexOf(opt?.Key) !== -1).sort();
        const otherOptions = this.state.CountryList?.filter((opt: any) => uniqueCountryCodes?.indexOf(opt?.Key) === -1).sort();
        const sortedOptions = [...otherOptions1, ...otherOptions];
        //  let CountryVals= otherOptions1?.map((item:any)=>item?.Value);
        this.setState({ CountryList: sortedOptions });
        this.setState({ SimilarCountriesArray: uniqueCountry2 });
        // this.getMarketRegionData(uniqueCountry2);
        this.setState(prev => ({
            MarketData: {
                ...prev.MarketData, Country: uniqueCountry2
            }
        }));


        await this.getIndicationData(DrId, Ind, uniqueCountries);


    }
    public getMarketRegionData = async (CountryArray) => {
        return new Promise(async (resolve, reject) => {
            try {
                let CountryData = [];
                let MarketData = [];
                let RegionData = [];
                let MappedArray: Array<any> = [];
                if (CountryArray?.length > 0) {
                    for (const country of CountryArray) {


                        let DataFetch = [];
                        let GOLDStgCountryData: any;
                        await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*",
                            `IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1 and MappedDRID eq '${this.state.selectedGOLDTabRec.MappedDRID}' and IntegrationStatus ne 'New'`,
                            null).then((res: any) => {
                                DataFetch = res;
                            });
                        //  console.log("DataFetch",DataFetch);
                        DataFetch.forEach(element => {
                            if (country?.split('->')[0] == element.ProposedCountryCode && element?.IntegrationStatus !== 'New' && element.Indication?.toLowerCase() === this.state.selectedGOLDTabRec.Indication?.toLowerCase()) {
                                //  console.log("element",element);
                                GOLDStgCountryData = element;
                            }

                        });


                        const countryKey = country?.Key ? country?.Key : country?.split('->')[0]
                        const filterQuery = `(Code eq '${countryKey}' and IsActive eq 1 and CodeType eq 'Country')`;
                        await DataService.fetchAllDRListItemsWithFilters('RegionMarketList', 'MappingCode/Code,CodeType,Title,Code,ID',
                            filterQuery, 'MappingCode', null).then(async res => {
                                if (res.length > 0) {
                                    const CountryParentCode = res?.[0]?.MappingCode?.Code;
                                    CountryData = res;
                                    // console.log("getCountry", CountryData);
                                    //  console.log("CountryParentCode",CountryParentCode);
                                    const filterMarketQuery = `IsActive eq 1 and CodeType eq 'Market' and Code eq '${CountryParentCode}'`;
                                    await DataService.fetchAllDRListItemsWithFilters('RegionMarketList', 'MappingCode/Code,CodeType,Title,Code,ID',
                                        filterMarketQuery, 'MappingCode', null).then(async res => {
                                            if (res.length > 0) {
                                                const MarketParentCode = res?.[0]?.MappingCode?.Code;
                                                //  console.log("MarketParentCode",MarketParentCode);
                                                MarketData = res;
                                                //  console.log("getMarket", MarketData);
                                                const filterRegionQuery = `IsActive eq 1 and CodeType eq 'Region' and Code eq '${MarketParentCode}'`;
                                                await DataService.fetchAllDRListItemsWithFilters('RegionMarketList', 'MappingCode/Code,CodeType,Title,Code,ID',
                                                    filterRegionQuery, 'MappingCode', null).then(async res => {
                                                        if (res.length > 0) {
                                                            RegionData = res;
                                                            //  console.log("getRegion", RegionData);
                                                        }
                                                    })
                                            }
                                        })
                                }
                                if (CountryData?.length > 0) {
                                    MappedArray.push({
                                        country: CountryData[0].Title ? CountryData[0].Title : '',
                                        CountryMap: (CountryData[0].Code && CountryData[0].Title) ? CountryData[0].Code + '->' + CountryData[0].Title : '',
                                        Market: MarketData[0].Title ? MarketData[0].Title : '',
                                        MarketMap: (MarketData[0].Code && MarketData[0].Title) ? MarketData[0].Code + '->' + MarketData[0].Title : '',
                                        Region: RegionData[0].Title ? RegionData[0].Title : '',
                                        RegionMap: (RegionData[0].Code && RegionData[0].Title) ? RegionData[0].Code + '->' + RegionData[0].Title : '',
                                        GOLDID: GOLDStgCountryData?.GOLD_IDPrimary ? GOLDStgCountryData?.GOLD_IDPrimary : ''
                                    });
                                    // console.log("MappedArray", MappedArray);
                                    this.setState({ CountryMarketRegionMap: MappedArray });
                                }
                            })
                    }
                }
                resolve(MappedArray);
            } catch (error) {
                reject(error);
                console.log("Error fetcging RegionMarketList")
            }
        })

    }
    public getuniqIndications = (lstAllIndicationVal, selectedCountryVal, gridData, isOnchange = false) => {
        let val = lstAllIndicationVal.map(item => ({ ...item, disabled: false }));
        let uniqIndications = uniqBy(val, "key");
        let allPlansData = [...this.state.DLPPDataForSelectedDRID, ...gridData];
        let selectedIndicationForMarket = [];
        if (allPlansData.length > 0 && selectedCountryVal.length > 0) {
            allPlansData.map((dt) => {
                let res = selectedCountryVal.filter(a => a == dt.Country?.split('->')[1]);
                if (res.length > 0) {
                    let resVal = dt.Indication ? (typeof (dt.Indication) == "string" ? dt.Indication.split(";") : dt.Indication) : [];
                    selectedIndicationForMarket = selectedIndicationForMarket.length > 0 ? [...selectedIndicationForMarket, ...resVal] : [...resVal];
                }
            });

            lstAllIndicationVal.map((rt) => {
                selectedIndicationForMarket.filter(a => a == rt.value).length > 0 ? rt.disabled = true : rt.disabled = false;//Making disable for those indications which are already Mapped or preseent in DLPP List
            })

            this.setState({ IndicationValues: lstAllIndicationVal })
            let res = uniqBy(lstAllIndicationVal, "key");
            let sorted = res?.sort((a: any, b: any) => a.value.localeCompare(b.value));
            this.setState({ IndicationValues: sorted });

            const results = this.state.MarketData?.Indication?.filter((item) => {
                const match = lstAllIndicationVal.find(
                    (ind) => ind?.value?.toLowerCase() == item?.toLowerCase()
                );
                return match && !match.disabled;
            });
            this.setState((prev) => ({
                MarketData: {
                    ...prev.MarketData,
                    Indication: isOnchange ? [] : results
                }
            }));
            if (!isOnchange)
                this.getPrefix(results);

        }
        else {
            let res = uniqBy(uniqIndications, "key");
            let sorted = res?.sort((a: any, b: any) => a.value.localeCompare(b.value));
            this.setState({ IndicationValues: sorted });
            this.setState((prev) => ({
                MarketData: {
                    ...prev.MarketData,
                    Indication: []
                }
            }));
        }

    }

    //Indication validation for Launch List
    public getIndicationsBasedOnCountry = (lstAllIndicationVal, selectedCountryVal, gridData) => {
        let val = lstAllIndicationVal.map(item => ({ ...item, disabled: false }));
        let uniqIndications = uniqBy(val, "key");
        let allPlansData = [...this.state.dlppForDRID, ...gridData];
        let selectedIndicationForMarket = [];
        if (allPlansData.length > 0 && selectedCountryVal.length > 0) {
            allPlansData.map((dt) => {
                let res = selectedCountryVal.filter(a => a == dt.Country?.split('->')[1]);
                if (res.length > 0) {
                    let resVal = dt.Indication ? (typeof (dt.Indication) == "string" ? dt.Indication.split(";") : dt.Indication) : [];
                    selectedIndicationForMarket = selectedIndicationForMarket.length > 0 ? [...selectedIndicationForMarket, ...resVal] : [...resVal];
                }
            });

            lstAllIndicationVal.map((rt) => {
                selectedIndicationForMarket.filter(a => a == rt.value).length > 0 ? rt.disabled = true : rt.disabled = false;//Making disable for those indications which are already Mapped or preseent in DLPP List
            })
            this.setState({ LaunchIndicationvalues: lstAllIndicationVal })
            let res = uniqBy(lstAllIndicationVal, "key");
            let sorted = res?.sort((a: any, b: any) => a.value.localeCompare(b.value));
            this.setState({ LaunchIndicationvalues: sorted });
        }
        else {
            let res = uniqBy(uniqIndications, "key");
            let sorted = res?.sort((a: any, b: any) => a.value.localeCompare(b.value));
            this.setState({ LaunchIndicationvalues: sorted });
            this.setState((prev) => ({
                MarketData: {
                    ...prev.MarketData,
                    Indication: []
                }
            }));
        }

    }

    public renderRow = (rowData) => {
        return (
            <tr>
                {rowData.columns.map((col, index) => (
                    <td key={index} style={{ borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', borderBottom: '1px solid #f5f5f5', borderTop: '1px solid #f5f5f5', width: '200px', textAlign: 'left', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rowData.data[col.dataField]}</td>
                ))}
            </tr>
        );
    };
    public renderCellData = (rowData) => {
        return (
            // <tr style={{ backgroundColor: isNew ? 'blue' : 'inherit' }}>
            //     {rowData.columns.map((col, index) => (
            //         <td key={index} style={{ borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', borderBottom: '1px solid #f5f5f5', borderTop: '1px solid #f5f5f5', width: '200px', textAlign: 'left', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rowData.data[col.dataField]}</td>
            //     ))}
            // </tr>
            <div>
                <span>{rowData?.value}</span>
            </div>
        );
    };


    public HandleMarketChange = (label, value) => {
        if (label == 'ProjectNameSuffix' && value.length <= 30) {
            this.setState((prev) => ({
                MarketData: {
                    ...prev.MarketData,
                    ProjectNameSuffix: value
                }
            }));
        }
        if (label == 'ProjectNameSuffix' && value.length > 30) {
            this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: 'Project Name Suffix can have Max 30 characters', life: 4000 });
        }
        if (label == 'Indication') {
            this.getPrefix(value);
            this.setState({ indicationSelected: value });
        }
        if (label == 'Country') {
            this.setState((prev) => ({
                MarketData: {
                    ...prev.MarketData,
                    Country: value
                    // CountryWithKey:value
                }
            }))
            if (value?.length > 0) {
                //this.getMarketRegionData(value); 
            }
            // this.setState((prev) => ({
            //     MarketData: {
            //         ...prev.MarketData,
            //         Indication: []
            //     }
            // }));
            // this.setState({IndicationPrefix:''});
            // this.getuniqIndications(this.state.IndicationValues, value, this.state.MarketGridDataArray,true);

        }
        if (label != 'ProjectNameSuffix' && label != 'Country') {
            this.setState((prev) => ({
                MarketData: {
                    ...prev.MarketData,
                    [label]: value,
                }
            }))
        }
    }

    //Launch List handle change
    public HandleLaunchMarketChange = (label, value) => {
        if (label == 'ProjectNameSuffix' && value.length <= 30) {
            this.setState((prev) => ({
                LaunchListMarketData: {
                    ...prev.LaunchListMarketData,
                    ProjectNameSuffix: value
                }
            }));
        }
        if (label == 'ProjectNameSuffix' && value.length > 30) {
            this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: 'Project Name Suffix can have Max 30 characters', life: 4000 });
        }
        if (label == 'Indication') {
            if (this.state.SelectedMarketMode !== 'Edit') {
                //Niranjan
                this.getPrefix(value);

            }
            // this.setState({ indicationSelected: value });
        }
        if (label == 'Country') {
            // this.setState((prev) => ({
            //     LaunchListMarketData: {
            //         ...prev.LaunchListMarketData,
            //         Indication: []
            //     }
            // }));
            // this.setState({IndicationPrefix:''});
            //  this.getIndicationsBasedOnCountry(this.state.LaunchIndicationvalues, value, this.state.MarketGridDataArray);
            if (value?.length > 0) {
                // this.getMarketRegionData(value);
            }
        }
        if (label != 'ProjectNameSuffix') {
            this.setState((prev) => ({
                LaunchListMarketData: {
                    ...prev.LaunchListMarketData,
                    [label]: value,
                }
            }))
        }
    }

    public getProjectDetailsListDataForSelectedDRID = (DRID, type) => {
        // console.log("getProjectDetailsListDataForSelectedDRID",DRID,type);
        this.setState({ SelectedIDData: [] });
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        } else {

        }
        const fetchDRdetails =
            DataService.fetchAllItems_DR_WithFilter(projectDetailsListName,
                `ID eq ${DRID}`)
        Promise.all([fetchDRdetails])
            .then(async (responses) => {
                let res = responses.length > 0 ? responses[0][0] : responses;
                const drData = {
                    DRID: res?.ID,
                    ProjectTitle: res?.ProjectTitle,
                    MoleculeName: res?.MoleculeName,
                    PlaniswareID: res?.PlaniswareID,
                    ProposedGRP: res?.ProposedGRP0,
                    OperationalUnit: res?.OperationalUnit,
                    BusinessUnit: res?.BU?.indexOf('->') !== -1 ? res?.BU?.split('->')[1] : res?.BU,
                    SubBusinessUnit: res?.BusinessUnit?.indexOf('->') !== -1 ? res?.BusinessUnit?.split('->')[1] : res?.BusinessUnit,
                    TradeName: res?.TradeName,
                    Indication: res?.Indication,
                    RnDProjNo: res?.RnDProjNo,
                    OtherAlias: res?.OtherAlias,
                    GlobalBrandAPI: res?.GlobalBrandAPI,
                    TherapeuticArea: res?.TherapeuticArea,
                    BUnit: res?.BU,
                    SBUnit: res?.BusinessUnit,
                    LaunchLeader: res?.LaunchLeaderUser?.Title,
                    PfizerConnectID: res?.PfizerConnectID,
                };
                // console.log('Drdata', drData,responses);
                this.setState({ SelectedIDData: drData });


                if (drData?.ProposedGRP != null) {
                    this.getLabelNameOptions(drData?.ProposedGRP);
                } else if (drData?.TradeName != '') {
                    this.setState({ LabelNameValues: [drData?.TradeName] });
                }
                else if (drData?.MoleculeName != '') {
                    this.setState({ LabelNameValues: [drData?.MoleculeName] });
                } else {
                    this.setState({ LabelNameValues: [] });
                }
                if (type != 'LaunchList') {
                    this.setState((prev) => ({
                        MarketData: {
                            ...prev.MarketData,
                            TradeName: drData.TradeName ? drData.TradeName : drData?.MoleculeName ? drData.MoleculeName : ''
                        }
                    }));
                    if (drData?.BUnit === null || drData?.SBUnit === null || drData?.MoleculeName === null || drData?.ProposedGRP === null) {
                        this.setState({
                            showMarketErrorPop: true,
                            showMarketPopUp: false,
                            ShowDRIDMatchPopup: false
                        })
                    } else {
                        this.setState({
                            ShowDRIDMatchPopup: false,
                            showMarketErrorPop: false,
                            showMarketPopUp: true,
                        })
                    }
                }
                if (type == 'LaunchList') {
                    this.setState((prev) => ({
                        LaunchListMarketData: {
                            ...prev.LaunchListMarketData,
                            TradeName: drData.TradeName ? drData.TradeName : drData?.MoleculeName ? drData.MoleculeName : ''
                        }
                    }));
                }

            });
    }
    public MergeIndications = async () => {
        // console.log("MergeIndications",this.state.selectedGOLDTabRec,this.state.CountryDRIDMatchData);
        let data = this.state.CountryDRIDMatchData;
        const pIds = [];
        this.state.CountryDRIDMatchData?.map(item => {
            pIds?.push(item?.GOLD_IDPrimary)
        })
        const CombinedIndications = {
            Indication: [
                ... new Set(
                    data?.map((item: any) => item?.Indication?.split(";"))?.flat()
                )
            ].join(";"),
            MergedGoldIDs: pIds?.join(';')
        };
        // console.log("CombinedIndications",CombinedIndications);
        const filteredData = data?.filter((item: any) => item?.Id !== this.state.selectedGOLDTabRec?.Id);
        // console.log("filteredData",filteredData);
        await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', this.state.selectedGOLDTabRec?.Id, CombinedIndications).then(async (res: any) => {
        });
        for (const item of filteredData) {
            await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item?.Id, { IsMerged: true }).then(async (res: any) => {
            });
        }
        this.toast.show({ severity: 'success', summary: '', detail: 'Gold records Merged successfully!', life: 4000 });

        await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", `Id eq '${this.state.selectedGOLDTabRec?.Id}'`, null).then(async (res: any) => {
            //console.log("updatedData",res);
            this.GOLDActionlink('Edit', res[0], false);
            this.setState({ ShowCoutryDRIDMatchPopup: false });
            this.getGOLDTabData();
        });
    }

    public UpdateIndication = async () => {
        let DLPPData = this.state.SelectedPlan;
        let GOLDData = this.state.selectedGOLDTabRec;
        const DLPPIndication = DLPPData.Indication ? DLPPData.Indication?.indexOf(";") !== -1 ? DLPPData?.Indication?.split(";")?.map((item) => item.trim()) : [DLPPData?.Indication?.trim()] : [];
        const GOLDIndication = GOLDData.Indication ? GOLDData.Indication?.indexOf(";") !== -1 ? GOLDData?.Indication?.split(";")?.map((item) => item.trim()) : [GOLDData?.Indication?.trim()] : [];
        const uniqueIndication = Array.from(new Set([...DLPPIndication, ...GOLDIndication]));
        const Indications = uniqueIndication?.join(";");
        let obj = {
            Indication: Indications ? Indications : '',
            Commercial_ID_Primary: this.state.selectedGOLDTabRec?.GOLD_IDPrimary,
            PlanStatus: DLPPData?.DLPPManaged ? 'MODIFIED' : DLPPData?.PlanStatus
        }
        await DataService.updateItemInList('DLPPList', this.state.SelectedPlan?.Id, obj).then(async (res: any) => {
            this.toast.show({ severity: 'success', summary: '', detail: 'Project Plan updated successfully!', life: 4000 });
            this.setState({ ShowDRIDMatchPopup: false });
            await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', this.state.GoldTabID, { IsPlanExist: 'Yes' }).then(async res => {
                await this.getGOLDTabData();
            });

        });
    }
    //Update Market
    public UpdateMarkets = async () => {
        let data = this.state.LaunchListMarketData;
        let updateObj = {
            AboveMarketPlannerId: data?.AboveMarketPlanner,
            LaunchPriorityCategory: data?.Priority,
            LaunchCharacteristic: data?.LaunchChar,
            PlanOwnerId: data?.LaunchLeader ? data?.LaunchLeader : this.props?.currentUser?.Id,
            MarketPlannerId: data?.MarketPlanner,
            MarketPlannerSupervisorId: data?.MarketPlannerSup,
            RegionalSupplyLeaderId: data?.RegSupplierLeader,
            AboveMarketPlannerSupervisorId: data?.AboveMarketPlannerSup,
            Template: data?.DLPPManaged == "Yes" ? 'GSC_Cat3-4' : 'SIQ Managed',
            PlanStatus: data?.DLPPManaged == "No" ? 'MODIFIED' : this.state.SelectedDRMarketData?.PlanStatus,
            DLPPManaged: data?.DLPPManaged == "Yes" ? true : false,
            Indication: data?.Indication?.length > 0 ? data?.Indication?.join(';') : '',
            IndicationMultiValues: data?.Indication?.length > 0 ? this.state.LaunchIndicationvalues?.filter(item1 => data?.Indication?.includes(item1.value)).map(item2 => item2.key).join(";") : '',
            IsDLPPManagedEdit: 'true',
            LaunchProgress: data?.DLPPManaged == "No" ? 'Transitioned' : this.state.SelectedDRMarketData?.LaunchProgress,
        }
        // console.log("UpdateMarkets",updateObj,this.state.SelectedDRMarketData?.Id);
        this.toast.show({ severity: 'success', summary: '', detail: 'Project Plan updated successfully!', life: 4000 });
        await DataService.updateItemInList('DLPPList', this.state.SelectedDRMarketData?.Id, updateObj).then(async res => {
            await this.getDLPPForDRID(this.state.DRPChecked ? this.state.selectedID?.DRID : this.state.selectedID?.Id);
            this.setState({ showLaunchMarketPopup: false });
        });
        if (data?.DLPPManaged === 'Yes') {
            const skuData = await DataService.fetchAllItemsGenericFilter("Z_NPL_ProjectPlan_SKU", "ID", `ProjectPlanID eq '${this.state.SelectedDRMarketData?.Id?.toString()}'`, null)
            skuData.forEach(async item => {
                await DataService.updateItemInList('Z_NPL_ProjectPlan_SKU', item?.ID?.toString(), { Status: 'New' })
            })
        }
    }
    public AddMarkets = async (type) => {
        console.log(this.state.MarketGridDataArray)
        const result = this.state.MarketGridDataArray.map(item => {
            return {
                LaunchPriorityCategory: item?.LaunchPriorityCategory,
                LaunchCharacteristic: item?.LaunchCharacteristic,
                LabelName: item?.LabelName,
                PlanOwnerId: item?.PlanOwnerId ? item?.PlanOwnerId : this.props?.currentUser?.Id,
                MarketPlannerId: item?.MarketPlannerId,
                MarketPlannerSupervisorId: item?.MarketPlannerSupervisorId,
                RegionalSupplyLeaderId: item?.RegionalSupplyLeaderId,
                AboveMarketPlannerId: item?.AboveMarketPlannerId,
                AboveMarketPlannerSupervisorId: item?.AboveMarketPlannerSupervisorId,
                Template: item?.DLPPManaged == "Yes" ? 'GSC_Cat3-4' : 'SIQ Managed',
                PlanStatus: item?.DLPPManaged == "Yes" ? 'NEW' : 'NA',
                PlanOwnerGroup: 'GSC',
                ProjectName: DataService.environment === "PROD" ? item?.ProjectName + '-GSC-Cat3-4' : item?.ProjectName + '-DEMO-GSC-Cat3-4',
                BU: item?.BU,
                BusinessUnit: item?.BusinessUnit,
                TherapeuticArea: item?.TherapeuticArea,
                RnDProjNo: item?.RnDProjNo,
                MoleculeName: item?.MoleculeName,
                LabelText: item?.LabelText,
                PlanProjectName: item?.PlanProjectName ? item?.PlanProjectName : '',
                IndicationMultiValues: item?.IndicationMultiValues ? item?.IndicationMultiValues : '',
                Indication: item?.Indication ? item?.Indication : '',
                DRID: item?.DRID,
                DLPPManaged: item?.DLPPManaged == "Yes" ? true : false,
                PfizerCode: item?.PfizerCode,
                GRProduct: item?.GRProduct,
                GlobalBrand: item?.GlobalBrand,
                OtherAlias: item?.OtherAlias,
                Country: item?.Country,
                Market: item?.Market,
                Region: item?.Region,
                // IsDLPPManagedEdit: 'True',
                Commercial_ID_Primary: this.state.selectedGOLDTabRec?.MergedGoldIDs ? this.state.selectedGOLDTabRec?.MergedGoldIDs : item?.GOLDID
            };
        });
        this.setState({ MarketsCreatedPopup: true });

        for (let item of result) {
            await DataService.addDatatoList('DLPPList', item).then(async (res: any) => {
                console.log("Markets added successfulluy", res);
                const addedIds = [];
                addedIds.push(res?.data?.ID);
                this.setState({ NewIds: addedIds });
                Array.from({ length: 4 }, async (_, index) => {
                    await DataService.addItemsToList('Z_NPL_ProjectPlan_SKU', { ProjectPlanID: res?.data?.Id, Group: index === 0 ? `SKU_GROUP` : `SKU${index}_GROUP` })
                })

                this.getSKUListData()
            }).catch((error) => {
                console.log("AddMarkets", error);
            });
        }
        let DataFetch = [];
        await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*",
            `IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1 and MappedDRID eq '${result[0]?.DRID}'`,
            null).then((res: any) => {
                DataFetch = res;
            });
        console.log("DataFetch", DataFetch);
        let finalArray = [];
        DataFetch.forEach(element => {
            result?.forEach(ele => {
                if (ele.Country?.split("->")[0] == element.ProposedCountryCode && element?.IntegrationStatus !== 'New' && element.Indication?.toLowerCase() === this.state.selectedGOLDTabRec.Indication?.toLowerCase()) {
                    finalArray.push(element);
                }
            })
        });
        if (type === 'GOLD') {
            for (let item of finalArray) {
                await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item.Id, { IsPlanExist: 'Yes' }).then(async res => {
                });
            }
            await this.getGOLDTabData();
        }
        this.setState({ ShowCoutryDRIDMatchPopup: false })
    }

    public getMarketGridData = async () => {
        // var regEx = /[\/,+,.,(,),-,]/g;
        this.setState({ isLoading: true });
        let MarketDataCopy = this.state.MarketData;
        let marketArray: any;
        marketArray = await this.getMarketRegionData(MarketDataCopy.Country);
        console.log("marketArray", marketArray);
        if (MarketDataCopy && marketArray?.length > 0) {
            const result = marketArray?.map((item, index) => ({
                LaunchPriorityCategory: MarketDataCopy?.Priority,
                LaunchCharacteristic: MarketDataCopy?.LaunchChar,
                LabelName: MarketDataCopy?.TradeName ? MarketDataCopy?.TradeName : '',
                Country: item.CountryMap,
                Market: item.MarketMap,
                Region: item.RegionMap,
                country: item.country,
                GOLDID: item.GOLDID,
                LaunchLeader: MarketDataCopy?.LaunchLeaderTitle ? MarketDataCopy?.LaunchLeaderTitle : this.props?.currentUser?.Title,
                MarketPlanner: MarketDataCopy?.MarketPlannerTitle,
                MarketPlannerSupervisor: MarketDataCopy?.MarketPlannerSupTitle,
                RegionalSupplyLeader: MarketDataCopy?.RegSupplierLeaderTitle,
                AboveMarketPlanner: MarketDataCopy?.AboveMarketPlannerTitle,
                AboveMarketPlannerSupervisor: MarketDataCopy?.AboveMarketPlannerSupTitle,
                PlanOwnerId: this.state.MarketData?.LaunchLeader ? this.state.MarketData?.LaunchLeader : this.props?.currentUser?.Id,
                MarketPlannerId: this.state.MarketData?.MarketPlanner,
                MarketPlannerSupervisorId: this.state.MarketData?.MarketPlannerSup,
                RegionalSupplyLeaderId: this.state.MarketData?.RegSupplierLeader,
                AboveMarketPlannerId: this.state.MarketData?.AboveMarketPlanner,
                AboveMarketPlannerSupervisorId: this.state.MarketData?.AboveMarketPlannerSup,
                // DLPPManaged1: MarketDataCopy.DLPPManaged,
                // ProposedProjectName: this.ProposedProjectName, 
                Template: this.state.MarketData?.DLPPManaged == "Yes" ? 'GSC_Cat3-4' : 'SIQ Managed',
                Indication: MarketDataCopy?.Indication?.length > 0 ? MarketDataCopy?.Indication?.join(';') : '',
                ProjectName: `${this.LABEL_NAME}${this.LABEL_NAME != '' || this.state.MarketData?.Country[index] != '' ? '-' : ''}${this.PREFIX}${this.LABEL_NAME != '' || this.state.MarketData?.Country[index] != '' ? '-' : ''}${this.state.MarketData?.Country[index]?.split("->")[1]}${this.state.MarketData?.ProjectNameSuffix != '' ? '-' : ''}${this.state.MarketData?.ProjectNameSuffix}`,
                ProjectNameGSC: `${this.LABEL_NAME}${this.LABEL_NAME != '' || this.state.MarketData?.Country[index] != '' ? '-' : ''}${this.PREFIX}${this.LABEL_NAME != '' || this.state.MarketData?.Country[index] != '' ? '-' : ''}${this.state.MarketData?.Country[index]?.split("->")[1]}${this.state.MarketData?.ProjectNameSuffix != '' ? '-' : ''}${this.state.MarketData?.ProjectNameSuffix}${DataService.environment === "PROD" ? '-GSC-Cat3-4' : '-DEMO-GSC-Cat3-4'}`,
                BU: this.state.SelectedIDData?.BUnit,
                BusinessUnit: this.state.SelectedIDData?.SBUnit,
                TherapeuticArea: this.state.SelectedIDData?.TherapeuticArea,
                RnDProjNo: this.state.SelectedIDData?.RnDProjNo,
                MoleculeName: this.state.SelectedIDData?.MoleculeName,
                LabelText: MarketDataCopy?.TradeName ? MarketDataCopy?.TradeName.split('->')[1] : '',
                LabelText1: MarketDataCopy?.TradeName ? MarketDataCopy?.TradeName?.split('->')[1]?.split('$')[0] : '',
                PlanProjectName: this.state.MarketData?.ProjectNameSuffix ? this.state.MarketData?.ProjectNameSuffix : '',
                IndicationMultiValues: MarketDataCopy.Indication?.length > 0 ? this.state.IndicationValues?.filter(item1 => MarketDataCopy.Indication?.includes(item1.value)).map(item2 => item2.key).join(";") : '',
                DRID: this.state.SelectedIDData?.DRID,
                DLPPManaged: MarketDataCopy?.DLPPManaged,
                PfizerCode: this.state.SelectedIDData?.PlaniswareID,
                GRProduct: this.state.SelectedIDData?.ProposedGRP,
                GlobalBrand: this.state.SelectedIDData?.GlobalBrandAPI,
                OtherAlias: this.state.SelectedIDData?.OtherAlias
            }))
            console.log("getMarketGridData", result);           
            const resultsProjName = result?.map(item => item?.ProjectName);
            const gridProjName = this.state.MarketGridDataArray?.map(item => item?.ProjectName);
            const checkGridLevel = gridProjName?.filter(name => resultsProjName?.includes(name));
            // console.log("checkGridLevel", checkGridLevel,resultsProjName,gridProjName);

            if (checkGridLevel?.length > 0) {
                this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: 'Project Name already Exists, Please select Different Project Suffix', life: 4000 });
            } else {
                const dlppData = await DataService.fetchAllDRListItemsWithFilters('DLPPList', `*`,
                    `DRID ne null`, '', null)
                const resultsProjName1 = result?.map(item => item?.ProjectNameGSC);
                const CreatedProjName = dlppData?.map(item => item?.ProjectName);
                const DLPPCreatedCheck = CreatedProjName?.filter(name => resultsProjName1?.includes(name));
                // console.log("DLPPCreatedCheck", DLPPCreatedCheck,CreatedProjName,resultsProjName1);
                if (DLPPCreatedCheck?.length > 0) {
                    this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: 'Project Name already Exists, Please select Different Project Suffix', life: 4000 });
                } else {
                    let grouped = {};
                    let MarketArrayVar =[...this.state.MarketGridDataArrayCopy,...result];

                    const resultData = MarketArrayVar?.map((item) => {
                        if (grouped[item?.GOLDID]) {
                            return { ...item, GOLDID: "" };
                        } else {
                            grouped[item?.GOLDID] = true;
                            return item;
                        }
                    });
                    console.log("resultData",resultData);

                    this.setState((prev) => ({
                        MarketGridDataArrayCopy: [...prev.MarketGridDataArrayCopy, ...result]
                    }));
                    this.setState({MarketGridDataArray:resultData});
                    // this.getuniqIndications(this.state.IndicationValues,[],combined);
                    this.setState({
                        MarketData: {
                            Priority: '',
                            Country: [],
                            Indication: [],
                            TradeName: '',
                            LaunchChar: '',
                            LaunchLeader: null,
                            MarketPlanner: null,
                            MarketPlannerSup: null,
                            RegSupplierLeader: null,
                            AboveMarketPlanner: null,
                            AboveMarketPlannerSup: null,
                            ProjectNameSuffix: '',
                            LaunchLeaderTitle: '',
                            MarketPlannerTitle: '',
                            MarketPlannerSupTitle: '',
                            RegSupplierLeaderTitle: '',
                            AboveMarketPlannerTitle: '',
                            AboveMarketPlannerSupTitle: '',
                        },
                        indicationSelected: [],
                        CountryMarketRegionMap: [],
                        IndicationPrefix: ''
                    });
                    this.setState((prev) => ({
                        MarketData: {
                            ...prev.MarketData,
                            DLPPManaged: 'No',
                            LaunchLeaderTitle: this.props?.currentUser?.Email ? this.props?.currentUser?.Email : [],
                            LaunchLeader: this.props?.currentUser?.Id ? this.props?.currentUser?.Id : null,
                        }
                    }));

                };
            }
            this.setState({ isLoading: false });
        }

    }

    //Launch List Market Grid Data
    public getLaunchMarketGridData = async () => {
        this.setState({ isLoading: true });
        let MarketDataCopy = this.state.LaunchListMarketData;
        let marketArray: any;
        marketArray = await this.getMarketRegionData(MarketDataCopy.Country);
        console.log("LaunchmarketArray", marketArray);
        if (MarketDataCopy) {
            const result = marketArray?.map((item, index) => ({
                LaunchPriorityCategory: MarketDataCopy?.Priority,
                LaunchCharacteristic: MarketDataCopy?.LaunchChar,
                LabelName: MarketDataCopy?.TradeName ? MarketDataCopy?.TradeName : '',
                Country: item.CountryMap,
                Market: item.MarketMap,
                Region: item.RegionMap,
                country: item.country,
                LaunchLeader: MarketDataCopy?.LaunchLeaderTitle ? MarketDataCopy?.LaunchLeaderTitle : this.props?.currentUser?.Title,
                MarketPlanner: MarketDataCopy?.MarketPlannerTitle,
                MarketPlannerSupervisor: MarketDataCopy?.MarketPlannerSupTitle,
                RegionalSupplyLeader: MarketDataCopy?.RegSupplierLeaderTitle,
                AboveMarketPlanner: MarketDataCopy?.AboveMarketPlannerTitle,
                AboveMarketPlannerSupervisor: MarketDataCopy?.AboveMarketPlannerSupTitle,
                PlanOwnerId: MarketDataCopy?.LaunchLeader ? MarketDataCopy?.LaunchLeader : this.props?.currentUser?.Id,
                MarketPlannerId: MarketDataCopy?.MarketPlanner,
                MarketPlannerSupervisorId: MarketDataCopy?.MarketPlannerSup,
                RegionalSupplyLeaderId: MarketDataCopy?.RegSupplierLeader,
                AboveMarketPlannerId: MarketDataCopy?.AboveMarketPlanner,
                AboveMarketPlannerSupervisorId: MarketDataCopy?.AboveMarketPlannerSup,
                Template: MarketDataCopy?.DLPPManaged == "Yes" ? 'GSC_Cat3-4' : 'SIQ Managed',
                Indication: MarketDataCopy?.Indication?.length > 0 ? MarketDataCopy?.Indication?.join(';') : '',
                ProjectName: `${this.LaunchLABEL_NAME}${this.LaunchLABEL_NAME != '' || MarketDataCopy?.Country[index] != '' ? '-' : ''}${this.LaunchPREFIX}${this.LaunchLABEL_NAME != '' || MarketDataCopy?.Country[index] != '' ? '-' : ''}${MarketDataCopy?.Country[index]?.split("->")[1]}${MarketDataCopy?.ProjectNameSuffix != '' ? '-' : ''}${MarketDataCopy?.ProjectNameSuffix}`,
                ProjectNameGSC: `${this.LaunchLABEL_NAME}${this.LaunchLABEL_NAME != '' || MarketDataCopy?.Country[index] != '' ? '-' : ''}${this.LaunchPREFIX}${this.LaunchLABEL_NAME != '' || MarketDataCopy?.Country[index] != '' ? '-' : ''}${MarketDataCopy?.Country[index]?.split("->")[1]}${MarketDataCopy?.ProjectNameSuffix != '' ? '-' : ''}${MarketDataCopy?.ProjectNameSuffix}-DEMO-GSC-Cat3-4`,
                BU: this.state.SelectedIDData?.BUnit,
                BusinessUnit: this.state.SelectedIDData?.SBUnit,
                TherapeuticArea: this.state.SelectedIDData?.TherapeuticArea,
                RnDProjNo: this.state.SelectedIDData?.RnDProjNo,
                MoleculeName: this.state.SelectedIDData?.MoleculeName,
                LabelText: MarketDataCopy?.TradeName ? MarketDataCopy?.TradeName.split('->')[1] : '',
                LabelText1: MarketDataCopy?.TradeName ? MarketDataCopy?.TradeName?.split('->')[1]?.split('$')[0] : '',
                PlanProjectName: MarketDataCopy?.ProjectNameSuffix ? MarketDataCopy?.ProjectNameSuffix : '',
                IndicationMultiValues: MarketDataCopy.Indication?.length > 0 ? this.state.IndicationValues?.filter(item1 => MarketDataCopy.Indication?.includes(item1.value)).map(item2 => item2.key).join(";") : '',
                DRID: this.state.SelectedIDData?.DRID,
                DLPPManaged: MarketDataCopy?.DLPPManaged,
                PfizerCode: this.state.SelectedIDData?.PlaniswareID,
                GRProduct: this.state.SelectedIDData?.ProposedGRP,
                GlobalBrand: this.state.SelectedIDData?.GlobalBrandAPI,
                OtherAlias: this.state.SelectedIDData?.OtherAlias
            }))
            console.log("getLaunchMarketGridData", result);
            //  let combined = [...this.state.MarketGridDataArray, ...result];



            // ProjectName check
            // let ProjectNameExists = [];
            // let ProjectNameExistsinDLPP = '';
            const resultsProjName = result?.map(item => item?.ProjectName);
            const gridProjName = this.state.MarketGridDataArray?.map(item => item?.ProjectName);
            const checkGridLevel = gridProjName?.filter(name => resultsProjName?.includes(name));
            // console.log("checkGridLevel",checkGridLevel);

            if (checkGridLevel?.length > 0) {
                this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: 'Project Name already Exists, Please select Different Project Suffix', life: 4000 });
            } else {
                const dlppData = await DataService.fetchAllDRListItemsWithFilters('DLPPList', `*`,
                    `DRID ne null`, '', null)
                const resultsProjName1 = result?.map(item => item?.ProjectNameGSC);
                const CreatedProjName = dlppData?.map(item => item?.ProjectName);
                const DLPPCreatedCheck = CreatedProjName?.filter(name => resultsProjName1?.includes(name));

                if (DLPPCreatedCheck?.length > 0) {
                    this.toast.show({ severity: 'warn', summary: 'Warn Message', detail: 'Project Name already Exists, Please select Different Project Suffix', life: 4000 });
                } else {
                    this.setState((prev) => ({
                        MarketGridDataArray: [...prev.MarketGridDataArray, ...result]
                    }));
                    // this.getuniqIndications(this.state.IndicationValues,[],combined);
                    this.setState({
                        LaunchListMarketData: {
                            Priority: '',
                            Country: [],
                            Indication: [],
                            TradeName: '',
                            LaunchChar: '',
                            LaunchLeader: null,
                            MarketPlanner: null,
                            MarketPlannerSup: null,
                            RegSupplierLeader: null,
                            AboveMarketPlanner: null,
                            AboveMarketPlannerSup: null,
                            ProjectNameSuffix: '',
                            LaunchLeaderTitle: '',
                            MarketPlannerTitle: '',
                            MarketPlannerSupTitle: '',
                            RegSupplierLeaderTitle: '',
                            AboveMarketPlannerTitle: '',
                            AboveMarketPlannerSupTitle: '',
                        },
                        indicationSelected: [],
                        CountryMarketRegionMap: [],
                        IndicationPrefix: ''
                    });
                    this.setState((prev) => ({
                        LaunchListMarketData: {
                            ...prev.LaunchListMarketData,
                            DLPPManaged: 'No',
                            LaunchLeaderTitle: this.props?.currentUser?.Email ? this.props?.currentUser?.Email : [],
                            LaunchLeader: this.props?.currentUser?.Id ? this.props?.currentUser?.Id : null,
                        }
                    }));

                };
            }
            this.setState({ isLoading: false });
        }

    }



    public getMasterDropdown = async () => {

        const MasterData = DataService.fetchAllDRListItemsWithFilters('MasterDataNew', 'Title,TypeValue,TypeCode,TypeId/Title,ParentCategoryId,IsActive,Id,ColleagueName/EMail,DisabledField',
            `TypeId eq '32' or TypeId eq '33' or TypeId eq '34'`, 'TypeId,ColleagueName', 'TypeValue asc,TypeValue')
        Promise.all([MasterData]).then((responses) => {
            let MasterDataNewlst = responses[0];
            let LaunchChardt = MasterDataNewlst.filter(a => a.TypeId.Title == 'LaunchCharacteristic' && a.IsActive == true);
            let LaunchPriorityDt = MasterDataNewlst.filter(a => a.TypeId.Title == 'LaunchPriorityCategory' && a.IsActive == true);
            let DLPPManagedDt = MasterDataNewlst.filter(a => a.TypeId.Title == 'DLPPManaged' && a.IsActive == true);
            let lstLaunchCharacteristic: Array<any> = [];
            let lstLaunchPriorityCategory: Array<any> = [];
            let lstDLPPManaged: Array<any> = [];



            LaunchChardt.map((item: any) => {
                let val1 = item['TypeCode'] + '->' + item?.TypeValue;
                let val2 = item?.TypeCode + '->' + item?.TypeValue;
                let res = { key: val1, value: val2, id: item?.ID };
                lstLaunchCharacteristic.push(res);
            });

            LaunchPriorityDt.map((item) => {
                lstLaunchPriorityCategory.push({ key: item?.TypeCode + '->' + item?.TypeValue, value: item?.TypeCode + '->' + item?.TypeValue, id: item?.ID, disabled: item?.DisabledField });
            });
            DLPPManagedDt.map((item) => {
                lstDLPPManaged.push(item?.TypeValue);
            });
            lstLaunchCharacteristic.sort((a, b) => {
                let numA = a.key.split("->")[0];
                let numB = b.key.split("->")[0];
                return numA.localeCompare(numB);
            });
            lstLaunchPriorityCategory.sort((a, b) => {
                let numA = a.key.split("->")[0];
                let numB = b.key.split("->")[0];
                return numA.localeCompare(numB);
            });

            this.setState({
                LaunchCharacteristicsValues: lstLaunchCharacteristic,
                PriorityValues: lstLaunchPriorityCategory,
                DLPPManagedValues: lstDLPPManaged
            })

            // console.log("char,pri",lstLaunchCharacteristic,lstLaunchPriorityCategory); 
            //  console.log("DLPPManagedValues", this.state.DLPPManagedValues);
        }).catch((error) => {
            alert('error async call')
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.log("errorMsg", error);
            });
        });

    }
    public MarketActionCol(rowData: any) {
        return (
            <>
                <div>
                    {/* <img title="View" alt="Card" src={view} onClick={(e) => this.Actionlink('View', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    <img title="Edit" alt="Card" src={edit} onClick={(e) => this.Actionlink('Edit', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} /> */}
                    <img title="delete" alt="Card" src={deleteIcon} onClick={(e) => this.MarketActionlink('Delete', rowData)}
                        style={{ visibility: "visible", marginRight: "5px", cursor: "pointer " }}
                    />
                </div>
            </>
        );
    }
    public MarketActionlink = (type, rowData) => {
       // console.log("MarketActionlink", rowData);
        const filteredArray = this.state.MarketGridDataArray.filter((item) => item.ProjectName != rowData.data.ProjectName);
        console.log("filteredArray", filteredArray);
        this.setState({ MarketGridDataArray: filteredArray ,MarketGridDataArrayCopy:filteredArray});
        // this.getuniqIndications(this.state.IndicationValues,this.state.MarketData.Country,filteredArray);
    }
    // public selectedTemplate(option) {

    //     if (option) {
    //         return (
    //             <div className="test" style={{ padding: "0.25rem 0.5rem", borderRadius: '3px', display: 'inline-flex', marginRight: '.5rem' }}>
    //                 <div>{option}</div>
    //             </div>
    //         );
    //     }
    //     return "";
    // }


    public getProjectDetailsListData = (DRID) => {
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        } else {

        }
        const DRIDs = DRID?.split(";");
        const filterQuery = DRIDs?.map(id => `ID eq ${id?.trim()}`).join(" or ")
        const fetchDRdetails =
            DataService.fetchAllItems_DR_WithFilter(projectDetailsListName, filterQuery)
        Promise.all([fetchDRdetails])
            .then(async (responses) => {
                // let result = responses.length > 0 ? responses[0][0] : responses;
                //  console.log("Res",responses[0]);
                const drData = responses[0]?.map(res => ({
                    DRID: res?.ID,
                    ProjectTitle: res?.ProjectTitle ? res?.ProjectTitle : this.state.pTitleForDR,
                    MoleculeName: res?.MoleculeName,
                    PlaniswareID: res?.PlaniswareID,
                    ProposedGRP: res?.ProposedGRP0,
                    OperationalUnit: res?.OperationalUnit,
                    BusinessUnit: res?.BU?.indexOf('->') !== -1 ? res?.BU?.split('->')[1] : res?.BU,
                    SubBusinessUnit: res?.BusinessUnit?.indexOf('->') !== -1 ? res?.BusinessUnit?.split('->')[1] : res?.BusinessUnit,
                    TradeName: res?.TradeName,
                    Indication: res?.Indication,
                    RnDProjNo: res.RnDProjNo,
                    OtherAlias: res.OtherAlias,
                    GlobalBrandAPI: res.GlobalBrandAPI,
                    TherapeuticArea: res.TherapeuticArea,
                    BUnit: res?.BU,
                    SBUnit: res?.BusinessUnit,
                    LaunchLeader: res?.LaunchLeaderUser?.Title,
                    PfizerConnectID: res.PfizerConnectID,
                }));
                // console.log('Drdata', drData,responses);
                this.setState({ selectedProjectDetails: drData });
            });
    }


    public getLabelNameOptions = async (GRP) => {
        if (GRP != '') {
            let GRPCode = GRP?.split('->')[0];
            await DataService.fetchAllDRListItemsWithFilters('MultiLabelMaster', '*',
                `GRPCode eq '${GRPCode}' and LabelCode ne '' and LabelCode ne null and LabelText ne '' and LabelText ne null`, '', null).then(res => {
                    if (res.length > 0) {
                        const results = res?.map((item) => item.LabelKey + '->' + item.LabelText);
                        const unique = [...new Set(results)];
                        this.setState({ LabelNameValues: unique });
                    }
                    else if (this.state.SelectedIDData?.TradeName != '') {
                        this.setState({ LabelNameValues: [this.state.SelectedIDData?.TradeName] });
                    }
                    else if (this.state.SelectedIDData?.MoleculeName != '') {
                        this.setState({ LabelNameValues: [this.state.SelectedIDData?.MoleculeName] });
                    } else {
                        this.setState({ LabelNameValues: [] });
                    }
                });
        }
    }
    public getPrefix = (IndicationVal) => {
        if (IndicationVal?.length == 0 && (IndicationVal[0] != '' || IndicationVal[0] != null || IndicationVal[0] != undefined)) {
            this.setState({ IndicationPrefix: '' });
        } else if (IndicationVal?.length > 1) {
            this.setState({ IndicationPrefix: 'MULTI' });
        } else if (IndicationVal?.length == 1) {
            let indication = IndicationVal[0]?.substring(
                IndicationVal[0].indexOf("\"") + 1,
                IndicationVal[0].lastIndexOf("\"")
            );
            let acronym = IndicationVal[0]?.match(/\b(\w)/g).join('').toUpperCase();
            let IndVal = (indication && indication != "" ? indication : acronym);
            let Prefix = IndVal?.length > 5 ? IndVal?.substring(0, 5) : IndVal;
            this.setState({ IndicationPrefix: Prefix });
        } else {
            this.setState({ IndicationPrefix: '' });
        }
    }


    public getIndicationData = async (DrId, Ind, conutries) => {
        let Indications: Array<any> = [];
        await DataService.fetchAllDRListItemsWithFilters('IndicationTransaction', 'Value/Id,Value/Title,Value/field_0,Value/field_2',
            `DRID eq '${DrId}' and isActive eq 1`, 'Value', null).then(res => {
                if (res.length > 0) {
                    res.map((item) => {
                        Indications.push({ key: item?.Value?.field_0 + '->' + item?.Value?.field_2, value: item?.Value?.field_2, id: item?.Value?.Id });
                    });
                    //  console.log("Indications",Indications);
                    const unique = Indications.reduce((acc, current) => {
                        const x = acc.find((item: any) => item.key === current.key && item.id === current.id);
                        if (!x) {
                            acc.push(current);
                        }
                        return acc;
                    }, []);
                    // console.log("uniqueInd",unique);
                    let sorted = unique?.sort((a: any, b: any) => a.value.localeCompare(b.value));
                    this.setState({ IndicationValues: sorted });
                    const val = Ind?.split(';')?.map(item => item?.trim());
                    let uniqueVal:any;
                     uniqueVal = [...new Set(val)];
                    const result = uniqueVal?.length > 0 ? unique?.filter(item1 =>
                        uniqueVal?.find(val=>val?.toLowerCase()?.includes(item1?.value?.toLowerCase()))):'';
                        
                      //  uniqueVal?.indexOf(item1.value) != -1) : '';
                    const indArray = result?.map(item => item.value)
                    //  console.log("indArray",indArray);
                    this.setState((prev) => ({
                        MarketData: {
                            ...prev.MarketData,
                            Indication: indArray
                        }
                    }));
                    this.getPrefix(indArray);
                    //  this.getuniqIndications(unique,conutries,this.state.MarketGridDataArray);


                }
            })
    }

    // Indication dropdown values for Launch list Market popup
    public getLaunchIndicationData = async (DrId) => {
        this.setProjectStatusCell({ LaunchIndicationvalues: [] });
        let Indications: Array<any> = [];
        await DataService.fetchAllDRListItemsWithFilters('IndicationTransaction', 'Value/Id,Value/Title,Value/field_0,Value/field_2',
            `DRID eq '${DrId}' and isActive eq 1`, 'Value', null).then(res => {
                if (res.length > 0) {
                    res.map((item) => {
                        Indications.push({ key: item?.Value?.field_0 + '->' + item?.Value?.field_2, value: item?.Value?.field_2, id: item?.Value?.Id });
                    });
                    let uniqIndications = uniqBy(Indications, "key");
                    let sorted = uniqIndications?.sort((a: any, b: any) => a.value.localeCompare(b.value));
                    this.setState({ LaunchIndicationvalues: sorted });
                }
            })
    }

    public getIportListData = async () => {
        //  let projDetailsListIport = "";
        let ExeAppUrl = '';
        let filterQuery = 'IsActive eq 1';
        let selectQuery = 'ProjectStatus,ID,ProjectTitle,MoleculeName,TradeName,OtherAlias,GlobalBrandAPI,Indication,BusinessUnit,OperationalUnit,BrandGroup,RecordStatus,TherapeuticArea,DosageCategory,DosageForm,Author/Title,Editor/Title,PlaniswareID,Wave1StartDate,Created,Modified,DRID,LightSpeedActive,IntegrationStatus,IntegrationNotes,PhaseStatus,Division,POCApproved,IsModified,ProjectType,ProjectSubType,DroppedDate,DroppedReason,IsPrimaryPlaniswareID,CompoundSource,AcquiredCompanyName';
        let expandQuery = 'Author,Editor';
        let allValues = [];

        if (DataService.environment === "DEV" || DataService.environment === "QA") {
            ExeAppUrl = 'https://pfizer.sharepoint.com/sites/NPLTestSite'
        }
        // else if (DataService.environment === "PROD") {
        //     projDetailsListIport = "ProjectDetailsList_Iport_Prod";
        // }


        await DataService.fetchExternalListDetailswithFilterCondition(ExeAppUrl, 'ProjectDetailsList_Iport', selectQuery, filterQuery, expandQuery).then(res => {
            res.map((item, key) => {
                allValues.push({
                    'ProjectID': item.ID,
                    'ProjectTitle': item.ProjectTitle,
                    'OperationalUnit': item.OperationalUnit,
                    'SubBusinessUnit': item.BusinessUnit,
                    'BrandGroup': item.BrandGroup,
                    'LabelName': item.TradeName,
                    'GlobalBrand': item.GlobalBrandAPI,
                    'MoleculeName': item.MoleculeName,
                    'ProposedGRP': item.ProposedGRP0,
                    'OtherAlias': item.OtherAlias,
                    'DosageCategory': item.DosageCategory,
                    'DosageForm': item.DosageForm,
                    'PF/CompoundNumber': item.RnDProjNo,
                    'PlaniswareID': item.PlaniswareID,
                    'Wave1StartDate': (item.Wave1StartDate != null ? this.formatLaunchDate(item.Wave1StartDate) : ''),
                    'Indication': item.Indication,
                    'TherapeuticArea': item.TherapeuticArea,
                    'CreatedBy': item.Author.Title,
                    'ModifiedBy': item.Editor.Title,
                    'Created': this.formatDate(item.Created),
                    'Modified': this.formatDate(item.Modified),
                    'IndicatorFlag': (item.LightSpeedActive == 1 ? 'Yes' : item.LightSpeedActive == 0 ? 'No' : ''),
                    'LightSpeedActive': item.LightSpeedActive,
                    'LightSpeedActivatedBy': item.LightSpeedActivatedBy,
                    'LightSpeedActivatedOn': item.LightSpeedActivatedOn,
                    'LightSpeedActivatedByEmail': item.LightSpeedActivatedByEmail,
                    'IntegrationStatus': item.IntegrationStatus,
                    'IntegrationNotes': item.IntegrationNotes ? item.IntegrationNotes : '',
                    'DRID': item.DRID,
                    'PhaseStatus': item.PhaseStatus,
                    'Division': item.Division,
                    'POCApproved': item.POCApproved != null ? this.formatDate(item.POCApproved) : item.POCApproved,
                    'IsModified': item.IsModified,
                    'SecondaryPlaniswareID': item.SecondaryPlaniswareID,
                    'ProjectStatus': item.ProjectStatus,
                    'ProjectType': item.ProjectType,
                    'ProjectSubType': item.ProjectSubType,
                    'RecordStatus': item.RecordStatus,
                    'DroppedDate': item.DroppedDate,
                    'DroppedReason': item.DroppedReason,
                    'IsPrimaryPlaniswareID': item.IsPrimaryPlaniswareID,
                    'CompoundSource': item.CompoundSource,
                    'AcquiredCompanyName': item.AcquiredCompanyName_x0009_,
                });
            });

            let sortedIPData = allValues.length > 0 ? allValues.sort((a, b) => (a.ProjectID < b.ProjectID ? 1 : -1)) : allValues;
            let FilteredIportData = sortedIPData.length > 0 ? sortedIPData.filter(p => p.PhaseStatus ? !p.PhaseStatus.includes('Launched') : '') : sortedIPData
            this.setState({ IPortData: FilteredIportData });

            // console.log("getIportListData", FilteredIportData[0]);


        });
    }

    //Arpita
    public getSelectedPlaniswareData = async () => {
        this.setState({ showCreatDRDialog: true })
        //  let projDetailsListIport = "";
        let planisware = this.state.SelectedPlaniswareId;
        let ExeAppUrl = '';
        let filterQuery = `substringof('${planisware}',PlaniswareID)`;
        let selectQuery = 'ProjectStatus,ID,ProjectTitle,MoleculeName,TradeName,OtherAlias,GlobalBrandAPI,Indication,BusinessUnit,OperationalUnit,BrandGroup,RecordStatus,TherapeuticArea,DosageCategory,DosageForm,Author/Title,Editor/Title,PlaniswareID,Wave1StartDate,Created,Modified,DRID,LightSpeedActive,IntegrationStatus,IntegrationNotes,PhaseStatus,Division,POCApproved,IsModified,ProjectType,ProjectSubType,DroppedDate,DroppedReason,IsPrimaryPlaniswareID,CompoundSource,AcquiredCompanyName';
        let expandQuery = 'Author,Editor';
        let allValues = [];

        if (DataService.environment === "DEV" || DataService.environment === "QA") {
            ExeAppUrl = 'https://pfizer.sharepoint.com/sites/NPLTestSite'
        }
        // else if (DataService.environment === "PROD") {
        //     projDetailsListIport = "ProjectDetailsList_Iport_Prod";
        // }


        await DataService.fetchExternalListDetailswithFilterCondition(ExeAppUrl, 'ProjectDetailsList_Iport', selectQuery, filterQuery, expandQuery).then(res => {
            res.map((item, key) => {
                allValues.push({
                    'ProjectID': item.ID,
                    'ProjectTitle': item.ProjectTitle,
                    'OperationalUnit': item.OperationalUnit,
                    'SubBusinessUnit': item.BusinessUnit,
                    'BrandGroup': item.BrandGroup,
                    'LabelName': item.TradeName,
                    'GlobalBrand': item.GlobalBrandAPI,
                    'MoleculeName': item.MoleculeName,
                    'ProposedGRP': item.ProposedGRP0,
                    'OtherAlias': item.OtherAlias,
                    'DosageCategory': item.DosageCategory,
                    'DosageForm': item.DosageForm,
                    'PF/CompoundNumber': item.RnDProjNo,
                    'PlaniswareID': item.PlaniswareID,
                    'Wave1StartDate': (item.Wave1StartDate != null ? this.formatLaunchDate(item.Wave1StartDate) : ''),
                    'Indication': item.Indication,
                    'TherapeuticArea': item.TherapeuticArea,
                    'CreatedBy': item.Author.Title,
                    'ModifiedBy': item.Editor.Title,
                    'Created': this.formatDate(item.Created),
                    'Modified': this.formatDate(item.Modified),
                    'IndicatorFlag': (item.LightSpeedActive == 1 ? 'Yes' : item.LightSpeedActive == 0 ? 'No' : ''),
                    'LightSpeedActive': item.LightSpeedActive,
                    'LightSpeedActivatedBy': item.LightSpeedActivatedBy,
                    'LightSpeedActivatedOn': item.LightSpeedActivatedOn,
                    'LightSpeedActivatedByEmail': item.LightSpeedActivatedByEmail,
                    'IntegrationStatus': item.IntegrationStatus,
                    'IntegrationNotes': item.IntegrationNotes ? item.IntegrationNotes : '',
                    'DRID': item.DRID,
                    'PhaseStatus': item.PhaseStatus,
                    'Division': item.Division,
                    'POCApproved': item.POCApproved != null ? this.formatDate(item.POCApproved) : item.POCApproved,
                    'IsModified': item.IsModified,
                    'SecondaryPlaniswareID': item.SecondaryPlaniswareID,
                    'ProjectStatus': item.ProjectStatus,
                    'ProjectType': item.ProjectType,
                    'ProjectSubType': item.ProjectSubType,
                    'RecordStatus': item.RecordStatus,
                    'DroppedDate': item.DroppedDate,
                    'DroppedReason': item.DroppedReason,
                    'IsPrimaryPlaniswareID': item.IsPrimaryPlaniswareID,
                    'CompoundSource': item.CompoundSource,
                    'AcquiredCompanyName': item.AcquiredCompanyName_x0009_,
                });
            });

            let sortedIPData = allValues.length > 0 ? allValues.sort((a, b) => (a.ProjectID < b.ProjectID ? 1 : -1)) : allValues;
            let FilteredIportData = sortedIPData.length > 0 ? sortedIPData.filter(p => p.PhaseStatus ? !p.PhaseStatus.includes('Launched') : '') : sortedIPData
            let arrangedIPData = this.getSortedIPData(FilteredIportData, this.state.SelectedIportData.PlaniswareID, this.state.SelectedIportData.DRID);
            this.setState({ SelectedIportPlans: arrangedIPData });

            // console.log("getSelectedPlaniswareData", res, arrangedIPData);


        });
    }
    //Arpita
    public getSortedIPData = (IPData, currentPlaniswareID, drID) => {
        let res = [];

        if (IPData.length > 0) {
            let res1 = IPData.filter(a => (a.PlaniswareID == currentPlaniswareID && a.DRID != null && a.DRID != "" && a.DRID == drID) && a.IntegrationStatus == 'Published');
            // && a.IsPrimaryPlaniswareID == true);
            if (res1.length > 0) {
                res = [...res, ...res1];
            }
            let res2 = IPData.filter(a => ((a.PlaniswareID != currentPlaniswareID && a.DRID != null && a.DRID != "" && a.DRID == drID) && a.IntegrationStatus == 'Published')); // && a.IsSecondaryPlaniswareID == true));
            if (res2.length > 0) {
                res = [...res, ...res2];
            }
            let res3 = IPData.filter(a => (a.DRID == null || a.DRID == "") && a.IntegrationStatus == 'New');
            if (res3.length > 0) {
                res = [...res, ...res3];
            }
            let res4 = IPData.filter(a => (a.DRID == null || a.DRID == "") && a.IntegrationStatus == 'In Progress');
            if (res4.length > 0) {
                res = [...res, ...res4];
            }
            let res5 = IPData.filter(a => (a.DRID == null || a.DRID == "") && a.IntegrationStatus == 'Not to be Published');
            if (res5.length > 0) {
                res = [...res, ...res5];
            }
            let res6 = IPData.filter(a => (a.DRID != null && a.DRID != "" && a.DRID != drID) && a.IntegrationStatus == 'Published');
            if (res6.length > 0) {
                res = [...res, ...res6];
            }
        }
        return res;
    }


    public componentDidUpdateRenamed = async () => {
        try {
            if (this.state.planViewRecordsArray.length > 0
                && this.selectedRowData == null
                && this.state.ProductChecklist.length > 0
                && this.state.Mode == "") {
                const urlParams = new URLSearchParams(window.location.search);
                const mode = urlParams.get('mode');
                const itemid = urlParams.get('itemid');
                const viewname = urlParams.get('viewname');
                const drid = urlParams.get('drid');
                const projectguid = urlParams.get('projectguid');
                const open = urlParams.get('open');
                const riskId = urlParams.get('riskid');

                let dialogType = "Plan View"
                let dialogMode = "View"

                if (viewname === "plan" && (itemid || projectguid)) {
                    dialogType = "Plan View";
                    if (itemid) {
                        for (let i = 0; i < this.state.planViewRecordsArray.length; i++) {
                            if (this.state.planViewRecordsArray[i].ID.toString() === itemid) {
                                this.selectedRowData = this.state.planViewRecordsArray[i]
                                break;
                            }
                        }
                    } else if (projectguid) {
                        for (let i = 0; i < this.state.planViewRecordsArray.length; i++) {
                            if (this.state.planViewRecordsArray[i].Title.toString() === projectguid) {
                                this.selectedRowData = this.state.planViewRecordsArray[i]
                                break;
                            }
                        }
                    }

                    if (open) {
                        if (open === "newrisk") {
                            this.setState({ autoOpenCreateRisk: true });
                        } else if (open === "editrisk" && riskId) {
                            this.setState({ autoOpenCreateRisk: true });
                            this.autoOpenRiskItemId = Number(riskId);
                        }
                    }
                }
                else if (viewname === "product" && drid) {
                    dialogType = "Product View";
                    for (let i = 0; i < this.state.ProductChecklist.length; i++) {
                        if (this.state.ProductChecklist[i].DRID.toString() === drid) {
                            this.selectedRowData = this.state.ProductChecklist[i]
                            break;
                        }
                    }
                }

                if (mode === "view") dialogMode = "View"
                else if (mode === "edit") dialogMode = "Edit";
                if (!true) dialogMode = "View";

                this.setState({
                    showEditPlanDialog: true,
                    Mode: dialogMode,
                    SelectedView: dialogType
                })
            }
        } catch (error) {
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    public CheckAdmin = async () => {
        try {
            let items: any = this.props.userGroups;

            let spGroupName = '';
            if (DataService.environment === "PROD") {
                spGroupName = "NPLX_GLOW_Superuser";
            } else {
                spGroupName = "NPL_Digital_Apps_GLOW_Admin";
            }
            // if (items.includes('NPL_Digital_Apps_GLOW_Admin')) {
            if (items.includes(spGroupName)) {
                this.setState({ IsAdmin: true });

            } else {
                this.setState({ IsAdmin: false, ViewType: "Private" });
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

    // public checkEditPermission = async () => {
    //     let items: any = await DataService.NPLDigitalApps_Context.currentUser.groups();
    //     let canUserSeeMembers: boolean =
    //         await DataService.canCurrentUserViewMembership(DataService.EditPermissionGroupID);

    //     let spGroupsNames: any = [];
    //     items?.map((item) => {
    //         spGroupsNames.push(item.LoginName);
    //     });
    //     if (spGroupsNames.includes("NPLX_GLOW_EditUsers") || canUserSeeMembers) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    public getConfigListData() {
        try {
            DataService.fetchAllItemsFromNPL('NPP_ConfigList').then(result => {
                let obj = {
                    DR_dropdowns_data: result.filter(item => item.Title == 'DR_dropdowns_data')?.[0]?.['Value'],
                    API_GRP_dropdowns_data: result.filter(item => item.Title == 'API_GRP_dropdowns_data')?.[0]?.['Value'],
                };
                this.setState({
                    configVal: obj
                });
            }).catch(e => console.log(e))

            DataService.fetchAllItems_NPL_Digital_Apps_Dev('GLO_ProjectDetailsDropdownOptions')
                .then(result => {
                    let pgsLeadersArray = result.filter(value => {
                        if (value.DropdownCategory === "PGSLeader" && value.IsActive) {
                            return value.DropdownValue
                        }
                    })
                    this.setState({ pgsLeadersArraySort: pgsLeadersArray.map(ele => ele.DropdownValue).sort() })
                }).catch(e => console.log(e))
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

    protected toolbarItems = [{
        widget: 'dxButton',
        location: 'after',
        options: {
            icon: 'back',
            onClick: () => this.setState({ opened: !this.state.opened }),
        }
    },
        //You can add new icons on tool bar like this
        // {
        //     widget: 'dxCheckBox',
        //     location: 'before',
        //     options: this.CheckBoxOptions,
        // }
    ];

    protected onCheckChanged = (args) => {
        console.log(args)
        this.dataGrid.instance.clearFilter();
        this.setState({
            IsMultiCategoryEnbaled: args.value,
            selectednavitem: null
        });
    }

    protected onValueChanged = async (e: any) => {

        this.dataGrid?.instance?.clearFilter();
        this.dataGrid?.instance?.clearFilter();
        let val;
        if (this.state.filterStatus == "Launch Lead") {
            val = this.props?.currentUser?.Title;
        }
        else {
            val = 'All'
        }

        this.setState({
            onValueChangedValKey: val
        })
        // this.onValueChangedVal({ value: { actualValue: val }})

        const foundItem = this.state.AllC.find((item, i) => item.key === e.value);
        foundItem?.value?.sort((a, b) => a?.actualValue?.localeCompare(b?.actualValue))

        //let filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == e.value));
        let filtervalues = [];
        if (this.state.checked1 === true) {
            filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == e.value && val.text !== 'All' && (val.viewType == "Plan" || val.viewType == "Both")));
        }
        else if (this.state.checked1 === false) {
            filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == e.value && val.text !== 'All' && (val.viewType == "Product" || val.viewType == "Both")));
        }
        //filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == e.value && val.viewType == "Product"));
        filtervalues = filtervalues.filter(ele => ele.text != 'All')?.sort((a, b) => a.actualValue?.toString().toLowerCase() > b.actualValue?.toString().toLowerCase() ? 1 : a.actualValue?.toString().toLowerCase() < b.actualValue?.toString().toLowerCase() ? -1 : 0);

        filtervalues?.length > 0 && filtervalues.unshift({ Title: filtervalues[0].Name, InternalGridColName: filtervalues[0].Name, id: filtervalues.length + 1, text: 'All', actualValue: 'All', viewType: "Both" })
        this.setState({
            filterStatus: e.value,
            Navitem: foundItem?.value,
            selectednavitem: null,
            selectedCategory: foundItem?.value[0]
        });
    }
    public listBoxTemplate = (rowData) => {
        if (this.state.IsMultiCategoryEnbaled) {
            let flag;
            if (this.state.multiVals.includes(rowData.actualValue)) {
                flag = true;
            }
            else {
                flag = false;
            }
            return (
                <div className={flag ? 'custom-list' : ''}><i className='pi pi-stop' style={{ marginLeft: '1%', backgroundColor: 'white', fontSize: '0.5rem', verticalAlign: 'middle' }}></i><span style={{ paddingLeft: '5%' }}>{rowData.actualValue}</span></div>
            );
        }
        else {
            return (
                <div className={(rowData.actualValue == this.state.onValueChangedValKey) ? 'custom-list' : ''}><i className='pi pi-stop' style={{ marginLeft: '1%', backgroundColor: 'white', fontSize: '0.5rem', verticalAlign: 'middle' }}></i><span style={{ paddingLeft: '5%' }}>{rowData.actualValue}</span></div>
            );
        }

    }

    public handleOnChangeView = async (e) => {
        // console.log(this.state.DataRepoData)
        this.setState({ isLoading: true })
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        let ProjectDetailsData = await DataService.fetchAllItems_DR(projectDetailsListName);
        // setTimeout(() => { this.setState({ isLoading: false }) }, 1000);
        const gscProjItems = await DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,
            *,PlanOwner/Title,PlanOwner/Id,MarketPlanner/Title,MarketPlannerSupervisor/Title,RegionalSupplyLeader/Title,AboveMarketPlanner/Title,AboveMarketPlannerSupervisor/Title,
            MarketPlanner/Id,MarketPlannerSupervisor/Id,RegionalSupplyLeader/Id,AboveMarketPlanner/Id,AboveMarketPlannerSupervisor/Id,PGSReadiness`,
            `Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed'`, 'PGSReadiness');
        const mappedRes = gscProjItems?.map(obj => ({
            ...obj,
            PTitle: obj?.PlanOwner?.Title,
            LaunchReadinessDate: obj?.PGSReadiness !== null ? format(new Date(obj?.PGSReadiness), 'MMM-dd-yyyy') : ''
        }))

        const DRData = ProjectDetailsData.map((p) => {
            const count = mappedRes.filter((data) => data.DRID === p.Id)
            const count0 = count?.length
            return { ...p, Launches: count0, CreatedBy: p?.Author?.Title, DataSteward: p?.DataSteward?.Title }
        })
        // console.log(DRData)
        let userFilterVal = DRData.filter((item, i) => this.props?.currentUser?.Title === item?.CreatedBy)
        // console.log(userFilterVal)
        if (userFilterVal) {
            this.setState({
                DataRepoData: userFilterVal,
                DRPChecked: e.value,
                isLoading: false
            })
        }
        else {
            this.setState({
                DataRepoData: mappedRes,
                DRPChecked: e.value,
                isLoading: false
            });
        }
        // console.log(this.state.DataRepoData)
    }

    public getDropdownOptions = async () => {
        let defaultfilterVal = '';
        // let multiArr = [];
        let AllFilters = [];
        let localAllNoneFilter = [];
        let optionArr1 = [];
        //This block of code used to call the category filter list 
        //When IsVisible property true then only we can add it to filter 
        //Title property will used show in the dropdown filter disply name 
        //InternalGridColName property used to apply filter oj grid columns
        //IsDefaultvalue propetry used to set the defualt dropdown value

        // await DataServiceNew.getMasterDropdowns(this.state.configVal['DR_dropdowns_data']).then(res => {
        // await DataServiceNew.getMasterDropdowns('MasterDataNew').then(res => {
        //     // res = res.filter(rec => rec.IsActive == true);
        //     res = res.map(r => {
        //         if (r.ChooseMasterType == 'BU') {
        //             r.ChooseMasterType = 'Business Unit';
        //         } else if (r.ChooseMasterType == 'Managed By') {
        //             r.ChooseMasterType = 'Managed Type';
        //         } else if (r.ChooseMasterType == 'ProjectType') {
        //             r.ChooseMasterType = 'Project Type';
        //         } else if (r.ChooseMasterType == 'ProjectSubType') {
        //             r.ChooseMasterType = 'Project Sub Type';
        //         } return r;
        //     });
        //     //defaultfilterVal = 'Sub Business Unit';
        //     defaultfilterVal = 'Launch Lead';
        //     let unique = [...new Set(res.map(item => item.ChooseMasterType))];
        //     unique = unique.sort();
        //     unique.map((item: string) => {

        //         let dropdownItems = res.filter(rec => rec.ChooseMasterType == item);
        //         if (dropdownItems[0]['ChooseMasterType'] == 'Sub Business Unit' || dropdownItems[0]['ChooseMasterType'] == 'Business Unit' || dropdownItems[0]['ChooseMasterType'] == 'Project Type' || dropdownItems[0]['ChooseMasterType'] == 'Project Sub Type' || dropdownItems[0]['ChooseMasterType'] == 'Operational Unit' || dropdownItems[0]['ChooseMasterType'] == 'Managed Type' || dropdownItems[0]['ChooseMasterType'] == 'Brand Group') {
        //             if (dropdownItems[0]['ChooseMasterType'] == 'Sub Business Unit' || dropdownItems[0]['ChooseMasterType'] == 'Business Unit') {
        //                 this.state.AllDropdownCategory.push({ Value: dropdownItems[0]['ChooseMasterType'], viewType: "Both" });
        //             }
        //             else {
        //                 this.state.AllDropdownCategory.push({ Value: dropdownItems[0]['ChooseMasterType'], viewType: "Product" });
        //             }
        //         }

        //         let optionListArr = [];

        //         dropdownItems.map((item1, index) => {
        //             if (index == 0) {
        //                 //add  'all' option value for each category filter
        //                 optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index, text: 'All', actualValue: 'All', viewType: "Both" });
        //             }
        //             switch (item1.ChooseMasterType) {
        //                 case 'Sub Business Unit':
        //                     optionListArr.push({ Title: item1.ChooseMasterType, InternalGridColName: 'SubBusinessUnit', id: index + 1, text: item1.TypeValue, visible: false, actualValue: item1.TypeValue, viewType: "Both" });
        //                     optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index + 1, text: item1.TypeValue, actualValue: item1.TypeValue, viewType: "Both" });
        //                     break;
        //                 case 'Business Unit':
        //                     optionListArr.push({ Title: item1.ChooseMasterType, InternalGridColName: 'BusinessUnit', id: index + 1, text: item1.TypeValue, visible: false, actualValue: item1.TypeValue, viewType: "Both" });
        //                     optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index + 1, text: item1.TypeValue, actualValue: item1.TypeValue, viewType: "Both" });
        //                     break;
        //                 case 'Project Type':
        //                     optionListArr.push({ Title: item1.ChooseMasterType, InternalGridColName: "ProjectType", id: index + 1, text: item1.TypeValue, visible: false, actualValue: item1.TypeValue, viewType: "Product" });
        //                     optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index + 1, text: item1.TypeValue, actualValue: item1.TypeValue, viewType: "Product" });
        //                     break;
        //                 case 'Project Sub Type':
        //                     optionListArr.push({ Title: item1.ChooseMasterType, InternalGridColName: 'ProjectSubType', id: index + 1, text: item1.TypeValue, visible: false, actualValue: item1.TypeValue, viewType: "Product" });
        //                     optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index + 1, text: item1.TypeValue, actualValue: item1.TypeValue, viewType: "Product" });
        //                     break;
        //                 case 'Operational Unit':
        //                     optionListArr.push({ Title: item1.ChooseMasterType, InternalGridColName: 'OperationalUnit', id: index + 1, text: item1.TypeValue, visible: false, actualValue: item1.TypeValue, viewType: "Product" });
        //                     optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index + 1, text: item1.TypeValue, actualValue: item1.TypeValue, viewType: "Product" });
        //                     break;
        //                 case 'Managed Type':
        //                     optionListArr.push({ Title: item1.ChooseMasterType, InternalGridColName: 'ManagedType', id: index + 1, text: item1.TypeValue, visible: false, actualValue: item1.TypeValue, viewType: "Product" });
        //                     optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index + 1, text: item1.TypeValue, actualValue: item1.TypeValue, viewType: "Product" });
        //                     break;
        //                 case 'Brand Group':
        //                     optionListArr.push({ Title: item1.ChooseMasterType, InternalGridColName: 'BrandGroup', id: index + 1, text: item1.TypeValue, visible: false, actualValue: item1.TypeValue, viewType: "Product" });
        //                     optionArr1.push({ Title: item1.ChooseMasterType, InternalGridColName: item1.ChooseMasterType, id: index + 1, text: item1.TypeValue, actualValue: item1.TypeValue, viewType: "Product" });
        //                     break;
        //             }

        //         });

        //         if (dropdownItems[0]['ChooseMasterType'] == 'Sub Business Unit' || dropdownItems[0]['ChooseMasterType'] == 'Business Unit' || dropdownItems[0]['ChooseMasterType'] == 'Project Type' || dropdownItems[0]['ChooseMasterType'] == 'Project Sub Type' || dropdownItems[0]['ChooseMasterType'] == 'Operational Unit' || dropdownItems[0]['ChooseMasterType'] == 'Managed Type' || dropdownItems[0]['ChooseMasterType'] == 'Brand Group') {
        //             optionListArr = optionListArr?.sort((a, b) => a.text?.toString().toLowerCase() > b.text?.toString().toLowerCase() ? 1 : a.text?.toString().toLowerCase() < b.text?.toString().toLowerCase() ? -1 : 0);

        //             // newly
        //             switch (item) {
        //                 case 'Business Unit':
        //                     AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: 'BusinessUnit', viewCategory: 'Both' });
        //                     localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //                     break;
        //                 case 'Sub Business Unit':
        //                     AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: 'SubBusinessUnit', viewCategory: 'Both' });
        //                     localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //                     break;
        //                 case 'Project Type':
        //                     AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: 'ProjectType', viewCategory: 'Product' });
        //                     localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //                     break;
        //                 case 'Project Sub Type':
        //                     AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: 'ProjectSubType', viewCategory: 'Product' });
        //                     localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //                     break;
        //                 case 'Operational Unit':
        //                     AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: 'OperationalUnit', viewCategory: 'Product' });
        //                     localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //                     break;
        //                 case 'Managed Type':
        //                     AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: 'ManagedType', viewCategory: 'Product' });
        //                     localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //                     break;
        //                 case 'Brand Group':
        //                     AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: 'BrandGroup', viewCategory: 'Product' });
        //                     localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //                     break;
        //             }
        //             // AllFilters.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: optionListArr, internalName: item, viewCategory: 'Product' });
        //             // localAllNoneFilter.push({ filterCol: dropdownItems[0]['ChooseMasterType'], optionList: { All: false, None: false } });
        //         }
        //     });
        // });
        // get the unique dropdown values
        let productsListArray = this.state.ProductChecklist;
        this.state.AllDropdownCategory.push({ Value: 'Business Unit', internalName: 'BusinessUnit', viewType: "Product" }); // viewType: "Both"
        this.state.AllDropdownCategory.push({ Value: 'Sub Business Unit', internalName: 'SubBusinessUnit', viewType: "Product" }); // viewType: "Both"
        this.state.AllDropdownCategory.push({ Value: 'Brand Group', internalName: 'BrandGroup', viewType: "Product" });
        this.state.AllDropdownCategory.push({ Value: 'Managed Type', internalName: 'ManagedType', viewType: "Product" });
        this.state.AllDropdownCategory.push({ Value: 'Operational Unit', internalName: 'OperationalUnit', viewType: "Product" });
        this.state.AllDropdownCategory.push({ Value: 'Project Type', internalName: 'ProjectType', viewType: "Product" });
        this.state.AllDropdownCategory.push({ Value: 'Project Sub Type', internalName: 'ProjectSubType', viewType: "Product" });
        this.state.AllDropdownCategory.push({ Value: 'Launch Lead', internalName: 'LaunchLead', viewType: "Product" });
        // defaultfilterVal = 'Launch Lead';
        let BUArray = [];
        let subBUArray = [];
        let projectTypeArray = [];
        let projectSubTypeArray = [];
        let operationalUnitArray = [];
        let managedTypeArray = [];
        let brandGroupArray = [];
        let launchLeadProductArray = [];
        productsListArray.map(async res => {
            if (res.BusinessUnit) {
                BUArray.push({
                    Name: "Business Unit",
                    Value: res.BusinessUnit,
                    InternalName: "BusinessUnit",
                });
            }
            else {
                BUArray.push({
                    Name: "Business Unit",
                    Value: null,
                    InternalName: "BusinessUnit",
                });
            }
            if (res.SubBusinessUnit) {
                subBUArray.push({
                    Name: "Sub Business Unit",
                    Value: res.SubBusinessUnit,
                    InternalName: "SubBusinessUnit",
                });
            } else {
                subBUArray.push({
                    Name: "Sub Business Unit",
                    Value: null,
                    InternalName: "SubBusinessUnit",
                });
            }
            if (res.ProjectType) {
                projectTypeArray.push({
                    Name: "Project Type",
                    Value: res.ProjectType,
                    InternalName: "ProjectType",
                });
            } else {
                projectTypeArray.push({
                    Name: "Project Type",
                    Value: null,
                    InternalName: "ProjectType",
                });
            }
            if (res.ProjectSubType) {
                projectSubTypeArray.push({
                    Name: "Project Sub Type",
                    Value: res.ProjectSubType,
                    InternalName: "ProjectSubType",
                });
            } else {
                projectSubTypeArray.push({
                    Name: "Project Sub Type",
                    Value: null,
                    InternalName: "ProjectSubType",
                });
            }
            if (res.BrandGroup) {
                brandGroupArray.push({
                    Name: "Brand Group",
                    Value: res.BrandGroup,
                    InternalName: "BrandGroup",
                });
            } else {
                brandGroupArray.push({
                    Name: "Brand Group",
                    Value: null,
                    InternalName: "BrandGroup",
                });
            }
            if (res.OperationalUnit) {
                operationalUnitArray.push({
                    Name: "Operational Unit",
                    Value: res.OperationalUnit,
                    InternalName: "OperationalUnit",
                });
            } else {
                operationalUnitArray.push({
                    Name: "Operational Unit",
                    Value: null,
                    InternalName: "OperationalUnit",
                });
            }
            if (res.ManagedType) {
                managedTypeArray.push({
                    Name: "Managed Type",
                    Value: res.ManagedType,
                    InternalName: "ManagedType",
                });
            } else {
                managedTypeArray.push({
                    Name: "Managed Type",
                    Value: null,
                    InternalName: "ManagedType",
                });
            }
            if (res.LaunchLead) {
                launchLeadProductArray.push({
                    Name: "Launch Lead",
                    Value: res.LaunchLead,
                    InternalName: "LaunchLead",
                });
            } else {
                launchLeadProductArray.push({
                    Name: "Launch Lead",
                    Value: null,
                    InternalName: "LaunchLead",
                });
            }
        });
        BUArray = [... new Map(BUArray.map((item) => [item["Value"], item])).values()];
        subBUArray = [... new Map(subBUArray.map((item) => [item["Value"], item])).values()];
        projectTypeArray = [... new Map(projectTypeArray.map((item) => [item["Value"], item])).values()];
        projectSubTypeArray = [... new Map(projectSubTypeArray.map((item) => [item["Value"], item])).values()];
        operationalUnitArray = [... new Map(operationalUnitArray.map((item) => [item["Value"], item])).values()];
        managedTypeArray = [... new Map(managedTypeArray.map((item) => [item["Value"], item])).values()];
        brandGroupArray = [... new Map(brandGroupArray.map((item) => [item["Value"], item])).values()];
        launchLeadProductArray = [... new Map(launchLeadProductArray.map((item) => [item["Value"], item])).values()];

        let productviewDropdownOptions = [...BUArray, ...subBUArray, ...projectTypeArray, ...projectSubTypeArray, ...operationalUnitArray, ...managedTypeArray, ...brandGroupArray, ...launchLeadProductArray];
        let uniqueVal = this.state.AllDropdownCategory.filter(val => (val.viewType == "Both" || val.viewType == "Product")).map(
            item => (item.Value));
        uniqueVal.map((item: string) => {
            let dropdownItems = productviewDropdownOptions.filter(rec =>
                rec.Name == item
            );
            let optionListArr = [];
            dropdownItems?.map((item1, index) => {
                if (index == 0) {
                    //add  'all' option value for each category filter
                    optionArr1.push({ Title: item1.Name, InternalGridColName: item1.Name, id: index, text: 'All', actualValue: 'All', viewType: "Product" }); //viewType: "Both"
                }
                switch (item1.Name) {
                    case 'Sub Business Unit':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" }); // viewType: "Both" 
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" }); // viewType: "Both" 
                        break;
                    case 'Business Unit':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" }); // viewType: "Both" 
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" }); // viewType: "Both" 
                        break;
                    case 'Project Type':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        break;
                    case 'Project Sub Type':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        break;
                    case 'Operational Unit':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        break;
                    case 'Managed Type':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        break;
                    case 'Brand Group':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        break;
                    case 'Launch Lead':
                        optionListArr.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Product" });
                        break;
                }
            });
            if (dropdownItems?.length > 0) {
                if (dropdownItems[0]['Name'] == 'Sub Business Unit' || dropdownItems[0]['Name'] == 'Business Unit' || dropdownItems[0]['Name'] == 'Project Type' || dropdownItems[0]['Name'] == 'Project Sub Type' || dropdownItems[0]['Name'] == 'Operational Unit' || dropdownItems[0]['Name'] == 'Managed Type' || dropdownItems[0]['Name'] == 'Brand Group' || dropdownItems[0]['Name'] == 'Launch Lead') {
                    optionListArr = optionListArr?.sort((a, b) => a.text?.toString().toLowerCase() > b.text?.toString().toLowerCase() ? 1 : a.text?.toString().toLowerCase() < b.text?.toString().toLowerCase() ? -1 : 0);
                    switch (item) {
                        case 'Sub Business Unit':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'SubBusinessUnit', viewCategory: 'Product' }); //viewCategory: 'Both'
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                        case 'Business Unit':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'BusinessUnit', viewCategory: 'Product' }); // viewCategory: 'Both'
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                        case 'Project Type':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'ProjectType', viewCategory: 'Product' });
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                        case 'Project Sub Type':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'ProjectSubType', viewCategory: 'Product' });
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                        case 'Operational Unit':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'OperationalUnit', viewCategory: 'Product' });
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                        case 'Managed Type':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'ManagedType', viewCategory: 'Product' });
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                        case 'Brand Group':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'BrandGroup', viewCategory: 'Product' });
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                        case 'Launch Lead':
                            AllFilters.push({ filterCol: dropdownItems[0]['Name'], optionList: optionListArr, internalName: 'LaunchLead', viewCategory: 'Product' });
                            localAllNoneFilter.push({ filterCol: dropdownItems[0]['Name'], optionList: { All: false, None: false } });
                            break;
                    }
                }
            }
        });

        // Get the launch lead details
        // this.state.AllDropdownCategory.push({ Value: 'Launch Lead', internalName: 'LaunchLead', viewType: "Product" });        
        // const uniqueLaunchLeadProduct = [...new Set(productsListArray.map(item => item.LaunchLead))];
        // let optionListArr2 = [];        
        // uniqueLaunchLeadProduct.map((item2, indexVal) => {
        //     if (indexVal == 0) {
        //         optionArr1.push({ Title: "Launch Lead", InternalGridColName: 'LaunchLead', id: indexVal, text: 'All', actualValue: 'All' }); //, viewType: "Product"
        //     }
        //     optionListArr2.push({ Title: "Launch Lead", InternalGridColName: 'LaunchLead', id: indexVal + 1, text: item2, visible: false, actualValue: item2, viewType: "Product" });
        //     optionArr1.push({ Title: "Launch Lead", InternalGridColName: 'LaunchLead', id: indexVal + 1, text: item2, actualValue: item2, viewType: "Product" });          
        // });
        // AllFilters.push({ filterCol: 'Launch Lead', optionList: optionListArr2, internalName: 'LaunchLead', viewCategory: 'Product' });
        // localAllNoneFilter.push({ filterCol: 'Launch Lead', optionList: { All: false, None: false } });


        // plan view dropdown options
        //this.state.AllDropdownCategory.push({ Value: 'Market', internalName: 'Market', viewType: "Plan" });
        this.state.AllDropdownCategory.push({ Value: 'Business Unit', internalName: 'BusinessUnit', viewType: "Plan" }); // viewType: "Both"
        this.state.AllDropdownCategory.push({ Value: 'Sub Business Unit', internalName: 'SubBusinessUnit', viewType: "Plan" }); // viewType: "Both"
        this.state.AllDropdownCategory.push({ Value: 'Launch Lead', internalName: 'LaunchLead', viewType: "Plan" });
        this.state.AllDropdownCategory.push({ Value: 'Launch Progress', internalName: 'LaunchProgress', viewType: "Plan" });
        this.state.AllDropdownCategory.push({ Value: 'Launch Status', internalName: 'LaunchStatus', viewType: "Plan" });
        this.state.AllDropdownCategory.push({ Value: 'Brand/Label', internalName: 'Brand', viewType: "Plan" });
        this.state.AllDropdownCategory.push({ Value: 'NPL T6', internalName: 'DeepDive', viewType: "Plan" });
        let marketArray = [];
        let launchLeadtArray = [];
        let launchProgresstArray = [];
        let launchStatusArray = [];
        let brandArray = [];
        let nplT6Array = [];
        let businessunitsArray = [];
        let subBusinessUnitsArray = [];
        //let optionListArr1 = [];
        this.state.planViewRecordsArray.map(async res => {
            if (res.Market != null) {
                marketArray.push({
                    Name: "Market",
                    Value: res.Market,
                    InternalName: "Market",
                });
            }
            if (res.LaunchLead) {
                launchLeadtArray.push({
                    Name: "Launch Lead",
                    Value: res.LaunchLead,
                    InternalName: "LaunchLead",
                });
            } else {
                launchLeadtArray.push({
                    Name: "Launch Lead",
                    Value: null,
                    InternalName: "LaunchLead",
                });
            }
            if (res.LaunchProgress) {
                launchProgresstArray.push({
                    Name: "Launch Progress",
                    Value: res.LaunchProgress,
                    InternalName: "LaunchProgress",
                });
            } else {
                launchProgresstArray.push({
                    Name: "Launch Progress",
                    Value: null,
                    InternalName: "LaunchProgress",
                });
            }
            if (res.LaunchStatus) {
                launchStatusArray.push({
                    Name: "Launch Status",
                    Value: res.LaunchStatus,
                    InternalName: "LaunchStatus",
                });
            } else {
                launchStatusArray.push({
                    Name: "Launch Status",
                    Value: null,
                    InternalName: "LaunchStatus",
                });
            }
            if (res.Brand) {
                brandArray.push({
                    Name: "Brand/Label",
                    Value: res.Brand?.indexOf('-') != -1 ? res.Brand?.split('-')[1] : res.Brand,
                    InternalName: "Brand",
                });
            } else {
                brandArray.push({
                    Name: "Brand/Label",
                    Value: null,
                    InternalName: "Brand",
                });
            }
            if (res.DeepDive) {
                nplT6Array.push({
                    Name: "NPL T6",
                    Value: res.DeepDive == true ? "Yes" : "No",
                    InternalName: "DeepDive",
                });
            } else {
                nplT6Array.push({
                    Name: "NPL T6",
                    Value: "No",
                    InternalName: "DeepDive",
                });
            }
            if (res.BusinessUnit) {
                businessunitsArray.push({
                    Name: "Business Unit",
                    Value: res.BusinessUnit,
                    InternalName: "BusinessUnit",
                });
            } else {
                businessunitsArray.push({
                    Name: "Business Unit",
                    Value: null,
                    InternalName: "BusinessUnit",
                });
            }
            if (res.SubBusinessUnit) {
                subBusinessUnitsArray.push({
                    Name: "Sub Business Unit",
                    Value: res.SubBusinessUnit,
                    InternalName: "SubBusinessUnit",
                });
            } else {
                subBusinessUnitsArray.push({
                    Name: "Sub Business Unit",
                    Value: null,
                    InternalName: "SubBusinessUnit",
                });
            }
        });
        //marketArray = [... new Map(marketArray.map((item) => [item["Value"], item])).values()];
        launchLeadtArray = [... new Map(launchLeadtArray.map((item) => [item["Value"], item])).values()];
        launchProgresstArray = [... new Map(launchProgresstArray.map((item) => [item["Value"], item])).values()];
        launchStatusArray = [... new Map(launchStatusArray.map((item) => [item["Value"], item])).values()];
        brandArray = [... new Map(brandArray.map((item) => [item["Value"], item])).values()];
        nplT6Array = [... new Map(nplT6Array.map((item) => [item["Value"], item])).values()];
        businessunitsArray = [... new Map(businessunitsArray.map((item) => [item["Value"], item])).values()];
        subBusinessUnitsArray = [... new Map(subBusinessUnitsArray.map((item) => [item["Value"], item])).values()];

        //let planviewDropdownOptions = [...marketArray, ...launchLeadtArray, ...launchProgresstArray, ...launchStatusArray, ...brandArray];
        let planviewDropdownOptions = [...launchLeadtArray, ...launchProgresstArray, ...launchStatusArray, ...brandArray, ...nplT6Array, ...businessunitsArray, ...subBusinessUnitsArray];
        //  console.log(planviewDropdownOptions);
        let uniqueCatg = this.state.AllDropdownCategory.filter(val => (val.viewType == "Plan")).map(
            item => (item.Value));
        uniqueCatg = uniqueCatg.sort();
        uniqueCatg.map((item: string) => {
            let dropdownItemsCatg = planviewDropdownOptions.filter(rec =>
                rec.Name == item
            );
            let optionListArrCatg = [];

            dropdownItemsCatg.map((item1, index) => {
                if (index == 0) {
                    //add  'all' option value for each category filter
                    optionArr1.push({ Title: item1.Name, InternalGridColName: item1.Name, id: index, text: 'All', actualValue: 'All', viewType: "Plan" }); //viewType: "Both"
                }
                switch (item1.Name) {
                    case 'Business Unit':
                        optionListArrCatg.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        break;
                    case 'Sub Business Unit':
                        optionListArrCatg.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        break;
                    case 'Brand/Label':
                        optionListArrCatg.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        break;
                    case 'Launch Lead':
                        optionListArrCatg.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        break;
                    case 'Launch Progress':
                        optionListArrCatg.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        break;
                    case 'Launch Status':
                        optionListArrCatg.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        break;
                    case 'NPL T6':
                        optionListArrCatg.push({ Title: item1.Name ? item1.Name : '(Blanks)', InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', visible: false, actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value ? item1.Value : '(Blanks)', actualValue: item1.Value ? item1.Value : '(Blanks)', viewType: "Plan" });
                        break;
                    // case 'Market':
                    //     optionListArrCatg.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value, visible: false, actualValue: item1.Value, viewType: "Plan" });
                    //     optionArr1.push({ Title: item1.Name, InternalGridColName: item1.InternalName, id: index + 1, text: item1.Value, actualValue: item1.Value, viewType: "Plan" });
                    //     break;                    
                }

            });
            //if (dropdownItemsCatg[0]['Name'] == 'Brand' || dropdownItemsCatg[0]['Name'] == 'Launch Lead' || dropdownItemsCatg[0]['Name'] == 'Launch Progress' || dropdownItemsCatg[0]['Name'] == 'Launch Status' || dropdownItemsCatg[0]['Name'] == 'Market') {
            if (dropdownItemsCatg[0]['Name'] == 'Brand/Label' || dropdownItemsCatg[0]['Name'] == 'Launch Lead' || dropdownItemsCatg[0]['Name'] == 'Launch Progress' || dropdownItemsCatg[0]['Name'] == 'Launch Status' || dropdownItemsCatg[0]['Name'] == 'NPL T6' || dropdownItemsCatg[0]['Name'] == 'Business Unit' || dropdownItemsCatg[0]['Name'] == 'Sub Business Unit') {
                optionListArrCatg = optionListArrCatg?.sort((a, b) => a.text?.toString().toLowerCase() > b.text?.toString().toLowerCase() ? 1 : a.text?.toString().toLowerCase() < b.text?.toString().toLowerCase() ? -1 : 0);
                // AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: item });
                // localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                // // newly
                switch (item) {
                    case 'Business Unit':
                        AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'BusinessUnit', viewCategory: 'Plan' });
                        localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                        break;
                    case 'Sub Business Unit':
                        AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'SubBusinessUnit', viewCategory: 'Plan' });
                        localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                        break;
                    case 'Brand/Label':
                        AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'Brand', viewCategory: 'Plan' });
                        localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                        break;
                    case 'Launch Lead':
                        AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'LaunchLead', viewCategory: 'Plan' });
                        localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                        break;
                    case 'Launch Progress':
                        AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'LaunchProgress', viewCategory: 'Plan' });
                        localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                        break;
                    case 'Launch Status':
                        AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'LaunchStatus', viewCategory: 'Plan' });
                        localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                        break;
                    case 'NPL T6':
                        AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'DeepDive', viewCategory: 'Plan' });
                        localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                        break;
                    // case 'Market':
                    //     AllFilters.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: optionListArrCatg, internalName: 'Market', viewCategory: 'Plan' });
                    //     localAllNoneFilter.push({ filterCol: dropdownItemsCatg[0]['Name'], optionList: { All: false, None: false } });
                    //     break;

                }
            }
        });

        // let filterDropdownvalues = this.state.AllDropdownCategory.filter(val => (val.viewType == "Both" || val.viewType == "Product")).map(
        //     item => (item.Value));
        // let filterDropdownvalues = this.state.AllDropdownCategory.filter(val => (val.viewType == "Both" || val.viewType == "Plan")).map(
        //   item => (item.Value));
        // this.state.DropdownCategory = filterDropdownvalues;
        this.state.DropdownCategory = this.state.DropdownCategory.sort();
        optionArr1 = optionArr1?.sort((a, b) => a.Title?.toString().toLowerCase() > b.Title?.toString().toLowerCase() ? 1 : a.Title?.toString().toLowerCase() < b.Title?.toString().toLowerCase() ? -1 : 0);
        AllFilters = AllFilters?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);

        // set default selectednavitem
        // let filterNavValuesArr = optionArr1.filter(val => ((val.Title == "Launch Lead") && (val.actualValue == this.props.currentUser.Title)));
        // filterNavValuesArr = optionArr1.filter(val => ((val.Title == 'Launch Lead') && (val.actualValue === "Kelkar; Pramath") && (val.viewType === "Plan")));
        // if (filterNavValuesArr?.length > 0) {
        //     filterNavValuesArr = filterNavValuesArr[0];
        // } else {
        //     filterNavValuesArr = null;
        // }

        // defaultfilterVal = 'Launch Lead';
        // let filtervalues = [];

        // filtervalues = optionArr1?.filter(val => (val.Title == 'Launch Lead' && (val.viewType == "Plan")));
        // filtervalues = filtervalues.filter(ele => ele.text != 'All')?.sort((a, b) => a.actualValue?.toString().toLowerCase() > b.actualValue?.toString().toLowerCase() ? 1 : a.actualValue?.toString().toLowerCase() < b.actualValue?.toString().toLowerCase() ? -1 : 0);
        // filtervalues?.length > 0 && filtervalues.unshift({ Title: filtervalues[0].Name, InternalGridColName: filtervalues[0].Name, id: filtervalues.length + 1, text: 'All', actualValue: 'All', viewType: "Both" });

        await this.setState({
            filterStatus: defaultfilterVal,
            // Navitem: filtervalues,
            filterSelectedcolArray: this.state.DropdownCategory,
            AvailableFilterArr: AllFilters,
            AllCatColVal: optionArr1,
            AllFilterArr: AllFilters,
            AllNoneFilter: localAllNoneFilter,
            // uniqueLaunchLeads: launchLeadtArray.map((a: any) => a.Value).sort(),
            //selectednavitem: filterNavValuesArr,
        }, () => {
            setTimeout(() => { this.setState({ isLoading: false }); }, 100);
        });
    }

    protected navigation = () => {
        const DropdownValues = this.state.SelectedTabName == "Launch List" ? LaunchListDropdownValues : this.state.SelectedTabName == "GOLD" ? GoldDropdownValues : GscDropdownValues
        return (
            <div className="list demo-dark" style={{ width: '25% !important', color: 'white !important' }}>
                {/* This is actual position of menu */}
                <CustomToolbar items={this.toolbarItems} style={{
                    width: '20%', marginLeft: "12rem"
                }} />
                <div className='multiSelect' style={{ float: 'left', marginRight: '7%', marginTop: '-30px', color: 'white !important', marginLeft: "1rem" }}>
                    <CheckBox defaultValue={false}
                        value={this.state.IsMultiCategoryEnbaled}
                        onValueChanged={this.onCheckChanged} />
                    &nbsp; Multi Select &nbsp;

                </div>

                <SelectBox
                    items={DropdownValues}
                    value={this.state.filterStatus} className='filter-dd'
                    onValueChanged={this.onValueChanged} dropDownOptions={{ maxHeight: '80vh' }}

                    defaultValue='Launch Lead'
                    itemRender={(data) => {
                        return (
                            <div className="mainFilterItem">
                                {data}
                            </div>
                        );
                    }}
                />
                {this.state.IsMultiCategoryEnbaled ?
                    <ListBox
                        value={this.state.multiVals}
                        options={this.state.Navitem}
                        multiple
                        itemTemplate={this.listBoxTemplate}
                        onChange={this.onValueChangedVal}
                        optionLabel="actualValue"
                    /> :
                    <ListBox
                        value={this.state.onValueChangedValKey}
                        options={this.state.Navitem}
                        onChange={this.onValueChangedVal}
                        itemTemplate={this.listBoxTemplate}
                        optionLabel="actualValue"

                    />}
            </div>
        );
    }

    protected toolbarItemsRightArrow = [{
        widget: 'dxButton',
        location: 'after',
        options: {
            icon: 'chevronright',
            onClick: () => this.setState({ opened: !this.state.opened }),
        }
    },
        //You can add new icons on tool bar like this
        // {
        //     widget: 'dxCheckBox',
        //     location: 'before',
        //     options: this.CheckBoxOptions,
        // }
    ];

    public getProductChecklist = async () => {

        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        } else {

        }
        let DRItems = await DataService.fetchAllItems_DR(projectDetailsListName);
        // console.log(DRItems)
        let planViewItems = await DataService.fetchAllItems_PlanView("PGS_Common_ProjectList");
        // ProductProjectDetails
        let productProjectDetailsItems = await DataService.fetchAllItems_GLO_ProductProjectDetails("GLO_ProductProjectDetails");
        let finalProducts = [];
        let planViewRecords = [];
        // get PGS Common Project list backup records
        let planViewBackupItems = await DataService.fetchAllItems_PlanView("PGS_Common_ProjectList_Backup");
        // get DLPP records
        let dlppRecords = await DataService.fetchAllItems_DLPP('DLPPList');
        DRItems.map(async res => {
            let launchDetails = planViewItems.filter(i => i.DRID == res.ID);
            finalProducts.push({
                DRID: res.ID,
                Launches: launchDetails?.length ? launchDetails.length : '',
                ProductDescription: res.ProjectTitle,
                BusinessUnit: res.BU?.indexOf('->') != -1 ? res.BU?.split('->')[1] : res.BU,
                SubBusinessUnit: res.BusinessUnit?.indexOf('->') != -1 ? res.BusinessUnit?.split('->')[1] : res.BusinessUnit,
                ManagedType: res.ManagedBy?.indexOf('->') != -1 ? res.ManagedBy?.split('->')[1] : res.ManagedBy,
                OperationalUnit: res.OperationalUnit?.indexOf('->') != -1 ? res.OperationalUnit?.split('->')[1] : res.OperationalUnit,
                ProjectType: res.ProjectType?.indexOf('->') != -1 ? res.ProjectType?.split('->')[1] : res.ProjectType,
                ProjectSubType: res.ProjectSubType?.indexOf('->') != -1 ? res.ProjectSubType?.split('->')[1] : res.ProjectSubType,
                BrandGroup: res.BrandGroup?.indexOf('->') != -1 ? res.BrandGroup?.split('->')[1] : res.BrandGroup,

                ManagedBy: res.ManagedByUser,
                PlaniswareLeadCode: res.PlaniswareID?.trim(),
                PfizerCode: res.PlaniswareID?.trim(),
                PlaniswareCodeStudy: res.SecondaryPlaniswareID?.toString(),
                LaunchDate: res.Wave1StartDate,
                NewProductPlanner: res.NewProductsPlanner?.Title,
                DataSteward: res.DataSteward != null ? res.DataSteward.Title : null,
                LXCoDev: res.CoDevLead != null ? res.CoDevLead.Title : null,
                LaunchLead: res.LaunchLeaderUser?.Title,
                CreatedBy: res?.Author?.Title,
                //JEFIN
                ManagedByEmail: res.ManagedByEmail,
                NewProductPlannerEmail: res.NewProductsPlanner?.EMail,
                DataStewardEmail: res.DataSteward?.EMail,
                DataStewardTitle: res.DataSteward?.Title,
                LXCoDevEmail: res.CoDevLead?.EMail,
                GLOLaunchLeadEmail: res.LaunchLeaderUser?.EMail,
                //END
                API: res.MoleculeName?.indexOf('->') != -1 ? res.MoleculeName?.split('->')[1] : res.MoleculeName,
                GRP: res.ProposedGRP0?.indexOf('->') != -1 ? res.ProposedGRP0?.split('->')[1] : res.ProposedGRP0,
                PipelineStatus: res?.PipelineStatus,
                PipelineStage: res?.['PipelineStage']?.indexOf('->') >= 0 ? res?.['PipelineStage'].split('->')[1] : res?.['PipelineStage'],
                ProjectCode: res.RnDProjNo != null && res.RnDProjNo != undefined ? res.RnDProjNo : '',
                IBPDemandPlanning: res.IBPDemandPlanning ? res.IBPDemandPlanning.indexOf('->') ? res.IBPDemandPlanning.split('->')[1] : res.IBPDemandPlanning : '',
                IBPAPOInterfaceGrossReq: res.IBPAPOInterfaceGrossReq ? res.IBPAPOInterfaceGrossReq.indexOf('->') ? res.IBPAPOInterfaceGrossReq.split('->')[1] : res.IBPAPOInterfaceGrossReq : '',
                IBPSupplyPlanning: res.IBPSupplyPlanning ? res.IBPSupplyPlanning.indexOf('->') ? res.IBPSupplyPlanning.split('->')[1] : res.IBPSupplyPlanning : '',
                IBPNettingAPODepDMD: res.IBPNettingAPODepDMD ? res.IBPNettingAPODepDMD.indexOf('->') ? res.IBPNettingAPODepDMD.split('->')[1] : res.IBPNettingAPODepDMD : '',
                ItemCodes: res?.['ItemCodes']?.indexOf('->') >= 0 ? res?.['ItemCodes'].split('->')[1] : res?.['ItemCodes'],
                FirstYearRevBooking: res.FirstYearRevBooking,
                SAndOP: res.SAndOP,
                NPPEngagement: res.NPPEngagement ? res.NPPEngagement.indexOf('->') ? res.NPPEngagement.split('->')[1] : res.NPPEngagement : '',
                IsDelete: res.IsDelete,
                Comments1: res.Comments1,
                Comments2: res.Comments2,
                Field1: res.Field1,
                Field2: res.Field2,
                IsActive: res.IsActive,
                TradeName: res.TradeName,
                GlobalBrandAPI: res.GlobalBrandAPI,
                OtherAlias: res.OtherAlias,
                TherapeuticArea: res.TherapeuticArea?.indexOf('->') != -1 ? res.TherapeuticArea?.split('->')[1] : res.TherapeuticArea,
                DosageCategory: res.DosageCategory?.indexOf('->') != -1 ? res.DosageCategory?.split('->')[1] : res.DosageCategory,
                DosageForm: res.DosageForm?.indexOf('->') != -1 ? res.DosageForm?.split('->')[1] : res.DosageForm,
                Indication: res.Indication,
                TransferPriceContact: res.TransferPriceContact,
                MPG: res.MPG?.indexOf('->') != -1 ? res.MPG?.split('->')[1] : res.MPG,
                RecordStatus: res.RecordStatus,
                PlanningType: res.PlanningType,
            });
        });
        // PGS Common Project List records               
        planViewItems.map(async res => {
            let reasonCodeIdArr = [];
            let reasonCodeDescArr = '';
            res.ReasonCodeLookUp?.map(val => {
                reasonCodeIdArr.push(val.Id);
                reasonCodeDescArr += val.Description + ';';
            }
            );
            reasonCodeDescArr = reasonCodeDescArr.slice(0, -1);
            let LaunchStatusVal = ""
            if (res.LaunchStatus === "Green") {
                LaunchStatusVal = "On Track";
            }
            else if (res.LaunchStatus === "Yellow") {
                LaunchStatusVal = "At Risk";
            }
            else if (res.LaunchStatus === "Red") {
                LaunchStatusVal = "Delayed";
            }
            else if (res.LaunchStatus === "Blue") {
                LaunchStatusVal = "Complete";
            }
            else if (res.LaunchStatus === "Grey") {
                LaunchStatusVal = "Not Initiated";
            } else {
                LaunchStatusVal = null;
            }
            let riskStatusVal = this.getStatusValue(res.Risk_x002f_IssueStatus);
            let resourceStatusVal = this.getStatusValue(res.ResourceStatus);

            let filteredPPDetails = productProjectDetailsItems.filter(i => i.DRID == res.DRID); //res.DRID
            let filterDRItems = DRItems.filter(i => i.ID == res.DRID);
            let brandVal = res.Brand?.indexOf('-') != -1 ? res.Brand?.split('-')[1] : res.Brand;
            let brandValue = brandVal?.indexOf('$') != -1 ? brandVal?.split('$')[0] : brandVal;
            // PGS Common Project List Backup
            let filteredTaskFinishDate = planViewBackupItems.filter(i => i.Title == res.Title);
            filteredTaskFinishDate?.sort((a, b) => Date.parse(b.Backupdate) - Date.parse(a.Backupdate));
            // Dlpp list filter
            let templateVal = dlppRecords?.filter(i => i.DRID == res.DRID && i.ProjectName === res.ProjectName);
            planViewRecords.push({
                DRID: res.DRID,
                ID: res.ID,
                Title: res.Title,
                ProjectName: res.ProjectName,
                LaunchLead: res.LaunchLead?.indexOf(';') != -1 ? res.LaunchLead?.replace(";", ",") : res.LaunchLead,
                Market: res.Market?.indexOf('-') != -1 ? res.Market?.split('-')[1] : res.Market,
                BusinessUnit: res.BU?.indexOf('-') != -1 ? res.BU?.split('-')[1] : res.BU,
                SubBusinessUnit: res.BusinessUnit?.indexOf('-') != -1 ? res.BusinessUnit?.split('-')[1] : res.BusinessUnit,
                TaskFinishDate: res.TaskFinishDate ? res.TaskFinishDate.split('T')[0] : res.TaskFinishDate, // date time
                BackupTaskFinishDate: filteredTaskFinishDate[0]?.TaskFinishDate,
                Notes: res.Notes, // myltiline
                LaunchLeadVerified: res.LaunchLeadVerified, //yes/no
                DeepDive: res.DeepDive, // == true ? "Yes" : "No", //yes/no tttttt fdfddrddfdfd
                LaunchLeadVerifiedBy: res.LaunchLeadVerifiedBy,
                // CertifiedforBSC: res.CertifiedforBSC, // yes/no
                CertifiedBy: res.CertifiedBy,
                // LastUpdated: res.LastUpdated, //date time
                // LastUpdatedBy: res.LastUpdatedBy,
                // isBlacklisted: res.isBlacklisted, //number
                LastNotificationSent: res.LastNotificationSent ? res.LastNotificationSent.split('T')[0] : res.LastNotificationSent, //date timr
                // LastPublishedDate: res.LastPublishedDate, //date time
                ReasonCodeLookUp: reasonCodeIdArr, //res.ReasonCodeLookUp, // lookup LaunchLeaderUser?.Title,
                ReasonCodeLookUpTitle: res.ReasonCodeLookUp?.Title,
                ReasonCodeLookUpDescString: reasonCodeDescArr,
                // ReasonCodeLookUp_x003a_Title: res.ReasonCodeLookUp_x003a_Title,// lookup
                // ReasonCodeLookUp_x003a_Descripti: res.ReasonCodeLookUp_x003a_Descripti, //lookup
                ReasonCodeText: res.ReasonCodeText,
                // ReasonCode: res.ReasonCode,
                Brand: brandValue, //res.Brand?.indexOf('-') != -1 ? res.Brand?.split('-')[1] : res.Brand,
                TherapeuticArea: res.TherapeuticArea?.indexOf('-') != -1 ? res.TherapeuticArea?.split('-')[1] : res.TherapeuticArea, // res.TherapeuticArea,
                LaunchProgress: res.LaunchProgress, // choice
                LaunchStatus: LaunchStatusVal, // choice
                // Percentage_x0020_Complete: res.Percentage_x0020_Complete,
                // Last_x0020_Modified0: res.Last_x0020_Modified0, // last modified
                Indication: res.Indication,
                // Launch_x0020_Health: res.Launch_x0020_Health, //choice
                GRP: res.GRProduct?.indexOf('-') != -1 ? res.GRProduct?.split('-')[1] : res.GRProduct,
                PGSTemplate: res.PGSTemplate,
                Country: res.Country?.indexOf('-') != -1 ? res.Country?.split('-')[1] : res.Country, // res.Country,
                Region: res.Region?.indexOf('-') != -1 ? res.Region?.split('-')[1] : res.Region,
                WaveType: res.WaveType,
                ResourceStatus: resourceStatusVal, //res.ResourceStatus,
                RiskStatus: riskStatusVal, //res.Risk_x002f_IssueStatus,
                PfizerCode: res.PfizerCode?.trim(),
                PlanExistsURL: res.PlanExistsURL,
                PlanStatus: res.PlanStatus,

                LaunchReadinessStatus: filteredPPDetails[0]?.LaunchReadinessStatus,
                SupplyContinuityRisk: filteredPPDetails[0]?.SupplyContinuityRisk,
                PGSLeader: filteredPPDetails[0]?.PGSLeaders?.Title,
                CogsNetPrice: filteredPPDetails[0]?.COGSNetPrice,
                NPRiskTrend: filteredPPDetails[0]?.RiskTrend,
                LaunchReadinessComments: filteredPPDetails[0]?.LaunchReadinessComments,
                SupplyContinuityRiskComments: filteredPPDetails[0]?.SupplyContinuityRiskComments,
                NewProductPlanner: filterDRItems[0]?.NewProductsPlanner?.Title,
                DataSteward: filterDRItems[0]?.DataSteward?.Title,
                CoDevLead: filterDRItems[0]?.CoDevLead?.Title,
                Template: templateVal[0]?.Template
            });
        });
        let uniqueReasoncodes = [...new Set(planViewItems.map(item => item.ReasonCodeText))];
        let reasonCodeOptions = [];
        if (uniqueReasoncodes.length > 0) {
            uniqueReasoncodes.map((item) => {
                if (item != null && item != "" && item != undefined) {
                    reasonCodeOptions.push({
                        name: item,
                        code: item
                    });
                }
            });
        }
        // set the ref variable   
        planViewRecords = planViewRecords.sort((a, b) => Date.parse(a.TaskFinishDate) - Date.parse(b.TaskFinishDate));
        this.projectDetailsListRef.current = finalProducts;
        this.commonProjectListRef.current = planViewRecords;

        this.setState({
            showalltxt: "Active",
            ProductChecklist: finalProducts,
            planViewRecordsArray: planViewRecords,
            reasonChangeOptions: reasonCodeOptions
        }, () => {
            setTimeout(() => { this.setState({ isLoading: false }); }, 100);
        });
    }

    public getStatusValue = (prmValue: string): string => {
        let statusVal = "";
        try {
            if (prmValue === "Green") {
                statusVal = "On Track";
            }
            else if (prmValue === "Yellow") {
                statusVal = "At Risk";
            }
            else if (prmValue === "Red") {
                statusVal = "Delayed";
            }
            else if (prmValue === "Blue") {
                statusVal = "Complete";
            }
            else if (prmValue === "Grey") {
                statusVal = "Not Initiated";
            }
            return statusVal;
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

    // Get Products and Plans for TreeView 
    public getProductAndPlanDetails = async () => {
        try {
            let productsList = this.state.ProductChecklist;
            //let dlppItems = await DataServiceNew.fetchAllItems_DLPP("DLPPList");
            let planViewList = this.state.planViewRecordsArray;
            // Lunch Lead array
            //let jsonLaunchLead = [];
            // Launch Lead
            this.renderLaunchLead(planViewList);
            this.renderLaunchLeadProduct(productsList);
            // sub busines unit 
            this.renderSubBusinessUnit(planViewList);
            // sub business unit
            this.renderProductSubBusinessUnit(productsList);
            // launch status array
            this.renderLaunchStatus(planViewList);
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

    // treeview array Launch Status
    public renderLaunchStatus = async (prmData) => {
        try {
            let jsonDataLaunchStatus = [];
            let uniqueLaunchStatusPlan = [...new Set(prmData.map(item => item.LaunchStatus))];
            //uniqueLaunchStatusPlan = uniqueLaunchStatusPlan?.sort((a, b) => a?.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : a.toString().toLowerCase() < b.toString().toLowerCase() ? -1 : 0);
            uniqueLaunchStatusPlan.map((data) => {
                //if (data != undefined && data != null && data != "") {
                let lauchStatusResult = prmData.filter(item => item.LaunchStatus == data);
                let item = {};
                let colorCode = "";
                if (data === undefined || data === null || data === "") {
                    data = "Blanks";
                    colorCode = "#FFE4C4";
                }
                if (data === "At Risk") {
                    colorCode = "#fede75";
                }
                if (data === "Medium") {
                    colorCode = "#fede75";
                }
                else if (data === "Complete") {
                    colorCode = "#779FEC";
                }
                else if (data === "Delayed") {
                    colorCode = "#f58082";
                }
                else if (data === "High Risk") {
                    colorCode = "#f58082";
                }
                else if (data === "On Track") {
                    colorCode = "#58b973";
                }
                else if (data === "Low") {
                    colorCode = "#58b973";
                }
                else if (data === "Not Initiated") {
                    colorCode = "#979797";
                }
                else {

                }
                item["title"] = data,
                    item["categoryName"] = "Launch Status",
                    item["buname"] = data,
                    item["expanded"] = true,
                    item["type"] = 'LaunchStatus',
                    item["className"] = 'bg-purple-500 text-white',
                    item["style"] = { borderRadius: '12px' },
                    item["data"] = {
                        title: data,
                        launches: lauchStatusResult?.length
                    },
                    item["colorcode"] = colorCode;
                item["colorcodelight"] = colorCode;
                jsonDataLaunchStatus.push(item);
                //}
            });
            let productLength = [...new Set(prmData.map(item => item.DRID))];
            //let productLength = [...new Set(prmData.map(item => item.GRP))];
            //let uniqueProductsArr = prmData.filter(i => i.PfizerCode != undefined);
            //let productLength = [...new Set(prmData.map(item => item.PfizerCode))];
            let productLengthValue = 0;
            if (productLength?.length > 0) {
                productLengthValue = productLength?.length;
            }
            else {
                productLengthValue = 0;
            }


            let jsonArrayLaunchStatus = [{
                expanded: 'true',
                title: 'Portfolio',
                type: 'portfoliocategory',
                className: 'bg-indigo-500 text-white',
                style: { borderRadius: '12px' },
                data: {
                    title: 'Portfolio',
                    products: productLengthValue,
                    launches: prmData?.length,
                },
                children: jsonDataLaunchStatus
            }];
            this.setState({
                jsonDataArrayLaunchStatus: jsonArrayLaunchStatus
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

    highlightSelectedRow = (e) => {
        if (e.rowType == 'data' && e.data.ProjectName == this.state.selectedID?.ProjectName) {
            e.cellElement.style.backgroundColor = "#e3f2fd";
        }
    }
    // treeview array sub business unit
    public renderSubBusinessUnit = async (prmData) => {
        try {
            let jsonData = [];
            let productsArray = this.projectDetailsListRef.current;
            //productsArray = productsArray.filter(({ PlaniswareLeadCode: pfizerCodeVal }) => prmData?.some(({ PfizerCode }) => PfizerCode == pfizerCodeVal));
            productsArray = productsArray.filter(({ DRID: DRIDVal }) => prmData?.some(({ DRID }) => DRID == DRIDVal));
            let uniqueSubBusinessUnit = [...new Set(prmData.map(item => item.SubBusinessUnit))];
            let totalLauchDetails = 0;
            //let totalProducts = [...new Set(prmData.map(item => item.GRP))];
            //let uniquePlanProductsArr = prmData.filter(i => i.PfizerCode != undefined);
            //let totalProducts = [...new Set(prmData.map(item => item.PfizerCode))];
            let totalProducts = [...new Set(prmData.map(item => item.DRID))];
            uniqueSubBusinessUnit = uniqueSubBusinessUnit?.sort((a, b) => a?.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : a.toString().toLowerCase() < b.toString().toLowerCase() ? -1 : 0);
            uniqueSubBusinessUnit.map((data: any) => {
                //if (data != undefined && data != null && data != "") {
                let bucode: any = "";
                if (data === undefined || data === null || data === "") {
                    bucode = "Blanks";
                }
                else if (data === "Inflammation & Immunology") {
                    bucode = "I&I";
                }
                else if (data === "Internal Medicine") {
                    bucode = "IM";
                } else {
                    bucode = data;
                }
                let subBusinessUnit = productsArray.filter(item => item.SubBusinessUnit == data);
                if (subBusinessUnit?.length > 0) {
                    //subBusinessUnit = [...new Set(subBusinessUnit.map(item => item.GRP))];
                    //subBusinessUnit = [...new Set(subBusinessUnit.map(item => item.PlaniswareLeadCode))];
                    subBusinessUnit = [...new Set(subBusinessUnit.map(item => item.DRID))];
                }
                let subBusinessUnitAssigned = productsArray.filter(item => item.SubBusinessUnit == data && (item.LaunchLead != null && item.LaunchLead != undefined));

                //totalProducts = totalProducts + subBusinessUnit?.length;
                // plan view array filter
                let subBusinessUnitPlanview = prmData?.filter(item => item.SubBusinessUnit == data);
                totalLauchDetails = totalLauchDetails + subBusinessUnitPlanview?.length;

                let subBusinessUnitPlansAssigned = prmData?.filter(item => item.SubBusinessUnit == data && (item.LaunchLead != null && item.LaunchLead != undefined));
                let item = {};
                item["title"] = bucode,
                    item["categoryName"] = "Sub Business Unit",
                    item["buname"] = data,
                    item["expanded"] = true,
                    item["type"] = 'Plancategory',
                    item["className"] = 'bg-purple-500 text-white',
                    item["style"] = { borderRadius: '12px' },
                    item["data"] = {
                        title: bucode,
                        products: subBusinessUnit.length,
                        Assigned: subBusinessUnitAssigned.length,
                        UnAssigned: (subBusinessUnit.length - subBusinessUnitAssigned.length),
                    },
                    item["colorcode"] = "#e2d5fd", //data.colorcode;
                    item["colorcodelight"] = "#e2d5fd", //data.colorcodelight;
                    item["children"] = [{
                        expanded: true,
                        type: 'PlanSubcategory',
                        className: 'bg-purple-500 text-white',
                        style: { borderRadius: '12px', background: '#e2d5fd' }, // '#f8eba1'
                        data: {
                            colorcode: "#e2d5fd",
                            title: data,
                            launches: subBusinessUnitPlanview.length,
                            Assigned: subBusinessUnitPlansAssigned.length,
                            UnAssigned: (subBusinessUnitPlanview.length - subBusinessUnitPlansAssigned.length),
                        }
                    }];
                jsonData.push(item);
                //}
            });
            //let productLength = [...new Set(prmData.map(item => item.DRID))];

            let jsonArray = [{
                expanded: 'true',
                title: 'GLOW Portfolio',
                type: 'portfoliocategory',
                className: 'bg-indigo-500 text-white',
                style: { borderRadius: '12px' },
                data: {
                    title: 'Portfolio',
                    products: totalProducts?.length,
                    launches: totalLauchDetails,
                },
                children: jsonData
            }];
            this.setState({
                jsonDataArray: jsonArray
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

    public renderProductSubBusinessUnit = async (prmData) => {
        try {
            let jsonData = [];
            let launchArray = this.commonProjectListRef.current;
            //launchArray = launchArray.filter(({ PlaniswareLeadCode: pfizerCodeVal }) => prmData?.some(({ PfizerCode }) => PfizerCode == pfizerCodeVal));
            launchArray = launchArray.filter(({ DRID: DRIDVal }) => prmData?.some(({ DRID }) => DRID == DRIDVal));
            let uniqueSubBusinessUnit = [...new Set(prmData.map(item => item.SubBusinessUnit))];
            let totalLauchDetails = 0;
            //let totalProducts = [...new Set(prmData.map(item => item.GRP))];
            //let uniqueProductProductsArr = prmData.filter(i => i.PlaniswareLeadCode != undefined);
            //let totalProducts = [...new Set(prmData.map(item => item.PlaniswareLeadCode))];
            let totalProducts = 0;
            uniqueSubBusinessUnit = uniqueSubBusinessUnit?.sort((a, b) => a?.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : a.toString().toLowerCase() < b.toString().toLowerCase() ? -1 : 0);
            uniqueSubBusinessUnit.map((data: any) => {
                let assignedProducts = 0;
                let unAssignedProducts = 0;
                let assignedLaunches = 0;
                let unAssignedlaunches = 0;
                //if (data != undefined && data != null && data != "") {
                let bucode: any = "";
                if (data === undefined || data === null || data === "") {
                    bucode = "Blanks";
                }
                else if (data === "Inflammation & Immunology") {
                    bucode = "I&I";
                }
                else if (data === "Internal Medicine") {
                    bucode = "IM";
                } else {
                    bucode = data;
                }
                let subBusinessUnit = prmData.filter(item => item.SubBusinessUnit == data);
                //totalProducts = totalProducts + subBusinessUnit?.length;
                // if (subBusinessUnit?.length > 0) {
                //     //subBusinessUnit = [...new Set(subBusinessUnit.map(item => item.GRP))];
                //     //let uniqueProductsArr = subBusinessUnit.filter(i => i.PlaniswareLeadCode != undefined);
                //     subBusinessUnit = [...new Set(subBusinessUnit.map(item => item.PlaniswareLeadCode))];
                //     //totalProducts = totalProducts + subBusinessUnit?.length;
                // }

                // Assigned Products
                let subBusinessUnitAssigned = prmData.filter(item => item.SubBusinessUnit == data && (item.LaunchLead != null && item.LaunchLead != undefined));
                // check the plans created
                let subBusinessUnitPlanview = [];
                let subBusinessUnitPlanviewUnAssigned = [];
                if (subBusinessUnitAssigned?.length > 0) {
                    //let subBUAssigned = this.commonProjectListRef.current.filter(item => item.DRID == subBusinessUnitAssigned[0].DRID);
                    subBusinessUnitAssigned?.map((item) => {
                        let subBUAssigned = launchArray.filter(i => i.DRID == item.DRID);
                        if (subBUAssigned?.length > 0) {
                            assignedProducts = assignedProducts + 1;
                            // launch
                            subBusinessUnitPlanview = launchArray?.filter(i => i.DRID == item.DRID);
                            totalLauchDetails = totalLauchDetails + subBusinessUnitPlanview?.length;
                            assignedLaunches = assignedLaunches + subBusinessUnitPlanview?.length;
                            totalProducts = totalProducts + 1;
                        }
                        else {
                            unAssignedProducts = unAssignedProducts + 1;
                            subBusinessUnitPlanviewUnAssigned = launchArray?.filter(i => i.DRID == item.DRID);
                            unAssignedlaunches = unAssignedlaunches + subBusinessUnitPlanviewUnAssigned?.length;
                            totalLauchDetails = totalLauchDetails + subBusinessUnitPlanviewUnAssigned?.length;
                        }
                    });
                }
                // UnAssigned products
                let subBusinessUnitUnAssigned = prmData.filter(item => item.SubBusinessUnit == data && (item.LaunchLead === undefined));
                unAssignedProducts = unAssignedProducts + subBusinessUnitUnAssigned?.length;
                subBusinessUnitUnAssigned?.map((item) => {
                    subBusinessUnitPlanviewUnAssigned = launchArray?.filter(i => i.DRID == item.DRID);
                    unAssignedlaunches = unAssignedlaunches + subBusinessUnitPlanviewUnAssigned?.length;
                    totalLauchDetails = totalLauchDetails + subBusinessUnitPlanviewUnAssigned?.length;
                });

                // plan view array filter
                // let subBusinessUnitPlanview = launchArray?.filter(item => item.SubBusinessUnit == data);
                // totalLauchDetails = totalLauchDetails + subBusinessUnitPlanview?.length;

                let item = {};
                item["title"] = bucode,
                    item["categoryName"] = "Sub Business Unit",
                    item["buname"] = data,
                    item["expanded"] = true,
                    item["type"] = 'Productcategory',
                    item["className"] = 'bg-purple-500 text-white',
                    item["style"] = { borderRadius: '12px' },
                    item["data"] = {
                        title: bucode,
                        products: subBusinessUnit?.length,
                        Assigned: assignedProducts, //subBusinessUnitAssigned?.length,
                        UnAssigned: unAssignedProducts, //subBusinessUnitUnAssigned?.length, (subBusinessUnit.length - subBusinessUnitAssigned.length),
                        launches: assignedLaunches,
                        launchesUnAssigned: unAssignedlaunches,
                    },
                    item["colorcode"] = "#bb9efa", //data.colorcode;
                    item["colorcodelight"] = "#e2d5fd", //data.colorcodelight;
                    // item["children"] = [{
                    //     expanded: true,
                    //     type: 'Subcategory',
                    //     className: 'bg-purple-500 text-white',
                    //     style: { borderRadius: '12px', background: '#e2d5fd' }, // '#f8eba1'
                    //     data: {
                    //         title: data,
                    //         launches: subBusinessUnitPlanview?.length,
                    //         Assigned: subBusinessUnitPlansAssigned?.length,
                    //         UnAssigned: (subBusinessUnitPlanview?.length - subBusinessUnitPlansAssigned?.length),
                    //     }
                    // }];
                    jsonData.push(item);
                //}
            });
            //let productLength = [...new Set(prmData.map(item => item.DRID))];
            let jsonArray = [{
                expanded: 'true',
                title: 'GLOW Portfolio',
                type: 'PortfolioSubBUCategory',
                className: 'bg-indigo-500 text-white',
                style: { borderRadius: '12px' },
                data: {
                    title: 'Portfolio',
                    products: totalProducts, //totalProducts?.length,
                    launches: totalLauchDetails,
                },
                children: jsonData
            }];
            this.setState({
                jsonDataArrayProduct: jsonArray
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

    public renderLaunchLead = async (prmLaunchLead) => {
        try {
            let jsonLaunchLead = [];
            let uniqueLaunchLeadPlan = [...new Set(prmLaunchLead.map(item => item.LaunchLead))];
            uniqueLaunchLeadPlan = uniqueLaunchLeadPlan?.sort((a, b) => a?.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : a.toString().toLowerCase() < b.toString().toLowerCase() ? -1 : 0);
            let totalProducts = 0;
            let totalLaunches = 0;
            //totalProducts = [...new Set(prmLaunchLead.map(item => item.GRP))]?.length;
            //let uniquePlanLaunchleadArr = prmLaunchLead.filter(i => i.PfizerCode != undefined);
            //totalProducts = [...new Set(prmLaunchLead.map(item => item.PfizerCode))]?.length;
            totalProducts = [...new Set(prmLaunchLead.map(item => item.DRID))]?.length;
            uniqueLaunchLeadPlan.map((data: any) => {
                //if (data != undefined && data != null && data != "") {                
                let item = {};
                //let launchLeadVal = productsList.filter(item => (item.LaunchLead == userName));
                let launchLeadDlpp = prmLaunchLead.filter(item => item.LaunchLead == data); // (item.PlanOwner?.Title == data));                
                //let uniqueDRID = [...new Set(launchLeadDlpp.map(item => item.DRID))];            
                //totalProducts = totalProducts + uniqueDRID?.length;
                totalLaunches = totalLaunches + launchLeadDlpp?.length;
                if (data === undefined || data === null || data === "") {
                    data = "Blanks";
                }
                item["expanded"] = 'false',
                    item["categoryName"] = "Launch Lead",
                    item["title"] = data,
                    //item["viewType"] = "Plan",
                    item["Launch Progress"] = "Active",
                    item["type"] = 'LeadCategory',
                    item["className"] = 'bg-purple-500 text-white',
                    item["style"] = { borderRadius: '12px' },
                    item["data"] = {
                        title: data,
                        //products: uniqueDRID.length,
                        launches: launchLeadDlpp.length,
                    },
                    item["colorcode"] = '#e2d5fd';
                jsonLaunchLead.push(item);
                //}
            });
            //let productLength = [...new Set(prmLaunchLead.filter(i => i.DRID))];
            let jsonArrayLauchLead = [{
                expanded: 'true',
                title: 'GLOW Portfolio',
                type: 'portfoliocategory',
                className: 'bg-indigo-500 text-white',
                style: { borderRadius: '12px' },
                data: {
                    title: 'Portfolio',
                    products: totalProducts,
                    launches: totalLaunches,
                },
                children: jsonLaunchLead
            }];
            // console.log("Launch lead:" + jsonArrayLauchLead, jsonLaunchLead);
            this.setState({
                jsonDataLaunchLead: jsonArrayLauchLead,
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

    public renderLaunchLeadProduct = async (prmLaunchLead) => {
        try {
            let jsonProductLaunchLead = [];
            let launchArray = this.commonProjectListRef.current;
            launchArray = launchArray.filter(({ DRID: DRIDVal }) => prmLaunchLead?.some(({ DRID }) => DRID == DRIDVal));

            let uniqueLaunchLeadProduct = [...new Set(prmLaunchLead.map(item => item.LaunchLead))];
            uniqueLaunchLeadProduct = uniqueLaunchLeadProduct?.sort((a, b) => a?.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : a.toString().toLowerCase() < b.toString().toLowerCase() ? -1 : 0);
            let totalProducts = 0;
            let totalLaunches = 0;
            //let totalLaunches = 0;
            //totalProducts = [...new Set(prmLaunchLead.map(item => item.GRP))]?.length;
            //let uniqueLaunchleadArr = prmLaunchLead.filter(i => i.PlaniswareLeadCode != undefined);
            //totalProducts = [...new Set(prmLaunchLead.map(item => item.PlaniswareLeadCode))]?.length;
            uniqueLaunchLeadProduct.map((data: any) => {
                //if (data != undefined && data != null && data != "") {
                let item = {};
                let launchLeadVal = prmLaunchLead.filter(item => (item.LaunchLead == data));
                let launchLeadAssigned = 0;
                let launchLeadUnAssigned = 0;
                //let assignedLaunches = 0;
                if (data != undefined) {
                    if (launchLeadVal?.length > 0) {
                        launchLeadVal?.map((item) => {
                            let assigned = launchArray.filter(i => i.DRID == item.DRID);
                            assigned = [...new Set(assigned.map(item => item.DRID))];
                            if (assigned?.length > 0) {
                                launchLeadAssigned = launchLeadAssigned + assigned?.length;
                                // launch
                                let launchLeadPlanview = launchArray?.filter(i => i.DRID == item.DRID);
                                //assignedLaunches = assignedLaunches + launchLeadPlanview?.length;
                                totalProducts = totalProducts + 1;
                                totalLaunches = totalLaunches + launchLeadPlanview?.length;
                            }
                            else {
                                launchLeadUnAssigned = launchLeadUnAssigned + 1;
                                let launchLeadvalPlanview = launchArray?.filter(i => i.DRID == item.DRID);
                                //assignedLaunches = assignedLaunches + launchLeadvalPlanview?.length;
                                //totalProducts = totalProducts + 1;
                                totalLaunches = totalLaunches + launchLeadvalPlanview?.length;
                            }
                        });
                    }
                } else {
                    if (launchLeadVal?.length > 0) {
                        launchLeadVal?.map((item) => {
                            let unAssigned = launchArray.filter(i => i.DRID == item.DRID);
                            //unAssigned = [...new Set(unAssigned.map(item => item.DRID))];
                            totalLaunches = totalLaunches + unAssigned?.length;
                        });
                        let uniqueProjects = [...new Set(launchLeadVal.map(item => item.DRID))];
                        launchLeadUnAssigned = launchLeadUnAssigned + uniqueProjects?.length;
                    }
                }


                if (data === undefined || data === null || data === "") {
                    data = "Blanks";
                }
                item["expanded"] = 'false',
                    item["title"] = data,
                    item["categoryName"] = "Launch Lead",
                    //item["viewType"] = "Product",
                    item["type"] = 'ProductLeadCategory',
                    item["className"] = 'bg-purple-500 text-white',
                    item["style"] = { borderRadius: '12px' },
                    item["data"] = {
                        title: data,
                        Assignedprograms: launchLeadAssigned,//launchLeadVal.length,
                        UnAssignedPrograms: launchLeadUnAssigned,
                        //launches: launchLeadDlpp.length,
                    },
                    item["colorcode"] = '#e2d5fd';
                jsonProductLaunchLead.push(item);
                //}
            });
            // product
            let jsonArrayProductLauchLead = [{
                expanded: 'true',
                title: 'GLOW Portfolio',
                type: 'portfoliocategory',
                tabName: 'ProductLaunchLead',
                className: 'bg-indigo-500 text-white',
                style: { borderRadius: '12px' },
                data: {
                    title: 'Portfolio',
                    products: totalProducts,
                    launches: totalLaunches, //dlppItems.length,
                },
                children: jsonProductLaunchLead
            }];
            this.setState({
                jsonDataProductLaunchLead: jsonArrayProductLauchLead
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

    //LightSpeedCol added by Arpita
    public LightSpeedCol(rowData: any) {
        if (rowData.value == true) {
            return (
                <img title="View" src={LightSpeedIndicator} alt="icon" style={(rowData.value == true) ? { maxWidth: "40px", maxHeight: "15px", marginLeft: '10px' } : { display: 'none' }}></img>
            );
        } else {
            return (<>&nbsp;</>)
        }
    }

    public SetcellBody(rowData: any) {
        let rawText: string = rowData.value;
        let finalText = rawText != '' && rawText != null ? rawText.split('->')[1] : '';
        return (
            <span title={finalText}>{finalText}</span>
        );
    }

    public IntegrationNotesCell(rowData: any) {
        return (
            <span title={this.stripHtml(rowData.value)}>{this.stripHtml(rowData.value)}</span>
        );
    }
    public stripHtml(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    public setCellPrimary(rowData: any) {
        return (
            <>
                <div className={' row col-xs-12'} style={{ marginLeft: '15px' }}>
                    <div className="flex align-items-center">
                        <RadioButton inputId="ingredient2" name="SelectionRecord1" id={rowData.ProjectID}
                            disabled={(rowData.DRID != null && rowData.DRID != "" && rowData.IntegrationStatus == "Published")}
                            value={rowData.ProjectID} onChange={(e) => this.onRadioChange(e, rowData)}
                            checked={this.state.selectedPrimaryPlaniswareRec && this.state.selectedPrimaryPlaniswareRec.ProjectID === rowData.ProjectID}
                        />
                    </div>
                </div>
            </>
        );
    }
    public onRadioChange(e, row) {
        console.log("onRadioChange", row);
        this.setState({ selectedPrimaryPlaniswareRec: row });
    }
    public setLinkAction(rowData: any) {
        return (
            <>
                <div className={' row col-xs-12'} style={{ marginLeft: '15px' }}>
                    {/* onClick={(e) => handleOnClickaction(row, Column, 'edit')} */}
                    <div className="flex align-items-center">
                        <Checkbox inputId="ingredient1" name="SelectionRecord" id={rowData.ProjectID}
                            disabled={(rowData.DRID != null && rowData.DRID != "" && rowData.IntegrationStatus == "Published")}
                            value={rowData.PlaniswareID}
                            onChange={(e) => this.onSelectedIPortPlansIdsChange(e, rowData)}
                            checked={this.state.selectedPrimaryPlaniswareRec && this.state.selectedPrimaryPlaniswareRec.ProjectID === rowData.ProjectID}
                        />
                    </div>
                </div>
            </>
            // <></>
        );
    }
    public onDRhandleChange(e, row) {
        //    console.log("onDRhandleChange", row);
        //    console.log("onDRhandleChange", e);
        this.setState({ selectedDRID: row.DRID, linkOrCreateDR: 'linkDR' });
        
    }

    public setDRLinkAction(rowData: any) {
        return (
            <>
                <div className={' row col-xs-12'} style={{ marginLeft: '15px' }}>
                    <div className="flex align-items-center">
                        <RadioButton name="DRData"
                            disabled={this.state.SelectedAIMode == 'View' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Published' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed' || this.state.linkOrCreateDR === 'createDR'}
                            value={rowData.DRID} onChange={(e) => this.onDRhandleChange(e, rowData)}
                            checked={(this.state.selectedDRID == rowData.DRID || this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned') || (this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed' && this.state.SelectedGOLDStgData.ProcessedDRID === rowData.DRID?.toString()) || this.state.SelectedGOLDStgData.IntegrationStatus === 'Published'}
                        />
                    </div>
                </div>
            </>
        );
    }
    public setSelectedPlan(rowData: any) {
        return (
            <>
                <div className={' row col-xs-12'} style={{ marginLeft: '15px' }}>
                    <div className="flex align-items-center">
                        <RadioButton name="DRPlan"
                            value={rowData.DRID} onChange={(e) => this.onSelectedPlanHandle(e, rowData)}
                            checked={this.state.SelectedPlanId === rowData.ID}
                            disabled={this.state.SelectedGOLDTabMode === 'View'}
                        />
                    </div>
                </div>
            </>
        );
    }
    public onSelectedPlanHandle = (e, data) => {
        this.setState({ SelectedPlanId: data?.Id })
        if (data?.PlanStatus === 'NEW' || data?.PlanStatus === 'PROCESSING' || data?.PlanStatus === 'MODIFIED' || data?.PlanStatus === 'Transitioned') {
            this.setState({ ShowDRIDMatchPopupWarning: true });
            this.setState({ SelectedPlan: [] });
        } else {
            this.setState({ ShowDRIDMatchPopupWarning: false });
            this.setState({ SelectedPlan: data });
        }
    }
    public async UpdateMappingDRID() {
        this.setState({ isLoading: true })
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        const newItem = {
            MoleculeName: this.state.lovMoleculeKey !== undefined ? `${this.state.lovMoleculeKey} -> ${this.state.SelectedGOLDStgData.Molecule}` : this.state.SelectedGOLDStgData.Molecule,
            GlobalBrandAPI: this.state.lovBrandKey ? `${this.state.lovBrandKey} -> ${this.state.SelectedGOLDStgData.Brand}` : this.state.SelectedGOLDStgData.Brand,
            Indication: this.state.SelectedGOLDStgData.Indication,
        }
        //  console.log("UpdateMappingDRID",this.state.selectedDRID);
        const indicationArray = this.state.SelectedGOLDStgData?.Indication.split(';')?.map(item => item?.trim());
        
        const projectDetails = await DataService.fetchAllItemsGenericFilter(projectDetailsListName, "*", `ID eq '${this.state.selectedDRID.toString()}'`, null)
        await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', this.state.SelectedGOLDStgData.ID, { MappedDRID: this.state.selectedDRID.toString(), MappingConfirmed: true, IntegrationStatus: 'Assigned', ProjectName: projectDetails?.[0]?.ProjectTitle ? projectDetails?.[0]?.ProjectTitle : '' }).then(async res => {
            //  console.log('DRID mapped successfully!');
            this.setState({ showConfirmDialog0: false, showAIAssestPopup: false })
            this.setState({ isLoading: false })
            this.toast.show({ severity: 'success', summary: '', detail: 'DR Mapped successfully!', life: 4000 });
            await this.getGOLDStgListData();
            await this.CheckInIndicationMaster(indicationArray, null);
        });
        const inds = this.state.SelectedGOLDStgData.Indication?.split(';');
        if (projectDetails?.length > 0) {
            const indicationArray = projectDetails[0]?.Indication?.split(';')
            const merged = [...inds, ...indicationArray]
            const uniqueInds = [...new Set(merged)]
            await DataService.updateItemInList(projectDetailsListName, this.state.selectedDRID.toString(), { Indication: uniqueInds?.join(';') });
        } else {
            await DataService.addItemsToList(projectDetailsListName, { ID: this.state.selectedDRID.toString(), ...newItem });
        }
        this.setState({ linkOrCreateDR: null })
    }
   
    public CreateNewDRForNo = async () => {
        this.setState({ isLoading: true })
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        try {
            const grpKey = this.state.SelectedGRP?.split('->')[0]
            const grpVal = this.state.SelectedGRP?.split('->')[1]
            const molKey = this.state.SelectedMoleculeAPI?.split('->')[0]
            const molVal = this.state.SelectedMoleculeAPI?.split('->')[1]
            const labKey = this.state.SelectedLabelname?.split('->')[0]
            const labVal = this.state.SelectedLabelname?.split('->')[1]

            const indicationArray1 = this.state.SelectedGOLDStgData?.Indication?.split(';')
            const uniqueInds = [...new Set(indicationArray1)];
            const splittedInds = uniqueInds?.join(';');
            const newItem = {
                MoleculeName: this.state.SelectedMoleculeAPI,
                ProposedGRP0: this.state.SelectedGRP,
                TradeName: this.state.SelectedLabelname,
                BU: this.state.SelectedBU,
                BusinessUnit: this.state.SelectedSubBU,
                Indication: splittedInds,
                ProjectTitle: this.state.pTitleForDR,
                GlobalBrandAPI: this.state.SelectedGOLDStgData.Brand
            }
            const pdlRes = await DataService.addItemsToList(projectDetailsListName, newItem).then(response => {
                console.log(response)
                this.setState({
                    pdlResponse: response
                })
            })
            console.log(pdlRes)
            this.setState({ confirmCreateDR: false, confirmCreateDR1: false });

            await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', this.state.SelectedGOLDStgData.ID?.toString(), { MappedDRID: this.state.pdlResponse?.data?.ID.toString() ? this.state.pdlResponse?.data?.ID.toString() : this.state.selectedDRID?.toString(), MappingConfirmed: true, IntegrationStatus: 'Published', ProjectName: this.state.pTitleForDR, Brand: this.state.SelectedGOLDStgData.Brand, TradeName: this.state.SelectedGOLDStgData.TradeName, ProposedGRPKey: grpKey, ProposedMoleculeKey: molKey, ProposedLabelKey: labKey, MatchCriteria: 'Exact' }).then(async res => {
                await this.getGOLDStgListData();
            })

            const goldItemsFromList = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", "IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1", null)
            let filteredGoldItems;

            if (this.state.SelectedGOLDStgData.TradeName !== null) {
                const wordsToMatch = this.state.SelectedGOLDStgData.TradeName?.toLowerCase().split(/\s+|,|\//).map(word => word.trim().toLowerCase());

                const exactTradeNames = goldItemsFromList?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item.TradeName === this.state.SelectedGOLDStgData.TradeName && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null && item?.Country !== this.state.SelectedGOLDStgData.Country && item.Id !== this.state.SelectedGOLDStgData.Id?.toString())

                const filteredGoldItemsWT = goldItemsFromList?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null && item.Id !== this.state.SelectedGOLDStgData.Id?.toString());

                const filteredGoldItemsX = filteredGoldItemsWT?.filter(item => {
                    const tradenameWords = item?.TradeName?.split(/\s+|,|\//).map(word => word.trim().toLowerCase());
                    return wordsToMatch.reduce((acc, word) => acc || tradenameWords.includes(word), false);
                })
                filteredGoldItems = [...filteredGoldItemsX, ...exactTradeNames]

                // filteredGoldItems = goldItemsFromList?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item.TradeName?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.TradeName?.toLowerCase() || this.state.SelectedGOLDStgData.TradeName?.toLowerCase()?.includes(item.TradeName?.toLowerCase()) || item.TradeName?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.TradeName?.toLowerCase())) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item.Id !== this.state.SelectedGOLDStgData.Id?.toString() && item?.isDRPGSPlanExist === null)
            } else {
                filteredGoldItems = goldItemsFromList?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && (item.TradeName === this.state.SelectedGOLDStgData.TradeName || this.state.SelectedGOLDStgData.TradeName?.toLowerCase()?.includes(item.TradeName?.toLowerCase()) || item.TradeName?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.TradeName?.toLowerCase())) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item.Id !== this.state.SelectedGOLDStgData.Id?.toString() && item?.isDRPGSPlanExist === null)
            }

            filteredGoldItems?.forEach(async (item, i) => {
                if (item?.MatchCriteria === 'No Match' || item?.MappedDRID === null) {
                    await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item.ID?.toString(), { MappedDRID: this.state.pdlResponse?.data?.ID.toString(), MatchCriteria: 'Exact' }).then(async res => {
                        await this.getGOLDStgListData();
                    })
                } else {
                    await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item.ID?.toString(), { MappedDRID: item?.MappedDRID + ';' + this.state.pdlResponse?.data?.ID.toString(), MatchCriteria: 'Exact' }).then(async res => {
                        await this.getGOLDStgListData();
                    })
                }
            })

            const indicationArray = this.state.SelectedGOLDStgData?.Indication.split(';')?.map(item => item?.trim());
            await this.CheckInIndicationMaster(indicationArray, this.state.pdlResponse?.data?.ID.toString());
            this.setState({ isLoading: false })
            this.toast.show({ severity: 'success', summary: 'Success Message', detail: 'DR Created Successfully.Please manage the record details in DR', life: 5000 });

            const moleculeToDRPData = await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_To_DR_GRP', '*', `isActive eq 1`, null);
            const moleculeToDRP = moleculeToDRPData?.filter(item => item?.Molecule?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
            const moleculeToDRPWithEmpty = moleculeToDRP?.filter(item => !item?.GRPKey || !item?.GRPValue)
            const moleculeToMoleculeData = await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_TO_DR_MoleculeAPI', '*', `isActive eq 1`, null);
            const moleculeToMolecule = moleculeToMoleculeData?.filter(item => item?.GOLDMolecule?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
            const moleculeToMoleculeWithEmpty = moleculeToMolecule?.filter(item => !item?.DR_MoleculeAPI || !item?.MoleculeKey)
            const moleculeToLabelData = await DataService.fetchAllItemsGenericFilter('GOLD-TradeName_To_DR_Label', '*', `isActive eq 1`, null);
            const moleculeToLabel = moleculeToLabelData?.filter(item => item?.TradeName?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
            const moleculeToLabelWithEmpty = moleculeToLabel?.filter(item => !item?.DRLabelText || !item?.DRLabelKey)

            const goldItemsX = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", `Molecule eq '${this.state.SelectedGOLDStgData?.Molecule}' and TradeName eq '${this.state.SelectedGOLDStgData?.TradeName}' and IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1`, null)

            const goldItems = goldItemsX?.filter(item => item.IntegrationStatus !== 'Assigned' || item.IntegrationStatus !== 'Published')

            if (goldItems?.length > 0) {
                if (moleculeToDRP?.length === 0) {
                    await DataService.addItemsToList('GOLD-Molecule_To_DR_GRP', { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                } else {
                    await DataService.updateItemInList('GOLD-Molecule_To_DR_GRP', moleculeToDRP?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                }
                if (moleculeToDRPWithEmpty?.length > 0) {
                    await DataService.updateItemInList('GOLD-Molecule_To_DR_GRP', moleculeToDRP?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                }

                if (moleculeToMolecule?.length === 0) {
                    await DataService.addItemsToList('GOLD-Molecule_TO_DR_MoleculeAPI', { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, GOLDMolecule: this.state.SelectedGOLDStgData.Molecule, MoleculeKey: molKey, DR_MoleculeAPI: molVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                } else {
                    await DataService.updateItemInList('GOLD-Molecule_TO_DR_MoleculeAPI', moleculeToDRP?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, GOLDMolecule: this.state.SelectedGOLDStgData.Molecule, MoleculeKey: molKey, DR_MoleculeAPI: molVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                }
                if (moleculeToMoleculeWithEmpty?.length > 0) {
                    await DataService.updateItemInList('GOLD-Molecule_TO_DR_MoleculeAPI', moleculeToMoleculeWithEmpty?.[0]?.ID, { MoleculeKey: molKey, DR_MoleculeAPI: molVal, isConfirmed: true })
                }
                if (moleculeToLabel?.length === 0) {
                    await DataService.addItemsToList('GOLD-TradeName_To_DR_Label', { TradeName: this.state.SelectedGOLDStgData.Molecule, DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
                } else {
                    await DataService.updateItemInList('GOLD-TradeName_To_DR_Label', moleculeToDRP?.[0]?.ID, { TradeName: this.state.SelectedGOLDStgData.Molecule, DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
                }
                if (moleculeToLabelWithEmpty?.length > 0) {
                    await DataService.updateItemInList('GOLD-TradeName_To_DR_Label', moleculeToLabelWithEmpty?.[0]?.ID, { DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
                }
            }

            const globalIDs = [];
            const grpKeyForPresent = this.state.SelectedGRP?.split('->')[0];
            const globalIDListData = await DataService.fetchAllItemsGenericFilter("GRPGlobalIDInterface", "*", `ProposedGRP eq '${grpKeyForPresent}' and IsActive eq 1`, null);
            globalIDListData?.map(item => globalIDs?.push(item?.GlobalID))
    
            const presentationIntListDataNoFilter = await DataService.fetchAllItemsGenericFilter("Presentation_Interface", "*", `ProposedGRP eq '${this.state.SelectedGRP}'`, null);
            const presentationIntListDataWithFilter = presentationIntListDataNoFilter?.filter(item => globalIDs?.indexOf(item?.GlobalID) !== -1 && (item.LifecycleClass != null || item.LifecycleClass != "SKU EXIT IN-PROGRESS" || item.LifecycleClass != "FULLY EXITED"))

            const productListData = await DataService.fetchAllItemsGenericFilter("Product_Interface", "*", ``, null);
            const filteredProductListData = productListData?.filter(item => item?.ProposedGRP?.split('->')[0] === grpKeyForPresent);

            let PresentationListName = "";
            let ProductListName = "";
            
            if (DataService.environment === "DEV") {
                PresentationListName = "PresentationList";
                ProductListName = "ProductList";
                presentationIntListDataWithFilter?.forEach(async item => {
                    console.log(presentationIntListDataWithFilter, 'presentationIntListDataWithFilter')
                    await DataService.addItemsToList(PresentationListName, { ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitle_x003a_IDId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDescription: item?.MaterialDescription, ProductConfiguration: item?.ProductConfiguration, DosageCategory: item?.DosageCategory, DosageForm: item?.DosageForm, PackCount: item?.PackCount, PackType1: item?.PackType1, PackTypeVariant: item?.PackTypeVariant, RecordType: 'Master Data', PackSizes: item?.PackSizes, PackShipper: item?.PackShipper, MOQ: item?.MOQ, IntegrationFlag: item?.IntegrationFlag, ParentID: 1, GCRSLocation: item?.GCRSLocation, FlagForArtwork: item?.FlagForArtwork, SEWorkflowStatus: item?.SEWorkflowStatus, GCRSWorkflowStatus: item?.GCRSWorkflowStatus, FillQuantity: item?.FillQuantity, FillQuantityUOM: item?.FillQuantityUOM, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, LifecycleClass: item?.LifecycleClass, GlobalID: item?.GlobalID })
                });
                filteredProductListData?.forEach(async item => {
                    await DataService.addItemsToList(ProductListName, { ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitle_x003a_IDId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDesc: item?.MaterialDesc, LotSize: item?.LotSize, Strength: item?.Strength, FillQuantity: item?.FillQuantity, ConcentrationValue: item?.ConcentrationValue, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, FillVolume: item?.FillVolume, Potency: item?.Potency, UsageFactor: item?.UsageFactor, DoseSplit: item?.DoseSplit, PackoutConfiguration: item?.PackoutConfiguration, Yield: item?.Yield, MinOrderQuantity: item?.MinOrderQuantity, ShelfLife: item?.ShelfLife, Comments: item?.Comments, StrengthUOM: item?.StrengthUOM, FillVolUOM: item?.FillVolUOM, PotencyUOM: item?.PotencyUOM,  LotSizeUOM: item?.LotSizeUOM, MaterialCategory: item?.MaterialCategory, FillQuantityUOM: item?.FillQuantityUOM, ConcentrationUOM: item?.ConcentrationUOM, BatchClass: item?.BatchClass, Component: item?.Component, CombinationPackType: item?.CombinationPackType, ConversionFactorX: item?.ConversionFactorX, ConversionFactorY: item?.ConversionFactorY, BaseUOM: item?.BaseUOM, AlternateUOM: item?.AlternateUOM, LifecycleClass: item?.LifecycleClass, IntegrationFlag: item?.IntegrationFlag })
                })
            }
            else if (DataService.environment === "QA" || DataService.environment === "PROD") {
                console.log(presentationIntListDataWithFilter, 'presentationIntListDataWithFilter')
                PresentationListName = "PresentationList_Prod";
                ProductListName = "ProductList_Prod";
                presentationIntListDataWithFilter?.forEach(async item => {
                    await DataService.addItemsToList(PresentationListName, { ProjectTitle_x003a_ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitleId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDescription: item?.MaterialDescription, ProductConfiguration: item?.ProductConfiguration, DosageCategory: item?.DosageCategory, DosageForm: item?.DosageForm, PackCount: item?.PackCount, PackType1: item?.PackType1, PackTypeVariant: item?.PackTypeVariant, RecordType: 'Master Data', PackSizes: item?.PackSizes, PackShipper: item?.PackShipper, MOQ: item?.MOQ, IntegrationFlag: item?.IntegrationFlag, ParentID: 1, GCRSLocation: item?.GCRSLocation, FlagForArtwork: item?.FlagForArtwork, SEWorkflowStatus: item?.SEWorkflowStatus, GCRSWorkflowStatus: item?.GCRSWorkflowStatus, FillQuantity: item?.FillQuantity, FillQuantityUOM: item?.FillQuantityUOM, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, LifecycleClass: item?.LifecycleClass, GlobalID: item?.GlobalID }).then(res => console.log('Success!')).catch(e => console.log('Error fetching', e))
                })
                filteredProductListData?.forEach(async item => {
                    await DataService.addItemsToList(ProductListName, { ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitle_x003a_IDId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDesc: item?.MaterialDesc, LotSize: item?.LotSize, Strength: item?.Strength, FillQuantity: item?.FillQuantity, ConcentrationValue: item?.ConcentrationValue, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, FillVolume: item?.FillVolume, Potency: item?.Potency, UsageFactor: item?.UsageFactor, DoseSplit: item?.DoseSplit, PackoutConfiguration: item?.PackoutConfiguration, Yield: item?.Yield, MinOrderQuantity: item?.MinOrderQuantity, ShelfLife: item?.ShelfLife, Comments: item?.Comments, StrengthUOM: item?.StrengthUOM, FillVolUOM: item?.FillVolUOM, PotencyUOM: item?.PotencyUOM,  LotSizeUOM: item?.LotSizeUOM, MaterialCategory: item?.MaterialCategory, FillQuantityUOM: item?.FillQuantityUOM, ConcentrationUOM: item?.ConcentrationUOM, BatchClass: item?.BatchClass, Component: item?.Component, CombinationPackType: item?.CombinationPackType, ConversionFactorX: item?.ConversionFactorX, ConversionFactorY: item?.ConversionFactorY, BaseUOM: item?.BaseUOM, AlternateUOM: item?.AlternateUOM, LifecycleClass: item?.LifecycleClass, IntegrationFlag: item?.IntegrationFlag })
                })
            }

            this.setState({
                showAIAssestPopup: false
            });

        } catch (e) {
            console.log(e)
            this.toast.show({ severity: 'error', summary: 'Error Message', detail: "There's some problem!", life: 4000 });
            this.setState({ confirmCreateDR: false, isLoading: false })
        }
    }
    public CreateNewDR = async () => {
        this.setState({ isLoading: true })
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        try {
            const grpKey = this.state.SelectedGRP?.split('->')[0]
            const grpVal = this.state.SelectedGRP?.split('->')[1]
            const molKey = this.state.SelectedMoleculeAPI?.split('->')[0]
            const molVal = this.state.SelectedMoleculeAPI?.split('->')[1]
            const labKey = this.state.SelectedLabelname?.split('->')[0]
            const labVal = this.state.SelectedLabelname?.split('->')[1]

            const goldItemsFromList = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", "IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1", null)
            let filteredGoldItems;
            let allIndicationsForPList = [];

            if (this.state.SelectedGOLDStgData.TradeName !== null) {
                const wordsToMatch = this.state.SelectedGOLDStgData.TradeName?.toLowerCase().split(/\s+|,|\//).map(word => word.trim().toLowerCase());

                const exactTradeNames = goldItemsFromList?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item.TradeName === this.state.SelectedGOLDStgData.TradeName && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null && item?.Country !== this.state.SelectedGOLDStgData.Country)

                const filteredGoldItemsWT = goldItemsFromList?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null);

                const filteredGoldItemsX = filteredGoldItemsWT?.filter(item => {
                    const tradenameWords = item?.TradeName?.split(/\s+|,|\//).map(word => word.trim().toLowerCase());
                    return wordsToMatch.reduce((acc, word) => acc || tradenameWords.includes(word), false);
                })
                filteredGoldItems = [...filteredGoldItemsX, ...exactTradeNames]
            } else {
                filteredGoldItems = goldItemsFromList?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && (item.TradeName === this.state.SelectedGOLDStgData.TradeName || this.state.SelectedGOLDStgData.TradeName?.toLowerCase()?.includes(item.TradeName?.toLowerCase())) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null)
            }

            filteredGoldItems?.map(item => {
                item?.Indication?.split(';')?.map(ind => {
                    allIndicationsForPList?.push(ind?.trim())
                })
            })
            const uniqqIndsForPList = this.removeDup(allIndicationsForPList);
            
            const splittedInds = uniqqIndsForPList?.join(';');
            const newItem = {
                MoleculeName: this.state.SelectedMoleculeAPI,
                ProposedGRP0: this.state.SelectedGRP,
                TradeName: this.state.SelectedLabelname,
                BU: this.state.SelectedBU,
                BusinessUnit: this.state.SelectedSubBU,
                Indication: splittedInds,
                ProjectTitle: this.state.pTitleForDR,
                GlobalBrandAPI: this.state.SelectedGOLDStgData.Brand
            }
            this.checkAllIndicationExists(uniqqIndsForPList).then(async res => {
                if(res) {
                    const pdlRes = await DataService.addItemsToList(projectDetailsListName, newItem).then(response => {
                        console.log(response)
                        this.setState({
                            pdlResponse: response
                        })
                    })
                    console.log(pdlRes)
                    this.setState({ confirmCreateDR: false });
                    
                    const allInds = [];
        
                    filteredGoldItems?.forEach(async (item, i) => {
                        item?.Indication?.split(';')?.map(ind => {
                            allInds?.push(ind?.trim())
                        })
                        await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item.ID?.toString(), { MappedDRID: this.state.pdlResponse?.data?.ID.toString(), MappingConfirmed: true, IntegrationStatus: 'Published', ProjectName: this.state.pTitleForDR, Brand: this.state.SelectedGOLDStgData.Brand, TradeName: this.state.SelectedGOLDStgData.TradeName, ProposedGRPKey: grpKey, ProposedMoleculeKey: molKey, ProposedLabelKey: labKey, MatchCriteria: 'Exact' }).then(async res => {
                            await this.getGOLDStgListData();
                        })
                    })
                    const uniqqInds = this.removeDup(allInds);
        
                    const indicationArray = uniqqInds?.map(item => item?.trim());
                    await this.CheckInIndicationMaster(indicationArray, this.state.pdlResponse?.data?.ID.toString());
                    this.setState({ isLoading: false })
                    this.toast.show({ severity: 'success', summary: 'Success Message', detail: 'DR Created Successfully.Please manage the record details in DR', life: 5000 });
        
                    const moleculeToDRPData = await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_To_DR_GRP', '*', `isActive eq 1`, null);
                    const moleculeToDRP = moleculeToDRPData?.filter(item => item?.Molecule?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
                    const moleculeToDRPWithEmpty = moleculeToDRP?.filter(item => !item?.GRPKey || !item?.GRPValue)
                    const moleculeToMoleculeData = await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_TO_DR_MoleculeAPI', '*', `isActive eq 1`, null);
                    const moleculeToMolecule = moleculeToMoleculeData?.filter(item => item?.GOLDMolecule?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
                    const moleculeToMoleculeWithEmpty = moleculeToMolecule?.filter(item => !item?.DR_MoleculeAPI || !item?.MoleculeKey)
                    const moleculeToLabelData = await DataService.fetchAllItemsGenericFilter('GOLD-TradeName_To_DR_Label', '*', `isActive eq 1`, null);
                    const moleculeToLabel = moleculeToLabelData?.filter(item => item?.TradeName?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
                    const moleculeToLabelWithEmpty = moleculeToLabel?.filter(item => !item?.DRLabelText || !item?.DRLabelKey)
        
                    const goldItemsX = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", `Molecule eq '${this.state.SelectedGOLDStgData?.Molecule}' and TradeName eq '${this.state.SelectedGOLDStgData?.TradeName}' and IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1`, null)
        
                    const goldItems = goldItemsX?.filter(item => item.IntegrationStatus !== 'Assigned' || item.IntegrationStatus !== 'Published')
        
                    if (goldItems?.length > 0) {
                        if (moleculeToDRP?.length === 0) {
                            await DataService.addItemsToList('GOLD-Molecule_To_DR_GRP', { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                        } else {
                            await DataService.updateItemInList('GOLD-Molecule_To_DR_GRP', moleculeToDRP?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                        }
                        if (moleculeToDRPWithEmpty?.length > 0) {
                            await DataService.updateItemInList('GOLD-Molecule_To_DR_GRP', moleculeToDRP?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                        }
        
                        if (moleculeToMolecule?.length === 0) {
                            await DataService.addItemsToList('GOLD-Molecule_TO_DR_MoleculeAPI', { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, GOLDMolecule: this.state.SelectedGOLDStgData.Molecule, MoleculeKey: molKey, DR_MoleculeAPI: molVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                        } else {
                            await DataService.updateItemInList('GOLD-Molecule_TO_DR_MoleculeAPI', moleculeToDRP?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, GOLDMolecule: this.state.SelectedGOLDStgData.Molecule, MoleculeKey: molKey, DR_MoleculeAPI: molVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
                        }
                        if (moleculeToMoleculeWithEmpty?.length > 0) {
                            await DataService.updateItemInList('GOLD-Molecule_TO_DR_MoleculeAPI', moleculeToMoleculeWithEmpty?.[0]?.ID, { MoleculeKey: molKey, DR_MoleculeAPI: molVal, isConfirmed: true })
                        }
                        if (moleculeToLabel?.length === 0) {
                            await DataService.addItemsToList('GOLD-TradeName_To_DR_Label', { TradeName: this.state.SelectedGOLDStgData.Molecule, DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
                        } else {
                            await DataService.updateItemInList('GOLD-TradeName_To_DR_Label', moleculeToDRP?.[0]?.ID, { TradeName: this.state.SelectedGOLDStgData.Molecule, DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
                        }
                        if (moleculeToLabelWithEmpty?.length > 0) {
                            await DataService.updateItemInList('GOLD-TradeName_To_DR_Label', moleculeToLabelWithEmpty?.[0]?.ID, { DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
                        }
                    }
        
                    const globalIDs = [];
                    const grpKeyForPresent = this.state.SelectedGRP?.split('->')[0];
                    const globalIDListData = await DataService.fetchAllItemsGenericFilter("GRPGlobalIDInterface", "*", `ProposedGRP eq '${grpKeyForPresent}' and IsActive eq 1`, null);
                    globalIDListData?.map(item => globalIDs?.push(item?.GlobalID))
            
                    const presentationIntListDataNoFilter = await DataService.fetchAllItemsGenericFilter("Presentation_Interface", "*", `ProposedGRP eq '${this.state.SelectedGRP}'`, null);
                    const presentationIntListDataWithFilter = presentationIntListDataNoFilter?.filter(item => globalIDs?.indexOf(item?.GlobalID) !== -1 && (item.LifecycleClass != null || item.LifecycleClass != "SKU EXIT IN-PROGRESS" || item.LifecycleClass != "FULLY EXITED"))
        
                    const productListData = await DataService.fetchAllItemsGenericFilter("Product_Interface", "*", ``, null);
                    const filteredProductListData = productListData?.filter(item => item?.ProposedGRP?.split('->')[0] === grpKeyForPresent);
        
                    let PresentationListName = "";
                    let ProductListName = "";
                    
                    if (DataService.environment === "DEV") {
                        PresentationListName = "PresentationList";
                        presentationIntListDataWithFilter?.forEach(async item => {
                            // await DataService.addItemsToList('PresentationList', { MaterialNumber: item?.MaterialNumber })
                            await DataService.addItemsToList(PresentationListName, { ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitle_x003a_IDId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDescription: item?.MaterialDescription, ProductConfiguration: item?.ProductConfiguration, DosageCategory: item?.DosageCategory, DosageForm: item?.DosageForm, PackCount: item?.PackCount, PackType1: item?.PackType1, PackTypeVariant: item?.PackTypeVariant, RecordType: 'Master Data', PackSizes: item?.PackSizes, PackShipper: item?.PackShipper, MOQ: item?.MOQ, IntegrationFlag: item?.IntegrationFlag, ParentID: 1, GCRSLocation: item?.GCRSLocation, FlagForArtwork: item?.FlagForArtwork, SEWorkflowStatus: item?.SEWorkflowStatus, GCRSWorkflowStatus: item?.GCRSWorkflowStatus, FillQuantity: item?.FillQuantity, FillQuantityUOM: item?.FillQuantityUOM, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, LifecycleClass: item?.LifecycleClass, GlobalID: item?.GlobalID })
                        })
        
                        filteredProductListData?.forEach(async item => {
                            await DataService.addItemsToList(ProductListName, { ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitle_x003a_IDId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDesc: item?.MaterialDesc, LotSize: item?.LotSize, Strength: item?.Strength, FillQuantity: item?.FillQuantity, ConcentrationValue: item?.ConcentrationValue, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, FillVolume: item?.FillVolume, Potency: item?.Potency, UsageFactor: item?.UsageFactor, DoseSplit: item?.DoseSplit, PackoutConfiguration: item?.PackoutConfiguration, Yield: item?.Yield, MinOrderQuantity: item?.MinOrderQuantity, ShelfLife: item?.ShelfLife, Comments: item?.Comments, StrengthUOM: item?.StrengthUOM, FillVolUOM: item?.FillVolUOM, PotencyUOM: item?.PotencyUOM,  LotSizeUOM: item?.LotSizeUOM, MaterialCategory: item?.MaterialCategory, FillQuantityUOM: item?.FillQuantityUOM, ConcentrationUOM: item?.ConcentrationUOM, BatchClass: item?.BatchClass, Component: item?.Component, CombinationPackType: item?.CombinationPackType, ConversionFactorX: item?.ConversionFactorX, ConversionFactorY: item?.ConversionFactorY, BaseUOM: item?.BaseUOM, AlternateUOM: item?.AlternateUOM, LifecycleClass: item?.LifecycleClass, IntegrationFlag: item?.IntegrationFlag })
                        })
                    }
                    else if (DataService.environment === "QA" || DataService.environment === "PROD") {
                        PresentationListName = "PresentationList_Prod";
                        presentationIntListDataWithFilter?.forEach(async item => {
                            // await DataService.addItemsToList('PresentationList', { MaterialNumber: item?.MaterialNumber })
                            await DataService.addItemsToList(PresentationListName, { ProjectTitle_x003a_ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitleId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDescription: item?.MaterialDescription, ProductConfiguration: item?.ProductConfiguration, DosageCategory: item?.DosageCategory, DosageForm: item?.DosageForm, PackCount: item?.PackCount, PackType1: item?.PackType1, PackTypeVariant: item?.PackTypeVariant, RecordType: 'Master Data', PackSizes: item?.PackSizes, PackShipper: item?.PackShipper, MOQ: item?.MOQ, IntegrationFlag: item?.IntegrationFlag, ParentID: 1, GCRSLocation: item?.GCRSLocation, FlagForArtwork: item?.FlagForArtwork, SEWorkflowStatus: item?.SEWorkflowStatus, GCRSWorkflowStatus: item?.GCRSWorkflowStatus, FillQuantity: item?.FillQuantity, FillQuantityUOM: item?.FillQuantityUOM, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, LifecycleClass: item?.LifecycleClass, GlobalID: item?.GlobalID }).then(res => console.log('Success!')).catch(e => console.log('Error fetching', e))
                        })
        
                        filteredProductListData?.forEach(async item => {
                            await DataService.addItemsToList(ProductListName, { ProjectTitleId: this.state.pdlResponse?.data?.ID, ProjectTitle_x003a_IDId: this.state.pdlResponse?.data?.ID, MaterialNumber: item?.MaterialNumber, MaterialDesc: item?.MaterialDesc, LotSize: item?.LotSize, Strength: item?.Strength, FillQuantity: item?.FillQuantity, ConcentrationValue: item?.ConcentrationValue, InnerNoOfContainers: item?.InnerNoOfContainers, OuterNoOfContainers: item?.OuterNoOfContainers, FillVolume: item?.FillVolume, Potency: item?.Potency, UsageFactor: item?.UsageFactor, DoseSplit: item?.DoseSplit, PackoutConfiguration: item?.PackoutConfiguration, Yield: item?.Yield, MinOrderQuantity: item?.MinOrderQuantity, ShelfLife: item?.ShelfLife, Comments: item?.Comments, StrengthUOM: item?.StrengthUOM, FillVolUOM: item?.FillVolUOM, PotencyUOM: item?.PotencyUOM,  LotSizeUOM: item?.LotSizeUOM, MaterialCategory: item?.MaterialCategory, FillQuantityUOM: item?.FillQuantityUOM, ConcentrationUOM: item?.ConcentrationUOM, BatchClass: item?.BatchClass, Component: item?.Component, CombinationPackType: item?.CombinationPackType, ConversionFactorX: item?.ConversionFactorX, ConversionFactorY: item?.ConversionFactorY, BaseUOM: item?.BaseUOM, AlternateUOM: item?.AlternateUOM, LifecycleClass: item?.LifecycleClass, IntegrationFlag: item?.IntegrationFlag })
                        })
                    }
                    this.setState({
                        showAIAssestPopup: false
                    });
                } else {
                    this.setState({ isLoading: false })
                }
            })

        } catch (e) {
            console.log(e)
            this.toast.show({ severity: 'error', summary: 'Error Message', detail: "There's some problem!", life: 4000 });
            this.setState({ confirmCreateDR: false, isLoading: false })
        }
    }
    public onConfirm = async () => {
        this.setState({ isLoading: true })
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        try {
            const newItem = {
                MoleculeName: this.state.lovMoleculeKey !== undefined ? `${this.state.lovMoleculeKey} -> ${this.state.SelectedGOLDStgData.Molecule}` : this.state.SelectedGOLDStgData.Molecule,
                GlobalBrandAPI: this.state.lovBrandKey ? `${this.state.lovBrandKey} -> ${this.state.SelectedGOLDStgData.Brand}` : this.state.SelectedGOLDStgData.Brand,
                Indication: this.state.SelectedGOLDStgData.Indication,
            }
            let allIndicationsForPList = [];

            const wordsToMatch = this.state.SelectedGOLDStgData.TradeName?.toLowerCase().split(/\s+|,|\//).map(word => word.trim().toLowerCase());

            const goldItems = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", "IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1", null)
            const filteredGoldItemsWT = goldItems.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null);

            const exactTradeNames = goldItems?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item.TradeName === this.state.SelectedGOLDStgData.TradeName && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null && item?.Country !== this.state.SelectedGOLDStgData.Country)

            const filteredGoldItemsX = filteredGoldItemsWT?.filter(item => {
                const tradenameWords = item?.TradeName?.split(/\s+|,|\//).map(word => word.trim().toLowerCase());
                return wordsToMatch.reduce((acc, word) => acc || tradenameWords.includes(word), false);
            })

            const filteredGoldItems = [...filteredGoldItemsX, ...exactTradeNames]
            
            const similarDRIDPlansInDLPP = await DataService.fetchAllDRListItemsWithFilters('DLPPList', `ID,DRID,Country,LaunchProgress,Template`, `DRID eq '${this.state?.selectedDRID}'`, '', null)
            const filtered = similarDRIDPlansInDLPP?.filter(item => (this.state.GOLDConfigData?.indexOf(item?.Template) !== -1 && (item.LaunchProgress !== "Cancelled")));
            const cCodes = filtered?.map(item => item?.Country?.split('->')[0]);
            const uniquecCodes = this.removeDup(cCodes);
            const result = filteredGoldItems?.filter(item => uniquecCodes?.indexOf(item?.ProposedCountryCode) === -1);

            result?.map(item => {
                item?.Indication?.split(';')?.map(ind => {
                    allIndicationsForPList?.push(ind?.trim())
                })
            })

            const inds = this.removeDup(allIndicationsForPList);

            const projectDetails = await DataService.fetchAllItemsGenericFilter(projectDetailsListName, "*", `ID eq '${this.state.selectedDRID.toString()}'`, null)
            // const inds = this.state.SelectedGOLDStgData.Indication?.split(';');

            this.checkAllIndicationExists(inds).then(async res => {
                if(res) {
                    if (projectDetails?.length > 0) {
                        let merged;
                        if (projectDetails[0]?.Indication) {
                            const indicationArray = projectDetails[0]?.Indication?.split(';')
                            merged = [...inds, ...indicationArray]
                        } else {
                            merged = [...inds]
                        }
                        const uniqueInds = [...new Set(merged)]
                        await DataService.updateItemInList(projectDetailsListName, this.state.selectedDRID.toString(), { Indication: uniqueInds?.join(';') });
                    } else {
                        await DataService.addItemsToList(projectDetailsListName, { ID: this.state.selectedDRID.toString(), ...newItem });
                    }
         
                    const allInds = [];
        
                    result?.forEach(async (item, i) => {
                        item?.Indication?.split(';')?.map(ind => {
                            allInds?.push(ind?.trim())
                        })
                        // console.log(item.ID)
                        await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item.ID, { MappedDRID: this.state.selectedDRID.toString(), MappingConfirmed: true, IntegrationStatus: 'Assigned', ProjectName: projectDetails?.[0]?.ProjectTitle ? projectDetails?.[0]?.ProjectTitle : '' }).then(async res => {
                            await this.getGOLDStgListData();
                        })
                    })
                    const uniqqInds = this.removeDup(allInds);
                    // const projectDetails = await DataService.fetchAllItemsGenericFilter("ProjectDetailsList", "*", "", null)
                    const indicationArray = uniqqInds?.map(item => item?.trim());
                    this.setState({ isLoading: false })
                    this.toast.show({ severity: 'success', summary: '', detail: `DR Mapped successfully to all countries with same attributes(${this.state.SelectedGOLDStgData.Country}, ${this.state.similarCountries?.join(', ')}) !`, life: 8000 });
                    await this.CheckInIndicationMaster(indicationArray, null);
                    this.setState({ showConfirmDialog: false, showAIAssestPopup: false, linkOrCreateDR: null })
                } else {
                    this.setState({ isLoading: false })
                }
            })
        } catch (e) {
            console.log(e)
            this.setState({ isLoading: false })
        }
    }
    public onConfirmNo = async () => {
        this.setState({ isLoading: true })
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        try {
            const newItem = {
                MoleculeName: this.state.lovMoleculeKey !== undefined ? `${this.state.lovMoleculeKey} -> ${this.state.SelectedGOLDStgData.Molecule}` : this.state.SelectedGOLDStgData.Molecule,
                GlobalBrandAPI: this.state.lovBrandKey ? `${this.state.lovBrandKey} -> ${this.state.SelectedGOLDStgData.Brand}` : this.state.SelectedGOLDStgData.Brand,
                Indication: this.state.SelectedGOLDStgData.Indication,
            }
            const projectDetails = await DataService.fetchAllItemsGenericFilter(projectDetailsListName, "*", `ID eq '${this.state.selectedDRID.toString()}'`, null)
            const inds = this.state.SelectedGOLDStgData.Indication?.split(';');
            if (projectDetails?.length > 0) {
                let merged;
                if (projectDetails[0]?.Indication) {
                    const indicationArray = projectDetails[0]?.Indication?.split(';')
                    merged = [...inds, ...indicationArray]
                } else {
                    merged = [...inds]
                }
                const uniqueInds = [...new Set(merged)]
                // console.log(indicationArray, merged, uniqueInds)
                await DataService.updateItemInList(projectDetailsListName, this.state.selectedDRID.toString(), { Indication: uniqueInds?.join(';') });
            } else {
                await DataService.addItemsToList(projectDetailsListName, { ID: this.state.selectedDRID.toString(), ...newItem });
            }
            const goldItems = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", "IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1", null)
            const filteredGoldItem = goldItems.filter((item, i) => item.MappedDRID?.includes(this.state.selectedDRID) && item?.Country == this.state.SelectedGOLDStgData.Country && this.state.SelectedGOLDStgData.Indication === item.Indication)

            await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', filteredGoldItem[0]?.ID, { MappedDRID: this.state.selectedDRID.toString(), MappingConfirmed: true, IntegrationStatus: 'Assigned', ProjectName: projectDetails?.[0]?.ProjectTitle ? projectDetails?.[0]?.ProjectTitle : '' }).then(async res => {
                await this.getGOLDStgListData();
            })
            const indicationArray = this.state.SelectedGOLDStgData?.Indication.split(';')?.map(item => item?.trim());
            this.setState({ isLoading: false })
            this.toast.show({ severity: 'success', summary: '', detail: 'DR Mapped successfully!', life: 4000 });
            await this.CheckInIndicationMaster(indicationArray, null);
            this.setState({ showConfirmDialog: false, showAIAssestPopup: false, linkOrCreateDR: null })
        } catch (e) {
            this.setState({ isLoading: false })
            console.log(e)
        }
    }
    public checkAllIndicationExists = async (IndicationArray) => {
        let notFound = false;
        let indArray = [];
        const allIndications = await DataService.fetchAllItemsGenericFilter('Indication', 'field_2', ``, null);

        IndicationArray?.forEach(ind => {
            const found = allIndications?.find(item => item.field_2?.toLowerCase() === ind?.toLowerCase()?.trim());
            if (!found) {
                notFound = true;
                indArray?.push(ind)
            }
        })

        if (notFound) {
            this.setState({ indicationErrorPop: true, indicationErrorPopValues: indArray?.join(', ') })
            return false
        } else {
            this.setState({ indicationErrorPop: false })
            return true
        }
    }

    public updateIDPrimary = async () => {
        if (this.state.SelectedRadioOption === "GTEL") {
            const ids = this.state.planExistPopData?.map(item => item?.ID)
            ids?.forEach(async id => {
                await DataService.updateItemInList('DLPPList', id, { Commercial_ID_Primary: this.state.SelectedGOLDStgData?.GOLD_IDPrimary })
            });
            await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', this.state.SelectedGOLDStgData?.Id, { IntegrationStatus: "Processed", ProcessedDRID: this.state.selectedDRID?.toString(), MappingConfirmed: true });

        } else {
            // Do nothing
        }
        this.setState({ planExistPop: false, showAIAssestPopup: false });
        this.getGOLDStgListData();
    }

    public beforeConfirmPop = async () => {
        this.checkAllIndicationExists(this.state.SelectedGOLDStgData.Indication?.split(';')).then(async res => {
            if (res) {
                const wordsToMatch = this.state.SelectedGOLDStgData.TradeName?.toLowerCase().split(/\s+|,|\//).map(word => word.trim().toLowerCase());

                const similarDRIDsWT = this.state.GOLDStgListData?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null);

                const exactTradeNames = this.state.GOLDStgListData?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item.TradeName === this.state.SelectedGOLDStgData.TradeName && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.isDRPGSPlanExist === null && item?.Country !== this.state.SelectedGOLDStgData.Country)

                const similarDRIDsX = similarDRIDsWT?.filter(item => {
                    const tradenameWords = item?.TradeName?.split(/\s+|,|\//).map(word => word.trim().toLowerCase());
                    return wordsToMatch.reduce((acc, word) => acc || tradenameWords.includes(word), false);
                })

                const similarDRIDs = [...similarDRIDsX, ...exactTradeNames]

                // const codeFromGold = this.state.GOLDStgListData?.filter((item) => item?.Country === this.state.SelectedGOLDStgData?.Country)?.[0]?.ProposedCountryCode;
                const similarDRIDPlansInDLPP = await DataService.fetchAllDRListItemsWithFilters('DLPPList', `ID,DRID,Country,LaunchProgress,Template`, `DRID eq '${this.state?.selectedDRID}'`, '', null)
                const filtered = similarDRIDPlansInDLPP?.filter(item => (this.state.GOLDConfigData?.indexOf(item?.Template) !== -1 && (item.LaunchProgress !== "Cancelled")));
                const similarDRIDandCountryPlansInDLPP =
                    filtered?.filter((item) => (this.state.SelectedGOLDStgData?.ProposedCountryCode == (item?.Country?.indexOf('->') !== -1 ? item?.Country?.split('->')[0]?.trim() : '')));
                if (similarDRIDandCountryPlansInDLPP?.length > 0) {
                    this.setState({ planExistPop: true, planExistPopData: similarDRIDandCountryPlansInDLPP });
                } else {
                    const cCodes = filtered?.map(item => item?.Country?.split('->')[0]);
                    const uniquecCodes = this.removeDup(cCodes);
                    const result = similarDRIDs?.filter(item => uniquecCodes?.indexOf(item?.ProposedCountryCode) === -1);

                    if (result?.length > 1) {
                        let countries = [];
                        result?.map((item, i) => {
                            countries?.push(item?.Country)
                        })
                        const isDuplicated = countries?.filter(country => country === this.state.SelectedGOLDStgData.Country)?.length > 1;
                        const removedCountry = countries?.filter(country => country !== this.state.SelectedGOLDStgData.Country);
                        const removedCountryUnique = [...new Set(removedCountry)];
                        const actualCountries = [...new Set(countries)];
                        this.setState({
                            similarCountries: isDuplicated ? actualCountries : removedCountryUnique,
                            showConfirmDialog: true
                        })
                    } else {
                        this.setState({
                            showConfirmDialog0: true
                        })
                    }
                }
            }
        })
    }
    public onConfirmForProposedDRID = async () => {
        const grpKey = this.state.SelectedGRPForNewID?.split('->')[0]
        const grpVal = this.state.SelectedGRPForNewID?.split('->')[1]
        const molKey = this.state.SelectedMoleculeForNewIDOps?.split('->')[0]
        const molVal = this.state.SelectedMoleculeForNewIDOps?.split('->')[1]
        const labKey = this.state.SelectedLabelForNewIDOps?.split('->')[0]
        const labVal = this.state.SelectedLabelForNewIDOps?.split('->')[1]

        let projectDetailsListName = "";
        let goldItems;
        let drData;
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        this.setState({ isLoading: true })
        const ProjectDetailsData0 = await DataService.fetchAllItemsGenericFilter(projectDetailsListName, '*', `IsActive eq 1`, null);

        const ProjectDetailsData = ProjectDetailsData0?.filter(item => item?.ProposedGRP?.split('->')[0] === grpKey && item?.MoleculeName?.split('->')[0] === molKey && item?.TradeName?.split('->')[0] === labKey)
        // console.log(ProjectDetailsDataFiltered)

        if (ProjectDetailsData?.length > 0) {
            const DRIDs = [];
            drData = ProjectDetailsData?.map(res => ({
                DRID: res?.ID,
                ProjectTitle: res?.ProjectTitl ? res?.ProjectTitl : this.state.pTitleForDR,
                MoleculeName: res?.MoleculeName,
                PlaniswareID: res?.PlaniswareID,
                ProposedGRP: res?.ProposedGRP0,
                OperationalUnit: res?.OperationalUnit,
                BusinessUnit: res?.BU?.indexOf('->') !== -1 ? res?.BU?.split('->')[1] : res?.BU,
                SubBusinessUnit: res?.BusinessUnit?.indexOf('->') !== -1 ? res?.BusinessUnit?.split('->')[1] : res?.BusinessUnit,
                TradeName: res?.TradeName,
                Indication: res?.Indication,
                RnDProjNo: res.RnDProjNo,
                OtherAlias: res.OtherAlias,
                GlobalBrandAPI: res.GlobalBrandAPI,
                TherapeuticArea: res.TherapeuticArea,
                BUnit: res?.BU,
                SBUnit: res?.BusinessUnit,
                LaunchLeader: res?.LaunchLeaderUser?.Title,
                PfizerConnectID: res.PfizerConnectID,
            }));
            drData?.map(dr => {
                DRIDs?.push(dr?.DRID)
            })
            const ids = [];
            const goldItemsX = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", `IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1`, null)
            const goldItemsY = goldItemsX?.filter(item => item?.Molecule?.toLowerCase() === this.state.SelectedGOLDStgData?.Molecule?.toLowerCase() && (item.TradeName === this.state.SelectedGOLDStgData.TradeName || this.state.SelectedGOLDStgData.TradeName?.toLowerCase()?.includes(item.TradeName?.toLowerCase())))

            goldItems = goldItemsY?.filter(item => item.IntegrationStatus !== 'Assigned' || item.IntegrationStatus !== 'Published')
            goldItems?.map(item => {
                ids?.push(item?.ID)
            })
            goldItems?.forEach(async item => {
                await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item?.ID, { MappedDRID: DRIDs?.join(';'), ProposedGRPKey: grpKey, ProposedMoleculeKey: molKey, ProposedLabelKey: labKey, MatchCriteria: 'Exact' }).then(async res => {
                    await this.getGOLDTabData();
                });
            })
        } else if (ProjectDetailsData?.length === 0) {
            const ProjectDetailsData0 = await DataService.fetchAllItemsGenericFilter(projectDetailsListName, '*', `IsActive eq 1`, null);

            const ProjectDetailsData1 = ProjectDetailsData0?.filter(item => item?.ProposedGRP?.split('->')[0] === grpKey || item?.MoleculeName?.split('->')[0] === molKey || item?.TradeName?.split('->')[0] === labKey)
            // console.log(ProjectDetailsDataFiltered)

            if (ProjectDetailsData1?.length > 0) {
                const DRIDs = [];
                drData = ProjectDetailsData1?.map(res => ({
                    DRID: res?.ID,
                    ProjectTitle: res?.ProjectTitl ? res?.ProjectTitl : this.state.pTitleForDR,
                    MoleculeName: res?.MoleculeName,
                    PlaniswareID: res?.PlaniswareID,
                    ProposedGRP: res?.ProposedGRP0,
                    OperationalUnit: res?.OperationalUnit,
                    BusinessUnit: res?.BU?.indexOf('->') !== -1 ? res?.BU?.split('->')[1] : res?.BU,
                    SubBusinessUnit: res?.BusinessUnit?.indexOf('->') !== -1 ? res?.BusinessUnit?.split('->')[1] : res?.BusinessUnit,
                    TradeName: res?.TradeName,
                    Indication: res?.Indication,
                    RnDProjNo: res.RnDProjNo,
                    OtherAlias: res.OtherAlias,
                    GlobalBrandAPI: res.GlobalBrandAPI,
                    TherapeuticArea: res.TherapeuticArea,
                    BUnit: res?.BU,
                    SBUnit: res?.BusinessUnit,
                    LaunchLeader: res?.LaunchLeaderUser?.Title,
                    PfizerConnectID: res.PfizerConnectID,
                }));
                drData?.map(dr => {
                    DRIDs?.push(dr?.DRID)
                })
                const ids = [];
                const goldItemsX = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", `IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1`, null)
                const goldItemsY = goldItemsX?.filter(item => item?.Molecule?.toLowerCase() === this.state.SelectedGOLDStgData?.Molecule?.toLowerCase() && (item.TradeName === this.state.SelectedGOLDStgData.TradeName || this.state.SelectedGOLDStgData.TradeName?.toLowerCase()?.includes(item.TradeName?.toLowerCase())))

                goldItems = goldItemsY?.filter(item => item.IntegrationStatus !== 'Assigned' || item.IntegrationStatus !== 'Published')
                goldItems?.map(item => {
                    ids?.push(item?.ID)
                })
                goldItems?.forEach(async item => {
                    await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item?.ID, { MappedDRID: DRIDs?.join(';'), ProposedGRPKey: grpKey, ProposedMoleculeKey: molKey, ProposedLabelKey: labKey, MatchCriteria: 'Partial' }).then(async res => {
                        await this.getGOLDTabData();
                    });
                })
            } else {
                const ids = [];
                const goldItemsX = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", `IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1`, null)
                // const goldItemsY = goldItemsX?.filter(item => item?.Molecule?.toLowerCase() === this.state.SelectedGOLDStgData?.Molecule?.toLowerCase() && item?.TradeName?.toLowerCase() === this.state.SelectedGOLDStgData.TradeName?.toLowerCase())
                const goldItemsY = goldItemsX?.filter(item => item?.Molecule?.toLowerCase() === this.state.SelectedGOLDStgData?.Molecule?.toLowerCase() && (item.TradeName === this.state.SelectedGOLDStgData.TradeName || this.state.SelectedGOLDStgData.TradeName?.toLowerCase()?.includes(item.TradeName?.toLowerCase())))

                goldItems = goldItemsY?.filter(item => item.IntegrationStatus !== 'Assigned' || item.IntegrationStatus !== 'Published')
                goldItems?.map(item => {
                    ids?.push(item?.ID)
                })
                goldItems?.forEach(async item => {
                    await DataService.updateItemInList('Z_NPL_GOLD_Staging_List', item?.ID, { ProposedGRPKey: grpKey, ProposedMoleculeKey: molKey, ProposedLabelKey: labKey, MatchCriteria: 'No Match' }).then(async res => {
                        await this.getGOLDTabData();
                    });
                })
                this.setState({ isLoading: false, moleculeExisted: true })
                this.toast.show({ severity: 'warn', summary: 'Warning!', detail: 'No Match Found. Please create a new DR !', life: 3000 })
                // return

            }
        }

        const moleculeToDRPData = await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_To_DR_GRP', '*', `isActive eq 1`, null);
        const moleculeToDRP = moleculeToDRPData?.filter(item => item?.Molecule?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
        const moleculeToDRPWithEmpty = moleculeToDRP?.filter(item => !item?.GRPKey || !item?.GRPValue)
        const moleculeToMoleculeData = await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_TO_DR_MoleculeAPI', '*', `isActive eq 1`, null);
        const moleculeToMolecule = moleculeToMoleculeData?.filter(item => item?.GOLDMolecule?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
        const moleculeToMoleculeWithEmpty = moleculeToMolecule?.filter(item => !item?.DR_MoleculeAPI || !item?.MoleculeKey)
        const moleculeToLabelData = await DataService.fetchAllItemsGenericFilter('GOLD-TradeName_To_DR_Label', '*', `isActive eq 1`, null);
        const moleculeToLabel = moleculeToLabelData?.filter(item => item?.TradeName?.toLowerCase() === this.state.SelectedGOLDStgData.Molecule?.toLowerCase())
        const moleculeToLabelWithEmpty = moleculeToLabel?.filter(item => !item?.DRLabelText || !item?.DRLabelKey)

        if (goldItems?.length > 0) {
            if (moleculeToDRP?.length === 0) {
                await DataService.addItemsToList('GOLD-Molecule_To_DR_GRP', { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
            } else {
                await DataService.updateItemInList('GOLD-Molecule_To_DR_GRP', moleculeToDRP?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
            }
            if (moleculeToDRPWithEmpty?.length > 0) {
                await DataService.updateItemInList('GOLD-Molecule_To_DR_GRP', moleculeToDRPWithEmpty?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, Molecule: this.state.SelectedGOLDStgData.Molecule, GRPKey: grpKey, GRPValue: grpVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
            }

            if (moleculeToMolecule?.length === 0) {
                await DataService.addItemsToList('GOLD-Molecule_TO_DR_MoleculeAPI', { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, GOLDMolecule: this.state.SelectedGOLDStgData.Molecule, MoleculeKey: molKey, DR_MoleculeAPI: molVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
            } else {
                await DataService.updateItemInList('GOLD-Molecule_TO_DR_MoleculeAPI', moleculeToMolecule?.[0]?.ID, { FK_Molecule_BK: goldItems?.[0]?.FK_Molecule_BK, GOLDMolecule: this.state.SelectedGOLDStgData.Molecule, MoleculeKey: molKey, DR_MoleculeAPI: molVal, FK_Molecule_ID: goldItems?.[0]?.FK_Molecule_ID, isConfirmed: true })
            }
            if (moleculeToMoleculeWithEmpty?.length > 0) {
                await DataService.updateItemInList('GOLD-Molecule_TO_DR_MoleculeAPI', moleculeToMoleculeWithEmpty?.[0]?.ID, { MoleculeKey: molKey, DR_MoleculeAPI: molVal, isConfirmed: true })
            }
            if (moleculeToLabel?.length === 0) {
                await DataService.addItemsToList('GOLD-TradeName_To_DR_Label', { TradeName: this.state.SelectedGOLDStgData.Molecule, DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
            } else {
                await DataService.updateItemInList('GOLD-TradeName_To_DR_Label', moleculeToLabel?.[0]?.ID, { TradeName: this.state.SelectedGOLDStgData.Molecule, DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
            }
            if (moleculeToLabelWithEmpty?.length > 0) {
                await DataService.updateItemInList('GOLD-TradeName_To_DR_Label', moleculeToLabelWithEmpty?.[0]?.ID, { DRLabelText: labVal, DRLabelKey: labKey, isConfirmed: true })
            }
            this.setState({ selectedProjectDetails: drData, showLinkAndCreateIDPop: true, SelectedGRPForNewID: '', SelectedMoleculeForNewID: null, SelectedLabelForNewID: null, isLoading: false });
        }
        await this.getGOLDStgListData();
        this.getConfirmedPreSelectedValues(grpKey, molKey, labKey);

    }

    protected onValueChangedVal = async (e: any) => {
        this.setState({ isLoading: true })
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        // console.log(this.state.GSCProjects)
        // console.log(this.state.ProductChecklist)
        this.setState({
            onValueChangedValKey: e.value.actualValue
        })

        let filteredVal;
        let gscProjfilteredVal;
        let drDatafilteredVal;
        let multiSelect: any;

        if (this.state.IsMultiCategoryEnbaled) {
            multiSelect = e.value[this.state.multiVals.length].actualValue
            if (this.state.multiVals.length > 0 && this.state.multiVals.includes(multiSelect)) {
                const unSelectedResult = this.state.multiVals.filter((item) => { if (item != multiSelect) { return item } })
                this.setState({
                    multiVals: unSelectedResult
                })
            }
            else {
                this.setState({
                    multiVals: [...this.state.multiVals, multiSelect]
                })
            }
        }
        let ProjectDetailsData = await DataService.fetchAllItems_DR(projectDetailsListName);
        // console.log(ProjectDetailsData)
        const goldItemsX = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", "*", "IsActive eq 1 and IsPlanExist ne 'Yes' and IsMerged ne 1", 'Modified');
        const goldItemsY = goldItemsX?.filter(item => item?.IsPlanExist !== 'Yes' && item?.IsMerged != true);
        const order = { "New": 0, "Assigned": 1, "Published": 2, "Processed":3 };
        const goldItemsSorted = goldItemsY?.sort((a, b) => order[a.IntegrationStatus] - order[b.IntegrationStatus]);
        const goldItems = goldItemsSorted?.map(obj => ({
            ...obj,
            DatePart_x003a_LaunchBaseGeneratX: obj?.DatePart_x003a_LaunchBaseGenerat ? format(new Date(obj?.DatePart_x003a_LaunchBaseGenerat), 'MMM-dd-yyyy') : '',
            DatePart_x003a_LaunchBaseOscarX: obj?.DatePart_x003a_LaunchBaseOscar ? format(new Date(obj?.DatePart_x003a_LaunchBaseOscar), 'MMM-dd-yyyy') : '',
            DatePart_x003a_LaunchActualX: obj?.DatePart_x003a_LaunchActual ? format(new Date(obj?.DatePart_x003a_LaunchActual), 'MMM-dd-yyyy') : '',
            DatePart_x003a_LaunchBaseX: obj?.DatePart_x003a_LaunchBase ? format(new Date(obj?.DatePart_x003a_LaunchBase), 'MMM-dd-yyyy') : '',
            ReimbursementX: obj?.Reimbursement ? format(new Date(obj?.Reimbursement), 'MMM-dd-yyyy') : '',
            ReimbursementGeneratedX: obj?.ReimbursementGenerated ? format(new Date(obj?.DatePart_x003a_LaunchBase), 'MMM-dd-yyyy') : '',
            ReimbursementBaseX: obj?.ReimbursementBase ? format(new Date(obj?.DatePart_x003a_LaunchBase), 'MMM-dd-yyyy') : '',
            GOLD_DLPPMappedX: obj?.GOLD_DLPPMapped ? 'Yes' : 'No'
        }))

        const itemsForGoldTab = goldItems?.filter(item => item.IntegrationStatus === 'Assigned' || item.IntegrationStatus === 'Published')
        const gscProjItems = await DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,DLPPManaged,Country,
        *,PlanOwner/Title,PlanOwner/Id,MarketPlanner/Title,MarketPlannerSupervisor/Title,RegionalSupplyLeader/Title,AboveMarketPlanner/Title,AboveMarketPlannerSupervisor/Title,
        MarketPlanner/Id,MarketPlannerSupervisor/Id,RegionalSupplyLeader/Id,AboveMarketPlanner/Id,AboveMarketPlannerSupervisor/Id,PGSReadiness`,
            `Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed'`, 'PGSReadiness');
        // if (gscProjItems?.length > 0) {
        //     //  console.log("DLPPList",gscProjItems);
        //     itemsForGoldTab.forEach((goldItem) => {
        //         const matchingRecords = gscProjItems.filter(
        //             (mainItem) =>
        //                 mainItem.DRID == parseInt(goldItem.MappedDRID) && mainItem.Country?.indexOf('->') !== -1 && mainItem.Country?.split('->')[0] == goldItem?.ProposedCountryCode
        //         );
        //         if (matchingRecords?.length > 0) {
        //             const hasDLPP = matchingRecords.reduce(
        //                 (result, record) => result || (record.DLPPManaged === true),
        //                 false
        //             );
        //             goldItem.PlanManaged = hasDLPP ? 'DLPP' : 'SIQ';
        //         } else {
        //             goldItem.PlanManaged = "New"
        //         }
        //     });
        //     // console.log("getGOLDTabData",filteredGolds);
        // }
        const mappedRes = gscProjItems?.map(obj => ({
            ...obj,
            PTitle: obj?.PlanOwner?.Title,
            LaunchReadinessDate: obj?.PGSReadiness !== null ? format(new Date(obj?.PGSReadiness), 'MMM-dd-yyyy') : ''
        }))
        const DRData = ProjectDetailsData.map((p) => {
            const count = mappedRes.filter((data) => data.DRID === p.Id)
            const count0 = count?.length
            return { ...p, Launches: count0, CreatedBy: p?.Author?.Title, DataSteward: p?.DataSteward?.Title }
        })
        // console.log(DRData)
        if (this.state.onValueChangedValKey === 'All') {
            if (this.state.SelectedTabName == "Launch List") {
                this.setState({
                    GSCProjects: this.state.onValueChangedValKey === 'All' ? mappedRes : gscProjfilteredVal,
                    DataRepoData: this.state.onValueChangedValKey === 'All' ? DRData : drDatafilteredVal,
                    isLoading: false
                })
                return;
            }
            else if (this.state.SelectedTabName == "GOLD") {
                this.setState({
                    GOLDTabData: this.state.onValueChangedValKey === 'All' ? itemsForGoldTab : itemsForGoldTab,
                    isLoading: false
                });
                return;
            }
            else {
                this.setState({
                    GOLDStgListData: this.state.onValueChangedValKey === 'All' ? goldItems : filteredVal,
                    isLoading: false
                });
                return;
            }
        }
        if (this.state.IsMultiCategoryEnbaled) {
            if (this.state.SelectedTabName == "Launch List") {
                if (this.state.filterStatus == "Launch Lead") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.multiVals?.includes(item?.PlanOwner?.Title))
                    drDatafilteredVal = DRData.filter((item, i) => this.state.multiVals?.includes(item?.CreatedBy))
                }
                if (this.state.filterStatus == "Launch Progress") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.multiVals?.includes(item?.LaunchProgress))
                    drDatafilteredVal = DRData.filter((item, i) => this.state.multiVals?.includes(item?.LaunchProgress))
                }
                if (this.state.filterStatus == "Launch Priority") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.multiVals?.includes(item?.LaunchPriorityCategory))
                    drDatafilteredVal = DRData.filter((item, i) => this.state.multiVals?.includes(item?.LaunchPriorityCategory))
                }
                if (this.state.filterStatus == "Launch Characterstic") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.multiVals?.includes(item?.LaunchCharacteristic))
                    drDatafilteredVal = DRData.filter((item, i) => this.state.multiVals?.includes(item?.LaunchCharacteristic))
                }
                if (this.state.filterStatus == "Launch Status") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.multiVals?.includes(item?.LaunchStatus))
                    drDatafilteredVal = DRData.filter((item, i) => this.state.multiVals?.includes(item?.LaunchStatus))
                }
                this.setState({
                    GSCProjects: this.state.onValueChangedValKey === 'All' ? mappedRes : gscProjfilteredVal,
                    DataRepoData: this.state.onValueChangedValKey === 'All' ? DRData : drDatafilteredVal,
                    isLoading: false
                })
            }
            else if (this.state.SelectedTabName == "GOLD") {
                if (this.state.filterStatus === 'Plan Managed') {
                    filteredVal = itemsForGoldTab.filter((item, i) => this.state.multiVals?.includes(item?.PlanManaged));
                    this.setState({
                        GOLDTabData: this.state.onValueChangedValKey === 'All' ? itemsForGoldTab : filteredVal,
                        isLoading: false
                    });
                    return;
                }
                // if(this.state.filterStatus === 'Status') {
                //     filteredVal = itemsForGoldTab.filter((item, i) => this.state.multiVals?.includes(item?.IntegrationStatus));
                //     this.setState({
                //         GOLDTabData: this.state.onValueChangedValKey === 'All' ? itemsForGoldTab : this.state.onValueChangedValKey === 'New' ?[] : filteredVal
                //     });
                //     return;
                // }
                filteredVal = itemsForGoldTab.filter((item, i) => this.state.multiVals?.includes(item[this.state.filterStatus]))
                this.setState({
                    GOLDTabData: this.state.onValueChangedValKey === 'All' ? itemsForGoldTab : filteredVal,
                    isLoading: false
                })

            }
            else {
                if (this.state.filterStatus === 'Record Match') {
                    filteredVal = goldItems.filter((item, i) => this.state.multiVals?.includes(item?.MatchCriteria));
                    this.setState({
                        GOLDStgListData: this.state.onValueChangedValKey === 'All' ? goldItems : filteredVal,
                        isLoading: false
                    });
                    return;
                }
                if (this.state.filterStatus === 'Record Status') {
                    filteredVal = goldItems.filter((item, i) => this.state.multiVals?.includes(item?.IntegrationStatus));
                    this.setState({
                        GOLDStgListData: this.state.onValueChangedValKey === 'All' ? goldItems : filteredVal,
                        isLoading: false
                    });
                    return;
                }
                filteredVal = goldItems.filter((item, i) => this.state.multiVals?.includes(item[this.state.filterStatus]))
                this.setState({
                    GOLDStgListData: this.state.onValueChangedValKey === 'All' ? goldItems : filteredVal,
                    isLoading: false
                })
            }
        } else {
            if (this.state.SelectedTabName == "Launch List") {
                if (this.state.filterStatus == "Launch Lead") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.onValueChangedValKey === item?.PlanOwner?.Title)
                    drDatafilteredVal = DRData.filter((item, i) => this.state.onValueChangedValKey === item?.CreatedBy)
                }
                if (this.state.filterStatus == "Launch Progress") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchProgress)
                    drDatafilteredVal = DRData.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchProgress)
                }
                if (this.state.filterStatus == "Launch Priority") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchPriorityCategory)
                    drDatafilteredVal = DRData.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchPriorityCategory)
                }
                if (this.state.filterStatus == "Launch Characterstic") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchCharacteristic)
                    drDatafilteredVal = DRData.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchCharacteristic)
                }
                if (this.state.filterStatus == "Launch Status") {
                    gscProjfilteredVal = mappedRes.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchStatus)
                    drDatafilteredVal = DRData.filter((item, i) => this.state.onValueChangedValKey === item?.LaunchStatus)
                }
                this.setState({
                    GSCProjects: this.state.onValueChangedValKey === 'All' ? mappedRes : gscProjfilteredVal,
                    DataRepoData: this.state.onValueChangedValKey === 'All' ? DRData : drDatafilteredVal,
                    isLoading: false
                })
            }
            else if (this.state.SelectedTabName == "GOLD") {
                if (this.state.filterStatus === 'Plan Managed') {
                    filteredVal = itemsForGoldTab.filter((item, i) => { return this.state.onValueChangedValKey === item?.PlanManaged })
                    this.setState({
                        GOLDTabData: this.state.onValueChangedValKey === 'All' ? itemsForGoldTab : filteredVal,
                        isLoading: false
                    })
                    return;
                }
                // if(this.state.filterStatus === 'Status') {
                //     filteredVal = itemsForGoldTab.filter((item, i) => {return this.state.onValueChangedValKey === item?.IntegrationStatus})
                //     this.setState({
                //         GOLDTabData: this.state.onValueChangedValKey === 'All' ? itemsForGoldTab : this.state.onValueChangedValKey === 'New' ?[] : filteredVal
                //     })
                //     return;
                // }
                filteredVal = itemsForGoldTab.filter((item, i) => this.state.onValueChangedValKey === item[this.state.filterStatus])
                this.setState({
                    GOLDTabData: this.state.onValueChangedValKey === 'All' ? itemsForGoldTab : filteredVal,
                    isLoading: false
                })
            }
            else {
                if (this.state.filterStatus === 'Record Match') {
                    filteredVal = goldItems.filter((item, i) => { return this.state.onValueChangedValKey === item?.MatchCriteria })
                    this.setState({
                        GOLDStgListData: this.state.onValueChangedValKey === 'All' ? goldItems : filteredVal,
                        isLoading: false
                    })
                    return;
                }
                if (this.state.filterStatus === 'Record Status') {
                    filteredVal = goldItems.filter((item, i) => { return this.state.onValueChangedValKey === item?.IntegrationStatus })
                    this.setState({
                        GOLDStgListData: this.state.onValueChangedValKey === 'All' ? goldItems : filteredVal,
                        isLoading: false
                    })
                    return;
                }
                filteredVal = goldItems.filter((item, i) => this.state.onValueChangedValKey === item[this.state.filterStatus])
                this.setState({
                    GOLDStgListData: this.state.onValueChangedValKey === 'All' ? goldItems : filteredVal,
                    isLoading: false
                })
            }
        }
    }
    public confirmToCreateDR = async () => {
        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        const projectData = await DataService.fetchAllItemsGenericFilter(projectDetailsListName, 'ProjectTitle', ``, null);
        const similarProjects = projectData?.filter(project => project?.ProjectTitle?.toLowerCase()?.trim() === this.state.pTitleForDR?.toLowerCase()?.trim())
        if (similarProjects?.length > 0) {
            this.toast.show({ severity: 'warn', summary: 'Warning Message', detail: 'Project Title already exists. Please select a different Project Title.', life: 3000 });
        } else {
            this.checkAllIndicationExists(this.state.SelectedGOLDStgData.Indication?.split(';')).then(res => {
                if (res) {
                    let similarDRIDs;
                    if (this.state.SelectedGOLDStgData.TradeName !== null) {
                        const wordsToMatch = this.state.SelectedGOLDStgData.TradeName?.toLowerCase().split(/\s+|,|\//).map(word => word.trim().toLowerCase());

                        const similarDRIDsWT = this.state.GOLDStgListData?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published');

                        const exactTradeNames = this.state.GOLDStgListData?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && item.TradeName === this.state.SelectedGOLDStgData.TradeName && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published' && item?.Country !== this.state.SelectedGOLDStgData.Country)

                        const similarDRIDsX = similarDRIDsWT?.filter(item => {
                            const tradenameWords = item?.TradeName?.split(/\s+|,|\//).map(word => word.trim().toLowerCase());
                            return wordsToMatch.reduce((acc, word) => acc || tradenameWords.includes(word), false);
                        })

                        similarDRIDs = [...similarDRIDsX, ...exactTradeNames]

                    } else {
                        similarDRIDs = this.state.GOLDStgListData?.filter((item, i) => item.Molecule?.toLowerCase()?.includes(this.state.SelectedGOLDStgData.Molecule?.toLowerCase()) && (item.TradeName === this.state.SelectedGOLDStgData.TradeName || this.state.SelectedGOLDStgData.TradeName?.toLowerCase()?.includes(item.TradeName?.toLowerCase())) && item?.IntegrationStatus !== 'Assigned' && item?.IntegrationStatus !== 'Published')
                    }

                    if (similarDRIDs?.length > 1) {
                        let countries = [];
                        similarDRIDs?.map((item, i) => {
                            countries?.push(item?.Country)
                        })
                        const isDuplicated = countries?.filter(country => country === this.state.SelectedGOLDStgData.Country)?.length > 1;
                        const removedCountry = countries?.filter(country => country !== this.state.SelectedGOLDStgData.Country);
                        const removedCountryUnique = [...new Set(removedCountry)];
                        const actualCountries = [...new Set(countries)];
                        this.setState({
                            similarCountries1: isDuplicated ? actualCountries : removedCountryUnique,
                            confirmCreateDR: true,
                            // linkOrCreateDR: null
                        })
                    } else {
                        this.setState({
                            confirmCreateDR1: true,
                            // linkOrCreateDR: null
                        })
                    }
                }
            })
            await DataService.fetchAllItemsGenericFilter('LoVMaster', '*',
                `SourceType eq 'Molecule' and Value eq '${this.state.SelectedGOLDStgData.Molecule}'`, null).then(res => {
                    this.setState({
                        lovMoleculeKey: res?.[0]?.Key
                    })
                });
            await DataService.fetchAllItemsGenericFilter('LoVMaster', '*',
                `SourceType eq 'GlobalBrand' and Value eq '${this.state.SelectedGOLDStgData.Brand}'`, null).then(res => {
                    this.setState({
                        lovBrandKey: res?.[0]?.Key
                    })
                });
        }
    }

    public DetailTemplate = (e) => {
        const skuForID = this.state.skuDetails.filter(item => e.data.data.ID === item.ProjectPlanID)
        const sortedSKU = skuForID?.sort((a, b) => {
            if (a.Group === 'SKU_GROUP') return -1
            if (b.Group === 'SKU_GROUP') return 1
            const aNum = parseInt(a?.Group.replace(/\D/g, ''));
            const bNum = parseInt(b?.Group.replace(/\D/g, ''));
            return aNum - bNum;
        })
        const drid = e.data.data.DRID;
        // console.log(this.state.detailsData)
        return <div>
            <h6 style={{ paddingLeft: '1rem', paddingTop: '1.5rem' }}>SKU Details</h6>
            <DataGrid
                dataSource={sortedSKU}
                showBorders={true}
                columnResizingMode={'widget'}
                allowColumnReordering={true}
                allowColumnResizing={true}
            >
                <Scrolling useNative={false}
                    mode="virtual"
                    scrollByContent={true}
                    scrollByThumb={true}
                    showScrollbar="always" />
                <Column cellRender={e => this.selectSKUActionCol(e, drid)} width={100} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                <Column cellRender={e => e.value === true ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '20px', backgroundColor: 'green' }} />
                </div> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '20px', backgroundColor: 'grey' }} />
                    </div>} allowExporting={false} allowResizing={true} dataField='IsActive' caption="Is Active" alignment="center" width={100} allowEditing={false} />
                <Column dataField='Group' width={150} caption='Group' />
                <Column dataField='SKU_List' width={250} caption='SKU List' />
                <Column dataField='ReasonCode' width={150} caption='Reason Code' />
                <Column dataField='AccelerationStrategy' width={250} caption='Acceleration Strategy' />
                <Column dataField='Comments' caption='Comments' />
            </DataGrid>
        </div>
    }

    public CheckInIndicationMaster = async (IndicationArray, id) => {
        const sanitizedVal = IndicationArray?.map(value => value?.replace(/'/g, "''"));
        sanitizedVal?.forEach(async (indication, i) => {
            await DataService.fetchAllItemsGenericFilter('Indication', '*',
                `field_2 eq '${indication}'`, null).then(async res => {
                    if (res?.length > 0) {
                        const indData = await DataService.fetchAllDRListItemsWithFilters('IndicationTransaction', 'Value/Id,Value/Title,Value/field_0,Value/field_2', `DRID eq ${id === null ? this.state.selectedDRID.toString() : id}`, 'Value', null)
                        const existedInd = indData?.filter(item => item?.Value?.field_2 === indication)
                        if (existedInd?.length === 0) {
                            DataService.addItemsToList('IndicationTransaction',
                                {
                                    ValueId: res[0].ID,
                                    DRID: id === null ? this.state.selectedDRID.toString() : id,
                                    Source: "Gold"
                                }
                            ).then(res => {
                                console.log("Indication updated in Transaction list", res);
                            }).catch((error) => {
                                alert('error async call')
                                console.error(error);
                                let errorMsg = {
                                    Source: 'Error while adding to Indication Transaction List',
                                    Message: error.message,
                                    StackTrace: new Error().stack
                                };
                                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                    .catch(e => console.log(e))
                            })
                        }
                    }
                })
        })

    }

    public onSelectedIPortPlansIdsChange(e, row) {
        console.log("onSelectedIPortPlansIdsChange", row)
    }
    public setProjectStatusCell(rowData: any) {
        return (
            <span title={rowData.value}
                className={
                    (rowData.value == "Strategic Hold" || rowData.value == "Awaiting Dev Decision") ?
                        ('PSOnHold') :
                        (rowData.value == "Ongoing" ? 'PSOnGoing' : 'PS')
                }
            >
                {rowData.value}
            </span>
        )
    }

    public handleOptionChanged = (e) => {
        if (e.fullName === 'searchPanel.text') {
            this.setState({ QueryString: e.value });
            e.element.autofocus = true;
        } else if (e.fullName === 'paging.pageSize' && e.value === 0) {
            this.setState({ isLoading: true })
        }
    };

    public handleContentReady = () => {
        this.setState({ isLoading: false })
    }

    public ActionCol(rowData: any) {
        return (
            <>
                <div>
                    <img title="View" alt="Card" src={view} onClick={(e) => this.Actionlink('View', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    {true && <img title="Edit" alt="Card" src={edit} onClick={(e) => this.Actionlink('Edit', rowData)} style={{ cursor: "pointer " }} />}
                </div>
            </>
        );
    }

    //AI Assist Action col
    public AIActionCol(rowData: any) {
        const BA = this.state?.userGroupsForNPL?.includes('GSC Leader_Data Steward') || this.state?.userGroupsForNPL?.includes('Digital Admin') || this.state?.userGroupsForNPL?.includes('Data Steward')
        return (
            <>
                <div>
                    <img title="View" alt="Card" src={view} onClick={(e) => this.AIActionlink('View', rowData.data)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    {BA && <img title="Edit" alt="Card" src={edit} onClick={(e) => this.AIActionlink('Edit', rowData.data)} style={{ cursor: "pointer " }} />}
                </div>
            </>
        );
    }
    //GOLD Action col

    public GOLDActionCol(rowData: any) {
        const BA = this.state?.userGroupsForNPL?.includes('GSC Leader_Data Steward') || this.state?.userGroupsForNPL?.includes('Digital Admin') || this.state?.userGroupsForNPL?.includes('GSC Leader')
        return (
            <>
                <div>
                    <img title="View" alt="Card" src={view} onClick={(e) => this.GOLDActionlink('View', rowData.data, false)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    {BA && <img title="Edit" alt="Card" src={edit} onClick={(e) => this.GOLDActionlink('Edit', rowData.data, false)} style={{ cursor: "pointer " }} />}
                </div>
            </>
        );
    }
    // launch lsit Action col 
    public LaunchListActionCol(rowData: any) {
        const BA = this.state?.userGroupsForNPL?.includes('GSC Leader_Data Steward') || this.state?.userGroupsForNPL?.includes('Digital Admin') || this.state?.userGroupsForNPL?.includes('GSC Leader')
        return (
            <>
                <div>
                    <img title="View" alt="Card" src={view} onClick={(e) => this.LaunchActionlink('View', rowData.data)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    {BA && <img title="Edit" alt="Card" src={edit} onClick={(e) => this.LaunchActionlink('Edit', rowData.data)} style={{ cursor: "pointer " }} />}
                </div>
            </>
        );
    }
    public SelectedDRActionCol(rowData: any) {
        return (
            <>
                <div>
                    <img title="View" alt="Card" src={view} onClick={(e) => this.SelectedDRActionColLink('View', rowData.data)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    {this.state.SelectedProjectPlanMode == 'Edit' && <img title="Edit" alt="Card" src={edit} onClick={(e) => this.SelectedDRActionColLink('Edit', rowData.data)} style={{ cursor: "pointer " }} />}
                </div>
            </>
        );
    }
    public sortBasedOnNumber = (array) => {
        return array?.sort((a, b) => {
            const aNum = parseInt(a?.key?.split('->')[0])
            const bNum = parseInt(b?.key?.split('->')[0])
            return aNum - bNum
        })
    }
    public getReasonCode = async (drid) => {
        let rcs = [];
        let ass = [];
        let mDesc = [];
        let PresentationListName = "";
        if (DataService.environment === "DEV") {
            PresentationListName = "PresentationList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            PresentationListName = "PresentationList_Prod";
        }
        const Lcs = ['SKU EXIT IN-PROGRESS', 'FULLY EXITED', null];
        const desc = await DataService.fetchAllItemsGenericFilter(PresentationListName, '*', `ProjectTitleId eq '${drid}'`);
        const filteredDescMN = desc?.filter(item => [null, undefined, ""]?.indexOf(item.MaterialNumber) === -1);
        const filteredDescShow = filteredDescMN?.filter(item => item.Show === true)
        const filteredDescLC = filteredDescShow?.filter(item => Lcs?.indexOf(item?.LifecycleClass) === -1)

        filteredDescLC?.map((item, i) => mDesc.push(item?.MaterialNumber))

        const rc = await DataService.fetchAllItemsGenericFilter("Z_NPL_SKUDropdownVal", 'Value, KeyValue', `ConfigType eq 'ReasonCode'`)
        const as = await DataService.fetchAllItemsGenericFilter("Z_NPL_SKUDropdownVal", 'Value, KeyValue', `ConfigType eq 'AccStrategy'`)
        rc?.map((item, i) => rcs.push({ key: item.Value, value: item.Value, id: i }));
        as?.map((item, i) => ass.push({ key: item.KeyValue, value: item.Value, id: i }));
        const sortedAcc = this.sortBasedOnNumber(ass)
        // console.log(rcs)
        // console.log(ass)
        this.setState({
            ReasonCodesFromList: [...new Set(rcs)],
            AccStrategyFromList: [...new Set(sortedAcc)],
            AutoCompleteValues: [...new Set(mDesc)],
        })
        // console.log(mDesc)
        // console.log(this.state.AutoCompleteValues)
    }
    public selectSKUActionColLink = async (type, e, drid) => {
        // console.log(e)
        const skuForID = this.state.skuDetails?.filter(item => e?.ProjectPlanID === item.ProjectPlanID)
        const skuForID0 = skuForID?.filter(item => e?.ID !== item.ID)
        // const itemSKU = this.state.skuForID?.filter(item => item.ProjectPlanID === e?.ID);
        const skuID = await DataService.fetchAllItemsGenericFilter("Z_NPL_ProjectPlan_SKU", '*', `ID eq ${e.ID}`)
        this.getReasonCode(drid);
        this.setState({
            showSKUpop: true, skuGroupName: e.Group, selectedSKUID: e.ID,
            ReasonCode0: skuID[0]?.ReasonCode,
            AutoCompleteValue: skuID[0]?.SKU_List?.split(';'),
            AccStrategy: skuID[0]?.AccelerationStrategy?.length > 0 ? skuID[0]?.AccelerationStrategy?.length === 1 ? skuID[0]?.AccelerationStrategy : skuID[0]?.AccelerationStrategy?.split(',') : '',
            skuComments: skuID[0]?.Comments,
            skuActiveChecked: skuID[0]?.IsActive,
            skuForIndID: skuID,
            skuForIndividualItem: skuForID0,
            remainingChars: skuID[0]?.Comments ? 500 - (skuID[0]?.Comments)?.length : 500,
        })
    }
    public selectSKUActionCol(rowData: any, drid) {
        return (
            <>
                <div>
                    {true && <img title="Edit" alt="Card" src={edit} onClick={(e) => {
                        this.selectSKUActionColLink('Edit', rowData.data, drid)
                    }} style={{ cursor: "pointer " }} />}
                </div>
            </>
        );
    }

    public SelectedDRActionColLink = (type, e) => {
        if (this.state.SelectedIDData?.BUnit === null || this.state.SelectedIDData?.SBUnit === null || this.state.SelectedIDData?.MoleculeName === null || this.state.SelectedIDData?.ProposedGRP === null) {
            this.setState({
                showMarketErrorPop: true,
                showLaunchMarketPopup: false
            })
        } else {
            this.setState({
                showMarketErrorPop: false,
                showLaunchMarketPopup: true
            })

            this.setState({ showLaunchMarketPopup: true, SelectedMarketMode: type, SelectedDRMarketData: e })
            // console.log("SelectedDRActionColLink", type, e)
            this.getProjectDetailsListDataForSelectedDRID(e?.DRID, 'LaunchList');
            this.setState({ MarketGridDataArray: [],MarketGridDataArrayCopy:[] });
            this.getLaunchIndicationData(e?.DRID);
            // let country = e?.Country ? e?.Country?.split('->')[1] : [];
            let ind = (e?.Indication != null) ? e?.Indication?.includes(";") ? e?.Indication?.split(";") : [e?.Indication] : [];
            this.setState({
                LaunchListMarketData: {
                    Priority: e?.LaunchPriorityCategory ? e?.LaunchPriorityCategory : '',
                    Country: [e?.Country],
                    Indication: (e?.Indication != null) ? e?.Indication?.includes(";") ? e?.Indication?.split(";") : [e?.Indication] : [],
                    TradeName: [e?.LabelName],
                    LaunchChar: e?.LaunchCharacteristic ? e?.LaunchCharacteristic : '',
                    LaunchLeader: e?.PlanOwner?.Id ? e?.PlanOwner?.Id : null,
                    MarketPlanner: e?.MarketPlannerId ? e?.MarketPlannerId : null,
                    MarketPlannerSup: e?.MarketPlannerSupervisorId ? e?.MarketPlannerSupervisorId : null,
                    RegSupplierLeader: e?.RegionalSupplyLeaderId ? e?.RegionalSupplyLeaderId : null,
                    AboveMarketPlanner: e?.AboveMarketPlannerId ? e?.AboveMarketPlannerId : null,
                    AboveMarketPlannerSup: e?.AboveMarketPlannerSupervisorId ? e?.AboveMarketPlannerSupervisorId : null,
                    ProjectNameSuffix: e?.PlanProjectName ? e?.PlanProjectName : '',
                    DLPPManaged: e?.DLPPManaged ? 'Yes' : 'No',
                    IsDLPPManagedEdit: e?.IsDLPPManagedEdit,
                    LaunchLeaderTitle: e.PlanOwner?.Title ? e.PlanOwner?.Title : '',
                    MarketPlannerTitle: e.MarketPlanner?.Title ? e.MarketPlanner?.Title : '',
                    MarketPlannerSupTitle: e.MarketPlannerSupervisor?.Title ? e.MarketPlannerSupervisor?.Title : '',
                    RegSupplierLeaderTitle: e.RegionalSupplyLeader?.Title ? e.RegionalSupplyLeader?.Title : '',
                    AboveMarketPlannerTitle: e.AboveMarketPlanner?.Title ? e.AboveMarketPlanner?.Title : '',
                    AboveMarketPlannerSupTitle: e.AboveMarketPlannerSupervisor?.Title ? e.AboveMarketPlannerSupervisor?.Title : '',
                }
            })
            if (ind?.length > 0) {
                this.getPrefix(ind);
            }
        }
    }



    public getDLPPForDRID = async (DRID) => {
        // this.setState({ isLoading: true })
        // setTimeout(() => { this.setState({ isLoading: false }) }, 1500);
        await DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,
        *,PlanOwner/Title,PlanOwner/Id,MarketPlanner/Title,MarketPlannerSupervisor/Title,RegionalSupplyLeader/Title,AboveMarketPlanner/Title,AboveMarketPlannerSupervisor/Title,
        MarketPlanner/Id,MarketPlannerSupervisor/Id,RegionalSupplyLeader/Id,AboveMarketPlanner/Id,AboveMarketPlannerSupervisor/Id`,
            `(Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed') and (DRID eq '${DRID}')`, 'PGSReadiness').then(res => {
                if (res?.length > 0) {
                    const mappedRes = res?.map(obj => ({
                        ...obj,
                        PTitle: obj?.PlanOwner?.Title,
                        dManaged: obj?.DLPPManaged ? 'Yes' : 'No',
                        isNew: this.state.NewIds?.includes(obj?.ID)
                    }));
                    let sortData = mappedRes.sort((a, b) => b.res?.data?.ID - a.res?.data?.ID);
                    this.setState({
                        dlppForDRID: sortData
                    });
                }
                //  console.log("getDLPPForDRID",res,DRID);
            });
        this.getSKUListData();
    }
    public getSKUListData = async () => {
        let skuLists = [];
        let Acc = [];
        let ReasonCode = [];
        await DataService.fetchAllItemsGenericFilter("Z_NPL_ProjectPlan_SKU", '*', '').then(async res => this.setState({ skuDetails: res }))

        this.state.skuDetails?.map((item, i) => {
            skuLists.push(item.SKU_List)
            if (item.AccelerationStrategy !== null) {
                Acc.push({ key: item.AccelerationStrategy, value: item.AccelerationStrategy, id: i })
            }
            if (item.ReasonCode !== null) {
                ReasonCode.push({ key: item.ReasonCode, value: item.ReasonCode, id: i })
            }
        })
        this.setState({ skuListValues: [...new Set(skuLists)], AccStrategyValues: this.removeDup(Acc), ReasonCodeValues: this.removeDup(ReasonCode) })
    }
    public search = (event) => {
        this.setState({ skuSearchItems: this.state.skuListValues.map(item => event.query + '-' + item) });
    }
    public LaunchActionlink = async (type, e) => {
        this.setState({ SelectedProjectPlanMode: type, showEditPlanDialog0: true, selectedID: e, QueryString: '' })
        console.log("LaunchActionlink", type, e)
        if (!this.state.DRPChecked) {
            this.getProjectDetailsListDataForSelectedDRID(e?.Id, 'LaunchList');
            this.getDLPPForDRID(e?.Id);
            this.getSKUListData();
            this.getDrDetailsandFormFields(e?.Id);
            this.getLaunchIndicationData(e?.Id);
            this.getDLPPforSelectedDRID(e?.Id);
        } else {
            this.getProjectDetailsListDataForSelectedDRID(e?.DRID, 'LaunchList');
            this.getDLPPForDRID(e?.DRID);
            this.getSKUListData();
            this.getDrDetailsandFormFields(e?.DRID);
            this.getLaunchIndicationData(e?.DRID);
            this.getDLPPforSelectedDRID(e?.DRID);
        }
    }
    public getLaunchLeaderMail = (rowData: any) => {
        const Email = rowData.data.PEmail;
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <a href={`mailto:${Email}`} target="_blank">{rowData.data.PTitle}</a>
            </div>
        )
    }
    public getLaunchLeader = (rowData: any) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <span>{rowData.data?.PlanOwner?.Title}</span>
            </div>
        )
    }
    // get Dropdown options for Admin tab
    // public getProposedKeyFromInterface = async (GOLDMolecule, GOLDLabelName) => {
    //     // console.log("Val",GOLDMolecule,GOLDLabelName);
    //     const CaseMolecule = GOLDMolecule?.toLowerCase();
    //     await DataService.getTopOneItem('GOLD_ProductLaunch_Interface', '*',
    //         `FK_Molecule_BK eq '${CaseMolecule}'`, 'ID').then(async res => {
    //             console.log("getTopOneItem", res);
    //             if (res) {
    //                 const obj = this.state.ProposedGRPOptions?.find((item) => item.Key == res[0]?.ProposedGRPKey);
    //                 if (obj) {
    //                     this.setState({ SelectedGRP: obj?.keyValue });
    //                     // this.getAdminDropdownOption(obj?.keyValue);
    //                 }
    //             }

    //         });
    // }
    public getPreSelectedBuAndSubBu = (SelectedLabel) => {
        const selectedObj = this.state.LabelNameOptions?.find((item) => item.keyValue === SelectedLabel);
        if (selectedObj) {
            let BUKey = selectedObj?.BUkey;
            let SubBuKey = selectedObj?.SubBuKey;
            const BUObj = this.state.BUOptions?.find((item) => item.Key === BUKey);
            if (BUObj) {
                this.setState({ SelectedBU: BUObj?.keyValue });
            }
            const SubBuObj = this.state.SubBUOptions?.find((item) => item.Key === SubBuKey);
            if (SubBuObj) {
                this.setState({ SelectedSubBU: SubBuObj?.keyValue });
            }
        }
    }
    public getBUAndSubBuOptions = async () => {
        if (DataService.environment == 'DEV') {
            const MasterData = DataService.fetchAllDRListItemsWithFilters('MasterDataNew', 'Title,TypeValue,TypeCode,TypeId/Title,ParentCategoryId,IsActive,Id',
                `TypeId eq '3' or TypeId eq '26' `, 'TypeId', 'TypeValue asc,TypeValue')
            Promise.all([MasterData]).then((responses) => {
                let MasterDataNewlst = responses[0];
                let SubBU = MasterDataNewlst.filter(a => a.TypeId.Title == 'Sub Business Unit' && a.IsActive == true);
                let BU = MasterDataNewlst.filter(a => a.TypeId.Title == 'BU' && a.IsActive == true);
                const BUArray = BU?.map((item: any) => ({
                    Key: item?.TypeCode,
                    Value: item?.TypeValue,
                    keyValue: `${item?.TypeCode}->${item?.TypeValue}`
                }));
                this.setState({ BUOptions: BUArray });
                const SubBUArray = SubBU?.map((item: any) => ({
                    Key: item?.TypeCode,
                    Value: item?.TypeValue,
                    keyValue: `${item?.TypeCode}->${item?.TypeValue}`
                }));
                this.setState({ SubBUOptions: SubBUArray });
            });
        } else {
            const MasterData = DataService.fetchAllDRListItemsWithFilters('MasterDataNew', 'Title,TypeValue,TypeCode,TypeId/Title,ParentCategoryId,IsActive,Id',
                `TypeId eq '26' or TypeId eq '4' `, 'TypeId', 'TypeValue asc,TypeValue')
            Promise.all([MasterData]).then((responses) => {
                let MasterDataNewlst = responses[0];
                let SubBU = MasterDataNewlst.filter(a => a.TypeId.Title == 'Sub Business Unit' && a.IsActive == true);
                let BU = MasterDataNewlst.filter(a => a.TypeId.Title == 'BU' && a.IsActive == true);
                const BUArray = BU?.map((item: any) => ({
                    Key: item?.TypeCode,
                    Value: item?.TypeValue,
                    keyValue: `${item?.TypeCode}->${item?.TypeValue}`
                }));
                this.setState({ BUOptions: BUArray });
                const SubBUArray = SubBU?.map((item: any) => ({
                    Key: item?.TypeCode,
                    Value: item?.TypeValue,
                    keyValue: `${item?.TypeCode}->${item?.TypeValue}`
                }));
                this.setState({ SubBUOptions: SubBUArray });
                console.log("SubBUArray", SubBUArray);
            });
        }

    }

    public getDataFromInterface = async (GOLDId, GrpKey, MolKey, LabelKey) => {
        await DataService.fetchAllItemsGenericFilter('GOLD_ProductLaunch_Interface', '',
            `IDPrimary eq '${GOLDId}'`, '').then(res => {
                console.log("getDataFromInterface", res);
                if ((GrpKey && MolKey) || res[0].ProposedGRPKey === null && res[0].ProposedMoleculeKey === null && res[0].ProposedLabelKey === null) {
                    this.getConfirmedPreSelectedValues(GrpKey, MolKey, LabelKey);
                } else {
                    const GRPKeyArray = res[0]?.ProposedGRPKey?.indexOf(";") !== -1 ? res[0]?.ProposedGRPKey?.split(";") : res[0]?.ProposedGRPKey;
                    let GRPfilteredData = this.state.ProposedGRPOptions?.filter(item => GRPKeyArray?.indexOf(item.Key) !== -1);
                    if (GRPfilteredData?.length > 0) {
                        this.setState({ SelectedGRP: GRPfilteredData[0]?.keyValue });
                        this.getAdminDropdownOption(GRPfilteredData[0]?.keyValue);
                    }
                    const MoleculeKeyArray = res[0]?.ProposedMoleculeKey?.indexOf(";") !== -1 ? res[0]?.ProposedMoleculeKey?.split(";") : res[0]?.ProposedMoleculeKey;
                    let MoleculefilteredData = this.state.MoleculeAPIOptions?.filter(item => MoleculeKeyArray?.indexOf(item.Key) !== -1);
                    console.log("MoleculefilteredData", MoleculefilteredData);
                    this.setState({ MoleculeAPIOptions: MoleculefilteredData, SelectedMoleculeAPI: MoleculefilteredData[0]?.keyValue });

                    const LabelKeyArray = res[0]?.ProposedLabelKey?.indexOf(";") !== -1 ? res[0]?.ProposedLabelKey?.split(";") : res[0]?.ProposedLabelKey;
                    let LabelFilteredData = this.state.LabelNameOptions?.filter(item => LabelKeyArray?.indexOf(item.Key) !== -1);
                    console.log("LabelFilteredData", LabelFilteredData);
                    this.setState({ LabelNameOptions: LabelFilteredData, SelectedLabelname: LabelFilteredData[0]?.keyValue });

                }
            });
    }
    public getConfirmedPreSelectedValues = (grpKey, Molkey, labelkey) => {
        let GRPfilteredData = this.state.ProposedGRPOptions?.filter(item => item.Key === grpKey);
        if (GRPfilteredData?.length > 0) {
            this.setState({ SelectedGRP: GRPfilteredData[0]?.keyValue });
        }
        let MoleculefilteredData = this.state.MoleculeAPIOptions?.filter(item => item.Key === Molkey);
        this.setState({ SelectedMoleculeAPI: MoleculefilteredData[0]?.keyValue });

        let LabelFilteredData = this.state.LabelNameOptions?.filter(item => item.Key === labelkey);
        this.setState({ SelectedLabelname: LabelFilteredData[0]?.keyValue });
        this.getPreSelectedBuAndSubBu(LabelFilteredData[0]?.keyValue);
    }

    public getAdminDropdownOption = async (value) => {
        this.setState({ isLoading: true });
        this.setState({
            MoleculeAPIOptions: [],
            LabelNameOptions: [],
            SelectedMoleculeAPI: '',
            SelectedLabelname: '',
            SelectedBU: '',
            SelectedSubBU: '',
            SelectedLabelForNewIDOps: '',
            SelectedMoleculeForNewIDOps: null,
            SelectedGRPForNewID: ''
        })
        let key = value?.split("->")[0];
        this.setState({ SelectedGRP: value, SelectedGRPForNewID: value });
        let APIkeysArray = [];

        await DataService.fetchAllItemsGenericFilter('ApiMaster', 'Title,ProposedGRP,Active',
            `ProposedGRP eq '${key}' and Active eq 1`, null).then(res1 => {
                APIkeysArray = res1?.map((item) => item?.Title);
            });


        const keyFilter = APIkeysArray?.map(key => `Key eq '${key}'`).join(" or ");
        const filterQuery = `(${keyFilter}) and SourceType eq 'Molecule' and IsActive eq 1`;

        await DataService.fetchAllItemsGenericFilter('LoVMaster', 'Key,Value',
            filterQuery, null).then(res2 => {
                const MoleculeArray = res2?.map((item: any) => ({
                    Key: item?.Key,
                    Value: item?.Value,
                    keyValue: `${item?.Key}->${item?.Value}`
                }));
                this.setState({ MoleculeAPIOptions: MoleculeArray });
                const matchedMoleculeObj = MoleculeArray?.find((obj) => obj?.Value?.toLowerCase().includes(this.state.SelectedGOLDStgData?.Molecule.toLowerCase()));
                if (matchedMoleculeObj) {
                    this.setState({ SelectedMoleculeAPI: matchedMoleculeObj?.keyValue, SelectedMoleculeForNewIDOps: matchedMoleculeObj?.keyValue });
                } else {
                    this.setState({ SelectedMoleculeAPI: MoleculeArray[0]?.keyValue, SelectedMoleculeForNewIDOps: MoleculeArray[0]?.keyValue });
                }
            });
        const labelfilterQuery = `GRPCode eq '${key}' and Active eq 1 and LabelText ne null`
        await DataService.fetchAllItemsGenericFilter('MultiLabelMaster', 'ID,LabelKey,LabelText,SubBusinessUnit,BusinessUnit',
            labelfilterQuery, null).then(async res2 => {
                if (!res2) {
                    await DataService.fetchAllItemsGenericFilter('MultiLabelMaster', 'ID,LabelKey,LabelText,SubBusinessUnit,BusinessUnit', 'Active eq 1 and LabelText ne null', null).then(res3 => {
                        const LabelArray = res2?.map((item: any) => ({
                            Key: item?.LabelKey,
                            Value: item?.LabelText,
                            keyValue: `${item?.LabelKey}->${item?.LabelText}`,
                            BUkey: item?.BusinessUnit,
                            SubBuKey: item?.SubBusinessUnit,
                            Id: item?.ID
                        }));
                        this.setState({ LabelNameOptions: LabelArray });
                    })
                } else {
                    const LabelArray = res2?.map((item: any) => ({
                        Key: item?.LabelKey,
                        Value: item?.LabelText,
                        keyValue: `${item?.LabelKey}->${item?.LabelText}`,
                        BUkey: item?.BusinessUnit,
                        SubBuKey: item?.SubBusinessUnit,
                        Id: item?.ID
                    }));
                    this.setState({ LabelNameOptions: LabelArray });
                    const matchedLabelObj = LabelArray?.find((obj) => obj?.Value?.toLowerCase().includes(this.state.SelectedGOLDStgData?.TradeName?.toLowerCase()));
                    if (matchedLabelObj) {
                        this.setState({ SelectedLabelname: matchedLabelObj?.keyValue, SelectedLabelForNewIDOps: matchedLabelObj?.keyValue });
                        this.getPreSelectedBuAndSubBu(matchedLabelObj?.keyValue);
                    } else {
                        this.setState({ SelectedLabelname: LabelArray[0]?.keyValue, SelectedLabelForNewIDOps: LabelArray[0]?.keyValue });
                        this.getPreSelectedBuAndSubBu(LabelArray[0]?.keyValue);
                    }
                }
            });
        setTimeout(() => { this.setState({ isLoading: false }) }, 1000);
    }

    public getGRPOptions = async () => {
        let res1 = [];
        let res2 = [];
        let res0 = [];

        let ress4 = [];
        // let ress6 = [];
        let ress7 = [];

        await DataService.fetchAllItemsGenericFilter('LoVMaster', 'Key,Value',
            `GroupSet eq 'GRPGroup1' and IsActive eq 1 and SourceType eq 'ProposedGRP'`, 'Key').then(res => {
                res1 = res;
            });
        await DataService.fetchAllItemsGenericFilter('LoVMaster', 'Key,Value',
            `GroupSet eq 'GRPGroup2' and IsActive eq 1 and SourceType eq 'ProposedGRP'`, 'Key').then(res3 => {
                res2 = res3;
            });


        await DataService.fetchAllItemsGenericFilter('LoVMaster', 'Key,Value',
            `SourceType eq 'Molecule' and IsActive eq 1`, 'Key').then(res4 => {
                ress4 = res4;
            });
        await DataService.fetchAllItemsGenericFilter('LoVMaster', 'Key,Value',
            `SourceType eq 'LabelName' and IsActive eq 1`, 'Key').then(res7 => {
                ress7 = res7;
            });
        // await DataService.fetchAllDRListItemsWithFilters('MultiLabelMaster', '*',
        //     `LabelText ne '' and LabelText ne null and Active eq 1`, '', null).then(res6 => {
        //         ress6 = res6;
        //     });

        await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_To_DR_GRP', 'GRPKey,GRPValue',
            ``, '').then(res8 => {
                res0 = res8;
            });
        let results = [...res1, ...res2];
        const GRPArray = results?.map((item: any) => ({
            Key: item?.Key,
            Value: item?.Value,
            keyValue: `${item?.Key}->${item?.Value}`
        }));
        const MoleculeArray = ress4?.map((item: any) => ({
            Key: item?.Key,
            Value: item?.Value,
            keyValue: `${item?.Key}->${item?.Value}`
        }));
        // const LabelArray = ress6?.map((item: any) => ({
        //     Key: item?.LabelKey,
        //     Value: item?.LabelText,
        //     keyValue: `${item?.LabelKey}->${item?.LabelText}`
        // }));
        const LabelArray7 = ress7?.map((item: any) => ({
            Key: item?.Key,
            Value: item?.Value,
            keyValue: `${item?.Key}->${item?.Value}`
        }));
        const GRPArray1 = res0?.map((item: any) => ({
            Key: item?.GRPKey,
            Value: item?.GRPValue,
            keyValue: `${item?.GRPKey}->${item?.GRPValue}`
        }));
        this.setState({ ProposedGRPOptions: GRPArray, ProposedGRPOptionsInterface: GRPArray1, MoleculeAPIOptions: MoleculeArray, LabelNameOptions: LabelArray7 });
    }


    public AIActionlink = async (type, e) => {
        // await this.getProposedKeyFromInterface(e?.Molecule, e?.TradeName);

        await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_To_DR_GRP', '*', `Molecule eq '${e?.Molecule}'`, null).then(res => {
            if (res?.length === 0) {
                this.setState({ moleculeExisted: false })
            } else {
                if (!(res?.[0]?.GRPKey && res?.[0]?.GRPValue && res?.[0]?.isConfirmed)) {
                    this.setState({ moleculeExisted: false })
                } else {
                    this.setState({ moleculeExisted: true })
                }
            }
        });
        await DataService.fetchAllItemsGenericFilter('GOLD-Molecule_TO_DR_MoleculeAPI', '*', `GOLDMolecule eq '${e?.Molecule}'`, null).then(async res => {
            await DataService.fetchAllItemsGenericFilter('APIMaster', '*', `Title eq '${res?.[0]?.MoleculeKey}'`, null).then(res2 => {
                if (res2?.length > 0) {
                    const GRPKeyArray = res2?.[0]?.ProposedGRP;
                    let GRPfilteredData = this.state.ProposedGRPOptions?.filter(item => GRPKeyArray?.indexOf(item.Key) !== -1);
                    //const ArrayVal= Object.values(filteredData);
                    console.log("GRPfilteredData", GRPfilteredData);
                    if (GRPfilteredData?.length > 0) {
                        if (GRPfilteredData?.[0]?.keyValue) {
                            this.setState({ SelectedGRPForNewID: GRPfilteredData[0]?.keyValue });
                            this.getAdminDropdownOption(GRPfilteredData[0]?.keyValue);
                        }
                    }
                }
            })
        })

        this.setState({
            SelectedGOLDStgData: e,
            showAIAssestPopup: true,
            SelectedAIMode: type,
            selectedDRID: '',
            // MoleculeAPIOptions: [],
            // LabelNameOptions: [],
            SelectedMoleculeAPI: '',
            SelectedLabelname: '',
            SelectedBU: '',
            SelectedSubBU: '',
            SelectedMoleculeForNewIDOps: null,
            SelectedLabelForNewIDOps: '',
            pTitleForDR: e?.Molecule + '-GOLD',
            showLinkAndCreateIDPop: this.state.moleculeExisted ? true : false,
            SelectedRadioOption: null,
            linkOrCreateDR: e.IntegrationStatus === 'Assigned' || e.IntegrationStatus === 'Processed' ? 'linkDR' : null
        });
        this.getProjectDetailsListData(e.MappedDRID);

        if (e?.GOLD_IDPrimary !== null && this.state.moleculeExisted) {
            await this.getDataFromInterface(e?.GOLD_IDPrimary, e?.ProposedGRPKey, e?.ProposedMoleculeKey, e?.ProposedLabelKey);
        }

        // await DataService.fetchAllItemsGenericFilter('LoVMaster', 'Key,Value',
        //     `IsActive eq 1 and SourceType eq 'ProposedGRP'`, 'Key').then(res => {
        //         console.log(res)
        //     });
    }
    public CheckTemplates = async (data) => {
        let TemplateFound = false;
        await DataService.fetchAllDRListItemsWithFilters('DLPPList', `ID,DRID,DLPPManaged,Template,Country,LaunchProgress,ProjectName,PlanExistURL,PlanOwner/Title,PlanOwner/Id,PlanOwner/EMail`,
            `DRID eq '${data?.MappedDRID}'`, 'PlanOwner', null).then(res => {
                const templateRes = res?.filter((item) => (this.state.GOLDConfigData?.indexOf(item?.Template) !== -1  &&
                (data?.ProposedCountryCode == (item?.Country?.indexOf('->') !== -1 ? item?.Country?.split('->')[0]?.trim() : ''))
                 && (item.LaunchProgress !== "Cancelled")));
                const mappedRes = templateRes?.map(obj => ({
                    ...obj,
                    PTitle: obj?.PlanOwner?.Title,
                    PEmail: obj?.PlanOwner?.EMail
                }));
                // console.log("CheckTemplates",templateRes,mappedRes);
                if (mappedRes?.length > 0) {
                    TemplateFound = true;
                    this.setState({ OtherTemplateRecs: mappedRes, showOtherTemplatePopup: true });
                } else {
                    TemplateFound = false;
                    this.setState({ showOtherTemplatePopup: false });
                }
            });
        return TemplateFound;
    }
    public GOLDActionlink = async (type, e, show) => {
        this.setState({ SelectedGOLDTabMode: type, GoldTabID: e?.Id, MarketGridDataArray: [],MarketGridDataArrayCopy:[], CountryMarketRegionMap: [], selectedGOLDTabRec: e, MatchedDRIDData: [], SelectedPlan: [], showOtherTemplatePopup: false, OtherTemplateRecs: [], ShowDRIDMatchPopupWarning: false, SelectedPlanId: null });
        this.CheckTemplates(e).then(async res => {
            if (!res) {
                let data = [];
                let items = [];
                if (!show) {
                    const items1 = await DataService.fetchAllItemsGenericFilter("Z_NPL_GOLD_Staging_List", '*', `IsActive eq 1 and MappedDRID eq '${e.MappedDRID}' and Country eq '${e.Country}' and IsPlanExist ne 'Yes' and IsMerged ne 1 and (IntegrationStatus eq 'Assigned' or IntegrationStatus eq 'Published')`, null);
                    //console.log("Itemsss",items);
                    items = items1;
                }
                if (items?.length > 1) {
                    this.setState({ ShowCoutryDRIDMatchPopup: true, CountryDRIDMatchData: items, showMarketPopUp: false });
                } else {

                    if (!show) {
                        await DataService.fetchAllDRListItemsWithFilters('DLPPList', `ID,DRID,DLPPManaged,Country,ProjectName,Indication,PlanStatus`,
                            `(DRID eq '${e?.MappedDRID}' and (Template eq 'GSC_Cat3-4' or Template eq 'SIQ Managed'))`, '', null).then(res => {
                                const matchedRec = res?.filter((item) => {
                                    const countryKey = item?.Country?.indexOf('->') !== -1 ? item?.Country?.split('->')[0]?.trim() : '';
                                    return countryKey === e.ProposedCountryCode;
                                });
                                data = matchedRec;
                                // console.log("DLPPMatch",matchedRec);
                                this.setState({ MatchedDRIDData: matchedRec });
                            });
                    }
                    if (data?.length > 0) {
                        this.setState({ ShowDRIDMatchPopup: true });
                    } else {
                        this.setState({ GOLDTabDRID: e?.MappedDRID, GOLDTabCountry: e?.Country });
                        this.setState((prev) => ({
                            MarketData: {
                                ...prev.MarketData,
                                DLPPManaged: 'No',
                                Country: this.state.SimilarCountriesArray,
                                LaunchLeaderTitle: this.props?.currentUser?.Email ? this.props?.currentUser?.Email : [],
                                LaunchLeader: this.props?.currentUser?.Id ? this.props?.currentUser?.Id : null,
                                LaunchChar: '02->Market Expansion',
                                Priority: '03->Must Win'
                            }
                        }));
                        this.getProjectDetailsListDataForSelectedDRID(e?.MappedDRID, 'GOLD');
                        this.getCountries(e?.MappedDRID, e.Indication);
                        await this.getDLPPforSelectedDRID(e?.MappedDRID);
                    }
                }
            }
        });

    }
    public getDLPPforSelectedDRID = async (DRID) => {
        this.setState({ DLPPDataForSelectedDRID: [] });
        await DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,
        *,PlanOwner/Title,PlanOwner/Id,MarketPlanner/Title,MarketPlannerSupervisor/Title,RegionalSupplyLeader/Title,AboveMarketPlanner/Title,AboveMarketPlannerSupervisor/Title,
        MarketPlanner/Id,MarketPlannerSupervisor/Id,RegionalSupplyLeader/Id,AboveMarketPlanner/Id,AboveMarketPlannerSupervisor/Id`,
            `DRID eq '${DRID}'`, 'PGSReadiness').then(res => {
                if (res?.length > 0) {
                    // console.log("getDLPPforSelectedDRID",res);
                    this.setState({ DLPPDataForSelectedDRID: res });
                }
                //  console.log(res);
            });
    }


    // public MappingDRTemplate =(e:any)=>{
    //     console.log("MappingDRTemplate",e);
    // }


    //IPORTActionCol Added by Arpita
    public IPORTActionCol(rowData: any) {
        return (
            <>
                <div>
                    <img title="View" alt="Card" src={view} onClick={(e) => this.IportActionlink('View', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    {true && <img title="Edit" alt="Card" src={edit} onClick={(e) => this.IportActionlink('Edit', rowData)} style={{ cursor: "pointer " }} />}
                </div>
            </>
        );
    }

    public ActionColumn(rowData: any, dataType: string) {
        if (dataType == "Choice") {
            //  console.log(rowData.data.ReasonCodeText); // value={rowData.data.ReasonCodeText}
            return (
                <div>

                    <Dropdown onChange={(e) => this.onDropdownChanged(e, rowData)} options={this.state.reasonChangeOptions} optionValue='code' optionLabel="name"
                        placeholder="Select a Reason" className="w-full md:w-14rem" />
                </div>
            );
        }
        if (dataType == "Checkbox") {
            return (

                <Checkbox checked={rowData.data.LaunchLeadVerified} onChange={e => this.VerfiedOnchange(e, rowData)} ></Checkbox>

            );
        }
        if (dataType == "Multiline") {
            return (
                <div>
                    {/* <InputText value={rowData.data.Notes} onBlur={e => this.NotesOnchange(e, rowData)} /> */}
                    <InputTextarea rows={1} cols={30} onBlur={e => this.NotesOnchange(e, rowData)} />
                </div>
            );
        }
        if (dataType == "Icon") {
            return (
                // <Button label="Show" icon="pi pi-external-link" onClick={e => this.commentsHistoryOnchange(e, rowData)} />
                <i className="pi pi-history" style={{ cursor: 'pointer' }} onClick={e => this.commentsHistoryOnchange(e, rowData)}></i>
            );
        }

    }

    protected onDropdownChanged = async (e: any, prmRowData) => {
        let planViewData = this.state.planViewRecordsArray;
        let filteredIndex = planViewData.findIndex(item => item.ID == prmRowData.data.ID);
        planViewData[filteredIndex]['ReasonCodeText'] = e.value;
        //let reasoncodeLookupId  = "";
        let reasonLookupId = await DataService.getReasoncodeLookupId('PGS_ReadinessVerification_Dict_ReasonCodes', e.value);
        // .then(res => {

        // });
        // console.log(reasonLookupId);
        // const updateMetadata = JSON.stringify({
        //     "__metadata": { type: "SP.Data.PGS_x005f_Common_x005f_ProjectListListItem" },
        //     ReasonCodeText: e.value, 
        //     ReasonCodeLookUpId: reasonLookupId
        // })
        // const updateMetadata = {           
        //     ReasonCodeText: e.value, 
        //     ReasonCodeLookUpId: reasonLookupId
        // };
        let lookupValues: number[] = [];
        lookupValues.push(reasonLookupId);

        // let updateData = JSON.stringify({
        //     "__metadata": { type: "SP.Data.PGS_x005f_Common_x005f_ProjectListListItem" },
        //     ReasonCodeText: e.value,
        //     ReasonCodeLookUpId: { results: lookupValues }
        // });
        // { ReasonCodeLookUpId: {results: lookupValues}, ReasonCodeText: e.value }
        await DataService.updateItemsInList('PGS_Common_ProjectList', prmRowData.data.ID, { ReasonCodeLookUpId: { results: lookupValues } }).then(res => {
            console.log('data updated successfully!');
            this.setState({ planViewRecordsArray: planViewData });
            this.toast.show({ severity: 'info', summary: 'Info Message', detail: 'data updated successfully!', life: 4000 })
        });
    }

    protected VerfiedOnchange = async (e: any, prmRowData) => {
        let planViewData = this.state.planViewRecordsArray;
        let filteredIndex = planViewData.findIndex(item => item.ID == prmRowData.data.ID);
        planViewData[filteredIndex]['LaunchLeadVerified'] = e.checked;
        await DataService.updateItemsInList('PGS_Common_ProjectList', prmRowData.data.ID, { LaunchLeadVerified: e.checked }).then(res => {
            console.log('data updated successfully!');
            this.setState({ planViewRecordsArray: planViewData });
            this.toast.show({ severity: 'info', summary: 'Info Message', detail: 'data updated successfully!', life: 4000 })
        });
    }

    protected NotesOnchange = async (e: any, prmRowData) => {
        if (e.target.value != null && e.target.value != "" && e.target.value != undefined) {
            let planViewData = this.state.planViewRecordsArray;
            let filteredIndex = planViewData.findIndex(item => item.ID == prmRowData.data.ID);
            planViewData[filteredIndex]['Notes'] = e.target.value;
            await DataService.updateItemsInList('PGS_Common_ProjectList', prmRowData.data.ID, { Notes: e.target.value }).then(res => {
                console.log('data updated successfully!');
                this.setState({ planViewRecordsArray: planViewData });
                this.toast.show({ severity: 'info', summary: 'Info Message', detail: 'data updated successfully!', life: 4000 })
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

        }
    }

    //Arpita
    public IportActionlink = (type, e) => {
        this.setState({
            SelectedIportMode: type,
            SelectedIportData: e.data,
            showIportEditDialog: true,
            SelectedPlaniswareId: (e.data.PlaniswareID).substring(0, 4)
        })
    }

    public Actionlink = (type, e) => {
        if (type === 'Delete') {
            //this.deleteProductRecord(e);
        } else {
            let programName;
            if (e.data.IsAutomated) programName = e.data.ProductShortDesc?.length > 120 ? e.data.CompoundName : e.data.ProductShortDesc;
            else programName = e.data.ShortDesc?.length > 120 ? e.data.CompoundName : e.data.ShortDesc;
            if (programName == null || programName == undefined || programName == '')
                programName = '';
            else programName = " : " + programName;
            this.setState({ formType: type, rowID: e.data.Id, drid: e.data.DRID, SelectedProductName: e.data.ProductDescription + programName });
            let viewCateg = this.state.checked1;
            if (viewCateg) {
                viewCateg = "Plan View";
            }
            else {
                viewCateg = "Product View";
            }
            this.setState({
                showEditPlanDialog: true,
                Mode: type,
                SelectedView: viewCateg
            })
            this.selectedRowData = e.data;
        }
    }

    protected handleEditPlanDialogClose = async () => {
        this.setState({ showEditPlanDialog: false });
        this.getProductChecklist()
            .then(() => {

                let filtervalues = [];
                filtervalues = this.state['AllCatColVal']?.filter(val => (val.Title == 'Launch Lead' && (val.viewType == "Plan")));
                filtervalues = filtervalues.filter(ele => ele.text != 'All')?.sort((a, b) => a.actualValue?.toString().toLowerCase() > b.actualValue?.toString().toLowerCase() ? 1 : a.actualValue?.toString().toLowerCase() < b.actualValue?.toString().toLowerCase() ? -1 : 0);
                filtervalues?.length > 0 && filtervalues.unshift({ Title: filtervalues[0].Name, InternalGridColName: filtervalues[0].Name, id: filtervalues.length + 1, text: 'All', actualValue: 'All', viewType: "Both" });

                this.setState({
                    Navitem: filtervalues,
                });

                // this.getDropdownOptions()
            })
            .catch(e => console.log(e))
        this.setState({ autoOpenCreateRisk: false });
    }

    public showAllChange = async (e) => {
        try {
            this.dataGrid.instance.clearFilter();
            // re render ntreeview
            await this.renderLaunchLead(this.commonProjectListRef.current);
            await this.renderLaunchLeadProduct(this.projectDetailsListRef.current);
            await this.renderLaunchStatus(this.commonProjectListRef.current);
            await this.renderSubBusinessUnit(this.commonProjectListRef.current);
            await this.renderProductSubBusinessUnit(this.projectDetailsListRef.current);
            let arrayData = [...this.state.jsonDataArray];
            let arrayDataProduct = [...this.state.jsonDataArrayProduct];
            let jsonDataLaunchLeadObj = [...this.state.jsonDataLaunchLead];
            let jsonDataProductLaunchLeadObj = [...this.state.jsonDataProductLaunchLead];
            let jsonDataPlanLaunchStatusObj = [...this.state.jsonDataArrayLaunchStatus];
            // await this.setState({
            //     checked1: e.value,
            //     jsonDataArray: arrayData,
            //     jsonDataArrayProduct: arrayDataProduct,
            //     jsonDataLaunchLead: jsonDataLaunchLeadObj,
            //     jsonDataProductLaunchLead: jsonDataProductLaunchLeadObj,
            //     jsonDataPlanLaunchStatus: jsonDataPlanLaunchStatusObj,                               
            // });

            e.value == false ? this.toast?.show({ severity: 'info', summary: 'Info Message', detail: 'All the Product View programs are displayed', life: 4000 })
                : this.toast?.show({ severity: 'info', summary: 'Info Message', detail: 'All the Plan View programs are displayed', life: 4000 });
            let filtervalues = [];
            if (e.value == true) {
                let filterDropdownvalues = this.state.AllDropdownCategory.filter(val => (val.viewType == "Both" || val.viewType == "Plan")).map(
                    item => (item.Value));
                this.state.DropdownCategory = filterDropdownvalues;
                this.state.DropdownCategory = this.state.DropdownCategory.sort();
                filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == 'Launch Lead' && (val.viewType == "Plan")));
            } else {
                let filterDropdownvalues = this.state.AllDropdownCategory.filter(val => (val.viewType == "Both" || val.viewType == "Product")).map(
                    item => (item.Value));
                this.state.DropdownCategory = filterDropdownvalues;
                this.state.DropdownCategory = this.state.DropdownCategory.sort();
                filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == 'Launch Lead' && (val.viewType == "Product")));
            }
            filtervalues = filtervalues.filter(ele => ele.text != 'All')?.sort((a, b) => a.actualValue?.toString().toLowerCase() > b.actualValue?.toString().toLowerCase() ? 1 : a.actualValue?.toString().toLowerCase() < b.actualValue?.toString().toLowerCase() ? -1 : 0);
            filtervalues?.length > 0 && filtervalues.unshift({ Title: filtervalues[0].Name, InternalGridColName: filtervalues[0].Name, id: filtervalues.length + 1, text: 'All', actualValue: 'All', viewType: "Both" });
            await this.manageViews(e.value);
            // await this.setState({
            //     checked1: e.value,                              
            // });
            // let filterStatusValue = "";
            // if (this.state.ActiveIndex === 0) {
            //     filterStatusValue = 'Launch Lead';
            // }
            // else if (this.state.ActiveIndex === 1) {
            //     filterStatusValue = 'Launch Lead';
            // }
            // else if (this.state.ActiveIndex === 2) {
            //     filterStatusValue = 'Sub Business Unit';
            // }
            // else if (this.state.ActiveIndex === 3) {
            //     filterStatusValue = 'Sub Business Unit';
            // } else {

            // }

            await this.setState({
                checked1: e.value,
                filterStatus: 'Record Match', // Business Unit                
                DropdownCategory: this.state.DropdownCategory,
                Navitem: filtervalues,
                ActiveIndex: 0,
                jsonDataArray: arrayData,
                jsonDataArrayProduct: arrayDataProduct,
                jsonDataLaunchLead: jsonDataLaunchLeadObj,
                jsonDataProductLaunchLead: jsonDataProductLaunchLeadObj,
                jsonDataArrayLaunchStatus: jsonDataPlanLaunchStatusObj
            }, () => { console.log(this.state.checked1, this.state.jsonDataLaunchLead); console.log(this.state.jsonDataProductLaunchLead) });
            //this.forceUpdate();

        } catch (err) {
            setTimeout(() => { this.setState({ isLoading: false }); }, 100);
            let errorMsg = {
                Source: 'Main Product Grid-getDropdownOptions',
                Message: err.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    public nodeTemplate = (node: any) => {
        if (node.type === 'portfoliocategory') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <div style={{ height: '85px', width: '18rem', borderRadius: '10px', color: 'black', background: '#e2d5fd' }}>
                            <div style={{ fontSize: '1.5em' }}>Launch Portfolio</div>
                            <div>
                                <div style={{ marginBottom: '3px' }}>Assigned Programs : {node.data.products}</div>
                                <div style={{ marginBottom: '10px' }}>Total Launches : {node.data.launches}</div>

                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (node.type === 'category') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <div style={{}}>
                            <div style={{ marginBottom: '5px', color: 'black', fontWeight: 'bold' }}>{node.title}</div>
                            <Row style={{ height: 'auto', width: '9rem', background: node.colorcodelight, borderRadius: '10px', color: 'black' }}>
                                {/* <div style={{ marginTop: '5px', marginBottom: '10px' }}>{node.data.products}</div> */}
                                {this.state.checked1 != true ?
                                    <>
                                        <div style={{ marginTop: '5px', marginBottom: '5px' }}>{node.data.products} Products</div>
                                        <div className='roundBtnManage' style={{ marginBottom: '5px', backgroundColor: node.colorcode, cursor: 'pointer' }} onClick={e => this.filteredAssigned(node.buname, node.categoryName)}>{node.data.Assigned} Assigned</div>
                                        <div className='roundBtnManage' style={{ marginBottom: '10px', backgroundColor: node.colorcode, cursor: 'pointer' }} onClick={e => this.filteredUnAssigned(node.buname, node.categoryName)}>{node.data.UnAssigned} Un Assigned</div>
                                    </>
                                    : <div style={{ marginTop: '5px', marginBottom: '10px' }}>{node.data.products} Products</div>}
                            </Row>
                        </div>
                    </div >
                </div >
            );
        }
        if (node.type === 'PortfolioSubBUCategory') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <div style={{ height: '85px', width: '18rem', borderRadius: '10px', color: 'black', background: '#e2d5fd' }}>
                            <div style={{ fontSize: '1.5em' }}>Launch Portfolio</div>
                            <div>
                                <div style={{ marginBottom: '3px' }}>Assigned Programs : {node.data.products}</div>
                                {node.tabName != 'ProductLaunchLead' ?
                                    <div style={{ marginBottom: '10px' }}>Total Launches : {node.data.launches}</div>
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (node.type === 'Productcategory') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <div style={{ marginBottom: '5px', color: 'black', fontWeight: 'bold' }}>{node.title}</div>
                        <div className="card">
                            <Card title="">
                                <Button className='TreeViewbutton' style={{ borderRadius: '10px', minWidth: '8rem', background: node.colorcodelight, border: 'none', color: 'black', textAlign: 'left' }} onClick={e => this.filterSubBUAssigned(node.buname, node.categoryName)}>Programs : {node.data.products}</Button> <br />
                                <Button className='TreeViewbutton' style={{ margin: '0.5rem 0rem', borderRadius: '10px', minHeight: '3rem', minWidth: '8rem', background: node.colorcodelight, border: 'none', color: 'black', textAlign: 'left' }} onClick={e => this.filteredAssigned(node.buname, node.categoryName)}>Assigned : {node.data.Assigned}<br /> Launches : {node.data.launches}</Button> <br />
                                <Button className='TreeViewbutton' style={{ borderRadius: '10px', minHeight: '3rem', minWidth: '8rem', background: node.colorcodelight, border: 'none', color: 'black', textAlign: 'left' }} onClick={e => this.filteredUnAssigned(node.buname, node.categoryName)}>UnAssigned : {node.data.UnAssigned}<br /> Launches : {node.data.launchesUnAssigned}</Button>
                            </Card>
                        </div>
                    </div >
                </div >
            );
        }
        if (node.type === 'Plancategory') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <div style={{ marginBottom: '5px', color: 'black', fontWeight: 'bold' }}>{node.title}</div>
                        <Button disabled className='treebuttondisabled' style={{ borderRadius: '10px', minWidth: '8rem', background: node.colorcodelight, border: 'none', color: 'black' }} >Programs : {node.data.products}</Button>
                    </div >
                </div >
            );
        }
        if (node.type === "Subcategory") {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        {this.state.checked1 == true ?
                            <Button className='TreeViewbutton' style={{ borderRadius: '10px', minWidth: '8rem', background: node.colorcode, border: 'none', color: 'black' }} onClick={e => this.filteredLaunches(node.data.title, node.categoryName)}>Launches : {node.data.launches}</Button>
                            :
                            <Button className='TreeViewbutton' style={{ borderRadius: '10px', minWidth: '8rem', background: node.colorcode, border: 'none', color: 'black' }} >Launches : {node.data.launches}</Button>
                        }
                    </div>
                </div>
            );
        }
        if (node.type === "PlanSubcategory") {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <Button className='TreeViewbutton' style={{ borderRadius: '10px', minWidth: '8rem', background: node.data.colorcode, border: 'none', color: 'black' }} onClick={e => this.filteredLaunches(node.data.title, node.categoryName)}>Launches : {node.data.launches}</Button>
                    </div>
                </div>
            );
        }

        if (node.type === "LeadCategory") {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        {/* <div style={{}}>                           
                            <div style={{ marginBottom: '5px', color: 'black' }}>{node.title}</div>
                            <Row style={{ height: 'auto', background: '#e2d5fd', borderRadius: '10px', color: 'black' }}>
                                <div style={{ cursor: 'pointer' }} onClick={e => this.filteredLaunchLead(node.title, node.categoryName)}>
                                    {this.state.checked1 != true ?
                                        <div style={{ marginTop: '5px', marginBottom: '5px' }}>{node.data.products} Products</div>
                                        : null}
                                    {this.state.checked1 == true ? <div style={{ marginBottom: '5px' }}>{node.data.launches} Launches</div> : null}
                                </div>
                            </Row>
                        </div> */}
                        <div style={{ marginBottom: '5px', color: 'black', fontWeight: 'bold' }}>{node.title}</div>
                        {this.state.checked1 != true ?
                            <Button className='TreeViewbutton' style={{ borderRadius: '10px', minWidth: '8rem', background: node.colorcode, border: 'none', color: 'black', textAlign: 'left' }} onClick={e => this.filteredLaunchLead(node.title, node.categoryName)}> Programs : {node.data.Assignedprograms} <br /> Programs : {node.data.UnAssignedPrograms}</Button> : null}
                        {this.state.checked1 == true ? <Button className='TreeViewbutton' style={{ borderRadius: '10px', minWidth: '8rem', background: node.colorcode, border: 'none', color: 'black', textAlign: 'left' }} onClick={e => this.filteredLaunchLead(node.title, node.categoryName)}>Launches : {node.data.launches}</Button> : null}
                    </div>
                </div >
            );
        }
        if (node.type === "ProductLeadCategory") {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <div style={{ marginBottom: '5px', color: 'black', fontWeight: 'bold' }}>{node.title}</div>
                        <Button className='TreeViewbutton' style={{ borderRadius: '10px', minHeight: '4rem', minWidth: '8rem', background: node.colorcode, border: 'none', color: 'black', textAlign: 'left' }} onClick={e => this.filteredLaunchLead(node.title, node.categoryName)}> Assigned : {node.data.Assignedprograms} <br /> UnAssigned : {node.data.UnAssignedPrograms}</Button>
                    </div>
                </div >
            );
        }
        if (node.type === 'LaunchStatus') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        <div style={{ marginBottom: '5px', color: 'black', fontWeight: 'bold' }}>{node.title}</div>
                        <Button className='TreeViewbutton' style={{ borderRadius: '10px', minWidth: '8rem', background: node.colorcode, border: 'none', color: 'black' }} onClick={e => this.filteredLaunchStatus(node.title, node.categoryName)}>Launches : {node.data.launches}</Button>
                    </div>
                </div>
            );
        }
        return node.label;
    };

    public filterSubBUAssigned = (prmBu, prmCategoryName) => {
        try {
            const dataGrid = this.dataGrid.instance;
            if (prmBu === "Blanks" || prmBu === undefined || prmBu === null || prmBu === "") {
                prmBu = null;
            }
            if (this.state.checked1) {
                this.toast?.show({ severity: 'info', summary: 'Info Message', detail: 'Please switch to Product view to get the filtred results', life: 4000 });
            }
            else if (this.state.checked1 === false) {
                if (this.state.IsMultiCategoryEnbaled === false) {
                    if (this.state.selectednavitem === null) {
                        dataGrid?.filter([["Sub Business Unit", '=', prmBu]]);
                    }
                    if (this.state.selectednavitem != null) {
                        if (prmCategoryName === this.state.selectednavitem["Title"]) {
                            dataGrid?.filter([["Sub Business Unit", '=', prmBu]]);
                        }
                        else if (prmCategoryName != this.state.selectednavitem["Title"]) {
                            dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]]);
                        }
                    }
                }
                else if (this.state.IsMultiCategoryEnbaled === true) {
                    if (this.state.selectednavitem?.length > 1) {
                        let selectedNav = [...this.state.selectednavitem];
                        let loopFilter = [];
                        selectedNav?.map((ele, index) => {
                            loopFilter.push([ele?.InternalGridColName, '=', ele?.actualValue], 'or');
                        });
                        dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", loopFilter]);

                    } else {
                        if (this.state.selectednavitem != null && this.state.selectednavitem != undefined) {
                            dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]]);
                        } else {
                            dataGrid?.filter([['Sub Business Unit', '=', prmBu]]);
                        }
                    }
                }
            }
            else {
                console.log(prmBu);
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

    public filteredAssigned = (prmBu, prmCategoryName) => {
        try {
            const dataGrid = this.dataGrid.instance;
            if (prmBu === "Blanks" || prmBu === undefined || prmBu === null || prmBu === "") {
                prmBu = null;
            }
            if (this.state.checked1) {
                this.toast?.show({ severity: 'info', summary: 'Info Message', detail: 'Please switch to Product view to get the filtred results', life: 4000 });
            }
            else if (this.state.checked1 === false) {
                //dataGrid?.filter([["Sub Business Unit", '=', prmBu], "and", ["Launch Lead", '<>', null]]);                
                if (this.state.IsMultiCategoryEnbaled === false) {
                    if (this.state.selectednavitem === null) {
                        dataGrid?.filter([["Sub Business Unit", '=', prmBu], "and", ["Launch Lead", '<>', null], "and", ["Launches#", '<>', ""]]);
                    }
                    if (this.state.selectednavitem != null) {
                        if (prmCategoryName === this.state.selectednavitem["Title"]) {
                            dataGrid?.filter([["Sub Business Unit", '=', prmBu], "and", ["Launch Lead", '<>', null], "and", ["Launches#", '<>', ""]]);
                        }
                        else if (prmCategoryName != this.state.selectednavitem["Title"]) {
                            dataGrid?.filter([[['Sub Business Unit', '=', prmBu], "and", ["Launch Lead", '<>', null]], "and", ["Launches#", '<>', ""], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]]);
                        }
                    }
                }
                else if (this.state.IsMultiCategoryEnbaled === true) {
                    if (this.state.selectednavitem?.length > 1) {
                        let selectedNav = [...this.state.selectednavitem];
                        let loopFilter = [];
                        selectedNav?.map((ele, index) => {
                            loopFilter.push([ele?.InternalGridColName, '=', ele?.actualValue], 'or');
                        });
                        dataGrid?.filter([[['Sub Business Unit', '=', prmBu], "and", ["Launch Lead", '<>', null]], "and", ["Launches#", '<>', ""], "and", loopFilter]);

                    } else {
                        //dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [this.state.selectednavitem[0]["Title"], '=', this.state.selectednavitem[0]["actualValue"]]]);
                        if (this.state.selectednavitem != null && this.state.selectednavitem != undefined) {
                            dataGrid?.filter([[['Sub Business Unit', '=', prmBu], "and", ["Launch Lead", '<>', null]], "and", ["Launches#", '<>', ""], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]]);
                        } else {
                            dataGrid?.filter([[['Sub Business Unit', '=', prmBu], "and", ["Launch Lead", '<>', null], "and", ["Launches#", '<>', ""]]]);
                        }
                    }
                }
            }
            else {
                console.log(prmBu);
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

    public filteredUnAssigned = (prmBu, prmCategoryName) => {
        try {
            const dataGrid = this.dataGrid.instance;
            if (this.state.checked1) {
                this.toast?.show({ severity: 'info', summary: 'Info Message', detail: 'Please switch to Product view to get the filtred results', life: 4000 });
            }
            else if (this.state.checked1 === false) {
                //dataGrid?.filter([["Sub Business Unit", '=', prmBu], "and", ["Launch Lead", '=', null]]);

                if (this.state.IsMultiCategoryEnbaled === false) {
                    if (this.state.selectednavitem === null) {
                        dataGrid?.filter([["Sub Business Unit", '=', prmBu], "and", [["Launches#", '=', ""], "or", ["Launch Lead", '=', null]]]);
                    }
                    if (this.state.selectednavitem != null) {
                        if (prmCategoryName === this.state.selectednavitem["Title"]) {
                            dataGrid?.filter([["Sub Business Unit", '=', prmBu], "and", [["Launches#", '=', ""], "or", ["Launch Lead", '=', null]]]);
                        }
                        else if (prmCategoryName != this.state.selectednavitem["Title"]) {
                            dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [["Launches#", '=', ""], "or", ["Launch Lead", '=', null]], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]]);
                        }
                    }
                }
                else if (this.state.IsMultiCategoryEnbaled === true) {
                    if (this.state.selectednavitem?.length > 1) {
                        let selectedNav = [...this.state.selectednavitem];
                        let loopFilter = [];
                        selectedNav?.map((ele, index) => {
                            loopFilter.push([ele?.InternalGridColName, '=', ele?.actualValue], 'or');
                        });
                        dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [["Launches#", '=', ""], "or", ["Launch Lead", '=', null]], "and", loopFilter]);

                    } else {
                        //dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [this.state.selectednavitem[0]["Title"], '=', this.state.selectednavitem[0]["actualValue"]]]);
                        if (this.state.selectednavitem != null && this.state.selectednavitem != undefined) {
                            dataGrid?.filter([[['Sub Business Unit', '=', prmBu], "and", [["Launches#", '=', ""], "or", ["Launch Lead", '=', null]]], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]]);
                        } else {
                            dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [["Launches#", '=', ""], "or", ["Launch Lead", '=', null]]]);
                        }
                    }
                }
            }
            else {
                console.log(prmBu);
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

    public filteredLaunchLead = (prmlaunchLead, prmCategoryName) => {
        try {
            const dataGrid = this.dataGrid.instance;
            if (prmlaunchLead === "Blanks" || prmlaunchLead === undefined || prmlaunchLead === null || prmlaunchLead === "") {
                prmlaunchLead = null;
            }
            //dataGrid?.filter(["Launch Lead", '=', prmlaunchLead]);
            if (this.state.IsMultiCategoryEnbaled === false) {
                if (this.state.selectednavitem === null) {
                    dataGrid?.filter(["Launch Lead", '=', prmlaunchLead]);
                }
                if (this.state.selectednavitem != null) {
                    if (prmCategoryName === this.state.selectednavitem["Title"]) {
                        dataGrid?.filter(["Launch Lead", '=', prmlaunchLead]);
                    }
                    else if (prmCategoryName != this.state.selectednavitem["Title"]) {
                        dataGrid?.filter(['Launch Lead', '=', prmlaunchLead], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]);
                    }
                }
            }
            else if (this.state.IsMultiCategoryEnbaled === true) {
                if (this.state.selectednavitem?.length > 1) {
                    let selectedNav = [...this.state.selectednavitem];
                    let loopFilter = [];
                    selectedNav?.map((ele, index) => {
                        loopFilter.push([ele?.InternalGridColName, '=', ele?.actualValue], 'or');
                    });
                    dataGrid?.filter([['Launch Lead', '=', prmlaunchLead], "and", loopFilter]);

                } else {
                    if (this.state.selectednavitem != null && this.state.selectednavitem != undefined) {
                        dataGrid?.filter([['Launch Lead', '=', prmlaunchLead], "and", [this.state.selectednavitem[0]["Title"], '=', this.state.selectednavitem[0]["actualValue"]]]);
                    } else {
                        dataGrid?.filter([['Launch Lead', '=', prmlaunchLead]]);
                    }
                }
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

    public filteredLaunches = (prmBu, prmCategoryName) => {
        try {
            const dataGrid = this.dataGrid.instance;
            if (prmBu === "Blanks" || prmBu === undefined || prmBu === null || prmBu === "") {
                prmBu = "";
            }
            //dataGrid?.filter(["Sub Business Unit", '=', prmBu]);

            if (this.state.IsMultiCategoryEnbaled === false) {
                if (this.state.selectednavitem === null) {
                    dataGrid?.filter(["Sub Business Unit", '=', prmBu]);
                }
                if (this.state.selectednavitem != null) {
                    if (prmCategoryName === this.state.selectednavitem["Title"]) {
                        dataGrid?.filter(["Sub Business Unit", '=', prmBu]);
                    }
                    else if (prmCategoryName != this.state.selectednavitem["Title"]) {
                        dataGrid?.filter(['Sub Business Unit', '=', prmBu], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]);
                    }
                }
            }
            else if (this.state.IsMultiCategoryEnbaled === true) {
                if (this.state.selectednavitem?.length > 1) {
                    let selectedNav = [...this.state.selectednavitem];
                    let loopFilter = [];
                    selectedNav?.map((ele, index) => {
                        loopFilter.push([ele?.InternalGridColName, '=', ele?.actualValue], 'or');
                    });
                    dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", loopFilter]);

                } else {
                    if (this.state.selectednavitem != null && this.state.selectednavitem != undefined) {
                        dataGrid?.filter([['Sub Business Unit', '=', prmBu], "and", [this.state.selectednavitem[0]["Title"], '=', this.state.selectednavitem[0]["actualValue"]]]);
                    } else {
                        dataGrid?.filter([['Sub Business Unit', '=', prmBu]]);
                    }
                }
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

    public getPlanStatus = (rowData: any) => {
        let Style: any;
        if (rowData.value == "COMPLETE") {
            Style = { backgroundColor: '#58b973', color: 'white' }
        }
        else if (rowData.value == "ERROR") {
            Style = { backgroundColor: '#f58082', color: 'white' }
        }
        else if (rowData.value == "MODIFIED") {
            Style = { backgroundColor: '#fede75', color: 'black' }
        }
        else if (rowData.value == "NEW") {
            Style = { backgroundColor: '#2AAA8A', color: 'white' }
        }
        else if (rowData.value == "PROCESSING") {
            Style = { backgroundColor: 'rgb(151, 151, 151)', color: 'white' }
        }
        else if (rowData.value == "STAGED") {
            Style = { backgroundColor: '#779FEC', color: 'white' }
        }
        else {
            Style = { backgroundColor: 'transparent', color: 'black' }
        }

        return (
            <div className='roundBtn' style={Style}>{rowData.value}</div>
        );
    }
    public getLaunchStatus = (rowData: any) => {
        let Style: any;
        if (rowData.value == "On Track") {
            Style = { backgroundColor: '#58b973', color: 'white' }
        }
        else if (rowData.value == "Delayed") {
            Style = { backgroundColor: '#f58082', color: 'white' }
        }
        else if (rowData.value == "MODIFIED") {
            Style = { backgroundColor: '#fede75', color: 'black' }
        }
        else if (rowData.value == "Not Initiated") {
            Style = { backgroundColor: '#2AAA8A', color: 'white' }
        }
        else if (rowData.value == "PROCESSING") {
            Style = { backgroundColor: 'rgb(151, 151, 151)', color: 'white' }
        }
        else if (rowData.value == "STAGED") {
            Style = { backgroundColor: '#779FEC', color: 'white' }
        }
        else {
            Style = { backgroundColor: 'transparent', color: 'black' }
        }

        return (
            <div className='roundBtn' style={Style}>{rowData.value}</div>
        );
    }

    public filteredLaunchStatus = (prmStatus, prmCategoryName) => {
        try {
            const dataGrid = this.dataGrid.instance;
            if (prmStatus === "Blanks" || prmStatus === undefined || prmStatus === null || prmStatus === "") {
                prmStatus = null;
            }
            // single selection
            if (this.state.IsMultiCategoryEnbaled === false) {
                if (this.state.selectednavitem === null) {
                    dataGrid?.filter(["Launch Status", '=', prmStatus]);
                }
                if (this.state.selectednavitem != null) {
                    if (prmCategoryName === this.state.selectednavitem["Title"]) {
                        dataGrid?.filter(["Launch Status", '=', prmStatus]);
                    }
                    else if (prmCategoryName != this.state.selectednavitem["Title"]) {
                        dataGrid?.filter(['Launch Status', '=', prmStatus], "and", [this.state.selectednavitem["Title"], '=', this.state.selectednavitem["actualValue"]]);
                    }
                }
            }
            else if (this.state.IsMultiCategoryEnbaled === true) {
                if (this.state.selectednavitem?.length > 1) {
                    let selectedNav = [...this.state.selectednavitem];
                    let loopFilter = [];
                    selectedNav?.map((ele, index) => {
                        loopFilter.push([ele?.InternalGridColName, '=', ele?.actualValue], 'or');
                    });
                    dataGrid?.filter([['Launch Status', '=', prmStatus], "and", loopFilter]);

                } else {
                    if (this.state.selectednavitem != null && this.state.selectednavitem != undefined) {
                        if (this.state.selectednavitem[0]["actualValue"] === "All") {
                            dataGrid?.filter([['Launch Status', '=', prmStatus]]);
                        } else {
                            dataGrid?.filter([['Launch Status', '=', prmStatus], "and", [this.state.selectednavitem[0]["Title"], '=', this.state.selectednavitem[0]["actualValue"]]]);
                        }
                    } else {
                        dataGrid?.filter([['Launch Status', '=', prmStatus]]);
                    }
                }
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
    public dlppForDRIDIcon = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link dialog-dd-container'>
                {this.state.SelectedProjectPlanMode == 'View' ?
                    <span className='modeParent' style={{ backgroundColor: '#dee2e6', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedProjectPlanMode}</span></span>
                    :
                    <span className='modeParent' style={{ backgroundColor: 'yellow', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedProjectPlanMode}</span></span>
                }
                <Button className='p-button-raised p-button-rounded closeBtn'
                    onClick={e => { this.setState({ showEditPlanDialog0: false, dlppForDRID: [] }), this.getGSCProjectsonChangeUser() }}
                    icon='dx-icon-close' label='Close' />
            </div>
        );
    }

    public ViewDialogIcon = () => {
        if (!this.state.newViewInputVisible) {
            return (
                <div className='p-dialog-titlebar-icon p-link'>
                    {/* <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({ IsComments: false })} icon='dx-icon-close' label='Close' /> */}
                    <Button className='p-button-raised p-button-rounded' onClick={this.createNewViewChangeHandler} style={{ backgroundColor: '#000080', color: 'white', marginRight: '3px' }} label='Create View' />
                    <Button className='p-button-raised p-button-rounded' hidden={this.state.currentViewName == "All Fields"} onClick={() => this.setState({ deleteViewDialogVisible: true })} style={{ backgroundColor: '#f50057', color: 'white', marginRight: '3px' }} label='Delete View' />
                    <Button className='p-button-raised p-button-rounded saveBtn' onClick={this.SaveView} icon='dx-icon-save' label='Save' />
                    <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.onHide('displayResponsive')} icon='dx-icon-close' label='Close' />
                </div>
            );
        }
        else {
            return (
                <div className='p-dialog-titlebar-icon p-link'>
                    <Button className='p-button-raised p-button-rounded saveBtn' onClick={this.SaveView} icon='dx-icon-save' label='Save' />
                    <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.onHide('displayResponsive')} icon='dx-icon-close' label='Close' />
                </div>
            );
        }
    }
    public onSkuConfirm = async () => {
        // console.log(this.state.skuForIndividualItem)
        let lists = [];
        this.state.skuForIndividualItem?.map(item => {
            if (item?.SKU_List) {
                lists.push(item?.SKU_List?.split(';'))
            }
        })
        const arr = lists.reduce((acc, cur) => acc.concat(cur), []);
        // console.log(arr)
        const common = arr?.filter(item => this.state.AutoCompleteValue?.includes(item))
        // console.log(common)
        if (common?.length > 0) {
            this.setState({ skuListError: true });
        }
        else {
            const AutoCompleteValueJoined = this.state.AutoCompleteValue === '' ? '' : this.state.AutoCompleteValue?.join(';')
            const AccStrategyeJoined = this.state.AccStrategy === '' ? '' : this.state.AccStrategy?.join(',')
            await DataService.updateItemInList('Z_NPL_ProjectPlan_SKU', this.state.selectedSKUID?.toString(), { SKU_List: AutoCompleteValueJoined, ReasonCode: this.state.ReasonCode0, AccelerationStrategy: AccStrategyeJoined ? AccStrategyeJoined : '', Comments: this.state.skuComments, IsActive: this.state.skuActiveChecked, Status: 'Modified' }).then(async res => {
                this.setState({
                    // skuDetails: res,
                    skuListError: false,
                    showSKUpop: false,
                    AutoCompleteValue: [],
                    ReasonCode0: null,
                    AccStrategy: null,
                    skuComments: '',
                    skuActiveChecked: false,
                })
                this.toast?.show({ severity: 'success', summary: '', detail: 'Successfully updated sku details !', life: 4000 });
                // this.setState({skuListValues: [...new Set(skuLists)], AccStrategyValues: this.removeDup(Acc), ReasonCodeValues: this.removeDup(ReasonCode)})
                this.getSKUListData();
            })
        }

    }
    public OtherTemplateIcons = () => {
        return (
            <div>
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ showOtherTemplatePopup: false }) }} icon='dx-icon-close' label='Close' />
            </div>
        )
    }
    public DRIDMatchPopUpIcons = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Button className='p-button-raised p-button-rounded saveBtn' icon='dx-icon-save' label='Update & Confirm' onClick={this.UpdateIndication} disabled={this.state.SelectedPlan?.length == 0} />
                <Button className='p-button-raised p-button-rounded saveBtn' label='Create New Plan' onClick={(e) => this.GOLDActionlink('Edit', this.state.selectedGOLDTabRec, true)} disabled={this.state.SelectedGOLDTabMode === 'View' || this.state.ShowDRIDMatchPopupWarning} />
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ ShowDRIDMatchPopup: false }) }} icon='dx-icon-close' label='Close' />
            </div>
        )
    }

    public CountryDRIDMatchPopUpIcons = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Button className='p-button-raised p-button-rounded saveBtn' label='Merge' onClick={(e: any) => this.MergeIndications()} disabled={this.state.SelectedGOLDTabMode === 'View'} />
                <Button className='p-button-raised p-button-rounded saveBtn' label='Create New Plan' onClick={(e) => this.GOLDActionlink('Edit', this.state.selectedGOLDTabRec, true)} disabled={this.state.SelectedGOLDTabMode === 'View'} />
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ ShowCoutryDRIDMatchPopup: false }) }} icon='dx-icon-close' label='Close' />
            </div>
        )
    }

    public skuButtons = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>Active</span>
                <Switch checked={this.state.skuActiveChecked} onChange={(e) => this.setState({ skuActiveChecked: e.target.checked })} color='primary' />
                <Button className='p-button-raised p-button-rounded saveBtn' icon='dx-icon-save' label='Confirm' onClick={this.onSkuConfirm} />
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ showSKUpop: false, skuListError: false }) }} icon='dx-icon-close' label='Close' />
            </div>
        )
    }

    //Arpita 
    public ViewIportButtons = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="recordStatusOuterContainerMode">
                    {this.state.SelectedIportMode == 'View' ?
                        <span className='modeParent' style={{ backgroundColor: '#dee2e6', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedIportMode}</span></span>
                        :
                        <span className='modeParent' style={{ backgroundColor: 'yellow', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedIportMode}</span></span>
                    }
                </div>
                {this.state.SelectedIportMode === "Edit" && <div>
                    <Button className='p-button-raised p-button-rounded saveBtn' onClick={(e) => { console.log("SaveIport") }} icon='dx-icon-save' label='Save' />
                    <Button className='p-button-raised p-button-rounded saveBtn' onClick={(e) => { this.getSelectedPlaniswareData() }} icon='dx-icon-add' label='Create as New DR' />
                    <Button className='p-button-raised p-button-rounded saveBtn' onClick={(e) => { console.log("SaveIport") }} icon='dx-icon-add' label='Link to an Existing DR' />

                </div>}
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ showIportEditDialog: false }) }} icon='dx-icon-close' label='Close' />
            </div>

        )

    }
    public ViewMarketIcons = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="recordStatusOuterContainerMode">
                    {this.state.SelectedAIMode == 'View' ?
                        <span className='modeParent' style={{ backgroundColor: '#dee2e6', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedAIMode}</span></span>
                        :
                        <span className='modeParent' style={{ backgroundColor: 'yellow', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedAIMode}</span></span>
                    }
                </div>
                {this.state.SelectedAIMode === "Edit" && <div>
                    {this.state.linkOrCreateDR !== null ? this.state.linkOrCreateDR === 'linkDR' ? <Button className='p-button-raised p-button-rounded saveBtn' disabled={this.state.selectedDRID == '' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned'} onClick={this.beforeConfirmPop} label='Confirm' /> : <Button className='p-button-raised p-button-rounded saveBtn' disabled={this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Published'} onClick={(e) => this.confirmToCreateDR()} label='Confirm' /> : null}
                    {/* <Button className='p-button-raised p-button-rounded saveBtn'  icon='dx-icon-add' onClick={(e)=>this.confirmToCreateDR()} label='Create As New DR' disabled={this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Published'} /> */}

                </div>}
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ showAIAssestPopup: false, linkOrCreateDR: null, SelectedGRP: '', SelectedMoleculeAPI: '', SelectedLabelname: '', SelectedBU: '', SelectedSubBU: '', ProposedGRPVal: '', SelectedMoleculeForNewIDOps: null, SelectedLabelForNewIDOps: '', SelectedGRPForNewID: '' }) }} icon='dx-icon-close' label='Close' />
            </div>

        )

    }
    ViewMarketDialogIcon = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link dialog-dd-container'>

                {this.state.SelectedGOLDTabMode == 'View' ?
                    <span className='modeParent' style={{ backgroundColor: '#dee2e6', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedGOLDTabMode}</span></span>
                    :
                    <span className='modeParent' style={{ backgroundColor: 'yellow', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedGOLDTabMode}</span></span>
                }

                <Button className='p-button-raised p-button-rounded saveBtn'
                    style={this.state.SelectedGOLDTabMode == "View" ? { display: "none" } : { display: "" }}
                    onClick={e => this.AddMarkets('GOLD')} icon='dx-icon-save' disabled={this.state.MarketGridDataArray?.length == 0}
                    label={'Update & Confirm'} />
                <Button className='p-button-raised p-button-rounded closeBtn'
                    onClick={e => this.ClearAll()}
                    icon='dx-icon-close' label='Close' />
            </div>
        );
    }
    ViewLaunchMarketDialogIcon = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link dialog-dd-container'>
                {/* <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                    <Switch checked={this.state.LaunchListMarketData?.DLPPManaged === 'Yes' ? true : false} onChange={(e) => this.HandleLaunchMarketChange('DLPPManaged', e.target.checked ? 'Yes' : 'No')} color='primary' defaultValue='No' disabled={this.state.SelectedMarketMode === 'View' || this.state.SelectedDRMarketData?.IsDLPPManagedEdit === 'true'} />
                    <span style={{ fontWeight: 'bold' }}>DLPP Managed</span>
                </div> */}
                {this.state.SelectedMarketMode == 'View' ?
                    <span className='modeParent' style={{ backgroundColor: '#dee2e6', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedMarketMode}</span></span>
                    :
                    <span className='modeParent' style={{ backgroundColor: 'yellow', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.state.SelectedMarketMode}</span></span>
                }

                {(this.state.SelectedMarketMode == 'New') && <Button className='p-button-raised p-button-rounded saveBtn'
                    style={this.state.SelectedGOLDTabMode == "View" ? { display: "none" } : { display: "" }}
                    onClick={e => this.AddMarkets('LaunchList')} icon='dx-icon-save' disabled={this.state.MarketGridDataArray?.length == 0}
                    label={'Update & Confirm'} />}

                {(this.state.SelectedMarketMode == 'Edit') && <Button className='p-button-raised p-button-rounded saveBtn'
                    style={this.state.SelectedGOLDTabMode == "View" ? { display: "none" } : { display: "" }}
                    disabled={!(this.state.LaunchListMarketData?.Indication?.length > 0 && this.state.LaunchListMarketData?.DLPPManaged !== '' && this.state.LaunchListMarketData?.Country?.length > 0 && this.state.LaunchListMarketData?.Priority !== '' && this.state.LaunchListMarketData?.LaunchLeader != null)}
                    onClick={e => this.UpdateMarkets()} icon='dx-icon-save'
                    label={'Update & Confirm'} />}

                <Button className='p-button-raised p-button-rounded closeBtn'
                    onClick={e => this.ClearValues()}
                    icon='dx-icon-close' label='Close' />
            </div>
        );
    }

    public ClearAll = () => {
        this.LABEL_NAME = '';
        this.PREFIX = '';
        this.SUFFIX = '';
        this.LABEL_NAME1 = '';
        this.ProposedProjectName = '';
        this.setState({
            showMarketPopUp: false,
            ShowCoutryDRIDMatchPopup: false,
            selectedCountries: [],
            MarketData: {
                Priority: '',
                Country: this.state.SimilarCountriesArray ? this.state.SimilarCountriesArray : [],
                Indication: [],
                TradeName: '',
                LaunchChar: '',
                LaunchLeader: null,
                MarketPlanner: null,
                MarketPlannerSup: null,
                RegSupplierLeader: null,
                AboveMarketPlanner: null,
                AboveMarketPlannerSup: null,
                ProjectNameSuffix: '',
                DLPPManaged: 'No',
                LaunchLeaderTitle: '',
                MarketPlannerTitle: '',
                MarketPlannerSupTitle: '',
                RegSupplierLeaderTitle: '',
                AboveMarketPlannerTitle: '',
                AboveMarketPlannerSupTitle: '',
            },
            MarketGridDataArray: [],
            MarketGridDataArrayCopy:[],
            IndicationPrefix: '',
            LabelNameValues: [],
            indicationSelected: null,
            SelectedIDData: [],
        })

    }
    //Clearing values on Launch List Market Close
    public ClearValues = () => {
        let id = this.state.DRPChecked ? this.state.selectedID?.DRID : this.state.selectedID?.Id
        this.getDLPPForDRID(id);
        this.LaunchLABEL_NAME = '',
            this.LaunchPREFIX = '',
            this.LaunchSUFFIX = '',
            this.LaunchLABEL_NAME1 = '',
            this.LaunchProposedProjectName = '',
            this.setState({
                LaunchListMarketData: {
                    Priority: '',
                    Country: [],
                    Indication: [],
                    TradeName: this.state.SelectedIDData?.TradeName,
                    LaunchChar: '',
                    LaunchLeader: null,
                    MarketPlanner: null,
                    MarketPlannerSup: null,
                    RegSupplierLeader: null,
                    AboveMarketPlanner: null,
                    AboveMarketPlannerSup: null,
                    ProjectNameSuffix: '',
                    DLPPManaged: 'NO',
                    LaunchLeaderTitle: '',
                    MarketPlannerTitle: '',
                    MarketPlannerSupTitle: '',
                    RegSupplierLeaderTitle: '',
                    AboveMarketPlannerTitle: '',
                    AboveMarketPlannerSupTitle: '',
                },
                // LaunchIndicationvalues:[],
                showLaunchMarketPopup: false,
                MarketGridDataArray: [],
                IndicationPrefix: '',
                MarketGridDataArrayCopy:[]
            })

    }
    //Arpita 
    public CreateDrButtons = () => {
        return (
            <>            <div className="recordStatusOuterContainerMode">
                <Button className='p-button-raised p-button-rounded saveBtn' onClick={(e) => { console.log("SaveIport") }} icon='dx-icon-save' label='Publish to DR' />
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ showCreatDRDialog: false, showIportEditDialog: false }) }} icon='dx-icon-close' label='Close' />
            </div>
            </>
        )
    }
    public CreateDrHeader = () => {
        return (
            <>
                <div className="recordStatusOuterContainer">
                    <div style={{ display: 'contents', width: '-webkit-fill-available', justifyContent: 'flex-start' }}>
                        <span className='legendSpan' >
                            <i className='pi pi-stop' style={{ background: '#efd7a8', color: '#efd7a8' }}></i>
                            <span > On -Hold </span>
                        </span>
                        <span className='legendSpan' >
                            <i className='pi pi-stop' style={{ background: '#b5edab', color: '#b5edab', marginLeft: '1rem' }}></i>
                            <span > Ongoing </span>
                        </span>
                    </div>
                </div>
            </>
        )
    }

    public ontabChange = async (e: any) => {
        this.setState({ isLoading: true });
        // console.log("filterStatus",this.state.filterStatus,e);
        // setTimeout(() => { this.setState({ isLoading: false }) }, 2000);
        await this.setState({
            SelectedTabName: e.originalEvent.target.innerText
        })
        const dataGrid = this.dataGrid?.instance;

        dataGrid?.clearFilter();
        this.setState((prev) => ({
            MarketData: {
                ...prev.MarketData,
                DLPPManaged: 'No'
            }
        }))
        if (e.originalEvent.target.innerText == 'Launch List') {
            await this.getGSCProjects();
            this.setState({
                filterStatus: 'Launch Lead',
                selectednavitem: null,
                ActiveIndex: e.index,
                multiVals: []
            });
        }
        else if (e.originalEvent.target.innerText == 'GOLD') {
            await this.getGOLDTabData();
            // this.renderLaunchLead(this.commonProjectListRef.current);
            // this.renderLaunchLeadProduct(this.projectDetailsListRef.current);
            this.setState((prev) => ({
                ...prev,
                filterStatus: 'Plan Managed',
                selectednavitem: null,
                ActiveIndex: e.index,
                multiVals: []
            }));
        }
        else if (e.originalEvent.target.innerText == 'Administrator') {
            await this.getGOLDStgListData();

            //this.renderLaunchStatus(this.commonProjectListRef.current);
            // this.renderSubBusinessUnit(this.commonProjectListRef.current);
            // this.renderProductSubBusinessUnit(this.projectDetailsListRef.current);

            this.setState((prev) => ({
                ...prev,
                filterStatus: 'Record Match',
                selectednavitem: null,
                ActiveIndex: e.index,
                multiVals: []
            }));
        }
        else if (e.index == 3) {
            // this.renderSubBusinessUnit(this.commonProjectListRef.current);
            // this.renderProductSubBusinessUnit(this.projectDetailsListRef.current);
            this.setState({
                filterStatus: 'Sub Business Unit',
                selectednavitem: null,
                ActiveIndex: 3,
            });
        }
        else if (e.index == 4) {
            this.setState({
                ActiveIndex: 4,
            });
        }
        //  await this.getGSCProjects();
        this.setState({ isLoading: false })
    }

    public getcolArr = async () => {
        try {
            // let colArray = await DataServiceNew.fetchAllItemsFromNPL("GLO_CustomViewFilter");
            let colArray = await DataService.fetchAllItems_CustomViewFilter("GLO_CustomViewFilter");
            let ColListProps = await DataService.fetchAllItems_ProgramColList("GLO_ProgramColList");
            // console.log('all cols:', colArray, ColListProps);

            // check public views length
            let publicViewNamesArray = [];
            let setAsDefaultCheckbox = true;
            if (this.state.checked1 == true) {
                publicViewNamesArray = colArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Plan");
            }
            else if (this.state.checked1 == false) {
                publicViewNamesArray = colArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Product");
            } else {
            }
            if (publicViewNamesArray?.length == 1 && publicViewNamesArray[0].ViewName == "All Fields") {
                setAsDefaultCheckbox = true;
            } else {
                setAsDefaultCheckbox = false;
            }

            let dropdownCols = ColListProps.filter(item => item.FieldType == 'DropDown');
            this.dropdownColsRef.current = dropdownCols;
            let inValidCol = ColListProps.filter(item => item.IsValid == false);
            ColListProps = ColListProps.filter(item => item.IsValid === true);

            let optionList = [];
            let optionListViewsProject = [];
            let optionListViewsPlan = [];
            let publicViewNames = colArray.filter(data => data.ViewType == 'Public');
            publicViewNames.map(data => {
                optionList.push({ label: data.ViewName, value: data.ViewName, viewCategory: data.ViewCategory });
            });


            let userViewArr = colArray.filter(data => data.UserEmail == this.props?.currentUser?.Email && data.ViewType == 'Private');
            userViewArr.map(data => {
                optionList.push({ label: data.ViewName, value: data.ViewName, viewCategory: data.ViewCategory });
            });
            optionList.map(item => {
                //optionList1.push(item.label);
                if (item?.viewCategory == "Product") {
                    optionListViewsProject.push(item.label);
                } else if (item?.viewCategory == "Plan") {
                    optionListViewsPlan.push(item.label);
                }
                else {

                }
            });
            //if (this.state.EditIconFlag) optionList1.push('Manage Views');
            if (this.state.EditIconFlag) {
                optionListViewsProject.push('Manage Views');
                optionListViewsPlan.push('Manage Views');
            }

            let allUserViews = colArray.filter(data => data.UserEmail == this.props?.currentUser?.Email);
            let allUserPrivateViewsDefProduct = allUserViews.filter(data => data.ViewType == 'Private' && data.DefaultView === true && data.ViewCategory == "Product");
            let allUserPrivateViewsDefPlan = allUserViews.filter(data => data.ViewType == 'Private' && data.DefaultView === true && data.ViewCategory == "Plan");

            //let ViewToDisplay = [], 
            let coderSelArray = [], diffArr = [], filterQueryArr = [];
            let ViewToDisplayProduct = [];
            let ViewToDisplayPlan = [];
            // If there is a private default view,private default view will be the default view 
            // else 
            // search for public default view. if there is public default view, it willl be default view else LaunchX will be default view
            // product view
            if (allUserPrivateViewsDefProduct?.length <= 0) {
                //search for public default view
                let allUserPublicViewsDef = colArray.filter(data => data.ViewType == 'Public' && data.DefaultView === true);

                if (allUserPublicViewsDef?.length <= 0) {
                    ViewToDisplayProduct = publicViewNames.filter(item => item.ViewCategory == "Product");
                } else {
                    ViewToDisplayProduct = allUserPublicViewsDef.filter(item => item.ViewCategory == "Product");
                }
            } else {
                ViewToDisplayProduct = allUserPrivateViewsDefProduct;
            }

            // plan view
            if (allUserPrivateViewsDefPlan?.length <= 0) {
                //search for public default view
                let allUserPublicViewsDef = colArray.filter(data => data.ViewType == 'Public' && data.DefaultView === true);

                if (allUserPublicViewsDef?.length <= 0) {
                    ViewToDisplayPlan = publicViewNames.filter(item => item.ViewCategory == "Plan");
                } else {
                    ViewToDisplayPlan = allUserPublicViewsDef.filter(item => item.ViewCategory == "Plan");
                }
            } else {
                ViewToDisplayPlan = allUserPrivateViewsDefPlan;
            }

            // plan view
            if (this.state.checked1 === true && ViewToDisplayPlan?.length > 0) {
                filterQueryArr = JSON.parse(ViewToDisplayPlan?.[0]?.FilterQuery);
                coderSelArray = ViewToDisplayPlan?.[0]?.ColumnsToBeShown ? JSON.parse(ViewToDisplayPlan?.[0]?.ColumnsToBeShown) : '';//[1,2]
                diffArr = ColListProps.filter(({ dataField: dataField }) => !coderSelArray?.some(({ dataField: dataField1 }) => dataField1 == dataField));
                diffArr = diffArr?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

                if (!this.state.IsAdmin) {
                    this.setState({ ViewPubOrPri: [{ label: `${ViewToDisplayPlan?.[0]?.ViewType} View`, value: `${ViewToDisplayPlan?.[0]?.ViewType}` }] });
                }
            }

            // product view            
            if (this.state.checked1 === false && ViewToDisplayProduct?.length > 0) {
                filterQueryArr = JSON.parse(ViewToDisplayProduct?.[0]?.FilterQuery);
                coderSelArray = ViewToDisplayProduct?.[0]?.ColumnsToBeShown ? JSON.parse(ViewToDisplayProduct?.[0]?.ColumnsToBeShown) : '';//[1,2]
                diffArr = ColListProps.filter(({ dataField: dataField }) => !coderSelArray?.some(({ dataField: dataField1 }) => dataField1 == dataField));
                diffArr = diffArr?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

                if (!this.state.IsAdmin) {
                    this.setState({ ViewPubOrPri: [{ label: `${ViewToDisplayProduct?.[0]?.ViewType} View`, value: `${ViewToDisplayProduct?.[0]?.ViewType}` }] });
                }
            }

            // plan view
            ColListProps = ColListProps?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

            if (this.state.checked1 === true) {
                this.setState({
                    gridFilterValue: filterQueryArr,
                    AllColumnArray: ColListProps,
                    SelectedColArray: coderSelArray,
                    AvailableColArray: diffArr,
                    customViewFilterArr: colArray,
                    viewDropdownOptions: optionList,
                    //gridViewOptions: optionList1,
                    gridViewOptionsProject: optionListViewsProject,
                    gridViewOptionsPlan: optionListViewsPlan,
                    currentViewName: ViewToDisplayPlan?.[0]?.['ViewName'],
                    ViewType: ViewToDisplayPlan?.[0]?.['ViewType'],
                    activeViewID: ViewToDisplayPlan?.[0]?.['ID'],
                    defaultView: ViewToDisplayPlan?.[0]?.['DefaultView'] ? true : false,
                    inValidColumns: inValidCol,
                    ProductViewToDisplayArray: ViewToDisplayProduct,
                    PlanViewToDisplayArray: ViewToDisplayPlan,
                    setAsDefaultCheckboxVal: setAsDefaultCheckbox,
                }, () => setTimeout(() => { this.setState({ isLoading: false }); }, 100));

            } else if (this.state.checked1 === false) {
                this.setState({
                    gridFilterValue: filterQueryArr,
                    AllColumnArray: ColListProps,
                    SelectedColArray: coderSelArray,
                    AvailableColArray: diffArr,
                    customViewFilterArr: colArray,
                    viewDropdownOptions: optionList,
                    //gridViewOptions: optionList1,
                    gridViewOptionsProject: optionListViewsProject,
                    gridViewOptionsPlan: optionListViewsPlan,
                    currentViewName: ViewToDisplayProduct?.[0]?.['ViewName'],
                    ViewType: ViewToDisplayProduct?.[0]?.['ViewType'],
                    activeViewID: ViewToDisplayProduct?.[0]?.['ID'],
                    defaultView: ViewToDisplayProduct?.[0]?.['DefaultView'] ? true : false,
                    inValidColumns: inValidCol,
                    ProductViewToDisplayArray: ViewToDisplayProduct,
                    PlanViewToDisplayArray: ViewToDisplayPlan,
                    setAsDefaultCheckboxVal: setAsDefaultCheckbox,
                }, () => setTimeout(() => { this.setState({ isLoading: false }); }, 100));
            } else {

            }

        } catch (error) {
            setTimeout(() => { this.setState({ isLoading: false }); }, 100);
            let errorMsg = {
                Source: 'Main Product Grid-getcolArr',
                Message: error.message,
                StackTrace: new Error().stack
            };
            console.log('error while fetching the col details:', errorMsg);
            // DataServiceNew.addDatatoList('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    public manageViews = async (prmViewType: boolean) => {
        try {
            let coderSelArray = [], diffArr = [], filterQueryArr = [];
            if (prmViewType === true) {
                if (this.state.PlanViewToDisplayArray?.length > 0) {
                    filterQueryArr = JSON.parse(this.state.PlanViewToDisplayArray?.[0]?.FilterQuery);
                    coderSelArray = this.state.PlanViewToDisplayArray?.[0]?.ColumnsToBeShown ? JSON.parse(this.state.PlanViewToDisplayArray?.[0]?.ColumnsToBeShown) : '';//[1,2]
                    diffArr = this.state.AllColumnArray.filter(({ dataField: dataField }) => !coderSelArray?.some(({ dataField: dataField1 }) => dataField1 == dataField));
                    diffArr = diffArr?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

                    if (!this.state.IsAdmin) {
                        this.setState({ ViewPubOrPri: [{ label: `${this.state.PlanViewToDisplayArray?.[0]?.ViewType} View`, value: `${this.state.PlanViewToDisplayArray?.[0]?.ViewType}` }] });
                    }
                }
                this.setState({
                    gridFilterValue: filterQueryArr,
                    SelectedColArray: coderSelArray,
                    AvailableColArray: diffArr,
                    currentViewName: this.state.PlanViewToDisplayArray?.[0]?.['ViewName'],
                    ViewType: this.state.PlanViewToDisplayArray?.[0]?.['ViewType'],
                    activeViewID: this.state.PlanViewToDisplayArray?.[0]?.['ID'],
                    defaultView: this.state.PlanViewToDisplayArray?.[0]?.['DefaultView'] ? true : false,
                    //inValidColumns: inValidCol
                }, () => setTimeout(() => { this.setState({ isLoading: false }); }, 100));
            } else if (prmViewType === false) {
                if (this.state.ProductViewToDisplayArray?.length > 0) {
                    filterQueryArr = JSON.parse(this.state.ProductViewToDisplayArray?.[0]?.FilterQuery);
                    coderSelArray = this.state.ProductViewToDisplayArray?.[0]?.ColumnsToBeShown ? JSON.parse(this.state.ProductViewToDisplayArray?.[0]?.ColumnsToBeShown) : '';//[1,2]
                    diffArr = this.state.AllColumnArray.filter(({ dataField: dataField }) => !coderSelArray?.some(({ dataField: dataField1 }) => dataField1 == dataField));
                    diffArr = diffArr?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

                    // if (!this.props.userGroups.includes('NPP_SiteAdmin')) {
                    if (!this.state.IsAdmin) {
                        this.setState({ ViewPubOrPri: [{ label: `${this.state.ProductViewToDisplayArray?.[0]?.ViewType} View`, value: `${this.state.ProductViewToDisplayArray?.[0]?.ViewType}` }] });
                    }
                }
                this.setState({
                    gridFilterValue: filterQueryArr,
                    SelectedColArray: coderSelArray,
                    AvailableColArray: diffArr,
                    currentViewName: this.state.ProductViewToDisplayArray?.[0]?.['ViewName'],
                    ViewType: this.state.ProductViewToDisplayArray?.[0]?.['ViewType'],
                    activeViewID: this.state.ProductViewToDisplayArray?.[0]?.['ID'],
                    defaultView: this.state.ProductViewToDisplayArray?.[0]?.['DefaultView'] ? true : false,
                    //inValidColumns: inValidCol
                }, () => setTimeout(() => { this.setState({ isLoading: false }); }, 100));
            }

        } catch (error) {
            setTimeout(() => { this.setState({ isLoading: false }); }, 100);
            let errorMsg = {
                Source: 'Main Product Grid-getcolArr',
                Message: error.message,
                StackTrace: new Error().stack
            };
            console.log('error while fetching the col details:', errorMsg);
            // DataServiceNew.addDatatoList('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    public CustomPopper = (props) => {
        return <Popper {...props} style={{ zIndex: 99999999 }} />;
      };

    public createNewViewChangeHandler = async () => {
        try {
            let pubPriArr = [];
            if (this.state.IsAdmin) {
                pubPriArr = [
                    { label: 'Public View', value: 'Public' },
                    { label: 'Private View', value: 'Private' }
                ];
            } else {
                pubPriArr = [
                    { label: 'Private View', value: 'Private' }
                ];
            }
            this.setState({ newViewInputVisible: true, ViewType: 'Private', ViewPubOrPri: pubPriArr, SelectedColArray: [], AvailableColArray: this.state.AllColumnArray, SelectedFilterArr: [], AvailableFilterArr: this.state.AllFilterArr });
        } catch (error) {
            let errorMsg = {
                Source: 'Main Product Grid-createNewViewChangeHandler',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    public onViewClick(name, position) {
        try {
            let state = {
                [`${name}`]: true
            };

            if (position) {
                state = {
                    ...state,
                    position
                };
            }

            // let publicDefaultViews = this.state.customViewFilterArr.filter(data => data.ViewType == 'Public' && data.DefaultView === true);
            // let privateDefaultViews = this.state.customViewFilterArr.filter(data => data.ViewType == 'Private' && data.DefaultView === true && data.UserEmail == this.props.currentUser.Email);
            let publicDefaultViews = [];
            let privateDefaultViews = [];
            if (this.state.checked1 === true) {
                publicDefaultViews = this.state.customViewFilterArr.filter(data => data.ViewType == 'Public' && data.DefaultView === true && data.ViewCategory == "Plan");
                privateDefaultViews = this.state.customViewFilterArr.filter(data => data.ViewType == 'Private' && data.DefaultView === true && data.UserEmail == this.props?.currentUser?.Email && data.ViewCategory == "Plan");
            } else if (this.state.checked1 === false) {
                publicDefaultViews = this.state.customViewFilterArr.filter(data => data.ViewType == 'Public' && data.DefaultView === true && data.ViewCategory == "Product");
                privateDefaultViews = this.state.customViewFilterArr.filter(data => data.ViewType == 'Private' && data.DefaultView === true && data.UserEmail == this.props?.currentUser?.Email && data.ViewCategory == "Product");
            }

            let localAllNone = this.state.AllNoneFilter;
            localAllNone.map(item => {
                item.optionList.All = false;
                item.optionList.None = false;
            });

            let defViewName = '';
            if (privateDefaultViews?.length <= 0) {
                defViewName = publicDefaultViews?.[0]?.["ViewName"];
                //this.setState({ ViewType: "Public" });
            } else {
                defViewName = privateDefaultViews?.[0]?.['ViewName'];
                //this.setState({ ViewType: "Private" });
            }
            let gridViewOptionsList = [];
            if (this.state.checked1 === true) {
                gridViewOptionsList = this.state.gridViewOptionsPlan;
            } else if (this.state.checked1 === false) {
                gridViewOptionsList = this.state.gridViewOptionsProject;
            }
            //if (this.state.gridViewOptions?.length > 1) {
            if (gridViewOptionsList?.length > 1) {
                this.setState({ defaultViewName: defViewName, AllNoneFilter: localAllNone });

                let localGridFilterVal = this.state.gridFilterValue;
                let AndArr = [];
                if (localGridFilterVal.length > 0) {
                    AndArr = localGridFilterVal?.reduce((a, e, i) => {
                        if (e != 'and')
                            a.push(e);
                        return a;
                    }, []);
                }
                let finalArr = [];
                AndArr?.map(item => {
                    let OrArr = item?.reduce((a, e, i) => {
                        if (e != 'or')
                            a.push(e);
                        return a;
                    }, []);

                    let fVal = [];
                    OrArr?.map(item1 => {
                        fVal.push(item1?.[2]);
                    });
                    finalArr.push({ label: OrArr?.[0]?.[0], value: fVal });
                });
                let selArr = [];
                finalArr?.map(item2 => {
                    //let selArr1 = this.state.AllFilterArr?.filter(obj => obj.internalName == item2.label);
                    let selArr1 = [];
                    if (this.state.checked1 === true) {
                        selArr1 = this.state.AllFilterArr?.filter(obj => obj.internalName == item2.label && (obj.viewCategory === "Plan" || obj.viewCategory === "Both"));
                    }
                    if (this.state.checked1 === false) {
                        selArr1 = this.state.AllFilterArr?.filter(obj => obj.internalName == item2.label && (obj.viewCategory === "Product" || obj.viewCategory === "Both"));
                    }
                    selArr1[0]?.optionList.map(rec => {
                        rec.visible = false;
                    });
                    if (selArr1.length > 0)
                        selArr.push(selArr1?.[0]);
                });
                if (selArr) {
                    selArr?.map(item3 => {
                        let finalArr1 = finalArr?.filter(obj => obj?.label == item3?.internalName);
                        finalArr1[0]?.value.map(value => {
                            item3?.optionList?.map(item4 => {
                                if (item4?.text == value) {
                                    item4.visible = true;
                                }
                            });
                        });
                    });
                }

                let diffArr = [];
                if (selArr.length > 0)
                    diffArr = this.state.AllFilterArr?.filter(({ internalName: internalName }) => !selArr?.some(({ internalName: internalName1 }) => internalName1 == internalName));
                else diffArr = this.state.AllFilterArr;
                let availableArr1 = [];
                selArr.map(item3 => {
                    let availableArr2 = this.state.AllFilterArr.filter(item4 => item4.internalName != item3.internalName);
                    availableArr1.push(availableArr2?.[0]);
                });
                selArr = selArr?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
                diffArr = diffArr?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);

                this.setState({ SelectedFilterArr: selArr, AvailableFilterArr: diffArr });
            } else {
                this.createNewViewChangeHandler().catch(e => console.log(e))
            }
            this.setState(state);
        } catch (error) {
            console.error(error);
            let errorMsg = {
                Source: 'Main Product Grid-OnViewClick',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    public gridViewChangeHandler = (e) => {

        try {
            if (e.itemData == 'Manage Views' && this.state.EditIconFlag) {
                this.onViewClick('displayResponsive', this.state.dialogposition);
            } else {
                this.setState({ gridFilterValue: [], SelectedColArray: this.state.AllColumnArray }, () => {
                    setTimeout(() => {
                        //let localCustomView = this.state.customViewFilterArr.filter(arr => arr.ViewName == e.itemData);
                        let localCustomView = [];
                        if (this.state.checked1 === true) {
                            localCustomView = this.state.customViewFilterArr.filter(arr => arr.ViewName == e.itemData && arr.ViewCategory == "Plan");
                        } else if (this.state.checked1 === false) {
                            localCustomView = this.state.customViewFilterArr.filter(arr => arr.ViewName == e.itemData && arr.ViewCategory == "Product");
                        }
                        if (!this.state.IsAdmin) {
                            this.setState({ ViewPubOrPri: [{ label: `${localCustomView?.[0]?.ViewType} View`, value: `${localCustomView?.[0]?.ViewType}` }] });
                        }
                        //let localGridFilterVal = JSON.parse(localCustomView?.[0]?.['FilterQuery']);
                        let colArray = JSON.parse(localCustomView?.[0]?.ColumnsToBeShown);
                        let diffArr = this.state.AllColumnArray.filter(({ dataField: dataField }) => !colArray.some(({ dataField: dataField1 }) => dataField1 == dataField));

                        //let fil = localCustomView?.[0]?.FilterQuery ? JSON.parse(localCustomView?.[0]?.FilterQuery) : '';
                        diffArr = diffArr?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

                        this.setState({
                            currentViewName: e.itemData,
                            AvailableColArray: diffArr,
                            SelectedColArray: colArray,
                            gridFilterValue: JSON.parse(localCustomView?.[0]?.['FilterQuery']),// ["BusinessUnit", "=", "IMRU"],
                            ViewType: localCustomView?.[0]?.ViewType,
                            activeViewID: localCustomView?.[0]?.ID, //view ID 
                            defaultView: localCustomView?.[0]?.['DefaultView']
                        }, () => {
                            console.log('after view change : ', this.state.gridFilterValue);
                            this.setState({ isLoading: false });
                        });
                    }, 100);
                });

            }
        } catch (error) {
            console.error(error);
            let errorMsg = {
                Source: 'Main Product Grid-gridViewChangeHandler',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    public gridViewDropdownTemplte = (rowData) => {
        console.log("gridViewDropdownTemplte", rowData)
        if (rowData == this.state.currentViewName) {
            return (<span className="viewFilterSelectedItem viewFilter" style={{ color: '#f1b50f', fontWeight: 'bold' }}>{rowData}</span>);
        }
        else if (rowData == 'Manage Views') {
            return (<div className='roundBtnManage manageViews viewFilter' >{rowData}</div>);
        }
        else
            return (<span className="viewFilter" style={{ color: 'black' }}>{rowData}</span>);
    }

    public onHide = (name) => {
        this.setState({
            [`${name}`]: false, newViewInputVisible: false
        });
        this.getcolArr().catch(e => console.log(e))
    }

    public switchPublicPrivateView = (e) => {
        // this.setState({ ViewType: e.value });
        if (e.value) {
            this.setState({ ViewType: e.value });
        } else {
            if (this.state.ViewType == 'Public') {
                this.setState({ ViewType: 'Private' });
            } else {
                this.setState({ ViewType: 'Public' });
            }
        }
    }

    protected viewNameTemplate = (option) => {
        if (option.label == this.state.defaultViewName)
            return (
                <span style={{ color: '#f1b50f', fontWeight: 'bold' }}>{option.label}</span>
            );
        else return (
            <>{option.label}</>
        );
    }

    public ViewSelectedonClick = (e) => {
        //move the from avilable column to selected columns
        const buttonText = e.currentTarget.innerText;
        let sel = this.state.AvailableColArray;//selected col filter 
        let remainingArr = this.state.SelectedColArray.filter(data => data?.caption != buttonText);//exclude selected item 

        let result = this.state.SelectedColArray.find(obj => {
            return obj?.caption == buttonText;
        });
        sel.push(result);
        sel = sel?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

        this.setState({
            AvailableColArray: sel,
            SelectedColArray: remainingArr
        });
    }

    public ViewChangeHandler = (e) => {
        try {
            //let localCustomView = this.state.customViewFilterArr.filter(arr => arr.ViewName == e.value);
            let localCustomView = [];
            if (this.state.checked1 == true) {
                localCustomView = this.state.customViewFilterArr.filter(arr => arr.ViewName == e.value && arr.ViewCategory == "Plan");
            } else if (this.state.checked1 == false) {
                localCustomView = this.state.customViewFilterArr.filter(arr => arr.ViewName == e.value && arr.ViewCategory == "Product");
            }

            if (!this.state.IsAdmin) {
                this.setState({ ViewPubOrPri: [{ label: `${localCustomView?.[0]?.ViewType} View`, value: `${localCustomView?.[0]?.ViewType}` }] });
            }

            let localGridFilterVal = JSON.parse(localCustomView?.[0]?.['FilterQuery']);
            let AndArr = [];
            if (localGridFilterVal && localGridFilterVal.length > 0) {
                AndArr = localGridFilterVal?.reduce((a, e1, i) => {
                    if (e1 != 'and')
                        a.push(e1);
                    return a;
                }, []);
            }
            let finalArr = [];
            AndArr?.map(item => {
                let OrArr = item?.reduce((a, e2, i) => {
                    if (e2 != 'or')
                        a.push(e2);
                    return a;
                }, []);

                let fVal = [];
                OrArr?.map(item1 => {
                    fVal.push(item1?.[2]);
                });
                finalArr.push({ label: OrArr?.[0]?.[0], value: fVal });
            });
            let selArr = [];
            finalArr?.map(item2 => {
                //let selArr1 = this.state.AllFilterArr?.filter(obj => obj.internalName == item2.label);
                let selArr1 = [];
                if (this.state.checked1 === true) {
                    selArr1 = this.state.AllFilterArr?.filter(obj => obj.internalName == item2.label && (obj.viewCategory === "Plan" || obj.viewCategory === "Both"));
                }
                if (this.state.checked1 === false) {
                    selArr1 = this.state.AllFilterArr?.filter(obj => obj.internalName == item2.label && (obj.viewCategory === "Product" || obj.viewCategory === "Both"));
                }
                selArr1[0]?.optionList.map(rec => {
                    rec.visible = false;
                });
                if (selArr1.length > 0)
                    selArr.push(selArr1?.[0]);
            });
            if (selArr) {
                selArr?.map(item3 => {
                    let finalArr1 = finalArr?.filter(obj => obj?.label == item3?.internalName);
                    finalArr1[0]?.value.map(value => {
                        item3.optionList?.map(item4 => {
                            if (item4?.text == value) {
                                item4.visible = true;
                            }
                        });
                    });
                });
            }

            let diffArr1 = [];
            if (selArr.length > 0)
                diffArr1 = this.state.AllFilterArr?.filter(({ internalName: internalName }) => !selArr?.some(({ internalName: internalName1 }) => internalName1 == internalName));
            else diffArr1 = this.state.AllFilterArr;
            let availableArr1 = [];
            selArr.map(item3 => {
                let availableArr2 = this.state.AllFilterArr.filter(item4 => item4.internalName != item3.internalName);
                availableArr1.push(availableArr2?.[0]);
            });

            let colArray = JSON.parse(localCustomView?.[0]?.ColumnsToBeShown);
            let diffArr = this.state.AllColumnArray.filter(({ dataField: dataField }) => !colArray.some(({ dataField: dataField1 }) => dataField1 == dataField));

            let fil = localCustomView?.[0]?.FilterQuery ? JSON.parse(localCustomView?.[0]?.FilterQuery) : '';
            selArr = selArr?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
            diffArr1 = diffArr1?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
            diffArr = diffArr?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

            this.setState({
                currentViewName: e.value,
                AvailableColArray: diffArr,
                SelectedColArray: colArray,
                SelectedFilterArr: selArr,
                AvailableFilterArr: diffArr1,
                gridFilterValue: fil,// ["BusinessUnit", "=", "IMRU"],
                ViewType: localCustomView?.[0]?.ViewType,
                activeViewID: localCustomView?.[0]?.ID, //view ID 
                defaultView: localCustomView?.[0]?.['DefaultView']
            });
        } catch (error) {
            console.error(error);
            let errorMsg = {
                Source: 'Main Product Grid-ViewChangeHandler',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    protected onDropItem = e => {

        try {
            let selectedCols = [...this.state.SelectedColArray];
            const dragItemContent = selectedCols[this.dragItemRef.current];
            selectedCols.splice(this.dragItemRef.current, 1);
            selectedCols.splice(this.dragOverItemRef.current, 0, dragItemContent);
            this.dragItemRef.current = null;
            this.dragOverItemRef.current = null;
            this.setState({ SelectedColArray: selectedCols });

        } catch (error) {
            let errorMsg = {
                Source: 'ProductGridTable-onDropItem',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
        }
    }

    public AddSelectedColumn = (e) => {
        //move the from avilable column to selected columns
        const buttonText = e.currentTarget.innerText;
        let sel = this.state.SelectedColArray;//available col filter 
        //let remainingArr = this.state.AvailableColArray.filter(data => data?.caption != buttonText);//exclude selected item 
        // let result = this.state.AvailableColArray.find(obj => {
        //     return obj?.caption == buttonText;
        // });
        let remainingArr = []; //this.state.AvailableColArray.filter(data => data?.caption != buttonText);//exclude selected item 
        let result = {};
        if (this.state.checked1 == true) {
            remainingArr = this.state.AvailableColArray.filter(data => data?.caption != buttonText && data?.ViewType == "Plan");//exclude selected item 
            result = this.state.AvailableColArray.find(obj => {
                if (obj.ViewType == "Plan") {
                    return obj?.caption == buttonText;
                }
            });
        } else if (this.state.checked1 == false) {
            remainingArr = this.state.AvailableColArray.filter(data => data?.caption != buttonText && data?.ViewType == "Product");//exclude selected item 
            result = this.state.AvailableColArray.find(obj => {
                if (obj.ViewType == "Product") {
                    return obj?.caption == buttonText;
                }
            });
        }

        sel.push(result);
        remainingArr = remainingArr?.sort((a, b) => a.caption?.toString().toLowerCase() > b.caption?.toString().toLowerCase() ? 1 : a.caption?.toString().toLowerCase() < b.caption?.toString().toLowerCase() ? -1 : 0);

        this.setState({
            AvailableColArray: remainingArr,
            SelectedColArray: sel
        });
    }

    public RemoveSelectedFilter = (item) => {
        let selectedFilter = this.state.SelectedFilterArr.filter(obj => obj.filterCol != item.filterCol);
        let filterToAdd = this.state.SelectedFilterArr.filter(obj => obj.filterCol == item.filterCol);
        let availableFilter = this.state.AvailableFilterArr;
        availableFilter.push(filterToAdd?.[0]);
        selectedFilter = selectedFilter?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
        availableFilter = availableFilter?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
        this.setState({ SelectedFilterArr: selectedFilter, AvailableFilterArr: availableFilter });
    }

    public AllNoneFilterChange = (e, item2, type) => {
        let type1;
        if (type == 'All') type1 = 'None';
        if (type == 'None') type1 = 'All';
        let localAllNone = this.state.AllNoneFilter;
        let localSelected = this.state.SelectedFilterArr;
        localAllNone.map(item => {
            if (item.filterCol == item2?.filterCol) {
                item['optionList'][type] = e.value;
                if (e.value) item['optionList'][type1] = !e.value;

            }
        });
        if (type == 'All' && e.value) {
            localSelected.map(item => {
                if (item.filterCol == item2.filterCol) {
                    item.optionList.map(item3 => {
                        item3.visible = true;
                    });
                }
            });
        }
        else if (type == 'None' && e.value) {
            localSelected.map(item => {
                if (item.filterCol == item2.filterCol) {
                    item.optionList.map(item3 => {
                        item3.visible = false;
                    });
                }
            });
        }

        localSelected = localSelected?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);

        this.setState({ AllNoneFilter: localAllNone, SelectedFilterArr: localSelected });

    }

    public FilterInputSwitch = (value, item) => {
        let localSelectedFilter = this.state.SelectedFilterArr;
        localSelectedFilter.map(obj => {
            if (obj.filterCol == item?.Title) {
                obj.optionList.map(obj1 => {
                    if (obj1.text == item?.text) {
                        obj1.visible = value;
                    }
                });
            }
        });
        localSelectedFilter = localSelectedFilter?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
        this.setState({ SelectedFilterArr: localSelectedFilter });
    }

    public AddSelectedFilter = (e) => {
        //move the from avilable column to selected columns
        let localSelectedFilterArr = this.state.SelectedFilterArr;
        //let SelectedFilterObj = this.state.AvailableFilterArr.filter(obj => obj.filterCol === e.currentTarget.innerText);
        let SelectedFilterObj = [];
        if (this.state.checked1 === true) {
            SelectedFilterObj = this.state.AvailableFilterArr.filter(obj => obj.filterCol === e.currentTarget.innerText && (obj.viewCategory === "Plan" || obj.viewCategory === "Both"));
        }
        else if (this.state.checked1 === false) {
            SelectedFilterObj = this.state.AvailableFilterArr.filter(obj => obj.filterCol === e.currentTarget.innerText && (obj.viewCategory === "Product" || obj.viewCategory === "Both"));
        }
        else {
        }
        SelectedFilterObj?.[0]?.['optionList']?.map(item => {
            item.visible = false;
        });
        localSelectedFilterArr.push(SelectedFilterObj[0]);
        //let AvailableFilterObj = this.state.AvailableFilterArr.filter(obj => obj.filterCol != e.currentTarget.innerText);
        let AvailableFilterObj = [];
        if (this.state.checked1 === true) {
            AvailableFilterObj = this.state.AvailableFilterArr.filter(obj => obj.filterCol != e.currentTarget.innerText && (obj.viewCategory === "Plan" || obj.viewCategory === "Both"));
        }
        else if (this.state.checked1 === false) {
            AvailableFilterObj = this.state.AvailableFilterArr.filter(obj => obj.filterCol != e.currentTarget.innerText && (obj.viewCategory === "Product" || obj.viewCategory === "Both"));
        }
        else {
        }
        //let filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == e.currentTarget.innerText));
        let filterTitle = [...this.state.filterAvailablecolTitle];
        filterTitle.push(e.currentTarget.innerText);
        AvailableFilterObj = AvailableFilterObj?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
        localSelectedFilterArr = localSelectedFilterArr?.sort((a, b) => a.filterCol?.toString().toLowerCase() > b.filterCol?.toString().toLowerCase() ? 1 : a.filterCol?.toString().toLowerCase() < b.filterCol?.toString().toLowerCase() ? -1 : 0);
        this.setState({
            filterAvailablecolTitle: filterTitle,
            SelectedFilterArr: localSelectedFilterArr,
            AvailableFilterArr: AvailableFilterObj
        });
    }

    public SaveView = async (e) => {
        //newViewName
        // add an item to the list        
        let filterQuery = [];
        if (this.state.SelectedColArray?.length > 0 || this.state.SelectedFilterArr.length > 0 && (this.state.newViewName != null && this.state.newViewName != undefined && this.state.newViewName != '')) {
            this.state.SelectedFilterArr?.map(obj => {
                let filterQuery1 = [];
                let filterObj = obj?.optionList.filter(obj1 => obj1.visible == true);
                filterObj.map(obj2 => {
                    let arr = [];
                    arr.push(obj2.InternalGridColName, "=", obj2.actualValue);
                    if (arr) filterQuery1.push(arr, 'or');
                });
                if (filterQuery1) filterQuery1.pop();
                if (filterQuery1)
                    filterQuery.push(filterQuery1, 'and');
            });
            if (filterQuery) filterQuery.pop();

            let selectedColArrToSave = [];
            //let localSelectedColArr = this.state.SelectedColArray.map(item => {
            this.state.SelectedColArray.map(item => {
                let obj = {
                    caption: item.caption,
                    dataField: item.dataField,
                    alignment: item.alignment,
                    width: item.width,
                    dataType: item.dataType,
                    visible: item.visible,
                    ViewType: this.state.checked1 ? "Plan" : "Product"
                };
                selectedColArrToSave.push(obj);
            });
            if (!this.state.newViewInputVisible) {
                let Updatedata = {
                    ViewName: this.state.currentViewName,
                    ViewType: this.state.ViewType,
                    ColumnsToBeShown: JSON.stringify(selectedColArrToSave),
                    DefaultView: this.state.defaultView,
                    FilterQuery: JSON.stringify(filterQuery)
                };

                if (this.state.ViewType != "Public") {
                    Updatedata['UserEmail'] = this.props?.currentUser?.Email;
                }
                this.setState({ gridFilterValue: filterQuery });
                let localCustomViewArr = this.state.customViewFilterArr;
                localCustomViewArr.map(obj => {
                    if (obj.ID == this.state.activeViewID) {
                        obj.FilterQuery = JSON.stringify(filterQuery);
                    }
                });
                this.setState({ customViewFilterArr: localCustomViewArr });

                //code to update the defualt view 
                let defaultViewID = null;
                let viewCateg = "";
                if (this.state.checked1) {
                    viewCateg = "Plan";
                } else {
                    viewCateg = "Product";
                }

                if (this.state.ViewType == 'Public') {
                    defaultViewID = this.state.customViewFilterArr.filter(item => item.DefaultView === true && item.ViewType == this.state.ViewType && item.ViewCategory == viewCateg);
                } else {
                    defaultViewID = this.state.customViewFilterArr.filter(item => item.DefaultView === true && item.ViewType == this.state.ViewType && item.ViewCategory == viewCateg && item.UserEmail == this.props?.currentUser?.Email);
                }
                if (defaultViewID.length > 0 && this.state.defaultView) {
                    const defaultID = defaultViewID?.[0]?.['ID'];
                    DataService.updateItemsInList('GLO_CustomViewFilter', defaultID, { DefaultView: false })
                        .then(async data => {
                            this.updateCustomView(this.state.activeViewID, Updatedata).catch(e => console.log(e))
                        }).catch(err => {
                            console.log('Error occured : ', err);
                        });
                }
                else {
                    this.updateCustomView(this.state.activeViewID, Updatedata).catch(e => console.log(e))
                }
            }
            else {
                let count = 0;
                // this.state.viewDropdownOptions.map(option => {
                //     if (option.label == this.state.newViewName) {
                //         count++;
                //     }
                // });
                // check the existing view name
                if (this.state.checked1 == true) {
                    this.state.viewDropdownOptions.map(option => {
                        if (option.label == this.state.newViewName && option.viewCategory == "Plan") {
                            count++;
                        }
                    });
                } else if (this.state.checked1 == false) {
                    this.state.viewDropdownOptions.map(option => {
                        if (option.label == this.state.newViewName && option.viewCategory == "Product") {
                            count++;
                        }
                    });
                }
                if (this.state.newViewName != null && this.state.newViewName != undefined && this.state.newViewName != '') {
                    if (count == 0) {
                        if (this.state.SelectedColArray?.length > 0) {
                            let dataArr = [...this.state.viewDropdownOptions];
                            //let dataArr1 = [...this.state.gridViewOptions];
                            let dataArr1 = this.state.checked1 ? this.state.gridViewOptionsPlan : this.state.gridViewOptionsProject;
                            dataArr.push({ label: this.state.newViewName, value: this.state.newViewName });
                            dataArr1.pop();
                            dataArr1.push(this.state.newViewName);
                            if (this.state.EditIconFlag) dataArr1.push('Manage Views');
                            //this.setState({ viewDropdownOptions: dataArr, gridViewOptions: dataArr1 });
                            if (this.state.checked1 == true) {
                                this.setState({ viewDropdownOptions: dataArr, gridViewOptionsPlan: dataArr1 });
                            } else if (this.state.checked1 == false) {
                                this.setState({ viewDropdownOptions: dataArr, gridViewOptionsProject: dataArr1 });
                            }
                            let AddViewdata = {
                                ViewName: this.state.newViewName,
                                ViewType: this.state.ViewType,
                                ColumnsToBeShown: JSON.stringify(selectedColArrToSave),
                                DefaultView: this.state.defaultView,
                                FilterQuery: JSON.stringify(filterQuery)
                            };
                            if (this.state.checked1 == true) {
                                AddViewdata['ViewCategory'] = "Plan";
                            } else if (this.state.checked1 == false) {
                                AddViewdata['ViewCategory'] = "Product";
                            }

                            if (this.state.ViewType != "Public") {
                                AddViewdata['UserEmail'] = this.props?.currentUser?.Email;
                            }


                            if (this.state.defaultView) {
                                let defaultViewID = null;

                                if (this.state.ViewType == 'Public') {
                                    defaultViewID = this.state.customViewFilterArr.filter(item => item.DefaultView === true && item.ViewType == this.state.ViewType && item.ViewCategory === AddViewdata['ViewCategory']);
                                } else {
                                    defaultViewID = this.state.customViewFilterArr.filter(item => item.DefaultView === true && item.ViewType == this.state.ViewType && item.UserEmail == this.props?.currentUser?.Email && item.ViewCategory === AddViewdata['ViewCategory']);
                                }
                                if (defaultViewID.length > 0) {
                                    const defaultID = defaultViewID?.[0]?.['ID'];
                                    DataService.updateItemsInList('GLO_CustomViewFilter', defaultID, { DefaultView: false })
                                        .then(async data => {
                                            this.addCustomView(AddViewdata).catch(e => console.log(e))
                                        }).catch(err => {
                                            console.log('Error occured : ', err);
                                            let errorMsg = {
                                                Source: 'Main Product Grid-SaveView',
                                                Message: err.message,
                                                StackTrace: new Error().stack
                                            };
                                            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
                                        });
                                }
                                else {
                                    this.addCustomView(AddViewdata).catch(e => console.log(e))
                                }
                            }
                            else {
                                this.addCustomView(AddViewdata).catch(e => console.log(e))
                            }
                        } else {
                            this.toast?.show({ severity: 'warn', summary: '', detail: 'Please select atleast one selected column', life: 2700 });
                        }
                    } else {
                        this.toast?.show({ severity: 'error', summary: '', detail: 'A view with this name already exists. Please enter some other name', life: 2700 });
                    }
                }
            }
        } else {
            this.toast?.show({ severity: 'warn', summary: '', detail: 'Please select atleast one selected column', life: 2700 });
        }
    }

    public addCustomView = async (AddViewdata) => {
        await DataService.NPLDigitalApps_Context.lists.getByTitle("GLO_CustomViewFilter").items.add(
            AddViewdata
        ).then(async (Items) => {
            this.setState({ gridFilterValue: [], SelectedColArray: this.state.AllColumnArray }, () => {
                setTimeout(() => {
                    this.setState({ displayResponsive: false, newViewName: '', newViewInputVisible: false });
                    this.getProductChecklist().catch(e => console.log(e))
                    this.getcolArr().catch(e => console.log(e))
                }, 100);
            });
            this.toast?.show({ severity: 'success', summary: '', detail: 'Updated successsfully', life: 2700 });
        }).catch(error => {
            console.log(`Error in getting items from + GLO_CustomViewFilter + list : `, error);
            this.setState({ displayResponsive: true });
            let errorMsg = {
                Source: 'Main Product Grid-addCustomView',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
            this.toast?.show({ severity: 'error', summary: '', detail: 'Error in Updating view', life: 2700 });
        });
    }

    public updateCustomView = async (activeViewID, Updatedata) => {
        await DataService.NPLDigitalApps_Context.lists.getByTitle("GLO_CustomViewFilter").items
            .getById(activeViewID)
            .update(Updatedata).then(async (Items) => {
                // check default is present  
                let columnArray = await DataService.fetchAllItems_CustomViewFilter("GLO_CustomViewFilter");
                let publicViewsArrlist = [];
                if (this.state.checked1 == true) {
                    publicViewsArrlist = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Plan" && data.DefaultView == true);
                    if (publicViewsArrlist?.length == 0) {
                        let getAllFieldViewId = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Plan" && data.ViewName == "All Fields")[0].ID;
                        DataService.updateItemsInList('GLO_CustomViewFilter', getAllFieldViewId, { DefaultView: true })
                            .then(async data => {
                                console.log('Updated Successfully : ', data);
                            }).catch(err => {
                                console.log('Error occured : ', err);
                            });
                    }
                }
                if (this.state.checked1 == false) {
                    publicViewsArrlist = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Product" && data.DefaultView == true);
                    if (publicViewsArrlist?.length == 0) {
                        let getAllFieldViewId = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Product" && data.ViewName == "All Fields")[0].ID;
                        DataService.updateItemsInList('GLO_CustomViewFilter', getAllFieldViewId, { DefaultView: true })
                            .then(async data => {
                                console.log('Updated Successfully : ', data);
                            }).catch(err => {
                                console.log('Error occured : ', err);
                            });
                    }
                }
                this.setState({ gridFilterValue: [], SelectedColArray: this.state.AllColumnArray }, () => {
                    setTimeout(() => {
                        this.setState({ displayResponsive: false, newViewName: '' });
                        this.getProductChecklist().catch(e => console.log(e))
                        this.getcolArr().catch(e => console.log(e))
                    }, 100);
                });
                this.toast?.show({ severity: 'success', summary: '', detail: 'Updated successsfully', life: 2700 });
            }).catch(error => {
                console.log(`Error in getting items from + CustomViewFilter + list : `, error);
                this.toast?.show({ severity: 'error', summary: '', detail: 'Error in Updating view', life: 2700 });
                let errorMsg = {
                    Source: 'Main Product Grid-updateCustomView',
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
                this.setState({ displayResponsive: true });
            });
    }

    public deleteCurrentView = async () => {
        await DataService.deleteRec('GLO_CustomViewFilter', this.state.activeViewID).then(async (msg) => {
            let columnArray = await DataService.fetchAllItems_CustomViewFilter("GLO_CustomViewFilter");
            let publicViewsArrlist = [];
            if (this.state.checked1 == true) {
                publicViewsArrlist = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Plan" && data.DefaultView == true);
                if (publicViewsArrlist?.length == 0) {
                    let getAllFieldViewId = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Plan" && data.ViewName == "All Fields")[0].ID;
                    DataService.updateItemsInList('GLO_CustomViewFilter', getAllFieldViewId, { DefaultView: true })
                        .then(async data => {
                            console.log('Updated Successfully : ', data);
                        }).catch(err => {
                            console.log('Error occured : ', err);
                        });
                }
            }
            if (this.state.checked1 == false) {
                publicViewsArrlist = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Product" && data.DefaultView == true);
                if (publicViewsArrlist?.length == 0) {
                    let getAllFieldViewId = columnArray.filter(data => data.ViewType == 'Public' && data.ViewCategory == "Product" && data.ViewName == "All Fields")[0].ID;
                    DataService.updateItemsInList('GLO_CustomViewFilter', getAllFieldViewId, { DefaultView: true })
                        .then(async data => {
                            console.log('Updated Successfully : ', data);
                        }).catch(err => {
                            console.log('Error occured : ', err);
                        });
                }
            }
            this.setState({ deleteViewDialogVisible: false, newViewInputVisible: false, newViewName: '' });
            this.setState({ gridFilterValue: [], SelectedColArray: this.state.AllColumnArray, AvailableFilterArr: this.state.AllFilterArr, SelectedFilterArr: [] }, () => {
                setTimeout(() => {
                    this.getProductChecklist().catch(e => console.log(e))
                    this.getcolArr().catch(e => console.log(e))
                }, 100);
            });
            this.toast?.show({ severity: 'success', summary: '', detail: 'View Deleted successfully', life: 2700 });

        }).catch(error => {
            console.log('Error occured : ', error);
            let errorMsg = {
                Source: 'Main Product Grid-deleteCurrentView',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e));
        });
    }

    public onVerificationClick = (e) => {
        //move the from avilable column to selected columns        
        this.setState({
            IsRedirect: true
        });
    }

    public handleExport = async (e) => {
        try {
            // 
            const workbook = new ExcelJS.Workbook();
            const ProjectDetailsSheet = workbook.addWorksheet('Launch List', { properties: { tabColor: { argb: '81c784' } } });
            const filterExpr = this.dataGrid.instance.getCombinedFilter();
            await this.dataGrid.instance.getDataSource()
                .store()
                .load({ filter: filterExpr })
                .then(async (result) => {
                    console.log('export grd : ', result);
                    let colArr = [];
                    this.state.SelectedColArray.map(item => {
                        colArr.push({ header: item.caption, key: item.dataField, width: 25, wrapText: true })
                    });
                    ProjectDetailsSheet.columns = colArr;

                    result.map(rec => {
                        let rowsData = [];
                        this.state.SelectedColArray.map(item => {
                            let val = rec[item.dataField];
                            if (item.dataType === 'date') val = val ? format(new Date(val), 'MMM-dd-yyyy') : '';
                            if (item.dataField == 'RiskTrend' && val?.includes('->')) val = val.split('->')[1];
                            rowsData.push(val);
                        });
                        ProjectDetailsSheet.addRow(rowsData);
                    });

                    let HeaderCell = ProjectDetailsSheet["_rows"][0]["_cells"];
                    for (let i = 0; i < HeaderCell.length; i++) {
                        let CellAddress = HeaderCell[i]["_address"];
                        ProjectDetailsSheet.getCell(CellAddress).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'add8e6' },
                        };
                        ProjectDetailsSheet.getCell(CellAddress).font = {
                            bold: true
                        };
                    }
                    let DataRows = ProjectDetailsSheet["_rows"];
                    DataRows?.map(row => {
                        row._cells?.map(cell => {
                            let CellAddress = cell["_address"];
                            if (cell["_column"]["_key"] === 'LaunchStatus' ||
                                cell["_column"]["_key"] === 'ResourceStatus' || cell["_column"]["_key"] === 'RiskStatus' ||
                                cell["_column"]["_key"] === 'SupplyContinuityRisk' || cell['_column']['key'] == 'LaunchReadinessStatus') {
                                let CellValue = ProjectDetailsSheet.getCell(CellAddress).value;
                                let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                                colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                                ProjectDetailsSheet.getCell(CellAddress).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: colorfilter['bgColor'] },
                                };
                                ProjectDetailsSheet.getCell(CellAddress).font = {
                                    color: { argb: colorfilter['color'] },
                                };
                                ProjectDetailsSheet.getCell(CellAddress).border = {
                                    top: { style: 'thin', color: { argb: 'D9D9D9' } },
                                    left: { style: 'thin', color: { argb: 'D9D9D9' } },
                                    bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                                    right: { style: 'thin', color: { argb: 'D9D9D9' } },
                                };
                                ProjectDetailsSheet.getCell(CellAddress).value = colorfilter?.value ? colorfilter?.value : ProjectDetailsSheet.getCell(CellAddress).value;

                            }
                        });
                    });
                    let ProjectDetailsHeaderCell = ProjectDetailsSheet["_rows"][0]["_cells"];
                    for (let i = 0; i < ProjectDetailsHeaderCell.length; i++) {
                        let CellAddress = ProjectDetailsHeaderCell[i]["_address"];
                        ProjectDetailsSheet.getCell(CellAddress).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '1976d2' },
                        };
                        ProjectDetailsSheet.getCell(CellAddress).font = {
                            bold: true,
                            color: { argb: 'ffffff' }
                        };
                        console.log(ProjectDetailsSheet.getCell(CellAddress).value)


                    }
                    if (e.itemData === 'Export Project Details') {
                        let DLPPListData = this.ExeAppDataRef.current?.DLPPListData;
                        if (this.refreshFlag === false) {
                            await DataService.fetchAllItems_DLPP('DLPPList').then(resp => {
                                DLPPListData = resp;
                            });
                        }
                        // console.timeLog('Export dlppdata : ',DLPPData);
                        const ProjectPlanSheet = workbook.addWorksheet('Project Plans', { properties: { tabColor: { argb: '81c784' } } });
                        ProjectPlanSheet.columns = [
                            { header: 'Project Name', key: 'ProjectName', width: 35 },
                            { header: 'Launch Lead', key: 'LaunchLead', width: 35 },
                            { header: 'PGS Readiness Date', key: 'LaunchReadinessDate', width: 20 },
                            { header: 'Launch Progress', key: 'LaunchProgress', width: 15 },
                            { header: 'Template', key: 'Template', width: 20 },
                            { header: 'Wave Type', key: 'WaveType', width: 20 },
                            { header: 'Label', key: 'LabelText', width: 35 },
                            { header: 'Region', key: 'Region', width: 15 },
                            { header: 'Market', key: 'Market', width: 15 },
                            { header: 'Country', key: 'Country', width: 15 },
                            { header: 'Shares Presentation With', key: 'ParentMarket', width: 35 },
                            { header: 'Pack Size', key: 'PackSize', width: 15 },
                            { header: 'NPL T6', key: 'DeepDive', width: 10 },
                            { header: 'Plan Creation Status', key: 'PlanStatus', width: 35 },
                        ];

                        let dlppDataToExport = DLPPListData.filter(dlpp => result.some(project => Number(project.DRID) === dlpp.DRID));
                        dlppDataToExport.map(item => {
                            ProjectPlanSheet.addRow({
                                ProjectName: item.ProjectName,
                                LaunchLead: item.PlanOwner.Title,
                                LaunchReadinessDate: item.PGSReadiness ? format(new Date(item.PGSReadiness), 'MMM-dd-yyyy') : '',
                                LaunchProgress: item.LaunchProgress,
                                Template: item.Template,
                                WaveType: item.WaveType,
                                LabelText: item.LabelText,
                                Region: item.Region,
                                Market: item.Market,
                                Country: item.Country,
                                ParentMarket: item.ParentMarket,
                                PackSize: item.PackSize,
                                DeepDive: item.DeepDive ? 'X' : '',
                                PlanStatus: item.PlanStatus
                            });
                        });

                        let ProjectPlanHeaderCell = ProjectPlanSheet["_rows"][0]["_cells"];
                        for (let i = 0; i < ProjectPlanHeaderCell.length; i++) {
                            let CellAddress = ProjectPlanHeaderCell[i]["_address"];
                            ProjectPlanSheet.getCell(CellAddress).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '1976d2' },
                            };
                            ProjectPlanSheet.getCell(CellAddress).font = {
                                bold: true,
                                color: { argb: 'ffffff' }
                            };
                            ProjectPlanSheet.getCell(CellAddress).border = {
                                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                            }

                        }

                        const VerificationSheet = workbook.addWorksheet('Verification', { properties: { tabColor: { argb: '81c784' } } });
                        VerificationSheet.columns = [
                            { header: 'NPL T6', key: 'DeepDive', width: 15 },
                            { header: 'Project Name', key: 'ProjectName', width: 35 },
                            { header: 'Market', key: 'Market', width: 20 },
                            { header: 'Launch Readiness Date', key: 'TaskFinishDate', width: 25 },
                            { header: 'Launch Progress', key: 'LaunchProgress', width: 20 },
                            { header: 'Launch Status', key: 'LaunchStatus', width: 20 },
                            { header: 'Reason Code', key: 'ReasonCode', width: 35 },
                            { header: 'Verified', key: 'LaunchLeadVerified', width: 15 },
                            { header: 'Verified By', key: 'VerifiedBy', width: 35 },
                            { header: 'Comments', key: 'Comments', width: 40 },
                            { header: 'Last Snapshot Date', key: 'LastVerifiedDate', width: 25 }
                        ];

                        let verificationData = result;
                        if (!this.state.checked1)
                            verificationData = this.state.planViewRecordsArray.filter(rec => result.some(productData => productData.DRID == rec.DRID));


                        verificationData.map(project => {
                            VerificationSheet.addRow({
                                DeepDive: project.DeepDive ? 'X' : '',
                                ProjectName: project.ProjectName,
                                Market: project.Market,
                                TaskFinishDate: project.TaskFinishDate ? format(new Date(project.TaskFinishDate), 'MMM-dd-yyyy') : '',
                                LaunchProgress: project.LaunchProgress,
                                LaunchStatus: project.LaunchStatus,
                                ReasonCode: project.ReasonCodeLookUpDescString,
                                LaunchLeadVerified: project.LaunchLeadVerified ? 'X' : '',
                                VerifiedBy: project.LaunchLeadVerifiedBy,
                                Comments: project.Notes,
                                LastVerifiedDate: project.LastNotificationSent ? format(new Date(project.LastNotificationSent), 'MMM-dd-yyyy') : '',
                            });
                        });

                        DataRows = VerificationSheet["_rows"];
                        DataRows?.map(row => {
                            row._cells?.map(cell => {
                                let CellAddress = cell["_address"];
                                if (cell["_column"]["_key"] == 'LaunchStatus') {
                                    let CellValue = VerificationSheet.getCell(CellAddress).value;
                                    let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                                    colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                                    VerificationSheet.getCell(CellAddress).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: colorfilter['bgColor'] },
                                    };
                                    VerificationSheet.getCell(CellAddress).font = {
                                        color: { argb: colorfilter['color'] },
                                    };
                                    VerificationSheet.getCell(CellAddress).border = {
                                        top: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        left: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        right: { style: 'thin', color: { argb: 'D9D9D9' } },
                                    };

                                }
                            });
                        });
                        let VerificationHeaderCell = VerificationSheet["_rows"][0]["_cells"];
                        for (let i = 0; i < VerificationHeaderCell.length; i++) {
                            let CellAddress = VerificationHeaderCell[i]["_address"];
                            VerificationSheet.getCell(CellAddress).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '1976d2' },
                            };
                            VerificationSheet.getCell(CellAddress).font = {
                                bold: true,
                                color: { argb: 'ffffff' }
                            };


                        }

                        let AccomDataAll = this.ExeAppDataRef.current?.AccomplishmentData;
                        let ActDataAll = this.ExeAppDataRef.current?.ActivityData;
                        let RiskAssDataAll = this.ExeAppDataRef.current?.RiskAssessmentData;
                        let ProjectCenterData = this.ExeAppDataRef.current?.DLPPMilestonesData;

                        if (this.refreshFlag === false) {
                            AccomDataAll = await DataService.fetchAllItems_DynamicSite(this.props.siteUrl, 'PGS_Executive_Accomplishments', '*,ProjectID/Id,ProjectID/ProjectName,ProjectID/Title', 'ProjectID');
                            ActDataAll = await DataService.fetchAllItems_DynamicSite(this.props.siteUrl, 'PGS_Executive_Activities', '*,ProjectID/Id,ProjectID/ProjectName,ProjectID/Title', 'ProjectID');
                            RiskAssDataAll = await DataService.fetchAllItems_DynamicSite(this.props.siteUrl, 'PGS_Executive_Risks', '*,ProjectID/Id,ProjectID/ProjectName,ProjectID/Title', 'ProjectID');
                            ProjectCenterData = await DataService.fetchMilestonesForProjectPlanAll();
                            let obj = {
                                AccomplishmentData: AccomDataAll,
                                ActivityData: ActDataAll,
                                RiskAssessmentData: RiskAssDataAll,
                                DLPPMilestonesData: ProjectCenterData,
                                DLPPListData: DLPPListData
                            }
                            this.ExeAppDataRef.current = obj;
                            console.log('Exe data : ', obj);
                        }

                        let AccomData = [], ActData = [], RiskAssData = [], dlppData = [];
                        if (this.state.checked1) {
                            AccomData = AccomDataAll?.filter(accom => result.some(project => project.ID == accom.ProjectIDId));
                            ActData = ActDataAll?.filter(act => result.some(project => project.ID === act.ProjectIDId));
                            RiskAssData = RiskAssDataAll?.filter(risk => result.some(project => project.ID === risk.ProjectIDId));
                            dlppData = ProjectCenterData?.filter(pcData => result.some(project => project.Title == pcData.ProjectId));
                        } else {
                            AccomData = AccomDataAll?.filter(accom => DLPPListData.some(project => project.ProjectGUID == accom.ProjectID?.Title && accom.ProjectID?.Title != null));
                            ActData = ActDataAll?.filter(act => DLPPListData.some(project => project.ProjectGUID == act.ProjectID?.Title && act.ProjectID?.Title));
                            RiskAssData = RiskAssDataAll?.filter(risk => DLPPListData.some(project => project.ProjectGUID == risk.ProjectID?.Title && risk.ProjectID?.Title));
                            dlppData = ProjectCenterData?.filter(pcData => DLPPListData.some(project => project.Title == pcData.ProjectID?.Title));
                        }


                        const AccomplishSheet = workbook.addWorksheet('Accomplishments', { properties: { tabColor: { argb: '81c784' } } });
                        AccomplishSheet.columns = [
                            { header: 'Project Name', key: 'ProjectName', width: 35 },
                            { header: 'Accomplishment', key: 'Accomplishment', width: 35 },
                            { header: 'Date', key: 'Date', width: 15 },
                            { header: 'Activity', key: 'Activity', width: 10 },
                            { header: 'Active', key: 'Active', width: 10 },
                        ];
                        AccomData.map(accom => {
                            AccomplishSheet.addRow({
                                ProjectName: accom.ProjectID?.ProjectName,
                                Accomplishment: accom.Task,
                                Date: accom.Date ? format(new Date(accom['Date']), 'MMM-dd-yyyy') : '',
                                Activity: accom.Activity ? 'X' : '',
                                Active: accom.Active ? 'X' : ''
                            });
                        });

                        let AccomHeaderCell = AccomplishSheet["_rows"][0]["_cells"];
                        for (let i = 0; i < AccomHeaderCell.length; i++) {
                            let CellAddress = AccomHeaderCell[i]["_address"];
                            AccomplishSheet.getCell(CellAddress).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '81c784' },
                            };
                            AccomplishSheet.getCell(CellAddress).font = {
                                bold: true,
                                color: { argb: '000000' }
                            };

                        }

                        const DLPPMilestoneSheet = workbook.addWorksheet('Automated DLPP Milestones', { properties: { tabColor: { argb: '81c784' } } });
                        DLPPMilestoneSheet.columns = [
                            { header: 'Project Name', key: 'ProjectName', width: 35 },
                            { header: 'Milestone/Deliverables', key: 'TaskName', width: 35 },
                            { header: 'Target Date', key: 'TaskFinishDate', width: 35 },
                            { header: 'Status', key: 'LaunchHealth', width: 20 },
                            { header: 'NPL T6', key: 'DeepDiveMilestone', width: 20 }
                        ];

                        dlppData?.map(data => {
                            DLPPMilestoneSheet.addRow({
                                ProjectName: data.ProjectName,
                                TaskName: data.TaskName,
                                TaskFinishDate: data.TaskFinishDate ? format(new Date(data.TaskFinishDate), 'MMM-dd-yyyy') : "",
                                LaunchHealth: data.LaunchHealth,
                                DeepDiveMilestone: data.DeepDiveMilestone ? 'X' : ''
                            });
                        });

                        DataRows = DLPPMilestoneSheet["_rows"];
                        DataRows?.map(row => {
                            row._cells?.map(cell => {
                                let CellAddress = cell["_address"];
                                if (cell["_column"]["_key"] == 'Status') {
                                    let CellValue = DLPPMilestoneSheet.getCell(CellAddress).value;
                                    let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                                    colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                                    DLPPMilestoneSheet.getCell(CellAddress).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: colorfilter['bgColor'] },
                                    };
                                    DLPPMilestoneSheet.getCell(CellAddress).font = {
                                        color: { argb: colorfilter['color'] },
                                    };
                                    DLPPMilestoneSheet.getCell(CellAddress).border = {
                                        top: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        left: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        right: { style: 'thin', color: { argb: 'D9D9D9' } },
                                    };

                                }
                            });
                        });
                        let MilestoneHeaderCell = DLPPMilestoneSheet["_rows"][0]["_cells"];
                        for (let i = 0; i < MilestoneHeaderCell.length; i++) {
                            let CellAddress = MilestoneHeaderCell[i]["_address"];
                            DLPPMilestoneSheet.getCell(CellAddress).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '1976d2' },
                            };
                            DLPPMilestoneSheet.getCell(CellAddress).font = {
                                bold: true,
                                color: { argb: 'ffffff' }
                            };


                        }


                        const ActivitiesSheet = workbook.addWorksheet('Activities', { properties: { tabColor: { argb: '1976d2' } } });
                        ActivitiesSheet.columns = [
                            { header: 'Project Name', key: 'ProjectName', width: 35 },
                            { header: 'Activities', key: 'Activities', width: 65 },
                            { header: 'Date', key: 'Date', width: 20 },
                            { header: 'Activity Status', key: 'Status', width: 20 },
                            { header: 'Active', key: 'Active', width: 20 }
                        ];
                        ActData.map(act => {
                            ActivitiesSheet.addRow({
                                ProjectName: act.ProjectID?.ProjectName,
                                Activities: act.Activity,
                                Date: act.Date ? format(new Date(act['Date']), 'MMM-dd-yyyy') : '',
                                Status: act.Status,
                                Active: act.Active ? 'X' : ''
                            });
                        });

                        DataRows = ActivitiesSheet["_rows"];
                        DataRows?.map(row => {
                            row._cells?.map(cell => {
                                let CellAddress = cell["_address"];
                                if (cell["_column"]["_key"] == 'Status') {
                                    let CellValue = ActivitiesSheet.getCell(CellAddress).value;
                                    let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                                    colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                                    ActivitiesSheet.getCell(CellAddress).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: colorfilter['bgColor'] },
                                    };
                                    ActivitiesSheet.getCell(CellAddress).font = {
                                        color: { argb: colorfilter['color'] },
                                    };
                                    ActivitiesSheet.getCell(CellAddress).border = {
                                        top: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        left: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        right: { style: 'thin', color: { argb: 'D9D9D9' } },
                                    };

                                }
                            });
                        });

                        let ActivitiesHeaderCell = ActivitiesSheet["_rows"][0]["_cells"];
                        for (let i = 0; i < ActivitiesHeaderCell.length; i++) {
                            let CellAddress = ActivitiesHeaderCell[i]["_address"];
                            ActivitiesSheet.getCell(CellAddress).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '1976d2' },
                            };
                            ActivitiesSheet.getCell(CellAddress).font = {
                                bold: true,
                                color: { argb: 'ffffff' }
                            };

                        }
                        const RiskAssesmentSheet = workbook.addWorksheet('Risk Assessments', { properties: { tabColor: { argb: 'edb0b0' } } });
                        RiskAssesmentSheet.columns = [
                            { header: 'Project Name', key: 'ProjectName', width: 35 },
                            { header: 'Risk/Issue', key: 'RiskTitle', width: 65 },
                            { header: 'Risk Date', key: 'RiskDate', width: 20 },
                            { header: 'Risk Status', key: 'RiskStatus', width: 20 },
                            { header: 'Mitigation Plan', key: 'Mitigation', width: 65 },
                            { header: 'Mitigation Date', key: 'MitigationDate', width: 20 },
                            { header: 'Mitigation Status', key: 'MitigationStatus', width: 20 },
                            { header: 'Active', key: 'Active', width: 20 },
                            { header: 'NPL T6', key: 'NPLT6', width: 20 },
                            { header: 'NPL T6 Risk/Issue', key: 'DeepDiveRiskTitle', width: 30 },
                            { header: 'NPL T6 Risk Category', key: 'DeepDiveRiskCategory', width: 30 },
                            { header: 'NPL T6 Risk Status', key: 'DeepDiveRiskStatus', width: 30 }
                        ];
                        RiskAssData.map(risk => {
                            RiskAssesmentSheet.addRow({
                                ProjectName: risk.ProjectID?.ProjectName,
                                RiskTitle: risk.RiskTitle,
                                RiskDate: risk.RiskDate ? format(new Date(risk.RiskDate), 'MMM-dd-yyyy') : '',
                                RiskStatus: risk.RiskStatus,
                                Mitigation: risk.Mitigation,
                                MitigationDate: risk.MitigationDate ? format(new Date(risk.MitigationDate), 'MMM-dd-yyyy') : '',
                                MitigationStatus: risk.MitigationStatus,
                                Active: risk.Active ? 'X' : '',
                                NPLT6: risk.DeepDive ? 'X' : '',
                                DeepDiveRiskTitle: risk.DeepDiveRiskTitle,
                                DeepDiveRiskCategory: risk.DeepDiveRiskCategory,
                                DeepDiveRiskStatus: risk.DeepDiveRiskStatus
                            });
                        });
                        DataRows = RiskAssesmentSheet["_rows"];
                        DataRows?.map(row => {
                            row._cells?.map(cell => {
                                let CellAddress = cell["_address"];
                                if (cell["_column"]["_key"] == 'RiskStatus' || cell["_column"]["_key"] == 'MitigationStatus' || cell["_column"]["_key"] == 'DeepDiveRiskStatus') {
                                    let CellValue = RiskAssesmentSheet.getCell(CellAddress).value;
                                    let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                                    colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                                    RiskAssesmentSheet.getCell(CellAddress).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: colorfilter.bgColor },
                                    };
                                    RiskAssesmentSheet.getCell(CellAddress).font = {
                                        color: { argb: colorfilter.color },
                                    };
                                    RiskAssesmentSheet.getCell(CellAddress).border = {
                                        top: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        left: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                                        right: { style: 'thin', color: { argb: 'D9D9D9' } },
                                    };
                                }
                            });
                        });
                        let RiskAssessmentHeaderCell = RiskAssesmentSheet["_rows"][0]["_cells"];
                        for (let i = 0; i < RiskAssessmentHeaderCell.length; i++) {
                            let CellAddress = RiskAssessmentHeaderCell[i]["_address"];
                            RiskAssesmentSheet.getCell(CellAddress).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'edb0b0' },
                            };
                            RiskAssesmentSheet.getCell(CellAddress).font = {
                                bold: true,
                                color: { argb: '000000' }
                            };
                        }
                        this.refreshFlag = true;
                    }

                    //Download Excel
                    workbook.xlsx.writeBuffer().then(buffer => {
                        // done
                        const blob = new Blob([buffer], { type: "application/xlsx" });
                        let fileNameSuffix = 'GLO_';
                        if (e.itemData === 'Export Project Details') fileNameSuffix += 'All_'
                        FileSaver.saveAs(blob, fileNameSuffix + (new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + new Date().getHours() + "_" + new Date().getMinutes()) + '.xlsx');
                    }).catch(e => console.log(e))

                }).catch(ErrorMsg => {
                    console.log('Msg occured : ', ErrorMsg);
                    let errorMsg = {
                        Source: 'Main Product Grid-filter grid Data-handle Export',
                        Message: ErrorMsg.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e))
                });


        } catch (error) {
            console.log('Error occured : ', error);
            let errorMsg = {
                Source: 'Main Product Grid-handleExport',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(e => console.log(e));
        }
    }

    public globalFilterClear = () => {
        // this.dataGrid?.instance?.clearFilter();
        // this.dataGrid?.instance?.clearGrouping();
        //let filtervalues = this.state['AllCatColVal'].filter(val => (val.Title == 'Sub Business Unit'));        
        if (this.state.ActiveIndex === 1) {
            this.renderLaunchLead(this.commonProjectListRef.current);
            this.renderLaunchLeadProduct(this.projectDetailsListRef.current);
        }
        else if (this.state.ActiveIndex === 2) {
            this.renderLaunchStatus(this.commonProjectListRef.current);
            this.renderSubBusinessUnit(this.commonProjectListRef.current);
            this.renderProductSubBusinessUnit(this.projectDetailsListRef.current);
        }
        else if (this.state.ActiveIndex === 3) {
            this.renderSubBusinessUnit(this.commonProjectListRef.current);
            this.renderProductSubBusinessUnit(this.projectDetailsListRef.current);
        }
        else {

        }
        this.setState({
            //filterStatus: 'Sub Business Unit',
            //Navitem: filtervalues,
            selectednavitem: null,
            QueryString: '',
            QueryStringLL: '',
            shouldClearGlobally: true
            //IsSubBuSelected: false
        });
        // this.dataGrid?.instance?.clearSorting();
    }
    projectNameRender = (e) => {
        // console.log('Project name render:',e);
        if ((e.data.ProjectName != null && e.data.ProjectName != ''))
            return (<a className='project-link' onClick={() => this.onProjClick(e.data.ProjectName)}>{e.data.ProjectName}</a>);
        else
            return (<span>{e.data.ProjectName}</span>);
    }
    verifiedRender = (e) => {
        if (e.data.LaunchLeadVerified === true) {
            return (<Checkbox checked={e.data.LaunchLeadVerified} disabled={true}></Checkbox>);
        }
        else {
            return (<Checkbox disabled={true}></Checkbox>);
        }

    }
    deepDiveRender = (e) => {
        if (e.data.DeepDive === true) {
            return (<Checkbox checked={true} disabled={true}></Checkbox>);
        }
        else {
            return (<Checkbox disabled={true}></Checkbox>);
        }
    }
    public CalculateCellValueTemplate = (e, option) => {
        try {
            if (e[option] === true) {
                return e[option] === true ? "Yes" : "No";
            }
            //else if(e[option] === false) {
            //     return e[option] === false ? "No" : "No";
            // } 
            else {
                return "No";
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
    isActiveRender = (e) => {
        if (e.data.IsActive === true) {
            return (<Checkbox checked={e.data.IsActive} disabled={true}></Checkbox>);
        }
        else {
            return (<Checkbox disabled={true}></Checkbox>);
        }
    }
    dridRender = (e) => {
        return (
            <div
                onClick={() => this.navigateToCreateDRID(e.data.DRID)}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                aria-disabled
            >
                <a target="_blank">
                    {e.data.DRID}
                </a>
            </div>
        );
    }

    public navigateToCreateDRID = (drid) => {
        const devPostFixUrl = '/SitePages/CreateDR.aspx?mode=View&ProjectID=' + drid
        const qaPostFixUrl = '/SitePages/CreateDRProd.aspx?mode=View&ProjectID=' + drid
        const prodPostFixUrl = '/SitePages/CreateDRProd.aspx?mode=View&ProjectID=' + drid

        const prefixUrl = DataService.NPL_Url;

        const postfixUrl = DataService.environment === "DEV" ?
            devPostFixUrl : DataService.environment === "QA" ?
                qaPostFixUrl : prodPostFixUrl

        window.open(prefixUrl + postfixUrl)
    }


    onProjClick = (proj) => {
        //let projLink = 'ms-project:osp|u|https://pfizer.sharepoint.com/sites/nplpwa-dev|g|c10ea28c-31c3-49a5-8977-f94f3fb79743|p|<>\\' + proj + '|r|0';
        let projLink = 'ms-project:osp|u|' + DataService.ProjectCenterUrl + '|g|c10ea28c-31c3-49a5-8977-f94f3fb79743|p|<>\\' + proj + '|r|0';
        window.open(projLink, '_blank');
    }

    public render(): React.ReactElement<IProductGridTable> {
        const pageSizes = [10, 25, 50, 100, 'all'];
        var regEx = /[\/,+,.,(,),-,]/g;
        let Planisware = "PlaniswareId : " + this.state.SelectedIportData.PlaniswareID;
        // let AIEditHeader = this.state.SelectedGOLDStgData?.TradeName? this.state.SelectedGOLDStgData?.TradeName + " - " + this.state.SelectedGOLDStgData?.Molecule + " - " + 
        // this.state.SelectedGOLDStgData?.Brand + " - " + this.state.SelectedGOLDStgData?.Indication + " - " + this.state.SelectedGOLDStgData?.Country :
        // this.state.SelectedGOLDStgData?.Molecule + " - " + 
        // this.state.SelectedGOLDStgData?.Brand + " - " + this.state.SelectedGOLDStgData?.Indication + " - " + this.state.SelectedGOLDStgData?.Country;
        let AIEditHeader = this.state.SelectedGOLDStgData?.Molecule + " - " + this.state.SelectedGOLDStgData?.Country;

        this.LABEL_NAME1 = this.state.SelectedIDData?.ProposedGRP && this.state.SelectedIDData?.ProposedGRP.includes('->') ? this.state.SelectedIDData?.ProposedGRP?.split('->')[1] : this.state.SelectedIDData?.ProposedGRP;
        if (regEx?.test(this.LABEL_NAME1)) {
            this.LABEL_NAME = this.LABEL_NAME1?.replace(regEx, "_");
        } else {
            this.LABEL_NAME = this.LABEL_NAME1;
        }

        if (this.state.MarketData.Country && this.state.MarketData.Country.length > 0 && this.state.MarketData?.ProjectNameSuffix != '') {
            this.SUFFIX = `${this.state.MarketData?.Country[0]?.split("->")[1]}-${this.state.MarketData?.ProjectNameSuffix}`
        } else if (this.state.MarketData?.ProjectNameSuffix == '' && this.state.MarketData.Country.length > 0) {
            this.SUFFIX = `${this.state.MarketData?.Country[0]?.split("->")[1]}`;
        } else {
            this.SUFFIX = ''
        }
        this.PREFIX = this.state.IndicationPrefix !== '' ? `${this.state.IndicationPrefix}` : '';

        if (this.state.MarketData?.Indication?.length > 0) {
            this.ProposedProjectName = `${this.LABEL_NAME}${this.LABEL_NAME != '' || this.SUFFIX != '' ? '-' : ''}${this.PREFIX}${this.LABEL_NAME != '' || this.SUFFIX != '' ? '-' : ''}${this.SUFFIX}`
        } else {
            this.ProposedProjectName = '';
        }
        //  this.PREFIX=(this.state.MarketData?.ProjectNameSuffix !='' &&  this.state.MarketData?.ProjectNameSuffix )? + "T" + '-' + this.state.MarketData?.ProjectNameSuffix: "T";

        //Launch List 
        this.LaunchLABEL_NAME1 = this.state.SelectedIDData?.ProposedGRP && this.state.SelectedIDData?.ProposedGRP.includes('->') ? this.state.SelectedIDData?.ProposedGRP?.split('->')[1] : this.state.SelectedIDData?.ProposedGRP;
        if (regEx?.test(this.LaunchLABEL_NAME1)) {
            this.LaunchLABEL_NAME = this.LaunchLABEL_NAME1?.replace(regEx, "_");
        } else {
            this.LaunchLABEL_NAME = this.LaunchLABEL_NAME1;
        }

        if (this.state.LaunchListMarketData.Country && this.state.LaunchListMarketData.Country.length > 0 && this.state.LaunchListMarketData?.ProjectNameSuffix != '') {
            this.LaunchSUFFIX = `${this.state.LaunchListMarketData?.Country[0]?.split("->")[1]}-${this.state.LaunchListMarketData?.ProjectNameSuffix}`
        } else if (this.state.LaunchListMarketData?.ProjectNameSuffix == '' && this.state.LaunchListMarketData.Country.length > 0) {
            this.LaunchSUFFIX = `${this.state.LaunchListMarketData?.Country[0]?.split("->")[1]}`;
        } else {
            this.LaunchSUFFIX = ''
        }
        this.LaunchPREFIX = this.state.IndicationPrefix !== '' ? `${this.state.IndicationPrefix}` : '';

        this.LaunchProposedProjectName = `${this.LaunchLABEL_NAME}${this.LaunchLABEL_NAME != '' || this.LaunchSUFFIX != '' ? '-' : ''}${this.LaunchPREFIX}${this.LaunchLABEL_NAME != '' || this.LaunchSUFFIX != '' ? '-' : ''}${this.LaunchSUFFIX}`

        return (
            <div>
                <div className='ProductGrid' style={{ backgroundColor: "#f2f2f8" }}>
                    <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' />
                    <Toast ref={(el) => { this.toast = el }} position="bottom-right" />
                    {!this.state.opened &&
                        <div className="col-2 rightArrow"><CustomToolbar items={this.toolbarItemsRightArrow} style={{ width: '20%', marginBottom: '-34px' }} />
                        </div>}
                    <div className='container-fluid'>
                        <div className='row dx-Mockup-Background'>
                            <div className={this.state.opened ? 'col-12 rect demo-light' : 'col-12 rect1 demo-light'} style={!this.state.opened ? { marginTop: '-10px', marginLeft: '3%' } : {}}>
                                <Drawer
                                    opened={this.state.opened}
                                    openedStateMode={'shrink'}
                                    position={'left'}
                                    revealMode={'slide'}
                                    component={this.navigation}
                                    closeOnOutsideClick={true}
                                //height={680} //680
                                >
                                    <div className="recordStatusOuterContainer">
                                        <div className='program-active-container'>
                                            {/* <DropDownButton
                                                className="p-button-raised exportDropdown"
                                                items={['Export Current View', 'Export Project Details']}
                                                onItemClick={this.handleExport}
                                                dropDownOptions={buttonDropDownOptions}
                                                useSelectMode={true}
                                                icon={'download'}
                                                text="Export"
                                            /> */}
                                            {this.state.SelectedTabName == "Launch List" && <Button className='p-button-raised p-button-rounded' style={{ width: "20rem", backgroundColor: "#001689", borderColor: "rgb(0 0 201)", float: 'left', display: 'flex', justifyContent: 'center' }}
                                            >
                                                <span style={{ color: "white" }}>Data Repository&nbsp;</span>
                                                <InputSwitch style={{ borderRadius: "1rem", height: "1.5rem", marginLeft: "4%", marginRight: '4%' }} checked={this.state.DRPChecked} onChange={(e) => this.handleOnChangeView(e)} />
                                                <span style={{ color: "white" }}>&nbsp;Plan View</span>
                                            </Button>}
                                            <Button title="Clear" className='p-button-raised p-button-rounded' style={{ backgroundColor: "#001689" }} onClick={(e) => this.globalFilterClear()} icon='pi pi-filter-slash'>
                                                <span style={{ color: "white" }}>&nbsp;Clear</span>
                                            </Button>

                                            {/* <DropDownButton
                                                className="p-button-raised viewDropDown"
                                                items={this.state.checked1 ? this.state.gridViewOptionsPlan : this.state.gridViewOptionsProject}
                                                onItemClick={this.gridViewChangeHandler}
                                                dropDownOptions={buttonDropDownOptions}
                                                useSelectMode={true}
                                                selectedItem={e => console.log(e)}
                                                icon={views}
                                                text="Views"
                                                itemRender={this.gridViewDropdownTemplte}
                                            /> */}
                                            {/* <span style={{ marginRight: '5px' }}>Program Active:</span> */}
                                            {/* <Button className='p-button-raised p-button-rounded' style={this.state.opened ? { width: "20rem", backgroundColor: "#001689", borderColor: "rgb(0 0 201)", float: 'left', display: 'flex', justifyContent: 'center' } : { width: "20rem", backgroundColor: "rgb(0 0 201)", borderColor: "rgb(0 0 201)", float: 'left', display: 'flex', justifyContent: 'center' }} >
                                                <span style={{ color: "white" }}>Data Repository&nbsp;</span>
                                                <InputSwitch style={{ borderRadius: "1rem", height: "1.5rem", marginLeft: "4%", marginRight: '4%' }} checked={this.state.checked1} onChange={this.showAllChange} />
                                                <span style={{ color: "white" }}>&nbsp;Plan View</span>
                                            </Button> */}

                                        </div>
                                    </div>
                                    <TabView activeIndex={this.state.ActiveIndex} onTabChange={(e) => this.ontabChange(e)}>
                                        {this.state.TabNameDetails?.map((Name) => {
                                            return (
                                                <TabPanel header={Name.Title}>
                                                </TabPanel>
                                            )
                                        })}

                                        {/* <TabPanel header="Launch" >
                                        </TabPanel> */}
                                        {/* <TabPanel header="Launch Lead" >
                                            <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-3%' }}  >
                                                <AccordionTab header=''>
                                                    {this.state.checked1 ?
                                                        this.state.jsonDataLaunchLead.length > 0 ?
                                                            <div className="card overflow-x-auto" style={{ border: '0px' }}>
                                                                <OrganizationChart value={this.state.jsonDataLaunchLead} nodeTemplate={this.nodeTemplate} />
                                                            </div> : <div>No Data</div>
                                                        :
                                                        this.state.jsonDataProductLaunchLead.length > 0 ?
                                                            <div className="card overflow-x-auto" style={{ border: '0px' }}>
                                                                <OrganizationChart value={this.state.jsonDataProductLaunchLead} nodeTemplate={this.nodeTemplate} />
                                                            </div> : <div>No Data</div>
                                                    }
                                                </AccordionTab>
                                            </Accordion>
                                        </TabPanel>
                                        {this.state.checked1 ?
                                            <TabPanel header="Launch Status">
                                                <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-3%' }}>
                                                    <AccordionTab header=''>
                                                        {this.state.jsonDataArrayLaunchStatus?.length > 0 ?
                                                            <div className="card overflow-x-auto" style={{ border: '0px' }}>
                                                                <OrganizationChart value={this.state.jsonDataArrayLaunchStatus} nodeTemplate={this.nodeTemplate} />
                                                            </div> :
                                                            <div>No Data</div>}
                                                    </AccordionTab>
                                                </Accordion>
                                            </TabPanel>
                                            : <div></div>}
                                        <TabPanel header="Category" >
                                            <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-3%' }}  >
                                                <AccordionTab header=''>
                                                    {this.state.checked1 ?
                                                        this.state.jsonDataArray.length > 0 ?
                                                            <div className="card overflow-x-auto" style={{ border: '0px' }}>
                                                                <OrganizationChart value={this.state.jsonDataArray} nodeTemplate={this.nodeTemplate} />
                                                            </div> : <div>No Data</div>
                                                        :
                                                        this.state.jsonDataArrayProduct.length > 0 ?
                                                            <div className="card overflow-x-auto" style={{ border: '0px' }}>
                                                                <OrganizationChart value={this.state.jsonDataArrayProduct} nodeTemplate={this.nodeTemplate} />
                                                            </div> : <div>No Data</div>
                                                    }
                                                </AccordionTab>
                                            </Accordion>
                                        </TabPanel>
                                        {DataService.environment === "DEV" &&
                                            <TabPanel header="Dashboard" >
                                                <PowerbiIFRAME />
                                            </TabPanel>} */}
                                    </TabView>
                                    <div style={this.state.ActiveIndex === 4 ? { "display": "none" } : { "height": "auto" }}>
                                        {this.state.SelectedTabName == 'Administrator' && <DataGrid
                                            dataSource={this.state.GOLDStgListData}
                                            filterValue={this.state.gridFilterValue}
                                            defaultFilterValue={this.state.gridFilterValue}
                                            ref={(ref) => { this.dataGrid = ref; }}
                                            allowColumnReordering={true}
                                            allowColumnResizing={true}
                                            columnResizingMode={'widget'}
                                            filterSyncEnabled={false}
                                            showColumnLines={true}
                                            rowAlternationEnabled={true}
                                            showBorders={true}
                                            showRowLines={false}
                                            width='100%'
                                            hoverStateEnabled={true}
                                            columnMinWidth={1}
                                            onOptionChanged={this.handleOptionChanged}
                                            columnAutoWidth={true}
                                            onContentReady={this.handleContentReady}
                                        >
                                            <Toolbar>
                                                <Item name='searchPanel' location='after'>
                                                </Item>
                                                <Item name='groupPanel' location='after'>
                                                </Item>
                                            </Toolbar>

                                            <GroupPanel visible={true} />
                                            <SearchPanel visible={true} width={'600px'} text={this.state.QueryString ? this.state.QueryString : ''} placeholder="Search..." highlightCaseSensitive={false} /> :
                                            <Grouping autoExpandAll={false} />
                                            <Column cellRender={e => this.AIActionCol(e)} width={100} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                            <Column dataField="IntegrationStatus" width={150} caption="Record Status"></Column>
                                            <Column dataField="Molecule" width={160} caption="Molecule"></Column>
                                            <Column dataField="TradeName" width={160} caption="Trade Name"></Column>
                                            {/* <Column dataField="Brand" width={200} caption="Brand (GB)"></Column> */}
                                            <Column dataField="Indication" width={170} caption="Indication"></Column>
                                            <Column dataField="Country" width={140} caption="Country"></Column>
                                            <Column dataField="Region" width={120} caption="Region"></Column>
                                            <Column dataField="Cluster" width={120} caption="Cluster"></Column>
                                            <Column cellRender={(celldata) => {
                                                const splitted = celldata.value?.split(';')
                                                const target = "_blank";
                                                return (
                                                    splitted?.map((val, index) => {
                                                        const href = `${this.state.DRURl}${val}`;

                                                        return <a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{val}{index < splitted?.length - 1 && ';'}</a>
                                                    })
                                                )
                                            }} dataField="MappedDRID" width={150} caption="Proposed DRIDs"></Column>
                                            <Column dataField="MatchCriteria" caption="Record Match"></Column>
                                            <Column dataField="Date_x003a_LaunchType" width={180} caption="Date: LaunchType"></Column>
                                            <Column dataField="DatePart_x003a_LaunchBaseGeneratX" width={200} caption="DatePart: Launch Base Generatd"></Column>
                                            <Column cellRender={e => <div>{e?.value ? format(new Date(e?.value), 'MMM-dd-yyyy') : ''}</div>} dataField="DatePart_x003a_LaunchBaseOscarX" width={200} caption="DatePart: Launch Base Oscar"></Column>
                                            <Column cellRender={e => <div>{e?.value ? format(new Date(e?.value), 'MMM-dd-yyyy') : ''}</div>} dataField="DatePart_x003a_LaunchActualX" width={200} caption="DatePart: Launch Actual"></Column>
                                            <Column cellRender={e => <div>{e?.value ? format(new Date(e?.value), 'MMM-dd-yyyy') : ''}</div>} dataField="DatePart_x003a_LaunchBaseX" width={200} caption="DatePart: Launch Base"></Column>
                                            <Column dataField="CommercialViability" width={200} caption="Commercial Viability"></Column>
                                            <Column dataField="EngagementLevel" width={200} caption="Engagement Level"></Column>
                                            <Column cellRender={e => <div>{e?.value ? format(new Date(e?.value), 'MMM-dd-yyyy') : ''}</div>} dataField="ReimbursementX" width={200} caption="Date: Reimbursement"></Column>
                                            <Column dataField="ReimbursementType" width={200} caption="Date: Reimbursement Type"></Column>
                                            <Column cellRender={e => <div>{e?.value ? format(new Date(e?.value), 'MMM-dd-yyyy') : ''}</div>} dataField="ReimbursementGeneratedX" width={200} caption="Reimbursement Generated"></Column>
                                            <Column cellRender={e => <div>{e?.value ? format(new Date(e?.value), 'MMM-dd-yyyy') : ''}</div>} dataField="ReimbursementBaseX" width={200} caption="Reimbursement Base"></Column>
                                            <Column dataField='GOLD_DLPPMappedX' caption='GOLD DLPP Mapped' width={120} />

                                            <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                                            <Paging enabled={true} defaultPageSize={10} />

                                            <FilterRow visible={false} />
                                            <FilterPanel visible={true} />
                                            <HeaderFilter visible={true} />
                                            <Scrolling columnRenderingMode='virtual' scrollByContent={true} scrollByThumb={true}></Scrolling>
                                            <Export enabled={true} allowExportSelectedData={true}></Export>
                                        </DataGrid >}

                                        {this.state.SelectedTabName == 'GOLD' &&
                                            <DataGrid
                                                dataSource={this.state.GOLDTabData}
                                                filterValue={this.state.gridFilterValue}
                                                defaultFilterValue={this.state.gridFilterValue}
                                                ref={(ref) => { this.dataGrid = ref; }}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                columnResizingMode={'widget'}
                                                filterSyncEnabled={false}
                                                showColumnLines={true}
                                                rowAlternationEnabled={true}
                                                showBorders={true}
                                                showRowLines={false}
                                                width='100%'
                                                hoverStateEnabled={true}
                                                columnMinWidth={1}
                                                onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                                                columnAutoWidth={true}
                                            >
                                                <Toolbar>
                                                    <Item name='searchPanel' location='after'>
                                                    </Item>
                                                    <Item name='groupPanel' location='after'>
                                                    </Item>
                                                </Toolbar>

                                                <GroupPanel visible={true} />
                                                <SearchPanel visible={true} width={'600px'} text={this.state.QueryString ? this.state.QueryString : ''} placeholder="Search..." highlightCaseSensitive={false} /> :
                                            <Grouping autoExpandAll={false} />
                                                <Column cellRender={e => this.GOLDActionCol(e)} width={100} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                                <Column
                                                    cellRender={(celldata) => {
                                                        const href = `${this.state.DRURl}${celldata.value}`;
                                                        const target = "_blank";
                                                        return (
                                                            <a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{celldata.value}</a>
                                                        )
                                                    }}
                                                    dataField="MappedDRID" width={100} caption="DRID" alignment="left">
                                                </Column>
                                                <Column dataField="Country" width={200} caption="Country"></Column>
                                                <Column dataField="ProjectName" width={200} caption="Project Title"></Column>
                                                <Column dataField="TradeName" width={200} caption="Trade Name"></Column>
                                                <Column dataField="Molecule" width={200} caption="Molecule API/DS"></Column>
                                                <Column dataField="Indication" width={200} caption="Indication"></Column>
                                                {/* <Column dataField="IsPlanExist" width={200} caption="Plan Exist"></Column> */}
                                                <Column dataField="PlanManaged" width={200} caption="Plan Managed"></Column>

                                                {/* <Column dataField="PlanName" caption="Plan Name"></Column> */}



                                                <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                                                <Paging enabled={true} defaultPageSize={10} />

                                                <FilterRow visible={false} />
                                                <FilterPanel visible={true} />
                                                <HeaderFilter visible={true} />
                                                <Scrolling columnRenderingMode='virtual' scrollByContent={true} scrollByThumb={true}></Scrolling>
                                                <Export enabled={true} ></Export>

                                            </DataGrid>}

                                        {this.state.DRPChecked ? this.state.SelectedTabName == 'Launch List' &&
                                            <DataGrid
                                                dataSource={this.state.GSCProjects}
                                                filterValue={this.state.gridFilterValue}
                                                defaultFilterValue={this.state.gridFilterValue}
                                                ref={(ref) => { this.dataGrid = ref; }}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                columnResizingMode={'widget'}
                                                filterSyncEnabled={false}
                                                showColumnLines={true}
                                                rowAlternationEnabled={true}
                                                showBorders={true}
                                                showRowLines={false}
                                                width='100%'
                                                hoverStateEnabled={true}
                                                columnMinWidth={1}
                                                onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryStringLL: e.value }); e.element.autofocus = true; } }}
                                                columnAutoWidth={true}
                                            >
                                                <Toolbar>
                                                    <Item name='searchPanel' location='after'>
                                                    </Item>
                                                    <Item name='groupPanel' location='after'>
                                                    </Item>
                                                </Toolbar>

                                                <GroupPanel visible={true} />
                                                <SearchPanel visible={true} width={'600px'} text={this.state.QueryStringLL ? this.state.QueryStringLL : ''} placeholder="Search..." highlightCaseSensitive={false} /> :
                                      <Grouping autoExpandAll={false} />
                                                <Column cellRender={e => this.LaunchListActionCol(e)} minWidth={110} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                                <Column cellRender={(celldata) => { return (celldata?.value?.split('->')[1] || celldata.value) }} dataField="BusinessUnit" width={200} caption="Sub Business Unit"></Column>
                                                <Column cellRender={(cellData) => {
                                                    const href = cellData?.data?.PlanExistURL;
                                                    const target = "_blank";
                                                    return <a href={href} target={target}>{cellData.value}</a>
                                                }} dataField="ProjectName" width={200} caption="Project Name"></Column>
                                                <Column cellRender={e => this.getLaunchLeader(e)} dataField="PTitle" caption="Launch Lead"></Column>
                                                <Column dataField="LaunchReadinessDate" caption="Launch Readiness Date"></Column>
                                                <Column cellRender={e => {
                                                    const href = `${this.state.DRURl}${e.value}`;
                                                    const target = "_blank";
                                                    return (
                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}><a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{e?.data?.DRID}</a></div>
                                                    )
                                                }} dataField="DRID" caption="DRID"></Column>
                                                <Column dataField="Template" caption="Template"></Column>
                                                <Column cellRender={(celldata) => <div><Checkbox checked={celldata?.value} disabled /></div>} dataField="DLPPManaged" caption="DLPP Managed"></Column>
                                                <Column dataField="GlobalBrand" caption="Brand/Label"></Column>
                                                <Column dataField="LaunchProgress" caption="Launch Progress"></Column>
                                                <Column dataField="PfizerCode" caption="Pfizer Code"></Column>
                                                <Column dataField="LaunchStatus" caption="Launch Status"></Column>
                                                {/* <Column dataField="PlanName" caption="Supply Continuity Risk"></Column> */}
                                                {/* <Column dataField="PlanName" caption="NP Risk Trend"></Column> */}
                                                {/* <Column dataField="PlanName" caption="Risk status"></Column> */}
                                                {/* <Column dataField="PlanName" caption="Resource Status"></Column> */}
                                                <Column dataField="Indication" caption="Indication"></Column>
                                                {/* <Column dataField="PlanName" caption="Project Type"></Column> */}
                                                {/* <Column dataField="PlanName" caption="PGS Leader"></Column> */}
                                                {/* <Column dataField="PlanName" caption="Data Steward"></Column> */}
                                                <Column cellRender={(celldata) => { return (celldata?.value?.split('->')[1] || celldata.value) }} dataField="Market" caption="Market"></Column>
                                                <Column cellRender={(celldata) => { return (celldata?.value?.split('->')[1] || celldata.value) }} dataField="Country" caption="Country"></Column>

                                                <Column dataField="BU" caption="Business Unit"></Column>

                                                <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                                                <Paging enabled={true} defaultPageSize={10} />

                                                <FilterRow visible={false} />
                                                <FilterPanel visible={true} />
                                                <HeaderFilter visible={true} />
                                                <Scrolling columnRenderingMode='virtual' scrollByContent={true} scrollByThumb={true}></Scrolling>
                                                <Export enabled={true} ></Export>

                                            </DataGrid>
                                            : this.state.SelectedTabName == 'Launch List' &&
                                            <DataGrid
                                                dataSource={this.state.DataRepoData}
                                                filterValue={this.state.gridFilterValue}
                                                defaultFilterValue={this.state.gridFilterValue}
                                                ref={(ref) => { this.dataGrid = ref; }}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                columnResizingMode={'widget'}
                                                filterSyncEnabled={false}
                                                showColumnLines={true}
                                                rowAlternationEnabled={true}
                                                showBorders={true}
                                                showRowLines={false}
                                                width='100%'
                                                hoverStateEnabled={true}
                                                columnMinWidth={1}
                                                onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryStringLL: e.value }); e.element.autofocus = true; } }}
                                                columnAutoWidth={true}
                                            >
                                                <Toolbar>
                                                    <Item name='searchPanel' location='after'>
                                                    </Item>
                                                    <Item name='groupPanel' location='after'>
                                                    </Item>
                                                </Toolbar>

                                                <GroupPanel visible={true} />
                                                <SearchPanel visible={true} width={'600px'} text={this.state.QueryStringLL ? this.state.QueryStringLL : ''} placeholder="Search..." highlightCaseSensitive={false} /> :
                                      <Grouping autoExpandAll={false} />
                                                <Column cellRender={e => this.LaunchListActionCol(e)} minWidth={110} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                                <Column cellRender={e => {
                                                    const href = `${this.state.DRURl}${e.value}`;
                                                    const target = "_blank";
                                                    return (
                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}><a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{e?.data?.ID}</a></div>
                                                    )
                                                }} dataField="ID" caption="DRID"></Column>
                                                <Column cellRender={e => {
                                                    return (
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{e.value}</div>
                                                    )
                                                }} dataField="Launches" caption="Launches#"></Column>
                                                <Column cellRender={(celldata) => <div><Checkbox checked={celldata?.value} disabled /></div>} dataField="IsActive" caption="Program Active"></Column>
                                                <Column dataField="ProjectTitle" caption="Project Title"></Column>
                                                <Column dataField="ProjectType" caption="Project Type"></Column>
                                                <Column dataField="ProjectSubType" caption="Project Sub Type"></Column>
                                                <Column cellRender={(celldata) => { return (celldata?.value?.split('->')[1] || celldata.value) }} dataField="BusinessUnit" width={200} caption="Sub Business Unit"></Column>
                                                <Column dataField="OperationalUnit" caption="Operational Unit"></Column>
                                                <Column dataField="CreatedBy" caption="Launch Lead"></Column>
                                                <Column dataField="ManagedBy" caption="Managed By"></Column>
                                                <Column dataField="ManagedType" caption="Managed Type"></Column>
                                                <Column dataField="BrandGroup" caption="Brand Group"></Column>
                                                <Column dataField="GlobalBrandAPI" caption="Global Brand"></Column>
                                                <Column dataField="OtherAlias" caption="Other Alias"></Column>
                                                <Column dataField="TherapeuticArea" caption="Therapeutic Area"></Column>
                                                <Column dataField="DosageCategory" caption="Dosage Category"></Column>
                                                <Column dataField="DosageForm" caption="Dosage Form"></Column>
                                                <Column dataField="Indication" caption="Indication"></Column>
                                                <Column dataField="PfizerCode" caption="PfizerCode"></Column>
                                                <Column dataField="NewProductPlanner" caption="New Product Planner"></Column>
                                                <Column dataField="DataSteward" caption="Data Steward"></Column>

                                                <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                                                <Paging enabled={true} defaultPageSize={10} />

                                                <FilterRow visible={false} />
                                                <FilterPanel visible={true} />
                                                <HeaderFilter visible={true} />
                                                <Scrolling columnRenderingMode='virtual' scrollByContent={true} scrollByThumb={true}></Scrolling>
                                                <Export enabled={true} ></Export>

                                            </DataGrid>
                                        }
                                    </div>

                                    <Dialog header={!this.state.DRPChecked ? this.state.selectedID?.ProjectTitle + ' ' + ' --DEV' : this.state.selectedID?.ProjectName + ' ' + ' --DEV'} closable={false} visible={this.state.showEditPlanDialog0} style={{ height: '99vh', width: '99vw' }} icons={this.dlppForDRIDIcon} onHide={() => this.setState({ showEditPlanDialog0: false })}>
                                        <div style={{ padding: '2rem' }}>
                                            <TabView >
                                                <TabPanel header={'Project Plan'}>
                                                    <DataGrid
                                                        dataSource={this.state.dlppForDRID}
                                                        filterValue={this.state.gridFilterValue}
                                                        defaultFilterValue={this.state.gridFilterValue}
                                                        ref={(ref) => { this.dataGrid = ref; }}
                                                        allowColumnReordering={true}
                                                        allowColumnResizing={true}
                                                        columnResizingMode={'widget'}
                                                        filterSyncEnabled={false}
                                                        showColumnLines={true}
                                                        rowAlternationEnabled={true}
                                                        showBorders={true}
                                                        showRowLines={false}
                                                        width='100%'
                                                        columnMinWidth={1}
                                                        onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                                                        columnAutoWidth={true}
                                                        onCellPrepared={this.highlightSelectedRow}
                                                    >
                                                        <Toolbar>
                                                            <Item name='searchPanel' location='after'>
                                                            </Item>
                                                            {this.state.SelectedProjectPlanMode == 'Edit' && <Item location="after">
                                                                <Button style={{ marginLeft: '10px', width: '8rem' }} title='Add Market' className='p-button-rounded p-button-raised feedbackBtn' disabled={this.state.formType == 'View'} icon='dx-icon-add' label='Add Market'
                                                                    onClick={() => {
                                                                        this.setState({ showLaunchMarketPopup: true, SelectedMarketMode: 'New', MarketGridDataArray: [] }),
                                                                            this.setState((prev) => ({
                                                                                LaunchListMarketData: {
                                                                                    ...prev.LaunchListMarketData,
                                                                                    DLPPManaged: 'No',
                                                                                    LaunchLeaderTitle: this.props?.currentUser?.Email ? this.props?.currentUser?.Email : [],
                                                                                    LaunchLeader: this.props?.currentUser?.Id ? this.props?.currentUser?.Id : null,
                                                                                }
                                                                            }))
                                                                    }}
                                                                />

                                                            </Item>}
                                                            <Item location="after">
                                                                <Button style={{ marginLeft: '5px', width: '107px' }} title='Refresh' className='p-button-rounded p-button-raised feedbackBtn' disabled={this.state.formType == 'View'} icon='dx-icon-refresh' label='Refresh' onClick={() => this.getDLPPForDRID(this.state.DRPChecked ? this.state.selectedID?.DRID : this.state.selectedID?.Id)} />
                                                            </Item>
                                                            <Item name='groupPanel' location='after'>
                                                            </Item>
                                                        </Toolbar>
                                                        <Grouping autoExpandAll={false} />
                                                        <GroupPanel visible={true} />
                                                        <SearchPanel visible={true} width={'160px'} text={this.state.QueryString ? this.state.QueryString : ''} placeholder="Search..." highlightCaseSensitive={false} /> :
                                                <Grouping autoExpandAll={false} />
                                                        <Column cellRender={e => this.SelectedDRActionCol(e)} minWidth={110} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                                        <Column cellRender={(cellData) => {
                                                            const href = cellData?.data?.PlanExistURL;
                                                            const target = "_blank";
                                                            return <div><a href={href} target={target}>{cellData.value}</a></div>
                                                        }} dataField={'ProjectName'} caption={'Project Name'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField="Template" caption="Template"></Column>
                                                        <Column cellRender={e => this.getLaunchLeader(e)} dataField="PTitle" caption="Launch Lead"></Column>
                                                        <Column cellRender={this.renderCellData} dataField={'LaunchProgress'} caption={'Launch Progress'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField={'LabelName'} caption={'Label'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={(celldata) => {
                                                            return <div>
                                                                {celldata?.value?.split('->')[1] || celldata.value}
                                                            </div>
                                                        }} dataField="Market" caption="Market"></Column>
                                                        <Column cellRender={(celldata) => {
                                                            return <div>
                                                                {celldata?.value?.split('->')[1] || celldata.value}
                                                            </div>
                                                        }} dataField="Country" caption="Country"></Column>
                                                        <Column cellRender={(celldata) => {
                                                            return <div>
                                                                {celldata?.value?.split('->')[1] || celldata.value}
                                                            </div>
                                                        }} dataField="Region" caption="Region"></Column>
                                                        <Column cellRender={this.renderCellData} dataField={'PlanStatus'} caption={'Plan Status'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField={'Indication'} caption={'Indication'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField={'LaunchCharacteristic'} caption={'Launch Characteristic'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.getLaunchStatus} dataField={'LaunchStatus'} caption={'Launch Status'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField={'GRProduct'} caption={'GRP'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField={'MoleculeName'} caption={'Molecule'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField={'dManaged'} caption={'DLPP Managed'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        <Column cellRender={this.renderCellData} dataField={'LaunchPriorityCategory'} caption={'Launch Priority'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} />
                                                        {/* <Column dataField={'Template'} caption={'Template'} dataType={'string'} visible={true} width={'120px'} allowEditing={false}/> */}
                                                        <MasterDetail enabled={true} component={this.DetailTemplate} />

                                                        <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                                                        <Paging enabled={true} defaultPageSize={10} />

                                                        <FilterRow visible={false} />
                                                        <FilterPanel visible={true} />
                                                        <HeaderFilter visible={true} />
                                                        <Scrolling columnRenderingMode='virtual' scrollByContent={true} scrollByThumb={true}></Scrolling>
                                                        <Export enabled={true} ></Export>

                                                    </DataGrid>
                                                </TabPanel>
                                                <TabPanel header={'Data Repository'}>
                                                    {this.state.DRdetails &&
                                                        (<DataRepositoryTab
                                                            DRdetails={this.state.DRdetails}
                                                            formFields={this.state.formFields} />)}
                                                </TabPanel>
                                            </TabView>
                                        </div>
                                    </Dialog>

                                    <Dialog header='Update SKU Details' closable={false} visible={this.state.showSKUpop} style={{ height: '70vh', width: '50vw' }} icons={this.skuButtons} onHide={() => this.setState({ showSKUpop: false })}>
                                        <div style={{ padding: '3rem' }}>
                                            <Row>
                                                <Col>
                                                    <Label className='label-name' style={{ padding: '0px' }}>Group</Label>
                                                    <InputText className="label-name-ip" disabled value={this.state.skuGroupName} ></InputText>
                                                </Col>
                                                <Col>
                                                    <Label className='label-name' style={{ padding: '0px' }}>Reason Code</Label>
                                                    <Dropdown
                                                        value={this.state.ReasonCode0}
                                                        options={this.state.ReasonCodesFromList}
                                                        onChange={(e) => (this.setState({ ReasonCode0: e.target.value }))}
                                                        placeholder='Select'
                                                        filter className="multiselect-custom md:w-20rem"
                                                        resetFilterOnHide={true}
                                                        style={{ width: '100%', display: 'flex' }}
                                                        optionLabel="key"
                                                        optionValue="value"
                                                        appendTo='self'
                                                    />
                                                </Col>

                                            </Row>

                                            <Row style={{ marginTop: '3%' }}>
                                                <Col>
                                                    <Label className='label-name' style={{ padding: '0px' }}>SKU List</Label>
                                                    {/* <InputText className="label-name-ip" value={this.state.skuListName} ></InputText> */}
                                                    <Autocomplete
                                                        multiple
                                                        // disablePortal
                                                        value={this.state.AutoCompleteValue}
                                                        options={this.state.AutoCompleteValues}
                                                        getOptionLabel={(option) => option.value ? option.value : option}
                                                        renderInput={(params) => <TextField {...params}
                                                            defaultValue=""
                                                            helperText=""
                                                            style={{ borderBottom: '0px solid white' }}
                                                            variant='standard'
                                                        />}
                                                        onChange={(e, newVal) => {
                                                            if (newVal) {
                                                                let combined;
                                                                const old = newVal?.slice(0, newVal?.length - 1);
                                                                const newV = newVal[newVal?.length - 1]?.split(';');
                                                                if (newV) {
                                                                    combined = [...old, ...newV]
                                                                } else {
                                                                    combined = []
                                                                }
                                                                // console.log(old, newV, combined)
                                                                this.setState({ AutoCompleteValue: combined })
                                                            } else {
                                                                this.setState({ AutoCompleteValue: newVal })
                                                            }
                                                        }}
                                                        style={{
                                                            border: '1px solid #ced4da',
                                                            backgroundColor: 'white',
                                                            paddingLeft: '20px',
                                                        }}
                                                        freeSolo={true}
                                                        autoSelect
                                                        PopperComponent={this.CustomPopper}
                                                    />
                                                    {this.state.skuListError ? <span style={{ color: 'red' }}>Item already selected for another record! </span> : null}
                                                </Col>

                                                <Col>
                                                    <Label className='label-name' style={{ padding: '0px' }}>Acceleration Strategy</Label>
                                                    <MultiSelect
                                                        value={this.state.AccStrategy ? this.state.AccStrategy : ''}
                                                        options={this.state.AccStrategyFromList}
                                                        onChange={(e) => (this.setState({ AccStrategy: e.target.value }))}
                                                        placeholder='Select'
                                                        filter className="multiselect-custom md:w-20rem"
                                                        display="chip"
                                                        resetFilterOnHide={true}
                                                        style={{ width: '100%', display: 'flex', height: '7rem' }}
                                                        optionLabel="key"
                                                        optionValue="value"
                                                        appendTo='self'
                                                        maxSelectedLabels={2}
                                                        tooltip={this.state.AccStrategy}
                                                        tooltipOptions={{ position: 'top' }}
                                                        selectedItemTemplate={(option) => {
                                                            if (this.state.AccStrategy?.length === 0) {
                                                                return 'Select'
                                                            } else if (this.state.AccStrategy?.length > 2) {
                                                                return `${this.state.AccStrategy?.length} items selected`
                                                            } else {
                                                                return option + ', '
                                                            }
                                                        }} />
                                                </Col>
                                            </Row>

                                            <Row style={{ marginTop: '3%', padding: '0.8rem' }}>
                                                <Label className='label-name' style={{ padding: '0px' }}>Comments</Label>
                                                <InputTextarea className="label-name-ip" value={this.state.skuComments} onChange={(e) => this.setState({ skuComments: e.target.value, remainingChars: 500 - (e.target.value)?.length })} maxLength={500} rows={4}></InputTextarea>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}><p>{this.state.remainingChars}/500</p></div>
                                            </Row>
                                        </div>
                                    </Dialog>

                                    <Dialog header={Planisware} closable={false} visible={this.state.showIportEditDialog} style={{ height: '99vh', width: '99vw' }} icons={this.ViewIportButtons} onHide={() => this.setState({ showIportEditDialog: false })}>
                                        <IPORTEdit rowData={this.state.SelectedIportData}></IPORTEdit>
                                        <form className='CreateDrCard'>
                                            <div>
                                                {this.state.FormLabels.map((label, index) => (
                                                    <Col md={6}>
                                                        <div key={index}>
                                                            <Label htmlFor={label.Key}>{label.Title}</Label>
                                                            <InputText id={label.Key} readOnly value={this.state.SelectedIportData[label.Key] || ''}></InputText>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </div>
                                        </form>
                                    </Dialog>

                                    <Dialog header={this.CreateDrHeader} closable={false} visible={this.state.showCreatDRDialog} style={{ height: '99vh', width: '99vw' }} icons={this.CreateDrButtons} onHide={() => this.setState({ showCreatDRDialog: false })}>
                                        <div style={{ padding: '2%' }}>
                                            <div className='CreateDrCard'>
                                                <DataGrid
                                                    dataSource={this.state.SelectedIportPlans}
                                                    filterValue={this.state.gridFilterValue}
                                                    defaultFilterValue={this.state.gridFilterValue}
                                                    ref={(ref) => { this.dataGrid = ref; }}
                                                    allowColumnReordering={true}
                                                    allowColumnResizing={true}
                                                    columnResizingMode={'widget'}
                                                    filterSyncEnabled={false}
                                                    showColumnLines={true}
                                                    rowAlternationEnabled={true}
                                                    showBorders={true}
                                                    showRowLines={false}
                                                    width='100%'
                                                    // height='max'
                                                    hoverStateEnabled={true}
                                                    columnMinWidth={1}
                                                    onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                                                    columnAutoWidth={true}
                                                >
                                                    <Toolbar>
                                                        <Item name='searchPanel' location='after'>
                                                        </Item>
                                                        <Item name='groupPanel' location='after'>
                                                        </Item>
                                                    </Toolbar>

                                                    <GroupPanel visible={true} />
                                                    <SearchPanel visible={true} width={'600px'} text={this.state.QueryString ? this.state.QueryString : ''} placeholder="Search..." highlightCaseSensitive={false} /> :
                                            <Grouping autoExpandAll={false} />
                                                    <Column cellRender={e => this.setCellPrimary(e.data)} minWidth={50} allowExporting={false} allowResizing={true} caption="Primary" alignment="center" allowEditing={false} />
                                                    <Column cellRender={e => this.setLinkAction(e.data)} minWidth={50} allowExporting={false} allowResizing={true} caption="Link" alignment="center" allowEditing={false} />
                                                    <Column cellRender={e => this.LightSpeedCol(e)} minWidth={50} dataField="LightSpeedActive" caption="LS"></Column>
                                                    <Column dataField="IsModified" caption="IM"></Column>
                                                    <Column dataField="PlaniswareID" caption="Planisware ID/Pfizer Code"></Column>
                                                    <Column dataField="DRID" caption="DR ID"></Column>
                                                    <Column dataField="IntegrationStatus" width={100} caption="Integration Status"></Column>
                                                    <Column dataField="ProjectTitle" minWidth={100} width={200} caption="Project Title"></Column>
                                                    <Column cellRender={e => this.setProjectStatusCell(e)} dataField="ProjectStatus" caption="Project Status"></Column>
                                                    <Column dataField="PF/CompoundNumber" caption="PF/Compound Number"></Column>
                                                    <Column cellRender={e => this.IntegrationNotesCell(e)} dataField="IntegrationNotes" caption="Integration Notes"></Column>
                                                    <Column dataField="GlobalBrand" caption="Global Brand"></Column>
                                                    <Column dataField="Wave1StartDate" caption="Estimated Wave1 Start Date"></Column>
                                                    <Column dataField="POCApproved" caption="POC Approved"></Column>
                                                    <Column dataField="OperationalUnit" caption="Operational Unit"></Column>
                                                    <Column dataField="SubBusinessUnit" caption="Sub Business Unit"></Column>
                                                    <Column dataField="BrandGroup" caption="Brand Group"></Column>
                                                    <Column dataField="MoleculeName" caption="Molecule API/DS"></Column>
                                                    <Column dataField="OtherAlias" caption="Other Alias"></Column>
                                                    <Column dataField="DosageCategory" caption="Dosage Category"></Column>
                                                    <Column dataField="DosageForm" caption="Dosage Form"></Column>
                                                    <Column cellRender={e => this.SetcellBody(e)} dataField="PhaseStatus" caption="Phase"></Column>
                                                    <Column dataField="Indication" caption="Indication"></Column>
                                                    <Column dataField="TherapeuticArea" caption="Therapeutic Area"></Column>
                                                    <Column cellRender={e => this.SetcellBody(e)} dataField="ProjectType" caption="Project Type"></Column>
                                                    <Column cellRender={e => this.SetcellBody(e)} dataField="ProjectSubType" caption="Project Sub Type"></Column>
                                                    <Column dataField="Created" caption="Created"></Column>
                                                    <Column dataField="CreatedBy" caption="Created By"></Column>
                                                    <Column dataField="Modified" caption="Modified"></Column>
                                                    <Column dataField="ModifiedBy" caption="Modified By"></Column>

                                                    <Scrolling columnRenderingMode='virtual' scrollByContent={true} scrollByThumb={true}></Scrolling>
                                                    <Export enabled={true} ></Export>

                                                </DataGrid>
                                            </div>
                                            <div className='CreateDrCard'>
                                                <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '1%' }}>Primary PlaniswareID Details</div>
                                                <form>
                                                    <div>
                                                        {this.state.FormLabels.map((label, index) => (
                                                            <Col md={6}>
                                                                <div key={index}>
                                                                    <Label htmlFor={label.Key}>{label.Title}</Label>
                                                                    <InputText id={label.Key} readOnly value={this.state.selectedPrimaryPlaniswareRec[label.Key] || ''}></InputText>
                                                                </div>
                                                            </Col>
                                                        ))}
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </Dialog>

                                    <Dialog header={AIEditHeader} closable={false} visible={this.state.showAIAssestPopup} style={{ height: '99vh', width: '85vw' }} icons={this.ViewMarketIcons} onHide={() => this.setState({ showAIAssestPopup: false, SelectedGRPForNewID: '', SelectedMoleculeForNewID: null, SelectedLabelForNewID: null })}>
                                        <div style={{ padding: '1%' }}>
                                            <div className='CommercialDiv'>
                                                <div style={{ fontSize: '20px', fontWeight: '600', paddingLeft: '1%', marginBottom: '2rem' }}>Commercial</div>
                                                <div style={{ paddingLeft: '3%' }}>
                                                    <Row style={{ paddingBottom: '2%' }}>
                                                        <Col>
                                                            <Label>Molecule</Label>
                                                            <InputText readOnly value={this.state.SelectedGOLDStgData?.Molecule}></InputText>
                                                        </Col>
                                                        <Col>
                                                            <Label>Brand</Label>
                                                            <InputText readOnly value={this.state.SelectedGOLDStgData?.Brand}></InputText>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ paddingBottom: '2%' }}>
                                                        <Col>
                                                            <Label>Country</Label>
                                                            <InputText readOnly value={this.state.SelectedGOLDStgData?.Country}></InputText>
                                                        </Col>
                                                        <Col>
                                                            <Label>Indication</Label>
                                                            <InputText readOnly value={this.state.SelectedGOLDStgData?.Indication}></InputText>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ paddingBottom: '2%' }}>
                                                        <Col md={6}>
                                                            <Label>Trade Name</Label>
                                                            <InputText readOnly value={this.state.SelectedGOLDStgData?.TradeName}></InputText>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                            {!this.state.moleculeExisted && !this.state.showLinkAndCreateIDPop && <div className='CommercialDiv'>
                                                <div style={{ paddingLeft: '1%', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '20px', fontWeight: '600' }}>GRP, Molecule & Label Mapping</span>
                                                    <Button className='p-button-raised p-button-rounded saveBtn' label='Confirm' onClick={this.onConfirmForProposedDRID} disabled={!(this.state.SelectedGRPForNewID && this.state.SelectedMoleculeForNewIDOps) || this.state.SelectedAIMode == 'View'} />
                                                </div>
                                                <div style={{ paddingLeft: '3%' }}>
                                                    <Row style={{ paddingBottom: '2%' }}>
                                                        <Col>
                                                            <Label>GRP[Global Reporting Product]</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' filter options={this.state.ProposedGRPOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedGRPForNewID} onChange={(e) => this.getAdminDropdownOption(e.value)} disabled={this.state.SelectedAIMode == 'View'} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Molecule</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' filter options={this.state.MoleculeAPIOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedMoleculeForNewIDOps} onChange={(e) => this.setState({ SelectedMoleculeForNewIDOps: e.value })} disabled={this.state.SelectedAIMode == 'View'} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Label Name</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' filter options={this.state.LabelNameOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedLabelForNewIDOps} onChange={(e) => this.setState({ SelectedLabelForNewIDOps: e.value })} disabled={this.state.SelectedAIMode == 'View'} />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>}

                                            {this.state.moleculeExisted ? <div className='CommercialDiv'>
                                                <div style={{ fontSize: '20px', fontWeight: '600', paddingLeft: '1%', display: 'flex', alignItems: 'center' }}>
                                                    <RadioButton inputId="option1" name="selectionGroup" value='linkDR' onChange={e => this.setState({ linkOrCreateDR: e.value })} checked={this.state.linkOrCreateDR !== 'createDR' && (this.state.selectedDRID || this.state.linkOrCreateDR === 'linkDR' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed')} style={{ marginRight: '1rem' }} disabled={this.state.SelectedGOLDStgData.IntegrationStatus === 'Published' || this.state.SelectedAIMode == 'View'} />
                                                Proposed Data Repository Programs</div>
                                                <div style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '3%' }}>
                                                    <DataGrid
                                                        dataSource={this.state.selectedProjectDetails}
                                                        filterValue={this.state.gridFilterValue}
                                                        defaultFilterValue={this.state.gridFilterValue}
                                                        ref={(ref) => { this.dataGrid = ref; }}
                                                        allowColumnReordering={true}
                                                        allowColumnResizing={true}
                                                        columnResizingMode={'widget'}
                                                        filterSyncEnabled={false}
                                                        showColumnLines={true}
                                                        rowAlternationEnabled={true}
                                                        showBorders={true}
                                                        showRowLines={false}
                                                        width='100%'
                                                        hoverStateEnabled={true}
                                                        columnMinWidth={1}
                                                        columnAutoWidth={true}
                                                    >
                                                        <Column cellRender={e => this.setDRLinkAction(e.data)} minWidth={50} caption="Link DR" alignment="center" allowEditing={false} />
                                                        <Column
                                                            cellRender={(celldata) => {
                                                                const href = `${this.state.DRURl}${celldata.value}`;
                                                                const target = "_blank";
                                                                return (
                                                                    <a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{celldata.value}</a>
                                                                )
                                                            }}
                                                            dataField="DRID" caption="Proposed DRID" alignment="left">
                                                        </Column>
                                                        <Column dataField="ProjectTitle" width={200} caption="Proposed Project Title"></Column>
                                                        <Column dataField="ProposedGRP" caption="Proposed GRP"></Column>
                                                        <Column dataField="MoleculeName" caption="Proposed Molecule"></Column>
                                                        <Column dataField="TradeName" caption="Label Name"></Column>
                                                        <Column dataField="Indication" caption="Indication"></Column>

                                                    </DataGrid>
                                                </div>
                                            </div> : this.state.showLinkAndCreateIDPop ? <div className='CommercialDiv'>
                                                <div style={{ fontSize: '20px', fontWeight: '600', paddingLeft: '1%', display: 'flex', alignItems: 'center' }}>
                                                    <RadioButton inputId="option1" name="selectionGroup" value='linkDR' onChange={e => this.setState({ linkOrCreateDR: e.value })} checked={this.state.linkOrCreateDR !== 'createDR' && (this.state.selectedDRID || this.state.linkOrCreateDR === 'linkDR' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed')} style={{ marginRight: '1rem' }} disabled={this.state.SelectedGOLDStgData.IntegrationStatus === 'Published' || this.state.SelectedAIMode == 'View'} />
                                                Proposed Data Repository Programs</div>
                                                <div style={{ paddingTop: '20px', paddingBottom: '20px', paddingLeft: '3%' }}>
                                                    <DataGrid
                                                        dataSource={this.state.selectedProjectDetails}
                                                        filterValue={this.state.gridFilterValue}
                                                        defaultFilterValue={this.state.gridFilterValue}
                                                        ref={(ref) => { this.dataGrid = ref; }}
                                                        allowColumnReordering={true}
                                                        allowColumnResizing={true}
                                                        columnResizingMode={'widget'}
                                                        filterSyncEnabled={false}
                                                        showColumnLines={true}
                                                        rowAlternationEnabled={true}
                                                        showBorders={true}
                                                        showRowLines={false}
                                                        width='100%'
                                                        hoverStateEnabled={true}
                                                        columnMinWidth={1}
                                                        columnAutoWidth={true}
                                                    >
                                                        <Column cellRender={e => this.setDRLinkAction(e.data)} minWidth={50} caption="Link DR" alignment="center" allowEditing={false} />
                                                        <Column
                                                            cellRender={(celldata) => {
                                                                const href = `${this.state.DRURl}${celldata.value}`;
                                                                const target = "_blank";
                                                                return (
                                                                    <a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{celldata.value}</a>
                                                                )
                                                            }}
                                                            dataField="DRID" caption="Proposed DRID" alignment="left">
                                                        </Column>
                                                        <Column dataField="ProjectTitle" width={200} caption="Project Title"></Column>
                                                        <Column dataField="MoleculeName" caption="Proposed Molecule"></Column>
                                                        <Column dataField="ProposedGRP" caption="Proposed GRP"></Column>
                                                        <Column dataField="TradeName" caption="Label Name"></Column>
                                                        <Column dataField="Indication" caption="Indication"></Column>

                                                    </DataGrid>
                                                </div>
                                            </div> : null}
                                            {this.state.moleculeExisted ? <div className='CommercialDiv'>
                                                <div style={{ fontSize: '20px', fontWeight: '600', paddingLeft: '1%', marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                                                    <RadioButton inputId="option2" name="selectionGroup" value='createDR' onChange={e => this.setState({ linkOrCreateDR: e.value })} checked={this.state.linkOrCreateDR === 'createDR' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Published'} style={{ marginRight: '1rem' }} disabled={this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned' || this.state.SelectedAIMode == 'View' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed'} />
                                                    Create New Data Repository Program</div>
                                                <div style={{ paddingLeft: '3%' }}>
                                                    <Row style={{ paddingBottom: '2%' }}>
                                                        <Col>
                                                            <Label>Project Title</Label>
                                                            <InputText value={this.state.pTitleForDR} onChange={e => this.setState({ pTitleForDR: e.target.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null}></InputText>
                                                        </Col>
                                                        <Col>
                                                            <Label>GRP[Global Reporting Product]</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' filter options={this.state.ProposedGRPOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedGRP} onChange={e => this.getAdminDropdownOption(e.value)} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Molecule API/DS</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.MoleculeAPIOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedMoleculeAPI} onChange={(e) => this.setState({ SelectedMoleculeAPI: e.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        {/* <Col>
                                                            <Label>Proposed GRP</Label>
                                                            <InputText readOnly value={this.state.ProposedGRPVal}></InputText>
                                                        </Col> */}
                                                    </Row>
                                                    <Row style={{ paddingBottom: '2%' }}>

                                                        <Col>
                                                            <Label>Label Name</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.LabelNameOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedLabelname} onChange={(e) => { this.setState({ SelectedLabelname: e.value }), this.getPreSelectedBuAndSubBu(e.value) }} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Business Unit</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.BUOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedBU} onChange={(e) => this.setState({ SelectedBU: e.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Sub Business Unit</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.SubBUOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedSubBU} onChange={(e) => this.setState({ SelectedSubBU: e.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ paddingBottom: '2%' }}>

                                                        <Col>
                                                            <Label>Indication</Label>
                                                            <InputTextarea value={this.state.SelectedGOLDStgData.Indication} rows={3}></InputTextarea>
                                                        </Col>
                                                        <Col />
                                                    </Row>
                                                </div>
                                            </div> : this.state.showLinkAndCreateIDPop ? <div className='CommercialDiv'>
                                                <div style={{ fontSize: '20px', fontWeight: '600', paddingLeft: '1%', marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                                                    <RadioButton inputId="option2" name="selectionGroup" value='createDR' onChange={e => this.setState({ linkOrCreateDR: e.value })} checked={this.state.linkOrCreateDR === 'createDR' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Published'} style={{ marginRight: '1rem' }} disabled={this.state.SelectedGOLDStgData.IntegrationStatus === 'Assigned' || this.state.SelectedAIMode == 'View' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed'} />
                                                    Create New Data Repository Program</div>
                                                <div style={{ paddingLeft: '3%' }}>
                                                    <Row style={{ paddingBottom: '2%' }}>
                                                        <Col>
                                                            <Label>Project Title</Label>
                                                            <InputText value={this.state.pTitleForDR} onChange={e => this.setState({ pTitleForDR: e.target.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null}></InputText>
                                                        </Col>
                                                        <Col>
                                                            <Label>GRP[Global Reporting Product]</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' filter options={this.state.ProposedGRPOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedGRP} onChange={e => this.getAdminDropdownOption(e.value)} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Molecule API/DS</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.MoleculeAPIOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedMoleculeAPI} onChange={(e) => this.setState({ SelectedMoleculeAPI: e.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        {/* <Col>
                                                            <Label>Proposed GRP</Label>
                                                            <InputText readOnly value={this.state.ProposedGRPVal}></InputText>
                                                        </Col> */}
                                                    </Row>
                                                    <Row style={{ paddingBottom: '2%' }}>

                                                        <Col>
                                                            <Label>Label Name</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.LabelNameOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedLabelname} onChange={(e) => { this.setState({ SelectedLabelname: e.value }), this.getPreSelectedBuAndSubBu(e.value) }} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Business Unit</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.BUOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedBU} onChange={(e) => this.setState({ SelectedBU: e.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                        <Col>
                                                            <Label>Sub Business Unit</Label>
                                                            <Dropdown placeholder="Select" appendTo='self' options={this.state.SubBUOptions} optionLabel='keyValue' optionValue='keyValue' className="w-full md:w-14rem" value={this.state.SelectedSubBU} onChange={(e) => this.setState({ SelectedSubBU: e.value })} disabled={this.state.linkOrCreateDR === 'linkDR' || this.state.linkOrCreateDR === null} />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ paddingBottom: '2%' }}>

                                                        <Col>
                                                            <Label>Indication</Label>
                                                            <InputTextarea value={this.state.SelectedGOLDStgData.Indication} rows={3}></InputTextarea>
                                                        </Col>
                                                        <Col />
                                                    </Row>
                                                </div>
                                            </div> : null}
                                        </div>
                                    </Dialog>
                                    <Dialog closable={false} visible={this.state.MarketsCreatedPopup} style={{ height: '30vh', width: '40vw' }} icons='' onHide={() => this.setState({ MarketsCreatedPopup: false })}>
                                        <div>
                                            <h6>Project Plan will be created in DLPP for DLPP Managed Projects, please allow 1-2 minutes for the project link to appear</h6>
                                            <div style={{ padding: '12px', marginLeft: '38%' }}>
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' label='Ok' onClick={() => { this.setState({ MarketsCreatedPopup: false, showMarketPopUp: false, showLaunchMarketPopup: false }), this.getDLPPForDRID(this.state.DRPChecked ? this.state.selectedID?.DRID : this.state.selectedID?.Id) }} />
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Dialog header='Warning' closable={false} visible={this.state.showMarketErrorPop} style={{ height: '35vh', width: '40vw' }} icons='' onHide={() => this.setState({ showMarketErrorPop: false })}>
                                        <div>
                                            <h6>Sub Business Unit, Business Unit, Molecule API/Global Brand, GRP fields are empty. Project plan can't be created !</h6>
                                            <div style={{ padding: '12px', marginLeft: '38%' }}>
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' label='Ok' onClick={() => this.setState({ showMarketErrorPop: false })} />
                                            </div>
                                        </div>
                                    </Dialog>

                                    <Dialog header='Warning' closable={false} visible={this.state.indicationErrorPop} style={{ height: '45vh', width: '55vw' }} icons='' onHide={() => this.setState({ indicationErrorPop: false })}>
                                        <div>
                                            <div style={{ color: 'black', fontWeight: 'bold' }}>Below mentioned GOLD Indication(s) are not available, Kindly contact the System Administrator.</div><br />
                                            <h6>{this.state.indicationErrorPopValues}</h6>
                                            <div style={{ padding: '12px', marginLeft: '38%' }}>
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' label='Ok' onClick={() => this.setState({ indicationErrorPop: false })} />
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Dialog header='Confirm' closable={true} visible={this.state.planExistPop} style={{ height: '45vh', width: '55vw' }} icons='' onHide={() => this.setState({ planExistPop: false })}>
                                        <div>
                                        <div>{`Plan already exists for DRID: ${this.state.selectedDRID} and Country: ${this.state.SelectedGOLDStgData.Country} as a "GTEL" record! Kindly check with Launch Leader before "Processing" or link the Commercial-GOLD record to the existing "GTEL" record. Alternatively, click on cross button and choose to create a new Data Repository record.`}</div>
                                            <div>
                                                {this.state.RadioOptions?.map((option: any) => (
                                                    <div style={{ display: "flex", alignItems: 'center', gap: '5px', padding: '1%' }}>
                                                        <RadioButton
                                                            inputId={option.value}
                                                            name="group"
                                                            value={option.value}
                                                            onChange={(e) => this.setState({ SelectedRadioOption: option.value })}
                                                            checked={this.state.SelectedRadioOption === option.value}
                                                            disabled={this.state.SelectedAIMode == 'View' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed'}
                                                        />
                                                        <span>{option.label}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <div style={{ padding: '12px', marginLeft: '25%' }}>
                                                    <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' label='Yes' onClick={(e) => this.updateIDPrimary()} disabled={this.state.SelectedRadioOption === null || this.state.SelectedAIMode == 'View' || this.state.SelectedGOLDStgData.IntegrationStatus === 'Processed'} />
                                                    <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded closeBtn' label='No' onClick={() => this.setState({ planExistPop: false })} />
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog>

                                    <Dialog header='Confirm' closable={true} visible={this.state.showConfirmDialog0} style={{ height: '30vh', width: '30vw' }} icons='' onHide={() => this.setState({ showConfirmDialog0: false })}>
                                        <div>
                                            <div>Are you sure, you want to assign the Commerical GOLD record to the selected DR ID?</div>
                                            <div style={{ padding: '12px', marginLeft: '25%' }}>
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' onClick={(e) => this.UpdateMappingDRID()} label='Yes' />
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded closeBtn' onClick={(e) => { this.setState({ showConfirmDialog0: false }) }} label='No' />
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Dialog header='Confirm' closable={true} visible={this.state.showConfirmDialog} style={{ height: '55vh', width: '50vw' }} icons='' onHide={() => this.setState({ showConfirmDialog: false })}>
                                        <div>
                                            <div style={{ color: 'black', fontWeight: 'bold' }}>Would you like to assign the selected DRID to similar GOLD plans identified by the system for the following Countr{this.state.similarCountries?.length > 1 ? 'ies' : 'y'}?</div>
                                            <div style={{ paddingBottom: '3%' }}>{this.state.similarCountries?.slice()?.sort()?.join(', ')}.</div>
                                            <div style={{ color: 'black', fontWeight: 'bold' }}>If you choose 'No', the DRID will be mapped only to the selected country ({this.state.SelectedGOLDStgData.Country}).</div>
                                            <div style={{ padding: '12px', marginLeft: '25%', paddingTop: '5%' }}>
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' onClick={(e) => this.onConfirm()} label='Yes' />
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded closeBtn' onClick={(e) => this.onConfirmNo()} label='No' />
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Dialog header='Confirm' closable={true} visible={this.state.confirmCreateDR1} style={{ height: '30vh', width: '30vw' }} icons='' onHide={() => this.setState({ confirmCreateDR1: false })}>
                                        <div>
                                            <div>Are you sure you want to create new DR with these values ?</div>
                                            <div style={{ padding: '12px', marginLeft: '25%' }}>
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' onClick={(e) => this.CreateNewDRForNo()} label='Yes' />
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded closeBtn' onClick={(e) => this.setState({ confirmCreateDR1: false })} label='No' />
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Dialog header='Confirm' closable={true} visible={this.state.confirmCreateDR} style={{ height: '60vh', width: '65vw' }} icons='' onHide={() => this.setState({ confirmCreateDR: false })}>
                                        <div>
                                            <div style={{ color: 'black', fontWeight: 'bold' }}>Would you like to assign the New created DRID to similar GOLD plans identified by the system for the following Countr{this.state.similarCountries1?.length > 1 ? 'ies' : 'y'}?</div>
                                            <div style={{ paddingBottom: '3%' }}>{this.state.similarCountries1?.slice()?.sort()?.join(', ')}.</div>
                                            <div style={{ color: 'black', fontWeight: 'bold' }}>If you choose 'No', the DRID will be created only to the selected country ({this.state.SelectedGOLDStgData.Country}).</div>
                                            <div style={{ padding: '12px', marginLeft: '25%', paddingTop: '5%' }}>
                                            </div>

                                            <div style={{ padding: '12px', marginLeft: '25%' }}>
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded saveBtn' onClick={(e) => this.CreateNewDR()} label='Yes' />
                                                <Button style={{ width: '30%' }} className='p-button-raised p-button-rounded closeBtn' onClick={(e) => this.CreateNewDRForNo()} label='No' />
                                            </div>
                                        </div>
                                    </Dialog>
                                    <Dialog closable={false} visible={this.state.ShowDRIDMatchPopup} style={{ height: '70vh', width: '70vw' }} icons={this.DRIDMatchPopUpIcons()} onHide={() => this.setState({ ShowDRIDMatchPopup: false })}>
                                        <div style={{ padding: '1%' }}>
                                            {this.state.ShowDRIDMatchPopupWarning && <span style={{ color: 'red' }}>Please close this pop-up and reopen it after 2-3 minutes to allow the plan to process</span>}
                                            <div>Plan(s) already exists for the Country: <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.Country}</span> for DRID <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.MappedDRID}</span></div>
                                            {/* <div>Plan(s) already exists for the selected DRID <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.MappedDRID}</span>  and for Country <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.Country}</span></div> */}
                                            <div>
                                                If you would like to proceed with merging this plan with the existing ones, please select the appropriate existing plan and click on Update and Confirm button. Upon doing so, the new indication for <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.Indication}</span> will be seamlessly added to the selected plan. Else please click on Create New Plan button
                                            </div>
                                            <DataGrid
                                                dataSource={this.state.MatchedDRIDData}
                                                ref={(ref) => { this.dataGrid = ref; }}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                columnResizingMode={'widget'}
                                                showColumnLines={true}
                                                showBorders={true}
                                                showRowLines={false}
                                                width='100%'
                                                hoverStateEnabled={true}
                                                columnMinWidth={1}
                                                columnAutoWidth={true}
                                            >
                                                <Column cellRender={e => this.setSelectedPlan(e.data)} width={100} caption="Select" alignment="center" />
                                                <Column cellRender={(celldata) => <div><Checkbox checked={celldata?.value} disabled /></div>} width={170} dataField="DLPPManaged" caption="DLPP Managed"></Column>
                                                <Column cellRender={(cellData) => {
                                                    const href = cellData?.data?.PlanExistURL;
                                                    const target = "_blank";
                                                    return <a href={href} target={target}>{cellData.value}</a>
                                                }} dataField="ProjectName" width={550} caption="Project Name"></Column>
                                                <Column dataField="Indication" width={250} caption="Indication"></Column>
                                                <Column dataField="PlanStatus" caption="Plan Status"></Column>
                                            </DataGrid>
                                        </div>
                                    </Dialog>

                                    <Dialog closable={false} visible={this.state.showOtherTemplatePopup} style={{ height: '70vh', width: '70vw' }} icons={this.OtherTemplateIcons()} onHide={() => this.setState({ showOtherTemplatePopup: false })}>
                                        <div style={{ padding: '1%' }}>
                                            <div>GTEL Plan already exits for this product/country (DRID: <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.MappedDRID}</span> Country : <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.Country}</span>)</div>
                                            <div>
                                                Please reach out to NPL Support / Launch Leader for more information
                                            </div>
                                            <DataGrid
                                                dataSource={this.state.OtherTemplateRecs}
                                                ref={(ref) => { this.dataGrid = ref; }}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                columnResizingMode={'widget'}
                                                showColumnLines={true}
                                                showBorders={true}
                                                showRowLines={false}
                                                width='100%'
                                                hoverStateEnabled={true}
                                                columnMinWidth={1}
                                                columnAutoWidth={true}
                                            >
                                                <Column cellRender={(celldata) => {
                                                    const href = `${this.state.DRURl}${celldata.value}`;
                                                    const target = "_blank";
                                                    return (
                                                        <div>
                                                            <a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{celldata.value}</a>
                                                        </div>
                                                    )
                                                }} dataField="DRID" width={100} caption="DRID"></Column>
                                                <Column cellRender={(cellData) => {
                                                    const href = cellData?.data?.PlanExistURL;
                                                    const target = "_blank";
                                                    return <a href={href} target={target}>{cellData.value}</a>
                                                }} dataField="ProjectName" width={600} caption="Project Name"></Column>
                                                <Column cellRender={e => this.getLaunchLeaderMail(e)} dataField="PTitle" caption="Launch Leader"></Column>
                                            </DataGrid>
                                        </div>
                                    </Dialog>

                                    <Dialog closable={false} visible={this.state.ShowCoutryDRIDMatchPopup} style={{ height: '60vh', width: '70vw' }} icons={this.CountryDRIDMatchPopUpIcons()} onHide={() => this.setState({ ShowCoutryDRIDMatchPopup: false })}>
                                        <div style={{ padding: '1%' }}>
                                            <div>The Following Gold records have same DRID <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.MappedDRID}</span>  and Country <span style={{ color: 'black', fontWeight: 'bold' }}>{this.state.selectedGOLDTabRec?.Country}</span></div>
                                            <div>Would you Like to Merge these records?</div>
                                            <div>(On Merge, all these Gold record's Indications will be merged and only one Gold record will be available to create Plans)</div>
                                            <DataGrid
                                                dataSource={this.state.CountryDRIDMatchData}
                                                ref={(ref) => { this.dataGrid = ref; }}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                columnResizingMode={'widget'}
                                                showColumnLines={true}
                                                showBorders={true}
                                                showRowLines={false}
                                                width='100%'
                                                hoverStateEnabled={true}
                                                columnMinWidth={1}
                                                columnAutoWidth={true}
                                            >
                                                <Column cellRender={(celldata) => {
                                                    const href = `${this.state.DRURl}${celldata.value}`;
                                                    const target = "_blank";
                                                    return (
                                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                                                            <a onClick={() => window.open(href, target, 'noopener,noreferrer')} style={{ color: '#0d6efd' }}>{celldata.value}</a>
                                                        </div>
                                                    )
                                                }} dataField="MappedDRID" width={150} caption="DRID"></Column>
                                                <Column dataField="Country" width={200} caption="Country"></Column>
                                                <Column dataField="Indication" width={250} caption="Indication"></Column>
                                            </DataGrid>
                                        </div>
                                    </Dialog>

                                    <Dialog
                                        blockScroll={true}
                                        header={this.state.SelectedGOLDTabMode == 'Edit' ? `Create Plan DRID - ${this.state.GOLDTabDRID} - ${this.state.GOLDTabCountry ? this.state.GOLDTabCountry : ''}` : `View Plan DRID - ${this.state.GOLDTabDRID} - ${this.state.GOLDTabCountry ? this.state.GOLDTabCountry : ''}`}
                                        closable={false}
                                        visible={this.state.showMarketPopUp}
                                        style={{ height: '99vh', width: '99vw' }}
                                        icons={this.ViewMarketDialogIcon} onHide={() => this.setState({ showMarketPopUp: false })}>
                                        <div className='container projtPlan-data-container'>
                                            {/* <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' /> */}
                                            <Toast ref={(el) => this.toast = el} position="bottom-right" />
                                            <Row>
                                                <Col md={3} className='dr-pp-accordion'>
                                                    <Accordion multiple activeIndex={[0]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                                                        <AccordionTab header='Project Data [Read Only]'>
                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Business Unit:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.BUnit}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Sub Business Unit:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.SBUnit}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Molecule API/DS:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.MoleculeName}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Label Name:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.TradeName}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Indication:</label>
                                                                    <span className="dr-data-Span">{this.state.SelectedIDData?.Indication}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Global Brand:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.GlobalBrandAPI}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Therapeutic Area:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.TherapeuticArea}</span>
                                                                </div>
                                                            </div>
                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>PF/Compound Number:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.RnDProjNo}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Pfizer Code:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.PlaniswareID}</span>
                                                                </div>
                                                            </div>

                                                        </AccordionTab>
                                                    </Accordion>
                                                </Col>
                                                <Col md={9}>
                                                    <Accordion multiple activeIndex={[0]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                                                        <AccordionTab header='Market'>
                                                            <div style={{ display: 'flex' }}>
                                                                <div style={{ width: '100%' }}>
                                                                    <div style={{ fontSize: 'medium', fontWeight: 'bold', background: '#0000c9', textAlign: 'center', marginTop: '5px', padding: '3px', color: 'white', width: '100%' }}
                                                                    >Select Markets</div>
                                                                    <br />
                                                                    <div>
                                                                        <Row style={{ paddingBottom: '1%' }}>
                                                                            <Col>
                                                                                {/* <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
                                                                                    <span style={{ fontWeight: 'bold' }}>SIQ Managed</span>
                                                                                    <Switch checked={this.state.MarketData?.DLPPManaged === 'Yes' ? true : false} onChange={(e) => this.HandleMarketChange('DLPPManaged', e.target.checked ? 'Yes' : 'No')} color='primary' defaultValue='No' disabled={this.state.SelectedGOLDTabMode === 'View'} />
                                                                                    <span style={{ fontWeight: 'bold' }}>DLPP Managed</span>
                                                                                </div> */}
                                                                                <Label className='label-name' style={{ padding: '0px' }}>DLPP Managed<span style={{ color: 'red' }}>*</span>:</Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleMarketChange('DLPPManaged', e.target.value)} options={['Yes', 'No']} value={this.state.MarketData?.DLPPManaged} disabled={this.state.SelectedGOLDTabMode === 'View'} defaultValue='No' placeholder="Select" className="w-full md:w-14rem" />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Template</Label>
                                                                                <InputText className="label-name-ip" readOnly value={this.state.MarketData?.DLPPManaged === 'No' ? 'SIQ Managed' : 'GSC_Cat3-4'} style={{ width: '100%' }} ></InputText>
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Launch Priority<span style={{ color: 'red' }}>*</span></Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleMarketChange('Priority', e.target.value)} options={this.state.PriorityValues} optionLabel={'key'} optionValue={'value'}
                                                                                    value={this.state.MarketData?.Priority} disabled={this.state.SelectedGOLDTabMode === 'View'} placeholder="Select" className="w-full md:w-14rem" />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Launch Charcteristic</Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleMarketChange('LaunchChar', e.target.value)} options={this.state.LaunchCharacteristicsValues} optionLabel={'key'} optionValue={'value'}
                                                                                    value={this.state.MarketData?.LaunchChar} disabled={this.state.SelectedGOLDTabMode === 'View'} placeholder="Select" className="w-full md:w-14rem" />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Label/Trade Name</Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleMarketChange('TradeName', e.target.value)} options={this.state.LabelNameValues}
                                                                                    value={this.state.MarketData?.TradeName}
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'} placeholder="Select" className="w-full md:w-14rem" />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Select Country<span style={{ color: 'red' }}>*</span></Label>
                                                                                <MultiSelect
                                                                                    value={this.state.MarketData?.Country}
                                                                                    options={this.state.CountryList}
                                                                                    onChange={(e) => (this.setState({ selectedCountries: e.target.value }), this.HandleMarketChange('Country', e.target.value))}
                                                                                    optionLabel="Value"
                                                                                    optionValue='KeyValue'
                                                                                    placeholder='Country'
                                                                                    filter className="multiselect-custom"
                                                                                    display="chip"
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    appendTo='self'
                                                                                    //disabled={isDisabled}
                                                                                    // tooltip={this.state.MarketData?.Country}
                                                                                    // tooltipOptions={{ showOnDisabled: true, position: 'top' }}
                                                                                    resetFilterOnHide={true}
                                                                                    style={{ width: '100%', display: 'flex' }}
                                                                                    maxSelectedLabels={1}
                                                                                    selectedItemTemplate={(option) => {
                                                                                        // console.log(option)
                                                                                        if (this.state.MarketData?.Country?.length > 1) {
                                                                                            return `${this.state.MarketData?.Country?.length} items selected`
                                                                                        } else if (this.state.MarketData?.Country?.length == 0) {
                                                                                            return 'Select'
                                                                                        }
                                                                                        else {
                                                                                            return `${option?.split("->")[1]}  `
                                                                                        }
                                                                                    }}
                                                                                // selectedItemTemplate={this.selectedTemplate} 
                                                                                //  panelFooterTemplate={this.panelFooterTemplate}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Indication<span style={{ color: 'red' }}>*</span></Label>
                                                                                <MultiSelect
                                                                                    value={this.state.MarketData?.Indication}
                                                                                    options={this.state.IndicationValues}
                                                                                    onChange={(e) => (this.HandleMarketChange('Indication', e.target.value))}
                                                                                    placeholder='Select'
                                                                                    filter className="multiselect-custom md:w-20rem"
                                                                                    display="chip"
                                                                                    //disabled={isDisabled}
                                                                                    resetFilterOnHide={true}
                                                                                    style={{ width: '100%', display: 'flex' }}
                                                                                    optionLabel="value"
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    optionValue="value"
                                                                                    maxSelectedLabels={1}
                                                                                    appendTo='self'
                                                                                    tooltip={this.state.LaunchListMarketData.Indication}
                                                                                    tooltipOptions={{ showOnDisabled: true, position: 'top' }}
                                                                                    selectedItemTemplate={(option) => {
                                                                                        if (this.state.MarketData?.Indication?.length > 1) {
                                                                                            return `${this.state.MarketData?.Indication?.length} items selected`
                                                                                        } else {
                                                                                            return option
                                                                                        }
                                                                                    }}
                                                                                //  optionDisabled={(e)=>e.disabled ==true ? true : false}
                                                                                // selectedItemTemplate={this.selectedTemplate} 
                                                                                //  panelFooterTemplate={this.panelFooterTemplate}
                                                                                />

                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>GSC PMO / Launch Leader<span style={{ color: 'red' }}>*</span></Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        //     this.props?.currentUser?.Email ?
                                                                                        //         [this.props?.currentUser?.Email] :
                                                                                        //         [this.state.MarketData.LaunchLeader]
                                                                                        // }
                                                                                        this.state.MarketData.LaunchLeaderTitle ?
                                                                                            [this.state.MarketData.LaunchLeaderTitle] :
                                                                                            []
                                                                                    }

                                                                                    onChange={(ppl) => { this.HandleMarketChange('LaunchLeader', ppl[0]?.id), this.HandleMarketChange('LaunchLeaderTitle', ppl[0]?.text) }}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Market Planner</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.MarketData.MarketPlannerTitle ?
                                                                                            [this.state.MarketData.MarketPlannerTitle] :
                                                                                            []
                                                                                    }

                                                                                    onChange={(ppl) => { this.HandleMarketChange('MarketPlanner', ppl[0]?.id), this.HandleMarketChange('MarketPlannerTitle', ppl[0]?.text) }}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Market Planner Supervisor</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.MarketData.MarketPlannerSupTitle ?
                                                                                            [this.state.MarketData.MarketPlannerSupTitle] :
                                                                                            []
                                                                                    }
                                                                                    onChange={(ppl) => { this.HandleMarketChange('MarketPlannerSup', ppl[0]?.id), this.HandleMarketChange('MarketPlannerSupTitle', ppl[0]?.text) }}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Regional Supplier Leader</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.MarketData.RegSupplierLeaderTitle ?
                                                                                            [this.state.MarketData.RegSupplierLeaderTitle] :
                                                                                            []
                                                                                    }
                                                                                    onChange={(ppl) => (this.HandleMarketChange('RegSupplierLeader', ppl[0]?.id), this.HandleMarketChange('RegSupplierLeaderTitle', ppl[0]?.text))}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Above Market Planner</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.MarketData.AboveMarketPlannerTitle ?
                                                                                            [this.state.MarketData.AboveMarketPlannerTitle] :
                                                                                            []
                                                                                    }
                                                                                    onChange={(ppl) => (this.HandleMarketChange('AboveMarketPlanner', ppl[0]?.id), this.HandleMarketChange('AboveMarketPlannerTitle', ppl[0]?.text))}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Above Market Planner Supervisor</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedGOLDTabMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.MarketData.AboveMarketPlannerSupTitle ?
                                                                                            [this.state.MarketData.AboveMarketPlannerSupTitle] :
                                                                                            []
                                                                                    }
                                                                                    onChange={(ppl) => (this.HandleMarketChange('AboveMarketPlannerSup', ppl[0]?.id), this.HandleMarketChange('AboveMarketPlannerSupTitle', ppl[0]?.text))}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Project Name Suffix</Label>
                                                                                <InputText value={this.state.MarketData?.ProjectNameSuffix} onChange={(e) => this.HandleMarketChange('ProjectNameSuffix', e.target.value)} disabled={this.state.SelectedGOLDTabMode === 'View'}></InputText>
                                                                                <div style={{ marginLeft: '90%' }}>{this.state.MarketData?.ProjectNameSuffix?.length}/30</div>
                                                                            </Col>
                                                                            <Col />
                                                                            <Col />
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '10px' }}>
                                                                            <Col md={12} className='' style={{ marginTop: "5px" }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '15px' }}>
                                                                                    <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.LABEL_NAME}</span>
                                                                                        <label style={{ textAlign: 'center' }}>GRP Name</label>
                                                                                    </div>
                                                                        +
                                                                        <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.PREFIX}</span>
                                                                                        <label style={{ textAlign: 'center' }}>Indication</label>
                                                                                    </div>
                                                                        +
                                                                        <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.SUFFIX}</span>
                                                                                        <label style={{ textAlign: 'center' }}>Country - Project Suffix</label>
                                                                                    </div>
                                                                        =
                                                                        <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.ProposedProjectName}</span>
                                                                                        <label style={{ textAlign: 'center' }}>Proposed Project Name</label>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                        {this.state.SelectedGOLDTabMode === 'Edit' && <div style={{ marginTop: '5px', textAlign: 'left' }}>
                                                                            <Button className='p-button-raised p-button-rounded okBtn'
                                                                                style={{ visibility: "visible", right: '10px' }}
                                                                                // disabled={this.showMarket()}
                                                                                type='button'
                                                                                disabled={!(this.state.MarketData?.Indication?.length > 0 && this.state.MarketData?.DLPPManaged !== '' && this.state.MarketData?.Country?.length > 0 && this.state.MarketData?.Priority !== '' && this.state.MarketData?.LaunchLeader != null)}
                                                                                onClick={e => (this.setState({ ShowMarketGrid: true }), this.getMarketGridData())} icon='dx-icon-add' label='Market' />

                                                                        </div>}

                                                                    </div>


                                                                    <br />
                                                                    <div style={{ fontSize: 'medium', fontWeight: 'bold', background: '#0000c9', textAlign: 'center', marginTop: '5px', padding: '3px', color: 'white', width: '100%' }}
                                                                    > Markets Selected</div>
                                                                    <br />
                                                                    {this.state.ShowMarketGrid && <div>
                                                                        <DataGrid
                                                                            dataSource={this.state.MarketGridDataArray}
                                                                            //filterValue={this.state.gridFilterValue}
                                                                            //defaultFilterValue={this.state.gridFilterValue}
                                                                            ref={(ref) => { this.dataGrid = ref; }}
                                                                            allowColumnReordering={true}
                                                                            allowColumnResizing={true}
                                                                            columnResizingMode={'widget'}
                                                                            filterSyncEnabled={false}
                                                                            showColumnLines={true}
                                                                            rowAlternationEnabled={true}
                                                                            showBorders={true}
                                                                            showRowLines={false}
                                                                            // width='100%'
                                                                            hoverStateEnabled={true}
                                                                            columnMinWidth={1}
                                                                            // onCellPrepared={this.highlightSelected}
                                                                            // onEditorPreparing={this.onEditorPreparing}
                                                                            //onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                                                                            columnAutoWidth={true}>
                                                                            <Editing
                                                                                mode="cell"
                                                                                // onChangesChange={this.dtChanges}
                                                                                // allowUpdating={checkForComments}
                                                                                //  allowUpdating={this.state.planfieldValues.PlanStatus == 'PROCESSING' || this.state.planfieldValues.PlanStatus == 'NEW' ? false : true}
                                                                                allowAdding={false}
                                                                                allowDeleting={false} />
                                                                            <Column cellRender={e => this.MarketActionCol(e)} minWidth={20} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                                                            <Column
                                                                                dataField={'ProjectName'} caption={'Proposed Project Name'} dataType={'string'} minWidth={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'Template'} caption={'Template'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} //alignment={item.alignment}
                                                                            />

                                                                            <Column
                                                                                dataField={'LabelText1'} caption={'Label'} dataType={'string'} width={'120px'} visible={true} allowEditing={false} alignment='center' format='MMM-dd-yyyy'
                                                                            />
                                                                            <Column
                                                                                dataField={'country'} caption={'Country'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'Indication'} caption={'Indication'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'LaunchPriorityCategory'} caption={'Launch Priority'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'LaunchCharacteristic'} caption={'Launch Charcteristic'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'LaunchLeader'} caption={'GSC PMO / Launch Leader'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'MarketPlanner'} caption={'Market Planner'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'MarketPlannerSupervisor'} caption={'Market Planner Supervisor'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'RegionalSupplyLeader'} caption={'Regional Supplier Leader'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'AboveMarketPlanner'} caption={'Above Market Planner'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'AboveMarketPlannerSupervisor'} caption={'Above Market Planner Supervisor'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />
                                                                            <Column
                                                                                dataField={'DLPPManaged'} caption={'DLPP Managed'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                            />

                                                                        </DataGrid>
                                                                    </div>}

                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                </Col>
                                            </Row>
                                        </div>

                                    </Dialog>

                                    {/* LaunchList Market Pop-up */}
                                    <Dialog
                                        blockScroll={true}
                                        header={this.state.SelectedMarketMode == 'New' ? 'Add Project Plan' : this.state.SelectedMarketMode == 'Edit' ? `Edit Plan : ` + this.state.SelectedDRMarketData?.ProjectName : "View Plan : " + this.state.SelectedDRMarketData?.ProjectName}
                                        closable={false}
                                        visible={this.state.showLaunchMarketPopup}
                                        style={{ height: '99vh', width: '99vw' }}
                                        icons={this.ViewLaunchMarketDialogIcon} onHide={() => this.setState({ showLaunchMarketPopup: false })}>
                                        <div className='container projtPlan-data-container'>
                                            {/* <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' /> */}
                                            <Toast ref={(el) => this.toast = el} position="bottom-right" />
                                            <Row>
                                                <Col md={3} className='dr-pp-accordion'>
                                                    <Accordion multiple activeIndex={[0]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                                                        <AccordionTab header='Project Data [Read Only]'>
                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Business Unit<span style={{ color: 'red' }}>*</span>:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.BUnit}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Sub Business Unit<span style={{ color: 'red' }}>*</span>:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.SBUnit}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Molecule API/DS<span style={{ color: 'red' }}>*</span>:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.MoleculeName}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Label Name:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.TradeName}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Indication:</label>
                                                                    <span className='dr-data-Span'>{this.state.SelectedIDData?.Indication}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Global Brand:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.GlobalBrandAPI}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Therapeutic Area:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.TherapeuticArea}</span>
                                                                </div>
                                                            </div>
                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>PF/Compound Number:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.RnDProjNo}</span>
                                                                </div>
                                                            </div>

                                                            <div className='dr-label-data-container'>
                                                                <div className='dr-label-PP'>
                                                                    <label>Pfizer Code:</label>
                                                                    <span className='dr-data-PP'>{this.state.SelectedIDData?.PlaniswareID}</span>
                                                                </div>
                                                            </div>

                                                        </AccordionTab>
                                                    </Accordion>
                                                </Col>
                                                <Col md={9}>
                                                    <Accordion multiple activeIndex={[0]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                                                        <AccordionTab header='Market'>
                                                            <div style={{ display: 'flex' }}>
                                                                <div style={{ width: '100%' }}>
                                                                    <div style={{ fontSize: 'medium', fontWeight: 'bold', background: '#0000c9', textAlign: 'center', marginTop: '5px', padding: '3px', color: 'white', width: '100%' }}
                                                                    >Select Markets</div>
                                                                    <br />
                                                                    <div>
                                                                        <Row>
                                                                            <Col style={{ marginBottom: '1rem' }}>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>DLPP Managed<span style={{ color: 'red' }}>*</span>:</Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleLaunchMarketChange('DLPPManaged', e.target.value)} options={['Yes', 'No']} value={this.state.LaunchListMarketData?.DLPPManaged} disabled={this.state.SelectedMarketMode === 'View' || this.state.SelectedDRMarketData?.IsDLPPManagedEdit === 'true'} defaultValue='No' placeholder='Select' className="w-full md:w-14rem" />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Template<span style={{ color: 'red' }}>*</span></Label>
                                                                                <InputText className="label-name-ip" disabled={this.state.SelectedMarketMode} value={this.state.LaunchListMarketData?.DLPPManaged === 'No' ? 'SIQ Managed' : 'GSC_Cat3-4'} style={{ width: '100%' }} ></InputText>
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Launch Priority<span style={{ color: 'red' }}>*</span></Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleLaunchMarketChange('Priority', e.target.value)} options={this.state.PriorityValues} optionLabel={'key'} optionValue={'value'}
                                                                                    value={this.state.LaunchListMarketData?.Priority} disabled={this.state.SelectedMarketMode === 'View'} placeholder="Select" className="w-full md:w-14rem" />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Launch Charcteristic</Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleLaunchMarketChange('LaunchChar', e.target.value)} options={this.state.LaunchCharacteristicsValues} optionLabel={'key'} optionValue={'value'}
                                                                                    value={this.state.LaunchListMarketData?.LaunchChar} disabled={this.state.SelectedMarketMode === 'View'} placeholder="Select" className="w-full md:w-14rem" />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Label/Trade Name</Label>
                                                                                <Dropdown appendTo='self' onChange={(e) => this.HandleLaunchMarketChange('TradeName', e.target.value)} options={this.state.LabelNameValues}
                                                                                    value={this.state.LaunchListMarketData?.TradeName}
                                                                                    disabled={this.state.SelectedMarketMode === 'View' || this.state.SelectedMarketMode === 'Edit'} placeholder="Select" className="w-full md:w-14rem" />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Select Country<span style={{ color: 'red' }}>*</span></Label>
                                                                                <MultiSelect
                                                                                    value={this.state.LaunchListMarketData?.Country}
                                                                                    options={this.state.CountryList}
                                                                                    onChange={(e) => (this.setState({ selectedCountries: e.target.value }), this.HandleLaunchMarketChange('Country', e.target.value))}
                                                                                    optionLabel="Value"
                                                                                    optionValue='KeyValue'
                                                                                    placeholder='Country'
                                                                                    filter className="multiselect-custom"
                                                                                    display="chip"
                                                                                    appendTo='self'
                                                                                    disabled={this.state.SelectedMarketMode === 'View' || this.state.SelectedMarketMode === 'Edit'}
                                                                                    //disabled={isDisabled}
                                                                                    resetFilterOnHide={true}
                                                                                    style={{ width: '100%', display: 'flex' }}
                                                                                    maxSelectedLabels={1}
                                                                                    selectedItemTemplate={(option) => {
                                                                                        // console.log(option)
                                                                                        if (this.state.LaunchListMarketData?.Country?.length > 1) {
                                                                                            return `${this.state.LaunchListMarketData?.Country?.length} items selected`
                                                                                        } else if (this.state.LaunchListMarketData?.Country?.length == 0) {
                                                                                            return 'Select'
                                                                                        }
                                                                                        else {
                                                                                            return `${option?.split("->")[1]}  `
                                                                                        }
                                                                                    }}
                                                                                // selectedItemTemplate={this.selectedTemplate} 
                                                                                //  panelFooterTemplate={this.panelFooterTemplate}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Indication<span style={{ color: 'red' }}>*</span></Label>
                                                                                <MultiSelect
                                                                                    value={this.state.LaunchListMarketData?.Indication}
                                                                                    options={this.state.LaunchIndicationvalues}
                                                                                    onChange={(e) => (this.HandleLaunchMarketChange('Indication', e.target.value))}
                                                                                    placeholder='Select'
                                                                                    filter className="multiselect-custom md:w-20rem"
                                                                                    display="chip"
                                                                                    //disabled={isDisabled}
                                                                                    resetFilterOnHide={true}
                                                                                    style={{ width: '100%', display: 'flex' }}
                                                                                    optionLabel="value"
                                                                                    appendTo='self'
                                                                                    disabled={this.state.SelectedMarketMode === 'View'}
                                                                                    optionValue="value"
                                                                                    maxSelectedLabels={1}
                                                                                    tooltip={this.state.LaunchListMarketData.Indication}
                                                                                    tooltipOptions={{ showOnDisabled: true, position: 'top' }}
                                                                                    selectedItemTemplate={(option) => {
                                                                                        if (this.state.LaunchListMarketData?.Indication > 1) {
                                                                                            return `${this.state.LaunchListMarketData?.Indication} items selected`
                                                                                        } else {
                                                                                            return option
                                                                                        }
                                                                                    }}
                                                                                // selectedItemTemplate={this.selectedTemplate} 
                                                                                //  panelFooterTemplate={this.panelFooterTemplate}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>GSC PMO / Launch Leader<span style={{ color: 'red' }}>*</span></Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedMarketMode === 'View'}
                                                                                    defaultSelectedUsers={

                                                                                        this.state.LaunchListMarketData?.LaunchLeaderTitle ?
                                                                                            [this.state.LaunchListMarketData?.LaunchLeaderTitle] :
                                                                                            []
                                                                                    }
                                                                                    onChange={(ppl) => { this.HandleLaunchMarketChange('LaunchLeader', ppl[0]?.id), this.HandleLaunchMarketChange('LaunchLeaderTitle', ppl[0]?.text) }}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Market Planner</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedMarketMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.LaunchListMarketData?.MarketPlannerTitle ?
                                                                                            [this.state.LaunchListMarketData?.MarketPlannerTitle] :
                                                                                            []
                                                                                    }

                                                                                    onChange={(ppl) => { this.HandleLaunchMarketChange('MarketPlanner', ppl[0]?.id), this.HandleLaunchMarketChange('MarketPlannerTitle', ppl[0]?.text) }}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Market Planner Supervisor</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedMarketMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.LaunchListMarketData?.MarketPlannerSupTitle ?
                                                                                            [this.state.LaunchListMarketData?.MarketPlannerSupTitle] :
                                                                                            []
                                                                                    }

                                                                                    onChange={(ppl) => { this.HandleLaunchMarketChange('MarketPlannerSup', ppl[0]?.id), this.HandleLaunchMarketChange('MarketPlannerSupTitle', ppl[0]?.text) }}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Regional Supplier Leader</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedMarketMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.LaunchListMarketData?.RegSupplierLeaderTitle ?
                                                                                            [this.state.LaunchListMarketData?.RegSupplierLeaderTitle] :
                                                                                            []
                                                                                    }
                                                                                    onChange={(ppl) => (this.HandleLaunchMarketChange('RegSupplierLeader', ppl[0]?.id), this.HandleLaunchMarketChange('RegSupplierLeaderTitle', ppl[0]?.text))}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Above Market Planner</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedMarketMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.LaunchListMarketData?.AboveMarketPlannerTitle ?
                                                                                            [this.state.LaunchListMarketData?.AboveMarketPlannerTitle] :
                                                                                            []
                                                                                    }
                                                                                    onChange={(ppl) => (this.HandleLaunchMarketChange('AboveMarketPlanner', ppl[0]?.id), this.HandleLaunchMarketChange('AboveMarketPlannerTitle', ppl[0]?.text))}
                                                                                />
                                                                            </Col>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Above Market Planner Supervisor</Label>
                                                                                <PeoplePicker
                                                                                    context={DataService.currentSpContext as any}
                                                                                    principalTypes={[PrincipalType.User]}
                                                                                    ensureUser={true}
                                                                                    disabled={this.state.SelectedMarketMode === 'View'}
                                                                                    defaultSelectedUsers={
                                                                                        this.state.LaunchListMarketData?.AboveMarketPlannerSupTitle ?
                                                                                            [this.state.LaunchListMarketData?.AboveMarketPlannerSupTitle] :
                                                                                            []
                                                                                    }

                                                                                    onChange={(ppl) => (this.HandleLaunchMarketChange('AboveMarketPlannerSup', ppl[0]?.id), this.HandleLaunchMarketChange('AboveMarketPlannerSupTitle', ppl[0]?.text))}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '17px' }}>
                                                                            <Col>
                                                                                <Label className='label-name' style={{ padding: '0px' }}>Project Name Suffix</Label>
                                                                                <InputText value={this.state.LaunchListMarketData?.ProjectNameSuffix} onChange={(e) => this.HandleLaunchMarketChange('ProjectNameSuffix', e.target.value)} disabled={this.state.SelectedMarketMode === 'View' || this.state.SelectedMarketMode === 'Edit'}></InputText>
                                                                                <div style={{ marginLeft: '90%' }}>{this.state.LaunchListMarketData?.ProjectNameSuffix?.length}/30</div>

                                                                            </Col>
                                                                            <Col />
                                                                            <Col />
                                                                        </Row>
                                                                        <Row style={{ paddingTop: '10px' }}>
                                                                            <Col md={12} className='' style={{ marginTop: "5px" }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '15px' }}>
                                                                                    <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.LaunchLABEL_NAME}</span>
                                                                                        <label style={{ textAlign: 'center' }}>GRP Name</label>
                                                                                    </div>
                                                                        +
                                                                        <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.LaunchPREFIX}</span>
                                                                                        <label style={{ textAlign: 'center' }}>Indication </label>
                                                                                    </div>
                                                                        +
                                                                        <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.LaunchSUFFIX}</span>
                                                                                        <label style={{ textAlign: 'center' }}>Country-Project Suffix</label>
                                                                                    </div>
                                                                        =
                                                                        <div className='proj-name-container'>
                                                                                        <span className='dr-data-PP'>{this.LaunchProposedProjectName}</span>
                                                                                        <label style={{ textAlign: 'center' }}>Proposed Project Name</label>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                        {this.state.SelectedMarketMode == 'New' && <div style={{ marginTop: '5px', textAlign: 'left' }}>
                                                                            <Button className='p-button-raised p-button-rounded okBtn'
                                                                                style={{ visibility: "visible", right: '10px' }}
                                                                                // disabled={this.showMarket()}
                                                                                type='button'
                                                                                disabled={!(this.state.LaunchListMarketData?.Indication?.length > 0 && this.state.LaunchListMarketData?.DLPPManaged !== '' && this.state.LaunchListMarketData?.Country?.length > 0 && this.state.LaunchListMarketData?.Priority !== '' && this.state.LaunchListMarketData?.LaunchLeader != null)}
                                                                                onClick={e => (this.setState({ ShowMarketGrid: true }), this.getLaunchMarketGridData())} icon='dx-icon-add' label='Market' />

                                                                        </div>}

                                                                    </div>


                                                                    <br />
                                                                    {this.state.ShowMarketGrid && this.state.SelectedMarketMode == 'New' && <div>
                                                                        <div style={{ fontSize: 'medium', fontWeight: 'bold', background: '#0000c9', textAlign: 'center', marginTop: '5px', padding: '3px', color: 'white', width: '100%' }}
                                                                        > Markets Selected</div>
                                                                        <br />
                                                                        <div>
                                                                            <DataGrid
                                                                                dataSource={this.state.MarketGridDataArray}
                                                                                //filterValue={this.state.gridFilterValue}
                                                                                //defaultFilterValue={this.state.gridFilterValue}
                                                                                ref={(ref) => { this.dataGrid = ref; }}
                                                                                allowColumnReordering={true}
                                                                                allowColumnResizing={true}
                                                                                columnResizingMode={'widget'}
                                                                                filterSyncEnabled={false}
                                                                                showColumnLines={true}
                                                                                rowAlternationEnabled={true}
                                                                                showBorders={true}
                                                                                showRowLines={false}
                                                                                // width='100%'
                                                                                hoverStateEnabled={true}
                                                                                columnMinWidth={1}
                                                                                // onCellPrepared={this.highlightSelected}
                                                                                // onEditorPreparing={this.onEditorPreparing}
                                                                                //onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                                                                                columnAutoWidth={true}>
                                                                                <Editing
                                                                                    mode="cell"
                                                                                    // onChangesChange={this.dtChanges}
                                                                                    // allowUpdating={checkForComments}
                                                                                    //  allowUpdating={this.state.planfieldValues.PlanStatus == 'PROCESSING' || this.state.planfieldValues.PlanStatus == 'NEW' ? false : true}
                                                                                    allowAdding={false}
                                                                                    allowDeleting={false} />
                                                                                <Column cellRender={e => this.MarketActionCol(e)} minWidth={20} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                                                                <Column
                                                                                    dataField={'ProjectName'} caption={'Proposed Project Name'} dataType={'string'} minWidth={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'Template'} caption={'Template'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} //alignment={item.alignment}
                                                                                />

                                                                                <Column
                                                                                    dataField={'LabelName'} caption={'Label'} dataType={'string'} width={'120px'} visible={true} allowEditing={false} alignment='center' format='MMM-dd-yyyy'
                                                                                />
                                                                                <Column
                                                                                    dataField={'Country'} caption={'Country'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'Indication'} caption={'Indication'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'LaunchPriorityCategory'} caption={'Launch Priority'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'LaunchCharacteristic'} caption={'Launch Charcteristic'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'LaunchLeader'} caption={'GSC PMO / Launch Leader'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'MarketPlanner'} caption={'Market Planner'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'MarketPlannerSupervisor'} caption={'Market Planner Supervisor'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'RegionalSupplyLeader'} caption={'Regional Supplier Leader'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'AboveMarketPlanner'} caption={'Above Market Planner'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'AboveMarketPlannerSupervisor'} caption={'Above Market Planner Supervisor'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />
                                                                                <Column
                                                                                    dataField={'DLPPManaged'} caption={'DLPP Managed'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                                                />

                                                                            </DataGrid>
                                                                        </div>
                                                                    </div>}

                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                </Col>
                                            </Row>
                                        </div>

                                    </Dialog>


                                    {this.state.showEditPlanDialog && this.selectedRowData != null &&
                                        <EditPlan
                                            autoOpenCreateRisk={this.state.autoOpenCreateRisk}
                                            updateAutoOpenCreateRisk={() => { this.setState({ autoOpenCreateRisk: false }); }}
                                            autoOpenRiskItemId={this.autoOpenRiskItemId}
                                            currentUser={this.props?.currentUser}
                                            rowData={this.selectedRowData}
                                            showEditPlanDialog={this.state.showEditPlanDialog}
                                            plansResults={this.state.planViewRecordsArray}
                                            reasonChangeOptions={this.state.reasonChangeOptions}
                                            handleClose={this.handleEditPlanDialogClose}
                                            uniqueLaunchLeads={this.state.pgsLeadersArraySort}
                                            siteUrl={this.props.siteUrl}
                                            Mode={this.state.Mode}
                                            // handleEditPlanSave ={this.getProductChecklist}
                                            SelectedView={this.state.SelectedView} />}
                                    {/* end */}


                                    <Dialog header="History" closable={false} visible={this.state.IsComments} style={{ height: '75vh', width: '50vw' }} icons={this.ViewDialogIcon} onHide={() => this.setState({ IsComments: false })}>
                                        <DataGrid
                                            dataSource={this.state.CommentsHistoryArray}
                                            allowColumnReordering={true}
                                            allowColumnResizing={true}
                                            columnResizingMode={'widget'}
                                            filterSyncEnabled={false}
                                            showColumnLines={true}
                                            rowAlternationEnabled={true}
                                            showBorders={true}
                                            showRowLines={false}
                                        ></DataGrid>
                                    </Dialog>
                                </Drawer>
                            </div >
                        </div >
                        <Dialog modal header="Custom Views and Filters" closable={false} icons={this.ViewDialogIcon} visible={this.state.displayResponsive} onHide={() => this.onHide('displayResponsive')} style={{ width: '99vw', height: '99vh' }}>
                            <div className='container-fluid'>
                                {this.state.newViewInputVisible &&
                                    <Row className="rowCss">
                                        <Col md={6}>
                                            <Row style={{ marginTop: "1rem" }}>
                                                <Col md={12}>
                                                    <Row>
                                                        <Col md={3} style={{ marginTop: "0.5rem", opacity: 1, fontWeight: 500, color: "#000000", letterSpacing: "0px" }}>
                                                            <span>Name of the view</span>
                                                        </Col>
                                                        <Col md={5} style={{ width: "14rem", marginLeft: "-2rem" }}>
                                                            <InputText value={this.state.newViewName} onChange={(e) => this.setState({ newViewName: e.currentTarget.value })} />
                                                        </Col>
                                                        <Col md={4} style={{ marginRight: "-0.8rem", marginTop: "0.3rem" }}>
                                                            <CheckBox defaultValue={false}
                                                                style={{ paddingRight: "0.2rem" }}
                                                                value={this.state.defaultView}
                                                                onValueChanged={e => this.setState({ defaultView: e.value })} />Set as default &nbsp;
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={6} style={{ marginTop: "1rem" }}>
                                            <Row style={{ float: 'right' }}>
                                                <Col md={12}>
                                                    {/* <SelectButton disabled={!this.state.IsAdmin} className='selectBtnCntrl' value={this.state.ViewType} options={this.state.ViewPubOrPri} style={{ borderRadius: '5px' }} onChange={(e) => this.switchPublicPrivateView(e)} /> */}
                                                    <SelectButton className='selectBtnCntrl' style={{ borderRadius: '5px' }}
                                                        value={this.state.ViewType} options={this.state.ViewPubOrPri}
                                                        onChange={(e) => this.switchPublicPrivateView(e)} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                                {!this.state.newViewInputVisible &&
                                    <Row className="rowCss">
                                        <Col md={8}>
                                            <Row style={{ marginTop: "1rem" }}>
                                                <Col md={12}>
                                                    <Row>
                                                        <Col md={2} style={{ marginTop: "0.5rem", opacity: 1, fontWeight: 500, color: "#000000", letterSpacing: "0px" }}>
                                                            <span style={{ marginRight: '0.1rem' }}>My View</span>
                                                        </Col>
                                                        <Col md={5} style={{ width: "14rem" }}>
                                                            {/* <Dropdown itemTemplate={this.viewNameTemplate} value={this.state.currentViewName} disabled={this.state.newViewInputVisible} options={ this.state.viewDropdownOptions} onChange={this.ViewChangeHandler} placeholder="Select a View" /> */}
                                                            <Dropdown itemTemplate={this.viewNameTemplate} value={this.state.currentViewName} disabled={this.state.newViewInputVisible} options={this.state.checked1 ? this.state.viewDropdownOptions.filter(ele => ele.viewCategory == "Plan") : this.state.viewDropdownOptions.filter(ele => ele.viewCategory == "Product")} onChange={this.ViewChangeHandler} placeholder="Select a View" />
                                                        </Col>
                                                        <Col md={5}
                                                            hidden={this.state.IsAdmin == false && (this.state.ViewType == "Public" || this.state.currentViewName === "LaunchX" || this.state.currentViewName === "Coder")}
                                                            style={{ marginRight: "0.2rem", marginTop: "0.3rem" }}>
                                                            {this.state.currentViewName == "All Fields" ?
                                                                <CheckBox defaultValue={false} style={{ paddingRight: "0.2rem" }}
                                                                    value={this.state.defaultView}
                                                                    disabled={this.state.setAsDefaultCheckboxVal}
                                                                    onValueChanged={e => this.setState({ defaultView: e.value })}>Set as default</CheckBox>
                                                                :
                                                                <CheckBox defaultValue={false} style={{ paddingRight: "0.2rem" }}
                                                                    value={this.state.defaultView}
                                                                    onValueChanged={e => this.setState({ defaultView: e.value })} >Set as default &nbsp; </CheckBox>}Set as default &nbsp;
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={4} style={{ marginTop: "1rem" }}>
                                            <Row style={{ float: 'right' }}>
                                                <Col md={12}>
                                                    {this.state.currentViewName == "All Fields" ?
                                                        <SelectButton className='selectBtnCntrl'
                                                            disabled={this.state.currentViewName == "All Fields" ? true : false}
                                                            value={this.state.ViewType} options={this.state.ViewPubOrPri} style={{ borderRadius: '5px' }} onChange={(e) => this.switchPublicPrivateView(e)} />
                                                        :
                                                        <SelectButton className='selectBtnCntrl'
                                                            value={this.state.ViewType} options={this.state.ViewPubOrPri} style={{ borderRadius: '5px' }} onChange={(e) => this.switchPublicPrivateView(e)} />
                                                    }
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                                <div className="card view-card"  >
                                    <TabView>
                                        <TabPanel header="Columns">
                                            <Panel header="Selected Columns">
                                                {this.state.checked1 ? this.state.SelectedColArray?.filter(i => i.ViewType == "Plan").map((item, index) => {
                                                    return (
                                                        <Button
                                                            label={item?.caption}
                                                            onClick={this.ViewSelectedonClick}
                                                            draggable
                                                            onDragStart={e => { this.dragItemRef.current = index }}
                                                            onDragEnter={e => { this.dragOverItemRef.current = index }}
                                                            onDragEnd={this.onDropItem}
                                                            disabled={this.state.IsAdmin == false && ((this.state.ViewType === "Public" && this.state.newViewInputVisible == false))}
                                                            className='view-btns'>
                                                            <img src={minus} style={{ paddingRight: "0.4rem", marginLeft: "0.4rem", width: "20px" }} />
                                                        </Button>
                                                    );
                                                })
                                                    :
                                                    this.state.SelectedColArray?.filter(i => i.ViewType == "Product").map((item, index) => {
                                                        return (
                                                            <Button
                                                                label={item?.caption}
                                                                onClick={this.ViewSelectedonClick}
                                                                draggable
                                                                onDragStart={e => { this.dragItemRef.current = index }}
                                                                onDragEnter={e => { this.dragOverItemRef.current = index }}
                                                                onDragEnd={this.onDropItem}
                                                                disabled={this.state.IsAdmin == false && ((this.state.ViewType === "Public" && this.state.newViewInputVisible == false))}
                                                                className='view-btns'>
                                                                <img src={minus} style={{ paddingRight: "0.4rem", marginLeft: "0.4rem", width: "20px" }} />
                                                            </Button>
                                                        );
                                                    })

                                                }
                                            </Panel>
                                            <Panel header="Available Columns">
                                                {this.state.checked1 ? this.state.AvailableColArray?.filter(i => i.ViewType == "Plan").map((item, index) => {
                                                    return (
                                                        <Button
                                                            label={item?.caption}
                                                            onClick={this.AddSelectedColumn}
                                                            disabled={this.state.IsAdmin == false && ((this.state.ViewType === "Public" && this.state.newViewInputVisible == false))}
                                                            className='view-btns'>
                                                            <img src={plus} style={{ paddingRight: "0.4rem", marginLeft: "0.4rem", width: "20px" }} />
                                                        </Button>
                                                    );
                                                })
                                                    :
                                                    this.state.AvailableColArray?.filter(i => i.ViewType == "Product").map((item, index) => {
                                                        return (
                                                            <Button
                                                                label={item?.caption}
                                                                onClick={this.AddSelectedColumn}
                                                                disabled={this.state.IsAdmin == false && ((this.state.ViewType === "Public" && this.state.newViewInputVisible == false))}
                                                                className='view-btns'>
                                                                <img src={plus} style={{ paddingRight: "0.4rem", marginLeft: "0.4rem", width: "20px" }} />
                                                            </Button>
                                                        );
                                                    })
                                                }
                                            </Panel>
                                        </TabPanel>
                                        <TabPanel header="Filters">
                                            <Panel header="Selected Filters">
                                                {
                                                    this.state.SelectedFilterArr?.map((item, index) => {
                                                        return (
                                                            <div className="selectedFilters">
                                                                <Button
                                                                    label={item?.filterCol}
                                                                    onClick={e => this.RemoveSelectedFilter(item)}

                                                                    style={{
                                                                        marginLeft: "1%",
                                                                        opacity: 1,
                                                                        backgroundColor: "white",
                                                                        color: "#101010",
                                                                        border: "none",
                                                                    }}
                                                                    disabled={this.state.IsAdmin == false && ((this.state.ViewType === "Public" && this.state.newViewInputVisible == false))}
                                                                >
                                                                    <img src={minus} style={{ paddingRight: "0.4rem", width: "20px", marginLeft: "0.4rem" }} />
                                                                </Button>
                                                                {
                                                                    this.state.AllNoneFilter.map(item2 => {
                                                                        if (item2.filterCol == item.filterCol) {
                                                                            return (
                                                                                <>
                                                                                    <CheckBox defaultValue={false} style={{ verticalAlign: "super" }}
                                                                                        value={item2.optionList?.All}
                                                                                        onValueChanged={e => this.AllNoneFilterChange(e, item2, 'All')} /><span style={{ verticalAlign: "super", marginLeft: "0.5rem", marginRight: "0.5rem" }}>All&nbsp;</span>
                                                                                    <CheckBox defaultValue={false} style={{ verticalAlign: "super" }}
                                                                                        value={item2.optionList?.None}
                                                                                        onValueChanged={e => this.AllNoneFilterChange(e, item2, 'None')} /><span style={{ verticalAlign: "super", marginLeft: "0.5rem", marginRight: "0.5rem" }}>None&nbsp;</span>
                                                                                </>
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                                {item?.['optionList'].map(item1 => {
                                                                    return (
                                                                        <>
                                                                            <InputSwitch style={{
                                                                                borderRadius: "1rem",
                                                                                height: "1.5rem"
                                                                            }} checked={item1.visible} onChange={(e) => this.FilterInputSwitch(e.target.value, item1)} />
                                                                            <span style={{ marginLeft: "0.5rem", marginRight: "0.3rem", verticalAlign: "super" }}>
                                                                                {item1?.actualValue}&nbsp;</span>
                                                                        </>
                                                                    );
                                                                })}

                                                            </div>
                                                        );
                                                    })
                                                }


                                            </Panel>
                                            <Panel header="Available Filters">
                                                {this.state.checked1 ? this.state.AvailableFilterArr?.filter(i => (i.viewCategory == "Plan" || i.viewCategory == "Both")).map((item, index) => {
                                                    return (
                                                        <Button
                                                            label={item?.filterCol}
                                                            disabled={this.state.IsAdmin == false && ((this.state.ViewType === "Public" && this.state.newViewInputVisible == false))}
                                                            onClick={this.AddSelectedFilter}
                                                            style={{ margin: "0% 1% 1% 0%", opacity: 1, backgroundColor: "white", color: "#101010", border: "1px solid #D8D8D8", borderRadius: "2rem", height: "2.5rem" }}>
                                                            <img src={plus} style={{ paddingRight: "0.4rem", marginLeft: "0.4rem", width: "20px" }} />
                                                        </Button>
                                                    );
                                                })
                                                    :
                                                    this.state.AvailableFilterArr?.filter(i => (i.viewCategory == "Product" || i.viewCategory == "Both")).map((item, index) => {
                                                        return (
                                                            <Button
                                                                label={item?.filterCol}
                                                                disabled={this.state.IsAdmin == false && ((this.state.ViewType === "Public" && this.state.newViewInputVisible == false))}
                                                                onClick={this.AddSelectedFilter}
                                                                style={{ margin: "0% 1% 1% 0%", opacity: 1, backgroundColor: "white", color: "#101010", border: "1px solid #D8D8D8", borderRadius: "2rem", height: "2.5rem" }}>
                                                                <img src={plus} style={{ paddingRight: "0.4rem", marginLeft: "0.4rem", width: "20px" }} />
                                                            </Button>
                                                        );
                                                    })
                                                }
                                            </Panel>
                                        </TabPanel>
                                    </TabView>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog visible={this.state.deleteViewDialogVisible} style={{ width: '35%', height: '32%' }} showHeader={false} onHide={() => { this.setState({ deleteViewDialogVisible: false }); }} >
                            <div className="confirmation-content">
                                <h4 style={{ color: "#5da8ea", fontSize: '25px', margin: '5%' }}>Confirm Delete?</h4>
                                <h5 style={{ color: "red", margin: '5%', fontSize: '1rem' }}>Are you sure, you want to delete this View?</h5>
                                <div></div>
                                <Row md={10} style={{ float: "right" }}>
                                    <Col md={5} ><Button label="Cancel" onClick={() => this.setState({ deleteViewDialogVisible: false })} className="p-button-text" style={{ backgroundColor: "#f50057", color: "white" }} /></Col>
                                    <Col md={2}><Button label="Confirm" onClick={() => this.deleteCurrentView()} className="p-button-text" style={{ backgroundColor: 'green', color: "white" }} /></Col>
                                </Row>
                            </div>
                        </Dialog>
                    </div>
                </div >
            </div>
        );
    }
}
