import { useParams } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import { Issue, Message } from "../models";
import MessageBox from "../components/MessageBox";
import { useRef, useState } from "react";

const IssuePage = () => {
    const { issueId } = useParams();
    const issue = getIssue(issueId);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Array<Message>>([]);
    const textareaRef = useRef<HTMLTextAreaElement>();

    const insertTextAtLine = (style: string) => {
        if (textareaRef.current) {
            if (textareaRef.current) {
                const textarea = textareaRef.current;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const lines = message.split('\n');
                const lineIndex = message.substring(0, start).split('\n').length - 1;
                if (lineIndex < lines.length) {
                    lines[lineIndex] = style + " " + lines[lineIndex];
                    const newText = lines.join('\n');
                    setMessage(newText);

                    textarea.selectionStart = start + 1;
                    textarea.selectionEnd = start + 1;
                    textarea.focus();
                  }

            }
        }
    };

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
                    {messages.map(m =>
                        <MessageBox key={m.id} name={m.name} time={m.time} message={m.message}/>)}
                </div>
                <div className={"message-options"}>
                    <div className="text-icon" onClick={() => {insertTextAtLine("###")}}>
                        <i className="fa-solid fa-heading"/>
                    </div>
                    <div className="text-icon" onClick={() => {insertTextAtLine("###")}}>
                        <i className="fa-solid fa-bold"/>
                    </div>
                    <div className="text-icon" onClick={() => {insertTextAtLine("###")}}>
                        <i className="fa-solid fa-italic"/>
                    </div>
                    <div className="text-icon" onClick={() => {insertTextAtLine(">")}}>
                        <i className="fa-solid fa-quote-left"/>
                    </div>
                    <div className="text-icon" onClick={() => {insertTextAtLine("-")}}>
                        <i className="fa-solid fa-list-ol"/>
                    </div>
                    <div className="text-icon" onClick={() => {insertTextAtLine("1.")}}>
                        <i className="fa-solid fa-list-ul"/>
                    </div>
                </div>
                <div className={"message-input"}>
                    <textarea placeholder={"..."}
                        rows={8}
                        value={message}
                        ref={textareaRef}
                        onChange={(e) => setMessage(e.target.value)}/>
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
