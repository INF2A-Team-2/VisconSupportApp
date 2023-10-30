export const WideButton = ({ title, target } : {title: string, target: string}) => {
    return (<>
        <a className={"wide-button"} href={target}>
            <p>{title}</p>
            <i className="fa-solid fa-angle-right"></i>
        </a>
    </>);
};

