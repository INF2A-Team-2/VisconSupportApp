import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import LoginPage from "./pages/LoginPage";
import "./index.css";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<LoginPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
