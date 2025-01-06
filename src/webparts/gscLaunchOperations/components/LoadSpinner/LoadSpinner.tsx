import * as React from 'react';
import "./LoadSpinner.css";
import { ILoadSpinnerProps } from './ILoadSpinnerProps';
import { IStackStyles, Overlay, Spinner, SpinnerSize, IStackItemStyles, ISpinnerStyles, Stack } from 'office-ui-fabric-react';

export default class LoadSpinner extends React.Component<ILoadSpinnerProps, {}> {

    constructor(props: ILoadSpinnerProps, public state: any) {
        super(props);
    }

    private stackStyles: IStackStyles = {
        root: {
            height: "90vh"
        }
    };
    private stackItemStyles: IStackItemStyles = {
        root: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
        }
    };
    private spinnerStyles: ISpinnerStyles = {
        circle: {
            width: "4rem",
            height: "4rem",
            borderWidth: "0.5rem",
            borderTopColor: "#080c8a",
            borderBottomColor: "#080c8a",
            borderRightColor: "#7083d0",
            borderLeftColor: "#7083d0"

        },
        root: {
            width: 200,
        }
    };

    public render(): React.ReactElement<ILoadSpinnerProps> {
        return (
            <>
                {
                    this.props.isVisible ?
                        <Overlay style={{ zIndex: 9999 }}>
                            <Stack horizontal={false} styles={this.stackStyles}>
                                <Stack.Item grow verticalFill={true} styles={this.stackItemStyles}>
                                    {/* <div className="dot-flashing"
                                        ></div> */}
                                    {/* <ProgressSpinner className="custom-spinner"/> */}
                                    {/* style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" */}
                                    <Spinner styles={this.spinnerStyles} 
                                        label={this.props.label ? this.props.label : "Loading..."} labelPosition="bottom"
                                        size={SpinnerSize.large}></Spinner>
                                </Stack.Item>
                            </Stack >
                        </Overlay >
                        : ""
                }
            </>
        );
    }
}