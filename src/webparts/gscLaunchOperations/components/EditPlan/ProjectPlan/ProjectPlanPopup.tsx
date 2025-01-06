import * as React from 'react';
import { Row, Col } from 'reactstrap';
//import { FieldControls } from '../../../../../utils/FieldControls';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IProjectPlanPopupProps, IProjectPlanPopupPropsState } from './IProjectPlanPopupProps';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import * as _ from 'lodash';
import { Toast } from 'primereact/toast';
import { PlanFieldControls } from './PlanFieldControls';
//import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import 'devextreme-react/text-area';
import 'devextreme/dist/css/dx.light.css';
import './ProjectPlan.css';

import deleteIcon from '../../../../../../src/webparts/assets/images/delete.png';
import { Checkbox } from 'primereact/checkbox';
import { DataService } from '../../Shared/DataService';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';

export const useHideSelectOptionsOnScroll = () => {
    const containers = document.querySelectorAll('.p-sidebar-content, .p-dialog-content');

    React.useEffect(() => {
        const scrollEventHandler = () => {
            const dropdownOptions = document.querySelectorAll('.p-dropdown-panel,.p-multiselect-panel');
            // Hack: Casting activeElement as 'any' in order to use 'blur', which is otherwise not allowed
            // and requires jumping through myriad hoops
            const activeElement = document.activeElement as any;
            activeElement?.blur();
            // Only one set of options will be open at a time
            dropdownOptions[0] && dropdownOptions[0].classList.add('hidden');
        };

        // NOTE: setTimeout is used because for some reason, Prime components can't be found with document.querySelector
        // until some time elapses, even though they're immediately visible
        setTimeout(() => {
            window.addEventListener('scroll', scrollEventHandler);
            containers.forEach(x => x.addEventListener('scroll', scrollEventHandler));
        }, 500);
    }, [containers]);
};

export const ProjectPlanPopupWrapper = (props) => {
    useHideSelectOptionsOnScroll();
    return <ProjectPlanPopup {...props} />
}

export class ProjectPlanPopup extends React.Component<IProjectPlanPopupProps, IProjectPlanPopupPropsState>
{
    public toast: Toast;
    public lrvfRefHist: any = React.createRef();
    public constructor(props: IProjectPlanPopupProps, public state: IProjectPlanPopupPropsState) {
        super(props);
        this.state = {
            planFieldsData: this.props.planFieldsData,
            planPopupOpen: false,//this.props.planPopupOpen,
            PlanGridData: this.props.PlanGridData,
            Action: this.props.Action,
            lstWaveType: this.props.planFieldsData?.WaveType,
            lstPackWaveType: this.props.planFieldsData?.PackWaveType,
            planfieldValues: this.props.planfieldValues,
            ProjectPlanPopupGrid: this.props.ProjectPlanPopupGrid,
            newPlanRecords: [],
            lstProjectNameSuffix: [],
            lstDefaultWave: this.props.lstDefaultWave,
            showMarket: false,
            countryLst: [],
            marketLst: [],
            regionLst: [],
            Countries: [],
            Markets: [],
            Region: [],
            addLabelFlag: false,
            labelNameRaw: '',
            //newLabelName:{},
            newLabelArry: this.props.newLabelArry,
            allNewPlanRecords: [],
            systemMsg: '',
            showSystemMsg: false,
            lstAllCountry: this.props.planFieldsData?.Country,
            lstMarketNew: this.props.planFieldsData?.Market,
            lstRegion: this.props.planFieldsData?.Region,
            lstMarket: this.props.planFieldsData?.Market,
            lstCountry: this.props.planFieldsData?.Country,
            defMarket: [],
            RecordsToDelete: [],
            IsDelete: false,
            isLoading: false,
            DRdetails: this.props.DRdetails,
        }
        this.handlePlanDataFieldChange = this.handlePlanDataFieldChange.bind(this);
        console.log('Data Repository data:', this.props.DRdetails);
    }

    public LABEL_NAME: any = '';
    public PREFIX: any = '';
    public SUFFIX: any = '';

    public componentDidMount = async () => {
        console.log('Project Plan componentDidMount');
        //get default wave mapping list
        //await this.getDefaultWaveMappingList();

        let waveTypeVal = this.state.planfieldValues['WaveType'] ? this.state.planfieldValues['WaveType'].toLowerCase() : this.state.planfieldValues['WaveType'];
        let wtVal = this.state.planFieldsData['WaveType'].filter(a => a.key.toLowerCase() == waveTypeVal);
        await this.setDefaultWaveCountry(wtVal[0]);

        //update country/region dropdown data.
        await this.updateLstMarkets();
        let ProjectNameSuffix = [
            { key: 'GLO', name: '-PGS-GLO' },
            { key: 'GLOFINISHEDPACK', name: '-PGS-GLOFPKG' },
            { key: 'FINISHEDPACK', name: '-PGS-FPKG' },
            { key: 'SHAREDPACK', name: '-PGS-SPKG' },
            { key: 'NPLO', name: '-PGS-NPLO' }
        ];
        let countryDropdownData = await this.setCountryLst("Country");

        this.setState(prevState => ({
            // planfieldValues: {
            //     ...prevState.planfieldValues,
            // },
            lstProjectNameSuffix: ProjectNameSuffix,
            planFieldsData: {
                ...prevState.planFieldsData,
                ["Country"]: countryDropdownData
            },
            planPopupOpen: true
        }));
    }

    async handleOnChange(fieldName: string, fieldValue: any): Promise<void> {


    }

    async handlePlanDataFieldChange(fieldName: string, fieldValue: any): Promise<void> {
        //Templates
        if (fieldName == "Template" && (fieldValue != null && fieldValue == 'SHAREDPACK' || fieldValue == 'FINISHEDPACK' || fieldValue == 'GLOFINISHEDPACK')) {
            //clear selected field values on template change   
            let planfieldVal = this.state.planfieldValues;
            let newPlans = [...this.state.newPlanRecords];
            let plnFieldVal = this.state.planfieldValues;
            if (planfieldVal != null) {
                let removepln = newPlans.filter(a => a.Template == plnFieldVal.Template && a.Country.display == plnFieldVal.Country[0].display);
                console.log("removepln", removepln);

                if (removepln.length > 0) {
                    let indx = newPlans.indexOf(removepln[0]);
                    newPlans.splice(indx, 1);
                }

                // this.setState(prevState => ({
                //     planfieldValues: {
                //         ...prevState.planfieldValues,
                //         ['Country']: [],
                //         ['Market']: [],
                //         ['Region']: [],
                //         ['LabelNames']: null,
                //         ['ParentPlans']: null,
                //         ['LabelName']: null,
                //         ['WaveType']: null,
                //         planLabel: [],
                //         PlanProjectName: ''
                //     },
                //     newPlanRecords: newPlans
                // }));
            }

            //set wave type and parent plan for child plan templates
            let waveTypeVal = this.state.lstPackWaveType ? this.state.lstPackWaveType[0] : null;
            let parentPlanData = this.getParentPlanValues(waveTypeVal?.value, fieldValue);
            console.log("parentPlanData", parentPlanData);
            this.setState(prevState => ({
                planFieldsData: {
                    ...prevState.planFieldsData,
                    //[fieldName]: fieldValue,
                    ['ParentPlans']: parentPlanData,
                    ['WaveType']: this.state.lstPackWaveType
                },
                planfieldValues: {
                    ...prevState.planfieldValues,
                    [fieldName]: fieldValue,
                    ['WaveType']: waveTypeVal.value ? waveTypeVal.value : waveTypeVal,
                    //clear other field selection
                    ['Country']: [],
                    ['Market']: [],
                    ['Region']: [],
                    ['LabelNames']: null,
                    ['ParentPlans']: null,
                    ['LabelName']: '',
                    planLabel: [],
                    PlanProjectName: ''
                },
                //clear plan selections
                newPlanRecords: newPlans,
                Region: [],
                Markets: [],
            }), () => {
                this.updateLstMarkets();
            });
        }
        else if (fieldName == "Template" && (fieldValue != null && fieldValue == 'GLO' || fieldValue == 'NPLO')) {
            let waveTypeVal = this.state.lstWaveType ? this.state.lstWaveType[0] : null;
            // this.state.planFieldsData['WaveType'] ? this.state.planFieldsData['WaveType'][0] : null;
            //clear selected field values on template change   
            let planfieldVal = this.state.planfieldValues;
            let newPlans = [...this.state.newPlanRecords];
            let plnFieldVal = this.state.planfieldValues;
            if (planfieldVal != null) {
                let removepln = newPlans.filter(a => a.Template == plnFieldVal.Template && a.Country.display == plnFieldVal.Country[0].display);
                console.log("removepln", removepln);

                if (removepln.length > 0) {
                    let indx = newPlans.indexOf(removepln[0]);
                    newPlans.splice(indx, 1);
                }
            }
            this.setState(prevState => ({
                planFieldsData: {
                    ...prevState.planFieldsData,
                    //[fieldName]: ,
                    ['WaveType']: this.state.lstWaveType
                },
                planfieldValues: {
                    ...prevState.planfieldValues,
                    [fieldName]: fieldValue,
                    ['WaveType']: waveTypeVal.value ? waveTypeVal.value : waveTypeVal,
                    //clear other field selection
                    ['Country']: [],
                    ['Market']: [],
                    ['Region']: [],
                    ['LabelNames']: null,
                    ['ParentPlans']: null,
                    ['LabelName']: '',
                    planLabel: [],
                    PlanProjectName: ''
                },
                //clear plan selections
                newPlanRecords: newPlans,
                Region: [],
                Markets: [],
            }), () => {
                this.updateLstMarkets();
            });
        }
        //on country selection get region/market data for selected country
        if (fieldName == "Country") {

            await this.updateLstMarkets();
            //set market Region values for selected country
            await this.setRegionMarketCountry(fieldValue, 'Country', 0);

            this.setState(prevState => ({
                planfieldValues: {
                    ...prevState.planfieldValues,
                    [fieldName]: fieldValue
                }
            }));
        }
        //WaveType
        if (fieldName == "WaveType") {
            //check if existing plan have same wave values
            let planGridData = this.state.PlanGridData;
            if (planGridData.filter(a => a.WaveType == fieldValue).length > 0) {
                let WTVal = this.state.planFieldsData['WaveType'].filter(a => a.value == fieldValue);
                this.setDefaultWaveCountry(WTVal[0]);
                this.setSubPlanDetails(WTVal, 'WaveType');
            }
            this.setState(prevState => ({
                planfieldValues: {
                    ...prevState.planfieldValues,
                    [fieldName]: fieldValue
                }
            }));
        }
        ///LabelNames

        if (fieldName == "LabelNames") {
            let planFieldsData = this.state.planFieldsData;
            let planLabel = planFieldsData ? (planFieldsData['LabelNames']?.filter(a => a.value == fieldValue)) : '';

            this.setState(prevState => ({
                planfieldValues: {
                    ...prevState.planfieldValues,
                    [fieldName]: fieldValue,
                    ['LabelName']: fieldValue ? (fieldValue.split('$').length > 0 ? fieldValue.split('$')[0] : fieldValue) : fieldValue,
                    planLabel: planLabel
                }
            }));
        }

        //set parent values based on selected template
        if (fieldName == 'ParentPlans') {
            let planFieldVal = this.state.planfieldValues;
            let allPlansData = [...this.state.PlanGridData, ...this.state.ProjectPlanPopupGrid];
            let parentWaveType = ''; let parentLabelNames = '';
            let parentPlanLabel = null; let parentLabelName = ''; let parentPackSize = '';
            let planFieldsData = this.state.planFieldsData;
            //let planLabel = planFieldsData ? (planFieldsData['LabelNames']?.filter(a=>a.value == fieldValue)) : '';
            // on parent plan selection for sharedpack get its parents plan values- wave type,label name, pack size
            if (this.state.Action == 'New') {
                if (planFieldVal.Template == 'SHAREDPACK') {
                    let parentDt = allPlansData.filter(a => a.ProjectName == fieldValue);
                    if (parentDt.length > 0) {
                        if (parentDt[0].PlanStatus == "Draft") { // befire plan creation
                            parentWaveType = parentDt[0].WaveType;
                            if (planFieldVal.LabelName == '' || planFieldVal.LabelName == null) {
                                parentPlanLabel = planFieldsData ? (planFieldsData['LabelNames']?.filter(a => a.key == parentDt[0].LabelName)) : '';
                                parentLabelNames = parentPlanLabel[0].value;//  //parentDt[0].LabelNames;
                                parentLabelName = parentPlanLabel[0].value ? (parentPlanLabel[0].value.split('$').length > 0 ? parentPlanLabel[0].value.split('$')[0] : parentPlanLabel[0].value) : parentPlanLabel[0].value;
                                //parentDt[0].LabelName;
                            }
                        }
                        else if (parentDt[0].PlanStatus != "" && parentDt[0].PlanStatus != "Draft") { // after plan creation
                            parentWaveType = parentDt[0].WaveType;
                            parentPlanLabel = planFieldsData ? (planFieldsData['LabelNames']?.filter(a => a.key == parentDt[0].LabelName)) : '';
                            parentLabelNames = parentDt[0].LabelName ? parentDt[0].LabelName.indexOf('->') >= 0 ? parentDt[0].LabelName.split('->')[1] : parentDt[0].LabelName : '';
                            parentLabelName = parentDt[0].LabelText.split('$').length > 0 ? parentDt[0].LabelText.split('$')[0] : parentDt[0].LabelText;
                        }
                    }
                    let parentPlans = this.state.planFieldsData['ParentPlans'].length > 0 ? this.state.planFieldsData['ParentPlans'].filter(a => a.value == fieldValue)[0] : null;

                    if (planFieldVal.LabelName == '' || planFieldVal.LabelName == null) {

                        this.setState(prevState => ({
                            planfieldValues: {
                                ...prevState.planfieldValues,
                                ['ParentPlans']: fieldValue,
                                ['parent']: fieldValue,
                                ['ParentID']: parentPlans?.ParentID,
                                ['ParentMarket']: parentPlans?.ParentMarket,
                                ['WaveType']: parentWaveType != '' ? parentWaveType : planFieldVal.WaveType,
                                planLabel: parentPlanLabel,
                                ['LabelNames']: parentLabelNames,
                                ['LabelName']: parentLabelName,
                                ['PackSize']: parentPackSize
                            }
                        }));

                    } else {


                        this.setState(prevState => ({
                            planfieldValues: {
                                ...prevState.planfieldValues,
                                ['ParentPlans']: fieldValue,
                                ['parent']: fieldValue,
                                ['ParentID']: parentPlans?.ParentID,
                                ['ParentMarket']: parentPlans?.ParentMarket,
                                ['WaveType']: parentWaveType != '' ? parentWaveType : planFieldVal.WaveType,
                                ['PackSize']: parentPackSize
                            }
                        }));

                    }
                }
                else {
                    let parentPlans = this.state.planFieldsData['ParentPlans'].length > 0 ? this.state.planFieldsData['ParentPlans'].filter(a => a.value == fieldValue)[0] : null;
                    this.setState(prevState => ({
                        planfieldValues: {
                            ...prevState.planfieldValues,
                            ['ParentPlans']: fieldValue,
                            ['parent']: fieldValue,
                            ['ParentID']: parentPlans?.ParentID,
                            ['ParentMarket']: parentPlans?.ParentMarket,
                            // ['WaveType'] : parentWaveType != '' ? parentWaveType : planFieldVal.WaveType,
                            // planLabel : parentPlanLabel,
                            // ['LabelName'] : parentLabelName,
                            // ['LabelVal'] : parentLabelVal,
                            // ['PackSize'] : parentPackSize
                        }
                    }));
                }
            }
            else if (this.state.Action == 'Edit') {
                let parentPlans = this.state.planFieldsData['ParentPlans'].length > 0 ? this.state.planFieldsData['ParentPlans'].filter(a => a.value == fieldValue)[0] : null;
                this.setState(prevState => ({
                    planfieldValues: {
                        ...prevState.planfieldValues,
                        ['ParentPlans']: fieldValue,
                        ['parent']: fieldValue,
                        ['ParentID']: parentPlans?.ParentID,
                        ['ParentMarket']: parentPlans?.ParentMarket,
                        // ['WaveType'] : parentWaveType != '' ? parentWaveType : planFieldVal.WaveType,
                        // planLabel : parentPlanLabel,
                        // ['LabelName'] : parentLabelName,
                        // ['LabelVal'] : parentLabelVal,
                        // ['PackSize'] : parentPackSize
                    }
                }));
            }
        }
        //set projectName
        if (fieldName == "PlanProjectName") {
            this.setState(prevState => ({
                planfieldValues: {
                    ...prevState.planfieldValues,
                    PlanProjectName: fieldValue
                }
            }));
        }

        //set DeepDive val
        if (fieldName == "DeepDive") {
            let popupGridData = [...this.state.ProjectPlanPopupGrid];
            if (popupGridData.length > 0) {
                popupGridData.map((dt) => {
                    dt.DeepDive = fieldValue
                });
            }
            this.setState(prevState => ({
                planfieldValues: {
                    ...prevState.planfieldValues,
                    DeepDive: fieldValue
                },
                ProjectPlanPopupGrid: popupGridData
            }));
        }
    }

    setRegionMarketCountry = async (val: any, type: string, flag) => {
        let countries = this.state.planfieldValues['Country'] ? this.state.planfieldValues['Country'] : [];
        const newChecked = [...(type === 'Region' ? this.state.Region : type === 'Market' ? this.state.Markets : countries)];
        let region = this.state.Region;
        let markets = this.state.Markets
        let lstMarkets = this.state.planFieldsData['Market'];
        let lstRegion = this.state.planFieldsData['Region'];

        if (val && val.length > newChecked.length) {
            let newlyAdded = flag === 1 ? val : [val[val.length - 1]];
            if (type === 'Region') {
            }
            else if (type === 'Market') {
            }
            else {
                console.log("newlyAdded", newlyAdded);

                //
                //create different plan record for each selected country
                let newPlnData = this.state.newPlanRecords;
                let planfieldVal = this.state.planfieldValues;
                let newPlanRecs = [];
                //get market,region for selected country
                newlyAdded.map((nw) => {
                    let marketVal = null;
                    let regionVal = null;
                    console.log("countryval", nw);
                    lstMarkets.filter(m => m.key === nw.parent).map((ma) => {
                        marketVal = ma;
                        console.log("marketval", marketVal);
                        if (markets.indexOf(ma) === -1) markets.push(ma);
                        if (region.indexOf(ma.parent) === -1) {
                            regionVal = lstRegion.filter(x => x.key === ma.parent)[0];
                            region.push(regionVal);
                            //region.push(lstRegion.filter(x => x.key === ma.parent)[0]);
                        }
                    });

                    newPlanRecs.push({
                        DRID: planfieldVal?.DRID,
                        Template: planfieldVal?.Template,
                        WaveType: planfieldVal?.WaveType,
                        ProjectPrefix: planfieldVal?.ProjectPrefix,
                        PlanProjectName: planfieldVal?.PlanProjectName,
                        RecordType: 'N',
                        Country: nw,
                        Market: marketVal,
                        Region: regionVal
                    });
                    console.log("newPlanRec", newPlanRecs);
                });

                let regionDt = _.unionBy(region, 'id');
                newPlnData = newPlnData.length > 0 ? [...newPlnData, ...newPlanRecs] : newPlanRecs;

                this.setState(prevState => ({
                    planfieldValues: {
                        ...prevState.planfieldValues,
                        ['Region']: regionDt,
                        ['Market']: markets
                    },

                    Region: regionDt,
                    Markets: markets,
                    //Countries : val,
                    newPlanRecords: newPlnData

                }));
            }
        }
        else {
            let unchecked = newChecked.filter(item => val.indexOf(item) < 0);
            console.log('unchecked', unchecked);
            if (unchecked.length > 0) {
                // this.clearPlanSelection();
            }
            //let newPlnData = this.state.newPlanRecords;
            if (type === 'Region') {
                if (unchecked.length > 0) {

                }
            }
            else if (type === 'Market') {
                // markets = [...val];
            }
            else { //Country
                let newPlnData = [...this.state.newPlanRecords];
                //set selected countries
                let selectedCountry = newChecked.filter(item => val.indexOf(item) >= 0);//[...val];
                //remove plan for unselected country
                newPlnData = newPlnData.filter(a => a.Country.display != unchecked[0].display);

                //if the market associated with the unchecked country is parent of any other country 
                //- keep market checked - else uncheck market 
                let mappedCountries = val.filter(c => c.parent === unchecked[0].parent);
                if (mappedCountries.length == 0) {
                    await lstMarkets.filter(x => x.key === unchecked[0].parent).map(async (ma) => {
                        const currentIndexM = markets.indexOf(ma);
                        let _selectedMarket = markets[currentIndexM];
                        let parentVal = _selectedMarket.parent;
                        let marketVal = markets.filter(s => s.parent === parentVal);
                        if (marketVal.length <= 1) {
                            if (_selectedMarket != null) {
                                let deleteItem = region.filter(c => c.key === _selectedMarket.parent);
                                const currentIndexR = region.indexOf(deleteItem[0]);
                                //clear region value
                                region.splice(currentIndexR, 1);
                            }
                        }
                        //clear market value
                        markets.splice(currentIndexM, 1);
                    });
                    let regionDt = _.uniqBy(region, 'id');
                    this.setState(prevState => ({
                        planfieldValues: {
                            ...prevState.planfieldValues,
                            ['Region']: regionDt,
                            ['Market']: markets,
                            ['Country']: selectedCountry
                        },
                        Region: regionDt,
                        Markets: markets,
                        newPlanRecords: newPlnData
                    }));

                }
            }
        }

    }
    getParentPlanValues = (wt: string, templatesVal: string) => {
        //let gridData = props.data.filter(x => x.PlanStatus !== 'ERROR');
        let planGridData = this.state.PlanGridData;
        let PlanPopupGrid = this.state.ProjectPlanPopupGrid;
        let parentData = [];
        let finalData = [];
        let filteredGridData;
        let filteredPopupData;

        filteredGridData = planGridData;
        filteredPopupData = PlanPopupGrid; //

        filteredGridData.map(e => {
            let val = {
                ...e,
                ParentID: e.id
            }
            parentData.push(val);
        });

        let projectPrefix = this.state.planfieldValues.ProjectPrefix;
        let indx = parentData.length + 1;
        filteredPopupData.map((i, index) => {
            let prjtNmSuffix = this.state.lstProjectNameSuffix.filter(a => a.key == i.Template);
            let _projectPrefixVal = i.PlanProjectName != '' ? projectPrefix + '-' + i.PlanProjectName : projectPrefix;

            let PName = ''
            if (DataService.environment === 'DEV') {
                PName = (i.LabelVal.split('$')[0]) + '-' + _projectPrefixVal + '-' + (i.Country != '' ? i.Country : i.Market) + "-DEMO" + prjtNmSuffix[0].name;
                // PName = (labelNamVal) + '-' + _projectPrefixVal + '-' + (e.Country !== '' ? e.Country?.display : e.Market?.display) + (planfieldsValues.Template === 'PACKAGING' ? '-PKG' : '') + "-DEMO" + prjtNmSuffix[0].name; // - DEMO only for DEV 
            } else {
                PName = (i.LabelVal.split('$')[0]) + '-' + _projectPrefixVal + '-' + (i.Country != '' ? i.Country : i.Market) + prjtNmSuffix[0].name;
                // PName = (labelNamVal) + '-' + _projectPrefixVal + '-' + (e.Country !== '' ? e.Country?.display : e.Market?.display) + (planfieldsValues.Template === 'PACKAGING' ? '-PKG' : '') + prjtNmSuffix[0].name; // - DEMO only for DEV 
            }
            let ProjectNameVal = this.getProjectPlanName(PName);
            parentData.push({
                ParentID: indx,
                Country: i.Country,
                CountryCode: i.CountryCode ? i.CountryCode : '',
                Market: i.Market,
                Parent: i.Parent,
                Template: i.Template,
                WaveType: i.WaveType,
                ProjectName: ProjectNameVal,
                PackSize: i.PackSize
            });
        });
        console.log('data', parentData);

        //Filter ddata based on template
        if (templatesVal != null && templatesVal == "SHAREDPACK") {
            let filteredData = parentData.filter(x => x.Template == 'PGS_FG_Packaging' || x.Template == 'FINISHEDPACK'); //
            parentData = filteredData;
        }//GLOFINISHEDPACK
        else if (templatesVal != null && templatesVal == "GLOFINISHEDPACK") {
            let filteredData = parentData.filter(x => x.Template == "PGSGLO" || x.Template == "GLO");//GLO
            parentData = filteredData;
        }
        else {
            let filteredData = parentData.filter(x => x.Template == "PGSGLO" || x.Template == "GLO");//GLO
            parentData = filteredData;
        }

        let _parentData = parentData; //_.uniqBy(parentData, 'ProjectName');
        let __XX = _parentData;
        if (wt && wt == 'Wave 1') {
            __XX = _parentData.filter(w => w.WaveType === 'Wave 1');
        }
        if (wt && wt == 'Wave 2') {
            __XX = _parentData.filter(w => w.WaveType === 'Wave 1' || w.WaveType === 'Wave 2');
        }
        __XX.map((item) => {
            finalData.push({
                key: item.ProjectName,
                value: item.ProjectName,
                ParentID: item.ParentID,
                ParentMarket: item.Country
            });
        });
        return finalData;
    }
    //set ProjectName - replace sp.characters with _ in project plan name
    getProjectPlanName = (ProjectName) => {
        //let ProjectNameVal = ProjectName;
        if (ProjectName.indexOf('&') > 0) {
            ProjectName = ProjectName.replaceAll('&', '_');
        }
        if (ProjectName.indexOf('.') > 0) {
            ProjectName = ProjectName.replaceAll('.', '_');
        }
        if (ProjectName.indexOf(',') > 0) {
            ProjectName = ProjectName.replaceAll(',', '_')
        }
        return ProjectName;
    }

    setDefaultWaveCountry = (waveType) => {
        // alert(WaveType);
        let lstDefaultWave = this.state.lstDefaultWave;
        console.log(waveType);
        if (lstDefaultWave.length == 0) {
            ///this.getDefaultWaveMappingList();
        }
        ///Defaulted to Wave 1
        let defWave = waveType !== null ? waveType.value : this.state.lstWaveType[0].value;
        ///set to defaullt Template GLO
        let defItems = lstDefaultWave.filter(e => e.wave === defWave);
        this.setState({
            defMarket: defItems
        });
        //setDefMarket(defItems);
    }

    //Added for getting the default wave-region-market-country mapping
    // let WaveMappingUrl = props.createdrprops.siteUrl + `/_api/web/lists/GetByTitle('ProjectPlanConfiguration')/Items?$select=*&$orderby=Region%20asc,Market%20asc,Country%20asc&$filter=IsActive%20eq%201&$top=4999`;
    getDefaultWaveMappingList = async () => {
        try {
            const fetchWaveTypeValues = DataService.fetchAllItemsGenericFilter('ProjectPlanConfiguration', '*', 'IsActive eq 1')
            Promise.all([fetchWaveTypeValues]).then((responses) => {
                console.log('Wave type :', responses);

                // .then(item => {
                console.log('wave-region-market-country mapping', responses[0]);
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
        catch (error) {
            console.log("Error", error);
        }
    }

    setSubPlanDetails = (newValue, fieldName) => {
        //     let EditRecordID = props.RecordID;
        //     if(fieldName == 'ParentPlan'){
        //         let dlppDt =  props.data.length > 0 ? props.data.filter(a=>a.ProjectName == newValue.name) : [...planPreview, ...selectedPlanTotal];
        //         let parentID = dlppDt.length > 0 ? dlppDt[0].id : 0;
        //         //setParentID(parentID);
        //         //GLOFINISHEDPACK
        //         if(templates != null && templates.key == 'GLOFINISHEDPACK'){
        //             //let dt = selectedPlanRecords;
        //             let selectedData = [...planPreview, ...selectedPlanTotal] //popupGridData
        //             let PopupGridData = [];
        //             selectedData.map((dt)=>{
        //                 let _projectPrefixVal = dt.PlanProjectName != '' ?  projectPrefix + '-' + dt.PlanProjectName : projectPrefix;
        //                 let ProjectName = (dt.LabelVal.split('$')[0]) + '-' + _projectPrefixVal + '-' + (dt.Country != '' ? dt.Country : dt.Market) + "-DEMO";
        //                 if(ProjectName == newValue.name){
        //                     PopupGridData.push(dt);
        //                 }
        //             });
        //             let _dt = props.data.length > 0 ? props.data.filter(a=>a.ProjectName == newValue.name) : [];
        //             let popupDt = _.uniqBy([...planPreview, ...selectedPlanTotal], function (a) { return [a['Country'], a['Market'], a['Parent'], a['Template'], a['WaveType']].join(); });
        //             popupDt = popupDt.length > 0 ? popupDt.filter(a=>a.Country == newValue.ParentMarket) : [];
        //             let _data = [..._dt, ...popupDt];
        //             let res = _data.length > 0 ?_data :  PopupGridData;

        //             //let temp = lstTemplates.filter(a=>a.key == res[0].Template);
        //             let temp = res.length > 0 ? lstTemplates.filter(a=>a.key == res[0].Template) : templates.key;
        //             //setTemplates(res[0]);

        //             if(!props.isEditPlan){ // update finished Pack Size from GLO plan on add-FP
        //                 let packSizeVal = res.length > 0 ? res[0].PackSize : '';
        //                 setPackSize(packSizeVal);
        //             }

        //             setParent(newValue);
        //         }
        //         //.GFp
        //         if(templates != null && templates.key == 'FINISHEDPACK'){
        //             //let dt = selectedPlanRecords;
        //             let selectedData = [...planPreview, ...selectedPlanTotal] //popupGridData
        //             let PopupGridData = [];
        //             selectedData.map((dt)=>{
        //                 let _projectPrefixVal = dt.PlanProjectName != '' ?  projectPrefix + '-' + dt.PlanProjectName : projectPrefix;
        //                 let ProjectName = (dt.LabelVal.split('$')[0]) + '-' + _projectPrefixVal + '-' + (dt.Country != '' ? dt.Country : dt.Market) + "-DEMO";
        //                 let nameVal = (ProjectName.indexOf('&') > 0 ||  ProjectName.indexOf('.')  > 0 ||  ProjectName.indexOf(',') > 0);

        //                 if(ProjectName == newValue.name){
        //                     PopupGridData.push(dt);
        //                 }
        //             });
        //             let _dt = props.data.length > 0 ? props.data.filter(a=>a.ProjectName == newValue.name) : [];
        //             let popupDt = _.uniqBy([...planPreview, ...selectedPlanTotal], function (a) { return [a['Country'], a['Market'], a['Parent'], a['Template'], a['WaveType']].join(); });
        //             popupDt = popupDt.length > 0 ? popupDt.filter(a=>a.Country == newValue.ParentMarket) : [];
        //             let _data = [..._dt, ...popupDt];
        //             let res = _data.length > 0 ?_data :  PopupGridData;
        //             //let temp = lstTemplates.filter(a=>a.key == res[0].Template);
        //               let temp = res.length > 0 ? lstTemplates.filter(a=>a.key == res[0].Template) : templates.key;
        //             //setTemplates(res[0]);

        //             if(!props.isEditPlan){ // update finished Pack Size from GLO plan on add-FP
        //                 let packSizeVal = res.length > 0 ? res[0].PackSize : '';
        //                 setPackSize(packSizeVal);
        //                 //setPackSize(res[0].PackSize);
        //             }

        //             setParent(newValue);
        //         }
        //         if(templates != null && templates.key == 'SHAREDPACK'){
        //             //
        //             let selectedData = [...planPreview, ...selectedPlanTotal] //popupGridData
        //             let PopupGridData = [];
        //             selectedData.map((dt)=>{
        //                 let _projectPrefixVal = dt.PlanProjectName != '' ?  projectPrefix + '-' + dt.PlanProjectName : projectPrefix;
        //                 let ProjectName = (dt.LabelVal.split('$')[0]) + '-' + _projectPrefixVal + '-' + (dt.Country != '' ? dt.Country : dt.Market) + "-DEMO";
        //                 if(ProjectName == newValue.name){
        //                     PopupGridData.push(dt);
        //                 }
        //             });
        //             let _dt = props.data.length > 0 ? props.data.filter(a=>a.ProjectName == newValue.name) : [];
        //             let popupDt = _.uniqBy([...planPreview, ...selectedPlanTotal], function (a) { return [a['Country'], a['Market'], a['Parent'], a['Template'], a['WaveType']].join(); });
        //             popupDt = popupDt.length > 0 ? popupDt.filter(a=>a.Country == newValue.ParentMarket) : [];
        //             let _data = [..._dt, ...popupDt];
        //             let res = _data.length > 0 ?_data :  PopupGridData;
        //             //let temp = lstTemplates.filter(a=>a.key == res[0].Template);
        //             let temp = res.length > 0 ? lstTemplates.filter(a=>a.key == res[0].Template) : templates.key;
        //             //setTemplates(res[0]);

        //             let country =  res[0].cCountry;
        //             let market = res[0].cMarket;
        //             let region = res[0].cRegion;

        //             let countries = props.lstCountry.filter(a=>a.title == country);
        //             let Markets = props.lstMarketNew.filter(a=>a.title == market);
        //             let regions = props.lstRegion.filter(a=>a.title == region);

        //             //  setCountries(countries);
        //             //  setMarkets(Markets);
        //             //  setRegion(regions);

        //             //  setRegionList(regions);
        //             //  setCountryList(countries);
        //             //  setLstMarket(Markets);

        //             //setParent(res[0].Parent);
        //             //setPlanProjectName(res[0].PlanProjectName);

        //             if(!props.isEditPlan){ // update SharedPack Pack Size from FP-Pack Size on add-SP
        //                 let packSizeVal = res.length > 0 ? res[0].PackSize : '';
        //                 setPackSize(packSizeVal);
        //                 //setPackSize(res[0].PackSize);
        //             }

        //             if(res[0].PlanStatus == '' || res[0].PlanStatus == 'Draft'){ // Before plan creation
        //                 if(lstLabels.length > 0){
        //                     let planLabelVal = lstLabels.filter(a=>a.key == res[0].Label.key);
        //                     setPlanLabel(planLabelVal[0]);
        //                 }
        //                 else{
        //                     let planLabelVal = (res[0].Label != null && res[0].Label != '') ? res[0].Label : '';
        //                     setPlanLabel(planLabelVal);
        //                 }
        //             }
        //             else{ // After Plan creation
        //                 // let planLabelVal = lstLabels.filter(a=>a.value == res[0].LabelVal)
        //                 // setPlanLabel(planLabelVal[0]);

        //                 //

        //                   if(lstLabels.length > 0){
        //                     let planLabelVal = lstLabels.filter(a=>a.value == res[0].LabelVal);
        //                     if(planLabelVal.length > 0){
        //                         setPlanLabel(planLabelVal[0]);
        //                     }
        //                 }
        //                 else{
        //                     let planLabelVal = (res[0].LabelVal != null && res[0].LabelVal != '') ? res[0].LabelVal : '';
        //                     setPlanLabel(planLabelVal);
        //                 }
        //             }


        //             setParent(newValue);
        //             //get wave type
        //             if(temp[0].key == "SHAREDPACK" || temp[0].key == "FINISHEDPACK" ||  temp[0].key == "GLOFINISHEDPACK"){
        //             let waveTypeVal = lstPackWaveType.filter(a=>a.key == res[0].WaveType);
        //             setWaveType(waveTypeVal[0]);
        //             ///setDefaultWaveCountry(waveTypeVal[0]);
        //             getParentValues(lstAllMarkets, waveTypeVal, templates);
        //             //setIsPackSize(true);

        //             }
        //             else{
        //                 let waveTypeVal =lstWaveType.filter(a=>a.key == res[0].WaveType);
        //                 setWaveType(waveTypeVal[0]);
        //                 //setDefaultWaveCountry(waveTypeVal[0]);
        //                 //getParentValues(lstAllMarkets, waveTypeVal, temp[0]);
        //             }
        //         }
        // }
        // //
        // if(fieldName == 'WaveType'){
        //     //
        //     if(templates != null && templates.key == 'FINISHEDPACK'){
        //         //if Parent- Finished plan change Wave type change its sub sharedpack deatils.

        //         let res = props.data.filter(a=>a.id == EditRecordID);
        //         let ProjectNameVal = res.length > 0 ? res[0].ProjectName : '';

        //     }
        // }
    }

    updateLstMarkets = async () => {
        let planfieldValues = this.state.planfieldValues;
        let templates = planfieldValues ? planfieldValues['Template'] : '';
        if (this.state.Action == 'New') {
            //else{

            //     //await (setRegionList(props.lstRegion)); //checkl
            if (templates != null) {
                if (templates !== 'NPLO') {

                    //             //remove already selected country based on templates -R6-PP
                    let _popupGridData = this.state.ProjectPlanPopupGrid.filter(a => a.Template != 'NPLO');
                    let _planGridData = this.props.PlanGridData.filter(a => a.Template != 'NPLO');
                    let _data = [..._popupGridData, ..._planGridData]; //.filter(x => x.Templates != 'NPLO');
                    let filteredDT = _data.filter(a => a.Template == templates); //RCtry
                    //             //.let country = props.lstCountry.filter(x => !_data.some(c => c.Country === x.display));
                    let country = this.state.lstAllCountry.filter(x => !filteredDT.some(c => c.Country === x.display));
                    //             //.country = country.filter(m => !props.data.some(r => r.Country === m.display)); //&& (r.Template === templates || r.Template === templates.name)
                    country = country.filter(m => !filteredDT.some(r => r.Country === m.display));


                    //             //get Markets 
                    //             //1. filter the Default markets from the list
                    let defMarkets = this.state.lstMarket.filter(x => this.state.defMarket.some(r => r.market === x.key && x.type === 'Market'));
                    //             //2. Remove defMarkets from the master list
                    let removeDefMarket = this.state.lstMarket.filter(x => !this.state.defMarket.some(r => r.market === x.key && x.type === 'Market')).filter(m => !this.state.Markets.some(r => r.id === m.id));
                    //             //3. push the defmarkets to front then selecter markets,then rest,
                    let market = [...defMarkets, ...removeDefMarket];//.filter(x => !Markets.some(r => r.id === x.id))];
                    //             //  Markets.filter(m => !defMarkets.some(r => r.id === m.id))
                    //             //get already selected Markets only
                    let onlyMarket = [...this.state.ProjectPlanPopupGrid, ...this.props.PlanGridData].filter(r => r.Country === '');
                    //             //get the market which is not in the countries.
                    onlyMarket = onlyMarket.filter(x => !country.some(c => c.parent === x.MarketCode));

                    //             //remove country based on templates 
                    let marketlst = []; //markets to be removed from Market dropdown
                    //             //_data.map((item) => { //R6-RCT
                    filteredDT.map((item) => {
                        let marketcode = this.state.lstMarketNew.filter(m => m.display == item.Market);
                        //                 //let mappedCountries = props.lstCountry.filter(c => c.parent == marketcode[0].key); //total countries associated with that market
                        let mappedCountries = marketcode.length ? this.state.lstAllCountry.filter(c => c.parent == marketcode[0].key) : []; //total countries associated with that market
                        //^ kelkap changes - if marketcode is empty push all countries
                        //                 //let inGrid = _data.filter(m => m.Market == marketcode[0].display); //associated coutries already added to grid //R6-RCT
                        let inGrid = marketcode.length ? filteredDT.filter(m => m.Market == marketcode[0].display) : [];
                        if (mappedCountries.length == 1 && item.Country) { //if only 1 country is associated with that market
                            marketlst.push(item);
                        }
                        else if (inGrid.length > mappedCountries.length) { //if all associated countries and the market is added to the grid
                            marketlst.push(item);
                        }
                    });

                    market = this.state.lstMarketNew.filter(m => !marketlst.some(r => r.Market === m.display));

                    //             await setLstMarket(market);
                    //             await setCountryList(country);
                    //             await setCountryDDList(country); //R6-PP
                    this.setState(prevState => ({
                        planFieldsData: {
                            ...prevState.planFieldsData,
                            ['Country']: country,
                            ['Market']: market
                        },
                        lstMarket: market,
                        lstCountry: country
                    }));
                }
                else {
                    //             //select only configered markets
                    let defMarkets = this.state.lstMarketNew.filter(x => this.state.defMarket.some(r => r.market === x.key && x.type === 'Market' && r.template === templates));
                    //             await setLstMarket(defMarkets);
                    this.setState({ lstMarket: defMarkets });
                    let _popupGridData = this.state.ProjectPlanPopupGrid.filter(a => a.Template == 'NPLO');
                    let _planGridData = this.props.PlanGridData.filter(a => a.Template == 'NPLO');
                    let _data = [..._popupGridData, ..._planGridData];
                    //let _data = [...this.state.ProjectPlanPopupGrid, ...this.state.PlanGridData].filter(x => x.Template == 'NPLO');
                    if (_data.length == 0) {
                        if (await defMarkets.length > 0) {
                            console.log(defMarkets)
                            //                 //let country = props.lstCountry.filter(x => defMarkets.some(r => r.key === x.parent && x.type === 'Country'));
                            let country = this.state.lstAllCountry.filter(x => defMarkets.some(r => r.key === x.parent && x.type === 'Country'));
                            let region = this.state.lstRegion.filter(x => defMarkets.some(r => r.parent === x.key && x.type === 'Region'));
                            //                 await (setCountryList(country));
                            //                 await (setRegionList(region));
                            //                 //  clearSelection();
                            //                 await setCountryDDList(country); //R6-PP
                            this.setState(prevState => ({
                                planFieldsData: {
                                    ...prevState.planFieldsData,
                                    ['Country']: country,
                                    ['Region']: region
                                },
                                lstRegion: region,
                                lstCountry: country
                            }));
                        }
                    }
                    else {
                        //await setCountryList([]);
                        //await setCountryDDList([]);
                        this.setState(prevState => ({
                            planFieldsData: {
                                ...prevState.planFieldsData,
                                ['Country']: [],
                                ['Region']: []
                            },
                            lstCountry: [],
                            lstRegion: [],
                        }));
                    }
                }

            }
            else {

            }

        }
    }

    //
    showMarket = () => {
        let showMarketBtn = true;
        if (this.state.Action == 'New') {
            let PlanfieldValues = this.state.planfieldValues;
            if (PlanfieldValues != null) {
                if (PlanfieldValues["Template"] != null && PlanfieldValues["WaveType"] != null && PlanfieldValues["LabelName"]
                    && PlanfieldValues["Country"] != null) {
                    showMarketBtn = false;
                }
            }
        }
        else {

        }
        return showMarketBtn;
    }

    //Validates popup plan fields to create plan
    validatePlanFields = () => {
        let planfieldsValues = this.state.planfieldValues;
        console.log("planfieldsValues", planfieldsValues);
        if (planfieldsValues != null) {
            let templates = planfieldsValues ? planfieldsValues["Template"] : "";
            if (templates == 'FINISHEDPACK' || templates == 'SHAREDPACK' || templates == 'GLOFINISHEDPACK') {
                if (templates == 'FINISHEDPACK') {
                    if (planfieldsValues["parent"] == null) {
                        this.toast?.show({ severity: 'warn', summary: '', detail: 'Please create/select - GLO/NPLO parent plan to create finished pack plan', life: 2700 });
                        return;
                    }
                }
                if (templates == 'SHAREDPACK') {
                    if (planfieldsValues["parent"] == null) {
                        this.toast?.show({ severity: 'warn', summary: '', detail: 'Please create/select - Finished pack parent Plan to create shared pack plan', life: 2700 });
                        return;
                    }
                }
                if (templates == 'GLOFINISHEDPACK') {
                    if (planfieldsValues["parent"] == null) {
                        this.toast?.show({ severity: 'warn', summary: '', detail: 'Please create/select - GLO parent plan to create GLO Finished pack plan', life: 2700 });
                        return;
                    }
                }
                if (planfieldsValues?.LabelNames == undefined || planfieldsValues?.LabelNames == null || planfieldsValues?.LabelNames == '') {
                    this.toast?.show({ severity: 'warn', summary: '', detail: 'Please select mandatory fields - Template, Wave Type, Label/Trade Name, Country', life: 3000 });
                    return;
                }
                if (planfieldsValues?.Country == null || !planfieldsValues?.Country.length) {
                    this.toast?.show({ severity: 'warn', summary: '', detail: 'Please select mandatory fields - Template, Wave Type, Label/Trade Name, Country', life: 3000 });
                    return;
                }
            }
            //other values validation 
            //label, country
            if (planfieldsValues?.LabelNames == undefined || planfieldsValues?.LabelNames == null || planfieldsValues?.LabelNames == '') {
                this.toast?.show({ severity: 'warn', summary: '', detail: 'Please select mandatory fields - Template, Wave Type, Label/Trade Name, Country', life: 3000 });
                return;
            }
            if (planfieldsValues?.Country == null || !planfieldsValues?.Country.length) {
                this.toast?.show({ severity: 'warn', summary: '', detail: 'Please select mandatory fields - Template, Wave Type, Label/Trade Name, Country', life: 3000 });
                return;
            }
            this.createNewPlan();
        }
    }

    createNewPlan = async () => {
        this.setState({ isLoading: true });
        let PlanPopupGrid = this.state.ProjectPlanPopupGrid;
        console.log('PlanPopupGrid', PlanPopupGrid);
        this.lrvfRefHist != null && this.lrvfRefHist != undefined ?
            await this.lrvfRefHist.instance.saveEditData() : console.log();

        let planfieldsValues = this.state.planfieldValues;
        console.log("planfieldsValues", planfieldsValues);

        let newPlans = this.state.newPlanRecords;
        let count = 0;
        //add plans for all selected countries
        let allRecord = this.state.PlanGridData; //existing plans data
        let index = allRecord.length;
        let newPlansData = [];
        //let data = _.uniqBy([...newPlans], function (a) { return [a['Country'], a['Market'], a['Parent'], a['Template'], a['WaveType']].join(); });         
        //_.uniqBy([planfieldsValues], function (a) { return [a['Country'], a['Market'], a['Parent'], a['Template'], a['WaveType']].join(); });         

        newPlans.map((e, indx) => {
            let SPKGlabelName = null;
            let SPKGlabelVal = null;
            //let psVal = null;
            let projectPlanPopupGrid = [...this.state.ProjectPlanPopupGrid];
            if (planfieldsValues.Template == "SHAREDPACK") {
                // let ary = allRecord.filter(a=>a.ProjectName == planfieldsValues.Parent);
                // labelName = ary.length > 0 ? ary[0].LabelName : null;

                SPKGlabelName = projectPlanPopupGrid.length > 0 && projectPlanPopupGrid.filter(a => a.ProjectName == planfieldsValues.parent)
                    ? projectPlanPopupGrid.filter(a => a.ProjectName == planfieldsValues.parent)[0]?.LabelName :
                    (allRecord.length > 0 && allRecord.filter(a => a.ProjectName == planfieldsValues.parent).length > 0) ?
                        allRecord.filter(a => a.ProjectName == planfieldsValues.parent)[0]?.LabelName : null;
                SPKGlabelVal = SPKGlabelName != null ? SPKGlabelName.split('$')[0] : null;

                console.log("SPKG Label", SPKGlabelName);
                let selectedLabel = planfieldsValues.LabelName;
                if (selectedLabel != null && selectedLabel != '' && selectedLabel != SPKGlabelName) {
                    SPKGlabelName = selectedLabel;
                    SPKGlabelVal = SPKGlabelName != null ? SPKGlabelName.split('$')[0] : null;
                    console.log("SPKG Label", SPKGlabelVal);
                }
            }

            //allRecord

            if ((planfieldsValues.Template !== 'NPLO' && allRecord.filter(x => x.Template.key != 'NPLO').findIndex(x => x.Country === e.Country && x.Market === e.Market && x.Template === planfieldsValues.Template && x.PackSize == planfieldsValues.PackSize))
                ||
                (planfieldsValues.Template === 'NPLO' && allRecord.filter(x => x.Template.key == 'NPLO').findIndex(x => x.Country === e.Country && x.Market === e.Market && x.PackSize == planfieldsValues.PackSize && x['WaveType'] === e['WaveType']))
            ) {
                let exist = false;

                let _projectPrefixVal = planfieldsValues.PlanProjectName != '' ? planfieldsValues.ProjectPrefix + '-' + planfieldsValues.PlanProjectName : planfieldsValues.ProjectPrefix;

                if (!exist) {
                    let labelNamVal = planfieldsValues.LabelName.split('$').length > 0 ? planfieldsValues.LabelName.split('$')[0] : planfieldsValues.LabelName;
                    let prjtNmSuffix = this.state.lstProjectNameSuffix.filter(a => a.key == planfieldsValues.Template);
                    let PName = null;
                    if (DataService.environment === 'DEV') {
                        PName = (labelNamVal) + '-' + _projectPrefixVal + '-' + (e.Country !== '' ? e.Country?.display : e.Market?.display) + (planfieldsValues.Template === 'PACKAGING' ? '-PKG' : '') + "-DEMO" + prjtNmSuffix[0].name; // - DEMO only for DEV 
                    } else {
                        PName = (labelNamVal) + '-' + _projectPrefixVal + '-' + (e.Country !== '' ? e.Country?.display : e.Market?.display) + (planfieldsValues.Template === 'PACKAGING' ? '-PKG' : '') + prjtNmSuffix[0].name; // - DEMO only for DEV 
                    }
                    let ProjectNameVal = this.getProjectPlanName(PName);
                    //let parentIDVal = allRecord.filter(a=>a.ProjectName == planfieldsValues.parent).length > 0 ?
                    //allRecord.filter(a=>a.ProjectName == planfieldsValues.parent)[0].id : 0;
                    let packSizeVal = projectPlanPopupGrid.length > 0 && projectPlanPopupGrid.filter(a => a.ProjectName == planfieldsValues.parent)
                        ? projectPlanPopupGrid.filter(a => a.ProjectName == planfieldsValues.parent)[0]?.PackSize :
                        (allRecord.length > 0 && allRecord.filter(a => a.ProjectName == planfieldsValues.parent).length > 0) ?
                            allRecord.filter(a => a.ProjectName == planfieldsValues.parent)[0]?.PackSize : null;

                    let planVal = {
                        ...e,
                        id: ++index,

                        RecordID: 0,
                        //ProjectID : e.DRID,
                        ProjectName: ProjectNameVal,
                        PlanStatus: 'Draft',
                        ProjectPrefix: planfieldsValues.ProjectPrefix,
                        Parent: planfieldsValues.parent,
                        ParentMarket: planfieldsValues.ParentMarket,
                        ParentID: planfieldsValues.ParentID,
                        PlanProjectName: planfieldsValues.PlanProjectName,
                        RecordType: 'N',
                        Template: planfieldsValues.Template,
                        WaveType: planfieldsValues.WaveType,
                        LabelName: planfieldsValues.planLabel.length > 0 ? planfieldsValues.planLabel[0].key : '',
                        LabelVal: planfieldsValues.LabelName,
                        // LabelName: planfieldsValues.Template == "SHAREDPACK" ? SPKGlabelName : (planfieldsValues.planLabel.length > 0 ? planfieldsValues.planLabel[0].key : ''),
                        // LabelVal: planfieldsValues.Template == "SHAREDPACK" ? SPKGlabelVal : planfieldsValues.LabelName,
                        PackSize: packSizeVal,
                        DeepDive: planfieldsValues.DeepDive,
                        Country: e.Country?.display,
                        cCountry: e.Country?.title,
                        Market: e.Market?.display,
                        cMarket: e.Market?.title,
                        Region: e.Region?.display,
                        cRegion: e.Region?.title,
                        'LaunchLeader': this.props.currentUser.displayName,
                        'CreatedBy': this.props.currentUser.displayName,
                        CreatedOn: new Date()
                    }
                    // allRecord.unshift(planVal);
                    newPlansData.push(planVal);
                    //newPlan = newPlan.length >  0 ? [...newPlan, planVal] : [newPlan];
                    console.log("newPlan", planVal);
                }
                else { count++; }
            }
            else { count++; }

        });
        console.log("count", count);
        // add new plans in popupgrid, clear fields values set templates & wavetype to default 
        let fieldValues = this.state.planfieldValues;
        let planPopupGridData = [...this.state.ProjectPlanPopupGrid];
        this.setState({
            allNewPlanRecords: newPlansData,
            newPlanRecords: [],
            ProjectPlanPopupGrid: [...planPopupGridData, ...newPlansData],

            planfieldValues: {
                DRID: fieldValues.DRID,
                DeepDive: false,
                Template: this.props.planFieldsData?.Template[0]?.key,
                WaveType: this.props.planFieldsData?.WaveType[0]?.key,
                Indication: fieldValues.IndicationVal,
                ProjectPrefix: fieldValues.ProjectPrefix,
                PlanProjectName: '',
                ProjectName: ''
            }
        }, () => {
            this.updateLstMarkets();
        });

        if (count > 0) {
            //this.toast.show({ severity: 'info', summary: 'Info Message', detail: 'Project Plans selected successfully. Excluded duplicate entries!', life: 4000 })
            this.setState({
                showSystemMsg: true,
                systemMsg: "Project Plans selected successfully. Excluded duplicate entries!"
            })

        }
        this.setState({ isLoading: false });
    }
    updatePlan = async () => {
        this.lrvfRefHist != null && this.lrvfRefHist != undefined ?
            await this.lrvfRefHist.instance.saveEditData() : console.log();
        let planFieldVal = this.state.planfieldValues;
        let newLabeData = this.state.newLabelArry;
        let projectPlanPopupGrid = [...this.state.ProjectPlanPopupGrid];
        if (projectPlanPopupGrid[0].PlanStatus == 'Draft') //plan Updated -before plan creation
        {
            if (planFieldVal.id == projectPlanPopupGrid[0].id) {
                if (planFieldVal.Template == 'GLO' || planFieldVal.Template == 'NPLO') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName,
                        projectPlanPopupGrid[0].LabelVal = planFieldVal.LabelVal,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive,
                        projectPlanPopupGrid[0].PlanStatus = 'Draft';
                }
                if (planFieldVal.Template == 'GLOFINISHEDPACK') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName,
                        projectPlanPopupGrid[0].LabelVal = planFieldVal.LabelVal,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive

                    if (projectPlanPopupGrid[0].Parent != planFieldVal.Parent) {
                        projectPlanPopupGrid[0].Parent = planFieldVal.Parent,
                            projectPlanPopupGrid[0].LabelName = planFieldVal[0].LabelName,
                            projectPlanPopupGrid[0].LabelVal = planFieldVal.LabelVal
                    }
                    projectPlanPopupGrid[0].PlanStatus = 'Draft';
                }
                else if (planFieldVal.Template == 'FINISHEDPACK') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName,
                        projectPlanPopupGrid[0].LabelVal = planFieldVal.LabelVal,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive

                    if (projectPlanPopupGrid[0].Parent != planFieldVal.Parent) {
                        projectPlanPopupGrid[0].Parent = planFieldVal.Parent,
                            projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName,
                            projectPlanPopupGrid[0].LabelVal = planFieldVal.LabelVal
                    }
                    projectPlanPopupGrid[0].PlanStatus = 'Draft';
                }
                else if (planFieldVal.Template == 'SHAREDPACK') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName,
                        projectPlanPopupGrid[0].LabelVal = planFieldVal.LabelVal,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive

                    if (projectPlanPopupGrid[0].Parent != planFieldVal.Parent) {
                        projectPlanPopupGrid[0].Parent = planFieldVal.Parent,
                            projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName,
                            projectPlanPopupGrid[0].LabelVal = planFieldVal.LabelVal
                    }
                }
            }
        }
        else if (projectPlanPopupGrid[0].PlanStatus != 'Draft') //plan Updated -after plan creation
        {
            if (planFieldVal.RecordID == projectPlanPopupGrid[0].RecordID) {
                if (planFieldVal.Template == 'GLO' || planFieldVal.Template == 'NPLO') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive,
                        projectPlanPopupGrid[0].PlanStatus = 'DRAFT MODIFIED';
                }
                else if (planFieldVal.Template == 'GLOFINISHEDPACK') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive,
                        //projectPlanPopupGrid[0].PackSize = planFieldVal.PackSize,
                        projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName
                    if (projectPlanPopupGrid[0].Parent != planFieldVal.ParentPlans) {
                        projectPlanPopupGrid[0].Parent = planFieldVal.ParentPlans,
                            projectPlanPopupGrid[0].LabelName = planFieldVal[0].LabelNames
                    }
                    projectPlanPopupGrid[0].PlanStatus = 'DRAFT MODIFIED';
                }
                else if (planFieldVal.Template == 'FINISHEDPACK') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive,
                        //projectPlanPopupGrid[0].PackSize = planFieldVal.PackSize,
                        projectPlanPopupGrid[0].LabelName = planFieldVal.LabelNames
                    if (projectPlanPopupGrid[0].Parent != planFieldVal.ParentPlans) {
                        projectPlanPopupGrid[0].Parent = planFieldVal.ParentPlans,
                            projectPlanPopupGrid[0].LabelName = planFieldVal.LabelName
                    }
                    projectPlanPopupGrid[0].PlanStatus = 'DRAFT MODIFIED';
                }
                else if (planFieldVal.Template == 'SHAREDPACK') {
                    projectPlanPopupGrid[0].WaveType = planFieldVal.WaveType,
                        projectPlanPopupGrid[0].DeepDive = planFieldVal.DeepDive,
                        //projectPlanPopupGrid[0].PackSize == planFieldVal.PackSize
                        projectPlanPopupGrid[0].LabelName = planFieldVal.LabelNames
                    if (projectPlanPopupGrid[0].Parent != planFieldVal.ParentPlans) {
                        projectPlanPopupGrid[0].Parent = planFieldVal.ParentPlans,
                            projectPlanPopupGrid[0].LabelName = planFieldVal.LabelNames
                    }
                    projectPlanPopupGrid[0].PlanStatus = 'DRAFT MODIFIED';
                }
            }
        }
        this.setState({
            ProjectPlanPopupGrid: projectPlanPopupGrid,
            planPopupOpen: false
        });
        this.props.onConfirmSave('Update', projectPlanPopupGrid, newLabeData);
        this.props.closePopup(false);
    }
    AddNewPlanToGrid = async () => {
        if (this.state.Action == 'New') {
            this.lrvfRefHist != null && this.lrvfRefHist != undefined ?
                await this.lrvfRefHist.instance.saveEditData() : console.log();
            let projectPlanGrid = [...this.state.ProjectPlanPopupGrid];
            let newLabeData = [...this.state.newLabelArry];
            this.props.onConfirmSave('Add', projectPlanGrid, newLabeData);
            this.setState({
                ProjectPlanPopupGrid: [],
                planfieldValues: [],
                planPopupOpen: false
            });
            this.props.closePopup(false);
        }
        if (this.state.Action == 'Edit') {

            this.updatePlan();
            // this.setState({
            //     ProjectPlanPopupGrid : [],
            //     planfieldValues : [],   
            //     planPopupOpen : false
            // });
        }

    }
    ViewDialogIcon = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link dialog-dd-container'>
                {this.props.Action == 'View' ?
                    <span className='modeParent' style={{ backgroundColor: '#dee2e6', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.props.Action}</span></span>
                    :
                    <span className='modeParent' style={{ backgroundColor: 'yellow', cursor: 'default' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.props.Action}</span></span>
                }
                <div className="DeepDiveCheckBoxWithLabelDiv" style={{ cursor: this.state.Action == 'View' || this.state.Action == 'Edit' ? 'not-allowed' : 'pointer' }}>
                    <Checkbox
                        className='DeepDiveCheckBoxControl'
                        checked={this.state.planfieldValues.DeepDive}
                        disabled={this.state.Action == 'View' || this.state.Action == 'Edit'}
                        style={{ cursor: this.state.Action == 'View' || this.state.Action == 'Edit' ? 'not-allowed' : 'pointer' }}
                        onChange={e => this.handlePlanDataFieldChange('DeepDive', e.checked)}
                    />
                    <span className='DeepDiveLabelSpan'
                        style={{ cursor: this.state.Action == 'View' || this.state.Action == 'Edit' ? 'not-allowed' : 'pointer' }}
                        // onClick={e => this.setState({ showDeepDive: this.state.showDeepDive ? false : true })}
                        onClick={e => this.state.Action == 'View' || this.state.Action == 'Edit' ? console.log('') : this.handlePlanDataFieldChange('DeepDive', this.state.planfieldValues.DeepDive ? false : true)}
                    >&nbsp;NPL T6&ensp;</span>
                </div>
                <span className='PipeSeparator'>&nbsp;&#8739;&nbsp;</span>
                <Button className='p-button-raised p-button-rounded saveBtn'
                    style={this.state.Action == "View" ? { display: "none" } : { display: "" }}
                    onClick={e => this.AddNewPlanToGrid()} icon='dx-icon-save'
                    disabled={this.state.ProjectPlanPopupGrid.length > 0 ? false : true}
                    label={this.state.Action == 'New' ? 'Confirm' : 'Update & Confirm'} />
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.closePopup(false)} icon='dx-icon-close' label='Close' />
            </div>
        );
    }

    viewDialogIconLabel = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link'>
                <Button className='p-button-raised p-button-rounded okBtn' onClick={this.saveLabelName} icon='dx-icon-save' label='Confirm' />
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.closePopupLabel(false)} icon='dx-icon-close' label='Close' />
            </div>
        );
    }

    viewDialogAlert = () => {
        if (this.state.IsDelete) {
            return (
                <div className='p-dialog-titlebar-icon p-link'>
                    <Button className='p-button-raised p-button-rounded okBtn' onClick={e => this.handleDeletePlans()} icon='dx-icon-save' label='Ok' />
                    <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({ showSystemMsg: false, systemMsg: '' })} icon='dx-icon-close' label='Cancel' />
                </div>
            );
        }
        else {
            return (
                <div className='p-dialog-titlebar-icon p-link'>
                    <Button className='p-button-raised p-button-rounded okBtn' onClick={e => this.setState({ showSystemMsg: false, systemMsg: '' })} icon='dx-icon-save' label='Ok' />
                    {/* <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({showSystemMsg : false,systemMsg : ''})} icon='dx-icon-close' label='Close' /> */}
                </div>
            );
        }
    }

    viewDialogDeleteAlert = () => {
        return (
            <div className='p-dialog-titlebar-icon p-link'>
                <Button className='p-button-raised p-button-rounded okBtn' onClick={e => this.setState({ showSystemMsg: false, systemMsg: '' })} icon='dx-icon-save' label='Ok' />
                <Button className='p-button-raised p-button-rounded closeBtn' onClick={e => this.setState({ showSystemMsg: false, systemMsg: '' })} icon='dx-icon-close' label='Close' />
            </div>
        );
    }

    closePopup = (value) => {
        let popupGrid = [...this.state.ProjectPlanPopupGrid];
        let planGrid = [...this.state.PlanGridData];
        if (popupGrid.length > 0) {
            popupGrid.map((dt) => {
                planGrid = planGrid.filter(a => a.id != dt.id);
            });
        }
        this.props.closePopup(value);
        this.setState({
            planPopupOpen: value,
            ProjectPlanPopupGrid: [],
            PlanGridData: planGrid
        }), () => {
            //on close update country/region/market dropdown data  
            //this.updateLstMarkets();
        };

    }

    closePopupLabel = (value) => {
        // this.props.closePopup(value);
        this.setState({
            addLabelFlag: value,
            labelNameRaw: ''
        });
    }

    setRawLabelName = (e: any) => {
        this.setState({ labelNameRaw: e.target.value })
    };

    saveLabelName = () => {
        let rawLabelName = this.state.labelNameRaw;
        let planFieldsData = [this.state.planFieldsData];
        let lstLabels = planFieldsData[0]['LabelNames'];
        let planLabelAry = [];
        // this.setState({
        let newLabelName = {
            Active: false,
            integrationFlag: 'N',
            key: `999->${rawLabelName}`,
            value: `${rawLabelName}`
        }
        //addLabelFlag: false
        // });
        planLabelAry.push(newLabelName);
        let labelList = lstLabels.length > 0 ? lstLabels.filter(a => a.value != null && a.value != "") : [];
        if (labelList.filter(x => x.value.toUpperCase() === rawLabelName.toUpperCase()).length > 0) {
            let systemMsg = 'Label already exists';
            this.setState({
                systemMsg: systemMsg,
                showSystemMsg: true
            });
        }
        else {
            //let newLabelsDt = this.state.newLabelName;
            let newLabelsDt = this.state.newLabelArry;
            if (newLabelsDt && newLabelsDt.length > 0) {
                let isLabelExit = newLabelsDt.filter(a => a.value.toUpperCase() === rawLabelName.toUpperCase());
                if (isLabelExit && isLabelExit.length > 0) {
                    let systemMsg = 'Label already added';
                    this.setState({
                        systemMsg: systemMsg,
                        showSystemMsg: true
                    });
                }
                else {
                    //add new label to dropdown
                    labelList.push(newLabelName);
                    newLabelsDt.push(newLabelName);
                    this.setState(prevState => ({
                        addLabelFlag: false,
                        newLabelArry: newLabelsDt,
                        planFieldsData: {
                            ...prevState.planFieldsData,
                            ['LabelNames']: labelList
                        },
                        labelNameRaw: ''
                        // planfieldValues: {
                        //     ...prevState.planfieldValues,
                        //     ['LabelNames']: rawLabelName,
                        //     ['LabelName']: rawLabelName ? (rawLabelName.split('$').length > 0 ? rawLabelName.split('$')[0] : rawLabelName) : rawLabelName,
                        //     ['planLabel']: planLabelAry
                        // }
                    }));

                    let plFieldsData = this.state.planFieldsData;
                    this.props.OnNewLabelAdd(newLabelsDt, plFieldsData);
                }
            }
            else {
                //add new label to dropdown
                labelList.push(newLabelName);
                newLabelsDt.push(newLabelName);

                this.setState(prevState => ({
                    newLabelArry: newLabelsDt,
                    addLabelFlag: false,
                    planFieldsData: {
                        ...prevState.planFieldsData,
                        ['LabelNames']: labelList
                    },
                    labelNameRaw: ''
                    // planfieldValues: {
                    //     ...prevState.planfieldValues,
                    //     ['LabelNames']: rawLabelName,
                    //     ['LabelName']: rawLabelName ? (rawLabelName.split('$').length > 0 ? rawLabelName.split('$')[0] : rawLabelName) : rawLabelName,
                    //     ['planLabel'] : planLabelAry
                    // }
                }));
                let plFieldsData = this.state.planFieldsData;
                this.props.OnNewLabelAdd(newLabelsDt, plFieldsData);
            }
        }
        setTimeout(() => {
            this.handlePlanDataFieldChange('LabelNames', rawLabelName);
        }, 1000);
    };

    getOptionLabelValue = (option, fieldName) => {
        let optionLabel = 'key', optionaValue = 'value';
        if (fieldName == "Template") {
            optionLabel = 'key';
            optionaValue = "name"
        }
        else if (fieldName == "Country" || fieldName == "Market" || fieldName == "Region") {
            optionLabel = 'display';
            optionaValue = "name"
        }
        else {
            optionLabel = 'key';
            optionaValue = 'value';
        }
        return (option == 'label' ? optionLabel : optionaValue);
    }

    getFieldValue = (fieldName) => {
        let fieldValue: any;
        if (this.state.Action == "New") {
            //dropdowns
            if (fieldName == 'Template' || fieldName == "WaveType" || fieldName == "LabelNames") {
                fieldValue = this.state.planfieldValues[fieldName] ? (this.state.planfieldValues[fieldName].value ? this.state.planfieldValues[fieldName].value : this.state.planfieldValues[fieldName]) : this.state.planfieldValues[fieldName];
                //fieldValue.push(fVal);
            }
            // else if(fieldName == 'Country'){
            //     fieldValue = this.state.planfieldValues[fieldName];  
            // }
            else if (fieldName == 'Country' || fieldName == "Market" || fieldName == "Region" || fieldName == "Indication") {
                fieldValue = this.state.planfieldValues[fieldName];
            }
            else if (fieldName == "DeepDive") {
                fieldValue = this.state.planfieldValues[fieldName];
                //!= null ? (this.state.planfieldValues[fieldName] ? 'Yes' : 'No') : '';
            }
            else {
                fieldValue = this.state.planfieldValues[fieldName];
            }
        }
        else if (this.state.Action == "Edit" || this.state.Action == 'View') {
            if (fieldName == 'Template' || fieldName == "WaveType" || fieldName == "LabelNames") {
                fieldValue = this.state.planfieldValues[fieldName] ? (this.state.planfieldValues[fieldName].value ? this.state.planfieldValues[fieldName].value : this.state.planfieldValues[fieldName]) : this.state.planfieldValues[fieldName];
                //fieldValue.push(fVal);
            }
            else if (fieldName == "Country" || fieldName == "Market" || fieldName == "Region") {
                fieldValue = this.state.planfieldValues[fieldName];
            }
            else if (fieldName == "Indication") {
                fieldValue = this.state.planfieldValues[fieldName];
            }
            else {
                fieldValue = this.state.planfieldValues[fieldName];
            }
        }
        console.log(fieldName + "-: " + fieldValue);
        return fieldValue;
    }

    getDropdownData = (fieldName, fieldType) => {
        let dropdownData = this.state.planFieldsData[fieldName];
        if (fieldType == "DropDown" || fieldType == "MultiSelect") {
            if (fieldName == "Country") {
                dropdownData = [...this.state.planFieldsData[fieldName]];
            }
            if (fieldName == "Market") {
                dropdownData = [...this.state.planFieldsData[fieldName]];
                console.log("Market DD", dropdownData);
            }
            if (fieldName == "Region") {
                dropdownData = [...this.state.planFieldsData[fieldName]];
                console.log("Region DD", dropdownData);
            }
            else {
                dropdownData = this.state.planFieldsData[fieldName] ? [...this.state.planFieldsData[fieldName]] : this.state.planFieldsData[fieldName];
            }
        }
        else {
            dropdownData = this.state.planFieldsData[fieldName];
        }
        return dropdownData;
    }
    disableFields = (fieldItem) => {
        let isDisabled = this.state.planfieldValues.PlanStatus == 'PROCESSING' || this.state.planfieldValues.PlanStatus == 'NEW' ? true : false;
        let fieldValues = this.state.planfieldValues;
        if (this.props.Action == "New") {
            if (fieldItem.InternalName == "Region" || fieldItem.InternalName == "Market") {
                isDisabled = true;
            }
            if (fieldItem.InternalName == "ParentPlans") {
                isDisabled = fieldValues['Template'] == "GLO" || fieldValues['Template'] == "NPLO" ? true : false;
            }
            if (fieldItem.InternalName == "LabelName" || fieldItem.InternalName == "Indication") {
                isDisabled = true;
            }
        }
        if (this.props.Action == "Edit") {
            if (fieldItem.InternalName === 'DeepDive') {
                return isDisabled;
            }
            if (fieldItem.InternalName != "WaveType" && (fieldValues['Template'] == "GLO" || fieldValues['Template'] == "NPLO")) {
                isDisabled = true;
            }
            if (fieldItem.InternalName != "ParentPlans" && fieldValues['Template'] == "SHAREDPACK") { //sharepack finishedpack glofinishedpack
                isDisabled = true;
            }
            if (!(fieldItem.InternalName == "WaveType" || fieldItem.InternalName == "ParentPlans") && (fieldValues['Template'] == "FINISHEDPACK" || fieldValues['Template'] == "GLOFINISHEDPACK")) {
                isDisabled = true;
            }
        }
        if (this.props.Action == 'View') {
            isDisabled = true;
        }
        return isDisabled;
    }

    public ActionCol(rowData: any) {
        return (
            <>
                <div>
                    {/* <img title="View" alt="Card" src={view} onClick={(e) => this.Actionlink('View', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} />
                    <img title="Edit" alt="Card" src={edit} onClick={(e) => this.Actionlink('Edit', rowData)} style={{ marginRight: "5px", cursor: "pointer " }} /> */}
                    <img title="delete" alt="Card" src={deleteIcon} onClick={(e) => this.Actionlink('Delete', rowData)}
                        style={this.state.Action == "New" ? { visibility: "visible", marginRight: "5px", cursor: "pointer " } : { visibility: "hidden" }}
                    />
                </div>
            </>
        );
    }

    Actionlink = (type, rowData) => {
        let popupGridData = [...this.state.ProjectPlanPopupGrid];
        //remove plan which is deleting, from parent plans dropdown data if present.
        let recordTodelete = popupGridData.filter(a => a.id == rowData.data.id);
        let subPlans = popupGridData.filter(a => a.Parent == rowData.data.ProjectName);
        if (subPlans.length > 0) {
            let systemMsg = <span>This Plan have some child plans <br /> Are you sure, you want to delete all plan records ?</span>;
            this.setState({
                systemMsg: systemMsg,
                showSystemMsg: true,
                IsDelete: true,
                RecordsToDelete: recordTodelete
            });
        }
        else {
            let systemMsg = <span>{"Are you sure, you want to delete plan ?"}</span>;
            this.setState({
                systemMsg: systemMsg,
                showSystemMsg: true,
                IsDelete: true,
                RecordsToDelete: recordTodelete
            }
                // , () =>
                //     this.handleDeletePlans()
            )
        }
    }

    handleDeletePlans = () => {
        let recordsToDelete = [...this.state.RecordsToDelete];
        let popupGridData = [...this.state.ProjectPlanPopupGrid];
        let plangridData = [...this.state.PlanGridData];
        let planflDt = this.state.planFieldsData;
        let parentPlansData = planflDt['ParentPlans']?.length > 0 ? planflDt['ParentPlans'].filter(a => a.value != recordsToDelete[0].ProjectName) : [];
        let indx = popupGridData.findIndex(a => a.id == recordsToDelete[0].id);
        let indx1 = plangridData.findIndex(a => a.id == recordsToDelete[0].id);
        let subPlansToDelete = popupGridData.filter(a => a.Parent == recordsToDelete[0].ProjectName);

        //clear selected region,market data
        let market = [...this.state.Markets];
        let region = [...this.state.Region];
        //if more than one plan have same region don't delete region- else delete
        let regionSelected = popupGridData.filter(a => a.Region == recordsToDelete[0].Region).length <= 1;
        let marketSelected = popupGridData.filter(a => a.Market == recordsToDelete[0].Market).length <= 1;
        if (regionSelected) {
            region = region.filter(a => a.display != recordsToDelete[0].Region);
        }
        if (marketSelected) {
            market = market.filter(a => a.display != recordsToDelete[0].Market);
        }

        //delete record
        if (indx > -1) {
            popupGridData.splice(indx, 1);
            plangridData.splice(indx1, 1);
        }
        //delete subplans if present
        if (subPlansToDelete.length > 0) {
            subPlansToDelete.map((dt) => {
                popupGridData = popupGridData.filter(a => a.id != dt.id);
                plangridData = plangridData.filter(a => a.id == dt.id);
            });
        }

        this.setState(prevState => ({
            planFieldsData: {
                ...prevState.planFieldsData,
                ['ParentPlans']: parentPlansData,
            },
            ProjectPlanPopupGrid: popupGridData,
            PlanGridData: plangridData,
            showSystemMsg: false,
            systemMsg: '',
            IsDelete: false,
            Markets: market,
            Region: region
        }), () => {
            //delete plan from props grid
            //this.props.onPlanDelete(this.state.ProjectPlanPopupGrid, recordsToDelete[0].id);
            setTimeout(() => {
                this.updateLstMarkets();  // on delete market, reset country/market/region dropdown data
            }, 1000);
        });
    }

    ActionColumn(rowData: any, dataType: string) {
        if (dataType == "textbox" && rowData.Template != 'NPLO') {
            let psVal = (rowData.data ? rowData.data.PackSize : '');
            console.log("psval", psVal);
            return (
                <div>
                    <InputText value={rowData.data.PackSize} //keyfilter={/[^0-9,; ]/g}
                        onChange={e => this.PackSizeOnchange(e, rowData)} />
                </div>
            );
        }
    }
    PackSizeOnchange = async (e: any, rowData) => {
        let popupGridData = [...this.state.ProjectPlanPopupGrid];
        let psValue = e.currentTarget.value;
        console.log("pack size", psValue);

        if (psValue.match(/[^0-9,; ]/g, "") == null) {
            let indx = popupGridData.findIndex(a => a.id == rowData.id);

            if (indx > -1) {
                popupGridData[indx].PackSize = psValue;
            }
        }
        this.setState({
            ProjectPlanPopupGrid: popupGridData
        });
    }

    setCountryLst = (fieldName: any) => {
        let countryList = [...this.state.planFieldsData[fieldName]];
        if (this.state.Action == "New") {
            let PlanGridData = this.state.PlanGridData;
            let popupGridData = this.state.ProjectPlanPopupGrid;
            let template = this.state.planfieldValues.Template;
            if (template != null) {
                if (popupGridData.length > 0) {
                    if (template != 'NPLO') {
                        let _popupGridData = popupGridData.filter(a => a.Template != 'NPLO');
                        let _planGridData = PlanGridData.filter(a => a.Template != 'NPLO');
                        let filteredData = [..._popupGridData, ..._planGridData];
                        let filteredDT = filteredData.filter(a => a.Template == template);
                        let country = this.state.lstAllCountry.filter(x => !filteredDT.some(c => c.Country === x.display));
                        country = country.filter(m => !filteredDT.some(r => r.Country === m.display));
                        countryList = country;
                    }
                    else {
                        let _popupGridData = popupGridData.filter(a => a.Template != 'NPLO');
                        let _planGridData = PlanGridData.filter(a => a.Template != 'NPLO');
                        //let filteredData = [...popupGridData, ...PlanGridData].filter(x=>x.Template == 'NPLO');
                        let filteredData = [..._popupGridData, ..._planGridData];
                        if (filteredData.length == 0) {
                            let defMarkets = this.state.lstMarketNew.filter(x => this.state.defMarket.some(r => r.market === x.key && x.type === 'Market' && r.template === template));
                            let country = this.state.lstAllCountry.filter(x => defMarkets.some(r => r.key === x.parent && x.type === 'Country'));
                            countryList = country;
                        }
                        else {
                            countryList = [];
                        }
                    }
                }
            }
            this.setState(prevState => ({
                planFieldsData: {
                    ...prevState.planFieldsData,
                    [fieldName]: countryList
                }
            }));
        }
        return countryList;
    }
    //clear plan selection on country delete from dropdown
    clearPlanSelection = () => {
        let newPlans = [...this.state.newPlanRecords];
        let plnFieldVal = this.state.planfieldValues;
        let removepln = newPlans.filter(a => a.Template == plnFieldVal.Template && a.Country.display == plnFieldVal.Country[0].display);
        console.log("removepln", removepln);
        if (removepln.length > 0) {
            let indx = newPlans.indexOf(removepln[0]);
            newPlans.splice(indx, 1);
        }
        this.setState({
            newPlanRecords: newPlans
        });
    }
    clearSelection = () => {
        let newPlans = [...this.state.newPlanRecords];
        let plnFieldVal = this.state.planfieldValues;
        let removepln = newPlans.filter(a => a.Template == plnFieldVal.Template && a.Country.display == plnFieldVal.Country[0].display);
        console.log("removepln", removepln);

        if (removepln.length > 0) {
            let indx = newPlans.indexOf(removepln[0]);
            newPlans.splice(indx, 1);
        }
        // this.setState({
        //     newPlanRecords : newPlans
        // });

        this.setState(prevState => ({
            planfieldValues: {
                ...prevState.planfieldValues,
                ['Country']: [],
                ['Market']: [],
                ['Region']: [],
                ['LabelNames']: null,
                ['ParentPlans']: null,
                ['LabelName']: null,
                ['WaveType']: null,
                planLabel: [],
                PlanProjectName: ''
            },
            newPlanRecords: newPlans
        }));
    }

    highlightSelected = (e) => {
        if (e.rowType == 'data' && e.column.caption == 'NPL T6' && this.state.Action == 'New') {
            e.cellElement.style.backgroundColor = 'white';
        }
        if ((e.rowType == 'data' && (e.column.caption == 'Pack Size' || e.column.caption == 'Action' || e.column.caption == 'NPL T6') && this.state.Action != 'View')) {
            e.cellElement.style.backgroundColor = "white";
        }
        else if (e.rowType == 'data')
            e.cellElement.style.backgroundColor = '#eeeeee';
        if (e.rowType == 'data' && (this.state.Action == 'View' || this.state.Action == 'Edit') && e.column.caption == 'Action')
            e.cellElement.style.backgroundColor = '#eeeeee';

        if ((this.state.planfieldValues.PlanStatus == 'PROCESSING' || this.state.planfieldValues.PlanStatus == 'NEW') && e.rowType == 'data') {
            e.cellElement.style.backgroundColor = "#eeeeee";
        }
        // e.rowElement.style.cssText="background-color:#e3f2fd;";
        // e.component.repaint();
    }

    onEditorPreparing = (e) => {
        if (e.parentType === 'dataRow' && e.dataField === 'PackSize') {
            e.editorOptions.onKeyPress = (args) => {
                let event = args.event;
                if (!(event.key.match(/[0-9;]/)))
                    event.preventDefault();
            }
        }
    }

    clearPlanFieldSelection = (fieldName: string, fieldValue: any) => {
        this.setState({ isLoading: true });
        if (fieldName == "Template") {
            //this.clearSelection();
            let newPlans = [...this.state.newPlanRecords];
            let plnFieldVal = this.state.planfieldValues;
            let removepln = newPlans.filter(a => a.Template == plnFieldVal.Template && a.Country.display == plnFieldVal.Country[0].display);
            console.log("removepln", removepln);

            if (removepln.length > 0) {
                let indx = newPlans.indexOf(removepln[0]);
                newPlans.splice(indx, 1);
            }

            this.setState(prevState => ({
                planfieldValues: {
                    ...prevState.planfieldValues,
                    ['Country']: [],
                    ['Market']: [],
                    ['Region']: [],
                    ['LabelNames']: null,
                    ['ParentPlans']: null,
                    ['LabelName']: null,
                    ['WaveType']: null,
                    planLabel: [],
                    PlanProjectName: ''
                },
                newPlanRecords: newPlans
            }));
        }
        this.setState({ isLoading: false });
    }

    openLabelDialog = () => {
        this.setState({ addLabelFlag: true });
    }

    labelClose = () => {
        this.setState({ addLabelFlag: false, labelNameRaw: null });
    }


    public ActionT6Col(rowData: any) {
        console.log("T6", rowData);
        return (
            <>
                <div>
                    <Checkbox
                        className='DeepDiveCheckBoxControl1'
                        checked={rowData.data.DeepDive}
                        disabled={this.state.Action == 'View' || this.state.Action == "Edit"}
                        style={{ cursor: (this.state.Action == 'View' || this.state.Action == "Edit") ? 'not-allowed' : 'pointer' }}
                        onChange={e => this.updateProjectPlanPopupGrid(rowData, e.checked)}
                    />
                </div>
            </>
        );
    }
    updateProjectPlanPopupGrid = (rowData, deepDiveValue) => {
        let PlanPopupGrid = [...this.state.ProjectPlanPopupGrid];
        PlanPopupGrid.map((dt) => {
            if (dt.RecordType == "N" && dt.id == rowData.data.id) {
                dt.DeepDive = deepDiveValue;
            }
        });
        this.setState({
            ProjectPlanPopupGrid: PlanPopupGrid
        });

    }
    getProjectName = (val) => {
        let ProjectName = '';
        if (this.state.Action == "Edit" || this.state.Action == "View") {
            let LABEL_NAME = this.state.planfieldValues['LabelName'] != undefined ? this.state.planfieldValues['LabelName'] : '';
            let PREFIX = this.state.planfieldValues['PlanProjectName'] != '' && this.state.planfieldValues['PlanProjectName'] ? this.state.planfieldValues.ProjectPrefix + ' - ' + this.state.planfieldValues['PlanProjectName'] : this.state.planfieldValues.ProjectPrefix ? this.state.planfieldValues.ProjectPrefix : '';
            let SUFFIX = '';
            if (this.state.planfieldValues.Country && this.state.planfieldValues.Country.length) {
                SUFFIX = this.state.planfieldValues.Country[0].display
            } else if (this.state.planfieldValues.Market && this.state.planfieldValues.Market.length) {
                SUFFIX = this.state.planfieldValues.Market[0].display
            } else {
                SUFFIX = '';
            }
            ProjectName = (LABEL_NAME) + (LABEL_NAME != '' || SUFFIX != '' ? ' - ' : '') + PREFIX + (LABEL_NAME != '' || SUFFIX != '' ? ' - ' : '') + SUFFIX;
        }
        else {

            let LabelName = val.data ? val.data.LabelVal : '';
            let Prefix = (val.data.ProjectPrefix + (val.data.PlanProjectName != '' ? (' - ' + val.data.PlanProjectName) : ''))
            //this.state.planfieldValues.ProjectPrefix;
            // let Prefix = val.data? val.data.ProjectPrefix : '';
            let Suffix = '';
            if (val.data.Country) {
                Suffix = val.data.Country;
            }
            else if (val.data.Market) {
                Suffix = val.data.Market;
            }
            else {
                Suffix = '';
            }
            ProjectName = (LabelName) + (LabelName != '' || Suffix != '' ? ' - ' : '') + Prefix + (LabelName != '' || Suffix != '' ? ' - ' : '') + Suffix;
            //(LabelName) + (LabelName != '' || Suffix != '' ? ' - ' : '') + Prefix + (LabelName != '' || Suffix != '' ? ' - ' : '') + Suffix;
        }

        console.log("Proposed Project Name", ProjectName);
        return (
            <span>
                {ProjectName}
            </span>
        )

    }
    public render(): React.ReactElement<IProjectPlanPopupProps> {
        this.LABEL_NAME = this.state.planfieldValues['LabelName'] != undefined ? this.state.planfieldValues['LabelName'] : '';
        this.PREFIX = this.state.planfieldValues['PlanProjectName'] != '' && this.state.planfieldValues['PlanProjectName'] ? this.state.planfieldValues.ProjectPrefix + ' - ' + this.state.planfieldValues['PlanProjectName'] : this.state.planfieldValues.ProjectPrefix ? this.state.planfieldValues.ProjectPrefix : '';
        if (this.state.planfieldValues.Country && this.state.planfieldValues.Country.length) {
            this.SUFFIX = this.state.planfieldValues.Country[0].display
        } else if (this.state.planfieldValues.Market && this.state.planfieldValues.Market.length) {
            this.SUFFIX = this.state.planfieldValues.Market[0].display
        } else {
            this.SUFFIX = '';
        }
        return (
            this.state.planPopupOpen ?
                <>
                    <Dialog
                        blockScroll={true}
                        header={this.state.Action == 'Edit' ? `Edit Plan : ` + this.state.planfieldValues.ProjectName : this.state.Action == 'View' ? "View Plan : " + this.state.planfieldValues.ProjectName : "Add Project Plan"}
                        closable={false}
                        visible={this.state.planPopupOpen}
                        style={{ height: '99vh', width: '99vw' }}
                        icons={this.ViewDialogIcon} onHide={() => this.setState({ planPopupOpen: false })}>
                        <div className='container projtPlan-data-container'>
                            <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' />
                            <Toast ref={(el) => this.toast = el} position="bottom-right" />
                            <Row>
                                <Col md={2} className='dr-pp-accordion'>
                                    <Accordion multiple activeIndex={[0]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                                        <AccordionTab header='Project Data [Read Only]'>
                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Business Unit:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails.BusinessUnit}</span>
                                                </div>
                                            </div>

                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Sub Business Unit:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails.SubBusinessUnit}</span>
                                                </div>
                                            </div>

                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Molecule API/DS:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails.MoleculeName}</span>
                                                </div>
                                            </div>

                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Label Name:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails.LabelName}</span>
                                                </div>
                                            </div>

                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Indication:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails.Indication}</span>
                                                </div>
                                            </div>

                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Global Brand:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails.GlobalBrandAPI}</span>
                                                </div>
                                            </div>

                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Therapeutic Area:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails.TherapeuticArea}</span>
                                                </div>
                                            </div>
                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>PF/Compound Number:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails?.RnDProjNo}</span>
                                                </div>
                                            </div>

                                            <div className='dr-label-data-container'>
                                                <div className='dr-label-PP'>
                                                    <label>Pfizer Code:</label>
                                                    <span className='dr-data-PP'>{this.state.DRdetails?.PlaniswareID}</span>
                                                </div>
                                            </div>

                                        </AccordionTab>
                                    </Accordion>
                                </Col>
                                <Col md={10}>
                                    <Accordion multiple activeIndex={[0]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                                        <AccordionTab header='Market'>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: '100%' }}>
                                                    <div style={{ fontSize: 'medium', fontWeight: 'bold', background: '#0000c9', textAlign: 'center', marginTop: '5px', padding: '3px', color: 'white', width: '100%' }}
                                                    >Select Markets</div>
                                                    <br />
                                                    {this.state.planFieldsData &&
                                                        <Row className='section-background'>
                                                            <Row>
                                                                {
                                                                    this.props.planFormFields.map((fieldItem, index) => {
                                                                        if (fieldItem.InternalName == 'ParentPlans') { //parent plan field required for child plans- FPKG,GFPKG,SPKG
                                                                            let templateVal = this.state.planfieldValues['Template'];
                                                                            templateVal != 'GLO' && templateVal != 'NPLO' ? fieldItem.isRequired = true : fieldItem.isRequired = false;
                                                                        }
                                                                        if (fieldItem.TabName === 'ProjectPlan') {
                                                                            return (
                                                                                <>
                                                                                    <Col md={fieldItem.ColWidth} className='' style={{ marginTop: "5px" }}>
                                                                                        <label style={{ marginTop: "5px", display: 'flex', alignItems: 'center' }}>{fieldItem.Title}{fieldItem.isRequired && <span className='asteriskCls'>*</span>}
                                                                                            {fieldItem.InternalName === 'LabelNames' &&
                                                                                                <div style={{ display: `${this.state.Action == 'View' ? 'none' : ''}` }}>
                                                                                                    {/* <span style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => this.setState({ addLabelFlag: true })}>&nbsp;+&nbsp;</span>
                                                                                                    <span className='add-new-label-link' onClick={() => this.setState({ addLabelFlag: true })}> Add New Label</span> */}
                                                                                                </div>
                                                                                            }
                                                                                            {fieldItem.FieldType === 'Date' &&
                                                                                                <span className='dateFormatLabel'>MMM-DD-YYYY</span>
                                                                                            }</label>
                                                                                        {fieldItem.FieldType ?
                                                                                            PlanFieldControls.getFieldControls(fieldItem.InternalName, fieldItem.FieldType,
                                                                                                this.getFieldValue(fieldItem.InternalName),
                                                                                                this.state.planFieldsData[fieldItem.InternalName],
                                                                                                this.disableFields(fieldItem),
                                                                                                this.handlePlanDataFieldChange,
                                                                                                this.openLabelDialog
                                                                                            )
                                                                                            : <></>
                                                                                        }
                                                                                    </Col>
                                                                                </>
                                                                            );
                                                                        }
                                                                    })
                                                                }

                                                                <Col md={12} className='' style={{ marginTop: "5px" }}>
                                                                    {/* <label style={{ marginTop: "5px", display: 'flex', alignItems: 'center' }}>Proposed Project Name</label> */}
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '15px' }}>
                                                                        <div className='proj-name-container'>
                                                                            <span className='dr-data-PP'>{this.LABEL_NAME}</span>
                                                                            <label style={{ textAlign: 'center' }}>Label Name</label>
                                                                        </div>
                                                                        +
                                                                        <div className='proj-name-container'>
                                                                            <span className='dr-data-PP'>{this.PREFIX}</span>
                                                                            <label style={{ textAlign: 'center' }}>Indication - Project Suffix</label>
                                                                        </div>
                                                                        +
                                                                        <div className='proj-name-container'>
                                                                            <span className='dr-data-PP'>{this.SUFFIX}</span>
                                                                            <label style={{ textAlign: 'center' }}>Country/Market</label>
                                                                        </div>
                                                                        =
                                                                        <div className='proj-name-container'>
                                                                            <span className='dr-data-PP'>{`${this.LABEL_NAME}${this.LABEL_NAME != '' || this.SUFFIX != '' ? ' -' : ''} ${this.PREFIX} ${this.LABEL_NAME != '' || this.SUFFIX != '' ? '-' : ''} ${this.SUFFIX}`}</span>
                                                                            <label style={{ textAlign: 'center' }}>Proposed Project Name</label>
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                            </Row>
                                                            <div style={{ marginTop: '5px', textAlign: 'left' }}>
                                                                <Button className='p-button-raised p-button-rounded okBtn'
                                                                    style={this.state.Action == "Edit" || this.state.Action == 'View' ? { visibility: "hidden" } : { visibility: "visible", right: '10px' }}
                                                                    //disabled={this.showMarket()}
                                                                    onClick={e => this.validatePlanFields()} icon='dx-icon-add' label='Market' />
                                                            </div>
                                                            {/* <div style={{ marginTop: '5px', textAlign: 'right' }}>
                                        <Button className='p-button-raised p-button-rounded saveBtn' style={{ right: '10px' }}
                                            onClick={e => this.createNewPlan()} icon='dx-icon-add' label='Market' /> 
                                    </div> */}
                                                        </Row>}
                                                    <br />
                                                    <div style={{ fontSize: 'medium', fontWeight: 'bold', background: '#0000c9', textAlign: 'center', marginTop: '5px', padding: '3px', color: 'white', width: '100%' }}
                                                    > Markets Selected</div>
                                                    <br />
                                                    <DataGrid
                                                        dataSource={this.state.ProjectPlanPopupGrid}
                                                        //filterValue={this.state.gridFilterValue}
                                                        //defaultFilterValue={this.state.gridFilterValue}
                                                        ref={(ref) => { this.lrvfRefHist = ref; }}
                                                        allowColumnReordering={true}
                                                        allowColumnResizing={true}
                                                        columnResizingMode={'widget'}
                                                        filterSyncEnabled={false}
                                                        showColumnLines={true}
                                                        rowAlternationEnabled={true}
                                                        showBorders={true}
                                                        showRowLines={false}
                                                        // width='100%'
                                                        // height={604}
                                                        hoverStateEnabled={true}
                                                        columnMinWidth={1}
                                                        onCellPrepared={this.highlightSelected}
                                                        onEditorPreparing={this.onEditorPreparing}
                                                        //onOptionChanged={e => { if (e.fullName == 'searchPanel.text') { this.setState({ QueryString: e.value }); e.element.autofocus = true; } }}
                                                        columnAutoWidth={true}>
                                                        <Editing
                                                            mode="cell"
                                                            // onChangesChange={this.dtChanges}
                                                            // allowUpdating={checkForComments}
                                                            allowUpdating={this.state.planfieldValues.PlanStatus == 'PROCESSING' || this.state.planfieldValues.PlanStatus == 'NEW' ? false : true}
                                                            allowAdding={false}
                                                            allowDeleting={false} />
                                                        <Column cellRender={e => this.ActionCol(e)} visible={!(this.state.Action === "Edit" || this.state.Action === 'View')} minWidth={20} allowExporting={false} allowResizing={true} caption="Action" alignment="center" allowEditing={false} />
                                                        <Column
                                                            caption={'Proposed Project Name'} dataType={'string'} minWidth={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                            cellRender={e => this.getProjectName(e)}
                                                        />
                                                        <Column
                                                            dataField={'Template'} caption={'Template'} dataType={'string'} visible={true} width={'120px'} allowEditing={false} //alignment={item.alignment}
                                                        />
                                                        <Column
                                                            dataField={'WaveType'} caption={'Wave Type'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                        />
                                                        <Column
                                                            dataField={'LabelVal'} caption={'Label'} dataType={'string'} width={'120px'} visible={true} allowEditing={false} alignment='center' format='MMM-dd-yyyy'
                                                        />
                                                        <Column
                                                            dataField={'Country'} caption={'Country'} dataType={'string'} width={'120px'} visible={true} allowEditing={false}//alignment={item.alignment}
                                                        />
                                                        <Column
                                                            dataField={'ParentMarket'} caption={'Parent Market'} dataType={'string'} minWidth={'120px'} visible={true} allowEditing={false} //alignment={item.alignment}
                                                        />
                                                        <Column
                                                            dataField={'DeepDive'} caption={'NPL T6'} dataType={'boolean'} visible={true} allowEditing={false} width={'120px'} //alignment={item.alignment}
                                                            // cellRender={e=>e.DeepDive ==true ? 'Yes' : 'No'}
                                                            cellRender={e => this.ActionT6Col(e)}
                                                        />
                                                        <Column
                                                            dataField={'PackSize'} caption={'Pack Size'} dataType={'string'} width={'120px'} visible={true}
                                                            alignment='center'
                                                            cellRender={e => this.ActionColumn(e, 'textbox')}
                                                            //cellRender={e => this.PackSizeOnchange(e, e?.data)}
                                                            allowEditing={true}
                                                        />
                                                        <Column
                                                            dataField={'Parent'} caption={'Parent Project Plan'} dataType={'string'} minWidth={'120px'} visible={false} allowEditing={false} //alignment={item.alignment}
                                                        />
                                                        <Column
                                                            dataField={'Market'} caption={'Market'} dataType={'string'} width={'120px'} visible={false} allowEditing={false}//alignment={item.alignment}
                                                        />
                                                        {/* <RequiredRule message={'Test'}/>
                                    <PatternRule message={'Please do not enter special characters'} pattern={/^[0-9;]*$/g}>
                                    </PatternRule> */}

                                                    </DataGrid>
                                                </div>
                                            </div>
                                        </AccordionTab>
                                    </Accordion>
                                </Col>
                            </Row>
                        </div>

                    </Dialog>

                    <Dialog header={"Add new label"}
                        closable={false}
                        visible={this.state.addLabelFlag}
                        style={{ height: '25vh', width: '46vw' }}
                        onHide={this.labelClose}
                        icons={this.viewDialogIconLabel}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className='label-name'>Label Name:</span>
                            <InputText className='label-name-ip' value={this.state.labelNameRaw} onChange={this.setRawLabelName}></InputText>
                        </div>
                    </Dialog>

                    {/* Alert Message popup */}
                    <Dialog
                        header={this.state.IsDelete ? "Confirm Delete?" : "Alert"}
                        closable={false}
                        visible={this.state.showSystemMsg}
                        style={{ height: '30vh', width: '30vw' }}
                        onHide={() => this.setState({ showSystemMsg: false })}
                        icons={this.viewDialogAlert}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className='label-name' style={{ color: "black" }}>
                                {this.state.systemMsg}
                            </span>
                        </div>
                    </Dialog>
                </>
                : <></>
        )
    }
}