import * as React from 'react';
import 'office-ui-fabric-react/dist/css/fabric.css';
import '../MileStoneData.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import { useState, useRef, useCallback, useEffect } from 'react';
import ProductPages from './ProductPages';
import ProjectList from '../ProjectList/ProjectList';
import { IProjectListStatesType } from '../ProjectList/IProjectListProps';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { format } from "date-fns";
import { DataService } from '../../Shared/DataService';
import LoadSpinner from '../../LoadSpinner/LoadSpinner';

export default function ProductForm(props) {
    const toast = useRef(null);
    let saveFlagRef = useRef(true);
    let programIdRef = useRef('00');
    const [mode, setMode] = useState('Create');
    // const [isActiveProgram, setIsActiveProgram] = useState(null);

    // const [activeTab, setActiveTab] = useState((props.relatedPlans?.length > 0
    //     && props.projectName != null) ? 'QuadViewBtn' : 'AccomplishmentsBtn');

    const [activeTab, setActiveTab] = useState(props.openCreateRiskWindow ?
        'RiskAssessmentsBtn' : (props.relatedPlans?.length > 0 && props.projectName != null) ?
            'QuadViewBtn' : 'AccomplishmentsBtn');

    const [showModifiedWarning, setShowModifiedWarning] = useState(false);
    const [pgsReadiness, setPGSReadiness] = React.useState(null);

    const [launchStatusValue, setLaunchStatus] = React.useState(null);
    const [launchProgressValue, setLaunchProgress] = React.useState(null);
    const [resourceStatusValue, setResourceStatus] = React.useState(null);
    const [riskStatusValue, setRiskStatus] = React.useState(null);
    const [fixState, setFixState] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false);

    const [isAllDataLoaded, setIsAllDataLoaded] = React.useState<boolean>(false)

    let launchStatusOptionsList = null;
    let launchProgressOptionsList = null;
    let resourceStatusOptionsList = null;
    let riskStatusOptionsList = null;
    let LStatus = null;
    let LProgress = null;
    let ResourceStatus = null;
    let RistStatus = null;
    let readinessDate = null;
    let modifiedRelatedPlans: any[];

    if (props.NPL_modifiedProjects?.length > 0 && props.relatedPlans?.length) {
        modifiedRelatedPlans = props.relatedPlans.map((item) => {
            for (let i = 0; i < props.NPL_modifiedProjects.length; i++) {
                if (props.NPL_modifiedProjects[i].Title === item.Title) {
                    return ({
                        ...item,
                        'DeepDive': props.NPL_modifiedProjects[i].NPLT6Change,
                    })
                }
            }
            return item;
        })
    } else {
        modifiedRelatedPlans = props.relatedPlans;
    }

    let PPDataRef = useRef({
        opened: false,
        accomData: [],
        accomIndex: 0,
        milestoneData: [],
        activityData: [],
        activityIndex: 0,
        riskAssessmentData: [],
        riskAssessmentIndex: 0,
        activePlanId: props.projectItemID
    });

    let keyProdRef = useRef({
        'prodImg': [],
        'keyProdComments': ''
    });

    const [projectListStates, setProjectListStates] = useState({
        filterOpen: false,
        multiSelect: false,
        selectedItem: (props.SwitchedProjectPlan != "All" && props.SwitchedProjectPlan) ?
            modifiedRelatedPlans.filter(obj => {
                if (props.SwitchedProjectPlan === obj.Title) {
                    PPDataRef.current['activePlanId'] = obj.ID;
                    return true;
                } else {
                    return false;
                }
            })[0]
            :
            props.projectName ? modifiedRelatedPlans.filter(obj => {
                if (props.NPL_modifiedProjects?.length > 0) {
                    if (props.NPL_modifiedProjects[0].Title === obj.Title) {
                        PPDataRef.current['activePlanId'] = obj.ID;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return props.projectGuid === obj.Title
                }
            })[0] : { 'ProjectName': 'All' },
    });

    const isProjectPlanModified = (): boolean => {
        if (PPDataRef.current.accomData.some(obj => (obj.IsModified == true))) {
            return true;
        } else if (PPDataRef.current.activityData.some(obj => (obj.IsModified == true))) {
            return true;
        } else if (PPDataRef.current.riskAssessmentData.some(obj => (obj.IsModified == true))) {
            return true;
        } else {
            return false;
        }
    }

    const toastNoprojectPlanSwitch = () => {
        toast.current.show({
            severity: 'warn',
            summary: 'info',
            detail: 'You have unsaved changes. Please save it before switching project plan.',
            life: 5000
        });
    }

    const toastNPLModifiedProjectPlanSwitch = () => {
        toast.current.show({
            severity: 'warn',
            summary: 'info',
            detail: 'You have made modifications to NPL T6 value. Please save it before switching project plan.',
            life: 5000
        });
    }

    const handleChange = (args: IProjectListStatesType) => {
        if (args.filterOpen == null) {
            if (props.NPL_modifiedProjects_Status == "MODIFIED") {
                toastNPLModifiedProjectPlanSwitch()
            } else if (isProjectPlanModified()) {
                toastNoprojectPlanSwitch()
            } else if (props.openCreateRiskWindow) {
                setActiveTab('QuadViewBtn')
            }
            else {
                PPDataRef.current['accomData'] = [];
                PPDataRef.current['milestoneData'] = [];
                PPDataRef.current['activityData'] = [];
                PPDataRef.current['riskAssessmentData'] = [];
                PPDataRef.current['activePlanId'] = args.selectedItem?.ID;

                if (args.selectedItem?.ProjectName === 'All') setActiveTab('AccomplishmentsBtn')
                else setActiveTab('QuadViewBtn')
                setProjectListStates(prevState => ({
                    ...prevState,
                    ...args,
                    filterOpen: false,
                }));
                
                // props.clearNPL_modifiedProjects()
                //props.updateSwitchedProjectPlan(args.selectedItem?.Title);
                props.updateSwitchedProjectPlan(args.selectedItem);
            }
        } else {
            if (args.selectedItem?.ProjectName === 'All') {
                setActiveTab('AccomplishmentsBtn')
            }
            setProjectListStates(prevState => ({
                ...prevState,
                ...args,
                // filterOpen: false,
            }));
            // props.clearNPL_modifiedProjects()
        }
    }

    const ProjectPlanModifiedDialog = (): JSX.Element => {
        return (
            <Dialog
                visible={showModifiedWarning}
                onHide={() => setShowModifiedWarning(false)}>
                <p className="m-0">
                    You have unsaved changed. Please save the changes.
                </p>
            </Dialog>
        )
    }

    const getProjectInfo = (projectID) => {
        if (projectID) {
            DataService.fetchAllItemsGenericFilter_NPL_Digital_Apps('PGS_Common_ProjectList',
                'LaunchStatus,LaunchProgress,ResourceStatus,PGSReadiness,Title,Risk_x002f_IssueStatus,TaskFinishDate',
                `Title eq '${projectID}'`, 'TaskFinishDate')
                .then((data) => {
                    if (data != undefined) {
                        if (data.length > 0) {
                            if (data[0].LaunchStatus && (launchStatusOptionsList['options']
                                ?.filter(x => x.id === data[0].LaunchStatus).length > 0)) {
                                LStatus = launchStatusOptionsList['options']
                                    .filter(x => x.id === data[0].LaunchStatus)[0];
                            }

                            if (data[0].LaunchProgress && (launchProgressOptionsList['options']
                                ?.filter(x => x.Key === data[0].LaunchProgress).length > 0)) {
                                LProgress = launchProgressOptionsList['options']
                                    .filter(x => x.Key === data[0].LaunchProgress)[0];
                            }

                            if (data[0].Risk_x002f_IssueStatus && (riskStatusOptionsList['options']
                                ?.filter(x => x.id === data[0].Risk_x002f_IssueStatus).length > 0)) {
                                RistStatus = riskStatusOptionsList['options']
                                    .filter(x => x.id === data[0].Risk_x002f_IssueStatus)[0];
                            }

                            if (data[0].ResourceStatus && (resourceStatusOptionsList['options']
                                ?.filter(x => x.id === data[0].ResourceStatus).length > 0)) {
                                ResourceStatus = resourceStatusOptionsList['options']
                                    .filter(x => x.id === data[0].ResourceStatus)[0];
                            }

                            if (data[0].TaskFinishDate) {
                                let pgsDate = new Date(data[0].TaskFinishDate);
                                readinessDate = format(pgsDate, 'MMM-dd-yyyy');
                                setPGSReadiness(readinessDate);
                            }
                        }
                    }
                }).then(() => {
                    setLaunchStatus({ ...LStatus });
                    setLaunchProgress({ ...LProgress });
                    setRiskStatus({ ...RistStatus });
                    setResourceStatus({ ...ResourceStatus });
                }).catch(e => console.log(e))
        }
    };

    const getAccomplishments = () => {
        const projectPlanId = projectListStates.selectedItem.ID;
        try {
            DataService.fetchFilteredItemsAndSelectAttachments_NPL_Digital_Apps('PGS_Executive_Accomplishments',
                'ProjectID', projectPlanId, 'AttachmentFiles', 'Modified', modifiedRelatedPlans).then(items => {
                    items.map((item, index) => {
                        item['index'] = index;
                        item['AttachmentData'] = item['AttachmentFiles'];
                        item['IsModified'] = false;
                        item['DeletedAttachmentData'] = [];
                        item['NewAttachmentData'] = [];
                    });
                    let obj = PPDataRef.current;
                    obj['accomData'] = items;
                    obj['accomIndex'] = items.length;
                    PPDataRef.current = obj;
                    setFixState(prev => prev + 1)
                }).catch(error => {
                    let errorMsg = {
                        Source: 'ProductForm-getAccomplishments-fetchItemsBasedOnFilterCond',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    });
                });
        } catch (error) {
            let errorMsg = {
                Source: 'ProductForm-getAccomplishments',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const getActivities = () => {
        const projectPlanId = projectListStates.selectedItem.ID;
        try {
            DataService.fetchFilteredItemsAndSelectAttachments_NPL_Digital_Apps('PGS_Executive_Activities',
                'ProjectID', projectPlanId, 'AttachmentFiles', 'Modified', modifiedRelatedPlans)
                .then(items => {
                    items = items.filter(rec => !rec.IsAccomplishment);
                    items.map((item, index) => {
                        item['index'] = index;
                        item['AttachmentData'] = item['AttachmentFiles'];
                        item['IsModified'] = false;
                        item['DeletedAttachmentData'] = [];
                        item['NewAttachmentData'] = [];
                    });
                    let obj = PPDataRef.current;
                    obj['activityData'] = items;
                    obj['activityIndex'] = items.length;
                    PPDataRef.current = obj;
                }).catch(error => {
                    let errorMsg = {
                        Source: 'ProductForm-getActivities-fetchItemsBasedOnFilterCond',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    });
                });
        } catch (error) {
            let errorMsg = {
                Source: 'ProductForm-getActivities',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const getRiskAssessments = () => {
        const projectPlanId = projectListStates.selectedItem.ID;
        try {
            DataService.fetchFilteredItemsAndSelectAttachments_NPL_Digital_Apps('PGS_Executive_Risks',
                'ProjectID', projectPlanId, 'AttachmentFiles', 'Modified', modifiedRelatedPlans).then(items => {
                    items.map((item, index) => {
                        item['index'] = index;
                        item['AttachmentData'] = item['AttachmentFiles'];
                        item['IsModified'] = false;
                        item['DeletedAttachmentData'] = [];
                        item['NewAttachmentData'] = [];
                    });
                    let obj = PPDataRef.current;
                    obj['riskAssessmentData'] = items;
                    obj['riskAssessmentIndex'] = items.length;
                    obj['deletedRiskAssessment'] = [];

                    if (props.NPL_modifiedProjects && props.NPL_modifiedProjects?.length > 0 &&
                        obj['riskAssessmentData'] && obj['riskAssessmentData'].length > 0) {
                        for (let i = 0; i < props.NPL_modifiedProjects.length; i++) {
                            if (!props.NPL_modifiedProjects[i].NPLT6Change) {
                                obj['riskAssessmentData'] = obj['riskAssessmentData'].map(item => {
                                    return {
                                        ...item,
                                        DeepDive: false,
                                    }
                                })
                            }
                        }
                    }
                    PPDataRef.current = obj;
                }).catch(error => {
                    let errorMsg = {
                        Source: 'ProductForm-getRiskAssessments-fetchItemsBasedOnFilterCond',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    });
                });
        } catch (error) {
            let errorMsg = {
                Source: 'ProductForm-getRiskAssessments',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const getStatusValues = () => {
        let statusUrl = DataService.NPLDigitalApps_Url + `/_api/web/lists/GetByTitle('Config')/Items?$select=Title,Value,Options'`;
        return fetch(statusUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                if (data.value.length > 0) {
                    let status = data.value.filter(x => x.Title === 'LaunchStatus')[0];
                    let options = status['Options'].replace(/\n/gi, '');
                    let LaunchStatus = {
                        name: status.Title,
                        id: status.Value,
                        options: JSON.parse(options)
                    };
                    // setLaunchStatusList({ ...LaunchStatus });
                    launchStatusOptionsList = LaunchStatus;

                    status = data.value.filter(x => x.Title === 'LaunchProgress')[0];
                    options = status['Options'].replace(/\n/gi, '');
                    let LaunchProgress = {
                        name: status.Title,
                        id: status.Value,
                        options: JSON.parse(options)
                    };
                    // setLaunchProgressList({ ...LaunchProgress });
                    launchProgressOptionsList = LaunchProgress;

                    status = data.value.filter(x => x.Title === 'ResourceStatus')[0];
                    options = status['Options'].replace(/\n/gi, '');
                    let ResourceStatus = {
                        name: status.Title,
                        id: status.Value,
                        options: JSON.parse(options)
                    };
                    // setResourceStatusList({ ...ResourceStatus });
                    resourceStatusOptionsList = ResourceStatus;

                    status = data.value.filter(x => x.Title === 'RiskStatus')[0];
                    options = status['Options'].replace(/\n/gi, '');
                    let RiskStatus = {
                        name: status.Title,
                        id: status.Value,
                        options: JSON.parse(options)
                    };
                    // setRiskStatusList({ ...RiskStatus });
                    riskStatusOptionsList = RiskStatus;
                }
            });
    };

    const getMilestonesData = () => {
        const projectPlanGUID = projectListStates.selectedItem.Title;
        try {
            let promisesArray;
            if (projectPlanGUID) {
                //if any specific plan is selected, then get array of 1 promise
                promisesArray = [DataService.fetchMilestonesForProjectPlan(projectPlanGUID, [])]
            } else {
                //split the related plans array into chunks
                let size = 10; let arrayOfArrays = [];
                for (let i = 0; i < modifiedRelatedPlans.length; i += size) {
                    arrayOfArrays.push(modifiedRelatedPlans.slice(i, i + size));
                }
                //When 'All' is selected, get array of promises (using .map method)
                promisesArray = arrayOfArrays.map(eachArray =>
                    DataService.fetchMilestonesForProjectPlan(null, eachArray))
            }

            Promise.all(promisesArray)
                .then((items) => {
                    //flatten the array of arrays from promise.all response
                    let flattenedArray = [];
                    for (let i = 0; i < items.length; i++) {
                        flattenedArray.push(...items[i].value)
                    }
                    //sorting the data in asc based on 'TaskFinishDate'
                    flattenedArray.sort((a, b) =>
                        new Date(a.TaskFinishDate).getTime() - new Date(b.TaskFinishDate).getTime());
                    PPDataRef.current['milestoneData'] = flattenedArray;
                }).catch(e => {
                    console.log(e)
                })
        } catch (error) {
            let errorMsg = {
                Source: 'ProductForm-getMilestonesData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const getAllExeAppData = async () => {
        try {
            setIsLoading(true);
            Promise.all([
                getRiskAssessments(),
                getActivities(),
                getAccomplishments(),
                getMilestonesData(),
                getStatusValues()
                // .then(async () => await getProjectInfo(projectListStates.selectedItem.Title))
            ]).then(() => {
                setIsAllDataLoaded(true);
                setIsLoading(false);
                getProjectInfo(projectListStates.selectedItem.Title);
            }).catch(error => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
        } catch (error) {
            let errorMsg = {
                Source: 'Product Form-getAllExeAppData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    const handleProductPagesUnmount = useCallback((ppData) => {
        try {
            let obj = ppData;
            obj.opened = true;
            PPDataRef.current = obj;
            saveFlagRef.current = false;
            props.onUnmount(PPDataRef.current);
        } catch (error) {
            let errorMsg = {
                Source: 'Product Form-handleProductPagesUnmount',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }, []);

    useEffect(() => {
        PPDataRef.current = props.ExeAppData;
        setMode(props?.formType);
        getStatusValues().catch(e => console.log(e))
    }, []);

    useEffect(() => {
        if (props?.formType == 'Edit' || props?.formType == 'View') {
            getAllExeAppData().catch(error => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
        }
    }, [projectListStates.selectedItem]);

    useEffect(() => {
        if (PPDataRef.current['opened'] === false)
            getAllExeAppData().catch(e => console.log(e))
    }, [props]);

    return (
        <React.Fragment>
            <LoadSpinner isVisible={isLoading} label='Please wait...' />
            <ProjectPlanModifiedDialog />
            <Toast ref={toast} position="bottom-right" />
            {isAllDataLoaded && <ProjectList
                key={String(projectListStates.filterOpen)}
                relatedPlans={modifiedRelatedPlans}
                projectListStates={projectListStates}
                handleChange={handleChange}
                NPL_modifiedProjects={props.NPL_modifiedProjects}
                NPL_modifiedProjects_Status={props.NPL_modifiedProjects_Status}
                toastNPLModifiedProjectPlanSwitch={toastNPLModifiedProjectPlanSwitch}
                DRID={props.DRID}
            >
                <div style={{ paddingTop: "0rem", paddingBottom: "1rem", paddingRight: "1rem" }}>
                    <ProductPages
                        updateAutoOpenCreateRisk={props.updateAutoOpenCreateRisk}
                        autoOpenRiskItemId={props.autoOpenRiskItemId}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        openCreateRiskWindow={props.openCreateRiskWindow}
                        // isActiveProgram={isActiveProgram}
                        programMode={mode}
                        ParentID={programIdRef.current}
                        PPData={PPDataRef.current}
                        keyProdData={keyProdRef.current}
                        saveFlag={saveFlagRef.current}
                        siteURL={props.siteUrl}
                        selectedProject={projectListStates.selectedItem}
                        onUnmount={handleProductPagesUnmount}
                        key={JSON.stringify(projectListStates.selectedItem.ProjectName)}
                        pgsReadiness={pgsReadiness}
                        launchStatus={launchStatusValue}
                        launchProgress={launchProgressValue}
                        resourceStatus={resourceStatusValue}
                        riskStatus={riskStatusValue}
                        fixState={fixState}
                        planRecords={props.planRecords}
                        SelectedView={props.SelectedView}
                        ProductName={props.ProductName}
                    />
                </div>
            </ProjectList>}
        </React.Fragment>
    );
}