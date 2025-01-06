import * as React from 'react';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { DataService } from '../webparts/gscLaunchOperations/components/Shared/DataService';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Checkbox } from 'primereact/checkbox';
import { MultiSelect } from 'primereact/multiselect';
import { ProgramDataTemplate, TrendTemplate } from '../webparts/gscLaunchOperations/components/EditPlan/ProductForm/TemplateComponent';

export abstract class FieldControls {

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
                <div className="test" style={{ padding: "0.25rem 0.5rem", borderRadius: '3px', display: 'inline-flex', marginRight: '.5rem' }}>
                    <div>{option}</div>
                </div>
            );
        }
        return "";
    }

    public static navigateToLink = (fieldValue, fieldName) => {
        if (fieldName === "DRID") {
            const devPostFixUrl = '/SitePages/CreateDR.aspx?mode=View&ProjectID=' + fieldValue
            const qaPostFixUrl = '/SitePages/CreateDRProd.aspx?mode=View&ProjectID=' + fieldValue
            const prodPostFixUrl = '/SitePages/CreateDRProd.aspx?mode=View&ProjectID=' + fieldValue
            const prefixUrl = DataService.NPL_Url;
            const postfixUrl = DataService.environment === "DEV" ?
                devPostFixUrl : DataService.environment === "QA" ?
                    qaPostFixUrl : prodPostFixUrl
            window.open(prefixUrl + postfixUrl)
        }
        else if (fieldName === "PlaniswareID") {
            const postfixUrl = `?pfizercode=${fieldValue}#/Product`
            window.open(DataService.NPDUrl + postfixUrl)
        }
    }

public static getFieldControls = (fieldName: string, fieldType, fieldValue, dropDownOptions,
        isDisabled: boolean, handleChange, isKeyValue = false, sourceColor = null, HalfGreenHalfGrey = false) => {
        switch (fieldType) {
            case 'Link': return (
                <div
                    onClick={() => this.navigateToLink(fieldValue, fieldName)}
                    style={{ cursor: 'pointer !important', color: 'blue', textDecoration: 'underline' }}
                    aria-disabled
                    className="p-inputtext p-component p-filled inputTextCntrl">
                    <a target="_blank">
                        {fieldValue}
                    </a>
                </div>
            );
                break;
            case 'Text': if (!isDisabled) {
                return (
                    <InputText
                        value={fieldValue}
                        style={!sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }}
                        disabled={isDisabled}
                        className='inputTextCntrl'
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                    />
                )
            }
            else {
                let styleObj1 = null
                let styleObj3 = null
                if (HalfGreenHalfGrey) {
                    styleObj3 = { boxShadow: `-4px 0 0 0 #03A503` }
                    styleObj1 = !sourceColor ? {} : { borderLeft: `4px solid #A9A9A9`, borderRadius: '6px' }
                }
                else {
                    styleObj1 = !sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }
                }
 
                let styleObj2 = { display: 'block', height: 'auto', minHeight: '2.5rem', 'user-select': 'text' }
                let styleObjInd = { display: 'block', height: 'auto', minHeight: '7rem', 'user-select': 'text' }
                if(fieldName=="Indication"){
                    return (
                        <span
                            className="p-inputtextarea p-inputtext p-component p-disabled p-filled"
                            style={{ ...styleObj1, ...styleObjInd, ...styleObj3 }}>
                            {fieldValue}
                        </span>
                    )
 
                }
                else{
                    return (
                        <span
                            className="p-inputtextarea p-inputtext p-component p-disabled p-filled"
                            style={{ ...styleObj1, ...styleObj2, ...styleObj3 }}>
                            {fieldValue}
                        </span>
                    )
 
                }
               
            }
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
                    style={!sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }}
                />
            );
                break;
            case 'DropDown':
                if (isKeyValue) {
                    return (
                        <Dropdown
                            className={fieldName}
                            value={fieldValue}
                            placeholder='Select'
                            appendTo='self'
                            disabled={isDisabled}
                            options={dropDownOptions}
                            optionLabel={'key'}
                            optionValue={'value'}
                            style={!sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            showClear
                        />)
                }
                else {
                    if (!isDisabled) {
                        return (
                            <Dropdown
                                className={fieldName}
                                value={fieldValue}
                                placeholder='Select'
                                appendTo='self'
                                disabled={isDisabled}
                                options={dropDownOptions}
                                style={!sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }}
                                onChange={(e) => handleChange(fieldName, e.target.value)}
                                valueTemplate={fieldName === "RiskTrend" ? TrendTemplate : ProgramDataTemplate}
                                itemTemplate={fieldName === "RiskTrend" ? TrendTemplate : ProgramDataTemplate}
                                showClear
                            />
                        )
                    } else {
                        let styleObj1 = !sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }
                        let styleObj2 = { display: 'block', height: 'auto', minHeight: '2.5rem', 'user-select': 'text' }
                        return (
                            <div
                                className="p-inputtextarea p-inputtext p-component p-disabled p-filled"
                                style={{ ...styleObj1, ...styleObj2 }}>
                                {fieldName === "RiskTrend" ?
                                    TrendTemplate({ value: fieldValue }, { value: fieldValue }) :
                                    ProgramDataTemplate(fieldValue, fieldValue)}
                            </div>
                        )
                    }
                }
                break;
            case 'Number': return (
                <InputNumber
                    value={fieldValue}
                    disabled={isDisabled}
                />
            );
                break;
            case 'MultiLineText': if (!isDisabled) {
                return (
                    <InputTextarea
                        maxLength={100}
                        value={fieldValue}
                        disabled={isDisabled}
                        rows={1}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                    />
                )
            }
            else {
                let styleObj1 = !sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }
                let styleObj2 = { display: 'block', height: 'auto', minHeight: '2.8rem', 'user-select': 'text' }
                return (
                    <span
                        className="p-inputtextarea p-inputtext p-component p-disabled p-filled"
                        style={{ ...styleObj1, ...styleObj2 }}>
                        {fieldValue}
                    </span>
                )
            }
                break;
            case 'PeoplePicker': {
                if (typeof (fieldValue) === "object" && fieldValue != null) {
                    return (
                        <div
                            style={!sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }}>
                            <PeoplePicker
                                context={DataService.currentSpContext as any}
                                principalTypes={[PrincipalType.User]}
                                ensureUser={true}
                                defaultSelectedUsers={fieldValue &&
                                    [`${fieldValue?.Title}/${fieldValue?.Title}`]}
                                disabled={isDisabled}
                            />
                        </div>
                    )
                } else {
                    return (
                        <div
                            style={!sourceColor ? {} : { borderLeft: `8px solid ${sourceColor}`, borderRadius: '6px' }}>
                            <PeoplePicker
                                context={DataService.currentSpContext as any}
                                principalTypes={[PrincipalType.User]}
                                ensureUser={true}
                                defaultSelectedUsers={fieldValue?.split(";")
                                    .map(item => { return `${item}/${item}` })}
                                disabled={isDisabled}
                                onChange={ppl => {
                                    if (ppl.length > 0) {
                                        handleChange(fieldName + "Id", ppl[0].id)
                                    }
                                    else {
                                        handleChange(fieldName + "Id", null)
                                    }
                                }}
                            />
                        </div>
                    )
                }
            }
                break;
            case 'Checkbox': return (
                <div>
                    <Checkbox
                        inputId="ingredient1"
                        name="DDSelection"
                        className="DeepDiveSelection"
                        value={fieldValue}
                        checked={fieldValue}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        disabled={isDisabled}
                        style={(isDisabled ? { visibility: "visible" } : { visibility: "visible" })}
                    />
                </div>
            );
                break;
            case 'MultiSelect': return (
                <>
                    <MultiSelect value={fieldValue} options={dropDownOptions}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        optionLabel="display" placeholder={fieldName}
                        filter className="multiselect-custom"
                        disabled={isDisabled}
                        style={{ width: '100%', display: 'flex' }}
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
