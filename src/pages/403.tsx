import NavigationHeader from "../components/NavigationHeader.tsx";
import PageFooter from "../components/PageFooter.tsx";

const ErrPage403 = () => {
    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Verboden toegang la</h1>
        </div>
        <PageFooter />
    </>;
};

export default ErrPage403;