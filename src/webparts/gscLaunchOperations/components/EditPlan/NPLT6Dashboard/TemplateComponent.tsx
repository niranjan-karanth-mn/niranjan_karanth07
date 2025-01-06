import * as React from 'react';
//import { LaunchXService } from '../Shared/DataService';
import { DataService } from '../../Shared/DataService';
//import './MileStoneData.css';

//let utilService = new LaunchXService('');


export const StatusTemplate = (option) => {
    try {
        if (option) {
            if (typeof option != 'boolean') {
            let value = option.value?.indexOf('->') != -1 ? option.value?.split('->')?.[1] : option.value;
            if (value == 'At Risk') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#fede75', color: 'black' }}>{value}</div>
                );
            }
            if (value == 'Completed' || value == 'Complete') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#779FEC', color: 'white' }}>{value}</div>
                );
            }
            if (value == 'Delayed') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#f58082', color: 'white' }}>{value}</div>
                );
            }
            if (value == 'On Track') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: '#58b973', color: 'white' }}>{value}</div>
                );
            } else if (value == 'Not Initiated') {
                return (
                    <div className='roundBtn' style={{ backgroundColor: 'rgb(151, 151, 151)', color: 'white' }}>{value}</div>
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
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
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
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
};


export const TrendTemplate = (option) => {
    try {
        if (option) {
            if (typeof (option.value) != 'boolean') {
            let Val = option.value?.indexOf('->')!=-1 ? option.value?.split('->')?.[1] : option.value;
            if (Val == 'Improving') {
                return (
                    <><i className='pi pi-arrow-up' style={{ color: 'green', fontWeight: 'bold', fontSize: '1.4rem' }}></i><span className='trendText'>{Val}</span></>
                );
            }
            if (Val == 'Worsening') {
                return (
                    <><i className='pi pi-arrow-down' style={{ color: 'red', fontWeight: 'bold', fontSize: '1.4rem' }}></i><span className='trendText'>{Val}</span></>
                );
            }
            if (Val == 'No Change') {
                return (
                    <> <i className='pi pi-arrows-h' style={{ fontWeight: 'bold', fontSize: '1.8rem' }}></i><span className='trendText'>{Val}</span></>
                );
            } else {
                return (
                    <> <span className='trendText'>{option.value}</span></>
                );
            }
        }
        }
    } catch (error) {
        let errorMsg = {
            Source: 'Template Component-trendTemplate: '+option.value,
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
};

export function CalculateCellValueTemplate(e, option) {
    try {
        if (typeof (e?.[option]) != 'boolean') {
            if (e?.[option]?.indexOf('->') !=-1)
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
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }
}

export const DropdownCellTemplate = (option) => {
    try {
        if (option.value) {
            if (typeof option != 'boolean') {
            if (option?.value?.indexOf('->')!=-1)
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
        DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
            console.error(error);
        });
    }

};



export function RiskTemplate(props) {
    return (<></>);
}