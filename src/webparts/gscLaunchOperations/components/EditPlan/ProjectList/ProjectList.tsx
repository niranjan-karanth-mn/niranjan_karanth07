import * as React from 'react';
import { IProjectListProps } from './IProjectListProps';
import { Toolbar as CustomToolbar } from 'devextreme-react/toolbar';
import { ListBox } from 'primereact/listbox';
import Drawer from 'devextreme-react/drawer';

export default class ProjectList extends React.Component<IProjectListProps, any>
{
    private modifiedRelatedPlans: any[] = this.props.relatedPlans;

    // private dynamicHeight = this.props.relatedPlans.length > 12 ?
    //     this.props.relatedPlans.length * 4 : 48;

    // private dynamicHeight = this.props.relatedPlans.length > 10 ?
    //     this.props.relatedPlans.length * 4 : 40;

    private dynamicHeight = 70;

    protected onValueChange = (e: any) => {
        if (e.value) this.props.handleChange({ selectedItem: e.value })
    }

    protected leftNavigation = () => {
        return (
            <div className="list demo-dark">
                {!this.props.projectListStates.filterOpen ? this.minimizedToolbar() : this.expandedToolbar()}
                {(this.props.projectListStates.filterOpen) ?
                    <>
                        <ListBox
                            value={this.props.projectListStates.selectedItem}
                            // options={[{ 'ProjectName': 'All' }, ...this.state.modifiedRelatedPlans]}
                            options={[{ 'ProjectName': 'All' }, ...this.modifiedRelatedPlans]}
                            optionLabel="ProjectName"
                            onChange={this.onValueChange}
                            style={{ height: '30rem' }}
                        />
                    </> : <></>}
            </div>)
    }

    protected toolbarIconExpand = [{
        widget: 'dxButton',
        location: 'after',
        options: {
            icon: 'chevronright',
            onClick: () => {
                if (this.props.NPL_modifiedProjects_Status === "MODIFIED") {
                    this.props.toastNPLModifiedProjectPlanSwitch()
                } else {
                    this.props.handleChange({ filterOpen: !this.props.projectListStates.filterOpen })
                }
            },
        }
    }];

    protected toolbarIconMinimize = [{
        widget: 'dxButton',
        location: 'after',
        options: {
            icon: 'back',
            onClick: () => {
                this.props.handleChange({ filterOpen: !this.props.projectListStates.filterOpen })
            },
        }
    }];

    protected minimizedToolbar = () => (
        <div className="col-2 rightArrow">
            <CustomToolbar
                items={this.toolbarIconExpand}
                style={{
                    transition: "width 1s",
                }}
            />
            <div className='selectText' style={{ position: 'absolute' }}>Select</div>
        </div>
    )

    protected expandedToolbar = () => (
        <div style={{
            display: "flex",
            minWidth: "20rem",
        }}>
            <CustomToolbar
                items={this.toolbarIconMinimize}
                style={{
                    width: '0%',
                }} />
            <div className='multiSelect'
                style={{
                    marginLeft: "5rem",
                    paddingTop: ".4rem",
                }}>
            </div>
        </div>
    )

    public render(): React.ReactElement<IProjectListProps> {
        return (
            <div className='ProjectList'
                style={{
                    height: this.dynamicHeight + "rem"
                }}>
                <div className='col-12 demo-light' style={{ height: "100%" }}>
                    <Drawer
                        opened={this.props.projectListStates.filterOpen}
                        openedStateMode="push"
                        position="left"
                        revealMode="expand"
                        component={this.leftNavigation}
                        closeOnOutsideClick={false}
                        minSize={40}
                    >
                        {React.Children.map(this.props.children, (child) => {
                            return child;
                        })}
                    </Drawer>
                </div>
            </div >
        )
    }
}