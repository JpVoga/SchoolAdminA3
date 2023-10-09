import React, {JSX, StrictMode, useState, ReactNode, useEffect} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {HomePage, StudentsPage, TestsPage, GradesPage} from "./pages";
import {globalContext} from "./util";
import {StudentDataForm} from "./components";


// The root component of the front-end application
function App(): JSX.Element {
    const [popUpBox, setPopUpBox] = useState<ReactNode>(null);

    useEffect(() => {
        setPopUpBox(
            <StudentDataForm
                confirmAction={s => console.log(`Confirmed student ${s.firstName} ${s.lastName}`)}
                cancelAction={() => console.log("Canceled student")}
                confirmActionButtonText="Salvar Aluno"
                cancelActionButtonText="Cancelar"
            />
        );
    }, []);

    return (
        <globalContext.Provider value={{popUpBox, setPopUpBox}}>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="students" element={<StudentsPage />} />
                    <Route path="tests" element={<TestsPage />} />
                    <Route path="grades" element={<GradesPage />} />
                </Routes>
            </BrowserRouter>

            <div id="popUpContainer" style={{display: (popUpBox != null)? undefined:"none"}}> {/* Only display if pop up box is not null */}
                <div id="popUpBox">
                    {popUpBox}
                </div>
            </div>
        </globalContext.Provider>
    );
}


const root = createRoot((document.getElementById("root"))!);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);