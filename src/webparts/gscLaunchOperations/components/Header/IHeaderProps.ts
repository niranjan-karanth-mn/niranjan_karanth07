import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IHeaderProps {
    siteUrl?: string;
    match?: any;
    context?: WebPartContext;
    history?: any;
    currentUser?: any;
    userGroups?: any;
    headerText?:any;
}