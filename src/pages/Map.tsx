import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";
import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType, Company} from "../models.ts";
import config from "../../config.json";
import {useCompanies} from "../api/companies.ts";
import {useRef, useState} from "react";

const API_KEY = config.map_api_key;

const Map = () => {
    const user = useAuth([AccountType.HelpDesk, AccountType.Admin]);

    const { companies } = useCompanies();

    const mapContainerRef = useRef<HTMLDivElement>();
    const mapSidebarRef = useRef<HTMLDivElement>();

    const [selectedCompany, setSelectedCompany] = useState<Company>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: API_KEY
    });

    if (loadError) {
        return <>
            <NavigationHeader/>
            <div className={"page-content"}>
                Error loading map
            </div>
        </>;
    }

    if (!isLoaded) {
        return <>
            <NavigationHeader/>
            <div className={"page-content"}>
                Loading...
            </div>
        </>;
    }

    const onMarkerClick = (c: Company) => {
        setSelectedCompany(c);
        toggleSidebar(true);
    };

    const toggleSidebar = (show: boolean) => {
        if (mapContainerRef.current !== undefined && mapSidebarRef.current !== undefined) {
            mapContainerRef.current.style.gridTemplateColumns = show ? "auto 400px" : "auto";
            mapSidebarRef.current.style.display = show ? "block" : "none";
        }
    };

    return <>
        <NavigationHeader/>
        <div className={"map-container"} ref={mapContainerRef}>
            <GoogleMap mapContainerStyle={{width: "100%", height: "calc(100vh - 64px)"}}
                       zoom={10}
                       center={{ lat: 51.922652, lng: 4.478870 }}
            >
                {companies.map(c => <Marker key={c.id}
                                                      position={{lat: c.latitude, lng: c.longitude}}
                                                      onClick={() => onMarkerClick(c)}
                >
                    {c.name}
                </Marker>)}
            </GoogleMap>
            <div className={"map-sidebar"} ref={mapSidebarRef}>
                <button onClick={() => toggleSidebar(false)}><i className="fa-solid fa-x"></i></button>
                <h1>{selectedCompany?.name}</h1>
                <p>Recent issues</p>
                <div className={"map-sidebar-list"}>
                    <div>
                        <p className={"i-title"}>Test Issue</p>
                        <p className={"i-machine"}><i className="fa-solid fa-gears"></i>Test Machine</p>
                        <p className={"i-user"}><i className="fa-solid fa-user"></i>Customer</p>
                    </div>
                </div>
            </div>
        </div>
    </>;
};

export default Map;