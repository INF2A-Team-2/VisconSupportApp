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

    const shortenText = (text: string) => {
        return text.length > maxTextLength ? text.substring(0, maxTextLength) + "..." : text;
    };

    const updateTextLength = () => {
        setMaxTextLength(window.innerWidth / 18)
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
            <p>What did happen: <span className="small-text">{shortenText(issue.actual)}</span></p>
            <p>Expectation: <span className="small-text">{shortenText(issue.expected)}</span></p>
            <p>What was tried: <span className="small-text">{shortenText(issue.tried)}</span></p>
            <button onClick={(e) => navigateToIssue(issue.id, e)}>View Entire Issue</button>
        </div>
    );
};
