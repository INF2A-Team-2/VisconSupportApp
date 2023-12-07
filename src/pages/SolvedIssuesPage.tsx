import { ReactElement, useRef, useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import {WideButton} from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { Machine, Issue, Field, FieldType } from "../models.ts";
import { useMachines } from "../api/machines.ts";
import 'react-dropdown/style.css';
import '../index.css';
import {newIssue, uploadAttachments, useIssues} from "../api/issues.ts";
import { RenderIssueDetails } from "../components/RenderIssueDetails.tsx";
import PageFooter from "../components/PageFooter.tsx";
import RoadmapPopup from "../components/RoadmapPopup.tsx";
import toast from "react-hot-toast";

const SolvedIssuesPage = () => {
    const navigate = useNavigate();
    const {machines} = useMachines();
    const [machine, setMachine] = useState<Machine>(null);
    const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);
    const popupForm = useRef<RoadmapPopup>();
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

    const {issues} = useIssues({
        machineId: machine?.id
    });

    const issueNotListed = () => {
        if (machine === null) {
            toast.error("Please select a machine");
            return;
        }
        popupForm.current.start();
    };

    const handleIssueClick = (issueId: number) => {
        setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
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
            <button onClick={issueNotListed}>My issues is not listed</button>
        </div>
        <RoadmapPopup ref={popupForm}
            title={"Create issue"}
            forms={popupFields}
            onSubmit={handleSubmit}
        />
        <PageFooter />
    </>);
};

export default SolvedIssuesPage;
