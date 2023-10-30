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

export interface Issue {
    id: number;
    department: string;
    description: string;
    headline: string;
    actual: string;
    expected: string;
    tried: string;
    timeStamp: string;
    userId: number;
    machineId: number;
}

export type Machine = {
    id: number;
    name: string;
    userid: number;
}
