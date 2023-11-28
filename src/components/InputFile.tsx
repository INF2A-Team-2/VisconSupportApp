const InputFile = ({data, mimeType, fileName, deleteCallback}) => {
    const getFileComponent = () => {
        switch (mimeType.split("/")[0]) {
            case "image":
                return <img src={data}></img>;
            case "video":
                return <video controls={true}>
                    <source src={data}/>
                </video>;
            case "application":
                switch (mimeType.split("/")[1]) {
                    case "pdf":
                        return <p>{fileName}</p>;
                }
        }
    };

    return (<>
        <div className={"input-file"}>
            {getFileComponent()}
            <button onClick={deleteCallback}><i className="fa-solid fa-x"></i></button>
        </div>
    </>);
};

export default InputFile;