import { useParams } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import MessageBox from "../components/MessageBox";
import React, { useEffect, useRef, useState } from "react";
import {newIssueMessage, useIssue, useIssueAttachments, useIssueMessages} from "../api/issues.ts";
import useAuth from "../api/auth.ts";
import {AccountType, Attachment, Priority, Field, FieldType} from "../models.ts";
import { getConnection } from "../api/socket.ts";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import {useUser} from "../api/users.ts";
import {useMachine} from "../api/machines.ts";
import PageFooter from "../components/PageFooter.tsx";
import MarkdownInput, { InputType } from "../components/MarkdownInput.tsx";
import PopupForm from "../components/PopupForm.tsx";

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
    const markDownRef = useRef<MarkdownInput>();;
    const [connection, setConnection] = useState<HubConnection>(null);
    const popupForm = useRef<PopupForm>();
    const popupFieds: Array<Array<Field>> = [
        [
            {
                name: "Title",
                key: "title",
                type: FieldType.Text,
                required: true
            },
            {
                name: "Body",
                key: "body",
                type: FieldType.Markdown,
                required: true
            },
            {
                name: "Public",
                key: "public",
                type: FieldType.Checkbox,
                required: true,
            },
        ]
    ]

    useEffect(() => {
        if (connection) {
            if (connection.state === HubConnectionState.Connected) {
                return;
            }
            connection.start()
                .then(() => {
                    console.log('Connected!');
                    connection.invoke("AddToGroup", issueId.toString());

                    connection.on("Send", (message) => { console.log(message);});

                    connection.on('message', () => { refreshMessages(); });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
        if (connection === null) {
            setConnection(getConnection());
        }
    }, [connection]);

    const sendMessage = () => {
        if (!markDownRef.current) {
            return;
        }
        let message = markDownRef.current.state.message;
        if (message == "") {
            return;
        }

        markDownRef.current.setState({message: ""});
        newIssueMessage({
            issueId: issueId,
            message: message
        }).finally(() => {
            connection.invoke("SendMessage", issueId.toString(), "Incoming Message");
            refreshMessages();
        });
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
                <h2><i className="fa-solid fa-user"></i>{issueUser?.username}</h2>
                <h2><i className="fa-solid fa-gears"></i>{machine?.name}</h2>
                {user?.type === AccountType.HelpDesk ? <button onClick={() => { popupForm.current.show(true); popupForm.current.setDataHistory([{"title": issue?.headline}]); }}>Resolve Issue</button> : <></>}
                <h2><i className="fa-solid fa-phone"></i>{issue?.phoneNumber ?? "No phone number found!"}</h2>
                <h2><i className="fa-solid fa-bell"></i>{Priority[issue?.priority]}</h2>
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
                <div className={"chat-history"}>
                    {messages.map(m =>
                        <MessageBox key={m.id} message={m}/>)}
                </div>
                <MarkdownInput ref={markDownRef} type={InputType.Chat}/>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
        <PopupForm
            ref={popupForm}
            title={"Mark as Resolved"}
            forms={popupFieds}
            onSubmit={(d) => {console.log(d);}}
            preview={true}/>
        <PageFooter />
    </>);
};

export default IssuePage;
