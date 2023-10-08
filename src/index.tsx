import React, {JSX, StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import {HomePage, StudentsPage, TestsPage, GradesPage} from "./pages";


// The root component of the front-end application
function App(): JSX.Element {
    return (
        <>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="students" element={<StudentsPage />} />
                    <Route path="tests" element={<TestsPage />} />
                    <Route path="grades" element={<GradesPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}


const root = createRoot((document.getElementById("root"))!);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);