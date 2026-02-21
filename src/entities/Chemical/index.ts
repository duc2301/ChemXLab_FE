export interface Chemical {
    id: string;
    formula: string;
    commonName: string | null;
    iupacName: string | null;
    stateAtRoomTemp: string | null; 
    structure3dUrl: string | null;
    molecularData: any | null; 
    isPublic: boolean;
    createdBy?: string | null;
}