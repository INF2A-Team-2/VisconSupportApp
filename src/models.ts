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
    userid: number;
}

export type Issue ={
    id : number;
    department : string;
    headline : string;
    description : string;
}