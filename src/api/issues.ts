import axios from "axios";
import {Attachment, Issue, Media, Message, Priority} from "../models";
import {useCallback, useEffect, useState} from "react";
import { RequestConfig, SERVER_URL } from "./auth";
import {uploadAttachment} from "./socket.ts";

// GET /api/issues
export function useIssues({ machineId, userId, quantity } : {
    machineId?: number,
    userId?: number,
    quantity?: number
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

        if (quantity !== undefined) {
            url.searchParams.set("quantity", quantity.toString());
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
    priority: Priority,
    actual: string,
    expected: string,
    tried: string,
    headline: string,
    phoneNumber: string | null,
    machineId: number,
}) {
    return axios.post(SERVER_URL + "/api/issues", data, RequestConfig());
}

// POST /api/issues/{issueId}/attachments
export function uploadAttachments(issueId: number, attachments: Array<Media>) {
    return new Promise<void>((resolve, reject) => {
        const uploadAsync = async () => {
            for (const m of attachments) {
                if (m.data === undefined) {
                    continue;
                }

                try {
                    const res = await axios.post(SERVER_URL + `/api/issues/${issueId}/attachments`, {
                        name: m.name,
                        mimeType: m.mimeType
                    }, RequestConfig());

                    const aId = res.data.id;

                    await uploadAttachment(m, aId);
                } catch (error) {
                    reject(error);
                    return;
                }
            }

            resolve();
        };

        uploadAsync();
    });
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
                const attachmentsData = response.data.map((a: Attachment) => {
                    a.url = SERVER_URL + `/api/attachments/${a.id}`;

                    return a;
                });

                setAttachments(attachmentsData);
            });
    }, [issueId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {attachments, setAttachments, refreshAttachments: fetchData};
}

// POST /api/issues/{issueId}/resolve
export function resolveIssue(issueId: number, data: {
    title: string,
    body: string,
    public: boolean,
    issueId: number,
    machineId: number
}) {
    return axios.post(SERVER_URL + `/api/issues/${issueId}/resolve`, data, RequestConfig());
}
