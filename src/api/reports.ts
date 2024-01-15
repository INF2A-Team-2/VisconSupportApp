import axios from "axios";
import { RequestConfig, SERVER_URL } from "./auth";
import { useCallback, useEffect, useState } from "react";
import { Report } from "../models";
import { useNavigate } from "react-router-dom";

// GET /api/reports
export function useReports() {
    const [reports, setReports] = useState<Array<Report>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + "/api/reports", RequestConfig())
            .then(response => {
                setReports(response.data);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { reports, setReports, refreshReports: fetchData };
}


// GET /api/reports/{id}
export function useReport({ id }: {
    id: number
}) {
    const [report, setReport] = useState<Report | null>(null);
    const navigate = useNavigate();

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + `/api/reports/${id}`, RequestConfig())
            .then(response => {
                setReport(response.data);
            }).catch(() => {navigate("/404");});
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { report, setReport, refreshReport: fetchData };
}