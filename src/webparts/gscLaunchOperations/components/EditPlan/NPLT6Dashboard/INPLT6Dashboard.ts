import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface INPLT6Dashboard {
    siteUrl?: string;
    match?: any;
    context?: WebPartContext;
    history?: any;
    currentUser?: any;
    userGroups?: any;  
    LaunchXlist?:any;  
    SupplyChainData?:any;
    programData?:any;
    rowData?:any;
    SupplyChainDataAll?:any;
    BSCDataAll?:any;
    PPRiskAssessmentsAll?:any;
    Mode?:any;
    parentCallback?:any;
    ProjectCenterPlans?:any;
    ExeAppRisks?:any;
    legendColors?:any;
    isProgramDataModified:boolean;
}