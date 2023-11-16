export enum AccountType {
    User,
    HelpDesk,
    Admin
}

export interface User {
    id: number;
    username: string;
    type: AccountType;
    phoneNumber: string;
    unit: string;
}

export type Machine = {
    id: number;
    name: string;
}

export type Issue = {
    id : number;
    headline : string;
    actual : string;
    expected: string;
    tried: string;
    timeStamp: string;
    userId: number;
    machineId: number;
}

export type Message = {
    id: number;
    name: string;
    body: string;
    timestamp: string;
    userID: number;
}

export type Attachment = {
    id: number,
    mimeType: string,
    data: string,
    issueId: number
}

export type Media = {
    data?: ArrayBuffer,
    mimeType: string
};
