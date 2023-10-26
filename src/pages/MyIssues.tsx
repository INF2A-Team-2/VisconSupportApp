import { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import WideButton from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { getUserIssues, getMachines } from "../api/machine.ts";
import { Machine, Issue } from "../models.ts";
import 'react-dropdown/style.css';
import '../index.css';


const MyIssuesPage = () => {
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

    useEffect(() => {
        (async () => {
            if (machine === null) {
                return;
            }
            setIssues(await getUserIssues(machine.id));
        })();
    }, [machine]);

    const DirectToSolvedIssues = () => {
        if (machine === null) {
            alert("Please select a machine!");
        } else {
            // Ik heb iemands hulp nog nodig om deze pagina te laden met params
            navigate("/solved-issues");
        }
    }

    const getLine = (issue: Issue): string => {
        return "Headline: " + issue.headline + ", Department: " + issue.department + ", Description: " + issue.description
    }

    return (<>
        <NavigationHeader/>
        <div className={"page-content my-issues"}>
            <h1>My Issues</h1>
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
            <button onClick={DirectToSolvedIssues}>Create a new issue</button>
        </div>
    </>);
}

export default MyIssuesPage;
