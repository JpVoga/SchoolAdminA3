import React, {JSX, StrictMode, useState, ReactNode, useEffect} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import {HomePage, StudentsPage, TestsPage, GradesPage} from "./pages";
import {Student, Test, Grade, globalContext} from "./util";


// The root component of the front-end application
function App(): JSX.Element {
    const [popUpBox, setPopUpBox] = useState<ReactNode>(null);
    const [students, setStudents] = useState<Student[] | Error | null>(null);
    const [tests, setTests] = useState<Test[] | Error | null>(null);
    const [grades, setGrades] = useState<Grade[] | Error | null>([]); // TODO: Pull grades from DB !!!!!!!!!!!!!!!!!!!

    useEffect(() => {
        const possibleError = new Error("Erro ao conectar-se com o banco de dados");

        // Fetch students
        fetch("/api/get-all-students")
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

        // Fetch tests
        fetch("/api/get-all-tests")
            .then(response => {
                response.json()
                    .then(data => {
                        const array: Test[] = [];
                        for (const i of data) {
                            array.push(Test.fromData(i));
                        }
                        setTests(array);
                    })
                    .catch(() => setTests(possibleError));
            })
            .catch(() => setTests(possibleError));

        // Fetch grades
        fetch("/api/get-all-grades")
            .then(response => {
                response.json()
                    .then(data => {
                        const array: Grade[] = [];
                        for (const i of data) {
                            array.push(Grade.fromData(i));
                        }
                        setGrades(array);
                    })
                    .catch(() => setGrades(possibleError));
            })
            .catch(() => setGrades(possibleError));
    }, []);


    return (
        <globalContext.Provider value={{popUpBox, setPopUpBox, students, setStudents, tests, setTests, grades, setGrades}}>
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