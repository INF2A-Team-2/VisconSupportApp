import axios from "axios"
import {useCallback, useEffect, useState} from "react";
import {Log} from "../models.ts";
import {RequestConfig, SERVER_URL} from "./auth.ts";


export function useLogs() {
    const [logs , setLogs] = useState<Array<Log>>([]);

    const fetchData = useCallback(() => {
        const url = new URL(SERVER_URL + "/api/logs");

        axios.get(url.toString(), RequestConfig())
            .then(response => {
                setLogs(response.data);
            });
    },[]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {logs, setLogs, refreshLogs: fetchData};
}