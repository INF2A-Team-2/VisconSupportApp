import {useNavigate} from "react-router-dom";

const StatCard = ({ title, description, target }: { title: string, description: string, target: string }) => {
    const navigate = useNavigate();

    return (<>
        <div className={"stat-card"} onClick={() => navigate(target)}>
            <h1>{title}</h1>
            <pre>{description}</pre>
        </div>
    </>);
};

export default StatCard;