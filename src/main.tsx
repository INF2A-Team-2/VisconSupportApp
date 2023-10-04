import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import LandingRouter from './pages/LandingRouter.tsx';
import NewIssue from "./pages/NewIssue.tsx";
import LoginPage from "./pages/LoginPage.tsx";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<LandingRouter />} />
                <Route path={"new-issue"} element={<NewIssue />}/>
                <Route path={"login"} element={<LoginPage />}/>
            </Route>
        </Routes>
    </BrowserRouter>
);