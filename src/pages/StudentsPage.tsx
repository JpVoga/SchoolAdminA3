import React, {JSX, useContext, useEffect, useMemo} from "react";
import {IStudentData, Student, filterForPage, getCurrentPageNumber, globalContext, isError, isNameValid, itemsPerPage} from "../util";
import {BackButton, ConfirmDialog, PageNavArea, StudentDataForm} from "../components";
import "../styles/index.scss";


export function StudentsPage(): JSX.Element {
    const {students, setStudents, setPopUpBox} = useContext(globalContext);
    const studentCount = useMemo(() => (Array.isArray(students))? students.length:0, [students]);


    function handleStudentError(e: unknown): void {
        if (isError(e)) setStudents(e);
        else if (typeof e === "string") setStudents(new Error(e));
        else throw e;
    }

    function onAddStudentButtonClicked(): void {
        setPopUpBox((
            <StudentDataForm
                confirmActionButtonText="Criar Aluno"
                cancelActionButtonText="Cancelar"
                confirmAction={async ({firstName, lastName}) => {
                    if (Array.isArray(students)) {
                        try {
                            const studentData: IStudentData =
                                (await (await fetch(`/api/create-student?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`)).json());
                            setStudents(students.concat([Student.fromData(studentData)]));
                        }
                        catch (e) {handleStudentError(e);}
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
                confirmAction={async ({firstName, lastName}) => {
                    try {
                        await fetch(`/api/update-student?id=${encodeURIComponent(student.id)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`);
                        student.firstName = firstName;
                        student.lastName = lastName;
                    }
                    catch (e) {handleStudentError(e);}

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
                confirmAction={async () => {
                    try {
                        await fetch("/api/delete-student?id=" + encodeURIComponent(student.id));
                        if (Array.isArray(students)) setStudents(students.filter(s => s.id != student.id));
                    }
                    catch (e) {handleStudentError(e);}
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
                                    <div id="backArea"><BackButton /></div>

                                    <div id="addDataArea"><button id="addDataButton" onClick={onAddStudentButtonClicked}>+ Novo Aluno</button></div>

                                    <PageNavArea pageCount={studentCount / itemsPerPage} />

                                    <ul className="dataList">{
                                        pageStudents.map(student => (
                                            <li key={student.id}>
                                                <span className="detailsText">({student.id}) {student.firstName} {student.lastName}</span>
                                                <button className="editDataButton" onClick={() => onEditStudentButtonClicked(student)}>Editar Aluno</button>
                                                <button className="excludeDataButton" onClick={() => onExcludeStudentButtonClicked(student)}>Excluir Aluno</button>
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