import config from "../../config.json";
import signalR from "@microsoft/signalr";

export const SERVER_URL = config.server_url;
export const connection = new signalR.HubConnectionBuilder()
    .withUrl(SERVER_URL + "/messageHub")
    .build();