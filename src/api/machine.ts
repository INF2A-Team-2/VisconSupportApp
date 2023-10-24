import axios from "axios";
import {Issue, Machine} from "../models";
import { useEffect, useState } from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useMachines() {
    const [machines, setMachines] = useState<Array<Machine>>([]);
    useEffect(() => {
        axios.get(SERVER_URL + "/api/machines", RequestConfig())
            .then(response => {
                setMachines(response.data);
            });
    });
    return machines;
}

export async function getUserIssues(machineId: number) {
    const token = sessionStorage.getItem("token");
    if (token === null) {
        return;
    }

    const res = await axios.get<Issue[]>("http://localhost:5099/api/user/issues", {
        params: {
            machineId: machineId
        },
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return res.data;
}

