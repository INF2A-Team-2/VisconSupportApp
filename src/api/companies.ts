import {useCallback, useEffect, useState} from "react";
import {Company} from "../models.ts";
import axios from "axios";
import {RequestConfig, SERVER_URL} from "./auth.ts";

export function useCompanies() {
    const [companies, setCompanies] = useState<Array<Company>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + "/api/companies", RequestConfig())
            .then(response => {
                setCompanies(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error.response?.data || error.message);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { companies, setCompanies, refreshCompanies: fetchData };
}

export function useCompany({ companyId } : { companyId: number }) {
    const [company, setCompany] = useState<Company>(null);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + `/api/companies/${companyId}`, RequestConfig())
            .then(response => {
                setCompany(response.data);
            })
            .catch(error => {
                console.error(`Error fetching user with ID ${companyId}:`, error.response?.data || error.message);
            });
    }, [companyId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { company, setCompany, refreshCompany: fetchData };
}

export function newCompany({ name, latitude, longitude, phonenumber } : {
    name: string,
    latitude: number,
    longitude: number,
    phonenumber: string
}) {
    return axios.post(SERVER_URL + "/api/companies", {
        name: name,
        latitude: latitude,
        longitude: longitude,
        phonenumber: phonenumber
    }, RequestConfig());
}

export function deleteCompany({ companyId } : {
    companyId: number
}) {
    return axios.delete(SERVER_URL + `/api/companies/${companyId}`, RequestConfig());
}

export function editCompany({ companyId, data} : {
    companyId: number,
    data: {
        name: string;
        latitude: number;
        longitude: number;
        phonenumber: string;
    }
}) {
    return axios.put(SERVER_URL + `/api/companies/${companyId}`, data, RequestConfig());
}