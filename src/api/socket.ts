import config from "../../config.json";
import { HubConnectionBuilder } from "@microsoft/signalr";

export const SERVER_URL = config.server_url;
// export const connection = new HubConnectionBuilder()
//     .withUrl(SERVER_URL + "/messageHub")
//     .build();

export function getConnection() {
    return new HubConnectionBuilder()
    .withUrl(SERVER_URL + "/messageHub")
    .build();
}