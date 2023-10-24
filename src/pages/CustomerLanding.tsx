import NavigationHeader from "../components/NavigationHeader.tsx";
import WideButton from "../components/WideButton.tsx";

const CustomerLanding = () => {
    return (<>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Welcome Customer</h1>
            <p>Recent Issues:</p>
            <WideButton title={"Issue 1"} target={"issue/1"}/>
            <WideButton title={"Issue 2"} target={"issue/2"}/>
        </div>
    </>);
};

export default CustomerLanding;
