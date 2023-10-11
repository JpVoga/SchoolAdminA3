import React, {JSX, StrictMode, useState, ReactNode, useEffect} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {HomePage, StudentsPage, TestsPage, GradesPage} from "./pages";
import {IStudentData, Student, globalContext} from "./util";


// The root component of the front-end application
function App(): JSX.Element {
    const [popUpBox, setPopUpBox] = useState<ReactNode>(null);
    const [students, setStudents] = useState<Student[] | Error | null>(null);

    useEffect(() => {
        const studentUrl = "/json/sampleStudents.json"; // TODO: Change this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const possibleError = new Error("Erro ao conectar-se com o banco de dados");

        fetch(studentUrl)
            .then(response => {
                response.json()
                    .then(data => {
                        const array: Student[] = [];
                        for (const i of data) {
                            array.push(Student.fromData(i));
                        }
                        setStudents(array);
                    })
                    .catch(() => setStudents(possibleError));
            })
            .catch(() => setStudents(possibleError));
    }, []);


    return (
        <globalContext.Provider value={{popUpBox, setPopUpBox, students, setStudents}}>
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