import React, { useState, useEffect } from "react";
import { Issue } from "../models.ts";
import { useNavigate } from "react-router-dom";

export const RenderIssueDetails = ({ issue, isExpanded }: { issue: Issue; isExpanded: boolean }) => {
    const navigate = useNavigate();
    const [maxTextLength, setMaxTextLength] = useState(100); // Default text length

    const navigateToIssue = (issueId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/issue/${issueId}`);
    };

    const detailClass = isExpanded ? "issue-details expanded" : "issue-details hidden";

    // Function to shorten text and append ellipsis
    const shortenText = (text: string) => {
        return text.length > maxTextLength ? text.substring(0, maxTextLength) + "..." : text;
    };

    // Function to calculate and set maximum text length based on window width
    const updateTextLength = () => {
        setMaxTextLength(window.innerWidth / 20)
    };

    useEffect(() => {
        window.addEventListener('resize', updateTextLength);
        updateTextLength();
        return () => {
            window.removeEventListener('resize', updateTextLength);
        };
    }, []);

    return (
        <div className={detailClass}>
            <p>What did happen: {shortenText(issue.actual)}</p>
            <p>Expectation: {shortenText(issue.expected)}</p>
            <p>What was tried: {shortenText(issue.tried)}</p>
            <button onClick={(e) => navigateToIssue(issue.id, e)}>View Entire Issue</button>
        </div>
    );
};
