import * as React from 'react';
import { IHome } from "./IHome";
import { Row, Col } from 'reactstrap';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';

import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import dashboardImg from '../../../assets/images/DashboardIMG1.jpg';
import arrowImg from '../../../assets/images/arrow.png';
import { DataService } from '../Shared/DataService';

export default class Home extends React.Component<IHome, any>{
    constructor(public props: IHome, public state: any) {
        super(props);

        this.state = {
            AccelrationDropdownList: [],
            AcceleratedCount: 0,
            StagedCount: 0,
            LightspeedCount: 0,
            ContinuousCount: 0,
            TotalCount: 0,
            LightSpeedImg: '',
            ReportImg: '',
            ReportUri: '',
            LaunchXUri: '',
            CoDevUri: '',
            LMCodevUri: '',
            SMCoDevUri: '',
            BSCURL: '',
            ProductPagesUri: '',
            ReportImgTitle: '',
            LightSpeedImgTitle: '',
            homePageDescription: ''
        };
    }

    public async componentDidMount() {
        if (DataService.environment === "DEV") {
            this.props.headerText('Commercial/GOLD Projects');
        } else if (DataService.environment === "QA") {
            this.props.headerText('Commercial/GOLD Projects - DEMO');
        } else {
            this.props.headerText('Commercial/GOLD Projects');
        }
        document.title = 'Home';
        let IsAdmin = this.state.IsAdmin;
        if (this.props.userGroups.includes("group1") || this.props.userGroups.includes("group2") || this.props.userGroups.includes("group3")) {
            IsAdmin = true;
        }
        this.setState({
            IsAdmin: IsAdmin,
        });
    }

    public render(): React.ReactElement<IHome> {
        let siteTitle;
        if (DataService.environment === "DEV") {
            siteTitle = 'Commercial/GOLD Projects'
        } else if (DataService.environment === "QA") {
            siteTitle = 'Commercial/GOLD Projects - DEMO'
        } else {
            siteTitle = 'Commercial/GOLD Projects'
        }

        const header1 = (
            <Link to='/Product'>
                <img style={{ width: "100%" }} src={dashboardImg} />
                <div style={{ display: "flex", justifyContent: 'space-between', padding: '0px 5px' }}>
                    <Link to='/Product'>
                        {/* <span className="links"><b>{siteTitle}</b></span> */}
                        <span className="links"><b> Commercial/GOLD Projects</b></span>
                    </Link>
                    <img alt="Card" style={{ width: "20px", height: "18px", marginTop: "3%" }} src={arrowImg} />
                </div>
            </Link>
        )

        return (
            <React.Fragment>
                <div className='HomeStyle'>
                    <Row className='header2'>
                        <Col xs="6" sm="6" lg="6" md="6" className='home-title'>
                            <span style={{ fontSize: "38px", fontWeight: '600', color: '#FFFFFF', }}>Welcome to {siteTitle}</span><br />
                        </Col>
                        <Col xs="3" sm="3" lg="3" md="3">
                            <Card style={{ marginTop: "4%", }} header={header1} />
                        </Col>
                    </Row>
                </div>
            </React.Fragment >
        );
    }
}