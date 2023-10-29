import axios from "axios";
import { Machine } from "../models";
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
