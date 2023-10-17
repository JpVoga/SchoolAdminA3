import React, {JSX, useContext, useMemo} from "react";
import {Test, filterForPage, globalContext, isError, itemsPerPage} from "../util";
import {BackButton, ConfirmDialog, PageNavArea, TestDataForm} from "../components";
import "../styles/testsPage.scss";


export function TestsPage(): JSX.Element {
    const {tests, setTests, setPopUpBox} = useContext(globalContext);
    const testCount = useMemo(() => Array.isArray(tests)? tests.length:0, [tests]);

    function onAddTestButtonClicked(): void {
        setPopUpBox((
            <TestDataForm
                confirmActionButtonText="Criar Avaliação"
                cancelActionButtonText="Cancelar"
                confirmAction={({name}) => {
                    if (Array.isArray(tests)) setTests(tests.concat([new Test(0, name)])); // TODO: Change ID to pull from database!!!!!
                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
            />
        ));
    }

    function onEditTestButtonClicked(test: Test): void {
        setPopUpBox((
            <TestDataForm
                confirmActionButtonText="Salvar Alterações"
                cancelActionButtonText="Cancelar"
                confirmAction={({name}) => {
                    test.name = name;
                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
            />
        ));
    }

    function onExcludeTestButtonClicked(test: Test): void {
        setPopUpBox((
            <ConfirmDialog
                mainText={`Tem certeza que deseja descartar a avaliação ${test.name}?`}
                confirmAction={() => {
                    if (Array.isArray(tests)) setTests(tests.filter(t => t.id != test.id));
                    setPopUpBox(null);
                }}
                cancelAction={() => setPopUpBox(null)}
            />
        ));
    }

    return (
        <>
            <header id="pageHeader"><div>Avaliações: </div></header>

            {
                (() => {
                    if (isError(tests)) return <span className="errorMessage">{tests.message}</span>;
                    else if (tests === null) return <span className="loadingMessage">Carregando...</span>;
                    else {
                        const pageTests = filterForPage(tests);

                        return (
                            <>
                                <div id="backArea"><BackButton /></div>

                                <div id="addDataArea"><button id="addDataButton" onClick={onAddTestButtonClicked}>+ Nova Avaliação</button></div>

                                <PageNavArea pageCount={testCount / itemsPerPage} />

                                <ul className="dataList">{
                                    pageTests.map(test => (
                                        <li key={test.id}>
                                            <span className="detailsText">({test.id}) {test.name}</span>
                                            <button className="editDataButton" onClick={() => onEditTestButtonClicked(test)}>Editar Avaliação</button>
                                            <button className="excludeDataButton" onClick={() => onExcludeTestButtonClicked(test)}>Excluir Avaliação</button>
                                            <a className="editTestGradesLink" href={`/grades?page=1&test=${encodeURIComponent(test.id)}`}>Notas</a>
                                        </li>
                                    ))
                                }</ul>

                                <PageNavArea pageCount={testCount / itemsPerPage} />
                            </>
                        );
                    }
                })()
            }
        </>
    );
}
export default TestsPage;