import * as React from 'react';
import { IDataRepoTabProps } from './IDataRepoProps';
import { Row, Col } from 'reactstrap';
import { FieldControls } from '../../../../../utils/FieldControls';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataService } from '../../Shared/DataService';

export default function DataRepositoryTab(props: IDataRepoTabProps) {
    let legendsColor = {}
    let lstFieldsConfig = []

    const [legendsColorState, setLegendsColorState] = React.useState(null)

    const calculateLegendsColor = (sourceName = "DEFAULT", fixedColor) => {
        if (legendsColorState == null) {
            return fixedColor
        } else {
            switch (legendsColorState[sourceName]) {
                case 'DRlegend':
                    return '#A9A9A9'
                    break;
                case 'EAHlegend':
                    return '#03A503'
                    break;
                case 'IPORTlegend':
                    return '#604998'
                    break;
                case 'HalfGreenHalfGrey':
                    return 'HGHG'
                    break;
                default:
                    return fixedColor
                    break;
            }
        }
    }

    const fieldControlGet = (fieldItem: any, sectionName: "DataRepositoryTab-ProjectData" | "DataRepositoryTab-DataVerification") => {
        if (fieldItem.FieldType == 'Checkbox' &&
            sectionName == "DataRepositoryTab-DataVerification") {
            return (
                <Col
                    md={fieldItem.ColWidth}
                    className=''
                    style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        padding: "2.5rem 2rem .5rem 10rem",
                        justifyContent: "flex-end",
                    }}>
                    <i className='pi pi-stop'
                        style={!fieldItem.sourceColor ? {} :
                            {
                                background: fieldItem.sourceColor,
                                height: '1rem',
                                marginTop: '.3rem',
                                color: fieldItem.sourceColor
                            }}></i>
                    <label style={!fieldItem.sourceColor ? {} : { paddingLeft: '1rem' }}>
                        {fieldItem.Title}{fieldItem.isRequired && <span className='asteriskCls'>*</span>}
                    </label>
                    {FieldControls.getFieldControls(fieldItem.InternalName,
                        fieldItem.FieldType,
                        props.DRdetails[fieldItem.InternalName],
                        [props.DRdetails[fieldItem.InternalName]],
                        true,
                        null,
                        false,
                        fieldItem.sourceColor)}
                </Col>                
            )
        } else if((sectionName == "DataRepositoryTab-ProjectData")&&(fieldItem.Title=="Operation Unit")){
            let legendsColorVal = calculateLegendsColor(fieldItem.InternalName, fieldItem.sourceColor);
            let businessUnitField = props.formFields.filter(fieldItem=>fieldItem.Title=="Business Unit")[0];
                return (<Col md={fieldItem.ColWidth} className='' style={{ padding: ".5rem 2rem" }}>
                        <label>{fieldItem.Title}{fieldItem.isRequired &&
                            <span className='asteriskCls'>*</span>}
                            {fieldItem.FieldType === 'Date' &&
                                <span className='dateFormatLabel'>MMM-DD-YYYY</span>
                            }
                        </label>
                        {FieldControls.getFieldControls(fieldItem.InternalName,
                            fieldItem.FieldType,
                            props.DRdetails[fieldItem.InternalName],
                            [props.DRdetails[fieldItem.InternalName]],
                            true,
                            null,
                            false,
                            legendsColorVal,
                            legendsColorVal === "HGHG")}
                    <label style={{marginTop:"2px"}}>{businessUnitField.Title}{businessUnitField.isRequired &&
                        <span className='asteriskCls'>*</span>}
                        {businessUnitField.FieldType === 'Date' &&
                            <span className='dateFormatLabel'>MMM-DD-YYYY</span>
                        }
                    </label>
                    {FieldControls.getFieldControls(businessUnitField.InternalName,
                        businessUnitField.FieldType,
                        props.DRdetails[businessUnitField.InternalName],
                        [props.DRdetails[businessUnitField.InternalName]],
                        true,
                        null,
                        false,
                        legendsColorVal,
                        legendsColorVal === "HGHG")}
                </Col>)
        } 
        // else if((sectionName == "DataRepositoryTab-ProjectData")&&(fieldItem.Title=="Indication")){
        //     let legendsColorVal = calculateLegendsColor(fieldItem.InternalName, fieldItem.sourceColor);
        //     console.log("fieldItem.InternalName", fieldItem)
        //         return (<Col md={fieldItem.ColWidth} className='' style={{ padding: ".5rem 2rem" }}>
        //                 <label>{fieldItem.Title}{fieldItem.isRequired &&
        //                     <span className='asteriskCls'>*</span>}
        //                     {fieldItem.FieldType === 'Date' &&
        //                         <span className='dateFormatLabel'>MMM-DD-YYYY</span>
        //                     }
        //                 </label>
        //                 {FieldControls.getFieldControls(fieldItem.InternalName,
        //                     fieldItem.FieldType,
        //                     props.DRdetails[fieldItem.InternalName],
        //                     [props.DRdetails[fieldItem.InternalName]],
        //                     true,
        //                     null,
        //                     false,
        //                     legendsColorVal,
        //                     legendsColorVal === "HGHG")}
        //         </Col>)
        // } 
        else {
            if (fieldItem.TabName === sectionName) {
                let legendsColorVal = calculateLegendsColor(fieldItem.InternalName, fieldItem.sourceColor);
                return (
                    <Col md={fieldItem.ColWidth} className='' style={{ padding: ".5rem 2rem" }}>
                        <label>{fieldItem.Title}{fieldItem.isRequired &&
                            <span className='asteriskCls'>*</span>}
                            {fieldItem.FieldType === 'Date' &&
                                <span className='dateFormatLabel'>MMM-DD-YYYY</span>
                            }
                        </label>
                        {FieldControls.getFieldControls(fieldItem.InternalName,
                            fieldItem.FieldType,
                            props.DRdetails[fieldItem.InternalName],
                            [props.DRdetails[fieldItem.InternalName]],
                            true,
                            null,
                            false,
                            legendsColorVal,
                            legendsColorVal === "HGHG")}
                    </Col>
                );
            }
        }
    }

    const getFieldsConfigSettings = async () => {
        await fetch(DataService.NPL_Url + `/_api/web/lists/GetByTitle('IntegrationConfigTable')` +
            `/Items?$select=Section,SourceSystem,FieldName/ColumnKeyValue` +
            `&$filter=(Section%20eq%20%27Project%20Data%27%20and%20Update%20eq%201)` +
            `&$expand=FieldName&$top=4999`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(async data => await data.json())
            .then(async (data) => {
                let fieldValues = [];
                await data.value.map((item, key) => {
                    if (item.FieldName.ColumnKeyValue != null && item.FieldName.ColumnKeyValue.length > 3) {
                        fieldValues.push({ Field: (item.FieldName.ColumnKeyValue).split('>')[1], Source: item.SourceSystem });
                    }
                });
                lstFieldsConfig = fieldValues
            });
    }

    const checkMultiLabelMasterList = async (GRPkey: string, businessUnit: string, subBU: string) => {
        let legendToReturn: {} = { TradeName: 'DRLegend' }

        businessUnit = businessUnit.split('->')[0]
        subBU = subBU.split('->')[0]

        const result = await DataService.fetchAllItemsGenericFilter('MultiLabelMaster',
            `ID,LabelKey,LabelText,GRPCode,Active,BusinessUnit,SubBusinessUnit`,
            `Active eq 1 and GRPCode eq '${GRPkey}'`, null)
        for (let i = 0; i < result.length; i++) {
            if (props.DRdetails.TradeName === result[i].LabelKey + '->' + result[i].LabelText) {
                legendToReturn = { TradeName: 'HalfGreenHalfGrey' }
                break;
            }
        }

        for (let i = 0; i < result.length; i++) {
            if (businessUnit === result[i].BusinessUnit && subBU === result[i].SubBusinessUnit) {
                legendToReturn = {
                    ...legendToReturn,
                    BusinessUnit: 'EAHlegend',
                    SubBusinessUnit: 'EAHlegend',
                }
                break;
            }
        }
        return legendToReturn;
    }

    const getIPORTLegends = async (DRID: string): Promise<{}> => {

        let projDetailsListIport = "";
        if (DataService.environment === "DEV" || DataService.environment === "QA") {
            projDetailsListIport = "ProjectDetailsList_Iport";
        }
        else if (DataService.environment === "PROD") {
            projDetailsListIport = "ProjectDetailsList_Iport_Prod";
        }

        const result = await DataService.fetchAllItemsGenericFilter(projDetailsListIport,
            `ID`,
            `DRID eq '${DRID}' and IsActive eq 1`, null)

        if (result && result.length > 0) {
            return {
                PlaniswareID: 'IPORTlegend',
                ProjectType: 'IPORTlegend',
                ProjectSubType: 'IPORTlegend',
                PhaseStatus: 'IPORTlegend',
                DroppedDate: 'IPORTlegend',
                POCApproved: 'IPORTlegend',
                DroppedReason: 'IPORTlegend',
            }
        } else {
            return {
                PlaniswareID: 'DRlegend',
                ProjectType: 'DRlegend',
                ProjectSubType: 'DRlegend',
                PhaseStatus: 'DRlegend',
                DroppedDate: 'DRlegend',
                POCApproved: 'DRlegend',
                DroppedReason: 'DRlegend',
            }
        }
    }

    const getGRPLegends = async (GRPKey: string): Promise<{}> => {
        let legendToReturn = 'DRLegend'
        const result = await DataService.fetchAllItemsGenericFilter('LoVMaster',
            `ID,Key,Value`,
            `Key eq '${GRPKey}' and SourceType eq 'ProposedGRP'`, null)

        for (let i = 0; i < result.length; i++) {
            if (props.DRdetails.ProposedGRP0 === result[i].Key + '->' + result[i].Value) {
                legendToReturn = 'HalfGreenHalfGrey'
                break;
            }
        }
        return {
            ProposedGRP0: legendToReturn
        };
    }

    const updateLegendsBasedonGRP = () => {
        let GRPkey = 'ZZZZ';
        let Grpval = props.DRdetails.ProposedGRP0 + "";
        if (Grpval != null && Grpval.indexOf("->") > 0) {
            GRPkey = Grpval.toString().split("->")[0];
        }

        let GRPRecordUrl = DataService.NPL_Url +
            `/_api/web/lists/GetByTitle('ProjectAndAttribute_Interface')/Items?$Select` +
            `=ProjectID,ProjectTitle,MoleculeName,TradeName,OtherAlias,ProjectNotes,Indication,` +
            `RnDProjNo,ProposedGRP0,BusinessUnit,OperationalUnit,BrandGroup,RecordStatus,ProjectNotes,` +
            `ProductIntro,PfizerConnectID,PlaniswareID,GlobalBrandAPI,DosageCategory,DosageForm,` +
            `TherapeuticArea,IntegrationFlag,MPG,MPGDesc&$filter=substringof('` + encodeURIComponent(GRPkey) + `',` +
            `ProposedGRP0)&$top=1`;

        fetch(GRPRecordUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(data => data.json())
            .then(async data => {
                if (data && data.value.length > 0) {
                    let primaryLabelValue;
                    let labelValueFromDR;

                    data.value.map(async (item, key) => {
                        let arrayFieldItem = null;
                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "LabelName"; });
                        if (arrayFieldItem != null) {
                            primaryLabelValue = item.TradeName;
                            labelValueFromDR = props.DRdetails.TradeName;

                            legendsColor =
                                await checkMultiLabelMasterList(GRPkey, props.DRdetails.BU, props.DRdetails.SBUnit)

                            if (primaryLabelValue == labelValueFromDR) {
                                legendsColor['TradeName'] = 'EAHlegend'
                            }
                        }

                        // let IPORT_relatedLegends = await getIPORTLegends(props.DRdetails.DRID)
                        // let GRPlegends = await getGRPLegends(GRPkey)
                        // legendsColor = { ...legendsColor, ...IPORT_relatedLegends, ...GRPlegends }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "Indication"; });
                        if (arrayFieldItem != null) {
                            legendsColor['Indication'] = (item.Indication == null || item.Indication == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "MoleculeName"; });
                        if (arrayFieldItem != null) {
                            legendsColor['MoleculeName'] = (item.MoleculeName == null || item.MoleculeName == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "RnDProjNo"; });
                        if (arrayFieldItem != null) {
                            legendsColor['RnDProjNo'] = (item.RnDProjNo == null || item.RnDProjNo == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "OtherAlias"; });
                        if (arrayFieldItem != null) {
                            legendsColor['OtherAlias'] = (item.OtherAlias == null || item.OtherAlias == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "ProjectNotes"; });
                        if (arrayFieldItem != null) {
                            legendsColor['ProjectNotes'] = (item.ProjectNotes);
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "BusinessUnit"; });
                        if (arrayFieldItem != null) {
                            legendsColor['BusinessUnit'] = (item.BusinessUnit == null || item.BusinessUnit == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "OperationalUnit"; });
                        if (arrayFieldItem != null) {
                            legendsColor['OperationalUnit'] = (item.OperationalUnit == null || item.OperationalUnit == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "BrandGroup"; });
                        if (arrayFieldItem != null) {
                            legendsColor['BrandGroup'] = (item.BrandGroup == null || item.BrandGroup == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "TherapeuticArea"; });
                        if (arrayFieldItem != null) {
                            legendsColor['TherapeuticArea'] = (item.TherapeuticArea == null || item.TherapeuticArea == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "MPG"; });
                        if (arrayFieldItem != null) {
                            legendsColor['MPG'] = (item.MPG == null || item.MPG == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "PlaniswareID"; });
                        if (arrayFieldItem != null) {
                            legendsColor['PlaniswareID'] = (item.PlaniswareID == null || item.PlaniswareID == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "GlobalBrandAPI"; });
                        if (arrayFieldItem != null) {
                            legendsColor['GlobalBrandAPI'] = (item.GlobalBrandAPI == null || item.GlobalBrandAPI == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "DosageCategory"; });
                        if (arrayFieldItem != null) {
                            legendsColor['DosageCategory'] = (item.DosageCategory == null || item.DosageCategory == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }

                        arrayFieldItem = lstFieldsConfig.find((element) => { return element.Field === "DosageForm"; });
                        if (arrayFieldItem != null) {
                            legendsColor['DosageForm'] = (item.DosageForm == null || item.DosageForm == '' ? 'DRlegend' : arrayFieldItem.Source == 'EAH' ? 'EAHlegend' : arrayFieldItem.Source == 'Esponsor' ? 'Esponsorlegend' : arrayFieldItem.Source == 'SAP ECC' ? 'SAPECClegend' : 'DRlegend');
                        }
                        // setLegendsColorState(legendsColor)
                    });Col
                }

                let IPORT_relatedLegends = await getIPORTLegends(props.DRdetails.DRID)
                let GRPlegends = await getGRPLegends(GRPkey)
                legendsColor = { ...legendsColor, ...IPORT_relatedLegends, ...GRPlegends }

                setLegendsColorState(legendsColor)

            })
            .catch((error) => {
                let errorMsg = {
                    Message: error.message,
                    StackTrace: new Error().stack
                };
                DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                    console.error(error);
                });
            })
    }

    React.useEffect(() => {
        getFieldsConfigSettings().then(() => {
            updateLegendsBasedonGRP()
        }).catch(e => console.log(e))
    }, []);

    return (
        // legendsColorState &&
        <div className='proj-data-container' >
            <div style={{ display: 'inline-flex', width: '-webkit-fill-available', justifyContent: 'end', marginLeft: '0.5%', marginRight: '0.5%' }}>
                <div style={{ marginLeft: '1%' }}>
                    <i className='pi pi-stop' style={{ background: `#a9a9a9`, color: `#a9a9a9` }}></i>
                    <span > DR</span>
                </div>
                <div style={{ marginLeft: '1%' }}>
                    <i className='pi pi-stop' style={{ background: `#03a503`, color: `#03a503` }}></i>
                    <span > EAH</span>
                </div>
                <div style={{ marginLeft: '1%' }}>
                    <i className='pi pi-stop' style={{ background: `#604998`, color: `#604998` }}></i>
                    <span > IPORT</span>
                </div>
                <div style={{ marginLeft: '1%' }}>
                    <i className='pi pi-stop' style={{ background: `#d60055`, color: `#d60055` }}></i>
                    <span > PfizerConnect</span>
                </div>
            </div>

            <Accordion multiple activeIndex={[0, 1]}
                style={{ marginBottom: '1%', marginTop: '-2%' }}>
                <AccordionTab header='Project Data (Read only)'>
                    <Row className='section-background'>
                        <Row>
                            {
                                props.formFields.filter(fieldItem=>fieldItem.Title!="Business Unit").map((fieldItem, index) => {
                                    return fieldControlGet(fieldItem, "DataRepositoryTab-ProjectData")
                                })
                            }
                        </Row>
                    </Row>
                </AccordionTab>

                <AccordionTab header='Data Verification (Read only)'>
                    <Row className='section-background'>
                        <Row>
                            {
                                props.formFields.map((fieldItem, index) => {
                                    return fieldControlGet(fieldItem, "DataRepositoryTab-DataVerification")
                                })
                            }
                        </Row>
                    </Row>
                </AccordionTab>
            </Accordion>
        </div>
    )
}