import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import {Message} from "../models.ts";
import {useUser} from "../api/users.ts";

const MessageBox = ({message}: {message: Message}) => {
    const html = sanitizeHtml(marked(message.body));
    const userId = message.userId;
    const {user} = useUser({userId});

    const icons = {
        0: <i className="fa-solid fa-user"></i>,
        1: <i className="fa-solid fa-user-doctor"></i>,
        2: <i className="fa-solid fa-user-gear"></i>,
    };

    return (<>
        <div className={"message-border"}>
            <div className={"message-data"}>
                <span className={"message-data-name"}>{icons[user?.type]}{user?.username}</span>
                <span className={"message-data-time"}>{new Date(message.timeStamp).toLocaleString()}</span>
            </div>
            <div className={"message"} dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    </>);
};

export default MessageBox;