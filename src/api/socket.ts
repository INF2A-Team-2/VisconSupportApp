import config from "../../config.json";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {Media} from "../models.ts";
export const SERVER_URL = config.server_url;
export const FILE_SERVER_URL = config.file_server_url;

export function getConnection() {
    return new HubConnectionBuilder()
    .withUrl(SERVER_URL + "/messageHub")
    .build();
}

export async function uploadAttachment(m: Media, attachmentId: number) {
    return new Promise<void>((resolve, reject) => {
        const socket = new WebSocket(FILE_SERVER_URL);
        socket.binaryType = "arraybuffer";

        const sendData = async () => {
            console.log("Sending data", attachmentId);

            const data = JSON.stringify({
                id: attachmentId,
                mimeType: m.mimeType,
                size: m.data.byteLength,
                token: sessionStorage.getItem("token")
            });

            socket.send(data);

            await delay(500);

            socket.send(m.data);
        };

        socket.addEventListener("open", async () => {
            await sendData();
        });

        socket.addEventListener("close", (event) => {
            console.log("Socket closed", attachmentId, event);
            if (event.wasClean) {
                console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
                resolve();
            } else {
                console.error(`Connection died`);
                reject();
            }
        });

        socket.addEventListener("error", (error) => {
            console.error("Socket error", error);
            reject(error);
        });
    });
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}