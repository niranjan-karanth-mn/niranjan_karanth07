import { DataService } from '../../../Shared/DataService';
// import { statusValues } from '../../../Shared/DataService';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { format } from 'date-fns';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const colorObj = {
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

const statusValues = [
    { key: 'At Risk', value: "At Risk", id: 'Yellow', bgColor: colorObj.yellowBtnBg, color: colorObj.yellowBtnTextColor },
    { key: 'Completed', value: "Completed", id: 'Blue', bgColor: colorObj.completeBtnBg, color: colorObj.completeBtnTextColor },
    { key: 'Complete', value: "Complete", id: 'Blue', bgColor: colorObj.completeBtnBg, color: colorObj.completeBtnTextColor },
    { key: 'Delayed', value: "Delayed", id: 'Red', bgColor: colorObj.redBtnBg, color: colorObj.redBtnTextColor },
    { key: 'High Risk', value: "High Risk", id: 'Red', bgColor: colorObj.redBtnBg, color: colorObj.redBtnTextColor },
    { key: 'On Track', value: "On Track", id: 'Green', bgColor: colorObj.greenbtnBg, color: colorObj.greenBtnTextColor },
    { key: 'Not Initiated', value: "Not Initiated", id: 'Grey', bgColor: colorObj.greyBtnBg, color: colorObj.greyBtnTextColor },
    { key: 'High', value: "High", id: 'Red', bgColor: colorObj.redBtnBg, color: colorObj.redBtnTextColor },
    { key: 'Medium', value: "Medium", id: 'Yellow', bgColor: colorObj.yellowBtnBg, color: colorObj.yellowBtnTextColor },
    { key: 'Low', value: "Low", id: 'Green', bgColor: colorObj.greenbtnBg, color: colorObj.greenBtnTextColor },
    { key: 'Yellow', value: "At Risk", id: 'Yellow', bgColor: colorObj.yellowBtnBg, color: colorObj.yellowBtnTextColor },
    { key: 'Blue', value: "Complete", id: 'Blue', bgColor: colorObj.completeBtnBg, color: colorObj.completeBtnTextColor },
    { key: 'Red', value: "Delayed", id: 'Red', bgColor: colorObj.redBtnBg, color: colorObj.redBtnTextColor },
    { key: 'Green', value: "On Track", id: 'Green', bgColor: colorObj.greenbtnBg, color: colorObj.greenBtnTextColor },
    { key: 'Grey', value: "Not Initiated", id: 'Grey', bgColor: colorObj.greyBtnBg, color: colorObj.greyBtnTextColor },
];

export default async function PDFReport(projectData, PPData, type, SelectedView, header2Values) {
    try {

        let accomplishArray = PPData?.accomData;
        let Accomplishments = [];
        Accomplishments.push([
            { text: 'Accomplishment', bold: true, fontSize: 14, color: 'white' },
            { text: 'Date', bold: true, fontSize: 14, color: 'white' },
            { text: 'Completed Activity', bold: true, fontSize: 14, color: 'white' },
            { text: 'Active', bold: true, fontSize: 14, color: 'white' },
        ]);
        if (accomplishArray) {
            for (let i = 0; i < accomplishArray.length; i++) {
                let Task = accomplishArray[i].Task ? accomplishArray[i].Task : "";
                let TaskDate = accomplishArray[i].Date ? format(new Date(accomplishArray[i].Date), "MMM-dd-yyyy") : "";
                let isActivity = accomplishArray[i].IsActivity ? 'X' : '';
                let Active = accomplishArray[i].Active ? 'X' : '';
                Accomplishments.push([Task, TaskDate, isActivity, Active]);
            }
        }
        else {
            Accomplishments.push(["N/A", "N/A", "N/A", "N/A"]);
        }

        //Milestone
        let milestoneArray = PPData?.milestoneData;
        let Milestones = [];
        Milestones.push([
            { text: 'Milestone/Deliverables', bold: true, fontSize: 14, color: 'white' },
            { text: 'Target Date', bold: true, fontSize: 14, color: 'white' },
            { text: 'Status', bold: true, fontSize: 14, color: 'white' },
            { text: 'NPL T6', bold: true, fontSize: 14, color: 'white' }
        ]);

        if (milestoneArray) {

            milestoneArray?.map(item => {
                let RiskStatus, statusVal;
                if (item.LaunchHealth) {
                    statusVal = statusValues.filter(ele => ele?.key == item.LaunchHealth)?.[0];
                    statusVal = statusVal ? statusVal : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
                    RiskStatus = { text: statusVal?.value, bold: true, fontSize: 12, color: statusVal?.color, background: statusVal?.bgColor };
                } else
                    RiskStatus = '';
                let TaskFinishDate = item?.TaskFinishDate ? format(new Date(item?.TaskFinishDate), "MMM-dd-yyyy") : "";
                Milestones.push([
                    item.TaskName, TaskFinishDate, RiskStatus, item?.NPLT6Milestone ? 'X' : '']);
            });
        }
        else {
            Milestones.push(["N/A", "N/A", "N/A", "N/A"]);
        }

        //Activities
        let activityArray = PPData?.activityData;
        let Activities = [];

        Activities.push([
            { text: 'Upcoming Activities', bold: true, fontSize: 14, color: 'white' },
            { text: 'Date', bold: true, fontSize: 14, color: 'white' },
            { text: 'Status', bold: true, fontSize: 14, color: 'white' },
            { text: 'Active', bold: true, fontSize: 14, color: 'white' }
        ]);

        activityArray?.map(item => {
            let activityDate = item?.Date ? format(new Date(item?.Date), "MMM-dd-yyyy") : "";
            let Active = item?.Active ? 'X' : '';
            let activityStatus, statusVal;
            if (item.Status) {
                statusVal = statusValues.filter(ele => ele?.key == item.Status)?.[0];
                statusVal = statusVal ? statusVal : { key: '', id: '', value: '', color: '#000000', bgColor: '#FFFFFF' };
                activityStatus = { text: statusVal?.value, bold: true, fontSize: 12, color: statusVal.color, background: statusVal.bgColor };
            } else
                activityStatus = '';
            Activities.push([item?.Activity, activityDate, activityStatus, Active]);
        });
        if (activityArray?.length == 0) Activities.push(["N/A", "N/A", "N/A", "N/A"]);

        //Risk Assessment
        let riskArray = PPData?.riskAssessmentData;
        let Risks = [];
        Risks.push([
            { text: 'Risk/Issue', bold: true, fontSize: 14, color: 'white' },
            { text: 'Risk Date', bold: true, fontSize: 14, color: 'white' },
            { text: 'Risk Status', bold: true, fontSize: 14, color: 'white' },
            { text: 'Mitigation Plan', bold: true, fontSize: 14, color: 'white' },
            { text: 'Mitigation Date', bold: true, fontSize: 14, color: 'white' },
            { text: 'Mitigation Status', bold: true, fontSize: 14, color: 'white' },
            { text: 'Active', bold: true, fontSize: 14, color: 'white' },
            { text: "NPL T6", bold: true, fontSize: 14, color: 'white' }
        ]);
        riskArray?.map(ele => {
            // let RiskStatus = { text: RiskStatusVal[0]["key"], bold: true, fontSize: 12, color: 'white', background: RiskStatusVal[0]["color"] };
            let riskStatus, statusVal, mitigationStatus, mitigationStatusVal;
            if (ele.RiskStatus) {
                statusVal = statusValues.filter(ele1 => ele1?.key === ele.RiskStatus)?.[0];
                statusVal = statusVal ? statusVal : { key: '', id: '', value: '', color: '#000000', bgColor: '#FFFFFF' };
                riskStatus = { text: statusVal?.value, bold: true, fontSize: 12, color: statusVal.color, background: statusVal.bgColor };
            }
            if (ele.MitigationStatus) {
                mitigationStatusVal = statusValues.filter(ele1 => ele1?.key === ele.MitigationStatus)?.[0];
                mitigationStatusVal = mitigationStatusVal ? mitigationStatusVal : { key: '', id: '', value: '', color: '#000000', bgColor: '#FFFFFF' };
                mitigationStatus = { text: mitigationStatusVal?.value, bold: true, fontSize: 12, color: mitigationStatusVal.color, background: mitigationStatusVal.bgColor };

            } else
                riskStatus = '';
            Risks.push([ele.RiskTitle ? ele.RiskTitle : '',
            ele.RiskDate ? format(new Date(ele.RiskDate), 'MMM-dd-yyyy') : '',
            riskStatus ? riskStatus : '',
            ele.Mitigation ? ele.Mitigation : '',
            ele.MitigationDate ? format(new Date(ele.MitigationDate), 'MMM-dd-yyyy') : '',
            mitigationStatus ? mitigationStatus : '',
            ele.Active ? 'X' : '',
            ele.DeepDive ? 'X' : '']);
        });


        if (riskArray?.length <= 0) {
            Risks.push(["N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"]);
        }

        let NPLT6RisksArr = PPData?.riskAssessmentData?.filter(rec => rec.DeepDive);
        let NPLT6Risks = [];
        NPLT6Risks.push([
            { text: 'NPLT6 Risk/Issue', bold: true, fontSize: 14, color: 'white' },
            { text: 'NPLT6 Risk Category', bold: true, fontSize: 14, color: 'white' },
            { text: 'NPLT6 Risk Status', bold: true, fontSize: 14, color: 'white' },
        ]);
        NPLT6RisksArr?.map(ele => {
            // let RiskStatus = { text: RiskStatusVal[0]["key"], bold: true, fontSize: 12, color: 'white', background: RiskStatusVal[0]["color"] };
            let riskStatus, statusVal;
            if (ele.DeepDiveRiskStatus) {
                statusVal = statusValues.filter(ele1 => ele1?.key == ele.DeepDiveRiskStatus)?.[0];
                statusVal = statusVal ? statusVal : { key: '', id: '', value: '', color: '#000000', bgColor: '#FFFFFF' };
                riskStatus = { text: statusVal?.value, bold: true, fontSize: 12, color: statusVal.color, background: statusVal.bgColor };
            } else
                riskStatus = '';
            NPLT6Risks.push([
                ele.DeepDiveRiskTitle ? ele.DeepDiveRiskTitle : '',
                ele.DeepDiveRiskCategory ? ele.DeepDiveRiskCategory : '',
                riskStatus]);
        });

        if (NPLT6RisksArr?.length <= 0) {
            NPLT6Risks.push(["N/A", "N/A", "N/A",]);
        }
        let LaunchStatusVal, LaunchStatusColorObj, ResourceStatusVal, ResourceStatusColorObj, RiskStatusVal, RiskStatusColorObj;

        LaunchStatusColorObj = statusValues.filter(ele => ele?.key === header2Values.LaunchStatus)?.[0];
        LaunchStatusColorObj = LaunchStatusColorObj ? LaunchStatusColorObj : { key: '', id: '', value: '', color: '#000000', bgColor: '#FFFFFF' };
        LaunchStatusVal = { text: LaunchStatusColorObj?.["value"], bold: true, fontSize: 8, color: LaunchStatusColorObj?.['color'], background: LaunchStatusColorObj?.["bgColor"], border: { pt: "0.5", color: '#000080', type: 'solid' } };


        ResourceStatusColorObj = statusValues.filter(ele => ele?.key === header2Values.ResourceStatus)?.[0];
        ResourceStatusColorObj = ResourceStatusColorObj ? ResourceStatusColorObj : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
        ResourceStatusVal = { text: ResourceStatusColorObj?.["value"], bold: true, fontSize: 8, color: ResourceStatusColorObj?.['color'], background: ResourceStatusColorObj?.["bgColor"], border: { pt: "0.5", color: '#000080', type: 'solid' } };

        RiskStatusColorObj = statusValues.filter(ele => ele?.key === header2Values.RiskStatus)?.[0];
        RiskStatusColorObj = RiskStatusColorObj ? RiskStatusColorObj : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
        RiskStatusVal = { text: RiskStatusColorObj?.["value"], bold: true, fontSize: 8, color: RiskStatusColorObj?.['color'], background: RiskStatusColorObj?.["bgColor"], border: { pt: "0.5", color: '#000080', type: 'solid' } };

        let LaunchLead = '';
        //Jefin commented
        //Reason: No relation between current view selected and export functionality!!
        // if (SelectedView == 'Product View') {
        //     LaunchLead = projectData.GLOLaunchLead ? projectData.GLOLaunchLead : '';
        //     // GLOLaunchLead ProductDescription
        // }
        // else {
        //     LaunchLead = projectData.LaunchLead ? projectData.LaunchLead : '';
        // }
        LaunchLead = projectData.LaunchLead ? projectData.LaunchLead : '';

        let PDFJson = {
            content: [
                {
                    image: 'data:image/png;base64,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',
                    margin: [0, 0, 0, 20],
                    width: 515
                },
                { text: 'Project Details', style: 'subheader' },
                {
                    style: 'table',
                    width: [100, 200, 100, 200],
                    table: {
                        body: [
                            [{ text: 'Project Name:', bold: true, fontSize: 12, color: 'white' },
                                type,
                            { text: 'Launch Lead:', bold: true, fontSize: 12, color: 'white' },
                                LaunchLead
                            ],
                            [{ text: 'Market:', bold: true, fontSize: 12, color: 'white' },
                            projectData.Market ?
                                projectData.Market?.indexOf('-') != -1 ?
                                    projectData.Market?.split('-')[1] : projectData.Market : '',
                            { text: 'Business Unit:', bold: true, fontSize: 12, color: 'white' },
                            projectData.BusinessUnit ? projectData.BusinessUnit : ''
                            ],
                            [
                                { text: 'Launch Progress:', bold: true, fontSize: 12, color: 'white' },
                                header2Values.LaunchProgress ? header2Values.LaunchProgress : '',
                                { text: 'Launch Status:', bold: true, fontSize: 12, color: 'white' },
                                { text: LaunchStatusVal.text, bold: true, fontSize: 12, color: LaunchStatusColorObj.color, background: LaunchStatusColorObj.bgColor },
                            ],
                            [{ text: 'Resource Status:', bold: true, fontSize: 12, color: 'white' },
                            { text: ResourceStatusVal.text, bold: true, fontSize: 12, color: ResourceStatusColorObj.color, background: ResourceStatusColorObj.bgColor },
                            { text: 'Risk/Issue Status:', bold: true, fontSize: 12, color: 'white' },
                            { text: RiskStatusVal.text, bold: true, fontSize: 12, color: RiskStatusColorObj.color, background: RiskStatusColorObj.bgColor },

                            ],

                        ]
                    },
                    layout: {
                        fillColor: (rowIndex, node, columnIndex) => {
                            return (columnIndex % 2 === 0) ? '#337ab7' : null;
                        }
                    },
                },
                { text: 'Accomplishments', style: 'subheader' },
                {
                    style: 'table',
                    width: [300, 200, 100, 100],
                    table: {
                        body: Accomplishments
                    },
                    layout: {
                        fillColor: (rowIndex, node, columnIndex) => {
                            return (rowIndex === 0) ? '#337ab7' : null;
                        }
                    },
                },
                { text: 'Activities', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        width: [300, 200, 100],
                        body: Activities
                    },
                    layout: {
                        fillColor: (rowIndex, node, columnIndex) => {
                            return (rowIndex === 0) ? '#337ab7' : null;
                        }
                    },
                },
                { text: 'Milestones', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        width: [120, 150, 150, 150, 120, 100],
                        body: Milestones
                    },
                    layout: {
                        fillColor: (rowIndex, node, columnIndex) => {
                            return (rowIndex === 0) ? '#337ab7' : null;
                        }
                    },
                },

                { text: 'Risk Assessment', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        width: [200, 80, 80, 200, 80, 80, 35, 35], // add width here if you add few more columns
                        body: Risks
                    },
                    layout: {
                        fillColor: (rowIndex, node, columnIndex) => {
                            return (rowIndex === 0) ? '#337ab7' : null;
                        }
                    },
                },
                { text: 'NPLT6 Risk Assessment', style: 'subheader' },
                {
                    style: 'table',
                    table: {
                        width: [300, 200, 100],
                        body: NPLT6Risks
                    },
                    layout: {
                        fillColor: (rowIndex, node, columnIndex) => {
                            return (rowIndex === 0) ? '#337ab7' : null;
                        }
                    },
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 5],
                    alignment: 'center'
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 5, 0, 0],
                },
                table: {
                    margin: [0, 5, 0, 15],
                    width: 100,
                    alignment: 'left'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    background: 'blue'
                },
                keyProdLabel: {
                    fontSize: 12,
                    color: 'black'
                }
            },
            defaultStyle: {
                alignment: 'justify'
            },
            pageBreakBefore: (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) => {
                return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
            }
        };
        pdfMake.createPdf(PDFJson).download(`NPL_${type}.pdf`);
    } catch (error) {
        let errorMsg = {
            Source: 'PrintPDF - generate pdf',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg)
            .catch(e => console.log(e));
    }
}