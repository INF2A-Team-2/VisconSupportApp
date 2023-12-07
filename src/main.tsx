import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import LandingRouter from './pages/LandingRouter.tsx';
import NewIssue from "./pages/NewIssue.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ErrPage404 from "./pages/404.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";
import SolvedIssuesPage from "./pages/SolvedIssuesPage.tsx";
import AdminUserManager from "./pages/AdminUserManager.tsx";
import ErrPage403 from "./pages/403.tsx";
import AdminUserEditor from "./pages/AdminUserEditor.tsx";
import {Toaster} from "react-hot-toast";
import AdminIssueManager from "./pages/AdminIssueManager.tsx";
import IssuePage from "./pages/IssuePage.tsx";
import MyIssuesPage from "./pages/MyIssues.tsx";
import CSVUploadPage from "./pages/CSVUploadPage.tsx";
import EmployeeUserList from "./pages/EmployeeUserList.tsx";
import UserMachinesPage from "./pages/EmployeeUserInformation.tsx";
import EmployeeUserInformation from "./pages/EmployeeUserInformation.tsx";
import AdminAddMachine from "./pages/AdminAddMachine.tsx";
import UserEditPage from "./pages/UserEditorPage.tsx";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Toaster position={"bottom-left"} toastOptions={{
            style: {
                fontSize: "0.75rem"
            }
        }}/>
        <Routes>
            <Route index element={<LandingRouter />} />
            <Route path={"*"} element={<ErrPage404 />}/>
            <Route path="/admin">
                <Route path={"users"} element={<AdminUserManager />} />
                <Route path={"users/edit/:userId"} element={<AdminUserEditor />}/>
                <Route path={"issues"} element={<AdminIssueManager />}/>
                <Route path={"import"} element={ <CSVUploadPage/>}/>
                <Route path={"new-machine"} element={<AdminAddMachine />}/>
            </Route>
            <Route path="/employee">
                <Route path={"users"} element={<EmployeeUserList />}/>
                <Route path="users/:userId" element={<EmployeeUserInformation />} />
            </Route>
            <Route path="/">
                <Route path={"new-issue"} element={<NewIssue />}/>
                <Route path={"login"} element={<LoginPage />}/>
                <Route path={"logout"} element={<LogoutPage />}/>
                <Route path={"404"} element={<ErrPage404 />}/>
                <Route path={"solved-issues"} element={<SolvedIssuesPage />}/>
                <Route path={"403"} element={<ErrPage403 />}/>
                <Route path={"issue/:issueId"} element={<IssuePage />}/>
                <Route path={"my-issues"} element={<MyIssuesPage />}/>
                <Route path={"account"} element={<UserEditPage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);