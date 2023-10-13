import { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import WideButton from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import {getIssuesById, getMachines} from "../api/machine.ts";
import { Machine,Issue } from "../models.ts";


const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const [machines, setMachines] = useState<Machine[]>([]);
    const [machine, setMachine] = useState<Machine>(null);
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        (async () => {
            let machines = await getMachines();
            if (machines != null) {
                setMachines(machines);
            }
        })();
    }, []);

    const getIssues = () => {
        // get issues for machine
        getIssuesById(machine.id).then(issues => setIssues(issues));
    };

    const onNotListed = () => {
        if (machine === null) {
            alert("Please select a machine!");
        } else {
            navigate("/new-issue");
        }
    }

    return (<>
        <NavigationHeader/>
        <div className={"page-content solved-issues"}>
            <h1>Solved Issues</h1>
            <div className={"section"}>
                <Dropdown options={machines.map(m => m.name)} onChange={(e) => {
                    let m = machines.find(machine => machine.name === e.value);
                    setMachine(m); getIssues();
                }} placeholder={"Machine..."}/>
            </div>
            <div className={"issues-box"}>
                <div className={"issues"}> 
                    {issues.map((e) => <WideButton title={e.headline} target={"test"}/>)}
                </div>
            </div>
            <button onClick={onNotListed}>My issues is not listed</button>
        </div>
    </>);
}

export default SolvedIssuesPage;
