import * as React from 'react';

export default function AttachmentCellTemplate(props){
    return(
       
        <span title={props.Value}> {(props.AttachmentData?.length > 0 || props.NewAttachmentData?.length > 0) && <i style={{ color: 'blue', marginRight: '5px' }} className="pi pi-paperclip"> </i>}{props.Value}</span>
     
    );
}