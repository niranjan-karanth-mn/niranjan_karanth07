import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IVerification {
    siteUrl?: string;
    match?: any;
    context?: WebPartContext;
    history?: any;
    currentUser?: any;
    userGroups?: any;
    headerText?:any;
    plansResults?:any;
    projectName?:any;
    reasonChangeOptions?:any;
    rowData?:any;
    onChange: (fieldValue: any) => void;
    Mode?:any;
    handleVerificationDeepDiveChange:any;
    NPL_modifiedProjects:any;
    updateNplT6CheckedUnchecked: any;
    SwitchedProjectPlanName:any;
}