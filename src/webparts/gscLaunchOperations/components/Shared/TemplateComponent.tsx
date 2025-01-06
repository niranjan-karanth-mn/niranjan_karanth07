import * as React from 'react';
import { DataService } from './DataService';

export const StatusTemplate = (option) => {
    try {
        if (option) {
            if (typeof option !== 'boolean') {
                let value = option.value?.includes('->') ? option.value?.split('->')?.[1] : option.value;
                if (value === 'At Risk' || value === 'Medium' || value === 'Yellow' || value === 'Planned') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#fede75', color: 'black' }}>{value}</div>
                    );
                }
                if (value === 'Completed' || value === 'Complete' || value === 'Blue') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#779FEC', color: 'white' }}>{value}</div>
                    );
                }
                if (value === 'Delayed' || value === 'High Risk' || value === 'Red' || value === 'Cancelled') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#f58082', color: 'white' }}>{value}</div>
                    );
                }
                if (value === 'On Track' || value === 'Low' || value === 'Green' || value == 'Active') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: '#58b973', color: 'white' }}>{value}</div>
                    );
                } else if (value === 'Not Initiated' || value === 'Grey' || value === 'Blank') {
                    return (
                        <div className='roundBtn' style={{ backgroundColor: 'rgb(151, 151, 151)', color: 'white' }}>{value}</div>
                    );
                } else {
                    return (
                        <div className='roundBtn'>{value}</div>
                    );
                }
            }
        }
    } catch (error) {
        const errorMsg = {
            Source: 'Template Component-StatusTemplate',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addDatatoList('Errors_Logs', errorMsg).catch(error=>console.log(error))
    }
};

export const TrendTemplate = (option) => {
    try {
        if (option) {
            if (typeof (option.value) !== 'boolean') {
                let Val = option.value?.includes('->') ? option.value?.split('->')?.[1] : option.value;
                if (Val === 'Improving') {
                    return (
                        <><i className='pi pi-arrow-up' style={{ color: 'green', fontWeight: 'bold', fontSize: '1.4rem' }}></i><span className='trendText'>{Val}</span></>
                    );
                }
                if (Val === 'Worsening') {
                    return (
                        <><i className='pi pi-arrow-down' style={{ color: 'red', fontWeight: 'bold', fontSize: '1.4rem' }}></i><span className='trendText'>{Val}</span></>
                    );
                }
                if (Val === 'No Change') {
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
        const errorMsg = {
            Source: 'Template Component-trendTemplate',
            Message: error.message,
            StackTrace: new Error().stack
        };
        DataService.addDatatoList('Errors_Logs', errorMsg).catch(error=>console.log(error))
    }
};
