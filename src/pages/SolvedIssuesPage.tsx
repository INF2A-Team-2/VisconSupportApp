import { useState, useEffect } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import { useNavigate } from "react-router-dom";
import 'react-dropdown/style.css';
import '../index.css';
import { useMachines } from "../api/machines.ts";
import { useIssues } from "../api/issues.ts";
import PageFooter from "../components/PageFooter.tsx";
import TableList from "../components/TableList.tsx";
import strftime from "strftime";

const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const {machines} = useMachines();
    const {issues} = useIssues();
    const [machine, setMachine] = useState(null);
    const [filteredIssues, setFilteredIssues] = useState([]);

    useEffect(() => {
        if (machine) {
            setFilteredIssues(issues.filter(issue => issue.machineId === machine.id));
        } else {
            null;
        }
    }, [machine, issues]);

    const issueData = filteredIssues.map(i => [
        i.id,
        i.headline,
        strftime("%F %H:%M", new Date(i.timeStamp)),
        machines.find(m => m.id === i.machineId)?.name || "null"
    ]);

    const navigateToIssue = issueId => navigate(`/issue/${issueId}`);

    const onNotListed = () => {
        if (machine === null) {
            alert("Please select a machine!");
        } else {
            sessionStorage.setItem("machineId", String(machine.id));
            navigate("/new-issue");
        }
    };

    return (
        <>
            <NavigationHeader />
            <div className={"page-content issue-pages"}>
                <h1>Solved Issues</h1>
                <div className={"section"}>
                    <Dropdown
                        options={machines.map(m => m.name)}
                        onChange={(e) => setMachine(machines.find(m => m.name === e.value))}
                        placeholder={"Select a Machine..."}
                    />
                </div>
                <TableList 
                    columns={["ID", "Headline", "Date", "Machine"]}
                    data={issueData}
                    buttons={[{
                        text: <i className="fa-solid fa-arrow-right"></i>,
                        callback: navigateToIssue
                    }]}
                />
                <div className="action-button">
                    <button onClick={onNotListed} className="create-new-ticket">Create new ticket</button>
                </div>
            </div>
            <PageFooter />
        </>
    );
};

export default SolvedIssuesPage;
