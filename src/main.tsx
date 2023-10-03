import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import LandingRouter from './pages/LandingRouter.tsx';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<LandingRouter />} />
            </Route>
        </Routes>
    </BrowserRouter>
);