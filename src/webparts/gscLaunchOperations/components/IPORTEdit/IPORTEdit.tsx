import * as React from 'react';
//import { DataService } from '../Shared/DataService';
import 'office-ui-fabric-react/dist/css/fabric.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
//import { Dialog } from 'primereact/dialog';
import IIPORTEditProps from './IIPORTEditProps';
import { Dialog } from 'office-ui-fabric-react';
//import '../IPORTEdit/IPORTEdit.css'

// import { Message } from 'primereact/message';

export default class IPORTEdit extends React.Component<IIPORTEditProps>
{
    public constructor(props: IIPORTEditProps) {
        super(props);
        console.log("IPORTEdit", this.props);
    }
    public render(): React.ReactElement {
        // let projectNameWithDRID = "PlaniswareID: "
        // let dialogHeaderPostfix = "";
        // if (DataService.environment === "DEV") {
        //     dialogHeaderPostfix = "  -- DEV"
        // } else if (DataService.environment === "QA") {
        //     dialogHeaderPostfix = "  -- DEMO"
        // }
        return (
            <React.Fragment >
                {/* <LoadSpinner isVisible={this.state.isLoading} label='Please wait...' /> */}
                {/* <Toast ref={(el) => { this.toast = el }} position="bottom-right" /> */}
                {/* <Dialog
                   
                    header="Head"
                    closable={false}
                    // visible={this.state.showDialog}
                    style={{ height: '99vh', width: '99vw' }}
                    // icons={this.saveCloseDialogIcons}
                    onHide={() => console.log("onhide")}>
                    <div className="container-fluid" style={{ minHeight: '99%', padding: '0%', backgroundColor: 'white', position: 'relative' }}>
                        <div className="recordStatusOuterContainer">
                            <div style={{ display: 'contents', width: '-webkit-fill-available', justifyContent: 'end', marginRight: '0.5%' }}>
                                
                            </div>
                        </div>
                       
                    </div>
                </Dialog> */}
                <Dialog>
                <div className="container-fluid" style={{ minHeight: '99%', padding: '0%', backgroundColor: 'white', position: 'relative' }}>
                        <div className="recordStatusOuterContainer">
                            <div style={{ display: 'contents', width: '-webkit-fill-available', justifyContent: 'end', marginRight: '0.5%' }}>
                                Hiii
                            </div>
                        </div>
                       
                    </div>
                </Dialog>



            </React.Fragment >
        );
    }



}