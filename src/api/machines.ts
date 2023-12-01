import axios from "axios";
import { Machine } from "../models";
import {useCallback, useEffect, useState} from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useMachines() {
    const [machines, setMachines] = useState<Array<Machine>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL +  "/api/machines", RequestConfig())
            .then(response => {
                setMachines(response.data);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {machines, setMachines, refreshMachines: fetchData};
}

export function useMachine({ machineId } : {
    machineId: number
}){
    const [machine, setMachine] = useState<Machine>(null);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL +  `/api/machines/${machineId}`, RequestConfig())
            .then(response => {
                setMachine(response.data);
            });
    }, [machineId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {machine, setMachine, refreshMachine: fetchData};
}

export function useUserMachines({ userId } : {
    userId?: number
} = {}) {
    const [machines, setMachines] = useState<Array<Machine>>([]);

    const fetchData = useCallback(() => {
        if (userId === undefined) {
            return;
        }

        axios.get(SERVER_URL + `/api/users/${userId}/machines`, RequestConfig())
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
    data: Array<number>
}) {
    return axios.put(SERVER_URL + `/api/users/${userId}/machines`, data, RequestConfig());
}

export function createMachine({userId, name}:{
    userId : number,
    name : string
}) {
return axios.post(SERVER_URL + `/api/machines`,  {userId : userId ,name: name}, RequestConfig());
}