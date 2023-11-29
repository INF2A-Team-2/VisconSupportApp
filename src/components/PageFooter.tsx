const PageFooter = () => {
    return (<>
        <div className={"page-footer"}>
            <p className={"page-footer-app"}>{__APP_NAME__} <span style={{fontSize: "0.75rem"}}>v</span>{__APP_VERSION__}</p>
            <a href={"https://github.com/INF2A-Team-2"}>Copyright © 2023 INF1A Team 2</a>
            <div className={"page-footer-divider-v"}></div>
            <div className={"page-footer-section"}>
                <a href={"https://github.com/INF2A-Team-2/VisconSupportApp"}><i className="fa-brands fa-github"></i>VisconSupportApp</a>
                <div className={"page-footer-divider-h"}></div>
                <a href={"https://github.com/INF2A-Team-2/VisconSupportAPI"}><i className="fa-brands fa-github"></i>VisconSupportAPI</a>
                <div className={"page-footer-divider-h"}></div>
                <a href={"https://github.com/INF2A-Team-2/TCPFileServer"}><i className="fa-brands fa-github"></i>TCPFileServer</a>
            </div>
        </div>
    </>);
};

export default PageFooter;