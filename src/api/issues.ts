import axios from "axios";
import {Issue, Message} from "../models";
import { useEffect, useState } from "react";
import { RequestConfig, SERVER_URL } from "./auth";

export function useIssues(machineId: number = null) {
    const [issues, setIssues] = useState<Array<Issue>>([]);
    useEffect(() => {
        const url = new URL(SERVER_URL + "/api/issues");

        if (machineId !== null) {
            url.searchParams.set("machineId", machineId.toString());
        }

        axios.get(url.toString(), RequestConfig())
            .then(response => {
                setIssues(response.data);
            });
    }, [machineId]);
    return issues;
}

export function useIssue(issueId: number) {
    const [issue, setIssue] = useState<Issue>(null);
    useEffect(() => {
        axios.get(SERVER_URL + `/api/issues/${issueId}`, RequestConfig())
            .then(response => {
                setIssue(response.data);
            });
    }, [issueId]);
    return issue;
}

export function useIssueMessages(issueId: number) {
    const [messages, setMessages] = useState<Array<Message>>([]);
    useEffect(() => {
        axios.get(SERVER_URL + `/api/issues/${issueId}/messages`, RequestConfig())
            .then(response => {
                setMessages(response.data);
            });
    }, [issueId]);
    return messages;
}

export function newIssue(username: string, password: string) {
    return axios.post(SERVER_URL + "/api/users", {
        username: username,
        password: password
    }, RequestConfig())
}