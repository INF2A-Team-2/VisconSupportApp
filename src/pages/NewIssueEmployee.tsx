import { useState } from "react";
import useAuth from "../api/auth";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import NavigationHeader from "../components/NavigationHeader";
import { AccountType } from "../models";
import { useMachines } from "../api/machines";
import toast from "react-hot-toast";
import { newIssue } from "../api/issues";
import { useNavigate } from "react-router-dom";

const NewIssueEmployee = () => {
    useAuth([AccountType.HelpDesk, AccountType.Admin]);
    const navigate = useNavigate();

    const {machines} = useMachines();
    const [machine, setMachine] = useState(null);
    const [title, setTitle] = useState("");
    const [occurrence, setOccurence] = useState("");
    const [expectation, setExpectation] = useState("");
    const [tried, setTried] = useState("");

    const onSubmit = () => {
        let missingMessage = "";
        if (machine === null)
            missingMessage += "Machine; ";
        if (title == "")
            missingMessage += "Title; ";
        if (occurrence == "")
            missingMessage += "What Happened?; ";
        if (expectation == "")
            missingMessage += "Expectations; ";
        if (tried == "")
            missingMessage += "What did you try?;";

        if (missingMessage != "")  {
            toast.error("Missing: " + missingMessage);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        toast.promise(newIssue({
            actual: occurrence,
            expected: expectation,
            tried: tried,
            headline: title,
            machineId: machine.id,
            attachments: []
        }), {
            loading: "Creating issue...",
            success: "Issue created",
            error: "Failed to create issue"
        }).then(response => {
            navigate(`/issue/${response.data.id}`);
        });
    };

    return (<>
        <NavigationHeader/>
        <div className={"page-content new-issue"}>
            <h1>Create Issue</h1>
            <div className={"section"}>
                <Dropdown options={machines.map(m => m.name)} onChange={(e) => {
                        setMachine(machines.find(machine => machine.name === e.value));
                    }} placeholder={"Machine..."}/>
            </div>
            <input type={"text"} onChange={e => setTitle(e.target.value)} placeholder={"Title..."}/>
            <div className={"observation-fields"}>
                <p>What Happened?</p>
                <textarea rows={10} placeholder={"..."}
                    onChange={e => setOccurence(e.target.value)}/>

                <p>Expectations</p>
                <textarea rows={10} placeholder={"..."}
                    onChange={e => setExpectation(e.target.value)}/>

                <p>What did you try?</p>
                <textarea rows={10} placeholder={"..."}
                    onChange={e => setTried(e.target.value)}/>
            </div>
            <button onClick={onSubmit}>Submit</button>
        </div>
    </>)
}

export default NewIssueEmployee;