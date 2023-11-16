import { useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import { WideButton } from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { Machine, Issue } from "../models.ts";
import 'react-dropdown/style.css';
import '../index.css';
import { useMachines } from "../api/machines.ts";
import { useIssues } from "../api/issues.ts";

const MyIssuesPage = () => {
    const navigate = useNavigate();
    const {machines} = useMachines();
    const [machine, setMachine] = useState<Machine | null>(null);
    const {issues} = useIssues({
        machineId: machine?.id
    });
    const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);

    const handleIssueClick = (issueId: number) => {
        setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
    };

    const navigateToIssue = (issueId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/issue/${issueId}`);
    };


    const renderIssueDetails = (issue: Issue, isExpanded: boolean) => {
        const detailClass = isExpanded ? "issue-details expanded" : "issue-details hidden";
        return (
            <div className={detailClass}>
                <p>What did happen: {issue.actual}</p>
                <p>Expectation: {issue.expected}</p>
                <p>What was tried: {issue.tried}</p>
                <button onClick={(e) => navigateToIssue(issue.id, e)}>View Entire Issue</button>
            </div>
        );
    };

    return (
        <>
            <NavigationHeader />
            <div className="page-content my-issues">
                <h1>My Issues</h1>
                <div className="section">
                <Dropdown
                    options={machines.map((m) => m.name)}
                    onChange={(e) => {
                        setMachine(machines.find((machine) => machine.name === e.value));
                    }}
                    placeholder="Select a machine"
                    controlClassName="dropdown-control" // Add this class for styling the control part of the dropdown
                    menuClassName="dropdown-menu"       // Add this class for styling the dropdown menu
                />
                </div>
                <div className="issues-box">
                    <div className="issues">
                    {machine !== null && issues.map((issue) => (
                    <div key={issue.id} onClick={() => handleIssueClick(issue.id)} className="issue-container">
                        <WideButton title={`${issue.headline}`}/>
                        {renderIssueDetails(issue, expandedIssueId === issue.id)}
                    </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyIssuesPage;
