import NavigationHeader from "../components/NavigationHeader.tsx";
import WideButton from "../components/WideButton.tsx";

const CustomerLanding = () => {
    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome Customer</h1>
            <p>Recent Issues:</p>
            <WideButton title={"Test"} target={"test"}/>
        </div>
    </>);
};

export default CustomerLanding;