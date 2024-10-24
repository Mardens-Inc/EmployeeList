import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {NextUIProvider} from "@nextui-org/react";

import "./assets/scss/index.scss";
import Home from "./assets/pages/Home.tsx";
import Navigation from "./assets/components/Navigation.tsx";
import {applyTheme} from "./assets/ts/Theme.ts";
import {SearchProvider} from "./assets/providers/SearchProvider.tsx";
import UploadOverlay from "./assets/components/UploadOverlay.tsx";


ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <SearchProvider>
                <MainContentRenderer/>
            </SearchProvider>
        </BrowserRouter>
    </React.StrictMode>
);

export function MainContentRenderer()
{
    applyTheme();
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("isAdmin") !== null;
    return (
        <NextUIProvider navigate={navigate}>
            {isAdmin && <UploadOverlay/>}
            <Navigation/>
            <Routes>
                <Route>
                    <Route path="/" element={<Home/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}
