import { ObjectId } from "mongodb";
export type FlowInfoDocument = {
    _id: ObjectId;
    id: string;
    catalog: string;
    majorName: string;
    concName: string;
    code: string;
    dataLink: string;
};
export type FlowInfoProjection = {
    majorName: number;
    concName: number;
    code: number;
};
