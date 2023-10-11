import React, {JSX, useContext, useEffect} from "react";
import {Student, getCurrentPageNumber, globalContext, isError} from "../util";
import {ConfirmDialog, PageNavArea, StudentDataForm} from "../components";
import "../styles/studentsPage.scss";


export function StudentsPage(): JSX.Element {
    const {students, setStudents, setPopUpBox} = useContext(globalContext);
    const studentsPerPage = 10;


    function onAddStudentButtonClicked(): void {
        setPopUpBox((
            <StudentDataForm
                confirmActionButtonText="Criar Aluno"
                cancelActionButtonText="Cancelar"
                confirmAction={({firstName, lastName}) => {
                    if (Array.isArray(students)) {
                        students.push(new Student(0, firstName, lastName)); // TODO: Change id to pull from DB!!!!!!!!!!
                    }

                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
            />
        ));
    }

    function onEditStudentButtonClicked(student: Student): void {
        setPopUpBox((
            <StudentDataForm
                confirmActionButtonText="Salvar Alterações"
                cancelActionButtonText="Cancelar"
                confirmAction={({firstName, lastName}) => {
                    student.firstName = firstName;
                    student.lastName = lastName;
                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
            />
        ));
    }

    function onExcludeStudentButtonClicked(student: Student): void {
        setPopUpBox((
            <ConfirmDialog
                mainText={`Tem certeza que deseja excluir ${student.firstName} ${student.lastName}?`}
                confirmAction={() => {
                    if (Array.isArray(students)) setStudents(students.filter(s => s.id != student.id));
                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
            />
        ));
    }


    return (
        <>
            <header id="pageHeader"><div>Alunos:</div></header>

            <div id="addStudentArea"><button id="addStudentButton" onClick={onAddStudentButtonClicked}>+ Novo Aluno</button></div>

            {(Array.isArray(students)) && (<PageNavArea pageCount={students.length / studentsPerPage} />)}

            {
                (() => {
                    if (isError(students)) return <span className="errorMessage">{students.message}</span>;
                    else if (students === null) return <span className="loadingMessage">Carregando...</span>;
                    else {
                        const pageStudents: Student[] =
                            students.filter((value, index) => ((index >= ((getCurrentPageNumber() - 1) * studentsPerPage)) && (index < (getCurrentPageNumber() * studentsPerPage))));

                            return (
                                <ul id="studentsList">{
                                    pageStudents.map(student => (
                                        <li className="studentListItem" key={student.id}>
                                            <span className="studentDetailsText">({student.id}) {student.firstName} {student.lastName}</span>
                                            <button className="editStudentButton" onClick={() => onEditStudentButtonClicked(student)}>Editar Aluno</button>
                                            <button className="excludeStudentButton" onClick={() => onExcludeStudentButtonClicked(student)}>Excluir Aluno</button>
                                        </li>
                                    ))
                                }</ul>
                            );
                    }
                })()
            }

            {(Array.isArray(students)) && (<PageNavArea pageCount={students.length / studentsPerPage} />)}
        </>
    );
}
export default StudentsPage;