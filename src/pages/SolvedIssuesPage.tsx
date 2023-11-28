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
import { RenderIssueDetails } from "../components/RenderIssueDetails.tsx";
import PageFooter from "../components/PageFooter.tsx";

const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const {machines} = useMachines();
    const [machine, setMachine] = useState<Machine>(null);
    const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);

    const {issues} = useIssues({
        machineId: machine?.id
    });

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


    const handleIssueClick = (issueId: number) => {
        setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
    };


    return (<>
        <NavigationHeader/>
        <div className={"page-content issue-pages"}>
            <h1>Solved Issues</h1>
            <div className={"section"}>
                <Dropdown options={machines.map(m => m.name)} onChange={(e) => {
                    setMachine(machines.find(machine => machine.name === e.value));
                }} placeholder={"Machine..."}/>
            </div>
            <div className="issues-box">
                    <div className="issues">
                        {machine !== null && issues.map((issue) => (
                            <div key={issue.id} onClick={() => handleIssueClick(issue.id)} className="issue-container">
                                <WideButton title={`${issue.headline}`} />
                                <RenderIssueDetails issue={issue} isExpanded={expandedIssueId === issue.id} />
                            </div>
                        ))}
                    </div>
                </div>
            <button onClick={onNotListed}>My issues is not listed</button>
        </div>
        <PageFooter />
    </>);
};

export default SolvedIssuesPage;
