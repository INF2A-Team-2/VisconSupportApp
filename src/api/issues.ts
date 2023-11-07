import axios from "axios";
import {Attachment, Issue, Message} from "../models";
import {useCallback, useEffect, useState} from "react";
import { RequestConfig, SERVER_URL } from "./auth";

// GET /api/issues
export function useIssues({ machineId, userId } : {
    machineId?: number,
    userId?: number
} = {}) {
    const [issues, setIssues] = useState<Array<Issue>>([]);

    const fetchData = useCallback(() => {
        const url = new URL(SERVER_URL + "/api/issues");

        if (machineId !== undefined) {
            url.searchParams.set("machineId", machineId.toString());
        }

        if (userId !== undefined) {
            url.searchParams.set("userId", userId.toString());
        }

        axios.get(url.toString(), RequestConfig())
            .then(response => {
                setIssues(response.data);
            });
    }, [machineId, userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {issues, setIssues, refreshIssues: fetchData};
}

// GET /api/issues/{issueId}
export function useIssue({ issueId } : {
    issueId: number
}) {
    const [issue, setIssue] = useState<Issue>(null);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + `/api/issues/${issueId}`, RequestConfig())
            .then(response => {
                setIssue(response.data);
            });
    }, [issueId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {issue, setIssue, refreshIssue: fetchData};
}

// POST /api/issues
export function newIssue(data: {
    actual: string,
    expected: string,
    tried: string,
    headline: string,
    machineId: number,
    attachments: Array<string>
}) {
    return axios.post(SERVER_URL + "/api/issues", data, RequestConfig());
}

// GET /api/issues/{issueId}/messages
export function useIssueMessages({ issueId } : {
    issueId: number
}) {
    const [messages, setMessages] = useState<Array<Message>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + `/api/issues/${issueId}/messages`, RequestConfig())
            .then(response => {
                setMessages(response.data);
            });
    }, [issueId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {messages, setMessages, refreshMessages: fetchData};
}

// POST /api/issues/{issueId}/messages
export async function newIssueMessage({ issueId, message } : {
    issueId: number,
    message: string
}) {
    return axios.post(SERVER_URL + `/api/issues/${issueId}/messages`, { body: message }, RequestConfig());
}

// GET /api/issues/{issueId}/attachments
export function useIssueAttachments({ issueId } : {
    issueId: number
}) {
    const [attachments, setAttachments] = useState<Array<Attachment>>([]);

    const fetchData = useCallback(() => {
        axios.get(SERVER_URL + `/api/issues/${issueId}/attachments`, RequestConfig())
            .then(response => {
                setAttachments(response.data);
            });
    }, [issueId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {attachments, setAttachments, refreshAttachments: fetchData};
}