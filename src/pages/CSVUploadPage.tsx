import {ChangeEvent, useState} from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth, {SERVER_URL} from "../api/auth.ts";
import {AccountType} from "../models.ts";
import axios from "axios";
import {toast} from "react-hot-toast";

const CSVUploadPage = () => {
    useAuth([AccountType.Admin]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        // You can implement the file upload logic here
        if (selectedFile) {
            console.log(`Uploading file: ${selectedFile.name}`);
            let fd = new FormData();
            fd.append('FormFile', selectedFile);
            axios.post(SERVER_URL + "/api/import", fd,
                {headers: {'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${sessionStorage.getItem("token")}`}})
                .then(res => {
                    if(res.status === 200){toast.success("File uploaded successfully!")
                    }});
            // Add your file upload logic here
        } else {
            console.log('No file selected');
        }
    };

    return (
        <>
            <NavigationHeader/>
            <div className={"page-content"}>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
        </>
    );
};


export default CSVUploadPage;
