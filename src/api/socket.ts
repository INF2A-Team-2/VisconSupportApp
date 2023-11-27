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

export function uploadAttachment(m: Media, attachmentId: number) {
    return new Promise<void>((resolve, reject) => {
        (async () => {
            console.log("uploading attachment", attachmentId);
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

            socket.addEventListener("close", async (event) => {
                if (event.code === 1000) {
                    resolve();
                }

                reject();
            });
        })();
    });
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}