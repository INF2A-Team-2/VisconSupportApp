import {useEffect, useRef, useState} from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import 'react-dropdown/style.css';
import InputFile from "../components/InputFile.tsx";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import {newIssue, uploadAttachments} from "../api/issues.ts";
import {Media} from "../models.ts";

const NewIssue = () => {
    const navigate = useNavigate();

    const machineId = parseInt(sessionStorage.getItem("machineId"));

    useEffect(() => {
        if (machineId === null || isNaN(machineId)) {
            navigate("/solved-issues");
        }
        document.title = "New Issue";
    }, [machineId, navigate]);

    const [title, setTitle] = useState("");
    const [occurrence, setOccurence] = useState("");
    const [expectation, setExpectation] = useState("");
    const [tried, setTried] = useState("");

    const [media, setMedia] = useState<Array<Media>>([]);

    const imageInput= useRef(null);

    const onAddImage = () => {
        if (imageInput.current === null) {
            return;
        }

        imageInput.current.click();
    };

    const onSubmit = () => {
        let missingMessage = "";
        if (title == "")
            missingMessage += "Title; ";
        if (occurrence == "")
            missingMessage += "What Happened?; ";
        if (expectation == "")
            missingMessage += "Expectations; ";
        if (tried == "")
            missingMessage += "What did you try?;";

        if (missingMessage != "")  {
            toast.error("Missing: " + missingMessage);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        toast.promise(newIssue({
            actual: occurrence,
            expected: expectation,
            tried: tried,
            headline: title,
            machineId: machineId,
        }), {
            loading: "Creating issue...",
            success: "Issue created",
            error: "Failed to create issue"
        }).then(response => {
            toast.promise(uploadAttachments(response.data.id, media), {
                loading: "Uploading attachments...",
                success: "Attachments uploaded",
                error: "Failed to upload attachments"
            }).finally(() => {
                navigate(`/issue/${response.data.id}`);
            });
        });
    };

    const onImageUpload = () => {
        if (imageInput.current === null) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            media[media.length - 1].data = reader.result as ArrayBuffer;
            setMedia([...media]);
        };

        Array.from(imageInput.current.files).forEach((f: File) => {
            if (f) {
                media.push({
                    mimeType: f.type,
                });
                reader.readAsArrayBuffer(f);
            }
        });
    };

    const deleteMedia = (i) => {
        setMedia(media.filter((_, idx) => idx !== i));
    };

    return (<>
        <NavigationHeader/>
        <div className={"page-content new-issue"}>
            <h1>Create Issue</h1>
            <input type={"text"} onChange={e => setTitle(e.target.value)} placeholder={"Title..."}/>
            <div className={"observation-fields"}>
                <p>What Happened?</p>
                <textarea rows={10} placeholder={"..."}
                    onChange={e => setOccurence(e.target.value)}/>

                <p>Expectations</p>
                <textarea rows={10} placeholder={"..."}
                    onChange={e => setExpectation(e.target.value)}/>

                <p>What did you try?</p>
                <textarea rows={10} placeholder={"..."}
                    onChange={e => setTried(e.target.value)}/>
            </div>
            <p>Files</p>
            <input type={"file"} accept={".png,.jpeg,.jpg,.mp4"} ref={imageInput} onChange={onImageUpload} style={{ display: "none" }}/>
            <div className={"files-list"}>
                {media.map((f, i) => (<InputFile data={URL.createObjectURL(new Blob([f.data]))} mimeType={f.mimeType} deleteCallback={() => deleteMedia(i)} key={i}/>))}
                <button onClick={onAddImage}><i className="fa-solid fa-plus fa-2xl"></i></button>
            </div>
            <button onClick={onSubmit}>Submit</button>
        </div>
    </>);
};

export default NewIssue;