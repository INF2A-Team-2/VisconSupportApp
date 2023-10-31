import {useEffect, useState} from "react";
import {User} from "../models.ts";
import axios from "axios";
import {RequestConfig, SERVER_URL} from "./auth.ts";

export function useUsers() {
    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        axios.get(SERVER_URL + "/api/users", RequestConfig())
            .then(response => {
                setUsers(response.data);
            });
    }, []);

    return users
}

export function useUser(userId: number) {
    const [user, setUser] = useState<Array<User>>(null);

    useEffect(() => {
        axios.get(SERVER_URL + `/api/users/${userId}`, RequestConfig())
            .then(response => {
                setUser(response.data);
            });
    }, [userId]);

    return user
}

export function newUser(username: string, password: string) {
    return axios.post(SERVER_URL + "/api/users", {
        username: username,
        password: password
    }, RequestConfig())
}

export function deleteUser(userId: number) {
    return axios.delete(SERVER_URL + `/api/users/${userId}`, RequestConfig())
}

export function editUser(userId: number, data) {
    return axios.put(SERVER_URL + `/api/users/${userId}`, data, RequestConfig())
}