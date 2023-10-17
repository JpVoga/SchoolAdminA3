import React, {JSX} from "react";
import {useNavigate} from "react-router";

export function BackButton(): JSX.Element {
    const navigate = useNavigate();
    return (<button className="backButton" onClick={() => navigate(-1)}>Voltar</button>);
}
export default BackButton;