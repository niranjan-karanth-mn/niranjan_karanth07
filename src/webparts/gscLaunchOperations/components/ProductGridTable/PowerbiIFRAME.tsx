import * as React from "react";
// import { DataService } from "../Shared/DataService";

export default function PowerbiIFRAME(): JSX.Element {
    return (
        <iframe
            title="New Products Dashboard"
            width="100%"
            height="700px"
            // src={DataService.PowerBIIframeUrl + "&navContentPaneEnabled=false"}
            allowFullScreen={true}
        />
    );
}
