const InputFile = ({data, deleteCallback}) => {
    return (<>
        <div className={"input-file"}>
            <img src={data}/>
            <button onClick={deleteCallback}><i className="fa-solid fa-x"></i></button>
        </div>
    </>);
}

export default InputFile;