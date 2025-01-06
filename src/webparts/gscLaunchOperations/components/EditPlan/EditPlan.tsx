import * as React from 'react';
import { IEditPlanProps, IEditPlanState } from './IEditPlanProps';
import { TabPanel, TabView } from 'primereact/tabview';
import { DataService } from '../Shared/DataService';
import 'office-ui-fabric-react/dist/css/fabric.css';
import './MileStoneData.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
// import ProgramData from './ProgramData/ProgramData';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
// import DataRepositoryTab from './DataRepository/DataRepositoryTab';
// import ProductForm from './ProductForm/ProductForm';
import ProjectPlan from './ProjectPlan/ProjectPlan';
// import Verification from './Verification/Verification';
//import { sp } from '@pnp/sp/presets/all';
import { IAttachmentFileInfo } from "@pnp/sp/attachments";
import LoadSpinner from '../LoadSpinner/LoadSpinner';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { IWebEnsureUserResult } from "@pnp/sp/site-users/";
// import NPLT6Dashboard from './NPLT6Dashboard/NPLT6Dashboard';
import GetDeepDiveMilestonesAndRiskAssessments from './NPLT6Dashboard/GetDeepDiveMilestonesAndRiskAssessments';
// import { Message } from 'primereact/message';

export default class EditPlan extends React.Component<IEditPlanProps, IEditPlanState>
{
    private ExeAppData: any;
    private FilesDataRef: any;
    private isProgramDataModified = false;
    private ProjectPlanTabDataRef: any;
    public toast: Toast;

    public constructor(props: IEditPlanProps, public state: IEditPlanState) {
        super(props);
        this.state = {
            isWindowClosed: false,
            activeTabIndex: 0,
            showDialog: false,
            showConcurrentEditDialog: false,
            formFields: [],
            programData: { forecastImageDelete: false },
            DRID: null,
            DRdetails: null,
            relatedPlans: [],
            riskTrendOptions: [],
            relatedProjectPlans: [],
            PlanViewRecords: this.props.plansResults,
            DisableVerificationTab: false,
            isLoading: false,
            projectPlanUpdates: [], //changes kelkap - added proejctPlan state
            counter: 0,
            launchreadiness: [],
            supplyContinuity: [],
            NPL_modifiedProjects: [],
            NPL_modifiedProjects_Status: "NOT MODIFIED",
            cnfrmSaveDialog: false,
            currentSelectedProject: null,
            SwitchedProjectPlan: null,
            LaunchXListData: {},
            launchXMarketSiteAllRecords: [],
            launchXMarketSiteArray: [],
            BSCDataAll: [],
            PPRiskAssessmentsAll: [],
            ProjectCenterPlans: [],
            ExeAppRisks: [],
            RiskAssRecords: [],
            legendColors: {},
            SwitchedProjectPlanName: null,
            isT6DashboardVisible: false,
        };
        this.ExeAppData = React.createRef();
        this.handleProgramDataFieldChange = this.handleProgramDataFieldChange.bind(this);
        this.handleDialogSaveClose = this.handleDialogSaveClose.bind(this);
        this.handleVerificationChange = this.handleVerificationChange.bind(this);
        this.updateNplT6CheckedUnchecked = this.updateNplT6CheckedUnchecked.bind(this);
        // this.clearNPL_modifiedProjects = this.clearNPL_modifiedProjects.bind(this);
        this.updateSwitchedProjectPlan = this.updateSwitchedProjectPlan.bind(this);

        this.FilesDataRef = React.createRef();
        this.FilesDataRef.current = {
            'DDForecastImg': []
        }

        this.ProjectPlanTabDataRef = React.createRef();
    }

    private checkIsAnyProjectDataModifiedWhenDialogClose = () => {
        if (this.ExeAppData?.current) {
            if (this.ExeAppData.current.accomData.some(obj => (obj.IsModified == true))) {
                return true;
            } else if (this.ExeAppData.current.activityData.some(obj => (obj.IsModified == true))) {
                return true;
            } else if (this.ExeAppData.current.riskAssessmentData.some(obj => (obj.IsModified == true))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private checkIsAnyProjectDataModified = (event) => {
        let returnValue;
        if (event.index !== 3 && this.ExeAppData?.current) {
            if (this.ExeAppData.current.accomData.some(obj => (obj.IsModified == true))) {
                returnValue = true;
            } else if (this.ExeAppData.current.activityData.some(obj => (obj.IsModified == true))) {
                returnValue = true;
            } else if (this.ExeAppData.current.riskAssessmentData.some(obj => (obj.IsModified == true))) {
                returnValue = true;
            } else {
                returnValue = false;
            }
        }

        if (returnValue === true) {
            this.toast?.show({
                severity: 'warn',
                summary: 'info',
                detail: 'You have unsaved changes. Please save it before switching tab.',
                life: 5000
            });
            return false
        } else {
            return true
        }
    }

    //newly added
    // private handleExeAppUnmount = ((ppData) => {
    //     try {
    //         this.ExeAppData.current = ppData;
    //     } catch (error) {
    //         let errorMsg = {
    //             Source: 'Product Form-handleExeAppUnmount',
    //             Message: error.message,
    //             StackTrace: new Error().stack
    //         };
    //         DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
    //             console.error(error);
    //         });
    //     }
    // });

    //newly added
    private handleProjectPlanTabUnmount = ((ppData) => {
        try {
            this.ProjectPlanTabDataRef.current = ppData;
        } catch (error) {
            let errorMsg = {
                Source: 'Product Form-handleProjectPlanTabUnmount',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    });

    handleProgramDataFieldChange(fieldName: string, fieldValue: string): void {
        if (this.props.rowData?.PfizerCode) {
            this.isProgramDataModified = true;
            this.setState(prevState => ({
                programData: {                   // object that we want to update
                    ...prevState.programData,    // keep all other key-value pairs
                    [fieldName]: fieldValue       // update the value of specific key
                }
            }))
        } else {
            this.toast?.show({ severity: 'warn', summary: '', detail: 'PfizeCode is empty. NPLT6 data wont get saved.', life: 3000 });
        }
    }

    //Project Plan Tab - kelkap changes start
    public handleProjectPlan = (changes) => {
        try {
            // console.log('changes came from Project plan:',changes);
            let updatesLocal = [...this.state.projectPlanUpdates];
            let alreadyPresent = updatesLocal.filter(update => update.spID == changes.spID);
            if (alreadyPresent.length == 0) {
                updatesLocal.push(changes);
            } else {
                let idx = updatesLocal.findIndex(a => a.spID == changes.spID);
                updatesLocal[idx] = changes;
            }

            let ProjectPlanData = this.ProjectPlanTabDataRef.current.ProjectPlanData;
            let dlppIndex = ProjectPlanData.findIndex((rec: any) => rec.ProjectGUID == changes.ProjectGUID);
            ProjectPlanData[dlppIndex].DeepDive = changes.DeepDive;

            let VerificationTabData: any = [...this.state.PlanViewRecords];
            let filteredIndex = VerificationTabData.findIndex((rec: any) => changes.ProjectGUID == rec.Title);
            VerificationTabData[filteredIndex].DeepDive = changes.DeepDive;
            VerificationTabData[filteredIndex].IsModified = true;

            this.setState({ projectPlanUpdates: updatesLocal, PlanViewRecords: VerificationTabData }, () => console.log('changes came from Project plan:', this.state.projectPlanUpdates));
            this.ProjectPlanTabDataRef.current.ProjectPlanData = ProjectPlanData;
        } catch (error) {
            let errorMsg = {
                Source: `Edit Plan-handleProjectPlan`,
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                .catch(e => console.log(e))
        }
    }

    public handleVerificationDeepDiveChange = (VerificationData, rowData) => {
        try {
            let VerificationTabData: any = [...VerificationData];
            let filteredIndex = VerificationTabData.findIndex((rec: any) => rowData.Title == rec.Title);

            let ProjectPlanData = this.ProjectPlanTabDataRef.current.ProjectPlanData;
            let dlppIndex = ProjectPlanData.findIndex((rec: any) => rec.ProjectGUID == VerificationTabData[filteredIndex].Title);
            ProjectPlanData[dlppIndex].DeepDive = VerificationTabData[filteredIndex].DeepDive;

            this.setState({
                // projectPlanUpdates: updatesLocal,
                PlanViewRecords: VerificationTabData
            }, () => console.log('changes came from Project plan:', this.state.projectPlanUpdates));
            this.ProjectPlanTabDataRef.current.ProjectPlanData = ProjectPlanData;
        } catch (error) {
            let errorMsg = {
                Source: `Edit Plan-handleProjectPlan`,
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                .catch(e => console.log(e))
        }
    }

    public updateProjectPlan = async () => {
        try {
            let updateBatchDLpp = DataService.NPL_Context.createBatch();//  sp.createBatch();
            let listDLPP = DataService.NPL_Context.lists.getByTitle('DLPPList');

            let updatesLocal = [...this.state.projectPlanUpdates];
            updatesLocal.map(update => {
                let updatesObject = {
                    DeepDive: update.DeepDive,
                    PlanStatus: update.PlanStatus
                };
                listDLPP.items.getById(update.spID).inBatch(updateBatchDLpp).update(updatesObject)
                    .catch(e => console.log(e));
            });
            updateBatchDLpp.execute()
                .then(async (items) => {
                    console.log('Items saved successfully in DLPP List', items);
                    this.setState({ projectPlanUpdates: [] });
                    //this.getDLPPListData(updatesLocal[0]['DRID']);
                    this.getDLPPListData(this.props?.rowData?.DRID);
                }).catch(error => {
                    console.log("Error while saving plans data", error);
                });

        } catch (error) {
            let errorMsg = {
                Source: `Product Form-saveProductPagesData - error while updating verification records`,
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                .catch(e => console.log(e))
        }
    }

    // - kelkap changes end

    //verification tab
    handleVerificationChange(fieldValue: []): void {
        this.setState(prevState => ({
            ...prevState,
            PlanViewRecords: fieldValue
        }))
    }

    updateNplT6CheckedUnchecked(nplT6Checked) {
        this.setState({
            NPL_modifiedProjects: nplT6Checked,
            NPL_modifiedProjects_Status: "MODIFIED"
        })
    }

    // clearNPL_modifiedProjects() {
    //     this.setState({
    //         NPL_modifiedProjects: [],
    //     })
    // }

    updateSwitchedProjectPlan(switchedProjectName) {
        this.setState({
            SwitchedProjectPlan: switchedProjectName?.Title,
            SwitchedProjectPlanName: switchedProjectName?.ProjectName
        });
    }

    addOrUpdateItemAttachment = async (action: "New" | "Update", itemId: number) => {
        if (action === "Update" && this.state.programData?.AttachmentFiles?.length > 0 &&
            this.FilesDataRef.DDForecastImg && this.FilesDataRef.DDForecastImg[0]) {
            console.log("delete exisiting image and add new one");
            await DataService.NPLDigitalApps_Context.getFileByServerRelativeUrl(this.state.programData?.AttachmentFiles[0]?.ServerRelativeUrl)
                .delete()
                .then(async res => {
                    if (this.FilesDataRef.DDForecastImg[0]['name'] && !this.state.programData.forecastImageDelete) {
                        await DataService.NPLDigitalApps_Context.lists.getByTitle('GLO_ProductProjectDetails').items
                            .getById(itemId).attachmentFiles
                            .add(this.FilesDataRef?.DDForecastImg?.[0]['name'],
                                this.FilesDataRef.DDForecastImg?.[0])
                            .then(async res1 => {
                                console.log("file added as attachment");
                                console.log(res1);
                            }).catch(error => {
                                let errorMsg = {
                                    Source: `Product Form-handlesave - add attachment - ${this.FilesDataRef.DDForecastImg[0]['name']}`,
                                    Message: error.message,
                                    StackTrace: new Error().stack
                                };
                                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                                    console.error(error);
                                });
                            });
                    }
                }).catch(error => {
                    let errorMsg = {
                        Source: 'Product Form-handlesave -  delete file',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    });
                })
            this.fetchProgramData().catch(e => console.log(e));
        }
        else if (this.FilesDataRef.DDForecastImg &&
            this.FilesDataRef.DDForecastImg[0] &&
            this.FilesDataRef.DDForecastImg[0]['name']) {
            console.log("create a new attachment -- nothing to delete");
            await DataService.NPLDigitalApps_Context.lists.getByTitle('GLO_ProductProjectDetails').items
                .getById(itemId).attachmentFiles
                .add(this.FilesDataRef.DDForecastImg[0]['name'],
                    this.FilesDataRef.DDForecastImg[0])
                .then(async res1 => {
                    console.log("file added as attachment");
                    console.log(res1);
                }).catch(error => {
                    let errorMsg = {
                        Source: `Product Form-handlesave - add attachment - ${this.FilesDataRef.DDForecastImg[0]['name']}`,
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    });
                });
        }
        else if (action === "Update" &&
            this.state.programData?.AttachmentFiles?.length > 0 &&
            this.state.programData?.forecastImageDelete) {
            await DataService.NPLDigitalApps_Context.getFileByServerRelativeUrl(this.state.programData?.AttachmentFiles[0]?.ServerRelativeUrl)
                .delete()
                .then(async res => {
                    console.log(res);
                }).catch(error => {
                    let errorMsg = {
                        Source: 'Product Form-handlesave -  delete file',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    });
                })
        }
        this.fetchProgramData().catch(e => console.log(e));
    }

    public handleDialogSaveClose = async (actionType: "Save" | "Close") => {
        if (actionType === "Save" && this.state.DRID) {
            // this.setState({ isLoading: true, NPL_modifiedProjects: [] });
            this.setState({ isLoading: true });

            if (this.isProgramDataModified ||
                (this.props.rowData?.PfizerCode && this.FilesDataRef.DDForecastImg?.length > 0)) {
                const user: IWebEnsureUserResult = await DataService.NPLDigitalApps_Context.ensureUser(this.state.programData?.PGSLeadersEMail);
                DataService.fetchAllItemsGenericFilter_NPL_Digital_Apps('GLO_ProductProjectDetails', 'Id,DRID,PfizerCode',
                    `DRID eq '${this.state.DRID}' or PfizerCode eq '${this.props.rowData?.PfizerCode}'`, 'ID')
                    .then(result => {
                        if (result?.length === 0) {
                            //item don't exist, so create new item
                            DataService.addItemsToList_NPL_Digital_Apps('GLO_ProductProjectDetails',
                                {
                                    Category: "Product",
                                    ProductSource: "DR",
                                    COGSNetPrice: String(this.state.programData?.COGSNetPrice || ""),
                                    DRID: String(this.state.DRID || ""),
                                    LaunchReadinessComments: String(this.state.programData?.LaunchReadinessComments || ""),
                                    LaunchReadinessStatus: String(this.state.programData?.LaunchReadinessStatus || ""),
                                    SupplyContinuityRisk: String(this.state.programData?.SupplyContinuityRisk || ""),
                                    SupplyContinuityRiskComments: String(this.state.programData?.SupplyContinuityRiskComments || ""),
                                    PGSLeadersId: this.state.programData?.PGSLeadersEMail ?
                                        user.data.Id.toString() : null,
                                    PGSLeadersEMail: this.state.programData?.PGSLeadersEMail,
                                    RiskTrend: String(this.state.programData?.RiskTrend || ""),
                                    PfizerCode: this.props.rowData?.PfizerCode,
                                }
                            ).then(res => {
                                this.addOrUpdateItemAttachment("New", res.data.ID)
                                    .catch(e => {
                                        console.log(e);
                                        let errorMsg = {
                                            Source: `new item add - for program data`,
                                            Message: e.message,
                                            StackTrace: new Error().stack
                                        };
                                        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                            .catch(e => console.log(e))
                                    })
                            })
                                .catch((error) => {
                                    alert('error async call')
                                    console.error(error);
                                    let errorMsg = {
                                        Source: `Product Form-saveProductPagesData - error while adding Program Data`,
                                        Message: error.message,
                                        StackTrace: new Error().stack
                                    };
                                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                        .catch(e => console.log(e))
                                })
                        } else {
                            //item exist, so update exisitng item
                            DataService.updateItemInList_NPL_Digital_Apps('GLO_ProductProjectDetails',
                                result[0].Id,
                                {
                                    Category: "Product",
                                    ProductSource: "DR",
                                    COGSNetPrice: String(this.state.programData?.COGSNetPrice || ""),
                                    DRID: String(this.state.DRID || ""),
                                    LaunchReadinessComments: String(this.state.programData?.LaunchReadinessComments || ""),
                                    LaunchReadinessStatus: String(this.state.programData?.LaunchReadinessStatus || ""),
                                    SupplyContinuityRisk: String(this.state.programData?.SupplyContinuityRisk || ""),
                                    SupplyContinuityRiskComments: String(this.state.programData?.SupplyContinuityRiskComments || ""),
                                    PGSLeadersId: this.state.programData?.PGSLeadersEMail ?
                                        user.data.Id.toString() : null,
                                    PGSLeadersEMail: this.state.programData?.PGSLeadersEMail,
                                    RiskTrend: String(this.state.programData?.RiskTrend || ""),
                                    PfizerCode: this.props.rowData?.PfizerCode,
                                }
                            )
                                .then(() => {
                                    this.addOrUpdateItemAttachment("Update", result[0].Id)
                                        .catch(e => console.log(e))
                                })
                                .catch((error) => {
                                    alert('error async call')
                                    console.error(error);
                                    let errorMsg = {
                                        Source: `Product Form-saveProductPagesData - error while adding Program Data`,
                                        Message: error.message,
                                        StackTrace: new Error().stack
                                    };
                                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                        .catch(e => console.log(e))
                                })
                        }
                    }).catch(e => console.log(e))
            }

            // update verification items
            await this.updateVerificationRecods();
            await this.updateProjectPlan();
            // save executive tab data
            //this.ExeAppData.current
            let productPagesData = this.ExeAppData.current;
            console.log(productPagesData);
            let batchRes = [];
            let PPTabsToSave = [
                { data: 'activityData', reduxStateName: 'PPActivities', deletedListName: 'PGS_Executive_Activities_Deleted', listName: 'PGS_Executive_Activities' },
                { data: 'accomData', reduxStateName: 'PPAccomplishments', deletedListName: 'PGS_Executive_Accomplishments_Deleted', listName: 'PGS_Executive_Accomplishments' },
                { data: 'riskAssessmentData', reduxStateName: 'PPRiskAssessments', deletedListName: 'PGS_Executive_Risks_Deleted', listName: 'PGS_Executive_Risks' }
            ];

            await PPTabsToSave?.map(async ppType => {
                //let spBatch = sp.createBatch();
                let spBatch = DataService.NPLDigitalApps_Context.createBatch();
                //let spDeleteBatch = sp.createBatch();
                let spDeleteBatch = DataService.NPLDigitalApps_Context.createBatch();
                await productPagesData?.[ppType.data]?.map(async rec => {
                    if (rec.IsModified) {
                        delete rec['index'];
                        delete rec['IsModified'];
                        let attachData = rec?.['NewAttachmentData'];
                        let deletedAttachmentData = rec?.['DeletedAttachmentData'];
                        delete rec?.['NewAttachmentData'];
                        delete rec?.['DeletedAttachmentData'];
                        delete rec?.['AttachmentData'];
                        delete rec?.['AttachmentName'];
                        delete rec?.['AttachmentURL'];
                        delete rec?.['DisplayInDeepDiveQuadView'];
                        delete rec?.['Source'];
                        rec['ProjectIDId'] = productPagesData['activePlanId']
                        if (rec.Id) {
                            if (!rec.IsDeleted) {
                                if (ppType.listName == 'PGS_Executive_Activities' && rec['Status'] == 'Complete') {
                                    rec['IsAccomplishment'] = true;
                                }

                                await DataService.NPLDigitalApps_Context.lists.getByTitle(ppType.listName).items.getById(rec.Id).inBatch(spBatch).update(rec).then(async items => {
                                    if (attachData) {
                                        let attachments: IAttachmentFileInfo[] = [];
                                        attachData?.map(async file => {
                                            attachments.push({
                                                name: file?.name,
                                                content: file
                                            });
                                        });

                                        await DataService.NPLDigitalApps_Context.lists.getByTitle(ppType.listName).items.getById(rec.Id).attachmentFiles.addMultiple(attachments).then(res => {
                                            console.log(res);
                                        }).catch(error => {
                                            let errorMsg = {
                                                Source: `Product Form-saveProductPagesData - error while adding attachemnt`,
                                                Message: error.message,
                                                StackTrace: new Error().stack
                                            };
                                            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                                .catch(e => console.log(e))
                                        });
                                    }
                                    if (ppType.listName === 'PGS_Executive_Activities' && rec['Status'] === 'Complete') {
                                        rec['IsAccomplishment'] = true;
                                        let objToSave = {
                                            'Task': rec['Activity'],
                                            'Date': rec['Date'],
                                            'Active': rec['Active'],
                                            'IsActivity': true,
                                            'ActivityListId': rec.Id,
                                            'ProjectIDId': productPagesData['activePlanId'],
                                            //'IsDeleted': rec['IsDeleted']
                                        };
                                        await DataService.addDatatoList_NPLDigitalApps('PGS_Executive_Accomplishments', objToSave).then(async res => {
                                            if (rec?.AttachmentFiles?.length > 0) {
                                                let attachments: IAttachmentFileInfo[] = [];
                                                rec?.AttachmentFiles?.map(async file => {
                                                    attachments.push({
                                                        name: file?.name,
                                                        content: file
                                                    });
                                                });

                                                await DataService.NPLDigitalApps_Context.lists.getByTitle('PGS_Executive_Accomplishments').items.getById(res['data'].Id).attachmentFiles.addMultiple(attachments).then(resp => {
                                                    console.log(resp);
                                                }).catch(error => {
                                                    let errorMsg = {
                                                        Source: `Product Form-saveProductPagesData - adding activity attachment to accomplishment `,
                                                        Message: error.message,
                                                        StackTrace: new Error().stack
                                                    };
                                                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                                        .catch(e => console.log(e))
                                                });
                                            }
                                        }).catch(async error => {
                                            let errorMsg = {
                                                Source: `Product Form-saveProductPagesData - adding activity entry to accomplishment `,
                                                Message: error.message,
                                                StackTrace: new Error().stack
                                            };
                                            await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg);
                                        });
                                    }
                                    batchRes.push(items);
                                }).catch(async error => {
                                    let errorMsg = {
                                        Source: `Product Form-saveProductPagesData - update ${ppType.listName}`,
                                        Message: error.message,
                                        StackTrace: new Error().stack
                                    };
                                    await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg);
                                });
                                if (deletedAttachmentData) {
                                    await DataService.NPLDigitalApps_Context.lists.getByTitle(ppType.listName).items.getById(rec.Id).attachmentFiles.deleteMultiple(...deletedAttachmentData).then(async resp => {
                                        console.log(resp);
                                    }).catch(async error => {

                                        let errorMsg = {
                                            Source: `Product Form-saveProductPagesData - error while deleting attachemnt`,
                                            Message: error.message,
                                            StackTrace: new Error().stack
                                        };

                                        await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                            .catch(error => {
                                                console.error(error);
                                            })
                                    });
                                    //});
                                }
                            }
                            // delete the records from existing list and add same in deleted list
                            else {
                                await DataService.NPLDigitalApps_Context.lists.getByTitle(ppType.listName).items.getById(rec.Id).inBatch(spBatch).recycle().catch(async error => {
                                    let errorMsg = {
                                        Source: `Product Form-saveProductPagesData - update ${ppType.listName}`,
                                        Message: error.message,
                                        StackTrace: new Error().stack
                                    };
                                    await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg);
                                });
                                // create new 
                                let objToCreate = {};
                                if (ppType.deletedListName == "PGS_Executive_Accomplishments_Deleted") {
                                    objToCreate = {
                                        'Task': rec['Task'],
                                        'Date': rec['Date'],
                                        'Active': rec['Active'],
                                        'ItemID': rec.Id,
                                        'ProjectIDId': productPagesData['activePlanId'],
                                        'DeletedOn': new Date(),
                                        'DeletedById': this.props.currentUser.Id
                                        //'IsDeleted': rec['IsDeleted']
                                    };
                                }
                                else if (ppType.deletedListName == "PGS_Executive_Activities_Deleted") {
                                    objToCreate = {
                                        'Activity': rec['Activity'],
                                        'Date': rec['Date'],
                                        'Active': rec['Active'],
                                        'ItemID': rec.Id,
                                        'ProjectIDId': productPagesData['activePlanId'],
                                        'Status': rec['Status'],
                                        'DeletedById': this.props.currentUser.Id,
                                        'DeletedOn': new Date(),
                                        //'IsDeleted': rec['IsDeleted']
                                    };
                                }
                                else if (ppType.deletedListName == "PGS_Executive_Risks_Deleted") {
                                    objToCreate = {
                                        'RiskTitle': rec['RiskTitle'],
                                        'RiskDate': rec['RiskDate'],
                                        'RiskStatus': rec['RiskStatus'],
                                        'MitigationStatus': rec['MitigationStatus'],
                                        'MitigationDate': rec['MitigationDate'],
                                        'Active': rec['Active'],
                                        'ItemID': rec.Id,
                                        'ProjectIDId': productPagesData['activePlanId'],
                                        'Mitigation': rec['Mitigation'],
                                        'DeletedById': this.props.currentUser.Id,
                                        'DeletedDate': new Date(),
                                        //'IsDeleted': rec['IsDeleted']
                                    };
                                }

                                //delete rec?.['ID'];
                                //delete rec?.['Id'];
                                await DataService.NPLDigitalApps_Context.lists.getByTitle(ppType.deletedListName).items.inBatch(spDeleteBatch).add(objToCreate)
                                    .then(async items => { console.log(items) }).catch(async error => {
                                        let errorMsg = {
                                            Source: `Product Form-saveProductPagesData - update ${ppType.deletedListName}`,
                                            Message: error.message,
                                            StackTrace: new Error().stack
                                        };
                                        await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg);
                                    });
                            }
                        } else {
                            if (ppType.listName == 'PGS_Executive_Activities' && rec['Status'] == 'Complete') rec['IsAccomplishment'] = true;
                            await DataService.NPLDigitalApps_Context.lists.getByTitle(ppType.listName).items.inBatch(spBatch).add(rec).then(async res => {

                                if (ppType.listName == 'PGS_Executive_Activities' && rec['Status'] == 'Complete') {
                                    let objToSave = {
                                        'Task': rec['Activity'],
                                        'Date': rec['Date'],
                                        'Active': rec['Active'],
                                        'IsActivity': true,
                                        'ActivityListId': rec.Id,
                                        'ProjectIDId': productPagesData['activePlanId'],
                                        //'IsDeleted': rec['IsDeleted']
                                    };
                                    await DataService.NPLDigitalApps_Context.lists.getByTitle('PGS_Executive_Accomplishments').items.add(objToSave).then(async res1 => {
                                        // utilService.addDatatoList('PGS_Executive_Accomplishments', objToSave).then(async res1 => {
                                        if (rec?.AttachmentFiles?.length > 0) {
                                            let attachments: IAttachmentFileInfo[] = [];
                                            rec?.AttachmentFiles?.map(async file => {
                                                attachments.push({
                                                    name: file?.name,
                                                    content: file
                                                });
                                            });
                                            //const fileData = await sp.web.getFileByServerRelativeUrl(rec[0]?.['ServerRelativeUrl']).getBuffer();
                                            await DataService.NPLDigitalApps_Context.lists.getByTitle('PGS_Executive_Accomplishments').items.getById(res['data'].Id).attachmentFiles.addMultiple(attachments).then(resp => {
                                                // console.log('moved attachment');
                                            }).catch(error => {
                                                let errorMsg = {
                                                    Source: `Product Form-saveProductPagesData - adding activity attachment to accomplishment `,
                                                    Message: error.message,
                                                    StackTrace: new Error().stack
                                                };
                                                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                                                    console.error(error);
                                                })
                                            });
                                        }
                                    }).catch(async error => {
                                        let errorMsg = {
                                            Source: `Product Form-saveProductPagesData - adding activity entry to accomplishment `,
                                            Message: error.message,
                                            StackTrace: new Error().stack
                                        };
                                        await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                                            console.error(error);
                                        })
                                    });
                                }
                                if (attachData) {
                                    let attachments: IAttachmentFileInfo[] = [];
                                    attachData?.map(async file => {
                                        attachments.push({
                                            name: file?.name,
                                            content: file
                                        });
                                        // await sp.web.lists.getByTitle(ppType.listName).items.getById(res.data.ID).attachmentFiles.inBatch(spBatch).add(file?.name, file).then(res => {                                        
                                    });
                                    await DataService.NPLDigitalApps_Context.lists.getByTitle(ppType.listName).items.getById(res.data.ID).attachmentFiles.addMultiple(attachments).then(res => {
                                        console.log(res);
                                    }).catch(error => {
                                        let errorMsg = {
                                            Source: `Product Form-saveProductPagesData - error while adding attachemnt`,
                                            Message: error.message,
                                            StackTrace: new Error().stack
                                        };
                                        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                                            .catch(e => console.log(e))
                                    });
                                }
                            }).catch(async error => {
                                let errorMsg = {
                                    Source: `Product Form-saveProductPagesData -  add ${ppType.listName}`,
                                    Message: error.message,
                                    StackTrace: new Error().stack
                                };
                                await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                                    console.error(error);
                                })
                            });
                        }
                    }
                });
                await spBatch.execute().then(async res => {
                    console.log('Batch Done ');
                    await spDeleteBatch.execute().then(async resp => {
                        if (ppType['listName'] === 'PGS_Executive_Risks') {

                            setTimeout(() => {
                                this.ExeAppData.current['opened'] = false;
                                this.setState({ counter: this.state.counter + 1 });
                            }, 3000);
                        }
                    });
                }).catch(async error => {
                    let errorMsg = {
                        Source: `Product Form-saveProductPagesData - ${ppType.listName} batch`,
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    })
                });
            });

            let isNPLT6Modified = this.isNPLT6Modified()
            let isConcurrentEditOccured = false;
            if (isNPLT6Modified) {
                isConcurrentEditOccured = await this.checkNPLT6ConcurrentEdit(
                    this.state.LaunchXListData?.['ID'],
                    this.props.rowData?.PfizerCode,
                    this.state.PPRiskAssessmentsAll,
                    this.state.ExeAppRisks,
                    this.state.BSCDataAll,
                    this.state.ProjectCenterPlans
                )
            }

            if (isConcurrentEditOccured) {
                this.setState({ showConcurrentEditDialog: true })
                //Refresh all the NPLT6 Dashboard data (fetching latest items from all the 5 lists related)
                await this.updateAllGridsData().catch(e => console.log(e));
                await this.getBalanceScoreCardDetails().catch(e => console.log(e));
                await this.getRiskAssesments().catch(e => console.log(e));
            } else {            
            // save T6 Dashboard tab data
            //save Common Project list
            let { ProjectCenterPlans } = this.state;
            let ProjCenterPlans = ProjectCenterPlans?.filter(rec => rec.IsModified);
            const commonProjListRec = ProjCenterPlans?.filter(rec => rec.sourceForDD == "CommonList");
            //const GLOWAppBatch = DataService.NPLDigitalApps_Context.createBatch();
            if (commonProjListRec?.length > 0) {
                const commonProjListBatch = DataService.NPLDigitalApps_Context.createBatch();
                await commonProjListRec?.map(async Project => {
                    await DataService.NPLDigitalApps_Context.lists.getByTitle('PGS_Common_ProjectList').items.getById(Project.spID).inBatch(commonProjListBatch).update({ showInNPLT6Report: Project.showInNPLT6Report }).then(rec => {
                        console.log('common Proj List updated : ', rec);
                    }).catch(err => {
                        console.log('Error in adding projects to batch', err);
                    });
                });
                commonProjListBatch.execute().then(rec => {
                    console.log('batch executed');
                    let projectCenterList = ProjectCenterPlans?.filter(rec => rec.sourceForDD == "CommonList");
                    projectCenterList.map(rec => {
                        rec["IsModified"] = false;
                    });
                    let taskRecords = ProjectCenterPlans?.filter(rec => rec.sourceForDD == "Tasks");
                    let AllProjectCenterRecords = [...projectCenterList, ...taskRecords]
                    this.setState({ ProjectCenterPlans: AllProjectCenterRecords });
                }).catch(error => {
                    console.log('Error occured in common list batch ', error);
                    let errorMsg = {
                        Source: 'ProductForm-Common Proj List Batch Update error',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    })
                });
            }
            //save Tasks List            
            const TasksRec = ProjCenterPlans?.filter(rec => rec.sourceForDD == "Tasks");
            if (TasksRec?.length > 0) {
                let TaskBatch = DataService.NPLDigitalApps_Context.createBatch();
                await TasksRec?.map(async Task => {
                    await DataService.NPLDigitalApps_Context.lists.getByTitle('DeepDiveProjectCenterTasks').items.getById(Task.spID).inBatch(TaskBatch).update({ showInNPLT6Report: Task.showInNPLT6Report }).then(rec => {
                        console.log('DeepDiveProjectCenterTasks List updated : ', rec);
                    }).catch(err => {
                        console.log('Error in adding tasks to batch', err);
                    });
                });
                TaskBatch.execute().then(rec => {
                    console.log('Task batch executed');
                    let taskRecords = ProjectCenterPlans?.filter(rec => rec.sourceForDD == "Tasks");
                    taskRecords.map(rec => {
                        rec["IsModified"] = false;
                    });
                    let projectCenterList = ProjectCenterPlans?.filter(rec => rec.sourceForDD == "CommonList");
                    let AllProjectCenterRecords = [...projectCenterList, ...taskRecords]
                    this.setState({ ProjectCenterPlans: AllProjectCenterRecords });
                }).catch(error => {
                    console.log('Error occured in Task list batch ', error);
                    let errorMsg = {
                        Source: 'ProductForm-DeepDive Project Center Tasks Update',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    })
                });
            }

            //save BalanceScoreCardDetails
            let { BSCDataAll } = this.state;
            let BSCDataModified = BSCDataAll?.filter(rec => rec.IsModified);
            if (BSCDataModified?.length > 0) {
                let BSCBatch = DataService.NPD_Context.createBatch();
                await BSCDataModified?.map(async BSC => {
                    await DataService.NPD_Context.lists.getByTitle('BalanceScoreCardDetails').items.getById(BSC.Id).inBatch(BSCBatch).update({ showInNPLT6Report: BSC.showInNPLT6Report }).then(rec => {
                        console.log('BalanceScoreCardDetails List updated : ', rec);
                    }).catch(err => {
                        console.log('Error in adding tasks to batch', err);
                    });
                });
                BSCBatch.execute().then(async rec => {
                    console.log('BSCBatch batch executed');
                    await this.getBalanceScoreCardDetails().catch(e => console.log(e));
                }).catch(error => {
                    console.log('Error occured in Task list batch ', error);
                    let errorMsg = {
                        Source: 'ProductForm-DeepDive BalanceScoreCardDetails Update',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    })
                });
            }
            //save PGS Risks
            let { ExeAppRisks } = this.state;
            const ExeAppRisksList = ExeAppRisks?.filter(rec => rec.IsModified);
            if (ExeAppRisksList?.length > 0) {
                const ExeAppRisksBatch = DataService.NPLDigitalApps_Context.createBatch();
                await ExeAppRisksList?.map(async Risk => {
                    await DataService.NPLDigitalApps_Context.lists.getByTitle('PGS_Executive_Risks').items.getById(Risk.spID).inBatch(ExeAppRisksBatch).update({ showInNPLT6Report: Risk.showInNPLT6Report }).then(rec => {
                        console.log('Exe app Risks List updated : ', rec);
                    }).catch(err => {
                        console.log('Error in adding exe app risks to batch', err);
                    });
                });
                ExeAppRisksBatch.execute().then(rec => {
                    console.log('Exe app batch executed');
                    ExeAppRisks.map(rec => {
                        rec["IsModified"] = false;
                    });
                    this.setState({ ExeAppRisks: ExeAppRisks });
                }).catch(error => {
                    console.log('Error occured in Exe App Risks batch ', error);
                    let errorMsg = {
                        Source: 'ProductForm-Exe App Risks Update',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    })
                });
            }
            // save RiskAssRecords
            let { PPRiskAssessmentsAll } = this.state;
            const RiskAssRecordsList = PPRiskAssessmentsAll?.filter(rec => rec.IsModified);
            if (RiskAssRecordsList?.length > 0) {
                const RiskAssBatch = DataService.NPD_Context.createBatch();
                await RiskAssRecordsList?.map(async RiskAss => {
                    await DataService.NPD_Context.lists.getByTitle('PP_RiskAssessments').items.getById(RiskAss.Id).inBatch(RiskAssBatch).update({ showInNPLT6Report: RiskAss.showInNPLT6Report }).then(rec => {
                        console.log('PP_RiskAssessments List updated : ', rec);
                    }).catch(err => {
                        console.log('Error in adding PP_RiskAssessments to batch', err);
                    });
                });
                RiskAssBatch.execute().then(rec => {
                    console.log('RiskAssBatch batch executed');
                    console.log('batch executed');
                    PPRiskAssessmentsAll.map(rec => {
                        rec["IsModified"] = false;
                    });
                    this.setState({ PPRiskAssessmentsAll: PPRiskAssessmentsAll });
                }).catch(error => {
                    console.log('Error occured in PP_RiskAssessments batch ', error);
                    let errorMsg = {
                        Source: 'T6 Dashboard-Exe PP_RiskAssessments Update',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    })
                });
                }
            }

            setTimeout(() => {
                // beri changes
                let promise1 = this.updateAllGridsData().catch(e => console.log(e));
                let promise2 = this.getBalanceScoreCardDetails().catch(e => console.log(e));
                let promise3 = this.getRiskAssesments().catch(e => console.log(e));

                Promise.all([promise1, promise2, promise3]).then(() => {
                    this.isProgramDataModified = false;
                    this.setState({
                        isLoading: false,
                        NPL_modifiedProjects_Status: "SAVED"
                    })
                }).catch(e => console.log(e))

                this.toast?.show({ severity: 'success', summary: '', detail: 'Data Updated successfully', life: 2700 });
            }, 2000);
        }

        if (actionType === "Close") {
            if (this.isProgramDataModified ||
                this.checkIsAnyProjectDataModifiedWhenDialogClose() ||
                this.state.PlanViewRecords.filter((item: any) => item.IsModified).length > 0) {
                this.setState({ cnfrmSaveDialog: true })
            } else {
                this.props.handleClose();
            }
            this.setState({ isWindowClosed: true })
        }
    }

    private isNPLT6Modified = (): boolean => {
        if (this.state.ProjectCenterPlans?.filter(rec => rec.IsModified).length > 0) return true
        else
            if (this.state.BSCDataAll?.filter(rec => rec.IsModified).length > 0) return true
            else
                if (this.state.ExeAppRisks?.filter(rec => rec.IsModified).length > 0) return true
                else
                    if (this.state.PPRiskAssessmentsAll?.filter(rec => rec.IsModified).length > 0) return true
        return false;
    }

    public checkNPLT6ConcurrentEdit = async (
        CurrentProgramID_R,
        CurrentProgram_PfizerCode,
        CurrentProgramPPRiskAssData_R,
        ExeAppRisks_R,
        CurrentProgramBSCData_R,
        ProjCenterPlans_R
    ) => {

        if (CurrentProgramID_R) {
            let RiskAssessments_Items =
            await DataService.NPD_Context.lists.getByTitle('PP_RiskAssessments').items
                .orderBy('Modified', false)
                .filter(`ParentID eq ${CurrentProgramID_R}`)
                .top(5000)
                .get();
        let is_PP_RiskAssessments_Modified = false;
        for (let i = 0; i < CurrentProgramPPRiskAssData_R.length; i++) {
            for (let j = 0; j < RiskAssessments_Items.length; j++) {
                if (CurrentProgramPPRiskAssData_R[i].ID === RiskAssessments_Items[j].ID) {
                    if (CurrentProgramPPRiskAssData_R[i].Modified === RiskAssessments_Items[j].Modified) {
                        //The particular item is not modified in SharePoint, so break the j loop and check for the next item.
                        break;
                    } else {
                        is_PP_RiskAssessments_Modified = true;
                        break;
                    }
                }
            }
            //Any one item's modification is enough. So breaking the outer loop.
            if (is_PP_RiskAssessments_Modified) break;
        }
        if (is_PP_RiskAssessments_Modified) {
            return true;
        }
    }

    if(CurrentProgram_PfizerCode) {
        let filterQuery = `ProjectID/PfizerCode eq '${CurrentProgram_PfizerCode}'`;
        let selectQuery = '*,ProjectID/ProjectName,ProjectID/Title,ProjectID/PfizerCode';
        let expandQuery = 'ProjectID';
        let Executive_Risks_Items =
            await DataService.NPLDigitalApps_Context.lists.getByTitle('PGS_Executive_Risks').items
                .select(selectQuery)
                .top(5000)
                .filter(`${filterQuery}`)
                .expand(expandQuery)
                .get();
        let is_PGS_Executive_Risks_Modified = false;
        for (let i = 0; i < ExeAppRisks_R.length; i++) {
            for (let j = 0; j < Executive_Risks_Items.length; j++) {
                if (ExeAppRisks_R[i].ID === Executive_Risks_Items[j].ID) {
                    if (ExeAppRisks_R[i].Modified === Executive_Risks_Items[j].Modified) {
                        //The particular item is not modified in SharePoint, so break the j loop and check for the next item.
                        break;
                    } else {
                        is_PGS_Executive_Risks_Modified = true;
                        break;
                    }
                }
            }
            //Any one item's modification is enough. So breaking the outer loop.
            if (is_PGS_Executive_Risks_Modified) break;
        }
        if (is_PGS_Executive_Risks_Modified) {
            return true;
        }
    }

        let ProjectCenterPlansArr: any[] = [];
        let ProjectCenterDDMilestonesData: any[] = [];
        let BSCmilestoneData: any[] = [];
        if(CurrentProgram_PfizerCode) {
            await DataService.NPLDigitalApps_Context.lists.getByTitle('PGS_Common_ProjectList').items
            .select('*')
            .top(5000)
            .filter(`PfizerCode eq '${CurrentProgram_PfizerCode}'`)
            .get()
            .then(async ProjectPlans => {
                ProjectCenterPlansArr = ProjectPlans;
                ProjectPlans?.map(project => {
                    ProjectCenterDDMilestonesData.push({
                        sourceForDD: 'CommonList',
                        ID: project.ID,
                        Modified: project.Modified
                    });
                });
            }).catch(err => {
                console.log('Error in fetching Proj Center data : ', err);
            });
        }

        await DataService.NPLDigitalApps_Context.lists.getByTitle('DeepDiveProjectCenterTasks').items
            .select('*')
            .top(5000)
            .get()
            .then(Tasks => {
                let FilteredTasks = Tasks?.filter(task => ProjectCenterPlansArr?.some(project => project.Title == task.Title));
                FilteredTasks?.map(task => {
                    ProjectCenterDDMilestonesData.push({
                        sourceForDD: 'Tasks',
                        ID: task.ID,
                        Modified: task.Modified
                    });
                });
            }).catch(error => {
                let errorMsg = {
                    Source: 'GetDeepDiveMIlestoneRisks-DeepdiveTasks fetch',
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                })
            });

        if(CurrentProgramID_R) {
            await DataService.NPD_Context.lists.getByTitle('BalanceScoreCardDetails').items
            .orderBy('Modified', false)
            .filter(`ParentID eq ${CurrentProgramID_R}`)
            .top(5000)
            .get()
            .then((items) => {
                BSCmilestoneData = items;
            });

        let is_BalanceScoreCardDetails_Modified = false;
        for (let i = 0; i < CurrentProgramBSCData_R.length; i++) {
            for (let j = 0; j < BSCmilestoneData.length; j++) {
                if (CurrentProgramBSCData_R[i].ID === BSCmilestoneData[j].ID) {
                    if (CurrentProgramBSCData_R[i].Modified === BSCmilestoneData[j].Modified) {
                        //The particular item is not modified in SharePoint, so break the j loop and check for the next item.
                        break;
                    } else {
                        is_BalanceScoreCardDetails_Modified = true;
                        break;
                    }
                }
            }
            //Any one item's modification is enough. So breaking the outer loop.
            if (is_BalanceScoreCardDetails_Modified) break;
        }
        if (is_BalanceScoreCardDetails_Modified) {
            return true;
        }
    }

        let is_any_GLOWlist_Modified = false;
        for (let i = 0; i < ProjCenterPlans_R.length; i++) {
            for (let j = 0; j < ProjectCenterDDMilestonesData.length; j++) {
                if (ProjCenterPlans_R[i].ID === ProjectCenterDDMilestonesData[j].ID &&
                    ProjCenterPlans_R[i].sourceForDD === ProjectCenterDDMilestonesData[j].sourceForDD) {
                    if (ProjCenterPlans_R[i].Modified === ProjectCenterDDMilestonesData[j].Modified) {
                        //The particular item is not modified in SharePoint, so break the j loop and check for the next item.
                        break;
                    } else {
                        is_any_GLOWlist_Modified = true;
                        break;
                    }
                }
            }
            //Any one item's modification is enough. So breaking the outer loop.
            if (is_any_GLOWlist_Modified) break;
        }
        if (is_any_GLOWlist_Modified) {
            return true;
        }

        return false;
    }

    // update the records in common project list
    public updateVerificationRecods = async () => {
        try {
            //let updateBatch = sp.createBatch();
            let updateBatch = DataService.NPLDigitalApps_Context.createBatch();
            let updateBatchDLpp = DataService.NPL_Context.createBatch();
            let dlppRespose = [];
            await DataService.NPL_Context.lists.getByTitle("DLPPList").items.filter(`DRID eq ${this.props.rowData?.DRID}`).get().then(res => {
                console.log(res);
                dlppRespose = res;
            })

            let planViewRecordsArray = this.state.PlanViewRecords.filter((item: any) => item.IsModified);
            planViewRecordsArray.map(async (rec: any) => {
                let updateObj = {
                    DeepDive: Boolean(rec['DeepDive']),
                    showInNPLT6Report: Boolean(rec['DeepDive']) === false ? false : null,
                    LaunchLeadVerified: Boolean(rec['LaunchLeadVerified']),
                    Notes: rec['Notes'] ? String(rec['Notes']) : '',
                    ReasonCodeLookUpId: { results: rec['ReasonCodeLookUp'] },
                    LaunchLeadVerifiedBy: rec['LaunchLeadVerifiedBy'] ? String(rec['LaunchLeadVerifiedBy']) : '',
                    // LaunchProgress: String(planViewRecordsArray[i]['LaunchProgress']),
                    // LaunchStatus: String(planViewRecordsArray[i]['LaunchStatus']),
                }
                await DataService.NPLDigitalApps_Context.lists.getByTitle("PGS_Common_ProjectList")
                    .items.getById(rec.ID).inBatch(updateBatch)
                    .update(updateObj).then(async items => {
                        console.log("Verification records updated");

                        if (rec?.DeepDive === false) {
                            DataService.fetchFilteredItems_NPL_Digital_Apps('PGS_Executive_Risks',
                                'Id,ProjectID/ID', 'ProjectID', `ProjectID/ID eq ${rec.ID}`)
                                .then(async result => {
                                    if (result?.length > 0) {
                                        let updateObjForRisks = {
                                            DeepDive: false
                                        }
                                        //let updateBatchForRisks = sp.createBatch();
                                        let updateBatchForRisks = DataService.NPLDigitalApps_Context.createBatch();
                                        result.forEach(async item => {
                                            await DataService.NPLDigitalApps_Context.lists.getByTitle("PGS_Executive_Risks")
                                                .items.getById(item.ID).inBatch(updateBatchForRisks)
                                                .update(updateObjForRisks).then(async () => {
                                                    console.log("Risks deepdive value updated to false");
                                                });
                                        })
                                        await updateBatchForRisks.execute().then(resp => {
                                            console.log(resp);
                                        }).catch(async error => {
                                            let errorMsg = {
                                                Message: error.message,
                                                StackTrace: new Error().stack
                                            };
                                            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                                                console.error(error);
                                            });
                                        });
                                    }
                                })
                                .catch(e => console.log(e))
                        }
                    })

                // update the NPL T6 in DLPP list
                let filteredDLPPRecordId = dlppRespose.filter(item => item.DRID == rec.DRID && item.ProjectName == rec.ProjectName)[0].ID;
                await DataService.NPL_Context.lists.getByTitle("DLPPList").items.getById(filteredDLPPRecordId).inBatch(updateBatchDLpp).update({ 'DeepDive': rec.DeepDive, 'PlanStatus': 'MODIFIED' }).then(async items => {
                    console.log("DLPP records updated");
                });
            });
            await updateBatch.execute().then(resp => {
                // this.props.handleEditPlanSave();
                let VerificationRecordsLocal: [] = [...this.state.PlanViewRecords];
                VerificationRecordsLocal.map((rec: any) => { rec.IsModified = false });
                this.setState({ PlanViewRecords: VerificationRecordsLocal });

            }).catch(async error => {
                let errorMsg = {
                    Source: `Product Form-saveProductPagesData - Verification Records batch`,
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                })
            });
            // DLPP update batch
            await updateBatchDLpp.execute().catch(async error => {
                let errorMsg = {
                    Source: `Product Form-saveProductPagesData - DLPP Records batch`,
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                await DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                })
            });
        } catch (error) {
            let errorMsg = {
                Source: `Product Form-saveProductPagesData - error while updating verification records`,
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg)
                .catch(e => console.log(e))
        }
    }

    public componentDidMount = async () => {
        let activeIndexTemp = 0;
        if (this.props.autoOpenCreateRisk) activeIndexTemp = 3;

        this.ExeAppData.current = {
            opened: false,
            accomData: [],
            accomIndex: 0,
            milestoneData: [],
            activityData: [],
            activityIndex: 0,
            riskAssessmentData: [],
            riskAssessmentIndex: 0,
            activePlanId: this.props.rowData?.ID
        }

        this.ProjectPlanTabDataRef.current = {
            ProjectPlanFields: [],
            ProjectPlanData: []
        }
        console.log(this.props.rowData)

        const fetchFormFields = DataService.getRequestListData_NPL_Digital_Apps('GLO_FormFields', 'SortOrder');

        let projectDetailsListName = "";
        if (DataService.environment === "DEV") {
            projectDetailsListName = "ProjectDetailsList";
        }
        else if (DataService.environment === "QA" || DataService.environment === "PROD") {
            projectDetailsListName = "ProjectDetailsList_Prod";
        }
        this.fetchProgramData().catch(e => console.log(e));
        Promise.all([fetchFormFields]).then((responsesFirst) => {
            if (this.props.rowData?.DRID) {
                const fetchDRdetails =
                    DataService.fetchAllItems_DR_WithFilter(projectDetailsListName,
                        `ID eq ${this.props.rowData?.DRID}`)
                const fetchRelatedProjects =
                    DataService.fetchAllItemsGenericFilter_NPL_Digital_Apps('PGS_Common_ProjectList',
                        `ID,DRID,ProjectName,Title,DeepDive,LaunchLead,Market,BusinessUnit,Risk_x002f_IssueStatus,
                        LaunchProgress,LaunchStatus,ResourceStatus,TaskFinishDate,DeepDive`,
                        `DRID eq '${this.props.rowData?.DRID}'`, 'TaskFinishDate');
                const fetchDropdownValues =
                    DataService.getRequestListData_NPL_Digital_Apps('GLO_ProjectDetailsDropdownOptions', 'SortOrder');
                //below order swapped by jefin to fix issue
                Promise.all([fetchRelatedProjects, fetchDRdetails, fetchDropdownValues])
                    .then((responsesSecond) => {
                        const drData = {
                            DRID: this.props.rowData?.DRID,
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

                        let riskTrendOptionsTemp = this.getDropdownOptions(responsesSecond[2], "RiskTrend");
                        let launchreadinessTemp = this.getDropdownOptionsNew(responsesSecond[2], "OverallStatus");
                        let supplyContinuityTemp = this.getDropdownOptionsNew(responsesSecond[2], "SupplyContinuityRisk");
                        // Beri changes
                        let isDeepDiveval = false;
                        responsesSecond[0].map( (res, indx) => {
                            if(res.DeepDive === true) {
                                isDeepDiveval = true;                                
                            }
                        });

                        this.setState({
                            DRdetails: drData,
                            relatedPlans: responsesSecond[0],
                            formFields: responsesFirst[0],
                            DRID: String(this.props.rowData?.DRID || ""),
                            riskTrendOptions: riskTrendOptionsTemp,
                            launchreadiness: launchreadinessTemp,
                            supplyContinuity: supplyContinuityTemp,
                            activeTabIndex: activeIndexTemp,
                            showDialog: this.props.showEditPlanDialog,
                            isT6DashboardVisible: isDeepDiveval
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

                this.getAllTabsData().catch(e => console.log(e));

            }
        }).catch(e => console.log(e));
        // get LaunchXList Data from NPD site
        await this.getLaunchXListData().catch(e => console.log(e));
        await this.getMarketSiteDetails().catch(e => console.log(e));
        await this.updateAllGridsData().catch(e => console.log(e));
        await this.getFormFields().catch(e => console.log(e));
        await this.getBalanceScoreCardDetails().catch(e => console.log(e));
        await this.getRiskAssesments().catch(e => console.log(e));
    }

    public getAllTabsData = async () => {
        try {
            this.setState({ isLoading: true });
            let verificationResult = this.state.PlanViewRecords?.filter((item: any) => item.DRID == this.props.rowData?.DRID);
            if (verificationResult?.length === 0 && this.props.SelectedView === "Product View") {
                this.setState({
                    DisableVerificationTab: true,
                });
            }
            await this.getAllProjectPlanFieldsData();
            this.setState({ isLoading: false });
        } catch (error) {
            let errorMsg = {
                Source: 'Edit Plan-getAllTabsData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    getAllProjectPlanFieldsData = () => {
        let DRIDVal = this.props.rowData?.DRID;

        //get Project Plan popup fields -M
        const fetchFormFields = DataService.fetchAllItemsByGenericFilter('GLO_FormFields', '*', `TabName eq 'ProjectPlan'`);
        Promise.all([fetchFormFields]).then((responses) => {
            if (responses.length > 0) {
                let _ProjectPlanFields = responses[0].sort((a, b) => (a.SortOrder > b.SortOrder ? 1 : -1));
                console.log("Project Plan Fields", _ProjectPlanFields);
                let ProjectPlanFields = _ProjectPlanFields.filter(a => a.isActive == true);
                this.ProjectPlanTabDataRef.current.ProjectPlanFields = ProjectPlanFields;

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
        //get dlpp lst plans data for selected DRID -M
        if (DRIDVal) {
            this.getDLPPListData(DRIDVal);
        }
        else {
            alert("DRID not found");
            this.setState({
                formFields: [],
                programData: {},
            }, () => this.handleProjectPlanTabUnmount)
            //this.props.handleClose();
        }
    }

    getDLPPListData = (DRIDVal) => {
        this.setState({ isLoading: true });
        let projectPlanRecords = [];
        const fetchProjectPlanData = DataService.fetchAllItemsGenericFilter('DLPPList', `ID, DRID,*,PlanOwner/Title,PlanOwner/Id`,
            `DRID eq '${DRIDVal}'`, 'PGSReadiness')
        // `DRID eq '${DRIDVal}'`, 'LaunchProgress')
        Promise.all([fetchProjectPlanData]).then((responses) => {
            console.log("Project Plan Data", responses);
            let planItems = responses[0];
            planItems.map(async (res, indx) => {
                let cMarket = res.Market;
                let cCountry = res.Country;
                let cRegion = res.Region;
                let market = cMarket ? (cMarket.split('->').length > 0 ? cMarket.split('->')[1] : cMarket) : cMarket;
                let region = cRegion ? (cRegion.split('->').length > 0 ? cRegion.split('->')[1] : cRegion) : cRegion;
                let country = cCountry ? (cCountry.split('->').length > 0 ? cCountry.split('->')[1] : cCountry) : cCountry;
                let ParentMarket = res.Parent != null ? (planItems.filter(a => a.ProjectName == res.Parent).length > 0 ? planItems.filter(a => a.ProjectName == res.Parent)[0].Market : '') : '';
                ParentMarket = ParentMarket ? ParentMarket.split('->')[1] : '';
                projectPlanRecords.push({
                    //ID : res.ID,
                    'id': indx + 1,
                    'DRID': res.DRID,
                    'ProjectName': res.ProjectName,
                    'LaunchLead': res.PlanOwner.Title,
                    'LaunchReadinessDate': res.PGSReadiness,
                    'LaunchProgress': res.LaunchProgress,
                    'LaunchStatus': res.LaunchStatus,
                    'LabelName': res.LabelName,
                    'LabelText': res.LabelText,
                    'BusinessUnit': res.BU,
                    'SubBusinessUnit': res.BusinessUnit,
                    'Template': res.Template ? res.Template.replace('PGS', '') : res.Template,
                    'DeepDive': res.DeepDive != null && res.DeepDive != '' ? res.DeepDive : false,
                    'WaveType': res.WaveType,
                    'Market': market,
                    'Country': country,
                    'Region': region,
                    'cMarket': cMarket,
                    'cRegion': cRegion,
                    'cCountry': cCountry,
                    'PackSize': res.PackSize,
                    'ParentPlanId': res.ParentPlanId,
                    'Parent': res.Parent,
                    'ParentMarket': ParentMarket,
                    'PlanStatus': res.PlanStatus,
                    'Indication': res.Indication,
                    'PlanProjectName': res.PlanProjectName,
                    'PlanExistURL': res.PlanExistURL,
                    'RecordID': res.ID,
                    'TherapeuticArea': res.TherapeuticArea,
                    'GUID': res.GUID,
                    ProjectGUID: res.ProjectGUID
                })
            });
            this.ProjectPlanTabDataRef.current.ProjectPlanData = projectPlanRecords;
            this.setState({ isLoading: false });
            // this.props.onUnmount(this.ProjectPlanTabDataRef.current);
        }).catch((error) => {
            alert('error async call');
            let errorMsg = {
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        });
    }

    public fetchProgramData = async () => {
        try {
            await DataService.fetchAllItemsGenericFilter_Attachments_NPL_Digital_Apps('GLO_ProductProjectDetails',
                `*,PGSLeaders/EMail,AttachmentFiles`,
                `DRID eq '${this.props.rowData?.DRID}' or PfizerCode eq '${this.props.rowData?.PfizerCode}'`).then(resp => {
                    this.setState({ programData: resp[0] });
                });
        } catch (error) {
            let errorMsg = {
                Source: 'Edit Plan-fetchProgramData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    protected getDropdownOptions = (res, dropdownCategory): {}[] => {
        let arr = [];
        let dropdownItems = res.filter(rec => rec.IsActive == true && rec.DropdownCategory === dropdownCategory);

        dropdownItems.map(item1 => {
            if (item1.IsKeyValuePair)
                arr.push({ label: item1.DropdownValue, value: item1.DropdownKey + '->' + item1.DropdownValue, actualValue: item1.DropdownValue });
            else
                arr.push({ label: item1.DropdownValue, value: item1.DropdownValue, actualValue: item1.DropdownValue });
        });
        arr = arr.sort((a, b) => (a.label?.toString().toLowerCase() > b.label?.toString().toLowerCase() ? 1 : a.label?.toString().toLowerCase() < b.label?.toString().toLowerCase() ? -1 : 0));
        return arr;
    };

    protected getDropdownOptionsNew = (result, dropdownCategory): any => {
        let filteredArray = result.filter(value => {
            if (value.DropdownCategory === dropdownCategory && value.IsActive) {
                return value.DropdownValue
            }
        })
        return filteredArray.map(ele => ele.DropdownValue).sort()
    };

    saveCloseDialogIcons = (): JSX.Element => {
        return (<div>
            <div className="recordStatusOuterContainerMode">
                {this.props.Mode == 'View' ?
                    <span className='modeParent' style={{ backgroundColor: '#dee2e6', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}> {this.props.SelectedView}</span></span>
                    :
                    <span className='modeParent' style={{ backgroundColor: 'yellow', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}> {this.props.SelectedView}</span></span>
                }
            </div>
            <div className="recordStatusOuterContainerMode">
                {this.props.Mode == 'View' ?
                    <span className='modeParent' style={{ backgroundColor: '#dee2e6', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.props.Mode}</span></span>
                    :
                    <span className='modeParent' style={{ backgroundColor: 'yellow', marginTop: '4px' }}><span className='modeHeader' style={{ color: 'black' }}>Mode : {this.props.Mode}</span></span>
                }
            </div>
            {this.props.Mode === "Edit" && (<Button className='p-button-raised p-button-rounded saveBtn'
                onClick={() => this.handleDialogSaveClose("Save")}
                icon='dx-icon-save' label='Save' />)}
            <Button className='p-button-raised p-button-rounded closeBtn'
                onClick={() => this.handleDialogSaveClose("Close")}
                icon='dx-icon-close' label='Close' />
        </div>)
    }
    // LaunchXList Data
    getLaunchXListData = async () => {
        try {
            const launchXlistArray = await DataService.getLaunchXlistData('LaunchXList', `PfizerCode eq '` + this.props.rowData?.PfizerCode + `'`);
            console.log(launchXlistArray);
            if (launchXlistArray) {
                this.setState({ LaunchXListData: launchXlistArray });
            } else {
                //For the pfizerCode which not present in NPD, manually setting the properties.
                //To fix the issue while doing the PPT export.
                this.setState({
                    LaunchXListData: {
                        PfizerCode: this.props.rowData?.PfizerCode,
                        ProjectNameAlias: "",
                        ShortDesc: "",
                    }
                });
            }


        } catch (error) {
            let errorMsg = {
                Source: 'Edit Plan-getLaunchXListData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    getMarketSiteDetails = async () => {
        try {
            //let launchXlistItemId:[] = this.state['LaunchXListData'];
            let launchXMarketSiteArrayAll = await DataService.fetchAllItems('LaunchX_MarketSite');
            console.log(launchXMarketSiteArrayAll);
            launchXMarketSiteArrayAll.filter(rec => rec.IsDeleted != true);
            let items = launchXMarketSiteArrayAll?.filter(items1 => items1['LaunchXID'] == this.state['LaunchXListData']['ID'] && items1['IsDeleted'] != true);
            let index = 0;
            items.map(item1 => {
                item1['index'] = index++;
                items['IsModified'] = false;
            });
            if (items.length <= 0) {
                await this.setDefaultMarketData();
            }
            this.setState({ launchXMarketSiteAllRecords: launchXMarketSiteArrayAll, launchXMarketSiteArray: items });
        } catch (error) {
            let errorMsg = {
                Source: 'Edit Plan-getLaunchXListData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }
    setDefaultMarketData = async () => {
        try {
            let dData = [];
            await DataService.fetchAllItems('DefaultMarketData').then(defaultItem => {
                defaultItem = defaultItem.filter(item => item.IsVisible == true);
                let index1 = 0;
                defaultItem.map(item1 => {
                    let data1 = {
                        Country: item1.Title,
                        Region: item1.Region,
                        Market: item1.Market,
                        DS_x002f_APISite: item1.DS_x002f_APISite,
                        DSTestSite: item1.DSTestSite,
                        DSIntermediateSite: item1.DSIntermediateSite,
                        DPSite: item1.DPSite,
                        DPTestSite: item1.DPTestSite,
                        DPIntermediateSite: item1.DPIntermediateSite,
                        PPKGSite: item1.PPKGSite,
                        SPKGSite: item1.SPKGSite,
                        RSMIntermediateSite: item1.RSMIntermediateSite,
                        TestingSite: item1.TestingSite,
                        Comments: item1.Comments,
                        index: index1 + 1,
                        IsModified: true
                    };
                    index1++;
                    dData.push(data1);
                });
                this.setState({ launchXMarketSiteArray: dData });
            });
        }
        catch (error) {
            let errorMsg = {
                Source: 'Product Form-setDefaultMarketData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };
    public getBalanceScoreCardDetails = async () => {
        try {
            let bscItems = await DataService.fetchAllItems_GridView('BalanceScoreCardDetails');
            bscItems = bscItems?.filter(rec => rec.IsDeleted != true);
            bscItems = bscItems?.filter(rec => rec.ParentID == this.state.LaunchXListData?.['ID']);
            let index = 0;
            bscItems.map(item => {
                item['index'] = ++index;
                item['IsModified'] = false;
                item['Source'] = 'NPD';
            });
            await this.setState({ BSCDataAll: bscItems });

            //props.parentCallback("ProjectPlan", ProjectPlanArr);

        } catch (error) {
            let errorMsg = {
                Source: 'Product Form-setDefaultMarketData',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    }

    public getRiskAssesments = async () => {
        try {
            let riskAssPP = await DataService.fetchAllItems_GridView('PP_RiskAssessments');
            riskAssPP = riskAssPP?.filter(rec => rec.IsDeleted != true);
            riskAssPP = riskAssPP?.filter(rec => rec.ParentID == this.state.LaunchXListData?.['ID']);
            riskAssPP.map((item, index) => {
                item['index'] = index;
                item['AttachmentData'] = item['AttachmentFiles']?.[0];
                item['IsModified'] = false;
                item['Source'] = 'NPD';
            });
            this.setState({ PPRiskAssessmentsAll: riskAssPP });
        } catch (error) {
            let errorMsg = {
                Source: 'Product Form-setDefaultMarketData',
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
                this.setState({
                    ProjectCenterPlans: childData,
                })
            }
            if (key == "BSC") {
                this.setState({
                    BSCDataAll: childData
                })
            }
            if (key == "ExeAppRisks") {
                this.setState({
                    ExeAppRisks: childData,
                })
            }
            if (key == "RiskAssRecords") {
                this.setState({
                    PPRiskAssessmentsAll: childData
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
    public updateAllGridsData = async () => {
        try {
            let TemplateFiltersArr = ["PGSGLO", "PGS_FG_Packaging"]; //ConfigListData_R?.filter(item => item?.Title == 'DDPGSTemplateFilters')?.[0]?.['Value']?.split('#@#');
            let LaunchProgressFiltersArr = ["Active", "Complete"];  //ConfigListData_R?.filter(item => item?.Title == 'DDLaunchProgressFilters')?.[0]?.['Value']?.split('#@#');
            const result = await GetDeepDiveMilestonesAndRiskAssessments(DataService.NPDUrl, 'One', TemplateFiltersArr, LaunchProgressFiltersArr, this.props.rowData?.PfizerCode);
            console.log(result);
            this.setState({
                ProjectCenterPlans: result['ProjectCenterDDMilestonesData'],
                ExeAppRisks: result['ExeAppRiskAssArr']
            })

        } catch (error) {
            let errorMsg = {
                Source: 'DeepDive-updateAllGridsData',
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

    private footerContent = (
            <Button
                className='p-button-raised p-button-rounded okBtn'
                onClick={e => this.setState({ showConcurrentEditDialog: false })}
                label='OK' />
    );

    public render(): React.ReactElement<IEditPlanProps> {
        let projectNameWithDRID = "DRID: " + this.props?.rowData?.DRID + " " + this.props?.rowData?.ProductDescription;
        let dialogHeaderPostfix = "";
        if (DataService.environment === "DEV") {
            dialogHeaderPostfix = "  -- DEV"
        } else if (DataService.environment === "QA") {
            dialogHeaderPostfix = "  -- DEMO"
        }

        return (
            <React.Fragment >
                <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' />
                <Toast ref={(el) => { this.toast = el }} position="bottom-right" />
                <Dialog
                    // header={this.props.SelectedView === "Product View" ?
                    //     projectNameWithDRID + dialogHeaderPostfix :
                    //     this.props.rowData.ProjectName + dialogHeaderPostfix}
                    header={this.props.SelectedView === "Product View" ?
                        projectNameWithDRID + dialogHeaderPostfix :
                        ((this.state.SwitchedProjectPlanName != "All" && this.state.SwitchedProjectPlanName != null) ? this.state.SwitchedProjectPlanName : this.props.rowData?.ProjectName) + dialogHeaderPostfix}
                    closable={false}
                    visible={this.state.showDialog}
                    style={{ height: '99vh', width: '99vw' }}
                    icons={this.saveCloseDialogIcons}
                    onHide={() => console.log("onhide")}>
                    <div className="container-fluid" style={{ minHeight: '99%', padding: '0%', backgroundColor: 'white', position: 'relative' }}>
                        <div className="recordStatusOuterContainer">
                            <div style={{ display: 'contents', width: '-webkit-fill-available', justifyContent: 'end', marginRight: '0.5%' }}>
                                <span className='legendSpan' >
                                    <i className='pi pi-stop' style={{ background: `${this.state.legendColors.OneSource}`, color: `${this.state.legendColors.OneSource}` }}></i>
                                    <span > OneSource</span>
                                </span>
                                <span className='legendSpan' >
                                    <i className='pi pi-stop' style={{ background: `${this.state.legendColors.DR}`, color: `${this.state.legendColors.DR}`, marginLeft: '1rem' }}></i>
                                    <span > GLOW </span>
                                </span>
                            </div>
                        </div>
                        <TabView
                            onBeforeTabChange={(e) => this.checkIsAnyProjectDataModified(e)}
                            activeIndex={this.state.activeTabIndex}>
                            <TabPanel header='Project Plan'>
                                <>
                                    <ProjectPlan planProps={{ ...this.props.rowData }}
                                        programData={{ ...this.state.programData }}
                                        DRID={this.state.DRID}
                                        DRdetails={this.state.DRdetails}
                                        formType={this.props.Mode}
                                        refreshData={this.getDLPPListData}
                                        currentUser={this.props.currentUser}
                                        handleProjectPlan={this.handleProjectPlan}
                                        ProjectPlanTabData={this.ProjectPlanTabDataRef.current}
                                        onUnmount={this.handleProjectPlanTabUnmount}
                                        SwitchedProjectPlanName={this.state.SwitchedProjectPlanName}
                                    >
                                    </ProjectPlan>
                                </>
                            </TabPanel>
                        </TabView>
                    </div>
                </Dialog>

                <ConfirmDialog
                    visible={this.state.cnfrmSaveDialog}
                    onHide={() => this.setState({ cnfrmSaveDialog: false })}
                    style={{ minWidth: '35%' }}
                    message='Do you want to save your changes?'
                    header='Confirm Close?'
                    acceptClassName='acceptBtn'
                    rejectClassName='rejectBtn'
                    accept={() => {
                        this.setState({ cnfrmSaveDialog: false });
                        this.handleDialogSaveClose("Save")
                            .then(() => {
                                this.toast?.show({ severity: 'success', summary: '', detail: 'Data Updated successfully', life: 2700 });
                                setTimeout(() => {
                                    this.props.handleClose()
                                }, 1000);
                            })
                            .catch((e) => console.log(e))
                    }}
                    acceptLabel='Save & Close'
                    acceptIcon='dx-icon-save'
                    rejectIcon='dx-icon-close'
                    rejectLabel='Discard & Close'
                    reject={() => {
                        this.setState({ cnfrmSaveDialog: false });
                        this.props.handleClose();
                    }}
                />

                <Dialog
                    closable={false}
                    header="Note: NPL T6 Details Changes Are Not Saved."
                    visible={this.state.showConcurrentEditDialog}
                    style={{ width: '60vw' }}
                    onHide={() => this.setState({ showConcurrentEditDialog: false })}
                    footer={this.footerContent}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className='label-name' style={{ color: "black" }}>
                            System identified changes to the NPL T6 Details made in NPD/GLOW.
                            Please review your changes for NPL T6 Visible selection and save the record again. Consult your Launch Lead / Co-Dev Lead to align
                        </span>
                    </div>
                </Dialog>
            </React.Fragment >
        );
    }
}