import * as React from 'react';
import { IDataRepoProps } from './IDataRepoProps';
import { Row, Col } from 'reactstrap';
import { FieldControls } from '../../../../../utils/FieldControls';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default class DataRepository extends React.Component<IDataRepoProps>
{
    public render(): React.ReactElement<IDataRepoProps> {
        return (
            <div className='container proj-data-container'>
                <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                    <AccordionTab header='NPL Data Repository (Read only)'>
                        {this.props.DRdetails &&
                            <Row className='section-background'>
                                <Row>
                                    {
                                        this.props.formFields.map((fieldItem, index) => {
                                            if (fieldItem.TabName === 'DataRepository') {
                                                return (
                                                    <Col md={fieldItem.ColWidth} className='' style={{ padding: ".5rem" }}>

                                                        <label>{fieldItem.Title}{fieldItem.isRequired && <span className='asteriskCls'>*</span>}
                                                            {fieldItem.FieldType === 'Date' &&
                                                                <span className='dateFormatLabel'>MMM-DD-YYYY</span>
                                                            }</label>

                                                        {FieldControls.getFieldControls(fieldItem.InternalName, fieldItem.FieldType,
                                                            this.props.DRdetails[fieldItem.InternalName], [this.props.DRdetails[fieldItem.InternalName]], true, null)}
                                                    </Col>
                                                );
                                            }
                                        })
                                    }
                                </Row>
                            </Row>}
                    </AccordionTab>
                </Accordion>
            </div>
        )
    }
}

export class DataRepositoryLeftAccordion extends React.Component<IDataRepoProps>
{
    public render(): React.ReactElement<IDataRepoProps> {
        return (
            <div className='proj-data-container'>
                <Accordion multiple activeIndex={[0, 1, 2]} style={{ marginBottom: '1%', marginTop: '-2%' }}  >
                    <AccordionTab header='NPL Data Repository (Read only)'>
                        {this.props.DRdetails &&
                            this.props.formFields.map((fieldItem, index) => {
                                if (fieldItem.TabName === 'DataRepositoryLeftAccordion') {
                                    return (
                                        <Col style={{ padding: ".5rem" }}>

                                            <label>{fieldItem.Title}{fieldItem.isRequired && <span className='asteriskCls'>*</span>}
                                                {fieldItem.FieldType === 'Date' &&
                                                    <span className='dateFormatLabel'>MMM-DD-YYYY</span>
                                                }</label>

                                            {FieldControls.getFieldControls(fieldItem.InternalName, fieldItem.FieldType,
                                                this.props.DRdetails[fieldItem.InternalName], [this.props.DRdetails[fieldItem.InternalName]], true, null)}
                                        </Col>
                                    );
                                }
                            })
                        }
                    </AccordionTab>
                </Accordion>
            </div>
        )
    }
}