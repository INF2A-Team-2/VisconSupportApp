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
}

export type Message =  {
    id: number;
    name: string;
    time: string;
    message: string;
}