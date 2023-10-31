const WideButtonNoTarget = ({ title } : {title: string}) => {
    return (<>
        <div className={"wide-button"}>
            <p>{title}</p>
            <i className="fa-solid fa-angle-right"></i>
        </div>
    </>);
}

export default WideButtonNoTarget