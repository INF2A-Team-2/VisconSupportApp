import axios from "axios";
import { Machine } from "../models";

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
