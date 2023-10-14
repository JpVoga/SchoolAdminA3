import React, {JSX, useContext} from "react";
import {globalContext, isError} from "../util";
import {useNavigate} from "react-router";


export function GradesPage(): JSX.Element {
    const {setPopUpBox, tests, grades, setGrades} = useContext(globalContext);
    const testId = parseInt(new URL(document.URL).searchParams.get("test") ?? "0");
    const navigate = useNavigate();

    if ((isNaN(testId)) || (testId < 1)) {
        navigate("/");
        return (<></>);
    }

    return (
        <>
            <header id="pageHeader"><div>Notas</div></header>

            {
                (() => {
                    if (isError(tests)) return <span className="errorMessage">{tests.message}</span>;
                    if (isError(grades)) return <span className="errorMessage">{grades.message}</span>;
                    if ((!tests) || (!grades)) return <span className="loadingMessage">Carregando...</span>;
                    else {
                        const testsFilteredForTestId = tests.filter(t => t.id === testId);
                        if (testsFilteredForTestId.length < 1) return <span className="errorMessage">Avaliação não encontrada</span>;

                        const test = testsFilteredForTestId[0];
                        const gradesFilteredForTest = grades.filter(g => g.testId = test.id);

                        // TODO: Finish this !!!!!!!!
                    }
                })()
            }
        </>
    );
}
export default GradesPage;