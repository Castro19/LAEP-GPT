type colors = "#FEFD9A" | "#FCD09E" | "#DCFDD2" | "#F5F5DC";
export interface UnitCounts {
    total: number;
    major: number;
    support: number;
    ge: number;
    other: number;
}
export interface Course {
    id: string | null;
    color: colors;
    displayName?: string;
    desc?: string;
    units?: string;
    customId?: string;
    customUnits?: string;
    customDesc?: string;
    customDisplayName?: string;
    completed?: boolean;
}
export interface SidebarInfo {
    [key: string]: CourseSubject[];
}
export interface CourseSidebar {
    courseId: string;
    displayName: string;
    units: string;
    desc: string;
}
export interface CourseSubject {
    subject: string;
    courses: CourseSidebar[];
}
export interface CourseSearch {
    courseId: string;
    catalog: string;
    displayName: string;
    units: string;
    desc: string;
    addl: string;
    gwrCourse: boolean;
    uscpCourse: boolean;
}
export interface CourseCatalog {
    [key: string]: CourseSearch[];
}
export interface Term {
    tIndex: number;
    tUnits: string;
    courses: Course[];
}
export interface CatalogOption {
    startingYear: string;
    catalog: string;
    major: string;
    concentration: string;
}
export interface FlowchartData {
    id: string;
    ownerId: string;
    name: string;
    programId: string[];
    startYear: string;
    unitTotal: string;
    notes: string;
    termData: Term[];
    version: number;
    hash: string;
    publishedId: string | null;
    importedId: string | null;
    lastUpdatedUTC: string;
}
export interface PostFlowchartInDB {
    flowchartData: FlowchartData;
    name: string;
    primaryOption?: boolean;
}
export interface CreateFlowchartResponse {
    flowchartId: string;
    name: string;
    primaryOption?: boolean;
}
export interface FetchFlowchartResponse {
    flowchartId: string;
    name: string;
    primaryOption?: boolean;
}
export interface ConcentrationInfo {
    majorName: string;
    concName: string;
    code: string;
}
export {};
