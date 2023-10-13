import {useEffect, useRef, useState} from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import InputFile from "../components/InputFile.tsx";
import axios from "axios";

const NewIssue = () => {
    useEffect(() => {
        document.title = "New Issue";
    }, []);

    const [, setDepartment] = useState("");
    const [, setTitle] = useState("");

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
        axios.post("http://localhost:7183/")
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
    };

    return (<>
        <NavigationHeader/>
        <div className={"page-content new-issue"}>
            <div className={"section"}>
                <Dropdown options={departments} onChange={e => setDepartment(e.value)} placeholder={"Department..."}/>
                <input type={"text"} onChange={e => setTitle(e.target.value)} placeholder={"Title..."}/>
            </div>
            <p>What Happened?</p>
            <textarea rows={10}/>

            <p>Expectations</p>
            <textarea rows={10}/>

            <p>What did you try?</p>
            <textarea rows={10}/>

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