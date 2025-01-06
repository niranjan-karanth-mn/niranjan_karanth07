//import * as React from 'react';

import { DataService } from '../../Shared/DataService';

//import { DynamicObjFormat } from '../../Redux/ReduxSlices/MasterDataSlice';

const StatusMappingObj = {
    'Green': 'On Track',
    'Yellow': 'At Risk',
    'Red': 'Delayed',
    'Blue': 'Complete',
    'Grey': 'Not Initiated'
};

export default async function GetDeepDiveMilestonesAndRiskAssessments(NPDUrl: string, type: string, TemplateFiltersArr: Array<any>, LaunchProgressFiltersArr: Array<any>, PfizerCode) {

    //const UtilService = new LaunchXService('');

    let ExeAppRiskAssArr = [], ProjectCenterDDMilestonesData = [], ProjectCenterPlansArr = [];
    let ExeAppUrl = '';
    // ProjectCenterUrl = '';
    if (NPDUrl == 'https://pfizer.sharepoint.com/sites/LaunchXNPD_QA') {
        ExeAppUrl = 'https://pfizer.sharepoint.com/sites/NPL_Digital_Apps_QA';
        // ProjectCenterUrl = 'https://pfizer.sharepoint.com/sites/NPLPWA-QA';
    } else if (NPDUrl == 'https://pfizer.sharepoint.com/sites/LaunchXNPD') {
        ExeAppUrl = 'https://pfizer.sharepoint.com/sites/NPL_DIGITAL_APPS';
        // ProjectCenterUrl = 'https://pfizer.sharepoint.com/sites/NPLPWA';
    } else {
        ExeAppUrl = 'https://pfizer.sharepoint.com/sites/NPL_Digital_Apps_Dev';
        // ProjectCenterUrl = 'https://pfizer.sharepoint.com/sites/NPLPWA-Dev';
    }
    // let TemplateFiltersArr = ConfigSliceReduxState.ConfigListSlice.ConfigListData?.filter(item => item?.Title == 'DDPGSTemplateFilters')?.[0]?.['Value']?.split('#@#');
    // let LaunchProgressFiltersArr = ConfigSliceReduxState.ConfigListSlice.ConfigListData?.filter(item => item?.Title == 'DDLaunchProgressFilters')?.[0]?.['Value']?.split('#@#');

    let TemplateFilterQuery = '';
    TemplateFiltersArr.map((rec, index) => {
        TemplateFilterQuery = TemplateFilterQuery + ` PGSTemplate eq '${rec}'`;
        if (index + 1 != TemplateFiltersArr?.length) {
            TemplateFilterQuery = TemplateFilterQuery + ' or ';
        }
    });
    let LaunchProgressFilterQuery = '';
    LaunchProgressFiltersArr.map((rec, index) => {
        LaunchProgressFilterQuery = LaunchProgressFilterQuery + ` LaunchProgress eq '${rec}'`;
        if (index + 1 != LaunchProgressFiltersArr?.length) {
            LaunchProgressFilterQuery = LaunchProgressFilterQuery + ' or ';
        }
    });
    // let ProjectCenterTemplateQuery = TemplateFilterQuery.replace(/Template/g, 'EnterpriseProjectTypeName');
    let CommonProjectListFilterQuery = `(${TemplateFilterQuery}) and (${LaunchProgressFilterQuery}) and DeepDive eq 1`;
    // if (type != 'All') CommonProjectListFilterQuery = CommonProjectListFilterQuery + ` and PfizerCode eq '${PfizerCode}'`;
    // let ProjectCenterProjectsUrl = `${ExeAppUrl}/_api/web/lists/getByTitle('PGS_Common_ProjectList')/items?$filter=${CommonProjectListFilterQuery}`;
    // let ProjectCenterTasksUrl = `${ProjectCenterUrl}/_api/ProjectData/Tasks()?$filter=DeepDiveMilestone eq true &$top=4999`;
    // await fetch(ProjectCenterProjectsUrl, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     }
    // }).then(res => res.json())
    let PlanIndex = 0;
    await DataService.fetchExternalListDetailswithFilterCondition(ExeAppUrl, 'PGS_Common_ProjectList', '*', CommonProjectListFilterQuery, '')
        .then(async ProjectPlans => {
            ProjectCenterPlansArr = ProjectPlans;
            if (type != 'All') ProjectCenterPlansArr = ProjectCenterPlansArr?.filter(rec => rec.PfizerCode.trim() == PfizerCode.trim());
            ProjectCenterPlansArr?.map(project => {
                let ProjectPlanName = project.ProjectName?.split('-');
                ProjectPlanName?.splice(ProjectPlanName?.length - 2).join('-');
                ProjectPlanName = ProjectPlanName.join('-');
                ProjectCenterDDMilestonesData.push({
                    Milestone: 'Launch Readiness-GLOW',
                    MilestoneOnTrackMet: StatusMappingObj[project.LaunchStatus],
                    TargetDate: project.TaskFinishDate,
                    MilestoneDescription: ProjectPlanName,
                    Source: 'DLPP',
                    IsActive: true,
                    index: ++PlanIndex,
                    ProjectID: project.Title,
                    PfizerCode: project.PfizerCode,
                    spID: project.ID,
                    ID: project.ID,
                    Modified: project.Modified,
                    sourceForDD: 'CommonList',
                    showInNPLT6Report:project.showInNPLT6Report
                });
            });

            await DataService.fetchExternalListDetailswithFilterCondition(ExeAppUrl, 'DeepDiveProjectCenterTasks', '*,Editor/Title', 'Delete eq false', 'Editor')
                .then(Tasks => {
                    // Tasks = Tasks.value;
                    let FilteredTasks = Tasks?.filter(task => ProjectCenterPlansArr?.some(project => project.Title == task.Title));
                    FilteredTasks = FilteredTasks?.filter(rec => !rec.Delete);
                    FilteredTasks?.map(task => {
                        let projectPlanDetails = ProjectCenterPlansArr?.filter(project => project.Title == task.Title);
                        // remove Template type from Proj plan name
                        let ProjectPlanName = task.ProjectPlanName?.split('-');
                        ProjectPlanName?.splice(ProjectPlanName?.length - 2).join('-');
                        ProjectPlanName = ProjectPlanName.join('-');
                        ProjectCenterDDMilestonesData.push({
                            Milestone: task.TaskName,
                            MilestoneOnTrackMet: StatusMappingObj[task.LaunchHealth],
                            MilestoneDescription: ProjectPlanName,
                            TargetDate: task.TaskFinishDate,
                            Source: 'DLPP',
                            IsActive: true,
                            index: ++PlanIndex,
                            ProjectID: task.Title,
                            PfizerCode: projectPlanDetails?.[0]?.['PfizerCode'],
                            spID: task.ID,
                            ID: task.ID,
                            Modified: task.Modified,
                            sourceForDD: 'Tasks',
                            showInNPLT6Report: task.showInNPLT6Report
                        });
                    });
                }).catch(error => {
                    //push it to Error logs instead
                    let errorMsg = {
                        Source: 'GetDeepDiveMIlestoneRisks-DeepdiveTasks fetch',
                        Message: error.message,
                        StackTrace: new Error().stack
                    };
                    DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                        console.error(error);
                    });
                });
        }).catch(err => {
            //push it to Error logs instead
            console.log('Error in fetching Proj Center data : ', err);
        });

    //Fetch Exe App Risk Only when Exe App Risks are not coming from parent through props( we are storing Exe app risks in parent when we fetch it first time in DeepDive Component )
    // get Risk Assessments from Executive App
    let filterQuery = `Active eq 1 and DeepDive eq 1`;
    let selectQuery = '*,ProjectID/ProjectName,ProjectID/Title';
    let expandQuery = 'ProjectID';
    await DataService.fetchExternalListDetailswithFilterCondition(ExeAppUrl, 'PGS_Executive_Risks', selectQuery, filterQuery, expandQuery).then(resp => {
        resp = resp?.filter(rec => rec.Active === true);
        // console.log('Actual risk : ', resp);
        resp = resp?.filter(rec => ProjectCenterPlansArr?.some(item => item?.Title == rec.ProjectID?.['Title']));
        // console.log('final filter risk : ', resp);
        let index = 0;
        resp?.map(rec => {
            ExeAppRiskAssArr.push({
                MitigationApproach: rec.Mitigation,
                RiskOrIssue: rec.DeepDiveRiskTitle,
                RiskStatus: rec.DeepDiveRiskStatus,
                RiskCategory: rec.DeepDiveRiskCategory,
                // RiskStatus: rec.RiskStatus == 'Low' ? 'On Track' : rec.RiskStatus == 'Medium' ? 'At Risk' : rec.RiskStatus == 'High' ? 'Delayed' : rec.RiskStatus,
                IsActive: true,
                Source: 'DLPP',
                index: ++index,
                spID:rec.ID,
                ID: rec.ID,
                Modified: rec.Modified,
                ProjectName: rec.ProjectID?.ProjectName,
                showInNPLT6Report:rec.showInNPLT6Report
            });
        });
    }).catch(error => {
        let errorMsg = {
            Source: 'DeepDive Form-getExeAppRisks',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    });


    return { ProjectCenterDDMilestonesData, ExeAppRiskAssArr };

}