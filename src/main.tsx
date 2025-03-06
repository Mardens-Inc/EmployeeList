import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {HeroUIProvider} from "@heroui/react";

import "./assets/scss/index.scss";
import Home from "./assets/pages/Home.tsx";
import Navigation from "./assets/components/Navigation.tsx";
import {SearchProvider} from "./assets/providers/SearchProvider.tsx";
import UploadOverlay from "./assets/components/UploadOverlay.tsx";
import {ThemeProvider} from "./assets/providers/ThemeProvider.tsx";
import {AuthProvider, useAuth} from "./assets/providers/AuthProvider.tsx";


ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <SearchProvider>
                        <MainContentRenderer/>
                    </SearchProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

export function MainContentRenderer()
{
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    return (
        <HeroUIProvider navigate={navigate}>
            {isLoggedIn && <UploadOverlay/>}
            <Navigation/>
            <Routes>
                <Route>
                    <Route path="/" element={<Home/>}/>
                </Route>
            </Routes>
        </HeroUIProvider>
    );
}
