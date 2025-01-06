import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import DataGrid, { Column, Selection, Scrolling, ColumnFixing } from 'devextreme-react/data-grid';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataService } from '../../Shared/DataService';

export default function ShowDropdownDataInGrid(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    let dataGridRef = useRef(null);

    useEffect(() => {
        setSelectedRowKeys(props.value);
    }, [props]);

    const updateValueOnSelectionChanged = (e) => {
        try {
            if (e.currentSelectedRowKeys?.length > 0) {
                let valueToUpdate = null;
                if (e.currentSelectedRowKeys?.[0]?.['actualValue'])
                    valueToUpdate = e.currentSelectedRowKeys?.[0]?.['actualValue'];
                props.updateValue(valueToUpdate);
            }
            if (e.selectedRowsData?.length > 0)
                setShowDialog(false);

        } catch (error) {
            let errorMsg = {
                Source: 'ShowDropdownDataInGrid-updateValueOnSelectionChanged',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg);
        }
    };

    const dialogHeaderIcons = () => {
        try {
            return (
                <div className='p-dialog-titlebar-icon p-link'>
                    <Button className='p-button-raised p-button-rounded closeBtn' onClick={hideDialog} icon='dx-icon-close' label='Cancel' />
                </div>
            );
        } catch (error) {
            let errorMsg = {
                Source: 'ShowDropdownDataInGrid-dialogHeaderIcons',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg);
        }
    };

    const hideDialog = () => {
        try {
            setShowDialog(false);
            dataGridRef.current.hide();
        } catch (error) {
            let errorMsg = {
                Source: 'ShowDropdownDataInGrid-hideDialog',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg);
        }
    };

    const MetricOwnerDefinitionTemplate = (rowData) => {
        try {
            const defArr = rowData.value?.split(';');
            console.log(defArr);
            if (defArr?.length == 1 && defArr?.[0] == '')
                return <></>;
            else
                return <ul>{defArr.map(rec => <li>{rec}</li>)}</ul>;

        } catch (error) {
            let errorMsg = {
                Source: 'ShowDropdownDataInGrid-MetricOwnerDefinitionTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg);
        }
    };

    return (
        <>
            <Dropdown
                options={props.dataSource}
                optionLabel={props.internalName}
                optionValue={'actualValue'}
                ref={ref => dataGridRef.current = ref}
                value={selectedRowKeys}
                onFocus={e => setShowDialog(true)}
                disabled={props.disabled}
            />
            <Dialog
                visible={showDialog}
                header='Select ...'
                style={{ width: '75vw', height: '70vh' }}
                dismissableMask={true}
                icons={dialogHeaderIcons}
                closable={false}
                onHide={hideDialog}
            >
                <DataGrid
                    dataSource={props.dataSource}
                    hoverStateEnabled={true}
                    selectedRowKeys={selectedRowKeys}
                    onSelectionChanged={updateValueOnSelectionChanged}
                    columnAutoWidth={true}
                    showBorders
                    showRowLines
                    showColumnLines
                    wordWrapEnabled
                >
                    {props.gridColumns?.map(rec => {
                        if (props.internalName == 'MetricOwner' && rec.dataField == 'Definition')
                            return <Column
                                caption={rec.caption}
                                dataField={rec.dataField}
                                width={rec.width}
                                dataType={'string'}
                                alignment={rec.alignment}
                                cellRender={MetricOwnerDefinitionTemplate}
                            />;
                        else
                            return <Column
                                caption={rec.caption}
                                dataField={rec.dataField}
                                width={rec.width}
                                dataType={'string'}
                                alignment={rec.alignment}
                            />;
                    }
                    )}
                    <Scrolling mode="virtual" />
                    <Selection mode='single' />
                    <ColumnFixing enabled={true} />
                </DataGrid>
            </Dialog>
        </>
    );
}