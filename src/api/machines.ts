import axios from "axios";
import {AccountType, Machine} from "../models";
import {useCallback, useEffect, useState} from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useMachines(userId: number | null = null) {
    const [machines, setMachines] = useState<Array<Machine>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + (userId === null ? "/api/machines" : `/api/${userId}/machines`), RequestConfig())
            .then(response => {
                setMachines(response.data);
            });
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {machines, setMachines, refreshMachines: fetchData};
}

export function editUserMachines(userId: number, data: Array<Machine>) {
    return axios.put(SERVER_URL + `/api/users/${userId}/machines`, data.map(m => m.id), RequestConfig());
}