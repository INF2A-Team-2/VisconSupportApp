const InputFile = ({data, mimeType, fileName, deleteCallback}) => {
    const getFileComponent = () => {
        switch (mimeType.split("/")[0]) {
            case "image":
                return <img src={data}></img>;
            case "video":
                return <video controls={true}>
                    <source src={data}/>
                </video>;
            case "audio":
                return <audio controls>
                    <source src={data}/>
                </audio>;
            default:
                return <p>{fileName}</p>;
        }
    };

    return (<>
        <div className={"input-file"}>
            {getFileComponent()}
            <button onClick={deleteCallback}><i className="fa-solid fa-x"></i></button>
        </div>
    </>);
};

export const FilePreview = ({data, mimeType, fileName}) => {
    const getFileComponent = () => {
        switch (mimeType.split("/")[0]) {
            case "image":
                return <img src={data}></img>;
            case "video":
                return <video controls={true}>
                    <source src={data}/>
                </video>;
            case "audio":
                return <audio controls>
                    <source src={data}/>
                </audio>;
            default:
                return <p>{fileName}</p>;
        }
    };

    return (<>
        <div className={"input-file"}>
            {getFileComponent()}
        </div>
    </>);
};

export default InputFile;