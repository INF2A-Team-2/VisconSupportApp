import CustomerLanding from "./CustomerLanding.tsx";
import EmployeeLanding from "./EmployeeLanding.tsx";
import AdminLanding from "./AdminLanding.tsx";

const LandingRouter = () => {
    // fetch user
    // if not logged in reroute to log in
    // otherwise show correct page based on user type

    let ut = "customer";

    switch (ut) {
        case "customer":
            return (<CustomerLanding />);
        case "employee":
            return (<EmployeeLanding />);
        case "admin":
            return (<AdminLanding />);
    }
};

export default LandingRouter;