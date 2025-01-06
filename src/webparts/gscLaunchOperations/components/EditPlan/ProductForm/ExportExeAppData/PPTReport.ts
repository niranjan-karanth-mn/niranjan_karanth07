import pptxgen from 'pptxgenjs';
import { format } from 'date-fns';
import { DataService } from '../../../Shared/DataService';
// import { statusValues, colorObj } from '../../../Shared/Objects';
import { colorObj } from '../../../Shared/Objects';

import pfizerLogo from '../../../../../assets/images/Pfizer_Logo_Color_RGB.png';

const projTitleBg = '#FFFFFF';
const headerFontFamily = 'Calibri';

export const statusValues = [
    { key: 'At Risk', value: "At Risk", id: 'Yellow', bgColor: colorObj?.yellowBtnBg, color: colorObj?.yellowBtnTextColor },
    { key: 'Medium', value: "Medium", id: 'Yellow', bgColor: colorObj?.yellowBtnBg, color: colorObj?.yellowBtnTextColor },
    { key: 'Completed', value: "Completed", id: 'Blue', bgColor: colorObj?.completeBtnBg, color: colorObj?.completeBtnTextColor },
    { key: 'Complete', value: "Complete", id: 'Blue', bgColor: colorObj?.completeBtnBg, color: colorObj?.completeBtnTextColor },
    { key: 'Delayed', value: "Delayed", id: 'Red', bgColor: colorObj?.redBtnBg, color: colorObj?.redBtnTextColor },
    { key: 'High Risk', value: "High Risk", id: 'Red', bgColor: colorObj?.redBtnBg, color: colorObj?.redBtnTextColor },
    { key: 'On Track', value: "On Track", id: 'Green', bgColor: colorObj?.greenbtnBg, color: colorObj?.greenBtnTextColor },
    { key: 'High', value: "High", id: 'Red', bgColor: colorObj?.redBtnBg, color: colorObj?.redBtnTextColor },
    { key: 'Low', value: "Low", id: 'Green', bgColor: colorObj?.greenbtnBg, color: colorObj?.greenBtnTextColor },
    { key: 'Active', value: "Active", id: 'Green', bgColor: colorObj?.greenbtnBg, color: colorObj?.greenBtnTextColor },
    { key: 'Blank', value: "Blank", id: 'Green', bgColor: colorObj?.greyBtnBg, color: colorObj?.greyBtnTextColor },
    { key: 'Cancelled', value: "Cancelled", id: 'Red', bgColor: colorObj?.redBtnBg, color: colorObj?.redBtnTextColor },
    { key: 'Planned', value: "Planned", id: 'Yellow', bgColor: colorObj?.yellowBtnBg, color: colorObj?.yellowBtnTextColor },
    { key: 'Yellow', value: "At Risk", id: 'Yellow', bgColor: colorObj.yellowBtnBg, color: colorObj.yellowBtnTextColor },
    { key: 'Blue', value: "Complete", id: 'Blue', bgColor: colorObj.completeBtnBg, color: colorObj.completeBtnTextColor },
    { key: 'Red', value: "Delayed", id: 'Red', bgColor: colorObj.redBtnBg, color: colorObj.redBtnTextColor },
    { key: 'Green', value: "On Track", id: 'Green', bgColor: colorObj.greenbtnBg, color: colorObj.greenBtnTextColor },
    { key: 'Grey', value: "Not Initiated", id: 'Grey', bgColor: colorObj.greyBtnBg, color: colorObj.greyBtnTextColor },
    { key: 'Not Initiated', value: "Not Initiated", id: 'Grey', bgColor: colorObj.greyBtnBg, color: colorObj.greyBtnTextColor },

];

const colHeaderStyle = {
    fontSize: 8,
    fontFace: headerFontFamily,
    valign: 'middle',
    align: 'center',
    fill: { color: '#A4ABAE' },
    border: { pt: "0.5", color: '#d3d3d3', type: 'solid' }
};
const textCellStyle = {
    fontSize: 8,
    fontFace: "Calibri",
    valign: 'middle',
    align: "left",
    border: { pt: "0.5", color: "#d3d3d3", type: "solid" },
    fill: { color: '#FFFFFF' }
};
const textCellStyleSlide1 = {
    fontSize: 7,
    fontFace: "Calibri",
    valign: 'middle',
    align: "left",
    border: { pt: "0.5", color: "#d3d3d3", type: "solid" }
};
const dateCellStyle = {
    fontSize: 8,
    fontFace: "Calibri",
    valign: 'middle',
    align: "center",
    border: { pt: "0.5", color: "#d3d3d3", type: "solid" }
};
const dateCellStyleSlide1 = {
    fontSize: 7,
    fontFace: "Calibri",
    valign: 'middle',
    align: "center",
    border: { pt: "0.5", color: "#d3d3d3", type: "solid" },
    fill: { color: '#FFFFFF' }
};
const title2HeaderStyle = {
    fontSize: 8,
    fontFace: headerFontFamily,
    valign: 'middle',
    align: 'center',
    fill: { color: '#000080' },
    color: projTitleBg,
    border: { pt: "0.5", color: '#000080', type: 'solid' }
    // border: [
    //     { pt: "0.5", color: '#000080', type: 'solid' },
    //     { pt: "0.5", color: '#FFFFFF', type: 'solid' },
    //     { pt: "0.5", color: '#000080', type: 'solid' },
    //     { pt: "0.5", color: '#000080', type: 'solid' },
    // ]
};
const title2CellStyle = {
    fontSize: 8,
    fontFace: "Calibri",
    valign: 'middle',
    align: 'center',
    // fill: { color: '#000080' },
    border: { pt: "0.5", color: '#000080', type: 'solid' }
};

export default function GeneratePPT(projectData, ExeAppData, selectedRowsData, checked, type, SelectedView, header2Values): void {
    try {
        const pptx = new pptxgen();
        const QuadView1Slide = pptx.addSlide();

        let LaunchStatusVal, LaunchStatusColorObj, ResourceStatusVal, ResourceStatusColorObj, RiskStatusVal, RiskStatusColorObj;

        LaunchStatusColorObj = statusValues.filter(ele => ele?.key === header2Values.LaunchStatus)?.[0];
        LaunchStatusColorObj = LaunchStatusColorObj ? LaunchStatusColorObj : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
        LaunchStatusVal = { text: LaunchStatusColorObj?.["value"], bold: true, fontSize: 8, color: LaunchStatusColorObj?.['color'], background: LaunchStatusColorObj?.["bgColor"], border: { pt: "0.5", color: '#000080', type: 'solid' } };


        ResourceStatusColorObj = statusValues.filter(ele => ele?.key === header2Values.ResourceStatus)?.[0];
        ResourceStatusColorObj = ResourceStatusColorObj ? ResourceStatusColorObj : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
        ResourceStatusVal = { text: ResourceStatusColorObj?.["value"], bold: true, fontSize: 8, color: ResourceStatusColorObj?.['color'], background: ResourceStatusColorObj?.["bgColor"], border: { pt: "0.5", color: '#000080', type: 'solid' } };

        RiskStatusColorObj = statusValues.filter(ele => ele?.key === header2Values.RiskStatus)?.[0];
        RiskStatusColorObj = RiskStatusColorObj ? RiskStatusColorObj : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
        RiskStatusVal = { text: RiskStatusColorObj?.["value"], bold: true, fontSize: 8, color: RiskStatusColorObj?.['color'], background: RiskStatusColorObj?.["bgColor"], border: { pt: "0.5", color: '#000080', type: 'solid' } };

        let Title2Header = [];
        Title2Header = [
            [
                { text: 'Launch Progress', options: title2HeaderStyle },
                { text: 'Launch Status', options: title2HeaderStyle },
                { text: 'Resource Status', options: title2HeaderStyle },
                { text: 'Risk/Issue Sttaus', options: title2HeaderStyle },
                { text: 'Launch Readiness Date', options: title2HeaderStyle },
                { text: 'Printed On', options: title2HeaderStyle }
            ], [
                {
                    text: header2Values.LaunchProgress ?
                        header2Values.LaunchProgress : '', options: title2CellStyle
                },
                {
                    text: LaunchStatusVal.text, options: {
                        fontSize: 8,
                        fontFace: "Calibri",
                        valign: 'middle',
                        align: 'center',
                        fill: { color: LaunchStatusColorObj.bgColor },
                        color: LaunchStatusColorObj.color,
                        border: { pt: "0.5", color: '#000080', type: 'solid' }
                    }
                },
                {
                    text: ResourceStatusVal.text, options: {
                        fontSize: 8,
                        fontFace: "Calibri",
                        valign: 'middle',
                        align: 'center',
                        fill: { color: ResourceStatusColorObj.bgColor },
                        color: ResourceStatusColorObj.color,
                        border: { pt: "0.5", color: '#000080', type: 'solid' }
                    }
                }, {
                    text: RiskStatusVal.text, options: {
                        fontSize: 8,
                        fontFace: "Calibri",
                        valign: 'middle',
                        align: 'center',
                        fill: { color: RiskStatusColorObj.bgColor },
                        color: RiskStatusColorObj.color,
                        border: { pt: "0.5", color: '#000080', type: 'solid' }
                    }
                },
                { text: `${header2Values.LaunchReadinessDate ? format(new Date(header2Values.LaunchReadinessDate), 'MMM-dd-yyyy') : ''}`, options: title2CellStyle },
                { text: ` ${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()}`, options: title2CellStyle }
            ]];

        // TaskFinishDate
        QuadView1Slide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
        //add project name
        QuadView1Slide.addText(type,
            { x: 1.0, y: 0.1, w: '95%', h: 0.4, align: 'left', fontSize: 18, fontFace: headerFontFamily }
        );
        // QuadView1Slide.addText(
        //     `PGS Readiness Date: ${projectData.TaskFinishDate ? format(new Date(projectData.TaskFinishDate), 'MMM-dd-yyyy') : 'Yet to Set'} `,//+ PGSReadinessDate
        //     { x: '71%', y: 0.1, w: '27%', h: 0.3, align: 'right', fontSize: 10.5, fontFace: "Calibri", fill: { color: '#FFFFFF' }, color: '#000000' }
        // );
        QuadView1Slide.addTable(Title2Header, { x: 0.2, y: 0.5, w: '96%', fontSize: 8, color: '#242629' });

        //Accomplishment  

        let accomplishmentTable = [];
        let accomplishmentTableAll = [];
        accomplishmentTable = [[
            { text: 'Accomplishment', options: colHeaderStyle },
            { text: 'Date', options: colHeaderStyle }
        ]];
        accomplishmentTableAll = [[
            { text: 'Accomplishment', options: colHeaderStyle },
            { text: 'Date', options: colHeaderStyle },
            { text: 'Completed Activity', options: colHeaderStyle },
            { text: 'Active', options: colHeaderStyle }
        ]];
        ExeAppData.accomData?.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        ExeAppData.accomData?.map(ele => {
            accomplishmentTableAll.push([
                { text: ele.Task, options: textCellStyle },
                { text: ele.Date ? format(new Date(ele.Date), "MMM-dd-yyyy") : '', options: dateCellStyle },
                { text: ele.IsActivity ? 'X' : '', options: dateCellStyle },
                { text: ele.Active ? 'X' : '', options: dateCellStyle }
            ]);
        });
        let rowCount = 0;
        if (selectedRowsData.Accom?.length > 0) {
            selectedRowsData.Accom?.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
            selectedRowsData.Accom?.map(ele => {
                accomplishmentTable.push([
                    { text: ele.Task, options: textCellStyleSlide1 },
                    { text: ele.Date ? format(new Date(ele.Date), "MMM-dd-yyyy") : '', options: dateCellStyleSlide1 }
                ]);
            });
            rowCount = selectedRowsData.Accom?.length;
        } else {
            if (checked.PPAccomplishment)
                ExeAppData.accomData = ExeAppData.accomData?.filter(rec => rec.Active == true);
            ExeAppData.accomData = ExeAppData.accomData?.slice(0, 5);
            // ExeAppData.accomData = ExeAppData.accomData?.length > 5 ? (ExeAppData.accomData.slice(0, 5)) : ExeAppData.accomData;
            ExeAppData.accomData?.map(ele => {
                accomplishmentTable.push([
                    { text: ele.Task, options: textCellStyleSlide1 },
                    { text: ele.Date ? format(new Date(ele.Date), "MMM-dd-yyyy") : '', options: dateCellStyleSlide1 }
                ]);
            });
            rowCount = ExeAppData.accomData?.length;

        }
        if (rowCount < 5) {
            const emptyRowCount = 5 - rowCount;
            for (let i = 0; i < emptyRowCount; i++) {
                accomplishmentTable.push([
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 }
                ]);
                accomplishmentTableAll.push([
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle }
                ]);
            }
        }

        //DLPP Milestones
        let milestoneTable = [];
        let milestoneTableFull = [];
        const milestoneHeader = [[
            { text: 'NPL T6', options: colHeaderStyle },
            { text: 'Milestones/Deliverables', options: colHeaderStyle },
            { text: 'Target Date', options: colHeaderStyle },
            // { text: 'Status', options: colHeaderStyle }
        ]];
        milestoneTable = [...milestoneHeader];
        milestoneTableFull = [[
            { text: 'NPL T6', options: colHeaderStyle },
            { text: 'Milestones/Deliverables', options: colHeaderStyle },
            { text: 'Target Date', options: colHeaderStyle },
            { text: 'Active', options: colHeaderStyle }
            // { text: 'Status', options: colHeaderStyle },
        ]];

        ExeAppData.milestoneData?.sort((a, b) => new Date(b.TaskFinishDate).getTime() - new Date(a.TaskFinishDate).getTime());
        ExeAppData.milestoneData?.map(ele => {
            let milestoneName = ele.TaskName;
            if (ele.TaskName?.includes('->'))
                milestoneName = ele.TaskName;
            // let filterObj = statusValues.filter(rec => rec.value == ele.LaunchHealth)?.[0];
            let filterObj = statusValues.filter(rec => rec.key == ele.LaunchHealth)?.[0];
            filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
            milestoneTableFull.push([
                { text: ele.NPLT6Milestone ? 'X' : '', options: dateCellStyle },
                { text: milestoneName, options: textCellStyle },
                {
                    text: ele.TaskFinishDate ?
                        format(new Date(ele.TaskFinishDate), "MMM-dd-yyyy") :
                        '',
                    options:
                    {
                        fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center',
                        fill: { color: filterObj.bgColor },
                        color: filterObj.color,
                        border: { pt: "0.5", color: '#d3d3d3', type: 'solid' }
                    }
                },
                // { text: ele.LaunchHealth, options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: '0.5', type: 'solid' } } },
                { text: ele.IsActive ? 'X' : '', options: dateCellStyle },
            ]);
        });
        rowCount = 0;
        if (selectedRowsData.Milestone?.length > 0) {
            selectedRowsData.Milestone?.sort((a, b) => new Date(b.TaskFinishDate).getTime() - new Date(a.TaskFinishDate).getTime());
            selectedRowsData.Milestone?.map(ele => {
                let milestoneName = ele.TaskName;
                if (ele.TaskName?.includes('->'))
                    milestoneName = ele.TaskName;
                // let filterObj = statusValues.filter(rec => rec.value == ele.LaunchHealth)?.[0];
                let filterObj = statusValues.filter(rec => rec.key == ele.LaunchHealth)?.[0];
                filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
                milestoneTable.push([
                    { text: ele.NPLT6Milestone ? 'X' : '', options: dateCellStyleSlide1 },
                    { text: milestoneName, options: textCellStyleSlide1 },
                    { text: ele.TaskFinishDate ? format(new Date(ele.TaskFinishDate), "MMM-dd-yyyy") : '', options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    // { text: ele.LaunchHealth, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: '0.5', type: 'solid' } } }
                ]);
            });
            rowCount = selectedRowsData.Milestone?.length;
        } else {
            // if (checked.PPMilestone)
            //     ExeAppData.milestoneData = ExeAppData.milestoneData?.filter(rec => rec.IsActive == true);
            ExeAppData.milestoneData = ExeAppData.milestoneData?.slice(0, 5);
            ExeAppData.milestoneData?.map(ele => {
                let milestoneName = ele.TaskName;

                // let filterObj = statusValues.filter(rec => rec.value == ele.LaunchHealth)?.[0];
                let filterObj = statusValues.filter(rec => rec.key == ele.LaunchHealth)?.[0];
                filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
                milestoneTable.push([
                    { text: ele.NPLT6Milestone ? 'X' : '', options: dateCellStyleSlide1 },
                    { text: milestoneName, options: textCellStyleSlide1 },
                    { text: ele.TaskFinishDate ? format(new Date(ele.TaskFinishDate), "MMM-dd-yyyy") : '', options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    // { text: ele.LaunchHealth, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: '0.5', type: 'solid' } } }
                ]);
            });
            rowCount = ExeAppData.milestoneData?.length;

        }
        if (rowCount < 5) {
            const emptyRowCount = 5 - rowCount;
            for (let i = 0; i < emptyRowCount; i++) {
                milestoneTable.push([
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    // { text: '', options: textCellStyleSlide1 }
                ]);
                milestoneTableFull.push([
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },

                ]);
            }
        }

        //Activities
        let actTable = [];
        let actTableFull = [];
        let actHeader = [[
            { text: 'Activities', options: colHeaderStyle },
            { text: 'Date', options: colHeaderStyle },
            // { text: 'Status', options: colHeaderStyle }
        ]];

        actTable = [...actHeader];
        actTableFull = [[
            { text: 'Activities', options: colHeaderStyle },
            { text: 'Date', options: colHeaderStyle },
            // { text: 'Status', options: colHeaderStyle },
            { text: 'Active', options: colHeaderStyle }
        ]];
        ExeAppData.activityData?.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        ExeAppData.activityData?.map(ele => {
            let filterObj = statusValues.filter(rec => rec.value == ele.Status)?.[0];
            filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
            actTableFull.push([
                { text: ele.Activity, options: textCellStyle },
                { text: ele.Date ? format(new Date(ele.Date), "MMM-dd-yyyy") : '', options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                // { text: ele.Status, options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: '0.5', type: 'solid' } } },
                { text: ele.Active ? 'X' : '', options: dateCellStyle }
            ]);
        });

        rowCount = 0;
        if (selectedRowsData.Activities?.length > 0) {
            selectedRowsData.Activities?.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
            selectedRowsData.Activities?.map(ele => {
                let filterObj = statusValues.filter(rec => rec.value == ele.Status)?.[0];
                filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
                actTable.push([
                    { text: ele.Activity, options: textCellStyleSlide1 },
                    { text: ele.Date ? format(new Date(ele.Date), "MMM-dd-yyyy") : '', options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    // { text: ele.Status, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: '0.5', type: 'solid' } } }
                ]);
            });
            rowCount = selectedRowsData.Activities?.length;
        } else {

            if (checked.PPActivities)
                ExeAppData.activityData = ExeAppData.activityData?.filter(rec => rec.Active == true);
            ExeAppData.activityData = ExeAppData.activityData?.slice(0, 5);
            // ExeAppData.activityData = ExeAppData.activityData?.length > 5 ? ExeAppData.activityData.slice(0, 5) : ExeAppData.activityData;
            ExeAppData.activityData?.map(ele => {
                let filterObj = statusValues.filter(rec => rec.value == ele.Status)?.[0];
                filterObj = filterObj ? filterObj : { key: "", value: '', id: "", color: '#000000', bgColor: '#FFFFFF' };
                actTable.push([
                    { text: ele.Activity, options: textCellStyleSlide1 },
                    { text: ele.Date ? format(new Date(ele.Date), "MMM-dd-yyyy") : '', options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    // { text: ele.Status, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: '0.5', type: 'solid' } } }
                ]);
            });
            rowCount = ExeAppData.activityData?.length;

        }
        if (rowCount < 5) {
            const emptyRowCount = 5 - rowCount;
            for (let i = 0; i < emptyRowCount; i++) {
                actTable.push([
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                ]);
                actTableFull.push([
                    { text: '', options: textCellStyle },
                    // { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle }
                ]);
            }
        }

        //NPL T6 SLide
        let nplt6 = [[
            { text: 'NPLT6 Issues', options: colHeaderStyle },
            { text: 'NPLT6 Risk Category', options: colHeaderStyle },
            { text: 'NPLT6 Risk Status', options: colHeaderStyle }
        ]];

        ExeAppData.riskAssessmentData.filter(rec => rec.DeepDive)?.map(ele => {
            let DDRiskStatfilterObj = statusValues.filter(rec => rec.value == ele.DeepDiveRiskStatus)?.[0];
            DDRiskStatfilterObj = DDRiskStatfilterObj ? DDRiskStatfilterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
            nplt6.push([
                { text: ele.DeepDiveRiskTitle, options: textCellStyle },
                { text: ele.DeepDiveRiskCategory, options: textCellStyle },
                { text: ele.DeepDiveRiskStatus, options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: DDRiskStatfilterObj.bgColor }, border: { pt: '0.5', type: 'solid', color: "#d3d3d3" } } },
            ]);
        })


        //Risk Assessment
        let riskAss = [];
        let riskAssFull = [];
        let riskAssHeader = [[
            { text: 'NPL T6', options: colHeaderStyle },
            { text: 'Risk/Issue', options: colHeaderStyle },
            { text: 'Risk Date', options: colHeaderStyle },
            // { text: 'Risk Status', options: colHeaderStyle },
            { text: 'Mitigation Approach', options: colHeaderStyle },
        ]];

        riskAss = [...riskAssHeader];
        riskAssFull = [[
            { text: 'NPL T6', options: colHeaderStyle },
            { text: 'Risk/Issue', options: colHeaderStyle },
            { text: 'Risk Date', options: colHeaderStyle },
            // { text: 'Risk Status', options: colHeaderStyle },
            { text: 'Mitigation Plan', options: colHeaderStyle },
            { text: 'Mitigation Date', options: colHeaderStyle },
            // { text: 'Mitigation Status', options: colHeaderStyle },
            { text: 'Active', options: colHeaderStyle },
        ]];

        ExeAppData.riskAssessmentData?.map(ele => {

            let filterObj = statusValues.filter(rec => rec.value == ele.RiskStatus)?.[0];
            filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };

            let MitifilterObj = statusValues.filter(rec => rec.value == ele.MitigationStatus)?.[0];
            MitifilterObj = MitifilterObj ? MitifilterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };

            let DDRiskStatfilterObj = statusValues.filter(rec => rec.value == ele.DeepDiveRiskStatus)?.[0];
            DDRiskStatfilterObj = DDRiskStatfilterObj ? DDRiskStatfilterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };

            riskAssFull.push([

                { text: ele.DeepDive ? 'X' : '', options: dateCellStyle },
                { text: ele.RiskTitle, options: textCellStyle },
                { text: ele.RiskDate ? format(new Date(ele.RiskDate), "MMM-dd-yyyy") : '', options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                // { text: ele.RiskStatus, options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                { text: ele.Mitigation, options: textCellStyle },
                { text: ele.MitigationDate ? format(new Date(ele.MitigationDate), "MMM-dd-yyyy") : '', options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: MitifilterObj.bgColor }, color: MitifilterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                // { text: ele.MitigationStatus, options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: MitifilterObj.bgColor }, color: MitifilterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                { text: ele.Active ? 'X' : '', options: dateCellStyle },

            ]);
        });

        rowCount = 0;
        if (selectedRowsData.RiskAss?.length > 0) {

            selectedRowsData.RiskAss?.map(ele => {
                let filterObj = statusValues.filter(rec => rec.value == ele.RiskStatus)?.[0];
                filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };

                let MitifilterObj = statusValues.filter(rec => rec.value == ele.MitigationStatus)?.[0];
                MitifilterObj = MitifilterObj ? MitifilterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };

                let MitigationVal = '';
                if (ele.Mitigation)
                    MitigationVal = ele.Mitigation + '-';
                if (ele.MitigationDate)
                    MitigationVal = MitigationVal + format(new Date(ele.MitigationDate), "MMM-dd-yyyy");


                riskAss.push([
                    { text: ele.DeepDive ? 'X' : '', options: dateCellStyleSlide1 },
                    { text: ele.RiskTitle, options: textCellStyleSlide1 },
                    { text: ele.RiskDate ? format(new Date(ele.RiskDate), "MMM-dd-yyyy") : '', options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    // { text: ele.RiskStatus, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    { text: MitigationVal, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: MitifilterObj.bgColor }, color: MitifilterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                ]);
            });
            rowCount = selectedRowsData.RiskAss?.length;
        } else {
            if (checked.PPRiskAssessment)
                ExeAppData.riskAssessmentData = ExeAppData.riskAssessmentData?.filter(rec => rec.Active == true);
            ExeAppData.riskAssessmentData = ExeAppData.riskAssessmentData?.slice(0, 5);
            // ExeAppData.riskAssessmentData = ExeAppData.riskAssessmentData?.length > 5 ? ExeAppData.riskAssessmentData.slice(0, 5) : ExeAppData.riskAssessmentData;
            ExeAppData.riskAssessmentData?.map(ele => {
                let filterObj = statusValues.filter(rec => rec.value == ele.RiskStatus)?.[0];
                filterObj = filterObj ? filterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };

                let MitifilterObj = statusValues.filter(rec => rec.value == ele.MitigationStatus)?.[0];
                MitifilterObj = MitifilterObj ? MitifilterObj : { key: '', value: '', id: '', color: '#000000', bgColor: '#FFFFFF' };

                let MitigationVal = '';
                if (ele.Mitigation)
                    MitigationVal = ele.Mitigation + '-';
                if (ele.MitigationDate)
                    MitigationVal = MitigationVal + format(new Date(ele.MitigationDate), "MMM-dd-yyyy");

                riskAss.push([
                    { text: ele.DeepDive ? 'X' : '', options: dateCellStyleSlide1 },
                    { text: ele.RiskTitle, options: textCellStyleSlide1 },
                    { text: ele.RiskDate ? format(new Date(ele.RiskDate), "MMM-dd-yyyy") : '', options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    // { text: ele.RiskStatus, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj.bgColor }, color: filterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                    { text: MitigationVal, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: MitifilterObj.bgColor }, color: MitifilterObj.color, border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },]);
            });
            rowCount = ExeAppData.riskAssessmentData?.length;

        }
        if (rowCount < 5) {
            const emptyRowCount = 5 - rowCount;
            for (let i = 0; i < emptyRowCount; i++) {
                riskAss.push([
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    // { text: '', options: textCellStyleSlide1 }
                ]);
                riskAssFull.push([
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    // { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    // { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                ]);
            }
        }

        QuadView1Slide.addText('Accomplishments',
            { x: 0.2, y: 1.05, w: '47%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );
        QuadView1Slide.addTable(accomplishmentTable, { x: 0.2, y: 1.35, w: '47%', colW: [3.8, 0.9], fontSize: 14, color: '#242629' });

        QuadView1Slide.addText('Automated DLPP Milestones',
            { x: '50%', y: 1.05, w: '48%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );

        QuadView1Slide.addText("Not Initiated",
            { x: "69%", y: 1.15, w: '7%', h: 0.2, fontSize: 6, bold: true, color: colorObj.greyBtnTextColor, align: "center", fill: { color: colorObj.greyBtnBg } }
        );
        QuadView1Slide.addText("At Risk",
            { x: "76%", y: 1.15, w: '5%', h: 0.2, fontSize: 6, bold: true, color: colorObj['yellowBtnTextColor'], align: "center", fill: { color: colorObj['yellowBtnBg'] } }
        );
        QuadView1Slide.addText("Completed",
            { x: "81%", y: 1.15, w: '6%', h: 0.2, fontSize: 6, bold: true, color: colorObj['completeBtnTextColor'], align: "center", fill: { color: colorObj['completeBtnBg'] } }
        );
        QuadView1Slide.addText("Delayed",
            { x: "87%", y: 1.15, w: '5%', h: 0.2, fontSize: 6, bold: true, color: colorObj['redBtnTextColor'], align: "center", fill: { color: colorObj['redBtnBg'] } }
        );
        QuadView1Slide.addText("On Track",
            { x: "92%", y: 1.15, w: '6%', h: 0.2, fontSize: 6, bold: true, color: colorObj['greenBtnTextColor'], align: "center", fill: { color: colorObj['greenbtnBg'] } }
        );
        QuadView1Slide.addTable(milestoneTable, { x: '50%', y: 1.35, w: '47%', colW: [0.6, 3.2, 1.0], fontSize: 14, color: '#242629' });


        QuadView1Slide.addText('Activities',
            { x: 0.2, y: '55%', w: '47%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );
        QuadView1Slide.addText("Not Initiated",
            { x: "19%", y: '57%', w: '7%', h: 0.2, fontSize: 6, color: colorObj.greyBtnTextColor, align: "center", fill: { color: colorObj.greyBtnBg } }
        );
        QuadView1Slide.addText("At Risk",
            { x: "26%", y: '57%', w: '6%', h: 0.2, fontSize: 6, color: colorObj['yellowBtnTextColor'], align: "center", fill: { color: colorObj['yellowBtnBg'] } }
        );
        QuadView1Slide.addText("Completed",
            { x: "32%", y: '57%', w: '6%', h: 0.2, fontSize: 6, color: colorObj['completeBtnTextColor'], align: "center", fill: { color: colorObj['completeBtnBg'] } }
        );
        QuadView1Slide.addText("Delayed",
            { x: "38%", y: '57%', w: '5%', h: 0.2, fontSize: 6, color: colorObj['redBtnTextColor'], align: "center", fill: { color: colorObj['redBtnBg'] } }
        );
        QuadView1Slide.addText("On Track",
            { x: "43%", y: '57%', w: '6%', h: 0.2, fontSize: 6, color: colorObj['greenBtnTextColor'], align: "center", fill: { color: colorObj['greenbtnBg'] } }
        );
        QuadView1Slide.addTable(actTable, { x: 0.2, y: '60.5%', w: '47%', colW: [3.8, 0.9], fontSize: 14, color: '#242629' });

        QuadView1Slide.addText('Risk Assessment',
            { x: '50%', y: '55%', w: '48%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );
        QuadView1Slide.addText("High",
            { x: "82%", y: "57%", w: '5%', h: 0.2, fontSize: 6, color: colorObj.redBtnTextColor, align: "center", fill: { color: colorObj.redBtnBg } }
        );
        QuadView1Slide.addText("Medium",
            { x: "87%", y: "57%", w: '6%', h: 0.2, fontSize: 6, color: colorObj.yellowBtnTextColor, align: "center", fill: { color: colorObj.yellowBtnBg } }
        );
        QuadView1Slide.addText("Low",
            { x: "93%", y: "57%", w: '5%', h: 0.2, fontSize: 6, color: colorObj.greenBtnTextColor, align: "center", fill: { color: colorObj.greenbtnBg } }
        );
        QuadView1Slide.addTable(riskAss, { x: '50%', y: '60.5%', w: '48%', rowH: 0.3, colW: [0.6, 1.7, 0.7, 1.8], fontSize: 14, color: '#242629' });

        //AccomplishmentSlide - Accomplishments
        // let AccomTableSplitArray = sliceIntoChunks(accomplishmentTableAll, 11);
        let AccomTableSplitArray = sliceIntoChunks(accomplishmentTableAll, 8);
        for (let i = 0; i < AccomTableSplitArray.length; i++) {
            // [Page : " + (i + 1) + " of " + AccomTableSplitArray.length + "]
            let AccomplishmentSlide = pptx.addSlide();
            //SLIDE 1
            AccomplishmentSlide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            AccomplishmentSlide.addText(type,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: 18, fontFace: headerFontFamily }
            );
            AccomplishmentSlide.addTable(Title2Header, { x: 0.2, y: 0.5, w: '96%', fontSize: 10, color: '#242629' });

            // AccomplishmentSlide.addText(` ${programData['PortfolioPriority ? portfolioPriorityVal : ''}  ${programData['NPRiskStatus'] ? riskStat : ''}  ${programData['RiskTrend'] ? riskTrend : ''} ${programData['CoDevLead'] ? programData['CoDevLead'] : ''}  ${programData['LaunchLead'] ? programData['LaunchLead'] : ''} ${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()}`,
            //     { x: 0.2, y: 0.5, w: '96%', h: 0.3, align: 'center', fontSize: 14, fontFace: headerFontFamily, fill: { color: '#29a753' }, color: projTitleBg }
            // );

            AccomplishmentSlide.addText('Accomplishments',
                { x: 0.2, y: 1.1, w: '96%', h: 0.3, align: 'left', fontSize: 15, fontFace: 'Calibri', fill: { color: '#4586ED' }, color: projTitleBg }
            );

            if (i != 0)
                AccomTableSplitArray[i].unshift([
                    { text: 'Accomplishment', options: colHeaderStyle },
                    { text: 'Date', options: colHeaderStyle },
                    { text: 'Completed Activity', options: colHeaderStyle },
                    { text: 'Active', options: colHeaderStyle }
                ]);
            AccomplishmentSlide.addTable(AccomTableSplitArray[i], {
                x: 0.2,
                y: 1.4,
                // h:"80%",
                w: "96%",
                // rowH: 0.5,
                colW: [7.0, 1.1, 0.8, 0.7],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }
        //  Activities
        let ActivitySplitArray = sliceIntoChunks(actTableFull, 11);
        for (let i = 0; i < ActivitySplitArray.length; i++) {
            // [Page : " + (i + 1) + " of " + ActivitySplitArray.length + "]
            let ActivitiesSlide = pptx.addSlide();
            //SLIDE 1
            ActivitiesSlide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            ActivitiesSlide.addText(type,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: 18, fontFace: headerFontFamily }
            );
            ActivitiesSlide.addTable(Title2Header, { x: 0.2, y: 0.5, w: '96%', fontSize: 10, color: '#242629' });

            ActivitiesSlide.addText(
                "Activities",
                { x: 0.2, y: 1.1, w: '96%', h: 0.3, align: 'left', fontSize: 15, fill: { color: '#4586ED' }, color: projTitleBg }
            );
            ActivitiesSlide.addText("Not Initiated",
                { x: '53%', y: 1.2, w: '8%', h: 0.2, fontSize: 8, bold: true, color: colorObj.greyBtnTextColor, align: "center", fill: { color: colorObj.greyBtnBg } }
            );
            ActivitiesSlide.addText("At Risk",
                { x: '61%', y: 1.2, w: '8%', h: 0.2, fontSize: 8, bold: true, color: colorObj.yellowBtnTextColor, align: "center", fill: { color: colorObj.yellowBtnBg } }
            );
            ActivitiesSlide.addText("Completed",
                { x: '69%', y: 1.2, w: '11%', h: 0.2, fontSize: 8, bold: true, color: colorObj.completeBtnTextColor, align: "center", fill: { color: colorObj.completeBtnBg } }
            );
            ActivitiesSlide.addText("Delayed",
                { x: '80%', y: 1.2, w: '9%', h: 0.2, fontSize: 8, bold: true, color: colorObj.redBtnTextColor, align: "center", fill: { color: colorObj.redBtnBg } }
            );
            ActivitiesSlide.addText("On Track",
                { x: '89%', y: 1.2, w: '9%', h: 0.2, fontSize: 8, bold: true, color: colorObj.greenBtnTextColor, align: "center", fill: { color: colorObj.greenbtnBg } }
            );
            if (i != 0)
                ActivitySplitArray[i].unshift([
                    { text: 'Activities', options: colHeaderStyle },
                    { text: 'Date', options: colHeaderStyle },
                    // { text: 'Status', options: colHeaderStyle },
                    { text: 'Active', options: colHeaderStyle }
                ]);
            ActivitiesSlide.addTable(ActivitySplitArray[i], {
                x: 0.2,
                y: 1.4,
                // h:"80%",
                w: "96%",
                // rowH: 0.5,
                colW: [7.6, 1.3, 0.7],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }

        // //MilestoneSlide
        let MilestoneTableSplitArray = sliceIntoChunks(milestoneTableFull, 11);
        for (let i = 0; i < MilestoneTableSplitArray.length; i++) {
            // [Page : " + (i + 1) + " of " + MilestoneTableSplitArray.length + "]
            let MilestoneSlide = pptx.addSlide();
            //SLIDE 1
            MilestoneSlide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            MilestoneSlide.addText(type,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: 18, fontFace: headerFontFamily }
            );
            MilestoneSlide.addTable(Title2Header, { x: 0.2, y: 0.5, w: '96%', fontSize: 10, color: '#242629' });

            MilestoneSlide.addText('Automated DLPP Milestones',
                { x: 0.2, y: 1.1, h: 0.3, w: '96%', align: 'left', fontSize: 15, fill: { color: '#4586ED' }, color: projTitleBg }
            );
            MilestoneSlide.addText("Not Initiated",
                { x: '53%', y: 1.2, w: '8%', h: 0.2, fontSize: 8, bold: true, color: colorObj.greyBtnTextColor, align: "center", fill: { color: colorObj.greyBtnBg } }
            );
            MilestoneSlide.addText("At Risk",
                { x: '61%', y: 1.2, w: '8%', h: 0.2, fontSize: 8, bold: true, color: colorObj.yellowBtnTextColor, align: "center", fill: { color: colorObj.yellowBtnBg } }
            );
            MilestoneSlide.addText("Completed",
                { x: '69%', y: 1.2, w: '11%', h: 0.2, fontSize: 8, bold: true, color: colorObj.completeBtnTextColor, align: "center", fill: { color: colorObj.completeBtnBg } }
            );
            MilestoneSlide.addText("Delayed",
                { x: '80%', y: 1.2, w: '9%', h: 0.2, fontSize: 8, bold: true, color: colorObj.redBtnTextColor, align: "center", fill: { color: colorObj.redBtnBg } }
            );
            MilestoneSlide.addText("On Track",
                { x: '89%', y: 1.2, w: '9%', h: 0.2, fontSize: 8, bold: true, color: colorObj.greenBtnTextColor, align: "center", fill: { color: colorObj.greenbtnBg } }
            );
            if (i != 0)
                MilestoneTableSplitArray[i].unshift([
                    { text: 'NPL T6', options: textCellStyle },
                    { text: 'Milestones/Deliverables', options: colHeaderStyle },
                    { text: 'Target Date', options: colHeaderStyle },
                    // { text: 'Status', options: colHeaderStyle },
                    { text: 'Active', options: textCellStyle },
                ]);
            MilestoneSlide.addTable(MilestoneTableSplitArray[i], {
                x: 0.2,
                y: 1.4,
                // h:"80%",
                w: "96%",
                // rowH: 0.5,
                colW: [0.8, 7, 1, 0.8],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }

        //RiskAssessmentSlide - Risk Assessment
        let RiskAssSplitArray = sliceIntoChunks(riskAssFull, 11);
        for (let i = 0; i < RiskAssSplitArray.length; i++) {
            // [Page : " + (i + 1) + " of " + RiskAssSplitArray.length + "]
            let RiskAssessmentSlide = pptx.addSlide();
            //SLIDE 1
            RiskAssessmentSlide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            RiskAssessmentSlide.addText(type,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: 18, fontFace: headerFontFamily }
            );
            RiskAssessmentSlide.addTable(Title2Header, { x: 0.2, y: 0.5, w: '96%', fontSize: 10, color: '#242629' });

            RiskAssessmentSlide.addText(
                "Risk Assessment",
                { x: 0.2, y: 1.1, h: 0.3, w: '96%', align: 'left', fontSize: 15, fill: { color: '#4586ED' }, color: projTitleBg }
            );

            RiskAssessmentSlide.addText(
                "High",
                { x: "73%", y: 1.2, w: '9%', h: 0.2, fontSize: 8, bold: true, color: colorObj['redBtnTextColor'], align: "center", fill: { color: colorObj['redBtnBg'] } }
            );
            RiskAssessmentSlide.addText(
                "Medium",
                { x: "82%", y: 1.2, w: '8%', h: 0.2, fontSize: 8, bold: true, color: colorObj['yellowBtnTextColor'], align: "center", fill: { color: colorObj['yellowBtnBg'] } }
            );

            RiskAssessmentSlide.addText(
                "Low",
                { x: "90%", y: 1.2, w: '8%', h: 0.2, fontSize: 8, bold: true, color: colorObj['greenBtnTextColor'], align: "center", fill: { color: colorObj['greenbtnBg'] } }
            );
            if (i != 0)
                RiskAssSplitArray[i].unshift([
                    { text: 'NPL T6', options: colHeaderStyle },
                    { text: 'Risk/Issue', options: colHeaderStyle },
                    { text: 'Risk Date', options: colHeaderStyle },
                    // { text: 'Risk Status', options: colHeaderStyle },
                    { text: 'Mitigation Plan', options: colHeaderStyle },
                    { text: 'Mitigation Date', options: colHeaderStyle },
                    // { text: 'Mitigation Status', options: colHeaderStyle },
                    { text: 'Active', options: colHeaderStyle },
                ]);
            RiskAssessmentSlide.addTable(RiskAssSplitArray[i], {
                x: 0.2,
                y: 1.4,
                // h:"80%",
                w: "96%",
                // rowH: 0.5, 0.3
                colW: [0.7, 3.1, 1, 3.1, 1, 0.7],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }

        let NPLT6SplitArray = sliceIntoChunks(nplt6, 11);
        for (let i = 0; i < NPLT6SplitArray.length; i++) {
            // [Page : " + (i + 1) + " of " + NPLT6SplitArray.length + "]
            let NPLT6Slide = pptx.addSlide();
            //SLIDE 1
            NPLT6Slide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            NPLT6Slide.addText(type,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: 18, fontFace: headerFontFamily }
            );
            // NPLT6Slide.addText(` ${programData['PortfolioPriority ? portfolioPriorityVal : ''}  ${programData['NPRiskStatus'] ? riskStat : ''}  ${programData['RiskTrend'] ? riskTrend : ''} ${programData['CoDevLead'] ? programData['CoDevLead'] : ''}  ${programData['LaunchLead'] ? programData['LaunchLead'] : ''} ${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()}`,
            //     { x: 0.2, y: 0.5, w: '96%', h: 0.3, align: 'center', fontSize: 14, fontFace: headerFontFamily, fill: { color: '#29a753' }, color: projTitleBg }
            // );
            NPLT6Slide.addTable(Title2Header, { x: 0.2, y: 0.5, w: '96%', fontSize: 10, color: '#242629' });

            NPLT6Slide.addText('NPLT6 Risk Assessment',
                { x: 0.2, y: 1.1, w: '96%', h: 0.3, align: 'left', fontSize: 15, fontFace: 'Calibri', fill: { color: '#4586ED' }, color: projTitleBg }
            );
            NPLT6Slide.addText(
                "At Risk",
                { x: "61%", y: 1.2, w: '8%', h: 0.2, fontSize: 8, bold: true, color: colorObj['yellowBtnTextColor'], align: "center", fill: { color: colorObj['yellowBtnBg'] } }
            );
            NPLT6Slide.addText(
                "Completed",
                { x: "69%", y: 1.2, w: '11%', h: 0.2, fontSize: 8, bold: true, color: colorObj['completeBtnTextColor'], align: "center", fill: { color: colorObj['completeBtnBg'] } }
            );
            NPLT6Slide.addText(
                "Delayed",
                { x: "80%", y: 1.2, w: '9%', h: 0.2, fontSize: 8, bold: true, color: colorObj.redBtnTextColor, align: "center", fill: { color: colorObj.redBtnBg } }
            );
            NPLT6Slide.addText(
                "On Track",
                { x: "89%", y: 1.2, w: '9%', h: 0.2, fontSize: 8, bold: true, color: colorObj['greenBtnTextColor'], align: "center", fill: { color: colorObj['greenbtnBg'] } }
            );
            if (i != 0)
                NPLT6SplitArray[i].unshift([
                    { text: 'NPL T6 Issues', options: colHeaderStyle },
                    { text: 'NPLT6 Risk Category', options: colHeaderStyle },
                    { text: 'NPLT6 Risk Status', options: colHeaderStyle }
                ]);
            NPLT6Slide.addTable(NPLT6SplitArray[i], {
                x: 0.2,
                y: 1.4,
                // h:"80%",
                w: "96%",
                // rowH: 0.5,
                colW: [6.6, 2, 1],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }

        let pptName = 'NPL_';
        if (SelectedView == 'Product View') pptName = pptName + type;
        else pptName = pptName + type;

        pptx.writeFile({ fileName: `${pptName}.pptx` })
            .then(msg => {
                console.log('generated ');
            }).catch(err => {
                console.log('err ppt : ', err);
            });


    } catch (error) {
        let errorMsg = {
            Source: 'Exe App-PPTExport',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg)
            .catch(e => console.log(e));
    }
}

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}
