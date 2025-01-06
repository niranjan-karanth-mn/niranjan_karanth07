import { format } from 'date-fns';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { DataService } from '../../../Shared/DataService';
import { statusValues } from '../../../Shared/Objects';

export default async function ExcelReport(projectData, PPData, type, planRecords, SelectedView, ProductName) {
    try {
        const fileExtension = '.xlsx';

        let expAccomplish = [];
        let accomplish = PPData?.accomData;
        if (accomplish && accomplish.length > 0) {
            accomplish.map((item, key) => {
                expAccomplish.push({
                    ProjectName: item?.ProjectID.ProjectName,
                    Accomplishment: item?.Task,
                    Date: item?.Date ? format(new Date(item?.Date), 'MMM-dd-yyyy') : '',
                    IsActivity: item?.IsActivity ? 'X' : '',
                    Active: item?.Active ? 'X' : ""
                });
            });
        }
        else {
            expAccomplish.push({
                ProjectName: '',
                Accomplishment: '',
                Date: '',
                IsActivity: '',
                Active: ''
            });
        }
        //Milestone
        let expMilestone = [];
        let milestone = PPData?.milestoneData;
        if (milestone && milestone.length > 0) {
            milestone.map((item, key) => {
                expMilestone.push({
                    ProjectName: item.ProjectName,
                    'Milestone/Deliverables': item?.TaskName,
                    'TargetDate': item?.TaskFinishDate ? format(new Date(item?.TaskFinishDate), 'MMM-dd-yyyy') : '',
                    'Status': item?.LaunchHealth,
                    'NPLT6': item?.NPLT6Milestone ? 'X' : ''
                });
            });
        }
        else {
            expMilestone.push({
                ProjectName: '',
                'Milestone/Deliverables': '',
                'TargetDate': '',
                'Status': '',
                'NPLT6': '',
            });
        }
        //Activity
        let expActivity = [];
        let activity = PPData?.activityData;
        if (activity && activity.length > 0) {
            activity.map((item, key) => {
                expActivity.push({
                    ProjectName: item?.ProjectID.ProjectName,
                    Activities: item?.Activity,
                    'Date': item?.Date ? format(new Date(item?.Date), 'MMM-dd-yyyy') : '',
                    'Status': item?.Status,
                    'Active': item?.Active ? 'X' : ''
                });
            });
        }
        else {
            expActivity.push({
                ProjectName: '',
                Activities: '',
                'Date': '',
                'Status': '',
                'Active': ''
            });
        }
        //Risk
        let expRisk = [];
        let risk = PPData?.riskAssessmentData;
        if (risk && risk.length > 0) {
            risk.map((item, key) => {
                expRisk.push({
                    ProjectName: item?.ProjectID.ProjectName,
                    'RiskTitle': item.RiskTitle,
                    'RiskDate': item?.RiskDate ? format(new Date(item?.RiskDate), 'MMM-dd-yyyy') : '',
                    'RiskStatus': item.RiskStatus,
                    'Mitigation': item.Mitigation,
                    'MitigationDate': item?.MitigationDate ? format(new Date(item?.MitigationDate), 'MMM-dd-yyyy') : '',
                    'MitigationStatus': item?.MitigationStatus,
                    'Active': item.Active ? 'X' : '',
                    'NPLT6': item?.DeepDive ? 'X' : '',
                    'DeepDiveRiskTitle': item?.DeepDiveRiskTitle,
                    'DeepDiveRiskCategory': item?.DeepDiveRiskCategory,
                    'DeepDiveRiskStatus': item?.DeepDiveRiskStatus
                });
            });
        }
        else {
            expRisk.push({
                ProjectName: '',
                'RiskTitle': '',
                'RiskDate': '',
                'RiskStatus': '',
                'Mitigation': '',
                'MitigationDate': '',
                'MitigationStatus': '',
                'Active': '',
                'NPLT6': '',
                'DeepDiveRiskTitle': '',
                'DeepDiveRiskCategory': '',
                'DeepDiveRiskStatus': ''
            });
        }
        let excelFileName = 'NPL_';
        if (SelectedView == 'Product View') {
            if (type == 'All')
                excelFileName = 'NPL_' + ProductName + fileExtension;
            else
                excelFileName = 'NPL_' + type + fileExtension;
        }
        else {
            if (type == 'All')
                excelFileName = 'NPL_' + ProductName + fileExtension;
            else
                excelFileName = 'NPL_' + type + fileExtension;
        }
        const workbook = new ExcelJS.Workbook();

        let ProjDetailsWorkSheet;
        //Jefin logic modified
        //NO need of 1st sheet in excel if 'All' is selected
        if (type !== 'All') {
            ProjDetailsWorkSheet = workbook.addWorksheet('Project Details', { properties: { tabColor: { argb: '81c784' } } });
            ProjDetailsWorkSheet.columns = [
                { header: 'Project Name', key: 'ProjectName', width: 40 },
                { header: 'Launch Lead', key: 'LaunchLead', width: 40 },
                { header: 'Business Unit', key: 'BU', width: 40 },
                { header: 'Market', key: 'Market', width: 40 },
                { header: 'Launch Progress', key: 'LaunchProgress', width: 25 },
                { header: "Launch Status", key: 'LaunchStatus', width: 30 },
                { header: 'Resource Status', key: 'ResourceStatus', width: 25 },
                { header: "Risk/Issue Status", key: 'RiskIssueStatus', width: 30 },
                { header: 'PGS Readiness Date', key: 'TaskFinishDate', width: 20 },
                { header: 'NPL T6', key: 'DeepDive', width: 20 },
            ];

            ProjDetailsWorkSheet.addRow({
                'ProjectName': projectData.ProjectName,
                'LaunchLead': projectData.LaunchLead,
                'BU': projectData.BusinessUnit,
                'Market': projectData.Market,
                'LaunchProgress': projectData.LaunchProgress,
                'LaunchStatus': projectData.LaunchStatus,
                'ResourceStatus': projectData.ResourceStatus ? projectData.ResourceStatus : '',
                'RiskIssueStatus': projectData.Risk_x002f_IssueStatus ? projectData.Risk_x002f_IssueStatus : '',
                'TaskFinishDate': projectData.TaskFinishDate ? format(new Date(projectData.TaskFinishDate), 'MMM-dd-yyyy') : '',
                'DeepDive': projectData.DeepDive ? 'X' : ''
            });
        }

        //Jefin commented
        //NO need of 1st sheet in excel if 'All' is selected
        if (false) {
            if (type == 'All') {
                let allPlans = planRecords.filter(rec => rec.DRID == projectData.DRID);
                allPlans.map(project => {
                    ProjDetailsWorkSheet.addRow({
                        'ProjectName': project.ProjectName,
                        'LaunchLead': project.LaunchLead,
                        'BU': project.BusinessUnit,
                        'Market': project.Market,
                        'LaunchProgress': project.LaunchProgress,
                        'LaunchStatus': project.LaunchStatus,
                        ResourceStatus: project.ResourceStatus ? project.ResourceStatus : '',
                        RiskIssueStatus: project.RiskStatus ? project.RiskStatus : '',
                        'TaskFinishDate': project.TaskFinishDate ? format(new Date(project.TaskFinishDate), 'MMM-dd-yyyy') : '',
                        'DeepDive': project.DeepDive ? 'X' : ''
                    });
                })

            } else {
                ProjDetailsWorkSheet.addRow({
                    'ProjectName': projectData.ProjectName,
                    'LaunchLead': projectData.LaunchLead,
                    'BU': projectData.BusinessUnit,
                    'Market': projectData.Market,
                    'LaunchProgress': projectData.LaunchProgress,
                    'LaunchStatus': projectData.LaunchStatus,
                    'ResourceStatus': projectData.ResourceStatus ? projectData.ResourceStatus : '',
                    'RiskIssueStatus': projectData.Risk_x002f_IssueStatus ? projectData.Risk_x002f_IssueStatus : '',
                    'TaskFinishDate': projectData.TaskFinishDate ? format(new Date(projectData.TaskFinishDate), 'MMM-dd-yyyy') : '',
                    'DeepDive': projectData.DeepDive ? 'X' : ''
                });
            }
        }

        // Cell Formating
        //Jefin logic changed
        //If 'all' then no need of 'project details' sheet
        if (type !== 'All') {
            // Create Header
            let HeaderCell = ProjDetailsWorkSheet["_rows"][0]["_cells"]
            for (let i = 0; i < HeaderCell.length; i++) {
                let CellAddress = HeaderCell[i]["_address"]
                ProjDetailsWorkSheet.getCell(CellAddress).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'add8e6' },
                };
                ProjDetailsWorkSheet.getCell(CellAddress).font = {
                    bold: true
                };
            }

            let ProjDetailsDataRows = ProjDetailsWorkSheet["_rows"];
            for (let i = 1; i < ProjDetailsDataRows.length; i++) {
                let Cells = ProjDetailsDataRows[i]["_cells"]
                for (let j = 0; j < Cells.length; j++) {
                    let CellEach = Cells[j]
                    let ColumnHeader = CellEach?._column?._key;
                    let CellAddress = CellEach?._address;
                    if (ColumnHeader == "LaunchStatus" || ColumnHeader == "RiskIssueStatus" || ColumnHeader == "ResourceStatus") {
                        let CellValue = ProjDetailsWorkSheet.getCell(CellAddress).value;
                        let colorfilter = statusValues.filter(x => x.key === CellValue) || null;
                        let bgcolor = colorfilter[0]?.bgColor;
                        let fontcolor = colorfilter[0]?.color;
                        ProjDetailsWorkSheet.getCell(CellAddress).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: bgcolor },
                        };
                        ProjDetailsWorkSheet.getCell(CellAddress).font = {
                            color: { argb: fontcolor },
                        };
                        ProjDetailsWorkSheet.getCell(CellAddress).value = colorfilter[0]?.value;
                    }
                }
            }
        }

        // Accomplish Worksheet
        const AccomplishSheet = workbook.addWorksheet('Accomplishments', { properties: { tabColor: { argb: '81c784' } } });

        let AccHeaderArr = [
            { header: 'Accomplishment', key: 'Accomplishment', width: 35 },
            { header: 'Date', key: 'Date', width: 15 },
            { header: 'Completed Activity', key: 'IsActivity', width: 20 },
            { header: 'Active', key: 'Active', width: 10 },
        ];
        if (type == 'All')
            AccHeaderArr.unshift({ header: 'Project Name', key: 'ProjectName', width: 35 })
        AccomplishSheet.columns = AccHeaderArr;

        expAccomplish.map((item, key) => {
            if (type == 'All')
                AccomplishSheet.addRow({
                    ProjectName: item?.ProjectName,
                    'Accomplishment': item['Accomplishment'],
                    'Date': item['Date'],
                    'IsActivity': item['IsActivity'],
                    'Active': item['Active']
                });
            else AccomplishSheet.addRow({
                'Accomplishment': item['Accomplishment'],
                'Date': item['Date'],
                'IsActivity': item['IsActivity'],
                'Active': item['Active']
            });
        });
        let AccomHeaderCell = AccomplishSheet["_rows"][0]["_cells"];
        for (let i = 0; i < AccomHeaderCell.length; i++) {
            let CellAddress = AccomHeaderCell[i]["_address"];
            AccomplishSheet.getCell(CellAddress).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '81c784' },
            };
            AccomplishSheet.getCell(CellAddress).font = {
                bold: true,
                color: { argb: '000000' }
            };

        }

        //Activities
        const ActivitiesSheet = workbook.addWorksheet('Activities', { properties: { tabColor: { argb: '1976d2' } } });
        let actHeaderArr = [
            { header: 'Activities', key: 'Activities', width: 65 },
            { header: 'Date', key: 'Date', width: 20 },
            { header: 'Activity Status', key: 'Status', width: 20 },
            { header: 'Active', key: 'Active', width: 20 }
        ];
        if (type == 'All')
            actHeaderArr.unshift({ header: 'Project Name', key: 'ProjectName', width: 35 })
        ActivitiesSheet.columns = actHeaderArr;

        expActivity.map((item, key) => {
            if (type == 'All')
                ActivitiesSheet.addRow({
                    ProjectName: item?.ProjectName,
                    'Activities': item.Activities,
                    'Date': item.Date,
                    'Status': item.Status,
                    'Active': item.Active
                });
            else
                ActivitiesSheet.addRow({
                    'Activities': item.Activities,
                    'Date': item.Date,
                    'Status': item.Status,
                    'Active': item.Active
                });
        });

        let DataRows = ActivitiesSheet["_rows"];
        DataRows?.map(row => {
            row._cells?.map(cell => {
                let CellAddress = cell["_address"];
                if (cell?._column?._key == 'Status') {
                    let CellValue = ActivitiesSheet.getCell(CellAddress).value;
                    let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                    colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                    ActivitiesSheet.getCell(CellAddress).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: colorfilter['bgColor'] },
                    };
                    ActivitiesSheet.getCell(CellAddress).font = {
                        color: { argb: colorfilter['color'] },
                    };

                }
            });
        });
        let ActivitiesHeaderCell = ActivitiesSheet["_rows"][0]["_cells"];
        for (let i = 0; i < ActivitiesHeaderCell.length; i++) {
            let CellAddress = ActivitiesHeaderCell[i]["_address"];
            ActivitiesSheet.getCell(CellAddress).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '1976d2' },
            };
            ActivitiesSheet.getCell(CellAddress).font = {
                bold: true,
                color: { argb: 'ffffff' }
            };

        }

        // Milestones
        const MilestonesSheet = workbook.addWorksheet('Milestones', { properties: { tabColor: { argb: 'fff1ce' } } });
        let milestoneHeaderArr = [
            { header: 'Milestone/Deliverables', key: 'Milestone/Deliverables', width: 35 },
            { header: 'Target Date', key: 'TargetDate', width: 15 },
            { header: 'Status', key: 'Status', width: 20 },
            { header: 'NPL T6', key: 'NPLT6', width: 20 }

        ];
        if (type == 'All')
            milestoneHeaderArr.unshift({ header: 'Project Name', key: 'ProjectName', width: 35 })
        MilestonesSheet.columns = milestoneHeaderArr;

        expMilestone.map((item, key) => {
            if (type == 'All')
                MilestonesSheet.addRow({
                    ProjectName: item.ProjectName,
                    'Milestone/Deliverables': item['Milestone/Deliverables'],
                    'TargetDate': item['TargetDate'],
                    'Status': item['Status'] ? statusValues.filter(rec => rec.key == item.Status)?.[0].value : null,
                    'NPLT6': item['NPLT6']
                });
            else
                MilestonesSheet.addRow({
                    'Milestone/Deliverables': item['Milestone/Deliverables'],
                    'TargetDate': item['TargetDate'],
                    'Status': item['Status'] ? statusValues.filter(rec => rec.key == item.Status)?.[0].value : null,
                    'NPLT6': item['NPLT6']
                });
        });
        DataRows = MilestonesSheet["_rows"];
        DataRows?.map(row => {
            row['_cells']?.map(cell => {
                let CellAddress = cell["_address"];
                if (cell?.["_column"]["_key"] == 'Status') {
                    let CellValue = MilestonesSheet.getCell(CellAddress).value;
                    let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                    colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                    MilestonesSheet.getCell(CellAddress).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: colorfilter['bgColor'] },
                    };
                    MilestonesSheet.getCell(CellAddress).font = {
                        color: { argb: colorfilter['color'] },
                    };
                }
            });
        });
        let MilestoneHeaderCell = MilestonesSheet["_rows"][0]["_cells"];
        for (let i = 0; i < MilestoneHeaderCell.length; i++) {
            let CellAddress = MilestoneHeaderCell[i]["_address"];
            MilestonesSheet.getCell(CellAddress).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'fff1ce' },
            };
            MilestonesSheet.getCell(CellAddress).font = {
                bold: true,
                color: { argb: '000000' }
            };

        }

        //Risk Assessment
        const RiskAssessmentSheet = workbook.addWorksheet('Risk Assessment', { properties: { tabColor: { argb: 'edb0b0' } } });
        let riskHeaderArr = [
            { header: 'Risk/Issue', key: 'RiskTitle', width: 65 },
            { header: 'Risk Date', key: 'RiskDate', width: 20 },
            { header: 'Risk Status', key: 'RiskStatus', width: 20 },
            { header: 'Mitigation Plan', key: 'Mitigation', width: 65 },
            { header: 'Mitigation Date', key: 'MitigationDate', width: 20 },
            { header: 'Mitigation Status', key: 'MitigationStatus', width: 20 },
            { header: 'Active', key: 'Active', width: 20 },
            { header: 'NPL T6', key: 'NPLT6', width: 20 },
            { header: 'NPL T6 Risk/Issue', key: 'DeepDiveRiskTitle', width: 30 },
            { header: 'NPL T6 Risk Category', key: 'DeepDiveRiskCategory', width: 30 },
            { header: 'NPL T6 Risk Status', key: 'DeepDiveRiskStatus', width: 30 }
        ];
        if (type == 'All')
            riskHeaderArr.unshift({ header: 'Project Name', key: 'ProjectName', width: 35 })
        RiskAssessmentSheet.columns = riskHeaderArr;

        expRisk.map((item, key) => {
            if (type === 'All')
                RiskAssessmentSheet.addRow({
                    ProjectName: item?.ProjectName,
                    'RiskTitle': item?.RiskTitle,
                    'RiskDate': item?.RiskDate,
                    'RiskStatus': item?.RiskStatus,
                    'Mitigation': item?.Mitigation,
                    'MitigationDate': item?.MitigationDate,
                    'MitigationStatus': item?.MitigationStatus,
                    'Active': item?.Active,
                    'NPLT6': item?.NPLT6,
                    'DeepDiveRiskTitle': item?.DeepDiveRiskTitle,
                    'DeepDiveRiskCategory': item?.DeepDiveRiskCategory,
                    'DeepDiveRiskStatus': item?.DeepDiveRiskStatus
                });
            else
                RiskAssessmentSheet.addRow({
                    'RiskTitle': item?.RiskTitle,
                    'RiskDate': item?.RiskDate,
                    'RiskStatus': item?.RiskStatus,
                    'Mitigation': item?.Mitigation,
                    'MitigationDate': item?.MitigationDate,
                    'MitigationStatus': item?.MitigationStatus,
                    'Active': item?.Active,
                    'NPLT6': item?.NPLT6,
                    'DeepDiveRiskTitle': item?.DeepDiveRiskTitle,
                    'DeepDiveRiskCategory': item?.DeepDiveRiskCategory,
                    'DeepDiveRiskStatus': item?.DeepDiveRiskStatus
                });
        });

        DataRows = RiskAssessmentSheet["_rows"];
        DataRows?.map(row => {
            row._cells?.map(cell => {
                let CellAddress = cell["_address"];
                if (cell?.["_column"]["_key"] == 'RiskStatus' || cell?.["_column"]["_key"] == 'MitigationStatus' || cell?.["_column"]["_key"] == 'DeepDiveRiskStatus') {
                    let CellValue = RiskAssessmentSheet.getCell(CellAddress).value;
                    let colorfilter = statusValues.filter(x => x.key === CellValue)?.[0] || null;
                    colorfilter = colorfilter ? colorfilter : { key: '', id: '', value: '', bgColor: 'ffffff', color: '000000' };
                    RiskAssessmentSheet.getCell(CellAddress).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: colorfilter.bgColor },
                    };
                    RiskAssessmentSheet.getCell(CellAddress).font = {
                        color: { argb: colorfilter.color },
                    };
                }
            });
        });
        let RiskAssessmentHeaderCell = RiskAssessmentSheet["_rows"][0]["_cells"];
        for (let i = 0; i < RiskAssessmentHeaderCell.length; i++) {
            let CellAddress = RiskAssessmentHeaderCell[i]["_address"];
            RiskAssessmentSheet.getCell(CellAddress).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'edb0b0' },
            };
            RiskAssessmentSheet.getCell(CellAddress).font = {
                bold: true,
                color: { argb: '000000' }
            };
        }

        //Download Excel
        workbook.xlsx.writeBuffer().then(buffer => {
            // done
            const blob = new Blob([buffer], { type: "applicationi/xlsx" });
            FileSaver.saveAs(blob, excelFileName);
        })
            .catch(e => console.error(e));

    } catch (error) {
        let errorMsg = {
            Source: 'Exe App - Excel Report',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg)
            .catch(e => console.error(e));
    }
}