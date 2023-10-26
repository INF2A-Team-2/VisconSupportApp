import { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import WideButton from "../components/WideButton.tsx";
import WideButtonNoTarget from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { getUserIssues, getMachines } from "../api/machine.ts";
import { Machine, Issue } from "../models.ts";
import 'react-dropdown/style.css';
import '../index.css';

const MyIssuesPage = () => {
    const navigate = useNavigate();
    const [machines, setMachines] = useState<Machine[]>([]);
    const [machine, setMachine] = useState<Machine | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null); 
    

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
                <p>Description: {issue.description}</p>
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
                    <Dropdown options={machines.map(m => m.name)} onChange={(e) => {
                        setMachine(machines.find(machine => machine.name === e.value));
                    }} placeholder="Select a machine" />
                </div>
                <div className="issues-box">
                    <div className="issues">
                    {issues.map((issue) => (
                    <div key={issue.id} onClick={() => handleIssueClick(issue.id)} className="issue-container">
                        <WideButtonNoTarget title={`Headline: ${issue.headline}, Department: ${issue.department}`} />
                        {renderIssueDetails(issue, expandedIssueId === issue.id)}
                    </div>
))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyIssuesPage;
