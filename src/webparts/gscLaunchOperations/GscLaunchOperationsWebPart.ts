import * as React from 'react';
import * as ReactDom from 'react-dom';
//import { Version } from '@microsoft/sp-core-library';
// import {
//   IPropertyPaneConfiguration,
//   PropertyPaneTextField
// } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
//import { IReadonlyTheme } from '@microsoft/sp-component-base';

//import * as strings from 'LaunchOperationsWebPartStrings';
import GscLaunchOperations from './components/GscLaunchOperations';
import { IGscLaunchOperationsProps } from './components/IGscLaunchOperationsProps';
import { sp } from "@pnp/sp/presets/all";
import { DataService } from './components/Shared/DataService';

export interface ILaunchOperationsWebPartProps {
  description: string;
}

export default class GscLaunchOperationsWebPart extends BaseClientSideWebPart<ILaunchOperationsWebPartProps> {

  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = '';
  private renderPromise: Promise<any>;
  private currentUser: any;
  private userGroups: any = [];

  protected onInit(): Promise<void> {
    // inject the style sheet
    const head: any = document.getElementsByTagName("body")[0] || document.documentElement;
    let customStyle: HTMLLinkElement = document.createElement("link");
    customStyle.href = this.context.pageContext.web.absoluteUrl + "/SiteAssets/custom.css";
    customStyle.rel = "stylesheet";
    customStyle.type = "text/css";
    head.insertAdjacentElement("beforeEnd", customStyle);

    return super.onInit().then(_ => {
      sp.setup({
        // set ie 11 mode
        ie11: true,
        // only needed when working within SharePoint Framework
        spfxContext: this.context as any
      });

      DataService.currentSpContext = this.context as any;
      DataService.configureSiteContext()

      this.renderPromise = this.getGlobalData();
    });
  }
  private getGlobalData() {
    let batch = sp.createBatch();
    sp.web.currentUser
      .inBatch(batch)
      .get()
      .then(currentUser => {
        this.currentUser = currentUser;
      }).catch(error => {
        let errorMsg = {
          Message: error.message,
          StackTrace: new Error().stack
        };
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
          console.error(error);
        });
      });

    sp.web.currentUser.groups
      .inBatch(batch)
      .get()
      .then(currentUserGroups => {
        if (currentUserGroups) {
          currentUserGroups.forEach(element => {
            this.userGroups.push(element.LoginName);
          });
        }
      }).catch(error => {
        console.log("Error in getting current user Sharepoint groups : ", error);
      });


    return batch.execute().catch(error => {
      console.log("Error in executing batch : ", error);
    });
  }

  public render(): void {
    Promise.all([this.renderPromise]).then(response => {
      const _siteUrl = this.context.pageContext.web.absoluteUrl;
      const _serverRelativeUrl = this.context.pageContext.web.serverRelativeUrl;
      const element: React.ReactElement<IGscLaunchOperationsProps> = React.createElement(
        GscLaunchOperations,
        {
          description: this.properties.description,
          siteUrl: _siteUrl,
          context: this.context,
          serverRelativeUrl: _serverRelativeUrl,
          currentUser: this.currentUser,
          userGroups: this.userGroups,
          //ontentListItems: this.ContentListItems
        }
      );

      ReactDom.render(element, this.domElement);
    })
      .catch(error => {
        console.log("Error while rendering from BaseClientWebpart : ", error);
      });
  }

  // protected onInit(): Promise<void> {
  //   return this._getEnvironmentMessage().then(message => {
  //     this._environmentMessage = message;
  //   });
  // }



  // private _getEnvironmentMessage(): Promise<string> {
  //   if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
  //     return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
  //       .then(context => {
  //         let environmentMessage: string = '';
  //         switch (context.app.host.name) {
  //           case 'Office': // running in Office
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
  //             break;
  //           case 'Outlook': // running in Outlook
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
  //             break;
  //           case 'Teams': // running in Teams
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
  //             break;
  //           default:
  //             throw new Error('Unknown host');
  //         }

  //         return environmentMessage;
  //       });
  //   }

  //   return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  // }

  // protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
  //   if (!currentTheme) {
  //     return;
  //   }

  //   this._isDarkTheme = !!currentTheme.isInverted;
  //   const {
  //     semanticColors
  //   } = currentTheme;

  //   if (semanticColors) {
  //     this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
  //     this.domElement.style.setProperty('--link', semanticColors.link || null);
  //     this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
  //   }

  // }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  //   return {
  //     pages: [
  //       {
  //         header: {
  //           description: strings.PropertyPaneDescription
  //         },
  //         groups: [
  //           {
  //             groupName: strings.BasicGroupName,
  //             groupFields: [
  //               PropertyPaneTextField('description', {
  //                 label: strings.DescriptionFieldLabel
  //               })
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }
}
