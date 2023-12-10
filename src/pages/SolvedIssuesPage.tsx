import {  useRef, useState, useEffect } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import { useNavigate } from "react-router-dom";
import { Machine, Issue, Field, FieldType } from "../models.ts";
import { newIssue, uploadAttachments, useIssues } from "../api/issues.ts";
import { RenderIssueDetails } from "../components/RenderIssueDetails.tsx";
import PopupForm from "../components/PopupForm.tsx";
import 'react-dropdown/style.css';
import '../index.css';
import { useMachines } from "../api/machines.ts";
import PageFooter from "../components/PageFooter.tsx";
import TableList from "../components/TableList.tsx";
import strftime from "strftime";
import toast from "react-hot-toast";

const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const {machines} = useMachines();
    const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
    const popupForm = useRef<PopupForm>();
    const popupFields: Array<Array<Field>> = [
        [
            {
                name: "Title",
                key: "title",
                type: FieldType.Text,
                required: true,
            }
        ],
        [
            {
                name: "What Happened?",
                key: "occurrence",
                type: FieldType.TextArea,
                required: true,
            }
        ],
        [
            {
                name: "Expectations",
                key: "expectation",
                type: FieldType.TextArea,
                required: true,
            }
        ],
        [
            {
                name: "What did you try?",
                key: "tried",
                type: FieldType.TextArea,
                required: true,
            }
        ],
        [
            {
                name: "Upload Files (optional)",
                key: "media",
                type: FieldType.Files,
                required: false,
            }
        ]
    ];
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
            toast.error("Please select a machine");
            return;
        }
        popupForm.current.show(true);
    };

    const handleSubmit = (data) => {
        toast.promise(newIssue({
            actual: data.occurrence,
            expected: data.expectation,
            tried: data.tried,
            headline: data.title,
            machineId: machine.id,
        }), {
            loading: "Creating issue...",
            success: "Issue created",
            error: "Failed to create issue"
        }).then(response => {
            if (data.media) {
                toast.promise(uploadAttachments(response.data.id, data.media), {
                    loading: "Uploading attachments...",
                    success: "Attachments uploaded",
                    error: "Failed to upload attachments"
                }).finally(() => {
                    navigate(`/issue/${response.data.id}`);
                });
            } else {
                navigate(`/issue/${response.data.id}`);
            }
        });
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
            <PopupForm ref={popupForm}
              	title={"Create issue"}
                forms={popupFields}
                onSubmit={handleSubmit}
            />
            <PageFooter />
        </>
    );
};

export default SolvedIssuesPage;
