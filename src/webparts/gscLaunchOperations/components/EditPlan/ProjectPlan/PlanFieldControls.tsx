import * as React from 'react';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
//import { DataService } from  './DataService';
//import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
//import { Checkbox } from 'primereact/checkbox';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

export abstract class PlanFieldControls {

    public static panelFooterTemplate(option) {
        const selectedItems = option?.value;
        const length = selectedItems ? selectedItems.length : 0;
        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length > 1 ? 's' : ''} selected.
            </div>
        );
    }
    static selectedTemplate(option) {

        if (option) {
            return (
                <div className="test" style={{padding: "0.25rem 0.5rem", borderRadius :'3px', display :'inline-flex', marginRight : '.5rem'}}>
                    <div>{option.display}</div>
                </div>
            );
        }
        return "";
    }

    static getOptionLabel=(fieldName)=>{
        //optionLabel={fieldName == 'LabelNames' ? 'value' : 'key'}
        let optionalLabrlVal = 'key';
        if(fieldName == "LabelNames"){
            optionalLabrlVal = 'value';
        }
        // if(fieldName == 'ParentPlans'){
        //     optionalLabrlVal = '';
        // }
        return optionalLabrlVal;
    }

    public static getFieldControls = (fieldName: string, fieldType, fieldValue, dropDownOptions,
        isDisabled, handleChange, openLabelDialog?,sourceColor?) => {
            //console.log("fielddata", fieldName + "-" + fieldValue + "-" + dropDownOptions)
        switch (fieldType) {
            case 'Text': return (
                <InputText
                    value={fieldValue}
                    // style={applyDefaultStyle ? {} : { borderLeft: `5px solid ${colorCode}`, borderRadius: '6px' }}
                    //style={{ borderRadius: '6px' }}
                    style={!sourceColor ? {} : { borderLeft: `6px solid ${sourceColor}`, borderRadius: '6px' }}
                    disabled={isDisabled}
                    className='inputTextCntrl'
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                // onChange={async e => await updateInputValue(internalName, e.currentTarget.value)}
                // onBlur={e => UpdateOnBlur(internalName)}
                />
            );
                break;
            case 'Date': return (
                <Calendar
                    className='dateCntrl'
                    monthNavigator={true}
                    yearNavigator
                    yearRange='1980:2090'
                    showIcon={true}
                    dateFormat="M-dd-yy"
                    value={fieldValue ? new Date(fieldValue) : null}
                    disabled={isDisabled}
                    // style={applyDefaultStyle ? {} : { borderLeft: `5px solid ${colorCode}`, borderRadius: '6px' }}
                    style={!sourceColor ? {} : { borderLeft: `6px solid ${sourceColor}`, borderRadius: '6px' }}
                    onChange={e => handleChange(fieldName, e.target.value)} 
                />
            );
                break;
            case 'DropDown':
                if(fieldName==='LabelNames' && !isDisabled){
                    return (
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Dropdown
                            className={fieldName+'-button'}
                            value={fieldValue}
                            placeholder='Select'
                            appendTo='self'
                            disabled={isDisabled}
                            options={dropDownOptions}
                            //optionLabel={fieldName == 'LabelNames' ? 'value' : 'key'}
                            optionLabel={this.getOptionLabel(fieldName)}
                            optionValue={'value'}
                            // style={applyDefaultStyle ? {} : { borderLeft: `5px solid ${colorCode}`, borderRadius: '6px !important' }}
                            style={!sourceColor ? {} : { borderLeft: `6px solid ${sourceColor}`, borderRadius: '6px', width:'85% !important' }}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                        />
                        <Button iconPos='left' icon={'pi pi-plus'} label='ADD NEW LABEL' onClick={openLabelDialog}></Button>
                        </div>
                    );
                }else{
                    return (
                        <Dropdown
                            className={fieldName}
                            value={fieldValue}
                            placeholder='Select'
                            appendTo='self'
                            disabled={isDisabled}
                            options={dropDownOptions}
                            //optionLabel={fieldName == 'LabelNames' ? 'value' : 'key'}
                            optionLabel={this.getOptionLabel(fieldName)}
                            optionValue={'value'}
                            // style={applyDefaultStyle ? {} : { borderLeft: `5px solid ${colorCode}`, borderRadius: '6px !important' }}
                            style={!sourceColor ? {} : { borderLeft: `6px solid ${sourceColor}`, borderRadius: '6px' }}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                        />
                    );
                }
                break;
            case 'Number': return (
                <InputNumber
                    value={fieldValue}
                    disabled={isDisabled}
                // disabled={mode == 'Create' ? false : mode == 'View' ? true : integratedSystem == 'ReadOnly' ? FormState['IsOSIntegrated'] : false}
                // onValueChange={e => updateInputValue(internalName, e.target.value)} 
                />
            );
                break;
            case 'MultiLineText': return (
                <InputTextarea
                    // className={mode == 'Create' ? '' : mode == 'View' ? 'readOnlyTextArea' : integratedSystem == 'ReadOnly' ? FormState['IsOSIntegrated'] : ''}
                    maxLength={200}
                    value={fieldValue}
                    disabled={isDisabled}
                    // readOnly={mode == 'Create' ? false : mode == 'View' ? true : integratedSystem == 'ReadOnly' ? FormState['IsOSIntegrated'] : false}
                    rows={1}
                    // onChange={e => updateInputValue(internalName, e.currentTarget.value)
                    // onChange={handleChange}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                />
            );
                break;
            case 'PeoplePicker': {

                // return (
                //     <PeoplePicker
                //         context={DataService.currentSpContext as any}
                //         principalTypes={[PrincipalType.User]}
                //         ensureUser={true}
                //         defaultSelectedUsers={fieldValue?.split(";")}
                //         disabled={isDisabled}
                //     // onChange={ppl => {
                //     //     updatePeoplePickerValue(internalName, ppl);
                //     // }}
                //     />
                // );
            }
                break;
                // case 'Checkbox' :  return (
                //     <Checkbox inputId="ingredient1" name="DDSelection" className="DeepDiveSelection" value={fieldValue}
                //     checked={fieldValue}
                //     onChange={(e)=> handleChange(fieldName, e.target.checked)}
                //     disabled={isDisabled}
                //     style={(isDisabled ? {visibility: "visible"} : { visibility: "visible" })}
                // />
                // );
                //break;
                case 'MultiSelect': return (
                    <>
                    <MultiSelect value={fieldValue} options={dropDownOptions}
                     onChange={(e) => handleChange(fieldName, e.target.value)} 
                     optionLabel="display" placeholder= {fieldName}
                     filter className="multiselect-custom"
                     display="chip"
                     disabled={isDisabled} resetFilterOnHide={true}
                     style={{width : '100%', display : 'flex'}}
                     //selectedItemTemplate={this.selectedTemplate} 
                     panelFooterTemplate={this.panelFooterTemplate} 
                     />
                     </>
                );
                    break;
            default: return (<>Invalid Input</>);
                break;
        }
    }

}


