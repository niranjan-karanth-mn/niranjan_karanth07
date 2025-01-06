import * as React from 'react';
import { IFooter } from './IFooter';

import './Footer.css';

let PfizerImg: any = require('../../../../../src/webparts/assets/images/Pfizer-Logo-Blue-RGB.png');

export default class Footer extends React.Component<IFooter, {}>
{
    public constructor(props: any, public state: any) {
        super(props);
        this.state = {
            currentYear: null

        };
    }

    public componentDidMount = () => {
        let CurrentYear = new Date().getFullYear();
        this.setState({
            CurrentYear: CurrentYear
        });
    }


    public render(): React.ReactElement<IFooter> {

        return (
            <>
                <div className="footerSecondRow">
                    <span style={{ margin: "0.5%" }}>
                        <img className="footerLogo" src={PfizerImg} />
                    </span>
                    <span className="copyRight">
                        {this.state.CurrentYear} - Pfizer Inc. All rights reserved
                    </span>
                </div>

            </>
        );
    }
}