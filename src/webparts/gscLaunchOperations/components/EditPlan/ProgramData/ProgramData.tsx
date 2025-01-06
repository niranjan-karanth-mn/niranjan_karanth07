import * as React from 'react';
import { IProgramDataProps } from './IProgramDataProps';
import { Row, Col } from 'reactstrap';
import { FieldControls } from '../../../../../utils/FieldControls';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { DataRepositoryLeftAccordion } from '../DataRepository/DataRepo';
import CharsRemaining from '../../../../../utils/CharsRemaining';
import { Image } from 'primereact/image';
import { DataService } from '../../Shared/DataService';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Message } from 'primereact/message';

export default class ProgramData extends React.Component<IProgramDataProps, {}>
{
    private PPDataRef: any;
    private imageSrc: any;

    constructor(props) {
        super(props)
        this.PPDataRef = React.createRef();
        this.PPDataRef.current = this.props.fileDataRef;
    }

    handleChange = (fieldName: string, fieldValue: string | boolean,): void => {
        this.props.onChange(fieldName, fieldValue)
    }

    saveImgLocal = (e, _pfizerCode): void => {
        try {
            const file = e.files;
            if (_pfizerCode) this.PPDataRef.current['DDForecastImg'] = file;
            this.handleChange('forecastImageDelete', false);
        } catch (error) {
            let errorMsg = {
                Source: 'DeepDive-saveImgLocal',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    headerTemplate = (options) => {
        const { className, chooseButton } = options;

        return (
            <div className={className}
                style={{
                    backgroundColor: 'transparent',
                    display: 'inline-block',
                    alignItems: 'center',
                    width: '100%'
                }}>
                {chooseButton}
                {
                    (this.imageSrc && !this.props.programData.forecastImageDelete) ?
                        (<Button
                            icon="pi pi-times"
                            aria-label="remove image"
                            onClick={() => {
                                this.PPDataRef.current['DDForecastImg'] = [];
                                this.handleChange('forecastImageDelete', true);
                            }}
                            style={{ verticalAlign: 'top', float: 'right' }}
                            tooltip='click here to remove the image' />) : (<></>)
                }
            </div>
        );
    };

    emptyAttachmentTemplate = () => {
        try {
            this.imageSrc = null;
            if (this.PPDataRef.current.DDForecastImg?.length > 0) {
                this.imageSrc = this.PPDataRef.current.DDForecastImg[0].objectURL;
            } else if (this.props.programData?.AttachmentFiles) {
                this.imageSrc = this.props.programData?.AttachmentFiles[0]?.ServerRelativeUrl;
            }

            if (this.props.mode === "Edit" && (!!this.props.PfizerCode)) {
                return (
                    this.imageSrc && !this.props.programData.forecastImageDelete ?
                        <>
                            <div className='prodImgCntrl'>
                                <Image
                                    src={this.imageSrc}
                                    alt="Image"
                                    height='150'
                                    preview />
                            </div>
                            <Button
                                icon="pi pi-times"
                                aria-label="remove image"
                                onClick={() => {
                                    this.PPDataRef.current['DDForecastImg'] = [];
                                    this.handleChange('forecastImageDelete', true);
                                }}
                                style={{ position: 'absolute', right: 0, top: '-20%' }}
                            />
                        </> :
                        <div className="flex align-items-center flex-column">
                            <span
                                style={{
                                    'fontSize': '1.2em',
                                    display: 'block',
                                    color: 'var(--text-color-secondary)'
                                }}>Drag and Drop Image Here</span>
                        </div>
                )
            } else {
                return (
                    this.imageSrc && !this.props.programData.forecastImageDelete ?
                        <>
                            <label>Forecast Image</label>
                            <div className='prodImgCntrl' style={{ display: "inline-block" }}>
                                <Image
                                    src={this.imageSrc}
                                    alt="Image"
                                    height='150'
                                    preview />
                            </div>
                        </> :
                        <>
                            <label>Forecast Image</label>
                            <div className="flex align-items-center flex-column">
                                <span
                                    style={{
                                        'fontSize': '1.2em',
                                        display: 'block',
                                        color: 'var(--text-color-secondary)'
                                    }}>No image available</span>
                            </div>
                        </>
                )
            }
        } catch (error) {
            let errorMsg = {
                Source: 'DeepDive-emptyAttachmentTemplate',
                Message: error.message,
                StackTrace: new Error().stack
            };
            DataService.addDatatoList_NPLDigitalApps('Errors_Logs', errorMsg).catch(error => {
                console.error(error);
            });
        }
    };

    chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    public render(): React.ReactElement<IProgramDataProps> {
        return (
            <div className='proj-data-container' >
                <Row>
                    <Col md={3}>
                        <DataRepositoryLeftAccordion
                            DRdetails={this.props.DRdetails}
                            formFields={this.props.formFields} />
                    </Col>
                    <Col md={9}>
                        <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                            <AccordionTab header='NPL T6'>
                                <Row>
                                    <Col md={4}>
                                        <Col className='' style={{ padding: ".5rem" }}>
                                            <label>NPL T6 Launch Readiness</label>
                                            {FieldControls.getFieldControls("LaunchReadinessStatus",
                                                "DropDown",
                                                this.props.programData.LaunchReadinessStatus,
                                                this.props.launchreadinessOptions,
                                                (this.props.mode === "View" || !(!!this.props.PfizerCode)),
                                                this.handleChange)}
                                        </Col>
                                        <Col className='' style={{ padding: ".5rem" }}>
                                            <label>Supply Continuity Risk</label>
                                            {FieldControls.getFieldControls(
                                                "SupplyContinuityRisk",
                                                "DropDown",
                                                this.props.programData.SupplyContinuityRisk,
                                                this.props.supplyContinuityOptions,
                                                (this.props.mode === "View" || !(!!this.props.PfizerCode)),
                                                this.handleChange
                                            )}
                                        </Col>
                                        <Col style={{ padding: ".5rem" }}>
                                            <label>NP Risk Trend</label>
                                            {FieldControls.getFieldControls(
                                                "RiskTrend",
                                                "DropDown",
                                                this.props.programData.RiskTrend,
                                                this.props.riskTrendOptions,
                                                (this.props.mode === "View" || !(!!this.props.PfizerCode)),
                                                this.handleChange)}
                                        </Col>
                                        <Col className='' style={{ padding: ".5rem" }}>
                                            <label>PGS Leader</label>
                                            <PeoplePicker
                                                context={DataService.currentSpContext as any}
                                                principalTypes={[PrincipalType.User]}
                                                ensureUser={true}
                                                defaultSelectedUsers={
                                                    this.props.programData.PGSLeadersEMail ?
                                                        [this.props.programData.PGSLeadersEMail] :
                                                        [this.props.DRdetails.GLOLaunchLeadEmail]
                                                }
                                                disabled={(this.props.mode === "View" || !(!!this.props.PfizerCode))}
                                                onChange={ppl => {
                                                    console.log(ppl)
                                                    if (ppl.length > 0) {
                                                        this.handleChange("PGSLeadersId", ppl[0].id)
                                                        this.handleChange("PGSLeadersEMail", ppl[0].secondaryText)
                                                    }
                                                    else {
                                                        this.handleChange("PGSLeadersId", null)
                                                        this.handleChange("PGSLeadersEMail", "")
                                                    }
                                                }}
                                            />
                                        </Col>

                                        <Col className='' style={{ padding: ".5rem" }}>
                                            <label>Launch Leader</label>
                                            {FieldControls.getFieldControls("GLOLaunchLead",
                                                "Text",
                                                this.props.DRdetails.GLOLaunchLeadTitle,
                                                null,
                                                true,
                                                null)}
                                        </Col>
                                        <Col className='' style={{ padding: ".5rem" }}>
                                            <label>COGS % Net Price</label>
                                            {FieldControls.getFieldControls("COGSNetPrice",
                                                "Text",
                                                this.props.programData.COGSNetPrice,
                                                null,
                                                (this.props.mode === "View" || !(!!this.props.PfizerCode)),
                                                this.handleChange)}
                                        </Col>
                                    </Col>
                                    <Col md={8}>
                                        <Col className='' style={{ padding: ".5rem" }}>
                                            <label>Launch Readiness Comments</label>
                                            {FieldControls.getFieldControls("LaunchReadinessComments",
                                                "MultiLineText",
                                                this.props.programData.LaunchReadinessComments || '',
                                                null,
                                                (this.props.mode === "View" || !(!!this.props.PfizerCode)),
                                                this.handleChange)}
                                            <CharsRemaining
                                                count={100}
                                                value={this.props.programData.LaunchReadinessComments} />
                                        </Col>
                                        <Col className='' style={{ padding: ".5rem" }}>
                                            <label>Supply Continuity Risk Comments</label>
                                            {FieldControls.getFieldControls("SupplyContinuityRiskComments",
                                                "MultiLineText",
                                                this.props.programData.SupplyContinuityRiskComments || '',
                                                null,
                                                (this.props.mode === "View" || !(!!this.props.PfizerCode)),
                                                this.handleChange)}
                                            <CharsRemaining
                                                count={100}
                                                value={this.props.programData.SupplyContinuityRiskComments} />
                                        </Col>
                                        <Col className='ForecastImg'
                                            style={{ padding: "1.5rem .5rem" }}>

                                            {this.props.mode === "Edit" && (!!this.props.PfizerCode) ?
                                                <FileUpload
                                                    name='ForecastImg'
                                                    url=''
                                                    auto
                                                    accept="image/*"
                                                    chooseLabel='Add/Update Forecast Image'
                                                    emptyTemplate={this.emptyAttachmentTemplate}
                                                    onUpload={e => this.saveImgLocal(e, this.props.PfizerCode)}
                                                /> :
                                                <>
                                                    <div style={{ display: 'inline-grid' }}>
                                                        {this.emptyAttachmentTemplate()}
                                                    </div>
                                                </>}
                                        </Col>
                                    </Col>
                                </Row>
                                {(this.props.mode === "Edit" && !(!!this.props.PfizerCode)) &&
                                    <Message
                                        severity="warn"
                                        text="Note: Kindly contact to Data Steward to update the Pfizer Code in Data Repository. 
                                        NPLT6 fields will be enabled once Pfizer code is updated for the respective program." />}
                            </AccordionTab>
                        </Accordion>
                    </Col>
                </Row>
            </div >
        )
    }
}
