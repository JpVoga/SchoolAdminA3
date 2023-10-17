import React, {JSX, useContext} from "react";
import {Grade, filterForPage, globalContext, isError, itemsPerPage} from "../util";
import {useNavigate} from "react-router";
import {BackButton, ConfirmDialog, GradeDataForm, PageNavArea} from "../components";
import "../styles/gradesPage.scss";


export function GradesPage(): JSX.Element {
    const {setPopUpBox, students, tests, grades, setGrades} = useContext(globalContext);
    const testId = parseInt(new URL(document.URL).searchParams.get("test") ?? "0");
    const navigate = useNavigate();

    function onAddGradeButtonClicked(): void {
        setPopUpBox((
            <GradeDataForm
                confirmAction={({grade, studentId, testId}) => {
                    if (Array.isArray(grades)) {
                        const gradesWithStudentAndTest = grades.filter(g => ((g.studentId == studentId) && (g.testId == testId)));
                        if (gradesWithStudentAndTest.length > 0) {
                            gradesWithStudentAndTest.forEach(target => {target.grade = grade;});
                        }
                        else {
                            grades.push(new Grade(0, grade, studentId, testId)); // TODO: Pull ID from DB!!!!!!!!!!!
                        }
                    }

                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
                confirmActionButtonText="Lançar Nota"
                cancelActionButtonText="Cancelar"
                testId={testId}
            />
        ));
    }

    function onEditGradeButtonClicked(grade: Grade): void {
        setPopUpBox((
            <GradeDataForm
                confirmAction={({grade: value, studentId, testId}) => {
                    grade.grade = value;
                    grade.studentId = studentId;
                    grade.testId = testId;
                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
                confirmActionButtonText="Salvar Nota"
                cancelActionButtonText="Cancelar"
                gradeInitialValue={grade.grade}
                studentIdFixedValue={grade.studentId}
                testId={testId}
            />
        ));
    }

    function onExcludeGradeButtonClicked(grade: Grade): void {
        setPopUpBox(
            <ConfirmDialog
                mainText="Deseja excluir essa nota?"
                confirmAction={() => {
                    if (Array.isArray(grades)) setGrades(grades.filter(g => g.id != grade.id));
                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
            />
        );
    }

    if ((isNaN(testId)) || (testId < 1)) {
        navigate("/");
        return (<></>);
    }

    if (isError(students)) return <span className="errorMessage">{students.message}</span>;
    if (isError(tests)) return <span className="errorMessage">{tests.message}</span>;
    if (isError(grades)) return <span className="errorMessage">{grades.message}</span>;
    if ((!students) || (!tests) || (!grades)) return <span className="loadingMessage">Carregando...</span>;
    else {
        const testsFilteredForTestId = tests.filter(t => t.id === testId);
        if (testsFilteredForTestId.length < 1) return <span className="errorMessage">Avaliação não encontrada</span>;

        const test = testsFilteredForTestId[0];
        const gradesFilteredForTest = grades.filter(g => g.testId === test.id);
        const pageGrades = filterForPage(gradesFilteredForTest);

        return (
            <>
                <header id="pageHeader"><div>Notas da avaliação "{test.name}":</div></header>

                <div id="backArea"><BackButton /></div>

                <div id="addDataArea"><button id="addDataButton" onClick={onAddGradeButtonClicked}>+ Nova Nota</button></div>

                <PageNavArea pageCount={pageGrades.length / itemsPerPage} />

                <ul className="dataList">{
                    pageGrades.map(grade => {
                        const studentsFilteredForStudentId = students.filter(s => s.id === grade.studentId);
                        if (studentsFilteredForStudentId.length < 1) return (<></>);

                        const student = studentsFilteredForStudentId[0];

                        return (
                            <li key={grade.id}>
                                <div className="detailsText">
                                    ID do Aluno: {student.id}<br />
                                    Nome: {student.firstName} {student.lastName}<br />
                                    Nota: {grade.grade ?? "Não Definida"}
                                </div>

                                <button className="editDataButton" onClick={() => onEditGradeButtonClicked(grade)}>Editar Nota</button>

                                <button className="excludeDataButton" onClick={() => onExcludeGradeButtonClicked(grade)}>Excluir Nota</button>
                            </li>
                        );
                    })
                }</ul>

                <PageNavArea pageCount={pageGrades.length / itemsPerPage} />
            </>
        );
    }
}
export default GradesPage;