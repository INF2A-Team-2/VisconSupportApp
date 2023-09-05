import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home';
import Test from './pages/Test';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="test" element={<Test />} />
            </Route>
        </Routes>
    </BrowserRouter>
);