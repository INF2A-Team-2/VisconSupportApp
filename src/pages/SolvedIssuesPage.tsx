import { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import {WideButton} from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { Machine, Issue } from "../models.ts";
import { useMachines } from "../api/machine.ts";
import axios from "axios";
import { RequestConfig, SERVER_URL } from "../api/auth.ts";
import 'react-dropdown/style.css';
import '../index.css';

const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const machines = useMachines();
    const [issues, setIssues] = useState<Array<Issue>>([]);
    const [machine, setMachine] = useState<Machine>(null);

    useEffect(() => {
        (() => {
            if (machine === null) {
                return;
            }
            axios.get(SERVER_URL + "/api/issues?machineId=" + machine.id, RequestConfig())
                .then(response => setIssues(response.data));
        })();
    }, [machine]);

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
                    {issues.map((e) => <WideButton key={e.id} title={getLine(e)} target={"test"}/>)}
                </div>
            </div>
            <button onClick={onNotListed}>My issues is not listed</button>
        </div>
    </>);
};

export default SolvedIssuesPage;
