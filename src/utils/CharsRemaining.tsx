import * as React from 'react';
import './CharsRemaining.css';

export default function CharsRemaining({ count, value }) {

    return (
        <>
            <span style={{ float: 'right' }} className='charsRemText'>
                Characters Remaining: {count - Number(value == null || value == undefined ? 0 : value?.length)
                }</span>
        </>
    );
}