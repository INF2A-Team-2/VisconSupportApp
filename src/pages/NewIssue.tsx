import {useEffect, useRef, useState} from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import InputFile from "../components/InputFile.tsx";
import { useNavigate } from "react-router-dom";

const NewIssue = () => {
    useEffect(() => {
        if (machineId === null) {
            navigate("/solved-issues");
        }
        document.title = "New Issue";
    }, []);

    const navigate = useNavigate();
    const machineId = sessionStorage.getItem("machineId");

    const [department, setDepartment] = useState("");
    const [title, setTitle] = useState("");
    const [occurrence, setOccurence] = useState("");
    const [expectation, setExpectation] = useState("");
    const [tried, setTried] = useState("");

    const [media, setMedia] = useState([]);

    const departments = [
        "Department 1",
        "Department 2",
        "Department 3"
    ];

    const imageInput= useRef(null);

    const onAddImage = () => {
        if (imageInput.current === null) {
            return;
        }

        imageInput.current.click();
    }

    const onSubmit = () => {
        let missingMessage = "";
        if (department == "")
            missingMessage += "Department; "
        if (title == "")
            missingMessage += "Title; "
        if (occurrence == "")
            missingMessage += "What Happened?; "
        if (expectation == "")
            missingMessage += "Expectations; "
        if (tried == "")
            missingMessage += "What did you try?;"


        if (missingMessage != "")  {
            alert("Missing: " + missingMessage);
        } else {
            handleSubmit();
        }
    }

    const handleSubmit = () => {
        alert("Issue has been issued");
        navigate("/");
    }

    const onImageUpload = () => {
        if (imageInput.current === null) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            media.push(reader.result);
            setMedia([...media]);
        }

        Array.from(imageInput.current.files).forEach(f => {
            if (f) {
                reader.readAsDataURL(f as File);
            }
        });
    }

    const deleteMedia = (i) => {
        setMedia(media.filter((_, idx) => idx !== i));
        sessionStorage.removeItem("machineId");
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
                {media.map((f: string, i) => (<InputFile data={f} deleteCallback={() => deleteMedia(i)} key={i}/>))}
                <button onClick={onAddImage}><i className="fa-solid fa-plus fa-2xl"></i></button>
            </div>
            <button onClick={onSubmit}>Submit</button>
        </div>
    </>);
};

export default NewIssue;