import React, {JSX, useContext, useEffect, useMemo} from "react";
import {Student, filterForPage, getCurrentPageNumber, globalContext, isError, itemsPerPage} from "../util";
import {ConfirmDialog, PageNavArea, StudentDataForm} from "../components";
import "../styles/studentsPage.scss";


export function StudentsPage(): JSX.Element {
    const {students, setStudents, setPopUpBox} = useContext(globalContext);
    const studentCount = useMemo(() => (Array.isArray(students))? students.length:0, [students]);


    function onAddStudentButtonClicked(): void {
        setPopUpBox((
            <StudentDataForm
                confirmActionButtonText="Criar Aluno"
                cancelActionButtonText="Cancelar"
                confirmAction={({firstName, lastName}) => {
                    if (Array.isArray(students)) {
                        setStudents(students.concat([(new Student(0, firstName, lastName))])); // TODO: Change id to pull from DB!!!!!!!!!!
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

            {
                (() => {
                    if (isError(students)) return <span className="errorMessage">{students.message}</span>;
                    else if (students === null) return <span className="loadingMessage">Carregando...</span>;
                    else {
                        const pageStudents: Student[] = filterForPage(students);

                            return (
                                <>
                                    <div id="addStudentArea"><button id="addStudentButton" onClick={onAddStudentButtonClicked}>+ Novo Aluno</button></div>

                                    <PageNavArea pageCount={studentCount / itemsPerPage} />

                                    <ul id="studentsList">{
                                        pageStudents.map(student => (
                                            <li className="studentListItem" key={student.id}>
                                                <span className="studentDetailsText">({student.id}) {student.firstName} {student.lastName}</span>
                                                <button className="editStudentButton" onClick={() => onEditStudentButtonClicked(student)}>Editar Aluno</button>
                                                <button className="excludeStudentButton" onClick={() => onExcludeStudentButtonClicked(student)}>Excluir Aluno</button>
                                            </li>
                                        ))
                                    }</ul>

                                    <PageNavArea pageCount={studentCount / itemsPerPage} />
                                </>
                                
                            );
                    }
                })()
            }
        </>
    );
}
export default StudentsPage;