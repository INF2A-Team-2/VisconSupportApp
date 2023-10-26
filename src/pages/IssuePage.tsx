import { useParams } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import { Issue, Message } from "../models";
import MessageBox from "../components/MessageBox";
import { useRef, useState } from "react";

enum ListMode {
    None,
    Numbered,
    Dash
}

const IssuePage = () => {
    const { issueId } = useParams();
    const issue = getIssue(issueId);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Array<Message>>([]);
    const textareaRef = useRef<HTMLTextAreaElement>();
    const [listMode, setListMode] = useState<ListMode>(ListMode.None)
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
    }

    const surroundWord = (style: string) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const lines = message.split("\n")

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
    }

    const newLine = () => {
        if (listMode == ListMode.None)
            return;

        let lines = message.split("\n");
        if (listMode == ListMode.Numbered && lines[lines.length - 2] == `${listCount - 1}. `) {
            setListCount(1);
            setListMode(ListMode.None);
            setMessage(lines.splice(0, lines.length - 2).join("\n") + "\n")
        } else if (listMode == ListMode.Numbered) {
            setListCount(listCount + 1);
            insertTextAtLine(`${listCount}.`);
        } else if (listMode == ListMode.Dash && lines[lines.length - 2] == "- ") {
            setListMode(ListMode.None);
            setMessage(lines.splice(0, lines.length - 2).join("\n") + "\n")
        } else if (listMode == ListMode.Dash)
            insertTextAtLine("-")
    }

    const sendMessage = () => {
        if (message == "") {
            return;
        }

        let name = "Customer";
        if (Math.floor(Math.random() * 2) == 0) {
            name = "Mr. Employee"
        }
        setMessages([...messages, {
            id: messages.length,
            name: name,
            time: new Date().toLocaleString(),
            message: message
        }])
        setMessage("");
    }

    return (<>
        <NavigationHeader />
        <div className={"page-content"}>
            <h1>{issue.headline}</h1>
            <div className={"observation-fields"}>
                <p>What Happened?</p>
                <textarea disabled defaultValue={issue.actual}/>

                <p>Expectations</p>
                <textarea disabled defaultValue={issue.expected}/>

                <p>What did you try?</p>
                <textarea disabled defaultValue={issue.tried}/>
            </div>
            <div className={"chat"}>
            <h1>Messages</h1>
                <div className={"chat-history"}>
                    <ul className={"no-list-style"}>
                        {messages.map(m =>
                        <MessageBox key={m.id} name={m.name} time={m.time} message={m.message}/>)}
                    </ul>
                </div>
                <div className={"message-options"}>
                    <div className="text-icon" onClick={() => {insertTextAtLine("###")}}>
                        <i className="fa-solid fa-heading"/>
                    </div>
                    <div className="text-icon" onClick={() => {surroundWord("**")}}>
                        <i className="fa-solid fa-bold"/>
                    </div>
                    <div className="text-icon" onClick={() => {surroundWord("_")}}>
                        <i className="fa-solid fa-italic"/>
                    </div>
                    <div className="text-icon" onClick={() => {insertTextAtLine(">")}}>
                        <i className="fa-solid fa-quote-left"/>
                    </div>
                    <div className="text-icon" onClick={() => {setListMode(ListMode.Numbered); newLine();}}>
                        <i className="fa-solid fa-list-ol"/>
                    </div>
                    <div className="text-icon" onClick={() => {setListMode(ListMode.Dash); newLine();}}>
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
}

const getIssue = (issueId: string): Issue => {
    if (issueId == "1") {
        return {
            id: Number(issueId),
            headline: "Extension not working",
            actual: "This shit is not really working rn",
            expected: "It should work",
            tried: "I tried everything",
            timeStamp: "empty",
       };
    } else {
        return {
            id: Number(issueId),
            headline: "Chicken eggs are not getting collected",
            actual: "This shit is not really working rn",
            expected: "It should work",
            tried: "I tried everything",
            timeStamp: "empty",
       };
    }
}

export default IssuePage;
