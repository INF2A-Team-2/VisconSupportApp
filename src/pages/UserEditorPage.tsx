import { useState } from "react";
import NavigationHeader from "../components/NavigationHeader.tsx";
import Dropdown from "react-dropdown";
import { WideButton } from "../components/WideButton.tsx";
import { useNavigate } from "react-router-dom";
import { Machine, Issue } from "../models.ts";
import 'react-dropdown/style.css';
import '../index.css';
import { useMachines } from "../api/machines.ts";
import { useIssues } from "../api/issues.ts";
import { RenderIssueDetails } from "../components/RenderIssueDetails.tsx";

const UserEditPage = () => {

    <NavigationHeader/>
    return <h1>Hello World</h1>
}

export default UserEditPage;