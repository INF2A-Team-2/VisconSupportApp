import config from "../../config.json";
import { HubConnectionBuilder } from "@microsoft/signalr";

export const SERVER_URL = config.server_url;

export function getConnection() {
    return new HubConnectionBuilder()
    .withUrl(SERVER_URL + "/messageHub")
    .build();
}