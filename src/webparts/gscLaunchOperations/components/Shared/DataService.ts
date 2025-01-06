import { sp } from "@pnp/sp";
import { IWeb, Web } from "@pnp/sp/presets/all";
export let colorObj = {
    greenbtnBg: '#49C144',
    greenBtnTextColor: '#000000',
    yellowBtnBg: '#FFD636',
    yellowBtnTextColor: '#000000',
    greyBtnBg: '#808080',
    greyBtnTextColor: '#FFFFFF',
    // redBtnBg: '#FF372E',
    redBtnBg: '#F58082',
    redBtnTextColor: '#FFFFFF',
    completeBtnTextColor: '#FFFFFF',
    completeBtnBg: '#779FEC',
    headerBg: '#0000c9'
};
export let StatusValues = [
    { label: 'At Risk', color: colorObj['yellowBtnTextColor'], bgColor: colorObj['yellowBtnBg'] },
    { label: 'Medium', color: colorObj['yellowBtnTextColor'], bgColor: colorObj['yellowBtnBg'] },
    { label: 'Completed', color: colorObj['completeBtnTextColor'], bgColor: colorObj['completeBtnBg'] },
    { label: 'Complete', color: colorObj['completeBtnTextColor'], bgColor: colorObj['completeBtnBg'] },
    { label: 'Delayed', color: colorObj['redBtnTextColor'], bgColor: colorObj['redBtnBg'] },
    { label: 'On Track', color: colorObj['greenBtnTextColor'], bgColor: colorObj['greenbtnBg'] },
    //JEFIN -- adding the extra objects
    { label: 'High Risk', color: colorObj['redBtnTextColor'], bgColor: colorObj['redBtnBg'] },
    { label: 'Medium', color: colorObj['yellowBtnTextColor'], bgColor: colorObj['yellowBtnBg'] },
    { label: 'Low', color: colorObj['greenBtnTextColor'], bgColor: colorObj['greenbtnBg'] },
];

export abstract class DataService {
    public static currentSpContext: IWeb;
    public static NPL_Context: IWeb;
    public static NPLDigitalApps_Context: IWeb;
    public static PCNCM_Context: IWeb;
    public static NPD_Context: IWeb;


    public static NPL_Url: string;
    public static NPLDigitalApps_Url: string;
    public static PCNCM_Url: string;
    public static ProjectCenterUrl: string;
    public static NPLXUrl: string;
    public static NPDUrl: string;
    public static NPLDashboardUrl: string;
   // public static PowerBIIframeUrl: string;

    public static EditPermissionGroupID: string;
    public static environment: "DEV" | "UAT" | "QA" | "PROD";

    public static configureSiteContext = async () => {
        return await sp.web.lists.getByTitle("GLO_SiteUrlConfiguration").items
            .select('Title,Url,SiteName')
            .get()
            .then(async (Items) => {
                Items.forEach((item) => {
                    switch (item.SiteName) {
                        case 'NPL':
                            this.NPL_Url = item.Url;
                            this.NPL_Context = Web(item.Url);
                            break;
                        case 'NPLDigitalApps':
                            this.NPLDigitalApps_Url = item.Url;
                            this.NPLDigitalApps_Context = Web(item.Url);
                            break;
                        case 'PCNCM':
                            this.PCNCM_Context = Web(item.Url);
                            break;
                        case 'PfizerConnectLaunchURL':
                            this.PCNCM_Url = item.Url;
                            break;
                        case 'ProjectCenter':
                            this.ProjectCenterUrl = item.Url;
                            break;
                        case 'TYPE':
                            this.environment = item.Url;
                            break;
                        case 'NPLX':
                            this.NPLXUrl = item.Url;
                            break;
                        case 'NPD':
                            this.NPDUrl = item.Url;
                            this.NPD_Context = Web(item.Url);
                            break;
                        case 'NPLDashboard':
                            this.NPLDashboardUrl = item.Url;
                            break;
                        // case 'PowerBIIframeUrl':
                        //     this.PowerBIIframeUrl = item.Url;
                        //     break;
                        // case 'EditPermissionGroupID':
                        //     this.EditPermissionGroupID = item.Url;
                        //     break;
                    }
                });
            }).catch(error => {
                alert("Error getting site url config list data")
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
    }

    //to fetch list data containing fields
    public static getRequestListData = async (listName, sortColumn): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .select('*')
            .orderBy(sortColumn, true)
            .top(5000)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
    }

    public static getRequestListData_NPL_Digital_Apps = async (listName, sortColumn): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .select('*')
            .orderBy(sortColumn, true)
            .top(5000)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                // console.log(listName + " error in ", error);
                // let errorMsg = {
                //     Source: `DataService-getRequestListData -ListName : ${listName}`,
                //     Message: error.message,
                //     StackTrace: new Error().stack
                // };
                // this.add('Errors_Logs', errorMsg);
            });
    }

    public static getItemsForProductForm = async (listName, id, select, expand): Promise<any> => {
        return await this.NPL_Context.lists.getByTitle(listName).items
            .getById(id)
            .select(select)
            .expand(expand)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }

    public static addItemsToList = async (listName, dataToAdd) => {
        return await this.NPL_Context.lists.getByTitle(listName).items
            .add(dataToAdd)
            .then(async items => {
                return items;
            })
            .catch(error => {
                console.log('Error occured', error, " data to Add :", dataToAdd);
            });
    }

    public static addItemsToList_NPL_Digital_Apps = async (listName, dataToAdd): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .add(dataToAdd)
            .then(async items => {
                return items;
            })
            .catch(error => {
                console.log('Error occured', error, " data to Add :", dataToAdd);
            });
    }

    public static updateItemInList = async (listName, id, updatedData) => {
        return await this.NPL_Context.lists.getByTitle(listName).items
            .getById(id)
            .update(updatedData)
            .then(async (Items) => {
                return Items['data'];
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }

    public static updateItemInList_NPL_Digital_Apps = async (listName, id, updatedData) => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .getById(id)
            .update(updatedData)
            .then(async (Items) => {
                return Items['data'];
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }

    public static deleteItemFromList = async (listName, id) => {
        return await this.NPL_Context.lists.getByTitle(listName).items
            .getById(id)
            .delete()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }

    public static fetchAllItemsGenericFilter = async (listName, selectionColumns, filterCondition, orderBy?): Promise<any> => {
        if (listName == "DLPPList") {
            return await this.NPL_Context.lists.getByTitle(listName).items
                .select(selectionColumns)
                // .orderBy(orderBy ? orderBy : "ID", orderBy ? true : false)
                .orderBy(orderBy, true)
                .orderBy("ProjectName", true)
                .filter(filterCondition)
                .expand('PlanOwner,MarketPlanner,MarketPlannerSupervisor,RegionalSupplyLeader,AboveMarketPlanner,AboveMarketPlannerSupervisor')
                .top(5000)
                .get()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(listName + " error in ", error);
                });
        }
        else {
            return await this.NPL_Context.lists.getByTitle(listName).items
                .select(selectionColumns)
                .orderBy(orderBy ? orderBy : "ID", orderBy ? false : true)
                .filter(filterCondition)
                .top(5000)
                .get()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(listName + " error in ", error);
                });
        }
    }

    public static fetchAllItemsGenericFilter_NPL_Digital_Apps = async (listName, selectionColumns,
        filterCondition, sortColumn): Promise<any> => {
        if (listName === "PGS_Common_ProjectList") {
            return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
                .select(selectionColumns)
                .orderBy(sortColumn, true)
                .orderBy('ProjectName', true)
                .filter(filterCondition)
                .top(5000)
                .get()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(listName + " error in ", error);
                });
        }
        else {
            return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
                .select(selectionColumns)
                .orderBy(sortColumn, true)
                .filter(filterCondition)
                .top(5000)
                .get()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(listName + " error in ", error);
                });
        }

    }

    public static fetchAllItemsGenericFilter_Attachments_NPL_Digital_Apps = async (listName, selectionColumns, filterCondition): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .select(selectionColumns)
            // .orderBy("ID", false)
            .filter(filterCondition)
            .expand('AttachmentFiles,PGSLeaders')
            .top(5000)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }

    public static fetchAllItems_DR_WithFilter = async (listname, filterCondition): Promise<any> => {
        return await this.NPL_Context.lists.getByTitle(listname).items
            .select(`*,CoDevLead/Title,DataSteward/Title,LaunchLeaderUser/Title,NewProductsPlanner/Title` +
                `,CoDevLead/EMail,DataSteward/EMail,LaunchLeaderUser/EMail,NewProductsPlanner/EMail`)
            .orderBy('ID', false)
            .filter(filterCondition)
            .expand('CoDevLead,DataSteward,LaunchLeaderUser,NewProductsPlanner')
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }
    public static getTopOneItem = async (listName, selectionColumns, filterCondition, orderBy?): Promise<any> => {
        return await this.NPL_Context.lists.getByTitle(listName).items
                .select(selectionColumns)
                .orderBy(orderBy ? orderBy : "ID", orderBy ? true : false)
                .filter(filterCondition)
                .top(1)
                .get()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(listName + " error in ", error);
                });
        
    }

    public static fetchAllItems_DR = async (listname): Promise<any> => {
        return await this.NPL_Context.lists.getByTitle(listname)
            .items.select('*,CoDevLead/Title,DataSteward/Title,LaunchLeaderUser/Title,NewProductsPlanner/Title,Author/Title')
            .orderBy('Modified', false)
            .expand('CoDevLead,DataSteward,LaunchLeaderUser,NewProductsPlanner,Author')
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    public static fetchExternalListDetails_1 = async (_siteUrl, listname): Promise<any> => {
        const web = Web(_siteUrl);
        let DDList = null;
        return (await web.lists.getByTitle(listname).items
            .select('*,MappingCode/Code').expand('MappingCode')
            .top(5000)
            //.orderBy("SortOrder", true)
            .get()
            .then(async (Items) => {
                DDList = await Items;
                return await DDList;
            }).catch(error => {
                console.log("Error in getting items from " + listname + " list : ", error);
            })
        );
    }

    // newly added
    public static fetchAllItemsDigitalApp = async (listname): Promise<any> => {
        if (listname != "RevenueBracket") {
            return await this.NPLDigitalApps_Context.lists.getByTitle(listname)
                .items
                .getAll()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(`Error in getting items from` + listname + `list : `, error);
                });
        }
        else {
            return await this.NPLDigitalApps_Context.lists.getByTitle(listname)
                .items
                .orderBy('Created', false)
                .getAll()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(`Error in getting items from` + listname + `list : `, error);
                });
        }
    }

    //to fetch a items from list using filter condition - NPL_Digital_Apps_Dev
    public static fetchAllItemsByGenericFilter = async (listName, selectionColumns, filterCondition): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName)
            .items
            .select(selectionColumns)
            .orderBy("ID", false)
            .filter(filterCondition)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }

    public static fetchAllDRListItemsWithFilters = async (listName, selectionColumns, filterCondition, expandCondition, orderBy): Promise<any> => {
        let orderByCond = orderBy != null ? orderBy : 'ID';
        let orderByVal = orderBy != null ? true : false;
        return await this.NPL_Context.lists.getByTitle(listName).items
            .select(selectionColumns)
            .orderBy(orderByCond, orderByVal)
            .expand(`${expandCondition}`)
            .filter(filterCondition)
            .top(5000)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }
    public static fetchItems= async (listName,selectionColumns,expandColumn):Promise <any>=>{
        return await this.NPL_Context.lists.getByTitle(listName).items
                .select(selectionColumns)
                .expand(expandColumn)
                .top(5000)
                .get()
                .then(async (Items) => {
                    return Items;
                }).catch(error => {
                    console.log(listName + " error in ", error);
                });
    }

    //to fetch list data containing fields
    //to fetch all items from the list
    public static fetchAllItems_NPL_Digital_Apps_Dev = async (listname): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    public static fetchAllItemsFromNPL = async (listname): Promise<any> => {
        return await this.NPL_Context.lists.getByTitle(listname)
            .items
            .orderBy('Created', false)
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    public static addDatatoList_NPLDigitalApps = async (listName, dataToAdd: any) => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .add(dataToAdd)
            .then(async items => {
                return items;
            })
            .catch(error => {
                console.log('Error occured', error, " data to Add :", dataToAdd);
            });
    }

    public static addDatatoList = async (listName, dataToAdd: any) => {
        return await this.NPL_Context.lists.getByTitle(listName).items
            .add(dataToAdd)
            .then(async items => {
                return items;
            })
            .catch(error => {
                console.log('Error occured', error, " data to Add :", dataToAdd);
            });
    }

    public static getMasterDropdowns = async (listName): Promise<any> => {
        return await this.NPL_Context.lists.getByTitle(listName).items
            .select('*')
            // .orderBy(sortColumn, true)
            .top(5000)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
                let errorMsg = {
                    Source: `DataService-getRequestListData -ListName : ${listName}`,
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                this.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
    }



    public static fetchAllItems_PlanView = async (listname): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items.select('*,ReasonCodeLookUp/Title, ReasonCodeLookUp/Id, ReasonCodeLookUp/Description')
            .orderBy('Modified', true)
            .expand('ReasonCodeLookUp')
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    public static fetchAllItems_DLPP = async (listname): Promise<any> => {
        return await this.NPL_Context.lists.getByTitle(listname)
            .items.select('*', 'PlanOwner/Title', 'PlanOwner/Id')
            .orderBy('Modified', false)
            .expand('PlanOwner')
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    // update the records by item id
    public static updateItemsInList = async (listName, id, updatedData): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .getById(id)
            .update(updatedData)
            .then(async (Items) => {
                return Items['data'];
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }

    // get the comments version history
    public static GetNotesCommetsHistory = async (listName, id): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .getById(id)
            .select('*,Notes,Versions')
            .expand('Versions')
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listName + `list : `, error);
            });
    }

    public static getReasoncodeLookupId = async (listName, prmDescription): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .select('*')
            .filter("Description eq '" + prmDescription + "'")
            //.expand('Versions')
            .get()
            .then(async (Items) => {
                return Items[0].Id;
            }).catch(error => {
                console.log(`Error in getting items from` + listName + `list : `, error);
            });
    }

    public static fetchAllItems_CustomViewFilter = async (listname): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items
            .orderBy('Created', false)
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    //to fetch all items from the list
    public static fetchAllItems_ProgramColList = async (listname): Promise<any> => {
        return this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items.select('caption', 'dataField', 'alignment', 'width', 'dataType', 'visible', 'IsValid', 'ViewName', 'FieldType', 'ViewType')
            .filter("visible eq 1")
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    // to fetchAllItems
    public static fetchVerificationColumns = async (listname): Promise<any> => {
        return this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items.select('*')
            .filter("visible eq 1")
            .orderBy('sortorder', true)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }
    // delete the view
    public static deleteRec = async (listname, id): Promise<any> => {
        return this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items
            .getById(id).recycle()
            .then(async (Items) => {
                console.log(Items);
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });

    }

    // to fetchAllItems
    public static fetchVerificationDrodownValues = async (listname): Promise<any> => {
        return this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items.select('*')
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    public static fetchFilteredItemsAndSelectAttachments_NPL_Digital_Apps = async (listName, columnName, filterValue, Attachments, orderByCol, allRelatedProjects) => {
        if (allRelatedProjects.length > 0) {
            if (filterValue == null) {
                //That means, 'All' is selected in left filter
                let filterQuery = "";
                allRelatedProjects.forEach((eachProject) => {
                    filterQuery +=
                        `${columnName}/ID eq ${eachProject.ID} or `
                })
                filterQuery = filterQuery.slice(0, -4);

                return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
                    .select(`*,${columnName}/ID,${columnName}/ProjectName,${Attachments}`)
                    .orderBy(orderByCol, false)
                    .expand(`${Attachments},${columnName}`)
                    .filter(filterQuery)
                    .top(5000)
                    .get();
            } else {
                return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
                    .select(`*,${columnName}/ID,${columnName}/ProjectName,${Attachments}`)
                    .orderBy(orderByCol, false)
                    .expand(`${Attachments},${columnName}`)
                    .filter(`${columnName}/ID eq ${filterValue}`)
                    .top(5000)
                    .get();
            }
        } else {
            return []
        }
    }

    public static fetchFilteredItems_NPL_Digital_Apps = async (listName, selectColumns,
        expandColumns, filterCondition) => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .select(selectColumns)
            .expand(expandColumns)
            .filter(filterCondition)
            .top(5000)
            .get();
    }

    //Sirisha
    public static fetchAllItems_DynamicSite = async (siteUrl, listName, selectQuery, expandQuery): Promise<any> => {
        //const web = Web(siteUrl);
        // return await web.lists.getByTitle(listName).items.select(selectQuery).expand(expandQuery).getAll().then(async Items => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items.select(selectQuery).expand(expandQuery).getAll().then(async Items => {
            return Items;
        }).catch(error => {
            let errorMsg = {
                Source: `DataService-getRequestListData -ListName : ${listName}`,
                Message: error.message,
                StackTrace: new Error().stack
            };
            this.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        });
    }

    public static canCurrentUserViewMembership = (groupId: string): Promise<boolean> => {
        let checkViewMembershipAPI = DataService.NPLDigitalApps_Url +
            `/_api/web/sitegroups(${groupId})/CanCurrentUserViewMembership`;

        return fetch(checkViewMembershipAPI, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(data => data.json())
            .then((data) => {
                return data.value;
            });
    }

    public static fetchProjectPlanDetails = (projectPlanGuid: string): Promise<any> => {
        const projectUrl = this.ProjectCenterUrl;
        let proUrl = projectUrl + `/_api/ProjectData/Projects?$select=LaunchStatus,LaunchProgress,ResourceStatus,PGSReadinessDate,ProjectId,RiskIssueStatus,ProjectId&$filter=ProjectId eq (guid'` + projectPlanGuid + `')`;
        return fetch(proUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(data => data.json())
            .then((data) => {
                console.log(data);
            }).catch(e => console.log(e))
    }

    public static fetchMilestonesForProjectPlan = (projectPlanGuid: string, relatedPlans): Promise<{ value: [] }> => {
        const projectUrl = this.ProjectCenterUrl;
        let queryFilter = ""
        if (projectPlanGuid == null) {
            relatedPlans.forEach((eachProject) => {
                queryFilter +=
                    `(ProjectId eq (guid'` + eachProject.Title + `')) or `
            })
            queryFilter = queryFilter.slice(0, -4);
            queryFilter = '(' + queryFilter + ')'
        } else {
            queryFilter = `ProjectId eq (guid'` + projectPlanGuid + `')`
        }

        let proUrl = projectUrl +
            `/_api/ProjectData/Tasks()?$Select=TaskName,TaskFinishDate,ProjectId,*
        &$filter=${queryFilter} and HighlightActivity eq true &$top=4999`;
        //removed the sorting query from here as sorting is handled through JS
        // &$top=4999&$orderby=TaskFinishDate asc`;

        return fetch(proUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(data => data.json())
            .then(async (data) => {
                return data;
            }).catch(error => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
    }

    public static fetchMilestonesForAllProjectPlan = (projectPlanGuid: string): Promise<{ value: [] }> => {
        const projectUrl = this.ProjectCenterUrl;
        let proUrl = projectUrl +
            `/_api/ProjectData/Tasks()?$Select=TaskName,TaskFinishDate,ProjectId,*
        &$filter=HighlightActivity eq true &$top=4999&$orderby=TaskFinishDate asc`;

        return fetch(proUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(data => data.json())
            .then(async (data) => {
                return data;
            }).catch(error => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
    }

    public static fetchMilestonesForProjectPlanAll = (): Promise<{ value: [] }> => {
        const projectUrl = this.ProjectCenterUrl;
        let proUrl = projectUrl +
            `/_api/ProjectData/Tasks()?$Select=TaskName,TaskFinishDate,ProjectId,*
        &$filter=HighlightActivity eq true 
        &$top=4999&$orderby=TaskFinishDate asc`;

        return fetch(proUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(data => data.json())
            .then(async (data) => {
                return data.value;
            }).catch(error => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            });
    }

    //to fetch list data containing fields
    public static getBusinessUnits = async (listName): Promise<any> => {
        return await this.NPLDigitalApps_Context.lists.getByTitle(listName).items
            .select('*')
            //.orderBy(sortColumn, true)
            .top(5000)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
                // let errorMsg = {
                //     Source: `DataService-getRequestListData -ListName : ${listName}`,
                //     Message: error.message,
                //     StackTrace: new Error().stack
                // };
                // this.addDatatoList('Errors_Logs', errorMsg);
            });
    }

    public static getAllPfizerConnectData = async () => {
        return await this.PCNCM_Context.lists.getByTitle("ConnectProject Master").items
            .select("*,ChangeOwner/Title,ChangeOwner/ID,ConnectPM/Title,ConnectPM/ID")
            .top(5000)
            .expand('ChangeOwner,ConnectPM')
            .orderBy('ConnectID', true)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log('error fetching data from ConnectProject Master list', error);
            });
    }

    public static getPfizerConnectData = async (PfizerConnectID) => {
        return await this.PCNCM_Context.lists.getByTitle("ConnectProject Master").items
            .select("*,ChangeOwner/Title,ChangeOwner/ID,ConnectPM/Title,ConnectPM/ID")
            .top(5000)
            .filter(`ConnectID eq ` + PfizerConnectID)
            .expand('ChangeOwner,ConnectPM')
            .orderBy('ConnectID', true)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log('error fetching data from ConnectProject Master list', error);
            });
    }

    public static getApiShipmentDate = async () => {
        return await this.PCNCM_Context.lists.getByTitle("ConnectProjectDatabase").items
            .select("ID,ConnectID,Title,Date,DestinationMarket")
            .top(5000)
            //.filter('Title eq API Shipment')
            .orderBy('ID', true)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log('error fetching data from ConnectProject database list', error);
            });
    }

    public static getApiShipmentDateData = async (PfizerConnectID) => {
        return await this.PCNCM_Context.lists.getByTitle("ConnectProjectDatabase").items
            .select("ID,ConnectID,Title,Date,DestinationMarket")
            .top(5000)
            .filter(`ConnectID eq ` + PfizerConnectID)
            .orderBy('Date', true)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log('error fetching data from ConnectProject Database list', error);
            });
    }

    public static getCurrentPfizerConnectID = async () => {
        return await this.PCNCM_Context.lists.getByTitle("ConnectProject Master").items
            .select("ID,ConnectID")
            .top(1)
            .orderBy('ConnectID', false)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log('error fetching data from ConnectProject Master list', error);
            });
    }

    public static fetchAllItems_GLO_ProductProjectDetails = async (listname): Promise<any> => {
        return this.NPLDigitalApps_Context.lists.getByTitle(listname)
            .items.select('*,PGSLeaders/Title')
            .expand('PGSLeaders')
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }

    // LaunchXlist data from NPD    
    public static getLaunchXlistData = async (listName, filterCondition): Promise<any> => {
        return await this.NPD_Context.lists.getByTitle(listName)
            .items
            .select('*')
            .orderBy("ID", false)
            .filter(filterCondition)
            .get()
            .then(async (Items) => {
                return Items[0];
            }).catch(error => {
                console.log(listName + " error in ", error);
            });
    }
    //to fetch all items from the list
    public static fetchAllItems = async (listname): Promise<any> => {
        return await this.NPD_Context.lists.getByTitle(listname)
            .items
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }
    public static fetchExternalListDetailswithFilterCondition = async (_siteUrl, listname, selectQuery, filterQuery, expandQuery): Promise<any> => {
        const web = Web(_siteUrl);
        let DDList = null;
        return (await web.lists.getByTitle(listname).items
            .select(selectQuery)
            .top(5000)
            .filter(`${filterQuery}`)
            .expand(expandQuery)
            //.orderBy("SortOrder", true)
            .get()
            .then(async (Items) => {
                DDList = await Items;
                return await DDList;
            }).catch(error => {
                console.log("Error in getting items from " + listname + " list : ", error);
            })
        );
    }
    public static fetchAllItems_GridView = async (listname): Promise<any> => {
        return await this.NPD_Context.lists.getByTitle(listname)
            .items.select('*,Editor/Title,AttachmentFiles')
            .orderBy('Modified', false)
            .expand('Editor,AttachmentFiles')
            .getAll()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(`Error in getting items from` + listname + `list : `, error);
            });
    }
    public static getRequestListDataNPD = async (listName, sortColumn): Promise<any> => {
        return await this.NPD_Context.lists.getByTitle(listName).items
            .select('*')
            .orderBy(sortColumn, true)
            .top(5000)
            .get()
            .then(async (Items) => {
                return Items;
            }).catch(error => {
                console.log(listName + " error in ", error);
                let errorMsg = {
                    Source: `DataService-getRequestListData -ListName : ${listName}`,
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                //this.addDatatoList('Errors_Logs', errorMsg);
                console.log(errorMsg);
            });
    }
    public static getProjectName = (programData) => {
        try {
            let item = programData;
            let programName;
            if (item.IsAutomated)
                programName = item.ProductShortDesc?.length > 120 ? item.CompoundName : item.ProductShortDesc;
            else
                programName = item.ShortDesc?.length > 120 ? item.CompoundName : item.ShortDesc;
            if (programName == null || programName == undefined || programName == '')
                programName = '';
            else programName = " : " + programName;
            return item.PfizerCode + programName;
        } catch (error) {
            let errorMsg = {
                Source: 'Dataservice-getProjectName',
                Message: error.message,
                StackTrace: new Error().stack
            };
            //this.addDatatoList('Errors_Logs', errorMsg);
            console.log(errorMsg);
        }
    }
    public static sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
}