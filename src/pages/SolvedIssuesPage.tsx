import { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import WideButton from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { getMachines } from "../api/machine.ts";
import { Machine } from "../models.ts";

const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const [machines, setMachines] = useState<Machine[]>([]);
    const [machine, setMachine] = useState<string>("");
    const [issues, setIssues] = useState<string[]>([]);
    
    useEffect(() => {
        (async () => {
            setMachines(await getMachines());
        })();
    }, []);

    const getIssues = (machine: string) => {
        // get issues for machine
        if (machine === "machine 1") {
            setIssues(["issue 1", "issue 2", "issue 3", "issue 4", "issue 2", "issue 3", "issue 4", "issue 2", "issue 3", "issue 4"]);
        } else if (machine === "machine 2") {
            setIssues(["issue 1", "issue 3"])
        } else {
            setIssues(["issue 1", "issue 2", "issue 3"]);
        }
    };

    const onNotListed = () => {
        if (machine == "") {
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
                <Dropdown options={machines.map(m => m.name)} onChange={(e) => {setMachine(e.value); getIssues(e.value);}} placeholder={"Machine..."}/>
            </div>
            <div className={"issues-box"}>
                <div className={"issues"}> 
                    {issues.map((e) => <WideButton title={e} target={"test"}/>)}
                </div>
            </div>
            <button onClick={onNotListed}>My issues is not listed</button>
        </div>
    </>);
}

export default SolvedIssuesPage;
