import { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import WideButton from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { Machine, Issue } from "../models.ts";
import { useIssues, useMachines } from "../api/machine.ts";


const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const machines = useMachines();
    const [machine, setMachine] = useState<Machine>(null);
    let issues = []; 

    useEffect(() => {
        (async () => {
            if (machine === null) {
                return;
            }
            issues = useIssues(machine.id);
        })();
    }, [machine]);

    const onNotListed = () => {
        if (machine === null) {
            alert("Please select a machine!");
        } else {
            navigate("/new-issue");
        }
    }

    const getLine = (issue: Issue): string => {
        return "Headline: " + issue.headline + ", Department: " + issue.department + ", Description: " + issue.description
    }

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
                    {issues.map((e) => <WideButton key={e.id} title={getLine(e)} target={"test"}/>)}
                </div>
            </div>
            <button onClick={onNotListed}>My issues is not listed</button>
        </div>
    </>);
}

export default SolvedIssuesPage;
