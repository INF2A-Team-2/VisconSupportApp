import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import LandingRouter from './pages/LandingRouter.tsx';
import NewIssue from "./pages/NewIssue.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ErrPage from "./pages/404.tsx";
import React from "react";
import LogoutPage from "./pages/LogoutPage.tsx";
import SolvedIssuesPage from "./pages/SolvedIssuesPage.tsx";

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
                <Route path={"logout"} element={<LogoutPage />}/>
                <Route path={"404"} element={<ErrPage />}/>
                <Route path={"solved-issues"} element={<SolvedIssuesPage />}/>
            </Route>
        </Routes>
    </BrowserRouter>
);
