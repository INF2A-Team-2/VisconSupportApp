const InputFile = ({data, mimeType, deleteCallback}) => {
    return (<>
        <div className={"input-file"}>
            {mimeType.split("/")[0] === "image"
            ? <img src={data}></img>
            : <video controls={true}>
                <source src={data}/>
            </video>}
            <button onClick={deleteCallback}><i className="fa-solid fa-x"></i></button>
        </div>
    </>);
};

export default InputFile;