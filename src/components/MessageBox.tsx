import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const MessageBox = ({name, time, message}:
    {name: string, time: string, message: string}) => {
    const html = sanitizeHtml(marked(message));

    return (<>
    <li className={"no-list-style"}>
        <div className={"message-border"}>
            <div className={"message-data"}>
                <span className={"message-data-name"}>{name}</span>
                <span className={"message-data-time"}>{new Date(time).toLocaleString()}</span>
            </div>
            <div className={"message"} dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    </li>
    </>);
}

export default MessageBox