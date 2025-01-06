export interface IProjectListProps {
    DRID?: string;
    relatedPlans: any[];
    projectListStates: IProjectListStatesType;
    handleChange: (args: IProjectListStatesType) => void;
    NPL_modifiedProjects:any;
    toastNPLModifiedProjectPlanSwitch:any;
    NPL_modifiedProjects_Status:any;
}

export interface IProjectListStatesType {
    filterOpen?: boolean;
    multiSelect?: boolean;
    selectedItem?: any;
}