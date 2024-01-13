import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import LandingRouter from './pages/LandingRouter.tsx';
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
import EmployeeUserInformation from "./pages/EmployeeUserInformation.tsx";
import AdminAddMachine from "./pages/AdminAddMachine.tsx";
import AdminLog from "./pages/AdminLog.tsx";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faB }from "@fortawesome/free-solid-svg-icons";
import AdminAddUnit from "./pages/AddUnits.tsx";
import ThemeProvider from './components/ThemeProvider.tsx';
import ViewDocumentation from './pages/ViewDocumentation.tsx';
import AdminCompanyManager from "./pages/AdminCompanyManager.tsx";
import Map from "./pages/Map.tsx";
import UserSettings from './pages/UserSettings.tsx';

library.add(faB);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <ThemeProvider>
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
                    <Route path={"companies"} element={<AdminCompanyManager />} />
                    <Route path={"import"} element={ <CSVUploadPage/>}/>
                    <Route path={"new-machine"} element={<AdminAddMachine />}/>
                    <Route path={"units"} element={<AdminAddUnit />}/>
                    <Route path={"logs"} element={<AdminLog/>}/>

                </Route>
                <Route path="/employee">
                    <Route path={"users"} element={<EmployeeUserList />}/>
                    <Route path="users/:userId" element={<EmployeeUserInformation />} />
                </Route>
                <Route path="/">
                    <Route path={"login"} element={<LoginPage />}/>
                    <Route path={"logout"} element={<LogoutPage />}/>
                    <Route path={"404"} element={<ErrPage404 />}/>
                    <Route path={"solved-issues"} element={<SolvedIssuesPage />}/>
                    <Route path={"403"} element={<ErrPage403 />}/>
                    <Route path={"issue/:issueId"} element={<IssuePage />}/>
                    <Route path={"my-issues"} element={<MyIssuesPage />}/>
                    <Route path={"documentation/:documentationId"} element={<ViewDocumentation />}/>
                    <Route path={"map"} element={<Map />} />
                    <Route path={"UserSettings"} element={<UserSettings />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
);