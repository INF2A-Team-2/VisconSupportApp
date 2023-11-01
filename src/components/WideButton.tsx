export const WideButton = ({ title, target = null } : {title: string, target?: string}) => {
    return (<>
        <a className={"wide-button"} href={target && target}>
            <p>{title}</p>
            <i className="fa-solid fa-angle-right"></i>
        </a>
    </>);
};
