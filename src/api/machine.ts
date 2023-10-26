import axios from "axios";
import {Issue, Machine} from "../models";
import { useEffect, useState } from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useMachines() {
    const [machines, setMachines] = useState<Array<Machine>>([]);
    useEffect(() => {
        if (machines.length != 0) {
            return
        }
        axios.get(SERVER_URL + "/api/machines", RequestConfig())
            .then(response => {
                setMachines(response.data);
            });
    });
    return machines;
}
