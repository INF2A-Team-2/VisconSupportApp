import { useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import {WideButton} from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { Machine, Issue } from "../models.ts";
import { useMachines } from "../api/machines.ts";
import 'react-dropdown/style.css';
import '../index.css';
import {useIssues} from "../api/issues.ts";

const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const {machines} = useMachines();
    const [machine, setMachine] = useState<Machine>(null);
    const {issues} = useIssues(machine?.id);

    const onNotListed = () => {
        if (machine === null) {
            alert("Please select a machine!");
        } else {
            sessionStorage.setItem("machineId", String(machine.id));
            navigate("/new-issue");
        }
    };

    const getLine = (issue: Issue): string => {
        return "Headline: " + issue.headline;
    };

    return (<>
        <NavigationHeader/>
        <div className={"page-content solved-issues"}>
            <h1>Solved Issues</h1>
            <div className={"section"}>
                <Dropdown options={machines.map(m => m.name)} onChange={(e) => {
                    setMachine(machines.find(machine => machine.name === e.value));
                }} placeholder={"Machine..."}/>
            </div>
            <div className={"issues-box"}>
                <div className={"issues"}> 
                    {machine !== null && issues.map((e) => <WideButton key={e.id} title={getLine(e)} target={"test"}/>)}
                </div>
            </div>
            <button onClick={onNotListed}>My issues is not listed</button>
        </div>
    </>);
};

export default SolvedIssuesPage;
