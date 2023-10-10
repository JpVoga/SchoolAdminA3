import React, {FormEvent, JSX, useId, useRef} from "react";
import {IGradeData} from "../util";
import "../styles/gradeDataForm.scss";


export type GradeDataFormProps = {
    confirmAction: (grade: IGradeData) => void,
    cancelAction: () => void,
    confirmActionButtonText: string,
    cancelActionButtonText: string
};


export function GradeDataForm(props: GradeDataFormProps): JSX.Element {
    const gradeInputId = useId();
    const studentSelectId = useId();
    const testSelectId = useId();
    const gradeInputRef = useRef<HTMLInputElement>(null);
    const studentSelectRef = useRef<HTMLSelectElement>(null);
    const testSelectRef = useRef<HTMLSelectElement>(null);

    function onSubmit(e: FormEvent): void {
        e.preventDefault();

        let grade: number | undefined;
        if (isNaN(parseFloat(gradeInputRef?.current?.value ?? ""))) {
            grade = undefined;
        }
        else grade = parseFloat(gradeInputRef?.current?.value ?? "0");

        props.confirmAction({grade, studentId: 0, testId: 0}); // TODO: Put in student and test ids!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        console.log(grade);
    }

    return (
        <form className="gradeDataForm" onSubmit={onSubmit}>
            <div className="gradeDataFormInputsArea">
                <div>
                    <label htmlFor={gradeInputId}>Nota: </label>
                    <input id={gradeInputId} className="dataFormInput" type="number" min={0} max={10} step={0.01} ref={gradeInputRef} />
                </div>

                <div>
                    <label htmlFor={studentSelectId}>Aluno: </label>
                    <select id={studentSelectId} className="dataFormInput" ref={studentSelectRef}>
                        <option value="A">Placeholder</option>
                        <option value="B">Placeholder</option>
                        <option value="C">Placeholder</option>
                    </select>
                </div>

                <div>
                    <label htmlFor={testSelectId}>Avaliação: </label>
                    <select id={testSelectId} className="dataFormInput" ref={testSelectRef}>
                        <option value="A">Placeholder</option>
                        <option value="B">Placeholder</option>
                        <option value="C">Placeholder</option>
                    </select>
                </div>
            </div>

            <div className="gradeDataFormButtonsArea">
                <button className="dataFormButton" type="submit">{props.confirmActionButtonText}</button>
                <button className="dataFormButton" type="button" onClick={props.cancelAction}>{props.cancelActionButtonText}</button>
            </div>
        </form>
    );
}
export default GradeDataForm;