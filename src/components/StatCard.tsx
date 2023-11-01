import {useNavigate} from "react-router-dom";

const StatCard = ({title, description, target, style = null}) => {
    const navigate = useNavigate();

    return (<>
        <div className={"stat-card"} onClick={() => navigate(target)} style={style && style}>
            <h1>{title}</h1>
            <pre>{description}</pre>
        </div>
    </>);
};

export default StatCard;