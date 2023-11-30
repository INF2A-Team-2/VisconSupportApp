import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import {Message} from "../models.ts";
import {useUser} from "../api/users.ts";

const MessageBox = ({message}: {message: Message}) => {
    const html = sanitizeHtml(marked(message.body));
    const userId = message.userId;
    const {user} = useUser({userId});

    const typeNames = {
        0: "Customer",
        1: "Employee",
        2: "Admin",
    };

    return (<>
    <li className={"no-list-style"}>
        <div className={"message-border"}>
            <div className={"message-data"}>
                <span className={"message-data-name"}>{user?.username} - {typeNames[user?.type]}</span>
                <span className={"message-data-time"}>{new Date(message.timeStamp).toLocaleString()}</span>
            </div>
            <div className={"message"} dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    </li>
    </>);
};

export default MessageBox;