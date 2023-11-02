import axios from "axios";
import { Machine } from "../models";
import {useCallback, useEffect, useState} from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useMachines({ userId } : {
    userId?: number
} = {}) {
    const [machines, setMachines] = useState<Array<Machine>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + (userId === undefined ? "/api/machines" : `/api/${userId}/machines`), RequestConfig())
            .then(response => {
                setMachines(response.data);
            });
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {machines, setMachines, refreshMachines: fetchData};
}

export function editUserMachines({ userId, data } : {
    userId: number,
    data: Array<Machine>
}) {
    return axios.put(SERVER_URL + `/api/users/${userId}/machines`, data.map(m => m.id), RequestConfig());
}