import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";
import NavigationHeader from "../components/NavigationHeader.tsx";
import useAuth from "../api/auth.ts";
import {AccountType} from "../models.ts";
import config from "../../config.json";
import {useCompanies} from "../api/companies.ts";

const API_KEY = config.map_api_key;

const Map = () => {
    const user = useAuth([AccountType.HelpDesk, AccountType.Admin]);

    const { companies } = useCompanies();

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

    return <>
        <NavigationHeader/>
        <GoogleMap mapContainerStyle={{width: "100%", height: "calc(100vh - 64px)"}}
                   zoom={10}
                   center={{ lat: 51.922652, lng: 4.478870 }}
        >
            {companies.map(c => <Marker key={c.id} position={{lat: c.latitude, lng: c.longitude}}>{c.name}</Marker>)}
        </GoogleMap>
    </>;
};

export default Map;