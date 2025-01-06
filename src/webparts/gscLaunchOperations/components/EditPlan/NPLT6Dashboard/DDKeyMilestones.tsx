import * as React from 'react';
import { useRef } from 'react';
import DataGrid, { Column, Paging, Pager } from 'devextreme-react/data-grid';
import { CalculateCellValueTemplate, StatusTemplate } from './TemplateComponent';
//import { LaunchXService } from '../../Shared/DataService';
//import CheckBox from 'devextreme-react/check-box';
import { Checkbox } from 'primereact/checkbox';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { DataService } from '../../Shared/DataService';

//import { useAppSelector, useAppDispatch } from '../../Redux/hooks';
//import { CurrentProgramModeSelector, updateGenericReduxState } from '../../Redux/ReduxSlices/MasterDataSlice';
//import { DynamicObjFormat, CurrentProgramBSCDataSelector, ProjectCenterPlansSelector } from '../../Redux/ReduxSlices/MasterDataSlice';
import { Toast } from 'primereact/toast';

export default function DDKeyMilestones(props) {

    // const UtilService = new LaunchXService(props);
    // const CurrentProgramBSCData_R = useAppSelector(CurrentProgramBSCDataSelector);
    // const ProjectCenterPlans_R = useAppSelector(ProjectCenterPlansSelector);
    // const CurrentProgramMode_R=useAppSelector(CurrentProgramModeSelector);
    // const dispatch = useAppDispatch();

    //const [MilestonesGridData, setMilestonesGridData] = useState([]);
    //let gridDataRef = useRef(null);
    let toast = useRef(null);

    //let DDMilestones = [...cloneDeep(ProjectCenterPlans_R), ...cloneDeep(CurrentProgramBSCData_R.filter(rec => rec.IsDeepDive && rec.IsActive && rec.TargetDateStatus != '01->New'))].sort((a,b)=>b.showInNPLT6Report - a.showInNPLT6Report);
    let DDMilestones = [...cloneDeep(props.ProjectCenterPlans), ...cloneDeep(props.BSCAllRecords.filter(rec => rec.IsDeepDive && rec.IsActive && rec.TargetDateStatus != '01->New'))].sort((a, b) => b.showInNPLT6Report - a.showInNPLT6Report);
    let rIndex = 0;
    DDMilestones.map(rec => {
        rec['Source'] = rec['Source'] == 'DLPP' ? 'GLOW' : 'NP';
        rec['rowIndex'] = rIndex;
        ++rIndex;
    });
    const updateVisibleFlag = (value, index) => {
        try {
            let gridDataArr = DDMilestones;
            //let totalVisible = [];
            if (gridDataArr?.filter(rec => rec.showInNPLT6Report)?.length < 5) {
                updateValueInReduxStore(gridDataArr, value, index);
            } else {
                if (value)
                    toast.current?.show({ severity: 'warn', summary: '', detail: 'Please select at the most 5 records!!', life: '3000' });
                else {
                    updateValueInReduxStore(gridDataArr, value, index);
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

    

    const updateValueInReduxStore = async (gridDataArr, value, index) => {
        try {
            let filteredIndex = gridDataArr.findIndex((rec: any) => rec.rowIndex == index);
            if (gridDataArr[filteredIndex]['Source'] == 'GLOW') {
                let ProjectPlanArr = cloneDeep(props.ProjectCenterPlans);
                ProjectPlanArr.map(rec => {
                    if (rec.index == gridDataArr[filteredIndex]['index']) {
                        rec['showInNPLT6Report'] = value;
                        rec["IsModified"] = true;
                    }
                });
                //dispatch(updateGenericReduxState({ key: 'ProjectCenterPlans', value: ProjectPlanArr }));
                props.parentCallback("ProjectPlan", ProjectPlanArr);

            }
            if (gridDataArr[filteredIndex]['Source'] == 'NP') {
                let BSCDataArr = cloneDeep(props.BSCAllRecords);
                BSCDataArr.map(rec => {
                    if (rec.index == gridDataArr[filteredIndex]['index']) {
                        rec['showInNPLT6Report'] = value;
                        rec["IsModified"] = true;
                    }
                });
                //dispatch(updateGenericReduxState({ key: 'BSCData', value: BSCDataArr }));
                props.parentCallback("BSC", BSCDataArr);
            }
        } catch (error) {
            let errorMsg = {
                Source: 'Product Form-updateValueInReduxStore',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    const pageSizes = [10, 25, 50, 100, 'all'];
    return (
        <>
            <Toast ref={toast} position="top-center" />
            <DataGrid
                className='PPMilestonesGrid'
                dataSource={DDMilestones}
                hoverStateEnabled
                showRowLines
                showColumnLines
                allowColumnReordering
                allowColumnResizing
                showBorders
                wordWrapEnabled
            // sorting={}
            >
                <Column caption={'Visible'} alignment={'center'} width='6%'
                    cellRender={e =>
                        <Checkbox
                            className='DeepDiveCheckboxInGrid'
                            checked={e.data['showInNPLT6Report'] ? true : false}
                            //disabled={CurrentProgramMode_R == 'View' || !props.userGroups.includes('LaunchX_SuperUsers')}
                            disabled={ props.Mode == 'View'}
                            onChange={e1 => updateVisibleFlag(e1.checked, e.data['rowIndex'])}
                        />
                    } />
                <Column caption='Source' allowSorting dataField={'Source'}
                    // cellRender={e => { return e.data.Source == 'DLPP' ? 'GLOW' : 'NP'; }}
                    alignment={'center'} width='9%' />
                <Column caption={'Milestone/Deliverables'} dataField={'Milestone'} dataType={'string'} alignment={'left'} width='20%' calculateCellValue={e => CalculateCellValueTemplate(e, 'Milestone')} />
                <Column caption='Milestone Description' dataField={'MilestoneDescription'} dataType={'string'} alignment={'left'} width='30%' />
                <Column caption={'Target Date'} dataField={'TargetDate'} dataType={'date'} //sortOrder={'desc'}
                    alignment={'center'} width='12%' format='MMM yyyy' />
                <Column caption='Milestone Status' dataField={'MilestoneOnTrackMet'} dataType={'string'} alignment={'center'} width='12%' cellRender={StatusTemplate} />
                <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                <Paging enabled={true} defaultPageSize={10} />
            </DataGrid>
        </>
    );
}