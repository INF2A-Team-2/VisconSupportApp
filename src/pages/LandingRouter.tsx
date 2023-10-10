import CustomerLanding from "./CustomerLanding.tsx";
import EmployeeLanding from "./EmployeeLanding.tsx";
import AdminLanding from "./AdminLanding.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";

const LandingRouter = () => {
    const user = useAuth();

    if (user !== null) {
        switch (user.type) {
            case AccountType.User:
                return (<CustomerLanding />);
            case AccountType.HelpDesk:
                return (<EmployeeLanding />);
            case AccountType.Admin:
                return (<AdminLanding />);
        }
    } else {
        return (<p>Loading...</p>);
    }
};

export default LandingRouter;