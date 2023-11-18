import { useParams } from "react-router-dom";
import { useUserMachines } from "../api/machines.ts";
import { useUser } from "../api/users.ts"; // Import useUser hook
import NavigationHeader from "../components/NavigationHeader.tsx";

const EmployeeUserInformation = () => {
    const { userId } = useParams();
    const { machines } = useUserMachines({ userId: parseInt(userId, 10) });
    const { user } = useUser({ userId: parseInt(userId, 10) });

    return (
        <>
            <NavigationHeader />
            <div className={"page-content"}>
                <h1>User Information</h1>
                {user && (
                    <div>
                        <h2>{user.username}</h2>
                        <p>ID: {user.id}</p>
                        <p>Phone Number: {user.phoneNumber}</p>
                        <p>Unit: {user.unit}</p>
                        <p>Type: {user.type}</p>
                    </div>
                )}
                <h2>User's Machines</h2>
                <ul>
                    {machines.map(machine => (
                        <li key={machine.id}>{machine.name}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default EmployeeUserInformation;
