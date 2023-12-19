import axios from "axios";
import {SERVER_URL} from "./auth.ts";

export async function uploadMachines(file: File): Promise<boolean> {
    let fd = new FormData();
    fd.append('FormFile', file);
    try{
        const res = await axios.post(SERVER_URL + "/api/machines/import", fd, requestUploadConfig());
        if (res.status === 200) {
            return true;
        } else {
            console.log(res.data)
            return false;
        }
    }catch (e) {
        console.log(e);
        return false;
    }
}

export function requestUploadConfig(){
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    }
}
