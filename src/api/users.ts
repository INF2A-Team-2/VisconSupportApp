import {useCallback, useEffect, useState} from "react";
import {AccountType, User} from "../models.ts";
import axios from "axios";
import {RequestConfig, SERVER_URL} from "./auth.ts";

export function useUsers() {
    const [users, setUsers] = useState<Array<User>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + "/api/users", RequestConfig())
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error.response?.data || error.message);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { users, setUsers, refreshUsers: fetchData };
}

export function useUser({ userId } : { userId: number }) {
    const [user, setUser] = useState<User>(null);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + `/api/users/${userId}`, RequestConfig())
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error(`Error fetching user with ID ${userId}:`, error.response?.data || error.message);
            });
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { user, setUser, refreshUser: fetchData };
}

export function newUser({ username, password, type, unitId, companyId, email } : {
    username: string,
    password: string,
    type: AccountType,
    unitId?: Number,
    companyId?: number;
    email: string;
}) {
    return axios.post(SERVER_URL + "/api/users", {
        username: username,
        password: password,
        type: type,
        unitId: unitId,
        companyId: companyId,
        email: email
    }, RequestConfig());
}

export function deleteUser({ userId } : {
    userId: number
}) {
    return axios.delete(SERVER_URL + `/api/users/${userId}`, RequestConfig());
}

export function editUser({ userId, data } : {
    userId: number,
    data: {
        username?: string,
        password?: string,
        type: AccountType,
        unitId?: number,
        companyId?: number;
        email?: string;
    }
}) {
    console.log(data);
    return axios.put(SERVER_URL + `/api/users/${userId}`, data, RequestConfig());
}