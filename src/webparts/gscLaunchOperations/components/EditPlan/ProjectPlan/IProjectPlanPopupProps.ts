export interface IProjectPlanPopupProps {
    //planProps: any;
    PlanGridData : any;
    planFieldsData : any;
    planFormFields :any;
    planPopupOpen : any;
    Action : any;
    planfieldValues : any;
    currentUser : any;
    closePopup :  (fieldValue: any) => void;
    onConfirmSave :  (fieldValue: any,ProjectPlanPopupGrid :any,newLabelAry :any) => void;
    ProjectPlanPopupGrid:any[];
    lstDefaultWave : any;
    newLabelArry : any[];
    DRdetails: any;
    OnNewLabelAdd :(fieldValue: any,planFieldsData : any) => void;
    onPlanDelete : (ProjectPlanPopupGrid :any,deleteRecID :any)=> void;
}
export interface IProjectPlanPopupPropsState {
    planFieldsData: any[];
    planPopupOpen: any;
    PlanGridData: any[];
    Action : any;
    lstWaveType : any[];
    lstPackWaveType : any[];
    planfieldValues : any;
    ProjectPlanPopupGrid : any[];
    newPlanRecords : any[];
    lstProjectNameSuffix : any[];
    lstDefaultWave : any[];
    showMarket : any;
    countryLst : any[],
    marketLst : any[],
    regionLst:  any[],
    Countries: any[],
    Markets : any[],
    Region :any[],
    addLabelFlag:any,
    labelNameRaw:any,
    //newLabelName:any,
    allNewPlanRecords : any[];
    showSystemMsg :any;
    systemMsg:any;
    lstAllCountry : any[];
    lstMarketNew : any[];
    lstRegion : any[];
    lstMarket : any[];
    lstCountry : any[];
    defMarket : any[];
    newLabelArry : any[];
    RecordsToDelete : any[];
    IsDelete : any;
    isLoading: any;
    DRdetails: any;
}