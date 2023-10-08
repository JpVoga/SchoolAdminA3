import "../styles/homePage.scss";
import React, {JSX} from "react";
import {Link} from "react-router-dom";


export function HomePage(): JSX.Element {
    return (
        <>
            <header id="pageHeader"><div>Bem vindo(a) professor(a)/administrador(a)</div></header>

            <nav id="navigationArea">
                <Link className="navigationAreaButton" to="/students">Alunos</Link>
                <Link className="navigationAreaButton" to="/tests">Avaliações</Link>
                <Link className="navigationAreaButton" to="/grades">Notas</Link>
            </nav>
        </>
    );
}
export default HomePage;