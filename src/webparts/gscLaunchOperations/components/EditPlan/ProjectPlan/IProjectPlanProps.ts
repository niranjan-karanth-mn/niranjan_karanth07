export interface IProjectPlanProps {
    planProps: any;
    programData : any;
    DRID? : any;
    DRdetails : any;
    formType:any;
    currentUser :any;
    handleProjectPlan:any;
    //onChange: (fieldName: any, fieldValue: any) => void;
    onUnmount:any;
    ProjectPlanTabData:any;
    refreshData:any;
    SwitchedProjectPlanName:any;
}

export interface IEditPlanState {
    //formFields: any[];
    PlanData: any,
    DRID?: any,
    DRdetails: any,
    isLoading : any
}