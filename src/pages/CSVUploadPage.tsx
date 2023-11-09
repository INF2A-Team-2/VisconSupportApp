import {ChangeEvent, useState} from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";

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
