import * as React from 'react';
import { useEffect, useState } from 'react';
import DataGrid, { Column, Paging, Pager, ColumnFixing } from 'devextreme-react/data-grid';
import { DeepDiveTemplateCheckBox, statusCol } from './TemplateComponent';

export default function PPMilestones(props) {
    const [milestoneData, setMilestoneData] = useState([]);

    const pageSizes = [10, 25, 50, 100, 'all'];

    useEffect(() => {
        setMilestoneData(props.milestoneData);
    }, [props]);

    return (
        <div style={{ marginLeft: "1%" }}>
            <DataGrid
                noDataText='No milestones to display. Please create it from Project Center.'
                height={500}
                className='PPMilestonesGrid'
                dataSource={milestoneData}
                hoverStateEnabled
                showRowLines
                showColumnLines
                allowColumnReordering
                allowColumnResizing
                showBorders
                wordWrapEnabled
                columnAutoWidth={true}
                columnMinWidth={1}
            >
                <ColumnFixing enabled={true} />
                <Column
                    caption='NPL T6'
                    dataField={'NPLT6Milestone'}
                    dataType='boolean'
                    alignment={'center'}
                    allowSorting
                    cellRender={DeepDiveTemplateCheckBox}
                />
                {props.selectedprojectName === 'All' &&
                    <Column
                        caption='Project Name'
                        dataField={'ProjectName'}
                        dataType='string'
                        alignment={'left'}
                    />}
                <Column
                    caption='Milestone/Deliverables'
                    dataField={'TaskName'}
                    dataType='string'
                />
                <Column
                    caption='Target Date'
                    dataField={'TaskFinishDate'}
                    dataType={'date'}
                    alignment={'left'}
                    format='MMM-dd-yyyy'
                />
                <Column
                    caption='Status'
                    dataField={'LaunchHealth'}
                    alignment={'left'}
                    dataType={'string'}
                    cellRender={statusCol}
                />
                <Pager showInfo={true} infoText="Total Rows: {2}" displayMode={'full'} visible={true} allowedPageSizes={pageSizes} showPageSizeSelector='true' />
                <Paging enabled={true} defaultPageSize={10} />
            </DataGrid>
        </div>
    );
}