import React, {FormEvent, JSX, useId, useRef} from "react";
import {IStudentData} from "../util";
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

    function onSubmit(e: FormEvent): void{
        e.preventDefault();
        props.confirmAction({firstName: studentFirstNameInputRef?.current?.value ?? "", lastName: studentLastNameInputRef?.current?.value ?? ""});
    }

    return (
        <form className="studentDataForm" onSubmit={onSubmit}>
            <div className="studentDataFormInputsArea">
                <div>
                    <label htmlFor={studentFirstNameInputId}>Nome: </label>
                    <input id={studentFirstNameInputId} type="text" ref={studentFirstNameInputRef} />
                </div>

                <div>
                    <label htmlFor={studentLastNameInputId}>Sobrenome: </label>
                    <input id={studentLastNameInputId} type="text" ref={studentLastNameInputRef} />
                </div>
            </div>

            <div className="studentDataFormButtonsArea">
                <button type="submit">{props.confirmActionButtonText}</button>
                <button type="button" onClick={props.cancelAction}>{props.cancelActionButtonText}</button>
            </div>
        </form>
    );
}
export default StudentDataForm;