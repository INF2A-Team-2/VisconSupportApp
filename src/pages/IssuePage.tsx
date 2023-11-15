import { useParams } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import MessageBox from "../components/MessageBox";
import { useRef, useState } from "react";
import {newIssueMessage, useIssue, useIssueAttachments, useIssueMessages} from "../api/issues.ts";
import useAuth from "../api/auth.ts";
import { AccountType } from "../models.ts";

enum StyleMode {
    None,
    Numbered,
    Dash,
    Quote
}

const IssuePage = () => {
    const user = useAuth();
    const issueId = parseInt(useParams().issueId);

    const {issue} = useIssue({
        issueId: issueId
    });

    const {messages, refreshMessages} = useIssueMessages({
        issueId: issueId
    });
    const {attachments} = useIssueAttachments({
        issueId: issueId
    });

    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>();
    const [styleMode, setStyleMode] = useState<StyleMode>(StyleMode.None);
    const [listCount, setListCount] = useState<number>(1);

    const insertTextAtLine = (style: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const lines = message.split('\n');
            const lineIndex = message.substring(0, start).split('\n').length - 1;
            if (lineIndex < lines.length) {
                lines[lineIndex] = style + " " + lines[lineIndex];
                const newText = lines.join('\n');
                setMessage(newText);
                textarea.focus();
            }
        }
    };

    const surroundWord = (style: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const lines = message.split("\n");

            let messageIndex = 0;
            let found = false;
            for (let x = 0; x < lines.length; x++) {
                const words = lines[x].split(" ");
                for (let y = 0; y < words.length; y++) {
                    const word = words[y];
                    messageIndex += word.length + 1;
                    if (word == "\n")
                        continue;

                    if (start < messageIndex) {
                        words[y] = style + word + style;
                        found = true;
                        break;
                    }
                }
                lines[x] = words.join(" ");
                if (found)
                    break;
            }

            setMessage(lines.join("\n"));
        }
    };

    const newLine = () => {
        if (styleMode == StyleMode.None)
            return;

        if (styleMode == StyleMode.Quote) {
            setMessage(message + "\n");
            setStyleMode(StyleMode.None);
            return;
        }

        const lines = message.split("\n");
        if (styleMode == StyleMode.Numbered && lines[lines.length - 2] == `${listCount - 1}. `) {
            setListCount(1);
            setStyleMode(StyleMode.None);
            setMessage(lines.splice(0, lines.length - 2).join("\n") + "\n");
        } else if (styleMode == StyleMode.Numbered) {
            setListCount(listCount + 1);
            insertTextAtLine(`${listCount}.`);
        } else if (styleMode == StyleMode.Dash && lines[lines.length - 2] == "- ") {
            setStyleMode(StyleMode.None);
            setMessage(lines.splice(0, lines.length - 2).join("\n") + "\n");
        } else if (styleMode == StyleMode.Dash)
            insertTextAtLine("-");
    };

    const sendMessage = () => {
        if (message == "") {
            return;
        }

        newIssueMessage({
            issueId: issueId,
            message: message
        }).finally(() => {
            refreshMessages();
        });

        setMessage("");
    };

    return (<>
        <NavigationHeader />
        <div className={"page-content"}>
            <div className={"issue-header"}>
                <h1>{issue?.headline}</h1>
                {user?.type === AccountType.HelpDesk ? <button onClick={() => {}}>Resolve Issue</button> : <></>}
            </div>
            <div className={"observation-fields"}>
                <p>What Happened?</p>
                <textarea disabled defaultValue={issue?.actual}/>

                <p>Expectations</p>
                <textarea disabled defaultValue={issue?.expected}/>

                <p>What did you try?</p>
                <textarea disabled defaultValue={issue?.tried}/>
            </div>
            <h1>Attachments</h1>
            <div className={"attachments-list"}>
                {attachments.length === 0 ? <p>No attachments</p> : attachments.map(a => a.mimeType.split("/")[0] === "image"
                    ? <img key={a.id} src={a.data} alt={a.id.toString()}></img>
                    : <video key={a.id} controls={true}>
                        <source src={a.data}/>
                    </video>)}
            </div>
            <div className={"chat"}>
            <h1>Messages</h1>
                <div className={"chat-history"}>
                    <ul className={"no-list-style"}>
                        {messages.map(m =>
                            <MessageBox key={m.id} name={m.name} time={m.timestamp} message={m.body}/>)}
                    </ul>
                </div>
                <div className={"message-options"}>
                    <div className="text-icon" onClick={() => {insertTextAtLine("###");}}>
                        <i className="fa-solid fa-heading"/>
                    </div>
                    <div className="text-icon" onClick={() => {surroundWord("**");}}>
                        <i className="fa-solid fa-bold"/>
                    </div>
                    <div className="text-icon" onClick={() => {surroundWord("_");}}>
                        <i className="fa-solid fa-italic"/>
                    </div>
                    <div className="text-icon" onClick={() => {insertTextAtLine(">"); setStyleMode(StyleMode.Quote);}}>
                        <i className="fa-solid fa-quote-left"/>
                    </div>
                    <div className="text-icon" onClick={() => {setStyleMode(StyleMode.Numbered); newLine();}}>
                        <i className="fa-solid fa-list-ol"/>
                    </div>
                    <div className="text-icon" onClick={() => {setStyleMode(StyleMode.Dash); newLine();}}>
                        <i className="fa-solid fa-list-ul"/>
                    </div>
                </div>
                <div className={"message-input"}>
                    <textarea placeholder={"..."}
                        rows={8}
                        value={message}
                        ref={textareaRef}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyUp={(e) => {if (e.key == "Enter") newLine();}}/>
                </div>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    </>);
};

export default IssuePage;
