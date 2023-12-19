import axios from "axios";
import { Unit } from "../models"; 
import { useCallback, useEffect, useState } from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useUnits() {
    const [units, setUnits] = useState<Array<Unit>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + "/api/units", RequestConfig())
            .then(response => {
                setUnits(response.data);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { units, setUnits, refreshUnits: fetchData };
}

export function useUnit({ unitId } : {
    unitId: number
}) {
    const [unit, setUnit] = useState<Unit>(null);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + `/api/units/${unitId}`, RequestConfig())
            .then(response => {
                setUnit(response.data);
            });
    }, [unitId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { unit, setUnit, refreshUnit: fetchData };
}

export function createUnit({ name, description }: {
    name: string,
    description: string
}) {
    return axios.post(SERVER_URL + `/api/units`, { name, description }, RequestConfig());
}

export function editUnit({ unitId, name, description }: {
    unitId: number,
    name: string,
    description: string
}) {
    return axios.put(SERVER_URL + `/api/units/${unitId}`, { name, description }, RequestConfig());
}

export function deleteUnit({ unitId }: {
    unitId: number
}) {
    return axios.delete(SERVER_URL + `/api/units/${unitId}`, RequestConfig());
}
