import { useParams } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import MessageBox from "../components/MessageBox";
import { useEffect, useRef, useState } from "react";
import {newIssueMessage, useIssue, useIssueAttachments, useIssueMessages} from "../api/issues.ts";
import useAuth from "../api/auth.ts";
import {AccountType, Attachment} from "../models.ts";
import { getConnection } from "../api/socket.ts";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import PageFooter from "../components/PageFooter.tsx";
import {useUser} from "../api/users.ts";
import {useMachine} from "../api/machines.ts";

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

    const {user: issueUser} = useUser({ userId: issue?.userId });

    const {machine} = useMachine({ machineId: issue?.machineId });

    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>();
    const chatHistoryRef = useRef<HTMLDivElement>();
    const [styleMode, setStyleMode] = useState<StyleMode>(StyleMode.None);
    const [listCount, setListCount] = useState<number>(1);
    const [connection, setConnection] = useState<HubConnection>(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (connection) {
            if (connection.state === HubConnectionState.Connected) {
                return;
            }
            connection.start()
                .then(result => {
                    console.log('Connected!');
                    connection.invoke("AddToGroup", issueId.toString())

                    connection.on("Send", (message) => { console.log(message)});

                    connection.on('message', message => { refreshMessages(); });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
        if (connection === null) {
            setConnection(getConnection());
        }
    }, [connection]);

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
            connection.invoke("SendMessage", issueId.toString(), "Incoming Message");
            refreshMessages();
        });

        setMessage("");
    };


    const getFileComponent = (a: Attachment, i: number) => {
        switch (a.mimeType.split("/")[0]) {
            case "image":
                return <img src={a.url} key={i} alt={a.name} onClick={() => window.open(a.url)}></img>;
            case "video":
                return <video controls={true} key={i}>
                    <source src={a.url}/>
                </video>;
            case "audio":
                return <audio controls>
                    <source src={a.url}/>
                </audio>;
            default:
                return <p key={i} onClick={() => window.open(a.url)}>{a.name}</p>;
        }
    };

    return (<>
        <NavigationHeader />
        <div className={"page-content"}>
            <div className={"issue-header"}>
                <h1>{issue?.headline}</h1>
                <h2><i className="fa-solid fa-user"></i>{user?.username}</h2>
                <h2><i className="fa-solid fa-gears"></i>{machine?.name}</h2>
                {user?.type === AccountType.HelpDesk ? <button onClick={() => {}}>Resolve Issue</button> : <></>}
            </div>
            <div className={"issue-content"}>
                <h2>What Happened?</h2>
                <p>{issue?.actual}</p>

                <h2>Expectations</h2>
                <p>{issue?.expected}</p>

                <h2>What did you try?</h2>
                <p>{issue?.tried}</p>
            </div>

            <h1 className={"attachments-header"}>Attachments</h1>
            <div className={"attachments-list"}>
                {attachments.length === 0 ? <p>No attachments</p> : attachments.map((a, i) => getFileComponent(a, i))}
            </div>
            <div className={"chat"}>
            <h1>Messages</h1>
                <div className={"chat-history"} ref={chatHistoryRef}>
                    <ul className={"no-list-style"}>
                        {messages.map(m =>
                            <MessageBox key={m.id} message={m}/>)}
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
        <PageFooter />
    </>);
};

export default IssuePage;
