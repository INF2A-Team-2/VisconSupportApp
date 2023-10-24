import { useParams } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import { Issue, Message } from "../models";
import MessageBox from "../components/MessageBox";
import { createRef, useState } from "react";

const IssuePage = () => {
    const { issueId } = useParams();
    const issue = getIssue(issueId);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Array<Message>>([]);

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
                <textarea disabled defaultValue={issue.description.split("|||")[0]}/>

                <p>Expectations</p>
                <textarea disabled defaultValue={issue.description.split("|||")[1]}/>

                <p>What did you try?</p>
                <textarea disabled defaultValue={issue.description.split("|||")[2]}/>
            </div>

            <h2>Messages</h2>
            <div className={"chat"}>
                <div className={"chat-history"}>
                    <ul>
                        {messages.map(m =>
                            <MessageBox key={m.id} name={m.name + ", "} time={m.time}
                                message={m.message} owner={m.name == "Customer"}/>)}
                    </ul>
                </div>
                <div className={"message-input"}>
                    <textarea placeholder={"..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}/>
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    </>);
}

const getIssue = (issueId: string): Issue => {
    if (issueId == "1") {
        return {
            id: Number(issueId),
            headline: "Extension not working",
            department: "Poultry",
            description: "This shit is not really working rn|||It should work|||I tried everything"
       };
    } else {
        return {
            id: Number(issueId),
            headline: "Chicken eggs are not getting collected",
            department: "Chickens",
            description: "This shit is not really working rn|||It should work|||I tried everything"
       };
    }

}

export default IssuePage;
