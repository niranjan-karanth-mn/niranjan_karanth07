export interface IEditPlanProps {
    updateAutoOpenCreateRisk: () => void;
    autoOpenRiskItemId: number;
    autoOpenCreateRisk: boolean;
    rowData: any;
    showEditPlanDialog: boolean;
    handleClose: () => void;
    plansResults: any;
    reasonChangeOptions: any;
    uniqueLaunchLeads: [];
    siteUrl: any;
    currentUser: any;
    Mode: "View" | "Edit";
    SelectedView: string;
    // handleEditPlanSave:any;
    queryStringAsObject?: {
        mode: string;
        drid: string;
        projectguid: string;
    };    
}

export interface IEditPlanState {
    isWindowClosed: boolean,
    activeTabIndex: number,
    showDialog: boolean,
    showConcurrentEditDialog: boolean,
    formFields: any[];
    programData: any,
    DRID?: any,
    DRdetails: any,
    relatedPlans: [];
    riskTrendOptions: {}[];
    launchreadiness: string[];
    supplyContinuity: string[];
    relatedProjectPlans: [];
    PlanViewRecords: [];
    DisableVerificationTab: any;
    isLoading: any;
    projectPlanUpdates: any[];
    counter: number;
    NPL_modifiedProjects: any;
    cnfrmSaveDialog: boolean;
    currentSelectedProject: any;
    SwitchedProjectPlan: null;
    NPL_modifiedProjects_Status: "NOT MODIFIED" | "MODIFIED" | "SAVED";
    LaunchXListData:{};
    launchXMarketSiteAllRecords:[];
    launchXMarketSiteArray:any;
    BSCDataAll:any;
    PPRiskAssessmentsAll:any;  
    ProjectCenterPlans:any;
    ExeAppRisks:any; 
    RiskAssRecords:any;  
    legendColors:any;  
    SwitchedProjectPlanName: null;
    isT6DashboardVisible: any;
}