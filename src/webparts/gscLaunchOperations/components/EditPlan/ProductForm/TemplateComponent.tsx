import { Checkbox } from 'primereact/checkbox';
import * as React from 'react';
import { DataService } from '../../Shared/DataService';
import '../MileStoneData.css';

export const StatusTemplate = (option) => {
    try {
        if (option) {
            if (typeof option != 'boolean') {
                let value = option.value?.includes('->') ? option.value?.split('->')?.[1] : option.value;
                if (value == 'At Risk' || value == 'Medium' || value === 'Yellow' || value === 'Planned') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#fede75', color: 'black', padding: '0.4rem' }}>{value}</div>
                    );
                }
                if (value == 'Completed' || value == 'Complete' || value === 'Blue') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#779FEC', color: 'white', padding: '0.4rem' }}>{value}</div>
                    );
                }
                if (value == 'Delayed' || value == 'High' || value == 'High Risk' || value === 'Red' || value === 'Cancelled') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#f58082', color: 'white', padding: '0.4rem' }}>{value}</div>
                    );
                }
                if (value == 'On Track' || value == 'Low' || value === 'Green' || value == 'Active') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#58b973', color: 'white', padding: '0.4rem' }}>{value}</div>
                    );
                }
                if (value == 'Not Initiated' || value === 'Grey' || value === 'Blank') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: 'rgb(151, 151, 151)', color: 'white', padding: '0.4rem' }}>{value}</div>
                    );
                } else {
                    return (
                        <div className='roundBtn'>{option.label}</div>
                    );
                }
            }
        }
    } catch (error) {
        let errorMsg = {
            Source: 'Template Component-StatusTemplate',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
};

export const ProgramDataTemplate = (value, props) => {
    try {
        if (value) {
            if (value == 'At Risk' || value == 'Medium') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#fede75', color: 'black', 'userSelect': 'text' }}>{value}</div>
                );
            } else if (value == 'Completed' || value == 'Complete') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#779FEC', color: 'white', 'userSelect': 'text' }}>{value}</div>
                );
            } else if (value == 'Delayed' || value == 'High' || value == 'High Risk') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#f58082', color: 'white', 'userSelect': 'text' }}>{value}</div>
                );
            } else if (value == 'On Track' || value == 'Low') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#58b973', color: 'white', 'userSelect': 'text' }}>{value}</div>
                );
            } else if (value == 'Not Initiated') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: 'rgb(151, 151, 151)', color: 'white', 'userSelect': 'text' }}>{value}</div>
                );
            } else {
                return (value);
            }
        } else {
            return (<span>{props.placeholder}</span>)
        }
    } catch (error) {
        let errorMsg = {
            Source: 'Template Component-StatusTemplate',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
};

export const T5Template = (option) => {
    try {
        if (option.value == 'Yes') {
            return (
                <i className='pi pi-circle-fill' style={{ color: '#58b973' }}></i>
            );
        }
        else if (option.value == 'No') {
            return (
                <i className='pi pi-circle-fill' style={{}}></i>
            );
        } else return <></>;

    } catch (error) {
        let errorMsg = {
            Source: 'TemplaetComponent-snapshotGridT5Template',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
};

export const TrendTemplate = (option, props) => {
    try {
        if (option) {
            if (typeof (option.value) != 'boolean') {
                let Val = option.value?.includes('->') ? option.value?.split('->')?.[1] : option.value;
                if (Val == 'Improving') {
                    return (
                        <><i className='pi pi-arrow-up' style={{ color: 'green', fontWeight: 'bold', fontSize: '1.4rem' }}></i><span style={{ userSelect: 'text' }} className='trendText'>{Val}</span></>
                    );
                }
                if (Val == 'Worsening') {
                    return (
                        <><i className='pi pi-arrow-down' style={{ color: 'red', fontWeight: 'bold', fontSize: '1.4rem' }}></i><span style={{ userSelect: 'text' }} className='trendText'>{Val}</span></>
                    );
                }
                if (Val == 'No Change') {
                    return (
                        <> <i className='pi pi-arrows-h' style={{ fontWeight: 'bold', fontSize: '1.8rem' }}></i><span style={{ userSelect: 'text' }} className='trendText'>{Val}</span></>
                    );
                } else {
                    return (
                        <>
                            <span style={{ userSelect: 'text' }} className='trendText'>
                                {option.value}
                            </span>
                        </>
                    );
                }
            }
        } else {
            return (<span>{props.placeholder}</span>)
        }
    } catch (error) {
        let errorMsg = {
            Source: 'Template Component-trendTemplate',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
};

export function CalculateCellValueTemplate(e, option) {
    try {
        if (typeof (e?.[option]) != 'boolean') {
            if (e?.[option]?.includes('->'))
                return e?.[option]?.split('->')?.[1];
            else
                return e[option];
        }

        else
            return e[option];

    } catch (error) {
        let errorMsg = {
            Source: 'Template Component-CalculateCellValueTemplate',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
}

export const DropdownCellTemplate = (option) => {
    try {
        if (option.value) {
            if (typeof option != 'boolean') {
                if (option?.value?.includes('->'))
                    return (<>{option.value?.split('->')?.[1]}</>);
                else
                    return (<>{option.value}</>);
            }
        } else return <>{''}</>;

    } catch (error) {
        let errorMsg = {
            Source: 'Template Component-DropdownCellTemplate',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addItemsToList_NPL_Digital_Apps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }

};

export const DeepDiveTemplate = (option) => {
    return (
        <div style={{ width: '100%', textAlign: 'center' }}>
            <span>
                {option.value ? 'X' : ''}
            </span>
        </div>
    );
};

export const DeepDiveTemplateCheckBox = (option) => {
    if (option.value) {
        return (<Checkbox checked={true} disabled={true}></Checkbox>);
    }
    else {
        return (<Checkbox disabled={true}></Checkbox>);
    }
}

export function RiskTemplate(props) {
    return (<></>);
}

const statusValues = [{ key: 'On Track', id: 'Green', color: '#58b973' },
{ key: 'Low', id: 'Green', color: '#58b973' },
{ key: 'At Risk', id: 'Yellow', color: '#fede75' },
{ key: 'Medium', id: 'Yellow', color: '#fede75' },
{ key: 'Delayed', id: 'Red', color: '#f58082' },
{ key: 'High Risk', id: 'Red', color: '#f58082' },
{ key: 'Complete', id: 'Blue', color: '#779fec' },
{ key: 'Not Initiated', id: 'Grey', color: '#979797' }];

export const statusCol = (option) => {
    let statusVal = option && statusValues.filter(x => x.id === option.value) || null;
    if (statusVal?.length > 0) {
        return (<div style={{
            borderRadius: '24px', backgroundColor: statusVal[0].color, color: 'white',
            textAlign: 'center', width: '112px', height: '28px', padding: '0.4rem'
        }}>
            {statusVal[0].key}
        </div>)
    }
    return <></>;
};
