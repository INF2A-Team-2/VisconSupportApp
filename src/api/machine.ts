import axios from "axios";
import { Machine, Issue } from "../models";
import { useEffect, useState } from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useMachines() {
    const [machines, setMachines] = useState<Array<Machine>>([]);
    let URL = SERVER_URL + "/api/machines";
    useEffect(() => {
        axios.get(URL, RequestConfig())
            .then(response => {
                setMachines(response.data);
            });
    }, [URL]);
    return machines;
}

export async function getMachines() {
    const token = sessionStorage.getItem("token");
    if (token === null) {
        return;
    }
    const res = await axios.get<Machine[]>("http://localhost:5099/api/machines", {
        headers: {
            "Authorization": `Bearer ${token}`
        }});
    return res.data
}
export async function getIssuesById( id : number) {
    const token = sessionStorage.getItem("token");
    if (token === null) {
        return;
    }
    const res = await axios.get<Issue[]>("http://localhost:5099/api/machines/issues?machineId=" + id, {
        headers: {
            "Authorization": `Bearer ${token}`
        }});
    return res.data
}

export async function getUserIssues( id : number) {
    const token = sessionStorage.getItem("token");
    if (token === null) {
        return;
    }

    // op dit moment is dit gewoon een letterlijke kopie van de api call die levi heeft gemaakt
    // ik ga met luuk kijken hoe je een api call maakt voor de issues van een persoon
    const res = await axios.get<Issue[]>("http://localhost:5099/api/issues?machineId=" + id, {
        headers: {
            "Authorization": `Bearer ${token}`
        }});
    return res.data
}
