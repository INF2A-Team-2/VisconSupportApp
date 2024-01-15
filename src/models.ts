export enum AccountType {
    User,
    HelpDesk,
    Admin
}

export enum Priority {
    Low,
    Medium,
    High,
    Critical
}

export enum Status {
    Open,
    InProgress,
    Archived
}

export interface User {
    id: number;
    username: string;
    type: AccountType;
    phoneNumber: string;
    unitId: number;
    companyId: number;
    email: string;
}

export interface Unit {
    id: number;
    name: string;
    description: string;
}

export interface Company {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    phoneNumber : string
}

export type Machine = {
    id: number;
    name: string;
}

export type Issue = {
    id : number;
    priority: Priority;
    status: Status;
    headline : string;
    actual : string;
    expected: string;
    tried: string;
    phoneNumber: string;
    timeStamp: string;
    userId: number;
    machineId: number;
}

export type Message = {
    id: number;
    name: string;
    body: string;
    timeStamp: string;
    userId: number;
    issueId: number;
}

export type Attachment = {
    id: number,
    name?: string,
    mimeType: string,
    issueId: number,
    url?: string
}

export type Media = {
    name?: string,
    data?: ArrayBuffer,
    mimeType: string
}

export type Log = {
    id: number,
    timeStamp: Date,
    authorId: number,
    description: string,
    issueId?: number,
    userId?: number,
    machineId?: number,
    messageId?: number,
    attachmentId?: number
};

export enum FieldType {
    Text,
    Password,
    Number,
    Float,
    Selection,
    TextArea,
    Files,
    Slider,
    Markdown,
    Checkbox,
}

export type Field = {
    name: string,
    key: string,
    type: FieldType,
    required: boolean,
    options?: Array<{
        value: string,
        label: string
    }>,
    sliderValues?: Array<string>,
    isNumber?: boolean
}

export type Report = {
    id: number,
    title: string,
    body: string,
    public: boolean,
    machineId: number,
    companyId: number,
    timeStamp: string,
}
