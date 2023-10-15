import React, {FormEvent, JSX, useCallback, useId, useMemo, useRef, useState} from "react";
import {IStudentData, isNameValid} from "../util";
import "../styles/studentDataForm.scss";

export type StudentDataFormProps = {
    confirmAction: (studentData: IStudentData) => void,
    cancelAction: () => void,
    confirmActionButtonText: string,
    cancelActionButtonText: string
};

export function StudentDataForm(props: StudentDataFormProps): JSX.Element {
    const studentFirstNameInputId = useId();
    const studentLastNameInputId = useId();
    const studentFirstNameInputRef = useRef<HTMLInputElement>(null);
    const studentLastNameInputRef = useRef<HTMLInputElement>(null);
    const [isDataValid, setIsDataValid] = useState(false);

    function onSubmit(e: FormEvent): void{
        e.preventDefault();
        props.confirmAction({firstName: studentFirstNameInputRef?.current?.value ?? "", lastName: studentLastNameInputRef?.current?.value ?? ""});
    }

    function updateIsDataValid(): void {
        setIsDataValid((isNameValid(studentFirstNameInputRef?.current?.value ?? "")) && (isNameValid(studentLastNameInputRef?.current?.value ?? "")));
    }

    return (
        <form className="studentDataForm" onSubmit={onSubmit}>
            <div className="studentDataFormInputsArea">
                <div>
                    <label htmlFor={studentFirstNameInputId}>Nome: </label>
                    <input className="dataFormInput" id={studentFirstNameInputId} type="text" ref={studentFirstNameInputRef} onChange={updateIsDataValid} />
                </div>

                <div>
                    <label htmlFor={studentLastNameInputId}>Sobrenome: </label>
                    <input className="dataFormInput" id={studentLastNameInputId} type="text" ref={studentLastNameInputRef} onChange={updateIsDataValid}/>
                </div>
            </div>

            <div className="studentDataFormButtonsArea">
                <button className="dataFormButton" type="submit" disabled={!isDataValid}>
                    {props.confirmActionButtonText}
                </button>
                <button className="dataFormButton" type="button" onClick={props.cancelAction}>{props.cancelActionButtonText}</button>
            </div>
        </form>
    );
}
export default StudentDataForm;