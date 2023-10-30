import React, {JSX, useContext} from "react";
import {Grade, IGradeData, filterForPage, globalContext, isError, itemsPerPage} from "../util";
import {useNavigate} from "react-router";
import {BackButton, ConfirmDialog, GradeDataForm, PageNavArea} from "../components";
import "../styles/gradesPage.scss";


export function GradesPage(): JSX.Element {
    const {setPopUpBox, students, tests, grades, setGrades} = useContext(globalContext);
    const testId = parseInt(new URL(document.URL).searchParams.get("test") ?? "0");
    const navigate = useNavigate();

    function handleGradeError(e: unknown): void {
        if (isError(e)) setGrades(e);
        else if (typeof e === "string") setGrades(new Error(e));
        else throw e;
    }

    function onAddGradeButtonClicked(): void {
        setPopUpBox((
            <GradeDataForm
                confirmAction={async ({grade, studentId, testId}) => {
                    if (Array.isArray(grades)) {
                        try {
                            console.log(grade);

                            const gradesWithStudentAndTest = grades.filter(g => ((g.studentId == studentId) && (g.testId == testId)));
                            if (gradesWithStudentAndTest.length > 0) {
                                gradesWithStudentAndTest.forEach(async (target) => {
                                    await fetch(
                                        `/api/update-grade?id=${encodeURIComponent(target.id)}&` +
                                        ((grade == undefined)? "":`grade=${encodeURIComponent(grade!)}&`) +
                                        `studentId=${encodeURIComponent(studentId)}&testId=${encodeURIComponent(testId)}`
                                    );
                                    target.grade = grade;
                                });
                            }
                            else {
                                const gradeData: IGradeData = await (await fetch(
                                    `/api/create-grade?` +
                                    ((grade == undefined)? "":`grade=${encodeURIComponent(grade!)}&`) +
                                    `studentId=${encodeURIComponent(studentId)}&testId=${encodeURIComponent(testId)}`)).json();
                                setGrades(grades.concat([Grade.fromData(gradeData)]));
                            }
                        }
                        catch (e) {handleGradeError(e);}
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
                confirmAction={async ({grade: value, studentId, testId}) => {
                    try {
                        await fetch(
                            `/api/update-grade?id=${encodeURIComponent(grade.id)}&` +
                            ((value == undefined)? "":`grade=${encodeURIComponent(value!)}&`) +
                            `studentId=${encodeURIComponent(studentId)}&testId=${encodeURIComponent(testId)}`
                        );
                        grade.grade = value;
                        grade.studentId = studentId;
                        grade.testId = testId;
                    }
                    catch (e) {handleGradeError(e);}

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
                confirmAction={async () => {
                    if (Array.isArray(grades)) {
                        try {
                            await fetch(`/api/delete-grade?id=${encodeURIComponent(grade.id)}`);
                            setGrades(grades.filter(g => g.id != grade.id));
                        }
                        catch (e) {handleGradeError(e);}
                    }

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