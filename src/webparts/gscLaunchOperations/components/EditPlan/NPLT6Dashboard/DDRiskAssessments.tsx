import * as React from 'react';
import { useRef } from 'react';
import DataGrid, { Column, Paging, Pager, ColumnFixing } from 'devextreme-react/data-grid';
import { CalculateCellValueTemplate, StatusTemplate } from './TemplateComponent';
//import { LaunchXService } from '../../Shared/DataService';
import { Checkbox } from 'primereact/checkbox';

//import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
// import { DynamicObjFormat, updateGenericReduxState, CurrentProgramPPRiskAssessmentsSelector, CurrentProgramModeSelector, ExeAppRisksSelector, CurrentProgramDataSelector } from '../../Redux/ReduxSlices/MasterDataSlice';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { Toast } from 'primereact/toast';
import { DataService } from '../../Shared/DataService';

export default function DDRiskAssessments(props) {

    const pageSizes = [10, 25, 50, 100, 'all'];
    // const UtilService = new LaunchXService(props);
    // const CurrentProgramPPRiskAssData_R: Array<DynamicObjFormat> = useAppSelector(CurrentProgramPPRiskAssessmentsSelector);
    // const ExeAppRisks_R = useAppSelector(ExeAppRisksSelector);
    // const CurrentProgramMode_R = useAppSelector(CurrentProgramModeSelector);
    // const CurrentProgramData_R = useAppSelector(CurrentProgramDataSelector);
    // const dispatch = useAppDispatch();

    let toast = useRef(null);
    //let gridDataRef = useRef(null);

    let riskAssArr = [...cloneDeep(props.ExeAppRisks)];
    //let riskAssArr = props.ExeAppRisks;
    let currentTabRiskAss = [...cloneDeep(props.RiskAssRecords.filter(rec => rec.IsDeepDive && rec.IsActive))];//.sort((a,b)=>b.showInNPLT6Report - a.showInNPLT6Report);
    currentTabRiskAss.map(cRisk => {
        if (!cRisk.ProjectName) {
            cRisk.ProjectName = props.LaunchXlist['ProjectNameAlias'] ? props.LaunchXlist['ProjectNameAlias'] : props.LaunchXlist['ShortDesc'];
        }
    });
    riskAssArr = [...riskAssArr, ...currentTabRiskAss].sort((a, b) => b.showInNPLT6Report - a.showInNPLT6Report);
    let rIndex = 0;
    riskAssArr.map(rec => {
        rec['Source'] = rec['Source'] == 'DLPP' ? 'GLOW' : 'NP';
        rec['rowIndex'] = rIndex;
        ++rIndex;
    });

    const updateVisibleFlag = (value, index) => {
        try {
            let gridDataArr = [...cloneDeep(riskAssArr)];
            let totalVisibleRecords = [...cloneDeep(props.ExeAppRisks).filter(rec => rec.showInNPLT6Report), ...cloneDeep(props.RiskAssRecords).filter(rec => rec.showInNPLT6Report)];
            if (totalVisibleRecords?.length < 5) {
                updateNPLT6FlaginReduxStore(gridDataArr, value, index);
            } else {
                if (value)
                    toast.current?.show({ severity: 'warn', summary: '', detail: 'Please select at the most 5 records!!', life: '3000' });
                else {
                    updateNPLT6FlaginReduxStore(gridDataArr, value, index);
                }

            }
        } catch (error) {
            let errorMsg = {
                Source: 'Product Form-updateVisibleFlag',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const updateNPLT6FlaginReduxStore = async (gridDataArr, value, index) => {
        try {
            let filteredIndex = gridDataArr.findIndex((rec: any) => rec.rowIndex == index);
            if (gridDataArr[filteredIndex]['Source'] == 'GLOW') {
                let ExeAppRisksArr = cloneDeep(props.ExeAppRisks);
                ExeAppRisksArr.map(rec => {
                    if (rec.index == gridDataArr[filteredIndex]['index']) {
                        rec['showInNPLT6Report'] = value;
                        rec["IsModified"] = true;
                    }
                });
                //dispatch(updateGenericReduxState({ key: 'ExeAppRisks', value: ExeAppRisksArr }));
                props.parentCallback("ExeAppRisks", ExeAppRisksArr);
            }
            if (gridDataArr[filteredIndex]['Source'] == 'NP') {
                let PPRiskArr = cloneDeep(props.RiskAssRecords);
                PPRiskArr.map(rec => {
                    if (rec.index == gridDataArr[filteredIndex]['index']) {
                        rec['showInNPLT6Report'] = value;
                        rec["IsModified"] = true;
                    }
                });
                //dispatch(updateGenericReduxState({ key: 'PPRiskAssessments', value: PPRiskArr }));
                props.parentCallback("RiskAssRecords", PPRiskArr);
            }
        }
        catch (error) {
            let errorMsg = {
                Source: 'Product Form-updateNPLT6FlaginReduxStore',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    return (
        <>
            <Toast ref={toast} position="top-center" />
            <DataGrid
                dataSource={riskAssArr}
                hoverStateEnabled
                showRowLines
                showColumnLines
                showBorders
                allowColumnReordering
                allowColumnResizing
                wordWrapEnabled
            >
                <ColumnFixing enabled={true} />
                <Column caption={'Visible'} alignment={'center'}
                    cellRender={e =>
                        <Checkbox
                            className='DeepDiveCheckboxInGrid'
                            //disabled={CurrentProgramMode_R == 'View' || !props.userGroups.includes('LaunchX_SuperUsers')}
                            disabled={props.Mode == 'View'}
                            checked={e.data['showInNPLT6Report'] ? true : false}
                            onChange={e1 => updateVisibleFlag(e1.checked, e.data['rowIndex'])}
                        />
                    } width={'6%'} />
                <Column caption='Source' allowSorting dataField={'Source'}
                    // cellRender={e => { return <span>{e.data.Source == 'DLPP' ? 'GLOW' : 'NP'}</span>; }}
                    alignment={'center'} width={'8%'} />
                <Column caption='Project Name' dataField={'ProjectName'} alignment={'left'} width={'20%'} allowSorting />
                <Column caption='Risk/Issue' dataField={'RiskOrIssue'} dataType='string' alignment={'left'} width='22%' allowSorting />
                <Column caption='Risk Category' dataField={'RiskCategory'} dataType='string' alignment={'left'} width='12%' allowSorting calculateCellValue={e => CalculateCellValueTemplate(e, 'RiskCategory')} />
                <Column caption='Risk Status' dataField={'RiskStatus'} cellRender={StatusTemplate} dataType='string' alignment={'center'} width='9%' allowSorting />
                <Column caption='Mitigation Plan' dataField={'MitigationApproach'} dataType='string' alignment={'left'} width='20%' allowSorting />
                <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                <Paging enabled={true} defaultPageSize={10} />
            </DataGrid>
        </>
    );
}