export interface IProgramDataProps {
    programData: any;
    onChange: (fieldName: any, fieldValue: any) => void;
    uniqueLaunchLeads: [];
    riskTrendOptions: {}[];
    launchreadinessOptions: string[];
    supplyContinuityOptions: string[];
    mode: "View" | "Edit";
    fileDataRef: any;
    DRdetails: any;
    formFields: any;
    PfizerCode: string;
}