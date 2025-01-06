import * as React from 'react';
import { ILayout } from "./ILayout";
import { Row } from 'reactstrap';
import './Layout.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

export default class Layout extends React.Component<ILayout, any>{
    constructor(public props: ILayout, public state: any) {
        super(props);

        this.state = {
          
        };
    }
    public render(): React.ReactElement<ILayout> {            
        return (
            <React.Fragment>
              
                <Row className='headerForOtherPages' style={{ marginLeft: '0px' }}>
                    {/* <Col xs="7" sm="7" lg="7" md="7">

                    </Col>
                    <Col xs="5" sm="5" lg="5" md="5" className="linkName totallayout">
                        <a data-interception="off" target="_blank" rel="noopener noreferrer" >
                            <span style={{ cursor: "pointer", marginLeft: "100px", paddingRight: "14px" }}>iPort Site</span>
                        </a>
                        <a data-interception="off" target="_blank" rel="noopener noreferrer" className="showBorder">
                            <span style={{ cursor: "pointer" }}>Feedback</span>
                        </a>
                    </Col> */}
                </Row>                            
            </React.Fragment >
        );
    }
}