import NavigationHeader from "../components/NavigationHeader.tsx";
import PageFooter from "../components/PageFooter.tsx";

const ErrPage404 = () => {
    return <>
        <NavigationHeader/>
        <div className={"page-content"}>
            <h1>Iesh probleem</h1>
        </div>
        <PageFooter />
    </>;
};

export default ErrPage404;