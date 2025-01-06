import * as React from 'react';
import { IHeaderProps } from './IHeaderProps';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Header.css';
import { Button } from 'primereact/button';

import PfizerLogoImg from '../../../../../src/webparts/assets/images/Pfizer-Logo-Blue-RGB.png';
import home from '../../../../../src/webparts/assets/images/home.png';
import { DataService } from  '../Shared/DataService';

export default class Header extends React.Component<IHeaderProps, {}>
{
    public constructor(props: any, public state: any) {
        super(props);
        this.state = {
            displayName: this.props.currentUser?.Title,
            CurrentUserImgUrl: null,
            AdminUser: false,
            AdminMenuItems: [],
            feedbackUrl: null,
            highlightNotification: false
        };
    }

    public render() {
        return (
            <>
                <Row className='header' style={{ marginLeft: '0px', marginBottom: '-5px', display: 'inline-flex' }} >
                    <Col xs="6" sm="6" lg="6" md="6">
                        <Link to="/Home">
                            <img src={PfizerLogoImg} alt="Pfizer" className="logoClass" />
                        </Link>
                        {/* <Link to="/Home">
                            <img src={home} style={{ 'fontSize': '1.5em', height: "34px", paddingLeft: '1.5rem', borderLeft: '1px solid #707070', marginLeft: "1rem", marginTop: "-0.2rem" }} />
                        </Link> */}
                        <img src={home} onClick={() => window.open(DataService.NPL_Url)} style={{ 'fontSize': '1.5em', height: "34px", paddingLeft: '1.5rem', borderLeft: '1px solid #707070', marginLeft: "1rem", marginTop: "-0.2rem", cursor:'pointer' }} />
                        <span className='siteHeading'>{this.props.headerText}</span>
                    </Col>

                    <Col xs="6" sm="6" lg="6" md="6" style={{ float: 'right' }}>
                        <span className='user-info-container'>
                            <div style={{ float: 'right' }}>
                                <span className='u-info-inner-container'>
                                    <a style={{ margin: '0px' }} data-interception="off" target="_blank" rel="noopener noreferrer">
                                        <Button title='<< Back to DR' className='p-button-rounded p-button-raised feedbackBtn' label='<< Back to DR' onClick={() => window.open(DataService.NPL_Url)}/>
                                    </a>
                                    {/* <a style={{ margin: '0px' }} data-interception="off" target="_blank" rel="noopener noreferrer">
                                        <Button title='GLOW Dashboard' className='p-button-rounded p-button-raised feedbackBtn' label='GLOW Dashboard' onClick={() => window.open(DataService.NPLDashboardUrl)} />
                                    </a>
                                    <a style={{ margin: '0px' }} data-interception="off" target="_blank" rel="noopener noreferrer">
                                        <Button title='Report an Issue' className='p-button-rounded p-button-raised feedbackBtn' label='Report an Issue' onClick={() => window.open('https://digitalondemand.pfizer.com/en/getsupport?appId=10669')} />
                                    </a> */}
                                    <img
                                        className="rounded-circle ml-2 whiteShadow cardBoxshadow adminImg"
                                        src={this.props.siteUrl + `/_layouts/15/userphoto.aspx?size=L&username=${this.props.currentUser.Email}`}
                                    />
                                    <span className="adminName"
                                    > {this.state.displayName}</span>
                                </span>
                            </div>
                        </span>
                    </Col>
                </Row>
            </>
        );
    }
}