export const WideButton = ({ title, target } : {title: string, target: string}) => {
    return (<>
        <a className={"wide-button"} href={target}>
            <p>{title}</p>
            <i className="fa-solid fa-angle-right"></i>
        </a>
    </>);
};

export const WideButtonNoTarget = ({ title } : {title: string}) => {
    return (<>
        <div className={"wide-button"}>
            <p>{title}</p>
            <i className="fa-solid fa-angle-right"></i>
        </div>
    </>);
}