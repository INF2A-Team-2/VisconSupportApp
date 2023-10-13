import axios from "axios";
import {Issue, Machine} from "../models";

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
