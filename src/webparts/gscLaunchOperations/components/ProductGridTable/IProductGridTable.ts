import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IProductGridTable {
    location: any;
    siteUrl?: string;
    match?: any;
    context?: WebPartContext;
    history?: any;
    currentUser?: any;
    userGroups?: any;
    headerText?:any;
    AllSiteURLs?:any;
    IPORTGrid?:any
}