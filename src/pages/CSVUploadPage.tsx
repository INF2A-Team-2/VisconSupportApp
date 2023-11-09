import {useState, ChangeEvent} from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";

const CSVUploadPage = () => {
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
