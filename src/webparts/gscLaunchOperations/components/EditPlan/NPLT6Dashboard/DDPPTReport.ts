//import * as React from 'react';
import pptxgen from 'pptxgenjs';
//import * as moment from 'moment';
import { format } from 'date-fns';
//import { LaunchXService } from '../../Shared/DataService';
import { DataService } from '../../Shared/DataService';
//import DeepDive from './DeepDive';
import { StatusValues } from '../../Shared/DataService';


// const pfizerLogo: any = require('../../../../assets/images/Pfizer_Logo_Color_RGB.png');

const pfizerLogo: any = require('../../../../assets/images/Pfizer_Logo_Color_RGB.png');

const projTitleBg = '#FFFFFF';
//const projTitleColor = '#000000';
const headerFontFamily = 'Calibri';
//const PPTypeHeaderBg = '#4586ED';

const colHeaderStyle = {
    fontSize: 8,
    fontFace: headerFontFamily,
    valign: 'middle',
    align: 'center',
    fill: { color: '#A4ABAE' },
    border: { pt: "0.5", color: '#d3d3d3', type: 'solid' }
};
const title2HeaderStyle = {
    fontSize: 8,
    fontFace: headerFontFamily,
    valign: 'middle',
    align: 'center',
    fill: { color: '#000080' },
    color: projTitleBg,
    border: { pt: "0.5", color: projTitleBg, type: 'solid' }
};
const title2CellStyle = {
    fontSize: 8,
    fontFace: "Calibri",
    valign: 'middle',
    align: 'center',
    // fill: { color: '#000080' },
    border: { pt: "0.5", color: '#000080', type: 'solid' }
};
const textCellStyle = {
    fontSize: 8,
    fontFace: "Calibri",
    valign: 'middle',
    align: "left",
    border: { pt: "0.5", color: "#d3d3d3", type: "solid" }
};
const ProductDetailsFieldValue = {
    fontSize: 7,
    fontFace: "Calibri",
    valign: 'middle',
    align: "left",
    // border: { pt: "0.5", color: "#d3d3d3", type: "solid" }
};
const ProductDetailsFieldLabels = {
    fontSize: 8,
    fontFace: "Calibri",
    valign: 'middle',
    align: "left",
    bold: true
    // border: { pt: "0.5", color: "#d3d3d3", type: "solid" }
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
    border: { pt: "0.5", color: "#d3d3d3", type: "solid" }
};

export default function DDPPTReport(DeepDiveData, SelectedRowsData, programData, siteURL,attachURL) {
    try {
        if (DeepDiveData['ForecastImg']?.length > 0) {
            let imgUrl = '';
            
            if (DeepDiveData['ForecastImg']?.[0]?.['name']) imgUrl = DeepDiveData['ForecastImg']?.[0]?.['objectUrl'];
            else imgUrl = attachURL + DeepDiveData['ForecastImg']?.[0]?.['ServerRelativeUrl'];
            let img = new Image();
            img.src = imgUrl;
            //let imgBase64Url = '';
            //let imgBase64Url = null;
            img.onload = async () => {
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                let context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, 1300, 1000);
                //imgBase64Url = await canvas.toDataURL();
                //GenerateDDPPTReport(DeepDiveData, SelectedRowsData, programData, siteURL, imgBase64Url);
                imgUrl = imgUrl.toLowerCase();
                GenerateDDPPTReport(DeepDiveData, SelectedRowsData, programData, siteURL, imgUrl);

            };

        } else {
            GenerateDDPPTReport(DeepDiveData, SelectedRowsData, programData, siteURL, null);
        }

    } catch (error) {        
        let errorMsg = {
            Source: 'PP-DDPPTReport',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
}

export function GenerateDDPPTReport(DeepDiveData, SelectedRowsData, programData, siteURL, imgBase64Url) {
    try {
        //let UtilService = new LaunchXService('');
        const pptx = new pptxgen();
        let rowCount = 0;

        let LROptionsVal, LRColorObj, SCColorObj, SCOptionsVal;

        LRColorObj = StatusValues.filter(ele => ele.label == DeepDiveData['DDLaunchReadiness'])?.[0];
        LRColorObj = LRColorObj ? LRColorObj : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
        LROptionsVal = { text: LRColorObj?.["value"], bold: true, fontSize: 12, color: LRColorObj?.['color'], bgColor: LRColorObj?.["bgColor"] };


        SCColorObj = StatusValues.filter(ele => ele.label == DeepDiveData['DDSupplyContinuity'])?.[0];
        SCColorObj = SCColorObj ? SCColorObj : { key: '', id: '', color: '#000000', bgColor: '#FFFFFF' };
        SCOptionsVal = { text: SCColorObj?.["value"], bold: true, fontSize: 12, color: SCColorObj?.['color'], bgColor: SCColorObj?.["bgColor"] };


        let TitleFontSize = 18;
        //let ProgramName = UtilService.getProjectName(programData);
        let ProgramName = DataService.getProjectName(programData);
        if (ProgramName?.length > 60) TitleFontSize = 12;
        //Header 2
        let Title2Header = [];
        Title2Header = [
            [
                { text: 'NPL T6 Launch Readiness', options: title2HeaderStyle },
                { text: 'Supply Continuity Risk', options: title2HeaderStyle },
                { text: 'Co-Dev Lead', options: title2HeaderStyle },
                { text: 'Launch Lead', options: title2HeaderStyle },
                { text: 'Printed On', options: title2HeaderStyle }
            ], [
                {
                    text: `${DeepDiveData['DDLaunchReadiness'] ? DeepDiveData['DDLaunchReadiness'] : ''}`, options: {
                        fontSize: 8,
                        fontFace: "Calibri",
                        valign: 'middle',
                        align: 'center',
                        fill: { color: LROptionsVal['bgColor'] },
                        color: LROptionsVal['color'],
                        border: { pt: "0.5", color: '#000080', type: 'solid' }
                    }
                },
                {
                    text: `${DeepDiveData['DDSupplyContinuity'] ? DeepDiveData['DDSupplyContinuity'] : ''}`, options: {
                        fontSize: 8,
                        fontFace: "Calibri",
                        valign: 'middle',
                        align: 'center',
                        fill: { color: SCOptionsVal['bgColor'] },
                        color: SCOptionsVal['color'],
                        border: { pt: "0.5", color: '#000080', type: 'solid' }
                    }
                },
                { text: `${programData['Co_x002d_devLead'] ? programData['Co_x002d_devLead'] : ''}`, options: title2CellStyle },
                { text: `${programData['LaunchLead'] ? programData['LaunchLead'] : ''}`, options: title2CellStyle },
                { text: ` ${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()}`, options: title2CellStyle }
            ]];

        let ProductDetailsTable = [];
        ProductDetailsTable.push(
            [
                { text: 'Mechanism', options: ProductDetailsFieldLabels },
                { text: `${programData['MechanismOfAction']}`, options: ProductDetailsFieldValue },
                { text: '' },
                { text: 'Peak Revenue', options: ProductDetailsFieldLabels },
                { text: `${programData?.['PeakRevenue']?.includes('->') ? programData?.['PeakRevenue'].split['->']?.[1] : programData?.['PeakRevenue'] ? programData?.['PeakRevenue'] : '  '}`, options: ProductDetailsFieldValue },
            ],
            [
                { text: 'Indication', options: ProductDetailsFieldLabels },
                { text: `${programData['Indication']}`, options: ProductDetailsFieldValue },
                { text: '' },
                { text: 'Submission', options: ProductDetailsFieldLabels },
                { text: ` ${programData['EarliestSubmissionDate'] ? format(new Date(programData['EarliestSubmissionDate']), 'MMM-dd-yyyy') : ''}`, options: ProductDetailsFieldValue },
            ],
            [
                { text: 'Primary Formulation', options: ProductDetailsFieldLabels },
                { text: `${programData?.['Category'] ? programData?.['Category'] : '   '}`, options: ProductDetailsFieldValue },
                { text: '' },
                { text: 'Approval', options: ProductDetailsFieldLabels },
                { text: `${programData['EarliestApprovalDate'] ? format(new Date(programData['EarliestApprovalDate']), 'MMM-dd-yyyy') : ''}`, options: ProductDetailsFieldValue },
            ]
        );

        //Extract Milestone Data into Tables for Quad and Detailed View

        // Key Milestones
        let milestoneTable = [];
        let milestoneTableFull = [];
        const milestoneHeader = [[
            { text: 'Milestones/ Deliverables', options: colHeaderStyle },
            { text: 'Milestone Description', options: colHeaderStyle },
            { text: 'Target Date', options: colHeaderStyle },
            { text: 'Milestone Status', options: colHeaderStyle }
        ]];
        milestoneTable = [...milestoneHeader];
        milestoneTableFull = [[
            { text: 'Source', options: colHeaderStyle },
            { text: 'Milestones/Deliverables', options: colHeaderStyle },
            { text: 'Milestone Description', options: colHeaderStyle },
            { text: 'Target Date', options: colHeaderStyle },
            { text: 'Milestone Status', options: colHeaderStyle },
            { text: 'Visible', options: colHeaderStyle }
        ]];

        DeepDiveData['DDKeyMilestones']?.sort((a, b) => new Date(b.TargetDate).getTime() - new Date(a.TargetDate).getTime());
        DeepDiveData['DDKeyMilestones']?.map(ele => {
            let milestoneName = ele.Milestone;
            if (ele.Milestone?.includes('->'))
                milestoneName = ele.Milestone?.split('->')?.[1];
            let milestoneStatusVal = ele.MilestoneOnTrackMet?.includes('->') ? ele.MilestoneOnTrackMet.split('->')[1] : ele.MilestoneOnTrackMet;
            let filterObj = StatusValues.filter(rec => rec.label == milestoneStatusVal)?.[0];
            filterObj = filterObj ? filterObj : { label: '', color: '#000000', bgColor: '#FFFFFF' };
            milestoneTableFull.push([
                { text: ele.Source == 'DLPP' ? 'GLOW' : 'NP', options: dateCellStyle },
                { text: milestoneName, options: textCellStyle },
                { text: ele.MilestoneDescription, options: textCellStyle },
                { text: ele.TargetDate ? format(new Date(ele.TargetDate), "MMM yyyy") : '', options: dateCellStyle },
                { text: milestoneStatusVal, options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj['bgColor'] }, color: filterObj['color'], border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                { text: ele.showInNPLT6Report ? 'X' : '', options: dateCellStyle }
            ]);
        });
        rowCount = 0;
        if (SelectedRowsData['DDKeyMilestones']?.length > 0) {
            SelectedRowsData['DDKeyMilestones'].sort((a, b) => new Date(a.TargetDate).getTime() - new Date(b.TargetDate).getTime());
            SelectedRowsData['DDKeyMilestones']?.map(ele => {
                let milestoneVal = ele.Milestone?.includes('->') ? ele.Milestone.split('->')[1] : ele.Milestone;
                let milestoneStatusVal = ele.MilestoneOnTrackMet?.includes('->') ? ele.MilestoneOnTrackMet.split('->')[1] : ele.MilestoneOnTrackMet;
                let filterObj = StatusValues.filter(rec => rec.label == milestoneStatusVal)?.[0];
                filterObj = filterObj ? filterObj : { label: '', color: '#000000', bgColor: '#FFFFFF' };
                milestoneTable.push([
                    { text: milestoneVal, options: textCellStyleSlide1 },
                    {text:ele.MilestoneDescription,options:textCellStyleSlide1},
                    { text: ele.TargetDate ? format(new Date(ele.TargetDate), "MMM yyyy") : '', options: dateCellStyleSlide1 },
                    { text: milestoneStatusVal, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj['bgColor'] }, color: filterObj['color'], border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } }
                ]);
            });
            rowCount = SelectedRowsData['DDKeyMilestones']?.length;
        } else {
            DeepDiveData['DDKeyMilestones'] = DeepDiveData['DDKeyMilestones']?.filter(rec => rec.showInNPLT6Report)?.slice(0, 5);
            DeepDiveData['DDKeyMilestones']?.map(ele => {
                let milestoneVal = ele.Milestone?.includes('->') ? ele.Milestone.split('->')[1] : ele.Milestone;
                let milestoneStatusVal = ele.MilestoneOnTrackMet?.includes('->') ? ele.MilestoneOnTrackMet.split('->')[1] : ele.MilestoneOnTrackMet;
                let filterObj = StatusValues.filter(rec => rec.label == milestoneStatusVal)?.[0];
                filterObj = filterObj ? filterObj : { label: '', color: '#000000', bgColor: '#FFFFFF' };
                milestoneTable.push([
                    { text: milestoneVal, options: textCellStyleSlide1 },
                    {text:ele.MilestoneDescription,options:textCellStyleSlide1},
                    { text: ele.TargetDate ? format(new Date(ele.TargetDate), "MMM yyyy") : '', options: dateCellStyleSlide1 },
                    { text: milestoneStatusVal, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj['bgColor'] }, color: filterObj['color'], border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } }
                ]);
            });
            rowCount = DeepDiveData['DDKeyMilestones']?.length;
        }
        if (rowCount < 5) {
            let emptyRowCount = rowCount - 5;
            for (let i = 0; i < emptyRowCount; i++) {
                milestoneTable.push([
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                ]);
                milestoneTableFull.push([
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle }
                ]);
            }
        }

        // Risk Assessments
        let riskAss = [];
        let riskAssFull = [];
        let riskAssHeader = [[
            { text: 'Risk/Issue', options: colHeaderStyle },
            { text: 'Risk Category', options: colHeaderStyle },
            { text: 'Risk Status', options: colHeaderStyle }
        ]];

        riskAss = [...riskAssHeader];
        riskAssFull = [[
            { text: 'Source', options: colHeaderStyle },
            { text: 'Risk/Issue', options: colHeaderStyle },
            { text: 'Risk Category', options: colHeaderStyle },
            { text: 'Risk Status', options: colHeaderStyle },
            { text: 'Mitigation Plan', options: colHeaderStyle },
            { text: 'Visible', options: colHeaderStyle }
        ]];

        DeepDiveData['DDRiskAssessments']?.map(ele => {
            let riskCategoryName = ele.RiskCategory;
            if (ele.RiskCategory?.includes('->'))
                riskCategoryName = ele.RiskCategory?.split('->')?.[1];

            let RiskStatusVal = ele.RiskStatus;
            if (ele.RiskStatus?.includes('->'))
                RiskStatusVal = ele.RiskStatus?.split('->')?.[1];
            let filterObj = StatusValues.filter(rec => rec.label == RiskStatusVal)?.[0];
            filterObj = filterObj ? filterObj : { label: '', color: '#000000', bgColor: '#FFFFFF' };

            riskAssFull.push([
                { text: ele.Source == 'DLPP' ? 'GLOW' : 'NP', options: dateCellStyle },
                { text: ele.RiskOrIssue, options: textCellStyle },
                { text: riskCategoryName, options: textCellStyle },
                { text: RiskStatusVal, options: { fontSize: 8, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj['bgColor'] }, color: filterObj['color'], border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } },
                { text: ele.MitigationApproach, options: textCellStyle },
                { text: ele.showInNPLT6Report ? 'X' : '', options: textCellStyle }

            ]);
        });

        rowCount = 0;
        if (SelectedRowsData['DDRiskAssessments']?.length > 0) {
            SelectedRowsData['DDRiskAssessments'].map(ele => {
                let riskCategoryVal = ele.RiskCategory?.includes('->') ? ele.RiskCategory?.split('->')[1] : ele.RiskCategory;
                let riskStatVal = ele.RiskStatus?.includes('->') ? ele.RiskStatus?.split('->')?.[1] : ele.RiskStatus;
                let filterObj = StatusValues.filter(rec => rec.label == riskStatVal)?.[0];
                filterObj = filterObj ? filterObj : { label: '', color: '#000000', bgColor: '#FFFFFF' };

                riskAss.push([
                    { text: ele.RiskOrIssue, options: textCellStyleSlide1 },
                    { text: riskCategoryVal, options: textCellStyleSlide1 },
                    { text: riskStatVal, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj['bgColor'] }, color: filterObj['color'], border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } }
                ]);

            });
            rowCount = SelectedRowsData['DDRiskAssessments']?.length;
        } else {
            DeepDiveData['DDRiskAssessments'] = DeepDiveData['DDRiskAssessments']?.filter(rec => rec.showInNPLT6Report)?.slice(0, 5);
            DeepDiveData['DDRiskAssessments'].map(ele => {
                let riskCategoryVal = ele.RiskCategory?.includes('->') ? ele.RiskCategory?.split('->')[1] : ele.RiskCategory;
                let riskStatVal = ele.RiskStatus?.includes('->') ? ele.RiskStatus?.split('->')?.[1] : ele.RiskStatus;
                let filterObj = StatusValues.filter(rec => rec.label == riskStatVal)?.[0];
                filterObj = filterObj ? filterObj : { label: '', color: '#000000', bgColor: '#FFFFFF' };

                riskAss.push([
                    { text: ele.RiskOrIssue, options: textCellStyleSlide1 },
                    { text: riskCategoryVal, options: textCellStyleSlide1 },
                    { text: riskStatVal, options: { fontSize: 6, fontFace: 'Calibri', valign: 'middle', align: 'center', fill: { color: filterObj['bgColor'] }, color: filterObj['color'], border: { pt: "0.5", color: '#d3d3d3', type: 'solid' } } }
                ]);

            });
            rowCount = DeepDiveData['DDRiskAssessments']?.length;
        }
        if (rowCount < 5) {
            let emptyRowCount = rowCount - 5;
            for (let i = 0; i < emptyRowCount; i++) {
                riskAss.push([
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 },
                    { text: '', options: textCellStyleSlide1 }
                ]);
                riskAssFull.push([
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle },
                    { text: '', options: textCellStyle }
                ]);
            }
        }

        let supplyChainTable = [];
        let supplyChainTableAll = [];
        let supplyChainHeader = [[
            { text: 'RSM', options: colHeaderStyle },
            { text: 'API/DS', options: colHeaderStyle },
            { text: 'DP', options: colHeaderStyle },
            { text: 'Primary Pkg', options: colHeaderStyle },
            { text: 'Secondary Pkg', options: colHeaderStyle }
        ]];

        supplyChainTable = [...supplyChainHeader];
        supplyChainTableAll = [...supplyChainHeader];

        DeepDiveData['DDSupplyChain']?.map(rec => {
            supplyChainTableAll.push([
                { text: rec.RSMIntermediateSite?.split('->')?.[1], options: textCellStyle },
                { text: rec.DS_x002f_APISite?.split('->')?.[1], options: textCellStyle },
                { text: rec.DPSite?.split('->')?.[1], options: textCellStyle },
                { text: rec.PPKGSite?.split('->')?.[1], options: textCellStyle },
                { text: rec.SPKGSite?.split('->')?.[1], options: textCellStyle }
            ]);
        });

        rowCount = 0;
        if (SelectedRowsData['DDSupplyChain']?.length > 0) {
            SelectedRowsData['DDSupplyChain']?.map(rec => {
                supplyChainTable.push([
                    { text: rec.RSMIntermediateSite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.DS_x002f_APISite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.DPSite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.PPKGSite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.SPKGSite?.split('->')?.[1], options: textCellStyleSlide1 }
                ]);
            });
            rowCount = SelectedRowsData['DDSupplyChain']?.length;
        } else {
            DeepDiveData['DDSupplyChain'] = DeepDiveData['DDSupplyChain'].slice(0, 5);
            DeepDiveData['DDSupplyChain']?.map(rec => {
                supplyChainTable.push([
                    { text: rec.RSMIntermediateSite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.DS_x002f_APISite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.DPSite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.PPKGSite?.split('->')?.[1], options: textCellStyleSlide1 },
                    { text: rec.SPKGSite?.split('->')?.[1], options: textCellStyleSlide1 }
                ]);
            });
            rowCount = DeepDiveData['DDSupplyChain']?.length;
        }
        if (rowCount < 5) {
            let emptyCount = 5 - rowCount;
            for (let i = 0; i < emptyCount; i++) {
                // supplyChainTable.push([
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle }
                // ]);
                // supplyChainTableAll.push([
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle },
                //     { text: '', options: textCellStyle }
                // ]);
            }
        }

        let QuadView1Slide = pptx.addSlide();

        //slide 1 
        QuadView1Slide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
        QuadView1Slide.addText(ProgramName,
            { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: TitleFontSize, fontFace: headerFontFamily }
        );
        QuadView1Slide.addTable(Title2Header, { x: 0.2, y: 0.55, w: '96%', fontSize: 14, color: '#242629' });
        //Quad 1
        QuadView1Slide.addText('Key Product Details & Supply Chain',
            { x: 0.2, y: 1.1, w: '47%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );
        // QuadView1Slide.addTable(ProductDetailsTable, { x: 0.2, y: 1.4, w: '47%',rowH:[0.05,0.05,0.05], colW: [0.9, 2.2, 0.05, 0.8, 0.8], fontSize: 8, color: '#242629' });
        QuadView1Slide.addText(`Mechanism: `,
            { x: 0.2, y: 1.4, w: 2, h: 0.17, align: 'left', fontSize: 7, bold: true, color: '#242629' }
        );
        QuadView1Slide.addText(`${programData['MechanismOfAction'] ? programData['MechanismOfAction'] : ''}`,
            { x: 1.1, y: 1.4, w: 2.5, h: 0.17, align: 'left', fontSize: 7, color: '#242629' }
        );
        QuadView1Slide.addText(`Peak Revenue: `,
            { x: 3.3, y: 1.4, w: 1, h: 0.17, align: 'left', fontSize: 7, bold: true, color: '#242629' }
        );
        QuadView1Slide.addText(`${programData?.['PeakRevenue']?.includes('->') ? programData?.['PeakRevenue'].split('->')?.[1] : programData?.['PeakRevenue'] ? programData?.['PeakRevenue'] : '  '}`,
            { x: 4.0, y: 1.4, w: 2.5, h: 0.17, align: 'left', fontSize: 7, color: '#242629' }
        );
        QuadView1Slide.addText(`Indication: `,
            { x: 0.2, y: 1.55, w: 2, h: 0.17, align: 'left', bold: true, fontSize: 7, color: '#242629' }
        );
        QuadView1Slide.addText(`${programData['Indication'] ? programData['Indication'] : ''}`,
            { x: 1.1, y: 1.55, w: 2.5, h: 0.17, align: 'left', fontSize: 7, color: '#242629' }
        );
        QuadView1Slide.addText(`Submission: `,
            { x: 3.3, y: 1.55, w: 1, h: 0.17, align: 'left', bold: true, fontSize: 7, color: '#242629' }
        );
        QuadView1Slide.addText(`${programData['EarliestSubmissionDate'] ? format(new Date(programData['EarliestSubmissionDate']), 'MMM-dd-yyyy') : ''}`,
            { x: 4.0, y: 1.55, w: 2.5, h: 0.17, align: 'left', fontSize: 7, color: '#242629' }
        );
        QuadView1Slide.addText(`Primary Formulation: `,
            { x: 0.2, y: 1.7, w: 2, h: 0.17, align: 'left', fontSize: 7, bold: true, color: '#242629' }
        );
        QuadView1Slide.addText(`${programData['Category'] ? programData['Category'] : ''}`,
            { x: 1.1, y: 1.7, w: 2.5, h: 0.17, align: 'left', fontSize: 7, color: '#242629' }
        );
        QuadView1Slide.addText(`Approval: `,
            { x: 3.3, y: 1.7, w: 1, h: 0.17, align: 'left', fontSize: 7, bold: true, color: '#242629' }
        );
        QuadView1Slide.addText(`${programData['EarliestApprovalDate'] ? format(new Date(programData['EarliestApprovalDate']), 'MMM-dd-yyyy') : ''}`,
            { x: 4.0, y: 1.7, w: 2.5, h: 0.17, align: 'left', fontSize: 7, color: '#242629' }
        );

        QuadView1Slide.addTable(supplyChainTable, { x: 0.2, y: 1.9, w: '47%', colW: [0.95, 0.95, 0.9, 0.95, 0.95], fontSize: 14, color: '#242629' });

        //Quad 2
        QuadView1Slide.addText('Key Milestones',
            { x: '50%', y: 1.1, w: '48%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );
        // [1.4,1.7, 0.8, 0.9]
        QuadView1Slide.addTable(milestoneTable, { x: '50%', y: 1.4, w: '47%', colW: [1.3, 2.2, 0.6, 0.7], fontSize: 14, color: '#242629' });
        //Quad 3 - Forecast & Capacity
        QuadView1Slide.addText('Forecast & Capacity',
            { x: 0.2, y: '57%', w: '47%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );
        QuadView1Slide.addText(`COGS % Net Price: `,
            { x: 0.2, y: '62%', w: '23%', h: 0.2, align: 'left', bold: true, fontSize: 7 }
        );
        QuadView1Slide.addText(`${DeepDiveData['DDCogs'] ? DeepDiveData['DDCogs'] : ''}`,
            { x: 1.0, y: '62%', w: '23%', h: 0.2, align: 'left', fontSize: 7 }
        );
        // QuadView1Slide.addText(`Forecast Status: `,
        //     { x: 3.5, y: '62%', w: '23%', h: 0.2, align: 'left', bold: true, fontSize: 7 }
        // );
        // QuadView1Slide.addText(`${programData['DDForecastStatus']?.includes('->') ? programData['DDForecastStatus']?.split('->')[1] : programData['DDForecastStatus']}`,
        //     { x: 4.2, y: '62%', w: '23%', h: 0.2, align: 'left', fontSize: 7 }
        // );
        if (DeepDiveData['ForecastImg']?.length > 0) {

            // imgUrl='https://pfizer.sharepoint.com/sites/LaunchXNPD_Dev/DeepDiveForecastImages/214/Worsening.png';
            // QuadView1Slide.addImage({ x: 0.4, y: '66%', w: 4.4, h: 1.4, path: imgUrl });
            if (imgBase64Url) {
                QuadView1Slide.addImage({ x: 0.4, y: '66%', w: 4.4, h: 1.4, path: imgBase64Url });
            }
            // https://pfizer.sharepoint.com/sites/LaunchXNPD_Dev/DeepDiveForecastImages/214/Worsening.PNG
        }

        //Quad 4 - Risk Assessment
        QuadView1Slide.addText('Risk Assessment',
            { x: '50%', y: '57%', w: '48%', h: 0.3, align: 'left', fontSize: 10.5, fill: { color: '#4586ED' }, color: projTitleBg }
        );
        QuadView1Slide.addTable(riskAss, { x: '50%', y: '62.5%', w: '48%', colW: [2.8, 1, 1], autoPage: true, fontSize: 14, color: '#242629' });



        //Milestone Detailed Slide

        let KeyMilestoneSplitArray = DataService.sliceIntoChunks(milestoneTableFull, 9);
        for (let i = 0; i < KeyMilestoneSplitArray.length; i++) {
            let keyMilestoneSlide = pptx.addSlide();
            keyMilestoneSlide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            keyMilestoneSlide.addText(ProgramName,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: TitleFontSize, fontFace: headerFontFamily }
            );
            keyMilestoneSlide.addTable(Title2Header, { x: 0.2, y: 0.55, w: '96%', fontSize: 14, color: '#242629' });
            keyMilestoneSlide.addText(
                "Key Milestones",
                { x: 0.2, y: 1.15, w: '96%', h: 0.3, align: 'left', fontSize: 15, fill: { color: '#4586ED' }, color: projTitleBg }
            );
            if (i != 0)
                KeyMilestoneSplitArray[i].unshift([
                    { text: 'Source', options: colHeaderStyle },
                    { text: 'Milestone', options: colHeaderStyle },
                    { text: 'Milestone Description', options: colHeaderStyle },
                    { text: 'Target Date', options: colHeaderStyle },
                    { text: 'Milestone Status', options: colHeaderStyle },
                    { text: 'Visible', options: colHeaderStyle }
                ]);
            keyMilestoneSlide.addTable(KeyMilestoneSplitArray[i], {
                x: 0.2,
                y: 1.45,
                // h:"80%",
                w: "96%",
                // rowH: 0.5,
                colW: [0.8, 2.2, 3.9, 1, 1.2, 0.5],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }
        //Risk Assessment Detailed Slide

        let RiskAssessmentSplitArray = DataService.sliceIntoChunks(riskAssFull, 11);
        for (let i = 0; i < RiskAssessmentSplitArray.length; i++) {
            let RiskAssessmentSlide = pptx.addSlide();
            RiskAssessmentSlide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            RiskAssessmentSlide.addText(ProgramName,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: TitleFontSize, fontFace: headerFontFamily }
            );
            RiskAssessmentSlide.addTable(Title2Header, { x: 0.2, y: 0.55, w: '96%', fontSize: 14, color: '#242629' });
            RiskAssessmentSlide.addText(
                "Risk Assessments",
                { x: 0.2, y: 1.15, w: '96%', h: 0.3, align: 'left', fontSize: 15, fill: { color: '#4586ED' }, color: projTitleBg }
            );
            if (i != 0)
                RiskAssessmentSplitArray[i].unshift([
                    { text: 'Source', options: colHeaderStyle },
                    { text: 'Risk/Issue', options: colHeaderStyle },
                    { text: 'Risk Category', options: colHeaderStyle },
                    { text: 'Risk Status', options: colHeaderStyle },
                    { text: 'Mitigation Plan', options: colHeaderStyle },
                    { text: 'Visible', options: colHeaderStyle }
                ]);
            RiskAssessmentSlide.addTable(RiskAssessmentSplitArray[i], {
                x: 0.2,
                y: 1.45,
                // h:"80%",
                w: "96%",
                // rowH: 0.5,
                colW: [0.7, 3, 1.2, 1.2, 3, 0.5],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }

        //Supply Chain Detailed Slide
        let SupplyChainSplitArray = DataService.sliceIntoChunks(supplyChainTableAll, 11);
        for (let i = 0; i < SupplyChainSplitArray.length; i++) {
            let SupplyChainSlide = pptx.addSlide();
            SupplyChainSlide.addImage({ x: 0.2, y: 0.1, w: 0.8, h: 0.3, path: pfizerLogo });
            SupplyChainSlide.addText(ProgramName,
                { x: 1.0, y: 0.1, w: '85%', h: 0.4, align: 'left', fontSize: TitleFontSize, fontFace: headerFontFamily }
            );
            SupplyChainSlide.addTable(Title2Header, { x: 0.2, y: 0.55, w: '96%', fontSize: 14, color: '#242629' });
            SupplyChainSlide.addText(
                "Supply Chain",
                { x: 0.2, y: 1.15, w: '96%', h: 0.3, align: 'left', fontSize: 15, fill: { color: '#4586ED' }, color: projTitleBg }
            );
            if (i != 0)
                SupplyChainSplitArray[i].unshift([
                    { text: 'RSM', options: colHeaderStyle },
                    { text: 'API/DS', options: colHeaderStyle },
                    { text: 'DP', options: colHeaderStyle },
                    { text: 'Primary Pkg', options: colHeaderStyle },
                    { text: 'Secondary Pkg', options: colHeaderStyle }
                ]);
            SupplyChainSlide.addTable(SupplyChainSplitArray[i], {
                x: 0.2,
                y: 1.45,
                // h:"80%",
                w: "96%",
                // rowH: 0.5,
                colW: [1.9, 1.9, 1.9, 1.9, 2.0],
                fontSize: 14,
                color: "#242629",
                autoPage: true,
                autoPageRepeatHeader: false
                // border:{ pt: "1", color: "BBCCDD" }
            });
        }
        let pptReportName = programData['PfizerCode'] + ": ";
        pptReportName += programData['ProjectNameAlias'] ? programData['ProjectNameAlias'] : programData['ShortDesc'];
        pptReportName += '- NPL T6 Report.pptx';
        pptx.writeFile({ fileName: pptReportName })
            .then(msg => {
                // console.log('generated ');
            }).catch(err => {
                console.log('err ppt : ', err);
            });
    } catch (error) {

        //let utilService = new LaunchXService('');
        let errorMsg = {
            Source: 'DeepDive-GenerateDDPPTReport',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addDatatoList('Errors_Logs', errorMsg);
    }
}